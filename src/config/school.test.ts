/**
 * Unit test identitas sekolah (config/school.ts) — fondasi template universal.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSchoolIdentity,
  updateSchoolIdentity,
  resetSchoolIdentity,
  getSchoolEmail,
  SCHOOL_IDENTITY_KEY,
  DEFAULT_SCHOOL_IDENTITY,
} from './school';

describe('school identity (template universal)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('mengembalikan default saat belum ada override', () => {
    const id = getSchoolIdentity();
    expect(id.namaSekolah).toBe(DEFAULT_SCHOOL_IDENTITY.namaSekolah);
    expect(id.jenjang).toBe('SMA');
  });

  it('updateSchoolIdentity menyimpan & menggabungkan sebagian field', () => {
    const merged = updateSchoolIdentity({ namaSekolah: 'SMPN 5 Bandung', tahunAjaran: '2026/2027' });
    expect(merged.namaSekolah).toBe('SMPN 5 Bandung');
    expect(merged.tahunAjaran).toBe('2026/2027');
    // field lain tetap default
    expect(merged.telepon).toBe(DEFAULT_SCHOOL_IDENTITY.telepon);
    // tersimpan di localStorage
    expect(localStorage.getItem(SCHOOL_IDENTITY_KEY)).toContain('SMPN 5 Bandung');
  });

  it('resetSchoolIdentity menghapus override', () => {
    updateSchoolIdentity({ namaSekolah: 'SDN 1 Medan' });
    resetSchoolIdentity();
    expect(getSchoolIdentity().namaSekolah).toBe(DEFAULT_SCHOOL_IDENTITY.namaSekolah);
    expect(localStorage.getItem(SCHOOL_IDENTITY_KEY)).toBeNull();
  });

  it('abaikan field kosong saat update', () => {
    const merged = updateSchoolIdentity({ namaSekolah: '   ', alamat: 'Jl. Baru No. 1' });
    expect(merged.namaSekolah).toBe(DEFAULT_SCHOOL_IDENTITY.namaSekolah);
    expect(merged.alamat).toBe('Jl. Baru No. 1');
  });

  it('aman dari data localStorage yang rusak', () => {
    localStorage.setItem(SCHOOL_IDENTITY_KEY, '{not valid json');
    const id = getSchoolIdentity();
    expect(id.namaSekolah).toBe(DEFAULT_SCHOOL_IDENTITY.namaSekolah);
  });

  it('getSchoolEmail memakai domain dari identitas', () => {
    updateSchoolIdentity({ emailDomain: 'smpn5bdg.sch.id' });
    expect(getSchoolEmail(getSchoolIdentity())).toBe('info@smpn5bdg.sch.id');
  });
});
