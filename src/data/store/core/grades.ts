import { readLocalKey, saveLocalKey, notifyStoreUpdated, createId, RAPOT_KEY } from './db';
import type { NilaiRapot, RpsDocument, TeacherLessonNote } from '../../../types';
// ==================== RAPOT ====================

export function getNilaiRapot(): NilaiRapot[] {
  return readLocalKey<NilaiRapot[]>(RAPOT_KEY, []);
}

export function getNilaiRapotBySiswa(
  studentId: string,
  tahunAjaran?: string,
  semester?: string
): NilaiRapot[] {
  return getNilaiRapot().filter((item) => {
    if (item.studentId !== studentId) return false;
    if (tahunAjaran && item.tahunAjaran !== tahunAjaran) return false;
    if (semester && item.semester !== semester) return false;
    return true;
  });
}

export function getTahunAjaranRapotSiswa(studentId: string): string[] {
  const all = getNilaiRapotBySiswa(studentId);
  const ta = Array.from(new Set(all.map((item) => item.tahunAjaran)));
  return ta.sort((a, b) => b.localeCompare(a));
}

export function saveNilaiRapot(nilai: NilaiRapot[]) {
  localStorage.setItem(RAPOT_KEY, JSON.stringify(nilai));
  notifyStoreUpdated();
}

export function getNilaiRapotByKelas(
  classId: string,
  tahunAjaran?: string,
  semester?: string
): NilaiRapot[] {
  return getNilaiRapot().filter((item) => {
    if (item.classId !== classId) return false;
    if (tahunAjaran && item.tahunAjaran !== tahunAjaran) return false;
    if (semester && item.semester !== semester) return false;
    return true;
  });
}

export function upsertNilaiRapot(nilai: NilaiRapot) {
  const all = getNilaiRapot();
  const idx = all.findIndex((item) => item.id === nilai.id);
  if (idx >= 0) all[idx] = nilai;
  else all.push(nilai);
  saveNilaiRapot(all);
}

export function deleteNilaiRapot(id: string) {
  saveNilaiRapot(getNilaiRapot().filter((item) => item.id !== id));
}

// ==================== RPS DOCUMENT ====================

const RPS_DOCUMENT_KEY = 'portal-siswa-rps-documents';

export function getRpsDocument(
  teacherId: string,
  classId: string,
  subject: string
): RpsDocument | null {
  const allDocs = readLocalKey<RpsDocument[]>(RPS_DOCUMENT_KEY, []);
  return (
    allDocs.find(
      (d) => d.teacherId === teacherId && d.classId === classId && d.subject === subject
    ) || null
  );
}

export function saveRpsDocument(doc: RpsDocument) {
  const allDocs = readLocalKey<RpsDocument[]>(RPS_DOCUMENT_KEY, []);
  const idx = allDocs.findIndex(
    (d) => d.teacherId === doc.teacherId && d.classId === doc.classId && d.subject === doc.subject
  );
  if (idx >= 0) {
    allDocs[idx] = { ...doc, updatedAt: Date.now() };
  } else {
    allDocs.push({ ...doc, id: doc.id || createId(), updatedAt: Date.now() });
  }
  saveLocalKey(RPS_DOCUMENT_KEY, allDocs);
}

// ==================== TEACHER LESSON NOTES ====================
const TEACHER_LESSON_NOTES_KEY = 'portal-siswa-teacher-lesson-notes';

export function getTeacherLessonNotes(
  teacherId: string,
  classId: string,
  subject: string
): TeacherLessonNote[] {
  const all = readLocalKey<TeacherLessonNote[]>(TEACHER_LESSON_NOTES_KEY, []);
  return all
    .filter(
      (note) => note.teacherId === teacherId && note.classId === classId && note.subject === subject
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function upsertTeacherLessonNote(note: Omit<TeacherLessonNote, 'id' | 'updatedAt'>): void {
  const all = readLocalKey<TeacherLessonNote[]>(TEACHER_LESSON_NOTES_KEY, []);
  const idx = all.findIndex(
    (n) =>
      n.teacherId === note.teacherId &&
      n.classId === note.classId &&
      n.subject === note.subject &&
      n.date === note.date
  );
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...note, updatedAt: Date.now() };
  } else {
    all.push({ ...note, id: createId(), updatedAt: Date.now() });
  }
  saveLocalKey(TEACHER_LESSON_NOTES_KEY, all);
}
