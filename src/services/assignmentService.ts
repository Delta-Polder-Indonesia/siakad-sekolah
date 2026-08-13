// Lapisan API untuk fitur tugas online & submisi (blueprint BUG-03).
// Saat backend aktif (`hasApi`) operasi lewat /api/assignments; saat tidak,
// fallback ke store lokal.
//
// Kontrak data sama dengan OnlineAssignment & AssignmentSubmission di src/types.ts.

import { hasApi } from './apiConfig';
import { apiRequest } from './apiClient';
import type { OnlineAssignment, AssignmentSubmission } from '../types';
import {
  getOnlineAssignmentsByClass,
  addOnlineAssignment,
  updateOnlineAssignment,
  deleteOnlineAssignment,
  getSubmissionsByAssignment,
  getSubmissionByAssignmentAndStudent,
  upsertAssignmentSubmission,
} from '../data/services';

const request = apiRequest;

type ListResponse<T> = { ok?: boolean; data?: T[] };
type ItemResponse<T> = { ok?: boolean; data?: T };

// ── Assignments ─────────────────────────────────────────────────────────────
export async function fetchAssignmentsByClass(classId: string): Promise<OnlineAssignment[]> {
  if (!hasApi) return Promise.resolve(getOnlineAssignmentsByClass(classId));
  const query = new URLSearchParams({ classId });
  const data = await request<ListResponse<OnlineAssignment>>(`/assignments?${query.toString()}`);
  const items = Array.isArray(data?.data) ? data.data : [];
  // Sinkronkan ke store lokal agar komponen berbasis store konsisten.
  items.forEach((a) => updateOnlineAssignment(a));
  return items;
}

export async function saveAssignmentApi(
  assignment: OnlineAssignment
): Promise<OnlineAssignment> {
  if (!hasApi) {
    const exists = getOnlineAssignmentsByClass(assignment.classId).some((a) => a.id === assignment.id);
    if (exists) updateOnlineAssignment(assignment);
    else addOnlineAssignment(assignment);
    return Promise.resolve(assignment);
  }
  const payload = {
    id: assignment.id.startsWith('task_') ? undefined : assignment.id,
    classId: assignment.classId,
    title: assignment.title,
    description: assignment.description,
    dueDate: assignment.dueDate,
    content: {
      summary: assignment.summary,
      books: assignment.books,
      videos: assignment.videos,
      attachments: assignment.attachments,
      exercises: assignment.exercises,
    },
  };
  const data = await request<ItemResponse<OnlineAssignment>>('/assignments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const saved = (data?.data ?? assignment) as OnlineAssignment;
  updateOnlineAssignment(saved);
  return saved;
}

export async function deleteAssignmentApi(id: string): Promise<boolean> {
  if (!hasApi) {
    deleteOnlineAssignment(id);
    return Promise.resolve(true);
  }
  await request<{ ok?: boolean }>(`/assignments/${encodeURIComponent(id)}`, { method: 'DELETE' });
  deleteOnlineAssignment(id);
  return true;
}

// ── Submissions ─────────────────────────────────────────────────────────────
export async function fetchSubmissionsByAssignment(
  assignmentId: string
): Promise<AssignmentSubmission[]> {
  if (!hasApi) return Promise.resolve(getSubmissionsByAssignment(assignmentId));
  const query = new URLSearchParams({ assignmentId });
  const data = await request<ListResponse<AssignmentSubmission>>(`/assignments/submissions?${query.toString()}`);
  return Array.isArray(data?.data) ? data.data : [];
}

export async function submitAssignmentApi(
  submission: AssignmentSubmission
): Promise<AssignmentSubmission> {
  if (!hasApi) {
    upsertAssignmentSubmission(submission);
    return Promise.resolve(submission);
  }
  const payload = {
    assignmentId: submission.assignmentId,
    studentId: submission.studentId,
    answerText: submission.answerText,
    attachmentName: submission.attachmentName,
    attachmentDataUrl: submission.attachmentDataUrl,
  };
  const data = await request<ItemResponse<AssignmentSubmission>>('/assignments/submissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const saved = (data?.data ?? submission) as AssignmentSubmission;
  upsertAssignmentSubmission(saved);
  return saved;
}

export async function getMySubmissionApi(
  assignmentId: string,
  studentId: string
): Promise<AssignmentSubmission | null> {
  if (!hasApi) return Promise.resolve(getSubmissionByAssignmentAndStudent(assignmentId, studentId));
  const items = await fetchSubmissionsByAssignment(assignmentId);
  return items.find((s) => s.studentId === studentId) ?? null;
}
