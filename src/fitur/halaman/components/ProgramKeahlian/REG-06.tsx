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
    id: 'electrical',
    title: '1. Sistem Kelistrikan & Elektronik Otomotif',
    desc: 'Kendaraan modern mengandung puluhan ECU yang mengontrol injeksi bahan bakar, transmisi, hingga sistem keselamatan aktif seperti ABS dan airbag. Menguasai pembacaan diagram rangkaian, protokol CAN-BUS, dan penggunaan scan tool berarti memahami logika kontrol kendaraan secara menyeluruh — bukan sekadar membaca kode error yang muncul di layar.',
    highlight: false,
  },
  {
    id: 'engine',
    title: '2. Perawatan Mesin Kendaraan Ringan',
    desc: 'Dari siklus termodinamika mesin bensin hingga sistem common-rail diesel, dari throttle body elektronik hingga variable valve timing — perawatan mesin modern memerlukan pemahaman terhadap perpaduan mekanik dan elektronik yang tak terpisahkan. Teknisi yang memahami keduanya mampu merancang jadwal perawatan preventif yang efektif dan mengkomunikasikan kondisi kendaraan kepada konsumen secara profesional.',
    highlight: false,
  },
  {
    id: 'chassis',
    title: '3. Perbaikan Chasis & Transmisi',
    desc: 'Suspensi, kemudi, rem, dan sistem pemindah tenaga adalah komponen yang menentukan keselamatan setiap penumpang di setiap perjalanan. Kompetensi ini semakin kompleks dengan adopsi electric power steering, CVT, dan dual-clutch transmission yang memerlukan pemahaman mekatronika — titik pertemuan antara mekanik presisi dan kontrol elektronik.',
    highlight: false,
  },
  {
    id: 'diagnostic',
    title: '4. Diagnosa Kerusakan dengan Scan Tool',
    desc: 'Waktu diagnosa yang akurat adalah selisih antara perbaikan tepat sasaran dan penggantian komponen yang tidak perlu — perbedaan yang bisa bernilai jutaan rupiah per kasus. Menguasai scan tool merek-spesifik, membaca live data, melakukan actuator test, dan menafsirkan kode kesalahan dalam konteks gejala nyata kendaraan adalah kompetensi yang paling dicari bengkel dan dealer resmi saat ini.',
    highlight: true,
  },
];

// Data Statis: Prosedur K3 & Kesiapan EV
const PROSEDUR_K3: readonly SafetyItem[] = [
  {
    id: 1,
    label: 'Keselamatan Bengkel Konvensional:',
    text: 'Prosedur penanganan bahan bakar, cairan transmisi, refrigeran AC, dan komponen bergerak yang menjadi standar keselamatan dasar di setiap bengkel otomotif profesional.',
  },
  {
    id: 2,
    label: 'Protokol Keselamatan Kendaraan Listrik & Hybrid:',
    text: 'Memahami risiko tegangan tinggi pada sistem baterai EV dan hybrid, prosedur isolasi sistem sebelum pengerjaan, dan penanganan baterai lithium yang memerlukan prosedur khusus berbeda dari baterai konvensional.',
  },
  {
    id: 3,
    label: 'Pengelolaan Limbah Otomotif:',
    text: 'Mengelola oli bekas, cairan pendingin, kampas rem yang mengandung logam berat, dan baterai kendaraan secara bertanggung jawab sesuai regulasi lingkungan yang semakin ketat.',
  },
  {
    id: 4,
    label: 'Sertifikasi Bengkel Resmi:',
    text: 'Memahami standar K3 yang menjadi syarat sertifikasi bengkel resmi merek internasional, yang membuka peluang karir yang jauh lebih luas dibandingkan bengkel umum non-tersertifikasi.',
  },
];

export default function Reg06Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Program Keahlian Teknik Kendaraan Ringan"
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramKeahlian/sekolah-6.jpg`}
            alt={`Program Studi Teknik Kendaraan Ringan ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI JURUSAN REG-06
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
              KODE KOMPETENSI: REG-06
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              3 TAHUN PROGRAM
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Program Studi Teknik Kendaraan Ringan
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
              TEKNIK KENDARAAN RINGAN (TKR)
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Mengenal Program Studi Teknik Kendaraan Ringan
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

          {/* Seksi I: Ketika Mobil Menjadi Komputer Beroda */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Ketika Mobil Menjadi Komputer Beroda
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Kendaraan modern bukan lagi sekadar mesin yang bergerak — ia adalah sistem
              cyber-physical yang kompleks, di mana mekanik, elektronik, dan perangkat lunak bekerja
              dalam satu harmoni yang tak terpisahkan. Memahaminya membutuhkan lebih dari sekadar
              kunci pas. Ada pergeseran fundamental yang terjadi dalam dunia otomotif selama dua
              dekade terakhir, dan pergeseran itu belum selesai. Kendaraan yang dulu diperbaiki
              dengan intuisi dan pengalaman mekanik kini hadir dengan ratusan sensor, puluhan ECU
              yang saling berkomunikasi, dan sistem keselamatan aktif yang membuat keputusan lebih
              cepat dari refleks manusia.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Teknik Kendaraan Ringan — atau TKR — adalah program yang merespons pergeseran ini
              secara langsung dan komprehensif. Program TKR di {namaSekolah} tidak dirancang untuk
              melahirkan montir yang hafal prosedur tanpa memahami alasannya. Ia dirancang untuk
              membentuk &quot;automotive technician&quot; yang berpikir sistemik — profesional yang
              memahami bahwa setiap gejala kerusakan adalah petunjuk dalam sebuah investigasi, dan
              bahwa solusi terbaik lahir dari pemahaman mendalam terhadap sistem, bukan dari
              penggantian komponen secara acak sampai masalah hilang.
            </p>
          </section>

          {/* Seksi II: Kompetensi Inti */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Empat Kompetensi yang Membentuk Teknisi Otomotif Modern
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kurikulum TKR dibangun dari kompetensi yang bergerak dari fondasi mekanik konvensional
              hingga diagnosa elektronik berbasis data — memastikan lulusan mampu bekerja di bengkel
              umum, dealer resmi, maupun industri otomotif yang terus bertransformasi:
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

          {/* Seksi III: Keselamatan Kerja & Transisi EV */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Keselamatan Kerja dan Kesiapan Menghadapi Era Kendaraan Listrik
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Bengkel otomotif menyimpan risiko yang nyata: bahan bakar yang mudah terbakar, baterai
              aki dengan asam sulfat pekat, sistem AC bertekanan tinggi, dan bahaya mekanis dari
              komponen bergerak. Namun ada dimensi baru yang kini harus ditambahkan: tegangan tinggi
              baterai kendaraan listrik yang bisa mencapai 400 volt — bahaya yang memerlukan
              protokol keselamatan yang sama sekali berbeda dari kendaraan konvensional. Kompetensi
              K3 dalam program ini dibangun untuk menghadapi kedua realitas ini sekaligus:
            </p>

            <ul className="ml-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-900">
              {PROSEDUR_K3.map((k3) => (
                <li key={k3.id}>
                  <span className="font-bold">{k3.label}</span> {k3.text}
                </li>
              ))}
            </ul>

            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Transisi menuju kendaraan listrik bukan ancaman bagi lulusan TKR — ia adalah peluang
              bagi mereka yang mempersiapkan diri lebih awal. Teknisi yang memahami prinsip dasar
              sistem propulsi elektrik, manajemen baterai, dan sistem regenerative braking hari ini
              adalah teknisi yang paling dicari ketika adopsi EV di Indonesia mencapai titik
              infleksinya dalam beberapa tahun ke depan.
            </p>
          </section>

          {/* Seksi IV: Mobilitas Nasional Berkelanjutan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. TKR dan Mobilitas Nasional yang Berkelanjutan
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Indonesia adalah salah satu pasar otomotif terbesar di Asia Tenggara, dengan jutaan
              kendaraan yang beroperasi di jalan setiap harinya. Di balik angka itu terdapat
              kebutuhan yang konstan dan tidak pernah berhenti: kendaraan yang beroperasi memerlukan
              perawatan, kendaraan yang rusak memerlukan perbaikan, dan kendaraan yang menua
              memerlukan penanganan yang bertanggung jawab terhadap lingkungan. Lulusan TKR adalah
              profesional yang memastikan siklus ini berjalan dengan aman dan efisien.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Lebih besar dari sekadar memenuhi kebutuhan bengkel yang ada, program TKR SMA Negeri 1
              Medan berkontribusi pada pembangunan kapasitas teknis nasional yang semakin dibutuhkan
              seiring ambisi Indonesia mengembangkan industri kendaraan listrik lokal. Lulusan yang
              memahami prinsip-prinsip dasar sistem otomotif secara mendalam — bukan hanya prosedur
              operasional — adalah lulusan yang mampu beradaptasi ketika teknologi berubah,
              memodifikasi pendekatan ketika platform baru hadir, dan berkontribusi pada inovasi
              lokal yang relevan dengan kebutuhan pasar Indonesia.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Teknisi otomotif terbaik di masa depan bukan hanya yang paling terampil di depan mesin
              konvensional. Mereka adalah pemikir adaptif yang memahami bahwa mobilitas adalah
              kebutuhan mendasar manusia, dan bahwa memastikan mobilitas itu berlangsung dengan
              aman, efisien, dan berkelanjutan adalah tanggung jawab profesional yang nyata. Lulusan
              TKR {namaSekolah} didorong untuk menjadi tepat seperti itu — penjaga mobilitas
              nasional yang siap untuk hari ini dan hari esok.
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
      <FloatingNav contentId="reg-06" />
    </div>
  );
}
