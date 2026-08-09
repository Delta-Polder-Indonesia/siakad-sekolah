export interface ProgramPendidikanItem {
  id: string;
  title: string;
  description: string;
  link: string;
  iconSrc: string;
  bgImageSrc: string;
}

export const DEFAULT_PROGRAMS: ProgramPendidikanItem[] = [
  {
    id: 'mipa',
    title: 'Rekayasa Perangkat Lunak',
    description: 'Membekali siswa dengan keterampilan pemrograman, pengembangan aplikasi web dan mobile, database management, serta persiapan sertifikasi kompetensi bidang teknologi informasi.',
    link: 'reg-01',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/burger-sec.svg',
    bgImageSrc: '/images/compressed/fakultas/vokasi-bg.webp',
  },
  {
    id: 'ips',
    title: 'Teknik Komputer dan Jaringan',
    description: 'Fokus pada instalasi, konfigurasi, dan pemeliharaan jaringan komputer, sistem keamanan jaringan, serta troubleshooting perangkat keras dan lunak.',
    link: 'reg-02',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/circle-pri.svg',
    bgImageSrc: '/images/compressed/fakultas/sarjana-bg.webp',
  },
  {
    id: 'bahasa',
    title: 'Program Bahasa & Sastra',
    description: 'Mendalami literasi, komunikasi lintas budaya, dan penguasaan bahasa asing guna mempersiapkan lulusan berdaya saing global.',
    link: 'reg-03',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/flower-ora.svg',
    bgImageSrc: '/images/compressed/fakultas/profesi-bg.webp',
  },
  {
    id: 'ekstrakurikuler',
    title: 'Pengembangan Bakat & Ekskul',
    description: 'Wadah pembentukan karakter melalui bidang seni, olahraga, pramuka, olimpiade sains, dan organisasi kesiswaan yang aktif.',
    link: 'reg-04',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/pixel-sec2.svg',
    bgImageSrc: '/images/compressed/fakultas/magister-bg.webp',
  },
  {
    id: 'olimpiade',
    title: 'Kelas Pembinaan Prestasi',
    description: 'Program intensif persiapan OSN, kompetisi akademik nasional, dan internasional untuk mencetak lulusan unggulan berkualitas.',
    link: 'reg-05',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/plusx-sec2.svg',
    bgImageSrc: '/images/compressed/fakultas/program-pendidikan-headline.webp',
  },
  {
    id: 'alumni',
    title: 'Bimbingan Karir & PTN',
    description: 'Pendampingan terstruktur untuk sukses menembus Perguruan Tinggi Negeri (PTN) favorit dan kampus ternama internasional.',
    link: 'reg-06',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/stripe-pri.svg',
    bgImageSrc: '/images/compressed/fakultas/internasional-bg.webp',
  },
];