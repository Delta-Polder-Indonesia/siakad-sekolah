// Controller untuk fitur feedback/review.
// Response mengikuti pola `{ ok, data }` yang dipakai modul lain.

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError, NotFoundError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/response.js';
import {
  listFeedback,
  createFeedback,
  updateFeedbackStatus,
  toggleFeedbackLike,
  deleteFeedback,
  getFeedbackStats,
} from './feedback.service.js';

const STATUS_VALUES = ['pending', 'dibaca', 'diproses', 'selesai'] as const;

const createSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi').max(120),
  email: z.string().trim().email('Format email tidak valid').optional().nullable(),
  role: z.string().trim().max(50).optional().nullable(),
  category: z
    .enum(['bug', 'saran', 'keluhan', 'pertanyaan', 'lainnya'])
    .optional()
    .nullable(),
  subject: z.string().trim().min(1, 'Subjek wajib diisi').max(200),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter').max(5000),
  priority: z.enum(['rendah', 'sedang', 'tinggi']).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  avatar: z.string().trim().max(500).optional().nullable(),
});

const updateStatusSchema = z.object({
  status: z.enum(STATUS_VALUES),
  adminNotes: z.string().trim().max(2000).optional().nullable(),
});

// Query: /api/feedback?page=1&limit=20 (default page=1, limit=20, maks 100).
// Response backward-compatible: `data` tetap array (frontend lama aman),
// plus meta `pagination` untuk frontend yang butuh load-more / halaman.
const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// GET /api/feedback
export const handleListFeedback: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    const page = parsed.success ? parsed.data.page : 1;
    const limit = parsed.success ? parsed.data.limit : 20;

    const { items, total } = await listFeedback(page, limit);
    res.json(paginatedResponse(items, page, limit, total, 'Feedback berhasil dimuat'));
  } catch (err) {
    next(err);
  }
};

// GET /api/feedback/stats
export const handleFeedbackStats: RequestHandler = async (_req, res, next) => {
  try {
    const data = await getFeedbackStats();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/feedback
export const handleCreateFeedback: RequestHandler = async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message || 'Data feedback tidak valid',
        { issues: parsed.error.issues }
      );
    }

    const data = await createFeedback(parsed.data);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/feedback/:id
export const handleUpdateFeedbackStatus: RequestHandler = async (req, res, next) => {
  try {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message || 'Status tidak valid',
        { issues: parsed.error.issues }
      );
    }

    const data = await updateFeedbackStatus(req.params.id, parsed.data);
    if (!data) throw new NotFoundError('Feedback', req.params.id);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/feedback/:id/like
export const handleToggleLike: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req.body?.userId as string | undefined)?.trim();
    if (!userId) throw new ValidationError('userId wajib diisi');

    const data = await toggleFeedbackLike(req.params.id, userId);
    if (!data) throw new NotFoundError('Feedback', req.params.id);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/feedback/:id
export const handleDeleteFeedback: RequestHandler = async (req, res, next) => {
  try {
    const deleted = await deleteFeedback(req.params.id);
    if (!deleted) throw new NotFoundError('Feedback', req.params.id);

    res.json({ ok: true, message: 'Feedback dihapus' });
  } catch (err) {
    next(err);
  }
};
