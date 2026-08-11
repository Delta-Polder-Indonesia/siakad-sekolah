// Lapisan API untuk fitur perpustakaan (blueprint BUG-03, replikasi pola
// service domain lain). Saat backend aktif (`hasApi`) operasi lewat /api/library;
// saat tidak ada backend, fallback ke store lokal.
//
// Kontrak data sama dengan Book, LibraryMember, LibraryTransaction di src/types.ts.

import { API_BASE, hasApi } from './apiConfig';
import type { Book, LibraryMember, LibraryTransaction } from '../types';
import {
  getBooks, saveBooks, addOrUpdateBook, deleteBook,
  getLibraryMembers, saveLibraryMembers,
  getLibraryTransactions, saveLibraryTransactions,
  borrowBook as localBorrowBook,
  approveLibraryLoan, rejectLibraryLoan, returnBook as localReturnBook,
} from '../data/services';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...((init?.headers as Record<string, string>) || {}) },
  });
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return (await res.json()) as T;
}

type ListResponse<T> = { ok?: boolean; data?: T[] };

// ── BOOKS ───────────────────────────────────────────────────────────────────
export async function fetchBooks(opts?: { q?: string; category?: string }): Promise<Book[]> {
  if (!hasApi) return Promise.resolve(getBooks());
  const query = new URLSearchParams();
  if (opts?.q) query.set('q', opts.q);
  if (opts?.category) query.set('category', opts.category);
  const data = await request<ListResponse<Book>>(`/library/books?${query.toString()}`);
  const items = Array.isArray(data?.data) ? data.data : [];
  items.forEach((b) => addOrUpdateBook(b));
  return items;
}

export async function saveBookApi(book: Book): Promise<Book> {
  if (!hasApi) {
    addOrUpdateBook(book);
    return Promise.resolve(book);
  }
  const payload = {
    id: book.id?.startsWith('b') ? book.id : undefined,
    isbn: book.isbn ?? null,
    title: book.title,
    author: book.author,
    category: book.category,
    publisher: book.publisher,
    rack: book.rack,
    stock: book.stock,
    description: book.description ?? null,
    coverImage: book.coverImage ?? null,
  };
  const data = await request<{ ok?: boolean; data?: Book }>('/library/books', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const saved = (data?.data ?? book) as Book;
  addOrUpdateBook(saved);
  return saved;
}

export async function deleteBookApi(id: string): Promise<boolean> {
  if (!hasApi) {
    deleteBook(id);
    return Promise.resolve(true);
  }
  await request<{ ok?: boolean }>(`/library/books/${encodeURIComponent(id)}`, { method: 'DELETE' });
  deleteBook(id);
  return true;
}

// ── MEMBERS ─────────────────────────────────────────────────────────────────
export async function fetchLibraryMembers(): Promise<LibraryMember[]> {
  if (!hasApi) return Promise.resolve(getLibraryMembers());
  const data = await request<ListResponse<LibraryMember>>('/library/members');
  const items = Array.isArray(data?.data) ? data.data : [];
  saveLibraryMembers(items);
  return items;
}

export async function saveLibraryMemberApi(member: LibraryMember): Promise<LibraryMember> {
  if (!hasApi) {
    const list = getLibraryMembers();
    const idx = list.findIndex((m) => m.id === member.id);
    if (idx >= 0) list[idx] = member;
    else list.push(member);
    saveLibraryMembers(list);
    return Promise.resolve(member);
  }
  const payload = {
    id: member.id,
    name: member.name,
    memberType: member.memberType,
    nis: member.nis ?? null,
    className: member.className ?? null,
  };
  const data = await request<{ ok?: boolean; data?: LibraryMember }>('/library/members', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return (data?.data ?? member) as LibraryMember;
}

export async function deleteLibraryMemberApi(id: string): Promise<boolean> {
  if (!hasApi) {
    saveLibraryMembers(getLibraryMembers().filter((m) => m.id !== id));
    return Promise.resolve(true);
  }
  await request<{ ok?: boolean }>(`/library/members/${encodeURIComponent(id)}`, { method: 'DELETE' });
  saveLibraryMembers(getLibraryMembers().filter((m) => m.id !== id));
  return true;
}

// ── TRANSACTIONS ────────────────────────────────────────────────────────────
export async function fetchTransactions(opts?: { status?: LibraryTransaction['status'] }): Promise<LibraryTransaction[]> {
  if (!hasApi) return Promise.resolve(getLibraryTransactions());
  const query = new URLSearchParams();
  if (opts?.status) query.set('status', opts.status);
  const data = await request<ListResponse<LibraryTransaction>>(`/library/transactions?${query.toString()}`);
  const items = Array.isArray(data?.data) ? data.data : [];
  saveLibraryTransactions(items);
  return items;
}

// Kontrak mengikuti komponen FormPeminjaman/FormPengembalian:
// onBorrow(bookId, memberId, memberName, borrowDate, dueDate) → {ok, message}
// onApprove(txId) → {ok, message}
// onReject(txId, note?) → void
// onReturn(txId, returnDate) → {ok, message}

export async function borrowBookApi(
  bookId: string,
  memberId: string,
  _memberName: string,
  borrowDate: string,
  dueDate: string
): Promise<{ ok: boolean; message?: string }> {
  if (!hasApi) {
    const member = getLibraryMembers().find((m) => m.id === memberId);
    const r = localBorrowBook(bookId, memberId, member?.name ?? _memberName, borrowDate, dueDate);
    return Promise.resolve(r);
  }
  const data = await request<{ ok?: boolean; message?: string }>('/library/transactions/borrow', {
    method: 'POST',
    body: JSON.stringify({ bookId, memberId, borrowDate, dueDate }),
  });
  return { ok: data?.ok ?? false, message: data?.message };
}

export async function approveLoanApi(txId: string): Promise<{ ok: boolean; message?: string }> {
  if (!hasApi) {
    const r = approveLibraryLoan(txId);
    return Promise.resolve(r);
  }
  const data = await request<{ ok?: boolean; message?: string }>(
    `/library/transactions/${encodeURIComponent(txId)}/approve`,
    { method: 'POST' }
  );
  return { ok: data?.ok ?? true, message: data?.message };
}

export async function rejectLoanApi(txId: string, note = ''): Promise<void> {
  if (!hasApi) {
    rejectLibraryLoan(txId, note);
    return;
  }
  await request<{ ok?: boolean }>(`/library/transactions/${encodeURIComponent(txId)}/reject`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
}

export async function returnBookApi(
  txId: string,
  returnDate: string
): Promise<{ ok: boolean; message?: string }> {
  if (!hasApi) {
    const r = localReturnBook(txId, returnDate);
    return Promise.resolve(r);
  }
  const data = await request<{ ok?: boolean; message?: string }>(
    `/library/transactions/${encodeURIComponent(txId)}/return`,
    { method: 'POST', body: JSON.stringify({ returnDate }) }
  );
  return { ok: data?.ok ?? true, message: data?.message };
}
