/**
 * Unit test service billing (blueprint BUG-03, replikasi pola attendance/rapot).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockFindMany = vi.hoisted(() => vi.fn());
const mockCount = vi.hoisted(() => vi.fn());
const mockFindUnique = vi.hoisted(() => vi.fn());
const mockUpdate = vi.hoisted(() => vi.fn());
const mockFindFirst = vi.hoisted(() => vi.fn());
const mockCreate = vi.hoisted(() => vi.fn());
const mockStudentFindMany = vi.hoisted(() => vi.fn());
const mockCreateMany = vi.hoisted(() => vi.fn());
const mockUpdateMany = vi.hoisted(() => vi.fn());

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    billing: {
      findMany: mockFindMany,
      count: mockCount,
      findUnique: mockFindUnique,
      update: mockUpdate,
      createMany: mockCreateMany,
      updateMany: mockUpdateMany,
    },
    billingConfig: {
      findFirst: mockFindFirst,
      create: mockCreate,
    },
    student: {
      findMany: mockStudentFindMany,
    },
  },
}));

import {
  listBilling,
  payBilling,
  getPengaturan,
  setPengaturan,
  generateAnnualBilling,
} from './billing.service.js';

const fakeBill = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'bill-1',
  studentId: 's1',
  year: 2026,
  month: 1,
  amount: 250000,
  dueDate: new Date('2026-01-10T00:00:00Z'),
  isPaid: false,
  paymentMethod: null,
  paidAt: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  ...over,
});

describe('listBilling', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('memfilter status lunas → isPaid=true', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);
    await listBilling({ status: 'lunas' });
    expect(mockFindMany.mock.calls[0][0].where.isPaid).toBe(true);
  });

  it('memfilter status belum_lunas → isPaid=false', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);
    await listBilling({ status: 'belum_lunas' });
    expect(mockFindMany.mock.calls[0][0].where.isPaid).toBe(false);
  });

  it('men-serialize row DB ke DTO frontend', async () => {
    mockFindMany.mockResolvedValue([fakeBill()]);
    mockCount.mockResolvedValue(1);
    const { items } = await listBilling({ page: 1, limit: 50 });
    expect(items[0]).toEqual({
      id: 'bill-1',
      studentId: 's1',
      year: 2026,
      month: 1,
      amount: 250000,
      dueDate: '2026-01-10',
      status: 'belum_lunas',
      paymentMethod: null,
      paidAt: null,
    });
  });
});

describe('payBilling', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('menandai isPaid=true dengan metode & waktu pembayaran', async () => {
    mockFindUnique.mockResolvedValue(fakeBill());
    mockUpdate.mockResolvedValue(fakeBill({ isPaid: true, paymentMethod: 'ewallet' }));

    const item = await payBilling('bill-1', 'ewallet');

    const arg = mockUpdate.mock.calls[0][0];
    expect(arg.data.isPaid).toBe(true);
    expect(arg.data.paymentMethod).toBe('ewallet');
    expect(item.status).toBe('lunas');
  });

  it('melempar error saat tagihan tidak ditemukan', async () => {
    mockFindUnique.mockResolvedValue(null);
    await expect(payBilling('bill-missing', 'tunai')).rejects.toThrow(/not found/i);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('pengaturan', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('mengembalikan default saat tidak ada konfigurasi', async () => {
    mockFindFirst.mockResolvedValue(null);
    const cfg = await getPengaturan();
    expect(cfg.dueDay).toBe(10);
  });

  it('membuat konfigurasi dengan dueDay di-clamp 1-28', async () => {
    mockCreate.mockResolvedValue({
      monthlyAmount: 300000,
      dueDay: 28,
      updatedAt: new Date('2026-08-01T00:00:00Z'),
      updatedBy: 't1',
    });
    const cfg = await setPengaturan(300000, 31, 't1');
    expect(cfg.dueDay).toBe(28);
    expect(mockCreate.mock.calls[0][0].data.dueDay).toBe(28);
  });
});

describe('generateAnnualBilling', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('membuat 12 tagihan per siswa dengan unique [studentId,year,month]', async () => {
    mockStudentFindMany.mockResolvedValue([{ id: 's1' }, { id: 's2' }]);
    mockCreateMany.mockResolvedValue({ count: 24 });
    mockUpdateMany.mockResolvedValue({ count: 0 });

    const result = await generateAnnualBilling({
      year: 2026,
      monthlyAmount: 250000,
      dueDay: 10,
      updatedBy: 'admin',
    });

    expect(mockCreateMany).toHaveBeenCalledTimes(1);
    const arg = mockCreateMany.mock.calls[0][0];
    expect(arg.skipDuplicates).toBe(true);
    expect(arg.data).toHaveLength(24);
    expect(result.count).toBe(48); // 24 create + 24 existing
  });
});
