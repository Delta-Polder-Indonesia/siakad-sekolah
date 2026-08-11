// Service layer untuk fitur rapot/nilai (blueprint BUG-03, replikasi pola
// modul attendance). Kontrak data mengikuti bentuk frontend (src/types.ts →
// NilaiRapot): field berbahasa Indonesia + `nilaiAkhir`, dsb. Service ini
// memetakan (map) antara DTO frontend dan model Prisma `ReportCard`.

import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

// Bentuk record rapot yang dipakai frontend (API contract).
export interface NilaiRapotDTO {
  id: string;
  studentId: string;
  classId: string;
  semester: string; // 'ganjil' | 'genap' (string bebas, tidak divalidasi enum)
  tahunAjaran: string; // '2024/2025'
  mataPelajaran: string;
  nilaiHarian?: number | null;
  nilaiTugas?: number | null;
  nilaiUTS: number;
  nilaiUAS: number;
  nilaiAkhir: number;
  predikat?: string | null;
  catatanGuru?: string | null;
  inputBy?: string | null;
  createdAt?: number;
  updatedAt: number;
}

// Input untuk create/upsert (tanpa id/waktu).
export interface NilaiRapotInput {
  studentId: string;
  classId: string;
  semester: string;
  tahunAjaran: string;
  mataPelajaran: string;
  nilaiHarian?: number | null;
  nilaiTugas?: number | null;
  nilaiUTS: number;
  nilaiUAS: number;
  nilaiAkhir: number;
  predikat?: string | null;
  catatanGuru?: string | null;
}

type PrismaReportCard = {
  id: string;
  studentId: string;
  classId: string;
  academicYear: string;
  semester: string;
  subject: string;
  dailyScore: number | null;
  assignScore: number | null;
  midScore: number | null;
  finalScore: number | null;
  totalScore: number | null;
  grade: string | null;
  predikat: string | null;
  teacherNote: string | null;
  inputBy: string;
  createdAt: Date;
  updatedAt: Date;
};

function serialize(row: PrismaReportCard): NilaiRapotDTO {
  return {
    id: row.id,
    studentId: row.studentId,
    classId: row.classId,
    semester: row.semester,
    tahunAjaran: row.academicYear,
    mataPelajaran: row.subject,
    nilaiHarian: row.dailyScore,
    nilaiTugas: row.assignScore,
    nilaiUTS: row.midScore ?? 0,
    nilaiUAS: row.finalScore ?? 0,
    nilaiAkhir: row.totalScore ?? 0,
    predikat: row.predikat,
    catatanGuru: row.teacherNote,
    inputBy: row.inputBy,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
  };
}

export interface RapotListResult {
  items: NilaiRapotDTO[];
  total: number;
}

// Daftar nilai rapot dengan filter: studentId, classId, tahunAjaran, semester.
export async function listRapot(filters: {
  studentId?: string;
  classId?: string;
  tahunAjaran?: string;
  semester?: string;
  page?: number;
  limit?: number;
}): Promise<RapotListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));

  const where: Record<string, unknown> = {};
  if (filters.studentId) where.studentId = filters.studentId;
  if (filters.classId) where.classId = filters.classId;
  if (filters.tahunAjaran) where.academicYear = filters.tahunAjaran;
  if (filters.semester) where.semester = filters.semester;

  const [rows, total] = await Promise.all([
    prisma.reportCard.findMany({
      where,
      orderBy: [{ academicYear: 'desc' }, { subject: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.reportCard.count({ where }),
  ]);

  return {
    items: rows.map((r) => serialize(r as unknown as PrismaReportCard)),
    total,
  };
}

// Upsert satu baris nilai pada unique [studentId, classId, academicYear, semester, subject].
export async function upsertRapot(
  input: NilaiRapotInput,
  inputBy: string
): Promise<NilaiRapotDTO> {
  const row = await prisma.reportCard.upsert({
    where: {
      studentId_classId_academicYear_semester_subject: {
        studentId: input.studentId,
        classId: input.classId,
        academicYear: input.tahunAjaran,
        semester: input.semester,
        subject: input.mataPelajaran,
      },
    },
    update: {
      dailyScore: input.nilaiHarian ?? null,
      assignScore: input.nilaiTugas ?? null,
      midScore: input.nilaiUTS,
      finalScore: input.nilaiUAS,
      totalScore: input.nilaiAkhir,
      predikat: input.predikat ?? null,
      teacherNote: input.catatanGuru ?? null,
      inputBy,
    },
    create: {
      studentId: input.studentId,
      classId: input.classId,
      academicYear: input.tahunAjaran,
      semester: input.semester,
      subject: input.mataPelajaran,
      dailyScore: input.nilaiHarian ?? null,
      assignScore: input.nilaiTugas ?? null,
      midScore: input.nilaiUTS,
      finalScore: input.nilaiUAS,
      totalScore: input.nilaiAkhir,
      predikat: input.predikat ?? null,
      teacherNote: input.catatanGuru ?? null,
      inputBy,
    },
  });

  return serialize(row as unknown as PrismaReportCard);
}

// Hapus satu baris nilai.
export async function deleteRapot(id: string): Promise<boolean> {
  const existing = await prisma.reportCard.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('ReportCard', id);

  await prisma.reportCard.delete({ where: { id } });
  return true;
}
