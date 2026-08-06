// ─── Ambang badge persentase kehadiran (satu pintu, konsisten lintas halaman guru) ───

export const BATAS_KEHADIRAN_BAIK = 80;
export const BATAS_KEHADIRAN_CUKUP = 60;

export type TingkatKehadiran = 'baik' | 'cukup' | 'rendah';

export function tingkatKehadiran(persentase: number): TingkatKehadiran {
  if (persentase >= BATAS_KEHADIRAN_BAIK) return 'baik';
  if (persentase >= BATAS_KEHADIRAN_CUKUP) return 'cukup';
  return 'rendah';
}

export function kehadiranBadgeClass(persentase: number): string {
  const tingkat = tingkatKehadiran(persentase);
  switch (tingkat) {
    case 'baik':
      return 'border-emerald-600 bg-white text-emerald-700';
    case 'cukup':
      return 'border-amber-600 bg-white text-amber-700';
    default:
      return 'border-rose-600 bg-white text-rose-700';
  }
}
