import { describe, it, expect } from 'vitest';
import {
  validatePassword,
  generateSecurePassword,
  formatPasswordErrors,
} from './passwordValidator.js';

describe('Password Validator', () => {
  describe('validatePassword', () => {
    it('should reject password less than 8 characters', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password minimal 8 karakter');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung minimal 1 huruf kapital (A-Z)');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung minimal 1 huruf kecil (a-z)');
    });

    it('should reject password without numbers', () => {
      const result = validatePassword('NoNumbers!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung minimal 1 angka (0-9)');
    });

    it('should reject password without special characters', () => {
      const result = validatePassword('NoSpecialChars123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung minimal 1 karakter khusus (!@#$%^&*)');
    });

    it('should reject common passwords', () => {
      const result = validatePassword('qwerty');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(err => err.includes('Password terlalu umum'))).toBe(true);
    });

    it('should accept strong password with complex requirements', () => {
      const result = validatePassword('Xy7$kL9@mN2#pQ5');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject sequential characters', () => {
      const result = validatePassword('Password123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password mengandung karakter berurutan (contoh: 123, abc)');
    });

    it('should reject repeated characters', () => {
      const result = validatePassword('Passwordaaa123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password mengandung karakter berulang (contoh: aaa, 111)');
    });

    it('should return strength score', () => {
      const weakResult = validatePassword('WeakPass123!');
      const strongResult = validatePassword('StrongPass123!');
      
      expect(weakResult.score).toBeGreaterThan(0);
      expect(strongResult.score).toBeGreaterThan(0);
      expect(typeof weakResult.strength).toBe('string');
      expect(typeof strongResult.strength).toBe('string');
    });
  });

  describe('generateSecurePassword', () => {
    it('should generate password with default length', () => {
      const password = generateSecurePassword();
      expect(password).toHaveLength(16);
    });

    it('should generate password with custom length', () => {
      const password = generateSecurePassword(24);
      expect(password).toHaveLength(24);
    });

    it('should generate password that passes validation', () => {
      const password = generateSecurePassword();
      const result = validatePassword(password);
      expect(result.isValid).toBe(true);
    });

    it('should generate different passwords each time', () => {
      const password1 = generateSecurePassword();
      const password2 = generateSecurePassword();
      expect(password1).not.toBe(password2);
    });
  });

  describe('formatPasswordErrors', () => {
    it('should format empty errors as empty string', () => {
      const result = formatPasswordErrors([]);
      expect(result).toBe('');
    });

    it('should format single error', () => {
      const result = formatPasswordErrors(['Error message']);
      expect(result).toBe('Error message.');
    });

    it('should format multiple errors', () => {
      const result = formatPasswordErrors(['Error 1', 'Error 2']);
      expect(result).toBe('Error 1. Error 2.');
    });
  });
});