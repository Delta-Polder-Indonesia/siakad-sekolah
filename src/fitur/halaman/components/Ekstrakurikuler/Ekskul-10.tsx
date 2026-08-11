import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul10Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/Jurnalistik/cover.jpg`}
            alt="Jurnalistik"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler Jurnalistik
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 10
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Literasi & Komunikasi
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Jurnalistik
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
              Ekstrakurikuler Jurnalistik {namaSekolahUppercase} merupakan program yang
              mempersiapkan siswa untuk menjadi komunikator yang terampil, pemikir yang kritis, dan
              pencerita yang efektif melalui berbagai disiplin jurnalistik. Dalam era informasi yang
              dibanjiri oleh konten dari berbagai sumber dengan kualitas yang sangat bervariasi,
              kemampuan untuk memproduksi dan mengonsumsi informasi secara kritis dan bertanggung
              jawab menjadi kompetensi fundamental yang dibutuhkan setiap warga negara di abad
              ke-21.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Kurikulum jurnalistik yang diterapkan di {namaSekolahUppercase} mencakup berbagai
              genre penulisan yang membutuhkan pendekatan dan keterampilan yang berbeda. Penulisan
              berita langsung (straight news) mengajarkan prinsip objektivitas, akurasi, dan
              strukturisasi informasi berdasarkan tingkat kepentingannya menggunakan teknik piramida
              terbalik. Penulisan feature mengembangkan kemampuan bercerita yang kaya dengan detail
              dan narasi yang menarik tanpa mengorbankan akurasi fakta. Penulisan opini dan
              editorial melatih kemampuan argumentasi yang logis dan berdasarkan bukti. Setiap genre
              ini mengembangkan aspek yang berbeda dari kemampuan berpikir dan berkomunikasi yang
              saling melengkapi.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Proses peliputan yang melibatkan riset mendalam, wawancara dengan narasumber,
              verifikasi fakta, dan penyuntingan kritis mengembangkan disiplin intelektual yang
              tinggi. Siswa jurnalistik belajar untuk tidak menerima informasi begitu saja,
              melainkan untuk selalu mempertanyakan sumber, mencari perspektif yang berbeda, dan
              memisahkan fakta dari opini. Kemampuan berpikir kritis ini—yang merupakan inti dari
              praktik jurnalistik yang baik—merupakan salah satu kompetensi paling berharga yang
              dapat dimiliki individu di era hoaks dan disinformasi.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Produksi media sekolah melalui majalah dinding, buletin, dan konten digital memberikan
              platform nyata bagi siswa untuk mempublikasikan karya mereka kepada audiens yang
              sesungguhnya. Pengalaman melihat tulisan mereka dibaca oleh ratusan warga sekolah
              menciptakan rasa tanggung jawab terhadap akurasi dan dampak informasi yang jauh lebih
              nyata daripada sekadar mengerjakan tugas menulis untuk guru. Tanggung jawab editorial
              yang sesungguhnya ini mendorong standar kualitas yang lebih tinggi dan kesadaran akan
              etika publikasi.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Jurnalistik {namaSekolahUppercase} dalam perspektif yang lebih luas berkontribusi pada
              penguatan ekosistem informasi sekolah yang sehat. Media sekolah yang dikelola dengan
              standar jurnalistik yang baik memberikan informasi yang akurat, menjadi forum diskusi
              yang konstruktif, dan mencatat sejarah komunitas sekolah untuk generasi mendatang.
              Alumni jurnalistik sekolah banyak yang melanjutkan minat dan keterampilan mereka ke
              karir di bidang komunikasi, media, hukum, kebijakan publik, dan berbagai profesi lain
              yang menuntut kemampuan komunikasi yang kuat dan pemikiran yang analitis.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
