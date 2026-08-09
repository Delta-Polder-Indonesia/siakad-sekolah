import type { NavItem } from '../../types';
import { isSmk } from '../../components/Profile/dataSekolah';

export const navItems: NavItem[] = [
  'Beranda',
  'Profil',
  'Program Sekolah',
  ...(isSmk ? (['Program Keahlian'] as NavItem[]) : []),
  'Sarana Prasarana',
  'Kegiatan Sekolah',
  'Berita',
  'Galeri',
  'Kontak',
];