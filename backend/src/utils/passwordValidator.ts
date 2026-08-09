import { z } from 'zod';

/**
 * Password policy validation schema
 * Sesuai dengan security best practices untuk production systems
 */
export const passwordSchema = z.string()
  .min(8, 'Password minimal 8 karakter')
  .max(128, 'Password maksimal 128 karakter')
  .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf kapital (A-Z)')
  .regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil (a-z)')
  .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka (0-9)')
  .regex(/[^A-Za-z0-9]/, 'Password harus mengandung minimal 1 karakter khusus (!@#$%^&*)');

/**
 * Forbidden password patterns untuk mencegah password yang lemah
 */
const FORBIDDEN_PATTERNS = [
  '123456', 'qwerty', 'password', 'katasandi', 'admin', 'welcome',
  'password123', 'admin123', '12345678', '111111', 'aaaaaa'
];

/**
 * Common passwords yang tidak boleh digunakan
 */
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', 'master', 'dragon', '111111', 'baseball',
  'iloveyou', 'trustno1', 'sunshine', 'princess', 'admin'
];

/**
 * Validate password strength dan complexity
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';
  score: number;
} {
  const errors: string[] = [];
  let score = 0;

  // Basic validation dengan Zod
  const zodResult = passwordSchema.safeParse(password);
  if (!zodResult.success) {
    errors.push(...zodResult.error.errors.map(e => e.message));
  } else {
    // Berikan score untuk basic requirements
    score += 40;
  }

  // Check forbidden patterns
  const lowerPassword = password.toLowerCase();
  if (FORBIDDEN_PATTERNS.some(pattern => lowerPassword.includes(pattern))) {
    errors.push('Password mengandung pattern yang dilarang (contoh: 123456, qwerty, password)');
  }

  // Check common passwords
  if (COMMON_PASSWORDS.includes(lowerPassword)) {
    errors.push('Password terlalu umum, gunakan password yang lebih unik');
  }

  // Check sequential characters (123, abc, etc)
  if (hasSequentialChars(password)) {
    errors.push('Password mengandung karakter berurutan (contoh: 123, abc)');
    score -= 10;
  }

  // Check repeated characters (aaa, 111, etc)
  if (hasRepeatedChars(password)) {
    errors.push('Password mengandung karakter berulang (contoh: aaa, 111)');
    score -= 10;
  }

  // Calculate additional strength score
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  // eslint-disable-next-line no-useless-escape
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;
  if (/[A-Z].*[A-Z]/.test(password)) score += 5; // Multiple uppercase
  if (/[a-z].*[a-z]/.test(password)) score += 5; // Multiple lowercase
  if (/[0-9].*[0-9]/.test(password)) score += 5; // Multiple numbers

  // Determine strength level
  let strength: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';
  if (score < 20) strength = 'very_weak';
  else if (score < 40) strength = 'weak';
  else if (score < 60) strength = 'medium';
  else if (score < 80) strength = 'strong';
  else strength = 'very_strong';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.max(0, Math.min(100, score))
  };
}

/**
 * Check apakah password mengandung karakter berurutan
 */
function hasSequentialChars(password: string): boolean {
  for (let i = 0; i < password.length - 2; i++) {
    const current = password.charCodeAt(i);
    const next = password.charCodeAt(i + 1);
    const nextNext = password.charCodeAt(i + 2);
    
    // Check sequential ascending (123, abc)
    if (next === current + 1 && nextNext === current + 2) {
      return true;
    }
    
    // Check sequential descending (321, cba)
    if (next === current - 1 && nextNext === current - 2) {
      return true;
    }
  }
  return false;
}

/**
 * Check apakah password mengandung karakter berulang
 */
function hasRepeatedChars(password: string): boolean {
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) {
      return true;
    }
  }
  return false;
}

/**
 * Generate secure random password
 */
export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  
  const allChars = uppercase + lowercase + numbers + special;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Format error messages untuk user-friendly display
 */
export function formatPasswordErrors(errors: string[]): string {
  if (errors.length === 0) return '';
  return errors.join('. ') + '.';
}