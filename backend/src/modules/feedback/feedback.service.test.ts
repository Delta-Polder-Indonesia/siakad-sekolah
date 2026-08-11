/**
 * Unit test pagination listFeedback (perf: endpoint tidak lagi memuat
 * seluruh baris feedback tanpa batas).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockFindMany = vi.hoisted(() => vi.fn());
const mockCount = vi.hoisted(() => vi.fn());

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    feedback: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { listFeedback } from './feedback.service.js';

const fakeRow = (id: string) => ({
  id,
  name: 'Pengguna',
  email: null,
  role: 'guest',
  category: 'saran',
  subject: 'Subjek',
  message: 'Pesan panjang',
  priority: 'sedang',
  status: 'pending',
  rating: 4,
  avatar: null,
  adminNotes: null,
  processedAt: null,
  submittedAt: new Date('2026-08-01T00:00:00Z'),
  likes: 0,
  likedBy: '[]',
  createdAt: new Date('2026-08-01T00:00:00Z'),
  updatedAt: new Date('2026-08-01T00:00:00Z'),
});

describe('listFeedback (pagination)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('memakai skip/take sesuai halaman & limit', async () => {
    mockFindMany.mockResolvedValue([fakeRow('a'), fakeRow('b')]);
    mockCount.mockResolvedValue(42);

    const result = await listFeedback(3, 10);

    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { submittedAt: 'desc' },
      skip: 20,
      take: 10,
    });
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(42);
    expect(result.page).toBe(3);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(5); // ceil(42/10)
  });

  it('memakai default page=1 & limit=20 saat tidak dikirim', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const result = await listFeedback();

    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { submittedAt: 'desc' },
      skip: 0,
      take: 20,
    });
    expect(result.totalPages).toBe(1);
  });

  it('membatasi limit maksimal 100 & menolak page < 1', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const result = await listFeedback(0, 999);
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { submittedAt: 'desc' },
      skip: 0,
      take: 100,
    });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(100);
  });

  it('men-serialize likedBy JSON ke array', async () => {
    const row = fakeRow('x');
    row.likedBy = '["u1","u2"]';
    mockFindMany.mockResolvedValue([row]);
    mockCount.mockResolvedValue(1);

    const result = await listFeedback(1, 20);
    expect(result.items[0].likedBy).toEqual(['u1', 'u2']);
  });
});
