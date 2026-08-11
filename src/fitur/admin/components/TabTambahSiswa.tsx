import { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { getClasses, getStudents, addStudent } from '../../../data/services';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { Student } from '../../../types';

export default function TabTambahSiswa({ setNotice }: { setNotice: (msg: string) => void }) {
  const storeVersion = useStoreVersion();
  const classes = useMemo(() => getClasses(), [storeVersion]);
  const students = useMemo(() => getStudents(), [storeVersion]);

  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNis, setNewStudentNis] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'L' | 'P'>('L');
  const [newStudentClassId, setNewStudentClassId] = useState('');

  const handleAddStudent = () => {
    if (
      !newStudentName.trim() ||
      !newStudentNis.trim() ||
      !newStudentPassword.trim() ||
      !newStudentClassId
    ) {
      setNotice('Lengkapi data siswa baru terlebih dahulu, termasuk pilihan kelas.');
      return;
    }

    const nisUsed = students.some((item) => item.nis === newStudentNis.trim());
    if (nisUsed) {
      setNotice('NIS sudah digunakan siswa lain.');
      return;
    }

    const newStudent: Student = {
      id: `s_${Date.now()}`,
      name: newStudentName.trim(),
      nis: newStudentNis.trim(),
      password: newStudentPassword,
      gender: newStudentGender,
      classId: newStudentClassId,
    };

    addStudent(newStudent);
    setNewStudentName('');
    setNewStudentNis('');
    setNewStudentPassword('');
    setNewStudentGender('L');
    setNewStudentClassId('');
    setNotice('Siswa baru berhasil ditambahkan.');
  };

  return (
    <div className="w-full space-y-4 bg-white p-3">
      <div className="space-y-4 rounded-md border-2 border-black bg-white p-4">
        <div className="flex items-center gap-2 border-b-2 border-black pb-2">
          <UserPlus className="h-4 w-4 text-black" />
          <h3 className="text-xs font-bold tracking-wider text-black uppercase">
            Form Penerimaan Siswa Baru (PPDB)
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wider text-black uppercase">
              Nama Lengkap Siswa
            </label>
            <input
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Contoh: Andi Pratama"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wider text-black uppercase">
              Nomor Induk Siswa (NIS)
            </label>
            <input
              value={newStudentNis}
              onChange={(e) => setNewStudentNis(e.target.value)}
              placeholder="Contoh: 2024001"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wider text-black uppercase">
              Jenis Kelamin
            </label>
            <select
              value={newStudentGender}
              onChange={(e) => setNewStudentGender(e.target.value as 'L' | 'P')}
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              <option value="L">Laki-Laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wider text-black uppercase">
              Kata Sandi Awal
            </label>
            <input
              value={newStudentPassword}
              onChange={(e) => setNewStudentPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-bold tracking-wider text-black uppercase">
              Pilih Kelas
            </label>
            <select
              value={newStudentClassId}
              onChange={(e) => setNewStudentClassId(e.target.value)}
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              <option value="">-- Pilih Kelas --</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.grade})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex w-full justify-end border-t-2 border-black/10 pt-3">
          <button type="button"
            onClick={handleAddStudent}
            className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-black px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-900"
          >
            <UserPlus className="h-4 w-4" />
            Daftarkan Siswa Baru
          </button>
        </div>
      </div>
    </div>
  );
}
