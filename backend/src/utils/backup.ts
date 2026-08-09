import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import { promises as fs } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Backup configuration
 */
const BACKUP_CONFIG = {
  directory: process.env.BACKUP_DIR || './backups',
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '7'),
  prefix: 'absensi_backup',
};

/** Deteksi provider database dari DATABASE_URL. */
function isSqlite(): boolean {
  const url = env.DATABASE_URL.toLowerCase();
  return url.startsWith('file:') || url.startsWith('sqlite:') || url.endsWith('.db');
}

/**
 * Resolve lokasi file database SQLite.
 * URL Prisma sqlite biasanya `file:./dev.db` — resolve relatif ke folder
 * prisma/ (lokasi schema.prisma) dengan fallback ke CWD.
 */
async function resolveSqliteDbPath(): Promise<string> {
  const raw = env.DATABASE_URL.replace(/^(file|sqlite):/i, '');
  const candidates = [
    raw,
    path.resolve(raw),
    path.resolve('prisma', raw),
    path.resolve('prisma', raw.replace(/^\.\//, '')),
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Lanjut cek kandidat berikutnya
    }
  }

  return candidates[0];
}

/**
 * Generate backup filename dengan timestamp
 */
function generateBackupFilename(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T').join('_');
  const ext = isSqlite() ? '.db' : '.sql';
  return `${BACKUP_CONFIG.prefix}_${timestamp}${ext}`;
}

/**
 * Ensure backup directory exists
 */
async function ensureBackupDirectory(): Promise<void> {
  try {
    await fs.mkdir(BACKUP_CONFIG.directory, { recursive: true });
    logger.info('Backup directory ensured', { directory: BACKUP_CONFIG.directory });
  } catch (error) {
    logger.error('Failed to create backup directory', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Create database backup using pg_dump
 */
export async function createBackup(): Promise<{
  success: boolean;
  filename?: string;
  path?: string;
  size?: number;
  duration?: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    await ensureBackupDirectory();
    
    const filename = generateBackupFilename();
    const backupPath = path.join(BACKUP_CONFIG.directory, filename);
    
    logger.info('Starting database backup', { filename, path: backupPath });

    if (isSqlite()) {
      const dbPath = await resolveSqliteDbPath();
      await fs.copyFile(dbPath, backupPath);
    } else {
      const pgDumpCommand = `pg_dump ${env.DATABASE_URL} > "${backupPath}"`;
      const { stderr } = await execAsync(pgDumpCommand);

      if (stderr) {
        logger.warn('pg_dump stderr output', { stderr });
      }
    }
    
    // Check if backup file was created
    const stats = await fs.stat(backupPath);
    const duration = Date.now() - startTime;
    
    logger.info('Database backup completed', {
      filename,
      path: backupPath,
      size: stats.size,
      duration: `${duration}ms`,
    });
    
    return {
      success: true,
      filename,
      path: backupPath,
      size: stats.size,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error('Database backup failed', {
      error: errorMessage,
      duration: `${duration}ms`,
    });
    
    return {
      success: false,
      error: errorMessage,
      duration,
    };
  }
}

/**
 * Keamanan: hanya nama file backup hasil generate yang boleh dipakai.
 * Mencegah path traversal (`../../etc/passwd`) lewat parameter URL.
 */
const BACKUP_FILENAME_PATTERN = /^absensi_backup_[\w.-]+\.(?:sql|db)$/;

function isSafeBackupFilename(filename: string): boolean {
  if (typeof filename !== 'string' || !BACKUP_FILENAME_PATTERN.test(filename)) {
    return false;
  }
  const dir = path.resolve(BACKUP_CONFIG.directory);
  const resolved = path.resolve(dir, filename);
  return resolved.startsWith(dir + path.sep);
}

/**
 * Restore database from backup file
 */
export async function restoreBackup(backupFilename: string): Promise<{
  success: boolean;
  error?: string;
  duration?: number;
}> {
  const startTime = Date.now();

  try {
    if (!isSafeBackupFilename(backupFilename)) {
      return {
        success: false,
        error: 'Nama file backup tidak valid.',
        duration: Date.now() - startTime,
      };
    }

    const backupPath = path.join(BACKUP_CONFIG.directory, backupFilename);
    
    // Check if backup file exists
    await fs.access(backupPath);
    
    logger.info('Starting database restore', { backupFilename, path: backupPath });

    if (isSqlite()) {
      const dbPath = await resolveSqliteDbPath();
      await fs.copyFile(backupPath, dbPath);
    } else {
      const restoreCommand = `psql ${env.DATABASE_URL} < "${backupPath}"`;
      const { stderr } = await execAsync(restoreCommand);

      if (stderr) {
        logger.warn('psql stderr output', { stderr });
      }
    }
    
    const duration = Date.now() - startTime;
    
    logger.info('Database restore completed', {
      backupFilename,
      duration: `${duration}ms`,
    });
    
    return {
      success: true,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error('Database restore failed', {
      error: errorMessage,
      backupFilename,
      duration: `${duration}ms`,
    });
    
    return {
      success: false,
      error: errorMessage,
      duration,
    };
  }
}

/**
 * List all backup files
 */
export async function listBackups(): Promise<{
  success: boolean;
  backups?: Array<{
    filename: string;
    path: string;
    size: number;
    createdAt: Date;
  }>;
  error?: string;
}> {
  try {
    const files = await fs.readdir(BACKUP_CONFIG.directory);
    const backupFiles = files.filter(
      (file) =>
        file.startsWith(BACKUP_CONFIG.prefix) &&
        (file.endsWith('.sql') || file.endsWith('.db'))
    );
    
    const backups = await Promise.all(
      backupFiles.map(async (filename) => {
        const filePath = path.join(BACKUP_CONFIG.directory, filename);
        const stats = await fs.stat(filePath);
        
        return {
          filename,
          path: filePath,
          size: stats.size,
          createdAt: stats.mtime,
        };
      })
    );
    
    // Sort by creation date, newest first
    backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return {
      success: true,
      backups,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error('Failed to list backups', { error: errorMessage });
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Delete old backups berdasarkan retention policy
 */
export async function cleanupOldBackups(): Promise<{
  success: boolean;
  deleted: number;
  freedSpace: number;
  error?: string;
}> {
  try {
    const result = await listBackups();
    
    if (!result.success || !result.backups) {
      return {
        success: false,
        deleted: 0,
        freedSpace: 0,
        error: result.error || 'Failed to list backups',
      };
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - BACKUP_CONFIG.retentionDays);
    
    let deleted = 0;
    let freedSpace = 0;
    
    for (const backup of result.backups) {
      if (backup.createdAt < cutoffDate) {
        await fs.unlink(backup.path);
        deleted++;
        freedSpace += backup.size;
        
        logger.info('Deleted old backup', {
          filename: backup.filename,
          createdAt: backup.createdAt,
          size: backup.size,
        });
      }
    }
    
    logger.info('Backup cleanup completed', {
      deleted,
      freedSpace,
      retentionDays: BACKUP_CONFIG.retentionDays,
    });
    
    return {
      success: true,
      deleted,
      freedSpace,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error('Backup cleanup failed', { error: errorMessage });
    
    return {
      success: false,
      deleted: 0,
      freedSpace: 0,
      error: errorMessage,
    };
  }
}

/**
 * Verify backup integrity by checking file exists dan is not empty
 */
export async function verifyBackup(backupFilename: string): Promise<{
  success: boolean;
  valid: boolean;
  error?: string;
}> {
  try {
    if (!isSafeBackupFilename(backupFilename)) {
      return {
        success: false,
        valid: false,
        error: 'Nama file backup tidak valid.',
      };
    }

    const backupPath = path.join(BACKUP_CONFIG.directory, backupFilename);
    const stats = await fs.stat(backupPath);
    
    if (stats.size === 0) {
      return {
        success: true,
        valid: false,
        error: 'Backup file is empty',
      };
    }

    // File SQLite adalah biner — cukup cek ukuran.
    if (backupFilename.endsWith('.db') || isSqlite()) {
      logger.info('Backup verification passed', { filename: backupFilename, size: stats.size });
      return {
        success: true,
        valid: true,
      };
    }

    // Check if file contains expected SQL content
    const content = await fs.readFile(backupPath, 'utf-8');
    if (!content.includes('CREATE TABLE') && !content.includes('INSERT INTO')) {
      return {
        success: true,
        valid: false,
        error: 'Backup file does not contain expected SQL content',
      };
    }
    
    logger.info('Backup verification passed', { filename: backupFilename, size: stats.size });
    
    return {
      success: true,
      valid: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error('Backup verification failed', { error: errorMessage, filename: backupFilename });
    
    return {
      success: false,
      valid: false,
      error: errorMessage,
    };
  }
}

/**
 * Get backup statistics
 */
export async function getBackupStats(): Promise<{
  success: boolean;
  totalBackups: number;
  totalSize: number;
  oldestBackup?: Date;
  newestBackup?: Date;
  error?: string;
}> {
  try {
    const result = await listBackups();
    
    if (!result.success || !result.backups) {
      return {
        success: false,
        totalBackups: 0,
        totalSize: 0,
        error: result.error || 'Failed to list backups',
      };
    }
    
    const backups = result.backups;
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
    
    return {
      success: true,
      totalBackups: backups.length,
      totalSize,
      oldestBackup: backups[backups.length - 1]?.createdAt,
      newestBackup: backups[0]?.createdAt,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error('Failed to get backup stats', { error: errorMessage });
    
    return {
      success: false,
      totalBackups: 0,
      totalSize: 0,
      error: errorMessage,
    };
  }
}

/**
 * Schedule automated backups
 */
export function scheduleBackup(intervalMs: number = 24 * 60 * 60 * 1000) { // 24 hours default
  const backupFunction = async () => {
    try {
      logger.info('Scheduled backup started');
      
      const result = await createBackup();
      
      if (result.success) {
        // Verify backup
        if (result.filename) {
          const verification = await verifyBackup(result.filename);
          if (!verification.valid) {
            logger.error('Backup verification failed', { filename: result.filename });
          }
        }
        
        // Cleanup old backups
        await cleanupOldBackups();
      } else {
        logger.error('Scheduled backup failed', { error: result.error });
      }
    } catch (error) {
      logger.error('Error in scheduled backup', { error: (error as Error).message });
    }
  };
  
  // Run immediately, then schedule
  backupFunction();
  
  setInterval(backupFunction, intervalMs);
  
  logger.info('Automated backup scheduled', { interval: `${intervalMs}ms` });
}