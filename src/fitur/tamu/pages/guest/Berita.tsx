import { useState } from 'react';
import { Newspaper, Calendar, ChevronRight, Search } from 'lucide-react';
import { beritaList } from '../../data/schoolData';
import { namaSekolah } from '../../../halaman/components/Profile/dataSekolah';

export default function Berita() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');

  const kategoris = [...new Set(beritaList.map((b) => b.kategori))];

  const filtered = beritaList.filter((b) => {
    const matchSearch =
      b.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ringkasan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = !filterKategori || b.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case 'Prestasi':
        return 'bg-amber-100 text-amber-700';
      case 'Kegiatan':
        return 'bg-blue-100 text-blue-700';
      case 'Akademik':
        return 'bg-emerald-100 text-emerald-700';
      case 'PPDB':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
          <div className="rounded-lg bg-sky-100 p-2">
            <Newspaper className="h-6 w-6 text-sky-600" />
          </div>
          Berita & Kegiatan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Informasi terbaru seputar kegiatan dan prestasi {namaSekolah}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita..."
            className="w-full rounded-lg border border-slate-200 py-2.5 pr-4 pl-10 text-sm outline-none focus:border-sky-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterKategori('')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
              !filterKategori
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          {kategoris.map((k) => (
            <button
              key={k}
              onClick={() => setFilterKategori(k)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                filterKategori === k
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Berita Utama */}
      {filtered.length > 0 && (
        <div className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg">
          <div className="aspect-video bg-gradient-to-br from-sky-100 to-sky-50 p-8">
            <div className="flex h-full items-center justify-center">
              <Newspaper className="h-16 w-16 text-sky-200" />
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getKategoriColor(filtered[0].kategori)}`}
              >
                {filtered[0].kategori}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3 w-3" />
                {formatDate(filtered[0].tanggal)}
              </span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-sky-600">
              {filtered[0].judul}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{filtered[0].ringkasan}</p>
            <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-sky-600">
              Baca selengkapnya <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Berita Lainnya */}
      {filtered.length > 1 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(1).map((berita) => (
            <div
              key={berita.id}
              className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-md"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 p-4">
                <div className="flex h-full items-center justify-center">
                  <Newspaper className="h-10 w-10 text-slate-200" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getKategoriColor(berita.kategori)}`}
                  >
                    {berita.kategori}
                  </span>
                  <span className="text-[10px] text-slate-400">{formatDate(berita.tanggal)}</span>
                </div>
                <h3 className="mt-2 font-bold text-slate-900 group-hover:text-sky-600">
                  {berita.judul}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{berita.ringkasan}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white py-12 text-center">
          <Newspaper className="mx-auto h-10 w-10 text-slate-200" />
          <p className="mt-3 font-semibold text-slate-400">Tidak ada berita ditemukan</p>
        </div>
      )}
    </div>
  );
}
