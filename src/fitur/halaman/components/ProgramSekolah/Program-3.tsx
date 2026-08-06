import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Program3Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramSekolah/sekolah-3.jpg`}
            alt={`Program Magang Siswa di Dunia Usaha dan Industri ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI PROGRAM 03
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
              PROGRAM STRATEGIS 03
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              1 Tahun Ajaran
            </span>
          </div>

          {/* Judul Utama — Style Kalender Akademik */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Program Magang Siswa di Dunia Usaha dan Industri
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
              PROGRAM MAGANG SISWA DI DUNIA USAHA DAN INDUSTRI
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Penempatan Siswa Kelas XI dan XII di Perusahaan Mitra untuk Mengasah Keterampilan
              Kerja
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
              Program Magang Siswa di Dunia Usaha dan Industri yang ditawarkan oleh SMA NEGERI 1
              MEDAN merupakan sebuah respons strategis terhadap kesenjangan fundamental antara dunia
              pendidikan dan dunia kerja yang sering kali menjadi momok bagi lulusan vokasi. Dalam
              konteks ini, program magang tidak diposisikan sebagai kegiatan tambahan yang sekadar
              memberikan pengalaman sosial; lebih fundamental lagi, program ini dirancang untuk
              mengembangkan <span className="italic">"work-ready graduate"</span>—lulusan yang
              memahami bahwa kompetensi teknis saja tidak cukup untuk berhasil di dunia kerja.
            </p>
          </div>

          {/* Seksi Utama: Deskripsi Program */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Deskripsi dan Ruang Lingkup Program Magang
            </h3>

            {/* Paragraf A */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                1. Respons Strategis terhadap Kesenjangan Pendidikan-Kerja
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Penempatan siswa kelas XI dan XII di perusahaan mitra untuk mengasah keterampilan
                kerja mencerminkan sebuah kesadaran akan spektrum kompetensi yang dibutuhkan untuk
                tidak hanya mendapatkan pekerjaan, tetapi juga untuk bertahan dan berkembang dalam
                karier jangka panjang. Pengalaman praktis di lapangan merupakan kompetensi inti yang
                membedakan program magang dari pembelajaran berbasis simulasi di kelas. Pengalaman
                nyata bukan sekadar praktik yang terstruktur; ia adalah immersi total dalam
                ekosistem kerja yang sesungguhnya—mulai dari mengikuti jam kerja standar industri,
                mematuhi hierarki organisasi, menangani tekanan deadline, hingga berinteraksi dengan
                berbagai tipe kepribadian di tempat kerja.
              </p>
            </div>

            {/* Paragraf B */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                2. Soft Skills dan Ekspektasi Industri
              </h4>
              <div className="mb-2 space-y-2 text-sm leading-relaxed text-gray-900">
                <p>
                  Kemampuan untuk menavigasi dinamika dunia kerja memerlukan pemahaman terhadap soft
                  skills, emotional intelligence, dan kemampuan problem-solving dalam konteks nyata.
                  Namun, magang bukan sekadar{' '}
                  <span className="italic">"bekerja sambil belajar"</span>; ia memerlukan pemahaman
                  mendalam terhadap ekspektasi industri:
                </p>
                <ul className="ml-2 list-inside list-disc space-y-1">
                  <li>
                    <span className="font-bold">Standar Kualitas:</span> Bagaimana standar kualitas
                    diterapkan di lapangan sesuai dengan regulasi dan kebijakan perusahaan.
                  </li>
                  <li>
                    <span className="font-bold">Komunikasi Efektif:</span> Bagaimana komunikasi
                    efektif dilakukan antar-divisi dan antar-level organisasi.
                  </li>
                  <li>
                    <span className="font-bold">Sistem Feedback:</span> Bagaimana sistem{' '}
                    <span className="italic">feedback</span> memastikan bahwa kinerja magang sesuai
                    dengan harapan perusahaan.
                  </li>
                </ul>
                <p>
                  Siswa yang menguasai kompetensi ini tidak hanya mampu menyelesaikan tugas magang;
                  mereka mampu mengintegrasikan diri ke dalam tim kerja dengan cepat dan efektif.
                </p>
              </div>
            </div>

            {/* Paragraf C */}
            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 3. Pembangunan
                Jaringan Profesional
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Pembangunan jaringan profesional membentuk fondasi teoretis yang memungkinkan siswa
                untuk memahami pentingnya relasi dan reputasi dalam dunia kerja. Jaringan
                profesional bukan sekadar daftar kontak di media sosial; ia adalah ekosistem
                hubungan saling menguntungkan yang dibangun berdasarkan kepercayaan, kompetensi, dan
                kolaborasi. Pemahaman terhadap dinamika jaringan profesional sangat penting karena
                banyak peluang karier tidak diumumkan secara publik, melainkan tersebar melalui
                rekomendasi dan referensi internal.
              </p>
            </div>

            {/* Paragraf D */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                4. Persiapan Menghadapi Dunia Kerja
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Persiapan menghadapi dunia kerja merupakan kompetensi yang mengangkat program magang
                dari level pengalaman belajar menjadi level transisi karier yang komprehensif. Dunia
                kerja masa depan tidak hanya menuntut keahlian teknis; ia juga menuntut kemampuan
                untuk beradaptasi dengan perubahan teknologi, berkolaborasi dalam tim lintas fungsi,
                dan berpikir kritis dalam menghadapi tantangan yang belum pernah dijumpai
                sebelumnya. Dalam konteks ini, magang berfungsi sebagai{' '}
                <span className="font-bold">"trial period"</span> yang aman—memungkinkan siswa untuk
                menguji minat dan kemampuan mereka dalam disiplin tertentu, memahami apakah budaya
                organisasi tersebut cocok dengan kepribadian mereka, dan mengidentifikasi area
                pengembangan yang perlu ditingkatkan sebelum memasuki dunia kerja secara penuh.
              </p>
            </div>

            {/* Paragraf E */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                5. Pembangunan Karakter dan Etika Profesional
              </h4>
              <div className="text-sm leading-relaxed text-gray-900">
                <p className="mb-2">
                  Pembangunan karakter dan etika profesional selama magang merupakan kompetensi yang
                  sering kali dianggap kurang konkret dibandingkan dengan capaian teknis, namun ia
                  merupakan keterampilan yang sangat bernilai dalam konteks kehidupan nyata. Etika
                  profesional mencakup integritas, tanggung jawab, rasa hormat, dan komitmen
                  terhadap kualitas—nilai-nilai yang tidak dapat diukur dengan angka, namun menjadi
                  fondasi reputasi seseorang di dunia kerja.
                </p>
                <p>
                  Pendekatan pembentukan karakter selama magang, seperti{' '}
                  <span className="italic">"reflective practice"</span> yang mendorong siswa untuk
                  secara aktif merefleksikan pengalaman mereka dan mengekstrak pelajaran berharga,
                  menambahkan dimensi metakognitif yang memerlukan pemahaman terhadap proses belajar
                  dari pengalaman. Siswa yang dibekali dengan kompetensi etika profesional yang
                  komprehensif—dari kejujuran sederhana hingga keberanian moral dalam situasi
                  sulit—menjadi aset yang sangat bernilai bagi organisasi mana pun.
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
                Keselamatan, Kesehatan Kerja, dan Lingkungan (K3) dalam konteks magang industri
                merupakan kompetensi yang tidak dapat dinegosiasikan dan sering kali menjadi pembeda
                antara profesional yang bertanggung jawab dan yang tidak. Lingkungan industri—baik
                di pabrik, bengkel, kantor, maupun lapangan—melibatkan risiko yang signifikan:
                peralatan bertekanan tinggi, bahan kimia berbahaya, kebisingan, radiasi, dan bahaya
                ergonomis dari pekerjaan repetitif.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Pemahaman terhadap regulasi K3, prosedur keselamatan, dan praktik kerja yang aman
                bukan hanya melindungi siswa selama masa magang, melainkan juga membentuk kebiasaan
                yang akan mereka bawa ke tempat kerja mereka kelak. Lebih dari itu, budaya
                keselamatan yang kuat merupakan indikator organisasi yang matang dan profesional.
                Siswa yang menginternalisasi nilai-nilai K3 sejak dini membawa kebiasaan ini ke
                dunia kerja, berkontribusi pada penurunan kecelakaan kerja, peningkatan
                produktivitas, dan pengurangan biaya operasional bagi perusahaan.
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
                Refleksi kritis terhadap program Magang Siswa juga mengharuskan kita untuk
                mempertanyakan aspek-aspek yang sering kali terabaikan dalam kurikulum magang.
                Apakah siswa juga dibekali dengan pemahaman terhadap hak dan kewajiban mereka
                sebagai magang—termasuk perlindungan hukum, jaminan keselamatan, dan batasan tugas
                yang wajar? Apakah mereka diajarkan untuk mempertimbangkan dampak sosial dan etis
                dari setiap keputusan yang mereka ambil di tempat kerja—termasuk isu-isu seperti
                diskriminasi, pelecehan, dan eksploitasi tenaga kerja?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Bagaimana program mempersiapkan siswa untuk menghadapi realitas dunia kerja yang
                semakin kompetitif—di mana otomatisasi dan disrupsi teknologi semakin mengubah
                lanskap pekerjaan secara drastis? Pertanyaan-pertanyaan ini mengingatkan kita bahwa
                profesional yang baik di masa depan bukan hanya yang menguasai tools dan teknik,
                melainkan juga yang mampu berpikir kritis, beradaptasi dengan perubahan, dan
                berkontribusi pada lingkungan kerja yang inklusif, aman, dan berkelanjutan.
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
                Pada tataran yang lebih luas, program Magang Siswa di {namaSekolahUppercase} dapat
                dipandang sebagai komponen vital dalam upaya bangsa Indonesia untuk membangun{' '}
                <span className="font-bold">"workforce resilience"</span> dan{' '}
                <span className="font-bold">"economic competitiveness"</span>. Dalam konteks di mana
                angka pengangguran terdidik masih menjadi tantangan besar dan persaingan global
                semakin ketat, kemampuan untuk menghasilkan lulusan yang tidak hanya kompeten secara
                teknis tetapi juga siap secara mental dan sosial untuk memasuki dunia kerja menjadi
                semakin krusial.
              </p>
              <p className="mt-2 text-justify text-xs text-gray-900">
                Sekolah seperti {namaSekolahUppercase} memainkan peran strategis dalam membangun{' '}
                <span className="italic">"human capital"</span> yang diperlukan untuk visi
                ini—lulusan yang tidak hanya mampu mengisi lowongan pekerjaan yang ada, melainkan
                juga memahami dinamika industri sehingga dapat beradaptasi, berinovasi, dan bahkan
                menciptakan lapangan kerja baru.
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
      <FloatingNav contentId="program-3" />
    </div>
  );
}
