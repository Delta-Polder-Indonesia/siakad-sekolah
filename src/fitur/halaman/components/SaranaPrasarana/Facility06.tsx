import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// Interface tipe data untuk fitur unggulan fasilitas 06
interface FacilityFeature {
  id: string;
  title: string;
  desc: string;
  highlight: boolean;
}

// Data Statis: Fitur Unggulan Fasilitas 06 (Ruang UKS / Layanan Kesehatan)
const FITUR_FASILITAS_06: readonly FacilityFeature[] = [
  {
    id: 'perawat-profesional',
    title: 'Tenaga Perawat Profesional & Layanan Triase',
    desc: 'Dikelola oleh tenaga medis berlisensi yang memiliki keahlian evaluasi klinis awal, penanganan kondisi darurat, serta pendampingan kesehatan bagi seluruh warga sekolah.',
    highlight: false,
  },
  {
    id: 'inventaris-p3k',
    title: 'Perlengkapan P3K Lengkap & Tempat Tidur Pemulihan',
    desc: 'Dilengkapi fasilitas pertolongan pertama terstandar, obat-obatan esensial, serta tempat tidur pemulihan yang aman dan steril untuk penanganan kondisi akut.',
    highlight: false,
  },
  {
    id: 'jejaring-faskes',
    title: 'Pemeriksaan Tanda Vital & Jejaring Rujukan Puskesmas',
    desc: 'Menyediakan instrumen pemantauan kesehatan berkala serta terintegrasi langsung dengan Puskesmas terdekat guna menjamin sistem rujukan yang cepat dan terkoordinasi.',
    highlight: false,
  },
  {
    id: 'promosi-k3',
    title: 'Edukasi Kesehatan & Penerapan Protokol K3 Medis',
    desc: 'Menyelenggarakan program edukasi Perilaku Hidup Bersih dan Sehat (PHBS) serta menerapkan pengelolaan limbah medis dan etika privasi sesuai regulasi K3.',
    highlight: true,
  },
];

export default function Facility06Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Fasilitas (FACILITY-06)"
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
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ═══ HERO BANNER ═══════════════════════════════════════════════════ */}
      <div
        className={`relative min-h-[280px] w-full overflow-hidden bg-slate-100 ${TINGGI_FOTO} ${MAKSIMAL_TINGGI}`}
      >
        {!imageError ? (
          <img
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-6.jpg`}
            alt={`Fasilitas Ruang UKS ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI FASILITAS (FAC-06)
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
              FACILITY 06 — LAYANAN KESEHATAN
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              2 TENAGA PERAWAT MEDIS
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Ruang Unit Kesehatan Sekolah (UKS)
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
              RUANG UKS &amp; LAYANAN KESEHATAN TERPADU
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Pusat Pelayanan Kesehatan Preventif, Promotif, dan Kuratif untuk Mewujudkan Ekosistem
              Belajar yang Sehat
            </p>

            {/* Metadata Artikel & Tombol Bagikan */}
            <div className="mb-1 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Oleh: Tim Medis &amp; Pengelola UKS
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  •
                </span>
                <time dateTime="2026-07-21">Selasa, 21 Juli 2026</time>
              </div>

              <ShareButtons />
            </div>
          </div>

          {/* Seksi I: Pengantar Deskripsi Fasilitas */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Fondasi Kesehatan dalam Ekosistem Pendidikan
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Ruang Unit Kesehatan Sekolah (UKS) {namaSekolahUppercase} merupakan respons strategis
              terhadap tuntutan pendidikan holistik yang mengakui bahwa kesejahteraan fisik dan
              mental siswa adalah fondasi utama keberhasilan akademik. Dalam konteks ini, UKS tidak
              diposisikan sebagai ruang pertolongan pertama semata, melainkan dirancang untuk
              membangun komunitas sekolah yang memiliki literasi kesehatan tinggi (*health-literate
              community*).
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kehadiran tenaga medis profesional dan sarana pertolongan yang terstandar mencerminkan
              komitmen sekolah untuk menangani kondisi darurat secara responsif sekaligus
              menumbuhkan budaya pencegahan penyakit yang berkelanjutan di lingkungan pendidikan.
            </p>
          </section>

          {/* Seksi II: Fitur Layanan dan Keunggulan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Spesifikasi Layanan &amp; Fasilitas Pendukung
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Pengelolaan Ruang UKS {namaSekolah} didukung oleh fasilitas terpadu serta kompetensi
              layanan medis dasar yang profesional:
            </p>

            <div className="space-y-4">
              {FITUR_FASILITAS_06.map((item) => (
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

          {/* Seksi III: Tata Kelola, Keselamatan K3 & Lingkungan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Penerapan Standar K3 Medis &amp; Sistem Rujukan
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Penerapan Keselamatan dan Kesehatan Kerja (K3) pada fasilitas medis sekolah
              dilaksanakan melalui prosedur sterilisasi berkala, pemilahan limbah medis, dan
              kerahasiaan rekam medis siswa.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Melalui koordinasi terencana dengan Puskesmas terdekat, UKS menjamin skema penanganan
              rujukan yang cepat (*continuum of care*) untuk menangani kondisi kesehatan yang
              memerlukan penanganan tingkat lanjut secara tepat dan terukur.
            </p>
          </section>

          {/* Seksi IV: Visi Masa Depan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Visi: Mewujudkan Generasi Tangguh &amp; Sehat
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              UKS {namaSekolahUppercase} berperan penting dalam menyokong agenda nasional untuk
              menciptakan generasi yang sehat secara fisik dan tangguh secara mental.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Melalui penguatan program promosi kesehatan, sekolah berkomitmen mencetak lulusan yang
              tidak hanya unggul secara akademik, tetapi juga memiliki kesadaran tinggi akan
              pentingnya pola hidup sehat mandiri.
            </p>
          </section>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Fasilitas Ruang UKS {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="facility-06" />
    </div>
  );
}
