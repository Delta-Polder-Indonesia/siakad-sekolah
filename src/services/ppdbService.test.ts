import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ppdbService } from './ppdbService';

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

describe('ppdbService — mode API (hasApi=true)', () => {
  it('getApplications memanggil /ppdb/applications', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: [{ id: '1', namaLengkap: 'Budi' }] } }));
    const apps = await ppdbService.getApplications();
    expect(apps[0].namaLengkap).toBe('Budi');
    expect(String(fetchMock.mock.calls[0][0])).toContain('/ppdb/applications');
  });

  it('submitApplication POST /ppdb/applications', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, data: { id: 'x', namaLengkap: 'Budi Santoso' } } })
    );
    const created = await ppdbService.submitApplication({
      namaLengkap: 'Budi Santoso',
      email: 'budi@example.com',
    } as never);
    expect(created.namaLengkap).toBe('Budi Santoso');
    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
  });

  it('adminLogin memverifikasi admin ke server', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, accessToken: 'acc', refreshToken: 'ref', profileName: 'admin' } })
    );
    const ok = await ppdbService.adminLogin('admin', 'secret');
    expect(ok).toBe(true);
    expect(ppdbService.isAdminAuthenticated()).toBe(true);
  });

  it('adminLogin menolak saat server menolak kredensial', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, status: 401 }));
    const ok = await ppdbService.adminLogin('admin', 'bad');
    expect(ok).toBe(false);
  });

  it('getApiHealth memanggil /health', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { status: 'ok' } }));
    const health = await ppdbService.getApiHealth();
    expect(health.mode).toBe('api');
    expect(health.apiReachable).toBe(true);
  });
});
