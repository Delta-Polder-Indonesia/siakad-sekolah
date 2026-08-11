// Controller untuk fitur perpustakaan (blueprint BUG-03).

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/response.js';
import {
  listBooks, upsertBook, deleteBook,
  listMembers, upsertMember, deleteMember,
  listTransactions, borrowBook, approveLoan, rejectLoan, returnBook,
  TX_STATUS_UI,
} from './library.service.js';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const memberTypeSchema = z.enum(['siswa', 'guru', 'staf']);

const bookSchema = z.object({
  id: z.string().optional(),
  isbn: z.string().trim().max(40).optional().nullable(),
  title: z.string().trim().min(1, 'Judul wajib diisi').max(255),
  author: z.string().trim().min(1, 'Penulis wajib diisi').max(120),
  category: z.string().trim().min(1).max(80),
  publisher: z.string().trim().min(1).max(120),
  rack: z.string().trim().min(1).max(40),
  stock: z.number().int().min(0).default(0),
  description: z.string().trim().max(2000).optional().nullable(),
  coverImage: z.string().trim().max(500).optional().nullable(),
});

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Nama wajib diisi').max(120),
  memberType: memberTypeSchema,
  nis: z.string().trim().max(40).optional().nullable(),
  className: z.string().trim().max(80).optional().nullable(),
  joinedAt: z.number().optional(),
});

const borrowSchema = z.object({
  bookId: z.string().min(1),
  memberId: z.string().min(1),
  borrowDate: z.string().regex(DATE_REGEX, 'borrowDate harus YYYY-MM-DD'),
  dueDate: z.string().regex(DATE_REGEX, 'dueDate harus YYYY-MM-DD'),
});

const rejectSchema = z.object({ note: z.string().trim().max(1000).optional().default('') });

const listQuerySchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  status: z.enum(TX_STATUS_UI).optional(),
  memberId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});
const idParamSchema = z.object({ id: z.string().min(1) });
const returnParamSchema = z.object({ id: z.string().min(1) });
const returnBodySchema = z.object({ returnDate: z.string().regex(DATE_REGEX) });

// GET /api/library/books
export const handleListBooks: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError('Query parameter tidak valid');
    const { items, total } = await listBooks(parsed.data);
    res.json(paginatedResponse(items, parsed.data.page, parsed.data.limit, total, 'Daftar buku dimuat'));
  } catch (err) { next(err); }
};

// POST /api/library/books
export const handleUpsertBook: RequestHandler = async (req, res, next) => {
  try {
    const parsed = bookSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError('Data buku tidak valid', { errors: parsed.error.flatten().fieldErrors });
    const item = await upsertBook(parsed.data);
    res.status(201).json({ ok: true, message: 'Buku disimpan', data: item });
  } catch (err) { next(err); }
};

// DELETE /api/library/books/:id
export const handleDeleteBook: RequestHandler = async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw new ValidationError('Parameter tidak valid');
    await deleteBook(parsed.data.id);
    res.json({ ok: true, message: 'Buku dihapus' });
  } catch (err) { next(err); }
};

// GET /api/library/members
export const handleListMembers: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError('Query parameter tidak valid');
    const { items, total } = await listMembers(parsed.data);
    res.json(paginatedResponse(items, parsed.data.page, parsed.data.limit, total, 'Daftar anggota dimuat'));
  } catch (err) { next(err); }
};

// POST /api/library/members
export const handleUpsertMember: RequestHandler = async (req, res, next) => {
  try {
    const parsed = memberSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError('Data anggota tidak valid', { errors: parsed.error.flatten().fieldErrors });
    const item = await upsertMember(parsed.data);
    res.status(201).json({ ok: true, message: 'Anggota disimpan', data: item });
  } catch (err) { next(err); }
};

// DELETE /api/library/members/:id
export const handleDeleteMember: RequestHandler = async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw new ValidationError('Parameter tidak valid');
    await deleteMember(parsed.data.id);
    res.json({ ok: true, message: 'Anggota dihapus' });
  } catch (err) { next(err); }
};

// GET /api/library/transactions
export const handleListTransactions: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError('Query parameter tidak valid');
    const { items, total } = await listTransactions(parsed.data);
    res.json(paginatedResponse(items, parsed.data.page, parsed.data.limit, total, 'Daftar transaksi dimuat'));
  } catch (err) { next(err); }
};

// POST /api/library/transactions/borrow
export const handleBorrow: RequestHandler = async (req, res, next) => {
  try {
    const parsed = borrowSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError('Data pinjaman tidak valid', { errors: parsed.error.flatten().fieldErrors });
    const item = await borrowBook(parsed.data);
    res.status(201).json({ ok: true, message: 'Permohonan pinjaman diajukan', data: item });
  } catch (err) { next(err); }
};

// POST /api/library/transactions/:id/approve
export const handleApprove: RequestHandler = async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw new ValidationError('Parameter tidak valid');
    const item = await approveLoan(parsed.data.id);
    res.json({ ok: true, message: 'Peminjaman disetujui', data: item });
  } catch (err) { next(err); }
};

// POST /api/library/transactions/:id/reject  { note? }
export const handleReject: RequestHandler = async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    const body = rejectSchema.safeParse(req.body);
    if (!parsed.success || !body.success) throw new ValidationError('Data tidak valid');
    const item = await rejectLoan(parsed.data.id, body.data.note);
    res.json({ ok: true, message: 'Peminjaman ditolak', data: item });
  } catch (err) { next(err); }
};

// POST /api/library/transactions/:id/return  { returnDate }
export const handleReturn: RequestHandler = async (req, res, next) => {
  try {
    const parsed = returnParamSchema.safeParse(req.params);
    const body = returnBodySchema.safeParse(req.body);
    if (!parsed.success || !body.success) throw new ValidationError('Data tidak valid');
    const item = await returnBook(parsed.data.id, body.data.returnDate);
    res.json({ ok: true, message: 'Buku dikembalikan', data: item });
  } catch (err) { next(err); }
};
