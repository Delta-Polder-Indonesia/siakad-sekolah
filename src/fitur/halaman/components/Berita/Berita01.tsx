import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Berita01Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);

  const JARAK_DARI_ATAS = 'pt-0';
  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      className={`fixed inset-0 z-50 overflow-y-auto bg-white font-sans text-slate-900 ${JARAK_DARI_ATAS}`}
    >
      {/* --- HERO IMAGE SECTION --- */}
      <div
        className={`relative min-h-[280px] w-full overflow-hidden bg-slate-100 ${TINGGI_FOTO} ${MAKSIMAL_TINGGI}`}
      >
        <div className="absolute top-6 left-6 z-20 flex flex-shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Tutup modal"
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
                {namaSekolahUppercase}
              </p>
            </div>
          </div>
        </div>

        {!imageError ? (
          <img
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.webp`}
            alt={`${namaSekolahUppercase} Raih Juara LKS`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Berita
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Prestasi
            </span>
            <time
              dateTime="2026-06-15"
              className="text-[10px] font-bold tracking-widest text-white/70 uppercase"
            >
              15 Juni 2026
            </time>
          </div>

          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            {namaSekolahUppercase} Raih Juara LKS Tingkat Provinsi
          </h1>
        </div>
      </div>

      {/* --- MODIFIKASI TERKINI: ARTIKEL ALA KORPORAT --- */}
      <section className="mx-auto max-w-[1200px] px-4 pt-8 pb-12 md:px-8 lg:px-12 lg:pt-10 lg:pb-16">
        {/* Metadata Artikel Tambahan & Fitur Bagikan */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
            <span className="text-slate-300">•</span>
            <time dateTime="2026-04-13">Senin, 13 April 2026</time>
          </div>

          {/* Tombol Share Media Sosial */}
          <ShareButtons />
        </div>

        {/* Konten Utama */}
        <div className="space-y-7 text-[16px] leading-relaxed text-slate-700 md:text-[17px] md:leading-loose">
          {/* Ringkasan dengan gaya Dropcap & font agak besar khas pers rilis profesional */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-blue-900 uppercase">
              <span className="h-3 w-1 bg-blue-600" />
              Ringkasan Berita
            </h2>
            <p className="text-justify first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:leading-none first-letter:font-bold first-letter:text-blue-900">
              Prestasi yang diraih oleh tim siswa {namaSekolahUppercase} dalam Lomba Kompetensi
              Siswa (LKS) bidang Rekayasa Perangkat Lunak tingkat Provinsi Jawa Barat membuka
              jendela bagi kita untuk mengamati lebih dalam dinamika pendidikan vokasi di
              Indonesia—khususnya bagaimana kompetisi akademik berfungsi sebagai katalisator
              transformasi kualitas pembelajaran. Kemenangan ini bukan sekadar peristiwa insidental
              yang patut dibanggakan secara ceremonial; lebih dari itu, ia merefleksikan sebuah
              ekosistem pendidikan yang mampu mengkonversikan potensi siswa menjadi produktivitas
              nyata melalui pendekatan pembelajaran berbasis proyek dan bimbingan yang terstruktur.
              Dalam konteks pendidikan kejuruan, di mana tujuan utamanya adalah mempersiapkan
              lulusan yang siap bersaing di dunia kerja, kompetisi seperti LKS beroperasi sebagai
              proxy—sebuah simulasi yang mendekati kondisi riil industri teknologi informasi, di
              mana tekanan waktu, standar kualitas, dan kebutuhan inovasi harus dipenuhi secara
              simultan.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Persiapan yang dilakukan selama berbulan-bulan oleh tim {namaSekolahUppercase}
              mengindikasikan adanya proses pembelajaran yang jauh melampaui paradigma{' '}
              <i>teaching to the test</i> yang sering dikritik dalam sistem pendidikan konvensional.
              Bimbingan intensif dari guru pembimbing tidak hanya berarti transfer pengetahuan
              teknis semata, melainkan juga pembentukan habitus profesional—sebuah disposisi mental
              yang memungkinkan siswa untuk berpikir kritis, bekerja dalam tim, dan mengelola
              kompleksitas proyek teknologi.
            </p>
          </div>

          {/* Korporat Highlight / Pull Quote */}
          <blockquote className="my-8 border-l-4 border-blue-600 bg-slate-50 px-6 py-4 text-slate-800 italic md:text-lg">
            "LKS beroperasi sebagai proxy—sebuah simulasi yang mendekati kondisi riil industri
            teknologi informasi, di mana tekanan waktu, standar kualitas, dan kebutuhan inovasi
            harus dipenuhi secara simultan."
          </blockquote>

          <div>
            <p className="text-justify">
              Keikutsertaan 27 kabupaten/kota dalam kompetisi ini juga memberi petunjuk mengenai
              demokratisasi akses terhadap pendidikan teknologi di Jawa Barat. Namun, demokratisasi
              dalam hal kuantitas peserta perlu dibedakan dengan kesetaraan dalam hal kualitas
              persiapan. Kemenangan {namaSekolahUppercase} mengisyaratkan adanya kesenjangan dalam
              kapasitas infrastruktur, kualitas bimbingan, atau ekosistem pendukung yang dimiliki
              oleh sekolah-sekolah lainnya.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Proyek aplikasi mobile yang dinilai tertinggi oleh juri menarik untuk dikaji dari sisi
              epistemologi rekayasa perangkat lunak. Aplikasi mobile, sebagai medium yang paling
              intim dengan kehidupan sehari-hari pengguna, menuntut pemahaman mendalam terhadap
              perilaku manusia, konteks sosial, dan kebutuhan praktis. Inovasi dalam bidang ini
              tidak selalu berarti menciptakan teknologi yang sepenuhnya baru, melainkan sering kali
              berupa rekombinasi cerdas dari solusi yang ada untuk menjawab masalah spesifik.
            </p>
          </div>

          {/* TEMPLATE SISIPAN FOTO DI TENGAH ARTIKEL - DIBUAT EMAS & ELEGAN */}
          <div className="my-10 space-y-3">
            <div className="max-h-[480px] overflow-hidden rounded-lg bg-slate-100 shadow-md">
              <img
                src={`${import.meta.env.BASE_URL}images/HalamanKami/profil/gedung-utama.jpg`}
                alt="Dokumentasi Kegiatan Siswa"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
            <p className="border-l border-slate-300 pl-3 text-left text-xs tracking-wide text-slate-500">
              <span className="font-semibold text-slate-700">Dokumentasi internal:</span> Proses
              pengerjaan proyek aplikasi mobile oleh tim rekayasa perangkat lunak.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Tiket menuju tingkat nasional yang akan berlangsung pada September mendatang membawa
              konsekuensi tersendiri. Pada level provinsi, kompetisi masih beroperasi dalam kerangka
              familiaritas—peserta berkompetisi dalam ekosistem yang relatif homogen dari segi
              budaya, akses informasi, dan standar teknis. Namun, ketika arena beralih ke tingkat
              nasional, variabel-variabel tersebut menjadi jauh lebih heterogen. Tim SMA NEGERI 1
              MEDAN akan berhadapan dengan peserta dari sekolah-sekolah unggulan di provinsi lain
              yang mungkin memiliki tradisi lebih panjang dalam rekayasa perangkat lunak.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Dukungan yang diberikan oleh seluruh warga sekolah mencerminkan fungsi sosial dari
              pendidikan yang sering kali terabaikan dalam analisis berbasis output: pembentukan
              komunitas pembelajaran yang saling menguatkan. Dalam literatur sosiologi pendidikan,
              fenomena ini dikenal sebagai <i>collective efficacy</i>—keyakinan bersama bahwa
              komunitas sekolah mampu mencapai tujuan-tujuan pembelajaran yang signifikan.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Refleksi atas kemenangan ini mengarahkan kita pada pertanyaan yang lebih luas mengenai
              arah pendidikan vokasi Indonesia. Dalam era di mana teknologi berubah dengan kecepatan
              eksponensial, kompetensi spesifik dalam satu bahasa pemrograman atau satu kerangka
              kerja dapat menjadi usang dalam hitungan tahun. Oleh karena itu, nilai fundamental
              dari pengalaman LKS bukan terletak pada aplikasi mobile yang berhasil dikembangkan,
              melainkan pada kapasitas metakognitif yang dibangun selama prosesnya.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <ProgramFooter onNavigate={onNavigate} />
      {/* FLOATING NAV — taruh paling bawah, di luar section */}
      <FloatingNav contentId="berita-01" />
    </div>
  );
}
