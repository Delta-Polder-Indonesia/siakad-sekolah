// Lapisan API untuk fitur surat izin (blueprint BUG-03).
// Saat backend aktif (`hasApi`) operasi lewat /api/surat-izin; saat tidak,
// fallback ke store lokal.
//
// Kontrak data sama dengan SuratIzin di src/types.ts.

import { hasApi } from './apiConfig';
import { apiRequest } from './apiClient';
import type { SuratIzin } from '../types';
import {
  getSuratIzinByStudent,
  addSuratIzin,
  updateStatusSuratIzin,
} from '../data/services';

const request = apiRequest;

type ListResponse = { ok?: boolean; data?: SuratIzin[] };
type ItemResponse = { ok?: boolean; data?: SuratIzin };

// ── READ ────────────────────────────────────────────────────────────────────
export async function fetchSuratByStudent(studentId: string): Promise<SuratIzin[]> {
  if (!hasApi) return Promise.resolve(getSuratIzinByStudent(studentId));
  const query = new URLSearchParams({ studentId });
  const data = await request<ListResponse>(`/surat-izin?${query.toString()}`);
  return Array.isArray(data?.data) ? data.data : [];
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
