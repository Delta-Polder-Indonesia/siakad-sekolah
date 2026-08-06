import { namaSekolahUppercase } from '../../halaman/components/Profile/dataSekolah';

export const LOGO_SMP = `${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`;

// ── ✨ BARU: Ilustrasi keamanan di samping panel login ──
export const LOGIN_ILLUSTRATION = `${import.meta.env.BASE_URL}images/Dashboard/cyber-security-1923446_960_720.png`;

// ── ✨ BARU: Pesan keamanan yang ditampilkan bersama ilustrasi ──
export const SECURITY_MESSAGE = {
  line1: 'Harap Jaga Password Anda.',
  line2: 'Demi Keamanan Data Anda',
  line3: 'Segera Ganti Password',
} as const;

export const SLIDESHOW_INTERVAL_MS = 6000;
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

export const BACKGROUND_IMAGES = [
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-1.jpg`,
    caption: 'Fasilitas Pembelajaran Modern',
    description:
      'Ruang kelas berteknologi tinggi yang mendukung proses belajar mengajar untuk mencetak generasi unggul.',
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-2.jpg`,
    caption: 'Kegiatan Ekstrakurikuler',
    description:
      'Beragam kegiatan pengembangan diri untuk menggali potensi, bakat, dan minat setiap siswa.',
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-3.jpg`,
    caption: 'Prestasi Siswa Berprestasi',
    description:
      'Meraih prestasi gemilang di tingkat regional, nasional, hingga internasional setiap tahunnya.',
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-5.jpg`,
    caption: 'Lingkungan Belajar Nyaman',
    description:
      'Kampus hijau yang asri dan kondusif untuk mendukung kegiatan akademik yang berkualitas.',
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-6.jpg`,
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
    idLabel: 'Nama Orang Tua (Wali)',
    idPlaceholder: 'Masukkan nama lengkap',
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
