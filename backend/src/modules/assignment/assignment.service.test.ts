/**
 * Unit test service tugas online (blueprint BUG-03).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockAssignFindMany = vi.hoisted(() => vi.fn());
const mockAssignCount = vi.hoisted(() => vi.fn());
const mockAssignUpdate = vi.hoisted(() => vi.fn());
const mockAssignCreate = vi.hoisted(() => vi.fn());
const mockAssignFindUnique = vi.hoisted(() => vi.fn());
const mockAssignDelete = vi.hoisted(() => vi.fn());
const mockSubFindMany = vi.hoisted(() => vi.fn());
const mockSubCount = vi.hoisted(() => vi.fn());
const mockSubFindUnique = vi.hoisted(() => vi.fn());
const mockSubUpdate = vi.hoisted(() => vi.fn());
const mockSubCreate = vi.hoisted(() => vi.fn());
const mockSubDelete = vi.hoisted(() => vi.fn());

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    onlineAssignment: {
      findMany: mockAssignFindMany, count: mockAssignCount,
      update: mockAssignUpdate, create: mockAssignCreate,
      findUnique: mockAssignFindUnique, delete: mockAssignDelete,
    },
    assignmentSubmission: {
      findMany: mockSubFindMany, count: mockSubCount,
      findUnique: mockSubFindUnique, update: mockSubUpdate, create: mockSubCreate,
      delete: mockSubDelete,
    },
  },
}));

import { listAssignments, upsertAssignment, deleteAssignment, upsertSubmission } from './assignment.service.js';

const fakeAssign = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'asg-1', classId: 'c1', title: 'Tugas MTK', description: 'Kerjakan',
  content: { summary: 's' }, dueDate: new Date('2026-08-15T00:00:00Z'),
  createdBy: 't1', createdAt: new Date('2026-08-01T00:00:00Z'),
  ...over,
});

const fakeSub = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'sub-1', assignmentId: 'asg-1', studentId: 's1', answerText: 'Jawaban',
  attachmentUrl: 'data:...', attachmentName: 'a.txt', grade: null, feedback: null,
  submittedAt: new Date('2026-08-10T00:00:00Z'),
  ...over,
});

describe('listAssignments', () => {
  beforeEach(() => vi.clearAllMocks());
  it('memfilter classId & men-serialize DTO (dueDate YYYY-MM-DD, content dari JSON)', async () => {
    mockAssignFindMany.mockResolvedValue([fakeAssign()]);
    mockAssignCount.mockResolvedValue(1);
    const { items } = await listAssignments({ classId: 'c1', page: 1, limit: 50 });
    expect(mockAssignFindMany.mock.calls[0][0].where.classId).toBe('c1');
    expect(items[0].dueDate).toBe('2026-08-15');
    expect(items[0].content).toEqual({ summary: 's' });
  });
});

describe('upsertAssignment', () => {
  beforeEach(() => vi.clearAllMocks());
  it('membuat tugas baru dengan content JSON & dueDate UTC', async () => {
    mockAssignCreate.mockResolvedValue(fakeAssign());
    const item = await upsertAssignment({
      classId: 'c1', title: 'Tugas', dueDate: '2026-08-15', createdBy: 't1',
      content: { summary: 's' },
    });
    expect(mockAssignCreate).toHaveBeenCalledTimes(1);
    const arg = mockAssignCreate.mock.calls[0][0].data;
    expect(arg.content).toEqual({ summary: 's' });
    expect(arg.dueDate).toEqual(new Date('2026-08-15T00:00:00Z'));
    expect(item.id).toBe('asg-1');
  });
  it('memperbarui tugas yang sudah ada (id diberikan)', async () => {
    mockAssignUpdate.mockResolvedValue(fakeAssign());
    await upsertAssignment({ id: 'asg-1', classId: 'c1', title: 'Baru', dueDate: '2026-08-15', createdBy: 't1' });
    expect(mockAssignUpdate).toHaveBeenCalledTimes(1);
  });
});

describe('deleteAssignment', () => {
  beforeEach(() => vi.clearAllMocks());
  it('menghapus tugas yang ada', async () => {
    mockAssignFindUnique.mockResolvedValue(fakeAssign());
    mockAssignDelete.mockResolvedValue(fakeAssign());
    await expect(deleteAssignment('asg-1')).resolves.toBe(true);
  });
  it('melempar error saat tidak ditemukan', async () => {
    mockAssignFindUnique.mockResolvedValue(null);
    await expect(deleteAssignment('asg-missing')).rejects.toThrow(/not found/i);
    expect(mockAssignDelete).not.toHaveBeenCalled();
  });
});

describe('upsertSubmission', () => {
  beforeEach(() => vi.clearAllMocks());
  it('membuat submisi baru saat belum ada', async () => {
    mockSubFindUnique.mockResolvedValue(null);
    mockSubCreate.mockResolvedValue(fakeSub());
    const item = await upsertSubmission({ assignmentId: 'asg-1', studentId: 's1', answerText: 'Jawaban' });
    expect(mockSubCreate).toHaveBeenCalledTimes(1);
    expect(item.studentId).toBe('s1');
  });
  it('memperbarui submisi yang sudah ada pada unique [assignmentId,studentId]', async () => {
    mockSubFindUnique.mockResolvedValue(fakeSub());
    mockSubUpdate.mockResolvedValue(fakeSub({ answerText: 'Revisi' }));
    const item = await upsertSubmission({ assignmentId: 'asg-1', studentId: 's1', answerText: 'Revisi' });
    expect(mockSubUpdate).toHaveBeenCalledTimes(1);
    expect(item.answerText).toBe('Revisi');
  });
});
