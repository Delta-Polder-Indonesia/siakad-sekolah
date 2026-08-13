// Route rapot/nilai.
// GURU/ADMIN: semua data.
// MURID/WALIS: hanya data sendiri (scopeStudentQuery + ownership).

import { Router } from 'express';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import { scopeStudentQuery } from '../../middleware/ownership.js';
import {
  handleListRapot,
  handleUpsertRapot,
  handleDeleteRapot,
} from './rapot.controller.js';

export const rapotRouter = Router();

rapotRouter.use(requireAuth);

rapotRouter.get(
  '/',
  requireRoles('GURU', 'ADMIN', 'MURID', 'WALIS'),
  scopeStudentQuery,
  handleListRapot
);
rapotRouter.post('/', requireRoles('GURU', 'ADMIN'), handleUpsertRapot);
rapotRouter.delete('/:id', requireRoles('GURU', 'ADMIN'), handleDeleteRapot);
