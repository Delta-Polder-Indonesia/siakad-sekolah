import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../routes';
import ProgramFooter from '../../../../layout/ProgramFooter';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function SekolahBerdampakPage() {
  const navigate = useNavigate();
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900">
      <div className="relative h-[90vh] max-h-[650px] min-h-[280px] w-full overflow-hidden bg-slate-100">
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
                SMA Berdampak
              </p>
            </div>
          </div>
        </div>
        {!imageError ? (
          <img
            src={`${import.meta.env.BASE_URL}images/HalamanKami/Beranda/smknu_pkl-2024.webp`}
            alt={`${namaSekolah} Berdampak`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            {namaSekolahUppercase} Berdampak
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              SMA Berdampak
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Inisiatif Nyata
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white drop-shadow-lg md:text-2xl lg:text-3xl">
            {namaSekolahUppercase} Berdampak — Menuju Dampak Nyata bagi Bangsa
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-20 md:px-12 md:pt-16 md:pb-28">
        <div className="border-b-4 border-double border-gray-900 pb-0 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-slate-900 uppercase md:text-4xl">
            Menuju Dampak Nyata bagi Bangsa
          </h2>
          <div className="mt-6 mb-4 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
              <span className="text-slate-300">•</span>
              <time dateTime="2026-07-01">Tahun Ajaran 2026/2027</time>
            </div>
            <ShareButtons />
          </div>
        </div>
        <div className="mb-10 pt-8 md:mb-12">
          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-800 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
            Melanjutkan visi Sekolah Unggul, {namaSekolahUppercase} Berdampak menekankan pada hasil
            nyata dan kontribusi konkret bagi pembangunan nasional melalui pendidikan, inovasi, dan
            pengabdian kepada masyarakat. Program ini merupakan wujud komitmen sekolah dalam
            menciptakan dampak positif yang terukur.
          </p>
        </div>
        <div className="space-y-6">
          <section>
            <h3 className="mb-3 font-sans text-base font-bold text-gray-900 uppercase">
              Magang Berdampak
            </h3>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Program magang yang dirancang untuk memberikan pengalaman kerja nyata kepada siswa di
              berbagai industri dan instansi. Siswa tidak hanya belajar keterampilan teknis, tetapi
              juga berkontribusi langsung pada operasional dan pengembangan mitra magang.
            </p>
          </section>
          <section>
            <h3 className="mb-3 font-sans text-base font-bold text-gray-900 uppercase">
              KKN-T Berdampak
            </h3>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Kuliah Kerja Nyata Tematik (KKN-T) Berdampak merupakan program pengabdian masyarakat
              yang melibatkan siswa dalam proyek-proyek pembangunan desa, pemberdayaan masyarakat,
              dan solusi masalah sosial secara langsung di lapangan.
            </p>
          </section>
          <section>
            <h3 className="mb-3 font-sans text-base font-bold text-gray-900 uppercase">
              Siswa Berdampak
            </h3>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Program pengembangan kepemimpinan dan kewirausahaan sosial yang mendorong siswa untuk
              menjadi agen perubahan di lingkungan sekitarnya. Siswa didorong untuk memulai
              inisiatif sosial yang memberikan manfaat berkelanjutan bagi masyarakat.
            </p>
          </section>
        </div>
      </div>
      <ProgramFooter />
      <FloatingNav contentId="sekolah-berdampak" />
    </div>
  );
}
