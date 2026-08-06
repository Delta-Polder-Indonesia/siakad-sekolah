import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Strategis05Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const [imageError, setImageError] = useState(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div
      id="berita-scroll-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-white font-serif text-gray-900"
    >
      {/* ── HEADER & HERO BANNER ── */}
      <div
        className={`relative min-h-[280px] w-full overflow-hidden bg-slate-100 ${TINGGI_FOTO} ${MAKSIMAL_TINGGI}`}
      >
        <div className="absolute top-6 left-6 z-20 flex flex-shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Tutup modal dan kembali ke halaman Kegiatan Sekolah"
            className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-white/15"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md shadow-black/30 md:h-10 md:w-10">
              <img
                src={`${import.meta.env.BASE_URL}images/logo/gambar-2.svg`}
                alt={`Logo ${namaSekolahUppercase}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm leading-tight font-bold tracking-tight text-white drop-shadow-md md:text-base lg:text-lg">
                {namaSekolahUppercase}
              </p>
              <p className="hidden text-[9px] font-semibold tracking-[0.12em] text-white/80 uppercase drop-shadow sm:block">
                SMA Unggulan Yang Menghasilkan SDM Bermutu
              </p>
            </div>
          </div>
        </div>

        {!imageError ? (
          <img
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-5.jpg`}
            alt="Seminar Karir dan Beasiswa"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Kegiatan 05
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Kegiatan Strategis 05
            </span>
            <time
              dateTime="2026-11-01"
              className="text-[10px] font-bold tracking-widest text-white/70 uppercase"
            >
              November 2026
            </time>
          </div>

          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Seminar Karir dan Beasiswa
          </h1>
        </div>
      </div>

      {/* ── BAGIAN ARTIKEL KORAN ── */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-20 md:px-12 md:pt-16 md:pb-28">
        {/* Kontainer Pembatas Garis Ganda Koran */}
        <div className="border-b-4 border-double border-gray-900 pt-14 pb-0 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-slate-900 uppercase md:text-4xl">
            Seminar Karir dan Beasiswa
          </h2>

          {/* Metadata Artikel & Tombol Bagikan */}
          <div className="mt-6 mb-4 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
              <span className="text-slate-300">•</span>
              <time dateTime="2026-11-12">Kamis, 12 November 2026</time>
            </div>
            <ShareButtons />
          </div>
        </div>

        {/* PARAGRAF PEMBUKA (Drop Cap Efek) */}
        <div className="mb-10 pt-8 md:mb-12">
          <p className="text-justify text-[15px] leading-relaxed text-slate-800 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
            Seminar Karir dan Beasiswa yang diselenggarakan oleh {namaSekolahUppercase} merupakan
            sebuah intervensi pendidikan yang berfungsi sebagai kompas navigasi bagi siswa kelas XII
            yang berdiri di persimpangan antara dunia sekolah dan dunia pasca-lulus. Dalam konteks
            ini, seminar tidak sekadar forum informasional yang menyajikan data mengenai peluang
            kerja atau daftar beasiswa; ia beroperasi sebagai mekanisme "career scaffolding"—sebuah
            struktur pendukung yang membantu siswa membangun pemahaman sistematis tentang diri
            mereka, pasar kerja, dan ekosistem pendidikan lanjutan. Kehadiran alumni sukses yang
            telah berkarir di berbagai bidang industri maupun akademik menambahkan dimensi "social
            proof" yang sangat kuat: siswa tidak hanya mendengarkan teori atau prospek abstrak,
            melainkan juga menyaksikan narasi konkret dari individu-individu yang pernah berada pada
            posisi yang sama dengan mereka dan berhasil menavigasi transisi tersebut dengan berbagai
            strategi dan jalur yang berbeda.
          </p>
        </div>

        {/* KONTEN ARTIKEL UTAMA */}
        <div className="space-y-6">
          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Memberikan informasi beasiswa yang relevan dan akurat merupakan tujuan instrumental
              yang memiliki implikasi jangka panjang terhadap mobilitas sosial-ekonomi siswa.
              Beasiswa, dalam kerangka teori sosiologi pendidikan, berfungsi sebagai
              "equalizer"—mekanisme yang mengurangi ketimpangan akses terhadap pendidikan
              berkualitas yang sering kali ditentukan oleh kapasitas finansial keluarga. Namun,
              akses terhadap informasi beasiswa sendiri tidak merata; siswa dari keluarga dengan
              jaringan sosial yang luas dan literasi informasi yang tinggi cenderung lebih awal
              mengetahui dan mempersiapkan diri untuk peluang-peluang tersebut. Seminar yang
              dirancang dengan baik mengurangi "information asymmetry" ini dengan menyajikan
              informasi yang terkurasi, terstruktur, dan dapat diakses oleh seluruh siswa tanpa
              memandang latar belakang. Lebih dari itu, seminar juga perlu membekali siswa dengan
              keterampilan untuk mencari informasi secara mandiri—karena daftar beasiswa yang
              tersedia hari ini mungkin tidak sama dengan yang akan tersedia tahun depan, dan
              ketergantungan pada informasi sekunder dapat membuat siswa ketinggalan peluang baru
              yang muncul.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Menghadirkan inspirasi dari alumni dan praktisi berpengalaman merupakan dimensi
              afektif dari seminar yang sering kali terabaikan dalam analisis berbasis output.
              Inspirasi, dalam psikologi motivasi, bukan sekadar emosi positif yang membuat
              seseorang merasa gembira sementara; ia merupakan katalisator "self-efficacy"—keyakinan
              individu bahwa ia mampu menyelesaikan tugas atau mencapai tujuan tertentu. Ketika
              siswa mendengarkan alumni yang berasal dari latar belakang serupa berhasil meraih
              posisi bergengsi atau menyelesaikan studi di perguruan tinggi ternama, terjadi proses
              "vicarious experience"—pengalaman tidak langsung yang memperkuat keyakinan bahwa "jika
              mereka bisa, saya juga bisa." Efek ini menjadi semakin kuat ketika alumni tersebut
              tidak hanya menceritakan kesuksesannya, melainkan juga keterbukaannya mengenai
              kegagalan, keraguan, dan proses pembelajaran yang panjang. Narasi yang autentik dan
              tidak dipoles menciptakan koneksi emosional yang jauh lebih mendalam daripada ceramah
              motivasi yang bersifat generik.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Membantu siswa merencanakan jalur karir pasca lulus merupakan tujuan yang menuntut
              pendekatan yang jauh melampaui penyampaian informasi. Perencanaan karir, dalam
              literatur "career development theory", merupakan proses seumur hidup yang melibatkan
              eksplorasi diri, eksplorasi dunia kerja, pengambilan keputusan, dan implementasi.
              Siswa kelas XII berada pada fase eksplorasi dan pengambilan keputusan—sebuah fase yang
              ditandai oleh pertanyaan-pertanyaan fundamental: Apa yang saya kuasai? Apa yang saya
              sukai? Apa yang dibutuhkan pasar kerja? Dan bagaimana saya menjembatani ketiganya?
              Seminar yang efektif tidak memberikan jawaban siap pakai, melainkan menyediakan
              kerangka kerja dan alat bantu yang memungkinkan siswa untuk menjawab
              pertanyaan-pertanyaan ini secara mandiri. Alat bantu tersebut dapat berupa asesmen
              minat bakat, daftar pertanyaan reflektif, atau simulasi pengambilan keputusan yang
              memperlihatkan konsekuensi jangka panjang dari berbagai pilihan.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Memotivasi siswa untuk terus berprestasi dan tidak menyerah merupakan tujuan yang
              berkaitan erat dengan konsep "grit" yang dikembangkan oleh Angela Duckworth.
              Grit—kombinasi dari passion dan perseverance untuk tujuan jangka panjang—merupakan
              prediktor yang lebih kuat terhadap kesuksesan dibandingkan dengan bakat atau
              kecerdasan semata. Namun, grit tidak dapat diajarkan melalui ceramah; ia dikembangkan
              melalui pengalaman menghadapi tantangan, gagal, bangkit kembali, dan akhirnya
              berhasil. Alumni yang berbagi kisah perjalanan mereka secara autentik—termasuk
              momen-momen keraguan, kegagalan, dan proses pemulihan—memberikan "roadmap" psikologis
              yang menunjukkan kepada siswa bahwa kesuksesan bukan garis lurus, melainkan jalur
              berliku yang memerlukan ketahanan. Motivasi yang muncul dari seminar semacam ini
              bersifat "intrinsic"—ia berasal dari dalam diri siswa yang telah melihat bahwa tujuan
              yang mereka idamkan memang mungkin dicapai, meskipun dengan usaha dan waktu yang
              signifikan.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Dari perspektif institusi, seminar karir dan beasiswa merupakan investasi dalam
              "alumni capital" dan "reputational capital". Siswa yang mendapatkan arahan yang baik
              dan berhasil menempuh jalur pendidikan atau pekerjaan yang sesuai dengan potensinya,
              memiliki probabilitas lebih tinggi untuk menjadi ambassador sekolah, mentor bagi
              generasi berikutnya, atau bahkan mitra industri yang dapat membuka peluang bagi adik
              kelas. Lebih dari itu, keberhasilan alumni dalam berbagai bidang memperkuat narasi
              sekolah sebagai institusi yang tidak hanya menghasilkan lulusan yang terampil secara
              teknis, melainkan juga lulusan yang mampu menavigasi kompleksitas karir dan pendidikan
              lanjutan. Narasi ini, yang dibangun secara konsisten dari tahun ke tahun, menjadi aset
              tak berwujud yang memengaruhi daya tarik sekolah bagi calon siswa, kepercayaan orang
              tua, dan kualitas mitra yang bersedia berkolaborasi.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Refleksi kritis terhadap seminar ini juga mengharuskan kita untuk mengidentifikasi
              potensi kekurangan dan ruang perbaikan. Apakah informasi yang disampaikan selalu
              up-to-date dan relevan dengan kondisi pasar kerja saat ini, ataukah ada risiko
              "obsolescence" karena dinamika industri yang cepat berubah? Apakah seminar ini
              mencapai siswa yang paling membutuhkannya—termasuk mereka yang berasal dari keluarga
              dengan literasi informasi rendah atau dengan keterbatasan finansial yang membuat
              mereka lebih bergantung pada beasiswa—atau apakah ia hanya mengkonfirmasi keunggulan
              siswa yang sudah memiliki akses dan sumber daya? Bagaimana sekolah memastikan bahwa
              motivasi yang muncul selama seminar tidak pudar begitu siswa kembali ke rutinitas
              harian yang penuh tekanan akademik? Pertanyaan-pertanyaan ini mengarahkan kita pada
              kesadaran bahwa seminar karir, meskipun merupakan langkah yang sangat berharga, hanya
              akan optimal jika diintegrasikan dalam sistem bimbingan dan konseling yang
              berkelanjutan sepanjang tahun ajaran.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Pada tataran yang lebih luas, seminar karir dan beasiswa mengisyaratkan pergeseran
              paradigma dalam pendidikan vokasi dari orientasi pada penyiapan tenaga kerja
              operasional menuju orientasi pada pengembangan talenta yang adaptif, visioner, dan
              mampu memilih jalur hidupnya secara mandiri. Dalam paradigma baru ini, sekolah tidak
              lagi berfungsi sebagai pabrik yang menghasilkan produk standar untuk pasar kerja,
              melainkan sebagai inkubator yang mengembangkan individu-individu dengan kapasitas
              untuk belajar sepanjang hayat, beradaptasi dengan perubahan, dan bahkan menciptakan
              lapangan kerja baru. Seminar yang memperkenalkan siswa pada berbagai jalur—termasuk
              kewirausahaan, studi lanjut, atau kombinasi keduanya—membantu membentuk "career
              resilience" yang esensial dalam menghadapi ketidakpastian. Jika {namaSekolahUppercase}
              dapat mempertahankan dan mengembangkan inisiatif ini dengan visi yang jelas, maka
              seminar karir dan beasiswa akan tercatat bukan sebagai acara insidental, melainkan
              sebagai fondasi bagi tradisi sekolah yang menghasilkan lulusan-lulusan yang tidak
              hanya siap kerja, melainkan juga siap memimpin, inovasi, dan berkontribusi pada
              transformasi sosial-ekonomi bangsa.
            </p>
          </section>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="strategis-05" />
    </div>
  );
}
