// Controller untuk fitur absensi/kehadiran siswa.
// Blueprint BUG-03 — response mengikuti pola `{ ok, data }` + pagination.

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/response.js';
import { ATTENDANCE_STATUSES } from './attendance.service.js';
import {
  listAttendance,
  createAttendanceRecords,
  deleteAttendance,
} from './attendance.service.js';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const recordSchema = z.object({
  studentId: z.string().trim().min(1, 'studentId wajib diisi'),
  classId: z.string().trim().min(1, 'classId wajib diisi'),
  date: z.string().regex(DATE_REGEX, 'date harus format YYYY-MM-DD'),
  status: z.enum(ATTENDANCE_STATUSES, {
    errorMap: () => ({ message: 'status harus hadir|izin|sakit|alpha' }),
  }),
  note: z.string().trim().max(1000).optional().nullable(),
});

// Body POST: array record (bulk) ATAU object tunggal (kompatibilitas).
const createSchema = z.union([
  z.array(recordSchema).min(1, 'Minimal 1 record').max(2000, 'Maksimal 2000 record'),
  recordSchema,
]);

const listQuerySchema = z.object({
  date: z.string().regex(DATE_REGEX, 'date harus format YYYY-MM-DD').optional(),
  classId: z.string().optional(),
  studentId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});

const deleteParamsSchema = z.object({
  id: z.string().min(1, 'id wajib diisi'),
});

// GET /api/attendance?date=&classId=&studentId=&page=&limit=
export const handleListAttendance: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError('Query parameter tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { items, total } = await listAttendance(parsed.data);
    res.json(
      paginatedResponse(
        items,
        parsed.data.page,
        parsed.data.limit,
        total,
        'Data absensi berhasil dimuat'
      )
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/attendance  (bulk atau single)
export const handleCreateAttendance: RequestHandler = async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError('Data absensi tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const teacherId = req.jwtUser?.userId;
    if (!teacherId) {
      res.status(401).json({ ok: false, message: 'Harus login terlebih dahulu.' });
      return;
    }

    const records = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
    const result = await createAttendanceRecords(records, teacherId);

    res.status(201).json({
      ok: true,
      message: `${result.count} record absensi berhasil disimpan`,
      data: result.items,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/attendance/:id
export const handleDeleteAttendance: RequestHandler = async (req, res, next) => {
  try {
    const parsed = deleteParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ValidationError('Parameter tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    await deleteAttendance(parsed.data.id);
    res.json({ ok: true, message: 'Record absensi berhasil dihapus' });
  } catch (err) {
    next(err);
  }
};
