import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { logger, logSecurityEvent } from '../config/logger.js';

/**
 * Registry token tunggal (tabel SessionToken).
 * Mengganti nama TokenBlacklist + ActiveSession dalam SATU tabel:
 * - `revoked = true`  → token pernah di-revoke (blacklist)
 * - `revoked = false` → token masih terdaftar sebagai sesi aktif
 */

/**
 * Check if a token is revoked (blacklisted)
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  try {
    const record = await prisma.sessionToken.findUnique({
      where: { token },
    });

    if (!record || !record.revoked) return false;

    // Token blacklist yang sudah kedaluwarsa dianggap bersih
    // (pembersihan fisik dilakukan scheduler cleanupExpiredTokens).
    if (new Date() > record.expiresAt) return false;

    return true;
  } catch (error) {
    logger.error('Error checking token blacklist', { error: (error as Error).message });
    // Jika database error, fail open (allow token) untuk prevent lockout
    return false;
  }
}

/**
 * Tandai token sebagai revoked (blacklist).
 */
export async function blacklistToken(
  token: string,
  revokedBy?: string,
  reason?: string
): Promise<boolean> {
  try {
    const result = await prisma.sessionToken.updateMany({
      where: { token, revoked: false },
      data: {
        revoked: true,
        revokedBy,
        revokedReason: reason,
        revokedAt: new Date(),
      },
    });

    if (result.count === 0) {
      // Token tidak terdaftar sebagai sesi aktif — sudah pasti tidak bisa dipakai.
      logger.info('Token not registered, no blacklist needed', { token: token.substring(0, 20) });
      return true;
    }

    logSecurityEvent('token_blacklisted', {
      revokedBy,
      reason,
    });

    logger.info('Token blacklisted successfully', {
      revokedBy,
      reason,
    });

    return true;
  } catch (error) {
    logger.error('Error blacklisting token', { error: (error as Error).message });
    return false;
  }
}

/**
 * Daftarkan token ke registry sesi user.
 */
export async function registerSessionToken(
  userId: string,
  token: string,
  expiresAt: Date,
  tokenType: 'access' | 'refresh' = 'access'
): Promise<void> {
  try {
    await prisma.sessionToken.upsert({
      where: { token },
      update: { userId, expiresAt, tokenType },
      create: { userId, token, expiresAt, tokenType },
    });
  } catch (error) {
    logger.error('Error registering session token', {
      error: (error as Error).message,
    });
  }
}

/**
 * Cek apakah token masih terdaftar sebagai sesi aktif (belum di-revoke).
 */
export async function isTokenRegistered(token: string): Promise<boolean> {
  try {
    const session = await prisma.sessionToken.findUnique({
      where: { token },
    });

    if (!session || session.revoked) return false;

    // Bersihkan baris yang sudah kedaluwarsa sambil jalan
    if (new Date() > session.expiresAt) {
      await prisma.sessionToken.delete({ where: { id: session.id } });
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error checking session token', { error: (error as Error).message });
    // Fail open (anggap terdaftar) supaya error DB tidak mengunci semua user
    return true;
  }
}

/**
 * Revoke satu token dari registry (dipakai saat logout biasa).
 */
export async function revokeTokenSession(token: string): Promise<boolean> {
  try {
    const result = await prisma.sessionToken.updateMany({
      where: { token, revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    });
    return result.count > 0;
  } catch (error) {
    logger.error('Error revoking session token', {
      error: (error as Error).message,
    });
    return false;
  }
}

/**
 * Revoke SEMUA sesi aktif milik seorang user.
 * Implementasi nyata dari "logout dari semua perangkat".
 */
export async function revokeAllUserSessions(
  userId: string,
  revokedBy?: string,
  reason?: string
): Promise<number> {
  try {
    const result = await prisma.sessionToken.updateMany({
      where: { userId, revoked: false },
      data: {
        revoked: true,
        revokedBy,
        revokedReason: reason,
        revokedAt: new Date(),
      },
    });

    logSecurityEvent('user_sessions_revoked', {
      userId,
      revokedBy,
      reason,
      count: result.count,
    });

    logger.info('All user sessions revoked', { userId, revokedBy, reason, count: result.count });

    return result.count;
  } catch (error) {
    logger.error('Error revoking all user sessions', {
      error: (error as Error).message,
    });
    return 0;
  }
}

/**
 * Revoke semua token milik user (backward-compatible wrapper).
 */
export async function blacklistUserTokens(userId: string, revokedBy?: string, reason?: string): Promise<number> {
  return revokeAllUserSessions(userId, revokedBy, reason);
}

/**
 * Clean up expired tokens dari registry sesi (Satu tabel SessionToken).
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.sessionToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      logger.info('Cleaned up expired tokens/sessions', { count: result.count });
    }

    return result.count;
  } catch (error) {
    logger.error('Error cleaning up expired tokens', {
      error: (error as Error).message,
    });
    return 0;
  }
}

/**
 * Schedule periodic cleanup of expired tokens
 */
export function scheduleTokenCleanup(intervalMs: number = 60 * 60 * 1000) { // 1 hour default
  const timer = setInterval(async () => {
    try {
      const count = await cleanupExpiredTokens();
      if (count > 0) {
        logger.info('Scheduled token cleanup completed', { count });
      }
    } catch (error) {
      logger.error('Error in scheduled token cleanup', { error: (error as Error).message });
    }
  }, intervalMs);

  timer.unref?.();

  logger.info('Token cleanup scheduled', { interval: `${intervalMs}ms` });
}

/**
 * Get session/revocation statistics
 */
export async function getBlacklistStats() {
  try {
    const now = new Date();
    const [total, expired, active, activeSessions] = await Promise.all([
      prisma.sessionToken.count({ where: { revoked: true } }),
      prisma.sessionToken.count({
        where: {
          revoked: true,
          expiresAt: { lt: now },
        },
      }),
      prisma.sessionToken.count({
        where: {
          revoked: true,
          expiresAt: { gte: now },
        },
      }),
      prisma.sessionToken.count({
        where: {
          revoked: false,
          expiresAt: { gte: now },
        },
      }),
    ]);

    return {
      total,
      expired,
      active,
      activeSessions,
    };
  } catch (error) {
    logger.error('Error getting session stats', { error: (error as Error).message });
    return {
      total: 0,
      expired: 0,
      active: 0,
      activeSessions: 0,
    };
  }
}