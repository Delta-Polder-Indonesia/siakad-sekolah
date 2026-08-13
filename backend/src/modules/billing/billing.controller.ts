// Controller untuk fitur tagihan/billing sekolah (blueprint BUG-03).

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/response.js';
import { prisma } from '../../lib/prisma.js';
import { canAccessStudent } from '../../middleware/ownership.js';
import {
  listBilling,
  payBilling,
  getPengaturan,
  setPengaturan,
  generateAnnualBilling,
  PAYMENT_METHODS,
} from './billing.service.js';

const listQuerySchema = z.object({
  studentId: z.string().optional(),
  year: z.coerce.number().int().optional(),
  status: z.enum(['lunas', 'belum_lunas']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});

const payParamsSchema = z.object({ id: z.string().min(1) });
const payBodySchema = z.object({
  paymentMethod: z.enum(PAYMENT_METHODS, {
    errorMap: () => ({ message: 'Metode pembayaran tidak valid' }),
  }),
});

const configSchema = z.object({
  monthlyAmount: z.number().int().min(0),
  dueDay: z.number().int().min(1).max(31),
});

const generateSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  monthlyAmount: z.number().int().min(0),
  dueDay: z.number().int().min(1).max(31),
});

// GET /api/billing?studentId=&year=&status=&page=&limit=
export const handleListBilling: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError('Query parameter tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const { items, total } = await listBilling(parsed.data);
    res.json(
      paginatedResponse(items, parsed.data.page, parsed.data.limit, total, 'Tagihan berhasil dimuat')
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/billing/:id/pay  { paymentMethod }
export const handlePayBilling: RequestHandler = async (req, res, next) => {
  try {
    const params = payParamsSchema.safeParse(req.params);
    const body = payBodySchema.safeParse(req.body);
    if (!params.success || !body.success) {
      throw new ValidationError('Data pembayaran tidak valid', {
        errors: { params: params.success ? undefined : params.error.flatten().fieldErrors },
      });
    }

    const existing = await prisma.billing.findUnique({ where: { id: params.data.id } });
    if (existing && !(await canAccessStudent(req, existing.studentId))) {
      res.status(403).json({
        ok: false,
        message: 'Akses ditolak. Anda hanya dapat membayar tagihan sendiri.',
      });
      return;
    }

    const item = await payBilling(params.data.id, body.data.paymentMethod);
    res.json({ ok: true, message: 'Pembayaran berhasil diproses', data: item });
  } catch (err) {
    next(err);
  }
};

// GET /api/billing/config
export const handleGetConfig: RequestHandler = async (_req, res, next) => {
  try {
    const config = await getPengaturan();
    res.json({ ok: true, data: config });
  } catch (err) {
    next(err);
  }
};

// POST /api/billing/config  { monthlyAmount, dueDay } (admin)
export const handleSetConfig: RequestHandler = async (req, res, next) => {
  try {
    const parsed = configSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError('Data konfigurasi tagihan tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const updatedBy = req.jwtUser?.userId ?? 'admin';
    const config = await setPengaturan(parsed.data.monthlyAmount, parsed.data.dueDay, updatedBy);
    res.status(201).json({ ok: true, message: 'Konfigurasi tagihan disimpan', data: config });
  } catch (err) {
    next(err);
  }
};

// POST /api/billing/generate  { year, monthlyAmount, dueDay } (admin)
export const handleGenerateBilling: RequestHandler = async (req, res, next) => {
  try {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError('Data generate tagihan tidak valid', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const updatedBy = req.jwtUser?.userId ?? 'admin';
    const result = await generateAnnualBilling({ ...parsed.data, updatedBy });
    res.status(201).json({
      ok: true,
      message: `Tagihan tahunan berhasil dibuat/update (${result.count} baris)`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
