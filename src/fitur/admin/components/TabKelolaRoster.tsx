import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Trash2,
  Plus,
  Clock,
  MapPin,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Calendar,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  addClassRoster,
  deleteClassRoster,
  getClassRosters,
  getClasses,
  getTeachers,
} from '../../../data/services';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

// ==========================================
// Types & Constants
// ==========================================
interface ClassRoster {
  id: string;
  classId: string;
  subject: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  teacherName: string;
  updatedBy: string;
  updatedAt: number;
}

const DAY_NAMES: Record<number, string> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
};

const SCHOOL_DAY_OPTIONS = [
  { value: 1, label: 'SENIN' },
  { value: 2, label: 'SELASA' },
  { value: 3, label: 'RABU' },
  { value: 4, label: 'KAMIS' },
  { value: 5, label: 'JUMAT' },
  { value: 6, label: 'SABTU' },
];

// ==========================================
// Robust Helper Functions
// ==========================================
const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [hours, mins] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (mins || 0);
};

const formatMinutesToTime = (totalMinutes: number): string => {
  const normalizedMinutes = Math.max(0, totalMinutes % (24 * 60));
  const hours = Math.floor(normalizedMinutes / 60);
  const mins = normalizedMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const addMinutes = (timeStr: string, minutes: number): string => {
  const startMins = parseTimeToMinutes(timeStr);
  return formatMinutesToTime(startMins + minutes);
};

// ==========================================
// Main Component
// ==========================================
export default function TabKelolaRoster({ setNotice }: { setNotice: (msg: string) => void }) {
  const storeVersion = useStoreVersion();
  const allClasses = useMemo(() => getClasses() || [], [storeVersion]);
  const allTeachers = useMemo(() => getTeachers() || [], [storeVersion]);

  // Form States
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('1');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:00');
  const [room, setRoom] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('90');

  // UI Notification & Confirmation States
  const [localNotice, setLocalNotice] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Sync default class ID safely
  useEffect(() => {
    if (!selectedClassId && allClasses.length > 0) {
      setSelectedClassId(allClasses[0].id);
    }
  }, [allClasses, selectedClassId]);

  // Rosters Selectors
  const classRosters = useMemo<ClassRoster[]>(
    () => (selectedClassId ? (getClassRosters(selectedClassId) as ClassRoster[]) : []),
    [selectedClassId, storeVersion]
  );

  const filteredRosters = useMemo(() => {
    const rosters =
      selectedDayFilter === 'all'
        ? classRosters
        : classRosters.filter((r) => r.dayOfWeek === selectedDayFilter);

    return [...rosters].sort(
      (a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)
    );
  }, [classRosters, selectedDayFilter]);

  // Auto calculate schedule time
  const hitungWaktuOtomatis = useCallback(() => {
    const rostersHariIni = classRosters.filter((r) => r.dayOfWeek === Number(dayOfWeek));

    if (rostersHariIni.length > 0) {
      const lastRoster = [...rostersHariIni].sort((a, b) => b.endTime.localeCompare(a.endTime))[0];
      setStartTime(lastRoster.endTime);
      setEndTime(addMinutes(lastRoster.endTime, Number(durationMinutes)));
    } else {
      setStartTime('07:30');
      setEndTime(addMinutes('07:30', Number(durationMinutes)));
    }
    setLocalNotice(null);
  }, [classRosters, dayOfWeek, durationMinutes]);

  // Recalculate time when day, class, or duration selection changes
  useEffect(() => {
    hitungWaktuOtomatis();
  }, [dayOfWeek, selectedClassId, durationMinutes, hitungWaktuOtomatis]);

  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);
    setEndTime(addMinutes(newStart, Number(durationMinutes)));
    setLocalNotice(null);
  };

  // Validasi sebelum konfirmasi simpan
  const preCheckValidation = () => {
    if (!selectedClassId || !subject.trim() || !startTime || !endTime) {
      setLocalNotice({
        message: '⚠️ Lengkapi seluruh data mata pelajaran dan alokasi waktu.',
        type: 'error',
      });
      return;
    }

    const newStartMins = parseTimeToMinutes(startTime);
    const newEndMins = parseTimeToMinutes(endTime);

    if (newStartMins >= newEndMins) {
      setLocalNotice({
        message: '⚠️ Jam selesai harus lebih besar dari jam mulai.',
        type: 'error',
      });
      return;
    }

    // Checking overlap
    const isConflict = classRosters.some((r) => {
      if (r.dayOfWeek !== Number(dayOfWeek)) return false;
      const existStart = parseTimeToMinutes(r.startTime);
      const existEnd = parseTimeToMinutes(r.endTime);
      return newStartMins < existEnd && newEndMins > existStart;
    });

    if (isConflict) {
      setLocalNotice({
        message: `⚠️ Jadwal bentrok dengan roster eksis di jam ${startTime} - ${endTime}!`,
        type: 'error',
      });
      return;
    }

    setLocalNotice(null);
    setShowConfirm(true);
  };

  // Eksekusi simpan
  const handleExecuteSimpan = () => {
    const teacher = allTeachers.find((t) => t.id === selectedTeacherId);

    try {
      addClassRoster({
        id: `r_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        classId: selectedClassId,
        subject: subject.trim(),
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        room: room.trim() || undefined,
        teacherName: teacher ? teacher.name : 'Unknown Teacher',
        updatedBy: 'admin_master',
        updatedAt: Date.now(),
      });
    } catch (error) {
      setLocalNotice({
        message: '⚠️ Gagal menyimpan. Penyimpanan penuh, hapus data lama.',
        type: 'error',
      });
      setShowConfirm(false);
      return;
    }

    const savedSubject = subject.trim().toUpperCase();
    setSubject('');
    setRoom('');
    setLocalNotice({ message: '✅ Jadwal roster berhasil ditambahkan.', type: 'success' });
    setNotice(`✅ Roster pelajaran ${savedSubject} berhasil ditambahkan.`);
    setShowConfirm(false);
  };

  // Hapus roster
  const handleDeleteRoster = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteClassRoster(deleteTargetId);
      setLocalNotice({ message: '✅ Roster berhasil dihapus.', type: 'success' });
      setNotice('✅ Data roster pelajaran telah dihapus.');
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ======== FORM INPUT ROSTER ======== */}
      <div className="w-full space-y-4 bg-white p-4">
        {/* STRIP HEADER */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div>
            <h3 className="text-xs font-bold tracking-wide text-black uppercase">
              Tambah Roster Pelajaran
            </h3>
            <p className="mt-0.5 text-[10px] text-black">
              Sistem input fleksibel dengan penanda indikator bentrok jam pelajaran secara intuitif.
            </p>
          </div>
          <button
            type="button"
            onClick={hitungWaktuOtomatis}
            className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-1 text-[10px] font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
          >
            <RefreshCw className="h-3 w-3" /> Set Jam Otomatis
          </button>
        </div>

        {/* GRID KONTROL FORM */}
        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-4 lg:grid-cols-8">
          {/* Kelas */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Kelas
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setLocalNotice(null);
                setShowConfirm(false);
              }}
              className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              {allClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hari */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">Hari</label>
            <select
              value={dayOfWeek}
              onChange={(e) => {
                setDayOfWeek(e.target.value);
                setLocalNotice(null);
                setShowConfirm(false);
              }}
              className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              {SCHOOL_DAY_OPTIONS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* Set Durasi */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Set Durasi
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => {
                setDurationMinutes(e.target.value);
                setEndTime(addMinutes(startTime, Number(e.target.value)));
                setLocalNotice(null);
                setShowConfirm(false);
              }}
              className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              <option value="45">45 Menit (1 JP)</option>
              <option value="90">90 Menit (2 JP)</option>
              <option value="120">120 Menit (3 JP)</option>
              <option value="180">180 Menit (4 JP)</option>
            </select>
          </div>

          {/* Jam Mulai */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Jam Mulai
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            />
          </div>

          {/* Jam Selesai */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Jam Selesai
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setLocalNotice(null);
                setShowConfirm(false);
              }}
              className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            />
          </div>

          {/* Mata Pelajaran */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Mata Pelajaran
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setLocalNotice(null);
                setShowConfirm(false);
              }}
              placeholder="Matematika"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
            />
          </div>

          {/* Ruang Kelas */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Ruang Kelas
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                setLocalNotice(null);
                setShowConfirm(false);
              }}
              placeholder="LAB-01"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
            />
          </div>

          {/* Pengajar */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Pengajar
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => {
                setSelectedTeacherId(e.target.value);
                setLocalNotice(null);
                setShowConfirm(false);
              }}
              className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              <option value="">-- Pilih Guru --</option>
              {allTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BAR BAWAH: NOTIFIKASI & TOMBOL UTAMA */}
        <div className="relative flex min-h-[44px] flex-col items-center justify-between gap-3 border-t-2 border-black/10 pt-3 sm:flex-row">
          {/* Sisi Kiri: Notifikasi Status Inline */}
          <div className="flex w-full flex-1 items-center sm:w-auto">
            {localNotice ? (
              <div
                className={`flex items-center gap-1.5 text-xs font-bold tracking-tight ${
                  localNotice.type === 'error' ? 'text-red-600' : 'text-black'
                }`}
              >
                {localNotice.type === 'error' ? (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-black" />
                )}
                <span>{localNotice.message}</span>
              </div>
            ) : (
              <div className="hidden items-center gap-1.5 text-xs font-bold tracking-tight text-black sm:flex">
                <Clock className="h-3.5 w-3.5 shrink-0 text-black" />
                <span>Estimasi urutan auto-increment aktif.</span>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Wadah Tombol & Pop-up Kustom */}
          <div className="relative flex w-full shrink-0 flex-col items-end gap-2 sm:w-auto">
            {/* POP-UP KONFIRMASI SIMPAN */}
            {showConfirm && (
              <div className="absolute right-0 bottom-full z-10 mb-2 w-64 space-y-2 rounded-md border-2 border-black bg-white p-2.5 text-right">
                <div className="flex items-start gap-1.5 text-left">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                  <p className="text-[10px] leading-tight font-bold text-black">
                    Yakin ingin menyimpan roster pelajaran ini sekarang?
                  </p>
                </div>
                <div className="flex justify-end gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteSimpan}
                    className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                  >
                    Ya, Simpan
                  </button>
                </div>
              </div>
            )}

            {/* TOMBOL SIMPAN ROSTER (Sesuai sampel gaya tombol) */}
            <button
              type="button"
              onClick={preCheckValidation}
              disabled={showConfirm}
              className={`inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black px-4 py-2 text-xs font-bold transition-colors sm:w-auto ${
                showConfirm
                  ? 'cursor-not-allowed bg-neutral-100 text-black opacity-60'
                  : 'bg-white text-black hover:border-black hover:bg-neutral-100'
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              Simpan Roster
            </button>
          </div>
        </div>
      </div>

      {/* ======== TABEL DAFTAR ROSTER ======== */}
      <div className="w-full space-y-4 bg-white p-4">
        {/* HEADER TABEL */}
        <div className="flex flex-col gap-2 border-b-2 border-black pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-black" />
            <h3 className="text-xs font-bold tracking-wide text-black uppercase">
              Daftar Susunan Roster Pelajaran
            </h3>
          </div>

          <select
            value={selectedDayFilter}
            onChange={(e) =>
              setSelectedDayFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
          >
            <option value="all">Semua Hari</option>
            {SCHOOL_DAY_OPTIONS.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto rounded-md border-2 border-black">
          <table className="w-full border-collapse bg-white text-left">
            <thead>
              <tr className="border-b-2 border-black text-[10px] font-bold tracking-wider text-black uppercase">
                <th className="w-[100px] border-r border-black p-3">Hari</th>
                <th className="w-[90px] border-r border-black p-3 text-center">Jam Ke</th>
                <th className="border-r border-black p-3">Mata Pelajaran</th>
                <th className="w-[150px] border-r border-black p-3">Alokasi Waktu</th>
                <th className="w-[120px] border-r border-black p-3">Ruang Kelas</th>
                <th className="border-r border-black p-3">Tenaga Pengajar</th>
                <th className="w-[60px] p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {filteredRosters.map((item) => {
                const rostersHariIni = classRosters
                  .filter((r) => r.dayOfWeek === item.dayOfWeek)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime));

                const indexHariIni = rostersHariIni.findIndex((r) => r.id === item.id);
                const jpLabel = indexHariIni !== -1 ? `JP-${indexHariIni + 1}` : '-';

                return (
                  <tr key={item.id} className="transition-colors hover:bg-neutral-100">
                    <td className="border-r-2 border-black/10 p-3 font-bold text-black">
                      {DAY_NAMES[item.dayOfWeek]}
                    </td>
                    <td className="border-r-2 border-black/10 p-3 text-center font-mono font-bold text-black">
                      {jpLabel}
                    </td>
                    <td className="border-r-2 border-black/10 p-3 font-bold text-black">
                      {item.subject}
                    </td>
                    <td className="border-r-2 border-black/10 p-3 font-mono text-xs text-black">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-black" />
                        {item.startTime} - {item.endTime}
                      </div>
                    </td>
                    <td className="border-r-2 border-black/10 p-3 text-black">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-black" />
                        {item.room || '-'}
                      </div>
                    </td>
                    <td className="border-r-2 border-black/10 p-3 font-bold text-black">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="h-3 w-3 text-black" />
                        {item.teacherName}
                      </div>
                    </td>
                    <td className="relative p-3 text-center">
                      {/* POP-UP KONFIRMASI HAPUS */}
                      {deleteTargetId === item.id && (
                        <div className="absolute right-0 bottom-full z-10 mb-2 w-56 space-y-2 rounded-md border-2 border-black bg-white p-2.5 text-right">
                          <div className="flex items-start gap-1.5 text-left">
                            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                            <p className="text-[10px] leading-tight font-bold text-black">
                              Yakin ingin menghapus roster ini?
                            </p>
                          </div>
                          <div className="flex justify-end gap-1.5 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setDeleteTargetId(null)}
                              className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={handleConfirmDelete}
                              className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                            >
                              Ya, Hapus
                            </button>
                          </div>
                        </div>
                      )}
                      {/* TOMBOL TRASH HAPUS */}
                      <button
                        type="button"
                        onClick={() => handleDeleteRoster(item.id)}
                        className="shrink-0 rounded-md border-2 border-black bg-white p-1.5 text-black transition-colors hover:border-black hover:bg-neutral-100"
                        title="Hapus Roster"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredRosters.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <p className="text-[10px] font-bold tracking-widest text-black uppercase">
                      — Belum ada data roster untuk kelas ini —
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
