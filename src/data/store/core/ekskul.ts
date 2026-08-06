import {
  readLocalKey,
  notifyStoreUpdated,
  EKSKUL_KEY,
  EKSKUL_MEMBER_KEY,
  EKSKUL_HADIR_KEY,
} from './db';
import type { Ekskul, EkskulMember, EkskulKehadiran } from '../../../types';
// ==================== EKSTRAKURIKULER (EKSKUL) ====================
// Data disimpan di localStorage key terpisah (EKSKUL_*_KEY), pola sama dengan modul BK.

export function getEkskul(): Ekskul[] {
  const all = readLocalKey<Ekskul[]>(EKSKUL_KEY, []);
  return [...all].sort((a, b) => a.nama.localeCompare(b.nama));
}

export function addEkskul(ekskul: Ekskul) {
  const all = readLocalKey<Ekskul[]>(EKSKUL_KEY, []);
  all.push(ekskul);
  localStorage.setItem(EKSKUL_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function updateEkskul(id: string, patch: Partial<Ekskul>) {
  const all = readLocalKey<Ekskul[]>(EKSKUL_KEY, []).map((item) =>
    item.id === id ? { ...item, ...patch, id } : item
  );
  localStorage.setItem(EKSKUL_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function deleteEkskul(id: string) {
  localStorage.setItem(
    EKSKUL_KEY,
    JSON.stringify(readLocalKey<Ekskul[]>(EKSKUL_KEY, []).filter((item) => item.id !== id))
  );
  // Hapus juga keanggotaan & kehadiran yang terkait agar tidak jadi data yatim.
  localStorage.setItem(
    EKSKUL_MEMBER_KEY,
    JSON.stringify(
      readLocalKey<EkskulMember[]>(EKSKUL_MEMBER_KEY, []).filter((item) => item.ekskulId !== id)
    )
  );
  localStorage.setItem(
    EKSKUL_HADIR_KEY,
    JSON.stringify(
      readLocalKey<EkskulKehadiran[]>(EKSKUL_HADIR_KEY, []).filter((item) => item.ekskulId !== id)
    )
  );
  notifyStoreUpdated();
}

export function getEkskulMembers(): EkskulMember[] {
  return readLocalKey<EkskulMember[]>(EKSKUL_MEMBER_KEY, []);
}

export function getEkskulMembersByEkskul(ekskulId: string): EkskulMember[] {
  return getEkskulMembers()
    .filter((m) => m.ekskulId === ekskulId)
    .sort((a, b) => a.joinedAt - b.joinedAt);
}

export function getAktifMemberCount(ekskulId: string): number {
  return getEkskulMembersByEkskul(ekskulId).filter((m) => m.status === 'aktif').length;
}

/** Ekskul yang sedang diikuti (status aktif) oleh seorang siswa. */
export function getEkskulByStudent(studentId: string): Ekskul[] {
  const ekskulMap = new Map(getEkskul().map((e) => [e.id, e]));
  return getEkskulMembers()
    .filter((m) => m.studentId === studentId && m.status === 'aktif')
    .map((m) => ekskulMap.get(m.ekskulId))
    .filter((e): e is Ekskul => Boolean(e));
}

/** Daftar ekskul yang tersedia (semua), disertai status keanggotaan siswa. */
export function getEkskulTersedia(studentId: string) {
  const activeIds = new Set(
    getEkskulMembers()
      .filter((m) => m.studentId === studentId && m.status === 'aktif')
      .map((m) => m.ekskulId)
  );
  return getEkskul().map((ekskul) => ({
    ...ekskul,
    anggota: getAktifMemberCount(ekskul.id),
    sudahDaftar: activeIds.has(ekskul.id),
  }));
}

/** Daftarkan siswa ke ekskul. Menghormati kuota; return false bila penuh/sudah daftar. */
export function daftarEkskul(studentId: string, ekskulId: string): boolean {
  const ekskul = getEkskul().find((e) => e.id === ekskulId);
  if (!ekskul) return false;

  const members = getEkskulMembers();
  const existing = members.find((m) => m.studentId === studentId && m.ekskulId === ekskulId);
  if (existing) {
    if (existing.status === 'aktif') return false; // sudah terdaftar
    // status keluar → aktifkan lagi (kecuali penuh)
    if (typeof ekskul.kuota === 'number' && ekskul.kuota > 0) {
      const aktif = members.filter((m) => m.ekskulId === ekskulId && m.status === 'aktif').length;
      if (aktif >= ekskul.kuota) return false;
    }
    localStorage.setItem(
      EKSKUL_MEMBER_KEY,
      JSON.stringify(
        members.map((m) => (m.id === existing.id ? { ...m, status: 'aktif' as const } : m))
      )
    );
    notifyStoreUpdated();
    return true;
  }

  if (typeof ekskul.kuota === 'number' && ekskul.kuota > 0) {
    const aktif = members.filter((m) => m.ekskulId === ekskulId && m.status === 'aktif').length;
    if (aktif >= ekskul.kuota) return false;
  }

  members.push({
    id: `ekskul_member_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ekskulId,
    studentId,
    joinedAt: Date.now(),
    status: 'aktif',
  });
  localStorage.setItem(EKSKUL_MEMBER_KEY, JSON.stringify(members));
  notifyStoreUpdated();
  return true;
}

/** Keluar dari ekskul (status jadi 'keluar', riwayat tetap tersimpan). */
export function keluarEkskul(studentId: string, ekskulId: string) {
  const members = getEkskulMembers().map((m) =>
    m.studentId === studentId && m.ekskulId === ekskulId ? { ...m, status: 'keluar' as const } : m
  );
  localStorage.setItem(EKSKUL_MEMBER_KEY, JSON.stringify(members));
  notifyStoreUpdated();
}

export function getEkskulKehadiran(ekskulId: string): EkskulKehadiran[] {
  return readLocalKey<EkskulKehadiran[]>(EKSKUL_HADIR_KEY, [])
    .filter((k) => k.ekskulId === ekskulId)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.createdAt - a.createdAt);
}

export function getEkskulKehadiranByStudent(studentId: string): EkskulKehadiran[] {
  return readLocalKey<EkskulKehadiran[]>(EKSKUL_HADIR_KEY, [])
    .filter((k) => k.studentId === studentId)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.createdAt - a.createdAt);
}

/** Simpan kehadiran; jika sudah ada untuk (ekskul, siswa, tanggal) akan di-overwrite. */
export function addEkskulKehadiran(record: EkskulKehadiran): boolean {
  const all = readLocalKey<EkskulKehadiran[]>(EKSKUL_HADIR_KEY, []);
  const idx = all.findIndex(
    (k) =>
      k.ekskulId === record.ekskulId &&
      k.studentId === record.studentId &&
      k.tanggal === record.tanggal
  );
  if (idx >= 0) {
    all[idx] = { ...all[idx], status: record.status, catatan: record.catatan };
  } else {
    all.push(record);
  }
  localStorage.setItem(EKSKUL_HADIR_KEY, JSON.stringify(all));
  notifyStoreUpdated();
  return true;
}

export function deleteEkskulKehadiran(id: string) {
  localStorage.setItem(
    EKSKUL_HADIR_KEY,
    JSON.stringify(readLocalKey<EkskulKehadiran[]>(EKSKUL_HADIR_KEY, []).filter((k) => k.id !== id))
  );
  notifyStoreUpdated();
}
