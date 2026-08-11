import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Reg03Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramKeahlian/sekolah-3.jpg`}
            alt={`Program Studi Desain Komunikasi Visual ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI JURUSAN REG-03
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
              KODE KOMPETENSI: REG-03
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              3 TAHUN PROGRAM
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Program Studi Desain Komunikasi Visual
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
              DESAIN KOMUNIKASI VISUAL (DKV)
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Mengenal Program Studi Desain Komunikasi Visual
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

          {/* Seksi I: Komunikasi Visual */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Ketika Gambar Berbicara Lebih Keras dari Kata
            </h3>
            <p className="first-letter:line-height-none text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Di era ketika perhatian adalah komoditas paling langka, kemampuan merancang pesan
              visual yang bermakna bukan sekadar keterampilan estetika — ia adalah senjata
              komunikasi yang paling kuat di tangan siapa pun yang menguasainya. Desain Komunikasi
              Visual — atau DKV — adalah bidang yang menempatkan visual bukan sebagai ornamen,
              melainkan sebagai bahasa. Setiap warna yang dipilih, setiap tipografi yang ditentukan,
              setiap komposisi yang dirancang adalah keputusan yang membawa konsekuensi komunikatif.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Program DKV di {namaSekolah} lahir dari kesadaran ini: bahwa dunia modern tidak
              kekurangan konten, melainkan kekurangan konten yang bermakna — dan bahwa kemampuan
              untuk menciptakan yang bermakna adalah kompetensi yang semakin langka dan bernilai.
              Program ini tidak dirancang untuk melahirkan operator perangkat lunak yang sekadar
              mahir menggunakan alat tanpa memahami tujuannya. Ia dirancang untuk membentuk "visual
              communicator" — profesional yang memahami bahwa di balik setiap karya desain terdapat
              strategi, di balik setiap pilihan estetika terdapat argumen, dan di balik setiap
              gambar terdapat tanggung jawab terhadap audiens.
            </p>
          </div>

          {/* Seksi II: Empat Pilar Kompetensi */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Empat Pilar Kompetensi DKV
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kurikulum DKV dibangun di atas empat pilar utama yang saling menopang — dari fondasi
              teknis hingga kemampuan berpikir strategis yang membedakan desainer dari seniman,
              serta profesional dari amatir:
            </p>

            <div className="space-y-4">
              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  1. Desain Grafis — Adobe Photoshop & Illustrator
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Penguasaan perangkat lunak adalah prasyarat, bukan tujuan akhir. Yang sesungguhnya
                  dibangun adalah pemahaman terhadap prinsip-prinsip desain — keseimbangan, kontras,
                  hierarki, repetisi — dan kesadaran bahwa desain grafis adalah alat komunikasi
                  strategis yang harus menjawab tujuan klien secara terukur.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  2. Fotografi & Videografi Profesional
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Di era dominasi konten video, kemampuan memproduksi visual bergerak yang
                  berkualitas adalah kebutuhan fundamental. Lebih dari sekadar teknis kamera, siswa
                  dilatih "visual literacy" — membaca dan menciptakan makna melalui pencahayaan,
                  komposisi, dan gerak — sekaligus etika representasi visual yang bertanggung jawab.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  3. Animasi 2D & 3D — After Effects & Blender
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Animasi adalah medium yang melampaui keterbatasan realitas fisik. Siswa tidak
                  hanya belajar teknik keyframing atau rigging, tetapi juga mempelajari prinsip
                  storytelling — struktur narasi, pacing, dan pengembangan karakter — yang
                  memastikan hasil karya memiliki dampak emosional.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  4. Desain UI/UX Produk Digital
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  UI/UX adalah titik pertemuan antara estetika dan psikologi. Siswa mempelajari
                  metodologi user-centered design — dari riset pengguna hingga uji keterpakaian
                  (usability testing) — yang memastikan desain didasarkan pada kebutuhan nyata
                  pengguna, menjadi penentu keberhasilan produk di industri teknologi.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi III: Branding Strategis */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Dari Eksekutor Menjadi Pemikir Strategis
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Salah satu pembeda program DKV di {namaSekolah} adalah penekanannya pada kompetensi
              branding dan identitas visual — bidang yang mengangkat siswa dari level eksekutor
              teknis ke level pemikir strategis. Proses membangun identitas merek mencakup beberapa
              dimensi yang saling terhubung:
            </p>

            <ul className="ml-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-900">
              <li>
                <span className="font-bold">Riset dan Pemahaman Konteks:</span> Memahami nilai-nilai
                inti organisasi, karakter target audiens, dan lanskap kompetitif sebelum gagasan
                desain dituangkan. Branding yang baik dimulai dari formulasi masalah yang tepat.
              </li>
              <li>
                <span className="font-bold">Perancangan Sistem Visual Koheren:</span> Membangun
                identitas yang konsisten di berbagai titik kontak, baik pada media cetak, kemasan,
                hingga platform digital.
              </li>
              <li>
                <span className="font-bold">Adaptabilitas dan Evolusi Merek:</span> Merancang sistem
                visual yang cukup fleksibel untuk berkembang seiring perubahan organisasi tanpa
                kehilangan esensi intinya.
              </li>
              <li>
                <span className="font-bold">Perlindungan Kekayaan Intelektual:</span> Memahami hak
                cipta, lisensi, dan mekanisme perlindungan karya secara etis maupun hukum.
              </li>
            </ul>

            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kemampuan branding ini sangat bernilai bagi perkembangan ekosistem UMKM maupun
              korporasi yang memerlukan identitas visual kuat. Lulusan DKV yang menguasai kompetensi
              ini tidak sekadar membuat logo — mereka membangun persepsi, kepercayaan, dan nilai
              bisnis.
            </p>
          </div>

          {/* Seksi IV: Ekonomi Kreatif */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. DKV dan Perannya dalam Ekonomi Kreatif Indonesia
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Indonesia memiliki salah satu ekosistem ekonomi kreatif paling dinamis di Asia
              Tenggara. Industri kreatif nasional terus tumbuh sebagai kontributor signifikan
              terhadap PDB. Namun pertumbuhan ini juga menghadirkan tantangan: permintaan terhadap
              desainer berkualitas terus meningkat, sementara pasokan profesional yang benar-benar
              kompeten masih terbatas.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Di sinilah program DKV {namaSekolah} menemukan relevansinya. Lebih dari sekadar
              pencetak tenaga kerja terampil, program ini bertindak sebagai inkubator visual
              storyteller yang memahami nuansa kultural, sensitivitas lokal, dan dinamika pasar.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Menghadapi perkembangan kecerdasan buatan (AI) yang mampu menghasilkan gambar dan
              animasi secara otomatis, kurikulum mendorong siswa untuk memosisikan AI sebagai alat
              bantu yang memperkuat kreativitas, bukan ancaman. Desainer visual masa depan adalah
              pemikir yang mampu beradaptasi, mempertanyakan tren, dan menciptakan karya yang
              memiliki kedalaman makna.
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
      <FloatingNav contentId="reg-03" />
    </div>
  );
}
