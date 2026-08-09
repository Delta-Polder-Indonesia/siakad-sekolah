import { useState, useEffect, useCallback, useRef } from 'react';
import { namaSekolah } from './dataSekolah';

type TimelineItem = {
  periode: string;
  judul: string;
  deskripsi: string[];
  gambar: string;
};

const timelineData: TimelineItem[] = [
  {
    periode: '1957 – 1967',
    judul: 'Perjalanan 1957 – 1967',
    deskripsi: [
      `${namaSekolah} didirikan pada era awal pembangunan pendidikan nasional pasca-kemerdekaan. Sejarah mencatat bahwa eksistensi sekolah ini dibangun sejak sekitar tahun 1950-an, ketika Pemerintah Republik Indonesia menunjuk Angkatan Darat yang kemudian mendirikan PT Eksploitasi Tambang Minyak Sumatera Utara untuk mengelola ladang minyak di wilayah Sumatera. Kemudian perusahaan tersebut berubah nama menjadi PT Perusahaan Minyak Nasional, disingkat PERMINA, pada tanggal 10 Desember 1957 yang hingga kini diperingati sebagai hari lahirnya Pertamina.`,
      'Selama dekade pertama, sekolah memperkokoh eksistensinya sebagai satu-satunya institusi pendidikan unggulan yang mengejawantahkan semangat mencerdaskan kehidupan bangsa sesuai amanat UUD 1945.',
    ],
    gambar: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-1.webp`,
  },
  {
    periode: '1968 – 1977',
    judul: 'Perjalanan 1968 – 1977',
    deskripsi: [
      'Melaksanakan adaptasi kurikulum nasional dan memperkokoh eksistensi sebagai institusi pendidikan unggulan. Memasuki dekade kedua, sekolah memaksimalkan pertumbuhan operasional dan memberikan kontribusi nyata pada pembangunan sumber daya manusia di Sumatera Utara.',
      'Pembangunan gedung baru dan laboratorium sains menjadi prioritas utama dalam pengembangan fasilitas pendidikan yang modern dan representatif.',
    ],
    gambar: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-2.webp`,
  },
  {
    periode: '1978 – 1987',
    judul: 'Perjalanan 1978 – 1987',
    deskripsi: [
      'Berhasil meraih status akreditasi A dan memperkenalkan laboratorium komputer pertama di kota Medan. Pencapaian ini menjadi tonggak penting yang menempatkan sekolah sebagai pelopor modernisasi pendidikan di Sumatera Utara.',
      'Pengembangan program ekstrakurikuler yang komprehensif turut memperkuat karakter dan kompetensi siswa di luar kegiatan akademik formal.',
    ],
    gambar: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-3.webp`,
  },
  {
    periode: '1988 – 1997',
    judul: 'Perjalanan 1988 – 1997',
    deskripsi: [
      'Menerapkan sistem manajemen mutu pendidikan dan mengembangkan program ekstrakurikuler unggulan. Pada periode ini sekolah mulai menjalin kerja sama dengan berbagai institusi dan dunia usaha untuk memperluas wawasan peserta didik.',
      'Penguatan kualitas pembelajaran secara menyeluruh dilakukan melalui peningkatan kompetensi tenaga pendidik dan pembaruan kurikulum yang responsif terhadap kebutuhan zaman.',
    ],
    gambar: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-4.jpg`,
  },
  {
    periode: '1998 – 2007',
    judul: 'Perjalanan 1998 – 2007',
    deskripsi: [
      'Ditetapkan sebagai Sekolah Adiwiyata tingkat nasional dan meluncurkan sistem informasi akademik daring pertama. Transformasi digital mulai dirintis sebagai bagian dari modernisasi layanan pendidikan kepada peserta didik dan orang tua.',
      'Peluncuran sistem informasi akademik daring menjadi langkah strategis menuju penyelenggaraan pendidikan yang transparan, akuntabel, dan berbasis teknologi informasi.',
    ],
    gambar: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-5.webp`,
  },
  {
    periode: '2008 – 2023',
    judul: 'Perjalanan 2008 – 2023',
    deskripsi: [
      'Menyelenggarakan pembelajaran jarak jauh dan transformasi digital menyeluruh. Sekolah terus berinovasi dalam menghadapi tantangan era baru, termasuk adaptasi cepat selama masa pandemi global yang menuntut fleksibilitas tinggi dalam proses belajar mengajar.',
      'Peluncuran portal informasi terpadu serta penguatan implementasi Kurikulum Merdeka secara komprehensif menjadi wujud nyata komitmen sekolah dalam mencetak generasi yang adaptif, kreatif, dan berdaya saing global.',
    ],
    gambar: `${import.meta.env.BASE_URL}images/Dashboard/Konoha-6.webp`,
  },
];

const AUTOPLAY_DURATION = 20000;

export default function TonggakSejarah() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  const rafId = useRef<number | null>(null);

  // ── Autoplay + animasi progress bar (Optimized RAF & Race Condition Safe) ──
  useEffect(() => {
    setIsTransitioning(false);

    rafId.current = requestAnimationFrame(() => {
      setIsTransitioning(true);
    });

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setActiveIndex((prev) => (prev + 1) % timelineData.length);
    }, AUTOPLAY_DURATION);

    return () => {
      clearTimeout(timer);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [activeIndex]);

  // ── Fade teks saat ganti slide ──
  useEffect(() => {
    let isMounted = true;
    setTextVisible(false);

    const timeout = setTimeout(() => {
      if (isMounted) {
        setVisibleIndex(activeIndex);
        setTextVisible(true);
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [activeIndex]);

  // ── Klik manual: reset dulu, baru pindah ──
  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setIsTransitioning(false);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  const visibleItem = timelineData[visibleIndex];

  return (
    <div className="bg-white font-serif">
      {/* ===================================================== */}
      {/* JUDUL SECTION                                         */}
      {/* ===================================================== */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-4 md:px-12 md:pt-10">
        <h2 className="text-3xl leading-normal font-bold text-slate-900 md:text-[38px]">
          Tonggak Sejarah
        </h2>
        <p className="mt-4 max-w-[840px] text-sm leading-relaxed font-normal text-slate-700 md:text-base">
          Telusuri perjalanan panjang {namaSekolah} yang menjadi fondasi kokoh bagi penyelenggaraan
          pendidikan berkualitas, pembentukan karakter, dan pengembangan sumber daya manusia yang
          berdaya saing tinggi.
        </p>
      </div>

      {/* ===================================================== */}
      {/* FULL-WIDTH TIMELINE SLIDER                            */}
      {/* ===================================================== */}
      <section className="relative min-h-[500px] w-full overflow-hidden md:min-h-[580px] lg:min-h-[640px]">
        {/* ── Background Images — fade transition ── */}
        {timelineData.map((item, index) => (
          <div
            key={item.periode}
            aria-hidden={index !== activeIndex}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? 'z-[1] opacity-100' : 'z-0 opacity-0'
            }`}
          >
            <img
              src={item.gambar}
              alt={`Foto dokumentasi periode ${item.periode}`}
              className="absolute inset-0 h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
            {/* Dark overlay */}
            <div className="pointer-events-none absolute inset-0 bg-black/60" />
          </div>
        ))}

        {/* ── Content Container ── */}
        <div className="relative z-10 flex min-h-[500px] flex-col md:min-h-[580px] lg:min-h-[640px]">
          {/* ── TAB NAVIGATION ── */}
          <div className="absolute top-5 right-0 left-0 z-20">
            <div
              role="tablist"
              aria-label="Pilih periode sejarah"
              className={[
                'mx-auto flex',
                'max-w-[960px] xl:max-w-[1280px]',
                'space-x-2',
                'px-8 md:px-10 lg:px-4 xl:px-0',
                'overflow-x-auto',
                'max-xl:[scrollbar-width:none]',
                'max-xl:[&::-webkit-scrollbar]:hidden',
              ].join(' ')}
            >
              {timelineData.map((tabItem, tabIndex) => {
                const isActive = tabIndex === activeIndex;

                return (
                  <button
                    key={tabItem.periode}
                    type="button"
                    role="tab"
                    onClick={() => goToSlide(tabIndex)}
                    aria-selected={isActive}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Lihat periode ${tabItem.periode}`}
                    className={[
                      'group relative flex flex-1 flex-shrink-0',
                      'min-w-[120px] cursor-pointer',
                      'py-2 md:py-4',
                      'text-xs font-medium md:text-sm',
                      'transition-all duration-300',
                      isActive ? 'text-white' : 'text-white/50',
                    ].join(' ')}
                  >
                    {/* Dot + Label */}
                    <div className="flex items-center gap-1 md:gap-2">
                      <svg
                        className={[
                          'h-2 w-2 flex-shrink-0 md:h-3 md:w-3',
                          'transition-all duration-300',
                          isActive
                            ? 'text-red-600 opacity-100'
                            : 'text-white opacity-10 group-hover:opacity-100',
                        ].join(' ')}
                        viewBox="0 0 8 8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <circle cx="4" cy="4" r="4" />
                      </svg>

                      <span
                        className={[
                          'whitespace-nowrap transition-all duration-300',
                          isActive ? 'text-white' : 'text-white/50 group-hover:text-white',
                        ].join(' ')}
                      >
                        {tabItem.periode}
                      </span>
                    </div>

                    {/* Garis putih dasar — selalu ada per bullet */}
                    <span className="absolute right-0 bottom-0 left-0 border-b-[3px] border-white/30" />

                    {/* Progress merah — hanya bullet aktif */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 z-10 border-b-[3px] border-red-600"
                        style={{
                          width: isTransitioning ? '100%' : '0%',
                          transition: isTransitioning
                            ? `width ${AUTOPLAY_DURATION}ms linear`
                            : 'none',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── TEXT CONTENT — BOTTOM LEFT dengan fade ── */}
          <div className="mx-auto mt-auto w-full max-w-[960px] px-6 pt-24 pb-10 md:px-8 md:pb-14 xl:max-w-[1280px] xl:px-0 xl:pb-16">
            <div
              className="max-w-[840px] transition-opacity duration-300 ease-in-out"
              style={{ opacity: textVisible ? 1 : 0 }}
            >
              <h3 className="mb-4 text-3xl font-semibold text-white md:text-4xl">
                {visibleItem.judul}
              </h3>

              {visibleItem.deskripsi.map((paragraf, idx) => (
                <p key={idx} className="mb-3 text-sm leading-relaxed text-white/90 md:text-base">
                  {paragraf}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* ARTIKEL SEJARAH SINGKAT                               */}
      {/* ===================================================== */}
      <section className="mx-auto max-w-[1024px] px-6 pt-12 pb-12 md:px-8 md:pt-16 md:pb-16 xl:px-0 xl:pt-24 xl:pb-16">
        <article className="text-[15px] leading-relaxed text-slate-800">
          <h3 className="mb-6 text-left text-2xl font-bold text-slate-900 md:text-[26px]">
            Sejarah Singkat {namaSekolah}
          </h3>

          <p className="mb-4 text-justify">
            {namaSekolah} sebelumnya merupakan sekolah swasta yang bernama SMA Dharma Bakti yang
            didirikan sejak tahun 1957 dan bernaung di bawah Yayasan Pendidikan Dharma Bakti.
          </p>

          <p className="mb-4 text-justify">
            Perubahan status menjadi sekolah negeri berdasarkan Keputusan Walikota Medan Nomor: 133
            Tahun 1967 tanggal 7 April 1967 tentang perubahan status SMA Dharma Bakti menjadi SMA
            Negeri 1 Medan. Sampai saat ini {namaSekolah} telah berusia lebih dari enam dekade dalam
            mengabdi kepada dunia pendidikan.
          </p>

          <p className="mb-4 text-justify">
            Dengan senantiasa terus ingin meningkatkan Mutu Pelayanan Pendidikan kepada peserta
            didik sebagai bentuk pengabdian diri untuk mencerdaskan anak bangsa,{' '}
            <strong>"SMANSA"</strong> akan selalu berbenah diri. Pencapaian peningkatan layanan
            pendidikan ini ditandai dengan diterimanya Piagam Penghargaan dari Menteri Pendidikan
            dan Kebudayaan kepada {namaSekolah} sebagai sekolah dengan Indeks Integritas
            Penyelenggaraan Ujian Nasional yang tinggi pada tahun 2015 dan 2016. Pada tahun 2017 SMA
            Negeri 1 Medan ditetapkan sebagai sekolah Adiwiyata tingkat kota, dan mempersiapkan diri
            untuk menjadi sekolah Adiwiyata tingkat provinsi.
          </p>

          <p className="text-justify">
            {namaSekolah} dalam upaya untuk mencerdaskan anak bangsa bermotto pada:{' '}
            <strong>"be Religius, be Smart and be Fun"</strong> yang dibingkai oleh akhlak mulia dan
            berkepribadian luhur.
          </p>
        </article>
      </section>
    </div>
  );
}
