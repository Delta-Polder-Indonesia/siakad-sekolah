/**
 * Unit test service absensi (blueprint BUG-03).
 * Menguji serialisasi DTO & logika filter/upsert tanpa menyentuh DB.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockFindMany = vi.hoisted(() => vi.fn());
const mockCount = vi.hoisted(() => vi.fn());
const mockCreateMany = vi.hoisted(() => vi.fn());
const mockFindUnique = vi.hoisted(() => vi.fn());
const mockDelete = vi.hoisted(() => vi.fn());

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    attendance: {
      findMany: mockFindMany,
      count: mockCount,
      createMany: mockCreateMany,
      findUnique: mockFindUnique,
      delete: mockDelete,
    },
  },
}));

import {
  listAttendance,
  createAttendanceRecords,
  deleteAttendance,
} from './attendance.service.js';

const fakeRow = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'att-1',
  studentId: 's1',
  classId: 'c1',
  date: new Date('2026-08-10T00:00:00.000Z'),
  status: 'hadir',
  note: null,
  teacherId: 't1',
  createdAt: new Date('2026-08-10T01:00:00.000Z'),
  updatedAt: new Date('2026-08-10T01:00:00.000Z'),
  ...over,
});

describe('listAttendance', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('memfilter berdasarkan date (rentang UTC start-of-day)', async () => {
    mockFindMany.mockResolvedValue([fakeRow()]);
    mockCount.mockResolvedValue(1);

    await listAttendance({ date: '2026-08-10', page: 1, limit: 50 });

    expect(mockFindMany).toHaveBeenCalledTimes(1);
    const arg = mockFindMany.mock.calls[0][0];
    expect(arg.where.date.gte).toEqual(new Date('2026-08-10T00:00:00.000Z'));
    expect(arg.where.date.lt).toEqual(new Date('2026-08-11T00:00:00.000Z'));
  });

  it('men-serialize row DB ke DTO frontend (markedBy, timestamp, date YYYY-MM-DD)', async () => {
    mockFindMany.mockResolvedValue([fakeRow()]);
    mockCount.mockResolvedValue(1);

    const { items } = await listAttendance({ page: 1, limit: 50 });

    expect(items[0]).toEqual({
      id: 'att-1',
      studentId: 's1',
      classId: 'c1',
      date: '2026-08-10',
      status: 'hadir',
      note: null,
      markedBy: 't1',
      timestamp: new Date('2026-08-10T01:00:00.000Z').getTime(),
    });
  });

  it('memuat default page=1 & limit=200', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await listAttendance({});

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 200 })
    );
  });
});

describe('createAttendanceRecords', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('menggunakan createMany dengan skipDuplicates & status normal', async () => {
    mockCreateMany.mockResolvedValue({ count: 2 });
    mockFindMany.mockResolvedValue([fakeRow(), fakeRow({ id: 'att-2' })]);

    const result = await createAttendanceRecords(
      [
        { studentId: 's1', classId: 'c1', date: '2026-08-10', status: 'hadir' },
        { studentId: 's2', classId: 'c1', date: '2026-08-10', status: 'alpha' },
      ],
      't1'
    );

    expect(mockCreateMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({ studentId: 's1', teacherId: 't1', status: 'hadir' }),
        expect.objectContaining({ studentId: 's2', status: 'alpha' }),
      ],
      skipDuplicates: true,
    });
    expect(result.count).toBe(2);
    expect(result.items).toHaveLength(2);
  });

  it('mengembalikan 0 item saat records kosong tanpa menyentuh DB', async () => {
    const result = await createAttendanceRecords([], 't1');
    expect(result.count).toBe(0);
    expect(result.items).toEqual([]);
    expect(mockCreateMany).not.toHaveBeenCalled();
  });
});

describe('deleteAttendance', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('menghapus record yang ada dan mengembalikan true', async () => {
    mockFindUnique.mockResolvedValue(fakeRow());
    mockDelete.mockResolvedValue(fakeRow());

    await expect(deleteAttendance('att-1')).resolves.toBe(true);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 'att-1' } });
  });

  it('melempar error saat record tidak ditemukan', async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(deleteAttendance('att-missing')).rejects.toThrow(/not found/i);
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
