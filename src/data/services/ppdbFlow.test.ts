import { beforeEach, describe, expect, it } from 'vitest';
import {
  initializeData,
  getPPDBApplications,
  submitPPDBApplication,
  updateApplicationStatus,
  getPPDBStatistics,
  getStudents,
} from './index';

describe('PPDB Integration Flow', () => {
  beforeEach(async () => {
    // Start fresh
    localStorage.clear();
    await initializeData();
  });

  it('completes the full PPDB lifecycle: submit → verify → accept', async () => {
    // 1. Submit PPDB application
    const app = submitPPDBApplication({
      namaLengkap: 'Test Student',
      nisn: '1234567890',
      nik: '1234567890123456',
      tempatLahir: 'Medan',
      tanggalLahir: '2008-01-15',
      jenisKelamin: 'Laki-laki',
      agama: 'Islam',
      kewenangnegaraan: 'WNI',
      anakKe: '1',
      jumlahSaudara: '2',
      golonganDarah: 'O',
      alamatLengkap: 'Jl. Test No. 1',
      rt: '001',
      rw: '002',
      dusun: 'Test',
      desaKelurahan: 'Test Kelurahan',
      kecamatan: 'Test Kecamatan',
      kabupatenKota: 'Medan',
      provinsi: 'Sumatera Utara',
      kodePos: '20111',
      nomorHp: '08123456789',
      email: 'test@example.com',
      sekolahAsal: 'SD Test',
      npsnSekolahAsal: '12345678',
      namaAyah: 'Ayah Test',
      namaIbu: 'Ibu Test',
      jenjangTujuan: 'SMA',
      sekolahTujuan: 'SMA Negeri 1 Medan',
      jalurPendaftaran: 'REGULER',
    });

    expect(app).toBeDefined();
    expect(app.registrationNo).toMatch(/^PPDB-/);
    expect(app.status).toBe('PENDING');

    // 2. Verify application exists in store
    const allApps = getPPDBApplications();
    expect(allApps.length).toBe(1);
    expect(allApps[0].id).toBe(app.id);

    // 3. Verify statistics
    const stats = getPPDBStatistics();
    expect(stats.total).toBe(1);
    expect(stats.pending).toBe(1);
    expect(stats.accepted).toBe(0);

    // 4. Accept the application
    const updated = await updateApplicationStatus(
      app.id,
      'ACCEPTED',
      'Selamat diterima',
      'admin-test'
    );
    expect(updated).not.toBeNull();
    expect(updated!.status).toBe('ACCEPTED');

    // 5. Check that student was automatically enrolled
    const students = getStudents();
    const enrolled = students.find((s) => s.name === 'Test Student');
    expect(enrolled).toBeDefined();
    expect(enrolled!.nis).toBeDefined();
  });

  it('rejects application with REJECTED status', async () => {
    const app = submitPPDBApplication({
      namaLengkap: 'Rejected Student',
      nisn: '9876543210',
      nik: '1234567890123456',
      tempatLahir: 'Medan',
      tanggalLahir: '2008-06-20',
      jenisKelamin: 'Perempuan',
      agama: 'Kristen',
      kewenangnegaraan: 'WNI',
      anakKe: '2',
      jumlahSaudara: '1',
      golonganDarah: 'A',
      alamatLengkap: 'Jl. Test No. 2',
      rt: '003',
      rw: '004',
      dusun: 'Test',
      desaKelurahan: 'Test Kelurahan',
      kecamatan: 'Test Kecamatan',
      kabupatenKota: 'Medan',
      provinsi: 'Sumatera Utara',
      kodePos: '20111',
      nomorHp: '08123456788',
      email: 'rejected@example.com',
      sekolahAsal: 'SD Test',
      npsnSekolahAsal: '87654321',
      namaAyah: 'Ayah 2',
      namaIbu: 'Ibu 2',
      jenjangTujuan: 'SMA',
      sekolahTujuan: 'SMA Negeri 1 Medan',
      jalurPendaftaran: 'ZONASI',
    });

    const updated = await updateApplicationStatus(
      app.id,
      'REJECTED',
      'Maaf, tidak memenuhi kriteria'
    );
    expect(updated?.status).toBe('REJECTED');

    // Student should NOT be enrolled
    const students = getStudents();
    expect(students.find((s) => s.name === 'Rejected Student')).toBeUndefined();
  });

  it('returns null when updating non-existent application', async () => {
    const result = await updateApplicationStatus('non-existent-id', 'ACCEPTED');
    expect(result).toBeNull();
  });
});
