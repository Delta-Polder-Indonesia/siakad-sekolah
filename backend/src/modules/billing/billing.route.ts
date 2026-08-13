// Route tagihan/billing.
// Self-service siswa/wali: list + pay milik sendiri.

import { Router } from 'express';
import { requireAuth, requireRoles, requireAdmin } from '../../middleware/auth.js';
import { scopeStudentQuery } from '../../middleware/ownership.js';
import {
  handleListBilling,
  handlePayBilling,
  handleGetConfig,
  handleSetConfig,
  handleGenerateBilling,
} from './billing.controller.js';

export const billingRouter = Router();

billingRouter.get('/config', requireAuth, handleGetConfig);
billingRouter.post('/config', requireAuth, requireAdmin, handleSetConfig);
billingRouter.post('/generate', requireAuth, requireAdmin, handleGenerateBilling);

billingRouter.get(
  '/',
  requireAuth,
  requireRoles('GURU', 'ADMIN', 'MURID', 'WALIS'),
  scopeStudentQuery,
  handleListBilling
);
billingRouter.post(
  '/:id/pay',
  requireAuth,
  requireRoles('GURU', 'ADMIN', 'MURID', 'WALIS'),
  handlePayBilling
);
