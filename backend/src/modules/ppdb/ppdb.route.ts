// Route admin PPDB — blueprint BUG-05.
//
// Autentikasi admin dilakukan di SERVER: admin login via /api/auth/admin/login
// (JWT role ADMIN), lalu endpoint /config diproteksi requireAuth+requireAdmin.
// Ini menghilangkan ketergantungan pada PIN yang dibundel di client.
//
// Catatan: data aplikasi PPDB (PPDBApplication) masih di lokasi frontend
// (belum migrasi schema — lihat BUG-02/03). Endpoint /config ini memindahkan
// OTORISASI admin & konfigurasi PPDB ke server.

import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { handleGetConfig, handleUpdateConfig } from './ppdb.controller.js';

export const ppdbRouter = Router();

// Konfigurasi PPDB — admin only.
ppdbRouter.get('/config', requireAuth, requireAdmin, handleGetConfig);
ppdbRouter.patch('/config', requireAuth, requireAdmin, handleUpdateConfig);
