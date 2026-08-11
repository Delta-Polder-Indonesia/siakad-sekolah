// Controller untuk fitur tugas online & submisi (blueprint BUG-03).

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/response.js';
import {
  listAssignments, upsertAssignment, deleteAssignment,
  listSubmissions, upsertSubmission, deleteSubmission,
} from './assignment.service.js';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const assignmentSchema = z.object({
  id: z.string().optional(),
  classId: z.string().min(1, 'classId wajib diisi'),
  title: z.string().trim().min(1, 'Judul wajib diisi').max(255),
  description: z.string().trim().max(5000).optional().nullable(),
  dueDate: z.string().regex(DATE_REGEX, 'dueDate harus YYYY-MM-DD'),
  content: z.record(z.unknown()).optional().nullable(),
});

const submissionSchema = z.object({
  assignmentId: z.string().min(1),
  studentId: z.string().min(1),
  answerText: z.string().max(10000).optional().nullable(),
  attachmentName: z.string().max(255).optional().nullable(),
  attachmentDataUrl: z.string().max(1000000).optional().nullable(),
  grade: z.number().min(0).max(100).optional().nullable(),
  feedback: z.string().max(2000).optional().nullable(),
});

const listQuerySchema = z.object({
  classId: z.string().optional(),
  assignmentId: z.string().optional(),
  studentId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});
const idParamSchema = z.object({ id: z.string().min(1) });

// GET /api/assignments?classId=&page=&limit=
export const handleListAssignments: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError('Query parameter tidak valid');
    const { items, total } = await listAssignments(parsed.data);
    res.json(paginatedResponse(items, parsed.data.page, parsed.data.limit, total, 'Daftar tugas dimuat'));
  } catch (err) { next(err); }
};

// POST /api/assignments
export const handleUpsertAssignment: RequestHandler = async (req, res, next) => {
  try {
    const parsed = assignmentSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError('Data tugas tidak valid', { errors: parsed.error.flatten().fieldErrors });
    const createdBy = req.jwtUser?.userId ?? 'system';
    const item = await upsertAssignment({ ...parsed.data, createdBy });
    res.status(201).json({ ok: true, message: 'Tugas disimpan', data: item });
  } catch (err) { next(err); }
};

// DELETE /api/assignments/:id
export const handleDeleteAssignment: RequestHandler = async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw new ValidationError('Parameter tidak valid');
    await deleteAssignment(parsed.data.id);
    res.json({ ok: true, message: 'Tugas dihapus' });
  } catch (err) { next(err); }
};

// GET /api/assignments/submissions?assignmentId=&studentId=
export const handleListSubmissions: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError('Query parameter tidak valid');
    const { items, total } = await listSubmissions(parsed.data);
    res.json(paginatedResponse(items, parsed.data.page, parsed.data.limit, total, 'Daftar submisi dimuat'));
  } catch (err) { next(err); }
};

// POST /api/assignments/submissions
export const handleUpsertSubmission: RequestHandler = async (req, res, next) => {
  try {
    const parsed = submissionSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError('Data submisi tidak valid', { errors: parsed.error.flatten().fieldErrors });
    const item = await upsertSubmission(parsed.data);
    res.status(201).json({ ok: true, message: 'Submisi disimpan', data: item });
  } catch (err) { next(err); }
};

// DELETE /api/assignments/submissions/:id
export const handleDeleteSubmission: RequestHandler = async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw new ValidationError('Parameter tidak valid');
    await deleteSubmission(parsed.data.id);
    res.json({ ok: true, message: 'Submisi dihapus' });
  } catch (err) { next(err); }
};
