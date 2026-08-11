// Unit test wrapper absensi (blueprint BUG-03).
// Vitest config men-set VITE_API_BASE_URL sehingga hasApi=true → service
// menjalankan cabang fetch (konsisten dengan ppdbService/authApi di suite ini).

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAttendanceByDate, submitAttendanceRecords } from './attendanceService';

type MockResponseInit = {
  ok?: boolean;
  status?: number;
  json?: unknown;
};

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

describe('attendanceService — mode API (hasApi=true)', () => {
  it('fetchAttendanceByDate memanggil /attendance?date=&classId= dan membaca data', async () => {
    const rows = [
      {
        id: 'att-1',
        studentId: 's1',
        classId: 'c1',
        date: '2026-08-10',
        status: 'hadir',
        markedBy: 't1',
        timestamp: 123,
      },
    ];
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, data: rows, pagination: { total: 1 } } })
    );

    const result = await fetchAttendanceByDate('2026-08-10', 'c1');

    expect(result).toEqual(rows);
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/attendance?date=2026-08-10&classId=c1');
  });

  it('fetchAttendanceByDate mengembalikan [] saat data tidak ada', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true } }));
    const result = await fetchAttendanceByDate('2026-08-10');
    expect(result).toEqual([]);
  });

  it('submitAttendanceRecords mengirim POST dengan payload yang dipetakan', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ json: { ok: true, data: [{ id: 'att-1' }] } })
    );

    const result = await submitAttendanceRecords([
      {
        id: 'att_x',
        studentId: 's1',
        classId: 'c1',
        date: '2026-08-10',
        status: 'hadir',
        note: 'Alasan',
        markedBy: 't1',
        timestamp: Date.now(),
      },
    ]);

    expect(result.count).toBe(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/attendance');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body);
    expect(body[0]).toMatchObject({
      studentId: 's1',
      classId: 'c1',
      date: '2026-08-10',
      status: 'hadir',
      note: 'Alasan',
    });
    // markedBy/timestamp/id tidak dikirim ke server (diturunkan server)
    expect(body[0].markedBy).toBeUndefined();
  });
});
