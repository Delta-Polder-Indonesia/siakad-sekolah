import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Clock,
  MapPin,
  X,
} from 'lucide-react';
import {
  agendaItems,
  academicYears,
  getUpcomingAgenda,
  type AgendaItem,
  type AcademicYearOption,
} from './AgendaData/agenda';
import { filterBySemester, getAgendasForDate, sortByStartDate } from './AgendaData/dateUtils';
import { liburNasional } from './LiburNasionalData/liburNasional';
import { useToast } from '../../../../components/ui';
import { namaSekolah } from '../Profile/dataSekolah';
import { exportKalenderAkademikPdf } from '../../../../utils/export';

const TYPE_COLORS: Record<AgendaItem['type'], string> = {
  'Pendaftaran Akademik': '#3b82f6',
  'Ujian Akhir': '#dc2626',
  'Ujian Tengah Semester': '#f97316',
  Kelulusan: '#22c55e',
  'Aktivitas Akademik': '#c084fc',
  Rapat: '#eab308',
  'Libur Nasional': '#ec4899',
};

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

interface CalendarDayInfo {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
  isToday: boolean;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function groupByType(items: AgendaItem[]): { type: AgendaItem['type']; items: AgendaItem[] }[] {
  const map = new Map<AgendaItem['type'], AgendaItem[]>();
  for (const item of items) {
    if (!map.has(item.type)) map.set(item.type, []);
    map.get(item.type)!.push(item);
  }
  const groups: { type: AgendaItem['type']; items: AgendaItem[] }[] = [];
  map.forEach((items, type) => groups.push({ type, items: sortByStartDate(items) }));
  return groups;
}

function TypeTable({
  type,
  items,
  index,
  onDetail,
}: {
  type: AgendaItem['type'];
  items: AgendaItem[];
  index: number;
  onDetail: (item: AgendaItem) => void;
}) {
  return (
    <div className="overflow-hidden rounded-md border-2 border-black bg-white">
      <div className="flex items-center gap-3 border-b-2 border-black bg-white px-4 py-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black text-xs font-bold text-black">
          {index + 1}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: TYPE_COLORS[type] }}
          />
          <h4 className="text-xs font-bold tracking-wider text-black uppercase">{type}</h4>
        </div>
        <span className="ml-auto rounded-full border-2 border-black px-2.5 py-0.5 text-[10px] font-bold text-black">
          {items.length} kegiatan
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <colgroup>
            <col style={{ width: '48px' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '80px' }} />
          </colgroup>

          <thead>
            <tr className="border-b-2 border-black bg-white">
              <th className="px-4 py-2.5 text-center text-xs font-bold tracking-wider text-slate-600 uppercase">
                No
              </th>
              <th className="px-4 py-2.5 text-xs font-bold tracking-wider text-slate-600 uppercase">
                Kegiatan
              </th>
              <th className="px-4 py-2.5 text-xs font-bold tracking-wider text-slate-600 uppercase">
                Tanggal
              </th>
              <th className="px-4 py-2.5 text-xs font-bold tracking-wider text-slate-600 uppercase">
                Waktu
              </th>
              <th className="px-4 py-2.5 text-xs font-bold tracking-wider text-slate-600 uppercase">
                Lokasi
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-bold tracking-wider text-slate-600 uppercase">
                Detail
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={`transition-colors hover:bg-neutral-100 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                } last:[&>td]:border-b-0`}
              >
                <td className="border-b-2 border-black px-4 py-3 text-center text-xs text-slate-600">
                  {idx + 1}
                </td>
                <td className="border-b-2 border-black px-4 py-3">
                  <p className="text-xs leading-snug font-semibold text-black">{item.title}</p>
                  {item.isHighlighted && (
                    <span className="mt-1 inline-block rounded-full border-2 border-black px-2 py-0.5 text-[10px] font-bold text-black">
                      ★ Unggulan
                    </span>
                  )}
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {item.excerpt}
                  </p>
                </td>
                <td className="border-b-2 border-black px-4 py-3 text-xs text-slate-600">
                  {item.date}
                </td>
                <td className="border-b-2 border-black px-4 py-3 text-xs text-slate-600">
                  {item.time}
                </td>
                <td className="border-b-2 border-black px-4 py-3 text-xs text-slate-600">
                  {item.location ?? <span className="text-slate-400">—</span>}
                </td>
                <td className="border-b-2 border-black px-4 py-3 text-center">
                  <button
                    onClick={() => onDetail(item)}
                    className="rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition hover:border-blue-600 hover:bg-neutral-100 focus:border-blue-600"
                  >
                    Lihat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SemesterSection({
  title,
  subtitle,
  items,
  onDetail,
}: {
  title: string;
  subtitle: string;
  items: AgendaItem[];
  onDetail: (item: AgendaItem) => void;
}) {
  const groups = useMemo(() => groupByType(items), [items]);

  return (
    <div>
      <div className="mb-6 px-1 py-1">
        <h2 className="text-center text-xs font-bold tracking-wider text-black uppercase">
          {title}
        </h2>
        <p className="mt-1 text-center text-xs font-bold text-slate-600">
          {subtitle} &nbsp;·&nbsp; {items.length} kegiatan
        </p>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group, idx) => (
            <TypeTable
              key={group.type}
              type={group.type}
              items={group.items}
              index={idx}
              onDetail={onDetail}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-black bg-white py-16">
          <CalendarDays className="mb-3 h-8 w-8 text-slate-400" />
          <p className="text-xs font-bold text-slate-600">Belum ada data agenda</p>
        </div>
      )}
    </div>
  );
}

function AgendaDetailView({ item, onBack }: { item: AgendaItem; onBack: () => void }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-6 flex items-center justify-between gap-3 border-b-2 border-black pb-4">
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: TYPE_COLORS[item.type] }}
          />
          <span className="rounded-full border-2 border-black px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase">
            {item.type}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600">
            {item.date} · {item.time}
          </span>
          <button
            onClick={onBack}
            aria-label="Tutup"
            className="flex cursor-pointer items-center justify-center rounded-md border-2 border-black bg-white p-1.5 text-black transition hover:border-blue-600 hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          {item.isHighlighted && (
            <span className="mb-2 inline-block rounded-full border-2 border-black px-2 py-0.5 text-[10px] font-bold text-black">
              ★ Unggulan
            </span>
          )}
          <h2 className="text-lg font-bold tracking-tight text-black">{item.title}</h2>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-600">{item.excerpt}</p>
        </div>

        <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
          <div className="rounded-md border-2 border-black bg-white p-3">
            <div className="flex items-center gap-2 text-xs text-black">
              <CalendarDays className="h-4 w-4 shrink-0 text-black" />
              <span className="font-bold text-black">{item.date}</span>
            </div>
          </div>
          <div className="rounded-md border-2 border-black bg-white p-3">
            <div className="flex items-center gap-2 text-xs text-black">
              <Clock className="h-4 w-4 shrink-0 text-black" />
              <span className="font-bold text-black">{item.time}</span>
            </div>
          </div>
          {item.location && (
            <div className="rounded-md border-2 border-black bg-white p-3">
              <div className="flex items-center gap-2 text-xs text-black">
                <MapPin className="h-4 w-4 shrink-0 text-black" />
                <span className="font-bold text-black">{item.location}</span>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-3xl">
          <h4 className="mb-2 text-xs font-bold tracking-wider text-black uppercase">
            Detail Kegiatan
          </h4>
          <div className="rounded-md border-2 border-black bg-white p-5">
            <p className="text-xs leading-relaxed whitespace-pre-line text-slate-700">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DasborKalenderAkademik() {
  const { showToast } = useToast();
  const [today, setToday] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setToday((prev) => {
        const now = new Date();
        return prev.getFullYear() === now.getFullYear() &&
          prev.getMonth() === now.getMonth() &&
          prev.getDate() === now.getDate()
          ? prev
          : now;
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [detailItem, setDetailItem] = useState<AgendaItem | null>(null);
  const [upcomingOpen, setUpcomingOpen] = useState<boolean>(true);
  const [miniMonth, setMiniMonth] = useState<number>(today.getMonth());
  const [miniYear, setMiniYear] = useState<number>(today.getFullYear());

  const [selectedYear, setSelectedYear] = useState<string>(
    () => academicYears[0]?.value ?? '2026/2027'
  );
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);

  const currentYearOption: AcademicYearOption | undefined = useMemo(
    () => academicYears.find((y) => y.value === selectedYear) ?? academicYears[0],
    [selectedYear]
  );

  const semesterGanjilItems = useMemo(() => {
    if (!currentYearOption) return [];
    return sortByStartDate(
      filterBySemester(
        agendaItems,
        'ganjil',
        currentYearOption.ganjilStartYear,
        currentYearOption.genapStartYear
      )
    );
  }, [currentYearOption]);

  const semesterGenapItems = useMemo(() => {
    if (!currentYearOption) return [];
    return sortByStartDate(
      filterBySemester(
        agendaItems,
        'genap',
        currentYearOption.ganjilStartYear,
        currentYearOption.genapStartYear
      )
    );
  }, [currentYearOption]);

  const upcomingAgenda = useMemo(() => getUpcomingAgenda(5), []);

  const holidayMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const h of liburNasional) m.set(h.date, h.name);
    return m;
  }, []);

  const miniDays = useMemo<CalendarDayInfo[]>(() => {
    const first = new Date(miniYear, miniMonth, 1);
    const last = new Date(miniYear, miniMonth + 1, 0);
    const dow = first.getDay();
    const startOff = dow === 0 ? 6 : dow - 1;
    const prevLast = new Date(miniYear, miniMonth, 0).getDate();
    const days: CalendarDayInfo[] = [];

    for (let i = startOff - 1; i >= 0; i--) {
      const d = new Date(miniYear, miniMonth - 1, prevLast - i);
      days.push({
        date: prevLast - i,
        isCurrentMonth: false,
        fullDate: d,
        isToday: isSameDay(d, today),
      });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const fd = new Date(miniYear, miniMonth, d);
      days.push({ date: d, isCurrentMonth: true, fullDate: fd, isToday: isSameDay(fd, today) });
    }
    let fill = 1;
    while (days.length < 42) {
      const fd = new Date(miniYear, miniMonth + 1, fill);
      days.push({ date: fill, isCurrentMonth: false, fullDate: fd, isToday: isSameDay(fd, today) });
      fill++;
    }
    return days;
  }, [miniYear, miniMonth, today]);

  const miniHolidays = useMemo(
    () =>
      liburNasional
        .filter((h) => {
          const [y, m] = h.date.split('-').map(Number);
          return y === miniYear && m === miniMonth + 1;
        })
        .sort((a, b) => a.date.localeCompare(b.date)),
    [miniYear, miniMonth]
  );

  const calendarDays = useMemo<CalendarDayInfo[]>(() => {
    const first = new Date(currentYear, currentMonth, 1);
    const last = new Date(currentYear, currentMonth + 1, 0);
    const dow = first.getDay();
    const startOff = dow === 0 ? 6 : dow - 1;
    const prevLast = new Date(currentYear, currentMonth, 0).getDate();
    const days: CalendarDayInfo[] = [];

    for (let i = startOff - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevLast - i);
      days.push({
        date: prevLast - i,
        isCurrentMonth: false,
        fullDate: d,
        isToday: isSameDay(d, today),
      });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const fd = new Date(currentYear, currentMonth, d);
      days.push({ date: d, isCurrentMonth: true, fullDate: fd, isToday: isSameDay(fd, today) });
    }
    for (let d = 1; days.length < 42; d++) {
      const fd = new Date(currentYear, currentMonth + 1, d);
      days.push({ date: d, isCurrentMonth: false, fullDate: fd, isToday: isSameDay(fd, today) });
    }
    return days;
  }, [currentYear, currentMonth, today]);

  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  }, [currentMonth]);

  const goPrevMini = useCallback(() => {
    if (miniMonth === 0) {
      setMiniMonth(11);
      setMiniYear((y) => y - 1);
    } else setMiniMonth((m) => m - 1);
  }, [miniMonth]);

  const goNextMini = useCallback(() => {
    if (miniMonth === 11) {
      setMiniMonth(0);
      setMiniYear((y) => y + 1);
    } else setMiniMonth((m) => m + 1);
  }, [miniMonth]);

  const handleAgendaClick = useCallback((item: AgendaItem) => setDetailItem(item), []);

  const handleExportPdf = useCallback(() => {
    if (!currentYearOption) return;
    exportKalenderAkademikPdf({
      tahunAjaran: selectedYear,
      ganjil: semesterGanjilItems,
      genap: semesterGenapItems,
    });
    showToast('success', 'Kalender akademik PDF berhasil diunduh.');
  }, [currentYearOption, selectedYear, semesterGanjilItems, semesterGenapItems, showToast]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-2 text-black antialiased selection:bg-neutral-200">
      {detailItem ? (
        <AgendaDetailView item={detailItem} onBack={() => setDetailItem(null)} />
      ) : (
        <>
          {/* HEADER HALAMAN */}
          <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-2 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-lg leading-none font-bold tracking-tight text-black">
                Kalender Akademik
              </h1>
              <p className="mt-1 text-xs font-bold text-black">
                Jadwal kegiatan akademik {namaSekolah}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 self-start rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black sm:self-end">
              <CalendarDays className="h-3.5 w-3.5 text-black" />
              <span>
                {dayNames[today.getDay()]},{' '}
                {today.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </header>

          {/* GRID UTAMA */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* ─── KALENDER ───────────────────────────────────────────────── */}
            <div className="overflow-hidden rounded-md border-2 border-black bg-white lg:col-span-2">
              <div className="flex flex-col items-center justify-between gap-3 border-b-2 border-black px-4 py-3 sm:flex-row">
                <div className="flex items-center gap-1">
                  <button
                    onClick={goToPrevMonth}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-white text-black transition hover:border-blue-600 hover:bg-neutral-100"
                  >
                    <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-white text-black transition hover:border-blue-600 hover:bg-neutral-100"
                  >
                    <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                  <h2 className="ml-2 text-xs font-bold tracking-tight text-black">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowYearDropdown((v) => !v)}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded-md border-2 bg-white px-2.5 py-1.5 text-xs font-bold text-black transition hover:bg-neutral-100 ${
                        showYearDropdown ? 'border-blue-600' : 'border-black'
                      }`}
                    >
                      <span>{currentYearOption?.label ?? selectedYear}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          showYearDropdown ? 'rotate-180 text-blue-600' : 'text-black'
                        }`}
                      />
                    </button>

                    {showYearDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowYearDropdown(false)}
                        />
                        <div className="absolute right-0 z-50 mt-1 w-full overflow-hidden rounded-md border-2 border-black bg-white shadow-lg">
                          {academicYears.map((year) => {
                            const active = year.value === selectedYear;
                            return (
                              <button
                                key={year.value}
                                onClick={() => {
                                  setSelectedYear(year.value);
                                  setShowYearDropdown(false);
                                }}
                                className={`flex w-full items-center justify-between border-2 px-3 py-2 text-left text-xs font-bold transition ${
                                  active
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-transparent text-black hover:bg-neutral-100'
                                }`}
                              >
                                <span>{year.label}</span>
                                {active && (
                                  <svg
                                    className="h-3 w-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleExportPdf}
                    className="flex cursor-pointer items-center gap-2 rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition hover:border-blue-600 hover:bg-neutral-100"
                  >
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </button>
                </div>
              </div>

              {/* Grid Kalender */}
              <div className="px-4 pb-4">
                <div className="grid shrink-0 grid-cols-7 pb-2">
                  {DAY_NAMES.map((day) => (
                    <div
                      key={day}
                      className={`py-1 text-center text-[10px] font-bold tracking-wider uppercase ${
                        day === 'Minggu' ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 border-t-2 border-l-2 border-black">
                  {calendarDays.map((di, index) => {
                    const dayAgendas = getAgendasForDate(di.fullDate, agendaItems);
                    const isSelected = selectedDate ? isSameDay(di.fullDate, selectedDate) : false;
                    const isSun = di.fullDate.getDay() === 0;

                    return (
                      <div
                        key={`${di.fullDate.getTime()}-${index}`}
                        onClick={() => setSelectedDate(di.fullDate)}
                        className={[
                          'flex min-h-[86px] cursor-pointer flex-col border-r-2 border-b-2 p-1.5 transition-all md:min-h-[104px]',
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : !di.isCurrentMonth
                              ? 'bg-slate-50/40 hover:bg-neutral-100'
                              : 'bg-white hover:bg-neutral-100',
                        ].join(' ')}
                      >
                        <div className="mb-1 flex w-full justify-end">
                          <span
                            className={`text-xs ${
                              isSelected
                                ? 'font-bold text-white'
                                : !di.isCurrentMonth
                                  ? 'text-slate-300'
                                  : di.isToday
                                    ? 'flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 bg-white font-bold text-black'
                                    : isSun
                                      ? 'text-slate-400'
                                      : 'font-bold text-black'
                            }`}
                          >
                            {di.date}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col space-y-1 overflow-hidden">
                          {dayAgendas.slice(0, 3).map((agenda) => (
                            <div
                              key={agenda.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAgendaClick(agenda);
                              }}
                              className={`flex cursor-pointer items-center gap-1.5 text-[10px] font-bold hover:opacity-80 ${
                                isSelected ? 'text-white' : 'text-black'
                              }`}
                              title={agenda.title}
                            >
                              <span
                                className="h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: TYPE_COLORS[agenda.type] }}
                              />
                              <span className="truncate leading-tight">{agenda.title}</span>
                            </div>
                          ))}
                          {dayAgendas.length > 3 && (
                            <p
                              className={`pl-3 text-[10px] font-bold ${
                                isSelected ? 'text-blue-100' : 'text-slate-500'
                              }`}
                            >
                              +{dayAgendas.length - 3} lainnya
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legenda */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t-2 border-black bg-white px-4 py-3">
                <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                  Keterangan:
                </span>
                {(Object.keys(TYPE_COLORS) as AgendaItem['type'][]).map((type) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                    />
                    <span className="text-xs font-semibold text-black">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── AGENDA TERDEKAT ─────────────────────────────────────────── */}
            <div className="flex h-fit flex-col rounded-md border-2 border-black bg-white">
              <button
                onClick={() => setUpcomingOpen((v) => !v)}
                className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition hover:bg-neutral-100 ${
                  upcomingOpen ? 'border-b-2 border-black' : ''
                }`}
                aria-expanded={upcomingOpen}
              >
                <span className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
                  <Clock className="h-3.5 w-3.5" />
                  Agenda Terdekat
                </span>
                <span className="flex items-center gap-2">
                  <span className="rounded-full border-2 border-black px-2 py-0.5 text-[10px] font-bold text-black">
                    {upcomingOpen ? `${upcomingAgenda.length} kegiatan` : 'Buka'}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-black transition-transform ${
                      upcomingOpen ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </button>

              {upcomingOpen && (
                <>
                  {/* ── Kalender Real (Kalender Nasional) ───────────────────── */}
                  <div className="border-b-2 border-black p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Kalender Nasional
                      </h4>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={goPrevMini}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-white text-black transition hover:border-blue-600 hover:bg-neutral-100"
                        >
                          <ChevronLeft className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                        <span className="w-28 text-center text-xs font-bold text-black">
                          {MONTH_NAMES[miniMonth]} {miniYear}
                        </span>
                        <button
                          onClick={goNextMini}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-white text-black transition hover:border-blue-600 hover:bg-neutral-100"
                        >
                          <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((d, i) => (
                        <div key={i} className="text-center text-[10px] font-bold text-slate-600">
                          {d}
                        </div>
                      ))}
                      {miniDays.map((di, index) => {
                        const holidayName = holidayMap.get(toDateKey(di.fullDate));
                        const isHoliday = Boolean(holidayName);
                        const isSun = di.fullDate.getDay() === 0;
                        return (
                          <div
                            key={`${toDateKey(di.fullDate)}-${index}`}
                            title={holidayName ?? undefined}
                            className="flex flex-col items-center py-0.5"
                          >
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                !di.isCurrentMonth
                                  ? 'text-slate-300'
                                  : di.isToday
                                    ? 'border-2 border-blue-600 bg-white text-black'
                                    : isHoliday
                                      ? 'text-red-600'
                                      : isSun
                                        ? 'text-slate-400'
                                        : 'text-black'
                              }`}
                            >
                              {di.date}
                            </span>
                            {isHoliday && (
                              <span className="mt-0.5 h-1 w-1 rounded-full bg-red-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-[10px] font-bold text-slate-600">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full border-2 border-blue-600 bg-white" />{' '}
                        Hari ini
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Libur nasional
                      </span>
                    </div>

                    {miniHolidays.length > 0 && (
                      <ul className="mt-3 space-y-1.5 border-t-2 border-black pt-3">
                        {miniHolidays.map((h) => (
                          <li key={h.date} className="flex items-center gap-2 text-xs">
                            <span className="w-8 shrink-0 font-mono font-bold text-red-600">
                              {Number(h.date.slice(8, 10))}
                            </span>
                            <span className="font-semibold text-black">{h.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* ── Daftar Agenda ──────────────────────────────────────── */}
                  <div className="space-y-2 p-3">
                    {upcomingAgenda.map((agenda) => (
                      <button
                        key={agenda.id}
                        onClick={() => handleAgendaClick(agenda)}
                        className="group flex w-full cursor-pointer items-start gap-3 rounded-md border-2 border-black bg-white p-2.5 text-left transition hover:border-blue-600 hover:bg-neutral-100"
                      >
                        <span
                          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: TYPE_COLORS[agenda.type] }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold text-black">
                            {agenda.title}
                          </span>
                          <span className="mt-0.5 block text-xs font-semibold text-slate-600">
                            {agenda.type}
                          </span>
                          <span className="mt-1 block text-xs font-medium text-slate-500">
                            {agenda.date} · {agenda.time}
                          </span>
                        </span>
                      </button>
                    ))}
                    {upcomingAgenda.length === 0 && (
                      <p className="py-8 text-center text-xs font-bold text-slate-600">
                        Tidak ada agenda mendatang
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ─── RINCIAN PER SEMESTER ──────────────────────────────────────── */}
          <div className="pt-4">
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="hidden w-40 sm:block" />
              <div className="text-center">
                <h2 className="text-xs font-bold tracking-wider text-black uppercase">
                  Kalender Akademik {namaSekolah}
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-600">Tahun Ajaran {selectedYear}</p>
                <div className="mt-2 h-0.5 w-full bg-black" />
              </div>
              <div className="w-40 shrink-0 sm:block" />
            </div>

            <SemesterSection
              title={`Semester Ganjil T.A. ${selectedYear}`}
              subtitle={`Juli ${currentYearOption?.ganjilStartYear ?? ''} — Desember ${
                currentYearOption?.ganjilStartYear ?? ''
              }`}
              items={semesterGanjilItems}
              onDetail={handleAgendaClick}
            />

            <div className="my-10 flex items-center gap-4">
              <div className="h-0.5 flex-1 bg-black" />
              <span className="shrink-0 rounded-full border-2 border-black px-4 py-1.5 text-[10px] font-bold tracking-widest text-black uppercase">
                ● ● ●
              </span>
              <div className="h-0.5 flex-1 bg-black" />
            </div>

            <SemesterSection
              title={`Semester Genap T.A. ${selectedYear}`}
              subtitle={`Januari ${currentYearOption?.genapStartYear ?? ''} — Juli ${
                currentYearOption?.genapStartYear ?? ''
              }`}
              items={semesterGenapItems}
              onDetail={handleAgendaClick}
            />
          </div>
        </>
      )}
    </div>
  );
}
