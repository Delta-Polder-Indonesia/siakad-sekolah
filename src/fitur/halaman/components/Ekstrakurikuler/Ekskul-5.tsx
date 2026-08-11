import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul5Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white font-sans text-slate-950">
      <div
        className={`relative min-h-[280px] w-full overflow-hidden bg-slate-100 ${TINGGI_FOTO} ${MAKSIMAL_TINGGI}`}
      >
        <div className="absolute top-6 left-6 z-20 flex flex-shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Kembali"
            className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-white/15"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md shadow-black/30 md:h-10 md:w-10">
              <img
                src={`${import.meta.env.BASE_URL}images/logo/gambar-2.svg`}
                alt={`Logo ${namaSekolahUppercase}`}
                className="h-full w-full object-cover"  loading="lazy" decoding="async" />
            </div>
            <div>
              <h1 className="text-sm leading-tight font-bold tracking-tight text-white drop-shadow-md md:text-base lg:text-lg">
                {namaSekolahUppercase}
              </h1>
              <p className="hidden text-[9px] font-semibold tracking-[0.12em] text-white/80 uppercase drop-shadow sm:block">
                SMP Unggulan Yang Menghasilkan SDM Bermutu
              </p>
            </div>
          </div>
        </div>

        {!imageError ? (
          <img
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/Futsal/cover.jpg`}
            alt="Futsal"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler Futsal
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 05
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Olahraga & Prestasi
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Futsal
          </h1>
        </div>
      </div>

      <section className="mx-auto max-w-[1200px] px-4 pt-8 pb-12 md:px-8 lg:px-12 lg:pt-10 lg:pb-16">
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold tracking-wide text-slate-950 uppercase">
              <span className="h-4 w-1 bg-slate-950" />
              Deskripsi Program
            </h2>
            <p className="ql-align-justify">
              Tim Futsal {namaSekolahUppercase} merupakan salah satu ekstrakurikuler olahraga yang
              paling diminati siswa, mencerminkan popularitas futsal sebagai olahraga yang
              menggabungkan keterampilan teknis individual dengan kecerdasan taktis kolektif. Dalam
              lapangan yang lebih kecil dengan pemain yang lebih sedikit dibandingkan sepak bola
              konvensional, futsal menuntut intensitas yang lebih tinggi, pengambilan keputusan yang
              lebih cepat, dan kreativitas teknis yang lebih besar—menjadikannya olahraga yang
              sangat efektif untuk mengembangkan berbagai kompetensi sekaligus.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Program latihan futsal yang terstruktur di {namaSekolahUppercase} mencakup
              pengembangan teknik dasar seperti passing, control, dribbling, dan shooting yang
              dilatih melalui drill repetitif dan latihan situasional. Namun, pelatih tim futsal
              sekolah memahami bahwa keterampilan teknis saja tidak cukup tanpa pemahaman taktis
              yang memadai. Oleh karena itu, sesi latihan juga mencakup analisis formasi, latihan
              rotasi posisi, dan simulasi skenario pertandingan yang membangun kemampuan membaca
              permainan dan mengambil keputusan taktis dalam waktu singkat.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Aspek pembentukan karakter melalui olahraga tim seperti futsal tidak boleh diremehkan.
              Setiap pertandingan adalah pelajaran tentang bagaimana merespons tekanan, mengelola
              emosi, dan mempertahankan fokus ketika situasi tidak berjalan sesuai rencana. Ketika
              tim tertinggal gol dan waktu semakin menipis, pemain belajar tentang ketahanan mental
              dan tidak menyerah. Ketika tim menang, mereka belajar tentang kerendahan hati dan
              menghargai kontribusi setiap anggota. Ketika terjadi konflik taktis dalam tim, mereka
              belajar tentang komunikasi dan kompromi yang konstruktif.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Partisipasi aktif tim futsal {namaSekolahUppercase} dalam turnamen antar sekolah
              tingkat kota dan provinsi memberikan pengalaman kompetisi yang tidak ternilai. Tekanan
              untuk tampil di hadapan penonton, tanggung jawab untuk mewakili nama sekolah, dan
              pengalaman berhadapan dengan lawan yang berbeda gaya bermain membangun kematangan
              mental dan fleksibilitas taktis yang tidak dapat diperoleh hanya dari latihan
              internal.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Program futsal {namaSekolahUppercase} juga memperhatikan aspek kesehatan dan kebugaran
              yang komprehensif. Dengan bimbingan pelatih bersertifikat, latihan dirancang untuk
              memaksimalkan perkembangan fisik siswa sambil meminimalkan risiko cedera. Pemahaman
              tentang nutrisi olahraga, pemulihan yang tepat, dan pengelolaan beban latihan yang
              diajarkan kepada anggota tim futsal membentuk kebiasaan hidup sehat yang akan
              bermanfaat jauh melampaui masa sekolah mereka.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
