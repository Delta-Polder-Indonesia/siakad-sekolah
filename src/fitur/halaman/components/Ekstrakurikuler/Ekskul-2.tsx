import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul2Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/OSIS/cover.jpg`}
            alt="OSIS & MPK"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler OSIS & MPK
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 02
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Organisasi & Kepemimpinan
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            OSIS & MPK
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
              Organisasi Siswa Intra Sekolah (OSIS) dan Majelis Perwakilan Kelas (MPK) di SMA NEGERI
              1 MEDAN merupakan lembaga organisasi siswa yang menjadi laboratorium kepemimpinan
              paling langsung dan nyata dalam ekosistem sekolah. Berbeda dengan ekstrakurikuler lain
              yang berfokus pada pengembangan keterampilan spesifik, OSIS dan MPK memberikan
              pengalaman berorganisasi yang komprehensif—dari perencanaan program, pengelolaan
              anggaran, koordinasi antar divisi, hingga pertanggungjawaban publik kepada seluruh
              warga sekolah.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Struktur OSIS dengan pembagian seksi-seksi bidang mencerminkan struktur organisasi
              profesional yang akan dihadapi siswa dalam dunia kerja. Setiap seksi memiliki program
              kerja yang harus direncanakan, dianggarkan, dilaksanakan, dan dievaluasi secara
              sistematis. Pengurus OSIS belajar untuk membuat proposal kegiatan yang terstruktur,
              bernegosiasi dengan pihak sekolah mengenai sumber daya, mengelola panitia yang terdiri
              dari teman sebaya, dan menangani berbagai kendala yang muncul dalam pelaksanaan
              kegiatan. Pengalaman ini memberikan kompetensi manajerial yang jauh melampaui apa yang
              dapat diajarkan melalui teori di kelas.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              MPK sebagai badan legislatif siswa memainkan peran kritis dalam sistem demokrasi
              sekolah yang sehat. Anggota MPK yang mewakili setiap kelas berfungsi sebagai jembatan
              antara aspirasi siswa dan kebijakan sekolah, mengawasi kinerja OSIS, dan memastikan
              bahwa setiap keputusan organisasi memperhatikan kepentingan seluruh siswa. Pemahaman
              tentang mekanisme checks and balances, representasi demokratis, dan akuntabilitas
              publik yang diperoleh melalui MPK membentuk kesadaran sipil yang penting bagi generasi
              yang akan menjadi pemimpin bangsa.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Kemampuan komunikasi yang dikembangkan melalui OSIS dan MPK mencakup berbagai dimensi
              yang saling melengkapi. Dalam rapat, pengurus belajar untuk menyampaikan pendapat
              secara terstruktur, mendengarkan perspektif yang berbeda, dan mencapai konsensus
              melalui deliberasi yang konstruktif. Dalam pelaksanaan kegiatan, mereka belajar untuk
              berkomunikasi dengan berbagai pemangku kepentingan—dari siswa, guru, orang tua, hingga
              narasumber eksternal—dengan gaya dan pendekatan yang sesuai. Kemampuan komunikasi
              multidimensional ini merupakan kompetensi yang sangat dihargai dalam lingkungan
              profesional.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              OSIS dan MPK {namaSekolahUppercase} telah menghasilkan sejumlah pemimpin muda yang
              kemudian berkontribusi signifikan dalam berbagai bidang kehidupan bermasyarakat.
              Alumni yang pernah aktif dalam organisasi siswa umumnya menunjukkan kemampuan adaptasi
              yang lebih baik terhadap lingkungan kerja, kemampuan membangun relasi profesional yang
              lebih efektif, dan keberanian untuk mengambil inisiatif dan tanggung jawab. Warisan
              kepemimpinan ini menjadi bukti nyata bahwa investasi dalam pengembangan organisasi
              siswa memiliki dampak jangka panjang yang melampaui masa sekolah.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
