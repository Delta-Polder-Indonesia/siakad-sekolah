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
      if (trimmedId.length < 3) return 'Nama minimal 3 karakter.';
      break;
  }

  return null;
}
