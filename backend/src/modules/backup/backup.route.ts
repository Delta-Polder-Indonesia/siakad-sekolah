import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  handleCreateBackup,
  handleRestoreBackup,
  handleListBackups,
  handleCleanupBackups,
  handleVerifyBackup,
  handleBackupStats,
} from './backup.controller.js';
import { requireAdmin } from '../../middleware/auth.js';

export const backupRouter = Router();

// Rate limiting untuk backup operations
const backupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 backup operations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Terlalu banyak operasi backup. Coba lagi dalam 1 jam.' },
});

// Backup management endpoints (admin only)
backupRouter.post('/create', requireAdmin, backupLimiter, handleCreateBackup);
backupRouter.post('/restore/:filename', requireAdmin, backupLimiter, handleRestoreBackup);
backupRouter.get('/list', requireAdmin, handleListBackups);
backupRouter.delete('/cleanup', requireAdmin, handleCleanupBackups);
backupRouter.get('/verify/:filename', requireAdmin, handleVerifyBackup);
backupRouter.get('/stats', requireAdmin, handleBackupStats);