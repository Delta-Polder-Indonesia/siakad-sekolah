// Unit test wrapper perpustakaan (blueprint BUG-03). Vitest men-set
// VITE_API_BASE_URL sehingga hasApi=true → cabang fetch.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchBooks, saveBookApi, borrowBookApi, approveLoanApi, rejectLoanApi, returnBookApi } from './libraryService';

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

const book = {
  id: 'b1', title: 'Matematika', author: 'A', category: 'Pelajaran',
  publisher: 'P', rack: 'A1', stock: 3, available: 2,
};

describe('libraryService — mode API (hasApi=true)', () => {
  it('fetchBooks memanggil /library/books', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: [book] } }));
    const result = await fetchBooks();
    expect(result).toEqual([book]);
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/library/books');
  });

  it('saveBookApi mengirim POST /library/books dengan payload termapping', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: book } }));
    await saveBookApi(book as never);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/library/books');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ title: 'Matematika', stock: 3 });
  });

  it('borrowBookApi mengirim POST /library/transactions/borrow', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true } }));
    const res = await borrowBookApi('b1', 'm1', 'Budi', '2026-08-01', '2026-08-08');
    expect(res.ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/library/transactions/borrow');
    expect(JSON.parse(init.body)).toMatchObject({ bookId: 'b1', memberId: 'm1' });
  });

  it('approveLoanApi mengirim POST /library/transactions/:id/approve', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true } }));
    const res = await approveLoanApi('tx-1');
    expect(res.ok).toBe(true);
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/library/transactions/tx-1/approve');
  });

  it('rejectLoanApi mengirim POST dengan note', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true } }));
    await rejectLoanApi('tx-1', 'stok habis');
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/library/transactions/tx-1/reject');
    expect(JSON.parse(init.body).note).toBe('stok habis');
  });

  it('returnBookApi mengirim POST /library/transactions/:id/return', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true } }));
    const res = await returnBookApi('tx-1', '2026-08-09');
    expect(res.ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/library/transactions/tx-1/return');
    expect(JSON.parse(init.body).returnDate).toBe('2026-08-09');
  });
});
