import {
  readDB,
  writeDB,
  readLocalKey,
  notifyStoreUpdated,
  SURAT_KEY,
  PENGUMUMAN_ADMIN_KEY,
} from './db';
import type { ClassRoster, SuratIzin, PengumumanAdmin } from './db';
import type { ClassAnnouncement } from '../../../types';
// ==================== ANNOUNCEMENTS ====================

export function getSchoolAnnouncements() {
  return readDB().announcements;
}

export function addSchoolAnnouncement(title: string, content: string) {
  const db = readDB();
  db.announcements = [
    { id: `a${Date.now()}`, title, content, date: new Date().toISOString().slice(0, 10) },
    ...db.announcements,
  ];
  writeDB(db);
}

// ==================== CLASS ROSTERS ====================

export function getClassRosters(classId: string): ClassRoster[] {
  return readDB().classRosters.filter((item) => item.classId === classId);
}

export function addClassRoster(item: ClassRoster) {
  const db = readDB();
  db.classRosters = [...db.classRosters, item];
  writeDB(db);
}

export function deleteClassRoster(rosterId: string) {
  const db = readDB();
  db.classRosters = db.classRosters.filter((item) => item.id !== rosterId);
  writeDB(db);
}

// ==================== CLASS ANNOUNCEMENTS ====================

export function getClassAnnouncements(classId: string): ClassAnnouncement[] {
  return readDB().classAnnouncements.filter((item) => item.classId === classId);
}

export function addClassAnnouncement(item: ClassAnnouncement) {
  const db = readDB();
  db.classAnnouncements = [item, ...db.classAnnouncements];
  writeDB(db);
}

export function deleteClassAnnouncement(announcementId: string) {
  const db = readDB();
  db.classAnnouncements = db.classAnnouncements.filter((item) => item.id !== announcementId);
  writeDB(db);
}

// ==================== MESSAGES ====================

export function getMessagesForRole(role: 'teacher' | 'student' | 'parent' | 'admin') {
  return readDB().messages.filter((msg) => msg.receiverRole === role || msg.receiverRole === 'all');
}

export function addMessage(
  sender: string,
  receiverRole: 'teacher' | 'student' | 'parent' | 'admin' | 'all',
  subject: string,
  content: string
) {
  const db = readDB();
  db.messages = [
    {
      id: `m${Date.now()}`,
      sender,
      receiverRole,
      subject,
      content,
      date: new Date().toISOString().slice(0, 10),
    },
    ...db.messages,
  ];
  writeDB(db);
}

// ==================== TASKS ====================

export function getTasks() {
  return readDB().tasks;
}

export function addTask(title: string, subject: string, dueDate: string) {
  const db = readDB();
  db.tasks = [{ id: `k${Date.now()}`, title, subject, dueDate, status: 'Aktif' }, ...db.tasks];
  writeDB(db);
}

// ==================== BILLS (simple) ====================

export function getBills() {
  return readDB().bills;
}

// ==================== GRADES ====================

export function getGrades() {
  return readDB().grades;
}

// ==================== SCHEDULE ====================

export function getSchedule() {
  return readDB().schedule;
}

// ==================== SURAT IZIN ====================

export function getSuratIzin(): SuratIzin[] {
  const all = readLocalKey<SuratIzin[]>(SURAT_KEY, []);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export function getSuratIzinByStudent(studentId: string): SuratIzin[] {
  return getSuratIzin().filter((item) => item.studentId === studentId);
}

export function addSuratIzin(item: SuratIzin) {
  const all = getSuratIzin();
  all.push(item);
  localStorage.setItem(SURAT_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function updateStatusSuratIzin(id: string, status: SuratIzin['status']) {
  const all = getSuratIzin().map((item) => (item.id === id ? { ...item, status } : item));
  localStorage.setItem(SURAT_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

// ==================== PENGUMUMAN ADMIN ====================

export function getPengumumanAdmin(): PengumumanAdmin[] {
  const all = readLocalKey<PengumumanAdmin[]>(PENGUMUMAN_ADMIN_KEY, []);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export function getPengumumanAdminUntukKelas(classId: string): PengumumanAdmin[] {
  return getPengumumanAdmin().filter((item) =>
    item.targetScope === 'classes' ? (item.targetClassIds ?? []).includes(classId) : true
  );
}

export function getPengumumanAdminUntukGuru(classIds: string[]): PengumumanAdmin[] {
  const classSet = new Set(classIds);
  return getPengumumanAdmin().filter((item) =>
    item.targetScope === 'classes'
      ? (item.targetClassIds ?? []).some((id) => classSet.has(id))
      : true
  );
}

export function addPengumumanAdmin(item: PengumumanAdmin): boolean {
  const all = getPengumumanAdmin();
  all.push(item);
  try {
    localStorage.setItem(PENGUMUMAN_ADMIN_KEY, JSON.stringify(all));
  } catch {
    return false;
  }
  notifyStoreUpdated();
  return true;
}

export function deletePengumumanAdmin(id: string) {
  const all = getPengumumanAdmin().filter((item) => item.id !== id);
  localStorage.setItem(PENGUMUMAN_ADMIN_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function hapusSemuaFotoPengumumanAdmin(): number {
  const all = getPengumumanAdmin();
  let count = 0;
  const next = all.map((item) => {
    if (!item.imageDataUrl && !item.imageName) return item;
    count += 1;
    return { ...item, imageDataUrl: undefined, imageName: undefined };
  });
  localStorage.setItem(PENGUMUMAN_ADMIN_KEY, JSON.stringify(next));
  notifyStoreUpdated();
  return count;
}
