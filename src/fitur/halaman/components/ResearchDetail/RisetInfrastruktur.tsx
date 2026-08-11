import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../routes';
import ProgramFooter from '../../../../layout/ProgramFooter';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function RisetInfrastrukturPage() {
  const navigate = useNavigate();
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900">
      {/* ================= BANNER / HERO CONTAINER (STILUSU + NAV ASLI KAMU) ================= */}
      <section className="hero-container relative overflow-hidden bg-[#037237]">
        {/* Tombol Back & Logo Sekolah */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
          >
            <svg
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
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full shadow-md">
              <img
                src={`${import.meta.env.BASE_URL}images/logo/gambar-2.svg`}
                alt={`Logo ${namaSekolahUppercase}`}
                className="h-full w-full object-cover"  loading="lazy" decoding="async" />
            </div>
            <div>
              <p className="text-sm leading-tight font-bold tracking-tight text-white drop-shadow-md">
                {namaSekolahUppercase}
              </p>
              <p className="text-[9px] font-semibold tracking-widest text-white/80 uppercase drop-shadow">
                Artikel Penelitian
              </p>
            </div>
          </div>
        </div>

        {/* BANNER SECTION (100% Menggunakan Class & Struktur HTML dari USU) */}
        <section className="usu-banner main-container 2md:h-80 xs:[&_h1:first-child]:text-[22px] xs:[&_h1:first-child]:leading-[30px] flex h-[240px] items-center xl:h-[400px] [&_h1:first-child]:text-sm [&_h1:first-child]:leading-[22px] md:[&_h1:first-child]:!text-4xl md:[&_h1:first-child]:!leading-[44px]">
          <div className="main-layout m-0 w-full px-6 pt-12 md:px-12 md:pt-16">
            <div className="relative z-[2] flex flex-col gap-1 lg:gap-2">
              <h1 className="text-scale-6 2md:text-[3rem] 2md:leading-tight w-[80%] max-w-[740px] font-bold text-white">
                Pengembangan Bahan Ramah Lingkungan untuk Infrastruktur Sekolah
              </h1>
              <h1 className="text-scale-0-b text-secondary-1 leading-5 font-semibold text-[#facc15]">
                — {namaSekolahUppercase}
              </h1>
            </div>
          </div>

          {/* GAMBAR SEBELAH KANAN (100% Class USU) */}
          {!imageError ? (
            <img
              alt="Banner"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              className="absolute top-0 right-0 z-[1] h-full w-1/2 object-cover object-center"
              src={`${import.meta.env.BASE_URL}images/Dashboard/logo-profile.webp`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute top-0 right-0 z-[1] flex h-full w-1/2 items-center justify-center bg-slate-800 text-xs font-bold text-white uppercase">
              Riset Infrastruktur
            </div>
          )}

          {/* Transisi Gradien Hijau Agar Gambar Menyatu */}
          <div className="pointer-events-none absolute top-0 right-0 z-[1] h-full w-1/2 bg-gradient-to-r from-[#037237] via-[#037237]/40 to-transparent" />
        </section>
      </section>
      {/* ================= END BANNER / HERO CONTAINER ================= */}

      {/* SISA KODE DI BAWAH SAMA PERSIS DENGAN KODE TEMPLATE KAMU */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-20 md:px-12 md:pt-16 md:pb-28">
        <div className="border-b-4 border-double border-gray-900 pb-0 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-slate-900 uppercase md:text-4xl">
            Pengembangan Bahan Ramah Lingkungan untuk Infrastruktur Sekolah
          </h2>
          <div className="mt-6 mb-4 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Oleh: Tim Riset</span>
              <span className="text-slate-300">•</span>
              <time dateTime="2026-06-18">18 Juni 2026</time>
            </div>
            <ShareButtons />
          </div>
        </div>
        <div className="mb-10 pt-8 md:mb-12">
          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-800 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
            Penelitian ini berfokus pada pengembangan material ramah lingkungan yang dapat digunakan
            untuk pembangunan dan renovasi infrastruktur sekolah. Bahan yang dikembangkan berasal
            dari sumber daya lokal yang terbarukan dan memiliki jejak karbon yang minim.
          </p>
        </div>
        <div className="space-y-6">
          <section>
            <h3 className="mb-3 font-sans text-base font-bold text-gray-900 uppercase">
              Tujuan Penelitian
            </h3>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Penelitian ini bertujuan untuk menciptakan alternatif bahan bangunan yang lebih ramah
              lingkungan, ekonomis, dan sesuai dengan standar keamanan infrastruktur pendidikan.
              Hasil penelitian diharapkan dapat diterapkan di sekolah-sekolah lain.
            </p>
          </section>
          <section>
            <h3 className="mb-3 font-sans text-base font-bold text-gray-900 uppercase">
              Metode &amp; Hasil
            </h3>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Material dikembangkan melalui proses riset dan pengujian laboratorium yang ketat.
              Hasil awal menunjukkan bahwa bahan ramah lingkungan yang dikembangkan memiliki daya
              tahan yang setara dengan material konvensional dengan biaya produksi yang lebih
              rendah.
            </p>
          </section>
        </div>
      </div>
      <ProgramFooter />
      <FloatingNav contentId="riset-infrastruktur" />
    </div>
  );
}
