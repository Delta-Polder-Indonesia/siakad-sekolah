import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  addClassRoster,
  deleteClassRoster,
  getClassRosters,
  getClasses,
  getTeacherByUser,
  getLocalTeacherId,
} from '../../data/services';
import { Trash2, Plus, Calendar, Clock, MapPin } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';

const dayNames: Record<number, string> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
};

const schoolDayOptions = [
  { value: 1, label: 'SENIN' },
  { value: 2, label: 'SELASA' },
  { value: 3, label: 'RABU' },
  { value: 4, label: 'KAMIS' },
  { value: 5, label: 'JUMAT' },
  { value: 6, label: 'SABTU' },
];

export default function AturRosterGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('1');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:00');
  const [room, setRoom] = useState('');

  const teacherClasses = useMemo(() => {
    const teacher = getTeacherByUser(user);
    return getClasses().filter((item) => teacher?.classIds.includes(item.id));
  }, [user, storeVersion]);

  useEffect(() => {
    if (!selectedClassId && teacherClasses.length > 0) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClassId]);

  const classRosters = useMemo(
    () => (selectedClassId ? getClassRosters(selectedClassId) : []),
    [selectedClassId, storeVersion]
  );

  const handleAddRoster = () => {
    if (!selectedClassId || !subject.trim() || !startTime || !endTime || !user) return;
    addClassRoster({
      id: `r_${Date.now()}`,
      classId: selectedClassId,
      subject: subject.trim(),
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
      room: room.trim() || undefined,
      teacherName: user.name,
      updatedBy: getLocalTeacherId(user) || user.id,
      updatedAt: Date.now(),
    });
    setSubject('');
    setRoom('');
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER CONTROL BAR */}
      <header className="flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-lg leading-none font-bold tracking-tight text-black">
            Atur Roster Kelas
          </h1>
          <p className="mt-1.5 text-xs leading-none font-bold text-black">
            Konfigurasi roster, alokasi plot penugasan jam mengajar, dan penataan ruang akademis.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start border-l-2 border-black pl-4 text-right sm:self-end">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider text-black uppercase">
              Target Kelas
            </span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="mt-0.5 cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1 font-mono text-xs font-bold text-black uppercase transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              {teacherClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name.toUpperCase()}
                </option>
              ))}
              {teacherClasses.length === 0 && <option value="">NULL_CLASS</option>}
            </select>
          </div>
        </div>
      </header>

      {/* TWO-COLUMN MATRIX WORKSPACE */}
      <div className="grid items-start gap-4 lg:grid-cols-12">
        {/* PANEL KIRI: EDITOR ALOKASI JADWAL */}
        <section className="space-y-3 rounded-md border-2 border-black bg-white p-3 lg:col-span-5">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            <Calendar className="h-4 w-4 text-black" />
            <span>Tambah Jadwal Distribusi Baru</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Mata Pelajaran
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Contoh: Matematika Diskrit"
                className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Ruangan / Laboratorium
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Contoh: LAB_KOM_02"
                className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Hari Operasional
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full cursor-pointer rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
              >
                {schoolDayOptions.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Durasi Interval Waktu
              </label>
              <div className="grid grid-cols-2 gap-1">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                />
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddRoster}
              disabled={!subject.trim() || !startTime || !endTime}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border-2 border-black bg-black px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-black disabled:opacity-60"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>SUNTIK DATA ROSTER</span>
            </button>
          </div>
        </section>

        {/* PANEL KANAN: MANIFEST ROSTER AKTIF */}
        <section className="flex flex-col rounded-md border-2 border-black bg-white p-3 lg:col-span-7">
          <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            <Clock className="h-4 w-4 text-black" />
            <span>Matriks Jadwal Terdaftar ({classRosters.length})</span>
          </div>

          <div className="max-h-[510px] space-y-3 overflow-y-auto pr-0.5">
            {classRosters.map((item) => (
              <div key={item.id} className="rounded-md border-2 border-black bg-white p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1.5 truncate">
                    <p className="truncate text-xs font-bold tracking-tight text-black">
                      {item.subject.toUpperCase()}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                      <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-bold text-black uppercase">
                        {dayNames[item.dayOfWeek] || 'HARI_NULL'}
                      </span>
                      <span className="flex items-center gap-1 font-mono font-bold text-black">
                        <Clock className="h-3 w-3 text-black" />
                        {item.startTime} - {item.endTime}
                      </span>
                      {item.room && (
                        <span className="flex items-center gap-1 font-bold text-black">
                          <MapPin className="h-3 w-3 text-black" />
                          {item.room.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Button Delete - Minimalis Stark */}
                  <button
                    type="button"
                    onClick={() => deleteClassRoster(item.id)}
                    className="shrink-0 cursor-pointer rounded-md border-2 border-black bg-white p-1.5 text-black transition-colors hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600"
                    title="Hapus manifest roster"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {classRosters.length === 0 && (
              <div className="rounded-md border-2 border-dashed border-black bg-white py-20 text-center">
                <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                  EMPTY_ROSTER_MATRIX
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-black/60">
                  Belum ada entri plot jadwal yang dimasukkan untuk kelas ini.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
