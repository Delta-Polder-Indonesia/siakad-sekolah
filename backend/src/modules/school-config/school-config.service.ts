// Semua logika database untuk SchoolConfig ada di sini.
// Controller hanya memanggil fungsi dari sini.

import { prisma } from '../../lib/prisma.js';
import { z } from 'zod';
import { schoolConfigSchema } from '../../utils/validation.js';

export type SchoolConfigInput = z.infer<typeof schoolConfigSchema>;

export async function getSchoolConfig() {
  // Ambil config pertama — sistem ini hanya untuk 1 sekolah per instance
  const config = await prisma.schoolConfig.findFirst();
  return config;
}

/**
 * Versi publik (GET /api/school-config) — field rahasia disamarkan.
 */
export function toPublicConfig(config: NonNullable<Awaited<ReturnType<typeof getSchoolConfig>>>) {
  const {
    guestAccessCode: _guestAccessCode,
    ppdbOpenDate,
    ppdbCloseDate,
    ...publicConfig
  } = config;

  return {
    ...publicConfig,
    ppdbOpenDate: ppdbOpenDate?.toISOString() ?? null,
    ppdbCloseDate: ppdbCloseDate?.toISOString() ?? null,
  };
}

export async function upsertSchoolConfig(data: SchoolConfigInput) {
  const existing = await prisma.schoolConfig.findFirst();

  if (existing) {
    // Update jika sudah ada
    return prisma.schoolConfig.update({
      where: { id: existing.id },
      data,
    });
  }

  // Buat baru jika belum ada
  return prisma.schoolConfig.create({ data });
}