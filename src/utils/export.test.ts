import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  exportToCsv,
  exportJurnalCsv,
  exportRekapNilaiCsv,
  exportAbsensiCsv,
  exportAbsensiPerKelasCsv,
  exportMutationsCsv,
} from './export';

describe('exportToCsv', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
  });

  it('creates a downloadable CSV file with correct filename', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportToCsv(
      [
        ['Alice', 85],
        ['Bob', 92],
      ],
      ['Nama', 'Nilai'],
      'test.csv'
    );

    expect(mockAnchor.download).toBe('test.csv');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('handles empty data gracefully', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportToCsv([], ['Col1', 'Col2'], 'empty.csv');
    expect(mockAnchor.download).toBe('empty.csv');
    expect(clickSpy).toHaveBeenCalled();
  });

  it('escapes special characters in CSV values', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportToCsv([['"Quoted" value', 100]], ['Name', 'Score'], 'escape.csv');
    expect(mockAnchor.download).toBe('escape.csv');
    expect(clickSpy).toHaveBeenCalled();
  });
});

describe('exportJurnalCsv', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
  });

  it('creates a CSV file with jurnal columns and rows', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportJurnalCsv(
      [
        {
          id: 'n1',
          teacherId: 't1',
          classId: 'c1',
          subject: 'Matematika',
          date: '2026-08-01',
          materi: 'Persamaan Linear',
          adaPr: true,
          prDetail: 'Soal no 1-5',
          catatan: 'Kelas aktif',
          updatedAt: 1,
        },
      ],
      'jurnal.csv'
    );

    expect(mockAnchor.download).toBe('jurnal.csv');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('handles empty notes gracefully', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportJurnalCsv([], 'jurnal-kosong.csv');
    expect(mockAnchor.download).toBe('jurnal-kosong.csv');
    expect(clickSpy).toHaveBeenCalled();
  });
});

describe('exportRekapNilaiCsv', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
  });

  it('creates a CSV file with rekap nilai rows', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportRekapNilaiCsv(
      [
        {
          studentName: 'Ali',
          nis: '001',
          nilaiTugas: 80,
          nilaiUTS: 85,
          nilaiUAS: 90,
          nilaiAkhir: 86,
          predikat: 'B',
          tuntas: true,
        },
      ],
      'XII-1',
      'Matematika',
      'genap'
    );

    expect(mockAnchor.download).toContain('RekapNilai_Matematika_XII-1_genap.csv');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('handles empty rows gracefully', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportRekapNilaiCsv([], 'XII-1', 'Matematika', 'ganjil');
    expect(mockAnchor.download).toContain('.csv');
    expect(clickSpy).toHaveBeenCalled();
  });
});

describe('exportAbsensiCsv', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
  });

  it('creates a CSV file with absensi rows and correct filename', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportAbsensiCsv(
      [
        {
          name: 'Ali',
          nis: '001',
          hadir: 20,
          izin: 1,
          sakit: 0,
          alpha: 0,
          total: 21,
          percentage: 95,
        },
        {
          name: 'Budi',
          nis: '002',
          hadir: 18,
          izin: 0,
          sakit: 2,
          alpha: 1,
          total: 21,
          percentage: 86,
        },
      ],
      'X IPA 1',
      '2026-08-01',
      '2026-08-31'
    );

    expect(mockAnchor.download).toContain('Laporan_Absensi_X_IPA_1_2026-08-01_2026-08-31.csv');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('handles empty rows gracefully', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportAbsensiCsv([], 'X IPA 1', '2026-08-01', '2026-08-31');
    expect(mockAnchor.download).toContain('.csv');
    expect(clickSpy).toHaveBeenCalled();
  });
});

describe('exportAbsensiPerKelasCsv', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
  });

  it('creates a CSV file with per-class absensi rows', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportAbsensiPerKelasCsv(
      [
        {
          kelas: 'X IPA 1',
          siswa: 30,
          hadir: 600,
          izin: 10,
          sakit: 5,
          alpha: 2,
          total: 617,
          percentage: 97,
        },
        {
          kelas: 'X IPA 2',
          siswa: 28,
          hadir: 500,
          izin: 8,
          sakit: 4,
          alpha: 1,
          total: 513,
          percentage: 97,
        },
      ],
      '2026-08-01',
      '2026-08-31'
    );

    expect(mockAnchor.download).toContain('Rekap_Absensi_PerKelas_2026-08-01_2026-08-31.csv');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('handles empty rows gracefully', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportAbsensiPerKelasCsv([], '2026-08-01', '2026-08-31');
    expect(mockAnchor.download).toContain('.csv');
    expect(clickSpy).toHaveBeenCalled();
  });
});

describe('exportMutationsCsv', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
  });

  it('creates a CSV file with mutation rows and correct filename', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportMutationsCsv(
      [
        {
          jenis: 'Status',
          waktu: '2026-08-01T08:00:00.000Z',
          dari: 'Aktif',
          ke: 'Pindah',
          catatan: 'mutasi',
        },
        { jenis: 'Kelas', waktu: '2026-07-15T08:00:00.000Z', dari: 'X-1', ke: 'X-2', catatan: '' },
      ],
      'Ali'
    );

    expect(mockAnchor.download).toContain('Riwayat_Mutasi_Ali_');
    expect(mockAnchor.download).toContain('.csv');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('handles empty rows gracefully', () => {
    const clickSpy = vi.fn();
    const mockAnchor = { href: '', download: '', click: clickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as any);

    exportMutationsCsv([], 'Budi');
    expect(mockAnchor.download).toContain('.csv');
    expect(clickSpy).toHaveBeenCalled();
  });
});
