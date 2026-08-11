import { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  CalendarDays,
  Clock,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Tag,
  Download,
  ArrowLeft,
} from 'lucide-react';
import {
  agendaItems,
  academicYears,
  type AgendaItem,
  type AcademicYearOption,
} from './AgendaData/agenda';
import { useToast } from '../../../../components/ui';
import { exportKalenderAkademikPdf } from '../../../../utils/export';
import type { PageProps } from '../../../../types';
import { namaSekolah, namaSekolahUppercase } from '../Profile/dataSekolah';

// ============================================================================
// ⚙️ KONSTANTA
// ============================================================================
// ⚠️ Pakai HEX color (bukan Tailwind class) supaya bisa dipakai via style inline
const TYPE_COLORS: Record<AgendaItem['type'], string> = {
  'Pendaftaran Akademik': '#3b82f6', // blue-500
  'Ujian Akhir': '#dc2626', // red-600
  'Ujian Tengah Semester': '#f97316', // orange-500
  Kelulusan: '#22c55e', // green-500
  'Aktivitas Akademik': '#c084fc', // purple-400
  Rapat: '#eab308', // yellow-500
  'Libur Nasional': '#ec4899', // pink-500
};

const TYPE_BADGE: Record<AgendaItem['type'], string> = {
  'Pendaftaran Akademik': 'bg-slate-100 text-slate-700',
  'Ujian Akhir': 'bg-slate-100 text-slate-700',
  'Ujian Tengah Semester': 'bg-slate-100 text-slate-700',
  Kelulusan: 'bg-slate-100 text-slate-700',
  'Aktivitas Akademik': 'bg-slate-100 text-slate-700',
  Rapat: 'bg-slate-100 text-slate-700',
  'Libur Nasional': 'bg-slate-100 text-slate-700',
};

const TYPE_HEADER_COLOR: Record<AgendaItem['type'], string> = {
  'Pendaftaran Akademik': 'bg-slate-700',
  'Ujian Akhir': 'bg-slate-700',
  'Ujian Tengah Semester': 'bg-slate-700',
  Kelulusan: 'bg-slate-700',
  'Aktivitas Akademik': 'bg-slate-700',
  Rapat: 'bg-slate-700',
  'Libur Nasional': 'bg-slate-700',
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

const MONTH_MAP: Record<string, number> = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

// ============================================================================
// 📚 DAFTAR TAHUN AJARAN (untuk dropdown history)
// ============================================================================
const ACADEMIC_YEARS: AcademicYearOption[] = academicYears;

interface CalendarDayInfo {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
  isToday: boolean;
}

// ============================================================================
// 🛠️ UTILITAS TANGGAL
// ============================================================================
function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function parseDate(dateStr: string): Date | null {
  const cleaned = dateStr.replace(/\u2013|\u2014/g, '-').trim();
  const m = cleaned.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (m) {
    const month = MONTH_MAP[m[2].toLowerCase()];
    if (month !== undefined) return new Date(parseInt(m[3], 10), month, parseInt(m[1], 10));
  }
  return null;
}

function getAgendaDateInfo(item: AgendaItem): { startDate: Date | null; endDate: Date | null } {
  const s = item.date;

  const same = s.match(/(\d{1,2})\s*[-–—]\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (same) {
    const month = MONTH_MAP[same[3].toLowerCase()];
    const year = parseInt(same[4], 10);
    if (month !== undefined)
      return {
        startDate: new Date(year, month, parseInt(same[1], 10)),
        endDate: new Date(year, month, parseInt(same[2], 10)),
      };
  }

  const cross = s.match(
    /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\s*[-–—]\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/
  );
  if (cross) {
    const sm = MONTH_MAP[cross[2].toLowerCase()];
    const em = MONTH_MAP[cross[5].toLowerCase()];
    if (sm !== undefined && em !== undefined)
      return {
        startDate: new Date(parseInt(cross[3], 10), sm, parseInt(cross[1], 10)),
        endDate: new Date(parseInt(cross[6], 10), em, parseInt(cross[4], 10)),
      };
  }

  const single = parseDate(s);
  return { startDate: single, endDate: single };
}

function getAgendasForDate(date: Date, items: AgendaItem[]): AgendaItem[] {
  const check = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return items.filter((item) => {
    const { startDate, endDate } = getAgendaDateInfo(item);
    if (!startDate || !endDate) return false;
    return (
      check >=
        new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime() &&
      check <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime()
    );
  });
}

function sortByStartDate(items: AgendaItem[]): AgendaItem[] {
  return [...items].sort((a, b) => {
    const at = getAgendaDateInfo(a).startDate?.getTime() ?? 0;
    const bt = getAgendaDateInfo(b).startDate?.getTime() ?? 0;
    return at - bt;
  });
}

function filterBySemester(
  items: AgendaItem[],
  sem: 'ganjil' | 'genap',
  ganjilStartYear: number,
  genapStartYear: number
): AgendaItem[] {
  return items.filter((item) => {
    const { startDate } = getAgendaDateInfo(item);
    if (!startDate) return false;
    const t = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    ).getTime();
    if (sem === 'ganjil')
      return (
        t >= new Date(ganjilStartYear, 6, 1).getTime() &&
        t <= new Date(ganjilStartYear, 11, 31).getTime()
      );
    return (
      t >= new Date(genapStartYear, 0, 1).getTime() &&
      t <= new Date(genapStartYear, 6, 31).getTime()
    );
  });
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

// ============================================================================
// 📦 TABEL PER TIPE AGENDA
// ============================================================================
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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {/* Header Tabel */}
      <div className={`flex items-center gap-3 px-5 py-3 ${TYPE_HEADER_COLOR[type]}`}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 font-serif text-xs text-white">
          {index + 1}
        </span>
        <div className="flex items-center gap-2">
          {/* ✅ Dot mengikuti TYPE_COLORS */}
          <span
            className="h-2.5 w-2.5 rounded-full ring-2 ring-white/40"
            style={{ backgroundColor: TYPE_COLORS[type] }}
          />
          <h4 className="font-serif text-sm text-white">{type}</h4>
        </div>
        <span className="ml-auto rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white">
          {items.length} kegiatan
        </span>
      </div>

      {/* Tabel */}
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
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-center font-serif text-xs text-slate-500">No</th>
              <th className="px-4 py-3 font-serif text-xs text-slate-500">Kegiatan</th>
              <th className="px-4 py-3 font-serif text-xs text-slate-500">Tanggal</th>
              <th className="px-4 py-3 font-serif text-xs text-slate-500">Waktu</th>
              <th className="px-4 py-3 font-serif text-xs text-slate-500">Lokasi</th>
              <th className="px-4 py-3 text-center font-serif text-xs text-slate-500">Detail</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={`transition-colors hover:bg-slate-50 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                <td className="border-b border-slate-100 px-4 py-3 text-center text-sm text-slate-400">
                  {idx + 1}
                </td>
                <td className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm leading-snug font-semibold text-slate-800">{item.title}</p>
                  {item.isHighlighted && (
                    <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 font-serif text-[10px] text-slate-600">
                      ★ Unggulan
                    </span>
                  )}
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {item.excerpt}
                  </p>
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                  {item.date}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                  {item.time}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-500">
                  {item.location ?? <span className="text-slate-300">—</span>}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-center">
                  <button
                    onClick={() => onDetail(item)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
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

// ============================================================================
// 📦 SEKSI SEMESTER
// ============================================================================
function SemesterSection({
  title,
  subtitle,
  items,
  onDetail,
}: {
  title: string;
  subtitle: string;
  headerColor?: string;
  items: AgendaItem[];
  onDetail: (item: AgendaItem) => void;
}) {
  const groups = useMemo(() => groupByType(items), [items]);

  return (
    <div>
      {/* Judul Semester */}
      <div className="mb-6 px-1 py-1">
        <h2 className="text-center font-serif text-lg tracking-wide text-slate-800 uppercase md:text-xl">
          {title}
        </h2>
        <p className="mt-1 text-center text-xs font-medium text-slate-500">
          {subtitle} &nbsp;·&nbsp; {items.length} kegiatan
        </p>
      </div>

      {/* Tabel per Tipe */}
      {groups.length > 0 ? (
        <div className="space-y-6">
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16">
          <CalendarDays className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-semibold text-slate-400">Belum ada data agenda</p>
          <p className="mt-1 text-xs text-slate-400">
            Tambahkan data pada file{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5">agenda.ts</code>
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 📦 KOMPONEN UTAMA
// ============================================================================
export default function AgendaPage({ onNavigate, isActive }: PageProps & { isActive?: boolean }) {
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
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<AgendaItem | null>(null);

  const [selectedYear, setSelectedYear] = useState<string>(
    () => ACADEMIC_YEARS[0]?.value ?? '2026/2027'
  );
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);

  const currentYearOption = useMemo(
    () => ACADEMIC_YEARS.find((y) => y.value === selectedYear) ?? ACADEMIC_YEARS[0],
    [selectedYear]
  );

  const semesterGanjilItems = useMemo(
    () =>
      sortByStartDate(
        filterBySemester(
          agendaItems,
          'ganjil',
          currentYearOption.ganjilStartYear,
          currentYearOption.genapStartYear
        )
      ),
    [currentYearOption]
  );
  const semesterGenapItems = useMemo(
    () =>
      sortByStartDate(
        filterBySemester(
          agendaItems,
          'genap',
          currentYearOption.ganjilStartYear,
          currentYearOption.genapStartYear
        )
      ),
    [currentYearOption]
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

  const { showToast } = useToast();

  const handleDateClick = useCallback((d: Date) => setSelectedDate(d), []);
  const handleAgendaClick = useCallback((item: AgendaItem) => {
    setDetailItem(item);
    setShowDetailModal(true);
  }, []);

  const handleExportPdf = useCallback(() => {
    if (!currentYearOption) return;
    exportKalenderAkademikPdf({
      tahunAjaran: selectedYear,
      ganjil: semesterGanjilItems,
      genap: semesterGenapItems,
    });
    showToast('success', 'Kalender akademik PDF berhasil diunduh.');
  }, [currentYearOption, selectedYear, semesterGanjilItems, semesterGenapItems, showToast]);

  const selectedDateAgendas = useMemo(
    () => (selectedDate ? getAgendasForDate(selectedDate, agendaItems) : []),
    [selectedDate]
  );

  if (isActive === false) return null;

  return createPortal(
    <div className="animate-in fade-in fixed inset-0 z-[9999] flex h-auto min-h-screen w-screen flex-col overflow-y-auto bg-slate-50 font-sans text-slate-900 antialiased duration-200">
      {/* ═══ HEADER ════════════════════════════════════════════════════════ */}
      <header className="absolute top-0 right-0 left-0 z-30 flex h-15 w-full items-center justify-between bg-transparent px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('dashboard')}
            className="flex h-8 w-8 items-center justify-center text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif text-base leading-tight text-white">Kalender Akademik</h1>
            <p className="mt-0.5 text-[11px] text-slate-400">Tahun Ajaran {selectedYear}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-2 hidden flex-col items-end sm:flex">
            <span className="font-serif text-xs leading-none text-white">
              {namaSekolahUppercase}
            </span>
            <span className="mt-1 text-[10px] leading-none tracking-wider text-slate-500 uppercase">
              Portal Publik Terintegrasi
            </span>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-white/10 bg-white/5 p-1 shadow-md">
            <img
              src={`${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`}
              alt="Logo"
              className="h-full w-full object-cover"  loading="lazy" decoding="async" />
          </div>
        </div>
      </header>

      {/* ═══ HERO BANNER ═══════════════════════════════════════════════════ */}
      <div
        className="relative flex h-[390px] w-full shrink-0 items-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url("${import.meta.env.BASE_URL}images/Dashboard/logo-profile.webp")`,
          backgroundPosition: 'center 30%', // 30% = geser sedikit ke bawah
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-transparent" />
        <div className="relative z-10 px-6 md:px-16">
          <h1 className="font-serif text-3xl tracking-wide text-white drop-shadow-sm md:text-4xl">
            Kalender Akademik
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-300 md:text-base">
            {namaSekolahUppercase}
          </p>
        </div>
      </div>

      {/* ═══ KONTEN UTAMA ══════════════════════════════════════════════════ */}
      <div className="relative z-20 mx-auto -mt-20 w-full max-w-7xl flex-1 px-4 pb-16 md:px-8">
        {/* ─── KALENDER INTERAKTIF ─────────────────────────────────────── */}
        <div className="flex min-h-[700px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:rounded-3xl">
          {/* Header Kalender */}
          <div className="flex shrink-0 flex-col items-center justify-between gap-4 bg-white px-8 py-7 sm:flex-row">
            <div className="order-2 flex items-center gap-3 sm:order-1">
              <button
                onClick={goToPrevMonth}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
              <button
                onClick={goToNextMonth}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
              >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </button>
              {selectedDate && (
                <div className="ml-1 hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      selectedDateAgendas.length > 0 ? 'bg-slate-700' : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedDateAgendas.length === 0
                      ? 'Tidak ada agenda'
                      : `${selectedDateAgendas.length} agenda`}
                  </span>
                </div>
              )}
            </div>

            <h3 className="order-1 font-serif text-2xl text-slate-800 sm:order-2">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>

            <div className="order-3">
              <button
                onClick={handleExportPdf}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-xs transition hover:bg-slate-50"
              >
                <div className="rounded bg-slate-100 p-1.5 text-slate-500">
                  <Download className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs leading-tight font-semibold text-slate-700">
                    Unduh Kalender
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">PDF</p>
                </div>
              </button>
            </div>
          </div>

          {/* Grid Kalender */}
          <div className="flex flex-1 flex-col px-8 pb-10">
            <div className="grid shrink-0 grid-cols-7 border-b border-slate-200 pb-2">
              {DAY_NAMES.map((day) => (
                <div
                  key={day}
                  className={`py-2 text-center font-serif text-sm tracking-wide ${
                    day === 'Minggu' ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid flex-1 grid-cols-7 border-t border-l border-slate-200">
              {calendarDays.map((di, index) => {
                const dayAgendas = getAgendasForDate(di.fullDate, agendaItems);
                const isSelected = selectedDate ? isSameDay(di.fullDate, selectedDate) : false;
                const isSun = di.fullDate.getDay() === 0;

                return (
                  <div
                    key={`${di.fullDate.getTime()}-${index}`}
                    onClick={() => handleDateClick(di.fullDate)}
                    className={[
                      'flex min-h-[120px] cursor-pointer flex-col border-r border-b border-slate-200 p-2 transition-all hover:bg-slate-50/60',
                      !di.isCurrentMonth ? 'bg-slate-50/30' : '',
                      isSelected ? 'bg-slate-100/50' : '',
                    ].join(' ')}
                  >
                    <div className="mb-1 flex w-full justify-end">
                      <span
                        className={`font-serif text-xs ${
                          !di.isCurrentMonth
                            ? 'text-slate-200'
                            : di.isToday
                              ? 'rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] font-extrabold text-white'
                              : isSun
                                ? 'text-slate-400'
                                : 'text-slate-500'
                        }`}
                      >
                        {di.date}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col space-y-1 overflow-hidden">
                      {dayAgendas.slice(0, 4).map((agenda) => (
                        <div
                          key={agenda.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAgendaClick(agenda);
                          }}
                          className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:opacity-70"
                          title={agenda.title}
                        >
                          {/* ✅ Dot di kalender */}
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: TYPE_COLORS[agenda.type] }}
                          />
                          <span className="truncate leading-tight">{agenda.title}</span>
                        </div>
                      ))}
                      {dayAgendas.length > 4 && (
                        <p className="pl-3 font-serif text-[9px] text-slate-500">
                          +{dayAgendas.length - 4} lainnya
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legenda */}
          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 bg-slate-50/50 px-8 py-4">
            <span className="font-serif text-xs tracking-wider text-slate-400 uppercase">
              Keterangan:
            </span>
            {(Object.keys(TYPE_COLORS) as AgendaItem['type'][]).map((type) => (
              <div key={type} className="flex items-center gap-2">
                {/* ✅ Dot di legenda */}
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: TYPE_COLORS[type] }}
                />
                <span className="text-xs font-medium text-slate-500">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TABEL PER TIPE — DINAMIS MENGIKUTI TAHUN AJARAN
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="mt-14 w-full">
          {/* Judul Section + Dropdown History */}
          <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="hidden w-40 sm:block" />

            <div className="text-center">
              <h2 className="font-serif text-xl tracking-wide text-slate-800 uppercase md:text-2xl">
                Kalender Akademik {namaSekolah}
              </h2>
              <p className="mt-1.5 text-sm text-slate-400">Tahun Ajaran {selectedYear}</p>

              <div className="mt-3 h-px w-full bg-slate-300" />
            </div>

            {/* Dropdown Tahun Ajaran */}
            <div className="relative w-40 shrink-0">
              <button
                onClick={() => setShowYearDropdown((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span>{currentYearOption.label}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                    showYearDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showYearDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowYearDropdown(false)} />

                  <div className="absolute right-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                    {ACADEMIC_YEARS.map((year) => {
                      const active = year.value === selectedYear;
                      return (
                        <button
                          key={year.value}
                          onClick={() => {
                            setSelectedYear(year.value);
                            setShowYearDropdown(false);
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium transition ${
                            active
                              ? 'bg-slate-100 text-slate-900'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{year.label}</span>
                          {active && (
                            <svg
                              className="h-3 w-3 text-slate-700"
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
          </div>

          {/* ─── SEMESTER GANJIL ─────────────────────────────────────────── */}
          <SemesterSection
            title={`Semester Ganjil T.A. ${selectedYear}`}
            subtitle={`Juli ${currentYearOption.ganjilStartYear} — Desember ${currentYearOption.ganjilStartYear}`}
            items={semesterGanjilItems}
            onDetail={handleAgendaClick}
          />

          {/* Pemisah */}
          <div className="my-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="shrink-0 rounded-full bg-slate-100 px-5 py-2 font-serif text-xs tracking-widest text-slate-400 uppercase">
              ● ● ●
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* ─── SEMESTER GENAP ──────────────────────────────────────────── */}
          <SemesterSection
            title={`Semester Genap T.A. ${selectedYear}`}
            subtitle={`Januari ${currentYearOption.genapStartYear} — Juli ${currentYearOption.genapStartYear}`}
            items={semesterGenapItems}
            onDetail={handleAgendaClick}
          />
        </div>
      </div>

      {/* ═══ MODAL DETAIL ═══════════════════════════════════════════════════ */}
      {showDetailModal && detailItem && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in-95 flex max-h-[calc(100vh-4rem)] w-full max-w-lg flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl duration-200">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                {/* ✅ Dot di modal detail */}
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: TYPE_COLORS[detailItem.type] }}
                />
                <span
                  className={`rounded-full px-3 py-1 font-serif text-xs ${TYPE_BADGE[detailItem.type]}`}
                >
                  {detailItem.type}
                </span>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <h3 className="font-serif text-lg text-slate-900">{detailItem.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{detailItem.excerpt}</p>

              <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="font-medium">{detailItem.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="font-medium">{detailItem.time}</span>
                </div>
                {detailItem.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="font-medium">{detailItem.location}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="mb-2 font-serif text-xs tracking-wider text-slate-800 uppercase">
                  Detail Kegiatan
                </h4>
                <p className="text-sm leading-relaxed whitespace-pre-line text-slate-500">
                  {detailItem.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-400">
                <Tag className="h-3.5 w-3.5" />
                <span>ID: {detailItem.id}</span>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full cursor-pointer rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
