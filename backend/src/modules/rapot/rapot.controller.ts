// Controller untuk fitur rapot/nilai (blueprint BUG-03).
// Response mengikuti pola `{ ok, data }` + pagination.

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/response.js';
import { listRapot, upsertRapot, deleteRapot } from './rapot.service.js';

const nilaiSchema = z
  .number()
  .min(0, 'Nilai minimal 0')
  .max(100, 'Nilai maksimal 100')
  .nullable()
  .optional();

const upsertSchema = z.object({
  studentId: z.string().trim().min(1, 'studentId wajib diisi'),
  classId: z.string().trim().min(1, 'classId wajib diisi'),
  semester: z.string().trim().min(1, 'semester wajib diisi'),
  tahunAjaran: z.string().trim().min(1, 'tahunAjaran wajib diisi'),
  mataPelajaran: z.string().trim().min(1, 'mataPelajaran wajib diisi').max(120),
  nilaiHarian: nilaiSchema,
  nilaiTugas: nilaiSchema,
  nilaiUTS: z.number().min(0).max(100),
  nilaiUAS: z.number().min(0).max(100),
  nilaiAkhir: z.number().min(0).max(100),
  predikat: z.string().trim().max(20).nullable().optional(),
  catatanGuru: z.string().trim().max(2000).nullable().optional(),
});

const listQuerySchema = z.object({
  studentId: z.string().optional(),
  classId: z.string().optional(),
  tahunAjaran: z.string().optional(),
  semester: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});

const deleteParamsSchema = z.object({
  id: z.string().min(1, 'id wajib diisi'),
});

// GET /api/rapot?studentId=&classId=&tahunAjaran=&semester=&page=&limit=
export const handleListRapot: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError('Query parameter tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { items, total } = await listRapot(parsed.data);
    res.json(
      paginatedResponse(
        items,
        parsed.data.page,
        parsed.data.limit,
        total,
        'Data rapot berhasil dimuat'
      )
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/rapot  (upsert satu baris nilai)
export const handleUpsertRapot: RequestHandler = async (req, res, next) => {
  try {
    const parsed = upsertSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError('Data nilai tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const inputBy = req.jwtUser?.userId;
    if (!inputBy) {
      res.status(401).json({ ok: false, message: 'Harus login terlebih dahulu.' });
      return;
    }

    const item = await upsertRapot(parsed.data, inputBy);
    res.status(201).json({
      ok: true,
      message: 'Nilai berhasil disimpan',
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/rapot/:id
export const handleDeleteRapot: RequestHandler = async (req, res, next) => {
  try {
    const parsed = deleteParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ValidationError('Parameter tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    await deleteRapot(parsed.data.id);
    res.json({ ok: true, message: 'Nilai berhasil dihapus' });
  } catch (err) {
    next(err);
  }
};
