// Layer autentikasi portal ke backend (/api/auth).
// Dipakai AuthContext saat backend aktif (hasApi). Kalau backend tidak
// tersedia, AuthContext otomatis fallback ke store lokal.
//
// KEAMANAN TOKEN:
// - Ideal (hasApi=true): token disimpan di httpOnly cookie oleh backend
//   (Set-Cookie: accessToken, refreshToken, httpOnly, SameSite=Strict/Lax,
//   Secure di production). Frontend TIDAK menyimpan token di localStorage
//   (rentan XSS) — hanya mengandalkan cookie yang dikirim otomatis via
//   `credentials: 'include'`.
// - Minimal/fallback: bila cookie belum diadopsi penuh, simpan token di
//   memory (variabel modul) — tidak persisten di localStorage, hilang saat
//   reload, sehingga mengurangi risiko pencurian persisten. localStorage
//   hanya dipakai saat hasApi=false (mode demo lokal).
import { API_BASE, hasApi } from './apiConfig';
import type { UserRole } from '../types';

const ACCESS_TOKEN_KEY = 'portal_access_token';
const REFRESH_TOKEN_KEY = 'portal_refresh_token';

// Memory storage untuk mode backend (hasApi=true) — tidak persisten di localStorage
let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

// Backend memakai nama role huruf besar.
const ROLE_MAP: Partial<Record<UserRole, 'GURU' | 'MURID' | 'WALIS' | 'TAMU'>> = {
  teacher: 'GURU',
  student: 'MURID',
  parent: 'WALIS',
  guest: 'TAMU',
};

export interface BackendGuardian {
  studentId: string;
  studentName: string;
  classId: string;
  legacyId?: string | null;
}

export interface BackendAuthUser {
  id: string;
  name: string;
  role: 'GURU' | 'MURID' | 'WALIS' | 'TAMU';
  avatarUrl?: string | null;
  email?: string | null;
  legacyId?: string | null;
  nis?: string | null;
  nip?: string | null;
  classId?: string | null;
  classIds?: string[]; // guru: kelas ajar (ClassRoomTeacher M2M)
  homeroomClassIds?: string[]; // guru: kelas binaan (ClassRoom.teacherId)
  guardianOf?: BackendGuardian[]; // wali: anak yang diasuh
}

export type PortalLoginResult =
  | { status: 'ok'; user: BackendAuthUser; accessToken: string; refreshToken: string | null }
  | { status: 'invalid' }
  | { status: 'unreachable' };

export type PortalAdminLoginResult =
  | { status: 'ok'; profileName: string; accessToken: string; refreshToken: string | null }
  | { status: 'invalid' }
  | { status: 'unreachable' };

export function savePortalTokens(accessToken: string, refreshToken: string | null) {
  if (hasApi) {
    // Mode backend: simpan di memory, JANGAN di localStorage (hindari XSS).
    // Backend juga menyetel httpOnly cookie (Set-Cookie) — cookie adalah
    // sumber kebenaran untuk request berikutnya (credentials: include).
    memoryAccessToken = accessToken;
    memoryRefreshToken = refreshToken;
    // Bersihkan legacy localStorage jika ada (migrasi)
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearPortalTokens() {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getPortalAccessToken() {
  if (hasApi) return memoryAccessToken || '';
  return localStorage.getItem(ACCESS_TOKEN_KEY) || '';
}

export function getPortalRefreshToken() {
  if (hasApi) return memoryRefreshToken || '';
  return localStorage.getItem(REFRESH_TOKEN_KEY) || '';
}

// Revoke token di server (POST /api/auth/logout).
// Best-effort — dipanggil dari AuthContext.logout; kegagalan tidak memblokir
// logout lokal.
export async function logoutPortal(): Promise<void> {
  const accessToken = getPortalAccessToken();
  const refreshToken = getPortalRefreshToken();
  // Jika token hanya di httpOnly cookie, accessToken memory mungkin kosong
  // setelah reload — tetap coba logout via cookie (credentials: include).
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({ refreshToken: refreshToken || null }),
    });
  } catch {
    // Abaikan — token lokal tetap dibersihkan oleh clearPortalTokens().
  }
}

// Ganti password guru/siswa di backend (POST /api/auth/change-password/...).
// Dipakai PengaturanAkun saat backend aktif supaya hash password di database
// ikut berubah (login berikutnya memvalidasi terhadap DB, bukan localStorage).
export async function changePortalPassword(opts: {
  role: 'teacher' | 'student';
  userId: string;
  oldPassword: string;
  newPassword: string;
}): Promise<{ ok: boolean; message?: string; authFailed?: boolean }> {
  const token = getPortalAccessToken();
  // Saat hasApi=true dan token di httpOnly cookie, memory token mungkin kosong
  // setelah reload — biarkan request tetap dikirim via cookie (credentials: include).
  // Untuk mode backend tanpa cookie, token tetap diperlukan.
  if (!token && !hasApi) {
    return { ok: false, message: 'Tidak ada sesi backend yang aktif.' };
  }

  const path = opts.role === 'teacher' ? 'change-password/teacher' : 'change-password/student';
  const body =
    opts.role === 'teacher'
      ? { teacherId: opts.userId, oldPassword: opts.oldPassword, newPassword: opts.newPassword }
      : { studentId: opts.userId, oldPassword: opts.oldPassword, newPassword: opts.newPassword };

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/auth/${path}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
    } | null;

    if (res.ok && data?.ok) {
      return { ok: true, message: data.message };
    }

    // 401/403 = token tidak valid/kedaluwarsa atau bukan akun sendiri.
    if (res.status === 401 || res.status === 403) {
      return { ok: false, authFailed: true, message: data?.message };
    }

    return { ok: false, message: data?.message || `Gagal mengubah password (${res.status}).` };
  } catch {
    return { ok: false, message: 'Tidak dapat terhubung ke server.' };
  }
}

// Verifikasi kredensial ke backend.
// - 'ok'          → backend memvalidasi kredensial
// - 'invalid'     → backend menolak (401 / ok:false)
// - 'unreachable' → backend tidak bisa dihubungi / role tidak didukung → fallback lokal
export async function loginPortal(
  id: string,
  password: string,
  role: UserRole
): Promise<PortalLoginResult> {
  const backendRole = ROLE_MAP[role];
  if (!backendRole) return { status: 'unreachable' };

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role: backendRole, id, password }),
    });

    if (res.status === 401) return { status: 'invalid' };
    if (!res.ok) return { status: 'unreachable' };

    const data = (await res.json()) as {
      ok?: boolean;
      user?: BackendAuthUser;
      accessToken?: string;
      refreshToken?: string | null;
    };

    if (!data.ok || !data.user || !data.accessToken) return { status: 'invalid' };

    return {
      status: 'ok',
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
    };
  } catch {
    return { status: 'unreachable' };
  }
}

// Login admin ke backend (POST /api/auth/admin/login).
// Endpoint memakai field `username` & `pin`. Kredensial admin hanya ada di
// env backend, tidak pernah di-bundle ke frontend.
// - 'ok'          → backend memvalidasi kredensial admin
// - 'invalid'     → backend menolak (401 / ok:false)
// - 'unreachable' → backend tidak bisa dihubungi → fallback login portal/lokal
export async function loginAdmin(username: string, pin: string): Promise<PortalAdminLoginResult> {
  try {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, pin }),
    });

    if (res.status === 401) return { status: 'invalid' };
    if (!res.ok) return { status: 'unreachable' };

    const data = (await res.json()) as {
      ok?: boolean;
      profileName?: string;
      accessToken?: string;
      refreshToken?: string | null;
    };

    if (!data.ok || !data.profileName || !data.accessToken) return { status: 'invalid' };

    return {
      status: 'ok',
      profileName: data.profileName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
    };
  } catch {
    return { status: 'unreachable' };
  }
}
