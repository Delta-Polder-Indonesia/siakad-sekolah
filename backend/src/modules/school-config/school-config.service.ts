// Semua logika database untuk SchoolConfig ada di sini.
// Controller hanya memanggil fungsi dari sini.

import { prisma } from '../../lib/prisma.js';

export async function getSchoolConfig() {
  // Ambil config pertama — sistem ini hanya untuk 1 sekolah per instance
  const config = await prisma.schoolConfig.findFirst();
  return config;
}

export async function upsertSchoolConfig(data: {
  name:           string;
  shortName:      string;
  type:           string;
  npsn?:          string;
  founded?:       number;
  accreditation?: string;
  phone?:         string;
  email?:         string;
  website?:       string;
  addressStreet?:   string;
  addressDistrict?: string;
  addressCity?:     string;
  addressProvince?: string;
  addressZip?:      string;
  mapsEmbedUrl?:  string;
  mapsDirectUrl?: string;
  logoUrl?:       string;
  profilePdfUrl?: string;
  weekdayLabel?:  string;
  weekdayHours?:  string;
  weekendLabel?:  string;
  weekendHours?:  string;
  statStudents?:      string;
  statTeachers?:      string;
  statAchievements?:  string;
  statAccreditation?: string;
  ppdbYear?:      string;
  ppdbIsOpen?:    boolean;
  ppdbQuota?:     number;
  featureContactForm?:      boolean;
  featurePpdb?:             boolean;
  featureLibrary?:          boolean;
  featureOnlineAssignment?: boolean;
  featureReportCard?:       boolean;
  featureBilling?:          boolean;
  featureElearning?:        boolean;
}) {
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