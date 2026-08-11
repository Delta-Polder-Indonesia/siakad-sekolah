import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// Interface tipe data untuk fitur unggulan fasilitas 04
interface FacilityFeature {
  id: string;
  title: string;
  desc: string;
  highlight: boolean;
}

// Data Statis: Fitur Unggulan Fasilitas 04
const FITUR_FASILITAS_04: readonly FacilityFeature[] = [
  {
    id: 'praktek-modern',
    title: 'Peralatan Praktikum Modern & Digital',
    desc: 'Dilegkapi dengan instrumen praktikum berbasis digital dan modul eksperimen standar yang mendukung akselerasi pemahaman sains serta teknologi bagi peserta didik.',
    highlight: false,
  },
  {
    id: 'keamanan-k3',
    title: 'Standar Keselamatan Kerja & Proteksi Diri',
    desc: 'Menyediakan fasilitas pendukung K3 lengkap seperti sistem ventilasi terpadu, pemadam api ringan (APAR), petunjuk evakuasi, dan perlengkapan perlindungan laboratorium.',
    highlight: false,
  },
  {
    id: 'area-kolaborasi',
    title: 'Stasiun Kerja Ergonomis & Ruang Diskusi',
    desc: 'Tata ruang yang dirancang fleksibel untuk mendukung kerja tim, pengamatan kelompok, serta presentasi hasil penelitian lapangan maupun laboratorium.',
    highlight: false,
  },
  {
    id: 'bimbingan-riset',
    title: 'Program Bimbingan Riset & Eksperimentasi',
    desc: 'Pendampingan intensif oleh tenaga ahli dan guru pembina dalam mengeksplorasi metodologi ilmiah, analisis data, hingga persiapan kompetisi sains.',
    highlight: true,
  },
];

export default function Facility04Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Fasilitas (FACILITY-04)"
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
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`}
            alt={`Fasilitas Laboratorium ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI FASILITAS (FAC-04)
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
              FACILITY 04 — SPESIFIKASI STANDAR NASIONAL
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              KAPASITAS 40 SISWA
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Laboratorium &amp; Ruang Eksperimen
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
              LABORATORIUM &amp; EKSPLORASI ILMIAH
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Pusat Penyelidikan Sains dan Aplikasi Teknologi untuk Membentuk Peneliti Muda Berdaya
              Saing
            </p>

            {/* Metadata Artikel & Tombol Bagikan */}
            <div className="mb-1 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Oleh: Pengelola Laboratorium</span>
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
              I. Pusat Eksperimentasi Sains Terintegrasi
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Fasilitas Laboratorium {namaSekolahUppercase} didesain sebagai sarana vital bagi
              pengembangan keterampilan praktis, pemikiran analitis, dan pembuktian konsep riset
              sains. Fasilitas ini menghubungkan pemahaman teoritis di dalam kelas dengan pembuktian
              empiris melalui instrumen pengujian modern, pengamatan terstruktur, dan penerapan
              metodologi ilmiah yang presisi.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Dukungan perangkat praktikum dan standar ruang eksperimen yang aman memastikan peserta
              didik dapat melakukan investigasi ilmiah secara efektif, serta melatih sikap teliti
              dan analitis dalam menyikapi berbagai tantangan ilmu pengetahuan.
            </p>
          </section>

          {/* Seksi II: Fitur Layanan dan Keunggulan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Fitur Utama dan Keunggulan Fasilitas
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Keunggulan Laboratorium {namaSekolah} bertumpu pada kelengkapan sarana pengujian,
              penerapan prosedur K3, serta manajemen stasiun kerja yang efisien:
            </p>

            <div className="space-y-4">
              {FITUR_FASILITAS_04.map((item) => (
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

          {/* Seksi III: Tata Kelola, Keselamatan K3 & Infrastruktur */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Penerapan Standar K3 dan Manajemen Riset
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Penerapan Keselamatan dan Kesehatan Kerja (K3) merupakan prioritas mutlak dalam
              operasional fasilitas ini. Penggunaan ruang eksperimen dibekali dengan standar
              operasional prosedur (SOP) ketat, pertukaran udara yang optimal, serta jalur
              penanganan kondisi darurat yang transparan.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Selain menjaga keselamatan kerja, tata kelola fasilitas juga berfokus pada integrasi
              data hasil eksperimen agar dapat diakses dan dianalisis secara digital oleh para siswa
              dalam penyusunan laporan ilmiah maupun karya tulis riset.
            </p>
          </section>

          {/* Seksi IV: Visi Masa Depan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Visi: Menumbuhkan Budaya Riset dan Inovasi Berkelanjutan
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Fasilitas ini diharapkan dapat menjadi inkubator bagi lahirnya gagasan dan inovasi
              sains baru. Siswa diajak untuk tidak hanya mengikuti petunjuk praktikum dasar, tetapi
              juga terdorong melakukan eksperimen mandiri yang kritis, beretika, serta berorientasi
              pada pemecahan masalah.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Secara keseluruhan, fasilitas Laboratorium {namaSekolahUppercase} diposisikan sebagai
              pilar penting dalam membangun kecendekiawanan dan keunggulan akademik peserta didik di
              tingkat nasional maupun internasional.
            </p>
          </section>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Fasilitas Laboratorium {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="facility-04" />
    </div>
  );
}
