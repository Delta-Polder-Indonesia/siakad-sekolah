import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import {
  handleGetSchoolConfig,
  handleUpsertSchoolConfig,
} from './school-config.controller.js';
import { validateBody, schoolConfigSchema } from '../../utils/validation.js';

export const schoolConfigRouter = Router();

// Publik — tidak butuh login
schoolConfigRouter.get('/', handleGetSchoolConfig);

// Admin only — butuh login + role ADMIN, body divalidasi zod
schoolConfigRouter.put(
  '/',
  requireAuth,
  requireAdmin,
  validateBody(schoolConfigSchema),
  handleUpsertSchoolConfig
);