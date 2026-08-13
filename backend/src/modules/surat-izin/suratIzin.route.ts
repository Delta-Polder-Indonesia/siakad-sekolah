// Route surat izin — list & create dengan ownership untuk MURID/WALIS.

import { Router } from 'express';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import { scopeStudentQuery, requireStudentBodyOwnership } from '../../middleware/ownership.js';
import {
  handleListSurat, handleCreateSurat, handleUpdateStatus,
} from './suratIzin.controller.js';

export const suratIzinRouter = Router();

suratIzinRouter.use(requireAuth);

suratIzinRouter.post(
  '/',
  requireRoles('MURID', 'WALIS', 'GURU', 'ADMIN'),
  requireStudentBodyOwnership,
  handleCreateSurat
);

suratIzinRouter.get(
  '/',
  requireRoles('GURU', 'ADMIN', 'MURID', 'WALIS'),
  scopeStudentQuery,
  handleListSurat
);

suratIzinRouter.patch('/:id/status', requireRoles('GURU', 'ADMIN'), handleUpdateStatus);
