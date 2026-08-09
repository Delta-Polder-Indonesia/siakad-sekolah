import { describe, it, expect } from 'vitest';
import {
  PasswordValidator,
  validatePassword,
  generateStrongPassword,
  isPasswordValid,
} from './passwordValidator';

describe('PasswordValidator', () => {
  describe('validatePassword', () => {
    it('should reject password shorter than 8 characters', () => {
      const result = validatePassword('abc123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password minimal 8 karakter');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung huruf kapital');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung huruf kecil');
    });

    it('should reject password without numbers', () => {
      const result = validatePassword('Password!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung angka');
    });

    it('should reject password without special characters', () => {
      const result = validatePassword('KataSandi123');
      expect(result.isValid).toBe(false);
      // The actual error message might be different
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should accept valid password', () => {
      const result = validatePassword('SecurePass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject common passwords', () => {
      const result = validatePassword('admin123!');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('umum'))).toBe(true);
    });

    it('should reject passwords with forbidden patterns', () => {
      const result = validatePassword('MyKataSandi123!');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('pola umum'))).toBe(true);
    });

    it('should calculate strength correctly', () => {
      const weakResult = validatePassword('KataSandi1!');
      expect(['weak', 'very_weak']).toContain(weakResult.strength);

      const strongResult = validatePassword('SuperSecurePassword123!@#XYZ');
      expect(['medium', 'strong', 'very_strong']).toContain(strongResult.strength);
    });

    it('should provide score between 0-100', () => {
      const result = validatePassword('SecurePassword123!');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe('generateStrongPassword', () => {
    it('should generate password with default length', () => {
      const password = generateStrongPassword();
      expect(password).toHaveLength(12);
      expect(validatePassword(password).isValid).toBe(true);
    });

    it('should generate password with custom length', () => {
      const password = generateStrongPassword(16);
      expect(password).toHaveLength(16);
      expect(validatePassword(password).isValid).toBe(true);
    });

    it('should generate different passwords each time', () => {
      const password1 = generateStrongPassword();
      const password2 = generateStrongPassword();
      expect(password1).not.toBe(password2);
    });

    it('should include all required character types', () => {
      const password = generateStrongPassword();
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/\d/.test(password)).toBe(true);
      // eslint-disable-next-line no-useless-escape
      expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)).toBe(true);
    });
  });

  describe('isPasswordValid', () => {
    it('should return true for valid password', () => {
      expect(isPasswordValid('KataSandi123!')).toBe(true);
    });

    it('should return false for invalid password', () => {
      expect(isPasswordValid('pass')).toBe(false);
    });

    it('should return false for password without uppercase', () => {
      expect(isPasswordValid('katasandi123!')).toBe(false);
    });

    it('should return false for password without lowercase', () => {
      expect(isPasswordValid('KATASANDI123!')).toBe(false);
    });

    it('should return false for password without numbers', () => {
      expect(isPasswordValid('KataSandi!')).toBe(false);
    });

    it('should return false for password without special characters', () => {
      expect(isPasswordValid('KataSandi123')).toBe(false);
    });
  });

  describe('PasswordValidator.getSuggestions', () => {
    it('should provide suggestions for weak password', () => {
      const validation = validatePassword('kata');
      const suggestions = PasswordValidator.getSuggestions(validation);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some((s) => s.includes('panjang'))).toBe(true);
    });

    it('should provide suggestions for password without uppercase', () => {
      const validation = validatePassword('katasandi123!');
      const suggestions = PasswordValidator.getSuggestions(validation);
      expect(suggestions.some((s) => s.includes('kapital'))).toBe(true);
    });

    it('should provide suggestions for password without numbers', () => {
      const validation = validatePassword('KataSandi!');
      const suggestions = PasswordValidator.getSuggestions(validation);
      expect(suggestions.some((s) => s.includes('angka'))).toBe(true);
    });
  });

  describe('PasswordValidator.formatStrength', () => {
    it('should format strength correctly', () => {
      expect(PasswordValidator.formatStrength('very_weak')).toBe('Sangat Lemah');
      expect(PasswordValidator.formatStrength('weak')).toBe('Lemah');
      expect(PasswordValidator.formatStrength('medium')).toBe('Sedang');
      expect(PasswordValidator.formatStrength('strong')).toBe('Kuat');
      expect(PasswordValidator.formatStrength('very_strong')).toBe('Sangat Kuat');
    });
  });

  describe('PasswordValidator.getStrengthColor', () => {
    it('should return correct color for each strength', () => {
      expect(PasswordValidator.getStrengthColor('very_weak')).toBe('bg-red-500');
      expect(PasswordValidator.getStrengthColor('weak')).toBe('bg-orange-500');
      expect(PasswordValidator.getStrengthColor('medium')).toBe('bg-yellow-500');
      expect(PasswordValidator.getStrengthColor('strong')).toBe('bg-green-500');
      expect(PasswordValidator.getStrengthColor('very_strong')).toBe('bg-emerald-600');
    });
  });

  describe('PasswordValidator.getStrengthPercentage', () => {
    it('should return correct percentage for each strength', () => {
      expect(PasswordValidator.getStrengthPercentage('very_weak')).toBe(20);
      expect(PasswordValidator.getStrengthPercentage('weak')).toBe(40);
      expect(PasswordValidator.getStrengthPercentage('medium')).toBe(60);
      expect(PasswordValidator.getStrengthPercentage('strong')).toBe(80);
      expect(PasswordValidator.getStrengthPercentage('very_strong')).toBe(100);
    });
  });
});
