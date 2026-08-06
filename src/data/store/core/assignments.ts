import {
  readDB,
  writeDB,
  readLocalKey,
  notifyStoreUpdated,
  SUBMISSION_KEY,
  QUIZ_RESULT_KEY,
} from './db';
import type {
  OnlineAssignment,
  AssignmentSubmission,
  AssignmentDiscussion,
  AssignmentQuizResult,
} from '../../../types';
// ==================== ONLINE ASSIGNMENTS ====================

export function getOnlineAssignmentsByClass(classId: string): OnlineAssignment[] {
  return readDB().onlineAssignments.filter((item) => item.classId === classId);
}

export function getAllOnlineAssignments(): OnlineAssignment[] {
  return readDB().onlineAssignments;
}

export function addOnlineAssignment(item: OnlineAssignment) {
  const db = readDB();
  db.onlineAssignments = [item, ...db.onlineAssignments];
  writeDB(db);
}

export function updateOnlineAssignment(item: OnlineAssignment) {
  const db = readDB();
  const idx = db.onlineAssignments.findIndex((existing) => existing.id === item.id);
  if (idx >= 0) db.onlineAssignments[idx] = item;
  writeDB(db);
}

export function deleteOnlineAssignment(assignmentId: string) {
  const db = readDB();
  db.onlineAssignments = db.onlineAssignments.filter((item) => item.id !== assignmentId);
  writeDB(db);
}

// ==================== ASSIGNMENT SUBMISSIONS ====================

export function getSubmissionsByAssignment(assignmentId: string): AssignmentSubmission[] {
  const all = readLocalKey<AssignmentSubmission[]>(SUBMISSION_KEY, []);
  return all
    .filter((item) => item.assignmentId === assignmentId)
    .sort((a, b) => b.submittedAt - a.submittedAt);
}

export function getSubmissionByAssignmentAndStudent(
  assignmentId: string,
  studentId: string
): AssignmentSubmission | null {
  const all = readLocalKey<AssignmentSubmission[]>(SUBMISSION_KEY, []);
  return (
    all.find((item) => item.assignmentId === assignmentId && item.studentId === studentId) ?? null
  );
}

export function upsertAssignmentSubmission(item: AssignmentSubmission) {
  const all = readLocalKey<AssignmentSubmission[]>(SUBMISSION_KEY, []);
  const idx = all.findIndex(
    (s) => s.assignmentId === item.assignmentId && s.studentId === item.studentId
  );
  if (idx >= 0) all[idx] = item;
  else all.push(item);
  localStorage.setItem(SUBMISSION_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

// ==================== ASSIGNMENT DISCUSSIONS ====================

export function getDiscussionsByAssignment(assignmentId: string): AssignmentDiscussion[] {
  return readDB()
    .assignmentDiscussions.filter((item) => item.assignmentId === assignmentId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function addAssignmentDiscussion(item: AssignmentDiscussion) {
  const db = readDB();
  db.assignmentDiscussions = [...db.assignmentDiscussions, item];
  writeDB(db);
}

/** C13: edit isi pesan diskusi forum. */
export function editAssignmentDiscussion(id: string, message: string) {
  const db = readDB();
  db.assignmentDiscussions = db.assignmentDiscussions.map((item) =>
    item.id === id ? { ...item, message } : item
  );
  writeDB(db);
}

/** C13: hapus pesan diskusi forum. */
export function deleteAssignmentDiscussion(id: string) {
  const db = readDB();
  db.assignmentDiscussions = db.assignmentDiscussions.filter((item) => item.id !== id);
  writeDB(db);
}

// ==================== ASSIGNMENT QUIZ RESULTS ====================

export function getQuizResult(
  assignmentId: string,
  studentId: string
): AssignmentQuizResult | null {
  const all = readLocalKey<AssignmentQuizResult[]>(QUIZ_RESULT_KEY, []);
  return (
    all.find((item) => item.assignmentId === assignmentId && item.studentId === studentId) ?? null
  );
}

export function saveQuizResult(item: AssignmentQuizResult) {
  const all = readLocalKey<AssignmentQuizResult[]>(QUIZ_RESULT_KEY, []);
  const idx = all.findIndex(
    (s) => s.assignmentId === item.assignmentId && s.studentId === item.studentId
  );
  if (idx >= 0) all[idx] = item;
  else all.push(item);
  localStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}
