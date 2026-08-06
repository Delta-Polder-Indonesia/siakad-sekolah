import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul3Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/Rohis/cover.jpg`}
            alt="Rohis"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler Rohis
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 03
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Keagamaan & Spiritual
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Rohis (Rohani Islam)
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
              Rohani Islam (Rohis) di {namaSekolahUppercase} merupakan wadah pembinaan spiritual dan
              keagamaan yang dirancang untuk memperkuat fondasi iman, memperdalam pemahaman ajaran
              Islam, dan membentuk akhlak mulia pada siswa muslim. Dalam era modern yang penuh
              dengan distraksi dan tekanan sosial, Rohis menyediakan ruang yang aman dan konstruktif
              bagi siswa untuk mengeksplorasi dimensi spiritual kehidupan mereka secara komunal dan
              terbimbing.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Program kajian rutin yang menjadi inti kegiatan Rohis memberikan pemahaman Islam yang
              komprehensif dan kontekstual. Bukan sekadar hafalan ayat dan hadits, kajian Rohis di
              {namaSekolahUppercase} dirancang untuk membantu siswa memahami relevansi ajaran Islam
              dalam konteks kehidupan modern—bagaimana prinsip-prinsip etika Islam dapat memandu
              pengambilan keputusan di era digital, bagaimana konsep syukur dan sabar dapat
              membangun ketahanan mental menghadapi tekanan akademik, dan bagaimana nilai-nilai
              keadilan dan kepedulian sosial dalam Islam dapat mendorong keterlibatan aktif dalam
              komunitas.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Kegiatan sosial dan dakwah yang diselenggarakan Rohis mengembangkan dimensi kepedulian
              dan pengabdian masyarakat yang merupakan bagian integral dari ajaran Islam. Melalui
              program zakat, infak, dan sedekah yang terorganisir, bakti sosial di komunitas
              sekitar, dan program mentoring keagamaan bagi teman sebaya, anggota Rohis belajar
              bahwa spiritualitas yang autentik tidak hanya berdimensi vertikal dalam hubungan
              dengan Tuhan, melainkan juga berdimensi horizontal dalam hubungan dengan sesama
              manusia dan lingkungan.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Pelatihan public speaking Islami melalui kegiatan ceramah, MC acara keagamaan, dan
              pemandu kajian mengembangkan kemampuan komunikasi anggota Rohis yang tidak hanya
              relevan dalam konteks keagamaan melainkan juga dalam kehidupan profesional. Kemampuan
              untuk berbicara di hadapan publik dengan tenang, terstruktur, dan persuasif adalah
              kompetensi yang sangat dihargai di berbagai bidang karir, dan Rohis memberikan
              platform yang aman dan mendukung untuk mengembangkan kemampuan ini.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Rohis {namaSekolahUppercase} juga berperan penting dalam membentuk budaya sekolah yang
              inklusif dan saling menghormati. Dengan mengedepankan nilai-nilai Islam rahmatan lil
              alamin—Islam sebagai rahmat bagi seluruh alam semesta—Rohis mendorong anggotanya untuk
              membangun hubungan yang harmonis dengan semua warga sekolah tanpa memandang perbedaan
              latar belakang. Pendekatan Islam yang moderat, toleran, dan menghargai keberagaman
              yang ditanamkan melalui Rohis merupakan kontribusi penting dalam membangun generasi
              Muslim Indonesia yang mampu menjadi agen perdamaian dan kemajuan bangsa.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
