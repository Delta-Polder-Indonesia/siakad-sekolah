// Unit test wrapper tugas online (blueprint BUG-03). Vitest men-set
// VITE_API_BASE_URL sehingga hasApi=true → cabang fetch.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchAssignmentsByClass,
  saveAssignmentApi,
  deleteAssignmentApi,
  submitAssignmentApi,
  fetchSubmissionsByAssignment,
} from './assignmentService';

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

const assignment = {
  id: 'asg-1', classId: 'c1', title: 'Tugas', description: 'Deskripsi',
  dueDate: '2026-08-15', createdBy: 't1', createdAt: 1,
  summary: 's', books: [{ title: 'B' }],
};

const submission = {
  id: 'sub-1', assignmentId: 'asg-1', studentId: 's1',
  answerText: 'Jawaban', submittedAt: Date.now(),
};

describe('assignmentService — mode API (hasApi=true)', () => {
  it('fetchAssignmentsByClass memanggil /assignments?classId=', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: [assignment] } }));
    const result = await fetchAssignmentsByClass('c1');
    expect(result).toEqual([assignment]);
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/assignments?classId=c1');
  });

  it('saveAssignmentApi mengirim POST dengan content JSON & tanpa id dummy', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: assignment } }));
    await saveAssignmentApi(assignment as never);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/assignments');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body);
    expect(body.classId).toBe('c1');
    expect(body.content.summary).toBe('s');
    expect(body.content.books).toEqual([{ title: 'B' }]);
  });

  it('deleteAssignmentApi mengirim DELETE /assignments/:id', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true } }));
    await expect(deleteAssignmentApi('asg-1')).resolves.toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/assignments/asg-1');
    expect(init.method).toBe('DELETE');
  });

  it('submitAssignmentApi mengirim POST /assignments/submissions', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: submission } }));
    await submitAssignmentApi(submission as never);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/assignments/submissions');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ assignmentId: 'asg-1', studentId: 's1' });
  });

  it('fetchSubmissionsByAssignment memanggil /assignments/submissions?assignmentId=', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ json: { ok: true, data: [submission] } }));
    const result = await fetchSubmissionsByAssignment('asg-1');
    expect(result).toEqual([submission]);
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/assignments/submissions?assignmentId=asg-1');
  });
});
