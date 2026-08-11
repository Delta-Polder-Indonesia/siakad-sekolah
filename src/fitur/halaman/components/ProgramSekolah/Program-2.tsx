import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Program2Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/ProgramSekolah/sekolah-2.jpg`}
            alt={`Dokumentasi Kelas Industri dan Pembelajaran Berbasis Proyek ${namaSekolah}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold tracking-wider text-slate-400 uppercase">
            DOKUMENTASI PROGRAM 02
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
              PROGRAM STRATEGIS 02
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
              1 Tahun Ajaran
            </span>
          </div>

          {/* Judul Utama — Style Kalender Akademik */}
          <h1 className="max-w-3xl font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Kelas Industri dan Pembelajaran Berbasis Proyek
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
              KELAS INDUSTRI DAN PEMBELAJARAN BERBASIS PROYEK
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-900 italic">
              Program Kelas Industri dan Pembelajaran Berbasis Proyek yang ditawarkan oleh SMA
              NEGERI 1 MEDAN
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
              Program Kelas Industri dan Pembelajaran Berbasis Proyek yang ditawarkan oleh SMA
              NEGERI 1 MEDAN merupakan sebuah respons strategis terhadap kesenjangan yang sering
              kali terjadi antara kompetensi yang diajarkan di bangku sekolah dengan tuntutan aktual
              di dunia kerja. Dalam konteks ini, program ini tidak diposisikan sebagai penambahan
              jam pelajaran yang sekadar memperkenalkan siswa pada terminologi industri; lebih
              fundamental lagi, program ini dirancang untuk mengembangkan "industry-ready
              professional"—lulusan yang memahami bahwa pembelajaran tidak terbatas pada ruang
              kelas, melainkan terjadi dalam konteks nyata di mana teori, praktik, dan dinamika
              bisnis berinteraksi secara kompleks.
            </p>
          </div>

          {/* Seksi Utama: Deskripsi dan Tujuan Program */}
          <div className="space-y-6 pb-6">
            <h3 className="mb-4 pb-1 font-serif text-base font-black tracking-tight text-gray-900 uppercase">
              I. Deskripsi dan Tujuan Program
            </h3>

            {/* Paragraf A */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                1. Respons Strategis terhadap Kesenjangan Kompetensi
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Kolaborasi dengan dunia usaha dan industri untuk menyelenggarakan pembelajaran yang
                relevan mencerminkan sebuah kesadaran akan spektrum kompetensi yang dibutuhkan untuk
                tidak hanya memasuki, tetapi juga berkembang dalam ekosistem industri modern.
                Pembelajaran berbasis proyek nyata merupakan kompetensi inti yang membedakan program
                ini dari pendekatan pembelajaran konvensional. Proyek nyata bukan sekadar studi
                kasus yang disederhanakan; ia adalah tantangan aktual yang dihadapi oleh industri
                mitra—mulai dari pengembangan produk, perbaikan proses, hingga penyelesaian masalah
                teknis yang kompleks.
              </p>
            </div>

            {/* Paragraf B */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                2. Kemampuan Manajemen Proyek dan Konteks Bisnis
              </h4>
              <div className="mb-2 space-y-2 text-sm leading-relaxed text-gray-900">
                <p>
                  Kemampuan untuk mengerjakan proyek nyata memerlukan pemahaman terhadap metodologi
                  manajemen proyek, komunikasi dengan stakeholder, pengelolaan sumber daya, dan
                  penyerahan deliverable sesuai deadline dan spesifikasi yang ditetapkan. Namun,
                  pembelajaran berbasis proyek bukan sekadar menyelesaikan tugas; ia memerlukan
                  pemahaman mendalam terhadap konteks bisnis:
                </p>
                <ul className="ml-2 list-inside list-disc space-y-1">
                  <li>
                    <span className="font-bold">Keputusan Teknis:</span> Bagaimana keputusan teknis
                    mempengaruhi biaya produksi dan efisiensi operasional.
                  </li>
                  <li>
                    <span className="font-bold">Kualitas Output:</span> Bagaimana kualitas output
                    mempengaruhi reputasi perusahaan di mata konsumen.
                  </li>
                  <li>
                    <span className="font-bold">Kolaborasi Tim:</span> Bagaimana kolaborasi
                    antar-tim memastikan solusi yang dihasilkan bersifat holistik dan berkelanjutan.
                  </li>
                </ul>
                <p>
                  Siswa yang menguasai kompetensi ini tidak hanya mampu mengerjakan proyek; mereka
                  mampu merancang solusi yang bernilai tambah bagi industri mitra.
                </p>
              </div>
            </div>

            {/* Paragraf C */}
            <div className="text-justify">
              <h4 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold text-gray-900 uppercase">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-900" /> 3. Fondasi
                Teoretis melalui Praktisi Industri
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Kolaborasi dengan praktisi industri membentuk fondasi teoretis yang memungkinkan
                siswa untuk memahami prinsip-prinsip dasar dari setiap kompetensi yang mereka
                pelajari. Praktisi industri bukan sekadar pengajar tamu yang memberikan ceramah
                singkat; mereka adalah mentor yang membawa pengalaman lapangan, studi kasus aktual,
                dan perspektif bisnis yang tidak dapat ditemukan dalam buku teks. Pemahaman terhadap
                input dari praktisi sangat penting karena siswa mendapatkan{' '}
                <span className="italic">"reality check"</span> mengenai apa yang sebenarnya
                dibutuhkan oleh pasar kerja.
              </p>
            </div>

            {/* Paragraf D */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                4. Penyelarasan Kompetensi dengan Kebutuhan Dunia Kerja
              </h4>
              <p className="text-sm leading-relaxed text-gray-900">
                Penyelarasan kompetensi siswa dengan kebutuhan dunia kerja merupakan kompetensi yang
                mengangkat program ini dari level pembelajaran akademik menjadi level persiapan
                karier yang komprehensif. Dunia kerja masa depan tidak hanya menuntut keahlian
                teknis; ia juga menuntut kemampuan beradaptasi dengan perubahan teknologi,
                berkolaborasi dalam tim lintas fungsi, dan berpikir kritis dalam menghadapi
                tantangan yang belum pernah dijumpai sebelumnya. Dalam konteks ini, kelas industri
                berfungsi sebagai <span className="font-bold">"bridge"</span> antara dunia
                pendidikan dan dunia kerja—memastikan bahwa kurikulum yang diajarkan selalu relevan,
                fasilitas yang digunakan selaras dengan standar industri, dan kompetensi yang diukur
                sesuai dengan sertifikasi yang diakui oleh pasar.
              </p>
            </div>

            {/* Paragraf E */}
            <div className="text-justify">
              <h4 className="mb-1 font-sans text-sm font-bold text-gray-900 uppercase">
                5. Pembangunan Ekosistem Pembelajaran Kolaboratif
              </h4>
              <div className="text-sm leading-relaxed text-gray-900">
                <p className="mb-2">
                  Pembangunan ekosistem pembelajaran yang kolaboratif dan berkelanjutan merupakan
                  kompetensi yang sering kali dianggap kurang konkret dibandingkan dengan capaian
                  akademik individu, namun ia merupakan keterampilan yang sangat bernilai dalam
                  konteks organisasi modern. Ekosistem pembelajaran yang baik melibatkan tidak hanya
                  siswa dan guru, tetapi juga orang tua, alumni, mitra industri, dan komunitas
                  lokal.
                </p>
                <p>
                  Pendekatan pembelajaran modern, seperti{' '}
                  <span className="italic">"communities of practice"</span> dan{' '}
                  <span className="italic">"learning organization"</span>, menambahkan dimensi
                  sosial yang memerlukan pemahaman terhadap dinamika kelompok, manajemen
                  pengetahuan, dan budaya berbagi. Siswa yang dibekali dengan kompetensi kolaborasi
                  yang komprehensif—dari kerja sama dalam proyek kecil hingga partisipasi dalam
                  ekosistem industri yang luas—menjadi aset yang sangat bernilai bagi organisasi
                  mana pun.
                </p>
              </div>
            </div>
          </div>

          {/* Seksi Kedua: Keselamatan, Kesehatan Kerja, dan Lingkungan (K3) */}
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
                Keselamatan, Kesehatan Kerja, dan Lingkungan (K3) dalam konteks kelas industri
                merupakan kompetensi yang tidak dapat dinegosiasikan dan sering kali menjadi pembeda
                antara profesional yang bertanggung jawab dan yang tidak. Lingkungan industri—baik
                di bengkel, laboratorium, maupun kantor—melibatkan risiko yang signifikan: peralatan
                bertekanan tinggi, bahan kimia berbahaya, kebisingan, dan bahaya ergonomis dari
                pekerjaan repetitif.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Pemahaman terhadap regulasi K3, prosedur keselamatan, dan praktik kerja yang aman
                bukan hanya melindungi siswa selama masa pembelajaran, melainkan juga membentuk
                kebiasaan yang akan mereka bawa ke tempat kerja mereka kelak. Lebih dari itu, budaya
                keselamatan yang kuat merupakan indikator organisasi yang matang dan profesional.
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
                Refleksi kritis terhadap program Kelas Industri juga mengharuskan kita untuk
                mempertanyakan aspek-aspek yang sering kali terabaikan dalam kurikulum berbasis
                proyek. Apakah siswa juga dibekali dengan pemahaman terhadap{' '}
                <span className="italic">"intellectual property"</span>—bagaimana melindungi hak
                cipta atas solusi yang mereka kembangkan dalam proyek industri? Apakah mereka
                diajarkan untuk mempertimbangkan dampak etis dari setiap keputusan teknis—termasuk
                isu-isu seperti privasi data, keamanan siber, dan keadilan algoritmik?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">
                Bagaimana program mempersiapkan siswa untuk menghadapi otomatisasi yang semakin
                canggih—di mana tugas-tugas entry-level yang biasanya menjadi jalur masuk ke
                industri semakin diambil alih oleh sistem cerdas? Pertanyaan-pertanyaan ini
                mengingatkan kita bahwa profesional industri yang baik di masa depan bukan hanya
                yang menguasai tools dan teknik, melainkan juga yang mampu berpikir sistemik,
                beradaptasi dengan teknologi baru, dan berkontribusi pada industri yang
                berkelanjutan secara sosial dan lingkungan.
              </p>
            </div>
          </div>

          {/* Seksi Keempat: Visi Nasional / Lampiran Box */}
          <div className="pt-6 pb-8">
            <div className="p-4">
              <h4 className="mb-3 text-center font-sans text-sm font-bold tracking-wide text-gray-900 uppercase">
                ! VISI PROGRAM DALAM KONTEKS NASIONAL !
              </h4>
              <p className="text-justify text-xs text-gray-900">
                Pada tataran yang lebih luas, program Kelas Industri dan Pembelajaran Berbasis
                Proyek di {namaSekolahUppercase} dapat dipandang sebagai komponen vital dalam upaya
                bangsa Indonesia untuk membangun <span className="font-bold">"link and match"</span>{' '}
                antara pendidikan vokasi dan kebutuhan industri nasional. Dalam konteks di mana
                angka pengangguran terdidik masih menjadi tantangan besar dan persaingan global
                semakin ketat, kemampuan untuk menghasilkan lulusan yang siap kerja dan sesuai
                ekspektasi pasar menjadi semakin krusial.
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
      <FloatingNav contentId="program-2" />
    </div>
  );
}
