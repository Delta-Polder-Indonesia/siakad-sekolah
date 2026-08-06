import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Reg02Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900"
    >
      {/* ═══ HEADER TRANSPARAN — Style Standard Platform ═══════════════════ */}
      <header className="absolute top-0 right-0 left-0 z-30 flex h-15 w-full items-center justify-between bg-transparent px-6 py-6 lg:px-8">
        {/* Kiri: Tombol Kembali + Judul Navigasi */}
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            aria-label="Kembali ke halaman Program Keahlian"
            className="flex h-8 w-8 items-center justify-center text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramKeahlian/sekolah-2.jpg`}
            alt={`Program Studi Teknik Komputer dan Jaringan ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI JURUSAN REG-02
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
              KODE KOMPETENSI: REG-02
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              3 TAHUN PROGRAM
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Program Studi Teknik Komputer dan Jaringan
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
              TEKNIK KOMPUTER DAN JARINGAN (TKJ)
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Mengenal Program Studi Teknik Komputer dan Jaringan
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

          {/* Seksi I: Infrastruktur Peradaban Digital */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Jaringan sebagai Infrastruktur Peradaban Digital
            </h3>
            <p className="first-letter:line-height-none text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Di balik setiap pesan yang terkirim, setiap transaksi yang berhasil, dan setiap
              halaman web yang terbuka dalam hitungan detik, terdapat infrastruktur jaringan yang
              bekerja tanpa henti. Teknik Komputer dan Jaringan — atau TKJ — adalah disiplin yang
              mempelajari bagaimana infrastruktur tak kasat mata ini dibangun, dijaga, dan
              dikembangkan. Program ini bukan sekadar mengajarkan cara memasang kabel atau
              mengkonfigurasi perangkat; ia membentuk "network architect" yang mampu merancang
              ekosistem digital yang andal, aman, dan siap tumbuh seiring kebutuhan organisasi.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Dalam perspektif yang lebih luas, jaringan komputer adalah urat nadi peradaban
              digital. Ketika jaringan terganggu, seluruh rantai nilai yang bergantung padanya —
              dari komunikasi bisnis hingga layanan kesehatan darurat — ikut terputus. Inilah yang
              menjadikan kompetensi TKJ bukan sekadar keterampilan teknis, melainkan tanggung jawab
              profesional yang nyata.
            </p>
          </div>

          {/* Seksi II: Kompetensi Inti */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Kompetensi Inti yang Dibangun
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kurikulum TKJ di {namaSekolah} dirancang untuk mencakup spektrum kompetensi yang
              dibutuhkan industri — dari fondasi teknis hingga keahlian yang membedakan teknisi
              junior dari profesional berpengalaman:
            </p>

            <div className="space-y-4">
              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  1. Instalasi & Konfigurasi LAN/WAN
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Menguasai perancangan dan implementasi jaringan lokal maupun wide-area yang
                  mencakup pemilihan topologi, konfigurasi protokol, dan pengelolaan perangkat keras
                  — memastikan jaringan yang dibangun tidak hanya berfungsi hari ini, tetapi juga
                  mampu berkembang seiring kebutuhan organisasi di masa mendatang.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  2. Keamanan Jaringan & Firewall
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Memahami lanskap ancaman siber dan mengimplementasikan strategi pertahanan
                  berlapis — dari konfigurasi firewall dan sistem deteksi intrusi hingga "offensive
                  security mindset" yang memungkinkan identifikasi kerentanan sebelum dieksploitasi
                  oleh pihak yang tidak bertanggung jawab.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  3. Routing & Switching — Cisco dan MikroTik
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Bekerja dengan dua platform yang paling relevan di industri Indonesia — Cisco
                  untuk lingkungan enterprise skala besar, dan MikroTik untuk penyedia layanan
                  internet serta organisasi skala menengah — memberikan fleksibilitas yang
                  memperluas cakupan peluang karir lulusan secara signifikan.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  4. Troubleshooting Hardware & Software
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Mengembangkan "diagnostic reasoning" yang terstruktur — bukan sekadar intuisi,
                  melainkan metodologi sistematis dalam mengidentifikasi gejala, mengisolasi
                  variabel, dan memverifikasi solusi. Setiap menit downtime jaringan berbiaya nyata;
                  kemampuan pemulihan yang cepat adalah aset yang langsung terasa nilainya bagi
                  organisasi mana pun.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi III: Jalur Sertifikasi */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Jalur Sertifikasi dan Validasi Kompetensi
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Salah satu keunggulan program TKJ adalah orientasinya yang kuat terhadap sertifikasi
              industri. Persiapan menuju sertifikasi bukan hanya soal lulus ujian — ia adalah proses
              yang memaksa pemahaman yang lebih dalam dan membentuk disiplin belajar mandiri.
              Berikut adalah jalur validasi kompetensi yang dipersiapkan dalam program ini:
            </p>

            <ul className="ml-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-900">
              <li>
                <span className="font-bold">CCNA (Cisco Certified Network Associate):</span> Standar
                industri global yang diakui sebagai bukti kompetensi jaringan dasar, mengurangi
                risiko rekrutmen bagi pemberi kerja dan membuka pintu karir yang lebih luas bagi
                lulusan.
              </li>
              <li>
                <span className="font-bold">Sertifikasi LSP Nasional:</span> Validasi kompetensi
                yang diakui secara nasional melalui Lembaga Sertifikasi Profesi, memastikan standar
                keterampilan yang terukur dan dipertanggungjawabkan kepada industri.
              </li>
              <li>
                <span className="font-bold">MikroTik Certified Network Associate (MTCNA):</span>{' '}
                Sertifikasi yang sangat relevan untuk pasar Indonesia, di mana MikroTik mendominasi
                ekosistem penyedia layanan internet dan jaringan skala menengah.
              </li>
              <li>
                <span className="font-bold">Uji Kompetensi Keahlian (UKK):</span> Asesmen akhir yang
                mengintegrasikan seluruh kompetensi yang dipelajari dalam simulasi dunia kerja
                nyata, menjadi bukti kesiapan siswa untuk memasuki industri.
              </li>
            </ul>

            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Perlu dicatat bahwa aksesibilitas terhadap sertifikasi — terutama CCNA yang memerlukan
              biaya ujian yang tidak sedikit — harus dijamin melalui program beasiswa atau subsidi
              institusional. Kompetensi tidak boleh menjadi hak eksklusif mereka yang memiliki
              kemampuan finansial; setiap siswa berbakat berhak atas kesempatan yang sama untuk
              divalidasi secara profesional.
            </p>
          </div>

          {/* Seksi IV: Peran Strategis */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. TKJ dan Peran Strategisnya dalam Ekosistem Digital Nasional
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Ada dimensi yang lebih besar dari sekadar keterampilan teknis ketika kita berbicara
              tentang TKJ: kontribusinya terhadap kedaulatan digital bangsa. Indonesia, dengan
              populasi lebih dari 270 juta jiwa dan ambisi menjadi ekonomi digital terbesar di Asia
              Tenggara, memerlukan infrastruktur jaringan yang tidak hanya luas, tetapi juga aman
              dan andal. Setiap lulusan TKJ yang kompeten adalah satu langkah lebih dekat menuju
              terpenuhinya "talent gap" yang selama ini menjadi hambatan nyata dalam pembangunan
              digital nasional.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Dalam konteks ini, {namaSekolah} bukan sekadar lembaga pendidikan vokasi — ia adalah
              institusi yang secara aktif membentuk kapasitas digital bangsa. Program TKJ yang
              responsif terhadap tren "software-defined networking", komputasi awan, dan ancaman
              keamanan siber yang terus berkembang, akan terus relevan bahkan ketika teknologi
              spesifik yang diajarkan hari ini sudah berevolusi menjadi sesuatu yang berbeda sama
              sekali.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Namun relevansi jangka panjang program ini juga bergantung pada kesediaan untuk
              mempertanyakan asumsi-asumsi yang sering kali dianggap sudah pasti. Apakah siswa
              diajarkan untuk mempertimbangkan dampak lingkungan dari infrastruktur yang mereka
              bangun — konsumsi energi pusat data, jejak karbon dari perangkat yang terus
              diperbarui? Apakah mereka dibekali pemahaman etis tentang privasi data dan netralitas
              jaringan sebagai hak digital warga negara? Bagaimana program mempersiapkan mereka
              menghadapi otomatisasi yang semakin mengambil alih tugas-tugas monitoring dan
              konfigurasi rutin?
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Pertanyaan-pertanyaan ini bukan kelemahan program — justru sebaliknya. Kemampuan untuk
              terus mempertanyakan dan memperbarui diri adalah tanda dari program pendidikan yang
              hidup dan adaptif. Lulusan TKJ {namaSekolah}, pada akhirnya, bukan sekadar teknisi
              jaringan — mereka adalah penjaga gerbang digital yang memastikan aliran informasi
              tetap lancar, aman, dan adil; arsitek infrastruktur yang memahami bahwa setiap
              keputusan teknis yang mereka buat memiliki konsekuensi sosial yang jauh melampaui
              ruang server tempat perangkat mereka beroperasi.
            </p>
          </div>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Program Keahlian {namaSekolah} • Periode Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="reg-02" />
    </div>
  );
}
