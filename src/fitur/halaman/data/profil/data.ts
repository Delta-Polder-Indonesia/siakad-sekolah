import type { PageProps } from '../../types';
import {
  SekilasSekolah,
  TonggakSejarah,
  SambutanKepsek,
  VisiMisi,
  StrukturOrganisasi,
  GuruPegawaiPage,
  GtkSiswaPage,
  AkreditasiPrestasi,
  Operasional,
} from '../../components/Profile';

export type TabItem = {
  id: number;
  label: string;
  component: React.ComponentType<PageProps>;
};

export const tabs: TabItem[] = [
  { id: 1, label: 'Sekilas Sekolah', component: SekilasSekolah },
  { id: 2, label: 'Sejarah', component: TonggakSejarah },
  { id: 3, label: 'Sambutan Kepala Sekolah', component: SambutanKepsek },
  { id: 4, label: 'Visi, Misi & Tata Nilai', component: VisiMisi },
  { id: 5, label: 'Struktur Organisasi', component: StrukturOrganisasi },
  { id: 6, label: 'Guru & Pegawai', component: GuruPegawaiPage },
  { id: 7, label: 'Statistik GTK & Siswa', component: GtkSiswaPage },
  { id: 8, label: 'Akreditasi & Prestasi', component: AkreditasiPrestasi },
  { id: 9, label: 'Operasional & Layanan', component: Operasional },
];