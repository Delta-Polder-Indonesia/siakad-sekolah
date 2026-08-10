// src/fitur/halaman/pages/DataBeranda/LayananCarousel.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { layananItems } from '../../data/beranda/layanan/data';
import { namaSekolahUppercase } from '../../components/Profile/dataSekolah';

interface LayananItem {
  id?: string | number;
  title: string;
  description: string;
  image: string;
}

// ── Konstanta ──────────────────────────────────────────────
const INTERVAL_CAROUSEL = 5000;
const THRESHOLD_TOUCH = 50;
const POSISI_SLIDE = {
  center: 'z-20 scale-100 opacity-100 blur-0 translate-x-0 transform-gpu',
  left: 'z-10 scale-90 opacity-60 blur-[2px] -translate-x-[70%] transform-gpu',
  right: 'z-10 scale-90 opacity-60 blur-[2px] translate-x-[70%] transform-gpu',
  hidden: 'z-0 scale-75 opacity-0 pointer-events-none transform-gpu',
} as const;

// ── Icon panah ──────────────────────────────────────────────
function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-7 w-7 text-slate-700"
      aria-hidden="true"
    >
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-7 w-7 text-slate-700"
      aria-hidden="true"
    >
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </svg>
  );
}

// ── Komponen Slide Kartu ──────────────────────────────────
interface PropsSlideCarousel {
  item: LayananItem;
  posisi: 'left' | 'center' | 'right' | 'hidden';
  isInteraktif: boolean;
  onPilih: (idx: number) => void;
  indeks: number;
}

function SlideCarousel({ item, posisi, isInteraktif, onPilih, indeks }: PropsSlideCarousel) {
  const itemKey = item.id ?? `${item.title}-${indeks}`;

  const handleClick = () => {
    if (isInteraktif) onPilih(indeks);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteraktif && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onPilih(indeks);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = 'https://placehold.co/600x400?text=Gambar+Tidak+Tersedia';
    target.alt = 'Gambar tidak tersedia';
  };

  const getBaseUrl = () => {
    const base = import.meta.env.BASE_URL || '/';
    return base.endsWith('/') ? base : `${base}/`;
  };

  const imageSrc = `${getBaseUrl()}${item.image}`.replace(/\/+/g, '/');

  return (
    <div
      key={itemKey}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isInteraktif ? 'button' : 'presentation'}
      tabIndex={isInteraktif ? 0 : -1}
      className={`absolute w-[85%] max-w-2xl transition-all duration-700 ease-in-out ${POSISI_SLIDE[posisi]} ${
        isInteraktif ? 'cursor-pointer select-none hover:drop-shadow-lg' : ''
      }`}
    >
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
        {/* Gambar */}
        <div className="w-full overflow-hidden bg-slate-100">
          <img
            src={imageSrc}
            alt={item.title}
            className="h-40 w-full object-cover md:h-44"
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        </div>

        {/* Konten */}
        <div className="p-6 md:p-7">
          <h3 className="sec-card-title mb-3 text-[#021624]">{item.title}</h3>
          <p className="sec-card-body line-clamp-3 text-slate-600">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

// ── Komponen Utama ──────────────────────────────────────────
export default function LayananCarousel() {
  const items = (layananItems as LayananItem[]) || [];
  const total = items.length;

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  
  // Refs untuk menyimpan fungsi navigasi agar tidak recreation interval
  const nextRef = useRef<(() => void) | null>(null);
  const prevRef = useRef<(() => void) | null>(null);
  const goToRef = useRef<((idx: number) => void) | null>(null);
  const isPausedRef = useRef(false);
  const manualNavigationRef = useRef(false);

  // ── Fungsi navigasi ──────────────────────────────────
  const next = useCallback(() => {
    if (total <= 1 || isPausedRef.current) return;
    setCurrent((c) => (c === total - 1 ? 0 : c + 1));
  }, [total]);

  const prev = useCallback(() => {
    if (total <= 1 || isPausedRef.current) return;
    setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  }, [total]);

  const goTo = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < total) {
        setCurrent(idx);
        // Set flag untuk debounce auto-play setelah manual navigation
        manualNavigationRef.current = true;
        setTimeout(() => {
          manualNavigationRef.current = false;
        }, 3000); // Delay 3 detik sebelum auto-play lanjut
      }
    },
    [total]
  );

  // ── Fungsi helper untuk posisi slide ──────────────────
  const getPosition = useCallback(
    (idx: number): 'left' | 'center' | 'right' | 'hidden' => {
      if (total === 0) return 'hidden';
      if (idx === current) return 'center';
      if (idx === (current - 1 + total) % total) return 'left';
      if (idx === (current + 1) % total) return 'right';
      return 'hidden';
    },
    [current, total]
  );

  // ── Update refs ───────────────────────────────────────
  useEffect(() => {
    nextRef.current = next;
    prevRef.current = prev;
    goToRef.current = goTo;
    isPausedRef.current = isPaused;
  }, [next, prev, goTo, isPaused]);

  // ── Auto play ────────────────────────────────────────
  useEffect(() => {
    if (total <= 1) return;

    const timer = setInterval(() => {
      // Cek pause state dan manual navigation flag
      if (!isPausedRef.current && !manualNavigationRef.current && nextRef.current) {
        nextRef.current();
      }
    }, INTERVAL_CAROUSEL);
    
    return () => clearInterval(timer);
  }, [total]);

  // ── Keyboard navigation ──────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (total <= 1) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, total]);

  // ── Visibility API untuk tab switching ───────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true); // Pause saat tab tidak aktif
      } else {
        setIsPaused(false); // Resume saat tab aktif kembali
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // ── Validasi items (Early Return) ───────────────────
  // Dipindahkan ke BAWAH semua Hooks agar mematuhi rules-of-hooks
  if (total === 0) {
    return (
      <div className="overflow-hidden bg-white py-5 font-serif">
        <div className="relative mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col">
            <span className="sec-eyebrow text-slate-900">
              {namaSekolahUppercase} Sekolah Solusi
            </span>
            <h2 className="sec-title mb-4 font-serif text-slate-900">
              Layanan Unggulan Sekolah Kami
            </h2>
            <p className="sec-body font-serif text-slate-600">Data layanan tidak tersedia</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Touch handlers ───────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true); // Pause saat user mulai touch
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEnd = e.changedTouches[0].clientX;
    const selisih = touchStart - touchEnd;

    if (Math.abs(selisih) > THRESHOLD_TOUCH) {
      if (selisih > 0) next();
      else prev();
    }
    
    // Resume auto-play setelah delay
    setTimeout(() => {
      setIsPaused(false);
    }, 1000); // Delay 1 detik sebelum resume
  };

  return (
    <div className="overflow-hidden bg-white py-5 font-serif">
      <div className="relative mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col px-4 sm:px-0">
          <span className="sec-eyebrow font-serif text-slate-900">
            {namaSekolahUppercase} Sekolah Solusi
          </span>
          <h2 className="sec-title mb-4 font-serif text-slate-900">
            Layanan Unggulan Sekolah Kami
          </h2>
          <p className="sec-body font-serif text-slate-600">
            Berbagai fasilitas dan layanan terbaik untuk mendukung tumbuh kembang siswa
          </p>
        </div>

        {/* CAROUSEL WRAPPER */}
        <div
          className="relative flex h-[420px] items-center justify-center md:h-[380px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Carousel layanan sekolah"
          aria-live="polite"
          aria-atomic="true"
        >
          {items.map((item, idx) => {
            const pos = getPosition(idx);
            const isInteraktif = pos !== 'center' && pos !== 'hidden';

            return (
              <SlideCarousel
                key={item.id ?? `${item.title}-${idx}`}
                item={item}
                posisi={pos}
                isInteraktif={isInteraktif}
                onPilih={goTo}
                indeks={idx}
              />
            );
          })}
        </div>

        {/* INDICATOR DOTS */}
        {total > 1 && (
          <div
            className="flex items-center justify-center gap-2 pt-2"
            role="tablist"
            aria-label="Slide navigation"
          >
            {items.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                type="button"
                onClick={() => goTo(idx)}
                role="tab"
                aria-selected={idx === current}
                aria-label={`Ke slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === current ? 'w-8 bg-slate-800' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* TOMBOL PREV */}
        {total > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Slide sebelumnya"
            className="absolute top-1/2 left-2 z-30 hidden h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg transition-all hover:bg-slate-100 md:flex lg:left-4"
          >
            <ChevronLeft />
          </button>
        )}

        {/* TOMBOL NEXT */}
        {total > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Slide berikutnya"
            className="absolute top-1/2 right-2 z-30 hidden h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg transition-all hover:bg-slate-100 md:flex lg:right-4"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
