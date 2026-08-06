import { readDB, writeDB } from './db';
import type { Teacher } from '../../../types';
// ==================== TEACHERS ====================

export function getTeacherList() {
  return readDB().teachers;
}

export function getTeachers() {
  return getTeacherList();
}

export function saveTeachers(nextTeachers: Teacher[]) {
  const db = readDB();
  db.teachers = nextTeachers;
  writeDB(db);
}

export function updateTeacher(teacher: Teacher) {
  const teachers = getTeachers();
  const idx = teachers.findIndex((t) => t.id === teacher.id);
  if (idx >= 0) teachers[idx] = teacher;
  saveTeachers(teachers);
}
