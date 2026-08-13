// Fetch terpusat: Authorization + credentials, dipakai semua service akademik.
import { API_BASE } from './apiConfig';
import { getPortalAccessToken } from './authApi';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getPortalAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init?.headers as Record<string, string>) || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });
  if (!res.ok) {
    throw new Error(`API request failed (${res.status})`);
  }
  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}
