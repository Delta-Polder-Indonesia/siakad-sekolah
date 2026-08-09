export interface ResearchArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  link: string;
  bgImageSrc: string;
}

export interface SdgsItem {
  id: string;
  title: string;
  imageSrc: string;
  link: string;
}

export const DEFAULT_ARTICLES: ResearchArticle[] = [
  {
    id: '1',
    title: 'Inovasi Sistem Pengolahan Air Bersih Sekolah Berbasis Karbon Aktif',
    date: '18 Juni 2026',
    category: 'Artikel Penelitian',
    link: 'riset-air-bersih',
    bgImageSrc: 'images/Dashboard/logo-profile.png',
  },
  {
    id: '2',
    title: 'Pengembangan Bahan Ramah Lingkungan untuk Infrastruktur Sekolah',
    date: '18 Juni 2026',
    category: 'Artikel Penelitian',
    link: 'riset-infrastruktur',
    bgImageSrc: 'images/Dashboard/logo-profile.png',
  },
  {
    id: '3',
    title: 'Strategi Digitalisasi Pembelajaran Bagi Generasi Muda di Indonesia',
    date: '18 Juni 2026',
    category: 'Artikel Penelitian',
    link: 'riset-digitalisasi',
    bgImageSrc: 'images/Dashboard/logo-profile.png',
  },
];

export const DEFAULT_SDGS: SdgsItem[] = Array.from({ length: 17 }, (_, index) => ({
  id: `sdgs-${index + 1}`,
  title: `SDGs ${index + 1}`,
  imageSrc: `images/HalamanKami/Beranda/icon/sdgs-${index + 1}.png`,
  link: `sdgs-${index + 1}`,
}));