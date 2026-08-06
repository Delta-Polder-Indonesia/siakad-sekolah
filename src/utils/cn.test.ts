import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins multiple class name strings', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('ignores falsy values', () => {
    expect(cn('px-2', false, null, undefined, '', 'py-1')).toBe('px-2 py-1');
  });

  it('supports conditional object syntax from clsx', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });

  it('flattens arrays of class names', () => {
    expect(cn(['px-2', ['py-1', 'font-bold']])).toBe('px-2 py-1 font-bold');
  });

  it('merges conflicting tailwind utilities keeping the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('returns an empty string when no inputs are provided', () => {
    expect(cn()).toBe('');
  });
});
