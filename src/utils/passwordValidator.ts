import { logger } from './logger';

/**
 * Konfigurasi kebijakan password
 */
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true,
  FORBIDDEN_PATTERNS: [
    '123456', // Urutan angka berurutan
    'qwerty', // Keyboard pattern
    'password', // Kata password yang umum
    'katasandi', // Kata password dalam bahasa Indonesia
    'admin', // Kata admin yang umum
    'welcome', // Kata welcome yang umum
  ],
  FORBIDDEN_COMMON_PASSWORDS: ['password123', 'admin123', '12345678', 'qwerty123', 'welcome123'],
} as const;

/**
 * Hasil validasi password
 */
export interface PasswordValidationResult {
  isValid: boolean;
  strength: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';
  score: number; // 0-100
  errors: string[];
  warnings: string[];
}

/**
 * Password strength meter yang komprehensif
 */
export class PasswordValidator {
  /**
   * Validasi password berdasarkan policy
   */
  static validate(password: string): PasswordValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    // Cek panjang password
    if (password.length < PASSWORD_POLICY.MIN_LENGTH) {
      errors.push(`Password minimal ${PASSWORD_POLICY.MIN_LENGTH} karakter`);
    } else {
      score += 10;

      // Bonus untuk password yang lebih panjang
      if (password.length >= 12) score += 10;
      if (password.length >= 16) score += 10;
    }

    if (password.length > PASSWORD_POLICY.MAX_LENGTH) {
      errors.push(`Password maksimal ${PASSWORD_POLICY.MAX_LENGTH} karakter`);
    }

    // Cek uppercase
    if (PASSWORD_POLICY.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password harus mengandung huruf kapital');
    } else if (/[A-Z]/.test(password)) {
      score += 10;
    }

    // Cek lowercase
    if (PASSWORD_POLICY.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password harus mengandung huruf kecil');
    } else if (/[a-z]/.test(password)) {
      score += 10;
    }

    // Cek number
    if (PASSWORD_POLICY.REQUIRE_NUMBER && !/\d/.test(password)) {
      errors.push('Password harus mengandung angka');
    } else if (/\d/.test(password)) {
      score += 10;
    }

    // Cek special character
    if (PASSWORD_POLICY.REQUIRE_SPECIAL_CHAR && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      errors.push('Password harus mengandung karakter khusus (!@#$%^&*)');
    } else if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      score += 10;
    }

    // Cek pattern yang dilarang
    const lowerPassword = password.toLowerCase();
    PASSWORD_POLICY.FORBIDDEN_PATTERNS.forEach((pattern) => {
      if (lowerPassword.includes(pattern)) {
        errors.push(`Password tidak boleh mengandung pola umum: ${pattern}`);
        score -= 20;
      }
    });

    // Cek password umum
    PASSWORD_POLICY.FORBIDDEN_COMMON_PASSWORDS.forEach((common) => {
      if (lowerPassword === common) {
        errors.push('Password terlalu umum, gunakan password yang lebih unik');
        score -= 30;
      }
    });

    // Cek karakter berurutan
    if (this.hasSequentialChars(password)) {
      warnings.push('Password mengandung karakter berurutan, sebaiknya dihindari');
      score -= 5;
    }

    // Cek karakter berulang
    if (this.hasRepeatedChars(password)) {
      warnings.push('Password mengandung karakter berulang, sebaiknya dihindari');
      score -= 5;
    }

    // Normalisasi score
    score = Math.max(0, Math.min(100, score));

    const strength = this.calculateStrength(score);
    const isValid = errors.length === 0;

    return {
      isValid,
      strength,
      score,
      errors,
      warnings,
    };
  }

  /**
   * Hitung strength berdasarkan score
   */
  private static calculateStrength(score: number): PasswordValidationResult['strength'] {
    if (score < 20) return 'very_weak';
    if (score < 40) return 'weak';
    if (score < 60) return 'medium';
    if (score < 80) return 'strong';
    return 'very_strong';
  }

  /**
   * Cek apakah password mengandung karakter berurutan
   */
  private static hasSequentialChars(password: string): boolean {
    // Cek angka berurutan (123, 234, dll)
    for (let i = 0; i < password.length - 2; i++) {
      const charCode = password.charCodeAt(i);
      const nextCharCode = password.charCodeAt(i + 1);
      const nextNextCharCode = password.charCodeAt(i + 2);

      if (charCode + 1 === nextCharCode && nextCharCode + 1 === nextNextCharCode) {
        return true;
      }
    }
    return false;
  }

  /**
   * Cek apakah password mengandung karakter berulang
   */
  private static hasRepeatedChars(password: string): boolean {
    // Cek karakter yang berulang 3+ kali
    const charCount: Record<string, number> = {};
    for (const char of password) {
      charCount[char] = (charCount[char] || 0) + 1;
      if (charCount[char] >= 3) {
        return true;
      }
    }
    return false;
  }

  /**
   * Generate password acak yang aman
   */
  static generatePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = uppercase + lowercase + numbers + special;

    let password = '';

    // Pastikan minimal satu dari setiap kategori
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Isi sisa dengan random characters
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Dapatkan pesan sugesti perbaikan password
   */
  static getSuggestions(validation: PasswordValidationResult): string[] {
    const suggestions: string[] = [];

    if (validation.errors.some((e) => e.includes('minimal'))) {
      suggestions.push('Tambah panjang password');
    }

    if (validation.errors.some((e) => e.includes('huruf kapital'))) {
      suggestions.push('Tambah huruf kapital (A-Z)');
    }

    if (validation.errors.some((e) => e.includes('huruf kecil'))) {
      suggestions.push('Tambah huruf kecil (a-z)');
    }

    if (validation.errors.some((e) => e.includes('angka'))) {
      suggestions.push('Tambah angka (0-9)');
    }

    if (validation.errors.some((e) => e.includes('karakter khusus'))) {
      suggestions.push('Tambah karakter khusus (!@#$%^&*)');
    }

    if (validation.warnings.some((w) => w.includes('berurutan'))) {
      suggestions.push('Hindari karakter berurutan (123, abc)');
    }

    if (validation.warnings.some((w) => w.includes('berulang'))) {
      suggestions.push('Hindari karakter berulang (aaa, 111)');
    }

    if (suggestions.length === 0 && validation.strength !== 'very_strong') {
      suggestions.push('Gunakan password yang lebih unik dan panjang');
    }

    return suggestions;
  }

  /**
   * Cek apakah password memenuhi minimum requirements
   * (untuk validasi cepat tanpa detail lengkap)
   */
  static meetsMinimumRequirements(password: string): boolean {
    return (
      password.length >= PASSWORD_POLICY.MIN_LENGTH &&
      password.length <= PASSWORD_POLICY.MAX_LENGTH &&
      (!PASSWORD_POLICY.REQUIRE_UPPERCASE || /[A-Z]/.test(password)) &&
      (!PASSWORD_POLICY.REQUIRE_LOWERCASE || /[a-z]/.test(password)) &&
      (!PASSWORD_POLICY.REQUIRE_NUMBER || /\d/.test(password)) &&
      (!PASSWORD_POLICY.REQUIRE_SPECIAL_CHAR || /[!@#$%^&*(),.?":{}|<>]/.test(password))
    );
  }

  /**
   * Format strength untuk ditampilkan ke user
   */
  static formatStrength(strength: PasswordValidationResult['strength']): string {
    const labels = {
      very_weak: 'Sangat Lemah',
      weak: 'Lemah',
      medium: 'Sedang',
      strong: 'Kuat',
      very_strong: 'Sangat Kuat',
    };
    return labels[strength];
  }

  /**
   * Dapatkan warna untuk strength indicator
   */
  static getStrengthColor(strength: PasswordValidationResult['strength']): string {
    const colors = {
      very_weak: 'bg-red-500',
      weak: 'bg-orange-500',
      medium: 'bg-yellow-500',
      strong: 'bg-green-500',
      very_strong: 'bg-emerald-600',
    };
    return colors[strength];
  }

  /**
   * Dapatkan persentase untuk progress bar
   */
  static getStrengthPercentage(strength: PasswordValidationResult['strength']): number {
    const percentages = {
      very_weak: 20,
      weak: 40,
      medium: 60,
      strong: 80,
      very_strong: 100,
    };
    return percentages[strength];
  }
}

/**
 * Fungsi helper untuk validasi cepat
 */
export function validatePassword(password: string): PasswordValidationResult {
  return PasswordValidator.validate(password);
}

/**
 * Fungsi helper untuk generate password
 */
export function generateStrongPassword(length: number = 12): string {
  return PasswordValidator.generatePassword(length);
}

/**
 * Fungsi helper untuk cek minimum requirements
 */
export function isPasswordValid(password: string): boolean {
  return PasswordValidator.meetsMinimumRequirements(password);
}
