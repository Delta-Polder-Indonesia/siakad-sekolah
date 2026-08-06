import {
  readDB,
  writeDB,
  readLocalKey,
  notifyStoreUpdated,
  STUDENT_CLASS_MUTATION_KEY,
  STUDENT_STATUS_MUTATION_KEY,
} from './db';
import type {
  Student,
  StudentClassMutation,
  StudentStatusMutation,
  StudentStatus,
} from '../../../types';
// ==================== STUDENTS ====================

export function getStudents() {
  return readDB().students;
}

export function saveStudents(nextStudents: Student[]) {
  const db = readDB();
  db.students = nextStudents;
  writeDB(db);
}

export function getStudentsByClass(classId: string): Student[] {
  return getStudents().filter((s) => s.classId === classId);
}

export function updateStudent(student: Student) {
  const students = getStudents();
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) students[idx] = student;
  saveStudents(students);
}

export function deleteStudent(id: string) {
  saveStudents(getStudents().filter((s) => s.id !== id));
  const db = readDB();
  db.attendances = db.attendances.filter((a) => a.studentId !== id);
  writeDB(db);
}

export function addStudent(student: Student) {
  const students = getStudents();
  students.push(student);
  saveStudents(students);
}

export function getStudentClassMutations(studentId?: string) {
  const all = readLocalKey<StudentClassMutation[]>(STUDENT_CLASS_MUTATION_KEY, []);
  const filtered = studentId ? all.filter((item) => item.studentId === studentId) : all;
  return filtered.sort((a, b) => new Date(b.movedAt).getTime() - new Date(a.movedAt).getTime());
}

export function addStudentClassMutation(payload: Omit<StudentClassMutation, 'id' | 'movedAt'>) {
  const all = readLocalKey<StudentClassMutation[]>(STUDENT_CLASS_MUTATION_KEY, []);
  all.unshift({ ...payload, id: `mut-${Date.now()}`, movedAt: new Date().toISOString() });
  localStorage.setItem(STUDENT_CLASS_MUTATION_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function getStudentStatusMutations(studentId?: string) {
  const all = readLocalKey<StudentStatusMutation[]>(STUDENT_STATUS_MUTATION_KEY, []);
  const filtered = studentId ? all.filter((item) => item.studentId === studentId) : all;
  return filtered.sort((a, b) => new Date(b.movedAt).getTime() - new Date(a.movedAt).getTime());
}

export function addStudentStatusMutation(payload: Omit<StudentStatusMutation, 'id' | 'movedAt'>) {
  const all = readLocalKey<StudentStatusMutation[]>(STUDENT_STATUS_MUTATION_KEY, []);
  all.unshift({ ...payload, id: `stmut-${Date.now()}`, movedAt: new Date().toISOString() });
  localStorage.setItem(STUDENT_STATUS_MUTATION_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function setStudentStatus(studentId: string, status: StudentStatus, note: string): boolean {
  const students = getStudents();
  const idx = students.findIndex((item) => item.id === studentId);
  if (idx < 0) return false;
  const current = students[idx];
  if (current.status === status) return false;
  students[idx] = {
    ...current,
    status,
    statusNote: note.trim(),
    statusUpdatedAt: new Date().toISOString(),
  };
  saveStudents(students);
  addStudentStatusMutation({
    studentId,
    studentName: current.name,
    fromStatus: current.status || 'aktif',
    toStatus: status,
    note: note.trim(),
  });
  return true;
}

export function generateStudentNis(students: Student[]) {
  const year = new Date().getFullYear();
  const maxSerial = students.reduce((max, student) => {
    const parsed = Number.parseInt(student.nis.slice(-3), 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 0);
  return `${year}${String(maxSerial + 1).padStart(3, '0')}`;
}
