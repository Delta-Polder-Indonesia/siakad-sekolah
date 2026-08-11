/**
 * Unit test dataTools — ekspor/impor/reset data (template universal).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  collectMasterData,
  exportMasterData,
  importMasterData,
  resetAllData,
} from './dataTools';
import { readDB, initializeData, STORAGE_KEY } from './db';

const SAMPLE = {
  version: 1 as const,
  exportedAt: new Date().toISOString(),
  app: 'siakad' as const,
  teachers: [
    { id: 't1', name: 'Pak Andi', nip: '19800101', subject: 'Matematika', password: 'rahasia123', classIds: [] },
  ],
  students: [
    { id: 's1', name: 'Budi', nis: '2026001', classId: 'c1', gender: 'L' as const, password: 'siswa123', parentPassword: 'ortu123' },
  ],
  classes: [{ id: 'c1', name: 'X-1', grade: 'X', teacherId: 't1' }],
  classRosters: [{ id: 'r1', classId: 'c1', studentId: 's1', subject: 'Matematika', teacherId: 't1' }],
};

describe('dataTools (ekspor/impor/reset)', () => {
  beforeEach(async () => {
    localStorage.clear();
    await initializeData(); // seed demo
  });

  it('exportMasterData menghasilkan JSON valid berisi koleksi master', () => {
    const raw = exportMasterData();
    const parsed = JSON.parse(raw);
    expect(parsed.app).toBe('siakad');
    expect(Array.isArray(parsed.teachers)).toBe(true);
    expect(Array.isArray(parsed.students)).toBe(true);
    expect(parsed.teachers.length).toBeGreaterThan(0); // seed demo ada guru
  });

  it('importMasterData mengganti koleksi master & meng-hash password polos', async () => {
    const summary = await importMasterData(JSON.stringify(SAMPLE));
    expect(summary.teachers).toBe(1);
    expect(summary.students).toBe(1);
    expect(summary.classes).toBe(1);

    const db = readDB();
    expect(db.teachers).toHaveLength(1);
    expect(db.teachers[0].name).toBe('Pak Andi');
    // password sudah di-hash (64 hex) — bukan plaintext
    expect(db.teachers[0].password).toMatch(/^[0-9a-f]{64}$/);
    expect(db.teachers[0].password).not.toBe('rahasia123');
    expect(db.students[0].password).toMatch(/^[0-9a-f]{64}$/);
    expect(db.students[0].parentPassword).toMatch(/^[0-9a-f]{64}$/);
  });

  it('importMasterData mempertahankan password yang sudah di-hash', async () => {
    const hashed = 'a'.repeat(64);
    const sample = JSON.parse(JSON.stringify(SAMPLE));
    sample.teachers[0].password = hashed;
    await importMasterData(JSON.stringify(sample));
    expect(readDB().teachers[0].password).toBe(hashed);
  });

  it('importMasterData menolak file yang bukan ekspor SIAKAD', async () => {
    await expect(importMasterData('{"foo":"bar"}')).rejects.toThrow();
    await expect(importMasterData('bukan json')).rejects.toThrow();
  });

  it('importMasterData menolak data guru tidak lengkap', async () => {
    const bad = JSON.parse(JSON.stringify(SAMPLE));
    bad.teachers[0].nip = '';
    await expect(importMasterData(JSON.stringify(bad))).rejects.toThrow(/guru/);
  });

  it("resetAllData('empty') mengosongkan semua koleksi", async () => {
    await resetAllData('empty');
    const db = readDB();
    expect(db.teachers).toHaveLength(0);
    expect(db.students).toHaveLength(0);
    expect(db.classes).toHaveLength(0);
  });

  it("resetAllData('demo') mengembalikan data contoh", async () => {
    await resetAllData('empty');
    await resetAllData('demo');
    const db = readDB();
    expect(db.teachers.length).toBeGreaterThan(0);
    expect(db.students.length).toBeGreaterThan(0);
  });

  it('collectMasterData membaca dari DB saat ini', () => {
    const data = collectMasterData();
    expect(data.app).toBe('siakad');
    expect(data.exportedAt).toBeTruthy();
  });
});
