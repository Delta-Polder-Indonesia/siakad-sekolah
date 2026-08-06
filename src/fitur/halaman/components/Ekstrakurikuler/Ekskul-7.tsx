import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul7Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/Voli/cover.jpg`}
            alt="Voli"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler Voli
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 07
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Olahraga & Prestasi
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Voli
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
              Ekstrakurikuler Voli {namaSekolahUppercase} merupakan program olahraga beregu yang
              mengembangkan kemampuan atletis, koordinasi, dan kerja sama tim melalui salah satu
              olahraga paling populer di Indonesia. Bola voli dengan karakteristiknya yang
              unik—tidak ada kontak langsung antar pemain, bola tidak boleh menyentuh lantai, dan
              setiap tim hanya memiliki tiga kali sentuhan sebelum bola harus melewati
              net—menciptakan dinamika pertandingan yang intens dan menuntut koordinasi yang sangat
              tinggi antar pemain.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Teknik dasar voli yang mencakup servis, passing bawah, passing atas, smash, dan block
              dilatih secara sistematis dalam program ekstrakurikuler ini. Setiap teknik memiliki
              mekanika yang spesifik dan membutuhkan latihan repetitif yang konsisten untuk
              dikuasai. Namun, penguasaan teknik individual hanyalah langkah pertama; yang
              benar-benar membedakan tim voli yang baik adalah kemampuan untuk mengintegrasikan
              teknik individual ke dalam pola permainan tim yang mengalir dengan lancar dan
              responsif terhadap berbagai situasi.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Sistem rotasi dalam voli yang mengharuskan setiap pemain untuk memainkan setiap
              posisi—dari pemain belakang yang bertahan hingga pemain depan yang
              menyerang—mengajarkan fleksibilitas peran yang sangat berharga. Berbeda dengan
              beberapa olahraga lain di mana posisi bersifat tetap, voli menuntut setiap pemain
              untuk kompeten di berbagai fungsi, membangun pemahaman yang komprehensif tentang
              dinamika permainan secara keseluruhan. Fleksibilitas peran ini mencerminkan realitas
              dunia kerja modern yang menuntut kemampuan adaptasi dan multi-tasking.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Komunikasi verbal dan non-verbal antar pemain adalah kunci keberhasilan dalam voli.
              Panggilan bola, koordinasi blocking, dan komunikasi taktis real-time selama
              pertandingan membangun kemampuan komunikasi efektif dalam situasi tekanan tinggi. Tim
              yang berkomunikasi dengan baik di lapangan voli umumnya juga menunjukkan kemampuan
              komunikasi yang lebih baik dalam konteks sosial dan profesional lainnya.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Tim Voli {namaSekolahUppercase} dengan tradisi prestasi dalam turnamen antar sekolah
              mencerminkan sistem pembinaan yang efektif dan konsisten. Program seleksi yang
              transparan dan kompetitif memastikan bahwa setiap pemain yang mewakili sekolah adalah
              yang terbaik, sementara program pengembangan junior memastikan kesinambungan prestasi
              lintas generasi. Tradisi olahraga yang kuat ini menjadi bagian dari identitas dan
              kebanggaan sekolah yang diwariskan dari angkatan ke angkatan.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
