import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getTeacherByUser,
  getClasses,
  getStudentsByClass,
  getAttendanceByDateRange,
  getSchoolAnnouncements,
} from '../../data/services';
import {
  Users,
  ClipboardList,
  BarChart3,
  BookOpenCheck,
  NotebookPen,
  ChevronRight,
  Megaphone,
  UserCheck,
  UserX,
  GraduationCap,
  ArrowRightLeft,
  TrendingUp,
} from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { kehadiranBadgeClass } from '../../utils/kehadiran';
import { PageProps, StudentStatus } from '../../types';

const STATUS_META: Record<StudentStatus, { label: string; icon: typeof UserCheck; cls: string }> = {
  aktif: {
    label: 'Aktif',
    icon: UserCheck,
    cls: 'border-2 border-black bg-white text-black',
  },
  keluar: {
    label: 'Keluar',
    icon: UserX,
    cls: 'border-2 border-rose-600 bg-white text-rose-700',
  },
  lulus: {
    label: 'Lulus',
    icon: GraduationCap,
    cls: 'border-2 border-black bg-black text-white',
  },
  pindah: {
    label: 'Pindah',
    icon: ArrowRightLeft,
    cls: 'border-2 border-amber-600 bg-white text-amber-700',
  },
};

export default function DasborWaliKelas({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const loading = storeVersion === 0;

  const teacher = useMemo(
    () => getTeacherByUser(user) ?? null,
    [user, storeVersion]
  );

  const classes = useMemo(
    () => getClasses().filter((c) => c.teacherId === teacher?.id),
    [teacher, storeVersion]
  );

  const monthRange = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return {
      start: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`,
      end: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(last)}`,
      label: now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    };
  }, []);

  const perClass = useMemo(() => {
    return classes.map((c) => {
      const students = getStudentsByClass(c.id);
      const attendance = getAttendanceByDateRange(monthRange.start, monthRange.end, c.id);
      let hadir = 0;
      let izin = 0;
      let sakit = 0;
      let alpha = 0;
      attendance.forEach((a) => {
        if (a.status === 'hadir') hadir += 1;
        else if (a.status === 'izin') izin += 1;
        else if (a.status === 'sakit') sakit += 1;
        else if (a.status === 'alpha') alpha += 1;
      });
      const total = hadir + izin + sakit + alpha;

      const statusCount: Record<StudentStatus, number> = {
        aktif: 0,
        keluar: 0,
        lulus: 0,
        pindah: 0,
      };
      students.forEach((s) => {
        statusCount[s.status ?? 'aktif'] += 1;
      });

      return {
        kelas: c,
        siswa: students.length,
        laki: students.filter((s) => s.gender === 'L').length,
        perempuan: students.filter((s) => s.gender === 'P').length,
        hadir,
        izin,
        sakit,
        alpha,
        total,
        percentage: total > 0 ? Math.round((hadir / total) * 100) : 0,
        statusCount,
      };
    });
  }, [classes, monthRange, storeVersion]);

  const overall = useMemo(() => {
    const statusCount: Record<StudentStatus, number> = { aktif: 0, keluar: 0, lulus: 0, pindah: 0 };
    let siswa = 0;
    let laki = 0;
    let perempuan = 0;
    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alpha = 0;
    let total = 0;

    perClass.forEach((c) => {
      siswa += c.siswa;
      laki += c.laki;
      perempuan += c.perempuan;
      hadir += c.hadir;
      izin += c.izin;
      sakit += c.sakit;
      alpha += c.alpha;
      total += c.total;
      (Object.keys(statusCount) as StudentStatus[]).forEach((k) => {
        statusCount[k] += c.statusCount[k];
      });
    });

    return {
      siswa,
      laki,
      perempuan,
      hadir,
      izin,
      sakit,
      alpha,
      total,
      percentage: total > 0 ? Math.round((hadir / total) * 100) : 0,
      statusCount,
    };
  }, [perClass]);

  const announcements = useMemo(() => getSchoolAnnouncements().slice(0, 4), [storeVersion]);

  const quickLinks = [
    {
      id: 'student-management',
      label: 'Kelola Siswa',
      desc: 'Data & mutasi siswa kelas binaan',
      icon: Users,
    },
    {
      id: 'rekap-nilai',
      label: 'Rekap Nilai',
      desc: 'Matriks nilai & ketuntasan',
      icon: BarChart3,
    },
    {
      id: 'rapot-input',
      label: 'Input Rapot',
      desc: 'Input nilai rapot siswa',
      icon: BookOpenCheck,
    },
    {
      id: 'jurnal-mengajar',
      label: 'Jurnal Mengajar',
      desc: 'Catatan mengajar harian',
      icon: NotebookPen,
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 antialiased">
        <div className="h-24 animate-pulse rounded-md border-2 border-black bg-white" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-md border-2 border-black bg-white" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-md border-2 border-black bg-white" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-lg leading-none font-bold tracking-tight text-black">
            Dashboard Wali Kelas
          </h1>
          <p className="mt-1.5 text-xs leading-none font-bold text-black">
            Ringkasan kelas binaan {teacher ? `— ${teacher.name}` : ''}. Rekap siswa, status mutasi,
            dan kehadiran bulan ini.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black sm:self-end">
          <TrendingUp className="h-4 w-4 text-black" />
          {classes.length} Kelas Binaan
        </div>
      </header>

      {/* QUICK LINKS */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavigate?.(link.id)}
              className="group flex items-center gap-3 rounded-md border-2 border-black bg-white p-4 text-left transition-colors hover:bg-neutral-100"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
                <Icon className="h-5 w-5 text-black" />
              </span>
              <span className="flex-1">
                <span className="block text-xs font-bold tracking-wider text-black uppercase">
                  {link.label}
                </span>
                <span className="mt-0.5 block text-[10px] font-bold text-black/60">
                  {link.desc}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-black transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        })}
      </div>

      {/* OVERALL STATS */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Siswa Aktif', value: overall.siswa, icon: Users },
          { label: 'Laki-laki', value: overall.laki, icon: UserCheck },
          { label: 'Perempuan', value: overall.perempuan, icon: Users },
          { label: 'Hadir Bulan Ini', value: overall.hadir, icon: ClipboardList },
          {
            label: 'Absen (I/S/A)',
            value: overall.izin + overall.sakit + overall.alpha,
            icon: UserX,
          },
          { label: 'Rata-rata Kehadiran', value: `${overall.percentage}%`, icon: TrendingUp },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-md border-2 border-black bg-white p-4">
              <div className="flex items-center justify-between border-b-2 border-black/10 pb-1">
                <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-black" />
              </div>
              <p className="mt-2 text-xl leading-tight font-bold text-black">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* STATUS MUTASI REKAP */}
      <div className="flex flex-wrap items-center gap-2.5">
        {(Object.keys(STATUS_META) as StudentStatus[]).map((key) => {
          const meta = STATUS_META[key];
          const Icon = meta.icon;
          return (
            <div
              key={key}
              className={`flex items-center gap-1.5 rounded-md border-2 px-3.5 py-1.5 text-xs font-bold ${meta.cls}`}
            >
              <span className="min-w-[20px] rounded-md border-2 border-black bg-white px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-black">
                {overall.statusCount[key]}
              </span>
              <Icon className="h-3.5 w-3.5" />
              <span>{meta.label}</span>
            </div>
          );
        })}
        <span className="ml-auto text-[10px] font-bold text-black/60">
          Periode kehadiran: {monthRange.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* PER-CLASS MATRIX */}
        <div className="rounded-md border-2 border-black bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
            <h2 className="text-xs font-bold tracking-wider text-black uppercase">
              Rekap per Kelas Binaan
            </h2>
            <button
              type="button"
              onClick={() => onNavigate?.('student-management')}
              className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
            >
              Kelola Siswa <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="border-b-2 border-black bg-white">
                <tr className="text-xs font-bold tracking-wider text-black uppercase">
                  <th className="px-4 py-2 text-left">Kelas</th>
                  <th className="px-2 py-2 text-center">Siswa</th>
                  <th className="px-2 py-2 text-center">L</th>
                  <th className="px-2 py-2 text-center">P</th>
                  <th className="px-2 py-2 text-center">H</th>
                  <th className="px-2 py-2 text-center">I</th>
                  <th className="px-2 py-2 text-center">S</th>
                  <th className="px-2 py-2 text-center">A</th>
                  <th className="px-2 py-2 text-center">% Hadir</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
                {perClass.map((c) => (
                  <tr key={c.kelas.id} className="transition-colors hover:bg-neutral-100">
                    <td className="px-4 py-2 text-xs font-bold tracking-tight text-black uppercase">
                      {c.kelas.name}
                    </td>
                    <td className="px-2 py-2 text-center text-xs font-bold text-black">
                      {c.siswa}
                    </td>
                    <td className="px-2 py-2 text-center text-xs font-bold text-black">{c.laki}</td>
                    <td className="px-2 py-2 text-center text-xs font-bold text-black">
                      {c.perempuan}
                    </td>
                    <td className="px-2 py-2 text-center text-xs font-bold text-black">
                      {c.hadir}
                    </td>
                    <td className="px-2 py-2 text-center text-xs font-semibold text-black/70">
                      {c.izin}
                    </td>
                    <td className="px-2 py-2 text-center text-xs font-semibold text-black/70">
                      {c.sakit}
                    </td>
                    <td className="px-2 py-2 text-center text-xs font-semibold text-black/50">
                      {c.alpha}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`inline-flex rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${kehadiranBadgeClass(
                          c.percentage
                        )}`}
                      >
                        {c.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}

                {perClass.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-14 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md border-2 border-dashed border-black bg-white text-black">
                        <Users className="h-5 w-5" />
                      </div>
                      <h3 className="text-xs font-bold text-black">Belum ada kelas binaan</h3>
                      <p className="mt-0.5 text-[10px] font-bold text-black/60">
                        Anda belum ditetapkan sebagai wali kelas. Hubungi admin untuk menetapkan
                        kelas binaan pada akun Anda.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ANNOUNCEMENTS */}
        <div className="rounded-md border-2 border-black bg-white">
          <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
            <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
              <Megaphone className="h-4 w-4 text-black" />
              Pengumuman Terbaru
            </h2>
            <button
              type="button"
              onClick={() => onNavigate?.('school-announcements')}
              className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
            >
              Lihat Semua <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y-2 divide-black/10">
            {announcements.map((a) => (
              <div key={a.id} className="px-4 py-3 transition-colors hover:bg-neutral-100">
                <h3 className="text-xs font-bold text-black">{a.title}</h3>
                <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed font-bold text-black/70">
                  {a.content}
                </p>
                <p className="mt-1.5 font-mono text-[10px] font-bold text-black/60">
                  {new Date(a.date + 'T00:00:00').toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}

            {announcements.length === 0 && (
              <div className="px-4 py-14 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md border-2 border-dashed border-black bg-white text-black">
                  <Megaphone className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-black">Belum ada pengumuman</h3>
                <p className="mt-0.5 text-[10px] font-bold text-black/60">
                  Pengumuman sekolah akan tampil di sini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
