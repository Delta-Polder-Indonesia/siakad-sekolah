import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Reg04Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramKeahlian/sekolah-4.jpg`}
            alt={`Program Studi Teknik Elektronika Industri ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI JURUSAN REG-04
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
              KODE KOMPETENSI: REG-04
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              3 TAHUN PROGRAM
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Program Studi Teknik Elektronika Industri
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
              TEKNIK ELEKTRONIKA INDUSTRI (TEI)
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Mengenal Program Studi Teknik Elektronika Industri
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

          {/* Seksi I: Elektronika sebagai Tulang Punggung Industri Modern */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Elektronika sebagai Tulang Punggung Industri Modern
            </h3>
            <p className="first-letter:line-height-none text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Di balik setiap lini produksi yang bergerak presisi, setiap sensor yang membaca
              perubahan lingkungan, dan setiap sistem otomasi yang menggantikan pekerjaan berulang —
              terdapat tangan seorang insinyur elektronika yang merancang, memprogram, dan
              memastikan semuanya berjalan tanpa henti. Revolusi industri tidak terjadi dalam
              semalam — ia berlangsung dalam gelombang yang masing-masing membawa perubahan
              paradigmatik. Gelombang terbaru, yang kerap disebut Industri 4.0, menempatkan otomasi,
              konektivitas, dan kecerdasan sistem sebagai fondasi baru manufaktur global.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Di tengah pergeseran ini, Teknik Elektronika Industri — atau TEI — berdiri sebagai
              disiplin yang paling langsung relevan: bidang yang mempelajari bagaimana sensor,
              aktuator, pengendali, dan sistem kontrol diintegrasikan menjadi infrastruktur produksi
              yang cerdas, efisien, dan andal. Program TEI di {namaSekolah} tidak dirancang untuk
              melahirkan teknisi yang sekadar mampu memperbaiki peralatan yang rusak. Ia dirancang
              untuk membentuk "automation engineer" — profesional yang memahami bahwa setiap
              komponen dalam sistem industri, dari transistor terkecil hingga jaringan kontrol
              terluas, adalah bagian dari ekosistem yang harus dirancang, dioperasikan, dan
              dipelihara dengan pemahaman yang menyeluruh.
            </p>
          </div>

          {/* Seksi II: Fondasi Kompetensi */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Fondasi Kompetensi yang Dibangun
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Kurikulum TEI dibangun dari lapisan kompetensi yang saling menopang — dari pemahaman
              rangkaian dasar hingga kemampuan merancang sistem otomasi skala industri yang siap
              menghadapi kompleksitas dunia nyata:
            </p>

            <div className="space-y-4">
              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  1. Pemrograman PLC & Otomasi Industri
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  PLC adalah komputer industri yang beroperasi dalam kondisi ekstrem — suhu tinggi,
                  getaran, debu — sambil mengontrol proses produksi dengan presisi milidetik.
                  Menguasai pemrograman PLC berarti memahami logika ladder, diagram fungsional, dan
                  standar IEC 61131-3, sekaligus memahami proses produksi yang dikontrolnya secara
                  menyeluruh.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  2. Rangkaian Elektronika Analog & Digital
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Sistem industri modern menggabungkan keduanya: sensor analog membaca dunia fisik,
                  konverter ADC mengubahnya menjadi sinyal digital, mikrokontroler memprosesnya, dan
                  aktuator mengeksekusi instruksi kembali ke dunia fisik. Memahami kedua domain ini
                  memungkinkan diagnosis masalah hingga level komponen dan perancangan solusi
                  integratif yang lintas domain.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  3. Sistem Kontrol & Instrumentasi
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Instrumentasi berkaitan dengan pengukuran dan pengendalian variabel proses — suhu,
                  tekanan, aliran, level. Dalam industri proses seperti petrokimia atau farmasi,
                  kesalahan pengukuran bukan sekadar angka yang salah; ia bisa berarti risiko
                  keselamatan atau kerugian produksi. Kompetensi ini semakin strategis di era
                  Industry 4.0 dengan kontrol prediktif berbasis data real-time.
                </p>
              </div>

              <div className="text-justify">
                <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                  4. Perawatan Peralatan Elektronik Industri
                </h4>
                <p className="text-sm leading-relaxed text-gray-900">
                  Downtime peralatan industri dihitung dalam kerugian ribuan hingga jutaan rupiah
                  per menit. Kemampuan mendiagnosis cepat, memperbaiki komponen rusak, dan melakukan
                  pemeliharaan preventif — termasuk pendekatan "predictive maintenance" berbasis IoT
                  dan analitik data — menjadikan lulusan TEI sebagai aset yang nilainya langsung
                  terasa di lantai produksi.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi III: K3 dan Keselamatan Kerja */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. K3: Kompetensi yang Tidak Bisa Dikompromikan
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Di antara semua kompetensi yang dibangun dalam program TEI, Keselamatan, Kesehatan
              Kerja, dan Lingkungan (K3) menempati posisi yang tidak bisa dinegosiasikan. Industri
              elektronika dan otomasi menyimpan risiko nyata — tegangan tinggi, radiasi
              elektromagnetik, bahan kimia berbahaya, mesin bergerak — yang hanya bisa dimitigasi
              oleh profesional yang benar-benar menghayati budaya keselamatan. Pemahaman K3 mencakup
              beberapa lapisan:
            </p>

            <ul className="ml-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-900">
              <li>
                <span className="font-bold">Keselamatan Diri dan Rekan Kerja:</span> Mengenali
                bahaya, mengikuti prosedur kerja aman, dan menggunakan Alat Pelindung Diri (APD)
                yang tepat untuk setiap jenis pekerjaan di lingkungan industri.
              </li>
              <li>
                <span className="font-bold">Keselamatan Peralatan dan Aset Produksi:</span> Memahami
                prosedur "lockout/tagout", isolasi energi, dan protokol penanganan peralatan
                bertegangan tinggi yang melindungi aset produksi dari kerusakan akibat kesalahan
                prosedur.
              </li>
              <li>
                <span className="font-bold">Kepatuhan Regulasi Industri:</span> Memahami standar K3
                nasional dan internasional yang menjadi syarat akses ke pasar global, termasuk
                sertifikasi yang semakin dipersyaratkan oleh klien dan mitra bisnis internasional.
              </li>
              <li>
                <span className="font-bold">Tanggung Jawab Lingkungan:</span> Mengelola limbah
                elektronik, meminimalkan konsumsi energi sistem otomasi, dan mempertimbangkan jejak
                karbon dari infrastruktur industri yang dioperasikan.
              </li>
            </ul>

            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Siswa TEI yang menginternalisasi nilai-nilai K3 sejak masa pendidikan membawa
              kebiasaan ini ke tempat kerja — berkontribusi pada penurunan angka kecelakaan,
              peningkatan produktivitas, dan pengurangan biaya operasional. Budaya keselamatan yang
              kuat bukan beban operasional; ia adalah indikator kematangan dan profesionalisme
              sebuah organisasi.
            </p>
          </div>

          {/* Seksi IV: Kedaulatan Industri Nasional */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. TEI dan Kedaulatan Industri Nasional
            </h3>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Ada pertanyaan yang lebih besar dari sekadar keterampilan teknis ketika kita membahas
              TEI: sejauh mana Indonesia mampu membangun dan memelihara infrastruktur industrinya
              secara mandiri? Ketergantungan pada teknisi asing untuk mengoperasikan dan memelihara
              sistem otomasi impor adalah kerentanan strategis yang nyata — kerentanan yang hanya
              bisa diatasi dengan membangun kapasitas teknis lokal yang kuat dan berkelanjutan.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Program TEI {namaSekolah} berkontribusi langsung pada upaya membangun "manufacturing
              resilience" ini. Lulusan yang tidak hanya mampu mengoperasikan teknologi impor, tetapi
              memahami prinsip-prinsip dasarnya secara mendalam, adalah lulusan yang mampu
              beradaptasi ketika teknologi berubah, memodifikasi sistem untuk kebutuhan lokal, dan
              pada akhirnya berkontribusi pada pengembangan solusi yang benar-benar lahir dari
              pemahaman konteks Indonesia.
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Namun relevansi jangka panjang program ini juga bergantung pada kesediaan untuk terus
              mempertanyakan dan memperbarui diri. Bagaimana program merespons ancaman
              "cyber-physical security" — di mana sistem otomasi yang terhubung ke jaringan menjadi
              target serangan siber yang dapat melumpuhkan seluruh operasional pabrik? Bagaimana
              siswa dipersiapkan untuk menghadapi sistem cerdas yang semakin mampu mendiagnosis dan
              memperbaiki dirinya sendiri? Apakah kurikulum merespons percepatan konvergensi antara
              elektronika industri dengan kecerdasan buatan dan komputasi awan?
            </p>
            <p className="text-justify text-sm leading-relaxed text-gray-900">
              Pertanyaan-pertanyaan ini bukan indikasi kelemahan — mereka adalah tanda program yang
              sehat dan adaptif. Teknisi elektronika industri terbaik di masa depan bukan hanya yang
              paling mahir menggunakan solder dan multimeter. Mereka adalah pemikir sistemik yang
              memahami bahwa setiap keputusan teknis yang mereka buat memilki implikasi yang jauh
              melampaui ruang produksi tempat mereka bekerja. Lulusan TEI {namaSekolah}
              didorong untuk menjadi tepat seperti itu: penjaga infrastruktur produksi yang
              memastikan roda industri nasional terus berputar dengan aman, efisien, dan
              bermartabat.
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
      <FloatingNav contentId="reg-04" />
    </div>
  );
}
