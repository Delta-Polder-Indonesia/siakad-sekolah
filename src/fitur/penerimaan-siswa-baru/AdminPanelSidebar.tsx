/**
 * Sidebar AdminPanel PPDB: ringkasan statistik + filter pencarian
 * (dipecah dari AdminPanel.tsx).
 */
import { Search } from 'lucide-react';
import type { PPDBApplicationStatus } from '../../data/services';
import type { AdminPanelStats } from './AdminPanel.types';

interface AdminPanelSidebarProps {
  stats: AdminPanelStats;
  search: string;
  filterStatus: 'ALL' | PPDBApplicationStatus;
  filterJenjang: string;
  filterJalur: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'ALL' | PPDBApplicationStatus) => void;
  onJenjangChange: (value: string) => void;
  onJalurChange: (value: string) => void;
}

export default function AdminPanelSidebar({
  stats,
  search,
  filterStatus,
  filterJenjang,
  filterJalur,
  onSearchChange,
  onStatusChange,
  onJenjangChange,
  onJalurChange,
}: AdminPanelSidebarProps) {
  return (
    <section className="w-[280px] shrink-0 overflow-y-auto border-r border-black bg-white px-5 py-5">
      <div className="mb-6">
        <div className="border-b border-black pb-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">Ringkasan</p>
        </div>
        <div className="mt-2 divide-y divide-black/20 border-y border-black">
          {[
            { label: 'Total Pendaftar', value: stats.total },
            { label: 'Menunggu Verifikasi', value: stats.pending },
            { label: 'Terverifikasi', value: stats.verified },
            { label: 'Diterima', value: stats.accepted },
            { label: 'Ditolak', value: stats.rejected },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5">
              <p className="text-[11px] text-black">{item.label}</p>
              <p className="text-base font-bold text-black">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="border-b border-black pb-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">Filter Data</p>
        </div>
        <div className="mt-3 space-y-2.5">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-black" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama, no registrasi, atau NIK"
              className="w-full rounded-md border border-black bg-white py-2 pr-3 pl-9 text-xs text-black outline-none placeholder:text-neutral-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value as 'ALL' | PPDBApplicationStatus)}
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Menunggu</option>
            <option value="VERIFIED">Terverifikasi</option>
            <option value="ACCEPTED">Diterima</option>
            <option value="REJECTED">Ditolak</option>
          </select>
          <select
            value={filterJenjang}
            onChange={(e) => onJenjangChange(e.target.value)}
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          >
            <option value="ALL">Semua Jenjang</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="SMK">SMK</option>
          </select>
          <select
            value={filterJalur}
            onChange={(e) => onJalurChange(e.target.value)}
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          >
            <option value="ALL">Semua Jalur</option>
            <option value="REGULER">Reguler</option>
            <option value="ZONASI">Zonasi</option>
            <option value="PRESTASI">Prestasi</option>
            <option value="AFIRMASI">Afirmasi</option>
            <option value="PINDAHAN">Pindahan</option>
          </select>
        </div>
      </div>
    </section>
  );
}
