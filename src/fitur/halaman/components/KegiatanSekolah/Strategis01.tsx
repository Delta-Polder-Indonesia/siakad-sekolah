import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Strategis01Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900"
    >
      {/* ── HEADER & HERO BANNER ── */}
      <div
        className={`relative min-h-[280px] w-full overflow-hidden bg-slate-100 ${TINGGI_FOTO} ${MAKSIMAL_TINGGI}`}
      >
        <div className="absolute top-6 left-6 z-20 flex flex-shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Tutup modal dan kembali ke halaman Kegiatan Sekolah"
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
              <p className="text-sm leading-tight font-bold tracking-tight text-white drop-shadow-md md:text-base lg:text-lg">
                {namaSekolahUppercase}
              </p>
              <p className="hidden text-[9px] font-semibold tracking-[0.12em] text-white/80 uppercase drop-shadow sm:block">
                SMA Unggulan Yang Menghasilkan SDM Bermutu
              </p>
            </div>
          </div>
        </div>

        {!imageError ? (
          <img
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-1.jpg`}
            alt="Masa Pengenalan Lingkungan Sekolah"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Kegiatan 01
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Kegiatan Strategis 01
            </span>
            <time
              dateTime="2026-07-01"
              className="text-[10px] font-bold tracking-widest text-white/70 uppercase"
            >
              Juli 2026
            </time>
          </div>

          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Masa Pengenalan Lingkungan Sekolah
          </h1>
        </div>
      </div>

      {/* ── BAGIAN ARTIKEL KORAN ── */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-20 md:px-12 md:pt-16 md:pb-28">
        {/* Kontainer Pembatas Garis Ganda Koran */}
        <div className="border-b-4 border-double border-gray-900 pt-14 pb-0 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-slate-900 uppercase md:text-4xl">
            Masa Pengenalan Lingkungan Sekolah
          </h2>

          {/* Metadata Artikel & Tombol Bagikan di dalam pembatas */}
          <div className="mt-6 mb-4 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
              <span className="text-slate-300">•</span>
              <time dateTime="2026-07-10">Jumat, 10 Juli 2026</time>
            </div>
            <ShareButtons />
          </div>
        </div>

        {/* HERO ARTIKEL (Drop Cap pada huruf pertama paragraf awal) */}
        <div className="mb-10 pt-8 md:mb-12">
          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-800 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
            Masa Pengenalan Lingkungan Sekolah (MPLS) yang dilaksanakan bagi siswa baru SMA NEGERI 1
            MEDAN merupakan sebuah ritual transisi yang jauh melampaui fungsi orientasi spasial
            semata. Dalam perspektif antropologi pendidikan, MPLS beroperasi sebagai "rite of
            passage"—sebuah upacara peralihan yang secara simbolik membawa individu dari status
            "outsider" (calon siswa) ke status "insider" (anggota komunitas sekolah). Proses ini
            tidak hanya memperkenalkan siswa pada layout fisik kampus, letak ruang kelas, atau
            lokasi fasilitas praktikum; lebih fundamental lagi, ia menginisiasi siswa ke dalam
            "habitus" sekolah—sebuah disposisi kolektif yang mencakup norma, nilai, bahasa, dan cara
            berinteraksi yang menjadi identitas bersama komunitas pembelajaran. Tanpa inisiasi ini,
            siswa baru berisiko mengalami "cultural shock" yang dapat menghambat adaptasi akademik
            dan sosialnya selama bertahun-tahun ke depan.
          </p>
        </div>

        {/* SPACING KONTEN UTAMA */}
        <div className="space-y-6">
          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Dirancang secara khusus agar siswa baru dapat beradaptasi dengan suasana sekolah baru
              secera positif dan menyenangkan, MPLS {namaSekolahUppercase} mencerminkan pemahaman
              mendalam terhadap psikologi perkembangan remaja. Pada usia masuk sekolah menengah
              atas—biasanya sekitar 15 hingga 16 tahun—siswa berada pada fase identitas versus
              kebingungan peran, sebagaimana dikemukakan Erik Erikson. Fase ini ditandai oleh
              pencarian jati diri, kebutuhan akan afiliasi kelompok sebaya, dan sensitivitas
              terhadap penerimaan atau penolakan sosial. MPLS yang berhasil tidak memaksakan
              adaptasi melalui disiplin rigid semata, melainkan menciptakan kondisi psikologis yang
              aman di mana siswa merasa diterima, dihargai, dan termotivasi untuk berkontribusi.
              Pendekatan ini berbeda secara kualitatif dari orientasi tradisional yang sering kali
              menekankan pada penaklukan dan penundukan, yang meskipun efektif dalam jangka pendek,
              dapat menimbulkan trauma dan resistensi jangka panjang.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Memperkenalkan siswa baru pada lingkungan dan budaya sekolah merupakan tujuan pertama
              yang tampak sederhana namun memiliki lapisan kompleksitas yang dalam. Lingkungan
              sekolah, dalam konteks ini, bukan hanya entitas fisik—bangunan, lapangan,
              laboratorium—melainkan juga entitas sosial dan simbolik. Siswa perlu memahami tidak
              hanya di mana ruang kelas X berada, tetapi juga siapa saja aktor kunci dalam ekosistem
              sekolah (kepala sekolah, wakasek, guru mata pelajaran, pembimbing OSIS, petugas tata
              usaha), bagaimana hierarki komunikasi berfungsi, dan di mana mereka dapat mencari
              bantuan ketika menghadapi kesulitan. Budaya sekolah, di sisi lain, mencakup tradisi
              yang tidak tertulis: bagaimana cara menyapa guru, norma berpakaian yang diterapkan,
              etika penggunaan fasilitas bersama, hingga ritual-ritual kecil seperti apel pagi atau
              upacara bendera. Pemahaman terhadap dimensi-dimensi ini tidak dapat diperoleh dari
              buku panduan semata; ia memerlukan interaksi langsung, observasi, dan partisipasi
              aktif yang disediakan oleh MPLS.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Membangun rasa kekeluargaan dan persahabatan antar siswa merupakan tujuan kedua yang
              berkaitan erat dengan dimensi sosial-emosional dari pendidikan. Dalam literatur
              psikologi pendidikan, sense of belonging—perasaan menjadi bagian dari
              komunitas—merupakan prediktor kuat terhadap motivasi belajar, retensi akademik, dan
              kesejahteraan psikologis siswa. Siswa yang merasa terhubung dengan teman sebayanya
              memiliki probabilitas lebih tinggi untuk hadir secara aktif di kelas, berpartisipasi
              dalam kegiatan ekstrakurikuler, dan mencari bantuan ketika menghadapi kesulitan
              akademik. MPLS, melalui berbagai kegiatan kelompok, permainan peran, dan proyek
              kolaboratif, menciptakan kesempatan awal bagi siswa untuk membentuk ikatan sosial yang
              dapat berkembang menjadi jaringan dukungan sepanjang masa studi mereka. Namun,
              efektivitas kegiatan ini sangat bergantung pada desainnya: apakah semua siswa,
              termasuk yang introvert atau berasal dari latar belakang yang berbeda, mendapatkan
              kesempatan yang setara untuk berpartisipasi dan dikenali?
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Mensosialisasikan tata tertib dan program akademik sekolah merupakan dimensi
              instrumental dari MPLS yang berfungsi sebagai fondasi operasional bagi kehidupan
              sekolah yang teratur. Tata tertib, meskipun sering kali dianggap sebagai sekumpulan
              aturan pembatas, sebenarnya mencerminkan kesepakatan kolektif mengenai standar
              perilaku yang diperlukan untuk menciptakan lingkungan belajar yang kondusif. Ketika
              siswa memahami "rationale" di balik setiap aturan—mengapa ketepatan waktu penting,
              mengaya kebersihan bersama menjadi tanggung jawab semua, mengapa integritas akademik
              tidak dapat ditawar—mereka lebih cenderung menginternalisasi aturan tersebut sebagai
              bagian dari identitas moral mereka, bukan sebagai beban eksternal yang harus dituruti
              demi menghindari sanksi. Sosialisasi program akademik, di sisi lain, membantu siswa
              memetakan perjalanan pembelajaran mereka selama tiga tahun ke depan: mata pelajaran
              apa saja yang akan dihadapi, kompetensi apa yang harus dicapai pada setiap semester,
              dan bagaimana struktur kurikulum disusun untuk mempersiapkan mereka pada jenjang
              pendidikan lanjutan maupun dunia kerja.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Memotivasi siswa untuk berprestasi sejak awal tahun ajaran merupakan tujuan yang
              menempatkan MPLS dalam kerangka "positive psychology"—pendekatan yang menekankan pada
              pengembangan kekuatan, potensi, dan kondisi yang memungkinkan individu untuk
              berkembang optimal. Motivasi yang dibangun selama MPLS bukan motivasi eksternal semata
              yang berpusat pada hadiah atau hukuman, melainkan motivasi intrinsik yang bersumber
              dari rasa kompetensi, otonomi, dan keterhubungan. Ketika siswa baru berhasil
              menyelesaikan tantangan kelompok selama MPLS, mereka mengalami "mastery
              experience"—pengalaman berhasil yang menurut Albert Bandura merupakan sumber
              kepercayaan diri yang paling kuat. Ketika mereka diberikan kesempatan untuk memilih
              kegiatan atau menyuarakan pendapat, mereka merasakan "autonomy" yang memicu
              engagement. Ketika mereka merasa diterima oleh kelompok baru, mereka mengembangkan
              "relatedness" yang menjadi fondasi kesejahteraan. Kombinasi tiga elemen ini,
              sebagaimana diuraikan dalam teori "self-determination" Deci dan Ryan, menciptakan
              kondisi optimal bagi motivasi berprestasi yang berkelanjutan.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Refleksi kritis terhadap MPLS juga mengharuskan kita untuk mengidentifikasi potensi
              bias dan kekurangan dalam pelaksanaannya. Apakah kegiatan yang dirancang
              "menyenangkan" ini benar-benar inklusif bagi semua siswa, ataukah ia secara tidak
              sadar menguntungkan siswa dengan keterampilan sosial yang sudah matang sementara
              meninggalkan siswa yang lebih pendiam atau memiliki kebutuhan khusus? Apakah durasi
              MPLS yang relatif singkat—biasanya hanya beberapa hari—cukup untuk membentuk ikatan
              yang bermakna, ataukah ia hanya menciptakan ilusi kebersamaan yang cepat pudar begitu
              rutinitas akademik dimulai? Bagaimana sekolah memastikan bahwa nilai-nilai yang
              disosialisasikan selama MPLS tidak sekadar retorika, melainkan juga tercermin dalam
              praktik sehari-hari guru dan staf sekolah? Pertanyaan-pertanyaan ini mengingatkan kita
              bahwa MPLS, meskipun merupakan langkah awal yang penting, hanya akan efektif jika
              diikuti oleh kultur sekolah yang konsisten mendukung adaptasi, inklusi, dan
              pertumbuhan setiap siswa.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Pada tataran yang lebih luas, MPLS dapat dipandang sebagai mikrokosmos dari visi
              pendidikan yang diusung oleh {namaSekolahUppercase}. Jika visinya adalah menciptakan
              lulusan yang tidak hanya terampil secara teknis, melainkan juga memiliki karakter yang
              kuat, kemampuan bekerja sama, dan sikap kewirausahaan, maka MPLS menjadi arena pertama
              di mana visi ini diuji dan diaktualisasikan. Cara sekolah menyambut siswa baru, cara
              guru berinteraksi dengan mereka, dan cara senior memperlakukan junior selama MPLS—all
              of these send powerful signals about what the school truly values. Jika MPLS berhasil
              menciptakan pengalaman positif yang autentik, maka ia membangun modal psikologis yang
              akan memengaruhi seluruh perjalanan pendidikan siswa di sekolah ini. Sebaliknya, jika
              MPLS gagal menciptakan rasa diterima dan termotivasi, maka siswa memulai perjalanan
              mereka dengan beban emosional yang dapat menghambat potensi mereka. Dalam konteks ini,
              investasi dalam desain dan pelaksanaan MPLS yang berkualitas bukan pengeluaran
              tambahan, melainkan investasi strategis dalam fondasi keberhasilan pendidikan jangka
              panjang.
            </p>
          </section>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="strategis-01" />
    </div>
  );
}
