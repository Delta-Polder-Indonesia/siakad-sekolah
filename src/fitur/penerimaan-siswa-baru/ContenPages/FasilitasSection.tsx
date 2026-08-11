import { useEffect, useRef, useState } from 'react';

type FasilitasKey = 'umum' | 'kesehatan' | 'olahraga' | 'disabilitas' | 'selengkapnya';

type FacilityItem = {
  name: string;
  key: FasilitasKey;
  imageSrc: string;
};

const fasilitasList: FacilityItem[] = [
  {
    name: 'Fasilitas Umum',
    key: 'umum',
    imageSrc: 'images/compressed/fasilitas/auditorium.webp',
  },
  {
    name: 'Fasilitas Kesehatan',
    key: 'kesehatan',
    imageSrc: 'images/compressed/fasilitas/rs.webp',
  },
  {
    name: 'Fasilitas Olahraga',
    key: 'olahraga',
    imageSrc: 'images/compressed/fasilitas/gym.webp',
  },
  {
    name: 'Fasilitas Disabilitas',
    key: 'disabilitas',
    imageSrc: 'images/compressed/fasilitas/disability-counter.webp',
  },
];

function ArrowTopRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 256 256"
      className="h-4 w-4"
    >
      <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 256 256"
      className="h-6 w-6 text-white"
    >
      <path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 256 256"
      className="h-6 w-6 text-white"
    >
      <path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" />
    </svg>
  );
}

type FasilitasSectionProps = {
  onOpenFasilitas: (key: FasilitasKey) => void;
};

export default function FasilitasSection({ onOpenFasilitas }: FasilitasSectionProps) {
  const baseUrl = import.meta.env.BASE_URL;
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = sliderRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 1);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scrollByAmount = 320;

  const handlePrev = () => {
    sliderRef.current?.scrollBy({
      left: -scrollByAmount,
      behavior: 'smooth',
    });
  };

  const handleNext = () => {
    sliderRef.current?.scrollBy({
      left: scrollByAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative mt-10 px-0 lg:px-4 xl:px-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_324px] lg:gap-16">
        {/* KIRI - SLIDER */}
        <div className="order-2 min-w-0 lg:order-1">
          <div className="relative w-full">
            <div className="overflow-hidden py-8 pl-4 sm:pl-8 lg:py-10 lg:pl-0">
              <div
                ref={sliderRef}
                className="flex gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {fasilitasList.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onOpenFasilitas(item.key)}
                    className="group relative h-[320px] w-[291px] flex-none overflow-hidden rounded-3xl text-left focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
                  >
                    {/* Gambar */}
                    <div className="absolute inset-0">
                      <img
                        src={`${baseUrl}${item.imageSrc}`}
                        alt={item.name}
                        className="h-full w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"  loading="lazy" decoding="async" />
                    </div>

                    {/* Overlay default putih */}
                    <div className="absolute inset-0 z-[2] flex items-end p-4 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
                      <span className="relative z-[1] flex w-full items-center justify-between gap-2 text-sm font-semibold text-green-600 sm:text-base">
                        <span>{item.name}</span>
                        <span className="rounded-xl p-3 text-slate-900 transition hover:bg-white">
                          <ArrowTopRightIcon />
                        </span>
                      </span>
                    </div>

                    {/* Overlay hover hijau */}
                    <div className="absolute inset-0 z-[2] flex items-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#038A47] via-[#43AD35]/50 to-transparent" />
                      <span className="relative z-[1] flex w-full items-center justify-between gap-2 text-sm font-semibold text-white sm:text-base">
                        <span>{item.name}</span>
                        <span className="rounded-xl p-3 transition hover:bg-white hover:text-green-600">
                          <ArrowTopRightIcon />
                        </span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tombol navigasi */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canScrollLeft}
              aria-label="Previous Slide"
              className={`absolute top-1/2 left-0 z-10 -translate-y-1/2 px-2 py-6 transition ${
                canScrollLeft ? 'bg-gradient-to-r from-black/50 to-transparent' : 'invisible'
              }`}
            >
              <ArrowLeftIcon />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canScrollRight}
              aria-label="Next Slide"
              className={`absolute top-1/2 right-0 z-10 -translate-y-1/2 px-2 py-6 transition ${
                canScrollRight ? 'bg-gradient-to-l from-black/50 to-transparent' : 'invisible'
              }`}
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        {/* KANAN - DESKRIPSI */}
        <div className="order-1 overflow-hidden px-4 pt-6 sm:px-8 sm:pt-10 lg:order-2 lg:w-[324px] lg:px-0 lg:pt-0">
          <div className="flex items-center gap-3">
            <img
              src="https://konten.usu.ac.id/storage/satker/0/icons/flower-sec2.svg"
              alt="Ornamen Fasilitas Kampus"
              width={32}
              height={32}
              className="h-8 w-8"  loading="lazy" decoding="async" />
            <h2 className="text-2xl font-bold text-slate-900">Fasilitas Kampus</h2>
          </div>

          <p className="my-4 text-xs leading-5 text-slate-800 sm:text-sm sm:leading-6 lg:my-6">
            Universitas Sumatera Utara (USU) menyediakan berbagai fasilitas yang dapat digunakan,
            terutama oleh mahasiswa dan civitas akademik, guna menunjang kegiatan belajar dan
            sebagai sarana pendukung berbagai kegiatan nonakademik.
          </p>

          <button
            type="button"
            onClick={() => onOpenFasilitas('selengkapnya')}
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-green-600 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 hover:text-green-600 hover:shadow-md"
          >
            <span>Cari Tahu Selengkapnya tentang Fasilitas</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export type { FasilitasKey };
