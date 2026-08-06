// ============================================================================
// SUMBER DATA UTAMA — Statistik & Identitas Sekolah
// ----------------------------------------------------------------------------
// Ubah angka di sini, semua halaman yang memakai data ini ikut berubah:
//   - GtkSiswaPage.tsx      (tab "Statistik GTK & Siswa")
//   - SekilasSekolah.tsx    (tab "Sekilas Sekolah" + halaman tamu)
//   - layout/Sidebar, ProgramFooter, perpustakaan, tamu, ekspor, dsb.
// Total GTK, ringkasan, dan statistik dihitung otomatis dari primitif di bawah.
//
// TIP UNTUK TEMPLATE UNIVERSAL:
//   Ganti `jenjang` (SD | SMP | SMA | SMK) dan seluruh primitif identitas di bawah
//   sesuai sekolah pembeli. Label level-spesifik (komposisi GTK, program
//   spesialisasi, ringkasan) otomatis menyesuaikan jenjang.
// ============================================================================

// Tahun ajaran berjalan
export const tahunAjaran = '2025/2026';

// ----------------------------------------------------------------------------
// Jenjang Sekolah (template universal: SD | SMP | SMA | SMK)
// ----------------------------------------------------------------------------
export type JenjangSekolah = 'SD' | 'SMP' | 'SMA' | 'SMK';

export const jenjang: JenjangSekolah = 'SMA';

export const namaJenjang: Record<JenjangSekolah, string> = {
  SD: 'Sekolah Dasar',
  SMP: 'Sekolah Menengah Pertama',
  SMA: 'Sekolah Menengah Atas',
  SMK: 'Sekolah Menengah Kejuruan',
};

// Helper agar TypeScript tidak mempersempit literal & tetap mempertahankan union
const isJenjang = (current: JenjangSekolah, target: JenjangSekolah): boolean => current === target;

export const isSmk = isJenjang(jenjang, 'SMK');
export const isSma = isJenjang(jenjang, 'SMA');
export const isSmp = isJenjang(jenjang, 'SMP');
export const isSd = isJenjang(jenjang, 'SD');

// Label program spesialisasi sesuai jenjang (SMK: keahlian, SMA: peminatan)
export const labelProgramSpesialisasi: Record<JenjangSekolah, string> = {
  SD: 'Program Unggulan',
  SMP: 'Program Unggulan',
  SMA: 'Program Peminatan',
  SMK: 'Program Keahlian',
};

export const programSpesialisasi = labelProgramSpesialisasi[jenjang];

// ----------------------------------------------------------------------------
// Identitas Sekolah
// ----------------------------------------------------------------------------
export const namaSekolah = 'SMA Negeri 1 Medan';
export const npsn = '10210881';
export const nss = '301076001001';
export const statusSekolah = 'Negeri';
export const akreditasi = 'A (Unggul)';
export const tahunBerdiri = '1957';
export const kurikulum = 'Kurikulum Merdeka';
export const waktuBelajar = 'Pagi (07.00 – 14.00)';

// ----------------------------------------------------------------------------
// Alamat & Kontak (dipakai footer, tamu, perpustakaan, ekspor, dsb.)
// ----------------------------------------------------------------------------
export const alamat = 'Jl. Cik Ditiro No. 1';
export const kelurahan = 'Madras Hulu';
export const kecamatan = 'Medan Polonia';
export const kota = 'Kota Medan';
export const provinsi = 'Sumatera Utara';
export const kodePos = '20152';
export const alamatLengkap = `${alamat}, ${kelurahan}, Kec. ${kecamatan}, ${kota}, ${provinsi} ${kodePos}`;
export const telepon = '(061) 4510803';
export const emailDomain = 'sman1medan.sch.id';
export const email = `info@${emailDomain}`;
export const namaSekolahUppercase = namaSekolah.toUpperCase();
export const mapsQuery = encodeURIComponent(
  `${namaSekolah}, ${alamat}, ${kecamatan}, ${kota}, ${provinsi}`
);

export interface IdentitasSekolahItem {
  label: string;
  value: string;
}

export const identitasSekolah: IdentitasSekolahItem[] = [
  { label: 'Nama Sekolah', value: namaSekolah },
  { label: 'NPSN', value: npsn },
  { label: 'NSS', value: nss },
  { label: 'Status', value: statusSekolah },
  { label: 'Akreditasi', value: akreditasi },
  { label: 'Tahun Berdiri', value: tahunBerdiri },
  { label: 'Kurikulum', value: kurikulum },
  { label: 'Waktu Belajar', value: waktuBelajar },
];

// ----------------------------------------------------------------------------
// Komposisi Tenaga Pendidik & Kependidikan (label menyesuaikan jenjang)
// ----------------------------------------------------------------------------
export interface KomposisiGtkItem {
  category: string;
  count: number;
  desc: string;
}

const komposisiGtkSmk: KomposisiGtkItem[] = [
  {
    category: 'Guru Produktif',
    count: 45,
    desc: 'Mengajar mata pelajaran kejuruan sesuai program keahlian',
  },
  {
    category: 'Guru Normatif & Adaptif',
    count: 30,
    desc: 'Mengajar mata pelajaran umum dan penunjang',
  },
  {
    category: 'Tenaga Kependidikan',
    count: 22,
    desc: 'Staf administrasi, perpustakaan, laboran, dan tata usaha',
  },
];

const komposisiGtkUmum: KomposisiGtkItem[] = [
  {
    category: 'Guru Mata Pelajaran',
    count: 45,
    desc: 'Mengajar mata pelajaran sesuai bidang keahlian dan kompetensi',
  },
  {
    category: 'Guru Bimbingan Konseling',
    count: 30,
    desc: 'Membimbing perkembangan akademik, karakter, dan karier siswa',
  },
  {
    category: 'Tenaga Kependidikan',
    count: 22,
    desc: 'Staf administrasi, perpustakaan, laboran, dan tata usaha',
  },
];

export const komposisiGtk: KomposisiGtkItem[] = isSmk ? komposisiGtkSmk : komposisiGtkUmum;

// Dihitung otomatis dari komposisiGtk agar tidak pernah tidak sinkron
export const totalGtk = komposisiGtk.reduce((acc, item) => acc + item.count, 0);

// ----------------------------------------------------------------------------
// Statistik Peserta Didik
// ----------------------------------------------------------------------------
export const siswaAktif = 1850;
export const rombonganBelajar = 36;
export const programPeminatan = isSmk ? 7 : 3;
export const rasioGuruSiswa = '1 : 18';
export const tingkatKelulusan = '98,5%';
export const penyerapanKerja = '75%';

export interface StatistikSiswaItem {
  label: string;
  value: string;
  sub: string;
}

export const statistikSiswa: StatistikSiswaItem[] = [
  {
    label: 'Jumlah Siswa Aktif',
    value: siswaAktif.toLocaleString('id-ID'),
    sub: 'Siswa Terdaftar',
  },
  { label: 'Rasio Guru : Siswa', value: rasioGuruSiswa, sub: 'Kategori Ideal' },
  { label: 'Tingkat Kelulusan', value: tingkatKelulusan, sub: 'Rata-rata 3 Tahun' },
  { label: 'Penyerapan Kerja', value: penyerapanKerja, sub: 'Langsung Bekerja' },
];

// Ringkasan kilat untuk Sekilas Sekolah — turunan otomatis dari primitif di atas
export const ringkasanSekolah = [
  { value: siswaAktif.toLocaleString('id-ID'), label: 'Peserta Didik' },
  { value: totalGtk.toLocaleString('id-ID'), label: 'Tenaga Pendidik' },
  { value: rombonganBelajar.toLocaleString('id-ID'), label: 'Rombongan Belajar' },
  { value: programPeminatan.toLocaleString('id-ID'), label: programSpesialisasi },
];
