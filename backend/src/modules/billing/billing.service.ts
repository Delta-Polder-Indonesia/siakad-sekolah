// Service layer untuk fitur tagihan/billing sekolah (blueprint BUG-03,
// replikasi pola modul attendance/rapot). Kontrak data mengikuti bentuk
// frontend (src/types.ts → TagihanSekolah & PengaturanTagihan).

import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';

// ── DTO ─────────────────────────────────────────────────────────────────────
export interface TagihanDTO {
  id: string;
  studentId: string;
  year: number;
  month: number; // 1-12
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: 'lunas' | 'belum_lunas';
  paymentMethod?: string | null;
  paidAt?: number | null;
}

export interface PengaturanDTO {
  monthlyAmount: number;
  dueDay: number;
  updatedAt: number;
  updatedBy: string;
}

type PrismaBilling = {
  id: string;
  studentId: string;
  year: number;
  month: number;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  paymentMethod: string | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function serialize(row: PrismaBilling): TagihanDTO {
  return {
    id: row.id,
    studentId: row.studentId,
    year: row.year,
    month: row.month,
    amount: row.amount,
    dueDate: row.dueDate.toISOString().slice(0, 10),
    status: row.isPaid ? 'lunas' : 'belum_lunas',
    paymentMethod: row.paymentMethod,
    paidAt: row.paidAt ? row.paidAt.getTime() : null,
  };
}

// Normalisasi 'YYYY-MM-DD' → Date UTC start-of-day.
function toUtcStartOfDay(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export interface BillingListResult {
  items: TagihanDTO[];
  total: number;
}

// Daftar tagihan dengan filter: studentId, year, status ('lunas'|'belum_lunas').
export async function listBilling(filters: {
  studentId?: string;
  year?: number;
  status?: 'lunas' | 'belum_lunas';
  page?: number;
  limit?: number;
}): Promise<BillingListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));

  const where: Record<string, unknown> = {};
  if (filters.studentId) where.studentId = filters.studentId;
  if (filters.year) where.year = filters.year;
  if (filters.status === 'lunas') where.isPaid = true;
  if (filters.status === 'belum_lunas') where.isPaid = false;

  const [rows, total] = await Promise.all([
    prisma.billing.findMany({
      where,
      orderBy: [{ year: 'desc' }, { month: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.billing.count({ where }),
  ]);

  return {
    items: rows.map((r) => serialize(r as unknown as PrismaBilling)),
    total,
  };
}

// Bayar satu tagihan (mark isPaid=true).
export async function payBilling(
  id: string,
  paymentMethod: string
): Promise<TagihanDTO> {
  const existing = await prisma.billing.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Billing', id);

  const updated = await prisma.billing.update({
    where: { id },
    data: {
      isPaid: true,
      paymentMethod,
      paidAt: new Date(),
    },
  });

  return serialize(updated as unknown as PrismaBilling);
}

// ── Konfigurasi tagihan ─────────────────────────────────────────────────────
export async function getPengaturan(): Promise<PengaturanDTO> {
  const row = await prisma.billingConfig.findFirst({ orderBy: { updatedAt: 'desc' } });
  if (!row) return { monthlyAmount: 0, dueDay: 10, updatedAt: 0, updatedBy: 'system' };
  return {
    monthlyAmount: row.monthlyAmount,
    dueDay: row.dueDay,
    updatedAt: row.updatedAt.getTime(),
    updatedBy: row.updatedBy,
  };
}

export async function setPengaturan(
  monthlyAmount: number,
  dueDay: number,
  updatedBy: string
): Promise<PengaturanDTO> {
  const safeDay = Math.min(28, Math.max(1, Math.floor(dueDay)));
  const row = await prisma.billingConfig.create({
    data: {
      monthlyAmount: Math.max(0, Math.floor(monthlyAmount)),
      dueDay: safeDay,
      updatedBy,
    },
  });
  return {
    monthlyAmount: row.monthlyAmount,
    dueDay: row.dueDay,
    updatedAt: row.updatedAt.getTime(),
    updatedBy: row.updatedBy,
  };
}

// Generate/upsert tagihan tahunan untuk semua siswa (12 bulan). Memakai
// createMany skipDuplicates pada unique [studentId, year, month].
export async function generateAnnualBilling(input: {
  year: number;
  monthlyAmount: number;
  dueDay: number;
  updatedBy: string;
}): Promise<{ count: number }> {
  const safeDay = Math.min(28, Math.max(1, Math.floor(input.dueDay)));
  const year = Math.floor(input.year);
  const amount = Math.max(0, Math.floor(input.monthlyAmount));

  const students = await prisma.student.findMany({ select: { id: true } });

  const payload = students.flatMap((s) =>
    Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return {
        studentId: s.id,
        year,
        month,
        amount,
        dueDate: toUtcStartOfDay(
          `${year}-${String(month).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`
        ),
      };
    })
  );

  const result = await prisma.billing.createMany({
    data: payload,
    skipDuplicates: true,
  });

  // Update amount untuk baris yang sudah ada (bila nominal berubah).
  if (students.length > 0) {
    await prisma.billing.updateMany({
      where: { year, amount: { not: amount } },
      data: { amount },
    });
  }

  return { count: result.count + students.length * 12 };
}

// ── helper untuk kontroler ──────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  'atm',
  'mobile_banking',
  'internet_banking',
  'ewallet',
  'tunai',
] as const;
