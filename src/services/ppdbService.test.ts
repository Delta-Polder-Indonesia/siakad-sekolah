import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ppdbService } from './ppdbService';

// With no VITE_API_BASE_URL configured, the service falls back to the default
// API base (http://localhost:4000/api), so every remote call goes through fetch.
// These tests mock fetch to exercise that API branch deterministically.

type MockResponseInit = {
  ok?: boolean;
  status?: number;
  json?: unknown;
};

const jsonResponse = ({ ok = true, status = 200, json = {} }: MockResponseInit = {}) =>
  ({
    ok,
    status,
    json: async () => json,
  }) as unknown as Response;

const fetchMock = vi.fn();

beforeEach(() => {
  localStorage.clear();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ppdbService remote calls', () => {
  it('submits an application via POST and returns the created record', async () => {
    const created = { id: 'app-1', registrationNo: 'PPDB-26-NAS-000001' };
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: created }));

    const result = await ppdbService.submitApplication({ namaLengkap: 'Budi' } as never);

    expect(result).toEqual(created);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/ppdb/applications');
    expect(init.method).toBe('POST');
  });

  it('fetches the list of applications', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: [{ id: 'a' }, { id: 'b' }] }));
    const result = await ppdbService.getApplications();
    expect(result).toHaveLength(2);
  });

  it('sends the bearer token when one is stored', async () => {
    localStorage.setItem('ppdb_api_access_token', 'token-123');
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: [] }));

    await ppdbService.getApplications();

    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer token-123');
  });

  it('throws when the API responds with an error status', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, status: 500 }));
    await expect(ppdbService.getStatistics()).rejects.toThrow(/500/);
  });

  it('deletes an application and returns true on success', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ status: 204, json: {} }));
    await expect(ppdbService.deleteApplication('app-1')).resolves.toBe(true);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('DELETE');
  });

  it('refreshes the token on a 401 and retries the request once', async () => {
    localStorage.setItem('ppdb_api_access_token', 'expired');
    localStorage.setItem('ppdb_api_refresh_token', 'refresh-1');

    fetchMock
      .mockResolvedValueOnce(jsonResponse({ ok: false, status: 401 }))
      .mockResolvedValueOnce(jsonResponse({ json: { accessToken: 'fresh', refreshToken: 'r2' } }))
      .mockResolvedValueOnce(jsonResponse({ json: [{ id: 'a' }] }));

    const result = await ppdbService.getApplications();

    expect(result).toEqual([{ id: 'a' }]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(localStorage.getItem('ppdb_api_access_token')).toBe('fresh');
  });
});

describe('ppdbService.adminLogin', () => {
  it('stores tokens and marks the admin authenticated on success', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        json: { accessToken: 'acc', refreshToken: 'ref', profileName: 'Admin Satu' },
      })
    );

    await expect(ppdbService.adminLogin('admin', '0000')).resolves.toBe(true);
    expect(ppdbService.isAdminAuthenticated()).toBe(true);
    expect(ppdbService.getAdminProfileName()).toBe('Admin Satu');
  });

  it('returns false when the login request fails', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, status: 401 }));
    await expect(ppdbService.adminLogin('admin', 'bad')).resolves.toBe(false);
    expect(ppdbService.isAdminAuthenticated()).toBe(false);
  });

  it('clears stored tokens on logout', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { accessToken: 'a', refreshToken: 'b' } })
    );
    await ppdbService.adminLogin('admin', '0000');
    await ppdbService.adminLogout();
    expect(ppdbService.isAdminAuthenticated()).toBe(false);
  });
});

describe('ppdbService.getApiHealth', () => {
  it('reports the API as reachable when the health endpoint responds', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { status: 'ok' } }));
    const health = await ppdbService.getApiHealth();
    expect(health.mode).toBe('api');
    expect(health.apiReachable).toBe(true);
  });

  it('reports the API as unreachable when the health endpoint errors', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'));
    const health = await ppdbService.getApiHealth();
    expect(health.apiReachable).toBe(false);
  });
});
