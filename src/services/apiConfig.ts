// Konfigurasi API bersama untuk seluruh service frontend.
// Backend hanya dianggap aktif kalau VITE_API_BASE_URL diisi secara eksplisit.
// Prefer `import.meta.env` (Vite), but fall back to `process.env` for tests
// running in Node (Vitest with `--environment=node`).
const RAW_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) ||
  '';

export const API_BASE = (RAW_BASE || 'http://localhost:4000/api').trim().replace(/\/$/, '');

export const hasApi = Boolean(String(RAW_BASE || '').trim());
