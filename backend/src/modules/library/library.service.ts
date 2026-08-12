// Service layer untuk fitur perpustakaan (blueprint BUG-03, replikasi pola
// modul attendance/rapot/billing). Kontrak data mengikuti bentuk frontend
// (src/types.ts → Book, LibraryMember, LibraryTransaction).
//
// Konvensi status transaksi: frontend memakai huruf kecil
// ('menunggu'|'dipinjam'|'dikembalikan'|'terlambat'|'ditolak'), database
// memakai huruf besar ('MENUNGGU'|'DIPINJAM'|...). Service menangani konversi.

import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';

// ── Status map ──────────────────────────────────────────────────────────────
export const TX_STATUS_UI = [
  'menunggu',
  'dipinjam',
  'dikembalikan',
  'terlambat',
  'ditolak',
] as const;
export type TxStatusUI = (typeof TX_STATUS_UI)[number];

const STATUS_TO_DB: Record<TxStatusUI, string> = {
  menunggu: 'MENUNGGU',
  dipinjam: 'DIPINJAM',
  dikembalikan: 'DIKEMBALIKAN',
  terlambat: 'TERLAMBAT',
  ditolak: 'DITOLAK',
};
const DB_TO_STATUS: Record<string, TxStatusUI> = Object.fromEntries(
  Object.entries(STATUS_TO_DB).map(([ui, db]) => [db, ui as TxStatusUI])
) as Record<string, TxStatusUI>;

// ── DTO ─────────────────────────────────────────────────────────────────────
export interface BookDTO {
  id: string;
  isbn?: string | null;
  title: string;
  author: string;
  category: string;
  publisher: string;
  rack: string;
  stock: number;
  available: number;
  description?: string | null;
  coverImage?: string | null;
}

export interface MemberDTO {
  id: string;
  name: string;
  memberType: 'siswa' | 'guru' | 'staf';
  joinedAt: number;
  nis?: string | null;
  className?: string | null;
}

export interface TransactionDTO {
  id: string;
  bookId: string;
  memberId: string;
  memberName: string;
  borrowDate: string; // YYYY-MM-DD
  returnDate?: string | null;
  status: TxStatusUI;
  dueDate: string; // YYYY-MM-DD
  note?: string | null;
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function toUtcStartOfDay(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

type PrismaBook = {
  id: string; isbn: string | null; title: string; author: string; category: string;
  publisher: string; rack: string; stock: number; available: number;
  description: string | null; coverUrl: string | null;
};
type PrismaMember = {
  id: string; name: string; memberType: string; nis: string | null;
  className: string | null; joinedAt: Date;
};
type PrismaTx = {
  id: string; bookId: string; memberId: string; borrowDate: Date; dueDate: Date;
  returnDate: Date | null; status: string; note: string | null;
  member?: { name: string };
};

const serializeBook = (r: PrismaBook): BookDTO => ({
  id: r.id, isbn: r.isbn, title: r.title, author: r.author, category: r.category,
  publisher: r.publisher, rack: r.rack, stock: r.stock, available: r.available,
  description: r.description, coverImage: r.coverUrl,
});
const serializeMember = (r: PrismaMember): MemberDTO => ({
  id: r.id, name: r.name,
  memberType: (['siswa', 'guru', 'staf'] as const).includes(r.memberType as never)
    ? (r.memberType as MemberDTO['memberType']) : 'siswa',
  joinedAt: r.joinedAt.getTime(), nis: r.nis, className: r.className,
});
const serializeTx = (r: PrismaTx): TransactionDTO => ({
  id: r.id, bookId: r.bookId, memberId: r.memberId,
  memberName: r.member?.name ?? '',
  borrowDate: fmtDate(r.borrowDate), returnDate: r.returnDate ? fmtDate(r.returnDate) : null,
  status: DB_TO_STATUS[r.status] ?? 'menunggu',
  dueDate: fmtDate(r.dueDate), note: r.note,
});

// ── BOOKS ───────────────────────────────────────────────────────────────────
export interface BookListResult { items: BookDTO[]; total: number; }

export async function listBooks(filters: { category?: string; q?: string; page?: number; limit?: number; }): Promise<BookListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));
  const where: Record<string, unknown> = {};
  if (filters.category) where.category = filters.category;
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { author: { contains: filters.q, mode: 'insensitive' } },
      { isbn: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  const [rows, total] = await Promise.all([
    prisma.book.findMany({ where, orderBy: { title: 'asc' }, skip: (page - 1) * limit, take: limit }),
    prisma.book.count({ where }),
  ]);
  return { items: rows.map((r) => serializeBook(r as unknown as PrismaBook)), total };
}

export async function upsertBook(input: Omit<BookDTO, 'id' | 'available'> & { id?: string }): Promise<BookDTO> {
  const data = {
    isbn: input.isbn ?? null,
    title: input.title,
    author: input.author,
    category: input.category,
    publisher: input.publisher,
    rack: input.rack,
    stock: Math.max(0, Math.floor(input.stock)),
    description: input.description ?? null,
    coverUrl: input.coverImage ?? null,
  };
  let row;
  if (input.id) {
    row = await prisma.book.update({ where: { id: input.id }, data });
  } else {
    row = await prisma.book.create({ data: { ...data, available: data.stock } });
  }
  return serializeBook(row as unknown as PrismaBook);
}

export async function deleteBook(id: string): Promise<boolean> {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Book', id);
  await prisma.book.delete({ where: { id } });
  return true;
}

// ── MEMBERS ─────────────────────────────────────────────────────────────────
export async function listMembers(filters: { q?: string; page?: number; limit?: number; }): Promise<{ items: MemberDTO[]; total: number }> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));
  const where: Record<string, unknown> = {};
  if (filters.q) where.name = { contains: filters.q, mode: 'insensitive' };
  const [rows, total] = await Promise.all([
    prisma.libraryMember.findMany({ where, orderBy: { name: 'asc' }, skip: (page - 1) * limit, take: limit }),
    prisma.libraryMember.count({ where }),
  ]);
  return { items: rows.map((r) => serializeMember(r as unknown as PrismaMember)), total };
}

export async function upsertMember(input: Omit<MemberDTO, 'id' | 'joinedAt'> & { id?: string; joinedAt?: number }): Promise<MemberDTO> {
  const data = {
    name: input.name,
    memberType: input.memberType,
    nis: input.nis ?? null,
    className: input.className ?? null,
  };
  let row;
  if (input.id) {
    row = await prisma.libraryMember.update({ where: { id: input.id }, data });
  } else {
    row = await prisma.libraryMember.create({
      data: { ...data, joinedAt: input.joinedAt ? new Date(input.joinedAt) : new Date() },
    });
  }
  return serializeMember(row as unknown as PrismaMember);
}

export async function deleteMember(id: string): Promise<boolean> {
  const existing = await prisma.libraryMember.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('LibraryMember', id);
  await prisma.libraryMember.delete({ where: { id } });
  return true;
}

// ── TRANSACTIONS ────────────────────────────────────────────────────────────
export interface TxListResult { items: TransactionDTO[]; total: number; }

export async function listTransactions(filters: { status?: TxStatusUI; memberId?: string; page?: number; limit?: number; }): Promise<TxListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 200)));
  const where: Record<string, unknown> = {};
  if (filters.status) where.status = STATUS_TO_DB[filters.status];
  if (filters.memberId) where.memberId = filters.memberId;
  const [rows, total] = await Promise.all([
    prisma.libraryTransaction.findMany({
      where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
      include: { member: { select: { name: true } } },
    }),
    prisma.libraryTransaction.count({ where }),
  ]);
  return { items: rows.map((r) => serializeTx(r as unknown as PrismaTx)), total };
}

// Ajukan pinjaman (status MENUNGGU). Memvalidasi stok.
export async function borrowBook(input: { bookId: string; memberId: string; borrowDate: string; dueDate: string }): Promise<TransactionDTO> {
  const book = await prisma.book.findUnique({ where: { id: input.bookId } });
  if (!book) throw new NotFoundError('Book', input.bookId);
  if (book.available <= 0) throw new ConflictError('Stok buku habis.');

  const member = await prisma.libraryMember.findUnique({ where: { id: input.memberId } });
  if (!member) throw new NotFoundError('LibraryMember', input.memberId);

  const row = await prisma.libraryTransaction.create({
    data: {
      bookId: input.bookId,
      memberId: input.memberId,
      borrowDate: toUtcStartOfDay(input.borrowDate),
      dueDate: toUtcStartOfDay(input.dueDate),
      status: 'MENUNGGU',
    },
  });
  return serializeTx({ ...row, member: { name: member.name } } as unknown as PrismaTx);
}

// Setujui peminjaman (MENUNGGU → DIPINJAM), kurangi stok available.
export async function approveLoan(txId: string): Promise<TransactionDTO> {
  const tx = await prisma.libraryTransaction.findUnique({ where: { id: txId }, include: { member: { select: { name: true } } } });
  if (!tx) throw new NotFoundError('LibraryTransaction', txId);
  if (tx.status !== 'MENUNGGU') throw new ConflictError('Buku sudah diproses sebelumnya.');

  const book = await prisma.book.findUnique({ where: { id: tx.bookId } });
  if (!book) throw new NotFoundError('Book', tx.bookId);
  if (book.available <= 0) throw new ConflictError('Stok buku habis.');

  await prisma.$transaction([
    prisma.book.update({ where: { id: tx.bookId }, data: { available: { decrement: 1 } } }),
    prisma.libraryTransaction.update({ where: { id: txId }, data: { status: 'DIPINJAM' } }),
  ]);
  const updated = await prisma.libraryTransaction.findUnique({ where: { id: txId }, include: { member: { select: { name: true } } } });
  return serializeTx(updated as unknown as PrismaTx);
}

// Tolak peminjaman (MENUNGGU → DITOLAK).
export async function rejectLoan(txId: string, note = ''): Promise<TransactionDTO> {
  const tx = await prisma.libraryTransaction.findUnique({ where: { id: txId }, include: { member: { select: { name: true } } } });
  if (!tx) throw new NotFoundError('LibraryTransaction', txId);
  const updated = await prisma.libraryTransaction.update({ where: { id: txId }, data: { status: 'DITOLAK', note: note || null } });
  return serializeTx({ ...updated, member: tx.member } as unknown as PrismaTx);
}

// Kembalikan buku (→ DIKEMBALIKAN), tambah stok available.
export async function returnBook(txId: string, returnDate: string): Promise<TransactionDTO> {
  const tx = await prisma.libraryTransaction.findUnique({ where: { id: txId }, include: { member: { select: { name: true } } } });
  if (!tx) throw new NotFoundError('LibraryTransaction', txId);
  if (tx.status === 'DIKEMBALIKAN') throw new ConflictError('Buku sudah dikembalikan.');

  await prisma.$transaction([
    prisma.book.update({ where: { id: tx.bookId }, data: { available: { increment: 1 } } }),
    prisma.libraryTransaction.update({
      where: { id: txId },
      data: { status: 'DIKEMBALIKAN', returnDate: toUtcStartOfDay(returnDate) },
    }),
  ]);
  const updated = await prisma.libraryTransaction.findUnique({ where: { id: txId }, include: { member: { select: { name: true } } } });
  return serializeTx(updated as unknown as PrismaTx);
}
