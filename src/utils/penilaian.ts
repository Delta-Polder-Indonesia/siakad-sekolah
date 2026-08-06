export const KKM_DEFAULT = 75;

export interface KonfigurasiPenilaian {
  kkm: number;
  bobotTugas: number;
  bobotUTS: number;
  bobotUAS: number;
  threshold: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

export const KONFIGURASI_PENILAIAN: KonfigurasiPenilaian = {
  kkm: KKM_DEFAULT,
  bobotTugas: 0.3,
  bobotUTS: 0.3,
  bobotUAS: 0.4,
  threshold: {
    A: 90,
    B: 80,
    C: 70,
    D: 60,
  },
};

export function hitungNilaiAkhir(tugas: number, uts: number, uas: number): number {
  const { bobotTugas, bobotUTS, bobotUAS } = KONFIGURASI_PENILAIAN;
  return Math.round(tugas * bobotTugas + uts * bobotUTS + uas * bobotUAS);
}

export function hitungPredikat(nilai: number): string {
  const { A, B, C, D } = KONFIGURASI_PENILAIAN.threshold;
  if (nilai >= A) return 'A';
  if (nilai >= B) return 'B';
  if (nilai >= C) return 'C';
  if (nilai >= D) return 'D';
  return 'E';
}

export function getPredikat(nilai: number): string {
  return hitungPredikat(nilai);
}

export function isTuntas(nilai: number, kkm: number = KONFIGURASI_PENILAIAN.kkm): boolean {
  return nilai >= kkm;
}

export function getBobotNilai(predikat: string | undefined): number {
  switch (predikat) {
    case 'A':
      return 4;
    case 'B':
      return 3;
    case 'C':
      return 2;
    case 'D':
      return 1;
    default:
      return 0;
  }
}
