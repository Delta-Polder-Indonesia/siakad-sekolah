import { prisma } from '../lib/prisma.js';
import { logger } from '../config/logger.js';

/**
 * Data Retention Policy.
 * Membersihkan data yang sudah melewati batas retensi untuk:
 * - Token blacklist yang sudah kedaluwarsa
 * - Audit log PPDB yang sudah lama
 * - Notifikasi PPDB yang sudah dibaca dan lama
 * - Log library transactions yang sudah selesai dan lama
 */

export interface RetentionConfig {
  tokenBlacklistDays: number;
  ppdbAuditLogDays: number;
  ppdbReadNotificationDays: number;
  libraryCompletedDays: number;
  likesDays: number;
}

/**
 * Default retention period (dalam hari)
 */
export const DEFAULT_RETENTION: RetentionConfig = {
  tokenBlacklistDays: 7,        // token blacklist disimpan maksimal 7 hari setelah expiry
  ppdbAuditLogDays: 365,        // audit log PPDB disimpan 1 tahun
  ppdbReadNotificationDays: 90, // notifikasi terbaca disimpan 3 bulan
  libraryCompletedDays: 180,    // transaksi perpustakaan selesai disimpan 6 bulan
  likesDays: 0,                 // likes tidak dihapus otomatis (disimpan permanen)
};

export function resolveRetentionConfig(env?: Partial<RetentionConfig>): RetentionConfig {
  return {
    tokenBlacklistDays: Number(env?.tokenBlacklistDays ?? DEFAULT_RETENTION.tokenBlacklistDays),
    ppdbAuditLogDays: Number(env?.ppdbAuditLogDays ?? DEFAULT_RETENTION.ppdbAuditLogDays),
    ppdbReadNotificationDays: Number(env?.ppdbReadNotificationDays ?? DEFAULT_RETENTION.ppdbReadNotificationDays),
    libraryCompletedDays: Number(env?.libraryCompletedDays ?? DEFAULT_RETENTION.libraryCompletedDays),
    likesDays: Number(env?.likesDays ?? DEFAULT_RETENTION.likesDays),
  };
}

function cutoffFromDays(days: number): Date {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return cutoff;
}

/**
 * Bersihkan data kedaluwarsa sesuai kebijakan retensi.
 * Mengembalikan jumlah record yang dihapus per kategori.
 */
export async function runDataRetention(
  config: RetentionConfig = resolveRetentionConfig()
): Promise<Record<string, number>> {
  const result: Record<string, number> = {};

  // 1. Token blacklist yang sudah kedaluwarsa
  if (config.tokenBlacklistDays >= 0) {
    try {
      const cutoff = cutoffFromDays(config.tokenBlacklistDays);
      const res = await prisma.tokenBlacklist.deleteMany({
        where: { expiresAt: { lt: cutoff } },
      });
      result.tokenBlacklist = res.count;
    } catch (error) {
      logger.error('Retention: gagal bersihkan token blacklist', {
        error: (error as Error).message,
      });
    }
  }

  // 2. Audit log PPDB lama
  if (config.ppdbAuditLogDays > 0) {
    try {
      const cutoff = cutoffFromDays(config.ppdbAuditLogDays);
      const res = await prisma.pPDBAuditLog.deleteMany({
        where: { occurredAt: { lt: cutoff } },
      });
      result.ppdbAuditLog = res.count;
    } catch (error) {
      logger.error('Retention: gagal bersihkan audit log PPDB', {
        error: (error as Error).message,
      });
    }
  }

  // 3. Notifikasi PPDB yang sudah dibaca dan lama
  if (config.ppdbReadNotificationDays > 0) {
    try {
      const cutoff = cutoffFromDays(config.ppdbReadNotificationDays);
      const res = await prisma.pPDBNotification.deleteMany({
        where: { isRead: true, createdAt: { lt: cutoff } },
      });
      result.ppdbNotification = res.count;
    } catch (error) {
      logger.error('Retention: gagal bersihkan notifikasi PPDB', {
        error: (error as Error).message,
      });
    }
  }

  // 4. Transaksi perpustakaan yang sudah selesai dan lama
  if (config.libraryCompletedDays > 0) {
    try {
      const cutoff = cutoffFromDays(config.libraryCompletedDays);
      const res = await prisma.libraryTransaction.deleteMany({
        where: {
          status: 'DIKEMBALIKAN',
          returnDate: { lt: cutoff },
        },
      });
      result.libraryTransaction = res.count;
    } catch (error) {
      logger.error('Retention: gagal bersihkan transaksi perpustakaan', {
        error: (error as Error).message,
      });
    }
  }

  return result;
}

/**
 * Jadwalkan pembersihan data retensi secara periodik.
 */
export function scheduleDataRetention(
  intervalMs: number = 24 * 60 * 60 * 1000, // 24 jam default
  config?: RetentionConfig
): NodeJS.Timeout {
  const run = async () => {
    try {
      const result = await runDataRetention(config);
      const total = Object.values(result).reduce((sum, n) => sum + n, 0);
      if (total > 0) {
        logger.info('Scheduled data retention completed', { result });
      }
    } catch (error) {
      logger.error('Error in scheduled data retention', {
        error: (error as Error).message,
      });
    }
  };

  const timer = setInterval(run, intervalMs);
  run();
  logger.info('Data retention scheduled', { interval: `${intervalMs}ms` });
  return timer;
}
