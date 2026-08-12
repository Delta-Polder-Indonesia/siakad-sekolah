// Route tugas online — blueprint BUG-03.
//
// Kebijakan akses:
// - Membuat/mengubah/menghapus tugas: GURU/ADMIN (guru yang membuat tugas).
// - Submisi tugas: MURID (mengumpulkan untuk akun sendiri) & GURU/ADMIN
//   (melihat/menilai). List submisi dibatasi GURU/ADMIN (IDOR: cegah siswa
//   melihat submisi siswa lain); detail submisi per siswa untuk MURID akan
//   di-ownership-check di masa depan (butuh linkage auth).

import { Router } from 'express';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  handleListAssignments, handleUpsertAssignment, handleDeleteAssignment,
  handleListSubmissions, handleUpsertSubmission, handleDeleteSubmission,
} from './assignment.controller.js';

export const assignmentRouter = Router();

assignmentRouter.use(requireAuth);

// Tugas
assignmentRouter.get('/', handleListAssignments);
assignmentRouter.post('/', requireRoles('GURU', 'ADMIN'), handleUpsertAssignment);

// Submisi — didaftarkan SEBELUM route dinamis /:id agar tidak tertelan.
assignmentRouter.get('/submissions', requireRoles('GURU', 'ADMIN'), handleListSubmissions);
assignmentRouter.post('/submissions', requireRoles('GURU', 'MURID', 'ADMIN'), handleUpsertSubmission);
assignmentRouter.delete('/submissions/:id', requireRoles('GURU', 'ADMIN'), handleDeleteSubmission);

// Hapus tugas (route dinamis, didaftarkan terakhir).
assignmentRouter.delete('/:id', requireRoles('GURU', 'ADMIN'), handleDeleteAssignment);
