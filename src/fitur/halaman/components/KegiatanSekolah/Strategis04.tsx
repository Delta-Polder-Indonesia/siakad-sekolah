import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Strategis04Page({ onNavigate }: PageProps) {
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
                className="h-full w-full object-cover"  loading="lazy" decoding="async" />
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-4.jpg`}
            alt="Kunjungan Industri Kelas XI"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Kegiatan 04
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Kegiatan Strategis 04
            </span>
            <time
              dateTime="2026-09-01"
              className="text-[10px] font-bold tracking-widest text-white/70 uppercase"
            >
              September 2026
            </time>
          </div>

          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Kunjungan Industri Kelas XI
          </h1>
        </div>
      </div>

      {/* ── BAGIAN ARTIKEL KORAN ── */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-20 md:px-12 md:pt-16 md:pb-28">
        {/* Kontainer Pembatas Garis Ganda Koran */}
        <div className="border-b-4 border-double border-gray-900 pt-14 pb-0 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-slate-900 uppercase md:text-4xl">
            Kunjungan Industri Kelas XI
          </h2>

          {/* Metadata Artikel & Tombol Bagikan di dalam pembatas */}
          <div className="mt-6 mb-4 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
              <span className="text-slate-300">•</span>
              <time dateTime="2026-09-15">Selasa, 15 September 2026</time>
            </div>
            <ShareButtons />
          </div>
        </div>

        {/* HERO ARTIKEL (Drop Cap pada huruf pertama paragraf awal) */}
        <div className="mb-10 pt-8 md:mb-12">
          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-800 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
            Kunjungan industri yang dilaksanakan bagi siswa kelas XI ke perusahaan mitra strategis
            merupakan sebuah intervensi pendidikan yang jauh melampaui fungsi tur edukatif semata.
            Dalam kerangka pedagogi vokasi, kegiatan ini beroperasi sebagai jembatan
            epistemologis—sebuah medium yang menghubungkan pengetahuan deklaratif yang diperoleh di
            ruang kelas dengan pengetahuan prosedural yang berkembang di tempat kerja nyata. Siswa
            yang selama ini berinteraksi dengan mesin, perangkat lunak, atau prosedur operasional
            melalui simulasi dan modul ajar, kini dihadapkan pada kompleksitas situasional yang
            tidak dapat direduksi dalam buku teks: ritme produksi yang sesungguhnya, hierarki
            komunikasi antardepartemen, serta problem-solving yang terjadi dalam konteks tekanan
            waktu dan sumber daya terbatas. Pengalaman langsung ini menjadi katalisator bagi
            transformasi kognitif—dari memahami konsep menjadi mengaplikasikannya, dan dari
            mengaplikasikan menjadi merefleksikan keterbatasan serta potensi pengembangan lebih
            lanjut.
          </p>
        </div>

        {/* SPACING KONTEN UTAMA */}
        <div className="space-y-6">
          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Pemilihan perusahaan mitra strategis sebagai tujuan kunjungan bukan tanpa pertimbangan
              mendalam. Kata "strategis" mengindikasikan adanya selektivitas dalam memilih
              mitra—tidak semua perusahaan memenuhi kriteria untuk menjadi tujuan kunjungan yang
              bermakna. Perusahaan mitra strategis biasanya memiliki karakteristik tertentu:
              relevansi bidangnya dengan program keahlian sekolah, komitmen terhadap pengembangan
              sumber daya manusia, ketersediaan fasilitas yang memadai untuk menerima kunjungan
              edukatif, dan kesediaan untuk berbagi pengetahuan serta pengalaman dengan siswa.
              Hubungan antara sekolah dan perusahaan semacam ini tidak bersifat transaksional satu
              kali, melainkan berkembang menjadi kemitraan jangka panjang yang saling menguntungkan:
              sekolah mendapatkan akses ke dunia kerja nyata bagi siswanya, sementara perusahaan
              mendapatkan akses ke calon tenaga kerja yang telah terpapar pada budaya dan standar
              industri mereka sejak dini.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Memperluas wawasan siswa tentang dunia kerja profesional merupakan tujuan yang tampak
              sederhana namun memiliki lapisan kompleksitas yang dalam. Wawasan, dalam konteks ini,
              biukan sekadar pengetahuan faktual mengenai apa yang terjadi di pabrik atau kantor; ia
              mencakup pemahaman terhadap norma, etika, dan ekspektasi yang berlaku di lingkungan
              profesional. Siswa perlu memahami bahwa dunia kerja memiliki ritme dan logika yang
              berbeda dari dunia sekolah. Di sekolah, kesalahan sering kali dianggap sebagai bagian
              dari proses belajar dan tidak selalu memiliki konsekuensi riil. Di dunia kerja,
              kesalahan dapat berarti kerugian finansial, penurunan reputasi, atau bahkan risiko
              keselamatan. Kunjungan industri memberikan kesempatan bagi siswa untuk mengamati
              langsung bagaimana profesional menavigasi tekanan ini—bagaimana mereka mengelola
              waktu, berkomunikasi dalam hierarki, dan membuat keputusan dalam kondisi
              ketidakpastian.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Menjalin hubungan antara sekolah dan mitra industri merupakan tujuan yang berkaitan
              erat dengan dimensi institusional dari pendidikan vokasi. Dalam literatur manajemen
              pendidikan, kemitraan sekolah-industri ("school-industry partnership") dikenal sebagai
              salah satu faktor kritis keberhasilan pendidikan kejuruan. Kemitraan yang efektif
              tidak hanya berupa undangan sporadis untuk kunjungan atau talk show, melainkan
              melibatkan kolaborasi yang terstruktur dalam desain kurikulum, penyediaan fasilitas
              praktikum, pembimbingan oleh praktisi, dan bahkan pengembangan proyek bersama.
              Kunjungan industri kelas XI dapat dipandang sebagai salah satu komponen dalam
              ekosistem kemitraan yang lebih luas. Jika kunjungan ini diikuti oleh program magang,
              kolaborasi proyek, atau penelitian terapan yang melibatkan siswa dan dudi, maka
              terbentuklah sebuah "pipeline" yang menghubungkan pendidikan dengan pekerjaan secara
              sistematis. Tanpa tindak lanjut semacam itu, kunjungan industri berisiko menjadi
              pengalaman yang bersifat episodik dan tidak terintegrasi dalam perjalanan pembelajaran
              siswa.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Memotivasi siswa untuk meningkatkan kompetensi teknis merupakan tujuan yang berkaitan
              erat dengan psikologi motivasi dan teori "self-efficacy". Motivasi yang muncul dari
              kunjungan industri bersifat "situational"—ia dipicu oleh pengalaman langsung yang
              kontras dengan kondisi belajar di kelas. Ketika siswa melihat teknologi canggih yang
              belum mereka pelajari, atau ketika mereka menyadari bahwa keterampilan yang mereka
              anggap cukup ternyata masih jauh dari standar industri, terjadi apa yang disebut
              "positive dissonance"—ketidaksesuaian kognitif yang memotivasi individu untuk
              mengurangi gap antara kompetensi saat ini dan kompetensi yang diharapkan. Namun, efek
              motivasi ini tidak otomatis; ia sangat bergantung pada bagaimana kunjungan didesain
              dan difasilitasi. Jika siswa hanya diajak berkeliling tanpa interaksi bermakna, atau
              jika penjelasan yang diberikan terlalu teknis dan tidak dapat diakses, maka potensi
              motivasi akan terbuang. Diperlukan desain kunjungan yang memadukan observasi,
              interaksi, refleksi, dan tindak lanjut agar pengalaman tersebut benar-benar menjadi
              katalisator perubahan.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Mempersiapkan siswa dalam menghadapi Praktik Kerja Lapangan (PKL) mendatang merupakan
              tujuan yang menempatkan kunjungan industri dalam kerangka "scaffolding"—sebuah
              struktur pendukung yang memudahkan transisi menuju kompetensi yang lebih tinggi. PKL,
              sebagai komponen wajib dalam kurikulum vokasi, menuntut siswa untuk bekerja penuh
              waktu di tempat kerja nyata selama periode tertentu. Bagi banyak siswa, ini adalah
              pertama kalinya mereka terpisah dari lingkungan sekolah yang familiar dan dihadapkan
              pada tuntutan profesional yang sesungguhnya. Kunjungan industri yang dilakukan sebelum
              PKL berfungsi sebagai "preview"—sebuah gambaran awal yang membantu siswa membangun
              ekspektasi yang realistis, mengidentifikasi area yang perlu diperkuat, dan
              mengembangkan strategi coping untuk menghadapi tantangan yang mungkin dijumpai nanti.
              Tanpa preview ini, siswa berisiko mengalami "reality shock" yang dapat mengganggu
              performa dan kesejahteraan psikologis mereka selama PKL.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Refleksi kritis terhadap kunjungan industri ini juga mengharuskan kita untuk
              mempertanyakan aspek-aspek yang sering kali terabaikan. Apakah kunjungan ini
              benar-benar memberikan akses yang setara bagi semua siswa, ataukah ada siswa yang
              mendapatkan pengalaman lebih kaya karena keberuntungan, koneksi, atau karakteristik
              pribadi tertentu? Bagaimana sekolah memastikan bahwa pengalaman yang diperoleh selama
              kunjungan tidak hanya bersifat individual, melainkan juga dapat dibagikan dan
              didiskusikan dalam kelompok sehingga manfaatnya meluas? Apakah ada mekanisme umpan
              balik dari perusahaan mitra mengenai kualitas persiapan siswa, sehingga sekolah dapat
              terus memperbaiki kurikulum dan metode pembelajaran? Pertanyaan-pertanyaan ini
              mengingatkan kita bahwa kunjungan industri, meskipun merupakan langkah yang sangat
              berharga, hanya akan optimal jika diintegrasikan dalam sistem pembelajaran yang
              terus-menerus dievaluasi dan ditingkatkan.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Pada tataran yang lebih luas, kunjungan industri kelas XI mengisyaratkan pergeseran
              paradigma dalam pendidikan vokasi dari orientasi pada penyediaan tenaga kerja menuju
              orientasi pada pengembangan talenta yang adaptif dan visioner. Dalam paradigma lama,
              sekolah vokasi dipandang sebagai pabrik yang menghasilkan tenaga kerja operasional
              dengan keterampilan spesifik yang dapat langsung dimanfaatkan oleh industri. Dalam
              paradigma baru, sekolah vokasi dipandang sebagai inkubator yang mengembangkan
              individu-individu yang tidak hanya mampu bekerja dalam kondisi yang ada, melainkan
              juga mampu beradaptasi dengan perubahan, mengidentifikasi peluang, dan bahkan
              menciptakan lapangan kerja baru. Kunjungan industri dalam paradigma baru ini bukan
              sekadar orientasi pada apa yang ada, melainkan juga inspirasi terhadap apa yang
              mungkin. Jika {namaSekolahUppercase} dapat mempertahankan dan mengembangkan inisiatif
              ini dengan visi yang jelas, maka kunjungan industri kelas XI akan tercatat bukan
              sebagai aktivitas rutin semesteran, melainkan sebagai fondasi bagi tradisi sekolah
              yang menghasilkan lulusan-lulusan yang tidak hanya siap kerja, melainkan juga siap
              memimpin, inovasi, dan berkontribusi pada transformasi industri masa depan.
            </p>
          </section>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="strategis-04" />
    </div>
  );
}
