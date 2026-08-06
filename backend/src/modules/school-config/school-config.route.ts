import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import {
  handleGetSchoolConfig,
  handleUpsertSchoolConfig,
} from './school-config.controller.js';

export const schoolConfigRouter = Router();

// Publik — tidak butuh login
schoolConfigRouter.get('/', handleGetSchoolConfig);

// Admin only — butuh login + role ADMIN
schoolConfigRouter.put('/', requireAuth, requireAdmin, handleUpsertSchoolConfig);