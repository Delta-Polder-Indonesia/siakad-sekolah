// Lapisan API untuk fitur roster kelas (blueprint BUG-03, replikasi pola
// service domain akademik lain). Saat backend aktif (`hasApi`) operasi lewat
// /api/roster; saat tidak ada backend, fallback ke store lokal.
//
// Kontrak data sama dengan ClassRosterItem di src/types.ts.

import { API_BASE, hasApi } from './apiConfig';
import type { ClassRosterItem } from '../types';
import {
  getClassRosters,
  addClassRoster,
  deleteClassRoster,
} from '../data/services';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...((init?.headers as Record<string, string>) || {}) },
  });
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return (await res.json()) as T;
}

type ListResponse = { ok?: boolean; data?: ClassRosterItem[] };
type ItemResponse = { ok?: boolean; data?: ClassRosterItem };

// ── READ ────────────────────────────────────────────────────────────────────
export async function fetchRosterByClass(classId: string): Promise<ClassRosterItem[]> {
  if (!hasApi) return Promise.resolve(getClassRosters(classId));
  const query = new URLSearchParams({ classId });
  const data = await request<ListResponse>(`/roster?${query.toString()}`);
  return Array.isArray(data?.data) ? data.data : [];
}

// ── WRITE ───────────────────────────────────────────────────────────────────
export async function createRosterApi(roster: ClassRosterItem): Promise<ClassRosterItem> {
  if (!hasApi) {
    addClassRoster(roster);
    return Promise.resolve(roster);
  }
  const payload = {
    classId: roster.classId,
    subject: roster.subject,
    dayOfWeek: roster.dayOfWeek,
    startTime: roster.startTime,
    endTime: roster.endTime,
    room: roster.room ?? null,
    teacherName: roster.teacherName ?? null,
  };
  const data = await request<ItemResponse>('/roster', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const saved = (data?.data ?? roster) as ClassRosterItem;
  // Sinkronkan ke store lokal agar komponen berbasis store konsisten.
  addClassRoster(saved);
  return saved;
}

export async function deleteRosterApi(id: string): Promise<boolean> {
  if (!hasApi) {
    deleteClassRoster(id);
    return Promise.resolve(true);
  }
  await request<{ ok?: boolean }>(`/roster/${encodeURIComponent(id)}`, { method: 'DELETE' });
  deleteClassRoster(id);
  return true;
}
