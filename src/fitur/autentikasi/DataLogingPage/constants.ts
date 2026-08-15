import { namaSekolahUppercase } from '../../halaman/components/Profile/dataSekolah';

export const LOGO_SMP = `${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`;

// ── ✨ Ilustrasi foto di samping panel login (foto siswa — menggantikan stok cyber-security lama) ──
export const LOGIN_ILLUSTRATION = `${import.meta.env.BASE_URL}images/Dashboard/login-illustration.jpg`;

// WebP sebagai format modern (lebih kecil), JPG sebagai fallback.
export const LOGIN_ILLUSTRATION_WEBP = `${import.meta.env.BASE_URL}images/Dashboard/login-illustration.webp`;

// ── ✨ BARU: Pesan keamanan yang ditampilkan bersama ilustrasi ──
export const SECURITY_MESSAGE = {
  line1: 'Harap Jaga Password Anda.',
  line2: 'Demi Keamanan Data Anda',
  line3: 'Segera Ganti Password',
} as const;

/** First slide stays put so LCP is the hero image, not a later caption. */
export const SLIDESHOW_FIRST_DELAY_MS = 20_000;
export const SLIDESHOW_INTERVAL_MS = 8000;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 30_000;

export const SCHOOL_CONFIG = {
  name: namaSekolahUppercase,
  systemTitle: 'Sistem Informasi Akademik',
} as const;

export const Z_INDEX = {
  overlay: 40,
  loginIllustration: 55, // ✨ BARU: di bawah panel, di atas overlay
  loginPanel: 60,
  ppdbModal: 150,
  perpustakaanModal: 200,
} as const;

// Gunakan format optimal per gambar: WebP bila lebih kecil (Konoha-1,2), JPEG bila lebih kecil (3,5,6)
// Semua gambar telah dioptimasi dengan ImageMagick (strip + quality 80) untuk PSI performance
export const BACKGROUND_IMAGES = [
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-1.webp`,
    fallback: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-1.jpg`,
    srcSet: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-1-768.webp 768w, ${import.meta.env.BASE_URL}images/Dashboard/Konoha-1-1280.webp 1280w, ${import.meta.env.BASE_URL}images/Dashboard/Konoha-1.webp 1350w`,
    caption: 'Fasilitas Pembelajaran Modern',
    description:
      'Ruang kelas berteknologi tinggi yang mendukung proses belajar mengajar untuk mencetak generasi unggul.',
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-2.webp`,
    fallback: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-2.jpg`,
    srcSet: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-2-768.webp 768w, ${import.meta.env.BASE_URL}images/Dashboard/Konoha-2.webp 1350w`,
    caption: 'Kegiatan Ekstrakurikuler',
    description:
      'Beragam kegiatan pengembangan diri untuk menggali potensi, bakat, dan minat setiap siswa.',
  },
  {
    // Konoha-3: JPG 24KB vs WebP 62KB — JPG wins 61% smaller
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-3.jpg`,
    fallback: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-3.jpg`,
    caption: 'Prestasi Siswa Berprestasi',
    description:
      'Meraih prestasi gemilang di tingkat regional, nasional, hingga internasional setiap tahunnya.',
  },
  {
    // Konoha-5: JPG 62KB vs WebP 83KB — JPG wins 25% smaller
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-5.jpg`,
    fallback: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-5.jpg`,
    caption: 'Lingkungan Belajar Nyaman',
    description:
      'Kampus hijau yang asri dan kondusif untuk mendukung kegiatan akademik yang berkualitas.',
  },
  {
    // Konoha-6: JPG 40KB vs WebP 120KB — JPG wins 66% smaller
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-6.jpg`,
    fallback: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-6.jpg`,
    caption: 'Alumni Tahun Ajaran 2024/2025',
    description:
      'Generasi unggul dan berkarakter yang siap berkontribusi untuk kemajuan bangsa Indonesia.',
  },
] as const;

export const MAIN_NAV = [
  { key: 'about', label: 'TENTANG KAMI' },
  { key: 'ppdb', label: 'CALON SISWA' },
  { key: 'library', label: 'PERPUSTAKAAN' },
] as const;

export const VALID_ROLES = ['teacher', 'student', 'parent', 'guest'] as const;

export const ROLE_CONFIG = {
  teacher: {
    label: 'Pegawai',
    idLabel: 'Nomor Induk Pegawai (NIP)',
    idPlaceholder: 'Masukkan NIP Anda',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Masukkan kata sandi',
    inputType: 'text',
  },
  student: {
    label: 'Siswa',
    idLabel: 'Nomor Induk Siswa Nasional (NISN)',
    idPlaceholder: 'Masukkan NISN Anda',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Masukkan kata sandi',
    inputType: 'text',
  },
  parent: {
    label: 'Orang Tua',
    idLabel: 'NIS Anak (Nomor Induk Siswa)',
    idPlaceholder: 'Masukkan NIS anak, mis. 2024001',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Masukkan kata sandi',
    inputType: 'text',
  },
  guest: {
    label: 'Tamu',
    idLabel: 'Email',
    idPlaceholder: 'email@contoh.com',
    passwordLabel: 'Kode Akses',
    passwordPlaceholder: 'Masukkan kode akses',
    inputType: 'email',
  },
} as const;
