export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  desc: string;
  type: string;
  image: string;
  author: string;
  date: string;
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  image: string;
  author: string;
  date: string;
}

export const activities: ActivityItem[] = [
  {
    id: 'kegiatan-1',
    title: 'Masa Pengenalan Lingkungan Sekolah',
    time: 'Juli 2026',
    desc: 'Kegiatan orientasi bagi siswa baru untuk mengenal lingkungan sekolah, tata tertib, program kegiatan, dan membangun rasa kekeluargaan antar siswa.',
    type: 'Orientasi',
    image: 'images/HalamanKami/KegiatanSekolah/sekolah-1.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'kegiatan-2',
    title: 'Class Meeting dan Expo Karya Siswa',
    time: 'Desember 2026',
    desc: 'Pameran karya siswa dari berbagai program keahlian, lomba antar kelas, dan pentas seni yang menampilkan bakat dan kreativitas siswa.',
    type: 'Pameran',
    image: 'images/HalamanKami/KegiatanSekolah/sekolah-2.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'kegiatan-3',
    title: 'Lomba Kompetensi Siswa Tingkat Kota',
    time: 'Maret 2027',
    desc: 'Seleksi dan pelatihan siswa berprestasi untuk mengikuti kompetisi keahlian tingkat kota dan provinsi.',
    type: 'Kompetisi',
    image: 'images/HalamanKami/KegiatanSekolah/sekolah-3.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'kegiatan-4',
    title: 'Kunjungan Industri Kelas XI',
    time: 'September 2026',
    desc: 'Kunjungan ke perusahaan mitra untuk memperkenalkan siswa pada lingkungan kerja nyata dan memperkuat pemahaman industri.',
    type: 'Kunjungan',
    image: 'images/HalamanKami/KegiatanSekolah/sekolah-4.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'kegiatan-5',
    title: 'Seminar Karir dan Beasiswa',
    time: 'November 2026',
    desc: 'Pemberian informasi jalur karir, beasiswa pendidikan lanjut, dan motivasi dari alumni sukses.',
    type: 'Seminar',
    image: 'images/HalamanKami/KegiatanSekolah/sekolah-5.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
];

export const extracurriculars: ExtracurricularItem[] = [
  {
    id: 'ekskul-1',
    name: 'Pramuka',
    image: 'images/HalamanKami/KegiatanSekolah/sekolah-1.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-2',
    name: 'OSIS & MPK',
    image: 'images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-3',
    name: 'Rohis (Rohani Islam)',
    image: 'images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-4',
    name: 'Paskibra',
    image: 'images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-5',
    name: 'Futsal',
    image: 'images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-6',
    name: 'Basket',
    image: 'images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-7',
    name: 'Voli',
    image: 'images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-8',
    name: 'Tari Tradisional',
    image: 'images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-9',
    name: 'Paduan Suara',
    image: 'images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-10',
    name: 'Jurnalistik',
    image: 'images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
];

export interface EkskulItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  subtitle?: string;
}

export const ekskulData: Record<string, EkskulItem> = {
  'ekskul-1': {
    id: 'ekskul-1',
    name: 'Pramuka',
    category: 'Ekstrakurikuler 01',
    description: 'Kepemimpinan & Karakter',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-1.jpg',
    imageAlt: 'Pramuka',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
  'ekskul-2': {
    id: 'ekskul-2',
    name: 'OSIS & MPK',
    category: 'Ekstrakurikuler 02',
    description: 'Organisasi Siswa',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-2.jpg',
    imageAlt: 'OSIS & MPK',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
  'ekskul-3': {
    id: 'ekskul-3',
    name: 'Rohis',
    category: 'Ekstrakurikuler 03',
    description: 'Kerohanian Islam',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-3.jpg',
    imageAlt: 'Rohis',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
  'ekskul-4': {
    id: 'ekskul-4',
    name: 'Paskibra',
    category: 'Ekstrakurikuler 04',
    description: 'Pasukan Pengibar Bendera',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-4.jpg',
    imageAlt: 'Paskibra',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
  'ekskul-5': {
    id: 'ekskul-5',
    name: 'Futsal',
    category: 'Ekstrakurikuler 05',
    description: 'Olahraga',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-5.jpg',
    imageAlt: 'Futsal',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
  'ekskul-6': {
    id: 'ekskul-6',
    name: 'Basket',
    category: 'Ekstrakurikuler 06',
    description: 'Olahraga',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-6.jpg',
    imageAlt: 'Basket',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
  'ekskul-7': {
    id: 'ekskul-7',
    name: 'Voli',
    category: 'Ekstrakurikuler 07',
    description: 'Olahraga',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-7.jpg',
    imageAlt: 'Voli',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
  'ekskul-8': {
    id: 'ekskul-8',
    name: 'Tari Tradisional',
    category: 'Ekstrakurikuler 08',
    description: 'Seni Budaya',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-8.jpg',
    imageAlt: 'Tari Tradisional',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
  'ekskul-9': {
    id: 'ekskul-9',
    name: 'Paduan Suara',
    category: 'Ekstrakurikuler 09',
    description: 'Seni Musik',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-9.jpg',
    imageAlt: 'Paduan Suara',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
  'ekskul-10': {
    id: 'ekskul-10',
    name: 'Jurnalistik',
    category: 'Ekstrakurikuler 10',
    description: 'Media & Komunikasi',
    imageSrc: 'images/HalamanKami/KegiatanSekolah/sekolah-10.jpg',
    imageAlt: 'Jurnalistik',
    subtitle: 'SMP Unggulan Yang Menghasilkan SDM Bermutu',
  },
};

export function getEkskulById(id: string): EkskulItem | undefined {
  return ekskulData[id];
}

export function getAllEkskul(): EkskulItem[] {
  return Object.values(ekskulData);
}