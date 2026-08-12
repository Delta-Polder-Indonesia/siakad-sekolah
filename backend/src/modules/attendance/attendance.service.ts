// Service layer untuk fitur absensi/kehadiran siswa.
// Blueprint BUG-03: contoh domain akademik yang disambungkan ke backend.
//
// Kontrak data mengikuti bentuk yang dipakai frontend (src/types.ts →
// AttendanceRecord): status huruf kecil ('hadir'|'izin'|'sakit'|'alpha'),
// tanggal `YYYY-MM-DD`, field `markedBy` (id guru) & `timestamp` (ms epoch).
// Service ini men-serialize row DB (Prisma `Attendance`) ke bentuk tersebut
// sehingga frontend tidak perlu tahu detail penyimpanan di database.

import { prisma } from '../../lib/prisma.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';

// Nilai status yang valid di sisi frontend.
export const ATTENDANCE_STATUSES = ['hadir', 'izin', 'sakit', 'alpha'] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

// Bentuk record absensi yang dipakai frontend (API contract).
export interface AttendanceRecordDTO {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string | null;
  markedBy: string; // id guru
  timestamp: number; // ms epoch
}

// Input untuk create/upsert — field yang sama, tanpa id/timestamp.
export interface AttendanceInput {
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string | null;
}

type PrismaAttendance = {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  status: string;
  note: string | null;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
};

// ── helpers date ────────────────────────────────────────────────────────────
// Normalisasi tanggal 'YYYY-MM-DD' → Date (UTC tengah malam) agar konsisten
// dengan unique constraint [studentId, date] di schema.
function toUtcStartOfDay(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Serialize row DB → DTO frontend.
function serialize(row: PrismaAttendance): AttendanceRecordDTO {
  return {
    id: row.id,
    studentId: row.studentId,
    classId: row.classId,
    date: formatDate(row.date),
    status: (ATTENDANCE_STATUSES as readonly string[]).includes(row.status)
      ? (row.status as AttendanceStatus)
      : 'hadir',
    note: row.note,
    markedBy: row.teacherId,
    timestamp: row.createdAt.getTime(),
  };
}

export interface AttendanceListResult {
  items: AttendanceRecordDTO[];
  total: number;
}

// Daftar absensi dengan filter opsional: date (YYYY-MM-DD), classId, studentId.
export async function listAttendance(filters: {
  date?: string;
  classId?: string;
  studentId?: string;
  page?: number;
  limit?: number;
}): Promise<AttendanceListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));

  const where: Record<string, unknown> = {};
  if (filters.studentId) where.studentId = filters.studentId;
  if (filters.classId) where.classId = filters.classId;
  if (filters.date) {
    const start = toUtcStartOfDay(filters.date);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    where.date = { gte: start, lt: end };
  }

  const [rows, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.attendance.count({ where }),
  ]);

  return {
    items: rows.map((r) => serialize(r as unknown as PrismaAttendance)),
    total,
  };
}

// Simpan sekumpulan record absensi (bulk upsert).
// Upsert per baris pada unique [studentId, date]; jika terjadi konflik tulis
// (mis. baris yang sama dikirim dua kali), gunakan createMany dengan skipDuplicates.
export async function createAttendanceRecords(
  records: AttendanceInput[],
  teacherId: string
): Promise<{ count: number; items: AttendanceRecordDTO[] }> {
  if (!records.length) return { count: 0, items: [] };

  const payload = records.map((r) => ({
    studentId: r.studentId,
    teacherId,
    classId: r.classId,
    date: toUtcStartOfDay(r.date),
    status: r.status,
    note: r.note ?? null,
  }));

  const result = await prisma.attendance.createMany({
    data: payload,
    skipDuplicates: true,
  });

  if (result.count !== payload.length) {
    throw new ConflictError(
      'Beberapa record absensi sudah ada pada tanggal yang sama dan dilewati (skipDuplicates).'
    );
  }

  // Muat kembali record yang baru disimpan untuk dikembalikan ke frontend.
  const saved = await prisma.attendance.findMany({
    where: { teacherId },
    orderBy: { createdAt: 'desc' },
    take: payload.length,
  });

  return {
    count: result.count,
    items: saved.map((r) => serialize(r as unknown as PrismaAttendance)),
  };
}

// Hapus satu record absensi.
export async function deleteAttendance(id: string): Promise<boolean> {
  const existing = await prisma.attendance.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Attendance', id);

  await prisma.attendance.delete({ where: { id } });
  return true;
}
