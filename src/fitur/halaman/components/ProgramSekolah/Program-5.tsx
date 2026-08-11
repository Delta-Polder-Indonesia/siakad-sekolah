import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Program5Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramSekolah/sekolah-5.jpg`}
            alt={`Pendampingan Karir dan Bursa Kerja Khusus ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI PROGRAM 05
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
              PROGRAM STRATEGIS 05
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              1 Tahun Ajaran
            </span>
          </div>

          {/* Judul Utama — Style Kalender Akademik */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Pendampingan Karir dan Bursa Kerja Khusus
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
              PENDAMPINGAN KARIR DAN BURSA KERJA KHUSUS
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Layanan Bimbingan Karir, Workshop Persiapan Kerja, dan Penyelenggaraan Bursa Kerja
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
              Program Pendampingan Karir dan Bursa Kerja Khusus yang ditawarkan oleh SMA NEGERI 1
              MEDAN merupakan sebuah respons strategis terhadap realitas bahwa transisi dari dunia
              pendidikan ke dunia kerja sering kali menjadi momen paling menantang dalam kehidupan
              seorang lulusan. Dalam konteks ini, program ini tidak diposisikan sebagai layanan
              bimbingan yang sekadar memberikan brosur lowongan kerja; lebih fundamental lagi,
              program ini dirancang untuk mengembangkan{' '}
              <span className="italic">"career-ready graduate"</span>—lulusan yang memahami bahwa
              mencari pekerjaan bukan sekadar mengirimkan lamaran, melainkan sebuah proses strategis
              yang memerlukan pemahaman terhadap diri sendiri, dinamika pasar kerja, dan kemampuan
              untuk memasarkan kompetensi dengan efektif.
            </p>
          </div>

          {/* Seksi Utama: Deskripsi Program */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Deskripsi dan Ruang Lingkup Program Pendampingan Karir
            </h3>

            {/* Paragraf 1 */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                1. Bimbingan Karir dan Pengembangan Diri
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Bimbingan karir dan pengembangan diri merupakan kompetensi inti yang membedakan
                program ini dari pendekatan <span className="italic">"job placement"</span> yang
                konvensional. Bimbingan karir bukan sekadar konseling singkat yang memberikan saran
                umum; ia adalah proses mendalam yang mencakup penilaian minat dan bakat, eksplorasi
                jalur karier, perencanaan pendidikan lanjutan, dan pengembangan strategi pencarian
                kerja yang personal dan terukur. Kemampuan untuk memahami diri sendiri memerlukan
                pemahaman terhadap teori perkembangan karier, alat penilaian psikometris, dan teknik{' '}
                <span className="italic">"self-reflection"</span> yang menjadi standar dalam
                konseling karier modern.
              </p>
            </div>

            {/* Paragraf 2 */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                2. Dinamika Pasar Kerja dan Tren Industri
              </h4>
              <div className="mb-2 space-y-2 text-sm leading-relaxed text-gray-900">
                <p>
                  Namun, bimbingan karir bukan sekadar menemukan pekerjaan yang cocok; ia memerlukan
                  pemahaman mendalam terhadap dinamika pasar kerja:
                </p>
                <ul className="ml-2 list-inside list-disc space-y-1">
                  <li>
                    <span className="font-bold">Tren Industri:</span> Bagaimana tren industri
                    mempengaruhi permintaan kompetensi di masa depan.
                  </li>
                  <li>
                    <span className="font-bold">Teknologi:</span> Bagaimana teknologi mengubah
                    lanskap pekerjaan dan profesi yang tersedia.
                  </li>
                  <li>
                    <span className="font-bold">Sistem Feedback:</span> Bagaimana sistem{' '}
                    <span className="italic">"feedback"</span> dari mentor dan alumni memastikan
                    bahwa rencana karier tetap relevan dan realistis.
                  </li>
                </ul>
                <p>
                  Siswa yang menguasai kompetensi ini tidak hanya mampu mencari pekerjaan; mereka
                  mampu merancang karier yang selaras dengan passion, kemampuan, dan peluang pasar.
                </p>
              </div>
            </div>

            {/* Paragraf 3 */}
            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 3. Workshop
                Persiapan Kerja dan Pengembangan Soft Skills
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Workshop persiapan kerja dan pengembangan soft skills membentuk fondasi teoretis
                yang memungkinkan siswa untuk memahami prinsip-prinsip dasar dari setiap aspek yang
                diperlukan untuk sukses dalam proses rekrutmen. Workshop bukan sekadar pelatihan
                singkat yang memberikan tips dan trik; ia adalah program intensif yang mencakup
                penulisan CV dan surat lamaran yang efektif, teknik wawancara kerja, simulasi
                assessment center, pengembangan personal branding, dan negosiasi gaji.
              </p>
            </div>

            {/* Paragraf 4 */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                4. Pemahaman Proses Rekrutmen Modern
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Pemahaman terhadap proses rekrutmen sangat penting karena setiap perusahaan memiliki
                metodologi dan kriteria yang berbeda—dari wawancara tradisional hingga{' '}
                <span className="italic">"gamified assessment"</span>, dari CV konvensional hingga{' '}
                <span className="italic">"video resume"</span>. Siswa yang memahami prinsip-prinsip
                ini dapat mendiagnosis kelemahan pada level dini, merancang strategi persiapan yang
                terarah, dan berkomunikasi secara efektif dengan recruiter dan hiring manager dari
                berbagai industri.
              </p>
            </div>

            {/* Paragraf 5 */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                5. Bursa Kerja Khusus dan Koneksi Perusahaan Mitra
              </h4>
              <div className="text-sm leading-relaxed text-gray-900">
                <p className="mb-2">
                  Bursa kerja khusus dan koneksi dengan perusahaan mitra merupakan kompetensi yang
                  mengangkat program ini dari level informasi lowongan menjadi level ekosistem
                  rekrutmen yang komprehensif. Bursa kerja bukan sekadar pameran lowongan yang
                  pasif; ia adalah platform interaktif yang memungkinkan lulusan untuk berinteraksi
                  langsung dengan recruiter, memahami kultur organisasi, dan bahkan mengikuti proses
                  seleksi pertama di tempat.
                </p>
                <p>
                  Dalam konteks ini, bursa kerja berfungsi sebagai{' '}
                  <span className="font-bold">"marketplace"</span> yang efisien—mempertemukan supply
                  kompetensi dari lulusan dengan demand talent dari industri. Seorang lulusan yang
                  memahami dinamika bursa kerja tidak hanya mampu mengumpulkan brosur; ia juga mampu
                  membangun koneksi yang bermakna, mengidentifikasi peluang yang sesuai dengan
                  profilnya, dan memahami tren rekrutmen yang sedang berkembang di industri
                  targetnya.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi Kedua: Transisi Karir */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              II. Transisi Mulus dari Pendidikan ke Pekerjaan
            </h3>

            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 1. Kompetensi
                yang Sangat Bernilai
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Transisi mulus dari pendidikan ke pekerjaan merupakan kompetensi yang sering kali
                dianggap kurang konkret dibandingkan dengan capaian teknis, namun ia merupakan
                keterampilan yang sangat bernilai dalam konteks kehidupan nyata. Transisi yang mulus
                bukan sekadar mendapatkan pekerjaan segera setelah lulus; ia adalah proses adaptasi
                yang komprehensif terhadap dunia kerja—mulai dari memahami ekspektasi perusahaan,
                menyesuaikan diri dengan kultur organisasi, mengelola hubungan dengan atasan dan
                rekan kerja, hingga merencanakan pengembangan karier jangka panjang.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Kemampuan untuk menavigasi transisi ini dengan efektif adalah keterampilan yang
                membedakan lulusan yang stagnan dari lulusan yang berkembang pesat. Pendekatan
                pendampingan modern, seperti <span className="italic">"alumni mentoring"</span> dan{' '}
                <span className="italic">"peer support group"</span>, menambahkan dimensi sosial
                yang memerlukan pemahaman terhadap dinamika mentoring dan komunitas belajar. Siswa
                yang dibekali dengan kompetensi transisi karier yang komprehensif—dari persiapan
                mental hingga strategi pengembangan berkelanjutan—menjadi aset yang sangat bernilai
                bagi organisasi mana pun.
              </p>
            </div>
          </div>

          {/* Seksi Ketiga: Kompetensi K3 */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              III. Keselamatan, Kesehatan Kerja, dan Lingkungan (K3)
            </h3>

            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 1. Kompetensi
                yang Tidak Dapat Dinegosiasikan
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Keselamatan, Kesehatan Kerja, dan Lingkungan (K3) dalam konteks persiapan karier
                merupakan kompetensi yang tidak dapat dinegosiasikan dan sering kali menjadi pembeda
                antara profesional yang bertanggung jawab dan yang tidak. Meskipun K3 sering
                diasosiasikan dengan lingkungan fisik kerja, prinsip-prinsipnya—kesadaran akan
                risiko, prosedur keselamatan, dan tanggung jawab terhadap lingkungan—sangat relevan
                dalam konteks persiapan karier.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Pemahaman terhadap hak dan kewajiban sebagai pekerja, prosedur keselamatan di
                berbagai jenis industri, dan praktik kerja yang aman dan sehat bukan hanya
                melindungi lulusan saat memasuki dunia kerja, melainkan juga membentuk kebiasaan
                yang akan mereka bawa sepanjang karier mereka. Lebih dari itu, budaya keselamatan
                yang kuat merupakan indikator profesional yang matang dan bertanggung jawab. Lulusan
                yang menginternalisasi nilai-nilai K3 sejak dini membawa kebiasaan ini ke tempat
                kerja mereka, berkontribusi pada penurunan kecelakaan kerja, peningkatan
                produktivitas, dan pengurangan biaya operasional bagi perusahaan. Dalam konteks
                global di mana standar keselamatan semakin ketat, kompetensi K3 juga menjadi
                prasyarat untuk akses ke pasar kerja internasional.
              </p>
            </div>
          </div>

          {/* Seksi Keempat: Refleksi Kritis */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              IV. Refleksi Kritis dan Pertanyaan Strategis
            </h3>

            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 1. Aspek-Aspek
                yang Terabaikan
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Refleksi kritis terhadap program Pendampingan Karir juga mengharuskan kita untuk
                mempertanyakan aspek-aspek yang sering kali terabaikan dalam kurikulum bimbingan
                karier. Apakah siswa juga dibekali dengan pemahaman terhadap{' '}
                <span className="italic">"gig economy"</span> dan{' '}
                <span className="italic">"freelancing"</span>—bagaimana lanskap pekerjaan yang
                semakin fleksibel dan proyek-based mengubah paradigma karier tradisional? Apakah
                mereka diajarkan untuk mempertimbangkan keseimbangan hidup dan kerja—termasuk
                isu-isu seperti kesehatan mental, <span className="italic">"burnout"</span>, dan
                pengembangan diri di luar pekerjaan?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Bagaimana program mempersiapkan siswa untuk menghadapi ketidakpastian ekonomi yang
                semakin tinggi—di mana stabilitas pekerjaan konvensional semakin tergantikan oleh
                adaptabilitas dan <span className="italic">"resilience"</span>?
                Pertanyaan-pertanyaan ini mengingatkan kita bahwa profesional yang baik di masa
                depan bukan hanya yang menguasai teknik wawancara dan penulisan CV, melainkan juga
                yang mampu berpikir sistemik, beradaptasi dengan perubahan lanskap kerja, dan
                berkontribusi pada kehidupan karier yang bermakna, seimbang, dan berkelanjutan.
              </p>
            </div>
          </div>

          {/* Seksi Kelima: Visi Nasional */}
          <div className="pt-6 pb-8">
            <div className="p-4">
              <h4 className="mb-3 text-center font-sans text-sm font-bold tracking-wide text-gray-900 uppercase">
                ! VISI PROGRAM DALAM KONTEKS NASIONAL !
              </h4>
              <p className="text-justify text-xs text-gray-900">
                Pada tataran yang lebih luas, program Pendampingan Karir dan Bursa Kerja Khusus di
                {namaSekolahUppercase} dapat dipandang sebagai komponen vital dalam upaya bangsa
                Indonesia untuk membangun <span className="font-bold">"employment ecosystem"</span>{' '}
                yang efisien dan <span className="font-bold">"inclusive economic growth"</span>.
                Dalam konteks di mana angka pengangguran terdidik masih menjadi tantangan besar dan
                ketimpangan akses pekerjaan semakin nyata, kemampuan untuk menghubungkan lulusan
                dengan peluang kerja yang sesuai menjadi semakin krusial.
              </p>
              <p className="mt-2 text-justify text-xs text-gray-900">
                Sekolah kejuruan seperti {namaSekolahUppercase} memainkan peran strategis dalam
                membangun <span className="italic">"human capital"</span> yang diperlukan untuk visi
                ini—lulusan yang tidak hanya mampu mencari pekerjaan secara mandiri, melainkan juga
                memahami dinamika pasar kerja sehingga dapat beradaptasi, berinovasi, dan bahkan
                menciptakan lapangan kerja baru. Jika program pendampingan karir ini dapat
                mempertahankan dan mengembangkan kualitasnya—dengan kurikulum yang responsif
                terhadap evolusi pasar kerja, jaringan mitra perusahaan yang luas, dan mekanisme{' '}
                <span className="italic">"follow-up"</span> yang memungkinkan lulusan untuk terus
                mendapatkan dukungan—maka ia tidak hanya akan terus menjadi program yang dicari,
                melainkan juga menjadi fondasi bagi kemajuan ekonomi Indonesia. Dalam visi ini,
                setiap lulusan yang berhasil mendapatkan pekerjaan bukan sekadar individu yang
                bekerja; ia adalah bagian dari rantai produktivitas nasional yang memastikan roda
                perekonomian Indonesia terus berputar dengan inovatif, efisien, dan berkelanjutan.
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
      <FloatingNav contentId="program-5" />
    </div>
  );
}
