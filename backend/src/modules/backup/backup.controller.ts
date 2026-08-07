import type { RequestHandler } from 'express';
import {
  createBackup,
  restoreBackup,
  listBackups,
  cleanupOldBackups,
  verifyBackup,
  getBackupStats,
} from '../../utils/backup.js';
import { requireAdmin } from '../../middleware/auth.js';

// POST /api/backup/create
export const handleCreateBackup: RequestHandler = async (req, res, next) => {
  try {
    const result = await createBackup();
    
    if (!result.success) {
      res.status(500).json({
        ok: false,
        message: 'Backup gagal dibuat',
        error: result.error,
      });
      return;
    }
    
    res.json({
      ok: true,
      message: 'Backup berhasil dibuat',
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/backup/restore/:filename
export const handleRestoreBackup: RequestHandler = async (req, res, next) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      res.status(400).json({
        ok: false,
        message: 'Filename wajib diisi',
      });
      return;
    }
    
    const result = await restoreBackup(filename);
    
    if (!result.success) {
      res.status(500).json({
        ok: false,
        message: 'Restore gagal',
        error: result.error,
      });
      return;
    }
    
    res.json({
      ok: true,
      message: 'Database berhasil di-restore',
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/backup/list
export const handleListBackups: RequestHandler = async (req, res, next) => {
  try {
    const result = await listBackups();
    
    if (!result.success) {
      res.status(500).json({
        ok: false,
        message: 'Gagal mengambil daftar backup',
        error: result.error,
      });
      return;
    }
    
    res.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/backup/cleanup
export const handleCleanupBackups: RequestHandler = async (req, res, next) => {
  try {
    const result = await cleanupOldBackups();
    
    if (!result.success) {
      res.status(500).json({
        ok: false,
        message: 'Cleanup gagal',
        error: result.error,
      });
      return;
    }
    
    res.json({
      ok: true,
      message: 'Backup cleanup berhasil',
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/backup/verify/:filename
export const handleVerifyBackup: RequestHandler = async (req, res, next) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      res.status(400).json({
        ok: false,
        message: 'Filename wajib diisi',
      });
      return;
    }
    
    const result = await verifyBackup(filename);
    
    if (!result.success) {
      res.status(500).json({
        ok: false,
        message: 'Verifikasi gagal',
        error: result.error,
      });
      return;
    }
    
    res.json({
      ok: true,
      message: result.valid ? 'Backup valid' : 'Backup tidak valid',
      valid: result.valid,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/backup/stats
export const handleBackupStats: RequestHandler = async (req, res, next) => {
  try {
    const result = await getBackupStats();
    
    if (!result.success) {
      res.status(500).json({
        ok: false,
        message: 'Gagal mengambil statistik backup',
        error: result.error,
      });
      return;
    }
    
    res.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};