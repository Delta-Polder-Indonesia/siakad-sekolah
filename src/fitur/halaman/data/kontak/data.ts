import {
  namaSekolahUppercase,
  alamat,
  kecamatan,
  kota,
  provinsi,
  kodePos,
  telepon,
  email,
  emailDomain,
  mapsQuery,
} from '../../components/Profile/dataSekolah';

export const CONTACT_INFO = {
  address: `${alamat}, ${kecamatan}, ${kota}, ${provinsi} ${kodePos}`,
  phone: telepon,
  callCenter: telepon,
  email,
  website: emailDomain,
} as const;

export const MAPS_URL = `https://www.google.com/maps?q=${mapsQuery}&z=17&output=embed`;

export const MAPS_EXTERNAL_URL = `https://www.google.com/maps?q=${mapsQuery}`;

export const TIM_DAPODIK = [
  'Pusat Data dan Teknologi Informasi',
  'Sekretariat Direktorat Jenderal Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah.',
  'Sekretariat Direktorat Jenderal Vokasi, Pendidikan Khusus, dan Pendidikan Layanan Khusus.',
  'Sekretariat Direktorat Jenderal Guru, Tenaga Kependidikan, dan Pendidikan Guru.',
  'Sekretariat Badan Standar, Kurikulum, dan Asesmen Pendidikan.',
  'Sekretariat Badan Pengembangan dan Pembinaan Bahasa.',
];
