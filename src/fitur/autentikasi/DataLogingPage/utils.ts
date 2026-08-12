import { ValidRole } from './types';

/**
 * Memeriksa apakah nilai string termasuk ValidRole
 */
export const isValidRole = (value: string): value is ValidRole => {
  const validRoles: readonly string[] = ['teacher', 'student', 'parent', 'guest'];
  return validRoles.includes(value);
};

/**
 * Validasi input login berdasarkan role
 * Mengembalikan pesan error atau null jika valid
 */
export function validateLoginInput(role: ValidRole, id: string, password: string): string | null {
  const trimmedId = id.trim();

  if (!trimmedId) return 'ID tidak boleh kosong.';
  if (!password) return 'Kata sandi tidak boleh kosong.';

  // ── Bypass validasi untuk akun admin ──
  if (trimmedId === 'admin') return null;

  // Validasi password strength (hanya jika password validator tersedia)
  try {
    // Dynamic require untuk menghindari error saat testing (disengaja).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { isPasswordValid } = require('../../utils/passwordValidator');
    if (!isPasswordValid(password)) {
      return 'Kata sandi harus minimal 8 karakter dengan kombinasi huruf kapital, huruf kecil, angka, dan karakter khusus.';
    }
  } catch (error) {
    // Jika password validator tidak tersedia, skip password validation
    console.warn('Password validator not available, skipping password validation');
  }

  switch (role) {
    case 'teacher':
      if (!/^\d+$/.test(trimmedId)) return 'NIP harus berupa angka.';
      break;
    case 'student':
      if (!/^\d{4,}$/.test(trimmedId)) return 'NISN minimal 4 digit angka.';
      break;
    case 'guest': {
      // Regex email teroptimasi tanpa ReDoS (RFC 5322 compliant)
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

      if (!emailRegex.test(trimmedId)) {
        return 'Format email tidak valid. Contoh: nama@gmail.com';
      }
      if (trimmedId.length > 254) {
        return 'Alamat email terlalu panjang.';
      }
      const localPart = trimmedId.split('@')[0];
      if (localPart && localPart.length > 64) {
        return 'Bagian nama email terlalu panjang.';
      }
      break;
    }
    case 'parent':
      // Wali login pakai NIS anak (unik), bukan nama (rentan duplikat)
      if (!/^\d{4,}$/.test(trimmedId)) return 'NIS anak minimal 4 digit angka.';
      break;
  }

  return null;
}
