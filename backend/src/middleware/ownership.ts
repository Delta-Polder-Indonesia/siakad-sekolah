// Ownership-check: siswa/wali hanya boleh mengakses data milik sendiri.
// Guru/admin lolos tanpa pembatasan studentId.
//
// Linkage: JWT MURID.userId = Student.id (CUID).
// JWT WALIS.userId = `wali_${Student.id}`.
// Query/body boleh memakai CUID atau legacyId (s1, s2, …).

import type { Request, RequestHandler } from 'express';
import { prisma } from '../lib/prisma.js';
import { logSecurityEvent } from '../config/logger.js';

export function parentStudentIdFromUserId(userId: string): string | null {
  if (userId.startsWith('wali_')) return userId.slice(5);
  return null;
}

export async function resolveStudentRef(ref: string | undefined | null) {
  if (!ref) return null;
  const byId = await prisma.student.findUnique({
    where: { id: ref },
    select: { id: true, classId: true, legacyId: true, nis: true },
  });
  if (byId) return byId;
  const byLegacy = await prisma.student.findUnique({
    where: { legacyId: ref },
    select: { id: true, classId: true, legacyId: true, nis: true },
  });
  if (byLegacy) return byLegacy;
  return prisma.student.findUnique({
    where: { nis: ref },
    select: { id: true, classId: true, legacyId: true, nis: true },
  });
}

export async function ownedStudentIds(req: Request): Promise<string[] | 'all'> {
  const user = req.jwtUser;
  if (!user) return [];
  if (user.role === 'ADMIN' || user.role === 'GURU') return 'all';
  if (user.role === 'MURID') return [user.userId];
  if (user.role === 'WALIS') {
    const sid = parentStudentIdFromUserId(user.userId);
    return sid ? [sid] : [];
  }
  return [];
}

export async function canAccessStudent(req: Request, studentRef: string): Promise<boolean> {
  const owned = await ownedStudentIds(req);
  if (owned === 'all') return true;
  const student = await resolveStudentRef(studentRef);
  if (!student) return false;
  return owned.includes(student.id);
}

/** Paksa query.studentId ke milik sendiri untuk MURID/WALIS. */
export const scopeStudentQuery: RequestHandler = async (req, _res, next) => {
  try {
    const owned = await ownedStudentIds(req);
    if (owned === 'all') {
      next();
      return;
    }
    const requested = typeof req.query.studentId === 'string' ? req.query.studentId : undefined;
    if (requested) {
      const ok = await canAccessStudent(req, requested);
      if (!ok) {
        logSecurityEvent('ownership_denied', {
          userId: req.jwtUser?.userId,
          role: req.jwtUser?.role,
          studentId: requested,
        });
        _res.status(403).json({
          ok: false,
          message: 'Akses ditolak. Anda hanya dapat mengakses data sendiri.',
        });
        return;
      }
      const resolved = await resolveStudentRef(requested);
      if (resolved) req.query.studentId = resolved.id;
    } else if (owned[0]) {
      req.query.studentId = owned[0];
    }
    next();
  } catch (err) {
    next(err);
  }
};

/** Body.studentId harus milik sendiri (kecuali guru/admin). */
export const requireStudentBodyOwnership: RequestHandler = async (req, res, next) => {
  try {
    const owned = await ownedStudentIds(req);
    if (owned === 'all') {
      next();
      return;
    }
    const ref = typeof req.body?.studentId === 'string' ? req.body.studentId : '';
    if (!ref || !(await canAccessStudent(req, ref))) {
      logSecurityEvent('ownership_denied_body', {
        userId: req.jwtUser?.userId,
        role: req.jwtUser?.role,
      });
      res.status(403).json({
        ok: false,
        message: 'Akses ditolak. Anda hanya dapat mengakses data sendiri.',
      });
      return;
    }
    const resolved = await resolveStudentRef(ref);
    if (resolved) req.body.studentId = resolved.id;
    next();
  } catch (err) {
    next(err);
  }
};
