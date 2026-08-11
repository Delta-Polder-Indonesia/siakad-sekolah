import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// Interface tipe data untuk pilar pembelajaran & kompetensi
interface LearningPillar {
  id: string;
  title: string;
  desc: string;
  highlight: boolean;
}

interface CrossCompetencyItem {
  id: number;
  label: string;
  text: string;
}

// Data Statis: Pendekatan Pembelajaran
const PILAR_PEMBELAJARAN: readonly LearningPillar[] = [
  {
    id: 'pbl',
    title: 'Project-Based & Problem-Based Learning',
    desc: 'Siswa belajar dengan mengerjakan proyek nyata dan memecahkan masalah yang relevan dengan industri — bukan hanya menghafalkan teori di ruang kelas. Pendekatan ini membangun kemampuan berpikir kritis dan kebiasaan mencari solusi yang akan terus berguna jauh setelah lulus.',
    highlight: false,
  },
  {
    id: 'industry-collaboration',
    title: 'Kolaborasi Aktif dengan Mitra Industri',
    desc: 'Kurikulum yang up-to-date lahir dari dialog yang terus-menerus dengan pelaku industri — bukan dari dokumen yang diperbarui setiap lima tahun. Kemitraan aktif memastikan bahwa apa yang diajarkan di kelas adalah apa yang benar-benar dibutuhkan di lapangan, termasuk keterampilan yang belum sempat masuk buku teks.',
    highlight: false,
  },
  {
    id: 'internship',
    title: 'Magang dan Pengalaman Lapangan Terstruktur',
    desc: 'Pengalaman nyata di lingkungan kerja profesional adalah pembelajaran yang tidak bisa digantikan oleh simulasi kelas. Program magang yang terstruktur memberikan siswa kesempatan membangun jaringan profesional, memahami budaya kerja, dan membuktikan kompetensi mereka dalam konteks yang sesungguhnya.',
    highlight: false,
  },
  {
    id: 'certification',
    title: 'Sertifikasi Kompetensi Terakreditasi',
    desc: 'Sertifikasi dari lembaga yang diakui memberikan dimensi validasi eksternal yang penting — bukti bahwa kompetensi siswa telah diukur oleh pihak yang independen dari institusi pendidikan itu sendiri. Dalam pasar kerja yang kompetitif, sertifikasi adalah sinyal kredibilitas yang berbicara sebelum wawancara dimulai.',
    highlight: true,
  },
];

// Data Statis: Kompetensi Lintas Bidang
const KOMPETENSI_LINTAS_BIDANG: readonly CrossCompetencyItem[] = [
  {
    id: 1,
    label: 'Berpikir Kritis dan Sistemik:',
    text: 'Kemampuan memahami masalah kompleks dari berbagai sudut pandang, mengidentifikasi akar penyebab, dan merancang solusi yang mempertimbangkan konsekuensi jangka panjang — keterampilan yang tidak bisa diotomatisasi oleh mesin.',
  },
  {
    id: 2,
    label: 'Komunikasi Efektif dan Kerja Tim:',
    text: 'Dunia kerja modern adalah dunia yang kolaboratif. Kemampuan menyampaikan ide dengan jelas, mendengarkan perspektif berbeda, dan bekerja dalam tim lintas fungsi adalah kompetensi yang menentukan karir jangka panjang.',
  },
  {
    id: 3,
    label: 'Dasar Kewirausahaan dan Inovasi:',
    text: 'Siswa didorong untuk melihat masalah sebagai peluang. Pemahaman terhadap model bisnis, pengembangan produk, dan manajemen dasar membuka kemungkinan bagi lulusan untuk tidak hanya mencari pekerjaan, tetapi menciptakannya.',
  },
  {
    id: 4,
    label: 'Etika Profesional dan Tanggung Jawab Sosial:',
    text: 'Setiap keputusan teknis memiliki konsekuensi sosial dan lingkungan. Siswa dilatih untuk mempertimbangkan dampak dari setiap tindakan profesional mereka — terhadap pengguna, terhadap komunitas, dan terhadap bumi.',
  },
];

export default function Reg07Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState<boolean>(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      role="region"
      aria-label="Detail Program Keahlian Baru (REG-07)"
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramKeahlian/sekolah-7.jpg`}
            alt={`Program Keahlian Baru ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI JURUSAN REG-07
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
              KODE KOMPETENSI: REG-07
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              3 TAHUN PROGRAM
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Program Keahlian Baru
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
              PROGRAM KEAHLIAN BARU
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Mengenal Inovasi dan Arah Baru Pembelajaran Vokasional Terintegrasi
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

          {/* Seksi I: Pengantar Hero */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Respon Terhadap Perubahan Zaman
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Every era requires competencies that did not exist before. This new expertise program
              was born out of the courage to look forward — responding to the ever-shifting
              industrial demands before they turn into a full-blown crisis. Institusi pendidikan
              yang baik tidak hanya merespons kebutuhan yang sudah ada — ia mengantisipasi kebutuhan
              yang belum terasa mendesak namun sedang tumbuh dengan cepat.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kehadiran program keahlian baru di {namaSekolah} adalah ekspresi dari kesadaran itu:
              bahwa ada ruang kompetensi yang belum terisi, ada segmen industri yang masih
              kekurangan tenaga terampil, dan ada peluang yang akan terlewat jika tidak ada yang
              berani melangkah lebih awal. Program ini tidak dirancang sebagai tambahan daftar
              jurusan, melainkan sebagai respons pedagogis yang serius terhadap pergeseran lanskap
              ekonomi dan teknologi.
            </p>
          </section>

          {/* Seksi II: Pendekatan Pembelajaran yang Membedakan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Pendekatan Pembelajaran yang Membedakan
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Yang membedakan program ini dari pendekatan vokasi konvensional bukan hanya kontennya,
              melainkan cara konten itu diajarkan. Empat pilar pendekatan pembelajaran menjadi
              landasan yang memastikan setiap siswa tidak hanya tahu, tetapi mampu melakukan dan
              berpikir secara mandiri:
            </p>

            <div className="space-y-4">
              {PILAR_PEMBELAJARAN.map((item) => (
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

          {/* Seksi III: Membentuk Pemikir dan Pencipta */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Lebih dari Teknis: Membentuk Pemikir dan Pencipta
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kompetensi teknis adalah fondasi, bukan atap. Program ini secara sadar membangun
              kompetensi lintas bidang yang memastikan lulusan tidak hanya siap bekerja, tetapi siap
              memimpin, berinovasi, dan — ketika saatnya tiba — menciptakan lapangan kerja bagi
              orang lain:
            </p>

            <ul className="ml-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-900">
              {KOMPETENSI_LINTAS_BIDANG.map((item) => (
                <li key={item.id}>
                  <span className="font-bold">{item.label}</span> {item.text}
                </li>
              ))}
            </ul>

            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Integrasi antara kompetensi teknis dan non-teknis ini bukan kemewahan — ia adalah
              keharusan. Otomatisasi dan kecerdasan buatan semakin mengambil alih pekerjaan yang
              bersifat rutin. Yang tersisa untuk manusia adalah pekerjaan yang membutuhkan
              kreativitas, empati, penilaian kontekstual, dan kepemimpinan — dan itulah yang
              dibangun dalam program ini.
            </p>
          </section>

          {/* Seksi IV: Visi Agen Perubahan */}
          <section className="space-y-6 pb-6">
            <h2 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Visi: Agen Perubahan, Bukan Sekadar Pencari Kerja
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Ketika kita berbicara tentang pendidikan vokasi, terlalu mudah untuk terjebak dalam
              logika transaksional: sekolah mengajarkan keterampilan, industri menyerap lulusan,
              siklus berulang. Namun ada visi yang lebih besar yang layak diperjuangkan: pendidikan
              vokasi sebagai inkubator agen perubahan yang tidak hanya mengisi posisi yang tersedia,
              tetapi menciptakan posisi yang belum pernah ada sebelumnya.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Program keahlian baru di {namaSekolah} berambisi menjadi bagian dari visi itu. Di
              tengah persaingan ekonomi yang semakin ditentukan oleh kemampuan adaptasi dan inovasi,
              institusi yang berani membuka program baru berdasarkan proyeksi kebutuhan masa depan —
              bukan sekadar permintaan pasar hari ini — adalah institusi yang memainkan peran
              strategis dalam membentuk arah pembangunan sumber daya manusia nasional.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Setiap lulusan REG-07 yang berhasil membuktikan kompetensinya di dunia kerja, yang
              memulai usahanya sendiri, atau yang berkontribusi pada inovasi yang belum pernah
              terpikirkan sebelumnya, adalah bukti paling kuat bahwa keberanian untuk memulai
              program baru ini memang layak dan tepat waktunya.
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
      <FloatingNav contentId="reg-07" />
    </div>
  );
}
