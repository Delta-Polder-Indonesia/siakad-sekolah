import { readDB, writeDB } from './db';
import type { Book, LibraryTransaction, LibraryMember } from '../../../types';
// ==================== LIBRARY (ENHANCED) ====================

export function getBooks() {
  return readDB().books;
}

export function saveBooks(nextBooks: Book[]) {
  const db = readDB();
  db.books = nextBooks;
  writeDB(db);
}

export function getLibraryTransactions() {
  return readDB().libraryTransactions;
}

export function saveLibraryTransactions(nextTx: LibraryTransaction[]) {
  const db = readDB();
  db.libraryTransactions = nextTx;
  writeDB(db);
}

export function borrowBook(
  bookId: string,
  memberId: string,
  memberName: string,
  borrowDate: string,
  dueDate: string
) {
  const db = readDB();
  const book = db.books.find((b) => b.id === bookId);
  if (!book) return { ok: false, message: 'Buku tidak ditemukan.' };
  if (book.available <= 0) return { ok: false, message: 'Stok buku habis.' };

  const tx: LibraryTransaction = {
    id: `TX-${Date.now()}`,
    bookId,
    memberId,
    memberName,
    borrowDate,
    dueDate,
    status: 'menunggu',
  };

  db.libraryTransactions.push(tx);
  writeDB(db);
  return { ok: true, message: 'Permohonan pinjaman berhasil diajukan. Menunggu konfirmasi admin.' };
}

export function approveLibraryLoan(txId: string) {
  const db = readDB();
  const tx = db.libraryTransactions.find((t) => t.id === txId);
  if (!tx) return { ok: false, message: 'Transaksi tidak ditemukan.' };
  if (tx.status !== 'menunggu') return { ok: false, message: 'Buku sudah diproses sebelumnya.' };

  const book = db.books.find((b) => b.id === tx.bookId);
  if (!book) return { ok: false, message: 'Buku tidak ditemukan.' };
  if (book.available <= 0) return { ok: false, message: 'Stok buku habis.' };

  book.available -= 1;
  tx.status = 'dipinjam';
  writeDB(db);
  return { ok: true, message: 'Peminjaman disetujui.' };
}

export function rejectLibraryLoan(txId: string, note = '') {
  const db = readDB();
  const tx = db.libraryTransactions.find((t) => t.id === txId);
  if (!tx) return { ok: false, message: 'Transaksi tidak ditemukan.' };

  tx.status = 'ditolak';
  tx.note = note;
  writeDB(db);
  return { ok: true, message: 'Peminjaman ditolak.' };
}

export function returnBook(txId: string, returnDate: string) {
  const db = readDB();
  const tx = db.libraryTransactions.find((t) => t.id === txId);
  if (!tx) return { ok: false, message: 'Transaksi tidak ditemukan.' };
  if (tx.status === 'dikembalikan') return { ok: false, message: 'Buku sudah dikembalikan.' };

  const book = db.books.find((b) => b.id === tx.bookId);
  if (book) book.available += 1;

  tx.returnDate = returnDate;
  tx.status = 'dikembalikan';
  writeDB(db);
  return { ok: true, message: 'Buku berhasil dikembalikan.' };
}

export function addOrUpdateBook(book: Book) {
  const db = readDB();
  const idx = db.books.findIndex((b) => b.id === book.id);
  if (idx >= 0) {
    db.books[idx] = book;
  } else {
    db.books.push(book);
  }
  writeDB(db);
}

export function deleteBook(id: string) {
  saveBooks(getBooks().filter((b) => b.id !== id));
}

export function getLibraryMembers(): LibraryMember[] {
  return readDB().libraryMembers;
}

export function saveLibraryMembers(nextMembers: LibraryMember[]) {
  const db = readDB();
  db.libraryMembers = nextMembers;
  writeDB(db);
}
