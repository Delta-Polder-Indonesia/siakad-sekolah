import { describe, expect, it } from 'vitest';
import { applyExclusiveClassAssignment } from './utils';
import type { ClassRoom, Teacher } from '../../../types';

const makeTeacher = (id: string, classIds: string[]): Teacher =>
  ({ id, name: `Teacher ${id}`, classIds }) as unknown as Teacher;

const makeClass = (id: string, teacherId: string): ClassRoom =>
  ({ id, name: `Class ${id}`, teacherId }) as unknown as ClassRoom;

describe('applyExclusiveClassAssignment', () => {
  it('assigns the selected classes to the target teacher (kelas ajar)', () => {
    const teachers = [makeTeacher('t1', []), makeTeacher('t2', [])];
    const classes = [makeClass('c1', ''), makeClass('c2', '')];

    const { nextTeachers, nextClasses } = applyExclusiveClassAssignment(teachers, classes, 't1', [
      'c1',
      'c2',
    ]);

    expect(nextTeachers.find((t) => t.id === 't1')?.classIds).toEqual(['c1', 'c2']);
    // Kelas binaan (teacherId) tidak disentuh — diatur terpisah oleh setClassTeacherId
    expect(nextClasses.every((c) => c.teacherId === '')).toBe(true);
  });

  it('removes selected classes from other teachers (exclusive assignment)', () => {
    const teachers = [makeTeacher('t1', ['c1']), makeTeacher('t2', ['c1', 'c3'])];
    const classes = [makeClass('c1', 't2'), makeClass('c3', 't2')];

    const { nextTeachers } = applyExclusiveClassAssignment(teachers, classes, 't1', ['c1']);

    expect(nextTeachers.find((t) => t.id === 't1')?.classIds).toEqual(['c1']);
    expect(nextTeachers.find((t) => t.id === 't2')?.classIds).toEqual(['c3']);
  });

  it('clears a class from the target teacher when it is deselected', () => {
    const teachers = [makeTeacher('t1', ['c1', 'c2'])];
    const classes = [makeClass('c1', 't1'), makeClass('c2', 't1')];

    const { nextTeachers, nextClasses } = applyExclusiveClassAssignment(teachers, classes, 't1', [
      'c1',
    ]);

    expect(nextTeachers.find((t) => t.id === 't1')?.classIds).toEqual(['c1']);
    // teacherId (wali kelas) dipertahankan — hanya kelas ajar yang diatur di sini
    expect(nextClasses.find((c) => c.id === 'c1')?.teacherId).toBe('t1');
    expect(nextClasses.find((c) => c.id === 'c2')?.teacherId).toBe('t1');
  });

  it('deduplicates selected class ids', () => {
    const teachers = [makeTeacher('t1', [])];
    const classes = [makeClass('c1', '')];

    const { nextTeachers } = applyExclusiveClassAssignment(teachers, classes, 't1', [
      'c1',
      'c1',
      'c1',
    ]);

    expect(nextTeachers.find((t) => t.id === 't1')?.classIds).toEqual(['c1']);
  });

  it('does not mutate the original input arrays', () => {
    const teachers = [makeTeacher('t1', ['c1'])];
    const classes = [makeClass('c1', 't1')];

    applyExclusiveClassAssignment(teachers, classes, 't1', ['c1']);

    expect(teachers[0].classIds).toEqual(['c1']);
    expect(classes[0].teacherId).toBe('t1');
  });

  it('leaves unrelated classes untouched', () => {
    const teachers = [makeTeacher('t1', []), makeTeacher('t2', ['c9'])];
    const classes = [makeClass('c1', ''), makeClass('c9', 't2')];

    const { nextClasses } = applyExclusiveClassAssignment(teachers, classes, 't1', ['c1']);

    expect(nextClasses.find((c) => c.id === 'c9')?.teacherId).toBe('t2');
  });
});
