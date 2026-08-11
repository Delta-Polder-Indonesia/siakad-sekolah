// Route surat izin — blueprint BUG-03.
//
// Kebijakan akses:
// - Membuat surat izin: MURID (mengajukan utk akun sendiri), GURU/ADMIN, WALIS.
// - Membaca surat: semua role login (guru/admin melihat semua utk verifikasi).
//   List per siswa dibatasi lewat ownership di masa depan (butuh linkage auth);
//   untuk sekarang list surat dibatasi GURU/ADMIN untuk menghindari IDOR,
//   kecuali pemilik (MURID) yang memfilter studentId sendiri (belum ownership-
//   check penuh, didokumentasikan).
// - Ubah status (setujui/tolak): GURU/ADMIN.

import { Router } from 'express';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  handleListSurat, handleCreateSurat, handleUpdateStatus,
} from './suratIzin.controller.js';

export const suratIzinRouter = Router();

suratIzinRouter.use(requireAuth);

// Buat surat izin — siswa/wali/guru/admin.
suratIzinRouter.post('/', requireRoles('MURID', 'WALIS', 'GURU', 'ADMIN'), handleCreateSurat);

// Baca daftar surat — guru/admin (verifikasi). List per-siswa utk MURID/WALIS
// ditutup sementara sampai ownership-check (linkage auth) dibangun.
suratIzinRouter.get('/', requireRoles('GURU', 'ADMIN'), handleListSurat);

// Ubah status — guru/admin.
suratIzinRouter.patch('/:id/status', requireRoles('GURU', 'ADMIN'), handleUpdateStatus);
