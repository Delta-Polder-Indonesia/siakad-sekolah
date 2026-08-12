// Route tagihan/billing — blueprint BUG-03.
//
// KEAMANAN (IDOR): seperti rapot, endpoint billing yang menyentuh data spesifik
// siswa dibuka untuk GURU/ADMIN dulu. Self-service pembayaran oleh siswa/orang-tua
// membutuhkan linkage antara akun login dan data siswa (id lokal 's1' vs CUID
// backend; relasi WALIS→Student belum lengkap) — tanpa itu, membuka endpoint
// ke role siswa berisiko IDOR (siswa bisa menandai tagihan orang lain lunas).
// Konfigurasi & generate tagihan hanya admin.

import { Router } from 'express';
import { requireAuth, requireRoles, requireAdmin } from '../../middleware/auth.js';
import {
  handleListBilling,
  handlePayBilling,
  handleGetConfig,
  handleSetConfig,
  handleGenerateBilling,
} from './billing.controller.js';

export const billingRouter = Router();

// Konfigurasi & generate tagihan — admin only.
billingRouter.get('/config', requireAuth, handleGetConfig);
billingRouter.post('/config', requireAuth, requireAdmin, handleSetConfig);
billingRouter.post('/generate', requireAuth, requireAdmin, handleGenerateBilling);

// Operasi data tagihan — guru/admin (self-service siswa menunggu linkage).
billingRouter.use(requireAuth, requireRoles('GURU', 'ADMIN'));
billingRouter.get('/', handleListBilling);
billingRouter.post('/:id/pay', handlePayBilling);
