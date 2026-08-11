import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// Interface tipe data untuk fitur unggulan fasilitas perpustakaan
interface FacilityFeature {
  id: string;
  title: string;
  desc: string;
  highlight: boolean;
}

// Data Statis: Fitur Unggulan Perpustakaan
const FITUR_PERPUSTAKAAN: readonly FacilityFeature[] = [
  {
    id: 'digital-catalog',
    title: 'Katalog Digital Integratif & E-Book Access',
    desc: 'Digitalisasi katalog dan sistem penelusuran mandiri berbasis metadata memudahkan pengguna menemukan sumber referensi secara presisi. Fasilitas ini mendukung strategi riset yang efisien, cepat, dan terorganisir.',
    highlight: false,
  },
  {
    id: 'diverse-collection',
    title: '5.000+ Koleksi Literatur & Referensi Terkurasi',
    desc: 'Menyediakan spektrum bahan bacaan luas — mulai dari buku teks kurikulum utama, publikasi ilmiah, hingga karya fiksi penumbuh empati dan kreativitas untuk membangun karakter peserta didik yang utuh.',
    highlight: false,
  },
  {
    id: 'collaboration-area',
    title: 'Ruang Baca Ergonomis & Area Diskusi Kelompok',
    desc: 'Dilengkapi pendingin udara (AC) serta area diskusi akustik terpisah untuk mendukung pembelajaran kolaboratif, presentasi, dan pertukaran gagasan tanpa mengganggu ketenangan area baca utama.',
    highlight: false,
  },
  {
    id: 'literacy-program',
    title: 'Program Literasi Informasi & Keterampilan Riset',
    desc: 'Program bimbingan intensif bagi siswa untuk mengevaluasi kredibilitas sumber, memahami etika hak cipta (open access), serta membedakan fakta dari disinformasi di era digital.',
    highlight: true,
  },
];

export default function Facility01Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Fasilitas Perpustakaan (FACILITY-01)"
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
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`}
            alt={`Perpustakaan ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI PERPUSTAKAAN (FAC-01)
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
              FACILITY 01 — 5.000+ KOLEKSI BUKU
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              KAPASITAS 80 ORANG
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Perpustakaan Sekolah
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
              PERPUSTAKAAN DIGITAL &amp; LITERASI
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Pusat Pengetahuan Terintegrasi untuk Membentuk Generasi Pembelajar Kritis dan Mandiri
            </p>

            {/* Metadata Artikel & Tombol Bagikan */}
            <div className="mb-1 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Oleh: Pengelola Perpustakaan</span>
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
              I. Laboratorium Intelektual Era Informasi
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Perpustakaan {namaSekolahUppercase} merupakan sebuah respons strategis terhadap
              tuntutan literasi digital dan kebutuhan akan pusat pengetahuan yang komprehensif dalam
              era informasi yang semakin kompleks. Dalam konteks ini, perpustakaan tidak diposisikan
              sebagai ruang penyimpanan buku yang sekadar menyediakan bahan bacaan; lebih
              fundamental lagi, perpustakaan ini dirancang untuk mengembangkan
              &ldquo;information-literate learner&rdquo; — peserta didik yang memahami bahwa
              perpustakaan adalah laboratorium intelektual tempat pengetahuan tidak hanya
              dikonsumsi, tetapi juga dikritisi, disintesis, dan ditransformasi menjadi pemahaman
              yang mendalam.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Ruang baca nyaman dengan sistem digitalisasi katalog dan akses e-book mencerminkan
              sebuah kesadaran akan spektrum kompetensi yang dibutuhkan untuk tidak hanya membaca,
              tetapi juga menavigasi, mengevaluasi, dan memanfaatkan informasi secara etis dan
              efektif dalam berbagai konteks akademik maupun profesional.
            </p>
          </section>

          {/* Seksi II: Fitur Layanan dan Keunggulan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Fitur Layanan dan Keunggulan Fasilitas
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Keunggulan Perpustakaan {namaSekolah} terletak pada paduan antara teknologi
              penelusuran modern, tata ruang ergonomis, dan pembinaan literasi terstruktur:
            </p>

            <div className="space-y-4">
              {FITUR_PERPUSTAKAAN.map((item) => (
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

          {/* Seksi III: Ekosistem Pengetahuan & Keselamatan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Transformasi Katalog, Ekosistem Pengetahuan &amp; Budaya K3
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Sistem katalog digital terintegrasi dan akses e-book merupakan kompetensi inti yang
              membedakan perpustakaan modern dari perpustakaan konvensional. Digitalisasi katalog
              bukan sekadar mengubah kartu fisik menjadi database elektronik, melainkan transformasi
              fundamental dalam cara berinteraksi dengan informasi. Kemampuan menggunakan sistem
              katalog digital memerlukan pemahaman terhadap pencarian Boolean, filter metadata,
              serta navigasi antar-platform. Siswa diajak memahami arsitektur informasi — bagaimana
              data diorganisir dan bagaimana sistem merekomendasikan literatur yang relevan secara
              presisi.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Koleksi buku teks, referensi, dan fiksi membentuk fondasi teoretis yang memungkinkan
              siswa memahami prinsip dasar setiap disiplin ilmu. Buku teks memberikan struktur
              pengetahuan analitis, sementara karya fiksi mengembangkan empati dan imajinasi manusia
              yang sangat penting untuk pembentukan karakter utuh.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Di samping kenyamanan ruang baca ber-AC dan fasilitas diskusi kelompok, penerapan
              standar Keselamatan, Kesehatan Kerja, dan Lingkungan (K3) menjadi perhatian utama.
              Perpustakaan mengantisipasi risiko ergomoni baca, kesehatan mata dari paparan layar
              digital, sirkulasi udara ruangan, serta prosedur tanggap darurat kebakaran bahan
              kertas. Internalisasi budaya K3 ini membentuk sikap tanggung jawab peserta didik
              terhadap lingkungan belajarnya.
            </p>
          </section>

          {/* Seksi IV: Visi Masa Depan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Visi: Membangun Society of Knowledge dan Intellectual Sovereignty
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Refleksi kritis terhadap perpustakaan mengharuskan kita terus memperbarui perspektif
              literasi: apakah siswa dibekali pemahaman hak cipta (open access), inklusivitas
              koleksi, hingga kemampuan menyaring arus informasi di era disinformasi digital.
              Pengguna perpustakaan yang unggul di masa depan bukan hanya yang menguasai katalog dan
              rak buku, melainkan yang mampu berpikir kritis, beradaptasi dengan evolusi
              pengetahuan, dan berkontribusi pada ekosistem literasi yang terbuka.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Pada tataran yang lebih luas, Perpustakaan {namaSekolahUppercase} dipandang sebagai
              komponen vital dalam membangun &ldquo;knowledge society&rdquo; dan &ldquo;intellectual
              sovereignty&rdquo;. Setiap pengguna perpustakaan bukan sekadar pembaca pasif; mereka
              adalah penjaga api pengetahuan yang memastikan roda literasi nasional terus berputar
              dengan cerdas, kritis, dan berkelanjutan.
            </p>
          </section>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Fasilitas Perpustakaan {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="facility-01" />
    </div>
  );
}
