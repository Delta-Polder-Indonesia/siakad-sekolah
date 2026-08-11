// Route roster kelas — blueprint BUG-03.
//
// Kebijakan akses: semua role login boleh membaca roster (siswa perlu
// melihat jadwal). Membuat/menghapus jadwal: GURU/ADMIN (guru menyusun roster).

import { Router } from 'express';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import { handleListRoster, handleCreateRoster, handleDeleteRoster } from './roster.controller.js';

export const rosterRouter = Router();

rosterRouter.use(requireAuth);

rosterRouter.get('/', handleListRoster);
rosterRouter.post('/', requireRoles('GURU', 'ADMIN'), handleCreateRoster);
rosterRouter.delete('/:id', requireRoles('GURU', 'ADMIN'), handleDeleteRoster);
