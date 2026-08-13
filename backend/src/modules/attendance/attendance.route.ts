// Route absensi/kehadiran.
// Tulis: guru/admin. Baca: guru/admin + siswa/wali (data sendiri).

import { Router } from 'express';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import { scopeStudentQuery } from '../../middleware/ownership.js';
import {
  handleListAttendance,
  handleCreateAttendance,
  handleDeleteAttendance,
} from './attendance.controller.js';

export const attendanceRouter = Router();

attendanceRouter.use(requireAuth);

attendanceRouter.get('/', requireRoles('GURU', 'ADMIN', 'MURID', 'WALIS'), scopeStudentQuery, handleListAttendance);
attendanceRouter.post('/', requireRoles('GURU', 'ADMIN'), handleCreateAttendance);
attendanceRouter.delete('/:id', requireRoles('GURU', 'ADMIN'), handleDeleteAttendance);
