import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// Interface tipe data untuk fitur unggulan laboratorium komputer
interface FacilityFeature {
  id: string;
  title: string;
  desc: string;
  highlight: boolean;
}

// Data Statis: Fitur Unggulan Laboratorium Komputer
const FITUR_LAB_KOMPUTER: readonly FacilityFeature[] = [
  {
    id: 'high-spec-pc',
    title: '40 Unit PC Spesifikasi Tinggi & Software Berlisensi',
    desc: 'Dilengkapi prosessor generasi terbaru dan kartu grafis mumpuni untuk mendukung Integrated Development Environments (IDE), desain grafis 3D, simulasi jaringan, serta platform virtualisasi tanpa kendala performa.',
    highlight: false,
  },
  {
    id: 'fiber-optic',
    title: 'Konektivitas Fiber Optic High-Speed',
    desc: 'Infrastruktur jaringan pita lebar mendukung pembelajaran cloud computing, kolaborasi repositori kode jarak jauh, live streaming, dan pemrosesan data waktu nyata secara stabil.',
    highlight: false,
  },
  {
    id: 'ergonomic-environment',
    title: 'Lingkungan Ergonomis, AC Central & Proyektor HD',
    desc: 'Ruang pembelajaran berpendingin udara dengan pencahayaan anti-glare untuk mengurangi kelelahan mata, dilengkapi proyektor interaktif untuk kebutuhan demonstrasi teknikal dan code review.',
    highlight: false,
  },
  {
    id: 'cybersecurity-k3',
    title: 'Manajemen Keamanan Digital, Etika & Standar K3',
    desc: 'Pengintegrasian budaya Keselamatan dan Kesehatan Kerja (K3), tata kelola perangkat keras, edukasi keamanan siber (cybersecurity), serta etika digital dalam menjaga integritas data.',
    highlight: true,
  },
];

export default function Facility02Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Fasilitas Laboratorium Komputer (FACILITY-02)"
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
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`}
            alt={`Laboratorium Komputer ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI LAB KOMPUTER (FAC-02)
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
              FACILITY 02 — 40 UNIT PC
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              FIBER OPTIC HIGH-SPEED
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Laboratorium Komputer
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
              LABORATORIUM KOMPUTER &amp; TEKNOLOGI
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Infrastruktur Komputasi Modern untuk Mengembangkan Generasi Digital Berdaya Saing
              Global
            </p>

            {/* Metadata Artikel & Tombol Bagikan */}
            <div className="mb-1 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Oleh: Laboran &amp; Tim IT Sekolah
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
              I. Ruang Inkubasi Kompetensi Digital
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Laboratorium Komputer {namaSekolahUppercase} merupakan sebuah respons strategis
              terhadap tuntutan era digital yang semakin mengandalkan kompetensi teknologi informasi
              dalam setiap aspek kehidupan modern. Dalam konteks ini, laboratorium tidak diposisikan
              sebagai ruang yang sekadar menyediakan akses komputer; lebih fundamental lagi,
              laboratorium ini dirancang untuk mengembangkan &ldquo;digitally-competent
              learner&rdquo; — peserta didik yang memahami bahwa komputer adalah alat untuk
              berpikir, mencipta, dan memecahkan masalah, bukan sekadar mesin untuk mengetik dan
              browsing.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Lab terintegrasi dengan spesifikasi tinggi untuk pemrograman, desain, dan simulasi
              mencerminkan sebuah kesadaran akan spektrum kompetensi yang dibutuhkan untuk tidak
              hanya mengoperasikan perangkat lunak, tetapi juga untuk merancang, mengembangkan, dan
              mengelola solusi teknologi yang relevan dengan kebutuhan industri.
            </p>
          </section>

          {/* Seksi II: Fitur Layanan dan Keunggulan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Fitur Spesifikasi &amp; Keunggulan Infrastruktur
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Keunggulan Laboratorium Komputer {namaSekolah} dibangun di atas empat pilar utama
              perangkat keras, jaringan, ergonomi ruangan, dan standar keselamatan kerja:
            </p>

            <div className="space-y-4">
              {FITUR_LAB_KOMPUTER.map((item) => (
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

          {/* Seksi III: Spesifikasi Perangkat, Jaringan & Ergonomi */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Perangkat Spesifikasi Tinggi, Jaringan Fiber &amp; Budaya K3
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              40 unit PC spesifikasi tinggi dan software profesional berlisensi merupakan kompetensi
              inti yang membedakan laboratorium ini dari fasilitas komputasi biasa. Spesifikasi
              tinggi bukan sekadar kebanggaan teknis; ia adalah kebutuhan fungsional yang
              memungkinkan siswa untuk menjalankan aplikasi berat seperti Integrated Development
              Environments (IDE), software desain grafis 3D, platform virtualisasi, dan simulation
              tools tanpa hambatan performa. Siswa diajak memahami workflow produktif — mengelola
              proyek multi-file, mengoptimalkan waktu render, serta memanfaatkan sistem version
              control agar kode terorganisir dan dapat diandalkan.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Jaringan internet fiber optic dan infrastruktur konektivitas membentuk fondasi
              teoretis yang memungkinkan siswa memahami prinsip-prinsip dasar jaringan komputer.
              Konektivitas berkecepatan tinggi merupakan prasyarat untuk aktivitas modern seperti
              cloud computing, remote collaboration, live streaming, dan real-time data processing.
              Siswa dilatih tidak hanya menjadi pengguna pasif, melainkan calon administrator dan
              engineer yang mampu mendiagnosis masalah konektivitas serta merancang topologi
              jaringan yang efisien.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Fasilitas AC central, pencahayaan optimal anti-glare, dan proyektor presentasi
              mengangkat laboratorium ini menjadi ruang pembelajaran yang ergonomis. Di samping
              kenyamanan fisik, penerapan Keselamatan, Kesehatan Kerja, dan Lingkungan (K3) menjadi
              perhatian mendasar untuk mengantisipasi paparan cahaya biru, postur duduk (RSI), serta
              manajemen kabel listrik. Internalisasi budaya K3 sejak dini membentuk sikap
              profesional peserta didik saat memasuki dunia studi lanjut maupun kerja kelak.
            </p>
          </section>

          {/* Seksi IV: Refleksi Kritis & Kedaulatan Digital */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Visi: Etika Digital, Keamanan Siber &amp; Kedaulatan Teknologi
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Refleksi kritis terhadap Laboratorium Komputer mengharuskan kita membekali siswa
              dengan pemahaman keamanan siber (cybersecurity) dan etika digital — bagaimana
              melindungi data pribadi, mengidentifikasi bahaya malware, dan bertanggung jawab atas
              jejak digital mereka. Siswa juga diajak mempertimbangkan dampak lingkungan dari
              komputasi, termasuk konsumsi energi perangkat dan pengelolaan limbah elektronik
              (e-waste). Pengguna teknologi yang unggul adalah mereka yang berpikir kritis, adaptif,
              dan berkontribusi pada ekosistem digital yang aman.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Pada tataran yang lebih luas, Laboratorium Komputer {namaSekolahUppercase} dipandang
              sebagai komponen vital dalam membangun literasi digital dan kedaulatan teknologi
              nasional (technological sovereignty). Setiap siswa yang belajar di laboratorium ini
              diproyeksikan tidak hanya sebagai operator komputer, melainkan sebagai calon arsitek
              digital yang membawa Indonesia berdiri teguh di era transformasi global secara
              inovatif, aman, dan berkelanjutan.
            </p>
          </section>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Fasilitas Laboratorium Komputer {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="facility-02" />
    </div>
  );
}
