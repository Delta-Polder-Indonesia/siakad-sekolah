import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Program1Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900"
    >
      {/* ═══ HEADER TRANSPARAN — Style Kalender Akademik ═══════════════════ */}
      <header className="absolute top-0 right-0 left-0 z-30 flex h-15 w-full items-center justify-between bg-transparent px-6 py-6 lg:px-8">
        {/* Kiri: Tombol Kembali + Judul */}
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            aria-label="Kembali ke halaman Program Sekolah"
            className="flex h-8 w-8 items-center justify-center text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif text-base leading-tight text-white">Program Sekolah</h1>
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramSekolah/sekolah-1.jpg`}
            alt={`Dokumentasi Penguatan Karakter dan Kedisiplinan Siswa ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI PROGRAM 01
          </div>
        )}

        {/* Gradient overlay — gelap di bawah agar teks terbaca */}
        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Gradient overlay — gelap di atas agar header transparan tetap terbaca */}
        <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Judul Hero — Style Kalender Akademik */}
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          {/* Badge Info di atas judul */}
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-none border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              PROGRAM STRATEGIS 01
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              1 Tahun Ajaran
            </span>
          </div>

          {/* Judul Utama — Style Kalender Akademik */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Penguatan Karakter dan Kedisiplinan Siswa
          </h1>

          {/* Subjudul — Style Kalender Akademik */}
          <p className="mt-1 text-sm font-semibold text-slate-300 md:text-base">
            {namaSekolahUppercase}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CONTENT AREA — Styled like TutorialModal
          ════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        <div className="relative w-full max-w-none">
          {/* Banner / Judul Utama (Garis ganda di bawah judul tetap dipertahankan) */}
          <div className="relative mb-6 border-b-4 border-double border-gray-900 pt-14 pb-1 text-center md:pt-10">
            <p className="mb-1 font-sans text-xs font-bold tracking-widest text-gray-900 uppercase">
              Program Strategis • {namaSekolah}
            </p>
            <h1 className="mb-2 pr-24 pl-24 text-3xl leading-none font-black tracking-tight text-gray-900 uppercase md:text-4xl">
              PENGUATAN KARAKTER DAN KEDISIPLINAN SISWA
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Penguatan Pendidikan Karakter (PPK) sebagai Gerakan Pendidikan Nasional
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

          {/* Intro Artikel */}
          <div className="mb-6 pb-6">
            <p className="first-letter:line-height-none text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Penguatan Pendidikan Karakter (PPK) adalah gerakan pendidikan nasional untuk membentuk
              karakter siswa menjadi individu yang berpikiran, berhati, dan berperilaku baik, sesuai
              dengan Pancasila dan nilai-nilai luhur bangsa Indonesia. Gerakan ini bertujuan
              menharmonisasikan perkembangan intelektual (olahpikir), emosional (olahrasa), etika
              (olahhati), dan fisik (olahraga) siswa melalui kerja sama sekolah, keluarga, dan
              masyarakat, dengan peran penting guru sebagai teladan dan fasilitator.
            </p>
          </div>

          {/* Seksi Utama: Program-Program PPK */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Program-Program Penguatan Pendidikan Karakter
            </h3>

            {/* Program 1: 7 KAIH */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                1. Gerakan 7 Kebiasaan Anak Indonesia Hebat (7 KAIH)
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Gerakan 7 KAIH mencakup: <span className="font-bold">Bangun Pagi</span>,{' '}
                <span className="font-bold">Beribadah</span>,{' '}
                <span className="font-bold">Berolahraga</span>,{' '}
                <span className="font-bold">Gemar Belajar</span>,{' '}
                <span className="font-bold">Makan Sehat dan Bergizi</span>,{' '}
                <span className="font-bold">Aktif Bermasyarakat</span>, dan{' '}
                <span className="font-bold">Tidur Cepat</span>. Setiap kebiasaan dirancang tidak
                hanya untuk membangun kesehatan fisik, tetapi juga menumbuhkan ketangguhan mental,
                disiplin, dan kepedulian sosial anak-anak Indonesia.
                <span className="mt-1 block text-xs text-gray-900 italic">
                  *Gerakan ini bertujuan untuk mewujudkan penguatan karakter utama bangsa dan
                  mendukung tercapainya delapan dimensi profil lulusan dengan gerakan partisipatif
                  dari seluruh pemangku kepentingan dan catur pusat pendidikan.
                </span>
              </p>
            </div>

            {/* Program 2: Pertemuan Pagi Ceria */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                2. Pertemuan Pagi Ceria (PPC)
              </h4>
              <div className="mb-2 space-y-2 text-sm leading-relaxed text-gray-900">
                <p>
                  Keberhasilan Gerakan 7 Kebiasaan Anak Indonesia Hebat tidak hanya tercermin dari
                  antusiasme sekolah dan berbagai praktik baik di daerah, tetapi juga dari lahirnya
                  program-program turunan yang konkret dan mudah diterapkan dalam keseharian murid.
                  Salah satu wujud implementasi nyata dari gerakan ini adalah Pertemuan Pagi Ceria
                  (PPC). Melalui PPC, sekolah tidak hanya mengajarkan kebiasaan baik, tetapi juga
                  menghadirkan ruang bersama untuk membangun kedisiplinan, semangat kebersamaan,
                  serta rasa cinta tanah air sejak awal hari.
                </p>
                <p>Kegiatan yang dilaksanakan dalam PPC meliputi:</p>
                <ul className="ml-2 list-inside list-disc space-y-1">
                  <li>
                    <span className="font-bold">Senam Anak Indonesia Hebat</span> minimal dua kali
                    dalam seminggu, agar murid bersemangat, sehat, dan siap belajar dengan energi
                    positif.
                  </li>
                  <li>
                    <span className="font-bold">Menyanyikan lagu Indonesia Raya</span>, simbol
                    kebanggaan sekaligus wujud nyata rasa kebangsaan yang mempererat persatuan antar
                    peserta didik.
                  </li>
                  <li>
                    <span className="font-bold">Doa bersama</span> sesuai keyakinan masing-masing,
                    yang menumbuhkan rasa syukur, memohon kelancaran pembelajaran, sekaligus
                    memperkuat toleransi.
                  </li>
                </ul>
                <p>
                  Pertemuan Pagi Ceria (PPC) hadir sebagai wujud nyata dari Gerakan 7 Kebiasaan Anak
                  Indonesia Hebat. Tujuannya adalah membiasakan murid memulai hari dengan semangat
                  positif, disiplin, dan rasa cinta tanah air. Melalui kegiatan Senam Anak Indonesia
                  Hebat, menyanyikan Indonesia Raya, serta doa bersama, PPC membantu menumbuhkan
                  kesehatan, kebersamaan, rasa syukur, dan persatuan sejak awal hari, sehingga murid
                  lebih siap belajar dan berkembang menjadi pribadi yang hebat.
                </p>
              </div>
            </div>

            {/* Program 3: Senam Anak Indonesia Hebat */}
            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 3. Senam Anak
                Indonesia Hebat (SAIH)
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Keberhasilan Pertemuan Pagi Ceria tidak lepas dari peran aktivitas fisik yang
                menjadi penggerak semangat belajar. Dari situlah, Senam Anak Indonesia Hebat (SAIH)
                menjadi salah satu elemen penting yang terus diperkuat. Melalui gerakan yang
                sederhana, menyenangkan, dan bisa dilakukan bersama, SAIH bukan hanya menyehatkan
                tubuh, tetapi juga menanamkan kedisiplinan, kekompakan, serta energi positif bagi
                peserta didik.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Senam Anak Indonesia Hebat (SAIH) bertujuan membiasakan murid melakukan aktivitas
                fisik yang menyehatkan sekaligus menyegarkan pikiran. Melalui gerakan sederhana dan
                menyenangkan, SAIH menumbuhkan semangat belajar, menanamkan kedisiplinan, serta
                memperkuat kekompakan. Dengan demikian, murid dapat memulai hari dengan energi
                positif yang mendukung kesiapan mereka dalam mengikuti pembelajaran dan aktivitas
                sekolah.
              </p>
            </div>

            {/* Program 4: Album Lagu 7KAIH */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                4. Album Lagu 7 Kebiasaan Anak Indonesia Hebat
              </h4>
              <div className="text-sm leading-relaxed text-gray-900">
                <p className="mb-2">
                  Album 7KAIH lahir dari ajang Kreasi Cipta Lagu Anak Nusantara yang digelar
                  November 2024, mengusung tema 7 Kebiasaan Anak Indonesia Hebat (7 KAIH) yaitu
                  bangun pagi, beribadah, berolahraga, makan sehat, gemar belajar, bermasyarakat,
                  dan tidur cepat. Dari lebih <span className="font-bold">1.900 karya lagu</span>{' '}
                  yang masuk, terpilih karya terbaik yang dibukukan dalam album tersebut.
                </p>
                <p className="mb-2">
                  Uniknya, lagu-lagu dalam album ini juga digunakan dalam berbagai kegiatan
                  masyarakat, seperti karnaval 17 Agustus, yang menambah semarak perayaan
                  kemerdekaan dengan nuansa edukatif. Bahkan, lagu{' '}
                  <span className="italic">"Makan Sehat, Kita Hebat"</span> dari album ini telah
                  dimanfaatkan oleh rumah sakit sebagai konten edukasi tentang pentingnya pola makan
                  sehat dan bergizi bagi anak-anak dan keluarga.
                </p>
                <p>
                  Album 7KAIH hadir sebagai sarana edukasi kreatif yang memadukan nilai kebiasaan
                  baik dengan karya musik anak bangsa. Tujuannya adalah menanamkan tujuh kebiasaan
                  positif melalui lagu yang mudah diingat, menyenangkan, dan relevan dengan
                  kehidupan sehari-hari. Lebih dari sekadar hiburan, album ini menjadi media
                  pembelajaran yang dapat digunakan di sekolah, keluarga, maupun masyarakat,
                  sehingga mendukung tumbuhnya generasi sehat, cerdas, dan berkarakter hebat.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi Lampiran */}
          <div className="pt-6 pb-8">
            <div className="p-4">
              <h4 className="mb-3 text-center font-sans text-sm font-bold tracking-wide text-gray-900 uppercase">
                ! LAMPIRAN REGULASI DAN SURAT EDARAN !
              </h4>
              <p className="mb-4 text-justify text-xs text-gray-900">
                Dokumen-dokumen berikut merupakan dasar hukum dan acuan resmi pelaksanaan program
                Penguatan Pendidikan Karakter di lingkungan {namaSekolah}:
              </p>
              <ul className="space-y-3 text-justify text-xs text-gray-900">
                <li className="list-inside list-disc">
                  <span className="font-bold">Permendikdasmen Nomor 6 Tahun 2026</span> tentang
                  Budaya Sekolah Aman dan Nyaman (BSAN).
                </li>
                <li className="list-inside list-disc">
                  <span className="font-bold">
                    Surat Edaran Sekretaris Jenderal Nomor 14 Tahun 2025
                  </span>{' '}
                  tentang Optimalisasi Pelaksanaan Gerakan Tujuh Kebiasaan Anak Indonesia Hebat di
                  Satuan Pendidikan.
                </li>
                <li className="list-inside list-disc">
                  <span className="font-bold">Surat Edaran Mendikdasmen Nomor 11 Tahun 2025</span>{' '}
                  tentang Pelaksanaan Kegiatan Pagi Ceria dalam rangka Hari Anak Nasional 2025.
                </li>
                <li className="list-inside list-disc">
                  <span className="font-bold">
                    Surat Edaran Bersama Mendikdasmen, Mendagri dan Menag Nomor 1 Tahun 2025
                  </span>{' '}
                  tentang Penguatan Pendidikan Karakter melalui Pembiasaan di Satuan Pendidikan.
                </li>
              </ul>
              {/* Tombol Unduh Dokumen */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    label: 'Permendikdasmen Nomor 6 Tahun 2026 — BSAN (JDIH)',
                    href: `${import.meta.env.BASE_URL}download/STRATEGIS-01/Salinan Permendikdasmen Nomor 6 Tahun 2026 - BSAN (JDIH).pdf`,
                  },
                  {
                    label: 'SE Sesjen No. 14 Tahun 2025 — Optimalisasi 7 KAIH',
                    href: `${import.meta.env.BASE_URL}download/STRATEGIS-01/SE_SESJEN_No_14_Tahun_2025_tentang_Optimalisasi_Pelaksanaan_Gerakan_Tujuh_Kebiasaan_Anak_Indonesia_Hebat_di_Satuan_Pendidikan.pdf`,
                  },
                  {
                    label: 'SE Mendikdasmen No. 11 Tahun 2025 — Pagi Ceria HAN',
                    href: `${import.meta.env.BASE_URL}download/STRATEGIS-01/SE-MENDIKDASMEN-NOMOR-11-TAHUN-2025-HAN.pdf`,
                  },
                  {
                    label: 'SEB 1 Tahun 2025 — PPK melalui Pembiasaan',
                    href: `${import.meta.env.BASE_URL}download/STRATEGIS-01/SEB 1 Tahun 2025.pdf`,
                  },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-slate-50 p-3 text-xs transition hover:bg-slate-100"
                  >
                    <span className="font-sans font-medium text-gray-900">{item.label}</span>
                    <span className="ml-2 flex-shrink-0 rounded bg-gray-900 px-2 py-0.5 font-sans text-[10px] font-bold text-white uppercase">
                      Unduh
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Program Strategis {namaSekolah} • Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="program-1" />
    </div>
  );
}
