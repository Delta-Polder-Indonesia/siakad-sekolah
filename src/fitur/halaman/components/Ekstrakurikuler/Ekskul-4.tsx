import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul4Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/Paskibra/cover.jpg`}
            alt="Paskibra"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler Paskibra
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 04
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Nasionalisme & Kedisiplinan
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Paskibra
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
              Pasukan Pengibar Bendera (Paskibra) {namaSekolahUppercase} merupakan ekstrakurikuler
              yang menempatkan nilai kedisiplinan, kekompakan, dan nasionalisme sebagai fondasi
              utama pembentukannya. Dalam setiap gerakan yang teratur, setiap langkah yang seirama,
              dan setiap upacara yang dilaksanakan dengan penuh khidmat, Paskibra mengajarkan bahwa
              kebesaran sebuah bangsa tercermin dari cara generasi mudanya menghormati simbol-simbol
              kedaulatan negara.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Proses latihan Paskibra yang intensif dan terstruktur mengembangkan dimensi fisik,
              mental, dan sosial secara simultan. Secara fisik, latihan baris-berbaris yang
              membutuhkan presisi gerakan, stamina, dan koordinasi tubuh yang baik membentuk postur,
              kesehatan, dan kesadaran kinestetik anggota. Secara mental, tuntutan untuk
              mempertahankan konsentrasi penuh selama latihan berjam-jam, menghafal prosedur upacara
              yang kompleks, dan tampil sempurna di hadapan publik membentuk ketahanan mental dan
              kemampuan manajemen tekanan. Secara sosial, keharusan untuk bergerak seirama dengan
              seluruh anggota pasukan mengajarkan nilai penyatuan diri dalam kolektivitas dan
              pengorbanan ego untuk kepentingan kelompok.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Kepercayaan yang diberikan kepada anggota Paskibra untuk memimpin upacara bendera pada
              peringatan hari-hari nasional yang sakral merupakan kehormatan sekaligus tanggung
              jawab yang membentuk rasa bangga dan komitmen terhadap negara. Momen ketika bendera
              Merah Putih berkibar sempurna di bawah terik matahari sementara seluruh hadirin
              berdiri dengan hormat adalah pengalaman yang menanamkan makna nasionalisme secara
              visceral dan tidak terlupakan—jauh lebih mendalam daripada sekadar membaca tentang
              patriotisme dalam buku teks.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Paskibra {namaSekolahUppercase} secara rutin berpartisipasi dalam seleksi Paskibra
              tingkat kota dan provinsi, memberikan kesempatan bagi anggota terbaik untuk mewakili
              sekolah dan daerah dalam upacara peringatan kemerdekaan. Proses seleksi yang ketat dan
              kompetitif ini tidak hanya mendorong setiap anggota untuk memberikan performa terbaik
              mereka, melainkan juga membangun mentalitas kompetitif yang sehat dan kemampuan untuk
              bangkit dari kegagalan dengan lebih kuat.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Dalam perspektif yang lebih luas, Paskibra berkontribusi pada pembentukan karakter
              warga negara yang aktif dan bertanggung jawab. Alumni Paskibra {namaSekolahUppercase}
              umumnya membawa nilai-nilai kedisiplinan, keteladanan, dan rasa tanggung jawab yang
              tertanam kuat dari pengalaman kepaskibraan mereka ke dalam kehidupan profesional dan
              sosial mereka. Mereka adalah individu yang memahami bahwa kebesaran sebuah bangsa
              dibangun dari kedisiplinan dan integritas setiap warganya.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
