import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { namaSekolahUppercase } from '../../components/Profile/dataSekolah';
import { news, type NewsItem } from '../../data/berita/data';
import { resolveBeritaNav } from './detailNav';

interface RelatedArticlesSectionProps {
  onNavigate?: (page: string) => void;
}

// Bagian ini hanya "wajah" (teaser) dari berita: memakai data `news` yang sama
// dengan halaman Berita. Klik kartu langsung membuka KONTEN berita (berita-N),
// dan tombol back akan kembali ke halaman asal (mis. Beranda) karena riwayat
// navigasi modal disimpan di ExpectationModal.
export default function RelatedArticlesSection({ onNavigate }: RelatedArticlesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return news;

    return news.filter(
      (art) => art.title.toLowerCase().includes(query) || art.excerpt.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const featuredItem = filteredItems[0];
  const secondaryItems = filteredItems.slice(1, 3);

  return (
    <section className="w-full bg-white font-serif">
      {/* 1. Header Hero Banner dengan Gambar Absolute Kanan (Gaya USU) */}
      <section className="relative flex min-h-[300px] w-full items-center overflow-hidden bg-emerald-800 md:min-h-[380px]">
        {/* Foto Samping Kanan */}
        <img
          src={`${import.meta.env.BASE_URL}images/HalamanKami/Beranda/smknu_pkl-2024.webp`}
          alt="Banner Kegiatan"
          className="absolute top-0 right-0 z-[1] h-full w-full object-cover object-center md:w-1/2"  loading="lazy" decoding="async" />

        {/* Layer Gradient Overlay */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-emerald-900 via-emerald-800/90 to-transparent"></div>

        {/* Content Teks & Input Pencarian */}
        <div className="relative z-[3] mx-auto w-full max-w-7xl px-4 py-10 md:px-10">
          <div className="max-w-2xl space-y-3">
            <h1 className="sec-title text-white">Arsip Berita & Kegiatan Sekolah</h1>
            <p className="sec-body font-normal text-emerald-100">
              Jelajahi seluruh dokumentasi, artikel prestasi, pengumuman resmi, serta agenda
              kegiatan siswa {namaSekolahUppercase}.
            </p>

            {/* Input Search */}
            <div className="mt-4 max-w-md pt-2">
              <div className="relative w-full">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari berita atau kegiatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Bersihkan pencarian"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Container Artikel Utama & Sekunder Atas */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-10 md:px-10">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 py-12 text-center shadow-sm">
            <p className="sec-body text-slate-500">Pencarian tidak ditemukan.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Bagian Hero Artikel Kiri & Kanan */}
            <div className="flex flex-col items-start gap-6 md:flex-row lg:gap-8">
              {/* Sisi Kiri (Basis 1/2) - Artikel Unggulan Utama */}
              {featuredItem && (
                <div className="relative z-10 -mt-10 flex flex-col gap-6 md:-mt-16 md:basis-1/2">
                  <div
                    onClick={() => {
                      const nav = resolveBeritaNav(featuredItem.id);
                      if (nav) onNavigate?.(nav);
                    }}
                    className="group flex cursor-pointer flex-col gap-4"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={`${import.meta.env.BASE_URL}${featuredItem.image}`}
                        alt={featuredItem.title}
                        className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-800/90 px-3 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm backdrop-blur-md">
                          {featuredItem.category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h2 className="sec-card-title text-slate-900 transition-colors group-hover:text-emerald-700">
                        {featuredItem.title}
                      </h2>
                      <p className="sec-body line-clamp-6 text-slate-600">{featuredItem.excerpt}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sisi Kanan (Basis 1/2) - Tombol "Riset Lainnya" + Grid Artikel Sekunder */}
              <div className="flex w-full flex-col gap-6 md:basis-1/2">
                {/* Tombol "Lihat Semua / Riset Lainnya" di Kanan Atas */}
                <div className="-mt-15 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onNavigate?.('Berita')}
                    className="sec-btn group relative z-10 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-emerald-800 transition-all hover:text-emerald-900"
                  >
                    <span>Lihat Semua</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {secondaryItems.map((art: NewsItem) => {
                    return (
                      <div
                        key={art.id}
                        onClick={() => {
                          const nav = resolveBeritaNav(art.id);
                          if (nav) onNavigate?.(nav);
                        }}
                        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-transparent transition-all duration-300 ease-out hover:bg-emerald-800"
                      >
                        <div className="h-[160px] w-full overflow-hidden bg-slate-100">
                          <img
                            src={`${import.meta.env.BASE_URL}${art.image}`}
                            alt={art.title}
                            className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                        </div>

                        <div className="flex flex-col gap-2 p-4 transition-all duration-300">
                          <span className="sec-eyebrow text-emerald-600 group-hover:text-emerald-200">
                            {art.category}
                          </span>
                          <h3 className="sec-card-title line-clamp-2 text-slate-900 group-hover:text-white">
                            {art.title}
                          </h3>
                          <span className="sec-meta pt-1 font-medium text-slate-500 group-hover:text-emerald-100">
                            {art.dateLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tombol Lihat Semua di Paling Bawah */}
            <div>
              <button
                type="button"
                onClick={() => onNavigate?.('Berita')}
                className="sec-btn inline-block cursor-pointer border-none bg-transparent font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Lihat semua
              </button>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
