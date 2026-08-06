import React from 'react';
import { namaSekolahUppercase } from '../../components/Profile/dataSekolah';

export interface ProgramPendidikanItem {
  id: string;
  title: string;
  description: string;
  link: string;
  iconSrc: string;
  bgImageSrc: string;
}

export interface PendidikanSectionProps {
  onNavigate?: (path: string) => void;
  customPrograms?: ProgramPendidikanItem[];
}

const DEFAULT_PROGRAMS: ProgramPendidikanItem[] = [
  {
    id: 'mipa',
    title: 'Rekayasa Perangkat Lunak',
    description:
      'Membekali siswa dengan keterampilan pemrograman, pengembangan aplikasi web dan mobile, database management, serta persiapan sertifikasi kompetensi bidang teknologi informasi.',
    link: 'reg-01',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/burger-sec.svg',
    bgImageSrc: '/images/compressed/fakultas/vokasi-bg.webp',
  },
  {
    id: 'ips',
    title: 'Teknik Komputer dan Jaringan',
    description:
      'Fokus pada instalasi, konfigurasi, dan pemeliharaan jaringan komputer, sistem keamanan jaringan, serta troubleshooting perangkat keras dan lunak.',
    link: 'reg-02',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/circle-pri.svg',
    bgImageSrc: '/images/compressed/fakultas/sarjana-bg.webp',
  },
  {
    id: 'bahasa',
    title: 'Program Bahasa & Sastra',
    description:
      'Mendalami literasi, komunikasi lintas budaya, dan penguasaan bahasa asing guna mempersiapkan lulusan berdaya saing global.',
    link: 'reg-03',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/flower-ora.svg',
    bgImageSrc: '/images/compressed/fakultas/profesi-bg.webp',
  },
  {
    id: 'ekstrakurikuler',
    title: 'Pengembangan Bakat & Ekskul',
    description:
      'Wadah pembentukan karakter melalui bidang seni, olahraga, pramuka, olimpiade sains, dan organisasi kesiswaan yang aktif.',
    link: 'reg-04',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/pixel-sec2.svg',
    bgImageSrc: '/images/compressed/fakultas/magister-bg.webp',
  },
  {
    id: 'olimpiade',
    title: 'Kelas Pembinaan Prestasi',
    description:
      'Program intensif persiapan OSN, kompetisi akademik nasional, dan internasional untuk mencetak lulusan unggulan berkualitas.',
    link: 'reg-05',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/plusx-sec2.svg',
    bgImageSrc: '/images/compressed/fakultas/program-pendidikan-headline.webp',
  },
  {
    id: 'alumni',
    title: 'Bimbingan Karir & PTN',
    description:
      'Pendampingan terstruktur untuk sukses menembus Perguruan Tinggi Negeri (PTN) favorit dan kampus ternama internasional.',
    link: 'reg-06',
    iconSrc: 'images/HalamanKami/Beranda/IconConten/stripe-pri.svg',
    bgImageSrc: '/images/compressed/fakultas/internasional-bg.webp',
  },
];

export default function PendidikanSection({
  onNavigate,
  customPrograms = DEFAULT_PROGRAMS,
}: PendidikanSectionProps) {
  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(link);
    }
  };

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 max-md:mb-6 md:gap-12 lg:gap-16">
          <img
            alt={`Pendidikan ${namaSekolahUppercase}`}
            loading="lazy"
            width={300}
            height={400}
            decoding="async"
            className="h-auto w-[240px] object-contain max-md:hidden lg:w-[300px]"
            src="images/HalamanKami/Beranda/icon/kakak-pendidikan.png"
          />

          <div
            style={{
              ['--before-bg' as string]: `url(${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconConten/quote-start.svg)`,
            }}
            className="relative flex-1 before:absolute before:top-2 before:left-0 before:h-10 before:w-[56px] before:bg-[image:var(--before-bg)] before:bg-contain before:bg-no-repeat before:opacity-50 before:content-[''] after:absolute after:right-0 after:-bottom-4 after:h-10 after:w-[56px] after:bg-[url('https://konten.usu.ac.id/storage/satker/0/icons/quote-end.svg')] after:bg-contain after:bg-no-repeat after:opacity-50 after:content-[''] md:before:-top-[80px] md:before:h-16 md:before:w-[80px] md:after:-bottom-10 md:after:h-16 md:after:w-[80px]"
          >
            <div className="flex items-center justify-center sm:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center">
                  <img
                    alt={`${namaSekolahUppercase} ornamen dekoratif`}
                    loading="lazy"
                    width={32}
                    height={32}
                    decoding="async"
                    src="images/HalamanKami/Beranda/IconConten/flower-ora.svg"
                  />
                </div>
                <h2 className="sec-title tracking-tight text-slate-900">Pendidikan</h2>
              </div>
            </div>

            <p className="sec-subtitle mt-4 text-emerald-700 md:mt-8">
              Pendidikan adalah salah satu kunci terpenting bagi bangsa dan negara untuk bertahan
              dalam persaingan global dan merupakan bidang kesejahteraan nasional yang paling
              strategis.
            </p>

            <p className="sec-body mt-4 text-slate-800 md:mt-8">
              Sumber daya manusia (SDM) yang cerdas dan berkarakter merupakan prasyarat bagi
              pembangunan peradaban yang tinggi. {namaSekolahUppercase} berusaha memajukan SDM di
              Indonesia melalui pendidikan berkualitas guna menyejahterakan bangsa dan negara.
              Tersedia berbagai program akademis, pengembangan karakter, serta fasilitas pendukung
              yang dapat Anda pilih sesuai minat dan bakat untuk mendukung karier dan keahlian
              profesional Anda pada masa depan.
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-stretch gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:grid md:grid-cols-2 md:pb-0 lg:grid-cols-3">
          {customPrograms.map((program) => (
            <a
              key={program.id}
              href={program.link}
              onClick={(e) => handleCardClick(e, program.link)}
              style={{ ['--bg-image' as string]: `url('${program.bgImageSrc}')` }}
              className="group relative z-10 flex shrink-0 flex-col gap-3 rounded-lg border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-emerald-600 hover:bg-emerald-600 active:bg-emerald-800 max-md:w-[320px] md:gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  alt={`Icon ${program.title}`}
                  loading="lazy"
                  width={24}
                  height={24}
                  decoding="async"
                  src={program.iconSrc}
                  className="h-6 w-6 transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                />
                <span className="sec-card-title text-emerald-800 transition-colors group-hover:text-white">
                  {program.title}
                </span>
              </div>

              <p className="sec-card-body text-slate-600 transition-colors group-hover:text-white">
                {program.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
