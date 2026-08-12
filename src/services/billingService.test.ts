// Unit test wrapper billing (blueprint BUG-03). Vitest men-set
// VITE_API_BASE_URL sehingga hasApi=true → cabang fetch.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchTagihanBySiswa,
  payTagihanSekolah,
  fetchPengaturanTagihan,
  simpanPengaturanTagihan,
} from './billingService';

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

const bill = {
  id: 'bill-1',
  studentId: 's1',
  year: 2026,
  month: 1,
  amount: 250000,
  dueDate: '2026-01-10',
  status: 'belum_lunas' as const,
};

describe('billingService — mode API (hasApi=true)', () => {
  it('fetchTagihanBySiswa memanggil /billing?studentId=&year=', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, data: [bill], pagination: { total: 1 } } })
    );
    const result = await fetchTagihanBySiswa('s1', 2026);
    expect(result).toEqual([bill]);
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/billing?studentId=s1&year=2026');
  });

  it('payTagihanSekolah mengirim POST /billing/:id/pay', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true } }));
    await expect(payTagihanSekolah('bill-1', 'ewallet')).resolves.toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/billing/bill-1/pay');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body).paymentMethod).toBe('ewallet');
  });

  it('fetchPengaturanTagihan membaca /billing/config', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, data: { monthlyAmount: 300000, dueDay: 10 } } })
    );
    const cfg = await fetchPengaturanTagihan();
    expect(cfg.monthlyAmount).toBe(300000);
    expect(cfg.dueDay).toBe(10);
  });

  it('simpanPengaturanTagihan mengirim POST /billing/config', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, data: { monthlyAmount: 300000, dueDay: 12 } } })
    );
    await simpanPengaturanTagihan({ monthlyAmount: 300000, dueDay: 12, updatedAt: 0, updatedBy: 'x' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/billing/config');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ monthlyAmount: 300000, dueDay: 12 });
  });
});
