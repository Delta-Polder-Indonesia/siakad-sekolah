import type { RequestHandler } from 'express';
import { getSchoolConfig, toPublicConfig, upsertSchoolConfig } from './school-config.service.js';
import type { SchoolConfigInput } from './school-config.service.js';

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

    // Jangan bocorkan field sensitif (guestAccessCode) ke endpoint publik.
    res.json({ ok: true, data: toPublicConfig(config) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/school-config
// Hanya admin — sudah diproteksi oleh requireAuth + requireAdmin di route
export const handleUpsertSchoolConfig: RequestHandler = async (req, res, next) => {
  try {
    const config = await upsertSchoolConfig(req.validatedBody as SchoolConfigInput);
    res.json({ ok: true, data: config });
  } catch (err) {
    next(err);
  }
};