import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul8Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/TariTradisional/cover.jpg`}
            alt="Tari Tradisional"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler Tari Tradisional
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 08
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Seni & Budaya
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Tari Tradisional
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
              Ekstrakurikuler Tari Tradisional {namaSekolahUppercase} merupakan program pelestarian
              dan pengembangan seni budaya yang memiliki dimensi pedagogis yang jauh lebih dalam
              daripada sekadar belajar gerak tari. Tari tradisional, dengan kekayaan dan kedalaman
              maknanya, adalah medium untuk memahami dan mewarisi kearifan lokal, nilai-nilai
              filosofis, dan identitas kultural yang telah dibangun oleh leluhur selama
              berabad-abad. Dalam era globalisasi yang mengancam homogenisasi budaya, program ini
              menjadi benteng pelestarian yang aktif dan kontekstual.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Repertoar tari yang dipelajari dalam program ini mencakup berbagai tari tradisional
              dari berbagai daerah di Sumatera Utara, termasuk Tari Tor-Tor yang merupakan tari
              tradisional Batak dengan filosofi dan ritual yang mendalam, serta tari-tari dari etnis
              lain yang memperkaya keragaman budaya Medan dan sekitarnya. Setiap tari yang
              dipelajari bukan hanya sebagai serangkaian gerakan, melainkan sebagai teks budaya yang
              harus dipahami konteks sejarah, makna simbolik, dan fungsi sosialnya. Pendekatan
              pembelajaran yang holistik ini mengembangkan apresiasi budaya yang autentik dan
              mendalam.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Aspek fisik dari latihan tari tradisional tidak boleh diremehkan. Gerakan tari yang
              membutuhkan keseimbangan, fleksibilitas, koordinasi, dan kesadaran tubuh yang tinggi
              merupakan latihan fisik yang komprehensif. Kemampuan untuk mengontrol setiap bagian
              tubuh—dari gerakan jari yang halus hingga langkah kaki yang kuat—sambil mempertahankan
              ekspresi wajah yang sesuai dan sinkronisasi dengan musik membutuhkan tingkat
              konsentrasi dan pengendalian tubuh yang tinggi. Kualitas fisik yang dikembangkan
              melalui tari tradisional, termasuk postur yang baik dan kesadaran kinestetik,
              bermanfaat dalam berbagai aspek kehidupan.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Penampilan tari dalam berbagai acara sekolah dan kompetisi seni budaya mengembangkan
              kepercayaan diri dan kemampuan berekspresi di hadapan publik. Pengalaman tampil di
              atas panggung, dengan segala persiapan dan tekanan yang menyertainya, membangun
              keberanian dan kemampuan manajemen kecemasan yang relevan dalam berbagai situasi
              kehidupan. Siswa yang terbiasa tampil dalam pementasan tari umumnya menunjukkan
              tingkat kepercayaan diri yang lebih tinggi dalam presentasi akademis dan wawancara
              profesional.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Program Tari Tradisional {namaSekolahUppercase} juga berkontribusi pada diplomasi
              budaya di tingkat yang lebih luas. Ketika siswa menampilkan tari tradisional dalam
              acara-acara yang melibatkan tamu dari luar daerah atau bahkan mancanegara, mereka
              menjadi duta budaya yang memperkenalkan kekayaan seni Indonesia kepada dunia.
              Kesadaran akan peran diplomatik ini menanamkan rasa bangga terhadap warisan budaya
              bangsa dan motivasi untuk terus melestarikan dan mengembangkannya.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
