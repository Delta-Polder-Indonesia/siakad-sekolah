import { readDB, writeDB } from './db';
import type { AttendanceEntry } from './db';
// ==================== ATTENDANCE ====================

export function getAttendance() {
  return readDB().attendances;
}

export function saveAttendance(nextAttendance: AttendanceEntry[]) {
  const db = readDB();
  db.attendances = nextAttendance;
  writeDB(db);
}

export function getAttendanceByDate(date: string, classId?: string): AttendanceEntry[] {
  return getAttendance().filter((r) => r.date === date && (classId ? r.classId === classId : true));
}

export function getAttendanceByDateRange(
  startDate: string,
  endDate: string,
  classId?: string
): AttendanceEntry[] {
  return getAttendance().filter((r) => {
    const dateMatch = r.date >= startDate && r.date <= endDate;
    const classMatch = classId ? r.classId === classId : true;
    return dateMatch && classMatch;
  });
}

export function getAttendanceByStudent(studentId: string): AttendanceEntry[] {
  return getAttendance().filter((r) => r.studentId === studentId);
}

export function addAttendanceRecords(records: AttendanceEntry[]) {
  const existing = getAttendance();
  const newKeys = new Set(records.map((r) => `${r.studentId}_${r.date}`));
  const filtered = existing.filter((e) => !newKeys.has(`${e.studentId}_${e.date}`));
  filtered.push(...records);
  saveAttendance(filtered);
}

export function getAttendanceRecords() {
  return readDB().attendance;
}
