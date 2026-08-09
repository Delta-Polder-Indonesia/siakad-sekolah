import { namaSekolahUppercase } from '../../../components/Profile/dataSekolah';

export interface ServiceItemProps {
  label: string;
  navId?: string;
  href: string;
}

export const silaServices: ServiceItemProps[] = [
  { label: 'Pelayanan Cetak Bukti SPP', navId: 'sila-1', href: 'https://tiket.sman1medan.sch.id/' },
  {
    label: 'Pelayanan Pencetakan Kartu Tanda Siswa',
    navId: 'sila-2',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Reset Password Email Siswa dan Sistem Registrasi',
    navId: 'sila-3',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: `Pelayanan Pembuatan Email ${namaSekolahUppercase} untuk Siswa`,
    navId: 'sila-4',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Tidak Terdaftar sebagai Penerima Beasiswa',
    navId: 'sila-5',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Surat Keterangan Beasiswa',
    navId: 'sila-6',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Surat Keterangan Akreditasi Sekolah',
    navId: 'sila-7',
    href: 'https://tiket.sman1medan.sch.id/',
  },
];

export const asaServices: ServiceItemProps[] = [
  {
    label: 'Pelayanan Permohonan Magang/Internship',
    navId: 'asa-1',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Praktikum/Praktik Kerja Lapangan',
    navId: 'asa-2',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Ujian Akhir',
    navId: 'asa-3',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Izin Penelitian',
    navId: 'asa-4',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Pengambilan Ijazah/Rapor',
    navId: 'asa-5',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Penerbitan Karya Ilmiah Siswa',
    navId: 'asa-6',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Surat Keterangan Nilai',
    navId: 'asa-7',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Surat Keterangan Alumni',
    navId: 'asa-8',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Surat Keterangan Aktif Sekolah Siswa',
    navId: 'asa-9',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Akreditasi Sekolah',
    navId: 'asa-10',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Keterlambatan Pembayaran SPP',
    navId: 'asa-11',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Aktif Belajar Kembali',
    navId: 'asa-12',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Rekomendasi Beasiswa',
    navId: 'asa-13',
    href: 'https://tiket.sman1medan.sch.id/',
  },
  {
    label: 'Pelayanan Permohonan Penundaan Kegiatan Akademik',
    navId: 'asa-14',
    href: 'https://tiket.sman1medan.sch.id/',
  },
];

export const layananLinks = [
  {
    title: 'Sistem Informasi Layanan Administrasi (Putri)',
    href: 'https://sila.sman1medan.sch.id/',
    alt: `Logo Putri ${namaSekolahUppercase}`,
    src: 'images/logo/logo-sekolah.svg',
    width: 24,
    height: 24,
    imgClass: 'object-contain w-6 h-6',
    label: 'Putri',
  },
  {
    title: 'Aplikasi Satu Atap (Putra)',
    href: 'https://asa.sman1medan.sch.id/',
    alt: `Logo Putra ${namaSekolahUppercase}`,
    src: 'images/logo/logo-sekolah.svg',
    width: 24,
    height: 24,
    imgClass: 'object-contain w-6 h-6',
    label: 'Putra',
  },
  {
    title: 'Tiket Layanan',
    href: 'https://tiket.sman1medan.sch.id/',
    alt: 'Tiket Layanan',
    src: 'images/logo/logo-sekolah.svg',
    width: 24,
    height: 24,
    imgClass: 'object-contain w-6 h-6',
    label: 'Tiket Layanan',
  },
  {
    title: 'Kementerian Pendidikan Dasar dan Menengah',
    href: 'https://www.kemendikdasmen.go.id/',
    alt: 'Logo Kemendikdasmen',
    src: 'images/Dashboard/gambar-3.png',
    width: 24,
    height: 24,
    imgClass: 'object-contain w-6 h-6',
    label: 'Kemendikdasmen',
  },
  {
    title: 'Rumah Pendidikan',
    href: 'https://rumah.pendidikan.go.id/',
    alt: 'Rumah Pendidikan',
    src: 'images/Dashboard/logo-rumah-pendidikan.png',
    width: 32,
    height: 32,
    imgClass: 'object-contain w-full h-8',
    label: '',
  },
  {
    title: 'Sekolah Kita',
    href: 'https://sekolah.data.kemendikdasmen.go.id/',
    alt: 'Sekolah Kita',
    src: 'images/Dashboard/logo-sekolah-kita-white.svg',
    width: 24,
    height: 24,
    imgClass: 'w-6 h-6',
    label: 'Sekolah Kita',
  },
];
