import React, { useState } from 'react';
import { User, CalendarDays } from 'lucide-react';
import type { PageProps, NavItem } from '../types';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  category: string;
  excerpt: string;
  image: string;
  author: string;
}

const news: NewsItem[] = [
  {
    id: 'berita-1',
    title: 'SMKN 1 Cimahi Raih Juara LKS Tingkat Provinsi',
    date: '2026-06-15',
    dateLabel: '15 Juni 2026',
    category: 'Prestasi',
    excerpt:
      'Tim siswa SMKN 1 Cimahi berhasil meraih juara pertama dalam Lomba Kompetensi Siswa (LKS) bidang Rekayasa Perangkat Lunak tingkat Provinsi Jawa Barat. Prestasi ini menjadi bukti komitmen sekolah dalam mengembangkan kompetensi siswa.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.webp`,
    author: 'Tim Redaksi',
  },
  {
    id: 'berita-2',
    title: 'Kunjungan Industri Kelas XI ke Perusahaan Mitra',
    date: '2026-06-10',
    dateLabel: '10 Juni 2026',
    category: 'Kegiatan',
    excerpt:
      'Siswa kelas XI melakukan kunjungan industri ke beberapa perusahaan mitra di Bandung dan Cimahi. Kegiatan ini bertujuan memberikan pengalaman langsung tentang dinamika dunia kerja.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.webp`,
    author: 'Tim Redaksi',
  },
  {
    id: 'berita-3',
    title: 'Seminar Karir dan Beasiswa untuk Siswa Kelas XII',
    date: '2026-06-05',
    dateLabel: '5 Juni 2026',
    category: 'Informasi',
    excerpt:
      'Sekolah mengadakan seminar karir yang menghadirkan praktisi industri dan perwakilan perguruan tinggi untuk memberikan arahan jalur karir dan informasi beasiswa kepada siswa kelas XII.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.webp`,
    author: 'Tim Redaksi',
  },
  {
    id: 'berita-4',
    title: 'Pembukaan PPDB Gelombang 1 Tahun Ajaran 2026/2027',
    date: '2026-06-01',
    dateLabel: '1 Juni 2026',
    category: 'Pengumuman',
    excerpt:
      'Penerimaan Peserta Didik Baru gelombang pertama telah resmi dibuka. Calon siswa dapat mendaftar secara online melalui portal PPDB resmi sekolah.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.webp`,
    author: 'Tim Redaksi',
  },
];

export default function BeritaPage({ onNavigate }: PageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>('2026/2027');

  // State murni React untuk penanganan gambar error
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const tabs = [
    { id: 'All', label: 'All' },
    { id: 'Prestasi', label: 'Prestasi' },
    { id: 'Kegiatan', label: 'Kegiatan' },
    { id: 'Informasi', label: 'Informasi' },
    { id: 'Pengumuman', label: 'Pengumuman' },
  ];

  const tahunAjaran = ['2024/2025', '2025/2026', '2026/2027', '2027/2028'];

  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white font-serif">
      {/* STICKY TAB MENU */}
      <div className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center max-lg:overflow-x-auto max-lg:whitespace-nowrap max-lg:[scrollbar-width:none] lg:justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex w-full items-center justify-center border-r border-slate-200 px-6 py-3 text-sm font-semibold whitespace-nowrap last:border-r-0 lg:py-4 ${
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

      {/* KONTEN UTAMA */}
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex-1">
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-3xl font-bold text-slate-900 md:text-4xl">Latest Updates</h3>

              <div className="flex items-center gap-3">
                {/* Toggle Input Search */}
                <div className="relative flex items-center">
                  {showSearch && (
                    <input
                      type="text"
                      placeholder="Cari berita..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="absolute right-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-950 focus:border-slate-950 focus:outline-none sm:w-64"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSearch(!showSearch);
                      if (showSearch) setSearchQuery('');
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                      showSearch
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-300 text-slate-600 hover:border-slate-950 hover:text-slate-950'
                    }`}
                    aria-label="Cari berita"
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

                {/* Dropdown Tahun Ajaran */}
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

            {/* GRID BERITA */}
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNews.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    {/* FOTO SEBAGAI AREA KLIK */}
                    <button
                      type="button"
                      onClick={() => onNavigate?.(item.id as NavItem)}
                      aria-label={`Baca berita ${item.title}`}
                      className="relative block w-full cursor-pointer overflow-hidden border-b border-slate-100 bg-slate-100 text-left"
                    >
                      {!failedImages[item.id] ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="aspect-[16/10] h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={() => handleImageError(item.id)}
                        />
                      ) : (
                        <div className="flex aspect-[16/10] w-full items-center justify-center bg-slate-50 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Media Berita
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-[10px] font-bold tracking-widest text-slate-950 uppercase">
                          {item.category}
                        </span>
                      </div>
                    </button>

                    {/* KONTEN */}
                    <div className="flex flex-1 flex-col p-5">
                      <h4
                        role="button"
                        tabIndex={0}
                        onClick={() => onNavigate?.(item.id as NavItem)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onNavigate?.(item.id as NavItem);
                          }
                        }}
                        className="mt-1 line-clamp-2 min-h-[3.5rem] cursor-pointer text-lg leading-tight font-bold text-slate-950 hover:underline focus:outline-none"
                      >
                        {item.title}
                      </h4>

                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                        {item.excerpt}
                      </p>

                      {/* AUTHOR + TANGGAL */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <User
                            className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400"
                            aria-hidden="true"
                          />
                          <span>{item.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays
                            className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400"
                            aria-hidden="true"
                          />
                          <time dateTime={item.date}>{item.dateLabel}</time>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Tidak ada berita yang cocok dengan kriteria pencarian Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
