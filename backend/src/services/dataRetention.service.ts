import { prisma } from '../lib/prisma.js';
import { logger } from '../config/logger.js';

/**
 * Data Retention Configuration
 * Define retention periods for different data types
 */
const RETENTION_CONFIG = {
  // Token blacklist - clean up expired tokens immediately
  tokenBlacklist: {
    enabled: true,
    cleanupExpired: true, // Clean up expired tokens
  },
  
  // PPDB Audit logs - retain for 1 year
  ppdbAuditLog: {
    enabled: true,
    retentionDays: 365,
  },
  
  // PPDB Notifications - retain for 90 days after read
  ppdbNotification: {
    enabled: true,
    retentionDays: 90,
    onlyRead: true, // Only delete read notifications
  },
  
  // Attendance - retain for 5 years (for historical records)
  attendance: {
    enabled: true,
    retentionDays: 1825, // 5 years
  },
  
  // Library Transactions - retain completed for 2 years
  libraryTransaction: {
    enabled: true,
    retentionDays: 730, // 2 years
    onlyCompleted: true, // Only delete completed transactions
  },
  
  // Surat Izin - retain for 1 year
  suratIzin: {
    enabled: true,
    retentionDays: 365,
    onlyApproved: true, // Only delete approved/processed requests
  },
  
  // Assignment Submissions - retain for 3 years
  assignmentSubmission: {
    enabled: true,
    retentionDays: 1095, // 3 years
  },
} as const;

/**
 * Data Retention Service
 * Handles cleanup and archival of old data based on retention policies
 */
export class DataRetentionService {
  /**
   * Run all data retention tasks
   */
  static async runAllRetentionTasks() {
    logger.info('Starting data retention tasks');
    
    const results = {
      tokenBlacklist: 0,
      ppdbAuditLog: 0,
      ppdbNotification: 0,
      attendance: 0,
      libraryTransaction: 0,
      suratIzin: 0,
      assignmentSubmission: 0,
    };
    
    try {
      // Clean up expired tokens
      if (RETENTION_CONFIG.tokenBlacklist.enabled && RETENTION_CONFIG.tokenBlacklist.cleanupExpired) {
        results.tokenBlacklist = await this.cleanupExpiredTokens();
      }
      
      // Clean up old PPDB audit logs
      if (RETENTION_CONFIG.ppdbAuditLog.enabled) {
        results.ppdbAuditLog = await this.cleanupOldPPDBAuditLogs();
      }
      
      // Clean up old PPDB notifications
      if (RETENTION_CONFIG.ppdbNotification.enabled) {
        results.ppdbNotification = await this.cleanupOldPPDBNotifications();
      }
      
      // Clean up old attendance records
      if (RETENTION_CONFIG.attendance.enabled) {
        results.attendance = await this.cleanupOldAttendance();
      }
      
      // Clean up old library transactions
      if (RETENTION_CONFIG.libraryTransaction.enabled) {
        results.libraryTransaction = await this.cleanupOldLibraryTransactions();
      }
      
      // Clean up old surat izin
      if (RETENTION_CONFIG.suratIzin.enabled) {
        results.suratIzin = await this.cleanupOldSuratIzin();
      }
      
      // Clean up old assignment submissions
      if (RETENTION_CONFIG.assignmentSubmission.enabled) {
        results.assignmentSubmission = await this.cleanupOldAssignmentSubmissions();
      }
      
      logger.info('Data retention tasks completed', { results });
      return results;
    } catch (error) {
      logger.error('Error running data retention tasks', { error: (error as Error).message });
      throw error;
    }
  }
  
  /**
   * Clean up expired tokens from blacklist
   */
  static async cleanupExpiredTokens(): Promise<number> {
    const now = new Date();
    
    const result = await prisma.tokenBlacklist.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    
    logger.info(`Cleaned up ${result.count} expired tokens from blacklist`);
    return result.count;
  }
  
  /**
   * Clean up old PPDB audit logs
   */
  static async cleanupOldPPDBAuditLogs(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_CONFIG.ppdbAuditLog.retentionDays);
    
    const result = await prisma.pPDBAuditLog.deleteMany({
      where: {
        occurredAt: {
          lt: cutoffDate,
        },
      },
    });
    
    logger.info(`Cleaned up ${result.count} old PPDB audit logs`);
    return result.count;
  }
  
  /**
   * Clean up old PPDB notifications
   */
  static async cleanupOldPPDBNotifications(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_CONFIG.ppdbNotification.retentionDays);
    
    const whereClause: any = {
      createdAt: {
        lt: cutoffDate,
      },
    };
    
    if (RETENTION_CONFIG.ppdbNotification.onlyRead) {
      whereClause.isRead = true;
    }
    
    const result = await prisma.pPDBNotification.deleteMany({
      where: whereClause,
    });
    
    logger.info(`Cleaned up ${result.count} old PPDB notifications`);
    return result.count;
  }
  
  /**
   * Clean up old attendance records
   */
  static async cleanupOldAttendance(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_CONFIG.attendance.retentionDays);
    
    const result = await prisma.attendance.deleteMany({
      where: {
        date: {
          lt: cutoffDate,
        },
      },
    });
    
    logger.info(`Cleaned up ${result.count} old attendance records`);
    return result.count;
  }
  
  /**
   * Clean up old library transactions
   */
  static async cleanupOldLibraryTransactions(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_CONFIG.libraryTransaction.retentionDays);
    
    const whereClause: any = {
      updatedAt: {
        lt: cutoffDate,
      },
    };
    
    if (RETENTION_CONFIG.libraryTransaction.onlyCompleted) {
      whereClause.status = {
        in: ['DIKEMBALIKAN', 'TERLAMBAT', 'DITOLAK'],
      };
    }
    
    const result = await prisma.libraryTransaction.deleteMany({
      where: whereClause,
    });
    
    logger.info(`Cleaned up ${result.count} old library transactions`);
    return result.count;
  }
  
  /**
   * Clean up old surat izin
   */
  static async cleanupOldSuratIzin(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_CONFIG.suratIzin.retentionDays);
    
    const whereClause: any = {
      updatedAt: {
        lt: cutoffDate,
      },
    };
    
    if (RETENTION_CONFIG.suratIzin.onlyApproved) {
      whereClause.status = {
        in: ['DISETUJUI', 'DITOLAK'],
      };
    }
    
    const result = await prisma.suratIzin.deleteMany({
      where: whereClause,
    });
    
    logger.info(`Cleaned up ${result.count} old surat izin`);
    return result.count;
  }
  
  /**
   * Clean up old assignment submissions
   */
  static async cleanupOldAssignmentSubmissions(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_CONFIG.assignmentSubmission.retentionDays);
    
    const result = await prisma.assignmentSubmission.deleteMany({
      where: {
        submittedAt: {
          lt: cutoffDate,
        },
      },
    });
    
    logger.info(`Cleaned up ${result.count} old assignment submissions`);
    return result.count;
  }
  
  /**
   * Get data retention statistics
   */
  static async getRetentionStats() {
    const now = new Date();
    
    // Count records that would be cleaned up
    const tokenBlacklistCount = await prisma.tokenBlacklist.count({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    
    const ppdbAuditLogCutoff = new Date();
    ppdbAuditLogCutoff.setDate(ppdbAuditLogCutoff.getDate() - RETENTION_CONFIG.ppdbAuditLog.retentionDays);
    const ppdbAuditLogCount = await prisma.pPDBAuditLog.count({
      where: {
        occurredAt: {
          lt: ppdbAuditLogCutoff,
        },
      },
    });
    
    const ppdbNotificationCutoff = new Date();
    ppdbNotificationCutoff.setDate(ppdbNotificationCutoff.getDate() - RETENTION_CONFIG.ppdbNotification.retentionDays);
    const ppdbNotificationWhere: any = {
      createdAt: {
        lt: ppdbNotificationCutoff,
      },
    };
    if (RETENTION_CONFIG.ppdbNotification.onlyRead) {
      ppdbNotificationWhere.isRead = true;
    }
    const ppdbNotificationCount = await prisma.pPDBNotification.count({
      where: ppdbNotificationWhere,
    });
    
    return {
      tokenBlacklist: tokenBlacklistCount,
      ppdbAuditLog: ppdbAuditLogCount,
      ppdbNotification: ppdbNotificationCount,
      config: RETENTION_CONFIG,
    };
  }
  
  /**
   * Archive data before deletion (optional implementation)
   * This would export data to a backup system before deletion
   */
  static async archiveData(modelName: string, records: any[]) {
    // Implementation depends on your archival strategy
    // Could export to JSON files, cloud storage, or archival database
    logger.info(`Archiving ${records.length} records from ${modelName}`);
    
    // Example: Write to archival storage
    // await archivalStorage.save(`${modelName}_${Date.now()}.json`, records);
    
    return true;
  }
}

/**
 * Scheduled task runner for data retention
 * Can be called by a cron job or scheduled task
 */
export async function runScheduledDataRetention() {
  try {
    logger.info('Running scheduled data retention');
    const results = await DataRetentionService.runAllRetentionTasks();
    logger.info('Scheduled data retention completed successfully', { results });
    return results;
  } catch (error) {
    logger.error('Scheduled data retention failed', { error: (error as Error).message });
    throw error;
  }
}