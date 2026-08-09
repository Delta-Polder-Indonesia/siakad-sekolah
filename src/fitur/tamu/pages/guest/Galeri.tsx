import React, { useState, useEffect, useMemo } from 'react';
import { galleryItems, type GalleryItem } from '../../../halaman/data/galeri/data';
import { namaSekolah } from '../../../halaman/components/Profile/dataSekolah';

export default function Galeri() {
  // State untuk Filter & Pencarian
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // State untuk Hero Slider & Autoplay
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Memastikan array galeri aman
  const safeGalleryItems = useMemo(() => galleryItems || [], []);

  // Memilih 8 item pertama sebagai sorotan utama
  const featuredItems = useMemo(() => safeGalleryItems.slice(0, 8), [safeGalleryItems]);

  // Autoplay Slider (Berganti tiap 3.5 detik)
  useEffect(() => {
    if (isPaused || featuredItems.length === 0) return;

    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, featuredItems.length]);

  const handlePrevSlide = () => {
    setActiveHeroIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveHeroIndex((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
  };

  // Kategori Unik
  const categories = useMemo(() => {
    const unique = Array.from(new Set(safeGalleryItems.map((item) => item.category)));
    return ['All', ...unique];
  }, [safeGalleryItems]);

  // Filter Items
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return safeGalleryItems.filter((item: GalleryItem) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = query === '' || item.title.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [safeGalleryItems, selectedCategory, searchQuery]);

  const activeFeatured = featuredItems[activeHeroIndex] || safeGalleryItems[0];

  return (
    <div className="min-h-screen bg-white font-serif">
      {/* ══════════════════════════════════════════════════════
          HERO FEATURED SLIDER (BACKGROUND TRANSPARAN / PUTIH)
          ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-transparent text-slate-950"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative mx-auto max-w-6xl px-6 py-6 md:px-12 lg:py-8">
          <div className="grid items-center gap-6 lg:grid-cols-12">
            {/* Teks Informasi Banner */}
            <div className="z-10 lg:col-span-5">
              <span className="inline-block rounded-md border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-slate-700 uppercase">
                Sorotan Utama
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Dokumentasi Resmi Instansi
              </h2>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 md:text-sm">
                {activeFeatured?.title || `Eksplorasi arsip resmi ${namaSekolah}.`}
              </p>
              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  className="rounded-md bg-red-700 px-5 py-2 text-[11px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-red-800 focus:outline-none"
                >
                  Lihat Detail
                </button>
              </div>
            </div>

            {/* Slider Tampilan 3D Poster / Coverflow */}
            <div className="relative flex flex-col items-center justify-center lg:col-span-7">
              <div className="relative flex h-[220px] w-full items-center justify-center sm:h-[280px]">
                {featuredItems.map((item, idx) => {
                  const total = featuredItems.length;
                  let offset = idx - activeHeroIndex;

                  if (offset < -Math.floor(total / 2)) offset += total;
                  if (offset > Math.floor(total / 2)) offset -= total;

                  if (Math.abs(offset) > 2) return null;

                  const translatePx = offset * 75;
                  const scale = 1 - Math.abs(offset) * 0.15;
                  const zIndex = 30 - Math.abs(offset) * 10;
                  const opacity = 1 - Math.abs(offset) * 0.25;
                  const rotateY = offset * -15;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveHeroIndex(idx)}
                      style={{
                        transform: `translateX(${translatePx}px) scale(${scale}) rotateY(${rotateY}deg)`,
                        zIndex,
                        opacity,
                      }}
                      className="absolute h-[180px] w-[130px] cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-xl transition-all duration-500 ease-out sm:h-[230px] sm:w-[165px]"
                    >
                      {!failedImages[item.id] ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={() => handleImageError(item.id)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-3 text-center text-[9px] font-bold text-slate-400 uppercase">
                          Arsip #{idx + 1}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                    </div>
                  );
                })}
              </div>

              {/* Kontrol Navigasi Slider */}
              <div className="mt-2 flex items-center gap-5">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="text-slate-400 transition-colors hover:text-slate-950"
                  aria-label="Sebelumnya"
                >
                  &#10094;
                </button>
                <div className="flex items-center gap-1.5">
                  {featuredItems.map((_, dotIdx) => (
                    <button
                      key={`dot-${dotIdx}`}
                      type="button"
                      onClick={() => setActiveHeroIndex(dotIdx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeHeroIndex === dotIdx
                          ? 'w-5 bg-slate-950'
                          : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Ke slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="text-slate-400 transition-colors hover:text-slate-950"
                  aria-label="Berikutnya"
                >
                  &#10095;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          KONTEN & KONTROL
          ══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-20 md:px-12 md:pb-28">
        {/* Header Seksi */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Galeri &amp; Dokumentasi Sekolah
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-700">
            Eksplorasi arsip dokumentasi kegiatan resmi, pencapaian alumni, fasilitas sekolah, dan
            momen bersejarah {namaSekolah}.
          </p>
        </div>

        {/* Kontrol Penyaringan & Pencarian */}
        <div className="mt-8 mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab Kategori Kustom */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors duration-150 ${
                  selectedCategory === cat
                    ? 'border border-slate-950 bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-950 hover:text-slate-950'
                }`}
              >
                {cat === 'All' ? 'Semua Koleksi' : cat}
              </button>
            ))}
          </div>

          {/* Input Pencarian Minimalis */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari dokumentasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-10 pl-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400 hover:text-slate-950"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Grid Galeri Media */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item: GalleryItem, idx: number) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                {/* Frame Foto Media */}
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-slate-100 bg-slate-50">
                  {!failedImages[item.id] ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      onError={() => handleImageError(item.id)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-6 text-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Dokumentasi Media #{idx + 1}
                    </div>
                  )}
                  {/* Badge Kategori Dokumen */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-lg border border-slate-300 bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-widest text-slate-950 uppercase backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Deskripsi Informasi File */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      Arsip Instansi
                    </span>
                    <h4 className="mt-2 line-clamp-2 min-h-[2.5rem] text-[14px] leading-snug font-bold text-slate-950">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Editorial */
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Tidak ada dokumentasi yang cocok dengan kriteria pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
