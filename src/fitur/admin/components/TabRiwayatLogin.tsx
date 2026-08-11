import { useMemo, useState } from 'react';
import { getLoginHistory, getLoginStats } from '../../../data/services';
import { Users, LogIn, Search, History } from 'lucide-react';

const roleBadgeClass: Record<string, string> = {
  teacher: 'border-black bg-black text-white',
  student: 'border-emerald-600 bg-white text-emerald-600',
  parent: 'border-amber-600 bg-white text-amber-600',
  guest: 'border-black bg-white text-black',
  admin: 'border-rose-600 bg-white text-rose-600',
};

const roleLabel: Record<string, string> = {
  teacher: 'Guru',
  student: 'Siswa',
  parent: 'Orang Tua',
  guest: 'Tamu',
  admin: 'Admin',
};

const STAT_CARDS = [
  { key: 'total', label: 'Total Login' },
  { key: 'today', label: 'Hari Ini' },
  { key: 'guestToday', label: 'Tamu Hari Ini' },
  { key: 'registeredToday', label: 'Terdaftar Hari Ini' },
] as const;

export default function TabRiwayatLogin() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const stats = useMemo(() => getLoginStats(), []);
  const logs = useMemo(() => {
    const all = getLoginHistory();
    return all.reverse().filter((l) => {
      if (filterRole !== 'all' && l.role !== filterRole) return false;
      if (search) {
        const q = search.toLowerCase();
        return l.name.toLowerCase().includes(q) || (l.email?.toLowerCase() || '').includes(q);
      }
      return true;
    });
  }, [search, filterRole]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── STATISTIK LOGIN ── */}
      <section className="rounded-md border-2 border-black bg-white p-4">
        <div className="mb-3 border-b-2 border-black pb-2">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
            <LogIn className="h-4 w-4 text-black" />
            Statistik Login
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAT_CARDS.map((item, idx) => (
            <div
              key={item.key}
              className="rounded-md border-2 border-black bg-white p-3 transition-colors hover:bg-neutral-100"
            >
              <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                {item.label}
              </p>
              <p
                className={`mt-1 text-xl leading-tight font-bold tabular-nums ${
                  idx === 1
                    ? 'text-black'
                    : idx === 2
                      ? 'text-amber-600'
                      : idx === 3
                        ? 'text-emerald-600'
                        : 'text-black'
                }`}
              >
                {stats[item.key]}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(stats.byRole).map(([role, count]) => (
            <div
              key={role}
              className="flex items-center justify-between gap-2 rounded-md border-2 border-black bg-white px-3 py-1.5"
            >
              <span
                className={`rounded-md border-2 px-1.5 py-0.5 font-mono text-[10px] font-bold ${roleBadgeClass[role] || roleBadgeClass.guest}`}
              >
                {roleLabel[role] || role}
              </span>
              <span className="text-xs font-bold text-black tabular-nums">{count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── GRAFIK TAMU 7 HARI ── */}
      <section className="rounded-md border-2 border-black bg-white p-4">
        <div className="mb-3 border-b-2 border-black pb-2">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
            <Users className="h-4 w-4 text-black" />
            Grafik Tamu 7 Hari Terakhir
          </h3>
        </div>
        <div className="flex items-end gap-2">
          {stats.last7Days.map((day) => {
            const max = Math.max(...stats.last7Days.map((d) => d.count), 1);
            const height = Math.max((day.count / max) * 120, 4);
            const isToday = day.date === today;
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-bold text-black tabular-nums">{day.count}</span>
                <div
                  className={`w-full rounded-sm border border-black ${isToday ? 'bg-blue-600' : 'bg-black/20'}`}
                  style={{ height: `${height}px`, minHeight: '4px' }}
                />
                <span className="font-mono text-[10px] font-bold text-black/60">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── RIWAYAT LOGIN ── */}
      <section className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex flex-col justify-between gap-2 border-b-2 border-black bg-white p-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
              <History className="h-4 w-4 text-black" />
              Riwayat Login
            </h3>
            <p className="mt-0.5 text-[10px] font-bold text-black/60">1000 login terakhir</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-black/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="w-48 rounded-md border-2 border-black bg-white py-1.5 pr-2 pl-8 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              <option value="all">Semua Role</option>
              <option value="teacher">Guru</option>
              <option value="student">Siswa</option>
              <option value="parent">Orang Tua</option>
              <option value="guest">Tamu</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-black bg-white">
              <tr className="text-xs font-bold tracking-wider text-black uppercase">
                <th className="px-3 py-2">Waktu</th>
                <th className="px-3 py-2">Nama</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Metode</th>
                <th className="px-3 py-2">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-xs font-bold text-black/50">
                    Belum ada riwayat login.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-neutral-100">
                    <td className="px-3 py-2.5 text-black/70">
                      {new Date(log.timestamp).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-black">{log.name}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`rounded-md border-2 px-1.5 py-0.5 font-mono text-[10px] font-bold ${roleBadgeClass[log.role] || roleBadgeClass.guest}`}
                      >
                        {roleLabel[log.role] || log.role}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-black/70">
                      {log.method === 'google' ? 'Google' : 'Form'}
                    </td>
                    <td className="px-3 py-2.5 text-black/70">{log.email || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
