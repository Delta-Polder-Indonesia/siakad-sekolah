// Service layer untuk fitur surat izin (blueprint BUG-03, replikasi pola
// modul attendance/rapot/billing/library/assignment).
// Kontrak data mengikuti bentuk frontend (src/types.ts → SuratIzin).
//
// Konversi status: frontend 'menunggu'|'disetujui'|'ditolak' ↔ DB
// 'MENUNGGU'|'DISETUJUI'|'DITOLAK'.

import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

export const SURAT_STATUS_UI = ['menunggu', 'disetujui', 'ditolak'] as const;
export type SuratStatusUI = (typeof SURAT_STATUS_UI)[number];

const STATUS_TO_DB: Record<SuratStatusUI, string> = {
  menunggu: 'MENUNGGU',
  disetujui: 'DISETUJUI',
  ditolak: 'DITOLAK',
};
const DB_TO_STATUS: Record<string, SuratStatusUI> = Object.fromEntries(
  Object.entries(STATUS_TO_DB).map(([ui, db]) => [db, ui as SuratStatusUI])
) as Record<string, SuratStatusUI>;

export interface SuratIzinDTO {
  id: string;
  studentId: string;
  classId: string;
  type: string; // 'izin'|'sakit'|'dispensasi'|'lainnya'
  status: SuratStatusUI;
  subject: string;
  message: string;
  letterDate: string; // YYYY-MM-DD
  attachmentName?: string | null;
  attachmentDataUrl?: string | null;
  createdAt: number;
}

export interface SuratIzinInput {
  studentId: string;
  classId: string;
  type: string;
  subject: string;
  message: string;
  letterDate: string;
  attachmentName?: string | null;
  attachmentDataUrl?: string | null;
}

type PrismaSurat = {
  id: string; studentId: string; classId: string; type: string; subject: string;
  message: string; letterDate: Date; status: string; attachmentUrl: string | null;
  attachmentName: string | null; createdAt: Date;
};

function fmtDate(d: Date): string { return d.toISOString().slice(0, 10); }
function toUtcStartOfDay(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

const serialize = (r: PrismaSurat): SuratIzinDTO => ({
  id: r.id, studentId: r.studentId, classId: r.classId, type: r.type,
  status: DB_TO_STATUS[r.status] ?? 'menunggu', subject: r.subject, message: r.message,
  letterDate: fmtDate(r.letterDate),
  attachmentName: r.attachmentName, attachmentDataUrl: r.attachmentUrl,
  createdAt: r.createdAt.getTime(),
});

export interface SuratListResult { items: SuratIzinDTO[]; total: number; }

// Daftar surat izin dengan filter: studentId, classId, status.
export async function listSurat(filters: {
  studentId?: string; classId?: string; status?: SuratStatusUI;
  page?: number; limit?: number;
}): Promise<SuratListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));
  const where: Record<string, unknown> = {};
  if (filters.studentId) where.studentId = filters.studentId;
  if (filters.classId) where.classId = filters.classId;
  if (filters.status) where.status = STATUS_TO_DB[filters.status];

  const [rows, total] = await Promise.all([
    prisma.suratIzin.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.suratIzin.count({ where }),
  ]);
  return { items: rows.map((r) => serialize(r as unknown as PrismaSurat)), total };
}

// Buat surat izin baru (status awal MENUNGGU).
export async function createSurat(input: SuratIzinInput): Promise<SuratIzinDTO> {
  const row = await prisma.suratIzin.create({
    data: {
      studentId: input.studentId,
      classId: input.classId,
      type: input.type,
      subject: input.subject,
      message: input.message,
      letterDate: toUtcStartOfDay(input.letterDate),
      status: 'MENUNGGU',
      attachmentUrl: input.attachmentDataUrl ?? null,
      attachmentName: input.attachmentName ?? null,
    },
  });
  return serialize(row as unknown as PrismaSurat);
}

// Ubah status surat izin (disetujui/ditolak).
export async function updateSuratStatus(id: string, status: SuratStatusUI): Promise<SuratIzinDTO> {
  const existing = await prisma.suratIzin.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('SuratIzin', id);

  const row = await prisma.suratIzin.update({
    where: { id },
    data: { status: STATUS_TO_DB[status] },
  });
  return serialize(row as unknown as PrismaSurat);
}
