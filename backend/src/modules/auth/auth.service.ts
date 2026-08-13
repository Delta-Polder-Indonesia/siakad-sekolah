import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import type { JwtPayload } from '../../middleware/auth.js';
import { validatePassword, formatPasswordErrors } from '../../utils/passwordValidator.js';
import { logger, logSecurityEvent, logDatabaseOperation } from '../../config/logger.js';
import {
  blacklistToken,
  blacklistUserTokens,
  getBlacklistStats,
  isTokenBlacklisted,
  isTokenRegistered,
  registerSessionToken,
  revokeTokenSession,
} from '../../utils/tokenManager.js';
import { AuthenticationError, ValidationError, NotFoundError } from '../../utils/errors.js';

function getTokenExpiry(token: string): Date {
  const decoded = jwt.decode(token) as jwt.JwtPayload | null;
  return new Date((decoded?.exp ?? 0) * 1000);
}

// Sign token dan daftarkan ke registry sesi (tabel SessionToken).
// Registry ini dipakai "logout dari semua perangkat" untuk membatalkan semua
// sesi user sekaligus.
async function signTokens(payload: JwtPayload) {
  // Validasi environment variables sebelum penggunaan
  if (!env.JWT_SECRET || !env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables');
  }

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

  await Promise.all([
    registerSessionToken(payload.userId, accessToken, getTokenExpiry(accessToken), 'access'),
    registerSessionToken(payload.userId, refreshToken, getTokenExpiry(refreshToken), 'refresh'),
  ]);

  return { accessToken, refreshToken };
}

// Login Guru
export async function loginTeacher(nip: string, password: string) {
  logDatabaseOperation('teacher_login_attempt', { nip });
  
  const teacher =
    (await prisma.teacher.findUnique({ where: { nip } })) ||
    (await prisma.teacher.findUnique({ where: { legacyId: nip } }));

  if (!teacher) {
    logSecurityEvent('login_failed', { reason: 'teacher_not_found', nip });
    return null;
  }

  const isValid = await bcrypt.compare(password, teacher.passwordHash);
  if (!isValid) {
    logSecurityEvent('login_failed', { reason: 'invalid_password', nip, teacherId: teacher.id });
    return null;
  }

  // Kelas yang diampu + kelas binaan (wali kelas)
  const [classes, homeroomClasses] = await Promise.all([
    prisma.classRoomTeacher.findMany({
      where: { teacherId: teacher.id },
      select: { classRoomId: true, isHomeroom: true },
    }),
    prisma.classRoom.findMany({
      where: { teacherId: teacher.id },
      select: { id: true },
    }),
  ]);

  const payload: JwtPayload = {
    userId: teacher.id,
    role:   'GURU',
    name:   teacher.name,
  };

  logSecurityEvent('login_success', { userId: teacher.id, role: 'GURU', name: teacher.name });

  return {
    user: {
      id:             teacher.id,
      name:           teacher.name,
      role:           'GURU' as const,
      avatarUrl:      teacher.avatarUrl,
      email:          teacher.email,
      legacyId:       teacher.legacyId,
      nip:            teacher.nip,
      classIds:       classes.map((c) => c.classRoomId),
      homeroomClassIds: homeroomClasses.map((c) => c.id),
    },
    ...(await signTokens(payload)),
  };
}

// Validate password strength untuk user yang ingin mengganti password
export function validateUserPassword(password: string) {
  const validation = validatePassword(password);
  
  return {
    isValid: validation.isValid,
    errors: validation.errors,
    strength: validation.strength,
    score: validation.score,
    message: validation.isValid 
      ? 'Password memenuhi kebijakan keamanan' 
      : formatPasswordErrors(validation.errors)
  };
}

// Change password untuk guru
export async function changeTeacherPassword(teacherId: string, oldPassword: string, newPassword: string) {
  logSecurityEvent('password_change_attempt', { userId: teacherId, role: 'teacher' });
  
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  
  if (!teacher) {
    logSecurityEvent('password_change_failed', { reason: 'teacher_not_found', teacherId });
    throw new NotFoundError('Teacher', teacherId);
  }

  // Verify old password
  const isValid = await bcrypt.compare(oldPassword, teacher.passwordHash);
  if (!isValid) {
    logSecurityEvent('password_change_failed', { reason: 'invalid_old_password', teacherId });
    throw new AuthenticationError('Password lama salah');
  }

  // Validate new password strength
  const validation = validatePassword(newPassword);
  if (!validation.isValid) {
    logSecurityEvent('password_change_failed', { reason: 'weak_password', teacherId, strength: validation.strength });
    throw new ValidationError(
      'Password baru tidak memenuhi kebijakan keamanan',
      { errors: validation.errors, strength: validation.strength }
    );
  }

  // Check if new password is same as old password
  const isSamePassword = await bcrypt.compare(newPassword, teacher.passwordHash);
  if (isSamePassword) {
    logSecurityEvent('password_change_failed', { reason: 'same_password', teacherId });
    throw new ValidationError('Password baru tidak boleh sama dengan password lama');
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.teacher.update({
    where: { id: teacherId },
    data: { passwordHash: newPasswordHash }
  });

  logSecurityEvent('password_change_success', { userId: teacherId, role: 'teacher' });

  return { success: true, message: 'Password berhasil diubah' };
}

// Change password untuk siswa
export async function changeStudentPassword(studentId: string, oldPassword: string, newPassword: string) {
  logSecurityEvent('password_change_attempt', { userId: studentId, role: 'student' });
  
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  
  if (!student) {
    logSecurityEvent('password_change_failed', { reason: 'student_not_found', studentId });
    throw new NotFoundError('Student', studentId);
  }

  // Verify old password
  const isValid = await bcrypt.compare(oldPassword, student.passwordHash);
  if (!isValid) {
    logSecurityEvent('password_change_failed', { reason: 'invalid_old_password', studentId });
    throw new AuthenticationError('Password lama salah');
  }

  // Validate new password strength
  const validation = validatePassword(newPassword);
  if (!validation.isValid) {
    logSecurityEvent('password_change_failed', { reason: 'weak_password', studentId, strength: validation.strength });
    throw new ValidationError(
      'Password baru tidak memenuhi kebijakan keamanan',
      { errors: validation.errors, strength: validation.strength }
    );
  }

  // Check if new password is same as old password
  const isSamePassword = await bcrypt.compare(newPassword, student.passwordHash);
  if (isSamePassword) {
    logSecurityEvent('password_change_failed', { reason: 'same_password', studentId });
    throw new ValidationError('Password baru tidak boleh sama dengan password lama');
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.student.update({
    where: { id: studentId },
    data: { passwordHash: newPasswordHash }
  });

  logSecurityEvent('password_change_success', { userId: studentId, role: 'student' });

  return { success: true, message: 'Password berhasil diubah' };
}

// Login Siswa
export async function loginStudent(nis: string, password: string) {
  logDatabaseOperation('student_login_attempt', { nis });
  
  const student =
    (await prisma.student.findUnique({ where: { nis } })) ||
    (await prisma.student.findUnique({ where: { legacyId: nis } }));

  if (!student) {
    logSecurityEvent('login_failed', { reason: 'student_not_found', nis });
    return null;
  }

  const isValid = await bcrypt.compare(password, student.passwordHash);
  if (!isValid) {
    logSecurityEvent('login_failed', { reason: 'invalid_password', nis, studentId: student.id });
    return null;
  }

  const payload: JwtPayload = {
    userId: student.id,
    role:   'MURID',
    name:   student.name,
  };

  logSecurityEvent('login_success', { userId: student.id, role: 'MURID', name: student.name });

  return {
    user: {
      id:       student.id,
      name:     student.name,
      role:     'MURID' as const,
      avatarUrl: student.avatarUrl,
      email:    student.email,
      classId:  student.classId,
    },
    ...(await signTokens(payload)),
  };
}

// Login Wali Siswa — akun wali menempel pada data siswa (guardian*).
// Identifier unik sekarang adalah NIS anak (bukan nama wali yang tidak unik).
// Login id = NIS anak (mis. 2024001) ATAU fallback nama/nomor HP untuk kompatibilitas.
// (filter nama case-insensitive dilakukan di JS karena SQLite tidak
// mendukung Prisma `mode: 'insensitive'`.)
export async function loginParent(id: string, password: string) {
  const candidates = await prisma.student.findMany({
    where: { guardianName: { not: null } },
    select: {
      id: true,
      name: true,
      nis: true,
      classId: true,
      legacyId: true,
      guardianName: true,
      guardianPhone: true,
      guardianPasswordHash: true,
    },
  });

  const trimmedId = id.trim();
  const normalizedId = trimmedId.toLowerCase();
  const students = candidates.filter((s) =>
    (s.nis === trimmedId) ||
    (s.guardianName?.toLowerCase() === normalizedId) ||
    (s.guardianPhone === trimmedId)
  );

  if (students.length === 0) {
    logSecurityEvent('login_failed', { reason: 'parent_not_found', id });
    return null;
  }

  // Cek password terhadap semua calon yang nama/nomor HP-nya cocok.
  // (bisa ada 2+ siswa dgn wali yang sama — satu wali, banyak anak)
  let match: (typeof students)[number] | null = null;
  for (const s of students) {
    if (s.guardianPasswordHash && (await bcrypt.compare(password, s.guardianPasswordHash))) {
      match = s;
      break;
    }
  }

  if (!match) {
    logSecurityEvent('login_failed', { reason: 'invalid_password', role: 'WALIS' });
    return null;
  }

  const guardianName = match.guardianName || `Orang Tua ${match.name}`;
  const payload: JwtPayload = {
    userId: `wali_${match.id}`,
    role:   'WALIS',
    name:   guardianName,
  };

  logSecurityEvent('login_success', { userId: payload.userId, role: 'WALIS', name: guardianName });

  return {
    user: {
      id:        payload.userId,
      name:      guardianName,
      role:      'WALIS' as const,
      guardianOf: [{
        studentId: match.id,
        studentName: match.name,
        classId: match.classId,
        legacyId: match.legacyId,
      }],
    },
    ...(await signTokens(payload)),
  };
}

// Login Tamu (pakai access code)
export async function loginGuest(accessCode: string) {
  const config = await prisma.schoolConfig.findFirst();

  // Kalau belum ada config, gunakan default
  const validCode = config?.guestAccessCode ?? 'TAMU2026';

  if (accessCode !== validCode) return null;

  // Tamu tidak punya id di database
  // Buat token sementara
  const payload: JwtPayload = {
    userId: `guest_${Date.now()}`,
    role:   'TAMU',
    name:   'Tamu Pengunjung',
  };

  const { accessToken } = await signTokens(payload);

  return {
    user: {
      id:   payload.userId,
      name: payload.name,
      role: 'TAMU' as const,
    },
    accessToken,
    // Tamu tidak dapat refresh token
    refreshToken: null,
  };
}

// Login Admin (panel PPDB) — kredensial dari environment
export async function loginAdmin(username: string, password: string) {
  if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
    return null;
  }

  const payload: JwtPayload = {
    userId: `admin_${username}`,
    role:   'ADMIN',
    name:   username,
  };

  return {
    profileName: username,
    ...(await signTokens(payload)),
  };
}

// Login Google — verifikasi id_token lalu cari user di database
const googleClient = new OAuth2Client();

export async function loginGoogle(idToken: string, role: string) {
  if (!env.GOOGLE_CLIENT_ID) {
    return { status: 'unavailable' as const };
  }

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch {
    return { status: 'invalid' as const };
  }

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    return { status: 'invalid' as const };
  }

  const email = payload.email;
  const name = payload.name || email;
  const picture = payload.picture || null;

  // Cari user berdasarkan email
  let userId: string;
  let userName: string;
  let userRole: 'GURU' | 'MURID' | 'TAMU';
  let avatarUrl: string | null = picture;

  if (role === 'teacher') {
    const teacher = await prisma.teacher.findFirst({ where: { email } });
    if (!teacher) return { status: 'invalid' as const };
    userId = teacher.id;
    userName = teacher.name;
    userRole = 'GURU';
    avatarUrl = teacher.avatarUrl || picture;
  } else if (role === 'student') {
    const student = await prisma.student.findFirst({ where: { email } });
    if (!student) return { status: 'invalid' as const };
    userId = student.id;
    userName = student.name;
    userRole = 'MURID';
    avatarUrl = student.avatarUrl || picture;
  } else {
    // Guest / fallback — buat token tanpa akun database
    userId = `google_${payload.sub}`;
    userName = name;
    userRole = 'TAMU';
  }

  const jwtPayload: JwtPayload = {
    userId,
    role: userRole,
    name: userName,
  };

  const { accessToken, refreshToken } = await signTokens(jwtPayload);

  return {
    status: 'ok' as const,
    user: {
      id: userId,
      name: userName,
      role: userRole,
      avatarUrl,
      email,
    },
    accessToken,
    refreshToken,
  };
}

// Refresh token
export async function refreshAccessToken(refreshToken: string) {
  try {
    // Validasi environment variable sebelum penggunaan
    if (!env.JWT_REFRESH_SECRET || !env.JWT_SECRET) {
      throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables');
    }

    // Jangan izinkan refresh token yang sudah di-revoke (mis. setelah logout
    // atau logout dari semua perangkat).
    const blacklisted = await isTokenBlacklisted(refreshToken);
    if (blacklisted) return null;

    // Refresh token juga harus terdaftar sebagai sesi aktif — kalau user sudah
    // "logout dari semua perangkat", registry sesinya sudah dihapus.
    const registered = await isTokenRegistered(refreshToken);
    if (!registered) return null;

    const payload = jwt.verify(
      refreshToken,
      env.JWT_REFRESH_SECRET
    ) as JwtPayload;

    const newPayload: JwtPayload = {
      userId: payload.userId,
      role:   payload.role,
      name:   payload.name,
    };

    const accessToken = jwt.sign(newPayload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    // Daftarkan access token baru ke registry sesi aktif.
    await registerSessionToken(payload.userId, accessToken, getTokenExpiry(accessToken), 'access');

    return { accessToken };
  } catch {
    return null;
  }
}

// Logout - blacklist access token (dan refresh token jika dikirim) + hapus dari registry sesi aktif
export async function logout(accessToken: string, userId?: string, refreshToken?: string | null) {
  const success = await blacklistToken(accessToken, userId, 'User logout');

  // Revoke refresh token juga — tanpa ini refresh token tetap bisa dipakai
  // untuk mendapatkan access token baru setelah logout.
  if (refreshToken) {
    await blacklistToken(refreshToken, userId, 'User logout (refresh)');
  }

  // Hapus dari registry sesi aktif (aktif meskipun blacklist gagal).
  await revokeTokenSession(accessToken);
  if (refreshToken) {
    await revokeTokenSession(refreshToken);
  }

  if (success) {
    logSecurityEvent('user_logout', { userId });
  }

  return { success, message: success ? 'Logout berhasil' : 'Logout gagal' };
}

// Logout from all devices - revoke semua sesi aktif milik user.
// (revokeAllUserSessions menandai seluruh registry SessionToken milik user,
// sehingga semua access & refresh token lama otomatis ditolak.)
export async function logoutAllDevices(userId: string) {
  const count = await blacklistUserTokens(userId, userId, 'Logout from all devices');
  
  logSecurityEvent('user_logout_all_devices', { userId, sessionsRevoked: count });
  
  return { 
    success: true, 
    message: 'Logout dari semua perangkat berhasil',
    tokensRevoked: count 
  };
}

// Get blacklist statistics (untuk admin monitoring)
export async function getTokenBlacklistStats() {
  const stats = await getBlacklistStats();
  return {
    ...stats,
    timestamp: new Date().toISOString(),
  };
}
