import { useState, useMemo, useEffect, useCallback } from 'react';
import { Save, Search, AlertCircle, HelpCircle } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import {
  getClasses,
  getTeachers,
  saveClasses,
  saveTeachers,
  setClassTeacherId,
} from '../../../data/services';
import { applyExclusiveClassAssignment } from './utils';
import { useToast } from '../../../components/ui';

type TeacherEditMap = Record<
  string,
  {
    name: string;
    nip: string;
    email: string;
    password: string;
    subject: string;
    classIds: string[];
  }
>;

export default function TabAkunGuru({ setNotice }: { setNotice: (msg: string) => void }) {
  const storeVersion = useStoreVersion();
  const { showToast } = useToast();
  const classes = useMemo(() => getClasses(), [storeVersion]);
  const teachers = useMemo(() => getTeachers(), [storeVersion]);

  const [searchTeacher, setSearchTeacher] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [teacherEdits, setTeacherEdits] = useState<TeacherEditMap>({});
  const [homeroomMap, setHomeroomMap] = useState<Record<string, string>>({});

  const [localNotice, setLocalNotice] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Sinkronisasi state lokal edit dari store guru
  useEffect(() => {
    const nextTeacherEdits: TeacherEditMap = {};
    teachers.forEach((teacher) => {
      nextTeacherEdits[teacher.id] = {
        name: teacher.name,
        nip: teacher.nip,
        email: teacher.email || '',
        password: teacher.password,
        subject: teacher.subject,
        classIds: [...teacher.classIds],
      };
    });
    setTeacherEdits(nextTeacherEdits);
    setSelectedTeacherId((prev) => (prev && nextTeacherEdits[prev] ? prev : teachers[0]?.id || ''));
  }, [teachers]);

  // Sinkronisasi peta wali kelas (ClassRoom.teacherId) dari store
  useEffect(() => {
    const next: Record<string, string> = {};
    classes.forEach((c) => {
      next[c.id] = c.teacherId ?? '';
    });
    setHomeroomMap(next);
  }, [classes]);

  const setTeacherField = useCallback(
    (teacherId: string, field: keyof TeacherEditMap[string], value: string | string[]) => {
      setTeacherEdits((prev) => {
        const current = prev[teacherId] || {
          name: '',
          nip: '',
          email: '',
          password: '',
          subject: '',
          classIds: [],
        };
        return {
          ...prev,
          [teacherId]: { ...current, [field]: value },
        };
      });
      setLocalNotice(null);
      setShowConfirm(false);
    },
    []
  );

  const toggleTeacherClass = (teacherId: string, classId: string) => {
    const current = teacherEdits[teacherId]?.classIds || [];
    const next = current.includes(classId)
      ? current.filter((id) => id !== classId)
      : [...current, classId];
    setTeacherField(teacherId, 'classIds', next);
  };

  // Validasi sebelum konfirmasi simpan
  const preCheckValidation = (teacherId: string) => {
    const edit = teacherEdits[teacherId];
    if (!edit) return;

    if (!edit.name.trim() || !edit.nip.trim() || !edit.subject.trim()) {
      setLocalNotice('⚠️ Nama, NIP, dan Mata Pelajaran wajib diisi.');
      return;
    }

    const nipUsed = teachers.find((item) => item.nip === edit.nip.trim() && item.id !== teacherId);
    if (nipUsed) {
      setLocalNotice('⚠️ NIP sudah digunakan oleh guru lain.');
      return;
    }

    setLocalNotice(null);
    setShowConfirm(true);
  };

  // Eksekusi simpan perubahan
  const handleExecuteSave = (teacherId: string) => {
    const edit = teacherEdits[teacherId];
    const targetTeacher = teachers.find((item) => item.id === teacherId);
    if (!edit || !targetTeacher) return;

    const patchedTeachers = teachers.map((item) => {
      if (item.id !== teacherId) return item;
      return {
        ...item,
        name: edit.name.trim(),
        nip: edit.nip.trim(),
        email: edit.email.trim(),
        password: edit.password,
        subject: edit.subject.trim(),
      };
    });

    const { nextTeachers, nextClasses } = applyExclusiveClassAssignment(
      patchedTeachers,
      classes,
      teacherId,
      edit.classIds
    );

    saveTeachers(nextTeachers);
    saveClasses(nextClasses);

    // Terapkan penetapan wali kelas (ClassRoom.teacherId) yang diubah admin
    Object.entries(homeroomMap).forEach(([classId, teacherId]) => {
      const current = classes.find((c) => c.id === classId)?.teacherId ?? '';
      if (current !== teacherId) setClassTeacherId(classId, teacherId);
    });

    setShowConfirm(false);
    setLocalNotice(null);
    setNotice(`✅ Akun guru ${edit.name.trim().toUpperCase()} berhasil diperbarui.`);
    showToast('success', `✅ Akun guru ${edit.name.trim().toUpperCase()} berhasil diperbarui.`);
  };

  // Mengurutkan dan memfilter guru (Diurutkan A-Z)
  const filteredAndSortedTeachers = useMemo(() => {
    const sorted = [...teachers].sort((a, b) =>
      a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
    );

    const key = searchTeacher.trim().toLowerCase();
    if (!key) return sorted;

    return sorted.filter((item) => {
      const edit = teacherEdits[item.id];
      const classNames = (edit?.classIds || item.classIds)
        .map((classId) => classes.find((c) => c.id === classId)?.name || '')
        .join(' ')
        .toLowerCase();
      return (
        item.name.toLowerCase().includes(key) ||
        item.nip.toLowerCase().includes(key) ||
        (item.email && item.email.toLowerCase().includes(key)) ||
        item.subject.toLowerCase().includes(key) ||
        classNames.includes(key)
      );
    });
  }, [teachers, searchTeacher, teacherEdits, classes]);

  const selectedTeacher =
    teachers.find((item) => item.id === selectedTeacherId) || filteredAndSortedTeachers[0] || null;
  const selectedTeacherEdit = selectedTeacher ? teacherEdits[selectedTeacher.id] : null;

  const inputClass =
    'w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black outline-none transition-colors placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600';

  return (
    <div className="rounded-md border-2 border-black bg-white p-4">
      {/* TWO-COLUMN LAYOUT */}
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* KOLOM KIRI — DAFTAR GURU */}
        <div className="space-y-4">
          <div className="border-b-2 border-black pb-2">
            <h3 className="text-xs font-bold tracking-wider text-black uppercase">
              Daftar Guru ({filteredAndSortedTeachers.length})
            </h3>
          </div>

          <div className="relative w-full">
            <input
              type="text"
              value={searchTeacher}
              onChange={(e) => setSearchTeacher(e.target.value)}
              placeholder="Cari nama, NIP, mapel..."
              className={`${inputClass} pl-8`}
            />
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-black/50" />
          </div>

          <div className="max-h-[440px] space-y-1.5 overflow-y-auto pr-1">
            {filteredAndSortedTeachers.map((teacher) => {
              const isActive = selectedTeacher?.id === teacher.id;
              return (
                <button
                  type="button"
                  key={teacher.id}
                  onClick={() => {
                    setSelectedTeacherId(teacher.id);
                    setLocalNotice(null);
                    setShowConfirm(false);
                  }}
                  className={`block w-full rounded-md border-2 px-3 py-2.5 text-left transition-colors select-none ${
                    isActive
                      ? 'border-blue-600 bg-white text-black'
                      : 'border-black bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  <p className="truncate text-xs font-bold">{teacher.name}</p>
                  <p className="mt-0.5 truncate text-[10px] font-bold text-black/60">
                    {teacher.subject}
                  </p>
                </button>
              );
            })}

            {filteredAndSortedTeachers.length === 0 && (
              <div className="rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
                <p className="text-xs font-bold text-black">— Guru tidak ditemukan —</p>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN — FORM EDITOR */}
        <div className="space-y-4 lg:border-l-2 lg:border-black/10 lg:pl-4">
          {selectedTeacher && selectedTeacherEdit ? (
            <div className="space-y-4">
              <div className="border-b-2 border-black pb-2">
                <h3 className="text-xs font-bold tracking-wider text-black uppercase">
                  Ubah Data Akun Guru
                </h3>
                <p className="mt-0.5 text-[10px] font-bold text-black/60">
                  ID Guru: <span className="font-mono text-blue-600">{selectedTeacher.id}</span>
                </p>
              </div>

              {/* FIELD GRID INPUT */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                    Nama Lengkap Guru
                  </label>
                  <input
                    type="text"
                    value={selectedTeacherEdit.name}
                    onChange={(e) => setTeacherField(selectedTeacher.id, 'name', e.target.value)}
                    placeholder="Nama lengkap guru"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                    Mata Pelajaran Utama
                  </label>
                  <input
                    type="text"
                    value={selectedTeacherEdit.subject}
                    onChange={(e) => setTeacherField(selectedTeacher.id, 'subject', e.target.value)}
                    placeholder="Mata pelajaran"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                    Nomor Induk Pegawai (NIP)
                  </label>
                  <input
                    type="text"
                    value={selectedTeacherEdit.nip}
                    onChange={(e) => setTeacherField(selectedTeacher.id, 'nip', e.target.value)}
                    placeholder="NIP guru"
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                    Email Guru
                  </label>
                  <input
                    type="email"
                    value={selectedTeacherEdit.email}
                    onChange={(e) => setTeacherField(selectedTeacher.id, 'email', e.target.value)}
                    placeholder="guru@sekolah.sch.id"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                    Kata Sandi Akun
                  </label>
                  <input
                    type="text"
                    value={selectedTeacherEdit.password}
                    onChange={(e) =>
                      setTeacherField(selectedTeacher.id, 'password', e.target.value)
                    }
                    placeholder="Kata sandi"
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>

              {/* KELAS AJAR */}
              <div className="space-y-2">
                <div className="border-b-2 border-black pb-1">
                  <p className="text-xs font-bold tracking-wider text-black uppercase">
                    Hak Akses Kelas Ajar
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-md border-2 border-black bg-white p-3 sm:grid-cols-3">
                  {classes.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-center gap-2 text-xs font-bold text-black select-none hover:text-blue-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTeacherEdit.classIds.includes(item.id)}
                        onChange={() => toggleTeacherClass(selectedTeacher.id, item.id)}
                        className="h-3.5 w-3.5 cursor-pointer rounded border-2 border-black accent-black"
                      />
                      <span>
                        {item.name} <span className="font-mono text-[10px]">({item.grade})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PENETAPAN WALI KELAS */}
              <div className="space-y-2">
                <div className="border-b-2 border-black pb-1">
                  <p className="text-xs font-bold tracking-wider text-black uppercase">
                    Penetapan Wali Kelas
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-black/60">
                    Pilih wali kelas (kelas binaan) per kelas. Perubahan tersimpan bersama tombol
                    Simpan di bawah.
                  </p>
                </div>
                <div className="space-y-1.5 rounded-md border-2 border-black bg-white p-3">
                  {classes.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 border-b-2 border-black/10 pb-1.5 last:border-0 last:pb-0"
                    >
                      <span className="text-xs font-bold text-black uppercase">
                        {item.name}{' '}
                        <span className="font-mono text-[10px] text-black/60">({item.grade})</span>
                      </span>
                      <select
                        value={homeroomMap[item.id] ?? ''}
                        onChange={(e) => {
                          setHomeroomMap((prev) => ({ ...prev, [item.id]: e.target.value }));
                          setLocalNotice(null);
                          setShowConfirm(false);
                        }}
                        className="w-48 cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                      >
                        <option value="">— Tidak ada wali —</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {classes.length === 0 && (
                    <p className="py-4 text-center text-[10px] font-bold text-black/50">
                      — Belum ada kelas terdaftar —
                    </p>
                  )}
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="relative flex min-h-[44px] flex-col items-center justify-between gap-3 border-t-2 border-black/10 pt-3 sm:flex-row">
                <div className="flex w-full flex-1 items-center sm:w-auto">
                  {localNotice && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                      <span>{localNotice}</span>
                    </div>
                  )}
                </div>

                <div className="relative flex w-full shrink-0 flex-col items-end gap-2 sm:w-auto">
                  {showConfirm && (
                    <div className="absolute right-0 bottom-full z-10 mb-2 w-64 space-y-2 rounded-md border-2 border-black bg-white p-2.5 text-right">
                      <div className="flex items-start gap-1.5 text-left">
                        <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                        <p className="text-[10px] leading-tight font-bold text-black">
                          Simpan perubahan data akun untuk guru{' '}
                          <span className="font-mono text-blue-600">
                            {selectedTeacherEdit.name}
                          </span>
                          ?
                        </p>
                      </div>
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setShowConfirm(false)}
                          className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-[10px] font-bold text-black transition-colors hover:bg-neutral-100"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleExecuteSave(selectedTeacher.id)}
                          className="rounded-md border-2 border-black bg-black px-2.5 py-1 text-[10px] font-bold text-white transition-colors hover:bg-neutral-900"
                        >
                          Ya, Simpan
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => preCheckValidation(selectedTeacher.id)}
                    disabled={showConfirm}
                    className={`inline-flex items-center gap-1.5 rounded-md border-2 px-4 py-2 text-xs font-bold transition-colors ${
                      showConfirm
                        ? 'cursor-not-allowed border-black bg-neutral-100 text-black/50'
                        : 'border-black bg-black text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Simpan Perubahan Guru
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[360px] items-center justify-center rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
              <p className="text-xs font-bold text-black/50">— Pilih guru untuk mengedit akun —</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
