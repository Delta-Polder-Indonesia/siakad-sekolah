import { useState, useMemo } from 'react';
import { UserPlus, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import {
  Teacher,
  getClasses,
  getTeachers,
  saveClasses,
  saveTeachers,
} from '../../../data/services';
import { applyExclusiveClassAssignment } from './utils';

export default function TabTambahGuru({ setNotice }: { setNotice: (msg: string) => void }) {
  const storeVersion = useStoreVersion();
  const classes = useMemo(() => getClasses(), [storeVersion]);
  const teachers = useMemo(() => getTeachers(), [storeVersion]);

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherNip, setNewTeacherNip] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherClassIds, setNewTeacherClassIds] = useState<string[]>([]);

  const [localNotice, setLocalNotice] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleNewTeacherClass = (classId: string) => {
    setNewTeacherClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
    setLocalNotice(null);
    setShowConfirm(false);
  };

  // Validasi sebelum popup konfirmasi
  const preCheckValidation = () => {
    if (
      !newTeacherName.trim() ||
      !newTeacherNip.trim() ||
      !newTeacherPassword.trim() ||
      !newTeacherSubject.trim()
    ) {
      setLocalNotice({ message: '⚠️ Lengkapi data guru baru terlebih dahulu.', type: 'error' });
      return;
    }

    const nipUsed = teachers.some((item) => item.nip === newTeacherNip.trim());
    if (nipUsed) {
      setLocalNotice({ message: '⚠️ NIP sudah digunakan guru lain.', type: 'error' });
      return;
    }

    setLocalNotice(null);
    setShowConfirm(true);
  };

  // Eksekusi final simpan guru
  const handleExecuteSimpan = () => {
    const newTeacher: Teacher = {
      id: `t_${Date.now()}`,
      name: newTeacherName.trim(),
      nip: newTeacherNip.trim(),
      subject: newTeacherSubject.trim(),
      email: newTeacherEmail.trim() || '',
      password: newTeacherPassword,
      classIds: [],
    };

    const withTeacher = [...teachers, newTeacher];
    const { nextTeachers, nextClasses } = applyExclusiveClassAssignment(
      withTeacher,
      classes,
      newTeacher.id,
      newTeacherClassIds
    );

    saveTeachers(nextTeachers);
    saveClasses(nextClasses);

    setNewTeacherName('');
    setNewTeacherNip('');
    setNewTeacherEmail('');
    setNewTeacherPassword('');
    setNewTeacherSubject('');
    setNewTeacherClassIds([]);
    setLocalNotice({ message: '✅ Guru baru berhasil ditambahkan.', type: 'success' });
    setShowConfirm(false);
    setNotice('✅ Guru baru berhasil ditambahkan.');
  };

  return (
    <div className="w-full space-y-5 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* TWO-COLUMN LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* KOLOM KIRI — FORM DATA GURU */}
        <div className="space-y-4">
          {/* STRIP HEADER */}
          <div className="border-b-2 border-black pb-2">
            <h3 className="text-xs font-bold tracking-wide text-black uppercase">
              Form Data Guru Baru
            </h3>
            <p className="mt-0.5 text-[10px] text-black">
              Isi seluruh field berikut untuk mendaftarkan akun guru baru.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Nama */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-wide text-black uppercase">
                Nama Guru
              </label>
              <input
                value={newTeacherName}
                onChange={(e) => {
                  setNewTeacherName(e.target.value);
                  setLocalNotice(null);
                  setShowConfirm(false);
                }}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
              />
            </div>

            {/* NIP */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-wide text-black uppercase">
                NIP
              </label>
              <input
                value={newTeacherNip}
                onChange={(e) => {
                  setNewTeacherNip(e.target.value);
                  setLocalNotice(null);
                  setShowConfirm(false);
                }}
                placeholder="Masukkan NIP"
                className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-wide text-black uppercase">
                Email
              </label>
              <input
                type="email"
                value={newTeacherEmail}
                onChange={(e) => {
                  setNewTeacherEmail(e.target.value);
                  setLocalNotice(null);
                  setShowConfirm(false);
                }}
                placeholder="guru@sekolah.sch.id"
                className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
              />
            </div>

            {/* Kata Sandi */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-wide text-black uppercase">
                Kata Sandi
              </label>
              <input
                type="password"
                value={newTeacherPassword}
                onChange={(e) => {
                  setNewTeacherPassword(e.target.value);
                  setLocalNotice(null);
                  setShowConfirm(false);
                }}
                placeholder="Minimal 8 karakter"
                className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
              />
            </div>

            {/* Mata Pelajaran */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold tracking-wide text-black uppercase">
                Mata Pelajaran
              </label>
              <input
                value={newTeacherSubject}
                onChange={(e) => {
                  setNewTeacherSubject(e.target.value);
                  setLocalNotice(null);
                  setShowConfirm(false);
                }}
                placeholder="Contoh: Bahasa Indonesia"
                className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
              />
            </div>
          </div>
        </div>

        {/* KOLOM KANAN — PILIH KELAS */}
        <div className="space-y-3 lg:border-l-2 lg:border-black/10 lg:pl-4">
          {/* STRIP HEADER */}
          <div className="border-b-2 border-black pb-2">
            <p className="text-xs font-bold tracking-wide text-black uppercase">
              Kelas yang Diajar
            </p>
            <p className="mt-0.5 text-[10px] text-black">
              Centang kelas yang akan diampu oleh guru ini.
            </p>
          </div>

          {/* LIST KELAS */}
          <div className="scrollbar-thin max-h-[220px] divide-y-2 divide-black/10 overflow-y-auto rounded-md border-2 border-black bg-white">
            {classes.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs text-black transition-colors select-none hover:font-bold"
              >
                <span>
                  {item.name} <span className="font-mono text-[10px]">({item.grade})</span>
                </span>
                <input
                  type="checkbox"
                  checked={newTeacherClassIds.includes(item.id)}
                  onChange={() => toggleNewTeacherClass(item.id)}
                  className="h-3.5 w-3.5 cursor-pointer rounded border-black accent-black"
                />
              </label>
            ))}

            {classes.length === 0 && (
              <div className="px-3 py-10 text-center">
                <p className="text-[10px] font-bold tracking-widest text-black uppercase">
                  — Belum ada kelas terdaftar —
                </p>
              </div>
            )}
          </div>

          {/* COUNTER KELAS DIPILIH */}
          <p className="text-[10px] font-bold text-black">
            Terpilih:{' '}
            <span className="rounded-md border-2 border-black bg-neutral-100 px-1.5 py-0.5 font-mono tabular-nums">
              {newTeacherClassIds.length}
            </span>{' '}
            kelas
          </p>
        </div>
      </div>

      {/* BAR BAWAH: NOTIFIKASI & TOMBOL DENGAN POPUP KONFIRMASI */}
      <div className="relative flex min-h-[44px] flex-col items-center justify-between gap-3 border-t-2 border-black/10 pt-3 sm:flex-row">
        {/* Sisi Kiri: Notifikasi Status Inline */}
        <div className="flex w-full flex-1 items-center sm:w-auto">
          {localNotice && (
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
          )}
        </div>

        {/* Sisi Kanan: Wadah Tombol & Pop-up Kustom */}
        <div className="relative flex w-full shrink-0 flex-col items-end gap-2 sm:w-auto">
          {/* POP-UP KONFIRMASI KECIL */}
          {showConfirm && (
            <div className="absolute right-0 bottom-full z-10 mb-2 w-64 space-y-2 rounded-md border-2 border-black bg-white p-2.5 text-right">
              <div className="flex items-start gap-1.5 text-left">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                <p className="text-[10px] leading-tight font-bold text-black">
                  Yakin ingin menambahkan guru baru ini ke sistem?
                </p>
              </div>
              <div className="flex justify-end gap-1.5 text-[10px]">
                <button type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button type="button"
                  onClick={handleExecuteSimpan}
                  className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                >
                  Ya, Tambahkan
                </button>
              </div>
            </div>
          )}

          {/* TOMBOL UTAMA */}
          <button type="button"
            onClick={preCheckValidation}
            className={`inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black px-4 py-2 text-xs font-bold transition-colors sm:w-auto ${
              showConfirm
                ? 'cursor-not-allowed bg-neutral-100 text-black opacity-60'
                : 'bg-white text-black hover:border-black hover:bg-neutral-100'
            }`}
            disabled={showConfirm}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Tambah Guru
          </button>
        </div>
      </div>
    </div>
  );
}
