export interface FacilityItem {
  id: string;
  name: string;
  detail: string;
  desc: string;
  image: string;
  author: string;
  date: string;
}

export const facilities: FacilityItem[] = [
  {
    id: 'facility-1',
    name: 'Perpustakaan',
    detail: '5.000+ Koleksi Buku',
    desc: 'Ruang baca nyaman dengan sistem digitalisasi katalog dan akses e-book.',
    image: 'images/Dashboard/sekolah-1.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-2',
    name: 'Laboratorium Komputer',
    detail: '40 Unit PC',
    desc: 'Lab terintegrasi dengan spesifikasi tinggi untuk pemrograman, desain, dan simulasi.',
    image: 'images/Dashboard/sekolah-2.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-3',
    name: 'Ruang Kelas Multimedia',
    detail: 'Proyektor & Smart TV',
    desc: 'Setiap ruang kelas dilengkapi proyektor dan perangkat media pembelajaran interaktif.',
    image: 'images/Dashboard/sekolah-3.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-4',
    name: 'Laboratorium IPA',
    detail: 'Praktikum Sains',
    desc: 'Fasilitas lengkap untuk praktikum fisika, kimia, dan biologi dengan standar keselamatan.',
    image: 'images/Dashboard/sekolah-4.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-5',
    name: 'Lapangan Olahraga',
    detail: 'Serbaguna',
    desc: 'Lapangan untuk basket, voli, futsal, dan berbagai kegiatan ekstrakurikuler olahraga.',
    image: 'images/Dashboard/sekolah-5.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-6',
    name: 'Ruang UKS',
    detail: 'Layanan Kesehatan',
    desc: 'Unit Kesehatan Sekolah dengan perawat dan fasilitas pertolongan pertama.',
    image: 'images/Dashboard/sekolah-6.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-7',
    name: 'Masjid Sekolah',
    detail: 'Kapasitas 200 Jemaah',
    desc: 'Ruang ibadah dan kegiatan keagamaan siswa dengan fasilitas wudhu yang memadai.',
    image: 'images/Dashboard/sekolah-7.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-8',
    name: 'Kantin & Koperasi',
    detail: 'Hygienis & Terjangkau',
    desc: 'Penyediaan makanan bergizi dengan standar kebersihan dan harga terjangkau.',
    image: 'images/Dashboard/sekolah-8.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
];
