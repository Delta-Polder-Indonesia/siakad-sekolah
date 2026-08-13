import { describe, expect, it } from 'vitest';
import { toFrontend, toPrismaCreate } from './ppdb.mapper.js';

describe('ppdb.mapper', () => {
  it('memetakan namaLengkap → fullName', () => {
    const row = toPrismaCreate({
      namaLengkap: 'Siti Rahma',
      nisn: '001',
      jenisKelamin: 'P',
      tanggalLahir: '2010-01-01',
      jalurPendaftaran: 'zonasi',
    });
    expect(row.fullName).toBe('Siti Rahma');
    expect(row.gender).toBe('P');
    expect(row.pathway).toBe('zonasi');
  });

  it('toFrontend mengembalikan field Indonesia', () => {
    const fe = toFrontend({
      id: '1',
      registrationNo: 'R1',
      status: 'PENDING',
      fullName: 'Siti',
      nisn: '1',
      nik: '2',
      birthPlace: 'Medan',
      birthDate: new Date('2010-01-02T00:00:00Z'),
      gender: 'P',
      religion: 'Islam',
      address: 'Jl',
      phone: '08',
      whatsapp: null,
      email: 'a@b.c',
      previousSchool: 'SMP',
      previousNpsn: null,
      majorId: null,
      pathway: 'zonasi',
      fatherName: 'Ayah',
      motherName: 'Ibu',
      guardianName: null,
      guardianPhone: null,
      adminNotes: null,
      verifiedBy: null,
      verifiedAt: null,
      submittedAt: new Date('2026-08-13T00:00:00Z'),
      extended: { anakKe: '1' },
    });
    expect(fe.namaLengkap).toBe('Siti');
    expect(fe.tanggalLahir).toBe('2010-01-02');
    expect(fe.anakKe).toBe('1');
  });
});
