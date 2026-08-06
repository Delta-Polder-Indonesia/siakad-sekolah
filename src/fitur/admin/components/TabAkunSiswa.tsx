import { useState, useMemo, useEffect } from 'react';
import {
  History,
  Trash2,
  Search,
  UserPlus,
  UserCog,
  X,
  Download,
  FileText,
  ArrowRightLeft,
} from 'lucide-react';
import {
  addStudentClassMutation,
  addStudentStatusMutation,
  generateStudentNis,
  getClasses,
  getStudentClassMutations,
  getStudentStatusMutations,
  getStudents,
  saveStudents,
  setStudentStatus,
} from '../../../data/services';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { useToast, usePagination } from '../../../components/ui';
import type { Student, StudentStatus } from '../../../types';
import {
  exportMutationsCsv,
  exportMutationsPdf,
  exportSuratMutasiPdf,
  type MutasiSiswaRow,
} from '../../../utils/export';

const STATUS_LABEL: Record<StudentStatus, string> = {
  aktif: 'Aktif',
  keluar: 'Keluar',
  lulus: 'Lulus',
  pindah: 'Pindah',
};

const STATUS_COLOR: Record<StudentStatus, string> = {
  aktif: 'border-emerald-600 bg-white text-emerald-600',
  keluar: 'border-rose-600 bg-white text-rose-600',
  lulus: 'border-blue-600 bg-white text-blue-600',
  pindah: 'border-amber-600 bg-white text-amber-600',
};

type StudentEditMap = Record<
  string,
  {
    name: string;
    nis: string;
    password: string;
    classId: string;
    gender: 'L' | 'P';
  }
>;

const inputClass =
  'w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black outline-none transition-colors placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600';

export default function TabAkunSiswa() {
  const storeVersion = useStoreVersion();
  const { showToast } = useToast();
  const students = useMemo(() => getStudents(), [storeVersion]);
  const classes = useMemo(() => getClasses(), [storeVersion]);
  const [searchStudent, setSearchStudent] = useState('');
  const [studentEdits, setStudentEdits] = useState<StudentEditMap>({});
  const [historyStudentId, setHistoryStudentId] = useState('');
  const [statusModal, setStatusModal] = useState<Student | null>(null);
  const [statusTarget, setStatusTarget] = useState<StudentStatus>('aktif');
  const [statusNote, setStatusNote] = useState('');
  const [newStudent, setNewStudent] = useState({
    name: '',
    nis: '',
    password: 'siswa123',
    classId: classes[0]?.id ?? '',
    gender: 'L' as 'L' | 'P',
  });
  const [isMutasiMasuk, setIsMutasiMasuk] = useState(false);
  const [asalSekolah, setAsalSekolah] = useState('');

  useEffect(() => {
    const nextStudentEdits: StudentEditMap = {};
    students.forEach((student) => {
      nextStudentEdits[student.id] = {
        name: student.name,
        nis: student.nis,
        password: student.password,
        classId: student.classId,
        gender: student.gender,
      };
    });
    setStudentEdits(nextStudentEdits);
  }, [students]);

  useEffect(() => {
    if (!classes.find((item) => item.id === newStudent.classId)) {
      setNewStudent((prev) => ({ ...prev, classId: classes[0]?.id ?? '' }));
    }
  }, [classes, newStudent.classId]);

  const handleSaveStudent = (studentId: string) => {
    const edit = studentEdits[studentId];
    const currentStudent = students.find((item) => item.id === studentId);
    if (!edit || !currentStudent) return;

    if (!edit.name.trim()) {
      showToast('error', '⚠️ Nama siswa tidak boleh kosong.');
      return;
    }

    const nisUsed = students.find((item) => item.nis === edit.nis.trim() && item.id !== studentId);
    if (nisUsed) {
      showToast('error', '⚠️ NIS sudah digunakan siswa lain.');
      return;
    }

    const classExists = classes.some((item) => item.id === edit.classId);
    if (!classExists) {
      showToast('error', '⚠️ Kelas siswa tidak valid.');
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menyimpan perubahan data untuk siswa ${edit.name.trim()}?`
    );
    if (!confirmed) return;

    const nextStudents = students.map((item) => {
      if (item.id !== studentId) return item;
      return {
        ...item,
        name: edit.name.trim(),
        nis: edit.nis.trim(),
        password: edit.password,
        classId: edit.classId,
        gender: edit.gender,
      };
    });

    if (currentStudent.classId !== edit.classId) {
      addStudentClassMutation({
        studentId,
        studentName: edit.name.trim(),
        fromClassId: currentStudent.classId,
        toClassId: edit.classId,
        note: 'Dipindahkan melalui panel tata usaha',
      });
    }

    saveStudents(nextStudents);
    showToast('success', '✅ Data siswa berhasil diperbarui.');
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find((item) => item.id === studentId);
    if (!student) return;

    const confirmed = window.confirm(
      `Hapus siswa ${student.name} dari portal sistem secara permanen?`
    );
    if (!confirmed) return;

    const nextStudents = students.filter((item) => item.id !== studentId);
    saveStudents(nextStudents);
    showToast('success', `✅ Siswa ${student.name} berhasil dihapus.`);
    if (historyStudentId === studentId) {
      setHistoryStudentId('');
    }
  };

  const handleSetStatus = () => {
    if (!statusModal) return;
    const ok = setStudentStatus(statusModal.id, statusTarget, statusNote);
    if (ok) {
      showToast(
        'success',
        `✅ Status ${statusModal.name} diubah menjadi ${STATUS_LABEL[statusTarget]}.`
      );
    } else {
      showToast('error', '⚠️ Gagal mengubah status (data siswa tidak ditemukan).');
    }
    setStatusModal(null);
    setStatusNote('');
    setStatusTarget('aktif');
  };

  const openStatusModal = (student: Student) => {
    setStatusModal(student);
    setStatusTarget(student.status || 'aktif');
    setStatusNote('');
  };

  const handleAddStudent = () => {
    const name = newStudent.name.trim();
    const nis = isMutasiMasuk ? generateStudentNis(students) : newStudent.nis.trim();

    if (!name || !newStudent.classId) {
      showToast('error', '⚠️ Lengkapi nama dan kelas siswa baru sebelum mendaftar.');
      return;
    }

    if (!isMutasiMasuk && !nis) {
      showToast('error', '⚠️ NIS wajib diisi untuk registrasi biasa.');
      return;
    }

    const nisUsed = students.some((item) => item.nis === nis);
    if (nisUsed) {
      showToast('error', '⚠️ Gagal: NIS siswa baru sudah terdaftar di database.');
      return;
    }

    const confirmMessage = isMutasiMasuk
      ? `Daftarkan mutasi masuk atas nama ${name}${asalSekolah.trim() ? ` dari ${asalSekolah.trim()}` : ''}? NIS akan dibuat otomatis (${nis}).`
      : `Daftarkan siswa baru atas nama ${name}?`;
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    const studentId = `s-${Date.now()}`;
    const nextStudents: Student[] = [
      {
        id: studentId,
        name,
        nis,
        password: newStudent.password || 'siswa123',
        classId: newStudent.classId,
        gender: newStudent.gender,
        ...(isMutasiMasuk
          ? {
              status: 'aktif' as const,
              statusNote: asalSekolah.trim()
                ? `Mutasi masuk dari ${asalSekolah.trim()}`
                : 'Mutasi masuk dari sekolah lain',
              statusUpdatedAt: new Date().toISOString(),
            }
          : {}),
      },
      ...students,
    ];

    saveStudents(nextStudents);

    if (isMutasiMasuk) {
      addStudentStatusMutation({
        studentId,
        studentName: name,
        fromStatus: 'pindah',
        toStatus: 'aktif',
        note: asalSekolah.trim()
          ? `Mutasi masuk dari ${asalSekolah.trim()}`
          : 'Mutasi masuk dari sekolah lain',
      });
    }

    setNewStudent({
      name: '',
      nis: '',
      password: 'siswa123',
      classId: classes[0]?.id ?? '',
      gender: 'L',
    });
    setAsalSekolah('');
    setIsMutasiMasuk(false);
    showToast(
      'success',
      isMutasiMasuk
        ? `✅ Mutasi masuk ${name} berhasil didaftarkan (NIS ${nis}).`
        : '✅ Siswa baru berhasil ditambahkan.'
    );
  };

  const filteredStudents = students.filter((item) => {
    if (!searchStudent.trim()) return true;
    const key = searchStudent.toLowerCase();
    const className = classes.find((cls) => cls.id === item.classId)?.name || '';
    return (
      item.name.toLowerCase().includes(key) ||
      item.nis.toLowerCase().includes(key) ||
      className.toLowerCase().includes(key)
    );
  });

  const selectedHistoryStudent = students.find((item) => item.id === historyStudentId) || null;
  const classMutations = useMemo(
    () => (historyStudentId ? getStudentClassMutations(historyStudentId) : []),
    [historyStudentId, storeVersion]
  );
  const statusMutations = useMemo(
    () => (historyStudentId ? getStudentStatusMutations(historyStudentId) : []),
    [historyStudentId, storeVersion]
  );

  const resolveClassName = (classId: string) =>
    classes.find((item) => item.id === classId)?.name || '-';

  const mutationRows = useMemo<MutasiSiswaRow[]>(() => {
    const statusRows: MutasiSiswaRow[] = statusMutations.map((item) => ({
      jenis: 'Status',
      waktu: item.movedAt,
      dari: STATUS_LABEL[item.fromStatus],
      ke: STATUS_LABEL[item.toStatus],
      catatan: item.note,
    }));
    const classRows: MutasiSiswaRow[] = classMutations.map((item) => ({
      jenis: 'Kelas',
      waktu: item.movedAt,
      dari: resolveClassName(item.fromClassId),
      ke: resolveClassName(item.toClassId),
      catatan: item.note,
    }));
    return [...statusRows, ...classRows];
  }, [statusMutations, classMutations]);

  const handleExportMutationsCsv = () => {
    if (!selectedHistoryStudent) return;
    if (mutationRows.length === 0) {
      showToast('error', '⚠️ Belum ada data mutasi untuk diekspor.');
      return;
    }
    exportMutationsCsv(mutationRows, selectedHistoryStudent.name);
    showToast('success', '✅ CSV riwayat mutasi berhasil diunduh.');
  };

  const handleExportMutationsPdf = () => {
    if (!selectedHistoryStudent) return;
    if (mutationRows.length === 0) {
      showToast('error', '⚠️ Belum ada data mutasi untuk diekspor.');
      return;
    }
    exportMutationsPdf(mutationRows, selectedHistoryStudent.name);
    showToast('success', '✅ PDF riwayat mutasi berhasil diunduh.');
  };

  const handleExportSuratMutasi = () => {
    if (!selectedHistoryStudent) return;
    const status = selectedHistoryStudent.status;
    if (status !== 'pindah' && status !== 'keluar') {
      showToast('error', '⚠️ Surat hanya tersedia untuk siswa berstatus Pindah atau Keluar.');
      return;
    }
    exportSuratMutasiPdf({
      studentName: selectedHistoryStudent.name,
      nis: selectedHistoryStudent.nis,
      className: resolveClassName(selectedHistoryStudent.classId),
      jenis: status,
      note: selectedHistoryStudent.statusNote,
      movedAt: selectedHistoryStudent.statusUpdatedAt,
    });
    showToast('success', '✅ Surat keterangan berhasil diunduh.');
  };

  const { paginatedData, PaginationComponent } = usePagination(filteredStudents, 10);

  return (
    <div className="w-full space-y-4 rounded-md border-2 border-black bg-white p-4">
      {/* HEADER UTAMA */}
      <header className="flex flex-col gap-3 border-b-2 border-black pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg leading-none font-bold tracking-tight text-black uppercase">
            Sistem Administrasi Data Siswa
          </h1>
          <p className="mt-1 text-[10px] font-bold tracking-wide text-black/60 uppercase">
            Panel ringkas untuk melihat, mengedit akun, memproses mutasi, dan menghapus data siswa.
          </p>
        </div>
        <div className="shrink-0 border-black text-left sm:border-l-2 sm:pl-4 sm:text-right">
          <p className="text-[10px] font-bold tracking-wider text-black/50 uppercase">
            Database Terdaftar
          </p>
          <p className="font-mono text-sm font-black text-black">{students.length} SISWA</p>
        </div>
      </header>

      {/* FORM TAMBAH SISWA BARU */}
      <section className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-black uppercase">
            <UserPlus className="h-3.5 w-3.5 text-black" />
            <span>Registrasi Siswa Baru</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMutasiMasuk((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
              isMutasiMasuk
                ? 'border-black bg-black text-white'
                : 'border-black bg-white text-black hover:bg-neutral-100'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            {isMutasiMasuk ? 'Mode Mutasi Masuk' : 'Mode Reguler'}
          </button>
        </div>
        <div className="grid gap-2 rounded-md border-2 border-black bg-neutral-50 p-3 md:grid-cols-6">
          <input
            value={newStudent.name}
            onChange={(event) => setNewStudent((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Nama siswa baru"
            className={`${inputClass} md:col-span-2`}
          />
          {isMutasiMasuk ? (
            <>
              <div className="flex items-center gap-1 rounded-md border-2 border-dashed border-black/40 bg-neutral-100 px-3 py-1.5 font-mono text-xs font-bold text-black/60">
                <span>NIS: {generateStudentNis(students)}</span>
              </div>
              <input
                value={asalSekolah}
                onChange={(event) => setAsalSekolah(event.target.value)}
                placeholder="Asal sekolah (opsional)"
                className={`${inputClass} md:col-span-2`}
              />
            </>
          ) : (
            <input
              value={newStudent.nis}
              onChange={(event) => setNewStudent((prev) => ({ ...prev, nis: event.target.value }))}
              placeholder="NIS Siswa"
              className={`${inputClass} font-mono`}
            />
          )}
          <select
            value={newStudent.classId}
            onChange={(event) =>
              setNewStudent((prev) => ({ ...prev, classId: event.target.value }))
            }
            className="cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
          >
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                Kelas: {item.name}
              </option>
            ))}
          </select>
          <select
            value={newStudent.gender}
            onChange={(event) =>
              setNewStudent((prev) => ({
                ...prev,
                gender: event.target.value === 'P' ? 'P' : 'L',
              }))
            }
            className="cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <button
            type="button"
            onClick={handleAddStudent}
            className="rounded-md border-2 border-black bg-black px-3 py-1.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-900"
          >
            <span>{isMutasiMasuk ? 'Daftar Mutasi' : 'Tambah'}</span>
          </button>
        </div>
        {isMutasiMasuk && (
          <p className="text-[10px] font-bold text-black/60">
            NIS dibuat otomatis &amp; dicatat sebagai mutasi masuk (status aktif) di riwayat mutasi.
          </p>
        )}
      </section>

      {/* FILTER & TABEL UTAMA */}
      <section className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex flex-col justify-between gap-2 border-b-2 border-black bg-white p-3 sm:flex-row sm:items-center">
          <h3 className="text-xs font-bold tracking-wider text-black uppercase">
            Informasi Akun &amp; Penempatan Kelas
          </h3>
          <div className="relative w-full sm:w-72">
            <input
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Cari nama, NIS, atau kelas..."
              className={`${inputClass} pl-8`}
            />
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-black/50" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] bg-white text-left">
            <thead className="border-b-2 border-black bg-white">
              <tr className="text-xs font-bold tracking-wider text-black uppercase">
                <th className="w-48 p-3">Nama Siswa</th>
                <th className="w-14 p-3 text-center">JK</th>
                <th className="w-48 p-3">Kelas Tujuan (Mutasi)</th>
                <th className="w-28 p-3 text-center">Status</th>
                <th className="w-32 p-3">NIS (Username)</th>
                <th className="w-32 p-3">Kata Sandi</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {paginatedData.map((student) => {
                const edit = studentEdits[student.id];
                if (!edit) return null;
                const className = classes.find((item) => item.id === student.classId)?.name || '-';
                return (
                  <tr key={student.id} className="transition-colors hover:bg-neutral-100">
                    <td className="p-2.5">
                      <input
                        value={edit.name}
                        onChange={(e) =>
                          setStudentEdits((prev) => ({
                            ...prev,
                            [student.id]: {
                              ...prev[student.id],
                              name: e.target.value,
                            },
                          }))
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <select
                        value={edit.gender}
                        onChange={(e) =>
                          setStudentEdits((prev) => ({
                            ...prev,
                            [student.id]: {
                              ...prev[student.id],
                              gender: e.target.value === 'P' ? 'P' : 'L',
                            },
                          }))
                        }
                        className="w-14 cursor-pointer rounded-md border-2 border-black bg-white px-1 py-1 text-center text-xs font-bold text-black transition-colors outline-none hover:border-blue-600"
                      >
                        <option value="L">L</option>
                        <option value="P">P</option>
                      </select>
                    </td>
                    <td className="space-y-1 p-2.5">
                      <select
                        value={edit.classId}
                        onChange={(e) =>
                          setStudentEdits((prev) => ({
                            ...prev,
                            [student.id]: {
                              ...prev[student.id],
                              classId: e.target.value,
                            },
                          }))
                        }
                        className="w-full cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600"
                      >
                        {classes.map((item) => (
                          <option key={item.id} value={item.id}>
                            Kelas {item.name}
                          </option>
                        ))}
                      </select>
                      <div className="inline-block rounded-md border-2 border-black bg-neutral-50 px-2 py-0.5 text-[10px] font-bold text-black">
                        Aktif: {className}
                      </div>
                    </td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`inline-block rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                          STATUS_COLOR[student.status || 'aktif']
                        }`}
                      >
                        {STATUS_LABEL[student.status || 'aktif']}
                      </span>
                      {student.statusNote ? (
                        <div className="mt-0.5 text-[10px] font-bold text-black/40">
                          {student.statusNote}
                        </div>
                      ) : null}
                    </td>
                    <td className="p-2.5">
                      <input
                        value={edit.nis}
                        onChange={(e) =>
                          setStudentEdits((prev) => ({
                            ...prev,
                            [student.id]: {
                              ...prev[student.id],
                              nis: e.target.value,
                            },
                          }))
                        }
                        className={`${inputClass} font-mono`}
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        value={edit.password}
                        onChange={(e) =>
                          setStudentEdits((prev) => ({
                            ...prev,
                            [student.id]: {
                              ...prev[student.id],
                              password: e.target.value,
                            },
                          }))
                        }
                        className={`${inputClass} font-mono`}
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleSaveStudent(student.id)}
                          className="rounded-md border-2 border-black bg-black px-2.5 py-1 text-[10px] font-bold text-white transition-colors hover:bg-neutral-900"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => openStatusModal(student)}
                          title="Ubah status mutasi siswa"
                          className="inline-flex items-center gap-1 rounded-md border-2 border-blue-600 bg-white px-2.5 py-1 text-[10px] font-bold text-blue-600 transition-colors hover:bg-neutral-100"
                        >
                          <UserCog className="h-3 w-3" />
                          Mutasi
                        </button>
                        <button
                          onClick={() => setHistoryStudentId(student.id)}
                          className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                        >
                          <History className="h-3 w-3" />
                          Log
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="inline-flex items-center gap-1 rounded-md border-2 border-rose-600 bg-white px-2.5 py-1 text-[10px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-12 text-center text-xs font-bold tracking-wider text-black/50 uppercase"
                  >
                    — Tidak ada data registrasi siswa ditemukan —
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="border-t-2 border-black/10 p-2">{PaginationComponent}</div>
      </section>

      {/* LOG PANEL RIWAYAT MUTASI */}
      {selectedHistoryStudent ? (
        <section className="overflow-hidden rounded-md border-2 border-black bg-white">
          <div className="flex flex-col justify-between gap-2 border-b-2 border-black bg-white p-3 sm:flex-row sm:items-center">
            <h3 className="text-xs font-bold tracking-wider text-black uppercase">
              Log Mutasi Kelas: {selectedHistoryStudent.name.toUpperCase()}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {mutationRows.length > 0 ? (
                <>
                  <button
                    onClick={handleExportMutationsCsv}
                    className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                  >
                    <Download className="h-3.5 w-3.5" /> CSV
                  </button>
                  <button
                    onClick={handleExportMutationsPdf}
                    className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                  >
                    <FileText className="h-3.5 w-3.5" /> PDF
                  </button>
                </>
              ) : null}
              {selectedHistoryStudent.status === 'pindah' ||
              selectedHistoryStudent.status === 'keluar' ? (
                <button
                  onClick={handleExportSuratMutasi}
                  className="inline-flex items-center gap-1 rounded-md border-2 border-emerald-600 bg-white px-2.5 py-1 text-[10px] font-bold text-emerald-600 transition-colors hover:bg-neutral-100"
                >
                  <FileText className="h-3.5 w-3.5" /> Surat{' '}
                  {selectedHistoryStudent.status === 'pindah' ? 'Pindah' : 'Keluar'}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setHistoryStudentId('')}
                className="rounded-md border-2 border-black bg-white px-3 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
              >
                Tutup Log
              </button>
            </div>
          </div>

          {classMutations.length > 0 || statusMutations.length > 0 ? (
            <div className="space-y-4 p-3">
              {statusMutations.length > 0 ? (
                <div>
                  <h3 className="mb-1.5 text-[10px] font-bold tracking-wider text-black uppercase">
                    Riwayat Status / Mutasi Masuk-Keluar
                  </h3>
                  <div className="overflow-x-auto rounded-md border-2 border-black">
                    <table className="w-full min-w-[550px] bg-white text-left text-xs">
                      <thead className="border-b-2 border-black bg-white">
                        <tr className="text-[10px] font-bold tracking-wider text-black uppercase">
                          <th className="w-44 p-3">Waktu</th>
                          <th className="w-24 p-3">Dari</th>
                          <th className="w-24 p-3">Ke</th>
                          <th className="p-3">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
                        {statusMutations.map((item) => (
                          <tr key={item.id} className="transition-colors hover:bg-neutral-100">
                            <td className="p-3 font-mono text-black/60">
                              {new Date(item.movedAt).toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 font-bold text-black">
                              {STATUS_LABEL[item.fromStatus]}
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-block rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                                  STATUS_COLOR[item.toStatus]
                                }`}
                              >
                                {STATUS_LABEL[item.toStatus]}
                              </span>
                            </td>
                            <td className="p-3 text-black/70">{item.note || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {classMutations.length > 0 ? (
                <div>
                  <h3 className="mb-1.5 text-[10px] font-bold tracking-wider text-black uppercase">
                    Riwayat Mutasi Kelas
                  </h3>
                  <div className="overflow-x-auto rounded-md border-2 border-black">
                    <table className="w-full min-w-[550px] bg-white text-left text-xs">
                      <thead className="border-b-2 border-black bg-white">
                        <tr className="text-[10px] font-bold tracking-wider text-black uppercase">
                          <th className="w-44 p-3">Waktu Mutasi</th>
                          <th className="p-3">Dari Kelas</th>
                          <th className="p-3">Ke Kelas</th>
                          <th className="p-3">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
                        {classMutations.map((item) => (
                          <tr key={item.id} className="transition-colors hover:bg-neutral-100">
                            <td className="p-3 font-mono text-black/60">
                              {new Date(item.movedAt).toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 font-bold text-black">
                              {resolveClassName(item.fromClassId)}
                            </td>
                            <td className="p-3 font-bold text-black">
                              {resolveClassName(item.toClassId)}
                            </td>
                            <td className="p-3 text-black/70">{item.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-md border-2 border-dashed border-black bg-white p-6 text-center text-xs font-bold text-black/50">
              Belum ada log mutasi untuk siswa ini.
            </div>
          )}
        </section>
      ) : null}

      {/* MODAL STATUS MUTASI */}
      {statusModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-md border-2 border-black bg-white shadow-none">
            <div className="flex items-center justify-between border-b-2 border-black p-4">
              <h3 className="text-xs font-bold tracking-wider text-black uppercase">
                Ubah Status: {statusModal.name}
              </h3>
              <button
                type="button"
                onClick={() => setStatusModal(null)}
                className="rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:bg-neutral-100"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Status Keaktifan
                </span>
                <select
                  value={statusTarget}
                  onChange={(e) => setStatusTarget(e.target.value as StudentStatus)}
                  className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                >
                  <option value="aktif">Aktif</option>
                  <option value="lulus">Lulus</option>
                  <option value="pindah">Pindah / Keluar Keluar</option>
                  <option value="keluar">Keluar (Dropout / Dikeluarkan)</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Catatan (Opsional)
                </span>
                <input
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Contoh: pindah ke SMPN 2 Medan / lulus 2026"
                  className={inputClass}
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t-2 border-black/10 bg-neutral-50 p-3">
              <button
                onClick={() => setStatusModal(null)}
                className="rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
              >
                Batal
              </button>
              <button
                onClick={handleSetStatus}
                className="rounded-md border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-neutral-900"
              >
                Simpan Status
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
