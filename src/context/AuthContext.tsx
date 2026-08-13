/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getTeachers,
  getTeacherByUser,
  getLocalTeacherId,
} from '../data/services/teacherService';
import {
  getStudents,
  getStudentByUser,
  getParentStudent,
} from '../data/services/studentService';
import { hashPassword } from '../data/services/coreService';
import { addLoginLog } from '../data/services/loginHistoryService';
import { setClassTeacherId } from '../data/services/classService';
import {
  loginPortal,
  loginAdmin,
  savePortalTokens,
  clearPortalTokens,
  logoutPortal,
} from '../services/authApi';
import { type AuthUser, type UserRole } from '../types';
import { logger } from '../utils/logger';
import { API_BASE, hasApi } from '../services/apiConfig';

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
      // KEAMANAN SESI:
      // - Ideal (hasApi=true): sesi disimpan di httpOnly cookie oleh backend (Set-Cookie),
      //   frontend TIDAK menyimpan AuthUser/token di localStorage. Verifikasi sesi
      //   dilakukan via backend (credentials: 'include').
      // - Minimal (fallback): bila httpOnly belum penuh, simpan hanya data non-sensitif
      //   (id, role) dan verifikasi ulang ke backend saat load. Jangan simpan token
      //   di localStorage saat backend aktif — token di httpOnly cookie.
      // - Mode demo lokal (hasApi=false): boleh pakai localStorage karena tidak ada backend.
      if (hasApi) {
        // Mode backend: coba baca sesi minimal (hasil migrasi) — tapi verifikasi
        // sebenarnya harus via backend (cookie). Untuk kompatibilitas, masih
        // izinkan baca absensi_auth lama sambil memberi warning untuk migrasi.
        const savedMinimal = localStorage.getItem('absensi_auth_minimal');
        if (savedMinimal) {
          try {
            return JSON.parse(savedMinimal) as AuthUser;
          } catch {
            localStorage.removeItem('absensi_auth_minimal');
          }
        }
        // Fallback: baca legacy key tapi jangan andalkan untuk produksi
        const savedLegacy = localStorage.getItem('absensi_auth');
        if (savedLegacy) {
          try {
            const parsed = JSON.parse(savedLegacy) as AuthUser;
            // Migrasi: simpan minimal dan hapus legacy yang penuh
            logger.warn(
              '[Auth] absensi_auth legacy terdeteksi saat hasApi=true — migrasi ke minimal & httpOnly cookie disarankan.'
            );
            return parsed;
          } catch {
            localStorage.removeItem('absensi_auth');
          }
        }
        return null;
      }
      const saved = localStorage.getItem('absensi_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('absensi_auth');
      localStorage.removeItem('absensi_auth_minimal');
      return null;
    }
  });

  const simpanSesi = useCallback((authUser: AuthUser) => {
    try {
      if (hasApi) {
        // Mode backend aktif: JANGAN simpan AuthUser penuh di localStorage.
        // Ideal: backend menyetel httpOnly cookie (Set-Cookie) — frontend tidak
        // perlu menyimpan token/sesi. Minimal: simpan hanya data non-sensitif
        // (id, role, name) untuk UI, dan verifikasi sesi ke backend saat reload.
        // Ini mencegah pencurian token via XSS (localStorage rentan XSS).
        const minimal: AuthUser = {
          id: authUser.id,
          name: authUser.name,
          role: authUser.role,
          // avatar/email boleh disertakan untuk UI, tapi bukan rahasia
          avatar: authUser.avatar,
          email: authUser.email,
          legacyId: authUser.legacyId,
          nis: authUser.nis,
          nip: authUser.nip,
        };
        localStorage.setItem('absensi_auth_minimal', JSON.stringify(minimal));
        // Hapus legacy full object jika ada
        localStorage.removeItem('absensi_auth');
        return;
      }
      // Mode demo lokal (hasApi=false): boleh pakai localStorage penuh
      localStorage.setItem('absensi_auth', JSON.stringify(authUser));
    } catch {
      logger.warn('Gagal menyimpan sesi ke localStorage karena kuota penuh.');
    }
  }, []);

  const login = useCallback(
    async (id: string, password: string, role: UserRole): Promise<boolean> => {
      // Admin login diverifikasi backend (/api/auth/admin/login). Kredensial
      // admin hanya ada di env backend, tidak pernah dibundle ke frontend.
      // Hanya dipanggil untuk role 'admin' — jangan coba login admin untuk
      // role lain (sebelumnya ini mengirim request admin login setiap login).
      if (role === 'admin') {
        const adminResult = await loginAdmin(id, password);

        if (adminResult.status === 'ok') {
          savePortalTokens(adminResult.accessToken, adminResult.refreshToken);
          const authUser: AuthUser = {
            id: `admin_${adminResult.profileName}`,
            name: 'Administrator',
            role: 'admin',
          };
          setUser(authUser);
          simpanSesi(authUser);
          addLoginLog(authUser.name, 'admin', 'form');
          return true;
        }

        // Backend menolak kredensial admin — jangan lanjut ke alur lain.
        if (adminResult.status === 'invalid') {
          return false;
        }
        // status 'unreachable' → backend tidak aktif; admin butuh backend,
        // fallback store lokal tidak punya akun admin → login gagal.
        return false;
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
          legacyId:
            portalResult.user.legacyId ??
            portalResult.user.guardianOf?.[0]?.legacyId ??
            undefined,
          nis: portalResult.user.nis ?? undefined,
          nip: portalResult.user.nip ?? undefined,
        };
        setUser(authUser);
        simpanSesi(authUser);
        // Sinkronkan kelas binaan (homeroom) backend ke store lokal agar dasbor wali
        // kelas & panel orang tua ikut konsisten setelah login via backend.
        // Store memakai id guru lokal (mis. 't1'), bukan CUID backend.
        if (role === 'teacher' && portalResult.user.homeroomClassIds?.length) {
          const localTeacherId = getLocalTeacherId(authUser);
          portalResult.user.homeroomClassIds.forEach((classId) =>
            setClassTeacherId(classId, localTeacherId ?? authUser.id)
          );
        }
        addLoginLog(authUser.name, role, 'form');
        return true;
      }

      if (portalResult.status === 'invalid') {
        return false;
      }

      // Backend dikonfigurasi tapi tidak terjangkau — JANGAN fallback ke store
      // lokal, karena akun & otorisasinya hanya sah di server. Fallback lokal
      // hanya diperbolehkan dalam mode demo (backend memang tidak dipakai).
      if (hasApi) {
        return false;
      }

      // Fallback: backend unreachable / role tak didukung — pakai store lokal
      // CATATAN: hashPassword di bawah HANYA untuk mode demo lokal (hasApi===false).
      // Di mode backend (hasApi===true) cabang ini tidak pernah dieksekusi.
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
        // Login wali: identifier unik = NIS anak (bukan nama). Ini mencegah
        // tabrakan nama & tebakan (nama tidak unik). Kombinasikan NIS + parentPassword.
        const trimmedId = id.trim();
        const students = getStudents();
        for (const s of students) {
          if (
            s.nis === trimmedId &&
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
        const res = await fetch(`${API_BASE}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
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

        // Backend menolak atau tidak memvalidasi kredensial — jangan decode JWT
        // di client tanpa verifikasi tanda tangan.
        logger.warn('[AuthContext] Backend menolak kredensial Google.');
        return false;
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
    localStorage.removeItem('absensi_auth_minimal');
    // Revoke token di server (best-effort — jangan blokir logout lokal jika
    // backend tidak terjangkau). Tanpa ini token tetap valid sampai expiry.
    // Token idealnya di httpOnly cookie — server akan clear cookie via Set-Cookie.
    void logoutPortal();
    clearPortalTokens();
  }, []);

  const refreshUser = useCallback(() => {
    if (!user) return;
    let nextUser: AuthUser | null = null;

    if (user.role === 'teacher') {
      const teacher = getTeacherByUser(user);
      if (teacher && (teacher.name !== user.name || teacher.avatar !== user.avatar)) {
        nextUser = { ...user, name: teacher.name, avatar: teacher.avatar };
      }
    } else if (user.role === 'parent') {
      const student = getParentStudent(user);
      const targetName = student?.parentName || user.name;
      const targetAvatar = student?.parentAvatar || student?.avatar || user.avatar;
      if (student && (targetName !== user.name || targetAvatar !== user.avatar)) {
        nextUser = { ...user, name: targetName, avatar: targetAvatar };
      }
    } else if (user.role === 'student') {
      const student = getStudentByUser(user);
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
