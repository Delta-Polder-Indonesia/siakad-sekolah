import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockSessionTokenDeleteMany,
  mockPPDBAuditLogDeleteMany,
  mockPPDBNotificationDeleteMany,
  mockLibraryTransactionDeleteMany,
} = vi.hoisted(() => ({
  mockSessionTokenDeleteMany: vi.fn(),
  mockPPDBAuditLogDeleteMany: vi.fn(),
  mockPPDBNotificationDeleteMany: vi.fn(),
  mockLibraryTransactionDeleteMany: vi.fn(),
}));

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    sessionToken: {
      deleteMany: mockSessionTokenDeleteMany,
    },
    pPDBAuditLog: {
      deleteMany: mockPPDBAuditLogDeleteMany,
    },
    pPDBNotification: {
      deleteMany: mockPPDBNotificationDeleteMany,
    },
    libraryTransaction: {
      deleteMany: mockLibraryTransactionDeleteMany,
    },
  },
}));

const { runDataRetention, resolveRetentionConfig, DEFAULT_RETENTION } =
  await import('../utils/retention.js');

describe('Data Retention Policy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionTokenDeleteMany.mockResolvedValue({ count: 5 });
    mockPPDBAuditLogDeleteMany.mockResolvedValue({ count: 10 });
    mockPPDBNotificationDeleteMany.mockResolvedValue({ count: 3 });
    mockLibraryTransactionDeleteMany.mockResolvedValue({ count: 8 });
  });

  it('resolveRetentionConfig harus mengembalikan default config', () => {
    const config = resolveRetentionConfig();
    expect(config).toEqual(DEFAULT_RETENTION);
  });

  it('resolveRetentionConfig harus override hanya field yang diberikan', () => {
    const config = resolveRetentionConfig({ ppdbAuditLogDays: 30 });
    expect(config.ppdbAuditLogDays).toBe(30);
    expect(config.tokenBlacklistDays).toBe(DEFAULT_RETENTION.tokenBlacklistDays);
  });

  it('runDataRetention harus membersihkan semua kategori sesuai retensi', async () => {
    const result = await runDataRetention();
    expect(result).toEqual({
      tokenBlacklist: 5,
      ppdbAuditLog: 10,
      ppdbNotification: 3,
      libraryTransaction: 8,
    });
    expect(mockSessionTokenDeleteMany).toHaveBeenCalledOnce();
    expect(mockPPDBAuditLogDeleteMany).toHaveBeenCalledOnce();
    expect(mockPPDBNotificationDeleteMany).toHaveBeenCalledOnce();
    expect(mockLibraryTransactionDeleteMany).toHaveBeenCalledOnce();
  });

  it('runDataRetention harus memfilter notifikasi yang sudah dibaca & lama', async () => {
    await runDataRetention();
    const where = mockPPDBNotificationDeleteMany.mock.calls[0][0].where;
    expect(where.isRead).toBe(true);
    expect(where.createdAt.lt).toBeInstanceOf(Date);
  });

  it('runDataRetention harus memfilter transaksi yang sudah DIKEMBALIKAN', async () => {
    await runDataRetention();
    const where = mockLibraryTransactionDeleteMany.mock.calls[0][0].where;
    expect(where.status).toBe('DIKEMBALIKAN');
    expect(where.returnDate.lt).toBeInstanceOf(Date);
  });

  it('runDataRetention harus tetap jalan walau satu kategori error', async () => {
    mockSessionTokenDeleteMany.mockRejectedValue(new Error('DB down'));
    const result = await runDataRetention();
    expect(result.tokenBlacklist).toBeUndefined();
    expect(result.ppdbAuditLog).toBe(10);
  });

  it('runDataRetention tidak menghapus likes (disimpan permanen)', async () => {
    const result = await runDataRetention();
    expect(result).not.toHaveProperty('likes');
  });
});
