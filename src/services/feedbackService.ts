// Service feedback: mode API (backend terpusat) dengan fallback localStorage.
// Kalau VITE_API_BASE_URL diisi, feedback disimpan/dibaca dari backend sehingga
// semua user bisa saling melihat. Kalau tidak, pakai localStorage seperti biasa.

import { API_BASE, hasApi } from './apiConfig';
import {
  addFeedback as addFeedbackLocal,
  getFeedbacksWithRating as getFeedbacksWithRatingLocal,
  getFeedbackStats as getFeedbackStatsLocal,
  toggleFeedbackLike as toggleFeedbackLikeLocal,
  type Feedback,
} from '../data/services';

type ApiResponse<T> = { ok: boolean; data: T; message?: string };
type ApiErrorBody = { message?: string; error?: string };

export type FeedbackStats = ReturnType<typeof getFeedbackStatsLocal>;
type FeedbackInput = Omit<Feedback, 'id' | 'submittedAt' | 'status'>;

type LikeResult = { id: string; likes: number; liked: boolean };

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...((init?.headers as Record<string, string>) || {}),
    },
  });

  const body = (await res.json().catch(() => null)) as (ApiErrorBody & T) | null;

  if (!res.ok) {
    const message = body?.message || body?.error || `API request failed (${res.status})`;
    throw new Error(message);
  }

  return body as T;
};

// Backend dianggap aktif kalau VITE_API_BASE_URL diset. Tapi kalau server-nya
// mati (mis. belum dijalankan saat development), fetch akan gagal. Supaya fitur
// feedback tetap berfungsi, semua operasi API di-fallback ke localStorage.
const withLocalFallback = async <T>(apiCall: () => Promise<T>, localCall: () => T): Promise<T> => {
  if (!hasApi) return localCall();
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API tidak tersedia, fallback ke penyimpanan lokal:', error);
    return localCall();
  }
};

const parseLikedBy = (raw: unknown): string[] => {
  // Backend mengirim likedBy sebagai array JSON (sudah diparse). Fallback ke
  // JSON.parse menangani bentuk lama yang masih string ("[\"u1\",\"u2\"]").
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === 'string');
  try {
    const parsed = JSON.parse(String(raw ?? '[]'));
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
};

// Konversi record backend → bentuk Feedback frontend.
const toFeedback = (row: Record<string, unknown>): Feedback => {
  const likedBy = parseLikedBy(row.likedBy);

  return {
    id: String(row.id),
    name: String(row.name),
    email: row.email ? String(row.email) : undefined,
    role: row.role ? String(row.role) : 'guest',
    category: (row.category as Feedback['category']) || 'saran',
    subject: String(row.subject || ''),
    message: String(row.message || ''),
    priority: (row.priority as Feedback['priority']) || 'sedang',
    status: (row.status as Feedback['status']) || 'pending',
    submittedAt: (() => {
      const ts = new Date(String(row.submittedAt)).getTime();
      return Number.isFinite(ts) ? ts : Date.now();
    })(),
    adminNotes: row.adminNotes ? String(row.adminNotes) : undefined,
    processedAt: row.processedAt ? new Date(String(row.processedAt)).getTime() : undefined,
    rating: typeof row.rating === 'number' ? row.rating : undefined,
    likes: typeof row.likes === 'number' ? row.likes : 0,
    likedBy,
    avatar: row.avatar ? String(row.avatar) : undefined,
  };
};

export async function fetchFeedbackReviews(): Promise<Feedback[]> {
  return withLocalFallback(
    async () => {
      // Minta halaman terbaru dengan limit tinggi (100) — backend mem-paginate
      // dan mengembalikan meta `pagination`, tapi `data` tetap array sehingga
      // pemakai lama tidak perlu berubah.
      const body = await request<ApiResponse<Array<Record<string, unknown>>>>(
        '/feedback?page=1&limit=100'
      );
      return (body.data || []).map(toFeedback).filter((f) => f.rating && f.rating > 0);
    },
    () => getFeedbacksWithRatingLocal()
  );
}

export async function fetchFeedbackStats(): Promise<FeedbackStats> {
  return withLocalFallback(
    async () => {
      const body = await request<ApiResponse<FeedbackStats>>('/feedback/stats');
      return body.data;
    },
    () => getFeedbackStatsLocal()
  );
}

export async function submitFeedback(input: FeedbackInput): Promise<Feedback> {
  return withLocalFallback(
    async () => {
      const body = await request<ApiResponse<Record<string, unknown>>>('/feedback', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return toFeedback(body.data);
    },
    () => addFeedbackLocal(input)
  );
}

const ANON_LIKE_KEY = 'feedback_anon_liker_id';

let cachedAnonymousLikeId: string | null = null;

// ID stabil per perangkat untuk "suka" dari pengunjung yang belum login.
// Disimpan di localStorage agar klik berikutnya bisa membatalkan suka.
export function getAnonymousLikeId(): string {
  if (cachedAnonymousLikeId) return cachedAnonymousLikeId;
  try {
    const existing = localStorage.getItem(ANON_LIKE_KEY);
    if (existing) {
      cachedAnonymousLikeId = existing;
      return existing;
    }
  } catch {
    // localStorage tidak tersedia — pakai id sementara per sesi.
  }
  const next = `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  cachedAnonymousLikeId = next;
  try {
    localStorage.setItem(ANON_LIKE_KEY, next);
  } catch {
    // abaikan — id tetap berlaku untuk sesi ini.
  }
  return next;
}

export async function toggleFeedbackLikeApi(
  feedbackId: string,
  userId: string
): Promise<LikeResult> {
  if (hasApi) {
    try {
      const body = await request<ApiResponse<LikeResult>>(
        `/feedback/${encodeURIComponent(feedbackId)}/like`,
        {
          method: 'POST',
          body: JSON.stringify({ userId }),
        }
      );
      return body.data;
    } catch (error) {
      // Backend tidak terjangkau. Feedback yang dibaca dari backend TIDAK ada
      // di penyimpanan lokal — jangan menimpa angka like dengan 0 secara
      // diam-diam. Hanya layani dari localStorage kalau feedback-nya memang
      // berasal dari sana; kalau bukan, biarkan error naik agar UI rollback
      // dan memberi tahu user.
      toggleFeedbackLikeLocal(feedbackId, userId);
      const updated = getFeedbacksWithRatingLocal().find((f) => f.id === feedbackId);
      if (updated) {
        return {
          id: feedbackId,
          likes: updated?.likes ?? 0,
          liked: Boolean(updated?.likedBy?.includes(userId)),
        };
      }
      throw error;
    }
  }

  toggleFeedbackLikeLocal(feedbackId, userId);
  const updated = getFeedbacksWithRatingLocal().find((f) => f.id === feedbackId);
  return {
    id: feedbackId,
    likes: updated?.likes || 0,
    liked: Boolean(updated?.likedBy?.includes(userId)),
  };
}
