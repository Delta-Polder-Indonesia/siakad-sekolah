/**
 * Route path definitions for the entire application.
 * All path strings are centralized here for consistency.
 * Use `pageToPath(page, role)` to convert old page IDs to new route paths.
 */

// ─── Teacher Routes ──────────────────────────────────────────────────────
export const ROUTES = {
  LOGIN: '/login',
  NOT_FOUND: '/404',

  // Teacher
  GURU: '/guru',
  GURU_DASHBOARD: '/guru/dashboard',
  GURU_ABSENSI: '/guru/absensi',
  GURU_LAPORAN: '/guru/laporan',
  GURU_ATUR_PENGUMUMAN: '/guru/atur-pengumuman',
  GURU_ATUR_TUGAS: '/guru/atur-tugas',
  GURU_KOTAK_SURAT: '/guru/kotak-surat',
  GURU_INPUT_RAPOT: '/guru/input-rapot',
  GURU_JURNAL_MENGAJAR: '/guru/jurnal-mengajar',
  GURU_REKAP_NILAI: '/guru/rekap-nilai',
  GURU_KELOLA_SISWA: '/guru/kelola-siswa',
  GURU_WALI_KELAS: '/guru/wali-kelas',
  GURU_BK: '/guru/bk',
  GURU_EKSKUL: '/guru/ekskul',
  GURU_PROFIL: '/guru/profil',
  GURU_PENGATURAN: '/guru/pengaturan',

  // Student
  SISWA: '/siswa',
  SISWA_DASHBOARD: '/siswa/dashboard',
  SISWA_ROSTER: '/siswa/roster',
  SISWA_RIWAYAT_ABSENSI: '/siswa/riwayat-absensi',
  SISWA_KANTONG_TUGAS: '/siswa/kantong-tugas',
  SISWA_KIRIM_SURAT: '/siswa/kirim-surat',
  SISWA_RAPOT: '/siswa/rapot',
  SISWA_TAGIHAN: '/siswa/tagihan',
  SISWA_BK: '/siswa/catatan-bk',
  SISWA_EKSKUL: '/siswa/ekskul',
  SISWA_PROFIL: '/siswa/profil',
  SISWA_PENGATURAN: '/siswa/pengaturan',

  // Parent
  ORTU: '/ortu',
  ORTU_DASHBOARD: '/ortu/dashboard',
  ORTU_RAPOT: '/ortu/rapot',
  ORTU_TAGIHAN: '/ortu/tagihan',
  ORTU_PROFIL: '/ortu/profil',
  ORTU_PENGATURAN: '/ortu/pengaturan',
  ORTU_RIWAYAT_ABSENSI: '/ortu/riwayat-absensi',
  ORTU_STATUS_SURAT_IZIN: '/ortu/status-surat-izin',
  ORTU_BK: '/ortu/catatan-bk',

  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EKSKUL: '/admin/ekskul',

  // Guest – Main
  TAMU: '/tamu',
  TAMU_BERANDA: '/tamu',
  TAMU_TENTANG_SEKOLAH: '/tamu/tentang-sekolah',
  TAMU_VISI_MISI: '/tamu/visi-misi',
  TAMU_STRUKTUR_ORGANISASI: '/tamu/struktur-organisasi',
  TAMU_FASILITAS: '/tamu/fasilitas',
  TAMU_GALERI: '/tamu/galeri',
  TAMU_PPDB: '/tamu/ppdb',
  TAMU_EKSTRAKURIKULER: '/tamu/ekstrakurikuler',
  TAMU_PRESTASI: '/tamu/prestasi',
  TAMU_PROGRAM_UNGGULAN: '/tamu/program-unggulan',
  TAMU_BERITA: '/tamu/berita',
  TAMU_FAQ: '/tamu/faq',
  TAMU_BUKU_TAMU: '/tamu/buku-tamu',
  TAMU_DAFTAR_TAMU: '/tamu/daftar-tamu',
  TAMU_STATISTIK_TAMU: '/tamu/statistik-tamu',
  TAMU_PROFILE: '/tamu/profile',

  // Guest – Halaman (school website pages)
  TAMU_PROFIL_SEKOLAH: '/tamu/profil-sekolah',
  TAMU_PROGRAM_SEKOLAH: '/tamu/program-sekolah',
  TAMU_PROGRAM_KEAHLIAN: '/tamu/program-keahlian',
  TAMU_SARANA_PRASARANA: '/tamu/sarana-prasarana',
  TAMU_KEGIATAN_SEKOLAH: '/tamu/kegiatan-sekolah',
  TAMU_KONTAK: '/tamu/kontak',

  // Guest – Detail pages
  TAMU_BERITA_DETAIL: '/tamu/berita/',
  TAMU_KEGIATAN_DETAIL: '/tamu/kegiatan/',
  TAMU_PROGRAM_DETAIL: '/tamu/program/',
  TAMU_JURUSAN_DETAIL: '/tamu/jurusan/',
  TAMU_FASILITAS_DETAIL: '/tamu/fasilitas/',
  TAMU_EKSKUL_DETAIL: '/tamu/ekskul/',
  TAMU_PENDIDIKAN_DETAIL: '/tamu/pendidikan/',
  TAMU_SEKOLAH_BERDAMPAK: '/tamu/sekolah-berdampak',
  TAMU_RISET_DETAIL: '/tamu/riset/',

  // ID-based legacy routes (redirects to tamu/*)
  TAMU_ID_RISET: '/id/riset/',
  TAMU_ID_SDGS: '/id/sdgs/',
  TAMU_ID_SEKOLAH_BERDAMPAK: '/id/sekolah-berdampak',
  TAMU_ID_DIKTISAINTEK: '/id/diktisaintek-berdampak',
  TAMU_ID_SDGS_SEKOLAH: '/id/sdgs-sekolah',

  // Shared (cross-role)
  PENGUMUMAN: '/pengumuman',
  AGENDA: '/agenda',
  PESAN: '/pesan',
  DIREKTORI_GURU: '/direktori-guru',
} as const;

// ─── Mapping old page IDs to new route paths ───────────────────────────
// Teacher pages
const TEACHER_PAGE_ROUTES: Record<string, string> = {
  dashboard: ROUTES.GURU_DASHBOARD,
  attendance: ROUTES.GURU_ABSENSI,
  report: ROUTES.GURU_LAPORAN,
  'announcement-settings': ROUTES.GURU_ATUR_PENGUMUMAN,
  'assignment-settings': ROUTES.GURU_ATUR_TUGAS,
  'letters-teacher': ROUTES.GURU_KOTAK_SURAT,
  'rapot-input': ROUTES.GURU_INPUT_RAPOT,
  'jurnal-mengajar': ROUTES.GURU_JURNAL_MENGAJAR,
  'rekap-nilai': ROUTES.GURU_REKAP_NILAI,
  'student-management': ROUTES.GURU_KELOLA_SISWA,
  'wali-kelas': ROUTES.GURU_WALI_KELAS,
  bk: ROUTES.GURU_BK,
  'ekskul-management': ROUTES.GURU_EKSKUL,
  profile: ROUTES.GURU_PROFIL,
  settings: ROUTES.GURU_PENGATURAN,
};

// Student pages
const STUDENT_PAGE_ROUTES: Record<string, string> = {
  dashboard: ROUTES.SISWA_DASHBOARD,
  roster: ROUTES.SISWA_ROSTER,
  history: ROUTES.SISWA_RIWAYAT_ABSENSI,
  tasks: ROUTES.SISWA_KANTONG_TUGAS,
  'letters-student': ROUTES.SISWA_KIRIM_SURAT,
  rapot: ROUTES.SISWA_RAPOT,
  billing: ROUTES.SISWA_TAGIHAN,
  'bk-record': ROUTES.SISWA_BK,
  ekskul: ROUTES.SISWA_EKSKUL,
  profile: ROUTES.SISWA_PROFIL,
  settings: ROUTES.SISWA_PENGATURAN,
};

// Parent pages
const PARENT_PAGE_ROUTES: Record<string, string> = {
  dashboard: ROUTES.ORTU_DASHBOARD,
  rapot: ROUTES.ORTU_RAPOT,
  billing: ROUTES.ORTU_TAGIHAN,
  profile: ROUTES.ORTU_PROFIL,
  settings: ROUTES.ORTU_PENGATURAN,
  'attendance-history': ROUTES.ORTU_RIWAYAT_ABSENSI,
  'letters-status': ROUTES.ORTU_STATUS_SURAT_IZIN,
  'bk-record': ROUTES.ORTU_BK,
};

// Admin pages
const ADMIN_PAGE_ROUTES: Record<string, string> = {
  'admin-dashboard': ROUTES.ADMIN_DASHBOARD,
  'ekskul-management': ROUTES.ADMIN_EKSKUL,
};

// Guest pages
const GUEST_PAGE_ROUTES: Record<string, string> = {
  dashboard: ROUTES.TAMU_BERANDA,
  beranda: ROUTES.TAMU_BERANDA,
  'tentang-sekolah': ROUTES.TAMU_TENTANG_SEKOLAH,
  'visi-misi': ROUTES.TAMU_VISI_MISI,
  'struktur-organisasi': ROUTES.TAMU_STRUKTUR_ORGANISASI,
  fasilitas: ROUTES.TAMU_FASILITAS,
  galeri: ROUTES.TAMU_GALERI,
  ppdb: ROUTES.TAMU_PPDB,
  ekstrakurikuler: ROUTES.TAMU_EKSTRAKURIKULER,
  prestasi: ROUTES.TAMU_PRESTASI,
  'program-unggulan': ROUTES.TAMU_PROGRAM_UNGGULAN,
  berita: ROUTES.TAMU_BERITA,
  faq: ROUTES.TAMU_FAQ,
  'buku-tamu': ROUTES.TAMU_BUKU_TAMU,
  'daftar-tamu': ROUTES.TAMU_DAFTAR_TAMU,
  'statistik-tamu': ROUTES.TAMU_STATISTIK_TAMU,
  profile: ROUTES.TAMU_PROFILE,
  // Halaman pages
  Profil: ROUTES.TAMU_PROFIL_SEKOLAH,
  'Program Sekolah': ROUTES.TAMU_PROGRAM_SEKOLAH,
  'Program Keahlian': ROUTES.TAMU_PROGRAM_KEAHLIAN,
  'Sarana Prasarana': ROUTES.TAMU_SARANA_PRASARANA,
  'Kegiatan Sekolah': ROUTES.TAMU_KEGIATAN_SEKOLAH,
  Berita: ROUTES.TAMU_BERITA,
  Kontak: ROUTES.TAMU_KONTAK,
};

// Shared pages (cross-role)
const SHARED_PAGE_ROUTES: Record<string, string> = {
  'school-announcements': ROUTES.PENGUMUMAN,
  'personal-messages': ROUTES.PESAN,
  'teacher-announcements': ROUTES.DIREKTORI_GURU,
  'academic-agenda': ROUTES.AGENDA,
};

// Detail pages mapping
const DETAIL_PAGE_ROUTES: Record<string, string> = {
  // Berita detail
  'berita-1': `${ROUTES.TAMU_BERITA_DETAIL}berita-1`,
  'berita-2': `${ROUTES.TAMU_BERITA_DETAIL}berita-2`,
  'berita-3': `${ROUTES.TAMU_BERITA_DETAIL}berita-3`,
  'berita-4': `${ROUTES.TAMU_BERITA_DETAIL}berita-4`,
  // Kegiatan detail
  'kegiatan-1': `${ROUTES.TAMU_KEGIATAN_DETAIL}kegiatan-1`,
  'kegiatan-2': `${ROUTES.TAMU_KEGIATAN_DETAIL}kegiatan-2`,
  'kegiatan-3': `${ROUTES.TAMU_KEGIATAN_DETAIL}kegiatan-3`,
  'kegiatan-4': `${ROUTES.TAMU_KEGIATAN_DETAIL}kegiatan-4`,
  'kegiatan-5': `${ROUTES.TAMU_KEGIATAN_DETAIL}kegiatan-5`,
  // Program detail
  'program-1': `${ROUTES.TAMU_PROGRAM_DETAIL}program-1`,
  'program-2': `${ROUTES.TAMU_PROGRAM_DETAIL}program-2`,
  'program-3': `${ROUTES.TAMU_PROGRAM_DETAIL}program-3`,
  'program-4': `${ROUTES.TAMU_PROGRAM_DETAIL}program-4`,
  'program-5': `${ROUTES.TAMU_PROGRAM_DETAIL}program-5`,
  // Jurusan detail
  'reg-01': `${ROUTES.TAMU_JURUSAN_DETAIL}reg-01`,
  'reg-02': `${ROUTES.TAMU_JURUSAN_DETAIL}reg-02`,
  'reg-03': `${ROUTES.TAMU_JURUSAN_DETAIL}reg-03`,
  'reg-04': `${ROUTES.TAMU_JURUSAN_DETAIL}reg-04`,
  'reg-05': `${ROUTES.TAMU_JURUSAN_DETAIL}reg-05`,
  'reg-06': `${ROUTES.TAMU_JURUSAN_DETAIL}reg-06`,
  'reg-07': `${ROUTES.TAMU_JURUSAN_DETAIL}reg-07`,
  // Facility detail
  'facility-1': `${ROUTES.TAMU_FASILITAS_DETAIL}facility-1`,
  'facility-2': `${ROUTES.TAMU_FASILITAS_DETAIL}facility-2`,
  'facility-3': `${ROUTES.TAMU_FASILITAS_DETAIL}facility-3`,
  'facility-4': `${ROUTES.TAMU_FASILITAS_DETAIL}facility-4`,
  'facility-5': `${ROUTES.TAMU_FASILITAS_DETAIL}facility-5`,
  'facility-6': `${ROUTES.TAMU_FASILITAS_DETAIL}facility-6`,
  'facility-7': `${ROUTES.TAMU_FASILITAS_DETAIL}facility-7`,
  'facility-8': `${ROUTES.TAMU_FASILITAS_DETAIL}facility-8`,
  // Ekskul detail
  'ekskul-1': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-1`,
  'ekskul-2': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-2`,
  'ekskul-3': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-3`,
  'ekskul-4': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-4`,
  'ekskul-5': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-5`,
  'ekskul-6': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-6`,
  'ekskul-7': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-7`,
  'ekskul-8': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-8`,
  'ekskul-9': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-9`,
  'ekskul-10': `${ROUTES.TAMU_EKSKUL_DETAIL}ekskul-10`,
  // Pendidikan detail
  mipa: `${ROUTES.TAMU_PENDIDIKAN_DETAIL}mipa`,
  ips: `${ROUTES.TAMU_PENDIDIKAN_DETAIL}ips`,
  bahasa: `${ROUTES.TAMU_PENDIDIKAN_DETAIL}bahasa`,
  ekskul: `${ROUTES.TAMU_PENDIDIKAN_DETAIL}ekskul`,
  olimpiade: `${ROUTES.TAMU_PENDIDIKAN_DETAIL}olimpiade`,
  ptn: `${ROUTES.TAMU_PENDIDIKAN_DETAIL}ptn`,
  // Research detail
  'riset-air-bersih': `${ROUTES.TAMU_RISET_DETAIL}riset-air-bersih`,
  'riset-infrastruktur': `${ROUTES.TAMU_RISET_DETAIL}riset-infrastruktur`,
  'riset-digitalisasi': `${ROUTES.TAMU_RISET_DETAIL}riset-digitalisasi`,
};

/**
 * Convert a page ID + role to the correct route path.
 * Falls back to the page ID if no mapping is found (for backward compat).
 */
export function pageToPath(pageId: string, role?: string): string {
  // Check detail pages first
  if (DETAIL_PAGE_ROUTES[pageId]) {
    return DETAIL_PAGE_ROUTES[pageId];
  }

  // Check shared pages
  if (SHARED_PAGE_ROUTES[pageId]) {
    return SHARED_PAGE_ROUTES[pageId];
  }

  // Check role-specific pages
  if (role) {
    let roleMap: Record<string, string> | undefined;
    switch (role) {
      case 'teacher':
        roleMap = TEACHER_PAGE_ROUTES;
        break;
      case 'student':
        roleMap = STUDENT_PAGE_ROUTES;
        break;
      case 'parent':
        roleMap = PARENT_PAGE_ROUTES;
        break;
      case 'guest':
        roleMap = GUEST_PAGE_ROUTES;
        break;
      case 'admin':
        roleMap = ADMIN_PAGE_ROUTES;
        break;
    }
    if (roleMap && roleMap[pageId]) {
      return roleMap[pageId];
    }
  }

  // Default fallback
  return pageId;
}

/**
 * Get the default landing page path for a given role.
 */
export function getDefaultPath(role?: string): string {
  switch (role) {
    case 'teacher':
      return ROUTES.GURU_DASHBOARD;
    case 'student':
      return ROUTES.SISWA_DASHBOARD;
    case 'parent':
      return ROUTES.ORTU_DASHBOARD;
    case 'admin':
      return ROUTES.ADMIN_DASHBOARD;
    case 'guest':
      return ROUTES.TAMU;
    default:
      return ROUTES.LOGIN;
  }
}
