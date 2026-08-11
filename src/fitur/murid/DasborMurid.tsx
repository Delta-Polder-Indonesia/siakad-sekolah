import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClassAnnouncements,
  getClassRosters,
  getClasses,
  getStudentByUser,
  getAttendanceByStudent,
  getTeachers,
} from '../../data/services';
import { Megaphone, Calendar, Users, ClipboardList, Send, CreditCard } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { PageProps } from '../../types';
import { Skeleton, TableSkeleton, DonutChart, BarChart } from '../../components/ui';

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function StudentDashboard({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState(() => new Date().getDay());

  useEffect(() => {
    let intervalId: number | undefined;
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    const timeout = window.setTimeout(() => {
      setCurrentDayOfWeek(new Date().getDay());
      intervalId = window.setInterval(
        () => {
          setCurrentDayOfWeek(new Date().getDay());
        },
        24 * 60 * 60 * 1000
      );
    }, msUntilMidnight);

    return () => {
      window.clearTimeout(timeout);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  const student = useMemo(() => getStudentByUser(user), [user, storeVersion]);
  const className = useMemo(() => {
    if (!student) return '';
    return getClasses().find((c) => c.id === student.classId)?.name || '';
  }, [student, storeVersion]);

  const allAttendance = useMemo(() => {
    if (!student) return [];
    return getAttendanceByStudent(student.id).sort((a, b) => b.date.localeCompare(a.date));
  }, [student, storeVersion]);

  const classRosters = useMemo(() => {
    if (!student) return [];
    return getClassRosters(student.classId);
  }, [student, storeVersion]);

  const classAnnouncements = useMemo(() => {
    if (!student) return [];
    return getClassAnnouncements(student.classId);
  }, [student, storeVersion]);

  const teachersList = useMemo(() => getTeachers(), [storeVersion]);

  const stats = useMemo(() => {
    const hadir = allAttendance.filter((a) => a.status === 'hadir').length;
    const izin = allAttendance.filter((a) => a.status === 'izin').length;
    const sakit = allAttendance.filter((a) => a.status === 'sakit').length;
    const alpha = allAttendance.filter((a) => a.status === 'alpha').length;
    const total = hadir + izin + sakit + alpha;
    const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;
    return { hadir, izin, sakit, alpha, total, percentage };
  }, [allAttendance]);

  const todayRosters = useMemo(
    () =>
      classRosters
        .filter((item) => item.dayOfWeek === currentDayOfWeek)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [classRosters, currentDayOfWeek]
  );

  const todayRosterRows = useMemo(() => {
    if (currentDayOfWeek === 0) return [];
    const minimumPeriods = 6;
    const totalRows = Math.max(minimumPeriods, todayRosters.length);
    return Array.from({ length: totalRows }, (_, index) => ({
      periodLabel: `JP ${index + 1}`,
      roster: todayRosters[index],
    }));
  }, [todayRosters, currentDayOfWeek]);

  const loading = storeVersion === 0;

  // Configuration untuk Aksi Cepat (Quick Actions) dengan gaya Neubrutalism Flat
  const quickActionItems = [
    {
      id: 'tasks',
      label: 'Kantong Tugas',
      icon: ClipboardList,
    },
    {
      id: 'roster',
      label: 'Jadwal Kelas',
      icon: Calendar,
    },
    {
      id: 'letters-student',
      label: 'Buat Surat Izin',
      icon: Send,
    },
    {
      id: 'billing',
      label: 'Tagihan',
      icon: CreditCard,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER UTAMA */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div>
          {loading ? (
            <Skeleton className="h-5 w-48" />
          ) : (
            <h1 className="text-lg leading-none font-bold tracking-tight text-black">
              {student?.name}
            </h1>
          )}
          <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-black">
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <>
                <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 text-black">
                  NIS {student?.nis}
                </span>
                <span>&bull;</span>
                <span className="font-bold text-black">Kelas {className}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black sm:self-end">
          <Calendar className="h-4 w-4 text-black" />
          <span>
            {dayNames[currentDayOfWeek]},{' '}
            {new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </header>

      {/* METRIK PERFORMA */}
      <section className="mb-3 rounded-md border-2 border-black bg-white p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {loading ? (
            <>
              <div className="space-y-2 pr-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-2 pr-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-2 pr-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="space-y-2 pr-2">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-10" />
              </div>
            </>
          ) : (
            <>
              <div className="border-r-2 border-black/10 pr-2 last:border-0">
                <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Rasio Hadir
                </span>
                <span className="flex items-baseline gap-1 text-xl leading-tight font-bold text-black">
                  {stats.percentage}
                  <span className="text-xs font-bold text-black">%</span>
                </span>
              </div>
              <div className="border-r-2 border-black/10 pr-2 last:border-0">
                <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Hadir (Hari)
                </span>
                <span className="flex items-baseline gap-1 text-xl leading-tight font-bold text-black">
                  {stats.hadir}
                  <span className="text-xs font-bold text-black">/ {stats.total} total</span>
                </span>
              </div>
              <div className="border-r-2 border-black/10 pr-2 last:border-0">
                <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Sakit
                </span>
                <span className="block text-xl leading-tight font-bold text-black">
                  {stats.sakit}
                </span>
              </div>
              <div className="border-r-2 border-black/10 pr-2 last:border-0">
                <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Izin
                </span>
                <span className="block text-xl leading-tight font-bold text-black">
                  {stats.izin}
                </span>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Alpha
                </span>
                <span className="block text-xl leading-tight font-bold text-black">
                  {stats.alpha}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CHART ROW */}
      {!loading && (
        <div className="grid gap-4 pt-2 md:grid-cols-2">
          {/* Donut Chart: Rasio Kehadiran */}
          <div className="rounded-md border-2 border-black bg-white p-4">
            <h3 className="mb-3 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
              Rasio Kehadiran
            </h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <DonutChart
                segments={[
                  { label: 'Hadir', value: Math.max(stats.hadir, 0), color: '#2563eb' },
                  { label: 'Izin', value: Math.max(stats.izin, 0), color: '#000000' },
                  { label: 'Sakit', value: Math.max(stats.sakit, 0), color: '#525252' },
                  { label: 'Alpha', value: Math.max(stats.alpha, 0), color: '#a3a3a3' },
                ]}
                centerLabel={`${stats.percentage}%`}
                centerSubLabel="Kehadiran"
                size={140}
                strokeWidth={20}
              />
              <div className="flex flex-col gap-2 text-xs font-bold text-black">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-black bg-blue-600" />
                  <span>Hadir:</span>
                  <span className="font-bold">{stats.hadir} hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-black bg-black" />
                  <span>Izin:</span>
                  <span className="font-bold">{stats.izin} hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-black bg-neutral-600" />
                  <span>Sakit:</span>
                  <span className="font-bold">{stats.sakit} hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-black bg-neutral-300" />
                  <span>Alpha:</span>
                  <span className="font-bold">{stats.alpha} hari</span>
                </div>
                <div className="mt-1 border-t-2 border-black/10 pt-1.5 text-xs text-black">
                  Total: {stats.total} hari tercatat
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart Overview */}
          <div className="rounded-md border-2 border-black bg-white p-4">
            <h3 className="mb-3 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
              Rekap Kehadiran
            </h3>
            <BarChart
              data={[
                { label: 'Hadir', value: stats.hadir, color: '#2563eb' },
                { label: 'Izin', value: stats.izin, color: '#000000' },
                { label: 'Sakit', value: stats.sakit, color: '#525252' },
                { label: 'Alpha', value: stats.alpha, color: '#a3a3a3' },
              ]}
              height={150}
              maxBarWidth={48}
              showValues={true}
            />
          </div>
        </div>
      )}

      {/* AKSI Cepat (QUICK ACTIONS - REFACTORED TO FLAT NEUBRUTALISM) */}
      {!loading && (
        <div className="pt-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActionItems.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => onNavigate?.(action.id)}
                  className="flex items-center justify-center gap-2.5 rounded-md border-2 border-black bg-white px-4 py-3 text-xs font-bold text-black transition-colors hover:bg-neutral-100 focus:outline-none"
                >
                  <Icon className="h-4 w-4 shrink-0 text-black" />
                  <span className="truncate">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GRID KONTEN UTAMA */}
      <div className="grid items-start gap-4 lg:grid-cols-12">
        {/* JADWAL HARI INI */}
        <section className="lg:col-span-8">
          <div className="mb-2 border-b-2 border-black pb-1">
            <h2 className="text-xs font-bold tracking-wider text-black uppercase">
              Jadwal Kelas Hari Ini
            </h2>
          </div>

          {loading ? (
            <TableSkeleton rows={6} cols={5} />
          ) : currentDayOfWeek === 0 ? (
            <div className="rounded-md border-2 border-dashed border-black bg-white py-6 text-center text-xs font-bold text-black">
              Tidak ada jadwal pelajaran pada hari Minggu.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border-2 border-black bg-white">
              <table className="w-full table-fixed text-left">
                <thead className="border-b-2 border-black bg-white">
                  <tr className="text-xs font-bold tracking-wider text-black uppercase">
                    <th className="w-16 px-3 py-2">Sesi</th>
                    <th className="w-auto px-3 py-2">Mata Pelajaran</th>
                    <th className="w-28 px-3 py-2">Waktu</th>
                    <th className="w-24 px-3 py-2">Ruang</th>
                    <th className="w-44 px-3 py-2">Guru Pengajar</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
                  {todayRosterRows.map((row) => (
                    <tr
                      key={`${currentDayOfWeek}-${row.periodLabel}`}
                      className="transition-colors hover:bg-neutral-100"
                    >
                      <td className="px-3 py-2 font-mono">{row.periodLabel}</td>
                      <td className="truncate px-3 py-2">
                        {row.roster?.subject || (
                          <span className="font-normal text-black/40">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {row.roster ? `${row.roster.startTime} - ${row.roster.endTime}` : '—'}
                      </td>
                      <td className="px-3 py-2">
                        {row.roster?.room ? (
                          <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px]">
                            {row.roster.room}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="truncate px-3 py-2">{row.roster?.teacherName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentDayOfWeek !== 0 && todayRosters.length === 0 && (
            <div className="mt-2 rounded-md border-2 border-dashed border-black bg-white py-6 text-center text-xs font-bold text-black">
              Belum ada data jadwal pelajaran untuk hari ini.
            </div>
          )}
        </section>

        {/* PENGUMUMAN KELAS */}
        <section className="lg:col-span-4">
          <div className="mb-2 flex items-center gap-2 border-b-2 border-black pb-1">
            <Megaphone className="h-4 w-4 text-black" />
            <h2 className="text-xs font-bold tracking-wider text-black uppercase">
              Pengumuman Kelas
            </h2>
          </div>

          <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
            {loading ? (
              <>
                <div className="rounded-md border-2 border-black bg-white p-3">
                  <div className="mb-2 flex items-start justify-between gap-2 border-b-2 border-black/10 pb-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="mt-1 h-8 w-full" />
                </div>
                <div className="rounded-md border-2 border-black bg-white p-3">
                  <div className="mb-2 flex items-start justify-between gap-2 border-b-2 border-black/10 pb-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="mt-1 h-8 w-full" />
                </div>
              </>
            ) : (
              <>
                {classAnnouncements.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border-2 border-black bg-white p-3 text-xs"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2 border-b-2 border-black/10 pb-1.5">
                      <h3 className="truncate leading-tight font-bold text-black">{item.title}</h3>
                      <span className="shrink-0 rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                        {new Date(item.createdAt || Date.now()).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed font-bold whitespace-pre-line text-black">
                      {item.message}
                    </p>
                  </div>
                ))}

                {classAnnouncements.length === 0 && (
                  <div className="rounded-md border-2 border-dashed border-black bg-white py-6 text-center text-xs font-bold text-black">
                    Tidak ada pengumuman kelas terbaru.
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* DAFTAR NAMA GURU */}
      <section className="mt-4 space-y-2">
        <div className="flex items-center gap-2 border-b-2 border-black pb-1">
          <Users className="h-4 w-4 text-black" />
          <h2 className="text-xs font-bold tracking-wider text-black uppercase">
            Daftar Tenaga Pengajar
          </h2>
        </div>
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <div className="overflow-x-auto rounded-md border-2 border-black bg-white">
            <table className="w-full text-left">
              <thead className="border-b-2 border-black bg-white">
                <tr className="text-xs font-bold tracking-wider text-black uppercase">
                  <th className="w-12 px-3 py-2 text-center">No</th>
                  <th className="px-3 py-2">Nama Guru</th>
                  <th className="px-3 py-2">NIP</th>
                  <th className="px-3 py-2">Mata Pelajaran</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
                {teachersList.map((guru, idx) => (
                  <tr key={guru.id} className="transition-colors hover:bg-neutral-100">
                    <td className="px-3 py-2 text-center font-mono">{idx + 1}</td>
                    <td className="max-w-[160px] truncate px-3 py-2">{guru.name}</td>
                    <td className="px-3 py-2 font-mono">{guru.nip || '-'}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black">
                        {guru.subject}
                      </span>
                    </td>
                    <td className="max-w-[180px] truncate px-3 py-2">{guru.email || '-'}</td>
                    <td className="max-w-[140px] truncate px-3 py-2 font-mono text-xs">
                      {guru.whatsapp || '-'}
                    </td>
                  </tr>
                ))}
                {teachersList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-xs font-bold text-black">
                      Data guru belum tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
