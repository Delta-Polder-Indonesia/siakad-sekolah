import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul9Page({ onNavigate }: PageProps) {
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
                className="h-full w-full object-cover"
              />
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/PaduanSuara/cover.jpg`}
            alt="Paduan Suara"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler Paduan Suara
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 09
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Seni & Musik
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Paduan Suara
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
              Paduan Suara {namaSekolahUppercase} merupakan salah satu ekstrakurikuler seni yang
              paling prestisius di sekolah, mengembangkan kemampuan vokal, musikalitas, dan kerja
              sama tim melalui seni menyanyi bersama yang telah menjadi tradisi dalam berbagai
              peradaban manusia. Paduan suara yang baik adalah simfoni manusia—perpaduan suara-suara
              individual yang berbeda karakter namun bersatu dalam harmoni yang indah—sebuah
              metafora yang sempurna untuk nilai-nilai kolaborasi dan keberagaman yang dijunjung
              tinggi.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Program pengembangan vokal dalam paduan suara mencakup teknik pernapasan, produksi
              suara, intonasi, dan pembentukan vokal yang diajarkan secara individual maupun
              kelompok. Kemampuan untuk mengontrol napas dan menggunakannya secara efisien dalam
              menyanyi bukan hanya meningkatkan kualitas vokal, melainkan juga memiliki manfaat
              kesehatan yang nyata dan dapat ditransfer ke kemampuan manajemen stres dan berbicara
              di depan umum. Intonasi yang akurat—kemampuan untuk menyanyikan nada yang tepat secara
              konsisten—membutuhkan kepekaan auditif yang tinggi dan latihan pendengaran yang
              terstruktur.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Divisi suara dalam paduan suara—soprano, mezzo-soprano, alto, tenor, bariton, dan
              bass—mencerminkan keberagaman yang saling melengkapi. Setiap suara memiliki karakter
              dan peran yang unik dalam harmonisasi, dan keindahan paduan suara terletak pada
              kemampuan semua suara untuk melebur menjadi satu suara kolektif yang lebih indah dari
              masing-masing bagiannya. Pengalaman bernyanyi dalam ensemble yang harmonis mengajarkan
              secara visceral tentang nilai keberagaman dan bagaimana perbedaan dapat menjadi
              kekuatan ketika dikelola dengan baik.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Repertoar paduan suara yang beragam—dari lagu nasional dan daerah, karya klasik
              choral, hingga aransemen kontemporer—mengembangkan apresiasi musik yang luas dan
              mendalam. Mempelajari lagu-lagu dari berbagai periode sejarah dan tradisi budaya
              membuka wawasan siswa terhadap keragaman ekspresi manusia dan memberikan konteks yang
              kaya untuk memahami musik sebagai bahasa universal yang melampaui batas-batas
              geografis dan kultural.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Paduan Suara {namaSekolahUppercase} dengan berbagai prestasi dalam kompetisi paduan
              suara tingkat kota dan provinsi mencerminkan standar artistik yang tinggi dan komitmen
              terhadap keunggulan yang ditanamkan oleh pelatih dan anggotanya. Setiap penampilan di
              atas panggung, baik dalam kompetisi maupun konser, adalah kulminasi dari ratusan jam
              latihan yang penuh dedikasi—sebuah pelajaran nyata tentang hubungan antara kerja
              keras, konsistensi, dan hasil yang memuaskan.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
