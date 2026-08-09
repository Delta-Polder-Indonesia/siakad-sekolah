import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { PageProps } from '../types';
import { galleryItems, tabs, tahunAjaran, type GalleryItem } from '../data/galeri/data';
import { namaSekolahUppercase } from '../components/Profile/dataSekolah';

export default function GaleriPage({ onNavigate: _onNavigate }: PageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Collections');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>('2026/2027');

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const handleImageError = useCallback((id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  const safeGalleryItems = useMemo(() => galleryItems || [], []);
  const heroItems = useMemo(() => safeGalleryItems.slice(0, 8), [safeGalleryItems]);

  useEffect(() => {
    if (isPaused || heroItems.length === 0) return;

    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev === heroItems.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, heroItems.length]);

  const handlePrevSlide = useCallback(() => {
    setActiveHeroIndex((prev) => (prev === 0 ? heroItems.length - 1 : prev - 1));
  }, [heroItems.length]);

  const handleNextSlide = useCallback(() => {
    setActiveHeroIndex((prev) => (prev === heroItems.length - 1 ? 0 : prev + 1));
  }, [heroItems.length]);

  const filteredItems = useMemo(() => {
    return safeGalleryItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Collections' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [safeGalleryItems, selectedCategory, searchQuery]);

  return (
    <div className="relative bg-transparent font-serif antialiased">
      <section
        className="relative z-20 mx-auto -mt-52 max-w-[1280px] bg-transparent px-4 sm:px-6 md:-mt-79 lg:px-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="grid grid-cols-1 items-center lg:grid-cols-12">
          <div className="relative flex flex-col items-center justify-center lg:col-span-6 lg:col-start-7">
            <div className="relative flex h-[240px] w-full items-center justify-center sm:h-[300px]">
              {heroItems.map((item, idx) => {
                const total = heroItems.length;
                let offset = idx - activeHeroIndex;

                if (offset < -Math.floor(total / 2)) offset += total;
                if (offset > Math.floor(total / 2)) offset -= total;

                if (Math.abs(offset) > 2) return null;

                const translatePx = offset * 80;
                const scale = 1 - Math.abs(offset) * 0.15;
                const zIndex = 30 - Math.abs(offset) * 10;
                const opacity = 1 - Math.abs(offset) * 0.25;
                const rotateY = offset * -15;

                return (
                  <div
                    key={`hero-${item.id || idx}`}
                    onClick={() => {
                      setActiveHeroIndex(idx);
                      setSelectedItem(item);
                    }}
                    style={{
                      transform: `translateX(${translatePx}px) scale(${scale}) rotateY(${rotateY}deg)`,
                      zIndex,
                      opacity,
                      willChange: 'transform, opacity',
                      backfaceVisibility: 'hidden',
                    }}
                    className="absolute h-[200px] w-[140px] cursor-pointer overflow-hidden rounded-xl shadow-2xl transition-all duration-500 ease-out sm:h-[250px] sm:w-[175px]"
                  >
                    {!failedImages[`hero-${item.id || idx}`] ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={() => handleImageError(`hero-${item.id || idx}`)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 p-3 text-center text-[9px] font-bold text-slate-400 uppercase">
                        Dokumentasi #{idx + 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <div className="sticky top-0 z-30 mt-4 w-full border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex items-center max-lg:overflow-x-auto max-lg:whitespace-nowrap max-lg:[scrollbar-width:none] lg:justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex w-full items-center justify-center border-r border-slate-200 px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors duration-150 ease-in-out last:border-r-0 lg:py-4 ${
                    selectedCategory === tab.id
                      ? 'bg-slate-100 text-slate-950'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-10">
            <div className="flex-1">
              <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  Media &amp; Dokumentasi
                </h3>

                <div className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    {showSearch && (
                      <input
                        type="text"
                        placeholder="Cari dokumentasi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Input pencarian dokumentasi"
                        autoFocus
                        className="absolute right-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-950 focus:border-slate-950 focus:outline-none sm:w-64"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSearch((prev) => !prev);
                        if (showSearch) setSearchQuery('');
                      }}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                        showSearch
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-slate-300 text-slate-600 hover:border-slate-950 hover:text-slate-950'
                      }`}
                      aria-label="Cari dokumentasi"
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pr-8 pl-3 text-xs font-semibold text-slate-950 focus:border-slate-950 focus:outline-none"
                    >
                      {tahunAjaran.map((tahun) => (
                        <option key={tahun} value={tahun}>
                          TA {tahun}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
                  {filteredItems.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs"
                    >
                      <div className="relative aspect-[2/3] w-full overflow-hidden border-b border-slate-100 bg-slate-100">
                        {!failedImages[item.id] ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            onError={() => handleImageError(String(item.id))}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center p-2 text-center text-[10px] font-bold text-slate-400 uppercase">
                            Dokumentasi #{idx + 1}
                          </div>
                        )}

                        <div className="absolute top-2 left-2">
                          <span className="rounded bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-xs">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-3">
                        <div>
                          <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                            {namaSekolahUppercase}
                          </span>
                          <h4 className="mt-1 line-clamp-2 text-xs leading-tight font-bold text-slate-950 transition-colors group-hover:text-slate-600">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                  <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Tidak ada dokumentasi yang cocok dengan kriteria pencarian Anda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 text-white transition-colors hover:bg-slate-950"
              aria-label="Tutup Pop-up"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative flex max-h-[65vh] w-full items-center justify-center bg-slate-950">
              {!failedImages[`modal-${selectedItem.id}`] ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="max-h-[75vh] max-w-full object-contain"
                  onError={() => handleImageError(`modal-${selectedItem.id}`)}
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center p-4 text-center text-xs font-bold text-slate-400 uppercase">
                  Gagal memuat gambar
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 p-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {namaSekolahUppercase}
                </span>
                <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 uppercase">
                  {selectedItem.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 md:text-2xl">{selectedItem.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
