import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getTeachers,
  getClasses,
  getStudentsByClass,
  addStudent,
  updateStudent,
  deleteStudent,
} from '../../data/services';
import { Student } from '../../types';
import { Plus, Edit2, Trash2, X, Search, UserPlus } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';

export default function StudentManagement() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formNis, setFormNis] = useState('');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formClass, setFormClass] = useState('');
  const [formPassword, setFormPassword] = useState('siswa123');

  const teacher = useMemo(() => getTeachers().find((t) => t.id === user?.id), [user]);
  const classes = useMemo(
    () => getClasses().filter((c) => teacher?.classIds.includes(c.id)),
    [teacher, storeVersion]
  );

  const students = useMemo(() => {
    if (!selectedClass) {
      const allStudents: Student[] = [];
      classes.forEach((c) => {
        allStudents.push(...getStudentsByClass(c.id));
      });
      return allStudents.sort((a, b) => a.name.localeCompare(b.name));
    }
    return getStudentsByClass(selectedClass).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedClass, classes, refresh, storeVersion]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const lower = searchTerm.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(lower) || s.nis.includes(searchTerm)
    );
  }, [students, searchTerm]);

  const openAddModal = () => {
    setEditingStudent(null);
    setFormName('');
    setFormNis('');
    setFormGender('L');
    setFormClass(selectedClass || classes[0]?.id || '');
    setFormPassword('siswa123');
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.name);
    setFormNis(student.nis);
    setFormGender(student.gender);
    setFormClass(student.classId);
    setFormPassword(student.password);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formName || !formNis || !formClass) return;

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        name: formName,
        nis: formNis,
        gender: formGender,
        classId: formClass,
        password: formPassword,
      });
    } else {
      addStudent({
        id: `s_${Date.now()}`,
        name: formName,
        nis: formNis,
        gender: formGender,
        classId: formClass,
        password: formPassword,
      });
    }
    setShowModal(false);
    setRefresh((r) => r + 1);
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    setDeleteConfirm(null);
    setRefresh((r) => r + 1);
  };

  const getClassName = (classId: string) => {
    return classes.find((c) => c.id === classId)?.name || classId;
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-lg leading-none font-bold tracking-tight text-black">
            Data Manajemen Siswa
          </h1>
          <p className="mt-1.5 text-xs leading-none font-bold text-black">
            Kelola data profil, nomor induk, beserta akun akses siswa per kelas binaan Anda.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-md border-2 border-black bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-800 sm:self-end"
        >
          <UserPlus className="h-4 w-4" />
          Tambah Siswa Baru
        </button>
      </header>

      {/* FILTERS BAR */}
      <section className="flex flex-col items-center gap-3 rounded-md border-2 border-black bg-white p-3 md:flex-row">
        <div className="relative w-full md:flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-black" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama lengkap siswa atau nomor NIS..."
            className="w-full rounded-md border-2 border-black bg-white py-2 pr-4 pl-10 font-mono text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
          />
        </div>
        <div className="flex w-full shrink-0 items-center gap-2 md:w-auto">
          <span className="hidden text-[10px] font-bold tracking-wider whitespace-nowrap text-black uppercase sm:inline">
            Filter:
          </span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full cursor-pointer rounded-md border-2 border-black bg-white px-3 py-2 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600 md:w-48"
          >
            <option value="">Semua Kelas Binaan</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* STATS CHIPS */}
      <div className="flex flex-wrap gap-2.5">
        <div className="flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3.5 py-1.5 text-xs font-bold text-black">
          <span className="min-w-[20px] rounded-md border-2 border-black bg-white px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-black">
            {filteredStudents.length}
          </span>
          <span>Total Siswa</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border-2 border-blue-600 bg-white px-3.5 py-1.5 text-xs font-bold text-blue-700">
          <span className="min-w-[20px] rounded-md border-2 border-blue-600 bg-white px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-blue-700">
            {filteredStudents.filter((s) => s.gender === 'L').length}
          </span>
          <span>Laki-laki</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border-2 border-rose-600 bg-white px-3.5 py-1.5 text-xs font-bold text-rose-700">
          <span className="min-w-[20px] rounded-md border-2 border-rose-600 bg-white px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-rose-700">
            {filteredStudents.filter((s) => s.gender === 'P').length}
          </span>
          <span>Perempuan</span>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-black bg-white">
              <tr className="text-xs font-bold tracking-wider text-black uppercase">
                <th className="w-14 px-4 py-2 text-center">No</th>
                <th className="px-4 py-2 text-left">Nama Siswa</th>
                <th className="px-4 py-2 text-left">NIS</th>
                <th className="w-32 px-4 py-2 text-left">Kelas</th>
                <th className="w-24 px-4 py-2 text-center">Gender</th>
                <th className="w-36 px-4 py-2 text-center">Aksi Panel</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10">
              {filteredStudents.map((student, idx) => (
                <tr key={student.id} className="transition-colors hover:bg-neutral-100">
                  <td className="px-4 py-3 text-center font-mono text-xs font-bold text-black">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={`Foto ${student.name}`}
                          className="h-8 w-8 rounded-md border-2 border-black object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-black text-xs font-bold text-white ${
                            student.gender === 'L' ? 'bg-black' : 'bg-rose-700'
                          }`}
                        >
                          {(student.name || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs font-bold text-black">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-black">
                    {student.nis}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-md border-2 border-blue-600 bg-white px-2 py-0.5 text-[10px] font-bold tracking-wide text-blue-700 uppercase">
                      {getClassName(student.classId)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                        student.gender === 'L'
                          ? 'border-black bg-white text-black'
                          : 'border-rose-600 bg-white text-rose-700'
                      }`}
                    >
                      {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditModal(student)}
                        className="rounded-md border-2 border-black bg-white p-1.5 text-black transition hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
                        title="Ubah Data"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {deleteConfirm === student.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="rounded-md border-2 border-rose-600 bg-rose-600 px-2 py-1 text-[10px] font-bold text-white transition hover:bg-rose-700"
                          >
                            Ya
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition hover:bg-neutral-100"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(student.id)}
                          className="rounded-md border-2 border-black bg-white p-1.5 text-black transition hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600"
                          title="Hapus Data"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md border-2 border-dashed border-black bg-white text-black">
                      <Search className="h-5 w-5" />
                    </div>
                    <h3 className="text-xs font-bold text-black">Tidak ada siswa ditemukan</h3>
                    <p className="mt-0.5 text-[10px] font-bold text-black/60">
                      Coba sesuaikan kata kunci atau filter kelas Anda kembali.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL INTERFACE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-md border-2 border-black bg-white shadow-lg">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b-2 border-black p-4">
              <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
                {editingStudent ? (
                  <div className="rounded-md border-2 border-blue-600 bg-white p-1.5 text-blue-600">
                    <Edit2 className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="rounded-md border-2 border-emerald-600 bg-white p-1.5 text-emerald-700">
                    <Plus className="h-4 w-4" />
                  </div>
                )}
                {editingStudent ? 'Sunting Berkas Siswa' : 'Registrasi Siswa Baru'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md border-2 border-black bg-white p-1.5 text-black transition hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Isi Form */}
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-md border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                  placeholder="Masukkan nama lengkap siswa..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Nomor Induk Siswa (NIS)
                </label>
                <input
                  type="text"
                  value={formNis}
                  onChange={(e) => setFormNis(e.target.value)}
                  className="w-full rounded-md border-2 border-black bg-white px-3.5 py-2 font-mono text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                  placeholder="Contoh: 202601001"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as 'L' | 'P')}
                    className="w-full cursor-pointer rounded-md border-2 border-black bg-white px-3.5 py-2 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                    Penempatan Kelas
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full cursor-pointer rounded-md border-2 border-black bg-white px-3.5 py-2 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                  >
                    <option value="">Pilih Kelas</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Kata Sandi Akses
                </label>
                <input
                  type="text"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full rounded-md border-2 border-black bg-white px-3.5 py-2 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Footer Aksi Modal */}
            <div className="flex justify-end gap-2.5 border-t-2 border-black bg-white p-4">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="rounded-md border-2 border-black bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-neutral-800"
              >
                {editingStudent ? 'Simpan Perubahan' : 'Daftarkan Siswa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
