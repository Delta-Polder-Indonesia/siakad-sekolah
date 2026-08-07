import { namaSekolahUppercase } from '../components/Profile/dataSekolah';

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