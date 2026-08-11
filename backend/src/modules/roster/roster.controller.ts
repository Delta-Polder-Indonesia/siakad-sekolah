// Controller untuk fitur roster kelas (blueprint BUG-03).

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/response.js';
import { listRoster, createRoster, deleteRoster } from './roster.service.js';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const createSchema = z.object({
  classId: z.string().min(1, 'classId wajib diisi'),
  subject: z.string().trim().min(1, 'Mata pelajaran wajib diisi').max(120),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(TIME_REGEX, 'startTime harus format HH:mm'),
  endTime: z.string().regex(TIME_REGEX, 'endTime harus format HH:mm'),
  room: z.string().trim().max(80).optional().nullable(),
  teacherName: z.string().trim().max(120).optional().nullable(),
});

const listQuerySchema = z.object({
  classId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});
const idParamSchema = z.object({ id: z.string().min(1) });

// GET /api/roster?classId=&page=&limit=
export const handleListRoster: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError('Query parameter tidak valid');
    const { items, total } = await listRoster(parsed.data);
    res.json(paginatedResponse(items, parsed.data.page, parsed.data.limit, total, 'Daftar roster dimuat'));
  } catch (err) { next(err); }
};

// POST /api/roster
export const handleCreateRoster: RequestHandler = async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError('Data roster tidak valid', { errors: parsed.error.flatten().fieldErrors });
    const updatedBy = req.jwtUser?.userId ?? 'system';
    const item = await createRoster(parsed.data, updatedBy);
    res.status(201).json({ ok: true, message: 'Jadwal roster ditambahkan', data: item });
  } catch (err) { next(err); }
};

// DELETE /api/roster/:id
export const handleDeleteRoster: RequestHandler = async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw new ValidationError('Parameter tidak valid');
    await deleteRoster(parsed.data.id);
    res.json({ ok: true, message: 'Jadwal roster dihapus' });
  } catch (err) { next(err); }
};
