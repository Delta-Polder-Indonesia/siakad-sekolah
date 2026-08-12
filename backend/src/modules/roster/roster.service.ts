// Service layer untuk fitur roster kelas (blueprint BUG-03, replikasi pola
// modul akademik lainnya). Kontrak data mengikuti bentuk frontend
// (src/types.ts → ClassRosterItem).

import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

export interface RosterDTO {
  id: string;
  classId: string;
  subject: string;
  dayOfWeek: number; // 0=Min .. 6=Sab
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  room?: string | null;
  teacherName?: string | null;
  updatedBy: string;
  updatedAt: number;
}

export interface RosterInput {
  classId: string;
  subject: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  teacherName?: string | null;
}

type PrismaRoster = {
  id: string; classId: string; subject: string; dayOfWeek: number;
  startTime: string; endTime: string; room: string | null;
  teacherName: string; updatedBy: string; updatedAt: Date;
};

const serialize = (r: PrismaRoster): RosterDTO => ({
  id: r.id, classId: r.classId, subject: r.subject, dayOfWeek: r.dayOfWeek,
  startTime: r.startTime, endTime: r.endTime, room: r.room,
  teacherName: r.teacherName, updatedBy: r.updatedBy, updatedAt: r.updatedAt.getTime(),
});

export interface RosterListResult { items: RosterDTO[]; total: number; }

// Daftar roster dengan filter classId (+ pagination).
export async function listRoster(filters: {
  classId?: string; page?: number; limit?: number;
}): Promise<RosterListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));
  const where: Record<string, unknown> = {};
  if (filters.classId) where.classId = filters.classId;

  const [rows, total] = await Promise.all([
    prisma.classRoster.findMany({ where, orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }], skip: (page - 1) * limit, take: limit }),
    prisma.classRoster.count({ where }),
  ]);
  return { items: rows.map((r) => serialize(r as unknown as PrismaRoster)), total };
}

// Tambah jadwal roster baru.
export async function createRoster(input: RosterInput, updatedBy: string): Promise<RosterDTO> {
  const row = await prisma.classRoster.create({
    data: {
      classId: input.classId,
      subject: input.subject,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      room: input.room ?? null,
      teacherName: input.teacherName ?? '',
      updatedBy,
    },
  });
  return serialize(row as unknown as PrismaRoster);
}

// Hapus satu jadwal roster.
export async function deleteRoster(id: string): Promise<boolean> {
  const existing = await prisma.classRoster.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('ClassRoster', id);
  await prisma.classRoster.delete({ where: { id } });
  return true;
}
