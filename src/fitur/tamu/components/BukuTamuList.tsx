import { useState } from 'react';
import {
  Star,
  Building2,
  Calendar,
  Clock,
  Target,
  Search,
  Filter,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { GuestEntry } from '../types';

interface BukuTamuListProps {
  entries: GuestEntry[];
}

export default function BukuTamuList({ entries }: BukuTamuListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTujuan, setFilterTujuan] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const safeEntries = Array.isArray(entries) ? entries : [];

  const filteredEntries = safeEntries.filter((entry) => {
    const matchSearch =
      entry.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.instansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.pesan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTujuan = !filterTujuan || entry.tujuan === filterTujuan;
    return matchSearch && matchTujuan;
  });

  const allTujuan = [...new Set(safeEntries.map((e) => e.tujuan))];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    if (!name) return 'GT';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, instansi, atau pesan..."
            className="w-full rounded-md border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-xs font-bold text-slate-900 shadow-2xs transition-colors outline-none placeholder:text-slate-400 hover:border-slate-950 focus:border-slate-950"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:border-slate-950 hover:text-slate-950 sm:w-auto ${
              filterTujuan ? 'border-slate-950 bg-slate-50 text-slate-950' : ''
            }`}
          >
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            {filterTujuan || 'Filter'}
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-500 transition-transform ${showFilter ? 'rotate-180' : ''}`}
            />
          </button>
          {showFilter && (
            <div className="absolute top-full right-0 z-20 mt-1 w-56 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setFilterTujuan('');
                  setShowFilter(false);
                }}
                className={`w-full cursor-pointer px-4 py-2.5 text-left text-xs font-bold transition-colors hover:bg-slate-50 hover:text-slate-950 ${
                  !filterTujuan ? 'bg-slate-50 font-extrabold text-slate-950' : 'text-slate-600'
                }`}
              >
                Semua Tujuan
              </button>
              {allTujuan.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    setFilterTujuan(t);
                    setShowFilter(false);
                  }}
                  className={`w-full cursor-pointer px-4 py-2.5 text-left text-xs font-bold transition-colors hover:bg-slate-50 hover:text-slate-950 ${
                    filterTujuan === t
                      ? 'bg-slate-50 font-extrabold text-slate-950'
                      : 'text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs font-bold text-slate-500">
        {filteredEntries.length} dari {safeEntries.length} entri ditampilkan
      </p>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-slate-200 bg-white py-16 text-center shadow-2xs">
          <MessageSquare className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-bold text-slate-900">Tidak ada entri ditemukan</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Coba ubah kata kunci pencarian atau filter
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xs transition-all hover:border-slate-950"
            >
              <div
                className="flex cursor-pointer items-start gap-4 p-4 sm:p-5"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              >
                {/* Avatar */}
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 font-serif text-sm font-bold text-slate-700 group-hover:border-slate-950 group-hover:text-slate-950 sm:flex">
                  {getInitials(entry.nama)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-950">{entry.nama}</h4>
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        {entry.instansi}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= entry.rating
                              ? 'fill-slate-900 text-slate-900'
                              : 'fill-white text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p
                    className={`text-xs leading-relaxed font-medium text-slate-700 ${
                      expandedId !== entry.id ? 'line-clamp-2' : ''
                    }`}
                  >
                    "{entry.pesan}"
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {formatDate(entry.tanggal)}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {entry.waktu || '00:00'} WIB
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      <Target className="h-2.5 w-2.5 text-slate-400" />
                      {entry.tujuan}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:text-slate-950 ${
                    expandedId === entry.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
