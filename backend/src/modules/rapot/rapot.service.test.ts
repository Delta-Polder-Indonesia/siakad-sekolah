/**
 * Unit test service rapot (blueprint BUG-03).
 * Menguji serialisasi DTO & logika upsert/filter tanpa menyentuh DB.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockFindMany = vi.hoisted(() => vi.fn());
const mockCount = vi.hoisted(() => vi.fn());
const mockUpsert = vi.hoisted(() => vi.fn());
const mockFindUnique = vi.hoisted(() => vi.fn());
const mockDelete = vi.hoisted(() => vi.fn());

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    reportCard: {
      findMany: mockFindMany,
      count: mockCount,
      upsert: mockUpsert,
      findUnique: mockFindUnique,
      delete: mockDelete,
    },
  },
}));

import { listRapot, upsertRapot, deleteRapot } from './rapot.service.js';

const fakeRow = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'rapot-1',
  studentId: 's1',
  classId: 'c1',
  academicYear: '2025/2026',
  semester: 'genap',
  subject: 'Matematika',
  dailyScore: 80,
  assignScore: 85,
  midScore: 82,
  finalScore: 90,
  totalScore: 86,
  grade: null,
  predikat: 'A',
  teacherNote: 'Bagus',
  inputBy: 't1',
  createdAt: new Date('2026-08-10T00:00:00Z'),
  updatedAt: new Date('2026-08-10T00:00:00Z'),
  ...over,
});

describe('listRapot', () => {
  beforeEach(() => vi.clearAllMocks());

  it('memfilter berdasarkan tahunAjaran (academicYear) & semester', async () => {
    mockFindMany.mockResolvedValue([fakeRow()]);
    mockCount.mockResolvedValue(1);

    await listRapot({ tahunAjaran: '2025/2026', semester: 'genap' });

    expect(mockFindMany).toHaveBeenCalledTimes(1);
    const arg = mockFindMany.mock.calls[0][0];
    expect(arg.where.academicYear).toBe('2025/2026');
    expect(arg.where.semester).toBe('genap');
  });

  it('men-serialize row DB ke DTO frontend', async () => {
    mockFindMany.mockResolvedValue([fakeRow()]);
    mockCount.mockResolvedValue(1);

    const { items } = await listRapot({ page: 1, limit: 50 });

    expect(items[0]).toEqual({
      id: 'rapot-1',
      studentId: 's1',
      classId: 'c1',
      semester: 'genap',
      tahunAjaran: '2025/2026',
      mataPelajaran: 'Matematika',
      nilaiHarian: 80,
      nilaiTugas: 85,
      nilaiUTS: 82,
      nilaiUAS: 90,
      nilaiAkhir: 86,
      predikat: 'A',
      catatanGuru: 'Bagus',
      inputBy: 't1',
      createdAt: new Date('2026-08-10T00:00:00Z').getTime(),
      updatedAt: new Date('2026-08-10T00:00:00Z').getTime(),
    });
  });
});

describe('upsertRapot', () => {
  beforeEach(() => vi.clearAllMocks());

  it('memetakan DTO → field DB pada unique compound key', async () => {
    mockUpsert.mockResolvedValue(fakeRow());

    const item = await upsertRapot(
      {
        studentId: 's1',
        classId: 'c1',
        semester: 'genap',
        tahunAjaran: '2025/2026',
        mataPelajaran: 'Matematika',
        nilaiHarian: 80,
        nilaiTugas: 85,
        nilaiUTS: 82,
        nilaiUAS: 90,
        nilaiAkhir: 86,
        predikat: 'A',
        catatanGuru: 'Bagus',
      },
      't1'
    );

    expect(mockUpsert).toHaveBeenCalledTimes(1);
    const arg = mockUpsert.mock.calls[0][0];
    expect(arg.where.studentId_classId_academicYear_semester_subject).toEqual({
      studentId: 's1',
      classId: 'c1',
      academicYear: '2025/2026',
      semester: 'genap',
      subject: 'Matematika',
    });
    expect(arg.create.totalScore).toBe(86);
    expect(arg.create.inputBy).toBe('t1');
    expect(arg.update.inputBy).toBe('t1');
    expect(item.id).toBe('rapot-1');
  });
});

describe('deleteRapot', () => {
  beforeEach(() => vi.clearAllMocks());

  it('menghapus record yang ada dan mengembalikan true', async () => {
    mockFindUnique.mockResolvedValue(fakeRow());
    mockDelete.mockResolvedValue(fakeRow());

    await expect(deleteRapot('rapot-1')).resolves.toBe(true);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 'rapot-1' } });
  });

  it('melempar error saat record tidak ditemukan', async () => {
    mockFindUnique.mockResolvedValue(null);
    await expect(deleteRapot('rapot-missing')).rejects.toThrow(/not found/i);
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
