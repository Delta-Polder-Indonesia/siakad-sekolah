// Controller untuk fitur admin PPDB (blueprint BUG-05).
// Autentikasi & otorisasi admin diterapkan di server (JWT role ADMIN).

import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors.js';
import { getPpdbConfig, updatePpdbConfig } from './ppdb.config.service.js';
import {
  listApplications,
  getApplication,
  getApplicationByRegNo,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  listAuditLogs,
  getStatistics,
} from './ppdb.application.service.js';

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

export const handleListApplications: RequestHandler = async (_req, res, next) => {
  try {
    res.json({ ok: true, data: await listApplications() });
  } catch (err) { next(err); }
};

export const handleGetApplication: RequestHandler = async (req, res, next) => {
  try {
    res.json({ ok: true, data: await getApplication(String(req.params.id)) });
  } catch (err) { next(err); }
};

export const handleGetByRegNo: RequestHandler = async (req, res, next) => {
  try {
    res.json({ ok: true, data: await getApplicationByRegNo(String(req.params.regNo)) });
  } catch (err) { next(err); }
};

export const handleCreateApplication: RequestHandler = async (req, res, next) => {
  try {
    const item = await createApplication(req.body as Record<string, unknown>);
    res.status(201).json({ ok: true, data: item });
  } catch (err) { next(err); }
};

export const handleUpdateStatus: RequestHandler = async (req, res, next) => {
  try {
    const item = await updateApplicationStatus(
      String(req.params.id),
      String(req.body?.status || ''),
      req.body?.adminNotes,
      req.body?.verifiedBy || req.jwtUser?.name
    );
    res.json({ ok: true, data: item });
  } catch (err) { next(err); }
};

export const handleDeleteApplication: RequestHandler = async (req, res, next) => {
  try {
    await deleteApplication(String(req.params.id));
    res.json({ ok: true });
  } catch (err) { next(err); }
};

export const handleAuditLogs: RequestHandler = async (_req, res, next) => {
  try {
    res.json({ ok: true, data: await listAuditLogs() });
  } catch (err) { next(err); }
};

export const handleStatistics: RequestHandler = async (_req, res, next) => {
  try {
    res.json({ ok: true, data: await getStatistics() });
  } catch (err) { next(err); }
};
