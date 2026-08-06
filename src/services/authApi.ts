// Layer autentikasi portal ke backend (/api/auth).
// Dipakai AuthContext saat backend aktif (hasApi). Kalau backend tidak
// tersedia, AuthContext otomatis fallback ke store lokal.
import { API_BASE } from './apiConfig';
import type { UserRole } from '../types';

const ACCESS_TOKEN_KEY = 'portal_access_token';
const REFRESH_TOKEN_KEY = 'portal_refresh_token';

// Backend memakai nama role huruf besar. Role 'parent' belum didukung backend.
const ROLE_MAP: Partial<Record<UserRole, 'GURU' | 'MURID' | 'TAMU'>> = {
  teacher: 'GURU',
  student: 'MURID',
  guest: 'TAMU',
};

export interface BackendAuthUser {
  id: string;
  name: string;
  role: 'GURU' | 'MURID' | 'TAMU';
  avatarUrl?: string | null;
  email?: string | null;
  classId?: string | null;
  classIds?: string[]; // guru: kelas ajar (ClassRoomTeacher M2M)
  homeroomClassIds?: string[]; // guru: kelas binaan (ClassRoom.teacherId)
}

export type PortalLoginResult =
  | { status: 'ok'; user: BackendAuthUser; accessToken: string; refreshToken: string | null }
  | { status: 'invalid' }
  | { status: 'unreachable' };

export type PortalAdminLoginResult =
  | { status: 'ok'; profileName: string; accessToken: string; refreshToken: string | null }
  | { status: 'invalid' }
  | { status: 'unreachable' };

export function savePortalTokens(accessToken: string, refreshToken: string | null) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearPortalTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getPortalAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || '';
}

// Verifikasi kredensial ke backend.
// - 'ok'          → backend memvalidasi kredensial
// - 'invalid'     → backend menolak (401 / ok:false)
// - 'unreachable' → backend tidak bisa dihubungi / role tidak didukung → fallback lokal
export async function loginPortal(
  id: string,
  password: string,
  role: UserRole
): Promise<PortalLoginResult> {
  const backendRole = ROLE_MAP[role];
  if (!backendRole) return { status: 'unreachable' };

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: backendRole, id, password }),
    });

    if (res.status === 401) return { status: 'invalid' };
    if (!res.ok) return { status: 'unreachable' };

    const data = (await res.json()) as {
      ok?: boolean;
      user?: BackendAuthUser;
      accessToken?: string;
      refreshToken?: string | null;
    };

    if (!data.ok || !data.user || !data.accessToken) return { status: 'invalid' };

    return {
      status: 'ok',
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
    };
  } catch {
    return { status: 'unreachable' };
  }
}

// Login admin ke backend (POST /api/auth/admin/login).
// Endpoint memakai field `username` & `pin`. Kredensial admin hanya ada di
// env backend, tidak pernah di-bundle ke frontend.
// - 'ok'          → backend memvalidasi kredensial admin
// - 'invalid'     → backend menolak (401 / ok:false)
// - 'unreachable' → backend tidak bisa dihubungi → fallback login portal/lokal
export async function loginAdmin(
  username: string,
  pin: string
): Promise<PortalAdminLoginResult> {
  try {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin }),
    });

    if (res.status === 401) return { status: 'invalid' };
    if (!res.ok) return { status: 'unreachable' };

    const data = (await res.json()) as {
      ok?: boolean;
      profileName?: string;
      accessToken?: string;
      refreshToken?: string | null;
    };

    if (!data.ok || !data.profileName || !data.accessToken) return { status: 'invalid' };

    return {
      status: 'ok',
      profileName: data.profileName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
    };
  } catch {
    return { status: 'unreachable' };
  }
}
