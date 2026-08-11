// Lapisan API untuk fitur surat izin (blueprint BUG-03).
// Saat backend aktif (`hasApi`) operasi lewat /api/surat-izin; saat tidak,
// fallback ke store lokal.
//
// Kontrak data sama dengan SuratIzin di src/types.ts.

import { API_BASE, hasApi } from './apiConfig';
import type { SuratIzin } from '../types';
import {
  getSuratIzinByStudent,
  addSuratIzin,
  updateStatusSuratIzin,
} from '../data/services';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...((init?.headers as Record<string, string>) || {}) },
  });
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return (await res.json()) as T;
}

type ListResponse = { ok?: boolean; data?: SuratIzin[] };
type ItemResponse = { ok?: boolean; data?: SuratIzin };

// ── READ ────────────────────────────────────────────────────────────────────
// Catatan: endpoint /api/surat-izin GET dibatasi GURU/ADMIN (verifikasi).
// Self-service list per siswa utk MURID/WALIS ditutup sementara sampai
// linkage auth (ownership-check) dibangun — di mode demo semua role membaca store.

export async function fetchSuratByStudent(studentId: string): Promise<SuratIzin[]> {
  if (!hasApi) return Promise.resolve(getSuratIzinByStudent(studentId));
  // Mode API: gurU/admin membaca semua, lalu filter client-side.
  const data = await request<ListResponse>('/surat-izin');
  const items = Array.isArray(data?.data) ? data.data : [];
  return items.filter((s) => s.studentId === studentId);
}

// ── WRITE ───────────────────────────────────────────────────────────────────
export async function submitSurat(surat: SuratIzin): Promise<SuratIzin> {
  if (!hasApi) {
    addSuratIzin(surat);
    return Promise.resolve(surat);
  }
  const payload = {
    studentId: surat.studentId,
    classId: surat.classId,
    type: surat.type,
    subject: surat.subject,
    message: surat.message,
    letterDate: surat.letterDate,
    attachmentName: surat.attachmentName,
    attachmentDataUrl: surat.attachmentDataUrl,
  };
  const data = await request<ItemResponse>('/surat-izin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const saved = (data?.data ?? surat) as SuratIzin;
  // Sinkronkan ke store lokal agar komponen berbasis store konsisten.
  addSuratIzin(saved);
  return saved;
}

export async function updateSuratStatusApi(
  id: string,
  status: SuratIzin['status']
): Promise<SuratIzin> {
  if (!hasApi) {
    updateStatusSuratIzin(id, status);
    return Promise.resolve({ id, status } as SuratIzin);
  }
  const data = await request<ItemResponse>(`/surat-izin/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  const saved = (data?.data ?? ({ id, status } as SuratIzin)) as SuratIzin;
  updateStatusSuratIzin(id, status);
  return saved;
}
