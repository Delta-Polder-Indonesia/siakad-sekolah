import { ClassRoom, Teacher } from '../../../types';

/**
 * Atur hak akses kelas ajar (classIds) secara eksklusif.
 * Kelas binaan / wali kelas (`ClassRoom.teacherId`) TIDAK disentuh di sini —
 * dikelola terpisah lewat `setClassTeacherId` (dropdown wali kelas di TabAkunGuru).
 */
export function applyExclusiveClassAssignment(
  allTeachers: Teacher[],
  allClasses: ClassRoom[],
  targetTeacherId: string,
  selectedClassIds: string[]
) {
  const selectedSet = new Set(selectedClassIds);

  const nextTeachers = allTeachers.map((item) => {
    if (item.id === targetTeacherId) {
      return { ...item, classIds: [...selectedSet] };
    }
    return { ...item, classIds: item.classIds.filter((classId) => !selectedSet.has(classId)) };
  });

  // Kelas dipertahankan utuh — relasi homeroom diatur terpisah.
  return { nextTeachers, nextClasses: allClasses };
}
