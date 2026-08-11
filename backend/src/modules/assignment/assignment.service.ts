// Service layer untuk fitur tugas online & submisi (blueprint BUG-03,
// replikasi pola modul attendance/rapot/billing/library).
// Kontrak data mengikuti bentuk frontend (src/types.ts → OnlineAssignment &
// AssignmentSubmission). Konten kaya (summary, books, videos, attachments,
// exercises) disimpan sebagai JSON di kolom `content`.

import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

// ── DTO ─────────────────────────────────────────────────────────────────────
export interface AssignmentDTO {
  id: string;
  classId: string;
  title: string;
  description?: string | null;
  dueDate: string; // YYYY-MM-DD
  createdBy: string;
  createdAt: number;
  // Konten kaya (opsional)
  content?: Record<string, unknown> | null;
}

export interface SubmissionDTO {
  id: string;
  assignmentId: string;
  studentId: string;
  answerText?: string | null;
  attachmentName?: string | null;
  attachmentDataUrl?: string | null;
  grade?: number | null;
  feedback?: string | null;
  submittedAt: number;
}

type PrismaAssignment = {
  id: string; classId: string; title: string; description: string | null;
  content: unknown; dueDate: Date; createdBy: string; createdAt: Date;
};
type PrismaSubmission = {
  id: string; assignmentId: string; studentId: string; answerText: string | null;
  attachmentUrl: string | null; attachmentName: string | null; grade: number | null;
  feedback: string | null; submittedAt: Date;
};

function fmtDate(d: Date): string { return d.toISOString().slice(0, 10); }
function toUtcStartOfDay(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

const serializeAssignment = (r: PrismaAssignment): AssignmentDTO => ({
  id: r.id, classId: r.classId, title: r.title, description: r.description,
  dueDate: fmtDate(r.dueDate), createdBy: r.createdBy, createdAt: r.createdAt.getTime(),
  content: (r.content as Record<string, unknown>) ?? null,
});
const serializeSubmission = (r: PrismaSubmission): SubmissionDTO => ({
  id: r.id, assignmentId: r.assignmentId, studentId: r.studentId,
  answerText: r.answerText,
  attachmentName: r.attachmentName,
  attachmentDataUrl: r.attachmentUrl,
  grade: r.grade, feedback: r.feedback, submittedAt: r.submittedAt.getTime(),
});

// ── Assignments ─────────────────────────────────────────────────────────────
export interface AssignmentListResult { items: AssignmentDTO[]; total: number; }

export async function listAssignments(filters: {
  classId?: string; page?: number; limit?: number;
}): Promise<AssignmentListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));
  const where: Record<string, unknown> = {};
  if (filters.classId) where.classId = filters.classId;

  const [rows, total] = await Promise.all([
    prisma.onlineAssignment.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.onlineAssignment.count({ where }),
  ]);
  return { items: rows.map((r) => serializeAssignment(r as unknown as PrismaAssignment)), total };
}

export async function upsertAssignment(
  input: {
    id?: string; classId: string; title: string; description?: string | null;
    dueDate: string; createdBy: string; content?: Record<string, unknown> | null;
  }
): Promise<AssignmentDTO> {
  const data = {
    classId: input.classId,
    title: input.title,
    description: input.description ?? null,
    content: input.content ?? null,
    dueDate: toUtcStartOfDay(input.dueDate),
    createdBy: input.createdBy,
  };
  let row;
  if (input.id) {
    row = await prisma.onlineAssignment.update({ where: { id: input.id }, data });
  } else {
    row = await prisma.onlineAssignment.create({ data });
  }
  return serializeAssignment(row as unknown as PrismaAssignment);
}

export async function deleteAssignment(id: string): Promise<boolean> {
  const existing = await prisma.onlineAssignment.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('OnlineAssignment', id);
  await prisma.onlineAssignment.delete({ where: { id } });
  return true;
}

// ── Submissions ─────────────────────────────────────────────────────────────
export async function listSubmissions(filters: {
  assignmentId?: string; studentId?: string; page?: number; limit?: number;
}): Promise<{ items: SubmissionDTO[]; total: number }> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));
  const where: Record<string, unknown> = {};
  if (filters.assignmentId) where.assignmentId = filters.assignmentId;
  if (filters.studentId) where.studentId = filters.studentId;

  const [rows, total] = await Promise.all([
    prisma.assignmentSubmission.findMany({ where, orderBy: { submittedAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.assignmentSubmission.count({ where }),
  ]);
  return { items: rows.map((r) => serializeSubmission(r as unknown as PrismaSubmission)), total };
}

// Upsert submisi pada unique [assignmentId, studentId].
export async function upsertSubmission(
  input: {
    assignmentId: string; studentId: string; answerText?: string | null;
    attachmentName?: string | null; attachmentDataUrl?: string | null;
    grade?: number | null; feedback?: string | null;
  }
): Promise<SubmissionDTO> {
  const existing = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId: input.assignmentId, studentId: input.studentId } },
  });
  const data = {
    answerText: input.answerText ?? null,
    attachmentUrl: input.attachmentDataUrl ?? null,
    attachmentName: input.attachmentName ?? null,
    grade: input.grade ?? null,
    feedback: input.feedback ?? null,
  };
  let row;
  if (existing) {
    row = await prisma.assignmentSubmission.update({ where: { id: existing.id }, data });
  } else {
    row = await prisma.assignmentSubmission.create({ data: { assignmentId: input.assignmentId, studentId: input.studentId, ...data } });
  }
  return serializeSubmission(row as unknown as PrismaSubmission);
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const existing = await prisma.assignmentSubmission.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('AssignmentSubmission', id);
  await prisma.assignmentSubmission.delete({ where: { id } });
  return true;
}
