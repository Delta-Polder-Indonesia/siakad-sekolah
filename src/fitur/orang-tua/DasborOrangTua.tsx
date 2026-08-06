import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getStudents,
  getAttendance,
  getTagihanSekolahBySiswa,
  getNilaiRapot,
  getPengumumanAdmin,
  getTeachers,
  getClasses,
  type NilaiRapot,
  type AttendanceEntry,
  type PengumumanAdmin,
} from '../../data/services';
import {
  User,
  Calendar,
  CreditCard,
  BookOpen,
  Bell,
  TrendingUp,
  Clock,
  AlertCircle,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { DonutChart, BarChart, QuickActions } from '../../components/ui';
import { getPredikat, isTuntas, KONFIGURASI_PENILAIAN } from '../../utils/penilaian';
import { exportRapotPdf } from '../../utils/export';

export default function DasborOrangTua({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { user } = useAuth();
  const studentId = user?.id.replace('p_', '');

  const student = useMemo(() => getStudents().find((s) => s.id === studentId), [studentId]);

  const attendance = useMemo(
    () => getAttendance().filter((a) => a.studentId === studentId),
    [studentId]
  );

  const billing = useMemo(
    () => (studentId ? getTagihanSekolahBySiswa(studentId, new Date().getFullYear()) : []),
    [studentId]
  );

  const grades = useMemo(
    () => (studentId ? getNilaiRapot().filter((g) => g.studentId === studentId) : []),
    [studentId]
  );

  const announcements = useMemo(() => getPengumumanAdmin(), []);

  const waliKelas = useMemo(() => {
    if (!student) return null;
    const schoolClass = getClasses().find((c) => c.id === student.classId);
    return getTeachers().find((t) => t.id === schoolClass?.teacherId);
  }, [student]);

  const handleExportPdf = useMemo(() => {
    if (!student || grades.length === 0) return undefined;
    const schoolClass = getClasses().find((c) => c.id === student.classId);
    const ref = grades[0];
    return () =>
      exportRapotPdf(grades, student.name, schoolClass?.name || '-', ref.tahunAjaran, ref.semester);
  }, [student, grades]);

  const attendanceBreakdown = useMemo(() => {
    const hadir = attendance.filter((a) => a.status.toLowerCase() === 'hadir').length;
    const izin = attendance.filter((a) => a.status.toLowerCase() === 'izin').length;
    const sakit = attendance.filter((a) => a.status.toLowerCase() === 'sakit').length;
    const alpha = attendance.filter(
      (a) => a.status.toLowerCase() === 'alpha' || a.status.toLowerCase() === 'alpa'
    ).length;
    return { hadir, izin, sakit, alpha, total: attendance.length };
  }, [attendance]);

  const stats = {
    attendanceRate:
      attendance.length > 0
        ? Math.round((attendanceBreakdown.hadir / attendance.length) * 100)
        : 100,
    unpaidBills: billing.filter((t) => t.status === 'belum_lunas').length,
    averageGrade:
      grades.length > 0
        ? Math.round(grades.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) / grades.length)
        : 0,
  };

  // Grade breakdown for bar chart
  const gradeData = useMemo(() => {
    return grades.slice(0, 10).map((g) => ({
      label: g.mataPelajaran.length > 10 ? g.mataPelajaran.slice(0, 10) + '...' : g.mataPelajaran,
      value: g.nilaiAkhir,
      color:
        g.nilaiAkhir >= KONFIGURASI_PENILAIAN.kkm
          ? '#15803d'
          : g.nilaiAkhir >= KONFIGURASI_PENILAIAN.threshold.D
            ? '#a16207'
            : '#b91c1c',
    }));
  }, [grades]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── HEADER ENTITAS ──────────────── */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
            <User className="h-7 w-7 stroke-[2] text-black" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Akun Orang Tua / Wali
            </p>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black">
              {user?.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md border-2 border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                Wali Dari: {student?.name}
              </span>
              <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
                NIS: {student?.nis}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:self-end">
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Presensi
            </p>
            <p className="text-xl leading-tight font-bold text-black">{stats.attendanceRate}%</p>
          </div>
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Rata-rata
            </p>
            <p className="text-xl leading-tight font-bold text-black">{stats.averageGrade}</p>
          </div>
        </div>
      </header>

      {/* ── CHART ROW ── */}
      {attendance.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border-2 border-black bg-white p-4">
            <h3 className="mb-3 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
              Komposisi Presensi
            </h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <DonutChart
                segments={[
                  {
                    label: 'Hadir',
                    value: Math.max(attendanceBreakdown.hadir, 0),
                    color: '#15803d',
                  },
                  { label: 'Izin', value: Math.max(attendanceBreakdown.izin, 0), color: '#0e7490' },
                  {
                    label: 'Sakit',
                    value: Math.max(attendanceBreakdown.sakit, 0),
                    color: '#a16207',
                  },
                  {
                    label: 'Alpha',
                    value: Math.max(attendanceBreakdown.alpha, 0),
                    color: '#b91c1c',
                  },
                ]}
                centerLabel={`${stats.attendanceRate}%`}
                centerSubLabel="Kehadiran"
                size={140}
                strokeWidth={20}
              />
              <div className="flex flex-col gap-2 text-xs font-bold text-black">
                {[
                  { label: 'Hadir', value: attendanceBreakdown.hadir, color: 'bg-green-700' },
                  { label: 'Izin', value: attendanceBreakdown.izin, color: 'bg-cyan-700' },
                  { label: 'Sakit', value: attendanceBreakdown.sakit, color: 'bg-amber-700' },
                  { label: 'Alpha', value: attendanceBreakdown.alpha, color: 'bg-red-700' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-sm border border-black ${item.color}`} />
                    <span className="font-bold text-black">{item.label}:</span>
                    <span className="font-bold text-black">{item.value} hari</span>
                  </div>
                ))}
                <div className="mt-1 border-t-2 border-black/10 pt-1.5 text-xs text-black">
                  Total: {attendanceBreakdown.total} hari tercatat
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border-2 border-black bg-white p-4">
            <h3 className="mb-3 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
              Nilai Akademik
            </h3>
            {gradeData.length > 0 ? (
              <BarChart data={gradeData} height={160} maxBarWidth={40} showValues={true} />
            ) : (
              <div className="flex h-[160px] items-center justify-center rounded-md border-2 border-dashed border-black bg-white text-xs font-bold text-black">
                Belum ada data nilai
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── QUICK ACTIONS ── */}
      <div className="pt-2">
        <QuickActions
          actions={[
            { id: 'history', label: 'Presensi', icon: Calendar },
            { id: 'billing', label: 'Tagihan', icon: CreditCard },
            { id: 'report', label: 'Rapor', icon: FileText },
            { id: 'personal-messages', label: 'Pesan', icon: MessageSquare },
          ]}
          onAction={(id) => onNavigate?.(id)}
        />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        {/* Left Column: Stats & Announcements */}
        <div className="space-y-4 lg:col-span-2">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-md border-2 border-black bg-white p-4">
              <div className="rounded-md border-2 border-black bg-white p-2.5">
                <CreditCard className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                  Tagihan Sekolah
                </p>
                <p className="text-lg leading-tight font-bold text-black">
                  {stats.unpaidBills} Item Belum Lunas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-md border-2 border-black bg-white p-4">
              <div className="rounded-md border-2 border-black bg-white p-2.5">
                <TrendingUp className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                  Estimasi Peringkat
                </p>
                <p className="text-lg leading-tight font-bold text-black">Unggulan (Top 10%)</p>
              </div>
            </div>
          </div>

          {/* Academic Progress Table */}
          <div className="overflow-hidden rounded-md border-2 border-black bg-white">
            <div className="flex items-center justify-between gap-2 border-b-2 border-black bg-white p-3">
              <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
                <BookOpen className="h-4 w-4 text-black" />
                Nilai Akademik
              </h3>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={!handleExportPdf}
                className="rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ekspor PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-black bg-white">
                  <tr className="text-xs font-bold tracking-wider text-black uppercase">
                    <th className="px-3 py-2">Subjek Pelajaran</th>
                    <th className="px-3 py-2 text-center">Harian</th>
                    <th className="px-3 py-2 text-center">UTS</th>
                    <th className="px-3 py-2 text-center">UAS</th>
                    <th className="px-3 py-2 text-center">Indikator</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
                  {grades.length > 0 ? (
                    grades.map((g: NilaiRapot) => (
                      <tr key={g.id} className="transition-colors hover:bg-neutral-100">
                        <td className="px-3 py-2.5 font-bold text-black">
                          {g.mataPelajaran}
                          <span className="mt-0.5 block text-[10px] font-bold text-black/50">
                            Semester {g.semester}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-black">
                          {g.nilaiHarian}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-black">
                          {g.nilaiUTS}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-black">
                          {g.nilaiUAS}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`inline-block rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                              isTuntas(g.nilaiAkhir)
                                ? 'border-black bg-black text-white'
                                : 'border-black bg-white text-black'
                            }`}
                          >
                            {g.nilaiAkhir} ({getPredikat(g.nilaiAkhir)})
                            {isTuntas(g.nilaiAkhir) ? '' : ` · <${KONFIGURASI_PENILAIAN.kkm}`}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-6 text-center text-xs font-bold text-black"
                      >
                        Data nilai belum tersedia dalam sistem
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar info */}
        <div className="space-y-4">
          {/* Recent Attendance */}
          <div className="overflow-hidden rounded-md border-2 border-black bg-white">
            <div className="border-b-2 border-black bg-white p-3">
              <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
                <Calendar className="h-4 w-4 text-black" />
                Log Presensi Harian
              </h3>
            </div>
            <div className="space-y-3 p-3">
              {attendance.length > 0 ? (
                attendance
                  .slice(-4)
                  .reverse()
                  .map((a: AttendanceEntry) => (
                    <div
                      key={a.id}
                      className="group flex items-center justify-between gap-2 border-b-2 border-black/10 pb-2.5 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-md border-2 border-black bg-white p-1.5">
                          <Clock className="h-3.5 w-3.5 text-black" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black">{a.date}</p>
                          <p className="font-mono text-[10px] font-bold text-black/50">
                            Jam Masuk: 07:15
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                          a.status.toLowerCase() === 'hadir'
                            ? 'border-black bg-black text-white'
                            : 'border-black bg-white text-black'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))
              ) : (
                <p className="py-6 text-center text-xs font-bold text-black">Data log kosong</p>
              )}
            </div>
          </div>

          {/* School Announcements */}
          <div className="rounded-md border-2 border-black bg-white p-4">
            <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-2">
              <Bell className="h-4 w-4 text-black" />
              <h3 className="text-xs font-bold tracking-wider text-black uppercase">
                Informasi Institusi
              </h3>
            </div>
            <div className="space-y-4">
              {announcements.slice(0, 2).map((ann: PengumumanAdmin) => (
                <div
                  key={ann.id}
                  className="space-y-1.5 border-b-2 border-black/10 pb-3 last:border-0 last:pb-0"
                >
                  <h4 className="cursor-pointer text-xs leading-snug font-bold text-black hover:text-black/60">
                    {ann.title}
                  </h4>
                  <p className="line-clamp-2 text-xs leading-relaxed font-bold text-black/70">
                    {ann.message}
                  </p>
                  <p className="font-mono text-[10px] font-bold text-black/50">
                    Publish: {new Date(ann.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-md border-2 border-black bg-black py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-900">
              Lihat Arsip Pengumuman
            </button>
          </div>

          {/* Emergency Contact Card */}
          <div className="space-y-3 rounded-md border-2 border-black bg-white p-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <AlertCircle className="h-4 w-4 text-black" />
              <h3 className="text-xs font-bold tracking-wider text-black uppercase">
                Saluran Komunikasi
              </h3>
            </div>
            <div className="rounded-md border-2 border-black bg-neutral-50 p-3">
              <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                Wali Kelas Terdaftar
              </p>
              <p className="mt-0.5 text-xs font-bold text-black">
                {waliKelas?.name || 'Belum Ditentukan'}
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] font-bold text-black">
                    {waliKelas?.phone || '+62 --- ---- ----'}
                  </p>
                  <button
                    onClick={() => onNavigate?.('personal-messages')}
                    className="cursor-pointer rounded-md border-2 border-black bg-black px-2.5 py-1 text-[10px] font-bold text-white transition-colors hover:bg-neutral-900"
                  >
                    Chat Wali
                  </button>
                </div>
                <p className="text-[10px] leading-tight font-bold text-black/50">
                  *Akses chat personal dibatasi hanya untuk Wali Kelas sesuai protokol privasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
