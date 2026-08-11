import { getTeachers, getTeacherList, saveTeachers, updateTeacher } from '../store/core/teachers';
import type { AuthUser, Teacher } from '../../types';

export { getTeachers, getTeacherList, saveTeachers, updateTeacher };

/**
 * Resolusi data guru di store lokal dari sesi login.
 * - Mode lokal: `user.id` == id guru di store (t1, t2, ...).
 * - Mode backend: `user.id` adalah CUID Prisma. Backend tidak mengembalikan
 *   NIP, jadi pencocokan memakai nama — nama guru seed backend & store sama.
 */
export function getTeacherByUser(user: AuthUser | null | undefined): Teacher | undefined {
  if (!user) return undefined;
  const teachers = getTeachers();

  const byId = teachers.find((t) => t.id === user.id);
  if (byId) return byId;

  if (!user.name) return undefined;
  const nama = user.name.trim().toLowerCase();
  return teachers.find((t) => t.name.trim().toLowerCase() === nama);
}

/**
 * Id guru di store lokal untuk pencatatan (createdBy, markedBy, inputBy, dll.).
 * Fallback ke `user.id` agar perilaku lama tetap berjalan.
 */
export function getLocalTeacherId(user: AuthUser | null | undefined): string | undefined {
  if (!user) return undefined;
  return getTeacherByUser(user)?.id ?? user.id;
}
