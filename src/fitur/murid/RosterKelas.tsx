import { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getClassRosters, getClasses, getStudents } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';

const schoolDays = [
  { value: 1, label: 'Senin' },
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Kamis' },
  { value: 5, label: 'Jumat' },
  { value: 6, label: 'Sabtu' },
];

function getDefaultDay() {
  const today = new Date().getDay();
  return today >= 1 && today <= 6 ? today : 1;
}

export default function RosterPage() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedDay, setSelectedDay] = useState(getDefaultDay);

  const student = useMemo(() => getStudents().find((s) => s.id === user?.id), [user, storeVersion]);
  const classRoom = useMemo(() => {
    if (!student) return undefined;
    return getClasses().find((c) => c.id === student.classId);
  }, [student, storeVersion]);

  const classRosters = useMemo(() => {
    if (!student) return [];
    return getClassRosters(student.classId).filter(
      (item) => item.dayOfWeek >= 1 && item.dayOfWeek <= 6
    );
  }, [student, storeVersion]);

  const selectedDayRosters = useMemo(
    () =>
      classRosters
        .filter((item) => item.dayOfWeek === selectedDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [classRosters, selectedDay]
  );

  const selectedDayTableRows = useMemo(() => {
    const minimumPeriods = 6;
    const totalRows = Math.max(minimumPeriods, selectedDayRosters.length);
    return Array.from({ length: totalRows }, (_, index) => ({
      periodLabel: `JP-${index + 1}`,
      roster: selectedDayRosters[index],
    }));
  }, [selectedDayRosters]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-2 text-black antialiased selection:bg-neutral-200">
      {/* HEADER HALAMAN */}
      <header className="mb-4 flex flex-col gap-2 border-b-2 border-black pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg leading-none font-bold tracking-tight text-black">
            Jadwal Pelajaran
          </h1>
          <p className="mt-1 text-xs leading-none font-bold text-black">
            Manajemen waktu kelas dan informasi ruang kuliah aktif Anda.
          </p>
        </div>
        {classRoom && (
          <div className="self-start rounded-md border-2 border-black bg-white px-2 py-1 text-xs leading-none font-bold text-black sm:self-auto">
            Kelas: <span className="text-black">{classRoom.name}</span>
          </div>
        )}
      </header>

      {/* FILTER TABS HARI */}
      <div className="mb-4 border-b-2 border-black pb-2">
        <div className="grid grid-cols-3 gap-1.5 md:grid-cols-6">
          {schoolDays.map((day) => {
            const isActive = selectedDay === day.value;
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => setSelectedDay(day.value)}
                className={`flex items-center justify-center rounded-md border-2 bg-white px-2 py-1.5 text-center text-xs font-bold text-black transition-colors select-none hover:bg-neutral-100 ${
                  isActive ? 'border-black bg-black text-white' : 'border-black'
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* STRUKTUR TABEL ROSTER */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 pb-0.5">
          <CalendarDays className="h-3.5 w-3.5 text-black" />
          <h2 className="text-xs font-bold tracking-wider text-black uppercase">
            Daftar Agenda Hari {schoolDays.find((day) => day.value === selectedDay)?.label}
          </h2>
        </div>

        <div className="overflow-hidden rounded-md border-2 border-black bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b-2 border-black bg-white text-xs font-bold tracking-wider text-black uppercase">
                  <th className="w-20 shrink-0 px-3 py-2">Jam Ke</th>
                  <th className="px-3 py-2">Mata Pelajaran</th>
                  <th className="w-36 shrink-0 px-3 py-2">Alokasi Waktu</th>
                  <th className="w-32 shrink-0 px-3 py-2">Ruang Kelas</th>
                  <th className="w-52 shrink-0 px-3 py-2">Tenaga Pengajar</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black bg-white text-black">
                {selectedDayTableRows.map((row) => (
                  <tr
                    key={`${selectedDay}-${row.periodLabel}`}
                    className="leading-tight transition-colors hover:bg-neutral-100"
                  >
                    <td className="px-3 py-1.5 font-mono font-bold text-black">
                      {row.periodLabel}
                    </td>
                    <td className="px-3 py-1.5 font-bold text-black">
                      {row.roster?.subject || <span className="font-normal text-slate-400">-</span>}
                    </td>
                    <td className="px-3 py-1.5 font-mono text-xs font-bold text-black">
                      {row.roster ? (
                        `${row.roster.startTime} - ${row.roster.endTime}`
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-xs font-bold text-black">
                      {row.roster?.room || <span className="text-slate-400">-</span>}
                    </td>
                    <td className="max-w-[13rem] truncate px-3 py-1.5 text-xs font-bold text-black">
                      {row.roster?.teacherName || <span className="text-slate-400">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
