// Route rapot/nilai — blueprint BUG-03.
//
// KEAMANAN (IDOR): endpoint rapot hanya dibuka untuk GURU/ADMIN. Membaca rapot
// oleh siswa/orang-tua (self-service) memerlukan linkage antara akun login dan
// data siswa yang saat ini belum andal (id local 's1' vs CUID backend; relasi
// WALIS→Student belum lengkap). Menyediakannya tanpa ownership-check berisiko
// IDOR, jadi sengaja ditutup dulu sampai linkage auth dibangun (TODO).

import { Router } from 'express';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  handleListRapot,
  handleUpsertRapot,
  handleDeleteRapot,
} from './rapot.controller.js';

export const rapotRouter = Router();

// Semua operasi rapot memerlukan login + role guru/admin.
rapotRouter.use(requireAuth, requireRoles('GURU', 'ADMIN'));

rapotRouter.get('/', handleListRapot);
rapotRouter.post('/', handleUpsertRapot);
rapotRouter.delete('/:id', handleDeleteRapot);
