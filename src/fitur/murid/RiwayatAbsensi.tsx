import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAttendanceByStudent } from '../../data/services';
import { Calendar, ChevronLeft, ChevronRight, Clock, Download, FileText, Info } from 'lucide-react';
import { useToast } from '../../components/ui';
import { exportToCsv } from '../../utils/export';
import { useStoreVersion } from '../../hooks/useStoreVersion';

export default function HistoryPage() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const { showToast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const allAttendance = useMemo(() => {
    if (!user) return [];
    return getAttendanceByStudent(user.id).sort((a, b) => b.date.localeCompare(a.date));
  }, [user, storeVersion]);

  const calendarData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const monthAttendance = allAttendance.filter((a) => a.date.startsWith(selectedMonth));
    const attendanceMap: Record<string, (typeof monthAttendance)[number]> = {};
    monthAttendance.forEach((record) => {
      attendanceMap[record.date] = record;
    });

    const weeks: { day: number; date: string; record?: (typeof monthAttendance)[number] }[][] = [];
    let currentWeek: { day: number; date: string; record?: (typeof monthAttendance)[number] }[] =
      [];

    for (let i = 0; i < startWeekday; i += 1) {
      currentWeek.push({ day: 0, date: '' });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentWeek.push({ day, date, record: attendanceMap[date] });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ day: 0, date: '' });
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return { weeks, monthAttendance };
  }, [allAttendance, selectedMonth]);

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
  }, [selectedMonth]);

  const selectedRecord = useMemo(() => {
    if (!selectedDate) return null;
    return allAttendance.find((item) => item.date === selectedDate) || null;
  }, [allAttendance, selectedDate]);

  const navigateMonth = (offset: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const next = new Date(year, month - 1 + offset, 1);
    setSelectedMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
    setSelectedDate(null);
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'hadir':
        return 'Hadir';
      case 'izin':
        return 'Izin';
      case 'sakit':
        return 'Sakit';
      case 'alpha':
        return 'Alpha';
      default:
        return '-';
    }
  };

  const statusClasses = (status?: string, isSelected?: boolean) => {
    if (isSelected) {
      return 'border-2 border-blue-600 bg-white text-blue-600 z-10';
    }
    switch (status) {
      case 'hadir':
        return 'bg-blue-600 text-white border-2 border-black hover:bg-blue-700';
      case 'izin':
      case 'sakit':
      case 'alpha':
        return 'bg-black text-white border-2 border-black hover:bg-neutral-800';
      default:
        return 'bg-white text-black border-2 border-transparent hover:bg-neutral-100 hover:border-black';
    }
  };

  const statusDotClass = (status: string) => {
    switch (status) {
      case 'hadir':
        return 'bg-blue-600';
      case 'izin':
      case 'sakit':
      case 'alpha':
        return 'bg-black';
      default:
        return 'bg-black/20';
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-2 text-black antialiased selection:bg-neutral-200">
      {/* HEADER HALAMAN */}
      <header className="mb-4 border-b-2 border-black pb-2">
        <h1 className="text-lg leading-none font-bold tracking-tight text-black">
          Riwayat Presensi
        </h1>
        <p className="mt-1 text-xs leading-none font-bold text-black">
          Lihat rekam jejak absensi harian dan catatan evaluasi bulanan Anda.
        </p>
      </header>

      {/* WORKSPACE MULTI-KOLOM */}
      <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        {/* PANEL KALENDER (Kiri) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-black" />
              <h2 className="text-xs font-bold tracking-wider text-black uppercase">Kalender</h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="rounded-md border-2 border-black bg-white p-1 text-xs font-bold transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                <ChevronLeft className="h-3 w-3 text-current" />
              </button>
              <span className="min-w-[80px] text-center text-xs font-bold text-black">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                className="rounded-md border-2 border-black bg-white p-1 text-xs font-bold transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                <ChevronRight className="h-3 w-3 text-current" />
              </button>
            </div>
          </div>

          {/* Nama-Nama Hari */}
          <div className="grid grid-cols-7 gap-1">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
              <div key={day} className="py-0.5 text-center text-[10px] font-bold text-black">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Matriks Tanggal */}
          <div className="space-y-1">
            {calendarData.weeks.map((week, weekIndex) => (
              <div key={`${selectedMonth}-w-${weekIndex}`} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  const isBlank = day.day === 0;
                  const isSelected = selectedDate === day.date;
                  return (
                    <button
                      type="button"
                      key={`${day.date}-${dayIndex}`}
                      disabled={isBlank}
                      onClick={() => setSelectedDate(day.date)}
                      className={`flex aspect-square items-center justify-center rounded-md font-mono text-xs font-bold transition-all ${
                        isBlank ? 'pointer-events-none border-0 bg-transparent' : 'cursor-pointer'
                      } ${statusClasses(day.record?.status, isSelected)}`}
                    >
                      {!isBlank ? day.day : ''}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Keterangan Warna Minimalis & Export */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t-2 border-black pt-2 text-[10px] font-bold text-black">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-600" /> Hadir
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-black" /> Izin/Sakit/Alpha
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                {calendarData.monthAttendance.length} Entri
              </span>
              {calendarData.monthAttendance.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const headers = ['Tanggal', 'Status', 'Catatan'];
                    const rows = calendarData.monthAttendance.map((item) => [
                      item.date,
                      item.status,
                      item.note || '',
                    ]);
                    exportToCsv(rows, headers, `Absensi_${selectedMonth}.csv`);
                    showToast('success', '✅ Data absensi berhasil diexport ke CSV');
                  }}
                  className="inline-flex items-center gap-1 rounded-md border-2 border-blue-600 bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white transition-colors hover:border-blue-700 hover:bg-blue-700"
                >
                  <Download className="h-2.5 w-2.5" />
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DETAIL DOKUMENTASI HARIAN (Kanan) */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 border-b-2 border-black pb-2">
            <Info className="h-3.5 w-3.5 text-black" />
            <h2 className="text-xs font-bold tracking-wider text-black uppercase">
              Detail Catatan Harian
            </h2>
          </div>

          {!selectedDate ? (
            <div className="rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
              <Calendar className="mx-auto mb-1 h-6 w-6 text-black" />
              <p className="text-xs font-bold text-black">
                Pilih salah satu tanggal aktif pada kalender untuk melihat rincian.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-md border-2 border-black bg-white px-3 py-2">
                <div>
                  <span className="block text-[10px] leading-none font-bold tracking-wider text-black uppercase">
                    Tanggal Terpilih
                  </span>
                  <p className="mt-1 text-xs leading-none font-bold text-black">
                    {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                  {selectedDate}
                </span>
              </div>

              {selectedRecord ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="space-y-0.5 rounded-md border-2 border-black bg-white p-3">
                      <div className="flex items-center gap-1.5 text-black">
                        <div
                          className={`h-2 w-2 rounded-full ${statusDotClass(selectedRecord.status)}`}
                        />
                        <span className="text-[10px] font-bold tracking-wider uppercase">
                          Status Kehadiran
                        </span>
                      </div>
                      <p className="pt-0.5 text-xs font-bold text-black">
                        {statusLabel(selectedRecord.status)}
                      </p>
                    </div>

                    <div className="space-y-0.5 rounded-md border-2 border-black bg-white p-3">
                      <div className="flex items-center gap-1.5 text-black">
                        <Clock className="h-3 w-3 text-black" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">
                          Waktu Sinkronisasi
                        </span>
                      </div>
                      <p className="pt-0.5 font-mono text-xs font-bold text-black">
                        {new Date(selectedRecord.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}{' '}
                        WIB
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-md border-2 border-black bg-white p-3">
                    <div className="flex items-center gap-1.5 text-black">
                      <FileText className="h-3 w-3 text-black" />
                      <span className="text-[10px] font-bold tracking-wider uppercase">
                        Catatan / Keterangan
                      </span>
                    </div>
                    <p className="text-xs leading-normal font-bold text-black">
                      {selectedRecord.note ||
                        'Tidak ada catatan tambahan dari instruktur atau guru pamong.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border-2 border-dashed border-black bg-white py-8 text-center">
                  <p className="text-xs font-bold text-black">
                    Tidak ada catatan presensi yang terekam pada tanggal ini.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
