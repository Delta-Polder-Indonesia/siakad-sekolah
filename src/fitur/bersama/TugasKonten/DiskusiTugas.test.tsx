/**
 * Smoke test render DiskusiTugas (full & compact) — memastikan komponen
 * hasil pemecahan (hook + sidebar + stream + composer) bekerja bersama.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DiskusiTugas from './DiskusiTugas';
import { ToastProvider } from '../../../components/ui';
import { addAssignmentDiscussion } from '../../../data/services';
import type { OnlineAssignment, AuthUser } from '../../../types';

const ASSIGNMENT: OnlineAssignment = {
  id: 'asg-1',
  classId: 'class-1',
  title: 'Tugas Matematika',
  description: 'Kerjakan soal',
  dueDate: '2026-08-20',
  createdBy: 'guru-1',
  createdAt: 1750000000000,
};

const USER: AuthUser = {
  id: 'student-1',
  name: 'Budi Santoso',
  role: 'student',
};

function renderFull() {
  return render(
    <ToastProvider>
      <DiskusiTugas assignment={ASSIGNMENT} user={USER} />
    </ToastProvider>
  );
}

describe('DiskusiTugas (hasil refactor god-component)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('varian full menampilkan panel forum, pencarian, dan kotak kirim', () => {
    renderFull();
    expect(screen.getByPlaceholderText('Cari percakapan...')).toBeTruthy();
    expect(screen.getByText('Peserta Forum (Semua)')).toBeTruthy();
    expect(screen.getByText('Forum Diskusi Kelas')).toBeTruthy();
    expect(screen.getByText('KIRIM')).toBeTruthy();
  });

  it('varian compact menampilkan daftar diskusi + kotak balasan', () => {
    render(
      <ToastProvider>
        <DiskusiTugas assignment={ASSIGNMENT} user={USER} variant="compact" />
      </ToastProvider>
    );
    expect(screen.getByText(/Diskusi \(0\)/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Ketik balasan...')).toBeTruthy();
    expect(screen.getByText('Kirim')).toBeTruthy();
  });

  it('menampilkan pesan forum yang sudah ada', () => {
    // Seed satu diskusi via data service (store lokal)
    addAssignmentDiscussion({
      id: 'disc-test-1',
      assignmentId: ASSIGNMENT.id,
      authorId: 'guru-1',
      authorName: 'Pak Guru',
      role: 'guru',
      message: 'Silakan kerjakan sampai halaman 10',
      createdAt: Date.now(),
    });
    renderFull();
    expect(screen.getByText('Silakan kerjakan sampai halaman 10')).toBeTruthy();
    expect(screen.getByText('Pak Guru')).toBeTruthy();
  });
});
