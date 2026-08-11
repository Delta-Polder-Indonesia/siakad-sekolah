import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAttendance,
  getClasses,
  getClassRosters,
  getStudents,
  getTeacherByUser,
} from '../../data/services';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  XCircle,
  HelpCircle,
  Calendar,
  BookOpen,
  MapPin,
  ChevronRight,
  UserPlus,
  FileText,
  ClipboardList,
  Bell,
} from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import HalamanRpsGuru from './HalamanRpsGuru';
import { PageProps } from '../../types';
import { Skeleton, TableSkeleton, DonutChart, BarChart, QuickActions, StatCard } from '../../components/ui';

type JadwalHariIni = {
  no: number;
  classId: string;
  className: string;
  mataPelajaran: string;
  ruang: string;
  hari: string;
  waktu: string;
};

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function DasborGuru({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [notice, setNotice] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<JadwalHariIni | null>(null);
  const loading = storeVersion === 0;

  const teacher = useMemo(
    () => getTeacherByUser(user) ?? null,
    [user, storeVersion]
  );

  const classIds = teacher?.classIds ?? [];

  const stats = useMemo(() => {
    const students = getStudents().filter(
      (item) =>
        classIds.includes(item.classId) &&
        item.status !== 'keluar' &&
        item.status !== 'lulus' &&
        item.status !== 'pindah'
    );
    const allAttendance = getAttendance().filter((item) => classIds.includes(item.classId));
    const today = new Date().toISOString().slice(0, 10);
    const todayAtt = allAttendance.filter((item) => item.date === today);

    const latestPerStudent = new Map<string, (typeof todayAtt)[number]>();
    todayAtt.forEach((item) => {
      latestPerStudent.set(item.studentId, item);
    });

    const statuses = Array.from(latestPerStudent.values());
    const totalStudents = students.length;
    const todayHadir = statuses.filter((item) => item.status.toLowerCase() === 'hadir').length;
    const todayIzin = statuses.filter((item) => item.status.toLowerCase() === 'izin').length;
    const todaySakit = statuses.filter((item) => item.status.toLowerCase() === 'sakit').length;
    const todayAlpha = statuses.filter(
      (item) => item.status.toLowerCase() === 'alpha' || item.status.toLowerCase() === 'alpa'
    ).length;
    const todayBelum = Math.max(0, totalStudents - statuses.length);

    return { totalStudents, todayHadir, todayIzin, todaySakit, todayAlpha, todayBelum };
  }, [classIds, storeVersion]);

  const jadwalMengajar = useMemo(() => {
    const todayDay = new Date().getDay();
    const classes = getClasses().filter((item) => classIds.includes(item.id));

    const rows: JadwalHariIni[] = [];
    classes.forEach((classItem) => {
      const rosters = getClassRosters(classItem.id);
      rosters.forEach((roster) => {
        if ((roster.dayOfWeek ?? todayDay) !== todayDay) return;
        rows.push({
          no: rows.length + 1,
          classId: classItem.id,
          className: classItem.name,
          mataPelajaran: roster.subject || teacher?.subject || 'Mata Pelajaran',
          ruang: roster.room || 'Belum ditentukan',
          hari: DAY_NAMES[todayDay],
          waktu: `${roster.startTime || '--:--'} - ${roster.endTime || '--:--'}`,
        });
      });
    });

    if (rows.length === 0 && classes.length > 0) {
      rows.push({
        no: 1,
        classId: classes[0].id,
        className: classes[0].name,
        mataPelajaran: teacher?.subject || 'Mata Pelajaran',
        ruang: 'Belum dijadwalkan',
        hari: DAY_NAMES[todayDay],
        waktu: 'Silakan cek roster',
      });
    }

    return rows;
  }, [classIds, teacher?.subject, storeVersion]);

  if (selectedSchedule && teacher) {
    return (
      <HalamanRpsGuru
        teacherId={teacher.id}
        classId={selectedSchedule.classId}
        className={selectedSchedule.className}
        subject={selectedSchedule.mataPelajaran}
        onBack={() => setSelectedSchedule(null)}
        setNotice={setNotice}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER UTAMA */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-lg leading-none font-bold tracking-tight text-black">Dasbor Guru</h1>
          <p className="mt-1.5 text-xs leading-none font-bold text-black">
            Ringkasan kelas, mata pelajaran, dan ruang mengajar hari ini.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black sm:self-end">
          {loading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <span className="uppercase">{user?.name || '-'}</span>
          )}
        </div>
      </header>

      {/* METRIK PRESENSI */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {loading ? (
          <>
            {[
              'Total Siswa Binaan',
              'Hadir Hari Ini',
              'Izin',
              'Sakit',
              'Alpa',
              'Belum Presensi',
            ].map((label) => (
              <StatCard key={label} label={label} loading />
            ))}
          </>
        ) : (
          <>
            {[
              {
                label: 'Total Siswa Binaan',
                value: stats.totalStudents,
                icon: Users,
                alert: false,
              },
              { label: 'Hadir Hari Ini', value: stats.todayHadir, icon: CheckCircle, alert: false },
              { label: 'Izin', value: stats.todayIzin, icon: AlertCircle, alert: false },
              { label: 'Sakit', value: stats.todaySakit, icon: Clock, alert: false },
              { label: 'Alpa', value: stats.todayAlpha, icon: XCircle, alert: true },
              {
                label: 'Belum Presensi',
                value: stats.todayBelum,
                icon: HelpCircle,
                alert: stats.todayBelum > 0,
              },
            ].map((card) => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                icon={card.icon}
                alert={card.alert}
              />
            ))}{' '}
          </>
        )}
      </div>

      {/* ── CHART ROW ── */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Donut Chart: Distribusi Presensi */}
          <div className="rounded-md border-2 border-black bg-white p-4">
            <h3 className="mb-3 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
              Distribusi Presensi Hari Ini
            </h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <DonutChart
                segments={[
                  { label: 'Hadir', value: stats.todayHadir, color: '#2563eb' },
                  { label: 'Izin', value: stats.todayIzin, color: '#000000' },
                  { label: 'Sakit', value: stats.todaySakit, color: '#525252' },
                  { label: 'Alpha', value: stats.todayAlpha, color: '#b91c1c' },
                  { label: 'Belum', value: stats.todayBelum, color: '#a3a3a3' },
                ]}
                centerLabel={`${stats.totalStudents}`}
                centerSubLabel="Total Siswa"
                size={140}
                strokeWidth={20}
              />
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold text-black">
                {[
                  { label: 'Hadir', value: stats.todayHadir, color: 'bg-blue-600' },
                  { label: 'Izin', value: stats.todayIzin, color: 'bg-black' },
                  { label: 'Sakit', value: stats.todaySakit, color: 'bg-neutral-600' },
                  { label: 'Alpha', value: stats.todayAlpha, color: 'bg-red-600' },
                  { label: 'Belum', value: stats.todayBelum, color: 'bg-neutral-300' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-sm border border-black ${item.color}`} />
                    <span>{item.label}:</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart: Perbandingan Status */}
          <div className="rounded-md border-2 border-black bg-white p-4">
            <h3 className="mb-3 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
              Perbandingan Status
            </h3>
            <BarChart
              data={[
                { label: 'Hadir', value: stats.todayHadir, color: '#2563eb' },
                { label: 'Izin', value: stats.todayIzin, color: '#000000' },
                { label: 'Sakit', value: stats.todaySakit, color: '#525252' },
                { label: 'Alpha', value: stats.todayAlpha, color: '#b91c1c' },
                { label: 'Belum', value: stats.todayBelum, color: '#a3a3a3' },
              ]}
              height={150}
              maxBarWidth={48}
              showValues={true}
            />
          </div>
        </div>
      )}

      {/* ── QUICK ACTIONS ── */}
      {!loading && (
        <div className="pt-1">
          <QuickActions
            actions={[
              {
                id: 'attendance',
                label: 'Input Absensi',
                icon: ClipboardList,
              },
              {
                id: 'grades',
                label: 'Input Nilai',
                icon: FileText,
              },
              {
                id: 'student-management',
                label: 'Kelola Siswa',
                icon: UserPlus,
              },
              {
                id: 'announcement',
                label: 'Buat Pengumuman',
                icon: Bell,
              },
            ]}
            onAction={(id) => onNavigate?.(id)}
          />
        </div>
      )}

      <section className="space-y-2">
        <div className="flex items-center gap-2 border-b-2 border-black pb-1">
          <Calendar className="h-4 w-4 text-black" />
          <h2 className="text-xs font-bold tracking-wider text-black uppercase">
            Informasi Kelas Mengajar Hari Ini & Modul RPS
          </h2>
        </div>

        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : (
          <div className="overflow-x-auto rounded-md border-2 border-black bg-white">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b-2 border-black bg-white">
                <tr className="text-xs font-bold tracking-wider text-black uppercase">
                  <th className="w-12 px-3 py-2 text-center">No.</th>
                  <th className="px-3 py-2">Mata Pelajaran / Kelas</th>
                  <th className="w-32 px-3 py-2">Ruang</th>
                  <th className="w-28 px-3 py-2">Hari</th>
                  <th className="w-36 px-3 py-2">Waktu</th>
                  <th className="w-28 px-3 py-2 text-center">RPS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
                {jadwalMengajar.map((item) => (
                  <tr
                    key={`${item.classId}-${item.mataPelajaran}-${item.waktu}`}
                    className="transition-colors hover:bg-neutral-100"
                  >
                    <td className="px-3 py-2 text-center font-mono">{item.no}</td>
                    <td className="space-y-1 px-3 py-2">
                      <p className="text-xs font-bold tracking-tight text-black">
                        {item.mataPelajaran}
                      </p>
                      <span className="inline-block rounded-md border-2 border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black">
                        Kelas : {item.className}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-medium">
                      <div className="flex items-center gap-1 text-black">
                        <MapPin className="h-3.5 w-3.5 text-black" />
                        <span>{item.ruang}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-bold text-black">{item.hari}</td>
                    <td className="px-3 py-2 font-mono font-medium tracking-tight text-black">
                      {item.waktu}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedSchedule(item)}
                        className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-3 py-1.5 text-[10px] font-bold tracking-wider text-black uppercase transition-colors hover:border-black hover:bg-neutral-100"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>RPS</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {jadwalMengajar.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-xs font-bold text-black">
                      Tidak ada jadwal mengajar hari ini.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {notice ? (
        <p className="rounded-md border-2 border-black bg-white p-2 text-xs font-bold text-black">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
