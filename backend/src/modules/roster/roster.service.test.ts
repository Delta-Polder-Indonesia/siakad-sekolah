/**
 * Unit test service roster kelas (blueprint BUG-03).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockFindMany = vi.hoisted(() => vi.fn());
const mockCount = vi.hoisted(() => vi.fn());
const mockCreate = vi.hoisted(() => vi.fn());
const mockFindUnique = vi.hoisted(() => vi.fn());
const mockDelete = vi.hoisted(() => vi.fn());

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    classRoster: { findMany: mockFindMany, count: mockCount, create: mockCreate, findUnique: mockFindUnique, delete: mockDelete },
  },
}));

import { listRoster, createRoster, deleteRoster } from './roster.service.js';

const fakeRoster = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'roster-1', classId: 'c1', subject: 'Matematika', dayOfWeek: 1,
  startTime: '07:00', endTime: '08:30', room: 'R1', teacherName: 'Bapak A',
  updatedBy: 't1', updatedAt: new Date('2026-08-10T00:00:00Z'),
  ...over,
});

describe('listRoster', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('memfilter classId & men-serialize DTO', async () => {
    mockFindMany.mockResolvedValue([fakeRoster()]);
    mockCount.mockResolvedValue(1);
    const { items } = await listRoster({ classId: 'c1', page: 1, limit: 50 });
    expect(mockFindMany.mock.calls[0][0].where.classId).toBe('c1');
    expect(items[0]).toEqual({
      id: 'roster-1', classId: 'c1', subject: 'Matematika', dayOfWeek: 1,
      startTime: '07:00', endTime: '08:30', room: 'R1', teacherName: 'Bapak A',
      updatedBy: 't1', updatedAt: new Date('2026-08-10T00:00:00Z').getTime(),
    });
  });
});

describe('createRoster', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('membuat jadwal roster dengan updatedBy dari caller', async () => {
    mockCreate.mockResolvedValue(fakeRoster());
    const item = await createRoster({
      classId: 'c1', subject: 'Matematika', dayOfWeek: 1, startTime: '07:00', endTime: '08:30',
    }, 't1');
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate.mock.calls[0][0].data.updatedBy).toBe('t1');
    expect(item.subject).toBe('Matematika');
  });
});

describe('deleteRoster', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('menghapus jadwal yang ada', async () => {
    mockFindUnique.mockResolvedValue(fakeRoster());
    mockDelete.mockResolvedValue(fakeRoster());
    await expect(deleteRoster('roster-1')).resolves.toBe(true);
  });

  it('melempar error saat tidak ditemukan', async () => {
    mockFindUnique.mockResolvedValue(null);
    await expect(deleteRoster('roster-missing')).rejects.toThrow(/not found/i);
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
