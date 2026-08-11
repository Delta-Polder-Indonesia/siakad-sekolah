import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Reg01Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900"
    >
      {/* ═══ HEADER TRANSPARAN — Style Standard Platform ═══════════════════ */}
      <header className="absolute top-0 right-0 left-0 z-30 flex h-15 w-full items-center justify-between bg-transparent px-6 py-6 lg:px-8">
        {/* Kiri: Tombol Kembali + Judul Navigasi */}
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            aria-label="Kembali ke halaman Program Keahlian"
            className="flex h-8 w-8 items-center justify-center text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif text-base leading-tight text-white">Program Keahlian</h1>
            <p className="mt-0.5 text-[11px] text-slate-300">Tahun Ajaran 2026/2027</p>
          </div>
        </div>

        {/* Kanan: Nama Sekolah + Logo */}
        <div className="flex items-center gap-2">
          <div className="mr-2 hidden flex-col items-end sm:flex">
            <span className="font-serif text-xs leading-none text-white">
              {namaSekolahUppercase}
            </span>
            <span className="mt-1 text-[10px] leading-none tracking-wider text-slate-300 uppercase">
              Portal Publik Terintegrasi
            </span>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-white/10 bg-white/5 p-1 shadow-md">
            <img
              src={`${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`}
              alt={`Logo Resmi ${namaSekolah}`}
              className="h-full w-full object-cover"  loading="lazy" decoding="async" />
          </div>
        </div>
      </header>

      {/* ═══ HERO BANNER ═══════════════════════════════════════════════════ */}
      <div
        className={`relative min-h-[280px] w-full overflow-hidden bg-slate-100 ${TINGGI_FOTO} ${MAKSIMAL_TINGGI}`}
      >
        {!imageError ? (
          <img
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramKeahlian/sekolah-1.jpg`}
            alt={`Program Studi Rekayasa Perangkat Lunak ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI JURUSAN REG-01
          </div>
        )}

        {/* Gradient overlay — gelap di bawah agar teks terbaca */}
        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Gradient overlay — gelap di atas agar header transparan tetap terbaca */}
        <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Judul Hero */}
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          {/* Badge Info di atas judul */}
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-none border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              KODE KOMPETENSI: REG-01
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              3 TAHUN PROGRAM
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Program Studi Rekayasa Perangkat Lunak
          </h1>

          {/* Subjudul */}
          <p className="mt-1 text-sm font-semibold text-slate-300 md:text-base">
            {namaSekolahUppercase}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CONTENT AREA — Styled Standard
          ════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        <div className="relative w-full max-w-none">
          {/* Banner / Judul Utama */}
          <div className="relative mb-6 border-b-4 border-double border-gray-900 pt-14 pb-1 text-center md:pt-10">
            <p className="mb-1 font-sans text-xs font-bold tracking-widest text-gray-900 uppercase">
              Program Keahlian • {namaSekolah}
            </p>
            <h1 className="mb-2 pr-24 pl-24 text-3xl leading-none font-black tracking-tight text-gray-900 uppercase md:text-4xl">
              REKAYASA PERANGKAT LUNAK (RPL)
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Mengenal Program Studi Rekayasa Perangkat Lunak
            </p>

            {/* Metadata Artikel & Tombol Bagikan */}
            <div className="mb-1 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
                <span className="text-slate-300">•</span>
                <time dateTime="2026-06-10">Rabu, 10 Juni 2026</time>
              </div>

              <ShareButtons />
            </div>
          </div>

          {/* Seksi I: Pengenalan RPL */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Apa Itu Rekayasa Perangkat Lunak?
            </h3>
            <p className="first-letter:line-height-none text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Dalam lanskap teknologi yang terus bergerak, Rekayasa Perangkat Lunak — atau yang
              lazim disingkat RPL — berdiri sebagai disiplin yang menjembatani kebutuhan manusia
              dengan kemampuan mesin. RPL bukan sekadar tentang menulis baris kode; ia mencakup
              keseluruhan siklus hidup sebuah sistem digital, mulai dari konsepsi ide, perancangan
              arsitektur, implementasi, pengujian, hingga pemeliharaan jangka panjang. Prinsip
              rekayasa yang melandasi bidang ini memastikan bahwa setiap perangkat lunak yang
              dihasilkan tidak hanya berfungsi, tetapi juga dapat diandalkan, dipelihara, dan
              dikembangkan seiring waktu.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Perangkat lunak itu sendiri adalah entitas yang unik — ia tidak memiliki wujud fisik,
              namun dampaknya nyata dan terasa di setiap sendi kehidupan modern. Ia adalah kumpulan
              instruksi yang, ketika dieksekusi oleh prosesor, mengubah data mentah menjadi
              informasi yang bermakna. Dari kalkulator sederhana di ponsel hingga sistem navigasi
              pesawat terbang, semua berakar pada logika dasar yang sama: instruksi biner yang
              dipahami oleh mesin dan dirancang dengan cermat oleh manusia.
            </p>
          </div>

          {/* Seksi II: Definisi Menurut Para Pakar */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Definisi Menurut Para Pakar
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Sejumlah tokoh dan lembaga berpengaruh telah merumuskan definisi RPL dari sudut
              pandang masing-masing. Keberagaman perspektif ini justru memperkaya pemahaman kita
              tentang kompleksitas bidang ini:
            </p>

            <div className="space-y-4">
              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  1. Stephen R. Schach
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Mendefinisikan RPL sebagai disiplin ilmu yang bertujuan menghasilkan perangkat
                  lunak bebas kesalahan, dikirimkan tepat waktu, dan mampu memuaskan ekspektasi
                  pemakainya — sebuah standar yang menempatkan kualitas dan keandalan di atas
                  segalanya.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  2. Fritz Bauer
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Menegaskan bahwa RPL adalah penerapan prinsip-prinsip rekayasa secara sistematis
                  untuk membangun perangkat lunak yang dapat dipercaya dan mampu bekerja secara
                  efisien pada mesin nyata — bukan sekadar prototipe di atas kertas.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  3. IEEE 610.12
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Merumuskan RPL sebagai pendekatan yang bersifat kuantitatif, disiplin, dan
                  sistematis dalam pengembangan, operasi, serta pemeliharaan perangkat lunak —
                  menekankan bahwa rekayasa harus dapat diukur dan dipertanggungjawabkan.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi III: Tujuan & Ruang Lingkup */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Tujuan, Manfaat, dan Ruang Lingkup Penerapan
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Menguasai RPL bukan semata tentang mengetahui cara kerja komputer. Lebih dari itu, ia
              adalah tentang memahami cara membangun solusi yang bertahan lama, yang dapat tumbuh
              seiring kebutuhan pengguna, dan yang mampu beradaptasi dengan perubahan teknologi
              tanpa harus dibangun ulang dari awal. Berikut adalah tujuan inti yang menjadi landasan
              pengembangan perangkat lunak secara profesional:
            </p>

            <ul className="ml-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-900">
              <li>
                <span className="font-bold">Membangun Solusi yang Fungsional:</span> Merancang dan
                mengembangkan perangkat lunak yang benar-benar menjawab kebutuhan pengguna, bukan
                sekadar memenuhi spesifikasi teknis semata.
              </li>
              <li>
                <span className="font-bold">Meningkatkan Sistem yang Ada:</span> Melakukan
                refactoring dan peningkatan terhadap perangkat lunak lama agar tetap relevan, aman,
                dan performatif di tengah perubahan kebutuhan.
              </li>
              <li>
                <span className="font-bold">Menghadirkan Pengalaman Pengguna Intuitif:</span>{' '}
                Merancang antarmuka yang tidak hanya estetis, tetapi juga logis dan mudah dipahami
                oleh pengguna dari berbagai latar belakang.
              </li>
              <li>
                <span className="font-bold">Mengintegrasikan Sistem Lintas Platform:</span>{' '}
                Memastikan perangkat lunak dapat beroperasi secara harmonis dengan perangkat keras,
                sensor, dan sistem lain dalam ekosistem yang kompleks.
              </li>
              <li>
                <span className="font-bold">Menjamin Keberlangsungan Sistem:</span> Merancang
                arsitektur yang memudahkan pemeliharaan, deteksi bug, dan pembaruan rutin tanpa
                mengganggu operasional yang sedang berjalan.
              </li>
            </ul>

            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Dalam praktiknya, RPL hadir di hampir setiap sektor kehidupan: sistem informasi rumah
              sakit yang mengelola rekam medis pasien, platform e-commerce yang memproses jutaan
              transaksi per hari, perangkat lunak navigasi kendaraan otonom, hingga aplikasi
              pembelajaran daring yang menjangkau siswa di pelosok negeri. Efisiensi biaya produksi
              dan perawatan, serta kemampuan berjalan lintas platform, menjadi dua keunggulan
              kompetitif utama yang dikejar oleh setiap tim pengembang profesional.
            </p>
          </div>

          {/* Seksi IV: Program Keahlian */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. RPL di {namaSekolah}: Lebih dari Sekadar Koding
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Ketika {namaSekolah} memutuskan untuk menghadirkan program keahlian Rekayasa Perangkat
              Lunak, keputusan tersebut lahir dari kesadaran bahwa dunia tempat para siswa akan
              berkarir kelak adalah dunia yang digerakkan oleh kode — dunia di mana kemampuan
              membangun, memelihara, dan mengoptimalkan perangkat lunak bukan lagi keistimewaan
              segelintir orang, melainkan kompetensi dasar yang diperlukan oleh hampir setiap
              industri.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kurikulum yang dirancang mencerminkan kedalaman pemahaman akan kebutuhan industri
              nyata. Pemrograman berbasis web — dengan HTML, CSS, JavaScript, hingga PHP — bukan
              sekadar mengajarkan sintaks, melainkan membangun cara berpikir yang terstruktur dan
              algoritmik. Pengembangan aplikasi mobile memperkenalkan siswa pada tantangan nyata:
              bagaimana membangun pengalaman pengguna yang mulus di tengah fragmentasi perangkat,
              keterbatasan sumber daya, dan ekspektasi pengguna yang terus meningkat.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Di balik antarmuka yang apik, terdapat fondasi yang sangat krusial: database.
              Kemampuan merancang skema yang efisien, menulis query yang optimal, dan memahami
              prinsip normalisasi adalah yang membedakan seorang developer yang sekadar bisa membuat
              program dari developer yang mampu membangun sistem yang tahan uji di skala besar.
              Inilah yang menjadi salah satu penekanan utama dalam kurikulum RPL di sekolah ini.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Version control dengan Git bukan hanya keterampilan teknis — ia adalah filosofi kerja.
              Pengembangan perangkat lunak modern adalah olahraga tim, bukan pertunjukan solo.
              Dengan memahami cara berkolaborasi melalui branching, merging, dan pull request, siswa
              belajar bahwa kode yang baik adalah kode yang dapat dibaca, dipahami, dan dikembangkan
              oleh orang lain — bukan hanya oleh penulisnya sendiri.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Sertifikasi kompetensi melalui Lembaga Sertifikasi Profesi (LSP) melengkapi perjalanan
              belajar dengan validasi yang diakui secara nasional. Di tengah pasar kerja yang
              semakin kompetitif, sertifikat bukan sekadar selembar kertas — ia adalah bukti bahwa
              seorang individu telah melewati standar kompetensi yang ditetapkan oleh industri,
              bukan hanya oleh institusi pendidikan.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Tingkat serapan lulusan RPL yang tinggi di pasar kerja mencerminkan relevansi program
              ini. Namun relevansi bukan sesuatu yang bisa dianggap permanen. Teknologi bergerak
              dengan kecepatan yang tidak memberi ruang untuk stagnan — framework yang populer hari
              ini mungkin akan tergantikan dalam tiga tahun ke depan. Maka yang sesungguhnya
              dibangun dalam program ini bukan hanya keterampilan teknis spesifik, melainkan
              kemampuan untuk terus belajar, beradaptasi, dan berkembang.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Dan di sinilah dimensi yang paling krusial — namun sering terabaikan — mulai relevan:
              etika dalam rekayasa perangkat lunak. Setiap aplikasi yang dibangun memiliki dampak:
              pada privasi pengguna, pada keamanan data, pada kesetaraan akses, dan pada cara
              pandang masyarakat terhadap teknologi. Lulusan RPL {namaSekolah} didorong untuk tidak
              hanya menjadi pembangun yang cakap, tetapi juga pemikir yang bertanggung jawab —
              mereka yang mempertanyakan dampak dari setiap baris kode yang mereka tulis.
            </p>
          </div>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Program Keahlian {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="reg-01" />
    </div>
  );
}
