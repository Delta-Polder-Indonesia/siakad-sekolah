// Controller untuk fitur surat izin (blueprint BUG-03).

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/response.js';
import { listSurat, createSurat, updateSuratStatus, SURAT_STATUS_UI } from './suratIzin.service.js';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const createSchema = z.object({
  studentId: z.string().min(1, 'studentId wajib diisi'),
  classId: z.string().min(1, 'classId wajib diisi'),
  type: z.enum(['izin', 'sakit', 'dispensasi', 'lainnya']),
  subject: z.string().trim().min(1, 'Perihal wajib diisi').max(200),
  message: z.string().trim().min(1, 'Pesan wajib diisi').max(2000),
  letterDate: z.string().regex(DATE_REGEX, 'letterDate harus YYYY-MM-DD'),
  attachmentName: z.string().trim().max(255).optional().nullable(),
  attachmentDataUrl: z.string().max(1000000).optional().nullable(),
});

const statusSchema = z.object({
  status: z.enum(SURAT_STATUS_UI, { errorMap: () => ({ message: 'Status tidak valid' }) }),
});

const listQuerySchema = z.object({
  studentId: z.string().optional(),
  classId: z.string().optional(),
  status: z.enum(SURAT_STATUS_UI).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});
const idParamSchema = z.object({ id: z.string().min(1) });

// GET /api/surat-izin?studentId=&classId=&status=&page=&limit=
export const handleListSurat: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError('Query parameter tidak valid');
    const { items, total } = await listSurat(parsed.data);
    res.json(paginatedResponse(items, parsed.data.page, parsed.data.limit, total, 'Daftar surat izin dimuat'));
  } catch (err) { next(err); }
};

// POST /api/surat-izin
export const handleCreateSurat: RequestHandler = async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError('Data surat izin tidak valid', { errors: parsed.error.flatten().fieldErrors });
    const item = await createSurat(parsed.data);
    res.status(201).json({ ok: true, message: 'Surat izin berhasil dikirim', data: item });
  } catch (err) { next(err); }
};

// PATCH /api/surat-izin/:id/status  { status }
export const handleUpdateStatus: RequestHandler = async (req, res, next) => {
  try {
    const params = idParamSchema.safeParse(req.params);
    const body = statusSchema.safeParse(req.body);
    if (!params.success || !body.success) throw new ValidationError('Data tidak valid');
    const item = await updateSuratStatus(params.data.id, body.data.status);
    res.json({ ok: true, message: 'Status surat izin diperbarui', data: item });
  } catch (err) { next(err); }
};
