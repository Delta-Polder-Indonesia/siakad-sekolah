// Route perpustakaan — blueprint BUG-03.
//
// Kebijakan akses: seluruh operasi perpustakaan memerlukan login. Operasi
// yang mengubah data (tambah/ubah/hapus buku & anggota, approve/reject/return
// transaksi) dibatasi GURU/ADMIN. Ajukan pinjaman (borrow) terbuka juga untuk
// MURID/WALIS karena itu tindakan self-service (mengajukan buku untuk akun
// sendiri), sedangkan daftar transaksi per anggota dibatasi lewat ownership
// di masa depan; untuk sekarang list transaksi dibatasi GURU/ADMIN agar tidak
// membocorkan data anggota lain (IDOR).

import { Router } from 'express';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  handleListBooks, handleUpsertBook, handleDeleteBook,
  handleListMembers, handleUpsertMember, handleDeleteMember,
  handleListTransactions, handleBorrow, handleApprove, handleReject, handleReturn,
} from './library.controller.js';

export const libraryRouter = Router();

// Semua endpoint memerlukan login.
libraryRouter.use(requireAuth);

// Baca katalog & anggota — login cukup.
libraryRouter.get('/books', handleListBooks);
libraryRouter.get('/members', handleListMembers);
libraryRouter.get('/transactions', requireRoles('GURU', 'ADMIN'), handleListTransactions);

// Tulis buku/anggota — guru/admin.
libraryRouter.post('/books', requireRoles('GURU', 'ADMIN'), handleUpsertBook);
libraryRouter.delete('/books/:id', requireRoles('GURU', 'ADMIN'), handleDeleteBook);
libraryRouter.post('/members', requireRoles('GURU', 'ADMIN'), handleUpsertMember);
libraryRouter.delete('/members/:id', requireRoles('GURU', 'ADMIN'), handleDeleteMember);

// Transaksi — ajukan pinjaman untuk semua role login; approve/reject/return guru/admin.
libraryRouter.post('/transactions/borrow', handleBorrow);
libraryRouter.post('/transactions/:id/approve', requireRoles('GURU', 'ADMIN'), handleApprove);
libraryRouter.post('/transactions/:id/reject', requireRoles('GURU', 'ADMIN'), handleReject);
libraryRouter.post('/transactions/:id/return', requireRoles('GURU', 'ADMIN'), handleReturn);
