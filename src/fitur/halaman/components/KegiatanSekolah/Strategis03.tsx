import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Strategis03Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-3.jpg`}
            alt="Lomba Kompetensi Siswa Tingkat Kota"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Kegiatan 03
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Kegiatan Strategis 03
            </span>
            <time
              dateTime="2027-03-01"
              className="text-[10px] font-bold tracking-widest text-white/70 uppercase"
            >
              Maret 2027
            </time>
          </div>

          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Lomba Kompetensi Siswa Tingkat Kota
          </h1>
        </div>
      </div>

      {/* ── BAGIAN ARTIKEL KORAN ── */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-20 md:px-12 md:pt-16 md:pb-28">
        {/* Kontainer Pembatas Garis Ganda Koran */}
        <div className="border-b-4 border-double border-gray-900 pt-14 pb-0 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-slate-900 uppercase md:text-4xl">
            Lomba Kompetensi Siswa Tingkat Kota
          </h2>

          {/* Metadata Artikel & Tombol Bagikan di dalam pembatas */}
          <div className="mt-6 mb-4 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
              <span className="text-slate-300">•</span>
              <time dateTime="2027-03-15">Senin, 15 Maret 2027</time>
            </div>
            <ShareButtons />
          </div>
        </div>

        {/* HERO ARTIKEL (Drop Cap pada huruf pertama paragraf awal) */}
        <div className="mb-10 pt-8 md:mb-12">
          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-800 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
            Lomba Kompetensi Siswa (LKS) tingkat kota yang diikuti oleh perwakilan SMA NEGERI 1
            MEDAN merupakan sebuah arena validasi eksternal yang berfungsi sebagai katalisator
            transformasi kualitas pembelajaran vokasi. Dalam konteks ini, LKS bukan sekadar
            kompetisi antarsekolah yang menentukan siapa yang terbaik dalam keterampilan teknis; ia
            merupakan mekanisme "benchmarking" yang memungkinkan sekolah untuk membandingkan standar
            kompetensinya dengan institusi lain dalam satu wilayah administratif. Proses seleksi dan
            pelatihan intensif yang mendahului kompetisi menciptakan sebuah "microsystem"
            pembelajaran yang terisolasi dari rutinitas kelas biasa—sebuah ruang di mana siswa
            berprestasi dipacu untuk mencapai batas maksimal kemampuannya di bawah bimbingan mentor
            yang fokus dan terstruktur. Isolasi ini, meskipun bersifat sementara, sering kali
            menghasilkan lompatan kompetensi yang signifikan karena intensitas, fokus, dan sumber
            daya yang dialokasikan jauh melampaui kondisi pembelajaran reguler.
          </p>
        </div>

        {/* SPACING KONTEN UTAMA */}
        <div className="space-y-6">
          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Mengidentifikasi dan membina siswa berkompetensi tinggi merupakan tujuan pertama yang
              memiliki implikasi jangka panjang bagi ekosistem talenta sekolah. Proses identifikasi
              ini, jika dilakukan secara sistematis, memerlukan instrumen asesmen yang tidak hanya
              mengukur pencapaian akademik saat ini, melainkan juga memprediksi potensi pertumbuhan.
              Siswa yang berprestasi dalam ujian teori belum tentu memiliki "grit"—ketahanan dan
              ketekunan dalam menghadapi tantangan—yang diperlukan untuk bertahan dalam persiapan
              intensif menuju kompetisi. Sebaliknya, siswa dengan nilai rata-rata namun menunjukkan
              "curiosity" yang tinggi, kemampuan problem-solving yang kreatif, dan motivasi
              intrinsik yang kuat, sering kali menjadi kandidat yang lebih berpotensi untuk
              berkembang pesat dengan bimbingan yang tepat. {namaSekolahUppercase}, melalui proses
              seleksi yang holistik, mengindikasikan kesadaran akan kompleksitas ini. Namun,
              tantangannya adalah memastikan bahwa proses seleksi tidak memunculkan "elitism" yang
              membuat siswa terpilih merasa superior, sementara siswa lain merasa terpinggirkan atau
              tidak dihargai.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Mewakili sekolah dalam kompetisi tingkat kota dan provinsi membawa konsekuensi
              tersendiri yang melampaui dimensi individual siswa. Ketika seorang siswa tampil dengan
              atribut sekolahnya, ia tidak lagi berkompetisi atas nama pribadi; ia menjadi
              "embodiment" dari institusi—sebuah representasi hidup dari kualitas pendidikan,
              fasilitas, dan bimbingan yang diberikan sekolah kepada seluruh siswanya. Beban
              representasi ini dapat menjadi sumber motivasi yang kuat, namun juga dapat menjadi
              sumber tekanan yang melumpuhkan jika tidak dikelola dengan baik. Dalam literatur
              psikologi olahraga dan performa, fenomena ini dikenal sebagai "social facilitation"
              versus "social inhibition"—kehadiran audiens dan ekspektasi dapat meningkatkan atau
              menurunkan performa tergantung pada bagaimana individu menginterpretasikan tekanan
              tersebut. Pembimbing yang kompeten tidak hanya mengajarkan keterampilan teknis,
              melainkan juga membantu siswa mengembangkan "mental skills training"—teknik
              visualisasi, regulasi emosi, dan fokus yang memungkinkan mereka untuk tampil optimal
              di bawah tekanan kompetisi.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Meningkatkan pengakuan kompetensi keahlian teknis siswa merupakan tujuan yang
              berkaitan erat dengan "signaling theory" dalam ekonomi pendidikan. Dalam pasar kerja
              yang asimetris informasi—di mana pemberi kerja tidak dapat dengan mudah menilai
              kualitas calon pekerja—sertifikat dan prestasi kompetitif berfungsi sebagai "signal"
              yang kredibel mengenai kemampuan individu. Kemenangan atau bahkan partisipasi dalam
              LKS tingkat kota dan provinsi menjadi sinyal yang dapat dibaca oleh pemberi kerja,
              perguruan tinggi, dan stakeholder lainnya sebagai indikator kualitas. Bagi SMA NEGERI
              1 MEDAN, prestasi LKS yang konsisten membangun "reputational capital" yang memengaruhi
              daya tarik sekolah bagi calon siswa, kualitas mitra industri yang bersedia
              berkolaborasi, dan bahkan alokasi anggaran dari pemerintah daerah. Namun, risikonya
              adalah terjadinya "credential inflation"—di mana semakin banyak sekolah yang mengejar
              prestasi kompetitif, sehingga nilai sinyal dari prestasi tersebut dapat terdevaluasi
              jika tidak diimbangi dengan kualitas aktual lulusan yang dihasilkan.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Mendorong budaya prestasi dan keunggulan di lingkungan sekolah merupakan tujuan yang
              paling abstrak namun paling fundamental. Budaya, dalam terminologi sosiologi
              organisasi, merujuk pada sekumpulan asumsi dasar, nilai, dan norma yang dibagikan oleh
              anggota organisasi dan yang memengaruhi perilaku mereka secara tidak sadar. Budaya
              prestasi tidak tercipta dari satu kejadian atau kebijakan tunggal; ia terbentuk
              melalui akumulasi pengalaman, narasi, dan ritual yang berulang dari waktu ke waktu.
              Ketika sekolah secara konsisten mengirimkan siswa ke kompetisi, merayakan kemenangan,
              dan menganalisis kegagalan sebagai peluang belajar, ia membangun narasi kolektif bahwa
              keunggulan bukan sekadar diterima, melainkan diharapkan dan diupayakan. Narasi ini,
              yang diteruskan dari satu generasi siswa ke generasi berikutnya, menjadi bagian dari
              "organizational memory" yang membentuk ekspektasi dan aspirasi siswa baru bahkan
              sebelum mereka menginjakkan kaki di sekolah.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Pelatihan intensif yang mendahului kompetisi merupakan dimensi yang layak dikaji
              secara mendalam. Intensitas pelatihan—yang sering kali melibatkan jam tambahan di luar
              jam sekolah, latihan di akhir pekan, dan bahkan pengurangan kegiatan ekstrakurikuler
              lainnya—menciptakan "opportunity cost" yang signifikan. Waktu yang dihabiskan untuk
              persiapan LKS adalah waktu yang tidak dapat dihabiskan untuk belajar mata pelajaran
              lain, berpartisipasi dalam kegiatan sosial, atau sekadar beristirahat. Bagi siswa yang
              terlibat, ini dapat menjadi pengalaman yang sangat memperkaya, namun juga dapat
              mengarah pada "burnout" jika tidak dikelola dengan bijaksana. Sebuah program pelatihan
              yang berkelanjutan perlu mempertimbangkan keseimbangan antara intensitas dan
              kesejahteraan, antara ambisi kompetitif dan kesehatan fisik-mental siswa. Pertanyaan
              kritis yang harus diajukan adalah: apakah pelatihan ini mempersiapkan siswa untuk
              kompetisi saja, ataukah ia juga mempersiapkan mereka untuk menghadapi dinamika dunia
              kerja yang menuntut keseimbangan serupa?
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Dari perspektif keadilan pendidikan, fokus pada siswa berprestasi tinggi melalui LKS
              menimbulkan pertanyaan mengenai alokasi sumber daya yang adil. Sumber daya yang
              terbatas—baik berupa waktu guru pembimbing, fasilitas praktikum, maupun anggaran
              transportasi dan akomodasi—dialokasikan secara tidak proporsional kepada segelintir
              siswa yang terpilih. Sementara itu, siswa mayoritas yang tidak terlibat dalam
              kompetisi mungkin tidak mendapatkan manfaat langsung dari investasi tersebut. Dalam
              konteks ini, {namaSekolahUppercase} perlu mempertimbangkan mekanisme
              "trickle-down"—bagaimana pengalaman dan pengetahuan yang diperoleh oleh tim kompetisi
              dapat disebarluaskan kepada seluruh siswa. Program "peer tutoring", presentasi
              pengalaman kompetisi di depan kelas, atau integrasi studi kasus dari proyek kompetisi
              ke dalam kurikulum reguler adalah beberapa strategi yang dapat memperluas dampak
              positif dari partisipasi LKS melampaui segelintir individu yang terlibat langsung.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Refleksi atas LKS tingkat kota ini mengarahkan kita pada pertanyaan yang lebih luas
              mengenai fungsi kompetisi dalam pendidikan vokasi. Jika tujuan akhir pendidikan vokasi
              adalah mempersiapkan lulusan yang siap kerja dan berdaya saing, apakah kompetisi
              seperti LKS merupakan cara terbaik untuk mencapainya, ataukah ia hanya mengukur
              kompetensi dalam kondisi artificial yang tidak mereplikasi dinamika dunia kerja nyata?
              Dunia kerja membutuhkan kolaborasi lebih dari kompetisi, ketahanan dalam menghadapi
              kegagalan lebih dari keberhasilan instan, dan kemampuan untuk belajar sepanjang hayat
              lebih dari penguasaan keterampilan spesifik. LKS yang dirancang dengan baik dapat
              mengembangkan beberapa dari kualitas ini—terutama ketahanan dan fokus—namun ia juga
              berisiko memperkuat paradigma bahwa kesuksesan hanya dapat diukur melalui peringkat
              dan penghargaan. Jika {namaSekolahUppercase} dapat menggunakan LKS sebagai salah satu
              dari banyak instrumen pengembangan siswa, daripada sebagai tujuan akhir, maka
              partisipasi dalam kompetisi ini akan tercatat bukan sebagai puncak perjalanan
              pendidikan, melainkan sebagai salah satu batu loncatan dalam perjalanan panjang menuju
              keunggulan yang berkelanjutan dan bermakna.
            </p>
          </section>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="strategis-03" />
    </div>
  );
}
