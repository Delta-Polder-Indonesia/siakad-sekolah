// Lapisan API untuk fitur rapot/nilai (blueprint BUG-03, replikasi pola
// attendanceService). Saat backend aktif (`hasApi`) operasi lewat
// /api/rapot; saat tidak ada backend, fallback ke store lokal agar mode demo
// tetap berfungsi penuh.
//
// Kontrak data sama dengan NilaiRapot di src/types.ts.

import { API_BASE, hasApi } from './apiConfig';
import type { NilaiRapot } from '../types';
import {
  getNilaiRapotBySiswa,
  getNilaiRapotByKelas,
  getTahunAjaranRapotSiswa,
  upsertNilaiRapot,
  deleteNilaiRapot,
} from '../data/services';

export interface RapotQuery {
  studentId?: string;
  classId?: string;
  tahunAjaran?: string;
  semester?: string;
}

type ListResponse = {
  ok?: boolean;
  data?: NilaiRapot[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...((init?.headers as Record<string, string>) || {}),
    },
  });
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return (await res.json()) as T;
}

// ── READ ────────────────────────────────────────────────────────────────────
// Catatan: pembacaan rapot oleh siswa/orang-tua via API belum dibuka di backend
// (linkage auth/ownership belum tersedia — lihat rapot.route.ts). Endpoint /rapot
// hanya untuk GURU/ADMIN. Di mode demo, semua role membaca dari store lokal.

export async function fetchRapotByKelas(
  classId: string,
  tahunAjaran?: string,
  semester?: string
): Promise<NilaiRapot[]> {
  if (!hasApi) return Promise.resolve(getNilaiRapotByKelas(classId, tahunAjaran, semester));

  const query = new URLSearchParams({ classId });
  if (tahunAjaran) query.set('tahunAjaran', tahunAjaran);
  if (semester) query.set('semester', semester);

  const data = await request<ListResponse>(`/rapot?${query.toString()}`);
  const items = Array.isArray(data?.data) ? data.data : [];
  // Sinkronkan hasil API ke store lokal agar komponen yang membaca lewat
  // store (storeVersion) tetap konsisten selama migrasi read-async bertahap.
  items.forEach((i) => upsertNilaiRapot(i));
  return items;
}

export async function fetchRapotByStudent(
  studentId: string,
  tahunAjaran?: string,
  semester?: string
): Promise<NilaiRapot[]> {
  if (!hasApi) return Promise.resolve(getNilaiRapotBySiswa(studentId, tahunAjaran, semester));
  const query = new URLSearchParams({ studentId });
  if (tahunAjaran) query.set('tahunAjaran', tahunAjaran);
  if (semester) query.set('semester', semester);
  const data = await request<ListResponse>(`/rapot?${query.toString()}`);
  return Array.isArray(data?.data) ? data.data : [];
}

export async function fetchTahunAjaranRapotSiswa(studentId: string): Promise<string[]> {
  if (!hasApi) return Promise.resolve(getTahunAjaranRapotSiswa(studentId));
  const items = await fetchRapotByStudent(studentId);
  return Array.from(new Set(items.map((i) => i.tahunAjaran))).sort((a, b) => b.localeCompare(a));
}

// ── WRITE ───────────────────────────────────────────────────────────────────
// Simpan (upsert) satu baris nilai. Mode lokal memakai upsertNilaiRapot.
export async function submitNilaiRapot(nilai: NilaiRapot): Promise<NilaiRapot> {
  if (!hasApi) {
    upsertNilaiRapot(nilai);
    return Promise.resolve(nilai);
  }

  const payload = {
    studentId: nilai.studentId,
    classId: nilai.classId,
    semester: nilai.semester,
    tahunAjaran: nilai.tahunAjaran,
    mataPelajaran: nilai.mataPelajaran,
    nilaiHarian: nilai.nilaiHarian ?? null,
    nilaiTugas: nilai.nilaiTugas ?? null,
    nilaiUTS: nilai.nilaiUTS,
    nilaiUAS: nilai.nilaiUAS,
    nilaiAkhir: nilai.nilaiAkhir,
    predikat: nilai.predikat ?? null,
    catatanGuru: nilai.catatanGuru ?? null,
  };

  const data = await request<{ ok?: boolean; data?: NilaiRapot }>('/rapot', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const saved = (data?.data ?? nilai) as NilaiRapot;
  // Sinkronkan ke store lokal agar komponen berbasis store tetap konsisten.
  upsertNilaiRapot(saved);
  return saved;
}

export async function deleteRapotById(id: string): Promise<boolean> {
  if (!hasApi) {
    deleteNilaiRapot(id);
    return Promise.resolve(true);
  }
  await request<{ ok?: boolean }>(`/rapot/${encodeURIComponent(id)}`, { method: 'DELETE' });
  // Sinkronkan ke store lokal agar komponen berbasis store tetap konsisten.
  deleteNilaiRapot(id);
  return true;
}
