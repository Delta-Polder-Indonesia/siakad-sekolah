import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// Interface tipe data untuk fitur unggulan fasilitas 07
interface FacilityFeature {
  id: string;
  title: string;
  desc: string;
  highlight: boolean;
}

// Data Statis: Fitur Unggulan Fasilitas 07 (Masjid Sekolah)
const FITUR_FASILITAS_07: readonly FacilityFeature[] = [
  {
    id: 'kapasitas-ruang',
    title: 'Kapasitas 200 Jemaah & Tata Akustik Representatif',
    desc: 'Dirancang dengan memperhatikan estetika arsitektur Islam, orientasi kiblat yang presisi, sirkulasi udara alami, serta sistem tata suara (sound system) berkualitas tinggi untuk kenyamanan ibadah.',
    highlight: false,
  },
  {
    id: 'fasilitas-wudhu',
    title: 'Area Wudhu Terpisah & Kebersihan Terstandar',
    desc: 'Dilengkapi fasilitas tempat wudhu terpisah antara pria dan wanita yang menjamin privasi, kenyamanan, serta didukung sistem sanitasi dan drainase yang senantiasa terjaga.',
    highlight: false,
  },
  {
    id: 'literasi-keagamaan',
    title: 'Perpustakaan Mini Buku & Kitab Keagamaan',
    desc: 'Menyediakan koleksi literatur keagamaan, tafsir, dan buku pengembangan karakter guna mendukung pembinaan rohani serta peningkatkan literasi keagamaan seluruh jemaah.',
    highlight: false,
  },
  {
    id: 'pengkondisian-udara',
    title: 'Pendingin Udara (AC) & Kenyamanan Karpet Ibadah',
    desc: 'Penggunaan sistem pendingin udara terpadu dan karpet tebal yang higienis untuk menjaga kekhusyukan, kekondusifan, dan kenyamanan jamaah dalam menjalankan ibadah maupun kajian.',
    highlight: true,
  },
];

export default function Facility07Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Fasilitas (FACILITY-07)"
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
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-7.jpg`}
            alt={`Fasilitas Masjid ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI FASILITAS (FAC-07)
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
              FACILITY 07 — KAPASITAS 200 JEMAAH
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              LUAS BANUAN ±400 M²
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Masjid Sekolah
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
              MASJID SEKOLAH &amp; PUSAT PEMBINAAN KEROHANIAN
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Pusat Kegiatan Keagamaan, Pembentukan Karakter Mulia, dan Pengembangan Nilai-Nilai
              Spiritual Siswa
            </p>

            {/* Metadata Artikel & Tombol Bagikan */}
            <div className="mb-1 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Oleh: Pengurus BKM &amp; Tim Sarpras
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
              I. Fondasi Spiritual dalam Ekosistem Pendidikan
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Masjid Sekolah {namaSekolahUppercase} merupakan sebuah respons strategis terhadap
              tuntutan pendidikan holistik yang mengakui bahwa pembinaan spiritual dan keagamaan
              adalah fondasi utama bagi pembentukan karakter, moralitas, dan integritas siswa. Dalam
              konteks ini, masjid tidak diposisikan sebagai ruang ibadah yang sekadar menyediakan
              tempat untuk shalat; lebih fundamental lagi, masjid ini dirancang untuk mengembangkan
              *spiritually-grounded individual*—peserta didik yang memahami bahwa keimanan merupakan
              fondasi yang mengarahkan setiap aspek kehidupan menuju nilai-nilai luhur dan
              kebermanfaatan.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Dengan luas bangunan sekitar ±400 m² dan daya tampung hingga 200 jemaah, masjid ini
              menjadi pilar utama sekolah dalam mengakomodasi berbagai aktivitas keagamaan, kajian
              literasi Islam, serta program pembinaan rohani Islam (Rohris) secara berkelanjutan.
            </p>
          </section>

          {/* Seksi II: Fitur Layanan dan Keunggulan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Spesifikasi Kelengkapan &amp; Fasilitas Pendukung
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Pengelolaan Masjid Sekolah {namaSekolah} didukung oleh sarana prasarana yang
              mengutamakan kenyamanan, kesucian, dan efisiensi fungsi ibadah:
            </p>

            <div className="space-y-4">
              {FITUR_FASILITAS_07.map((item) => (
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

          {/* Seksi III: Tata Kelola, Kebersihan & Manajemen Keselamatan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Tata Kelola Lingkungan, Sanitasi &amp; Penerapan Standar K3
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Penerapan Keselamatan, Kesehatan Kerja, dan Lingkungan (K3) pada fasilitas tempat
              ibadah dilaksanakan secara disiplin melalui pemeliharaan sanitasi rutin pada tempat
              wudhu, pembersihan karpet berkala, penataan jalur evakuasi yang jelas, serta
              pemeriksaan instalasi kelistrikan.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Standar kebersihan yang konsisten dijaga guna menjamin kesehatan seluruh jemaah,
              menciptakan suasana khusyuk, serta memberikan rasa aman dan nyaman selama pelaksanaan
              ibadah rutin maupun peringatan hari besar keagamaan.
            </p>
          </section>

          {/* Seksi IV: Visi Masa Depan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Visi: Membentuk Generasi Berilmu &amp; Berakhlak Mulia
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Masjid {namaSekolahUppercase} memegang peranan strategis dalam menyokong agenda
              pembentukan karakter bangsa melalui penguatan *spiritual resilience* dan keteladanan
              moral.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Melalui program pembinaan keagamaan yang terstruktur dan inklusif, masjid sekolah
              terus berkomitmen mencetak lulusan yang cerdas secara intelektual serta tangguh dan
              santun secara spiritual.
            </p>
          </section>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Fasilitas Masjid {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="facility-07" />
    </div>
  );
}
