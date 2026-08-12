// Controller untuk fitur admin PPDB (blueprint BUG-05).
// Autentikasi & otorisasi admin diterapkan di server (JWT role ADMIN).

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors.js';
import { getPpdbConfig, updatePpdbConfig } from './ppdb.config.service.js';

const configSchema = z.object({
  ppdbYear: z.string().min(4).max(12).optional(),
  ppdbIsOpen: z.boolean().optional(),
  ppdbRegistrationUrl: z.string().url().optional().nullable(),
  ppdbQuota: z.number().int().min(0).optional(),
  ppdbOpenDate: z.string().optional().nullable(),
  ppdbCloseDate: z.string().optional().nullable(),
});

// GET /api/ppdb/config  (admin)
export const handleGetConfig: RequestHandler = async (_req, res, next) => {
  try {
    const config = await getPpdbConfig();
    res.json({ ok: true, data: config });
  } catch (err) { next(err); }
};

// PATCH /api/ppdb/config  (admin)
export const handleUpdateConfig: RequestHandler = async (req, res, next) => {
  try {
    const parsed = configSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError('Data konfigurasi PPDB tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const config = await updatePpdbConfig(parsed.data);
    res.json({ ok: true, message: 'Konfigurasi PPDB diperbarui', data: config });
  } catch (err) { next(err); }
};
