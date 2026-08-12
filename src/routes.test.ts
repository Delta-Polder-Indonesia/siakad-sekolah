// Unit test pemetaan route (BUG-08: deep-link/refresh).
// Memverifikasi round-trip pageId → path → pageId utk tiap role.

import { describe, expect, it } from 'vitest';
import { pageToPath, pathToPage } from './routes';

// Pasangan (pageId, path) utk tiap role — harus round-trip konsisten.
const CASES: Array<{ role: string; pageId: string; path: string }> = [
  { role: 'teacher', pageId: 'dashboard', path: '/guru/dashboard' },
  { role: 'teacher', pageId: 'attendance', path: '/guru/absensi' },
  { role: 'teacher', pageId: 'rapot-input', path: '/guru/input-rapot' },
  { role: 'teacher', pageId: 'feedback', path: '/guru/feedback' },
  { role: 'student', pageId: 'dashboard', path: '/siswa/dashboard' },
  { role: 'student', pageId: 'tasks', path: '/siswa/kantong-tugas' },
  { role: 'student', pageId: 'billing', path: '/siswa/tagihan' },
  { role: 'student', pageId: 'feedback', path: '/siswa/feedback' },
  { role: 'parent', pageId: 'dashboard', path: '/ortu/dashboard' },
  { role: 'parent', pageId: 'letters-status', path: '/ortu/status-surat-izin' },
  { role: 'parent', pageId: 'feedback', path: '/ortu/feedback' },
  { role: 'admin', pageId: 'admin-dashboard', path: '/admin/dashboard' },
  { role: 'guest', pageId: 'dashboard', path: '/tamu' },
  { role: 'guest', pageId: 'ppdb', path: '/tamu/ppdb' },
  { role: 'guest', pageId: 'feedback', path: '/tamu/feedback' },
];

// Shared pages berlaku lintas role.
const SHARED_CASES: Array<{ pageId: string; path: string }> = [
  { pageId: 'school-announcements', path: '/pengumuman' },
  { pageId: 'personal-messages', path: '/pesan' },
  { pageId: 'academic-agenda', path: '/agenda' },
];

describe('pageToPath → pathToPage (round-trip)', () => {
  for (const c of CASES) {
    it(`${c.role}: ${c.pageId} → ${c.path}`, () => {
      expect(pageToPath(c.pageId, c.role)).toBe(c.path);
      expect(pathToPage(c.path, c.role)).toBe(c.pageId);
    });
  }

  for (const c of SHARED_CASES) {
    it(`shared: ${c.pageId} → ${c.path} (teacher)`, () => {
      expect(pageToPath(c.pageId, 'teacher')).toBe(c.path);
      expect(pathToPage(c.path, 'teacher')).toBe(c.pageId);
    });
  }

  it('menangani trailing slash pada path', () => {
    expect(pathToPage('/guru/dashboard/', 'teacher')).toBe('dashboard');
  });

  it('mengembalikan undefined utk path yang tidak dikenal role', () => {
    expect(pathToPage('/guru/billing', 'student')).toBeUndefined();
    expect(pathToPage('/tidak-ada', 'teacher')).toBeUndefined();
  });

  it('tidak mengembalikan path role lain utk role salah', () => {
    // /siswa/dashboard tidak sah utk teacher
    expect(pathToPage('/siswa/dashboard', 'teacher')).toBeUndefined();
  });
});
