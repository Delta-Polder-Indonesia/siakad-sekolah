import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// Interface tipe data untuk fitur unggulan fasilitas 08
interface FacilityFeature {
  id: string;
  title: string;
  desc: string;
  highlight: boolean;
}

// Data Statis: Fitur Unggulan Fasilitas 08 (Kantin & Koperasi)
const FITUR_FASILITAS_08: readonly FacilityFeature[] = [
  {
    id: 'standar-haccp',
    title: 'Standar Keamanan Pangan & Nutrisi Seimbang (HACCP)',
    desc: 'Pengawasan ketat sanitasi dapur, pengelolaan rantai dingin (cold chain), dan penyusunan menu berbasis prinsip balanced diet untuk menjamin kualitas mikronutrien siswa.',
    highlight: false,
  },
  {
    id: 'pembayaran-cashless',
    title: 'Sistem Pembayaran Digital (Cashless) & Inklusivitas',
    desc: 'Integrasi teknologi digital payment guna efisiensi transaksi, transparansi keuangan, serta dukungan keterjangkauan harga bagi seluruh lapisan civitas akademika.',
    highlight: false,
  },
  {
    id: 'pemberdayaan-koperasi',
    title: 'Koperasi Siswa & Edukasi Literasi Keuangan',
    desc: 'Wadah praktik kewirausahaan mandiri, penyediaan alat tulis dan perlengkapan sekolah, serta sarana pembelajaran manajemen bisnis dan ekonomi secara nyata.',
    highlight: false,
  },
  {
    id: 'area-makan-k3',
    title: 'Area Makan Higienis & Penerapan Manajemen K3',
    desc: 'Fasilitas area makan yang bersih, nyaman, dan berventilasi baik, didukung penerapan standar K3 untuk pencegahan risiko kontaminasi dan keselamatan kerja.',
    highlight: true,
  },
];

export default function Facility08Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Fasilitas (FACILITY-08)"
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
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-8.jpg`}
            alt={`Fasilitas Kantin dan Koperasi ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI FASILITAS (FAC-08)
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
              FACILITY 08 — HIGIENIS &amp; TERJANGKAU
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              OPERASIONAL: 06:30 – 14:30 WIB
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Kantin &amp; Koperasi Sekolah
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
              KANTIN HIGIENIS &amp; KOPERASI PEMBERDAYAAN SISWA
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Pusat Layanan Nutrisi Seimbang, Edukasi Konsumsi Berkelanjutan, dan Literasi
              Kewirausahaan Digital
            </p>

            {/* Metadata Artikel & Tombol Bagikan */}
            <div className="mb-1 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Oleh: Tim Manajemen Kantin &amp; Pengurus Koperasi
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
              I. Integritas Kesejahteraan &amp; Nutrisi Ekosistem Belajar
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Kantin dan Koperasi {namaSekolahUppercase} merupakan sebuah respons strategis terhadap
              tuntutan pendidikan holistik yang semakin mengakui bahwa nutrisi yang memadai dan
              kesejahteraan ekonomi siswa adalah fondasi utama bagi konsentrasi belajar, pertumbuhan
              fisik, dan pengembangan karakter yang optimal. Dalam konteks ini, kantin dan koperasi
              tidak diposisikan sebagai fasilitas komersial yang sekadar menyediakan makanan dan
              barang dagangan; lebih fundamental lagi, fasilitas ini dirancang untuk mengembangkan
              *economically-aware and health-conscious individual*—peserta didik yang memahami bahwa
              setiap keputusan konsumsi adalah sebuah pilihan etis, ekonomis, dan kesehatan.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Melalui penerapan standar kebersihan yang ketat, pengawasan menu bergizi seimbang,
              serta integrasi transaksi *cashless*, fasilitas ini menjadi instrumen pembelajaran
              praktis dalam membangun pola hidup sehat dan literasi keuangan modern secara
              konsisten.
            </p>
          </section>

          {/* Seksi II: Fitur Layanan dan Keunggulan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Spesifikasi Layanan &amp; Keunggulan Fasilitas
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Pengelolaan Kantin dan Koperasi {namaSekolah} berpedoman pada prinsip keterjangkauan,
              kualitas gizi, serta efisiensi tata kelola layanan:
            </p>

            <div className="space-y-4">
              {FITUR_FASILITAS_08.map((item) => (
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
              III. Pengawasan Kualitas, Sanitasi &amp; Penegakan K3
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Keselamatan, Kesehatan Kerja, dan Lingkungan (K3) pada area pengelolaan pangan
              dilaksanakan secara ketat melalui audit sanitasi rutin, pengujian kebersihan peralatan
              dapur, manajemen limbah bahan organik, dan pelatihan higiene bagi seluruh pengelola
              tenant.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Langkah mitigasi risiko seperti penyediaan alat pemadam api ringan (APAR), penataan
              jalur sirkulasi udara, serta penerapan prosedur penanganan bahan makanan higienis
              diterapkan secara disiplin untuk memberikan rasa aman dan nyaman bagi seluruh
              pengunjung.
            </p>
          </section>

          {/* Seksi IV: Visi Masa Depan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Visi: Mewujudkan Generasi Sadar Nutrisi &amp; Kemandirian Ekonomi
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kantin dan Koperasi {namaSekolahUppercase} berkomitmen mendukung terciptanya budaya
              konsumsi yang sehat, etis, dan ramah lingkungan melalui program pengurangan sampah
              plastik dan pengelolaan makanan yang bertanggung jawab.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Diharapkan fasilitas ini terus berfungsi tidak hanya sebagai sarana pendukung harian,
              tetapi juga sebagai laboratorium hidup (*living lab*) dalam membentuk karakter siswa
              yang cerdas, mandiri, dan adaptif terhadap tantangan ekonomi masa depan.
            </p>
          </section>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Fasilitas Kantin &amp; Koperasi {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="facility-08" />
    </div>
  );
}
