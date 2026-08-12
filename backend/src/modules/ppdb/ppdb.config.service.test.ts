/**
 * Unit test service konfigurasi PPDB (blueprint BUG-05).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockFindFirst = vi.hoisted(() => vi.fn());
const mockUpdate = vi.hoisted(() => vi.fn());
const mockCreate = vi.hoisted(() => vi.fn());

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    schoolConfig: { findFirst: mockFindFirst, update: mockUpdate, create: mockCreate },
  },
}));

import { getPpdbConfig, updatePpdbConfig } from './ppdb.config.service.js';

const fakeConfig = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'cfg-1', ppdbYear: '2026', ppdbIsOpen: false, ppdbRegistrationUrl: null,
  ppdbQuota: 0, ppdbOpenDate: null, ppdbCloseDate: null,
  ...over,
});

describe('getPpdbConfig', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('mengembalikan default saat belum ada konfigurasi', async () => {
    mockFindFirst.mockResolvedValue(null);
    const cfg = await getPpdbConfig();
    expect(cfg.ppdbIsOpen).toBe(false);
    expect(cfg.ppdbYear).toBe('2026');
  });

  it('men-serialize tanggal ke ISO', async () => {
    mockFindFirst.mockResolvedValue(fakeConfig({ ppdbOpenDate: new Date('2026-06-01T00:00:00Z') }));
    const cfg = await getPpdbConfig();
    expect(cfg.ppdbOpenDate).toBe('2026-06-01T00:00:00.000Z');
  });
});

describe('updatePpdbConfig', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('memperbarui config yang ada dengan field yang dikirim', async () => {
    mockFindFirst.mockResolvedValue(fakeConfig());
    mockUpdate.mockResolvedValue(fakeConfig({ ppdbIsOpen: true, ppdbQuota: 120 }));
    const cfg = await updatePpdbConfig({ ppdbIsOpen: true, ppdbQuota: 120 });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const arg = mockUpdate.mock.calls[0][0];
    expect(arg.data.ppdbIsOpen).toBe(true);
    expect(arg.data.ppdbQuota).toBe(120);
    expect(cfg.ppdbIsOpen).toBe(true);
  });

  it('membuat config baru bila belum ada', async () => {
    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue(fakeConfig({ ppdbYear: '2027' }));
    const cfg = await updatePpdbConfig({ ppdbYear: '2027' });
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(cfg.ppdbYear).toBe('2027');
  });
});
