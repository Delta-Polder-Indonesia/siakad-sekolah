import type { RequestHandler } from 'express';
import { getSchoolConfig, upsertSchoolConfig } from './school-config.service.js';

// GET /api/school-config
// Publik — siapa saja boleh akses, tidak butuh login
export const handleGetSchoolConfig: RequestHandler = async (_req, res, next) => {
  try {
    const config = await getSchoolConfig();

    if (!config) {
      // Belum dikonfigurasi — kembalikan data kosong
      res.json({ ok: true, data: null });
      return;
    }

    res.json({ ok: true, data: config });
  } catch (err) {
    next(err);
  }
};

// PUT /api/school-config
// Hanya admin — sudah diproteksi oleh requireAuth + requireAdmin di route
export const handleUpsertSchoolConfig: RequestHandler = async (req, res, next) => {
  try {
    const config = await upsertSchoolConfig(req.body);
    res.json({ ok: true, data: config });
  } catch (err) {
    next(err);
  }
};