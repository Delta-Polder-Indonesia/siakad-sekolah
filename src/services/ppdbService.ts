import {
  adminLogin,
  adminLogout,
  deletePPDBApplication,
  exportPPDBBackupJson,
  getAdminProfileName,
  getPPDBApplicationById,
  getPPDBApplicationByRegNo,
  getPPDBApplications,
  getPPDBAuditLogs,
  getPPDBStatistics,
  importPPDBBackupJson,
  isAdminAuthenticated,
  submitPPDBApplication,
  updateApplicationStatus,
  updateDocumentValidation,
  getPPDBNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
  getAdminSettings,
  updateAdminSettings,
  type PPDBApplication,
  type PPDBAuditLog,
} from '../data/services';
import { API_BASE, hasApi } from './apiConfig';

// Flag untuk AUTENTIKASI/OTORISASI admin PPDB & konfigurasi.
// BUG-05: login & konfigurasi admin PPDB dialihkan ke SERVER (JWT role ADMIN,
// endpoint /api/auth/admin/login & /api/ppdb/config) saat backend aktif —
// sehingga admin tidak lagi bergantung pada PIN yang dibundel di client.
// Berbeda dari `usePpdbApi` (data aplikasi PPDB yang masih lokal).
const usePpdbAdminApi = hasApi;

// ─────────────────────────────────────────────────────────────────────────────
// CATATAN ARSITEKTUR (BUG-02 / Phase 1)
// -----------------------------------------------------------------------------
// Backend BELUM memiliki modul route `/ppdb/*`. Sedangkan tipe data PPDB di
// frontend (src/types.ts → PPDBApplication) memakai model kaya ~60 field
// berbahasa Indonesia (namaLengkap, jenisKelamin, …), sementara model Prisma
// `PPDBApplication` di backend memakai ~25 field berbahasa Inggris (fullName,
// gender, …). Keduanya TIDAK kompatibel secara langsung.
//
// Agar fitur PPDB TIDAK memanggil endpoint yang tidak tersedia (yang akan
// menghasilkan 404 saat VITE_API_BASE_URL diisi), fitur PPDB untuk sementara
// SELALU memakai mode lokal (storage) yang sudah berfungsi penuh.
//
// TODO(Phase 3): setelah modul backend `/ppdb` dibangun & kontrak data
// disamakan (migrasi schema), ubah `usePpdbApi` menjadi `hasApi`.
const usePpdbApi = false;

type JsonMap = Record<string, unknown>;
type AuthTokens = { accessToken: string; refreshToken: string };

export type PPDBStatistics = ReturnType<typeof getPPDBStatistics>;
export type ApiHealth = {
  mode: 'local' | 'api';
  online: boolean;
  apiReachable: boolean;
  message: string;
  checkedAt: string;
};

const ACCESS_TOKEN_KEY = 'ppdb_api_access_token';
const REFRESH_TOKEN_KEY = 'ppdb_api_refresh_token';
const ADMIN_NAME_KEY = 'ppdb_api_admin_name';

// KEAMANAN TOKEN PPDB (hasApi=true):
// - Ideal: token disimpan di httpOnly cookie oleh backend (Set-Cookie httpOnly,
//   SameSite=Lax/Strict, Secure). Frontend TIDAK simpan di localStorage (XSS).
//   Request memakai `credentials: 'include'` agar cookie otomatis terkirim.
// - Fallback minimal: simpan di memory (tidak persisten) saat backend aktif,
//   dan hapus dari localStorage. localStorage hanya untuk mode demo lokal.
let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

const getAccessToken = () => {
  if (usePpdbAdminApi) return memoryAccessToken || '';
  return localStorage.getItem(ACCESS_TOKEN_KEY) || '';
};
const getRefreshToken = () => {
  if (usePpdbAdminApi) return memoryRefreshToken || '';
  return localStorage.getItem(REFRESH_TOKEN_KEY) || '';
};

const saveTokens = (tokens: Partial<AuthTokens>) => {
  if (usePpdbAdminApi) {
    if (tokens.accessToken) memoryAccessToken = tokens.accessToken;
    if (tokens.refreshToken) memoryRefreshToken = tokens.refreshToken;
    // Migrasi: hapus legacy localStorage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }
  if (tokens.accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

const clearTokens = () => {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_NAME_KEY);
};

const buildHeaders = (init?: RequestInit, useJson = true): HeadersInit => {
  const headers: Record<string, string> = {
    ...(useJson ? { 'Content-Type': 'application/json' } : {}),
    ...((init?.headers as Record<string, string>) || {}),
  };

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const tryRefreshToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken || !usePpdbAdminApi) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/admin/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const payload = (await response.json()) as { accessToken?: string; refreshToken?: string };
    saveTokens({
      accessToken: payload.accessToken || '',
      refreshToken: payload.refreshToken || refreshToken,
    });
    return true;
  } catch {
    return false;
  }
};

const request = async <T>(path: string, init?: RequestInit, isRetry = false): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: buildHeaders(init, init?.body ? !(init.body instanceof FormData) : true),
  });

  if (response.status === 401 && !isRetry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request<T>(path, init, true);
    }
  }

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  if (response.status === 204) return {} as T;
  return (await response.json()) as T;
};

const apiLogin = async (username: string, pin: string): Promise<boolean> => {
  try {
    const payload = await request<{
      accessToken: string;
      refreshToken: string;
      profileName?: string;
    }>('/auth/admin/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ username, pin }),
      headers: { 'Content-Type': 'application/json' },
    });
    saveTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
    // ADMIN_NAME_KEY masih di localStorage karena non-sensitif (nama profil),
    // tapi saat hasApi idealnya server juga mengirim via cookie/endpoint /me.
    if (usePpdbAdminApi) {
      // Simpan minimal di memory-equivalent (tetap localStorage untuk nama profil saja)
      localStorage.setItem(ADMIN_NAME_KEY, payload.profileName || username);
    } else {
      localStorage.setItem(ADMIN_NAME_KEY, payload.profileName || username);
    }
    return true;
  } catch {
    // Login gagal — bersihkan sesi lama agar isAdminAuthenticated konsisten
    // (khususnya untuk isolasi tes: localStorage.clear() tidak menghapus memory)
    clearTokens();
    return false;
  }
};

export const ppdbService = {
  async submitApplication(
    data: Omit<PPDBApplication, 'id' | 'registrationNo' | 'submittedAt' | 'status'>
  ) {
    if (usePpdbApi) {
      return request<PPDBApplication>('/ppdb/applications', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
    return submitPPDBApplication(data);
  },

  async getApplications() {
    if (usePpdbApi) return request<PPDBApplication[]>('/ppdb/applications');
    return getPPDBApplications();
  },

  async getStatistics() {
    if (usePpdbApi) return request<PPDBStatistics>('/ppdb/statistics');
    return getPPDBStatistics();
  },

  async getApplicationById(id: string) {
    if (usePpdbApi) return request<PPDBApplication>(`/ppdb/applications/${id}`);
    return getPPDBApplicationById(id);
  },

  async getApplicationByRegNo(regNo: string) {
    if (usePpdbApi)
      return request<PPDBApplication | null>(
        `/ppdb/applications/registration/${encodeURIComponent(regNo)}`
      );
    return getPPDBApplicationByRegNo(regNo);
  },

  async updateStatus(
    id: string,
    status: PPDBApplication['status'],
    adminNotes?: string,
    verifiedBy?: string
  ) {
    if (usePpdbApi) {
      return request<PPDBApplication>(`/ppdb/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNotes, verifiedBy }),
      });
    }
    return await updateApplicationStatus(id, status, adminNotes, verifiedBy);
  },

  async updateDocumentStatus(
    id: string,
    documentKey: string,
    status: 'PENDING' | 'VALID' | 'INVALID'
  ) {
    if (usePpdbApi) {
      return request<PPDBApplication>(
        `/ppdb/applications/${id}/documents/${encodeURIComponent(documentKey)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );
    }
    return updateDocumentValidation(id, documentKey, status);
  },

  async deleteApplication(id: string) {
    if (usePpdbApi) {
      await request<JsonMap>(`/ppdb/applications/${id}`, { method: 'DELETE' });
      return true;
    }
    return deletePPDBApplication(id);
  },

  async getAuditLogs() {
    if (usePpdbApi) return request<PPDBAuditLog[]>('/ppdb/audit-logs');
    return getPPDBAuditLogs();
  },

  async exportBackupJson() {
    if (usePpdbApi) {
      const data = await request<JsonMap>('/ppdb/backup/export');
      return JSON.stringify(data, null, 2);
    }
    return exportPPDBBackupJson();
  },

  async importBackupJson(rawJson: string) {
    if (usePpdbApi) {
      return request<{ ok: boolean; message: string }>('/ppdb/backup/import', {
        method: 'POST',
        body: JSON.stringify({ payload: rawJson }),
      });
    }
    return importPPDBBackupJson(rawJson);
  },

  async getApiHealth(): Promise<ApiHealth> {
    const checkedAt = new Date().toISOString();
    if (!usePpdbApi) {
      return {
        mode: 'local',
        online: navigator.onLine,
        apiReachable: true,
        message: 'Mode lokal aktif (tanpa backend API).',
        checkedAt,
      };
    }

    if (!navigator.onLine) {
      return {
        mode: 'api',
        online: false,
        apiReachable: false,
        message: 'Perangkat sedang offline.',
        checkedAt,
      };
    }

    try {
      await request<{ status: string }>('/health', { method: 'GET' });
      return {
        mode: 'api',
        online: true,
        apiReachable: true,
        message: 'Backend API terhubung.',
        checkedAt,
      };
    } catch {
      return {
        mode: 'api',
        online: true,
        apiReachable: false,
        message: 'Backend API tidak merespons.',
        checkedAt,
      };
    }
  },

  adminLogin: (username: string, pin: string) => {
    // Saat backend aktif, autentikasi admin diverifikasi SERVER
    // (POST /api/auth/admin/login → JWT role ADMIN). PIN di client hanya
    // fallback untuk mode demo/lokal.
    if (usePpdbAdminApi) {
      return apiLogin(username, pin);
    }
    return Promise.resolve(adminLogin(username, pin));
  },

  adminLogout: () => {
    if (usePpdbAdminApi) {
      clearTokens();
      return Promise.resolve();
    }
    adminLogout();
    return Promise.resolve();
  },

  isAdminAuthenticated: () => {
    // Server-issued token adalah sumber kebenaran saat backend aktif.
    if (usePpdbAdminApi) return Boolean(getAccessToken());
    return isAdminAuthenticated();
  },

  getAdminProfileName: () => {
    if (usePpdbAdminApi) return localStorage.getItem(ADMIN_NAME_KEY) || 'Admin API';
    return getAdminProfileName();
  },

  getNotifications: () => {
    return Promise.resolve(getPPDBNotifications());
  },

  markNotificationAsRead: (id: string) => {
    markNotificationAsRead(id);
    return Promise.resolve();
  },

  getUnreadCount: () => {
    return Promise.resolve(getUnreadNotificationCount());
  },

  // Catatan: konfigurasi email notifikasi admin (getAdminSettings/updateAdminSettings)
  // adalah konsep lokal. Konfigurasi PPDB (open/close, kuota, tahun) authoritative
  // di server melalui endpoint /api/ppdb/config (lihat backend modules/ppdb).
  getAdminSettings: () => {
    return Promise.resolve(getAdminSettings());
  },

  updateAdminSettings: (settings: { email: string }) => {
    updateAdminSettings(settings);
    return Promise.resolve();
  },
};
