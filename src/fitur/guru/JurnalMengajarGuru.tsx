import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClasses,
  getTeacherByUser,
  getTeacherLessonNotes,
  getClassRosters,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { BookMarked, Download, NotebookPen } from 'lucide-react';
import CatatanRpsGuru from './CatatanRpsGuru';
import { exportJurnalPdf, exportJurnalCsv } from '../../utils/export';

export default function JurnalMengajarGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [notice, setNotice] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const teacher = useMemo(() => getTeacherByUser(user), [user]);

  const classes = useMemo(
    () => getClasses().filter((c) => teacher?.classIds.includes(c.id)),
    [teacher, storeVersion]
  );

  const subjects = useMemo(() => {
    const set = new Set<string>();
    if (teacher?.subject) set.add(teacher.subject);
    if (selectedClassId) {
      getClassRosters(selectedClassId).forEach((r) => {
        if (r.subject) set.add(r.subject);
      });
    }
    return Array.from(set).sort();
  }, [teacher, selectedClassId, storeVersion]);

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId]
  );

  const notes = useMemo(() => {
    if (!teacher || !selectedClassId || !selectedSubject) return [];
    const all = getTeacherLessonNotes(teacher.id, selectedClassId, selectedSubject);
    if (!filterDate) return all;
    return all.filter((n) => n.date === filterDate);
  }, [teacher, selectedClassId, selectedSubject, filterDate, storeVersion]);

  const handleExportPdf = () => {
    if (notes.length === 0) return;
    exportJurnalPdf(
      notes,
      teacher?.name || user?.name || 'Guru',
      selectedClass?.name || selectedClassId,
      selectedSubject
    );
  };

  const handleExportCsv = () => {
    if (notes.length === 0) return;
    exportJurnalCsv(
      notes,
      `Jurnal_${selectedSubject.replace(/\s+/g, '_')}_${(
        selectedClass?.name || selectedClassId
      ).replace(/\s+/g, '_')}.csv`
    );
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER HALAMAN */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-black" />
          <div>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black uppercase">
              Jurnal Mengajar
            </h1>
            <p className="mt-1.5 text-xs leading-none font-bold text-black">
              Catatan harian materi, PR, dan refleksi pembelajaran per kelas.
            </p>
          </div>
        </div>
      </header>

      {notice && (
        <div className="rounded-md border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black">
          {notice}
        </div>
      )}

      <div className="grid gap-3 rounded-md border-2 border-black bg-white p-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
            Kelas
          </span>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSubject('');
            }}
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
          >
            <option value="">Pilih Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
            Mata Pelajaran
          </span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedClassId}
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-black/50"
          >
            <option value="">Pilih Mapel</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
            Filter Tanggal (Opsional)
          </span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
          />
        </label>
      </div>

      {!selectedClassId ? (
        <div className="rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
          <BookMarked className="mx-auto mb-1 h-6 w-6 text-black" />
          <p className="text-xs font-bold text-black">
            Pilih kelas untuk mulai mengisi jurnal mengajar.
          </p>
        </div>
      ) : !selectedSubject ? (
        <div className="rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
          <BookMarked className="mx-auto mb-1 h-6 w-6 text-black" />
          <p className="text-xs font-bold text-black">
            Pilih mata pelajaran untuk kelas {selectedClass?.name}.
          </p>
        </div>
      ) : (
        <>
          <CatatanRpsGuru
            teacherId={teacher?.id || ''}
            classId={selectedClassId}
            className={selectedClass?.name || ''}
            subject={selectedSubject}
            setNotice={setNotice}
          />

          <section className="rounded-md border-2 border-black bg-white">
            <div className="flex flex-col justify-between gap-2 border-b-2 border-black p-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xs font-bold tracking-wider text-black uppercase">
                  Rekap Jurnal
                </h2>
                <p className="mt-0.5 text-[10px] font-bold text-black/60">
                  {notes.length} catatan{filterDate ? ' pada tanggal terpilih' : ''} ·{' '}
                  {selectedClass?.name} · {selectedSubject}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={notes.length === 0}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-black bg-black px-2.5 py-1 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-3 w-3" /> PDF
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={notes.length === 0}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-3 w-3" /> CSV
                </button>
              </div>
            </div>

            {notes.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-xs font-bold text-black">
                  Belum ada catatan jurnal untuk kelas & mapel ini.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b-2 border-black bg-white">
                    <tr className="text-[10px] font-bold tracking-wider text-black uppercase">
                      <th className="px-3 py-2">Tanggal</th>
                      <th className="px-3 py-2">Materi</th>
                      <th className="px-3 py-2">PR</th>
                      <th className="px-3 py-2">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black/10">
                    {notes.map((note) => (
                      <tr key={note.id} className="hover:bg-neutral-100">
                        <td className="px-3 py-2 font-mono text-[10px] font-bold text-black">
                          {note.date}
                        </td>
                        <td className="px-3 py-2 font-bold text-black">{note.materi}</td>
                        <td className="px-3 py-2 text-black">
                          {note.adaPr ? note.prDetail || 'Ada PR' : 'Tidak'}
                        </td>
                        <td className="px-3 py-2 text-black">{note.catatan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
