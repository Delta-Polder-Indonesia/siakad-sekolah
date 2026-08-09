import { namaSekolahUppercase } from '../../components/Profile/dataSekolah';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  category: string;
  excerpt: string;
  image: string;
  author: string;
}

export const news: NewsItem[] = [
  {
    id: 'berita-1',
    title: 'SMKN 1 Cimahi Raih Juara LKS Tingkat Provinsi',
    date: '2026-06-15',
    dateLabel: '15 Juni 2026',
    category: 'Prestasi',
    excerpt:
      'Tim siswa SMKN 1 Cimahi berhasil meraih juara pertama dalam Lomba Kompetensi Siswa (LKS) bidang Rekayasa Perangkat Lunak tingkat Provinsi Jawa Barat. Prestasi ini menjadi bukti komitmen sekolah dalam mengembangkan kompetensi siswa.',
    image: 'images/Dashboard/sekolah-1.webp',
    author: 'Tim Redaksi',
  },
  {
    id: 'berita-2',
    title: 'Kunjungan Industri Kelas XI ke Perusahaan Mitra',
    date: '2026-06-10',
    dateLabel: '10 Juni 2026',
    category: 'Kegiatan',
    excerpt:
      'Siswa kelas XI melakukan kunjungan industri ke beberapa perusahaan mitra di Bandung dan Cimahi. Kegiatan ini bertujuan memberikan pengalaman langsung tentang dinamika dunia kerja.',
    image: 'images/Dashboard/sekolah-2.webp',
    author: 'Tim Redaksi',
  },
  {
    id: 'berita-3',
    title: 'Seminar Karir dan Beasiswa untuk Siswa Kelas XII',
    date: '2026-06-05',
    dateLabel: '5 Juni 2026',
    category: 'Informasi',
    excerpt:
      'Sekolah mengadakan seminar karir yang menghadirkan praktisi industri dan perwakilan perguruan tinggi untuk memberikan arahan jalur karir dan informasi beasiswa kepada siswa kelas XII.',
    image: 'images/Dashboard/sekolah-3.webp',
    author: 'Tim Redaksi',
  },
  {
    id: 'berita-4',
    title: 'Pembukaan PPDB Gelombang 1 Tahun Ajaran 2026/2027',
    date: '2026-06-01',
    dateLabel: '1 Juni 2026',
    category: 'Pengumuman',
    excerpt:
      'Penerimaan Peserta Didik Baru gelombang pertama telah resmi dibuka. Calon siswa dapat mendaftar secara online melalui portal PPDB resmi sekolah.',
    image: 'images/Dashboard/sekolah-4.webp',
    author: 'Tim Redaksi',
  },
];

export const tabs = [
  { id: 'All', label: 'All' },
  { id: 'Prestasi', label: 'Prestasi' },
  { id: 'Kegiatan', label: 'Kegiatan' },
  { id: 'Informasi', label: 'Informasi' },
  { id: 'Pengumuman', label: 'Pengumuman' },
];

export const tahunAjaran = ['2024/2025', '2025/2026', '2026/2027', '2027/2028'];
