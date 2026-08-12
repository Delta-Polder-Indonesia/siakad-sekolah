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
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

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
backupRouter.post('/create', requireAuth, requireAdmin, backupLimiter, handleCreateBackup);
backupRouter.post('/restore/:filename', requireAuth, requireAdmin, backupLimiter, handleRestoreBackup);
backupRouter.get('/list', requireAuth, requireAdmin, handleListBackups);
backupRouter.delete('/cleanup', requireAuth, requireAdmin, handleCleanupBackups);
backupRouter.get('/verify/:filename', requireAuth, requireAdmin, handleVerifyBackup);
backupRouter.get('/stats', requireAuth, requireAdmin, handleBackupStats);