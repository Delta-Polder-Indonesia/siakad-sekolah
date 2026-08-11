import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClasses,
  getStudents,
  getSuratIzin,
  getTeachers,
  updateStatusSuratIzin,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Calendar, ChevronLeft, ChevronRight, MailOpen } from 'lucide-react';

type LetterItem = ReturnType<typeof getSuratIzin>[number] & {
  studentName: string;
  studentNis: string;
  className: string;
};

export default function KotakSuratGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedLetterId, setSelectedLetterId] = useState<string>('');

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'semua' | LetterItem['status']>('semua');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const teacher = useMemo(() => {
    return getTeachers().find((item) => item.id === user?.id);
  }, [user, storeVersion]);

  const letters = useMemo(() => {
    if (!teacher) return [];
    const studentMap = new Map(getStudents().map((s) => [s.id, s]));
    const classMap = new Map(getClasses().map((c) => [c.id, c]));
    return getSuratIzin()
      .filter((item) => teacher.classIds.includes(item.classId))
      .map((item) => {
        const student = studentMap.get(item.studentId);
        const className = classMap.get(item.classId)?.name || '-';
        return {
          ...item,
          studentName: student?.name || 'Siswa tidak ditemukan',
          studentNis: student?.nis || '-',
          className,
        };
      });
  }, [teacher, storeVersion]);

  const filteredLetters = useMemo(() => {
    return letters.filter((item) => {
      const dateMatch = selectedDate ? item.letterDate === selectedDate : true;
      const statusMatch = selectedStatus === 'semua' ? true : item.status === selectedStatus;
      return dateMatch && statusMatch;
    });
  }, [letters, selectedDate, selectedStatus]);

  const selectedLetter = useMemo(() => {
    return filteredLetters.find((item) => item.id === selectedLetterId) || null;
  }, [filteredLetters, selectedLetterId]);

  useEffect(() => {
    if (selectedLetterId && !filteredLetters.some((item) => item.id === selectedLetterId)) {
      setSelectedLetterId('');
    }
  }, [filteredLetters, selectedLetterId]);

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
  }, [selectedMonth]);

  const calendarData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const monthLetters = letters.filter((item) => item.letterDate.startsWith(selectedMonth));
    const countMap: Record<string, number> = {};
    monthLetters.forEach((item) => {
      countMap[item.letterDate] = (countMap[item.letterDate] || 0) + 1;
    });

    const weeks: { day: number; date: string; count: number }[][] = [];
    let currentWeek: { day: number; date: string; count: number }[] = [];

    for (let i = 0; i < startWeekday; i += 1) {
      currentWeek.push({ day: 0, date: '', count: 0 });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentWeek.push({ day, date, count: countMap[date] || 0 });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ day: 0, date: '', count: 0 });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return { weeks, monthLettersCount: monthLetters.length };
  }, [letters, selectedMonth]);

  const navigateMonth = (offset: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const next = new Date(year, month - 1 + offset, 1);
    setSelectedMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
    setSelectedDate(null);
  };

  const handleUpdateStatus = (id: string, status: LetterItem['status']) => {
    updateStatusSuratIzin(id, status);
  };

  const typeLabel: Record<LetterItem['type'], string> = {
    izin: 'Izin',
    sakit: 'Sakit',
    dispensasi: 'Dispensasi',
    lainnya: 'Lainnya',
  };

  const statusLabel: Record<LetterItem['status'], string> = {
    menunggu: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
  };

  const getStatusBadgeStyle = (status: LetterItem['status'], isSelectedSidebar = false) => {
    if (isSelectedSidebar) return 'border-black bg-black text-white';
    switch (status) {
      case 'disetujui':
        return 'border-emerald-600 bg-white text-emerald-700';
      case 'menunggu':
        return 'border-blue-600 bg-white text-blue-700';
      case 'ditolak':
        return 'border-rose-600 bg-white text-rose-700 line-through';
      default:
        return 'border-black bg-white text-black';
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-lg leading-none font-bold tracking-tight text-black">
            Kotak Surat Izin Masuk
          </h1>
          <p className="mt-1.5 text-xs leading-none font-bold text-black">
            Pencatatan evaluasi berkas masuk, dokumen perizinan, dan laporan sakit berkala per
            kompartemen kelas.
          </p>
        </div>

        {/* Tombol kalender di pojok kanan header */}
        <div className="relative flex items-center gap-2 self-start border-l-2 border-black pl-4 sm:self-end">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-wider text-black uppercase">
              Arsip Kalender
            </span>
            <button type="button"
              onClick={() => setShowCalendar((prev) => !prev)}
              className="mt-0.5 inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-black bg-white px-2 py-1 font-mono text-xs font-bold text-black uppercase transition-colors outline-none hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
            >
              <Calendar className="h-3.5 w-3.5" />
              {selectedDate ? selectedDate : monthLabel.toUpperCase()}
            </button>
          </div>

          {/* KALENDER DROPDOWN */}
          {showCalendar && (
            <div className="absolute top-full right-0 z-20 mt-2 w-[290px] rounded-md border-2 border-black bg-white p-3 shadow-md">
              {/* Nav bulan */}
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[10px] font-bold tracking-wider text-black uppercase">
                  Arsip Bulanan
                </h2>
                <div className="flex items-center gap-1">
                  <button type="button"
                    onClick={() => navigateMonth(-1)}
                    className="cursor-pointer rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[100px] text-center text-[10px] font-bold text-black uppercase">
                    {monthLabel}
                  </span>
                  <button type="button"
                    onClick={() => navigateMonth(1)}
                    className="cursor-pointer rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Label hari */}
              <div className="mb-1 grid grid-cols-7 gap-1">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                  <div
                    key={day}
                    className="py-0.5 text-center text-[9px] font-bold text-black uppercase"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid tanggal */}
              <div className="space-y-1">
                {calendarData.weeks.map((week, wIdx) => (
                  <div key={`${selectedMonth}_${wIdx}`} className="grid grid-cols-7 gap-1">
                    {week.map((day, dIdx) => (
                      <button type="button"
                        key={`${day.date}_${dIdx}`}
                        disabled={day.day === 0}
                        onClick={() => {
                          setSelectedDate(day.date || null);
                          setSelectedLetterId('');
                          setShowCalendar(false);
                        }}
                        className={`relative aspect-square cursor-pointer rounded-md border-2 font-mono text-[10px] font-bold transition-colors ${
                          day.day === 0
                            ? 'border-transparent bg-transparent'
                            : selectedDate === day.date
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : day.count > 0
                                ? 'border-black bg-white text-black hover:bg-neutral-100'
                                : 'border-transparent text-black/50 hover:border-black'
                        }`}
                      >
                        {day.day > 0 ? day.day : ''}
                        {day.count > 0 && selectedDate !== day.date && (
                          <span className="absolute right-0.5 bottom-0 text-[8px] font-black text-black">
                            .{day.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              {/* Footer kalender */}
              <div className="mt-2 flex items-center justify-between border-t-2 border-black/10 pt-2 text-[10px] font-bold text-black uppercase">
                <span>Total surat bulan ini:</span>
                <strong className="font-mono text-black">{calendarData.monthLettersCount}</strong>
              </div>

              {selectedDate && (
                <button type="button"
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedLetterId('');
                    setShowCalendar(false);
                  }}
                  className="mt-1.5 w-full cursor-pointer rounded-md border-2 border-black bg-white py-1 text-[10px] font-bold text-black uppercase transition-colors hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
                >
                  Hapus Filter Tanggal
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── FILTER STATUS BAR ───────────────────────────────────── */}
      <section className="rounded-md border-2 border-black bg-white p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-bold tracking-wider text-black uppercase">
            Filter Status:
          </span>

          <button type="button"
            onClick={() => {
              setSelectedStatus('semua');
              setSelectedLetterId('');
            }}
            className={`cursor-pointer rounded-md border-2 px-3 py-1 text-[10px] font-bold tracking-wide uppercase transition-colors ${
              selectedStatus === 'semua'
                ? 'border-black bg-black text-white'
                : 'border-black bg-white text-black hover:bg-neutral-100'
            }`}
          >
            Semua
          </button>

          {(['menunggu', 'disetujui', 'ditolak'] as const).map((status) => (
            <button type="button"
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setSelectedLetterId('');
              }}
              className={`cursor-pointer rounded-md border-2 px-3 py-1 text-[10px] font-bold tracking-wide uppercase transition-colors ${
                selectedStatus === status
                  ? 'border-black bg-black text-white'
                  : 'border-black bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {statusLabel[status]}
            </button>
          ))}
        </div>
      </section>

      {/* ── NOTIFIKASI FILTER AKTIF ─────────────────────────────── */}
      {(selectedDate || selectedStatus !== 'semua') && (
        <div className="rounded-md border-2 border-black bg-white px-3 py-2 text-[10px] font-bold tracking-tight text-black uppercase">
          Filter Aktif:{' '}
          <span className="font-black">
            {selectedDate ? `TANGGAL · ${selectedDate}` : 'SEMUA TANGGAL'}
          </span>
          <span className="mx-2 text-black/30">|</span>
          Status: <span className="font-black">{selectedStatus.toUpperCase()}</span>
        </div>
      )}

      {/* ── TWO-COLUMN WORKSPACE ────────────────────────────────── */}
      <div className="grid items-start gap-4 lg:grid-cols-12">
        {/* PANEL KIRI — DAFTAR SURAT */}
        <section className="rounded-md border-2 border-black bg-white p-3 lg:col-span-4">
          {/* Section header */}
          <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-2 text-[10px] font-bold tracking-wider text-black uppercase">
            <MailOpen className="h-4 w-4 text-black" />
            <span>Daftar Berkas Masuk ({filteredLetters.length})</span>
          </div>

          <div className="max-h-[520px] space-y-1.5 overflow-y-auto pr-0.5">
            {filteredLetters.map((item) => {
              const isSelected = selectedLetterId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedLetterId(item.id)}
                  className={`flex w-full cursor-pointer flex-col rounded-md border-2 p-2.5 text-left transition-colors ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : 'border-black bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  {/* Baris atas: nama + badge status */}
                  <div className="flex w-full items-center justify-between gap-2">
                    <p
                      className={`truncate text-xs font-bold uppercase ${
                        isSelected ? 'text-white' : 'text-black'
                      }`}
                    >
                      {item.studentName}
                    </p>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-md border-2 px-1.5 py-0.5 text-[9px] font-bold uppercase ${getStatusBadgeStyle(
                        item.status,
                        isSelected
                      )}`}
                    >
                      {statusLabel[item.status]}
                    </span>
                  </div>

                  {/* NIS & kelas */}
                  <p
                    className={`mt-0.5 text-[10px] ${
                      isSelected ? 'text-white/70' : 'text-black/60'
                    }`}
                  >
                    {item.studentNis} &bull; {item.className.toUpperCase()}
                  </p>

                  {/* Subject preview */}
                  <p
                    className={`mt-1.5 w-full truncate rounded-md border-2 border-black/10 px-1.5 py-1 text-[10px] ${
                      isSelected ? 'bg-neutral-900 text-neutral-200' : 'bg-neutral-50 text-black/80'
                    }`}
                  >
                    <span
                      className={`mr-1 text-[10px] font-bold ${
                        isSelected ? 'text-white' : 'text-black'
                      }`}
                    >
                      [{typeLabel[item.type].toUpperCase()}]
                    </span>
                    {item.subject}
                  </p>
                </button>
              );
            })}

            {filteredLetters.length === 0 && (
              <div className="rounded-md border-2 border-dashed border-black bg-white py-14 text-center">
                <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                  EMPTY_MAILBOX_FEED
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-black/60">
                  Tidak ada surat sesuai filter aktif.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* PANEL KANAN — DETAIL SURAT */}
        <section className="flex min-h-[380px] flex-col rounded-md border-2 border-black bg-white p-3 lg:col-span-8">
          {/* Section header */}
          <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-2 text-[10px] font-bold tracking-wider text-black uppercase">
            <MailOpen className="h-4 w-4 text-black" />
            <span>Pratinjau Dokumen</span>
          </div>

          {!selectedLetter ? (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed border-black bg-white py-14 text-center">
              <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                AWAITING_DOCUMENT_SELECTION
              </p>
              <p className="mt-0.5 max-w-xs text-[10px] font-bold text-black/60">
                Pilih salah satu surat pada panel kiri untuk melihat isi dokumen secara lengkap.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Meta header dokumen */}
              <div className="border-b-2 border-black pb-3">
                <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold text-black uppercase">
                  Jenis: {typeLabel[selectedLetter.type].toUpperCase()}
                </span>
                <h2 className="mt-2 text-xs font-bold tracking-tight text-black uppercase">
                  {selectedLetter.subject}
                </h2>
                <div className="mt-2 flex flex-col justify-between gap-1 text-[10px] font-bold text-black sm:flex-row sm:items-center">
                  <p>
                    Siswa:{' '}
                    <span className="font-black text-black uppercase">
                      {selectedLetter.studentName}
                    </span>{' '}
                    ({selectedLetter.studentNis}) &bull;{' '}
                    <span className="font-black text-black">
                      {selectedLetter.className.toUpperCase()}
                    </span>
                  </p>
                  <p className="font-mono">
                    Dikirim:{' '}
                    {new Date(selectedLetter.createdAt)
                      .toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                      .toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Isi pesan */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                  Pesan Lengkap
                </label>
                <div className="rounded-md border-2 border-black bg-white p-3">
                  <p className="text-xs leading-relaxed font-bold whitespace-pre-line text-black">
                    {selectedLetter.message}
                  </p>
                </div>
              </div>

              {/* Lampiran */}
              <div className="flex flex-col justify-between gap-2 rounded-md border-2 border-black bg-white p-2.5 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold tracking-wider text-black uppercase">
                    Berkas Lampiran
                  </span>
                  <p className="truncate text-xs font-bold text-black uppercase">
                    {selectedLetter.attachmentName || 'Tidak ada berkas fisik'}
                  </p>
                </div>
                {selectedLetter.attachmentDataUrl && (
                  <a
                    href={selectedLetter.attachmentDataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center justify-center rounded-md border-2 border-black bg-white px-3 py-1.5 text-[10px] font-bold text-black uppercase transition-colors hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
                  >
                    Buka Lampiran
                  </a>
                )}
              </div>

              {/* Validasi status */}
              <div className="border-t-2 border-black pt-3">
                <label className="mb-2 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Validasi Status Persetujuan
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['menunggu', 'disetujui', 'ditolak'] as const).map((status) => {
                    const isActive = selectedLetter.status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedLetter.id, status)}
                        className={`cursor-pointer rounded-md border-2 px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${
                          isActive
                            ? 'border-black bg-black text-white'
                            : 'border-black bg-white text-black hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600'
                        }`}
                      >
                        {status === 'menunggu'
                          ? 'Set Menunggu'
                          : status === 'disetujui'
                            ? 'Setujui'
                            : 'Tolak'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
