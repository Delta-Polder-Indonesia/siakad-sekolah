// Lapisan API untuk fitur tagihan/billing sekolah (blueprint BUG-03, replikasi
// pola attendanceService/rapotService). Saat backend aktif (`hasApi`) operasi
// lewat /api/billing; saat tidak ada backend, fallback ke store lokal.
//
// Kontrak data sama dengan TagihanSekolah & PengaturanTagihan di src/types.ts.

import { hasApi } from './apiConfig';
import { apiRequest } from './apiClient';
import type { TagihanSekolah, PengaturanTagihan } from '../types';
import {
  getTagihanSekolahBySiswa,
  getTahunTagihanSiswa,
  bayarTagihanSekolah,
  getPengaturanTagihan,
  setPengaturanTagihan,
  terapkanTagihanTahunanUntukSemuaSiswa,
} from '../data/services';

export interface BillingQuery {
  studentId?: string;
  year?: number;
  status?: 'lunas' | 'belum_lunas';
}

type ListResponse = { ok?: boolean; data?: TagihanSekolah[] };
type ConfigResponse = { ok?: boolean; data?: PengaturanTagihan };

const request = apiRequest;

// ── READ ────────────────────────────────────────────────────────────────────
// Self-service siswa/wali sudah dibuka (ownership di backend).

export async function fetchTagihanBySiswa(
  studentId: string,
  year: number
): Promise<TagihanSekolah[]> {
  if (!hasApi) return Promise.resolve(getTagihanSekolahBySiswa(studentId, year));

  const query = new URLSearchParams({ studentId, year: String(year) });
  const data = await request<ListResponse>(`/billing?${query.toString()}`);
  const items = Array.isArray(data?.data) ? data.data : [];
  // Sinkronkan ke store lokal agar komponen berbasis store tetap konsisten.
  items.forEach((i) => bayarTagihanSekolah(i.id, i.paymentMethod ?? ''));
  return items;
}

export async function fetchTahunTagihanSiswa(studentId: string): Promise<number[]> {
  if (!hasApi) return Promise.resolve(getTahunTagihanSiswa(studentId));
  // Mode API: belum ada endpoint tahun ringkas; ambil semua lalu kurasi.
  const all = await fetchTagihanBySiswa(studentId, 0);
  const years = Array.from(new Set(all.map((i) => i.year)));
  return years.sort((a, b) => b - a);
}

export async function fetchPengaturanTagihan(): Promise<PengaturanTagihan> {
  if (!hasApi) return Promise.resolve(getPengaturanTagihan());
  const data = await request<ConfigResponse>('/billing/config');
  return (data?.data ?? getPengaturanTagihan()) as PengaturanTagihan;
}

// ── WRITE ───────────────────────────────────────────────────────────────────
export async function payTagihanSekolah(
  id: string,
  paymentMethod: string
): Promise<boolean> {
  if (!hasApi) {
    bayarTagihanSekolah(id, paymentMethod);
    return Promise.resolve(true);
  }
  await request<{ ok?: boolean }>(`/billing/${encodeURIComponent(id)}/pay`, {
    method: 'POST',
    body: JSON.stringify({ paymentMethod }),
  });
  // Sinkronkan ke store lokal agar komponen berbasis store tetap konsisten.
  bayarTagihanSekolah(id, paymentMethod);
  return true;
}

export async function simpanPengaturanTagihan(
  config: PengaturanTagihan
): Promise<PengaturanTagihan> {
  if (!hasApi) {
    setPengaturanTagihan(config);
    return Promise.resolve(config);
  }
  const data = await request<ConfigResponse>('/billing/config', {
    method: 'POST',
    body: JSON.stringify({ monthlyAmount: config.monthlyAmount, dueDay: config.dueDay }),
  });
  const saved = (data?.data ?? config) as PengaturanTagihan;
  setPengaturanTagihan(saved);
  return saved;
}

export async function terapkanTagihanTahunan(
  year: number,
  monthlyAmount: number,
  dueDay: number,
  updatedBy: string
): Promise<{ count: number }> {
  if (!hasApi) {
    terapkanTagihanTahunanUntukSemuaSiswa(year, monthlyAmount, dueDay, updatedBy);
    return Promise.resolve({ count: 0 });
  }
  const data = await request<{ ok?: boolean; data?: { count?: number } }>('/billing/generate', {
    method: 'POST',
    body: JSON.stringify({ year, monthlyAmount, dueDay }),
  });
  return { count: data?.data?.count ?? 0 };
}
