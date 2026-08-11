/**
 * ============================================================================
 * KONFIGURASI IDENTITAS SEKOLAH — SUMBER TUNGGAL (template universal)
 * ============================================================================
 *
 * Tujuan: pemilik sekolah bisa mengganti identitas (nama, logo, kontak,
 * jenjang, tahun ajaran) TANPA menyentuh kode — lewat Panel Setup Sekolah
 * di menu admin. Perubahan tersimpan di localStorage dan langsung berlaku
 * di seluruh aplikasi (Sidebar, Footer, Login, judul browser, dll).
 *
 * Alur:
 *   DEFAULT_SCHOOL_IDENTITY  → nilai bawaan template (SMA Negeri 1 Medan)
 *   getSchoolIdentity()      → gabungan default + override dari localStorage
 *   updateSchoolIdentity()   → simpan override + beri tahu semua komponen
 *   resetSchoolIdentity()    → kembalikan ke bawaan template
 *
 * Catatan penting untuk penjualan template:
 *   - Setelan di sini hanya identitas/branding. Isi KONTEN (berita, sejarah,
 *     visi-misi, struktur organisasi, dll) tetap diubah per-sekolah di file
 *     data masing-masing (lihat README template).
 *   - Perubahan JENJANG penuh (SD→SMP→SMA→SMK) yang mengubah struktur konten
 *     membutuhkan build ulang (ubah `jenjang` di dataSekolah.ts). Setelan
 *     jenjang di sini dipakai untuk identitas & label dinamis.
 * ============================================================================
 */
import { notifyStoreUpdated } from '../data/store/core/db';

export type JenjangSekolah = 'SD' | 'SMP' | 'SMA' | 'SMK';

export interface SchoolIdentity {
  /** Nama resmi sekolah, contoh: "SMA Negeri 1 Medan" */
  namaSekolah: string;
  /** Nama singkatan/umum, contoh: "SMAN 1 Medan" */
  singkatan: string;
  jenjang: JenjangSekolah;
  /** Tahun ajaran berjalan, contoh: "2025/2026" */
  tahunAjaran: string;
  npsn: string;
  alamat: string;
  telepon: string;
  /** Domain email sekolah, contoh: "sman1medan.sch.id" (email = info@domain) */
  emailDomain: string;
  /**
   * Logo sekolah: path aset default (mis. "/images/logo/logo-sekolah.svg")
   * atau dataURL hasil upload lewat Panel Setup Sekolah.
   */
  logo: string;
}

export const SCHOOL_IDENTITY_KEY = 'siakad-school-identity';

/** Nilai bawaan template — ganti di sini untuk "default" versi Anda. */
export const DEFAULT_SCHOOL_IDENTITY: SchoolIdentity = {
  namaSekolah: 'SMA Negeri 1 Medan',
  singkatan: 'SMAN 1 Medan',
  jenjang: 'SMA',
  tahunAjaran: '2025/2026',
  npsn: '10210881',
  alamat: 'Jl. Cik Ditiro No. 1, Madras Hulu, Kec. Medan Polonia, Kota Medan, Sumatera Utara 20152',
  telepon: '(061) 4510803',
  emailDomain: 'sman1medan.sch.id',
  logo: `${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`,
};

const LOGO_FALLBACK = `${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`;

function sanitize(override: Partial<SchoolIdentity>): Partial<SchoolIdentity> {
  const out: Partial<SchoolIdentity> = {};
  if (typeof override.namaSekolah === 'string' && override.namaSekolah.trim())
    out.namaSekolah = override.namaSekolah.trim();
  if (typeof override.singkatan === 'string' && override.singkatan.trim())
    out.singkatan = override.singkatan.trim();
  if (override.jenjang === 'SD' || override.jenjang === 'SMP' || override.jenjang === 'SMA' || override.jenjang === 'SMK')
    out.jenjang = override.jenjang;
  if (typeof override.tahunAjaran === 'string' && override.tahunAjaran.trim())
    out.tahunAjaran = override.tahunAjaran.trim();
  if (typeof override.npsn === 'string' && override.npsn.trim())
    out.npsn = override.npsn.trim();
  if (typeof override.alamat === 'string' && override.alamat.trim())
    out.alamat = override.alamat.trim();
  if (typeof override.telepon === 'string' && override.telepon.trim())
    out.telepon = override.telepon.trim();
  if (typeof override.emailDomain === 'string' && override.emailDomain.trim())
    out.emailDomain = override.emailDomain.trim();
  if (typeof override.logo === 'string' && override.logo.trim())
    out.logo = override.logo.trim();
  return out;
}

/** Baca identitas aktif = default + override localStorage (aman dari data rusak). */
export function getSchoolIdentity(): SchoolIdentity {
  const fallback = DEFAULT_SCHOOL_IDENTITY;
  try {
    const raw = localStorage.getItem(SCHOOL_IDENTITY_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SchoolIdentity>;
    return { ...fallback, ...sanitize(parsed) };
  } catch {
    return fallback;
  }
}

/** Simpan override identitas (sebagian atau seluruh field) + beri tahu komponen. */
export function updateSchoolIdentity(patch: Partial<SchoolIdentity>): SchoolIdentity {
  const current = getSchoolIdentity();
  const merged = { ...current, ...sanitize(patch) };
  try {
    localStorage.setItem(SCHOOL_IDENTITY_KEY, JSON.stringify(merged));
  } catch {
    // Kuota penuh (mis. logo terlalu besar) — biarkan callback menangani error.
    throw new Error('Gagal menyimpan: penyimpanan browser penuh. Coba logo yang lebih kecil.');
  }
  notifyStoreUpdated();
  return merged;
}

/** Kembalikan identitas ke bawaan template. */
export function resetSchoolIdentity(): SchoolIdentity {
  try {
    localStorage.removeItem(SCHOOL_IDENTITY_KEY);
  } catch {
    // abaikan
  }
  notifyStoreUpdated();
  return DEFAULT_SCHOOL_IDENTITY;
}

/** Email instansi: info@{domain} — dipakai di kontak & footer. */
export function getSchoolEmail(identity: SchoolIdentity): string {
  return `info@${identity.emailDomain}`;
}

/** Nama sekolah huruf kapital — dipakai di judul/sidebar/footer. */
export function getSchoolNameUppercase(identity: SchoolIdentity): string {
  return identity.namaSekolah.toUpperCase();
}

/** ===== BACKWARD COMPAT: konfigurasi kontak lama =====
 * Sebelumnya `src/config/school.ts` mengekspor `schoolConfig` statis.
 * Dipertahankan agar pemakai lama (mis. FeedbackForm) tetap berfungsi.
 * Untuk identitas DINAMIS (bisa diubah dari Panel Setup Sekolah), gunakan
 * getSchoolIdentity() / useSchoolIdentity().
 */
export const schoolConfig = {
  name: 'Portal Sekolah',
  contact: {
    phone: '+62 XXX XXX XXXX',
    email: 'info@sekolah.com',
    address: 'Jl. Pendidikan No. 123',
  },
  hours: {
    weekdays: { open: '07:00', close: '16:00', label: 'Senin - Jumat' },
    saturday: { open: '07:00', close: '12:00', label: 'Sabtu' },
    sunday: { closed: true, label: 'Minggu' },
  },
  feedback: {
    processingTime: '1-2 hari kerja',
    urgentPriorityLabel: 'Tinggi',
  },
} as const;

export { LOGO_FALLBACK };
