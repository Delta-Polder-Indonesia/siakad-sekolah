import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { getDashboardStats } from './stats.service.js';

export const statsRouter = Router();

// Ringkasan statistik untuk dashboard admin. Data non-PII (hitungan saja),
// jadi semua role login boleh mengakses.
statsRouter.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const data = await getDashboardStats();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});