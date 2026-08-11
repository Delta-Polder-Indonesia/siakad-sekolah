import { useState } from 'react';
import {
  BookOpen,
  PenTool,
  List,
  BarChart3,
  Users,
  Star,
  TrendingUp,
  Target,
  CheckCircle2,
} from 'lucide-react';
import BukuTamuForm from '../components/BukuTamuForm';
import BukuTamuList from '../components/BukuTamuList';
import { useGuestBook } from '../context/GuestBookContext';
import { namaSekolah } from '../../halaman/components/Profile/dataSekolah';

export interface BukuTamuPageProps {
  onNavigate: (page: string) => void;
  defaultTab?: 'form' | 'list' | 'stats';
}

type TabType = 'form' | 'list' | 'stats';

export default function BukuTamuPage({ defaultTab = 'form' }: BukuTamuPageProps) {
  const { entries = [], addEntry } = useGuestBook();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [showSuccess, setShowSuccess] = useState(false);

  const safeEntries = Array.isArray(entries) ? entries : [];

  const avgRating =
    safeEntries.length > 0
      ? (
          safeEntries.reduce((sum, e) => sum + (Number(e?.rating) || 0), 0) / safeEntries.length
        ).toFixed(1)
      : '0';

  const tujuanStats = safeEntries.reduce(
    (acc, e) => {
      const tujuanKey = e?.tujuan || 'Lainnya';
      acc[tujuanKey] = (acc[tujuanKey] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedTujuan = Object.entries(tujuanStats).sort((a, b) => b[1] - a[1]);

  const monthlyStats = safeEntries.reduce(
    (acc, e) => {
      if (!e?.tanggal) return acc;
      const month = new Date(e.tanggal).toLocaleDateString('id-ID', {
        month: 'short',
        year: 'numeric',
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const ratingDist = [5, 4, 3, 2, 1].map((r) => {
    const count = safeEntries.filter((e) => Number(e?.rating) === r).length;
    return {
      rating: r,
      count,
      pct: safeEntries.length > 0 ? (count / safeEntries.length) * 100 : 0,
    };
  });

  const tabs = [
    { id: 'form' as TabType, label: 'Isi Buku Tamu', icon: PenTool },
    { id: 'list' as TabType, label: 'Daftar Tamu', icon: List },
    { id: 'stats' as TabType, label: 'Statistik', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 bg-white pb-16 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-[20px] font-bold tracking-tight text-slate-950 sm:text-[24px]">
              Buku Tamu Digital
            </h1>
            <p className="text-[12px] font-semibold text-slate-600 italic">
              {namaSekolah} — Sistem Pencatatan Kunjungan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 border-t border-slate-200 pt-3 sm:border-t-0 sm:pt-0">
          <div className="text-center">
            <p className="font-serif text-[24px] font-bold text-slate-950">{safeEntries.length}</p>
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Total Tamu
            </p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="font-serif text-[24px] font-bold text-slate-950">{avgRating}</p>
              <Star className="h-4 w-4 fill-slate-700 text-slate-700" />
            </div>
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Rata-rata
            </p>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-slate-700" />
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800">Berhasil!</p>
            <p className="text-xs font-semibold text-slate-600">
              Buku tamu Anda telah berhasil disimpan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
          >
            ×
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2 text-xs font-bold transition-colors sm:flex-none ${
                isActive
                  ? 'border-slate-950 bg-slate-50 text-slate-950 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-950 hover:text-slate-950'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'form' && (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase">
              <span className="h-3 w-1 bg-slate-900" />
              Formulir Buku Tamu
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
              <BukuTamuForm
                onSubmit={(entry) => {
                  addEntry(entry);
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 5000);
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase">
              <span className="h-3 w-1 bg-blue-600" />
              Daftar Entri Buku Tamu
            </h2>
            <BukuTamuList entries={safeEntries} />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase">
              <span className="h-3 w-1 bg-slate-900" />
              Statistik Kunjungan
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs">
                <Users className="mx-auto h-5 w-5 text-slate-700" />
                <p className="font-serif text-[24px] font-bold text-slate-950">
                  {safeEntries.length}
                </p>
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Total Pengunjung
                </p>
              </div>
              <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs">
                <Star className="mx-auto h-5 w-5 fill-slate-700 text-slate-700" />
                <p className="font-serif text-[24px] font-bold text-slate-950">{avgRating}</p>
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Rating Rata-rata
                </p>
              </div>
              <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs">
                <TrendingUp className="mx-auto h-5 w-5 text-slate-700" />
                <p className="font-serif text-[24px] font-bold text-slate-950">
                  {safeEntries.filter((e) => Number(e?.rating) >= 4).length}
                </p>
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Rating Tinggi
                </p>
              </div>
              <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs">
                <Target className="mx-auto h-5 w-5 text-slate-700" />
                <p className="font-serif text-[24px] font-bold text-slate-950">
                  {Object.keys(tujuanStats).length}
                </p>
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Jenis Kunjungan
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Rating Distribution */}
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="border-b border-slate-200 pb-3 text-xs font-bold tracking-wider text-slate-800 uppercase">
                  Distribusi Rating
                </h3>
                <div className="space-y-3">
                  {ratingDist.map((r) => (
                    <div key={r.rating} className="flex items-center gap-3">
                      <div className="flex w-12 items-center gap-1">
                        <span className="text-xs font-bold text-slate-700">{r.rating}</span>
                        <Star className="h-3.5 w-3.5 fill-slate-700 text-slate-700" />
                      </div>
                      <div className="relative h-5 flex-1 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                        <div
                          className="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-500"
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-bold text-slate-700">
                        {r.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tujuan Kunjungan */}
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="border-b border-slate-200 pb-3 text-xs font-bold tracking-wider text-slate-800 uppercase">
                  Tujuan Kunjungan Terbanyak
                </h3>
                <div className="space-y-3">
                  {sortedTujuan.length > 0 ? (
                    sortedTujuan.map(([tujuan, count], i) => (
                      <div
                        key={tujuan}
                        className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
                            {i + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{tujuan}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {count}{' '}
                          <span className="text-[10px] font-semibold text-slate-500">tamu</span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-xs font-bold text-slate-500">
                      Belum ada data
                    </p>
                  )}
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
                <h3 className="border-b border-slate-200 pb-3 text-xs font-bold tracking-wider text-slate-800 uppercase">
                  Kunjungan Per Bulan
                </h3>
                {Object.keys(monthlyStats).length > 0 ? (
                  <div className="flex items-end gap-3 pt-4">
                    {Object.entries(monthlyStats).map(([month, count]) => {
                      const maxCount = Math.max(...Object.values(monthlyStats));
                      const height = maxCount > 0 ? (count / maxCount) * 120 : 0;
                      return (
                        <div key={month} className="flex flex-1 flex-col items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">{count}</span>
                          <div
                            className="w-full rounded-t border border-b-0 border-slate-200 bg-blue-600 transition-all duration-500"
                            style={{ height: `${height}px`, minHeight: '8px' }}
                          />
                          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                            {month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-8 text-center text-xs font-bold text-slate-500">
                    Belum ada data
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
