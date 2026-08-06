import { readLocalKey, notifyStoreUpdated, TAHUN_AJARAN_KEY, MAPEL_KEY } from './db';
import type { TahunAjaran, MataPelajaran } from '../../../types';
// ==================== MASTER DATA AKADEMIK ====================
// Tahun Ajaran/Semester aktif + Mata Pelajaran terpusat.
// Data disimpan di localStorage key terpisah (TAHUN_AJARAN_KEY / MAPEL_KEY), pola sama dengan modul BK & Ekskul.

export function getTahunAjaran(): TahunAjaran[] {
  const all = readLocalKey<TahunAjaran[]>(TAHUN_AJARAN_KEY, []);
  return [...all].sort((a, b) => b.tahun.localeCompare(a.tahun) || a.createdAt - b.createdAt);
}

export function getTahunAjaranAktif(): TahunAjaran | undefined {
  return readLocalKey<TahunAjaran[]>(TAHUN_AJARAN_KEY, []).find((item) => item.aktif);
}

export function addTahunAjaran(record: TahunAjaran) {
  const all = readLocalKey<TahunAjaran[]>(TAHUN_AJARAN_KEY, []);
  all.push(record);
  localStorage.setItem(TAHUN_AJARAN_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function updateTahunAjaran(id: string, patch: Partial<TahunAjaran>) {
  const all = readLocalKey<TahunAjaran[]>(TAHUN_AJARAN_KEY, []).map((item) =>
    item.id === id ? { ...item, ...patch, id } : item
  );
  localStorage.setItem(TAHUN_AJARAN_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function deleteTahunAjaran(id: string) {
  localStorage.setItem(
    TAHUN_AJARAN_KEY,
    JSON.stringify(
      readLocalKey<TahunAjaran[]>(TAHUN_AJARAN_KEY, []).filter((item) => item.id !== id)
    )
  );
  notifyStoreUpdated();
}

/** Menandai satu tahun ajaran sebagai aktif, semua lainnya non-aktif. */
export function setTahunAjaranAktif(id: string) {
  const all = readLocalKey<TahunAjaran[]>(TAHUN_AJARAN_KEY, []).map((item) => ({
    ...item,
    aktif: item.id === id,
  }));
  localStorage.setItem(TAHUN_AJARAN_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function getMataPelajaran(): MataPelajaran[] {
  const all = readLocalKey<MataPelajaran[]>(MAPEL_KEY, []);
  return [...all].sort((a, b) => a.nama.localeCompare(b.nama));
}

export function addMataPelajaran(record: MataPelajaran) {
  const all = readLocalKey<MataPelajaran[]>(MAPEL_KEY, []);
  all.push(record);
  localStorage.setItem(MAPEL_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function updateMataPelajaran(id: string, patch: Partial<MataPelajaran>) {
  const all = readLocalKey<MataPelajaran[]>(MAPEL_KEY, []).map((item) =>
    item.id === id ? { ...item, ...patch, id } : item
  );
  localStorage.setItem(MAPEL_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function deleteMataPelajaran(id: string) {
  localStorage.setItem(
    MAPEL_KEY,
    JSON.stringify(readLocalKey<MataPelajaran[]>(MAPEL_KEY, []).filter((item) => item.id !== id))
  );
  notifyStoreUpdated();
}
