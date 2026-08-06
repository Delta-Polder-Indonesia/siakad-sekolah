import { readLocalKey, notifyStoreUpdated, BK_KEY } from './db';
import type { CatatanBK } from '../../../types';
// ==================== CATATAN BK (BIMBINGAN KONSELING) ====================
// Data disimpan di localStorage key terpisah (BK_KEY), pola sama dengan surat izin.
// Konvensi poin: pelanggaran NEGATIF, prestasi POSITIF.

export function getCatatanBK(): CatatanBK[] {
  const all = readLocalKey<CatatanBK[]>(BK_KEY, []);
  return [...all].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.createdAt - a.createdAt);
}

export function getCatatanBKByStudent(studentId: string): CatatanBK[] {
  return getCatatanBK().filter((item) => item.studentId === studentId);
}

export function addCatatanBK(record: CatatanBK) {
  const all = readLocalKey<CatatanBK[]>(BK_KEY, []);
  all.push(record);
  localStorage.setItem(BK_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function deleteCatatanBK(id: string) {
  const all = readLocalKey<CatatanBK[]>(BK_KEY, []).filter((item) => item.id !== id);
  localStorage.setItem(BK_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

/** Total poin siswa: pelanggaran mengurangi, prestasi menambah. */
export function getTotalPoinBK(studentId: string): number {
  return getCatatanBKByStudent(studentId).reduce((acc, item) => acc + item.poin, 0);
}
