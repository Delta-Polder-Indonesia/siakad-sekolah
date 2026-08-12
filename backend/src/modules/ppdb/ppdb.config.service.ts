// Service untuk konfigurasi PPDB (blueprint BUG-05).
// Konfigurasi PPDB disimpan authoritative di server (kolom ppdb* pada
// SchoolConfig), sehingga otorisasi admin diterapkan di server — bukan
// sepenuhnya di client (PIN di bundle).

import { prisma } from '../../lib/prisma.js';

export interface PpdbConfigDTO {
  ppdbYear: string;
  ppdbIsOpen: boolean;
  ppdbRegistrationUrl?: string | null;
  ppdbQuota: number;
  ppdbOpenDate?: string | null;
  ppdbCloseDate?: string | null;
}

export interface PpdbConfigInput {
  ppdbYear?: string;
  ppdbIsOpen?: boolean;
  ppdbRegistrationUrl?: string | null;
  ppdbQuota?: number;
  ppdbOpenDate?: string | null;
  ppdbCloseDate?: string | null;
}

// Ambil konfigurasi PPDB dari SchoolConfig.
export async function getPpdbConfig(): Promise<PpdbConfigDTO> {
  const config = await prisma.schoolConfig.findFirst();
  if (!config) {
    return {
      ppdbYear: '2026',
      ppdbIsOpen: false,
      ppdbRegistrationUrl: null,
      ppdbQuota: 0,
      ppdbOpenDate: null,
      ppdbCloseDate: null,
    };
  }
  return {
    ppdbYear: config.ppdbYear,
    ppdbIsOpen: config.ppdbIsOpen,
    ppdbRegistrationUrl: config.ppdbRegistrationUrl,
    ppdbQuota: config.ppdbQuota,
    ppdbOpenDate: config.ppdbOpenDate ? config.ppdbOpenDate.toISOString() : null,
    ppdbCloseDate: config.ppdbCloseDate ? config.ppdbCloseDate.toISOString() : null,
  };
}

// Perbarui konfigurasi PPDB.
export async function updatePpdbConfig(input: PpdbConfigInput): Promise<PpdbConfigDTO> {
  const existing = await prisma.schoolConfig.findFirst();
  const data: Record<string, unknown> = {};
  if (input.ppdbYear !== undefined) data.ppdbYear = input.ppdbYear;
  if (input.ppdbIsOpen !== undefined) data.ppdbIsOpen = input.ppdbIsOpen;
  if (input.ppdbRegistrationUrl !== undefined) data.ppdbRegistrationUrl = input.ppdbRegistrationUrl;
  if (input.ppdbQuota !== undefined) data.ppdbQuota = Math.max(0, Math.floor(input.ppdbQuota));
  if (input.ppdbOpenDate !== undefined) data.ppdbOpenDate = input.ppdbOpenDate ? new Date(input.ppdbOpenDate) : null;
  if (input.ppdbCloseDate !== undefined) data.ppdbCloseDate = input.ppdbCloseDate ? new Date(input.ppdbCloseDate) : null;

  let config;
  if (existing) {
    config = await prisma.schoolConfig.update({ where: { id: existing.id }, data });
  } else {
    config = await prisma.schoolConfig.create({
      data: {
        name: 'Sekolah',
        shortName: 'Sekolah',
        type: 'SMA',
        ...data,
      },
    });
  }

  return {
    ppdbYear: config.ppdbYear,
    ppdbIsOpen: config.ppdbIsOpen,
    ppdbRegistrationUrl: config.ppdbRegistrationUrl,
    ppdbQuota: config.ppdbQuota,
    ppdbOpenDate: config.ppdbOpenDate ? config.ppdbOpenDate.toISOString() : null,
    ppdbCloseDate: config.ppdbCloseDate ? config.ppdbCloseDate.toISOString() : null,
  };
}
