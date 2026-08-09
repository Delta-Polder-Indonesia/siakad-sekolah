import { namaSekolah } from '../../../components/Profile/dataSekolah';

export interface TestimoniSlide {
  quote: string;
  author: string;
  title: string;
  photo: string;
}

export const testimoniSlides: TestimoniSlide[] = [
  {
    quote: `Selamat datang di ${namaSekolah}. Kami berkomitmen memberikan pendidikan terbaik dengan mengedepankan karakter, prestasi, dan inovasi. Bersama-sama kita wujudkan generasi unggul yang siap menghadapi tantangan masa depan.`,
    author: 'Drs. H. Ahmad Fauzi, M.Pd',
    title: `Kepala Sekolah ${namaSekolah}`,
    photo: 'images/GuruPegawai/guru-4.jpg',
  },
  {
    quote: 'Rumah Pendidikan merupakan gagasan yang sangat menarik dan terdepan untuk perkembangan zaman terkini. Di mana pergeseran paradigma baru, pendidikan tidak hanya sekedar di dalam kelas tapi juga bisa di ruang keluarga dan masyarakat.',
    author: 'Arham, S.Pd., M.Pd',
    title: 'Kepala Sekolah SD INPRES 33 Birobuli, Palu',
    photo: 'images/GuruPegawai/guru-1.jpg',
  },
  {
    quote: 'Kami menyambut baik dengan adanya rumah pendidikan ini sebagai langkah strategis Kemendikdasmen terutama memperluas akses pendidikan dan pemerataan mutu pendidikan. Karena diharapkan dengan adanya Rumdik ini sebagai salah satu langkah pendidikan yang Responsif, Akuntabel, Melayani, Adaptif, dan Harmonis. Semoga menjadi langkah terbaik untuk Indonesia maju.',
    author: 'Dr. Firman Oktora, S.SI, M.PD.',
    title: 'Kabalaitekkomdik Jawa Barat',
    photo: 'images/GuruPegawai/guru-2.jpg',
  },
  {
    quote: 'Menurut saya Rumah Pendidikan sangat keren dan sangat membantu. Karena bagi saya murid kelas 6, Rumah Pendidikan bisa membantu dalam belajar dengan simpel, praktis, dan bisa mempelajari berbagai macam hal dalam satu platform, jadi sangat membantu.',
    author: 'Alena',
    title: 'Pelajar Gen KiHajar',
    photo: 'images/GuruPegawai/guru-3.jpg',
  },
];