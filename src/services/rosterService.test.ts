// Unit test wrapper roster kelas (blueprint BUG-03). Vitest men-set
// VITE_API_BASE_URL sehingga hasApi=true → cabang fetch.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRosterByClass, createRosterApi, deleteRosterApi } from './rosterService';

type MockResponseInit = { ok?: boolean; status?: number; json?: unknown };
const jsonResponse = ({ ok = true, status = 200, json = {} }: MockResponseInit = {}) =>
  ({ ok, status, json: async () => json }) as unknown as Response;

const fetchMock = vi.fn();

beforeEach(() => {
  localStorage.clear();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const roster = {
  id: 'roster-1', classId: 'c1', subject: 'Matematika', dayOfWeek: 1,
  startTime: '07:00', endTime: '08:30', room: 'R1', teacherName: 'Bapak A',
  updatedBy: 't1', updatedAt: Date.now(),
};

describe('rosterService — mode API (hasApi=true)', () => {
  it('fetchRosterByClass memanggil /roster?classId=', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: [roster] } }));
    const result = await fetchRosterByClass('c1');
    expect(result).toEqual([roster]);
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/roster?classId=c1');
  });

  it('createRosterApi mengirim POST /roster dengan payload termapping', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: roster } }));
    await createRosterApi(roster as never);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/roster');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ classId: 'c1', subject: 'Matematika', dayOfWeek: 1 });
  });

  it('deleteRosterApi mengirim DELETE /roster/:id', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true } }));
    await expect(deleteRosterApi('roster-1')).resolves.toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/roster/roster-1');
    expect(init.method).toBe('DELETE');
  });
});
