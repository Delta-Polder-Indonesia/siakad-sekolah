import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getTeachers,
  getClasses,
  getStudentsByClass,
  getAttendanceByDate,
  addAttendanceRecords,
} from '../../data/services';
import { AttendanceRecord } from '../../types';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Save,
  RotateCcw,
  ClipboardCheck,
} from 'lucide-react';

type Status = AttendanceRecord['status'];

// Konfigurasi status dengan standar visual 3 warna (Hitam, Putih, Biru)
const statusConfig: Record<Status, { label: string; icon: React.ReactNode }> = {
  hadir: {
    label: 'HADIR',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  izin: {
    label: 'IZIN',
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
  sakit: {
    label: 'SAKIT',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  alpha: {
    label: 'ALPHA',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export default function AttendancePage() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, Status>>({});
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const teacher = useMemo(() => getTeachers().find((t) => t.id === user?.id), [user]);
  const classes = useMemo(
    () => getClasses().filter((c) => teacher?.classIds.includes(c.id)),
    [teacher]
  );

  const students = useMemo(() => {
    if (!selectedClass) return [];
    return getStudentsByClass(selectedClass).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedClass, refresh]);

  useEffect(() => {
    if (!selectedClass || !selectedDate) return;
    const existing = getAttendanceByDate(selectedDate, selectedClass);
    const map: Record<string, Status> = {};
    const notes: Record<string, string> = {};
    existing.forEach((r) => {
      map[r.studentId] = r.status;
      if (r.note) notes[r.studentId] = r.note;
    });
    setAttendanceMap(map);
    setNoteMap(notes);
    setSaved(false);
  }, [selectedClass, selectedDate, refresh]);

  const setStatus = useCallback((studentId: string, status: Status) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
    setSaved(false);
  }, []);

  const setAllStatus = useCallback(
    (status: Status) => {
      const map: Record<string, Status> = {};
      students.forEach((s) => {
        map[s.id] = status;
      });
      setAttendanceMap(map);
      setSaved(false);
    },
    [students]
  );

  const handleSave = () => {
    if (!user || !selectedClass) return;
    const records: AttendanceRecord[] = students
      .filter((s) => attendanceMap[s.id])
      .map((s) => ({
        id: `att_${s.id}_${selectedDate}`,
        studentId: s.id,
        classId: selectedClass,
        date: selectedDate,
        status: attendanceMap[s.id],
        note: noteMap[s.id] || undefined,
        markedBy: user.id,
        timestamp: Date.now(),
      }));

    addAttendanceRecords(records);
    setSaved(true);
    setRefresh((r) => r + 1);
  };

  const totalMarked = Object.keys(attendanceMap).length;
  const totalStudents = students.length;
  const summary = {
    hadir: Object.values(attendanceMap).filter((s) => s === 'hadir').length,
    izin: Object.values(attendanceMap).filter((s) => s === 'izin').length,
    sakit: Object.values(attendanceMap).filter((s) => s === 'sakit').length,
    alpha: Object.values(attendanceMap).filter((s) => s === 'alpha').length,
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER HALAMAN */}
      <header className="mb-2 border-b-2 border-black pb-2">
        <h1 className="text-lg leading-none font-bold tracking-tight text-black">
          Input Log Absensi & Kehadiran Siswa
        </h1>
        <p className="mt-1.5 text-xs leading-none font-bold text-black">
          Pencatatan status kehadiran berkala, pemeliharaan data absensi kelas binaan, dan
          dokumentasi parameter keterangan.
        </p>
      </header>

      {/* CONTROL FILTERS BAR */}
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-md border-2 border-black bg-white p-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
              Tanggal Operasional
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
              Target Kompartemen Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="min-w-[160px] cursor-pointer rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
            >
              <option value="" className="font-bold text-black">
                SELECT_CLASS...
              </option>
              {classes.map((c) => (
                <option key={c.id} value={c.id} className="font-bold text-black">
                  {c.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedClass && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllStatus('hadir')}
              className="cursor-pointer rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
            >
              SET_ALL_HADIR
            </button>
            <button
              type="button"
              onClick={() => {
                setAttendanceMap({});
                setNoteMap({});
                setSaved(false);
              }}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>RESET_MAP</span>
            </button>
          </div>
        )}
      </div>

      {!selectedClass ? (
        <div className="rounded-md border-2 border-dashed border-black bg-white py-24 text-center">
          <p className="text-xs font-bold tracking-wider text-black uppercase">
            AWAITING_CLASS_SELECTION
          </p>
          <p className="mt-0.5 text-xs font-bold text-black">
            Silakan pilih salah satu kelas binaan di atas untuk memuat manifest list data siswa.
          </p>
        </div>
      ) : (
        <>
          {/* LOG COUNTER SUMMARY BAR */}
          <div className="flex flex-col justify-between gap-3 rounded-md border-2 border-black bg-white p-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-black">
              <ClipboardCheck className="h-4 w-4 text-black" />
              <span>
                LOGGED: <span className="font-extrabold text-black">{totalMarked}</span> /{' '}
                <span className="font-extrabold text-black">{totalStudents}</span> STUDENTS_INDEXED
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(summary) as [Status, number][]).map(([status, count]) => (
                <span
                  key={status}
                  className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black"
                >
                  {status.toUpperCase()}: <span className="font-extrabold text-black">{count}</span>
                </span>
              ))}
            </div>
          </div>

          {/* TABLE INTERFACE COMPONENT */}
          <div className="overflow-x-auto rounded-md border-2 border-black bg-white">
            <table className="w-full text-left">
              <thead className="border-b-2 border-black bg-white">
                <tr className="text-xs font-bold tracking-wider text-black uppercase">
                  <th className="w-12 border-r-2 border-black/10 px-4 py-2 text-center">NO</th>
                  <th className="border-r-2 border-black/10 px-4 py-2">IDENTITAS_SISWA</th>
                  <th className="w-24 border-r-2 border-black/10 px-4 py-2">NIS_CODE</th>
                  <th className="w-[340px] border-r-2 border-black/10 px-4 py-2 text-center">
                    ATTENDANCE_STATUS_SELECTOR
                  </th>
                  <th className="px-4 py-2">PARAM_REMARKS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {students.map((student, idx) => (
                  <tr key={student.id} className="transition-colors hover:bg-neutral-100">
                    <td className="border-r-2 border-black/10 px-4 py-3 text-center text-xs font-bold text-black">
                      {idx + 1}
                    </td>
                    <td className="border-r-2 border-black/10 px-4 py-3">
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-7 w-7 rounded-md border-2 border-black object-cover p-0.5"  loading="lazy" decoding="async" />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-white text-[10px] font-bold text-black">
                            {student.gender.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold tracking-tight text-black uppercase">
                            {student.name}
                          </p>
                          <p className="text-[10px] font-bold text-black">
                            {student.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="border-r-2 border-black/10 px-4 py-3 font-mono text-xs font-bold text-black">
                      {student.nis}
                    </td>
                    <td className="border-r-2 border-black/10 px-4 py-3">
                      <div className="flex justify-center gap-1">
                        {(
                          Object.entries(statusConfig) as [Status, (typeof statusConfig)[Status]][]
                        ).map(([status, cfg]) => {
                          const isSelected = attendanceMap[student.id] === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setStatus(student.id, status)}
                              className={`inline-flex cursor-pointer items-center gap-1 rounded-md border-2 px-2 py-1 text-xs font-bold transition-colors ${
                                isSelected
                                  ? 'border-blue-600 bg-white text-blue-600'
                                  : 'border-black bg-white text-black hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600'
                              }`}
                            >
                              {cfg.icon}
                              <span>{cfg.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={noteMap[student.id] || ''}
                        onChange={(e) => {
                          setNoteMap((prev) => ({ ...prev, [student.id]: e.target.value }));
                          setSaved(false);
                        }}
                        placeholder="ENTRY_NOTE..."
                        className="w-full rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FORM ACTION CONTROL BUTTON */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={totalMarked === 0}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-black bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-black disabled:opacity-60 disabled:hover:border-black"
            >
              {saved ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>COMMIT_SUCCESS</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>EXECUTE_SAVE_RECORDS</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
