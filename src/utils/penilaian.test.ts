import { describe, expect, it } from 'vitest';
import {
  hitungNilaiAkhir,
  hitungPredikat,
  getPredikat,
  isTuntas,
  getBobotNilai,
  KONFIGURASI_PENILAIAN,
  KKM_DEFAULT,
} from './penilaian';

describe('penilaian', () => {
  it('hitungNilaiAkhir menggunakan bobot 30/30/40', () => {
    expect(hitungNilaiAkhir(100, 100, 100)).toBe(100);
    expect(hitungNilaiAkhir(80, 80, 80)).toBe(80);
    expect(hitungNilaiAkhir(100, 100, 50)).toBe(80);
    expect(hitungNilaiAkhir(0, 0, 0)).toBe(0);
  });

  it('hitungPredikat konsisten di seluruh titik', () => {
    expect(hitungPredikat(90)).toBe('A');
    expect(hitungPredikat(89)).toBe('B');
    expect(hitungPredikat(80)).toBe('B');
    expect(hitungPredikat(79)).toBe('C');
    expect(hitungPredikat(70)).toBe('C');
    expect(hitungPredikat(69)).toBe('D');
    expect(hitungPredikat(60)).toBe('D');
    expect(hitungPredikat(59)).toBe('E');
    expect(hitungPredikat(0)).toBe('E');
  });

  it('getPredikat adalah alias hitungPredikat', () => {
    expect(getPredikat(95)).toBe('A');
    expect(getPredikat(85)).toBe('B');
  });

  it('isTuntas memakai KKM default 75', () => {
    expect(KKM_DEFAULT).toBe(75);
    expect(isTuntas(75)).toBe(true);
    expect(isTuntas(74)).toBe(false);
    expect(isTuntas(74, 70)).toBe(true);
    expect(isTuntas(100, 100)).toBe(true);
    expect(isTuntas(99, 100)).toBe(false);
  });

  it('KONFIGURASI_PENILAIAN memiliki nilai default yang benar', () => {
    expect(KONFIGURASI_PENILAIAN.kkm).toBe(75);
    expect(KONFIGURASI_PENILAIAN.bobotTugas).toBe(0.3);
    expect(KONFIGURASI_PENILAIAN.bobotUTS).toBe(0.3);
    expect(KONFIGURASI_PENILAIAN.bobotUAS).toBe(0.4);
  });

  it('getBobotNilai konversi predikat ke angka', () => {
    expect(getBobotNilai('A')).toBe(4);
    expect(getBobotNilai('B')).toBe(3);
    expect(getBobotNilai('C')).toBe(2);
    expect(getBobotNilai('D')).toBe(1);
    expect(getBobotNilai('E')).toBe(0);
    expect(getBobotNilai(undefined)).toBe(0);
    expect(getBobotNilai('')).toBe(0);
  });
});
