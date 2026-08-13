import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import {
  handleGetConfig,
  handleUpdateConfig,
  handleListApplications,
  handleGetApplication,
  handleGetByRegNo,
  handleCreateApplication,
  handleUpdateStatus,
  handleDeleteApplication,
  handleAuditLogs,
  handleStatistics,
} from './ppdb.controller.js';

export const ppdbRouter = Router();

ppdbRouter.get('/config', requireAuth, requireAdmin, handleGetConfig);
ppdbRouter.patch('/config', requireAuth, requireAdmin, handleUpdateConfig);

// Pendaftaran publik (tanpa login).
ppdbRouter.post('/applications', handleCreateApplication);
ppdbRouter.get('/applications/registration/:regNo', handleGetByRegNo);

// Admin
ppdbRouter.get('/applications', requireAuth, requireAdmin, handleListApplications);
ppdbRouter.get('/applications/:id', requireAuth, requireAdmin, handleGetApplication);
ppdbRouter.patch('/applications/:id/status', requireAuth, requireAdmin, handleUpdateStatus);
ppdbRouter.delete('/applications/:id', requireAuth, requireAdmin, handleDeleteApplication);
ppdbRouter.get('/audit-logs', requireAuth, requireAdmin, handleAuditLogs);
ppdbRouter.get('/statistics', requireAuth, requireAdmin, handleStatistics);
