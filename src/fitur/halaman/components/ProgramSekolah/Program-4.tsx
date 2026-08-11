import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Program4Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900"
    >
      {/* ═══ HEADER TRANSPARAN — Style Kalender Akademik ═══════════════════ */}
      <header className="absolute top-0 right-0 left-0 z-30 flex h-15 w-full items-center justify-between bg-transparent px-6 py-6 lg:px-8">
        {/* Kiri: Tombol Kembali + Judul */}
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            aria-label="Kembali ke halaman Program Sekolah"
            className="flex h-8 w-8 items-center justify-center text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif text-base leading-tight text-white">Program Sekolah</h1>
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramSekolah/sekolah-4.jpg`}
            alt={`Pelatihan Sertifikasi Kompetensi Siswa ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI PROGRAM 04
          </div>
        )}

        {/* Gradient overlay — gelap di bawah agar teks terbaca */}
        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Gradient overlay — gelap di atas agar header transparan tetap terbaca */}
        <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Judul Hero — Style Kalender Akademik */}
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          {/* Badge Info di atas judul */}
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-none border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              PROGRAM STRATEGIS 04
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              1 Tahun Ajaran
            </span>
          </div>

          {/* Judul Utama — Style Kalender Akademik */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Pelatihan Sertifikasi Kompetensi Siswa
          </h1>

          {/* Subjudul — Style Kalender Akademik */}
          <p className="mt-1 text-sm font-semibold text-slate-300 md:text-base">
            {namaSekolahUppercase}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CONTENT AREA — Styled like TutorialModal
          ════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        <div className="relative w-full max-w-none">
          {/* Banner / Judul Utama */}
          <div className="relative mb-6 border-b-4 border-double border-gray-900 pt-14 pb-1 text-center md:pt-10">
            <p className="mb-1 font-sans text-xs font-bold tracking-widest text-gray-900 uppercase">
              Program Strategis • {namaSekolah}
            </p>
            <h1 className="mb-2 pr-24 pl-24 text-3xl leading-none font-black tracking-tight text-gray-900 uppercase md:text-4xl">
              PELATIHAN SERTIFIKASI KOMPETENSI SISWA
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Program Pendampingan dan Uji Kompetensi untuk Memperoleh Sertifikat Keahlian yang
              Diakui Industri
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

          {/* Intro Artikel */}
          <div className="mb-6 pb-6">
            <p className="first-letter:line-height-none text-justify text-sm leading-relaxed text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
              Program Pelatihan Sertifikasi Kompetensi Siswa yang ditawarkan oleh{' '}
              {namaSekolahUppercase}
              merupakan sebuah respons strategis terhadap tuntutan dunia kerja yang semakin
              mengandalkan sertifikasi sebagai bukti objektif atas kompetensi yang dimiliki oleh
              seorang profesional. Dalam konteks ini, sertifikasi tidak diposisikan sebagai sekadar
              dokumen tambahan yang melengkapi ijazah; lebih fundamental lagi, program ini dirancang
              untuk mengembangkan <span className="italic">"certified professional"</span>—lulusan
              yang memahami bahwa sertifikasi adalah validasi eksternal terhadap kemampuan yang
              telah mereka bangun melalui proses pembelajaran yang sistematis dan terukur.
            </p>
          </div>

          {/* Seksi Utama: Deskripsi Program */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Deskripsi dan Ruang Lingkup Program Sertifikasi
            </h3>

            {/* Paragraf 1 */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                1. Uji Kompetensi dan Penilaian Objektif
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Uji kompetensi dan penilaian objektif merupakan kompetensi inti yang membedakan
                program sertifikasi dari pendekatan pembelajaran konvensional. Uji kompetensi bukan
                sekadar ujian tertulis yang mengukur pengetahuan deklaratif; ia adalah serangkaian
                penilaian komprehensif yang mencakup ujian teoritis, ujian praktis, simulasi situasi
                kerja, dan evaluasi portofolio yang mengukur kemampuan siswa dalam konteks nyata.
                Kemampuan untuk lulus uji kompetensi memerlukan pemahaman terhadap standar
                kompetensi yang ditetapkan oleh lembaga sertifikasi—baik sertifikasi nasional
                seperti <span className="font-bold">BNSP</span> maupun sertifikasi internasional
                yang diakui secara global.
              </p>
            </div>

            {/* Paragraf 2 */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                2. Proses Pembelajaran Berkelanjutan
              </h4>
              <div className="mb-2 space-y-2 text-sm leading-relaxed text-gray-900">
                <p>
                  Namun, sertifikasi bukan sekadar lulus ujian; ia memerlukan pemahaman mendalam
                  terhadap proses pembelajaran berkelanjutan:
                </p>
                <ul className="ml-2 list-inside list-disc space-y-1">
                  <li>
                    <span className="font-bold">Pemeliharaan Kompetensi:</span> Bagaimana kompetensi
                    yang telah tersertifikasi harus dipertahankan seiring dengan evolusi teknologi.
                  </li>
                  <li>
                    <span className="font-bold">Pengembangan Berkelanjutan:</span> Bagaimana
                    kompetensi yang dimiliki harus ditingkatkan sesuai dengan tuntutan industri yang
                    terus berubah.
                  </li>
                  <li>
                    <span className="font-bold">Kredibilitas Profesional:</span> Siswa yang
                    menguasai kompetensi ini tidak hanya mampu memperoleh sertifikat; mereka mampu
                    merawat dan mengembangkan kredibilitas profesional mereka sepanjang karier.
                  </li>
                </ul>
              </div>
            </div>

            {/* Paragraf 3 */}
            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 3. Pendampingan
                Intensif dan Persiapan Uji
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Pendampingan intensif dan persiapan uji kompetensi membentuk fondasi teoretis yang
                memungkinkan siswa untuk memahami prinsip-prinsip dasar dari setiap aspek yang akan
                diuji. Pendampingan bukan sekadar bimbingan teknis; ia adalah proses mentoring yang
                holistik yang mencakup pembekalan materi, latihan soal, simulasi ujian, pengembangan
                strategi belajar, dan manajemen stres. Pemahaman terhadap proses pendampingan sangat
                penting karena uji kompetensi sering kali menuntut tidak hanya keahlian teknis,
                tetapi juga kemampuan manajerial waktu, ketahanan mental, dan strategi pengambilan
                keputusan dalam kondisi tekanan.
              </p>
            </div>

            {/* Paragraf 4 */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                4. Peningkatan Daya Saing Lulusan
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Peningkatan daya saing lulusan di pasar kerja merupakan kompetensi yang mengangkat
                program sertifikasi dari level validasi kompetensi menjadi level diferensiasi karier
                yang komprehensif. Pasar kerja modern tidak hanya menuntut keahlian teknis; ia juga
                menuntut bukti kompetensi yang dapat diverifikasi oleh pihak ketiga yang kredibel.
                Dalam konteks ini, sertifikasi berfungsi sebagai{' '}
                <span className="font-bold">"differentiator"</span> yang memisahkan kandidat yang
                hanya mengklaim memiliki keahlian dari kandidat yang telah membuktikan keahliannya
                melalui proses uji yang ketat.
              </p>
            </div>

            {/* Paragraf 5 */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                5. Pengakuan Industri Nasional dan Internasional
              </h4>
              <div className="text-sm leading-relaxed text-gray-900">
                <p className="mb-2">
                  Pengakuan industri nasional dan internasional merupakan kompetensi yang sering
                  kali dianggap kurang konkret dibandingkan dengan capaian akademik individu, namun
                  ia merupakan keterampilan yang sangat bernilai dalam konteks globalisasi.
                  Sertifikasi yang diakui secara internasional memungkinkan lulusan untuk tidak
                  hanya bersaing di pasar kerja domestik, tetapi juga untuk mengejar peluang karier
                  di luar negeri.
                </p>
                <p>
                  Pendekatan sertifikasi modern, seperti{' '}
                  <span className="italic">"micro-credentials"</span> dan{' '}
                  <span className="italic">"digital badges"</span> yang memungkinkan verifikasi
                  kompetensi secara real-time dan transparan, menambahkan dimensi teknologi yang
                  memerlukan pemahaman terhadap ekosistem sertifikasi digital. Siswa yang dibekali
                  dengan kompetensi sertifikasi yang komprehensif—dari sertifikasi dasar hingga
                  sertifikasi spesialisasi—menjadi aset yang sangat bernilai bagi industri mana pun.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi Kedua: Kompetensi K3 */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Keselamatan, Kesehatan Kerja, dan Lingkungan (K3)
            </h3>

            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 1. Kompetensi
                yang Tidak Dapat Dinegosiasikan
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Keselamatan, Kesehatan Kerja, dan Lingkungan (K3) dalam konteks pelatihan
                sertifikasi merupakan kompetensi yang tidak dapat dinegosiasikan dan sering kali
                menjadi pembeda antara profesional yang bertanggung jawab dan yang tidak. Banyak
                sertifikasi kompetensi—terutama di bidang teknik, otomotif, dan
                elektronika—mensyaratkan pemahaman dan penerapan standar K3 sebagai bagian dari uji
                kompetensi.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Pemahaman terhadap regulasi K3, prosedur keselamatan, dan praktik kerja yang aman
                bukan hanya melindungi siswa selama masa pelatihan, melainkan juga membentuk
                kebiasaan yang akan mereka bawa ke tempat kerja mereka kelak. Lebih dari itu, budaya
                keselamatan yang kuat merupakan indikator organisasi yang matang dan profesional.
                Siswa yang menginternalisasi nilai-nilai K3 sejak dini membawa kebiasaan ini ke
                dunia kerja, berkontribusi pada penurunan kecelakaan kerja, peningkatan
                produktivitas, dan pengurangan biaya operasional bagi perusahaan. Dalam konteks
                global di mana standar keselamatan semakin ketat, kompetensi K3 juga menjadi
                prasyarat untuk memperoleh sertifikasi internasional.
              </p>
            </div>
          </div>

          {/* Seksi Ketiga: Refleksi Kritis */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Refleksi Kritis dan Pertanyaan Strategis
            </h3>

            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 1. Aspek-Aspek
                yang Terabaikan
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Refleksi kritis terhadap program Pelatihan Sertifikasi juga mengharuskan kita untuk
                mempertanyakan aspek-aspek yang sering kali terabaikan dalam kurikulum sertifikasi.
                Apakah siswa juga dibekali dengan pemahaman terhadap{' '}
                <span className="italic">"lifelong learning"</span>—bagaimana kompetensi yang telah
                tersertifikasi harus terus diperbarui seiring dengan perkembangan teknologi? Apakah
                mereka diajarkan untuk mempertimbangkan kredibilitas lembaga sertifikasi—termasuk
                isu-isu seperti akreditasi, transparansi proses uji, dan keadilan penilaian?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Bagaimana program mempersiapkan siswa untuk menghadapi lanskap sertifikasi yang
                semakin kompleks—di mana ratusan sertifikasi beredar di pasar dengan tingkat
                pengakuan yang bervariasi? Pertanyaan-pertanyaan ini mengingatkan kita bahwa
                profesional yang baik di masa depan bukan hanya yang menguasai materi uji, melainkan
                juga yang mampu berpikir kritis, beradaptasi dengan perubahan standar, dan
                berkontribusi pada ekosistem sertifikasi yang transparan, adil, dan berkelanjutan.
              </p>
            </div>
          </div>

          {/* Seksi Keempat: Visi Nasional */}
          <div className="pt-6 pb-8">
            <div className="p-4">
              <h4 className="mb-3 text-center font-sans text-sm font-bold tracking-wide text-gray-900 uppercase">
                ! VISI PROGRAM DALAM KONTEKS NASIONAL !
              </h4>
              <p className="text-justify text-xs text-gray-900">
                Pada tataran yang lebih luas, program Pelatihan Sertifikasi Kompetensi Siswa di SMA
                NEGERI 1 MEDAN dapat dipandang sebagai komponen vital dalam upaya bangsa Indonesia
                untuk membangun <span className="font-bold">"competent workforce"</span> dan{' '}
                <span className="font-bold">"global competitiveness"</span>. Dalam konteks di mana
                persaingan tenaga kerja global semakin ketat dan mobilitas profesional semakin
                tinggi, kemampuan untuk menghasilkan lulusan yang memiliki sertifikasi kompetensi
                yang diakui secara internasional menjadi semakin krusial.
              </p>
              <p className="mt-2 text-justify text-xs text-gray-900">
                Sekolah kejuruan seperti {namaSekolahUppercase} memainkan peran strategis dalam
                membangun <span className="italic">"human capital"</span> yang diperlukan untuk visi
                ini—lulusan yang tidak hanya mampu memenuhi standar domestik, melainkan juga
                memahami dan memenuhi standar internasional sehingga dapat bersaing di pasar kerja
                global. Jika program sertifikasi ini dapat mempertahankan dan mengembangkan
                kualitasnya—dengan kurikulum yang responsif terhadap evolusi standar industri,
                fasilitas uji yang memadai, dan kemitraan dengan lembaga sertifikasi yang
                kredibel—maka ia tidak hanya akan terus menjadi program yang dicari, melainkan juga
                menjadi fondasi bagi kemajuan daya saing tenaga kerja Indonesia.
              </p>
            </div>
          </div>

          {/* Catatan Kaki */}
          <p className="pt-4 text-center font-sans text-[11px] text-gray-900 italic">
            Program Strategis {namaSekolah} • Tahun Ajaran 2026/2027
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="program-4" />
    </div>
  );
}
