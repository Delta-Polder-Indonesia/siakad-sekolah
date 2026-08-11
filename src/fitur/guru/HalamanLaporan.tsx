import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getTeachers,
  getClasses,
  getStudentsByClass,
  getAttendanceByDateRange,
} from '../../data/services';
import { FileText, Download, Filter, BarChart3 } from 'lucide-react';
import { exportAbsensiCsv, exportAbsensiPerKelasCsv, exportAbsensiPdf } from '../../utils/export';
import { kehadiranBadgeClass } from '../../utils/kehadiran';

export default function ReportPage() {
  const { user } = useAuth();
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = today.toISOString().split('T')[0];

  const [selectedClass, setSelectedClass] = useState('');
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  const [reportMode, setReportMode] = useState<'range' | 'monthly'>('range');
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  );

  const teacher = useMemo(() => getTeachers().find((t) => t.id === user?.id), [user]);
  const classes = useMemo(
    () => getClasses().filter((c) => teacher?.classIds.includes(c.id)),
    [teacher]
  );

  const monthRange = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const pad = (n: number) => String(n).padStart(2, '0');
    return {
      start: `${year}-${pad(month)}-01`,
      end: `${year}-${pad(month)}-${pad(lastDayOfMonth)}`,
    };
  }, [selectedMonth]);

  const effectiveStart = reportMode === 'monthly' ? monthRange.start : startDate;
  const effectiveEnd = reportMode === 'monthly' ? monthRange.end : endDate;

  const kelasRekap = useMemo(() => {
    if (reportMode !== 'monthly') return [];
    return classes.map((c) => {
      const siswa = getStudentsByClass(c.id);
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
      return {
        kelas: c.name,
        siswa: siswa.length,
        hadir,
        izin,
        sakit,
        alpha,
        total,
        percentage: total > 0 ? Math.round((hadir / total) * 100) : 0,
      };
    });
  }, [classes, reportMode, monthRange]);

  const reportData = useMemo(() => {
    if (!selectedClass) return [];
    const students = getStudentsByClass(selectedClass).sort((a, b) => a.name.localeCompare(b.name));
    const attendance = getAttendanceByDateRange(effectiveStart, effectiveEnd, selectedClass);

    return students.map((student) => {
      const studentAtt = attendance.filter((a) => a.studentId === student.id);
      const hadir = studentAtt.filter((a) => a.status === 'hadir').length;
      const izin = studentAtt.filter((a) => a.status === 'izin').length;
      const sakit = studentAtt.filter((a) => a.status === 'sakit').length;
      const alpha = studentAtt.filter((a) => a.status === 'alpha').length;
      const total = hadir + izin + sakit + alpha;
      const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;

      const dailyStatus: Record<string, string> = {};
      studentAtt.forEach((a) => {
        dailyStatus[a.date] = a.status;
      });

      return {
        ...student,
        hadir,
        izin,
        sakit,
        alpha,
        total,
        percentage,
        dailyStatus,
      };
    });
  }, [selectedClass, effectiveStart, effectiveEnd]);

  const dates = useMemo(() => {
    if (!selectedClass) return [];
    const attendance = getAttendanceByDateRange(effectiveStart, effectiveEnd, selectedClass);
    return [...new Set(attendance.map((a) => a.date))].sort();
  }, [selectedClass, effectiveStart, effectiveEnd]);

  const overallStats = useMemo(() => {
    const total = reportData.reduce((acc, s) => acc + s.total, 0);
    const hadir = reportData.reduce((acc, s) => acc + s.hadir, 0);
    const izin = reportData.reduce((acc, s) => acc + s.izin, 0);
    const sakit = reportData.reduce((acc, s) => acc + s.sakit, 0);
    const alpha = reportData.reduce((acc, s) => acc + s.alpha, 0);
    return {
      total,
      hadir,
      izin,
      sakit,
      alpha,
      percentage: total > 0 ? Math.round((hadir / total) * 100) : 0,
    };
  }, [reportData]);

  const statusClassName = (status: string) => {
    switch (status) {
      case 'hadir':
        return 'border-2 border-black bg-black text-white font-bold';
      case 'izin':
        return 'border-2 border-black bg-white text-black font-bold';
      case 'sakit':
        return 'border-2 border-black bg-white text-black/70 font-bold';
      case 'alpha':
        return 'border-2 border-black bg-white text-black/40 line-through';
      default:
        return 'border-2 border-dashed border-black/20 bg-white text-black/30';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'hadir':
        return 'H';
      case 'izin':
        return 'I';
      case 'sakit':
        return 'S';
      case 'alpha':
        return 'A';
      default:
        return '-';
    }
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) return;
    const className = classes.find((c) => c.id === selectedClass)?.name || '';
    exportAbsensiCsv(reportData, className, effectiveStart, effectiveEnd);
  };

  const handleExportKelasCSV = () => {
    if (kelasRekap.length === 0) return;
    exportAbsensiPerKelasCsv(kelasRekap, monthRange.start, monthRange.end);
  };

  const kelasRekapTable =
    reportMode === 'monthly' && kelasRekap.length > 0 ? (
      <div className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex items-center gap-1.5 border-b-2 border-black bg-white px-4 py-2.5 font-mono">
          <BarChart3 className="h-3.5 w-3.5 text-black" />
          <span className="text-[10px] font-bold tracking-wider text-black uppercase">
            Rekap Absensi per Kelas —{' '}
            {new Date(monthRange.start + 'T00:00:00').toLocaleDateString('id-ID', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b-2 border-black bg-white">
              <tr className="font-mono text-[10px] font-bold tracking-wider text-black uppercase">
                <th className="w-12 border-r-2 border-black/10 px-3 py-2 text-center">NO</th>
                <th className="border-r-2 border-black/10 px-3 py-2">KELAS</th>
                <th className="w-20 border-r-2 border-black/10 px-3 py-2 text-center">SISWA</th>
                <th className="w-12 border-r-2 border-black/10 px-3 py-2 text-center">H</th>
                <th className="w-12 border-r-2 border-black/10 px-3 py-2 text-center">I</th>
                <th className="w-12 border-r-2 border-black/10 px-3 py-2 text-center">S</th>
                <th className="w-12 border-r-2 border-black/10 px-3 py-2 text-center">A</th>
                <th className="w-12 border-r-2 border-black/10 px-3 py-2 text-center">TOT</th>
                <th className="w-16 px-3 py-2 text-center">%_RATE</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10">
              {kelasRekap.map((k, idx) => (
                <tr key={k.kelas} className="text-xs transition-colors hover:bg-neutral-100">
                  <td className="border-r-2 border-black/10 px-3 py-2 text-center font-mono text-black/60">
                    {idx + 1}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2 font-bold tracking-tight text-black uppercase">
                    {k.kelas}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2 text-center font-mono font-bold text-black">
                    {k.siswa}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2 text-center font-mono font-bold text-black">
                    {k.hadir}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2 text-center font-mono font-bold text-black">
                    {k.izin}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2 text-center font-mono font-bold text-black">
                    {k.sakit}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2 text-center font-mono text-black/50 line-through">
                    {k.alpha}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2 text-center font-mono font-bold text-black">
                    {k.total}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`rounded-md border-2 px-1.5 py-0.5 font-mono text-[10px] font-bold ${kehadiranBadgeClass(
                        k.percentage
                      )}`}
                    >
                      {k.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER HALAMAN */}
      <header className="mb-3 border-b-2 border-black pb-2">
        <h1 className="text-lg leading-none font-bold tracking-tight text-black">
          Laporan & Kearsipan Absensi Siswa
        </h1>
        <p className="mt-1.5 text-xs leading-none font-bold text-black">
          Kompilasi matriks kehadiran komprehensif, pelacakan histori data berkala, dan penarikan
          berkas log eksternal.
        </p>
      </header>

      {/* FILTERS CONTROL MATRIX */}
      <div className="rounded-md border-2 border-black bg-white p-3">
        <div className="mb-3 flex items-center gap-1.5 border-b-2 border-black pb-2 text-[10px] font-bold tracking-wider text-black uppercase">
          <Filter className="h-3 w-3 text-black" />
          <span>Konfigurasi Parameter Penayangan Laporan</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Mode Laporan
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReportMode('range')}
                  className={`rounded-md border-2 bg-white px-3 py-1.5 font-mono text-xs font-bold text-black transition-colors hover:bg-neutral-100 ${
                    reportMode === 'range' ? 'border-black bg-black text-white' : 'border-black'
                  }`}
                >
                  Rentang Tanggal
                </button>
                <button
                  type="button"
                  onClick={() => setReportMode('monthly')}
                  className={`rounded-md border-2 bg-white px-3 py-1.5 font-mono text-xs font-bold text-black transition-colors hover:bg-neutral-100 ${
                    reportMode === 'monthly' ? 'border-black bg-black text-white' : 'border-black'
                  }`}
                >
                  Per Bulan
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Kompartemen Kelas
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="min-w-[160px] cursor-pointer rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
              >
                <option value="">SELECT_CLASS...</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            {reportMode === 'range' ? (
              <>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                    Batas Awal Log
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                    Batas Akhir Log
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                  Bulan Laporan
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                />
              </div>
            )}
          </div>{' '}
          {(reportData.length > 0 || (reportMode === 'monthly' && kelasRekap.length > 0)) && (
            <div className="flex items-center gap-2">
              {reportMode === 'monthly' && kelasRekap.length > 0 && (
                <button type="button"
                  onClick={handleExportKelasCSV}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold tracking-wide text-black transition-colors hover:border-black hover:bg-neutral-100"
                >
                  <Download className="h-3.5 w-3.5" /> CSV KELAS
                </button>
              )}
              {reportData.length > 0 && (
                <>
                  <button type="button"
                    onClick={handleExportCSV}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-black bg-black px-3 py-1.5 font-mono text-xs font-bold tracking-wide text-white transition-colors hover:bg-neutral-800"
                  >
                    <Download className="h-3.5 w-3.5" /> CSV
                  </button>
                  <button type="button"
                    onClick={() => {
                      const className = classes.find((c) => c.id === selectedClass)?.name || '';
                      exportAbsensiPdf(
                        reportData,
                        className,
                        effectiveStart,
                        effectiveEnd,
                        overallStats
                      );
                    }}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-black bg-black px-3 py-1.5 font-mono text-xs font-bold tracking-wide text-white transition-colors hover:bg-blue-700"
                  >
                    <FileText className="h-3.5 w-3.5" /> PDF
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {kelasRekapTable}

      {!selectedClass ? (
        <div className="rounded-md border-2 border-dashed border-black bg-white py-24 text-center">
          <p className="font-mono text-[10px] font-bold tracking-wider text-black uppercase">
            AWAITING_QUERY_PARAMETERS
          </p>
          <p className="mt-0.5 text-[10px] font-bold text-black/60">
            Tentukan parameter target kelas binaan di atas untuk memetakan visualisasi histori
            rekapitulasi data.
          </p>
        </div>
      ) : (
        <>
          {/* MONOCHROME OVERALL METRIC LOGS */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'TOTAL_RECORDS', value: overallStats.total },
              { label: 'INDEXED_HADIR', value: overallStats.hadir },
              { label: 'INDEXED_IZIN', value: overallStats.izin },
              { label: 'INDEXED_SAKIT', value: overallStats.sakit },
              { label: 'INDEXED_ALPHA', value: overallStats.alpha },
              { label: 'AVG_ATTENDANCE', value: `${overallStats.percentage}%` },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="flex min-h-[75px] flex-col justify-between rounded-md border-2 border-black bg-white p-3"
              >
                <span className="border-b-2 border-black/10 pb-1 font-mono text-[9px] font-bold tracking-wider text-black uppercase">
                  {stat.label}
                </span>
                <p className="mt-1 font-mono text-lg font-bold tracking-tight text-black">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* MASTER SUMMARY REKAP TABLE */}
          <div className="overflow-hidden rounded-md border-2 border-black bg-white">
            <div className="flex items-center gap-1.5 border-b-2 border-black bg-white px-4 py-2.5 font-mono">
              <FileText className="h-3.5 w-3.5 text-black" />
              <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                Matriks Komparasi Absensi & Lembar Log Harian
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] table-fixed text-left">
                <thead className="border-b-2 border-black bg-white">
                  <tr className="font-mono text-[10px] font-bold tracking-wider text-black uppercase">
                    <th className="w-12 border-r-2 border-black/10 px-3 py-2 text-center">NO</th>
                    <th className="w-52 border-r-2 border-black/10 px-3 py-2">IDENTITAS_SISWA</th>
                    <th className="w-24 border-r-2 border-black/10 px-3 py-2">NIS_CODE</th>
                    <th className="w-10 border-r-2 border-black/10 px-2 py-2 text-center">H</th>
                    <th className="w-10 border-r-2 border-black/10 px-2 py-2 text-center">I</th>
                    <th className="w-10 border-r-2 border-black/10 px-2 py-2 text-center">S</th>
                    <th className="w-10 border-r-2 border-black/10 px-2 py-2 text-center">A</th>
                    <th className="w-12 border-r-2 border-black/10 px-2 py-2 text-center">TOT</th>
                    <th className="w-16 border-r-2 border-black/10 px-3 py-2 text-center">
                      %_RATE
                    </th>

                    {/* Header Tanggal Dinamis */}
                    {dates.map((d) => (
                      <th
                        key={d}
                        className="w-11 border-r-2 border-black/10 px-1 py-2 text-center text-[9px] font-bold text-black last:border-r-0"
                      >
                        {new Date(d + 'T00:00:00')
                          .toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                          .toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10">
                  {reportData.map((student, idx) => (
                    <tr key={student.id} className="text-xs transition-colors hover:bg-neutral-100">
                      <td className="border-r-2 border-black/10 px-3 py-2 text-center font-mono text-black/60">
                        {idx + 1}
                      </td>
                      <td className="truncate border-r-2 border-black/10 px-3 py-2 font-bold tracking-tight text-black uppercase">
                        {student.name}
                      </td>
                      <td className="border-r-2 border-black/10 px-3 py-2 font-mono font-bold text-black">
                        {student.nis}
                      </td>
                      <td className="border-r-2 border-black/10 px-2 py-2 text-center font-mono font-bold text-black">
                        {student.hadir}
                      </td>
                      <td className="border-r-2 border-black/10 px-2 py-2 text-center font-mono font-bold text-black">
                        {student.izin}
                      </td>
                      <td className="border-r-2 border-black/10 px-2 py-2 text-center font-mono font-bold text-black">
                        {student.sakit}
                      </td>
                      <td className="border-r-2 border-black/10 px-2 py-2 text-center font-mono text-black/50 line-through">
                        {student.alpha}
                      </td>
                      <td className="border-r-2 border-black/10 px-2 py-2 text-center font-mono font-bold text-black">
                        {student.total}
                      </td>
                      <td className="border-r-2 border-black/10 px-3 py-2 text-center">
                        <span
                          className={`rounded-md border-2 px-1.5 py-0.5 font-mono text-[10px] font-bold ${kehadiranBadgeClass(
                            student.percentage
                          )}`}
                        >
                          {student.percentage}%
                        </span>
                      </td>

                      {/* Render Grid Log Harian */}
                      {dates.map((d, dIdx) => (
                        <td
                          key={d}
                          className={`border-r-2 border-black/10 px-0.5 py-1.5 text-center align-middle ${
                            dIdx === dates.length - 1 ? 'border-r-0' : ''
                          }`}
                        >
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-md border-2 font-mono text-[9px] ${statusClassName(student.dailyStatus[d] || '')}`}
                          >
                            {statusLabel(student.dailyStatus[d] || '')}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reportData.length === 0 && (
              <div className="py-12 text-center font-mono text-[10px] font-bold tracking-wider text-black uppercase">
                NO_LOG_DATA_FOUND_WITHIN_RANGE
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
