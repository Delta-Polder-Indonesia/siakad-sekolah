import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { PPDBApplication } from '../../data/services';
import { exportPpdbCsv, downloadJsonFile, printDetailPdf, printRecap } from './ppdbExport';
import { statusText, formatDate } from './AdminPanel.types';
import type { AdminPanelStats } from './AdminPanel.types';

const DUMMY_APP: PPDBApplication = {
  id: 'a1',
  registrationNo: 'REG-001',
  submittedAt: '2026-08-01T10:00:00.000Z',
  status: 'PENDING',
  jenjangTujuan: 'SMP',
  sekolahTujuan: 'SMP Negeri 1',
  jalurPendaftaran: 'ZONASI',
  namaLengkap: 'Budi Santoso',
  nisn: '0011223344',
  nik: '1234567890123456',
  tempatLahir: 'Medan',
  tanggalLahir: '2010-01-01',
  jenisKelamin: 'L',
  agama: 'Islam',
  kewenangnegaraan: 'WNI',
  anakKe: '1',
  jumlahSaudara: '2',
  golonganDarah: 'O',
  alamatLengkap: 'Jl. Merdeka 1',
  rt: '001',
  rw: '002',
  dusun: '-',
  desaKelurahan: 'Petisah',
  kecamatan: 'Medan Baru',
  kabupatenKota: 'Medan',
  provinsi: 'Sumatera Utara',
  kodePos: '20112',
  nomorHp: '08123456789',
  email: 'budi@example.com',
  sekolahAsal: 'SDN 1 Medan',
  npsnSekolahAsal: '12345678',
  namaAyah: 'Ayah Budi',
  namaIbu: 'Ibu Budi',
  documentValidation: { akta: 'VALID' },
  adminNotes: 'Berkas lengkap',
};

const DUMMY_STATS: AdminPanelStats = {
  total: 1,
  pending: 1,
  verified: 0,
  accepted: 0,
  rejected: 0,
  byJenjang: { SD: 0, SMP: 1, SMA: 0, SMK: 0 },
  byJalur: { REGULER: 0, ZONASI: 1, PRESTASI: 0, AFIRMASI: 0, PINDAHAN: 0 },
};

describe('AdminPanel helpers (dipisah dari AdminPanel.tsx)', () => {
  it('statusText memetakan semua status ke label Indonesia', () => {
    expect(statusText('PENDING')).toBe('Menunggu');
    expect(statusText('VERIFIED')).toBe('Terverifikasi');
    expect(statusText('ACCEPTED')).toBe('Diterima');
    expect(statusText('REJECTED')).toBe('Ditolak');
    expect(statusText('UNKNOWN')).toBe('UNKNOWN'); // fallback aman
  });

  it('formatDate menghasilkan tanggal berbahasa Indonesia', () => {
    const out = formatDate('2026-08-01T10:00:00.000Z');
    expect(out).toMatch(/Agu/);
    expect(out).toMatch(/2026/);
  });
});

describe('ppdbExport (dipisah dari AdminPanel.tsx)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
    const anchor: {
      href: string;
      download: string;
      click: ReturnType<typeof vi.fn>;
      setAttribute: (k: string, v: string) => void;
    } = {
      href: '',
      download: '',
      click: vi.fn(),
      setAttribute(k, v) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[k] = v;
      },
    };
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLElement);
    vi.spyOn(document.body, 'appendChild').mockReturnValue({} as HTMLElement);
    vi.spyOn(document.body, 'removeChild').mockReturnValue({} as HTMLElement);
  });

  it('exportPpdbCsv membuat file CSV dengan data pendaftar', () => {
    exportPpdbCsv([DUMMY_APP]);
    const anchor = document.createElement('a') as unknown as {
      download: string;
      click: ReturnType<typeof vi.fn>;
    };
    expect(anchor.download).toMatch(/^rekap-ppdb-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(anchor.click).toHaveBeenCalledTimes(1);
  });

  it('downloadJsonFile men-download JSON dengan nama file yang benar', () => {
    downloadJsonFile([DUMMY_APP], 'backup.json');
    const anchor = document.createElement('a') as unknown as { download: string };
    expect(anchor.download).toBe('backup.json');
  });

  it('printDetailPdf menghasilkan PDF tanpa error (jspdf dimuat dinamis)', async () => {
    await expect(printDetailPdf(DUMMY_APP)).resolves.not.toThrow();
  });

  it('printRecap membuat HTML cetak tanpa error', () => {
    vi.stubGlobal('window', { open: vi.fn(() => null) } as unknown as Window & typeof globalThis);
    expect(() => printRecap([DUMMY_APP], DUMMY_STATS)).not.toThrow();
  });
});
