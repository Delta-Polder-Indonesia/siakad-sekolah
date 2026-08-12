// Route absensi/kehadiran — blueprint BUG-03.
// Akses dibatasi guru & admin (mengisi absensi adalah tugas guru).

import { Router } from 'express';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  handleListAttendance,
  handleCreateAttendance,
  handleDeleteAttendance,
} from './attendance.controller.js';

export const attendanceRouter = Router();

// Semua operasi absensi memerlukan login + role guru/admin.
attendanceRouter.use(requireAuth, requireRoles('GURU', 'ADMIN'));

attendanceRouter.get('/', handleListAttendance);
attendanceRouter.post('/', handleCreateAttendance);
attendanceRouter.delete('/:id', handleDeleteAttendance);
