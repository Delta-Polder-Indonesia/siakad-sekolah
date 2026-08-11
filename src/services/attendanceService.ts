// Lapisan API untuk fitur absensi/kehadiran (blueprint BUG-03).
// Saat backend aktif (`hasApi`), operasi absensi lewat endpoint /api/attendance.
// Saat tidak ada backend, fallback ke store lokal (perilaku lama) agar tetap
// berfungsi penuh di mode demo.
//
// Kontrak data sama dengan AttendanceRecord di src/types.ts, sehingga komponen
// (HalamanAbsensi) bisa memakai service ini tanpa tahu detail penyimpanan.

import { API_BASE, hasApi } from './apiConfig';
import type { AttendanceRecord } from '../types';
import {
  getAttendanceByDate,
  addAttendanceRecords,
} from '../data/services';

export interface AttendanceQuery {
  date?: string; // YYYY-MM-DD
  classId?: string;
  studentId?: string;
}

type AttendanceListResponse = {
  ok?: boolean;
  data?: AttendanceRecord[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...((init?.headers as Record<string, string>) || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`API request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

// Muat absensi per tanggal/kelas. Selalu async (backend) — mode lokal
// mengembalikan Promise.resolve dari store agar kontrak sama.
export async function fetchAttendanceByDate(
  date: string,
  classId?: string
): Promise<AttendanceRecord[]> {
  if (!hasApi) {
    return Promise.resolve(getAttendanceByDate(date, classId));
  }

  const query = new URLSearchParams({ date });
  if (classId) query.set('classId', classId);

  const data = await request<AttendanceListResponse>(`/attendance?${query.toString()}`);
  return Array.isArray(data?.data) ? data.data : [];
}

// Simpan satu/banyak record absensi. Mode lokal memakai addAttendanceRecords.
export async function submitAttendanceRecords(
  records: AttendanceRecord[]
): Promise<{ count: number }> {
  if (!hasApi) {
    addAttendanceRecords(records);
    return Promise.resolve({ count: records.length });
  }

  const payload = records.map((r) => ({
    studentId: r.studentId,
    classId: r.classId,
    date: r.date,
    status: r.status,
    note: r.note ?? null,
  }));

  const data = await request<{ ok?: boolean; message?: string; data?: unknown[] }>(
    '/attendance',
    { method: 'POST', body: JSON.stringify(payload) }
  );

  return { count: Array.isArray(data?.data) ? data.data.length : 0 };
}
