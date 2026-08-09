export interface ProgramItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  author: string;
  date: string;
}

export const programs: ProgramItem[] = [
  {
    id: 'program-1',
    title: 'Penguatan Karakter dan Kedisiplinan Siswa',
    desc: 'Program unggulan untuk membentuk siswa yang berakhlak mulia, disiplin, mandiri, dan bertanggung jawab melalui kegiatan rutin harian, pembinaan mental, serta pembiasaan budaya positif di lingkungan sekolah.',
    image: 'images/HalamanKami/ProgramSekolah/sekolah-1.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'program-2',
    title: 'Kelas Industri dan Pembelajaran Berbasis Proyek',
    desc: 'Kolaborasi dengan dunia usaha dan industri untuk menyelenggarakan pembelajaran yang relevan dengan kebutuhan pasar kerja. Siswa belajar langsung dari praktisi industri melalui proyek nyata.',
    image: 'images/HalamanKami/ProgramSekolah/sekolah-2.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'program-3',
    title: 'Program Magang Siswa di Dunia Usaha dan Industri',
    desc: 'Penempatan siswa kelas XI dan XII di perusahaan mitra untuk mengasah keterampilan kerja, membangun jaringan profesional, dan mempersiapkan diri menghadapi dunia kerja.',
    image: 'images/HalamanKami/ProgramSekolah/sekolah-3.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'program-4',
    title: 'Pelatihan Sertifikasi Kompetensi Siswa',
    desc: 'Program pendampingan dan uji kompetensi untuk memperoleh sertifikat keahlian yang diakui industri, meningkatkan daya saing lulusan di pasar kerja nasional maupun internasional.',
    image: 'images/HalamanKami/ProgramSekolah/sekolah-4.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'program-5',
    title: 'Pendampingan Karir dan Bursa Kerja Khusus',
    desc: 'Layanan bimbingan karir, workshop persiapan kerja, dan penyelenggaraan bursa kerja yang menghubungkan lulusan dengan perusahaan rekruter mitra sekolah.',
    image: 'images/HalamanKami/ProgramSekolah/sekolah-5.jpg',
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
];