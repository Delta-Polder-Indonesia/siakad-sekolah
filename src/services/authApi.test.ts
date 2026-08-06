import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loginPortal } from './authApi';

type MockResponseInit = { ok?: boolean; status?: number; json?: unknown };

const jsonResponse = ({ ok = true, status = 200, json = {} }: MockResponseInit = {}) =>
  ({ ok, status, json: async () => json }) as unknown as Response;

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loginPortal', () => {
  it('maps the student role to MURID and returns ok on success', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        json: {
          ok: true,
          user: { id: 's1', name: 'Siti', role: 'MURID' },
          accessToken: 'a',
          refreshToken: 'r',
        },
      })
    );

    const result = await loginPortal('2024001', 'siswa123', 'student');

    expect(result.status).toBe('ok');
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse((init as RequestInit).body as string).role).toBe('MURID');
  });

  it('returns invalid when the backend rejects with 401', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, status: 401 }));
    const result = await loginPortal('2024001', 'wrong', 'student');
    expect(result.status).toBe('invalid');
  });

  it('returns unreachable on network error', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'));
    const result = await loginPortal('2024001', 'siswa123', 'student');
    expect(result.status).toBe('unreachable');
  });

  it('returns unreachable for the parent role (unsupported by backend) without calling fetch', async () => {
    const result = await loginPortal('Siti Aminah', 'ortu123', 'parent');
    expect(result.status).toBe('unreachable');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
