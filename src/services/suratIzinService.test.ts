// Unit test wrapper surat izin (blueprint BUG-03). Vitest men-set
// VITE_API_BASE_URL sehingga hasApi=true → cabang fetch.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitSurat, updateSuratStatusApi, fetchSuratByStudent } from './suratIzinService';

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

const surat = {
  id: 'surat-1', studentId: 's1', classId: 'c1', type: 'izin',
  status: 'menunggu', subject: 'Izin dokter', message: 'Sakit',
  letterDate: '2026-08-10', createdAt: Date.now(),
};

describe('suratIzinService — mode API (hasApi=true)', () => {
  it('submitSurat mengirim POST /surat-izin dengan payload termapping', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: surat } }));
    await submitSurat(surat as never);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/surat-izin');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ studentId: 's1', type: 'izin', letterDate: '2026-08-10' });
  });

  it('updateSuratStatusApi mengirim PATCH /surat-izin/:id/status', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: { ...surat, status: 'disetujui' } } }));
    const res = await updateSuratStatusApi('surat-1', 'disetujui');
    expect(res.status).toBe('disetujui');
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/surat-izin/surat-1/status');
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body).status).toBe('disetujui');
  });

  it('fetchSuratByStudent memanggil /surat-izin dan memfilter studentId', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, data: [surat, { ...surat, id: 'surat-2', studentId: 's2' }] } })
    );
    const result = await fetchSuratByStudent('s1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('surat-1');
  });
});
