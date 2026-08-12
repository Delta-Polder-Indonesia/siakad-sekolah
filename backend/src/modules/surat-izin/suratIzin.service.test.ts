/**
 * Unit test service surat izin (blueprint BUG-03).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockFindMany = vi.hoisted(() => vi.fn());
const mockCount = vi.hoisted(() => vi.fn());
const mockCreate = vi.hoisted(() => vi.fn());
const mockFindUnique = vi.hoisted(() => vi.fn());
const mockUpdate = vi.hoisted(() => vi.fn());

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    suratIzin: { findMany: mockFindMany, count: mockCount, create: mockCreate, findUnique: mockFindUnique, update: mockUpdate },
  },
}));

import { listSurat, createSurat, updateSuratStatus } from './suratIzin.service.js';

const fakeSurat = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'surat-1', studentId: 's1', classId: 'c1', type: 'izin',
  subject: 'Izin dokter', message: 'Sakit', letterDate: new Date('2026-08-10T00:00:00Z'),
  status: 'MENUNGGU', attachmentUrl: null, attachmentName: null,
  createdAt: new Date('2026-08-10T00:00:00Z'),
  ...over,
});

describe('listSurat', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('memfilter status & men-serialize DTO (status UI huruf kecil, letterDate YYYY-MM-DD)', async () => {
    mockFindMany.mockResolvedValue([fakeSurat()]);
    mockCount.mockResolvedValue(1);
    const { items } = await listSurat({ status: 'menunggu', page: 1, limit: 50 });
    expect(mockFindMany.mock.calls[0][0].where.status).toBe('MENUNGGU');
    expect(items[0].status).toBe('menunggu');
    expect(items[0].letterDate).toBe('2026-08-10');
  });
});

describe('createSurat', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('membuat surat dengan status awal MENUNGGU & letterDate UTC', async () => {
    mockCreate.mockResolvedValue(fakeSurat());
    const item = await createSurat({
      studentId: 's1', classId: 'c1', type: 'izin',
      subject: 'Izin', message: 'Pesan', letterDate: '2026-08-10',
    });
    expect(mockCreate).toHaveBeenCalledTimes(1);
    const arg = mockCreate.mock.calls[0][0].data;
    expect(arg.status).toBe('MENUNGGU');
    expect(arg.letterDate).toEqual(new Date('2026-08-10T00:00:00Z'));
    expect(item.status).toBe('menunggu');
  });
});

describe('updateSuratStatus', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('mengubah status ke DISETUJUI (DB) dan men-serialize ke disetujui', async () => {
    mockFindUnique.mockResolvedValue(fakeSurat());
    mockUpdate.mockResolvedValue(fakeSurat({ status: 'DISETUJUI' }));
    const item = await updateSuratStatus('surat-1', 'disetujui');
    expect(mockUpdate.mock.calls[0][0].data.status).toBe('DISETUJUI');
    expect(item.status).toBe('disetujui');
  });

  it('melempar error saat surat tidak ditemukan', async () => {
    mockFindUnique.mockResolvedValue(null);
    await expect(updateSuratStatus('surat-missing', 'ditolak')).rejects.toThrow(/not found/i);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
