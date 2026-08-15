'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useRafCallback } from '../../../hooks/useRafCallback';

type WisataKey = 'aksara' | 'katamso' | 'tjong' | 'museum' | 'avros' | 'lainnya';

type WisataItem = {
  title: string;
  key: WisataKey;
  imgSrc: string;
};

const wisataList: WisataItem[] = [
  {
    title: 'Aksara Park',
    key: 'aksara',
    imgSrc:
      'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/aksarapark_1.webp?w=3840&q=75',
  },
  {
    title: 'Katamso Land',
    key: 'katamso',
    imgSrc:
      'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/katamsoland_1.webp?w=3840&q=75',
  },
  {
    title: 'Taman Tjong Yong Hian',
    key: 'tjong',
    imgSrc:
      'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/tamantjongyonghian_1.webp?w=3840&q=75',
  },
  {
    title: 'Museum Perkebunan Indonesia',
    key: 'museum',
    imgSrc: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/mpi_1.webp?w=3840&q=75',
  },
  {
    title: 'Avros Park',
    key: 'avros',
    imgSrc: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/avp1.webp?w=3840&q=75',
  },
];

type WisataSectionProps = {
  onOpenWisata: (key: WisataKey) => void;
};

export default function WisataSection({ onOpenWisata }: WisataSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const measureScrollBounds = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    // READ batch
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    // WRITE batch
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);
  const scheduleScrollMeasurement = useRafCallback(measureScrollBounds);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    scheduleScrollMeasurement();
    container.addEventListener('scroll', scheduleScrollMeasurement, { passive: true });
    window.addEventListener('resize', scheduleScrollMeasurement);
    return () => {
      container.removeEventListener('scroll', scheduleScrollMeasurement);
      window.removeEventListener('resize', scheduleScrollMeasurement);
      if (animationFrameId.current !== null) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [scheduleScrollMeasurement]);

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const smoothScrollTo = (distance: number, duration: number = 600) => {
    if (!scrollRef.current) return;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const startPosition = scrollRef.current.scrollLeft;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutCubic(progress);

      if (scrollRef.current) {
        scrollRef.current.scrollLeft = startPosition + distance * easedProgress;
      }

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animateScroll);
      }
    };

    animationFrameId.current = requestAnimationFrame(animateScroll);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const scrollAmount = 300;
    const distance = direction === 'left' ? -scrollAmount : scrollAmount;
    smoothScrollTo(distance, 500);
  };

  return (
    <div className="w-full bg-white px-4 py-12 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr]">
        {/* Kolom Kiri */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center overflow-hidden rounded-md bg-[#008244]">
            <div className="flex items-center justify-center bg-[#70c042] p-2.5">
              <img
                alt="Decorative Icon"
                loading="lazy"
                width="24"
                height="24"
                src="https://konten.usu.ac.id/storage/satker/0/icons/flower-sec2.svg?w=64&q=75"
                className="h-6 w-6 brightness-200 filter"
              />
            </div>
            <h2 className="px-4 py-2 text-lg font-bold tracking-wide text-white md:text-xl">
              Wisata Kota Medan
            </h2>
          </div>

          <p className="text-justify text-xs leading-relaxed text-gray-600 md:text-sm">
            Medan menjadi salah satu kota di Pulau Sumatera yang memiliki banyak tempat wisata yang
            indah dan memukau. Keindahannya mewakili eksotisme tanah Sumatra. Kota Medan yang
            dikenal dengan Danau Toba ini menawarkan tempat wisata unik yang berbeda dari yang lain.
            Identitas kota Medan tercermin dari kekayaan alam dan budayanya. jelajahi kota Medan dan
            temukan wisata populer disekitarnya.
          </p>

          <button
            type="button"
            onClick={() => onOpenWisata('lainnya')}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-400 px-4 py-2 text-xs font-semibold text-gray-800 transition-colors duration-200 hover:border-[#008244] hover:text-[#008244] md:text-sm"
          >
            <span>Wisata Lainnya</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="h-4 w-4"
            >
              <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
            </svg>
          </button>
        </div>

        {/* Kolom Kanan */}
        <div className="relative overflow-hidden">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous Slide"
              className="absolute top-1/2 left-0 z-20 flex h-16 w-8 -translate-y-1/2 items-center justify-center rounded-r-md bg-[#eab308]/80 text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-[#eab308]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M165.66,202.34a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128l74.35,74.34A8,8,0,0,1,165.66,202.34Z" />
              </svg>
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next Slide"
              className="absolute top-1/2 right-0 z-20 flex h-16 w-8 -translate-y-1/2 items-center justify-center rounded-l-md bg-[#eab308]/80 text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-[#eab308]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L156.69,128,90.34,61.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
              </svg>
            </button>
          )}

          <div ref={scrollRef} className="no-scrollbar flex gap-5 overflow-x-auto pb-4">
            {wisataList.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onOpenWisata(item.key)}
                className="group relative h-[320px] w-[260px] flex-none overflow-hidden rounded-2xl text-left shadow-sm transition-all duration-300 hover:shadow-lg md:w-[280px]"
              >
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0"  loading="lazy" decoding="async" />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent transition-all duration-300 group-hover:from-[#008244]/90 group-hover:via-[#008244]/30" />

                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-4">
                  <span className="text-sm font-bold text-[#008244] transition-colors duration-300 group-hover:text-white md:text-base">
                    {item.title}
                  </span>
                  <div className="text-[#008244] transition-colors duration-300 group-hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="h-4 w-4 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { WisataKey };
