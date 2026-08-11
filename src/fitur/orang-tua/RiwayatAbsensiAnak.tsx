import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudents, getAttendanceByStudent, type AttendanceEntry } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { User, Calendar, Clock, Info } from 'lucide-react';
import { DonutChart, BarChart } from '../../components/ui';

const STATUS_SEGMENTS = [
  { key: 'hadir', label: 'Hadir', color: '#15803d' },
  { key: 'izin', label: 'Izin', color: '#0e7490' },
  { key: 'sakit', label: 'Sakit', color: '#a16207' },
  { key: 'alpha', label: 'Alpha', color: '#b91c1c' },
] as const;

export default function RiwayatAbsensiAnak({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const studentId = user?.id.replace('p_', '');

  const [monthFilter, setMonthFilter] = useState('');

  const student = useMemo(
    () => getStudents().find((s) => s.id === studentId),
    [studentId, storeVersion]
  );

  const allAttendance = useMemo(() => {
    if (!studentId) return [];
    return getAttendanceByStudent(studentId).sort((a, b) => b.date.localeCompare(a.date));
  }, [studentId, storeVersion]);

  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    allAttendance.forEach((a) => set.add(a.date.slice(0, 7)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [allAttendance]);

  const filtered = useMemo(() => {
    if (!monthFilter) return allAttendance;
    return allAttendance.filter((a) => a.date.startsWith(monthFilter));
  }, [allAttendance, monthFilter]);

  const breakdown = useMemo(() => {
    const hitung = (status: string) =>
      filtered.filter((a) => a.status.toLowerCase() === status).length;
    return {
      hadir: hitung('hadir'),
      izin: hitung('izin'),
      sakit: hitung('sakit'),
      alpha: hitung('alpha') + hitung('alpa'),
      total: filtered.length,
    };
  }, [filtered]);

  const attendanceRate =
    filtered.length > 0 ? Math.round((breakdown.hadir / filtered.length) * 100) : 0;

  const barData = STATUS_SEGMENTS.map((s) => ({
    label: s.label,
    value: breakdown[s.key],
    color: s.color,
  }));

  const statusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hadir':
        return 'Hadir';
      case 'izin':
        return 'Izin';
      case 'sakit':
        return 'Sakit';
      case 'alpha':
      case 'alpa':
        return 'Alpha';
      default:
        return '-';
    }
  };

  const statusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hadir':
        return 'border-black bg-black text-white';
      case 'izin':
        return 'border-black bg-cyan-700 text-white';
      case 'sakit':
        return 'border-black bg-amber-700 text-white';
      case 'alpha':
      case 'alpa':
        return 'border-black bg-red-700 text-white';
      default:
        return 'border-black bg-white text-black';
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── HEADER ENTITAS ──────────────── */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
            <Calendar className="h-7 w-7 stroke-[2] text-black" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Akun Orang Tua / Wali
            </p>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black">
              Riwayat Absensi Anak
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md border-2 border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                Wali Dari: {student?.name || '-'}
              </span>
              <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
                NIS: {student?.nis || '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:self-end">
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Presensi
            </p>
            <p className="text-xl leading-tight font-bold text-black">{attendanceRate}%</p>
          </div>
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Hari Tercatat
            </p>
            <p className="text-xl leading-tight font-bold text-black">{breakdown.total}</p>
          </div>
        </div>
      </header>

      {/* ── FILTER BULAN ──────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border-2 border-black bg-white p-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-black" />
          <span className="text-xs font-bold tracking-wider text-black uppercase">
            Filter Rentang Bulan
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="rounded-md border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black"
          >
            <option value="">Semua Bulan</option>
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {new Date(`${m}-01T00:00:00`).toLocaleDateString('id-ID', {
                  month: 'long',
                  year: 'numeric',
                })}
              </option>
            ))}
          </select>
          {monthFilter && (
            <button
              type="button"
              onClick={() => setMonthFilter('')}
              className="rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── CHART ROW ──────────────── */}
      {filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border-2 border-black bg-white p-4">
            <h3 className="mb-3 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
              Komposisi Kehadiran
            </h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <DonutChart
                segments={STATUS_SEGMENTS.map((s) => ({
                  label: s.label,
                  value: Math.max(breakdown[s.key], 0),
                  color: s.color,
                }))}
                centerLabel={`${attendanceRate}%`}
                centerSubLabel="Kehadiran"
                size={140}
                strokeWidth={20}
              />
              <div className="flex flex-col gap-2 text-xs font-bold text-black">
                {STATUS_SEGMENTS.map((s) => (
                  <div key={s.key} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-sm border border-black"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="font-bold text-black">{s.label}:</span>
                    <span className="font-bold text-black">{breakdown[s.key]} hari</span>
                  </div>
                ))}
                <div className="mt-1 border-t-2 border-black/10 pt-1.5 text-xs text-black">
                  Total: {breakdown.total} hari tercatat
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border-2 border-black bg-white p-4">
            <h3 className="mb-3 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
              Rekap Status Per Jenis
            </h3>
            <BarChart data={barData} height={160} maxBarWidth={40} showValues={true} />
          </div>
        </div>
      )}

      {/* ── TABEL RIWAYAT ──────────────── */}
      <div className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex items-center justify-between gap-2 border-b-2 border-black bg-white p-3">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
            <Info className="h-4 w-4 text-black" />
            Riwayat Absensi Harian
          </h3>
          <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
            {filtered.length} Entri
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-black bg-white">
              <tr className="text-xs font-bold tracking-wider text-black uppercase">
                <th className="px-3 py-2">Tanggal</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-center">Jam</th>
                <th className="px-3 py-2">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {filtered.length > 0 ? (
                filtered.map((a: AttendanceEntry) => (
                  <tr key={a.id} className="transition-colors hover:bg-neutral-100">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-black" />
                        <span className="font-mono text-black">{a.date}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-block rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass(a.status)}`}
                      >
                        {statusLabel(a.status)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-black">
                      {new Date(a.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-black/70">{a.note || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-xs font-bold text-black">
                    {allAttendance.length === 0
                      ? 'Belum ada data absensi untuk anak ini'
                      : 'Tidak ada data absensi pada bulan yang dipilih'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-black bg-white p-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-black" />
          <p className="text-[10px] font-bold tracking-wider text-black uppercase">
            Data pemantauan diambil langsung dari catatan absensi anak. Hubungi wali kelas untuk
            pertanyaan lebih lanjut.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.('personal-messages')}
          className="shrink-0 rounded-md border-2 border-black bg-black px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-900"
        >
          Chat Wali Kelas
        </button>
      </div>
    </div>
  );
}
