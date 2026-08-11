import { namaSekolah } from '../../halaman/components/Profile/dataSekolah';
import { GuestEntry } from '../types';

export const initialGuestEntries: GuestEntry[] = [
  {
    id: '1',
    nama: 'Dr. Hasan Basri, M.Pd.',
    instansi: 'Dinas Pendidikan Kota Medan',
    email: 'hasan.basri@diknas.go.id',
    noHp: '081234567890',
    tujuan: 'Kunjungan Dinas',
    pesan:
      `Senang sekali bisa mengunjungi ${namaSekolah}. Fasilitas dan kualitas pendidikan sangat baik. Semoga terus menjadi sekolah unggulan di Sumatera Utara.`,
    tanggal: '2026-01-15',
    waktu: '09:30',
    rating: 5,
  },
  {
    id: '2',
    nama: 'Siti Rahma',
    instansi: 'Wali Murid',
    email: 'siti.rahma@gmail.com',
    noHp: '085678901234',
    tujuan: 'Konsultasi Pendidikan',
    pesan:
      'Terima kasih atas pelayanan yang ramah. Informasi PPDB sangat jelas dan membantu kami dalam mempersiapkan pendaftaran anak.',
    tanggal: '2026-01-18',
    waktu: '10:15',
    rating: 4,
  },
  {
    id: '3',
    nama: 'Prof. Ahmad Dahlan',
    instansi: 'Universitas Sumatera Utara',
    email: 'ahmad.dahlan@usu.ac.id',
    noHp: '082345678901',
    tujuan: 'Kerjasama Akademik',
    pesan:
      `Kunjungan dalam rangka membahas program kerjasama akademik antara USU dan ${namaSekolah}. Sangat antusias dengan potensi kolaborasi ke depan.`,
    tanggal: '2026-01-22',
    waktu: '13:00',
    rating: 5,
  },
  {
    id: '4',
    nama: 'Budi Santoso',
    instansi: 'PT. Telkom Indonesia',
    email: 'budi.s@telkom.co.id',
    noHp: '081122334455',
    tujuan: 'Program CSR',
    pesan:
      'Melakukan survei dalam rangka program CSR bidang pendidikan digital. Sekolah sangat kooperatif dan siap berkolaborasi.',
    tanggal: '2026-02-05',
    waktu: '08:45',
    rating: 5,
  },
  {
    id: '5',
    nama: 'Maria Situmorang',
    instansi: 'Alumni Angkatan 2010',
    email: 'maria.stmrng@yahoo.com',
    noHp: '089876543210',
    tujuan: 'Kunjungan Alumni',
    pesan:
      `Nostalgia mengunjungi almamater tercinta. Banyak perubahan positif yang saya lihat. Bangga menjadi alumni ${namaSekolah}!`,
    tanggal: '2026-02-10',
    waktu: '11:00',
    rating: 5,
  },
  {
    id: '6',
    nama: 'Ir. Ramadhan Lubis',
    instansi: 'Dewan Pendidikan Sumut',
    email: 'ramadhan.l@dpdsumut.go.id',
    noHp: '081987654321',
    tujuan: 'Monitoring & Evaluasi',
    pesan:
      'Monitoring pelaksanaan Kurikulum Merdeka berjalan dengan baik. Guru-guru sangat adaptif dan inovatif dalam penerapannya.',
    tanggal: '2026-02-14',
    waktu: '09:00',
    rating: 4,
  },
];

export const tujuanOptions = [
  'Kunjungan Dinas',
  'Konsultasi Pendidikan',
  'Kerjasama Akademik',
  'Program CSR',
  'Kunjungan Alumni',
  'Monitoring & Evaluasi',
  'Pendaftaran / PPDB',
  'Pengambilan Dokumen',
  'Lainnya',
];
