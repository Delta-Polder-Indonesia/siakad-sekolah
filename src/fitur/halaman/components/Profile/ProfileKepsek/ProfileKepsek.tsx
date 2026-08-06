import { ArrowLeft } from 'lucide-react';
import { useBackNavigation } from '../../../context/NavigationContext';
import { namaSekolah, namaSekolahUppercase } from '../dataSekolah';

const FLOWER_SEC2 = 'https://konten.usu.ac.id/storage/satker/0/icons/flower-sec2.svg';
const FLOWER_BG = 'https://konten.usu.ac.id/storage/satker/44/icons/flower-bgpritra.svg';

interface RiwayatItem {
  title: string;
  place: string;
  desc: string;
  period: string;
}

const pendidikanItems: RiwayatItem[] = [
  {
    title: 'Sarjana Pendidikan',
    place: 'Universitas Negeri Medan',
    desc: 'Menyelesaikan pendidikan strata satu pada bidang keguruan dengan fokus pada pengelolaan pembelajaran.',
    period: '1994 - 1999',
  },
  {
    title: 'Magister Pendidikan',
    place: 'Universitas Negeri Medan',
    desc: 'Melanjutkan pendidikan magister untuk memperdalam kompetensi manajemen pendidikan dan kepemimpinan sekolah.',
    period: '2005 - 2008',
  },
  {
    title: 'Diklat Calon Kepala Sekolah',
    place: 'Balai Pengembangan Mutu Pendidikan',
    desc: 'Mengikuti pendidikan dan pelatihan calon kepala sekolah untuk meningkatkan kapasitas manajerial dan supervisi.',
    period: '2017',
  },
];

const riwayatItems: RiwayatItem[] = [
  {
    title: 'Guru Mata Pelajaran',
    place: 'SMA Negeri di Kota Medan',
    desc: 'Mengajar mata pelajaran sesuai bidang keahlian serta aktif membina kegiatan akademik dan non-akademik siswa.',
    period: '2000 - 2010',
  },
  {
    title: 'Wakil Kepala Sekolah',
    place: 'SMA Negeri di Kota Medan',
    desc: 'Membantu kepala sekolah dalam mengelola kurikulum, kesiswaan, dan sarana prasarana sekolah.',
    period: '2010 - 2018',
  },
  {
    title: 'Kepala Sekolah',
    place: `${namaSekolah}`,
    desc: `Memimpin ${namaSekolah} dalam mengembangkan mutu pembelajaran, budaya sekolah, serta prestasi siswa dan tenaga pendidik.`,
    period: '2018 - Sekarang',
  },
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-fit items-stretch">
    <div className="flex items-center bg-[#42ac35] p-1">
      <img src={FLOWER_SEC2} alt="" width={32} height={32} className="h-8 w-8" />
    </div>
    <h2 className="flex-1 bg-[#006633] px-4 py-2 text-xl leading-7 font-semibold text-white">
      {children}
    </h2>
  </div>
);

const RiwayatList = ({ items }: { items: RiwayatItem[] }) => (
  <div className="space-y-6 rounded-lg bg-[#F4F6F7] p-6">
    {items.map((item) => (
      <div className="flex flex-col" key={item.title}>
        <div className="flex flex-col gap-1 md:flex-row md:gap-8">
          <div className="flex-[70%]">
            <p className="text-sm leading-6 font-semibold text-green-500 xl:text-base">
              {item.title}
            </p>
            <p className="text-xs font-normal text-[#8292A1] xl:text-sm">{item.place}</p>
            <p className="text-xs leading-[1.3125rem] font-normal text-[#434343] xl:text-sm">
              {item.desc}
            </p>
          </div>
          <div className="py-2 md:py-0">
            <p className="text-xs leading-5 font-semibold text-green-500 xl:text-sm">
              {item.period}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ArrowRightSvg = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 256 256"
    className={className}
  >
    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
  </svg>
);

export default function ProfileKepsek() {
  const goBack = useBackNavigation();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white font-sans text-slate-900">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 flex h-14 items-center gap-3 bg-[#038A47] px-4 shadow-md lg:px-8">
        <button
          type="button"
          onClick={goBack}
          className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <span className="block text-base leading-none font-bold text-white">
            Profil Kepala Sekolah
          </span>
          <span className="text-[11px] text-white/70">{namaSekolahUppercase}</span>
        </div>
      </header>

      {/* ── BANNER ── */}
      <section className="relative flex h-[240px] items-center justify-center overflow-hidden bg-[linear-gradient(270deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] lg:h-[250px]">
        <div className="relative z-[2] mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-1 lg:gap-2">
            <h1 className="w-[80%] max-w-[740px] text-4xl leading-tight font-bold text-white xl:text-5xl">
              Kepala Sekolah
            </h1>
            <p className="text-sm leading-5 font-semibold text-[#FDC600]">{namaSekolah}</p>
          </div>
        </div>
      </section>

      {/* ── KONTEN ── */}
      <section className="bg-[#F8F8F8]">
        <div className="mx-auto flex max-w-7xl gap-10 bg-white px-4 py-10 md:px-8 xl:px-16">
          <div className="relative z-10 flex-1 space-y-10">
            {/* Kartu Foto + Info */}
            <div className="relative -mt-16 flex w-full flex-col items-center gap-4 px-4 md:-mt-20 md:flex-row md:items-start md:gap-8 md:px-0 xl:gap-12">
              {/* Kartu Foto */}
              <div className="relative z-10 flex max-w-[12.5rem] flex-col items-center rounded-lg bg-white px-4 pt-4 pb-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)]">
                <div className="relative rounded-lg p-0.5">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#8ABAA3] to-[#b0d1c1]" />
                  <div className="absolute inset-0.5 rounded-lg bg-white" />
                  <div className="relative h-[202px] w-[171px] overflow-hidden rounded-lg">
                    <img
                      src={`${import.meta.env.BASE_URL}images/GuruPegawai/kepala-sekolah.jpg`}
                      alt="Foto Kepala Sekolah"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = 'none';
                        if (t.parentElement) {
                          t.parentElement.textContent = '';
                          const fallback = document.createElement('div');
                          fallback.className =
                            'flex h-full w-full items-center justify-center text-xs font-medium text-slate-400';
                          fallback.textContent = 'Foto';
                          t.parentElement.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Kartu Info */}
              <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] md:max-h-[16.875rem] md:w-auto md:items-start md:justify-start md:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-0 bottom-0 z-[2] h-1/2 w-1/2 opacity-50"
                >
                  <img src={FLOWER_BG} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-1 md:items-start">
                  <p className="text-lg leading-[1.875rem] font-semibold text-[#006535] xl:text-xl">
                    Drs. H. Mulyono, M.Pd.
                  </p>
                  <p className="text-xs leading-5 font-normal text-[#4F5861] xl:text-sm">
                    Kepala {namaSekolah}
                  </p>
                </div>
                <p className="relative z-10 text-xs font-semibold text-[#4F5861] xl:text-sm">
                  Kepemimpinan {namaSekolahUppercase} 2018 - Sekarang
                </p>
                <div className="relative z-10 flex flex-col flex-wrap items-center gap-4 md:flex-row">
                  <div className="flex flex-col items-center gap-4 md:flex-[80%] md:flex-row">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="group ease flex h-fit w-fit items-center justify-center gap-2 rounded-md border border-solid border-green-100 bg-white px-4 py-2 transition duration-300 hover:bg-[#038A47]"
                    >
                      <p className="text-xs leading-[1.125rem] font-medium text-[#038A47] group-hover:text-white">
                        Pidato Kepala Sekolah
                      </p>
                      <ArrowRightSvg className="ease text-[#038A47] transition duration-300 group-hover:translate-x-1 group-hover:text-white" />
                    </a>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="group ease flex h-fit w-fit items-center justify-center gap-2 rounded-md border border-solid border-green-100 bg-white px-4 py-2 transition duration-300 hover:bg-[#038A47]"
                    >
                      <p className="text-xs leading-[1.125rem] font-medium text-[#038A47] group-hover:text-white">
                        Riwayat Karir
                      </p>
                      <ArrowRightSvg className="ease text-[#038A47] transition duration-300 group-hover:translate-x-1 group-hover:text-white" />
                    </a>
                  </div>
                  <div className="flex" />
                </div>
              </div>
            </div>

            {/* Teks */}
            <div className="flex flex-col gap-10">
              {/* Pengantar */}
              <p className="px-4 text-sm leading-6 text-green-500 xl:px-6 xl:text-base">
                {namaSekolah} dipimpin oleh Drs. H. Mulyono, M.Pd. yang telah berkomitmen membangun
                sekolah yang unggul dalam prestasi, berkarakter, dan berdaya saing. Isi paragraf
                pengantar tentang kepala sekolah dapat diperbarui sesuai dengan profil dan data yang
                sebenarnya.
              </p>

              {/* Pendidikan, Kursus, Organisasi */}
              <div className="flex flex-col gap-6 px-4 xl:px-6">
                <SectionHeading>Pendidikan, Kursus, Organisasi</SectionHeading>
                <RiwayatList items={pendidikanItems} />
              </div>

              {/* Menjadi Kepala Sekolah */}
              <div className="flex flex-col gap-6 px-4 xl:px-6">
                <SectionHeading>Menjadi Kepala {namaSekolah}</SectionHeading>
                <div className="space-y-6 rounded-lg bg-[#F4F6F7] p-6">
                  <p>
                    Perjalanan kepemimpinan Kepala {namaSekolah} dimulai dari pengabdian panjang
                    sebagai pendidik. Dengan pengalaman mengajar yang matang, beliau dipercaya
                    memegang peran strategis dalam pengelolaan sekolah sebelum akhirnya diangkat
                    menjadi Kepala Sekolah.
                  </p>
                  <p>
                    Sejak menjabat, beliau mendorong transformasi layanan pendidikan menjadi lebih
                    modern, transparan, dan berpihak pada kepentingan siswa. Berbagai program
                    unggulan dikembangkan untuk membentuk lulusan yang berkarakter dan siap
                    menghadapi tantangan masa depan.
                  </p>
                  <p>
                    Uraian narasi perjalanan kepala sekolah di bagian ini dapat diisi dengan kisah
                    dan data yang sebenarnya.
                  </p>
                </div>
              </div>

              {/* Riwayat Pekerjaan */}
              <div className="flex flex-col gap-6 px-4 xl:px-6">
                <SectionHeading>Riwayat Pekerjaan</SectionHeading>
                <RiwayatList items={riwayatItems} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
