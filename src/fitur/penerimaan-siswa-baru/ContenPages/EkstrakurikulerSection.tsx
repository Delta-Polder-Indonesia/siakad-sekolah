import React from 'react';

type EkskulKey =
  | 'olahraga'
  | 'beladiri'
  | 'kerohanian'
  | 'keorganisasian'
  | 'saintek'
  | 'debat'
  | 'musik'
  | 'jurnalistik';

type EkskulCategory = {
  name: string;
  key: EkskulKey;
  iconSrc: string;
};

// Menggunakan import.meta.env.BASE_URL agar path gambar valid saat di-deploy ke GitHub Pages
const ekskulCategories: EkskulCategory[] = [
  {
    name: 'Olahraga',
    key: 'olahraga',
    iconSrc: `${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconSiswaBaru/sports.svg`,
  },
  {
    name: 'Beladiri',
    key: 'beladiri',
    iconSrc: `${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconSiswaBaru/martial-arts.svg`,
  },
  {
    name: 'Kerohanian',
    key: 'kerohanian',
    iconSrc: `${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconSiswaBaru/pray.svg`,
  },
  {
    name: 'Keorganisasian',
    key: 'keorganisasian',
    iconSrc: `${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconSiswaBaru/management.svg`,
  },
  {
    name: 'Sains dan Teknologi',
    key: 'saintek',
    iconSrc: `${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconSiswaBaru/innovation.svg`,
  },
  {
    name: 'Debat dan Bahasa',
    key: 'debat',
    iconSrc: `${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconSiswaBaru/debate.svg`,
  },
  {
    name: 'Musik dan Sastra',
    key: 'musik',
    iconSrc: `${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconSiswaBaru/arts.svg`,
  },
  {
    name: 'Pers dan Jurnalistik',
    key: 'jurnalistik',
    iconSrc: `${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconSiswaBaru/journalist.svg`,
  },
];

type EkstrakurikulerSectionProps = {
  onOpenEkskul: (key: EkskulKey) => void;
};

export default function EkstrakurikulerSection({ onOpenEkskul }: EkstrakurikulerSectionProps) {
  const col1 = ekskulCategories.slice(0, 4);
  const col2 = ekskulCategories.slice(4, 8);

  return (
    <section
      id="section-campus-life-ukm"
      className="relative mt-10 overflow-hidden rounded-2xl bg-[#0d6e38] px-4 py-10 text-white shadow-md sm:px-8 sm:py-16"
    >
      {/* Background Ornament Pattern dengan Inline Style untuk BASE_URL */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full bg-contain opacity-30"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}images/compressed/icons/ornaments/usu-pattern.svg')`,
        }}
      />

      <img
        src={`${import.meta.env.BASE_URL}images/HalamanKami/Beranda/IconSiswaBaru/ukm-climbing.png`}
        alt="Aktivitas Ekstrakurikuler"
        className="pointer-events-none absolute top-0 right-0 h-full object-cover opacity-10 max-lg:w-[320px] md:opacity-100"
      />

      <div className="relative z-10 grid gap-8 lg:grid-cols-2 2xl:gap-16">
        {/* Kolom Kiri */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white">
            <span className="text-3xl font-bold sm:text-[40px]">
              <span className="text-white">40</span>
              <span className="text-amber-400">+</span>
            </span>
            <span className="text-xl font-normal text-white">
              Kegiatan Ekstrakurikuler &amp; Organisasi
            </span>
          </div>

          <p className="w-full text-xs leading-5 font-normal text-white sm:text-sm sm:leading-[22px] md:w-[85%] lg:w-full">
            Sekolah kami menawarkan berbagai wadah kegiatan bagi siswa untuk beraktivitas dan
            belajar lebih banyak di luar kelas. Memfasilitasi hobi dan minat siswa dalam berbagai
            bidang.
          </p>

          <p className="w-full text-xs leading-5 font-normal text-white sm:text-sm sm:leading-[22px] md:w-[85%] lg:w-full">
            Kegiatan ekstrakurikuler juga memberikan kesempatan bagi siswa untuk berpartisipasi
            dalam berbagai acara dan kompetisi sembari memperluas jaringan personal mereka.
          </p>
        </div>

        {/* Kolom Kanan */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Kolom 1 */}
              <div className="flex flex-col">
                {col1.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onOpenEkskul(item.key)}
                    className="mb-4 flex max-h-16 items-center gap-4 rounded-xl bg-white/10 p-4 text-left backdrop-blur-sm transition-all hover:bg-[#0a5229]"
                  >
                    <img
                      alt={item.name}
                      loading="lazy"
                      width="28"
                      height="28"
                      className="h-5 w-5 lg:h-7 lg:w-7"
                      src={item.iconSrc}
                    />
                    <span className="text-xs leading-4 font-medium text-white sm:text-sm">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Kolom 2 */}
              <div className="flex flex-col">
                {col2.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onOpenEkskul(item.key)}
                    className="mb-4 flex max-h-16 items-center gap-4 rounded-xl bg-white/10 p-4 text-left backdrop-blur-sm transition-all hover:bg-[#0a5229]"
                  >
                    <img
                      alt={item.name}
                      loading="lazy"
                      width="28"
                      height="28"
                      className="h-5 w-5 lg:h-7 lg:w-7"
                      src={item.iconSrc}
                    />
                    <span className="text-xs leading-4 font-medium text-white sm:text-sm">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { EkskulKey };
