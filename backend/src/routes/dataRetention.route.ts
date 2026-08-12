import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { DataRetentionService, runScheduledDataRetention } from '../services/dataRetention.service.js';
import { logger } from '../config/logger.js';

export const dataRetentionRouter = Router();

/**
 * Run data retention tasks manually (Admin only)
 */
dataRetentionRouter.post('/run', requireAuth, requireAdmin, async (_req, res) => {
  try {
    logger.info('Manual data retention triggered by admin');
    const results = await DataRetentionService.runAllRetentionTasks();
    
    res.json({
      ok: true,
      message: 'Data retention tasks completed',
      results,
    });
  } catch (error) {
    logger.error('Manual data retention failed', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Data retention failed',
      error: (error as Error).message,
    });
  }
});

/**
 * Get data retention statistics (Admin only)
 */
dataRetentionRouter.get('/stats', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const stats = await DataRetentionService.getRetentionStats();
    
    res.json({
      ok: true,
      stats,
    });
  } catch (error) {
    logger.error('Failed to get retention stats', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Failed to get retention stats',
      error: (error as Error).message,
    });
  }
});

/**
 * Get retention configuration (Admin only)
 */
dataRetentionRouter.get('/config', requireAuth, requireAdmin, async (_req, res) => {
  try {
    res.json({
      ok: true,
      config: {
        tokenBlacklist: {
          enabled: true,
          cleanupExpired: true,
        },
        ppdbAuditLog: {
          enabled: true,
          retentionDays: 365,
        },
        ppdbNotification: {
          enabled: true,
          retentionDays: 90,
          onlyRead: true,
        },
        attendance: {
          enabled: true,
          retentionDays: 1825, // 5 years
        },
        libraryTransaction: {
          enabled: true,
          retentionDays: 730, // 2 years
          onlyCompleted: true,
        },
        suratIzin: {
          enabled: true,
          retentionDays: 365,
          onlyApproved: true,
        },
        assignmentSubmission: {
          enabled: true,
          retentionDays: 1095, // 3 years
        },
      },
    });
  } catch (error) {
    logger.error('Failed to get retention config', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Failed to get retention config',
      error: (error as Error).message,
    });
  }
});

/**
 * Run specific retention task (Admin only)
 */
dataRetentionRouter.post('/run/:task', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { task } = req.params;
    let count = 0;
    
    switch (task) {
      case 'token-blacklist':
        count = await DataRetentionService.cleanupExpiredTokens();
        break;
      case 'ppdb-audit-log':
        count = await DataRetentionService.cleanupOldPPDBAuditLogs();
        break;
      case 'ppdb-notification':
        count = await DataRetentionService.cleanupOldPPDBNotifications();
        break;
      case 'attendance':
        count = await DataRetentionService.cleanupOldAttendance();
        break;
      case 'library-transaction':
        count = await DataRetentionService.cleanupOldLibraryTransactions();
        break;
      case 'surat-izin':
        count = await DataRetentionService.cleanupOldSuratIzin();
        break;
      case 'assignment-submission':
        count = await DataRetentionService.cleanupOldAssignmentSubmissions();
        break;
      default:
        return res.status(400).json({
          ok: false,
          message: 'Unknown retention task',
          availableTasks: [
            'token-blacklist',
            'ppdb-audit-log',
            'ppdb-notification',
            'attendance',
            'library-transaction',
            'surat-izin',
            'assignment-submission',
          ],
        });
    }
    
    logger.info(`Manual retention task ${task} completed`, { count });
    
    res.json({
      ok: true,
      message: `Retention task ${task} completed`,
      task,
      recordsDeleted: count,
    });
  } catch (error) {
    logger.error(`Manual retention task ${req.params.task} failed`, { 
      error: (error as Error).message 
    });
    res.status(500).json({
      ok: false,
      message: 'Retention task failed',
      error: (error as Error).message,
    });
  }
});