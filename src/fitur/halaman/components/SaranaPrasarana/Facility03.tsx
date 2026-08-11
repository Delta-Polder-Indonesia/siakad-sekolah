import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// Interface tipe data untuk fitur unggulan ruang kelas multimedia
interface FacilityFeature {
  id: string;
  title: string;
  desc: string;
  highlight: boolean;
}

// Data Statis: Fitur Unggulan Ruang Kelas Multimedia
const FITUR_RUANG_MULTIMEDIA: readonly FacilityFeature[] = [
  {
    id: 'interactive-display',
    title: 'Proyektor HD & Smart TV Interaktif 75 Inci',
    desc: 'Mendukung fitur touchscreen, wireless screen mirroring, dan casting untuk menyajikan visualisasi 3D, konten pembelajaran interaktif, serta materi presentasi secara imersif.',
    highlight: false,
  },
  {
    id: 'audio-wifi',
    title: 'Sistem Audio Surround & Akses WiFi High-Speed',
    desc: 'Audio berkualitas tinggi untuk kejernihan artikulasi materi bahasa dan audiovisual, didukung jaringan nirkabel stabil untuk interaksi platform LMS secara real-time.',
    highlight: false,
  },
  {
    id: 'digital-whiteboard',
    title: 'Whiteboard Digital & Papan Magnetik Kolaboratif',
    desc: 'Kanvas interaktif yang memungkinkan siswa dan guru menulis, menggambar, serta mengunggah bahan diskusi secara intuitif guna memicu pembelajaran aktif (student-centered).',
    highlight: false,
  },
  {
    id: 'digital-wellness-k3',
    title: 'Manajemen K3, Ergonomi & Digital Wellness',
    desc: 'Penerapan standar keselamatan kelistrikan, pencahayaan bebas silau, tata kelola kabel teratur, serta edukasi batas waktu layar (screen time) demi menjaga kesehatan mata dan postur fisik.',
    highlight: true,
  },
];

export default function Facility03Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Fasilitas Ruang Kelas Multimedia (FACILITY-03)"
      className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900"
    >
      {/* ═══ HEADER TRANSPARAN — Style Standard Platform ═══════════════════ */}
      <header className="absolute top-0 right-0 left-0 z-30 flex h-15 w-full items-center justify-between bg-transparent px-6 py-6 lg:px-8">
        {/* Kiri: Tombol Kembali + Judul Navigasi */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Kembali ke halaman Sarana Prasarana"
            className="flex h-8 w-8 items-center justify-center text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="font-serif text-base leading-tight text-white">Sarana Prasarana</h1>
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
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`}
            alt={`Ruang Kelas Multimedia ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI RUANG KELAS MULTIMEDIA (FAC-03)
          </div>
        )}

        {/* Gradient overlay — gelap di bawah agar teks terbaca */}
        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Gradient overlay — gelap di atas agar header transparan tetap terbaca */}
        <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Judul Hero */}
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          {/* Badge Info di atas judul */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-none border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              FACILITY 03 — PROYEKTOR &amp; SMART TV
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              36 RUANG KELAS INTERAKTIF
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Ruang Kelas Multimedia
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
              Sarana &amp; Prasarana • {namaSekolah}
            </p>
            <h1 className="mb-2 pr-24 pl-24 text-3xl leading-none font-black tracking-tight text-gray-900 uppercase md:text-4xl">
              RUANG KELAS MULTIMEDIA &amp; INTERAKTIF
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Pengintegrasian Perangkat Visual dan Audiovisual Modern untuk Menciptakan Pengalaman
              Belajar Multisensori
            </p>

            {/* Metadata Artikel & Tombol Bagikan */}
            <div className="mb-1 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Oleh: Pengelola Sarpras &amp; Tim Kurikulum
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  •
                </span>
                <time dateTime="2026-07-15">Rabu, 15 Juli 2026</time>
              </div>

              <ShareButtons />
            </div>
          </div>

          {/* Seksi I: Pengantar Deskripsi Fasilitas */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Peningkatan Paradigma Pembelajaran Multisensori
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Ruang Kelas Multimedia {namaSekolahUppercase} merupakan sebuah respons strategis
              terhadap tuntutan pembelajaran modern yang semakin mengandalkan teknologi visual dan
              interaktif untuk meningkatkan keterlibatan serta pemahaman peserta didik. Dalam
              konteks ini, ruang kelas tidak diposisikan sebagai ruang yang sekadar menyediakan
              tempat duduk dan papan tulis konvensional; lebih fundamental lagi, ruang kelas ini
              dirancang untuk mengorientasikan peserta didik menjadi &ldquo;visually-engaged
              learner&rdquo; — siswa yang memahami bahwa pembelajaran efektif memerlukan stimulasi
              multisensori yang menggabungkan audio, visual, dan kinestetik.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kehadiran perangkat media pembelajaran interaktif di seluruh 36 ruang kelas
              mencerminkan kesadaran institusional akan pentingnya memfasilitasi ragam gaya belajar.
              Fasilitas ini memungkinkan guru menghadirkan konsep abstrak ke dalam bentuk
              visualisasi konkret yang berkesan dan mudah dipahami.
            </p>
          </section>

          {/* Seksi II: Fitur Layanan dan Keunggulan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Spesifikasi Perangkat &amp; Fitur Unggulan Kelas
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Setiap ruang kelas multimedia di {namaSekolah} didukung oleh empat pilar teknologi dan
              kenyamanan operasional:
            </p>

            <div className="space-y-4">
              {FITUR_RUANG_MULTIMEDIA.map((item) => (
                <div
                  key={item.id}
                  className={
                    item.highlight
                      ? 'border-l-2 border-gray-900 bg-slate-50 p-3 text-justify'
                      : 'text-justify'
                  }
                >
                  <h3 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-900">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Seksi III: Integrasi Pedagogi & Infrastruktur Audiovisual */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Penerapan Pedagogi Visual, Audio &amp; Kolaborasi Digital
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Proyektor High Definition (HD) dan Smart TV 75 inci interaktif menjadi sarana utama
              dalam mentransformasi penyampaian materi kurikulum. Penggunaan teknologi ini tidak
              sebatas menampilkan presentasi statis, melainkan membuka ruang untuk pemutaran video
              dokumenter, simulasi animasi 3D, serta integrasi dengan Learning Management System
              (LMS). Interaksi berbasis sentuhan (touchscreen) dan wireless casting memungkinkan
              siswa mempresentasikan karya mereka secara langsung dari perangkat masing-masing,
              memicu diskusi kelas yang lebih dinamis.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Dukungan tata suara audio surround serta koneksi WiFi berkecepatan tinggi memastikan
              bahwa setiap instruksi, materi pengajaran bahasa, maupun komunikasi pembelajaran jarak
              jauh dapat tersampaikan dengan jernih tanpa hambatan teknis. Papan tulis digital
              magnetik turut melengkapi ruang kelas sebagai kanvas kolaboratif, di mana ide-ide
              dapat dicatat, disimpan, dan dibagikan secara digital kepada seluruh peserta didik.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Tata kelola operasional 36 ruang kelas didukung oleh sistem pemeliharaan berkala
              (preventive maintenance) dan penerapan Keselamatan, Kesehatan Kerja, dan Lingkungan
              (K3). Manajemen kabel yang rapi, pencahayaan bebas silau, serta pengaturan tata letak
              tempat duduk ergonomis diterapkan untuk meminimalkan risiko kelelahan mata serta
              menjaga keselamatan penggunaan listrik di dalam kelas.
            </p>
          </section>

          {/* Seksi IV: Refleksi Kritis & Inovasi Pembelajaran */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Visi: Digital Wellness &amp; Ekosistem Pendidikan Berkelanjutan
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Pemanfaatan multimedia di ruang kelas juga diimbangi dengan edukasi keseimbangan
              digital (digital wellness). Peserta didik diajarkan untuk bijak mengelola waktu
              interaksi dengan layar, menghindari gangguan digital selama proses belajar, serta
              memahami pentingnya etika berkomunikasi di media digital.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Dalam skala yang lebih luas, keberadaan Ruang Kelas Multimedia di{' '}
              {namaSekolahUppercase}
              merupakan komitmen nyata dalam membangun ekosistem inovasi pembelajaran yang inklusif
              dan adaptif. Dengan memadukan infrastruktur multimedia berkualitas tinggi dan
              pendekatan pedagogi modern, sekolah siap mencetak lulusan yang tidak hanya menguasai
              materi akademis, tetapi juga memiliki literasi digital yang kuat untuk bersaing di
              tingkat nasional maupun internasional.
            </p>
          </section>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Fasilitas Ruang Kelas Multimedia {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="facility-03" />
    </div>
  );
}
