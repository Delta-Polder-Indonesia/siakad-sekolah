import { readLocalKey, notifyStoreUpdated, TAGIHAN_KEY, PENGATURAN_TAGIHAN_KEY } from './db';
import { getStudents } from './students';
import type { TagihanSekolah, PengaturanTagihan } from '../../../types';
// ==================== TAGIHAN SEKOLAH ====================

function getDefaultPengaturanTagihan(): PengaturanTagihan {
  return { monthlyAmount: 250000, dueDay: 10, updatedAt: Date.now(), updatedBy: 'system' };
}

export function getTagihanSekolahBySiswa(studentId: string, year: number): TagihanSekolah[] {
  const all = readLocalKey<TagihanSekolah[]>(TAGIHAN_KEY, []);
  return all
    .filter((item) => item.studentId === studentId && item.year === year)
    .sort((a, b) => a.month - b.month);
}

export function getTahunTagihanSiswa(studentId: string): number[] {
  const all = readLocalKey<TagihanSekolah[]>(TAGIHAN_KEY, []);
  const years = new Set(
    all.filter((item) => item.studentId === studentId).map((item) => item.year)
  );
  return Array.from(years).sort((a, b) => b - a);
}

export function bayarTagihanSekolah(id: string, paymentMethod: string) {
  const all = readLocalKey<TagihanSekolah[]>(TAGIHAN_KEY, []);
  const updated = all.map((item) =>
    item.id === id ? { ...item, status: 'lunas', paymentMethod, paidAt: Date.now() } : item
  );
  localStorage.setItem(TAGIHAN_KEY, JSON.stringify(updated));
  notifyStoreUpdated();
}

export function getPengaturanTagihan(): PengaturanTagihan {
  return readLocalKey<PengaturanTagihan>(PENGATURAN_TAGIHAN_KEY, getDefaultPengaturanTagihan());
}

export function setPengaturanTagihan(config: PengaturanTagihan) {
  localStorage.setItem(PENGATURAN_TAGIHAN_KEY, JSON.stringify(config));
  notifyStoreUpdated();
}

export function terapkanTagihanTahunanUntukSemuaSiswa(
  year: number,
  monthlyAmount: number,
  dueDay: number,
  updatedBy: string
) {
  const students = getStudents();
  const existing = readLocalKey<TagihanSekolah[]>(TAGIHAN_KEY, []);
  const dueDaySafe = Math.min(28, Math.max(1, dueDay));
  const next = [...existing];

  students.forEach((student) => {
    for (let month = 1; month <= 12; month += 1) {
      const billId = `bill_${student.id}_${year}_${month}`;
      const dueDate = `${year}-${String(month).padStart(2, '0')}-${String(dueDaySafe).padStart(2, '0')}`;
      const idx = next.findIndex((item) => item.id === billId);
      if (idx >= 0) next[idx] = { ...next[idx], amount: monthlyAmount, dueDate };
      else {
        next.push({
          id: billId,
          studentId: student.id,
          year,
          month,
          amount: monthlyAmount,
          dueDate,
          status: 'belum_lunas',
        });
      }
    }
  });

  localStorage.setItem(TAGIHAN_KEY, JSON.stringify(next));
  localStorage.setItem(
    PENGATURAN_TAGIHAN_KEY,
    JSON.stringify({ monthlyAmount, dueDay: dueDaySafe, updatedAt: Date.now(), updatedBy })
  );
  notifyStoreUpdated();
}
