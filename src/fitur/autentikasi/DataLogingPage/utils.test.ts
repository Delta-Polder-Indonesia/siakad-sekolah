import { describe, expect, it } from 'vitest';
import { isValidRole, validateLoginInput } from './utils';

describe('isValidRole', () => {
  it('returns true for valid roles', () => {
    expect(isValidRole('teacher')).toBe(true);
    expect(isValidRole('student')).toBe(true);
    expect(isValidRole('parent')).toBe(true);
    expect(isValidRole('guest')).toBe(true);
  });

  it('returns false for invalid roles', () => {
    expect(isValidRole('admin')).toBe(false);
    expect(isValidRole('')).toBe(false);
    expect(isValidRole('unknown')).toBe(false);
    expect(isValidRole('Teacher')).toBe(false); // case-sensitive
  });
});

describe('validateLoginInput', () => {
  // ── Empty inputs ──
  it('rejects empty ID', () => {
    expect(validateLoginInput('student', '', 'password')).toBe('ID tidak boleh kosong.');
  });

  it('rejects empty password', () => {
    expect(validateLoginInput('student', '12345', '')).toBe('Kata sandi tidak boleh kosong.');
  });

  it('rejects empty ID with whitespace', () => {
    expect(validateLoginInput('student', '   ', 'password')).toBe('ID tidak boleh kosong.');
  });

  // ── Admin bypass ──
  it('bypasses validation for admin', () => {
    expect(validateLoginInput('teacher', 'admin', 'anything')).toBeNull();
  });

  // ── Teacher ──
  it('validates teacher NIP must be numeric', () => {
    expect(validateLoginInput('teacher', 'abc', 'pass')).toBe('NIP harus berupa angka.');
  });

  it('accepts numeric teacher NIP', () => {
    expect(validateLoginInput('teacher', '198501012010011001', 'pass')).toBeNull();
  });

  // ── Student ──
  it('validates student NISN is at least 4 digits', () => {
    expect(validateLoginInput('student', '123', 'pass')).toBe('NISN minimal 4 digit angka.');
  });

  it('accepts valid student NISN', () => {
    expect(validateLoginInput('student', '2024001', 'pass')).toBeNull();
  });

  // ── Parent (login pakai NIS anak, bukan nama) ──
  it('validates parent NIS is at least 4 digits', () => {
    expect(validateLoginInput('parent', '123', 'pass')).toBe('NIS anak minimal 4 digit angka.');
  });

  it('accepts valid parent NIS', () => {
    expect(validateLoginInput('parent', '2024001', 'pass')).toBeNull();
  });

  // ── Guest (email) ──
  it('rejects invalid guest email format', () => {
    expect(validateLoginInput('guest', 'notanemail', 'pass')).toBe(
      'Format email tidak valid. Contoh: nama@gmail.com'
    );
  });

  it('rejects guest email without domain', () => {
    expect(validateLoginInput('guest', 'user@', 'pass')).toBe(
      'Format email tidak valid. Contoh: nama@gmail.com'
    );
  });

  it('accepts valid guest email', () => {
    expect(validateLoginInput('guest', 'user@example.com', 'pass')).toBeNull();
  });

  it('rejects guest email exceeding 254 characters', () => {
    const longLocal = 'a'.repeat(250);
    expect(validateLoginInput('guest', `${longLocal}@b.co`, 'pass')).toBe(
      'Alamat email terlalu panjang.'
    );
  });

  it('rejects guest email with local part exceeding 64 chars', () => {
    const longLocal = 'a'.repeat(65);
    expect(validateLoginInput('guest', `${longLocal}@example.com`, 'pass')).toBe(
      'Bagian nama email terlalu panjang.'
    );
  });
});
