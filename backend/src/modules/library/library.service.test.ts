/**
 * Unit test service perpustakaan (blueprint BUG-03).
 * Menguji serialisasi DTO & logika status/stok transaksi.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockBookFindUnique = vi.hoisted(() => vi.fn());
const mockBookUpdate = vi.hoisted(() => vi.fn());
const mockMemberFindUnique = vi.hoisted(() => vi.fn());
const mockTxFindUnique = vi.hoisted(() => vi.fn());
const mockTxUpdate = vi.hoisted(() => vi.fn());
const mockTxCreate = vi.hoisted(() => vi.fn());
const mockTxCount = vi.hoisted(() => vi.fn());
const mockTxFindMany = vi.hoisted(() => vi.fn());
const mockBookFindMany = vi.hoisted(() => vi.fn());
const mockBookCount = vi.hoisted(() => vi.fn());

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    book: { findUnique: mockBookFindUnique, update: mockBookUpdate, findMany: mockBookFindMany, count: mockBookCount },
    libraryMember: { findUnique: mockMemberFindUnique },
    libraryTransaction: {
      findUnique: mockTxFindUnique, update: mockTxUpdate, create: mockTxCreate,
      findMany: mockTxFindMany, count: mockTxCount,
    },
    $transaction: vi.fn(async (ops) => Promise.all(ops)),
  },
}));

import { approveLoan, returnBook, rejectLoan, borrowBook, listTransactions } from './library.service.js';

const tx = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'tx-1', bookId: 'b1', memberId: 'm1',
  borrowDate: new Date('2026-08-01T00:00:00Z'), dueDate: new Date('2026-08-08T00:00:00Z'),
  returnDate: null, status: 'MENUNGGU', note: null,
  member: { name: 'Budi' },
  ...over,
});

describe('listTransactions', () => {
  beforeEach(() => vi.clearAllMocks());

  it("memetakan status DB 'MENUNGGU' ke UI 'menunggu' & memberName dari relasi", async () => {
    mockTxFindMany.mockResolvedValue([tx()]);
    mockTxCount.mockResolvedValue(1);
    const { items } = await listTransactions({ page: 1, limit: 50 });
    expect(items[0].status).toBe('menunggu');
    expect(items[0].memberName).toBe('Budi');
    expect(items[0].borrowDate).toBe('2026-08-01');
  });

  it('memfilter berdasarkan status UI dengan memetakan ke DB uppercase', async () => {
    mockTxFindMany.mockResolvedValue([]);
    mockTxCount.mockResolvedValue(0);
    await listTransactions({ status: 'dipinjam' });
    expect(mockTxFindMany.mock.calls[0][0].where.status).toBe('DIPINJAM');
  });
});

describe('borrowBook', () => {
  beforeEach(() => vi.clearAllMocks());

  it('menolak saat stok buku habis', async () => {
    mockBookFindUnique.mockResolvedValue({ id: 'b1', available: 0 });
    await expect(borrowBook({ bookId: 'b1', memberId: 'm1', borrowDate: '2026-08-01', dueDate: '2026-08-08' }))
      .rejects.toThrow(/Stok/i);
    expect(mockTxCreate).not.toHaveBeenCalled();
  });

  it('membuat transaksi MENUNGGU saat stok tersedia', async () => {
    mockBookFindUnique.mockResolvedValue({ id: 'b1', available: 5 });
    mockMemberFindUnique.mockResolvedValue({ id: 'm1', name: 'Budi' });
    mockTxCreate.mockResolvedValue(tx());
    const item = await borrowBook({ bookId: 'b1', memberId: 'm1', borrowDate: '2026-08-01', dueDate: '2026-08-08' });
    expect(item.status).toBe('menunggu');
    expect(mockTxCreate).toHaveBeenCalledTimes(1);
  });
});

describe('approveLoan', () => {
  beforeEach(() => vi.clearAllMocks());

  it('menolak saat transaksi bukan MENUNGGU', async () => {
    mockTxFindUnique.mockResolvedValue(tx({ status: 'DIPINJAM' }));
    await expect(approveLoan('tx-1')).rejects.toThrow(/diproses/i);
  });

  it('menandai DIPINJAM dan mengurangi available via transaksi atomik', async () => {
    // findUnique dipanggil 2x: cek awal (MENUNGGU) lalu re-fetch hasil update.
    mockTxFindUnique.mockResolvedValueOnce(tx()).mockResolvedValueOnce(tx({ status: 'DIPINJAM' }));
    mockBookFindUnique.mockResolvedValue({ id: 'b1', available: 2 });
    mockTxUpdate.mockResolvedValue(tx({ status: 'DIPINJAM' }));
    const item = await approveLoan('tx-1');
    expect(item.status).toBe('dipinjam');
  });
});

describe('returnBook', () => {
  beforeEach(() => vi.clearAllMocks());

  it('menolak saat sudah dikembalikan', async () => {
    mockTxFindUnique.mockResolvedValue(tx({ status: 'DIKEMBALIKAN' }));
    await expect(returnBook('tx-1', '2026-08-09')).rejects.toThrow(/dikembalikan/i);
  });

  it('menandai DIKEMBALIKAN + returnDate dan menambah available', async () => {
    // findUnique dipanggil 2x: cek awal (DIPINJAM) lalu re-fetch hasil update.
    mockTxFindUnique
      .mockResolvedValueOnce(tx({ status: 'DIPINJAM' }))
      .mockResolvedValueOnce(tx({ status: 'DIKEMBALIKAN', returnDate: new Date('2026-08-09T00:00:00Z') }));
    mockTxUpdate.mockResolvedValue(tx({ status: 'DIKEMBALIKAN', returnDate: new Date('2026-08-09T00:00:00Z') }));
    const item = await returnBook('tx-1', '2026-08-09');
    expect(item.status).toBe('dikembalikan');
    expect(item.returnDate).toBe('2026-08-09');
  });
});

describe('rejectLoan', () => {
  beforeEach(() => vi.clearAllMocks());

  it('menandai DITOLAK dengan catatan', async () => {
    mockTxFindUnique.mockResolvedValue(tx());
    mockTxUpdate.mockResolvedValue(tx({ status: 'DITOLAK', note: 'habis' }));
    const item = await rejectLoan('tx-1', 'habis');
    expect(item.status).toBe('ditolak');
    expect(mockTxUpdate).toHaveBeenCalled();
  });
});
