import {
  getStudents,
  getStudentsByClass,
  addStudent,
  updateStudent,
  deleteStudent,
  saveStudents,
  getStudentClassMutations,
  addStudentClassMutation,
  getStudentStatusMutations,
  addStudentStatusMutation,
  setStudentStatus,
  generateStudentNis,
} from '../store/core/students';
import type { AuthUser, Student } from '../../types';

export {
  getStudents,
  getStudentsByClass,
  addStudent,
  updateStudent,
  deleteStudent,
  saveStudents,
  getStudentClassMutations,
  addStudentClassMutation,
  getStudentStatusMutations,
  addStudentStatusMutation,
  setStudentStatus,
  generateStudentNis,
};

/**
 * Resolusi data siswa di store lokal dari sesi login.
 * - Mode lokal: `user.id` == id siswa di store (s1, s2, ...).
 * - Mode backend: `user.id` adalah CUID Prisma yang tidak pernah cocok dengan
 *   id store lokal. Backend tidak mengembalikan NIS, jadi pencocokan memakai
 *   nama (fallback email) — nama siswa di seed backend & store lokal sama.
 */
export function getStudentByUser(user: AuthUser | null | undefined): Student | undefined {
  if (!user) return undefined;
  const students = getStudents();

  const byId = students.find((s) => s.id === user.id);
  if (byId) return byId;

  if (user.legacyId) {
    const byLegacy = students.find((s) => s.id === user.legacyId);
    if (byLegacy) return byLegacy;
  }
  if (user.nis) {
    const byNis = students.find((s) => s.nis === user.nis);
    if (byNis) return byNis;
  }

  if (!user.name) return undefined;
  const nama = user.name.trim().toLowerCase();
  const byName = students.filter((s) => s.name.trim().toLowerCase() === nama);
  if (byName.length === 0) return undefined;
  if (byName.length === 1) return byName[0];

  if (user.email) {
    const email = user.email.trim().toLowerCase();
    const byEmail = byName.find((s) => s.email && s.email.trim().toLowerCase() === email);
    if (byEmail) return byEmail;
  }
  return byName[0];
}

/**
 * Id siswa di store lokal untuk pencarian data (absensi, tagihan, rapot, dll.).
 * Selalu mengembalikan id lokal bila tersedia; fallback ke `user.id` agar
 * perilaku lama tetap berjalan pada kasus yang tidak dapat diresolusi.
 */
export function getLocalStudentId(user: AuthUser | null | undefined): string | undefined {
  if (!user) return undefined;
  return getStudentByUser(user)?.id ?? user.id;
}

/**
 * Resolusi siswa yang diasuh oleh user wali (role 'parent') di store lokal.
 * - Mode lokal: `user.id` = `p_<id siswa>` (login pakai NIS anak).
 * - Mode backend: `user.id` = `wali_<cuid>` dan `user.name` = nama wali;
 *   pencocokan memakai `parentName` yang sama di seed backend & store lokal
 *   sebagai fallback (backend login wali kini juga mendukung NIS).
 * Catatan: login wali memakai NIS anak (unik) + parentPassword, bukan nama,
 * untuk mencegah tabrakan nama wali yang sama.
 */
export function getParentStudent(user: AuthUser | null | undefined): Student | undefined {
  if (!user) return undefined;
  const students = getStudents();

  const localId = user.id.startsWith('p_') ? user.id.slice(2) : undefined;
  const byId = localId ? students.find((s) => s.id === localId) : undefined;
  if (byId) return byId;

  if (user.legacyId) {
    const byLegacy = students.find((s) => s.id === user.legacyId);
    if (byLegacy) return byLegacy;
  }

  // Fallback untuk sesi backend (wali_<cuid>) — cari via guardianOf atau parentName.
  // Untuk sesi lama yang masih pakai nama, tetap coba pencocokan nama agar tidak breaking.
  if (user.name) {
    const nama = user.name.trim().toLowerCase();
    const byParentName = students.find(
      (s) => s.parentName && s.parentName.trim().toLowerCase() === nama
    );
    if (byParentName) return byParentName;
  }
  return undefined;
}

/**
 * Id siswa yang diasuh wali di store lokal untuk pencarian data anak.
 * Fallback ke parse `p_` agar perilaku lama tetap berjalan.
 */
export function getParentStudentId(user: AuthUser | null | undefined): string | undefined {
  if (!user) return undefined;
  const student = getParentStudent(user);
  if (student) return student.id;
  return user.id.startsWith('p_') ? user.id.slice(2) : undefined;
}
