import { readDB, writeDB } from './db';
import type { ClassRoom as SchoolClass } from '../../../types';
// ==================== CLASSES ====================

export function getClasses() {
  return readDB().classes;
}

export function saveClasses(nextClasses: SchoolClass[]) {
  const db = readDB();
  db.classes = nextClasses;
  writeDB(db);
}

export function setClassTeacherId(classId: string, teacherId: string) {
  const db = readDB();
  if (!db.classes.some((c) => c.id === classId)) return;
  db.classes = db.classes.map((c) => (c.id === classId ? { ...c, teacherId } : c));
  writeDB(db);
}
