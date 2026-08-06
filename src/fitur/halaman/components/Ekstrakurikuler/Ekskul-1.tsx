import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul1Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-1.jpg`}
            alt="Pramuka"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler Pramuka
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 01
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Kepemimpinan & Karakter
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Pramuka
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
              Gerakan Pramuka di {namaSekolahUppercase} merupakan ekstrakurikuler wajib yang telah
              menjadi bagian integral dari sistem pembentukan karakter siswa sejak sekolah ini
              berdiri. Dalam konteks pendidikan nasional, Pramuka bukan sekadar kegiatan kepanduan
              yang mengajarkan tali-temali dan navigasi alam; ia merupakan sistem pendidikan
              non-formal yang secara sistematis membangun kedisiplinan, kepemimpinan, kemandirian,
              dan solidaritas sosial melalui metode pembelajaran experiential yang terbukti efektif
              selama lebih dari satu abad.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Metodologi pembelajaran Pramuka yang mengandalkan pengalaman langsung di alam terbuka
              memberikan dimensi pedagogis yang tidak dapat digantikan oleh pembelajaran di dalam
              kelas. Ketika siswa menghadapi tantangan mendirikan tenda di tengah hujan, memasak
              menggunakan bahan terbatas, atau menentukan arah menggunakan kompas dan peta, mereka
              tidak hanya mengembangkan keterampilan teknis melainkan juga membangun ketahanan
              mental dan kemampuan pemecahan masalah di bawah tekanan. Dalam teori pendidikan, ini
              dikenal sebagai pembelajaran berbasis pengalaman atau experiential learning yang
              memperkuat retensi dan aplikasi pengetahuan secara signifikan dibandingkan metode
              ceramah konvensional.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Sistem regu dalam Pramuka mengajarkan prinsip-prinsip kepemimpinan dan kerja sama tim
              yang relevan dengan dunia kerja modern. Setiap anggota regu memiliki peran dan
              tanggung jawab spesifik, dan keberhasilan kelompok bergantung pada kontribusi dan
              koordinasi setiap individu. Pemimpin regu belajar untuk mendelegasikan tugas,
              mengambil keputusan di bawah ketidakpastian, dan mempertahankan moral kelompok dalam
              situasi sulit. Anggota regu belajar untuk mengikuti arahan dengan disiplin sekaligus
              berinisiatif ketika diperlukan. Dinamika ini mencerminkan realitas organisasi
              profesional yang akan dihadapi siswa dalam karir mereka.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Dasa Darma Pramuka, sebagai kode etik gerakan kepanduan Indonesia, menanamkan
              nilai-nilai moral yang komprehensif mulai dari ketakwaan kepada Tuhan, cinta alam dan
              kasih sayang sesama manusia, patriotisme, kedisiplinan, keberanian, kesetiaan, hemat
              dan cermat, hingga bertanggung jawab dan dapat dipercaya. Internalisasi nilai-nilai
              ini melalui kegiatan yang menyenangkan dan bermakna membentuk fondasi karakter yang
              kuat—karakter yang tidak hanya relevan untuk kehidupan profesional melainkan juga
              untuk kehidupan sebagai warga negara yang bertanggung jawab.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Prestasi Pramuka {namaSekolahUppercase} dalam berbagai kompetisi tingkat kota dan
              provinsi mencerminkan kualitas pembinaan yang konsisten dan komitmen siswa terhadap
              pengembangan diri. Namun, nilai sejati dari program Pramuka tidak hanya diukur dari
              trofi dan penghargaan; ia diukur dari perubahan yang terjadi pada diri setiap siswa
              yang telah menjalani proses kepanduan selama tiga tahun—dari siswa yang awalnya ragu
              menghadapi tantangan menjadi pemuda yang percaya diri, disiplin, dan siap mengabdi
              kepada masyarakat.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
