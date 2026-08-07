import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeObject, stripHtml, hasHtmlContent } from '../utils/sanitize.js';

describe('sanitize utilities', () => {
  it('should trim whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('should collapse multiple spaces', () => {
    expect(sanitizeString('a  b   c')).toBe('a b c');
  });

  it('should strip script tags', () => {
    expect(stripHtml('<script>alert("x")</script>hello')).toBe('hello');
  });

  it('should strip all html tags', () => {
    expect(stripHtml('<b>bold</b><i>italic</i>')).toBe('bolditalic');
  });

  it('should strip javascript: protocol', () => {
    expect(stripHtml('javascript:alert(1)')).toBe('alert(1)');
  });

  it('should sanitize nested objects recursively', () => {
    const input = {
      name: '  <script>x</script>John  ',
      meta: { bio: '<b>teacher</b>', tags: [' a ', '<i>b</i>'] },
    };
    const result = sanitizeObject(input);
    expect(result.name).toBe('John');
    expect(result.meta.bio).toBe('teacher');
    expect(result.meta.tags).toEqual(['a', 'b']);
  });

  it('should leave non-string values untouched', () => {
    const input = { count: 5, ok: true, arr: [1, 2], data: null as null };
    const result = sanitizeObject(input);
    expect(result).toEqual(input);
  });

  it('should detect html content', () => {
    expect(hasHtmlContent('<b>hi</b>')).toBe(true);
    expect(hasHtmlContent('javascript:void(0)')).toBe(true);
    expect(hasHtmlContent('plain text')).toBe(false);
  });
});
