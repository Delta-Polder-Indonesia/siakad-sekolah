import { z } from 'zod';

/**
 * Sanitization utilities untuk mencegah injection/XSS dari user input.
 */

/**
 * Trim dan hapus karakter kontrol dari string
 */
export function sanitizeString(value: string): string {
  return value
    .replace(/[\p{Cc}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Hapus tag HTML/script berbahaya dari string
 */
export function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Sanitize single value berdasarkan tipe
 */
export function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return stripHtml(sanitizeString(value));
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
}

/**
 * Sanitize seluruh object secara rekursif (in-place copy)
 */
export function sanitizeObject<T extends Record<string, unknown>>(input: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    result[key] = sanitizeValue(value);
  }
  return result as T;
}

/**
 * Validasi bahwa tidak ada tag HTML/script dalam string
 */
export function hasHtmlContent(value: string): boolean {
  return /<[^>]*>|javascript:/i.test(value);
}

/**
 * Zod refine untuk menolak input yang mengandung tag HTML/script
 */
export const noHtml = (message: string = 'Konten mengandung tag HTML yang tidak diizinkan') =>
  (value: string) => ({
    message,
    valid: !hasHtmlContent(value),
  });

/**
 * Schema pembantu: string aman (tanpa HTML, sudah di-trim)
 */
export const safeString = (min: number = 1, max: number = 255) =>
  z.string()
    .min(min)
    .max(max)
    .refine((v) => !hasHtmlContent(v), 'Konten mengandung tag HTML yang tidak diizinkan')
    .transform((v) => sanitizeString(v));
