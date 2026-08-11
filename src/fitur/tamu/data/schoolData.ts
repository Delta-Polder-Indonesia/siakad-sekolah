import { namaSekolah } from '../../halaman/components/Profile/dataSekolah';
// NOTE: Profil sekolah, identitas, dan statistik dikelola di satu pintu:
// `src/fitur/halaman/components/Profile/dataSekolah.ts`
// (dipakai oleh SekilasSekolah, GtkSiswaPage, dan halaman tamu TentangSekolah)

// NOTE: visiMisi and strukturOrganisasi data removed
// These are now managed in Profile components (VisiMisi.tsx and StrukturOrganisasi.tsx)
// Tamu pages now use the Profile components directly for "1 pintu" data management

// Data Fasilitas
export const fasilitas = [
  {
    id: 1,
    nama: 'Ruang Kelas',
    jumlah: 27,
    kondisi: 'Baik',
    deskripsi: 'Dilengkapi AC, proyektor, dan papan tulis digital',
    icon: 'building',
  },
  {
    id: 2,
    nama: 'Laboratorium IPA',
    jumlah: 2,
    kondisi: 'Baik',
    deskripsi: 'Lab Fisika dan Lab Biologi dengan peralatan lengkap',
    icon: 'flask',
  },
  {
    id: 3,
    nama: 'Laboratorium Komputer',
    jumlah: 2,
    kondisi: 'Baik',
    deskripsi: '60 unit komputer dengan koneksi internet fiber optic',
    icon: 'computer',
  },
  {
    id: 4,
    nama: 'Perpustakaan',
    jumlah: 1,
    kondisi: 'Baik',
    deskripsi: 'Koleksi 15.000+ buku dan e-library',
    icon: 'book',
  },
  {
    id: 5,
    nama: 'Lapangan Olahraga',
    jumlah: 3,
    kondisi: 'Baik',
    deskripsi: 'Lapangan basket, voli, dan futsal',
    icon: 'trophy',
  },
  {
    id: 6,
    nama: 'Mushola',
    jumlah: 1,
    kondisi: 'Baik',
    deskripsi: 'Kapasitas 200 jamaah',
    icon: 'home',
  },
  {
    id: 7,
    nama: 'UKS',
    jumlah: 1,
    kondisi: 'Baik',
    deskripsi: 'Dilengkapi tenaga medis dan obat-obatan',
    icon: 'heart',
  },
  {
    id: 8,
    nama: 'Kantin Sehat',
    jumlah: 1,
    kondisi: 'Baik',
    deskripsi: 'Menyediakan makanan sehat dan bergizi',
    icon: 'utensils',
  },
];

// Data Program Unggulan
export const programUnggulan = [
  {
    id: 1,
    nama: 'Kelas Unggulan',
    deskripsi: 'Program akselerasi untuk siswa berprestasi dengan kurikulum diperkaya',
    icon: 'star',
    siswa: 90,
  },
  {
    id: 2,
    nama: 'Bilingual Class',
    deskripsi: 'Pembelajaran dengan pengantar Bahasa Inggris untuk mata pelajaran tertentu',
    icon: 'globe',
    siswa: 60,
  },
  {
    id: 3,
    nama: 'Tahfidz Program',
    deskripsi: 'Program menghafal Al-Quran dengan target minimal 3 juz',
    icon: 'book',
    siswa: 120,
  },
  {
    id: 4,
    nama: 'STEM Education',
    deskripsi: 'Integrasi Sains, Teknologi, Engineering, dan Matematika',
    icon: 'cpu',
    siswa: 80,
  },
  {
    id: 5,
    nama: 'Character Building',
    deskripsi: 'Pembentukan karakter melalui kegiatan pembiasaan dan mentoring',
    icon: 'heart',
    siswa: 892,
  },
];

// Data Prestasi
export const prestasi = [
  {
    id: 1,
    judul: 'Juara 1 OSN Matematika Tingkat Provinsi',
    siswa: 'Ahmad Rizki Pratama',
    tahun: 2025,
    tingkat: 'Provinsi',
    kategori: 'Akademik',
  },
  {
    id: 2,
    judul: 'Juara 2 Lomba Cerdas Cermat Tingkat Kabupaten',
    siswa: `Tim LCC ${namaSekolah}`,
    tahun: 2025,
    tingkat: 'Kabupaten',
    kategori: 'Akademik',
  },
  {
    id: 3,
    judul: 'Juara 1 Lomba Pidato Bahasa Inggris',
    siswa: 'Siti Nurhaliza',
    tahun: 2025,
    tingkat: 'Kabupaten',
    kategori: 'Akademik',
  },
  {
    id: 4,
    judul: 'Juara 1 POPDA Cabang Basket',
    siswa: 'Tim Basket Putra',
    tahun: 2025,
    tingkat: 'Kabupaten',
    kategori: 'Olahraga',
  },
  {
    id: 5,
    judul: 'Juara 3 FLS2N Seni Tari Tingkat Provinsi',
    siswa: 'Dewi Kartika',
    tahun: 2025,
    tingkat: 'Provinsi',
    kategori: 'Seni',
  },
  {
    id: 6,
    judul: 'Juara 1 Lomba Robotik Tingkat Regional',
    siswa: 'Tim Robotik',
    tahun: 2024,
    tingkat: 'Regional',
    kategori: 'Teknologi',
  },
  {
    id: 7,
    judul: 'Sekolah Adiwiyata Tingkat Nasional',
    siswa: `${namaSekolah}`,
    tahun: 2024,
    tingkat: 'Nasional',
    kategori: 'Lingkungan',
  },
  {
    id: 8,
    judul: 'Juara 2 MTQ Tingkat Kabupaten',
    siswa: 'Muhammad Fadil',
    tahun: 2024,
    tingkat: 'Kabupaten',
    kategori: 'Keagamaan',
  },
];

// Data Ekstrakurikuler
export const ekstrakurikuler = [
  { id: 1, nama: 'Pramuka', kategori: 'Wajib', anggota: 450, jadwal: 'Jumat, 14:00-16:00' },
  { id: 2, nama: 'OSIS', kategori: 'Organisasi', anggota: 35, jadwal: 'Sabtu, 08:00-10:00' },
  { id: 3, nama: 'PMR', kategori: 'Sosial', anggota: 40, jadwal: 'Rabu, 14:00-16:00' },
  {
    id: 4,
    nama: 'Basket',
    kategori: 'Olahraga',
    anggota: 30,
    jadwal: 'Selasa & Kamis, 15:00-17:00',
  },
  { id: 5, nama: 'Voli', kategori: 'Olahraga', anggota: 28, jadwal: 'Senin & Rabu, 15:00-17:00' },
  {
    id: 6,
    nama: 'Futsal',
    kategori: 'Olahraga',
    anggota: 25,
    jadwal: 'Selasa & Jumat, 15:00-17:00',
  },
  { id: 7, nama: 'Paduan Suara', kategori: 'Seni', anggota: 35, jadwal: 'Rabu, 14:00-16:00' },
  { id: 8, nama: 'Seni Tari', kategori: 'Seni', anggota: 25, jadwal: 'Kamis, 14:00-16:00' },
  { id: 9, nama: 'Band', kategori: 'Seni', anggota: 15, jadwal: 'Sabtu, 10:00-12:00' },
  { id: 10, nama: 'Robotik', kategori: 'Teknologi', anggota: 20, jadwal: 'Sabtu, 08:00-11:00' },
  { id: 11, nama: 'English Club', kategori: 'Akademik', anggota: 40, jadwal: 'Senin, 14:00-15:30' },
  {
    id: 12,
    nama: 'Jurnalistik',
    kategori: 'Kreativitas',
    anggota: 18,
    jadwal: 'Kamis, 14:00-16:00',
  },
  { id: 13, nama: 'KIR', kategori: 'Akademik', anggota: 22, jadwal: 'Rabu, 14:00-16:00' },
  {
    id: 14,
    nama: 'Tahfidz',
    kategori: 'Keagamaan',
    anggota: 50,
    jadwal: 'Setiap hari, 06:30-07:00',
  },
];

// Data Berita
export const beritaList = [
  {
    id: 1,
    judul: `Siswa ${namaSekolah} Raih Juara 1 OSN Matematika`,
    tanggal: '2025-01-20',
    kategori: 'Prestasi',
    ringkasan:
      'Ahmad Rizki Pratama berhasil meraih juara pertama dalam Olimpiade Sains Nasional bidang Matematika tingkat Provinsi Jawa Tengah.',
    gambar: '/images/berita/osn.jpg',
  },
  {
    id: 2,
    judul: 'Kegiatan Class Meeting Semester Ganjil 2025',
    tanggal: '2025-01-15',
    kategori: 'Kegiatan',
    ringkasan:
      'Rangkaian kegiatan class meeting berlangsung meriah dengan berbagai lomba antar kelas seperti futsal, voli, dan lomba kreativitas.',
    gambar: '/images/berita/classmeeting.jpg',
  },
  {
    id: 3,
    judul: 'Workshop Digital Literacy untuk Siswa',
    tanggal: '2025-01-10',
    kategori: 'Akademik',
    ringkasan:
      'Sekolah mengadakan workshop literasi digital untuk meningkatkan kemampuan siswa dalam menggunakan teknologi secara bijak.',
    gambar: '/images/berita/workshop.jpg',
  },
  {
    id: 4,
    judul: 'Peringatan Hari Guru Nasional 2024',
    tanggal: '2024-11-25',
    kategori: 'Kegiatan',
    ringkasan:
      `Seluruh civitas akademika ${namaSekolah} memperingati Hari Guru Nasional dengan berbagai kegiatan penuh makna.`,
    gambar: '/images/berita/hariguru.jpg',
  },
  {
    id: 5,
    judul: 'Pembukaan Pendaftaran PPDB 2025/2026',
    tanggal: '2025-02-01',
    kategori: 'PPDB',
    ringkasan:
      'Pendaftaran Peserta Didik Baru tahun ajaran 2025/2026 resmi dibuka. Simak informasi lengkap mengenai jadwal dan persyaratan.',
    gambar: '/images/berita/ppdb.jpg',
  },
];

// Data PPDB
export const ppdbInfo = {
  tahunAjaran: '2025/2026',
  kuota: {
    reguler: 270,
    zonasi: 200,
    afirmasi: 40,
    prestasi: 30,
  },
  jadwal: [
    { tahap: 'Pendaftaran Online', mulai: '2025-02-01', selesai: '2025-02-28' },
    { tahap: 'Verifikasi Berkas', mulai: '2025-03-01', selesai: '2025-03-07' },
    { tahap: 'Pengumuman Hasil Seleksi', mulai: '2025-03-15', selesai: '2025-03-15' },
    { tahap: 'Daftar Ulang', mulai: '2025-03-16', selesai: '2025-03-22' },
    { tahap: 'Masa Pengenalan Lingkungan Sekolah', mulai: '2025-07-14', selesai: '2025-07-16' },
  ],
  persyaratan: [
    'Fotokopi Akta Kelahiran',
    'Fotokopi Kartu Keluarga',
    'Fotokopi Ijazah SD/sederajat (menyusul)',
    'Fotokopi SKHUN (menyusul)',
    'Pas foto 3x4 sebanyak 4 lembar',
    'Surat Keterangan Sehat dari Dokter',
    'Fotokopi KTP Orang Tua/Wali',
  ],
  biaya: {
    pendaftaran: 0,
    spp: 150000,
    seragam: 850000,
    buku: 450000,
  },
  kontakPPDB: {
    telepon: '(0280) 611234',
    whatsapp: '081234567890',
    email: 'ppdb@sman1medan.sch.id',
  },
};

// Data FAQ
export const faqList = [
  {
    id: 1,
    pertanyaan: `Bagaimana cara mendaftar di ${namaSekolah}?`,
    jawaban:
      'Pendaftaran dilakukan secara online melalui website resmi PPDB. Calon siswa perlu mengisi formulir pendaftaran dan mengunggah dokumen persyaratan yang diminta. Informasi lengkap dapat dilihat di menu Info PPDB.',
  },
  {
    id: 2,
    pertanyaan: `Berapa biaya pendidikan di ${namaSekolah}?`,
    jawaban:
      `Sebagai sekolah negeri, ${namaSekolah} tidak memungut biaya pendaftaran. SPP bulanan sebesar Rp 150.000. Untuk siswa dari keluarga kurang mampu, tersedia program beasiswa dan keringanan biaya.`,
  },
  {
    id: 3,
    pertanyaan: 'Apa saja ekstrakurikuler yang tersedia?',
    jawaban:
      'Kami menyediakan 14+ ekstrakurikuler meliputi Pramuka (wajib), OSIS, PMR, Basket, Voli, Futsal, Paduan Suara, Seni Tari, Band, Robotik, English Club, Jurnalistik, KIR, dan Tahfidz.',
  },
  {
    id: 4,
    pertanyaan: 'Apakah ada program unggulan di sekolah ini?',
    jawaban:
      'Ya, kami memiliki beberapa program unggulan seperti Kelas Unggulan, Bilingual Class, Program Tahfidz, STEM Education, dan Character Building yang terintegrasi dalam pembelajaran.',
  },
  {
    id: 5,
    pertanyaan: `Bagaimana jam belajar di ${namaSekolah}?`,
    jawaban:
      'Kegiatan belajar mengajar berlangsung dari Senin-Jumat pukul 07:00-15:00 WIB. Hari Sabtu digunakan untuk kegiatan ekstrakurikuler dan pengembangan diri.',
  },
  {
    id: 6,
    pertanyaan: 'Apakah sekolah menyediakan antar jemput?',
    jawaban:
      'Saat ini sekolah belum menyediakan layanan antar jemput resmi. Namun, lokasi sekolah strategis dan mudah dijangkau dengan transportasi umum.',
  },
  {
    id: 7,
    pertanyaan: 'Bagaimana sistem pembelajaran di masa pandemi?',
    jawaban:
      'Pembelajaran dilaksanakan secara tatap muka penuh dengan tetap menerapkan protokol kesehatan. Sekolah juga memiliki platform e-learning untuk mendukung pembelajaran hybrid jika diperlukan.',
  },
  {
    id: 8,
    pertanyaan: 'Apakah ada program beasiswa?',
    jawaban:
      'Ya, sekolah menyediakan beberapa jenis beasiswa: Beasiswa Prestasi Akademik, Beasiswa Prestasi Non-Akademik, dan Beasiswa untuk siswa dari keluarga kurang mampu (KIP).',
  },
];
