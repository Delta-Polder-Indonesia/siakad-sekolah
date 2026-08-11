import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ppdbService } from './ppdbService';

// ─────────────────────────────────────────────────────────────────────────────
// PPDB saat ini berjalan dalam mode LOKAL (tanpa backend `/ppdb`).
// `usePpdbApi` di ppdbService.ts di-set `false` sehingga service TIDAK memanggil
// fetch ke endpoint `/ppdb/*` yang belum tersedia di backend.
//
// Referensi: laporan audit BUG-02 (Phase 1) & TODO(Phase 3) di ppdbService.ts.
// Ketika modul backend `/ppdb` sudah dibangun dan `usePpdbApi` diaktifkan,
// test-test mode API (fetch) perlu ditambahkan kembali di sini.
// ─────────────────────────────────────────────────────────────────────────────

const fetchMock = vi.fn();

beforeEach(() => {
  localStorage.clear();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ppdbService — mode lokal (backend /ppdb belum ada)', () => {
  it('getApplications memakai data lokal tanpa memanggil fetch', async () => {
    const apps = await ppdbService.getApplications();
    expect(Array.isArray(apps)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submitApplication menyimpan ke storage lokal tanpa fetch', async () => {
    const created = await ppdbService.submitApplication({
      namaLengkap: 'Budi Santoso',
      email: 'budi@example.com',
    } as never);
    expect(created).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();

    const apps = await ppdbService.getApplications();
    expect(apps.some((a) => a.namaLengkap === 'Budi Santoso')).toBe(true);
  });

  it('deleteApplication menghapus dari storage lokal tanpa fetch', async () => {
    const created = await ppdbService.submitApplication({
      namaLengkap: 'Siti Aminah',
    } as never);
    const ok = await ppdbService.deleteApplication(created.id);
    expect(ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('adminLogin memvalidasi PIN lokal dan tidak memanggil fetch', async () => {
    vi.stubEnv('VITE_ADMIN_PIN', '123456');
    const ok = await ppdbService.adminLogin('admin', '123456');
    expect(ok).toBe(true);
    expect(ppdbService.isAdminAuthenticated()).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('adminLogin menolak PIN yang salah', async () => {
    vi.stubEnv('VITE_ADMIN_PIN', '123456');
    const ok = await ppdbService.adminLogin('admin', '0000');
    expect(ok).toBe(false);
    expect(ppdbService.isAdminAuthenticated()).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('adminLogout menghapus sesi admin lokal', async () => {
    vi.stubEnv('VITE_ADMIN_PIN', '123456');
    await ppdbService.adminLogin('admin', '123456');
    await ppdbService.adminLogout();
    expect(ppdbService.isAdminAuthenticated()).toBe(false);
  });

  it('getApiHealth melaporkan mode lokal tanpa fetch', async () => {
    const health = await ppdbService.getApiHealth();
    expect(health.mode).toBe('local');
    expect(health.apiReachable).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
