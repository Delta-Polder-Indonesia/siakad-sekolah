import { useState } from 'react';
import type { PageProps } from '../../types';
import ProgramFooter from '../../../../layout/ProgramFooter';
import { useBackNavigation } from '../../context/NavigationContext';
import { useToast } from '../../../../components/ui';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Berita03Page({ onNavigate }: PageProps) {
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
                className="h-full w-full object-cover"  loading="lazy" decoding="async" />
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
            src={`${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.webp`}
            alt="Seminar Karir dan Beasiswa"
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
              Informasi
            </span>
            <time
              dateTime="2026-06-05"
              className="text-[10px] font-bold tracking-widest text-white/70 uppercase"
            >
              5 Juni 2026
            </time>
          </div>

          <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
            Seminar Karir dan Beasiswa untuk Siswa Kelas XII
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
            <time dateTime="2026-06-05">Jumat, 5 Juni 2026</time>
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
              Penyelenggaraan seminar karir dan beasiswa untuk siswa kelas XII oleh SMA NEGERI 1
              MEDAN merupakan sebuah intervensi pedagogis yang menyentuh titik krusial dalam siklus
              pendidikan vokasi—titik di mana siswa berdiri di ambang transisi dari dunia sekolah ke
              dunia kerja atau pendidikan tinggi. Dalam konteks ini, seminar tidak sekadar acara
              informatif yang menyampaikan daftar peluang atau prosedur aplikasi; ia berfungsi
              sebagai mekanisme "career scaffolding"—sebuah struktur pendukung yang membantu siswa
              membangun pemahaman sistematis tentang diri mereka, pasar kerja, dan ekosistem
              pendidikan lanjutan. Kehadiran narasumber dari kalangan praktisi industri dan
              perwakilan perguruan tinggi terkemuka menciptakan ruang dialog yang heterogen, di mana
              siswa tidak hanya menerima informasi satu arah, melainkan juga diajak untuk
              mengkonstruksi ulang pemahaman mereka melalui pertanyaan, diskusi, dan refleksi.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Dari perspektif psikologi perkembangan, siswa kelas XII berada pada fase "emerging
              adulthood"—periode di mana identitas vocational mulai mengkristal. Fase ini ditandai
              oleh eksplorasi berbagai kemungkinan, namun juga oleh ketidakpastian dan kecemasan
              terhadap masa depan. Seminar karir yang dirancang dengan baik berfungsi sebagai
              "holding environment"—sebuah ruang psikologis yang aman untuk menguji ide-ide,
              mengklarifikasi nilai-nilai, dan mempraktikkan pengambilan keputusan tanpa risiko
              konsekuensi riil. Ketika siswa berinteraksi dengan narasumber yang telah menempuh
              berbagai jalur karir, mereka secara tidak langsung terpapar pada narasi-narasi
              alternatif yang memperluas repertoar pilihan mereka. Narasi ini penting karena banyak
              siswa, terutama yang berasal dari latar belakang sosial-ekonomi terbatas, memiliki
              exposure yang sempit terhadap variasi jalur sukses yang mungkin mereka tempuh.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Tiga sesi utama yang dihadirkan dalam seminar—presentasi jalur karir di industri
              teknologi, sesi tanya jawab dengan perwakilan universitas, dan konsultasi beasiswa
              domestik maupun internasional—mencerminkan sebuah kurasi yang matang terhadap
              kebutuhan informasi siswa. Sesi pertama menangani dimensi "supply-side" dari pasar
              kerja: apa yang dibutuhkan industri, kompetensi apa yang paling bernilai, dan
              bagaimana tren teknologi akan membentuk ulang profesi-profesi yang ada. Sesi kedua
              mengarahkan perhatian pada dimensi "demand-side" dari pendidikan tinggi: program studi
              apa yang relevan, kriteria seleksi seperti apa yang berlaku, dan bagaimana kurikulum
              universitas diselaraskan dengan kebutuhan industri. Sesi ketiga, yang berfokus pada
              beasiswa, menambahkan dimensi akses dan ekuitas—menunjukkan bahwa keterbatasan
              finansial tidak harus menjadi penghalang bagi siswa berprestasi untuk melanjutkan
              pendidikan ke jenjang yang lebih tinggi atau bahkan ke luar negeri.
            </p>
          </div>

          {/* Pull Quote Korporat Menarik */}
          <blockquote className="my-8 border-l-4 border-blue-600 bg-slate-50 px-6 py-4 text-slate-800 italic md:text-lg">
            "Seminar karir berfungsi sebagai mekanisme career scaffolding—sebuah struktur pendukung
            yang membantu siswa membangun pemahaman sistematis tentang diri mereka, pasar kerja, dan
            ekosistem pendidikan lanjutan."
          </blockquote>

          <div>
            <p className="text-justify">
              Antusiasme siswa yang tinggi terhadap seluruh rangkaian acara mengindikasikan adanya
              "information gap" yang telah lama ada namun tidak terpenuhi oleh kurikulum reguler.
              Dalam sistem pendidikan yang berorientasi pada ujian nasional dan kompetensi teknis,
              ruang untuk pembekalan "career literacy"—kemampuan untuk memahami, menavigasi, dan
              mengelola karir sepanjang hayat—sering kali terabaikan. Siswa lulus dengan sertifikat
              keahlian, namun tanpa pemahaman yang cukup tentang bagaimana mengonversikan keahlian
              tersebut menjadi posisi kerja yang bermakna, atau bagaimana merancang jalur
              pengembangan diri yang berkelanjutan. Seminar ini, meskipun berlangsung hanya satu
              hari, mengisi "gap" tersebut dengan memberikan peta kognitif awal yang dapat siswa
              kembangkan secara mandiri di kemudian hari.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Lebih dari itu, kehadiran perwakilan dari perguruan tinggi terkemuka dan praktisi
              industri senior dalam satu forum yang sama menciptakan sebuah ekosistem mikro yang
              jarang dijumpai siswa dalam keseharian mereka. Dalam konteks ini, siswa dapat
              mengamati langsung dinamika antara dunia akademik dan dunia industri—bagaimana teori
              yang dikembangkan di universitas diaplikasikan dan diuji di tempat kerja, serta
              bagaimana masalah praktis di industri menginformasikan arah riset dan pengembangan
              kurikulum di perguruan tinggi. Pemahaman terhadap dinamika ini membantu siswa memilih
              jalur pendidikan lanjutan yang tidak hanya berbasis pada reputasi institusi atau
              popularitas program studi, melainkan pada kesesuaian antara minat pribadi, kekuatan
              kompetitif, dan tren perkembangan ilmu atau industri terkait.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Dari perspektif institusi pendidikan, penyelenggaraan seminar semacam ini merupakan
              investasi dalam "alumni capital"—modal sosial yang terbentuk dari jaringan lulusan
              yang sukses dan terhubung dengan sekolah. Siswa yang mendapatkan arahan karir yang
              baik dan berhasil menempuh jalur pendidikan atau pekerjaan yang sesuai dengan
              potensinya, memiliki probabilitas lebih tinggi untuk menjadi ambassador sekolah,
              mentor bagi generasi berikutnya, atau bahkan mitra industri yang dapat membuka peluang
              PKL dan kerja sama untuk adik kelas. Dengan kata lain, seminar ini bukan hanya
              berorientasi pada output jangka pendek (siswa kelas XII yang siap lulus), melainkan
              juga pada outcome jangka panjang berupa pembentukan ekosistem alumni yang saling
              menguatkan dan berkontribusi pada reputasi serta daya tarik sekolah.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Namun, refleksi kritis mengharuskan kita untuk tidak terjebak dalam euforia
              keberhasilan acara dan mengabaikan pertanyaan-pertanyaan fundamental. Apakah satu hari
              seminar cukup untuk mengubah mindset dan kompetensi "career planning" siswa, ataukah
              diperlukan program bimbingan yang lebih berkelanjutan sepanjang semester? Apakah
              informasi yang disampaikan oleh narasumber dapat diakses kembali oleh siswa setelah
              acara selesai, ataukah ia terlupakan begitu siswa kembali ke rutinitas harian?
              Bagaimana sekolah memastikan bahwa siswa yang lebih pendiam atau kurang percaya diri
              juga mendapatkan kesempatan untuk berkonsultasi secara personal, tidak hanya siswa
              yang aktif dalam sesi tanya jawab publik? Pertanyaan-pertanyaan ini menunjukkan bahwa
              seminar karir, meskipun merupakan langkah yang sangat berharga, hanyalah satu komponen
              dalam sebuah sistem bimbingan karir yang komprehensif dan berkelanjutan.
            </p>
          </div>

          <div>
            <p className="text-justify">
              Pada tataran yang lebih luas, seminar ini juga mengisyaratkan pergeseran paradigma
              dalam pendidikan vokasi Indonesia—dari orientasi pada penyiapan tenaga kerja
              operasional menuju orientasi pada pengembangan talenta yang adaptif, kreatif, dan
              mampu menavigasi kompleksitas karir di era disrupsi. Dalam konteks globalisasi dan
              revolusi industri 4.0, karir tidak lagi bersifat linear dan prediktabil; seseorang
              mungkin mengalami beberapa kali transisi karir, membangun portofolio pekerjaan yang
              beragam, atau bahkan menciptakan lapangan kerja sendiri melalui kewirausahaan. Seminar
              yang memperkenalkan siswa pada berbagai jalur—termasuk jalur yang tidak
              konvensional—membantu membentuk "career resilience" yang esensial dalam menghadapi
              ketidakpastian. Jika {namaSekolahUppercase} dapat mempertahankan dan mengembangkan
              inisiatif ini menjadi program bimbingan karir yang terintegrasi dalam kurikulum, maka
              seminar satu hari ini akan tercatat sebagai fondasi bagi sebuah tradisi sekolah yang
              tidak hanya menghasilkan lulusan yang terampil, melainkan juga lulusan yang siap,
              percaya diri, dan visioner dalam merancang masa depannya sendiri.
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
