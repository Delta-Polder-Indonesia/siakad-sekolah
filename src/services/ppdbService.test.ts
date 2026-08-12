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

type MockResponseInit = { ok?: boolean; status?: number; json?: unknown };
const jsonResponse = ({ ok = true, status = 200, json = {} }: MockResponseInit = {}) =>
  ({ ok, status, json: async () => json }) as unknown as Response;

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

  // BUG-05: saat backend aktif (hasApi=true di vitest), autentikasi admin
  // PPDB dilakukan di SERVER (POST /api/auth/admin/login → JWT), bukan lagi
  // lewat PIN di client.
  it('adminLogin memverifikasi admin ke server & menandai terautentikasi (JWT)', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, accessToken: 'acc', refreshToken: 'ref', profileName: 'admin' } })
    );
    const ok = await ppdbService.adminLogin('admin', 'secret');
    expect(ok).toBe(true);
    expect(ppdbService.isAdminAuthenticated()).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/auth/admin/login');
    expect(JSON.parse(init.body)).toMatchObject({ username: 'admin', pin: 'secret' });
  });

  it('adminLogin menolak saat server menolak kredensial', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, status: 401 }));
    const ok = await ppdbService.adminLogin('admin', 'bad');
    expect(ok).toBe(false);
    expect(ppdbService.isAdminAuthenticated()).toBe(false);
  });

  it('adminLogout menghapus token admin di client', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, accessToken: 'acc', refreshToken: 'ref', profileName: 'admin' } })
    );
    await ppdbService.adminLogin('admin', 'secret');
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
