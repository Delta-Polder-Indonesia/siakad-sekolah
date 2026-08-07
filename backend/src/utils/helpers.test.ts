import { describe, it, expect } from 'vitest';
import {
  formatDateIndo,
  formatDateIndoShort,
  formatTimeIndo,
  formatDateTimeIndo,
  generateSlug,
  truncateString,
  capitalizeFirst,
  generateRandomString,
  formatNumberIndo,
  formatRupiah,
  calculateAge,
  calculatePercentage,
  generateId,
  sanitizeFilename,
} from './helpers.js';

describe('Helper Functions', () => {
  describe('Date Formatting', () => {
    it('should format date to Indonesian format', () => {
      const date = new Date('2026-08-07');
      const result = formatDateIndo(date);
      expect(result).toContain('Agustus');
      expect(result).toContain('2026');
    });

    it('should format date to Indonesian short format', () => {
      const date = new Date('2026-08-07');
      const result = formatDateIndoShort(date);
      expect(result).toMatch(/\d{2}\s\w+\s\d{4}/);
    });

    it('should format time to Indonesian format', () => {
      const date = new Date('2026-08-07T14:30:00');
      const result = formatTimeIndo(date);
      expect(result).toMatch(/\d{2}.\d{2}/);
    });

    it('should format datetime to Indonesian format', () => {
      const date = new Date('2026-08-07T14:30:00');
      const result = formatDateTimeIndo(date);
      expect(result).toContain('Agustus');
      expect(result).toContain('14.30');
    });
  });

  describe('String Utilities', () => {
    it('should generate slug from string', () => {
      const result = generateSlug('Hello World!');
      expect(result).toBe('hello-world');
    });

    it('should truncate string with ellipsis', () => {
      const result = truncateString('Very long string that needs truncation', 10);
      expect(result).toBe('Very lo...');
      expect(result.length).toBeLessThanOrEqual(13);
    });

    it('should not truncate short string', () => {
      const result = truncateString('Short', 10);
      expect(result).toBe('Short');
    });

    it('should capitalize first letter', () => {
      const result = capitalizeFirst('hello');
      expect(result).toBe('Hello');
    });

    it('should generate random string with default length', () => {
      const result = generateRandomString();
      expect(result).toHaveLength(8);
    });

    it('should generate random string with custom length', () => {
      const result = generateRandomString(16);
      expect(result).toHaveLength(16);
    });
  });

  describe('Number Formatting', () => {
    it('should format number to Indonesian locale', () => {
      const result = formatNumberIndo(1234567);
      expect(result).toContain('1.234.567');
    });

    it('should format amount to Rupiah', () => {
      const result = formatRupiah(1234567);
      expect(result).toContain('Rp');
      expect(result).toContain('1.234.567');
    });
  });

  describe('Calculation Functions', () => {
    it('should calculate age from birth date', () => {
      const birthDate = new Date('2000-01-01');
      const currentYear = new Date().getFullYear();
      const expectedAge = currentYear - 2000;
      expect(calculateAge(birthDate)).toBe(expectedAge);
    });

    it('should calculate percentage', () => {
      const result = calculatePercentage(25, 100);
      expect(result).toBe(25);
    });

    it('should return 0 when total is 0', () => {
      const result = calculatePercentage(25, 0);
      expect(result).toBe(0);
    });
  });

  describe('ID Generation', () => {
    it('should generate ID without prefix', () => {
      const result = generateId();
      expect(result).toBeTruthy();
      expect(result).toMatch(/^[a-z0-9_]+$/);
    });

    it('should generate ID with prefix', () => {
      const result = generateId('USER');
      expect(result).toMatch(/^USER_/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('Filename Sanitization', () => {
    it('should sanitize filename', () => {
      const result = sanitizeFilename('file@#$%.txt');
      expect(result).toBe('file_.txt');
    });

    it('should remove leading/trailing underscores', () => {
      const result = sanitizeFilename('_file_');
      expect(result).toBe('file');
    });

    it('should collapse multiple underscores', () => {
      const result = sanitizeFilename('file___name.txt');
      expect(result).toBe('file_name.txt');
    });
  });
});