import { useState, useMemo, useEffect, useCallback } from 'react';
import { UserPlus, Trash2, Save, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import {
  getClasses,
  getTeachers,
  getStudents,
  saveClasses,
  saveTeachers,
  getAttendance,
  getClassRosters,
  getClassAnnouncements,
  getOnlineAssignmentsByClass,
  deleteClassRoster,
  deleteClassAnnouncement,
  deleteOnlineAssignment,
  saveAttendance,
  saveStudents,
  addStudentClassMutation,
} from '../../../data/services';
import { ClassRoom } from '../../../types';

type ClassEditMap = Record<string, { name: string; grade: string }>;

interface TabKelolaKelasProps {
  setNotice: (msg: string) => void;
}

export default function TabKelolaKelas({ setNotice }: TabKelolaKelasProps) {
  const storeVersion = useStoreVersion();

  // Memuat data ter-memo berdasarkan versi store
  const classes = useMemo(() => getClasses(), [storeVersion]);
  const teachers = useMemo(() => getTeachers(), [storeVersion]);
  const students = useMemo(() => getStudents(), [storeVersion]);

  const [classEdits, setClassEdits] = useState<ClassEditMap>({});
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('');
  const [moveTargets, setMoveTargets] = useState<Record<string, string>>({});

  const [localNotice, setLocalNotice] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [moveConfirmId, setMoveConfirmId] = useState<string | null>(null);

  // Menghitung jumlah siswa per kelas
  const studentCountByClass = useMemo(() => {
    const countMap = new Map<string, number>();
    students.forEach((item) => {
      countMap.set(item.classId, (countMap.get(item.classId) || 0) + 1);
    });
    return countMap;
  }, [students]);

  // Sinkronisasi state lokal edit kelas dari store
  useEffect(() => {
    setClassEdits((prevEdits) => {
      const nextEdits: ClassEditMap = {};
      classes.forEach((classItem) => {
        nextEdits[classItem.id] = prevEdits[classItem.id] ?? {
          name: classItem.name,
          grade: classItem.grade,
        };
      });
      return nextEdits;
    });
  }, [classes]);

  const setClassField = useCallback(
    (classId: string, field: keyof ClassEditMap[string], value: string) => {
      setClassEdits((prev) => {
        const currentEdit = prev[classId] || { name: '', grade: '' };
        return {
          ...prev,
          [classId]: {
            ...currentEdit,
            [field]: value,
          },
        };
      });
      setLocalNotice(null);
      setShowSaveConfirm(false);
    },
    []
  );

  // ── SIMPAN PERUBAHAN ──
  const preCheckSave = () => {
    const classNames = new Set<string>();

    for (const item of classes) {
      const edit = classEdits[item.id];
      const name = (edit?.name ?? item.name).trim();
      const grade = (edit?.grade ?? item.grade).trim();

      if (!name) {
        setLocalNotice({ message: '⚠️ Nama kelas tidak boleh kosong.', type: 'error' });
        return;
      }
      if (!grade) {
        setLocalNotice({ message: '⚠️ Tingkat kelas tidak boleh kosong.', type: 'error' });
        return;
      }

      const lowerName = name.toLowerCase();
      if (classNames.has(lowerName)) {
        setLocalNotice({ message: `⚠️ Terdapat duplikasi nama kelas: "${name}".`, type: 'error' });
        return;
      }
      classNames.add(lowerName);
    }

    setLocalNotice(null);
    setShowSaveConfirm(true);
  };

  const handleExecuteSave = () => {
    const nextClasses: ClassRoom[] = classes.map((item) => {
      const edit = classEdits[item.id];
      return {
        ...item,
        name: (edit?.name ?? item.name).trim(),
        grade: (edit?.grade ?? item.grade).trim(),
      };
    });

    saveClasses(nextClasses);
    setLocalNotice({ message: '✅ Daftar kelas berhasil diperbarui.', type: 'success' });
    setShowSaveConfirm(false);
    setNotice('✅ Daftar kelas berhasil diperbarui.');
  };

  // ── TAMBAH KELAS ──
  const preCheckAdd = () => {
    const name = newClassName.trim();
    const grade = newClassGrade.trim();

    if (!name || !grade) {
      setLocalNotice({
        message: '⚠️ Isi nama kelas dan tingkat kelas terlebih dahulu.',
        type: 'error',
      });
      return;
    }

    const duplicate = classes.some((item) => item.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      setLocalNotice({ message: '⚠️ Nama kelas sudah ada. Gunakan nama lain.', type: 'error' });
      return;
    }

    setLocalNotice(null);
    setShowAddConfirm(true);
  };

  const handleExecuteAdd = () => {
    const newClass: ClassRoom = {
      id: `c_${Date.now()}`,
      name: newClassName.trim(),
      grade: newClassGrade.trim(),
      teacherId: '',
    };

    saveClasses([...classes, newClass]);
    setNewClassName('');
    setNewClassGrade('');
    setLocalNotice({ message: '✅ Kelas baru berhasil ditambahkan.', type: 'success' });
    setShowAddConfirm(false);
    setNotice('✅ Kelas baru berhasil ditambahkan.');
  };

  // ── HAPUS KELAS ──
  const preCheckDelete = (classId: string) => {
    const classItem = classes.find((item) => item.id === classId);
    if (!classItem) return;

    const studentCount = studentCountByClass.get(classId) || 0;
    if (studentCount > 0) {
      setLocalNotice({
        message: `⚠️ Kelas ${classItem.name} tidak bisa dihapus — masih ada ${studentCount} siswa.`,
        type: 'error',
      });
      return;
    }
    setDeleteTargetId(classId);
  };

  const handleExecuteDelete = () => {
    if (!deleteTargetId) return;

    const nextClasses = classes.filter((item) => item.id !== deleteTargetId);
    const nextTeachers = teachers.map((item) => ({
      ...item,
      classIds: item.classIds.filter((id) => id !== deleteTargetId),
    }));
    const nextAttendance = getAttendance().filter((item) => item.classId !== deleteTargetId);

    const rosters = getClassRosters(deleteTargetId);
    const announcements = getClassAnnouncements(deleteTargetId);
    const assignments = getOnlineAssignmentsByClass(deleteTargetId);

    saveTeachers(nextTeachers);
    saveClasses(nextClasses);
    saveAttendance(nextAttendance);

    rosters.forEach((item) => deleteClassRoster(item.id));
    announcements.forEach((item) => deleteClassAnnouncement(item.id));
    assignments.forEach((item) => deleteOnlineAssignment(item.id));

    setLocalNotice({ message: '✅ Kelas berhasil dihapus.', type: 'success' });
    setDeleteTargetId(null);
    setNotice('✅ Kelas berhasil dihapus.');
  };

  // ── PINDAH SISWA ──
  const preCheckMove = (sourceClassId: string) => {
    const sourceClass = classes.find((item) => item.id === sourceClassId);
    if (!sourceClass) return;

    const studentCount = studentCountByClass.get(sourceClassId) || 0;
    if (studentCount === 0) {
      setLocalNotice({
        message: `⚠️ Kelas ${sourceClass.name} tidak memiliki siswa.`,
        type: 'error',
      });
      return;
    }

    const targetClassId = moveTargets[sourceClassId];
    if (!targetClassId || targetClassId === sourceClassId) {
      setLocalNotice({
        message: '⚠️ Pilih kelas tujuan pemindahan siswa terlebih dahulu.',
        type: 'error',
      });
      return;
    }

    setLocalNotice(null);
    setMoveConfirmId(sourceClassId);
  };

  const handleExecuteMove = () => {
    if (!moveConfirmId) return;

    const targetClassId = moveTargets[moveConfirmId];
    const sourceClass = classes.find((item) => item.id === moveConfirmId);
    const targetClass = classes.find((item) => item.id === targetClassId);

    if (!sourceClass || !targetClass || !targetClassId) return;

    const studentCount = studentCountByClass.get(moveConfirmId) || 0;
    const nextStudents = students.map((item) =>
      item.classId === moveConfirmId ? { ...item, classId: targetClassId } : item
    );

    students
      .filter((item) => item.classId === moveConfirmId)
      .forEach((item) => {
        addStudentClassMutation({
          studentId: item.id,
          studentName: item.name,
          fromClassId: moveConfirmId,
          toClassId: targetClassId,
          note: 'Dipindahkan massal melalui pengelolaan kelas',
        });
      });

    saveStudents(nextStudents);
    setMoveTargets((prev) => ({ ...prev, [moveConfirmId]: '' }));
    setLocalNotice({
      message: `✅ ${studentCount} siswa dipindahkan dari ${sourceClass.name} ke ${targetClass.name}.`,
      type: 'success',
    });
    setMoveConfirmId(null);
    setNotice(`✅ Berhasil memindahkan siswa dari ${sourceClass.name} ke ${targetClass.name}.`);
  };

  return (
    <div className="w-full space-y-4 rounded-md border-2 border-black bg-white p-4">
      {/* ── FORM TAMBAH KELAS ── */}
      <div className="space-y-3 border-b-2 border-black pb-4">
        <div>
          <h3 className="text-xs font-bold tracking-wide text-black uppercase">
            Tambah Kelas Baru
          </h3>
          <p className="mt-0.5 text-xs font-bold text-black">
            Daftarkan kelas baru ke dalam sistem dengan nama dan tingkat yang unik.
          </p>
        </div>

        <div className="h-px w-full bg-black" />

        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Nama Kelas Baru
            </label>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => {
                setNewClassName(e.target.value);
                if (localNotice) setLocalNotice(null);
                if (showAddConfirm) setShowAddConfirm(false);
              }}
              placeholder="Contoh: X-IPA-1"
              className="w-52 rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Tingkat
            </label>
            <input
              type="text"
              value={newClassGrade}
              onChange={(e) => {
                setNewClassGrade(e.target.value);
                if (localNotice) setLocalNotice(null);
                if (showAddConfirm) setShowAddConfirm(false);
              }}
              placeholder="Contoh: X, XI, XII"
              className="w-36 rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="relative flex flex-col items-start gap-2">
            {showAddConfirm && (
              <div className="absolute bottom-full left-0 z-20 mb-2 w-64 space-y-2 rounded-md border-2 border-black bg-white p-2.5">
                <div className="flex items-start gap-1.5">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <p className="text-[10px] leading-tight font-bold text-black">
                    Yakin ingin menambahkan kelas{' '}
                    <span className="font-mono text-blue-600">"{newClassName.trim()}"</span>?
                  </p>
                </div>
                <div className="flex justify-end gap-1.5 text-[10px]">
                  {/* TOMBOL BATAL TAMBAH KELAS */}
                  <button
                    type="button"
                    onClick={() => setShowAddConfirm(false)}
                    className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                  >
                    Batal
                  </button>
                  {/* TOMBOL KONFIRMASI TAMBAH KELAS */}
                  <button
                    type="button"
                    onClick={handleExecuteAdd}
                    className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                  >
                    Ya, Tambahkan
                  </button>
                </div>
              </div>
            )}

            {/* TOMBOL UTAMA TAMBAH KELAS */}
            <button
              type="button"
              onClick={preCheckAdd}
              disabled={showAddConfirm}
              className={`inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black px-4 py-2 text-xs font-bold transition-colors sm:w-auto ${
                showAddConfirm
                  ? 'cursor-not-allowed bg-neutral-100 text-black opacity-60'
                  : 'bg-white text-black hover:border-blue-600 hover:text-blue-600'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5 text-black" />
              Tambah Kelas
            </button>
          </div>
        </div>
      </div>

      {/* ── TABEL KELAS ── */}
      <div className="overflow-x-auto rounded-md border-2 border-black bg-white">
        <table className="w-full min-w-[720px] border-collapse bg-white text-left">
          <thead>
            <tr className="border-b-2 border-black bg-white text-[10px] font-bold tracking-wider text-black uppercase">
              {['Kode Kelas', 'Nama Kelas', 'Tingkat', 'Guru PJ', 'Siswa', 'Aksi'].map((h) => (
                <th key={h} className="px-3 pt-2 pb-2.5 font-bold text-black" scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
            {classes.map((classItem) => {
              const edit = classEdits[classItem.id];
              const teacherName =
                teachers.find((item) => item.id === classItem.teacherId)?.name || '-';
              const studentCount = studentCountByClass.get(classItem.id) || 0;
              const canDelete = studentCount === 0;

              return (
                <tr key={classItem.id} className="transition-colors hover:bg-neutral-100">
                  <td className="px-3 py-2.5 font-mono text-xs font-bold text-blue-600">
                    {classItem.id}
                  </td>
                  <td className="px-3 py-2 pr-4">
                    <input
                      type="text"
                      value={edit?.name ?? classItem.name}
                      onChange={(e) => setClassField(classItem.id, 'name', e.target.value)}
                      className="w-full max-w-[180px] rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                    />
                  </td>
                  <td className="px-3 py-2 pr-4">
                    <input
                      type="text"
                      value={edit?.grade ?? classItem.grade}
                      onChange={(e) => setClassField(classItem.id, 'grade', e.target.value)}
                      className="w-20 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                    />
                  </td>
                  <td className="px-3 py-2.5 text-xs font-bold text-black">{teacherName}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`font-mono text-xs font-bold tabular-nums ${
                        studentCount > 0 ? 'text-blue-600' : 'text-black'
                      }`}
                    >
                      {studentCount}
                    </span>
                  </td>
                  <td className="relative px-3 py-2">
                    {canDelete ? (
                      <div className="relative inline-block">
                        {deleteTargetId === classItem.id && (
                          <div className="absolute right-0 bottom-full z-20 mb-2 w-60 space-y-2 rounded-md border-2 border-black bg-white p-2.5">
                            <div className="flex items-start gap-1.5">
                              <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                              <p className="text-[10px] leading-tight font-bold text-black">
                                Hapus kelas{' '}
                                <span className="font-mono text-blue-600">"{classItem.name}"</span>?
                                Roster, pengumuman, tugas, dan absensi juga terhapus.
                              </p>
                            </div>
                            <div className="flex justify-end gap-1.5 text-[10px]">
                              {/* TOMBOL BATAL HAPUS */}
                              <button
                                type="button"
                                onClick={() => setDeleteTargetId(null)}
                                className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                              >
                                Batal
                              </button>
                              {/* TOMBOL KONFIRMASI HAPUS */}
                              <button
                                type="button"
                                onClick={handleExecuteDelete}
                                className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                              >
                                Ya, Hapus
                              </button>
                            </div>
                          </div>
                        )}
                        {/* TOMBOL PICU HAPUS KELAS */}
                        <button
                          type="button"
                          onClick={() => preCheckDelete(classItem.id)}
                          title="Hapus kelas"
                          className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                        >
                          <Trash2 className="h-3 w-3 text-black" />
                          Hapus Kelas
                        </button>
                      </div>
                    ) : (
                      <div className="flex min-w-[220px] flex-col gap-1">
                        <p className="text-[10px] font-bold text-black">
                          {studentCount} siswa aktif — migrasikan data
                        </p>
                        <div className="relative flex gap-1.5">
                          <select
                            value={moveTargets[classItem.id] || ''}
                            onChange={(e) => {
                              setMoveTargets((prev) => ({
                                ...prev,
                                [classItem.id]: e.target.value,
                              }));
                              if (localNotice) setLocalNotice(null);
                              if (moveConfirmId) setMoveConfirmId(null);
                            }}
                            className="flex-1 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                          >
                            <option value="" className="font-bold text-black">
                              Pilih kelas tujuan
                            </option>
                            {classes
                              .filter((item) => item.id !== classItem.id)
                              .map((item) => (
                                <option
                                  key={item.id}
                                  value={item.id}
                                  className="font-bold text-black"
                                >
                                  {classEdits[item.id]?.name || item.name}
                                </option>
                              ))}
                          </select>

                          {moveConfirmId === classItem.id && (
                            <div className="absolute bottom-full left-0 z-20 mb-2 w-64 space-y-2 rounded-md border-2 border-black bg-white p-2.5">
                              <div className="flex items-start gap-1.5">
                                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                <p className="text-[10px] leading-tight font-bold text-black">
                                  Pindahkan{' '}
                                  <span className="font-mono text-blue-600">{studentCount}</span>{' '}
                                  siswa dari{' '}
                                  <span className="font-mono text-blue-600">
                                    "{classItem.name}"
                                  </span>{' '}
                                  ke kelas tujuan?
                                </p>
                              </div>
                              <div className="flex justify-end gap-1.5 text-[10px]">
                                {/* TOMBOL BATAL PINDAH */}
                                <button
                                  type="button"
                                  onClick={() => setMoveConfirmId(null)}
                                  className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                                >
                                  Batal
                                </button>
                                {/* TOMBOL KONFIRMASI PINDAH */}
                                <button
                                  type="button"
                                  onClick={handleExecuteMove}
                                  className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                                >
                                  Ya, Pindahkan
                                </button>
                              </div>
                            </div>
                          )}

                          {/* TOMBOL PICU PINDAHKAN SISWA */}
                          <button
                            type="button"
                            onClick={() => preCheckMove(classItem.id)}
                            disabled={classes.length <= 1 || moveConfirmId === classItem.id}
                            className={`rounded-md border-2 border-black px-2 py-1 text-xs font-bold transition-colors ${
                              classes.length <= 1 || moveConfirmId === classItem.id
                                ? 'cursor-not-allowed bg-neutral-100 text-black opacity-60'
                                : 'bg-white text-black hover:border-blue-600 hover:text-blue-600'
                            }`}
                          >
                            Pindahkan
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {classes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <p className="text-[10px] font-bold tracking-widest text-black uppercase">
                    — Belum ada kelas yang terdaftar —
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── BAR BAWAH: NOTIFIKASI & SIMPAN ── */}
      <div className="relative flex min-h-[44px] flex-col items-center justify-between gap-3 border-t-2 border-black/10 pt-3 sm:flex-row">
        <div className="flex w-full flex-1 items-center sm:w-auto">
          {localNotice && (
            <div
              className={`flex items-center gap-1.5 text-[11px] font-bold tracking-tight ${
                localNotice.type === 'error' ? 'text-black' : 'text-blue-600'
              }`}
            >
              {localNotice.type === 'error' ? (
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-black" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600" />
              )}
              <span>{localNotice.message}</span>
            </div>
          )}
        </div>

        <div className="relative flex w-full shrink-0 flex-col items-end gap-2 sm:w-auto">
          {showSaveConfirm && (
            <div className="absolute right-0 bottom-full z-20 mb-2 w-64 space-y-2 rounded-md border-2 border-black bg-white p-2.5 text-right">
              <div className="flex items-start gap-1.5 text-left">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-[10px] leading-tight font-bold text-black">
                  Yakin ingin menyimpan semua perubahan nama dan tingkat kelas?
                </p>
              </div>
              <div className="flex justify-end gap-1.5 text-[10px]">
                {/* TOMBOL BATAL SIMPAN */}
                <button
                  type="button"
                  onClick={() => setShowSaveConfirm(false)}
                  className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                >
                  Batal
                </button>
                {/* TOMBOL KONFIRMASI SIMPAN */}
                <button
                  type="button"
                  onClick={handleExecuteSave}
                  className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                >
                  Ya, Simpan
                </button>
              </div>
            </div>
          )}

          {/* TOMBOL UTAMA SIMPAN PERUBAHAN */}
          <button
            type="button"
            onClick={preCheckSave}
            disabled={showSaveConfirm}
            className={`inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black px-4 py-2 text-xs font-bold transition-colors sm:w-auto ${
              showSaveConfirm
                ? 'cursor-not-allowed bg-neutral-100 text-black opacity-60'
                : 'bg-white text-black hover:border-blue-600 hover:text-blue-600'
            }`}
          >
            <Save className="h-3.5 w-3.5 text-black" />
            Simpan Perubahan Kelas
          </button>
        </div>
      </div>
    </div>
  );
}
