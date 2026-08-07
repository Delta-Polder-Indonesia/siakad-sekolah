import { namaSekolahUppercase } from '../components/Profile/dataSekolah';

export interface BeritaItem {
  id: string;
  title: string;
  badge: string;
  date: string;
  dateTime: string;
  author: string;
  dateText: string;
  imageSrc: string;
  imageAlt: string;
  subtitle?: string;
}

export const beritaData: Record<string, BeritaItem> = {
  'berita-01': {
    id: 'berita-01',
    title: `${namaSekolahUppercase} Raih Juara LKS Tingkat Provinsi`,
    badge: 'Prestasi',
    date: '15 Juni 2026',
    dateTime: '2026-06-15',
    author: 'Tim Humas',
    dateText: 'Senin, 13 April 2026',
    imageSrc: 'images/Dashboard/sekolah-1.webp',
    imageAlt: `${namaSekolahUppercase} Raih Juara LKS`,
    subtitle: namaSekolahUppercase,
  },
  'berita-02': {
    id: 'berita-02',
    title: 'Kunjungan Industri ke Perusahaan Teknologi',
    badge: 'Kegiatan',
    date: '20 Juni 2026',
    dateTime: '2026-06-20',
    author: 'Tim Humas',
    dateText: 'Senin, 20 April 2026',
    imageSrc: 'images/Dashboard/sekolah-2.webp',
    imageAlt: 'Kunjungan Industri',
    subtitle: namaSekolahUppercase,
  },
  'berita-03': {
    id: 'berita-03',
    title: 'Seminar Karir dan Pendidikan Tinggi',
    badge: 'Acara',
    date: '25 Juni 2026',
    dateTime: '2026-06-25',
    author: 'Tim Humas',
    dateText: 'Rabu, 25 April 2026',
    imageSrc: 'images/Dashboard/sekolah-3.webp',
    imageAlt: 'Seminar Karir',
    subtitle: namaSekolahUppercase,
  },
  'berita-04': {
    id: 'berita-04',
    title: 'PPDB Tahun Ajaran 2026/2027 Dibuka',
    badge: 'Pengumuman',
    date: '01 Juli 2026',
    dateTime: '2026-07-01',
    author: 'Tim Humas',
    dateText: 'Kamis, 01 Mei 2026',
    imageSrc: 'images/Dashboard/sekolah-4.webp',
    imageAlt: 'PPDB 2026/2027',
    subtitle: namaSekolahUppercase,
  },
};

export function getBeritaById(id: string): BeritaItem | undefined {
  return beritaData[id];
}

export function getAllBerita(): BeritaItem[] {
  return Object.values(beritaData);
}
