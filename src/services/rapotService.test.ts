// Unit test wrapper rapot (blueprint BUG-03, replikasi attendanceService).
// Vitest config men-set VITE_API_BASE_URL sehingga hasApi=true → cabang fetch.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRapotByKelas, submitNilaiRapot, deleteRapotById } from './rapotService';

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

const nilai = {
  id: 'rapot_x',
  studentId: 's1',
  classId: 'c1',
  semester: 'genap',
  tahunAjaran: '2025/2026',
  mataPelajaran: 'Matematika',
  nilaiHarian: 80,
  nilaiTugas: 85,
  nilaiUTS: 82,
  nilaiUAS: 90,
  nilaiAkhir: 86,
  predikat: 'A',
  inputBy: 't1',
  updatedAt: Date.now(),
};

describe('rapotService — mode API (hasApi=true)', () => {
  it('fetchRapotByKelas memanggil /rapot?classId=&tahunAjaran=&semester=', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, data: [nilai], pagination: { total: 1 } } })
    );
    const result = await fetchRapotByKelas('c1', '2025/2026', 'genap');

    expect(result).toEqual([nilai]);
    const [url] = fetchMock.mock.calls[0];
    const s = String(url);
    expect(s).toContain('/rapot?classId=c1');
    expect(s).toContain('tahunAjaran=2025%2F2026'); // '/' di-encode oleh URLSearchParams
    expect(s).toContain('semester=genap');
  });

  it('submitNilaiRapot mengirim POST dengan field DTO yang dipetakan', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: nilai } }));
    const result = await submitNilaiRapot(nilai);

    expect(result).toEqual(nilai);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      studentId: 's1',
      classId: 'c1',
      tahunAjaran: '2025/2026',
      mataPelajaran: 'Matematika',
      nilaiUTS: 82,
      nilaiAkhir: 86,
      predikat: 'A',
    });
  });

  it('deleteRapotById mengirim DELETE /rapot/:id', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true } }));
    await expect(deleteRapotById('rapot_x')).resolves.toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/rapot/rapot_x');
    expect(init.method).toBe('DELETE');
  });
});
