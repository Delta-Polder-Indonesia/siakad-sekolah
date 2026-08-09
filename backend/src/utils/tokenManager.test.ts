import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '../lib/prisma.js';
import {
  registerSessionToken,
  isTokenRegistered,
  revokeTokenSession,
  revokeAllUserSessions,
  blacklistUserTokens,
  cleanupExpiredTokens,
  getBlacklistStats,
} from './tokenManager.js';

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    sessionToken: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

const mockSession = () => prisma.sessionToken as unknown as {
  upsert: ReturnType<typeof vi.fn>;
  findUnique: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  deleteMany: ReturnType<typeof vi.fn>;
  updateMany: ReturnType<typeof vi.fn>;
  count: ReturnType<typeof vi.fn>;
};

describe('tokenManager — registry sesi (SessionToken)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerSessionToken', () => {
    it('harus mendaftarkan token lewat upsert (create)', async () => {
      mockSession().upsert.mockResolvedValue({ id: 's1' });
      const expiresAt = new Date(Date.now() + 60_000);

      await registerSessionToken('user-1', 'token-access', expiresAt, 'access');

      expect(mockSession().upsert).toHaveBeenCalledWith({
        where: { token: 'token-access' },
        update: { userId: 'user-1', expiresAt, tokenType: 'access' },
        create: { userId: 'user-1', token: 'token-access', expiresAt, tokenType: 'access' },
      });
    });

    it('tidak melempar error ketika DB gagal (log saja)', async () => {
      mockSession().upsert.mockRejectedValue(new Error('db down'));

      await expect(
        registerSessionToken('user-1', 'token-access', new Date(), 'access')
      ).resolves.toBeUndefined();
    });
  });

  describe('isTokenRegistered', () => {
    it('return true untuk token yang terdaftar & belum kedaluwarsa', async () => {
      mockSession().findUnique.mockResolvedValue({
        id: 's1',
        token: 't',
        revoked: false,
        expiresAt: new Date(Date.now() + 60_000),
      });

      await expect(isTokenRegistered('t')).resolves.toBe(true);
    });

    it('return false untuk token yang tidak terdaftar', async () => {
      mockSession().findUnique.mockResolvedValue(null);

      await expect(isTokenRegistered('t')).resolves.toBe(false);
    });

    it('return false untuk token yang sudah di-revoke', async () => {
      mockSession().findUnique.mockResolvedValue({
        id: 's1',
        token: 't',
        revoked: true,
        expiresAt: new Date(Date.now() + 60_000),
      });

      await expect(isTokenRegistered('t')).resolves.toBe(false);
    });

    it('return false dan menghapus baris untuk token yang sudah kedaluwarsa', async () => {
      mockSession().findUnique.mockResolvedValue({
        id: 's1',
        token: 't',
        revoked: false,
        expiresAt: new Date(Date.now() - 60_000),
      });
      mockSession().delete.mockResolvedValue({});

      await expect(isTokenRegistered('t')).resolves.toBe(false);
      expect(mockSession().delete).toHaveBeenCalledWith({ where: { id: 's1' } });
    });

    it('fail-open (return true) ketika query DB error', async () => {
      mockSession().findUnique.mockRejectedValue(new Error('db down'));

      await expect(isTokenRegistered('t')).resolves.toBe(true);
    });
  });

  describe('revokeTokenSession', () => {
    it('menandai token sebagai revoked dan return true', async () => {
      mockSession().updateMany.mockResolvedValue({ count: 1 });

      await expect(revokeTokenSession('t')).resolves.toBe(true);
      expect(mockSession().updateMany).toHaveBeenCalledWith({
        where: { token: 't', revoked: false },
        data: expect.objectContaining({ revoked: true, revokedAt: expect.any(Date) }),
      });
    });

    it('return false ketika token tidak ditemukan', async () => {
      mockSession().updateMany.mockResolvedValue({ count: 0 });

      await expect(revokeTokenSession('t')).resolves.toBe(false);
    });
  });

  describe('revokeAllUserSessions / blacklistUserTokens', () => {
    it('merevoke semua sesi milik user dan mengembalikan jumlahnya', async () => {
      mockSession().updateMany.mockResolvedValue({ count: 3 });

      const count = await revokeAllUserSessions('user-1', 'user-1', 'Logout from all devices');

      expect(count).toBe(3);
      expect(mockSession().updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revoked: false },
        data: expect.objectContaining({
          revoked: true,
          revokedBy: 'user-1',
          revokedReason: 'Logout from all devices',
          revokedAt: expect.any(Date),
        }),
      });
    });

    it('blacklistUserTokens mendelegasikan ke revokeAllUserSessions', async () => {
      mockSession().updateMany.mockResolvedValue({ count: 2 });

      const count = await blacklistUserTokens('user-1');

      expect(count).toBe(2);
      expect(mockSession().updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revoked: false },
        data: expect.objectContaining({ revoked: true, revokedAt: expect.any(Date) }),
      });
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('membersihkan token sesi yang kedaluwarsa', async () => {
      mockSession().deleteMany.mockResolvedValue({ count: 10 });

      const result = await cleanupExpiredTokens();

      expect(result).toBe(10);
      expect(mockSession().deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lt: expect.any(Date),
          },
        },
      });
    });
  });

  describe('getBlacklistStats', () => {
    it('menyertakan jumlah sesi aktif', async () => {
      mockSession().count
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(11);

      const stats = await getBlacklistStats();

      expect(stats).toEqual({
        total: 5,
        expired: 2,
        active: 3,
        activeSessions: 11,
      });
    });
  });
});