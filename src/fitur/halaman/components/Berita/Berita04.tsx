import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { useToast } from '../../../../components/ui';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Berita04Page({ onNavigate }: PageProps) {
  const goBack = useBackNavigation();
  const { showToast } = useToast();
  const [imageError, setImageError] = useState(false);

  const TINGGI_FOTO = 'h-[90vh]';
  const MAKSIMAL_TINGGI = 'max-h-[650px]';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white font-sans text-slate-900">
      {/* --- HERO IMAGE CONTAINER --- */}
      <div
        className={`relative min-h-[280px] w-full overflow-hidden bg-slate-100 ${TINGGI_FOTO} ${MAKSIMAL_TINGGI}`}
      >
        <div className="absolute top-6 left-6 z-20 flex flex-shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Tutup modal"
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
              <h1 className="text-sm leading-tight font-bold tracking-tight text-white drop-shadow-md md:text-base lg:text-lg">
                {namaSekolahUppercase}
              </h1>
              <p className="hidden text-[9px] font-semibold tracking-[0.12em] text-white/80 uppercase drop-shadow sm:block">
                SMP Unggulan Yang Menghasilkan SDM Bermutu
              </p>
            </div>
          </div>
        </div>

        {!imageError ? (
          <img
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.webp`}
            alt="Pembukaan PPDB Gelombang 1"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
            Dokumentasi Berita
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Pengumuman
            </span>
            <time
              dateTime="2026-06-01"
              className="text-[10px] font-bold tracking-widest text-white/70 uppercase"
            >
              1 Juni 2026
            </time>
          </div>

          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Pembukaan PPDB Gelombang 1 Tahun Ajaran 2026/2027
          </h1>
        </div>
      </div>

      {/* --- KONTEN UTAMA: MODIFIKASI ARTIKEL ALA KORPORAT & FITUR SHARE --- */}
      <section className="mx-auto max-w-[1200px] px-4 pt-8 pb-12 md:px-8 lg:px-12 lg:pt-10 lg:pb-16">
        {/* Metadata Artikel & Tombol Bagikan */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Oleh: Tim Humas</span>
            <span className="text-slate-300">•</span>
            <time dateTime="2026-06-01">Senin, 1 Juni 2026</time>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
              Bagikan:
            </span>
            <div className="flex items-center gap-1.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke WhatsApp"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors duration-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.488 1.451 5.42 1.452 5.345 0 9.696-4.35 9.699-9.697.002-2.592-1.001-5.029-2.825-6.855C17.062 2.229 14.621 1 12.008 1 6.666 1 2.317 5.35 2.315 10.694c-.001 2.012.528 3.977 1.533 5.707l-.991 3.616 3.792-.994z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke Twitter"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors duration-200 hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                </svg>
              </a>

              {/* Salin Tautan */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const copyPromise = navigator.clipboard?.writeText(window.location.href);
                    if (copyPromise) {
                      copyPromise
                        .then(() => showToast('success', 'Tautan berhasil disalin ke papan klip!'))
                        .catch(() =>
                          showToast('error', 'Gagal menyalin tautan. Silakan coba lagi.')
                        );
                    } else {
                      showToast('error', 'Fitur salin tautan tidak didukung di browser ini.');
                    }
                  }
                }}
                aria-label="Salin tautan"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Paragraf dan Artikel Body */}
        <div className="space-y-7 text-[16px] leading-relaxed text-slate-700 md:text-[17px] md:leading-loose">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-blue-900 uppercase">
              <span className="h-3 w-1 bg-blue-600" />
              Ringkasan Berita
            </h2>
            {/* Dropcap bergaya korporat pada huruf pertama */}
            <p className="text-justify first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:leading-none first-letter:font-bold first-letter:text-blue-900">
              Pembukaan Penerimaan Peserta Didik Baru (PPDB) gelombang pertama untuk tahun ajaran
              2026/2027 oleh {namaSekolahUppercase} bukan sekadar prosedur administratif rutin yang
              menandai dimulainya siklus penerimaan siswa baru; lebih dari itu, ia merefleksikan
              posisi strategis sekolah dalam ekosistem pendidikan vokasi regional dan nasional.
              Dalam konteks kebijakan pendidikan yang semakin menekankan pada transparansi,
              akuntabilitas, dan akses yang merata, PPDB berfungsi sebagai pintu gerbang pertama
              yang menentukan siapa yang berhak mengakses sumber daya pendidikan berkualitas yang
              dimiliki institusi. Keputusan untuk membuka pendaftaran secara online melalui portal
              resmi sekolah mengindikasikan adanya komitmen terhadap digitalisasi proses—sebuah
              langkah yang tidak hanya meningkatkan efisiensi operasional, tetapi juga memperluas
              jangkauan akses bagi calon siswa yang berada di luar radius geografis langsung
              sekolah.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Dari perspektif sosiologi pendidikan, PPDB dapat dipahami sebagai mekanisme seleksi
              sosial yang memiliki dampak jangka panjang terhadap reproduksi atau transformasi
              struktur stratifikasi. Sekolah kejuruan unggulan seperti {namaSekolahUppercase},
              dengan fasilitas, kurikulum, dan jaringan industri yang telah terbangun, secara
              inheren menarik minat calon siswa dari berbagai latar belakang sosial-ekonomi. Namun,
              daya tarik ini juga menciptakan persaingan yang ketat, di mana kualitas input—dalam
              hal ini calon siswa yang diterima—menjadi variabel penting dalam menentukan kualitas
              output lulusan di masa depan. Oleh karena itu, desain sistem PPDB, mulai dari kriteria
              seleksi, mekanisme verifikasi, hingga alokasi kuota, bukan sekadar masalah teknis
              administrasi, melainkan juga pertaruhan visi pedagogis dan komitmen terhadap keadilan
              pendidikan.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Sistem pendaftaran online yang diimplementasikan membuka jendela bagi analisis
              terhadap "digital divide" dalam akses pendidikan. Meskipun platform digital
              menjanjikan efisiensi dan keterbukaan, ia juga mengasumsikan adanya infrastruktur
              teknologi dan literasi digital yang memadai pada sisi calon siswa dan orang tua. Dalam
              konteks Indonesia, di mana kesenjangan akses internet dan perangkat digital masih
              signifikan antara perkotaan dan perdesaan, serta antara kelompok ekonomi menengah-atas
              dan kelompok rentan, pendaftaran online berpotensi menjadi "barrier" bagi calon siswa
              yang memenuhi kriteria akademik namun terhambat oleh keterbatasan teknologi. SMA
              NEGERI 1 MEDAN, dengan membuka akses pendaftaran "kapan saja dan dari mana saja",
              secara implisit telah membuat asumsi mengenai kemampuan teknis calon pengguna.
              Pertanyaan kritis yang muncul adalah: bagaimana sekolah memastikan bahwa calon siswa
              yang tidak memiliki akses teknologi memiliki jalur alternatif yang setara, sehingga
              digitalisasi PPDB tidak malah memperkuat eksklusi yang sudah ada?
            </p>
          </div>

          {/* Pull Quote Korporat Menarik */}
          <blockquote className="my-8 border-l-4 border-blue-600 bg-slate-50 px-6 py-4 text-slate-800 italic md:text-lg">
            "PPDB berfungsi sebagai pintu gerbang pertama yang menentukan siapa yang berhak
            mengakses sumber daya pendidikan berkualitas yang dimiliki institusi."
          </blockquote>

          <div>
            <p className="text-justify">
              Persyaratan pendaftaran yang ditetapkan—mulai dari fotokopi ijazah atau Surat
              Keterangan Lulus (SKL), Kartu Keluarga, Akta Kelahiran, pas foto, hingga surat
              rekomendasi dari sekolah asal—mencerminkan sebuah logika verifikasi multi-layer yang
              bertujuan untuk menjamin validitas data dan keabsahan calon siswa. Namun, setiap
              persyaratan administratif juga memiliki biaya implisit: biaya fotokopi, biaya
              pengurusan dokumen, biaya transportasi untuk mengumpulkan berkas, dan bahkan biaya
              sosial dalam bentuk waktu serta tenaga yang dikeluarkan orang tua. Bagi keluarga
              dengan sumber daya terbatas, akumulasi biaya-biaya ini, meskipun terlihat nominal,
              dapat menjadi beban yang signifikan. Dalam perspektif kebijakan publik, ini
              mengingatkan kita pada konsep "administrative burden"—hambatan yang diciptakan oleh
              prosedur pemerintahan atau institusi yang secara tidak proporsional memengaruhi
              kelompok masyarakat yang paling membutuhkan layanan. Sebuah sistem PPDB yang
              berorientasi pada inklusi perlu secara aktif mengidentifikasi dan mengurangi beban
              administratif ini, misalnya melalui program bantuan dokumen atau fasilitasi bagi
              keluarga tidak mampu.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Surat rekomendasi dari sekolah asal sebagai salah satu persyaratan menarik untuk
              dikaji lebih dalam. Dokumen ini, dalam teori, berfungsi sebagai validasi eksternal
              mengenai karakter, prestasi, dan potensi calon siswa dari sudut pandang institusi yang
              telah mengenalnya selama beberapa tahun. Namun, dalam praktik, surat rekomendasi juga
              dapat menjadi sumber bias—tergantung pada kualitas relasi antara sekolah asal dan
              sekolah tujuan, ketersediaan waktu dan kapasitas guru untuk menulis rekomendasi yang
              substantif, serta tingkat kesadaran orang tua mengenai pentingnya dokumen ini. Jika
              tidak dikelola dengan transparan, persyaratan rekomendasi berpotensi menjadi mekanisme
              yang memperkuat jaringan eksklusif antarsekolah, di mana siswa dari sekolah mitra atau
              berprestasi mendapatkan prioritas, sementara siswa dari sekolah yang kurang terhubung
              atau kurang mendapat informasi tertinggal. {namaSekolahUppercase} perlu memastikan
              bahwa kriteria rekomendasi diterapkan secara konsisten dan terbuka, dengan fokus pada
              meritokrasi rather than network-based selection.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Dari perspektif institusi, PPDB gelombang pertama juga memiliki fungsi strategis dalam
              perencanaan kapasitas dan alokasi sumber daya. Jumlah siswa yang diterima pada
              gelombang ini akan menentukan kebutuhan ruang kelas, peralatan praktikum, jumlah guru
              pembimbing, dan anggaran operasional untuk tahun ajaran yang akan datang. Sebuah
              sistem PPDB yang terintegrasi dengan sistem informasi manajemen sekolah memungkinkan
              perencanaan yang lebih akurat dan responsif. Namun, perencanaan ini juga harus
              mempertimbangkan dinamika pendaftaran pada gelombang berikutnya—bagaimana memastikan
              bahwa kuota yang dialokasikan pada gelombang pertama tidak mengurangi kesempatan bagi
              calon siswa berkualitas yang baru mengetahui informasi atau baru memenuhi persyaratan
              pada gelombang kedua. Keseimbangan antara eksklusivitas gelombang awal dan
              inklusivitas gelombang lanjutan menjadi tantangan tersendiri dalam desain kebijakan
              penerimaan.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Lebih jauh lagi, PPDB dapat dipandang sebagai momen komunikasi publik yang penting
              bagi sekolah. Cara sekolah menyampaikan informasi, merespons pertanyaan, dan menangani
              keluhan selama proses pendaftaran membentuk citra institusi di mata publik—termasuk
              orang tua, calon siswa, dan stakeholder lainnya. Sebuah proses PPDB yang transparan,
              responsif, dan adil membangun "trust capital" yang menjadi fondasi bagi kerja sama dan
              dukungan masyarakat di masa depan. Sebaliknya, proses yang dianggap tidak transparan,
              lambat, atau diskriminatif dapat merusak reputasi sekolah dan mengurangi daya tariknya
              di tahun-tahun berikutnya. Dalam era digital, di mana informasi dan pengalaman dapat
              dengan cepat disebarkan melalui media sosial, pengelolaan reputasi selama PPDB menjadi
              semakin krusial. Satu kasus penanganan keluhan yang buruk dapat memiliki efek riil
              yang jauh melampaui individu yang terlibat langsung.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Refleksi atas pembukaan PPDB ini mengarahkan kita pada pertanyaan fundamental mengenai
              tujuan pendidikan vokasi itu sendiri. Jika tujuannya adalah mempersiapkan tenaga kerja
              yang terampil dan berdaya saing, maka proses seleksi awal harus dirancang untuk
              mengidentifikasi bukan hanya kemampuan akademik dasar, melainkan juga minat, motivasi,
              dan potensi kewirausahaan calon siswa. Seorang siswa dengan nilai rapor yang memenuhi
              syarat namun tanpa minat yang kuat pada bidang keahlian yang dipilihnya, berpotensi
              menjadi lulusan yang kompeten secara teknis namun tidak terlibat secara emosional dan
              intelektual dalam pekerjaannya. Oleh karena itu, pertimbangan untuk mengembangkan
              mekanisme seleksi yang lebih holistik—yang mencakup asesmen minat bakat, wawancara
              motivasi, atau bahkan proyek mini yang menggali potensi kreatif calon siswa—dapat
              menjadi arah pengembangan PPDB yang lebih matang. Jika {namaSekolahUppercase} berani
              melangkah ke arah ini, maka PPDB gelombang pertama tahun ajaran 2026/2027 tidak akan
              tercatat hanya sebagai pembukaan pendaftaran biasa, melainkan sebagai titik tolak bagi
              inovasi dalam cara sekolah membangun komunitas pembelajarnya dari fondasi yang paling
              fundamental: proses pemilihan anggotanya.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
                FOOTER
      ════════════════════════════════════════ */}
      <ProgramFooter onNavigate={onNavigate} />
    </div>
  );
}
