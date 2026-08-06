import type { ActivityItem, NavItem, NewsItem, SimpleItem } from './types';
import { isSmk } from './components/Profile/dataSekolah';

// "Program Keahlian" (jurusan) hanya bermakna untuk jenjang SMK.
// Untuk SMA/SMP/SD menu tersebut disembunyikan dari navigasi agar template universal.
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

// src/fitur/halaman/data.ts

export const activityItems: ActivityItem[] = [
  {
    title: 'Rahasia Kuliah Gratis & Pengalaman Keren? Cek Beasiswa Djarum Foundation!',
    desc: 'Kalau kamu tipe orang yang pengen lebih dari sekadar duduk di bangku kuliah, ini kesempatan emas! Djarum Foundation punya program kece yang namanya Djarum Beasiswa Plus. Kenalan, yuk!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title:
      'Fakultas Farmasi: Cocok Buat Kamu yang Suka Sains, Penasaran Sama Obat, dan Mau Jadi Peneliti Keren di Dunia Kesehatan!',
    desc: 'Ada satu bidang yang khusus mempelajari cara membuat, menguji, dan memastikan obat aman digunakan, nih! Yuk, kenalan sama Fakultas Farmasi!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title: 'Gratis Kuliah S1 di Korea? Daftar GKS Aja!',
    desc: 'Saatnya wujudkan mimpi kuliah di Korea lewat Global Korea Scholarship (GKS). Yuk, kenalan sama beasiswa ini!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title: 'Kuliah di Bidang Kesehatan Tanpa Beban Biaya? Beasiswa Kemenkes 2025 Jawabannya!',
    desc: 'Mari kita bahas mengenai beasiswa Kemenkes 2025. Let’s go, calon tenaga kesehatan!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title: 'Fakultas Hukum: Jurusan untuk Si Pemberani dan Kritis!',
    desc: 'Masuk Fakultas Hukum itu nggak cuma buat yang mau jadi pengacara, lho! Yuk, kenalan sama Fakultas Hukum dan cari tahu kecocokan kamu sama fakultas ini, ya!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title: 'Fakultas Kedokteran: Mimpi Jadi Dokter Dimulai dari Sini!',
    desc: 'Menjadi dokter adalah impian banyak orang. Yuk, intip apa saja yang akan kamu pelajari selama kuliah di Fakultas Kedokteran dan bagaimana persiapannya!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title: 'Beasiswa Unggulan Kemendikbudristek: Raih Kuliah Gratis di Kampus Top Indonesia!',
    desc: 'Pemerintah menyediakan bantuan dana kuliah lewat Beasiswa Unggulan. Cari tahu syarat, benefit, dan tips lolos seleksinya di artikel ini!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title: 'Teknik Informatika: Jurusan Masa Depan untuk Kamu yang Suka Coding dan Teknologi!',
    desc: 'Dunia digital berkembang sangat cepat. Masuk Teknik Informatika bakal bikin kamu siap jadi software engineer handal. Yuk, kuliti jurusannya!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title: 'Mau Kuliah di Eropa? Beasiswa Erasmus+ Bisa Jadi Tiket Emas Kamu!',
    desc: 'Rasakan serunya kuliah berpindah-pindah negara di Eropa gratis dengan Beasiswa Erasmus+. Simak panduan lengkap pendaftarannya di sini!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title: 'Fakultas Psikologi: Memahami Manusia Lebih Dalam, Bukan Cuma Bisa Baca Pikiran!',
    desc: 'Banyak orang salah kaprah tentang jurusan ini. Yuk, pelajari fakta seru kuliah di Fakultas Psikologi dan prospek kerjanya yang luas banget!',
    image: 'images/Dashboard/logo-profile.png',
  },
  {
    title: 'Tips Lolos Beasiswa LPDP: Persiapan Dokumen dan Esai yang Menjual!',
    desc: 'Mau lanjut S2 atau S3 dibiayai penuh oleh negara? Ini dia strategi jitu menyusun esai dan lolos wawancara beasiswa LPDP!',
    image: 'images/Dashboard/logo-profile.png',
  },
];
