import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import ShareButtons from '../ShareButtons';
import FloatingNav from '../FloatingNav';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Strategis02Page({ onNavigate }: PageProps) {
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
            src={`${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-2.jpg`}
            alt="Class Meeting dan Expo Karya Siswa"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Kegiatan 02
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Kegiatan Strategis 02
            </span>
            <time
              dateTime="2026-12-01"
              className="text-[10px] font-bold tracking-widest text-white/70 uppercase"
            >
              Desember 2026
            </time>
          </div>

          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Class Meeting dan Expo Karya Siswa
          </h1>
        </div>
      </div>

      {/* ── BAGIAN ARTIKEL KORAN ── */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-20 md:px-12 md:pt-16 md:pb-28">
        {/* Kontainer Pembatas Garis Ganda Koran */}
        <div className="border-b-4 border-double border-gray-900 pt-14 pb-0 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-slate-900 uppercase md:text-4xl">
            Class Meeting dan Expo Karya Siswa
          </h2>

          {/* Metadata Artikel & Tombol Bagikan di dalam pembatas */}
          <div className="mt-6 mb-4 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
              <span className="text-slate-300">•</span>
              <time dateTime="2026-12-18">Jumat, 18 Desember 2026</time>
            </div>
            <ShareButtons />
          </div>
        </div>

        {/* HERO ARTIKEL (Drop Cap pada huruf pertama paragraf awal) */}
        <div className="mb-10 pt-8 md:mb-12">
          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-800 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold">
            Class Meeting dan Expo Karya Siswa yang diselenggarakan oleh {namaSekolahUppercase}
            merupakan sebuah event komposit yang menggabungkan tiga dimensi pendidikan—akademik,
            kompetitif, dan artistik—dalam satu forum yang menjadi puncak penutup semester. Dalam
            konteks ini, kegiatan ini tidak sekadar hiburan atau ajang seremonial; ia berfungsi
            sebagai "capstone experience"—pengalaman integratif yang memungkinkan siswa untuk
            mensintesis pengetahuan, keterampilan, dan kreativitas yang telah dikembangkan selama
            satu semester dalam bentuk yang konkret dan dapat diapresiasi oleh publik. Pameran karya
            dari berbagai program keahlian, lomba antar kelas, dan pentas seni yang tampilkan
            mencerminkan komitmen sekolah terhadap paradigma pendidikan holistik, di mana
            pengembangan kompetensi teknis tidak dipisahkan dari pengembangan ekspresi kreatif dan
            kemampuan bekerja sama dalam komunitas.
          </p>
        </div>

        {/* SPACING KONTEN UTAMA */}
        <div className="space-y-6">
          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Dari perspektif pedagogi, expo karya siswa memiliki nilai yang jauh melampaui fungsi
              display atau pameran hasil belajar. Ia merupakan implementasi dari "project-based
              learning" pada skala institusional, di mana seluruh proses—mulai dari perencanaan,
              eksekusi, hingga presentasi—menjadi bagian dari kurikulum yang terintegrasi. Ketika
              siswa teknik mesin menampilkan prototipe alat yang mereka rancang, atau siswa rekayasa
              perangkat lunak mempresentasikan aplikasi yang mereka kembangkan, mereka tidak hanya
              menunjukkan produk akhir; mereka juga menunjukkan kemampuan untuk mengidentifikasi
              masalah, merancang solusi, mengelola proyek, dan berkomunikasi hasilnya kepada audiens
              yang beragam. Keterampilan-keterampilan ini—yang sering kali dikelompokkan dalam
              kategori "21st century skills"—tidak dapat diukur melalui ujian tulis standar, namun
              jrustu menjadi diferensiator utama dalam kesuksesan karir di era kontemporer.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Menampilkan hasil karya terbaik siswa dari semua program keahlian merupakan strategi
              yang cerdas untuk membangun "cross-pollination" antardisiplin. Dalam lingkungan
              sekolah kejuruan yang sering kali terfragmentasi berdasarkan program keahlian—di mana
              siswa teknik jarang berinteraksi dengan siswa tata busana, atau siswa elektronika
              jarang berkolaborasi dengan siswa kuliner—expo menciptakan ruang pertemuan yang jarang
              terjadi dalam rutinitas harian. Siswa dari program keahlian yang berbeda dapat saling
              mengamati, mengajukan pertanyaan, dan bahkan mengidentifikasi peluang kolaborasi yang
              tidak terpikirkan sebelumnya. Seorang siswa desain grafis mungkin melihat kebutuhan
              akan ilustrasi teknis dalam proyek siswa teknik; seorang siswa pemasaran mungkin
              menawarkan strategi promosi untuk produk siswa kuliner. Interaksi-interaksi semacam
              ini, meskipun sering kali tidak direncanakan, mereplikasi dinamika inovasi yang
              terjadi di dunia industri nyata, di mana solusi paling kreatif sering kali lahir dari
              persilangan bidang yang berbeda.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Kompetisi antar kelas yang diadakan dalam Class Meeting menambahkan dimensi
              "gamification" yang memperkuat engagement dan motivasi siswa. Namun, perlu dibedakan
              antara kompetisi yang konstruktif dan kompetisi yang destruktif. Kompetisi yang
              konstruktif berfokus pada "mastery"—mendorong setiap peserta untuk mencapai standar
              terbaik versi dirinya sendiri, dengan apresiasi terhadap proses dan usaha, bukan hanya
              hasil akhir. Kompetisi yang destruktif, di sisi lain, berfokus pada "performance
              relative"—menang atau kalah, mengalahkan atau dikalahkan—yang dapat menimbulkan
              rivalitas yang tidak sehat, kecemburuan sosial, dan bahkan praktik curang. Desain
              kompetisi di {namaSekolahUppercase}, dengan menekankan pada sportivitas dan
              penghargaan terhadap berbagai bentuk prestasi, mengindikasikan adanya kesadaran akan
              risiko ini. Namun, efektivitasnya sangat bergantung pada bagaimana guru, pembimbing,
              dan juri mengimplementasikan nilai-nilai tersebut dalam praktik penilaian dan umpan
              balik selama kompetisi berlangsung.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Pentas seni yang menjadi bagian dari event ini memperkaya dimensi afektif dan estetik
              dari pengalaman pendidikan siswa. Dalam sistem pendidikan yang sering kali terobsesi
              pada metrik kuantitatif—nilai ujian, ranking kelas, persentase kelulusan—pentas seni
              mengingatkan kita bahwa pendidikan juga berkaitan dengan pembentukan sensibilitas,
              ekspresi diri, dan apresiasi terhadap keindahan. Siswa yang tampil dalam pentas seni,
              baik sebagai musisi, penari, aktor, atau penyanyi, mengembangkan kepercayaan diri
              untuk tampil di depan publik—sebuah keterampilan yang bernilai tinggi dalam hampir
              semua profesi. Lebih dari itu, mereka juga belajar tentang disiplin latihan, kerja
              sama tim dalam ensambel atau pertunjukan kelompok, dan manajemen kecemasan performa.
              Bagi penonton, pentas seni memberikan kesempatan untuk mengalami "collective
              effervescence"—sebuah momen kebersamaan emosional yang memperkuat ikatan komunitas
              sekolah, sebagaimana dikonseptualisasikan oleh Émile Durkheim dalam konteks ritual
              sosial.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Meningkatkan rasa bangga dan kepercayaan diri siswa merupakan tujuan yang berkaitan
              erat dengan dimensi psikologis dari event ini. Dalam teori "self-efficacy" Albert
              Bandura, pengalaman berhasil yang diperoleh dalam konteks yang menantang dan bermakna
              merupakan sumber utama kepercayaan diri. Ketika siswa melihat karya mereka dipajang,
              dipresentasikan, atau diapresiasi oleh orang lain—termasuk guru, orang tua, dan teman
              sebaya—mereka mengalami validasi eksternal yang memperkuat keyakinan internal mereka
              tentang kemampuan diri. Validasi ini menjadi semakin bermakna ketika datang dari
              audiens yang autentik, bukan hanya dari guru yang secara struktural memang ditugaskan
              untuk memberikan penilaian positif. Kehadiran orang tua dan alumni dalam expo,
              misalnya, menambahkan lapisan legitimasi sosial yang tidak dapat direplikasi dalam
              setting kelas konvensional. Namun, risikonya adalah bahwa siswa yang tidak
              berpartisipasi atau tidak memiliki karya yang dipamerkan dapat merasa terpinggirkan
              atau kurang berharga. Strategi inklusi yang memastikan setiap siswa memiliki
              kontribusi, meskipun dalam skala kecil, menjadi krusial untuk mencegah polarisasi
              self-esteem.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Sebagai penutup semester yang meriah dan berkesan, Class Meeting dan Expo Karya Siswa
              juga berfungsi sebagai mekanisme "closure" psikologis. Dalam psikologi perkembangan,
              kemampuan untuk menutup satu fase dengan cara yang bermakna memfasilitasi transisi
              menuju fase berikutnya. Bagi siswa, penutup semester yang dirayakan bersama
              menciptakan batasan mental yang jelas antara periode belajar yang intensif dan periode
              istirahat atau persiapan untuk semester baru. Tanpa mekanisme closure semacam ini,
              siswa dapat mengalami "carry-over stress"—tekanan dari semester sebelumnya yang terus
              membebani psikologis mereka. Namun, perlu diperhatikan bahwa "meriah" tidak harus
              berarti "mahal" atau "spektakuler". Sebuah event yang berkesan dapat tercipta dari
              kesederhanaan yang autentik, di mana fokusnya pada partisipasi dan kebersamaan
              daripada pada produksi yang megah. {namaSekolahUppercase} perlu memastikan bahwa
              tekanan untuk menciptakan event yang "instagrammable" atau viral tidak mengaburkan
              tujuan pedagogis inti dari kegiatan ini.
            </p>
          </section>

          <section>
            <p className="text-justify text-[15px] leading-relaxed text-slate-800">
              Refleksi kritis terhadap Class Meeting dan Expo Karya Siswa mengarahkan kita pada
              pertanyaan mengenai sustentabilitas dan skalabilitas event semacam ini. Apakah karya
              yang dipamerkan selama expo memiliki lifecycle yang berkelanjutan, ataukah mereka
              terlupakan begitu event selesai? Bagaimana sekolah memastikan bahwa proyek-proyek
              terbaik dari siswa tidak hanya menjadi pajangan sementara, melainkan juga memiliki
              potensi untuk dikembangkan lebih lanjut, dipatenkan, atau bahkan dikomersialisasikan?
              Beberapa sekolah kejuruan terkemuka di dunia telah membuktikan bahwa karya siswa dapat
              menjadi benih bagi startup teknologi atau produk inovatif yang sukses di pasaran. Jika
              {namaSekolahUppercase} dapat membangun ekosistem yang mendukung pengembangan lanjut
              karya siswa—melalui inkubator, kemitraan dengan investor, atau program mentoring oleh
              alumni yang berhasil—maka expo ini tidak hanya menjadi penutup semester, melainkan
              juga pembuka bagi peluang kewirausahaan dan inovasi yang berkelanjutan. Jika langkah
              ini dapat direalisasikan, maka Class Meeting dan Expo Karya Siswa akan tercatat bukan
              sebagai akhir dari satu siklus, melainkan sebagai permulaan dari tradisi sekolah yang
              menghasilkan tidak hanya lulusan yang terampil, melainkan juga lulusan yang kreatif,
              percaya diri, dan visioner dalam membentuk masa depannya sendiri.
            </p>
          </section>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <ProgramFooter onNavigate={onNavigate} />

      {/* FLOATING NAV */}
      <FloatingNav contentId="strategis-02" />
    </div>
  );
}
