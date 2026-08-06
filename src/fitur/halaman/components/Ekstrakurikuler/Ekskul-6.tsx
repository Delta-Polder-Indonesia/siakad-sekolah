import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul6Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/Basket/cover.jpg`}
            alt="Basket"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Ekstrakurikuler Basket
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Ekstrakurikuler 06
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              Olahraga & Prestasi
            </span>
          </div>
          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Basket
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
              Ekstrakurikuler Basket {namaSekolahUppercase} telah lama menjadi salah satu kebanggaan
              sekolah dalam bidang prestasi olahraga. Bola basket sebagai olahraga menuntut
              perpaduan yang unik antara atletisme fisik, kecerdasan taktis, dan kemampuan bekerja
              sama dalam tim—kombinasi yang menjadikannya medium yang sangat efektif untuk
              pengembangan karakter dan kemampuan holistik siswa.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Program pengembangan teknik yang diterapkan dalam ekstrakurikuler basket mencakup
              fundamental skills seperti dribbling, passing, shooting, rebounding, dan defense yang
              dilatih secara sistematis dan progresif. Namun yang membedakan program basket SMA
              NEGERI 1 MEDAN adalah penekanan yang sama besarnya pada pengembangan basketball
              IQ—kemampuan membaca permainan, memahami spacing dan positioning, serta mengeksekusi
              sistem ofensif dan defensif yang telah dipelajari dalam tekanan pertandingan nyata.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Dinamika tim dalam basket sangat kaya dengan pelajaran tentang kepemimpinan dan
              kolaborasi. Seorang point guard yang memimpin serangan belajar tentang pengambilan
              keputusan di bawah tekanan dan tanggung jawab sebagai playmaker. Seorang center yang
              menjadi andalan dalam rebound dan pertahanan belajar tentang pengorbanan peran
              individual untuk kepentingan tim. Setiap posisi dalam basket mengajarkan tanggung
              jawab spesifik yang saling melengkapi, mencerminkan realitas organisasi di mana setiap
              anggota memiliki peran yang berbeda namun sama pentingnya.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Budaya basket yang berkembang di {namaSekolahUppercase} juga menciptakan komunitas
              yang positif dan inklusif. Lapangan basket sekolah menjadi ruang sosial di mana siswa
              dari berbagai latar belakang bertemu, berinteraksi, dan membangun persahabatan melalui
              kecintaan bersama terhadap olahraga ini. Komunitas yang terbentuk melalui basket
              seringkali melampaui batas-batas kelas dan angkatan, menciptakan jaringan sosial yang
              kuat dan mendukung dalam ekosistem sekolah.
            </p>
          </div>

          <div>
            <p className="ql-align-justify">
              Tim basket {namaSekolahUppercase} yang secara konsisten berprestasi dalam berbagai
              turnamen antar sekolah merupakan hasil dari sistem pembinaan jangka panjang yang tidak
              hanya berfokus pada tim varsity saat ini, melainkan juga pada pengembangan pemain muda
              melalui program junior yang berkelanjutan. Investasi dalam pengembangan atletik jangka
              panjang ini mencerminkan komitmen sekolah terhadap keunggulan yang berkelanjutan dan
              bukan sekadar prestasi sesaat.
            </p>
          </div>
        </div>
      </section>

      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
