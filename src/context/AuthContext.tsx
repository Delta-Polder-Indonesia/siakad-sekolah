// E:\guthub\projeck-portal-siswa\src\context\AuthContext.tsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getTeachers,
  getStudents,
  hashPassword,
  addLoginLog,
  setClassTeacherId,
} from '../data/services';
import { loginPortal, savePortalTokens, clearPortalTokens } from '../services/authApi';
import { type AuthUser, type UserRole } from '../types';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: AuthUser | null;
  login: (id: string, password: string, role: UserRole) => Promise<boolean>;
  loginGoogle: (role: UserRole, credential?: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('absensi_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('absensi_auth');
      return null;
    }
  });

  const simpanSesi = useCallback((authUser: AuthUser) => {
    try {
      localStorage.setItem('absensi_auth', JSON.stringify(authUser));
    } catch {
      logger.warn('Gagal menyimpan sesi ke localStorage karena kuota penuh.');
    }
  }, []);

  const login = useCallback(
    async (id: string, password: string, role: UserRole): Promise<boolean> => {
      const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      if (adminUsername && adminPassword && id === adminUsername && password === adminPassword) {
        const authUser: AuthUser = {
          id: 'admin',
          name: 'Administrator',
          role: 'admin',
        };
        setUser(authUser);
        simpanSesi(authUser);
        addLoginLog('Administrator', 'admin', 'form');
        return true;
      }

      // Coba backend dulu
      const portalResult = await loginPortal(id, password, role);

      if (portalResult.status === 'ok') {
        savePortalTokens(portalResult.accessToken, portalResult.refreshToken);
        const authUser: AuthUser = {
          id: portalResult.user.id,
          name: portalResult.user.name,
          role: role,
          avatar: portalResult.user.avatarUrl ?? undefined,
          email: portalResult.user.email ?? undefined,
        };
        setUser(authUser);
        simpanSesi(authUser);
        // Sinkronkan kelas binaan (homeroom) backend ke store lokal agar dasbor wali
        // kelas & panel orang tua ikut konsisten setelah login via backend.
        if (role === 'teacher' && portalResult.user.homeroomClassIds?.length) {
          portalResult.user.homeroomClassIds.forEach((classId) =>
            setClassTeacherId(classId, portalResult.user.id)
          );
        }
        addLoginLog(authUser.name, role, 'form');
        return true;
      }

      if (portalResult.status === 'invalid') {
        return false;
      }

      // Fallback: backend unreachable / role tak didukung — pakai store lokal
      const hashedInput = await hashPassword(password);

      if (role === 'teacher') {
        const teachers = getTeachers();
        const teacher = teachers.find((t) => t.nip === id && t.password === hashedInput);
        if (teacher) {
          const authUser: AuthUser = {
            id: teacher.id,
            name: teacher.name,
            role: 'teacher',
            avatar: teacher.avatar,
          };
          setUser(authUser);
          simpanSesi(authUser);
          addLoginLog(teacher.name, 'teacher', 'form');
          return true;
        }
      } else if (role === 'student') {
        const students = getStudents();
        const student = students.find(
          (s) =>
            s.nis === id &&
            s.password === hashedInput &&
            s.status !== 'keluar' &&
            s.status !== 'lulus' &&
            s.status !== 'pindah'
        );
        if (student) {
          const authUser: AuthUser = {
            id: student.id,
            name: student.name,
            role: 'student',
            avatar: student.avatar,
          };
          setUser(authUser);
          simpanSesi(authUser);
          addLoginLog(student.name, 'student', 'form');
          return true;
        }
      } else if (role === 'parent') {
        const students = getStudents();
        for (const s of students) {
          if (
            s.parentName?.toLowerCase() === id.toLowerCase() &&
            s.status !== 'keluar' &&
            s.status !== 'lulus' &&
            s.status !== 'pindah'
          ) {
            const parentHash = await hashPassword(password);
            if (s.parentPassword === parentHash) {
              const authUser: AuthUser = {
                id: `p_${s.id}`,
                name: s.parentName || `Orang Tua ${s.name}`,
                avatar: s.parentAvatar || s.avatar,
                role: 'parent',
              };
              setUser(authUser);
              simpanSesi(authUser);
              addLoginLog(authUser.name, 'parent', 'form');
              return true;
            }
          }
        }
      } else if (role === 'guest') {
        return false;
      }
      return false;
    },
    [simpanSesi]
  );

  const loginGoogle = useCallback(
    async (role: UserRole, credential?: string): Promise<boolean> => {
      if (!credential) {
        logger.error('[AuthContext] Google login gagal: tidak ada credential.');
        return false;
      }

      // Coba verifikasi via backend dulu
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
        const res = await fetch(`${apiBase}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: credential, role }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.user) {
            savePortalTokens(data.accessToken, data.refreshToken);
            const authUser: AuthUser = {
              id: data.user.id,
              name: data.user.name,
              role: role,
              avatar: data.user.avatarUrl ?? undefined,
              email: data.user.email ?? undefined,
            };
            setUser(authUser);
            simpanSesi(authUser);
            addLoginLog(authUser.name, role, 'google', authUser.email);
            return true;
          }
        }
      } catch {
        logger.warn('[AuthContext] Backend Google tidak reachable, fallback ke client-side.');
      }

      // Fallback: backend unreachable — decode JWT di client (mode demo)
      try {
        let payload: Record<string, unknown>;

        if (credential.split('.').length === 3) {
          const base64Url = credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          payload = JSON.parse(jsonPayload);
        } else if (credential.startsWith('{')) {
          payload = JSON.parse(credential);
        } else {
          logger.error('[AuthContext] Format credential Google tidak dikenali.');
          return false;
        }

        const authUser: AuthUser = {
          id: `google_${String(payload.sub || payload.id || Date.now())}`,
          name: String(payload.name || 'Tamu Google'),
          role: role,
          avatar:
            String(payload.picture || '') ||
            'https://ui-avatars.com/api/?name=Guest&background=0D8ABC&color=fff',
          email: String(payload.email || ''),
        };

        setUser(authUser);
        simpanSesi(authUser);
        addLoginLog(authUser.name, authUser.role, 'google', authUser.email);
        return true;
      } catch (error) {
        logger.error('[AuthContext] Gagal memproses kredensial Google:', error);
        return false;
      }
    },
    [simpanSesi]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('absensi_auth');
    clearPortalTokens();
  }, []);

  const refreshUser = useCallback(() => {
    if (!user) return;
    let nextUser: AuthUser | null = null;

    if (user.role === 'teacher') {
      const teacher = getTeachers().find((item) => item.id === user.id);
      if (teacher && (teacher.name !== user.name || teacher.avatar !== user.avatar)) {
        nextUser = { ...user, name: teacher.name, avatar: teacher.avatar };
      }
    } else if (user.role === 'parent') {
      const studentId = user.id.replace('p_', '');
      const student = getStudents().find((item) => item.id === studentId);
      const targetName = student?.parentName || user.name;
      const targetAvatar = student?.parentAvatar || student?.avatar || user.avatar;
      if (student && (targetName !== user.name || targetAvatar !== user.avatar)) {
        nextUser = { ...user, name: targetName, avatar: targetAvatar };
      }
    } else if (user.role === 'student') {
      const student = getStudents().find((item) => item.id === user.id);
      if (student && (student.name !== user.name || student.avatar !== user.avatar)) {
        nextUser = { ...user, name: student.name, avatar: student.avatar };
      }
    }

    if (nextUser) {
      setUser(nextUser);
      simpanSesi(nextUser);
    }
  }, [user, simpanSesi]);

  return (
    <AuthContext.Provider value={{ user, login, loginGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
