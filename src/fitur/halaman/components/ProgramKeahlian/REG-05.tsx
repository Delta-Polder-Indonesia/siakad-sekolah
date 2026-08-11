import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// Interface tipe data untuk struktur kompetensi & K3
interface CompetencyItem {
  id: string;
  title: string;
  desc: string;
  highlight: boolean;
}

interface SafetyItem {
  id: number;
  label: string;
  text: string;
}

// Data Statis: Kompetensi Inti
const KOMPETENSI_INTI: readonly CompetencyItem[] = [
  {
    id: 'cnc',
    title: '1. Pengoperasian & Pemrograman Mesin CNC',
    desc: 'CNC memungkinkan pembuatan komponen dengan presisi mikron dan konsistensi identik untuk ribuan unit. Menguasai pemrograman CNC berarti memahami kode G dan M, simulasi toolpath, dan parameter pemotongan optimal — sekaligus memahami bagaimana material merespons kecepatan pemotongan tertentu dan bagaimana tooling memengaruhi kualitas permukaan akhir.',
    highlight: false,
  },
  {
    id: 'blueprint',
    title: '2. Pembacaan Gambar Teknik & Blueprint',
    desc: 'Gambar teknik adalah bahasa universal industri — menyampaikan dimensi, toleransi, material, dan finishing melalui simbol standar ISO dan ANSI. Kemampuan membaca blueprint memungkinkan komunikasi efektif dengan tim desain, identifikasi kesalahan desain sejak awal, dan jaminan bahwa produk akhir sesuai dengan spesifikasi teknis yang ditetapkan.',
    highlight: false,
  },
  {
    id: 'measurement',
    title: '3. Pengukuran & Toleransi Mekanik',
    desc: 'Dalam industri presisi — aerospace, otomotif, medis — toleransi bisa seketat beberapa mikron. Menguasai instrumentasi pengukuran dari mikrometer hingga CMM, memahami sistem toleransi ISO, dan mampu menganalisis variasi proses secara statistik adalah yang membedakan teknisi inspeksi dari sekadar pembaca angka.',
    highlight: false,
  },
  {
    id: 'conventional',
    title: '4. Pemesinan Konvensional — Bubut, Frais, Gerinda',
    desc: 'Tidak semua pekerjaan memerlukan CNC — prototipe, perbaikan darurat, dan produksi skala kecil sering lebih efisien dikerjakan secara konvensional. Lebih dari itu, pemahaman mendalam terhadap pemesinan konvensional memberikan fondasi konseptual yang kuat untuk memahami CNC, karena pada dasarnya CNC hanya mengotomatisasi gerakan yang sebelumnya dilakukan secara manual.',
    highlight: true,
  },
];

// Data Statis: Prosedur K3
const PROSEDUR_K3: readonly SafetyItem[] = [
  {
    id: 1,
    label: 'Identifikasi dan Mitigasi Bahaya:',
    text: 'Mengenali potensi bahaya di setiap jenis pekerjaan pemesinan dan mengimplementasikan langkah mitigasi sebelum mesin dinyalakan, bukan setelah insiden terjadi.',
  },
  {
    id: 2,
    label: 'Prosedur Kerja Aman dan APD:',
    text: 'Memahami dan menerapkan penggunaan Alat Pelindung Diri yang tepat untuk setiap operasi mesin, dari kacamata pelindung hingga pelindung pendengaran di area berkebisingan tinggi.',
  },
  {
    id: 3,
    label: 'Pengelolaan Limbah Proses:',
    text: 'Mengelola serpihan logam, cairan pendingin bekas, dan material sisa proses pemotongan secara bertanggung jawab — aspek yang semakin dipersyaratkan dalam standar industri berkelanjutan dan sertifikasi lingkungan.',
  },
  {
    id: 4,
    label: 'Efisiensi Energi Mesin Produksi:',
    text: 'Memahami konsumsi energi dari mesin CNC dan konvensional, serta mengoptimalkan parameter proses untuk meminimalkan pemborosan energi tanpa mengorbankan kualitas dan produktivitas.',
  },
];

export default function Reg05Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Program Keahlian Teknik Pemesinan"
      className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900"
    >
      {/* ═══ HEADER TRANSPARAN — Style Standard Platform ═══════════════════ */}
      <header className="absolute top-0 right-0 left-0 z-30 flex h-15 w-full items-center justify-between bg-transparent px-6 py-6 lg:px-8">
        {/* Kiri: Tombol Kembali + Judul Navigasi */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Kembali ke halaman Program Keahlian"
            className="flex h-8 w-8 items-center justify-center text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramKeahlian/sekolah-5.jpg`}
            alt={`Program Studi Teknik Pemesinan ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI JURUSAN REG-05
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
              KODE KOMPETENSI: REG-05
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              3 TAHUN PROGRAM
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Program Studi Teknik Pemesinan
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
              TEKNIK PEMESINAN (TPM)
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Mengenal Program Studi Teknik Pemesinan
            </p>

            {/* Metadata Artikel & Tombol Bagikan */}
            <div className="mb-1 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
                <span className="text-slate-300" aria-hidden="true">
                  •
                </span>
                <time dateTime="2026-06-10">Rabu, 10 Juni 2026</time>
              </div>

              <ShareButtons />
            </div>
          </div>

          {/* Seksi I: Presisi sebagai Bahasa Industri */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Presisi sebagai Bahasa Industri
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Sebelum sebuah produk hadir di tangan konsumen, ia terlebih dahulu lahir di atas meja
              mesin — dipotong, dibentuk, dan disempurnakan dengan presisi yang tidak memberi ruang
              untuk kompromi. Di sinilah Teknik Pemesinan menemukan perannya yang paling
              fundamental. Ada sesuatu yang mendasar tentang pemesinan yang sering kali luput dari
              perhatian: hampir setiap benda yang kita gunakan sehari-hari — dari komponen kendaraan
              bermotor hingga perangkat medis yang menyelamatkan nyawa — lahir dari proses pemesinan
              yang dilakukan dengan toleransi yang ketat.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Teknik Pemesinan adalah disiplin yang mempelajari bagaimana material mentah diubah
              menjadi komponen presisi melalui proses pemotongan, pembentukan, dan pengolahan yang
              terencana dan terkontrol. Program Teknik Pemesinan di {namaSekolah} dirancang untuk
              membentuk &quot;manufacturing engineer&quot; — profesional yang memahami mengapa
              setiap parameter proses dipilih, bagaimana material merespons perlakuan tertentu, dan
              bagaimana keputusan di meja mesin berdampak langsung pada kualitas akhir produk.
            </p>
          </section>

          {/* Seksi II: Kompetensi Inti */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Kompetensi Inti yang Membentuk Teknisi Pemesinan
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kurikulum Teknik Pemesinan dibangun dari kompetensi yang bergerak dari fondasi manual
              hingga otomasi berbasis komputer — memastikan lulusan mampu bekerja di berbagai
              konteks industri, dari bengkel presisi hingga pabrik manufaktur berskala besar:
            </p>

            <div className="space-y-4">
              {KOMPETENSI_INTI.map((item) => (
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

          {/* Seksi III: Keselamatan Kerja & K3 */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Keselamatan Kerja dan Manufaktur yang Bertanggung Jawab
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Bengkel pemesinan menyimpan risiko operasional yang tidak bisa dianggap remeh.
              Kompetensi K3 dalam program ini dibangun secara berlapis untuk membentuk profesional
              yang bertanggung jawab terhadap diri sendiri, rekan kerja, dan lingkungan sekitarnya:
            </p>

            <ul className="ml-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-900">
              {PROSEDUR_K3.map((k3) => (
                <li key={k3.id}>
                  <span className="font-bold">{k3.label}</span> {k3.text}
                </li>
              ))}
            </ul>

            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Siswa yang menginternalisasi budaya K3 sejak masa pendidikan membawa kebiasaan ini
              langsung ke lantai produksi — berkontribusi pada penurunan angka kecelakaan kerja,
              peningkatan produktivitas, dan efisiensi biaya operasional perusahaan.
            </p>
          </section>

          {/* Seksi IV: Visi Industri Nasional */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Teknik Pemesinan dan Masa Depan Manufaktur Indonesia
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Indonesia memiliki ambisi besar dalam bidang manufaktur — dari pengembangan industri
              kendaraan listrik nasional hingga ekspansi sektor penerbangan dan pertahanan. Semua
              ambisi ini bertumpu pada satu prasyarat utama: kemampuan memproduksi komponen presisi
              secara mandiri di dalam negeri.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Teknisi pemesinan terbaik di masa depan bukan hanya yang paling terampil di depan
              mesin bubut atau CNC, melainkan pemikir sistemik yang memahami keseluruhan rantai
              nilai manufaktur — dari desain menuju pemilihan material, hingga dampak produk pada
              pengguna akhir. Lulusan Teknik Pemesinan {namaSekolah} didorong untuk mengisi posisi
              strategis ini sebagai pilar kemandirian manufaktur nasional.
            </p>
          </section>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Program Keahlian {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="reg-05" />
    </div>
  );
}
