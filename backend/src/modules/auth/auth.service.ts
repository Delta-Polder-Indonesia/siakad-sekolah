import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import type { JwtPayload } from '../../middleware/auth.js';

function signTokens(payload: JwtPayload) {
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
  return { accessToken, refreshToken };
}

// Login Guru
export async function loginTeacher(nip: string, password: string) {
  const teacher = await prisma.teacher.findUnique({ where: { nip } });

  if (!teacher) return null;

  const isValid = await bcrypt.compare(password, teacher.passwordHash);
  if (!isValid) return null;

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

  return {
    user: {
      id:             teacher.id,
      name:           teacher.name,
      role:           'GURU' as const,
      avatarUrl:      teacher.avatarUrl,
      email:          teacher.email,
      classIds:       classes.map((c) => c.classRoomId),
      homeroomClassIds: homeroomClasses.map((c) => c.id),
    },
    ...signTokens(payload),
  };
}

// Login Siswa
export async function loginStudent(nis: string, password: string) {
  const student = await prisma.student.findUnique({ where: { nis } });

  if (!student) return null;

  const isValid = await bcrypt.compare(password, student.passwordHash);
  if (!isValid) return null;

  const payload: JwtPayload = {
    userId: student.id,
    role:   'MURID',
    name:   student.name,
  };

  return {
    user: {
      id:       student.id,
      name:     student.name,
      role:     'MURID' as const,
      avatarUrl: student.avatarUrl,
      email:    student.email,
      classId:  student.classId,
    },
    ...signTokens(payload),
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

  const { accessToken } = signTokens(payload);

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
    ...signTokens(payload),
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

  const { accessToken, refreshToken } = signTokens(jwtPayload);

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

    return { accessToken };
  } catch {
    return null;
  }
}
