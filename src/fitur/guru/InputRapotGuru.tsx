import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClasses,
  getStudentsByClass,
  getTeacherByUser,
  getLocalTeacherId,
  getNilaiRapotByKelas,
  upsertNilaiRapot,
  deleteNilaiRapot,
  getMataPelajaran,
  getTahunAjaran,
  getTahunAjaranAktif,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Save, Trash2, Plus, BookOpenCheck, Search, Edit2, Download } from 'lucide-react';
import { exportRapotPdf, exportRapotCsv } from '../../utils/export';
import {
  hitungNilaiAkhir,
  hitungPredikat,
  isTuntas,
  KONFIGURASI_PENILAIAN,
} from '../../utils/penilaian';
import type { NilaiRapot } from '../../types';

const MASTER_MAPEL_DEFAULT: string[] = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'IPA',
  'IPS',
  'PKN',
  'Pendidikan Agama',
  'Seni Budaya',
  'PJOK',
  'Prakarya',
  'TIK',
];

function generateTahunAjaran(): string[] {
  const currentYear = new Date().getFullYear();
  const items: string[] = [];
  for (let i = -1; i <= 2; i += 1) {
    items.push(`${currentYear - i}/${currentYear - i + 1}`);
  }
  return items;
}

export default function InputRapotGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [semester, setSemester] = useState<'ganjil' | 'genap'>('genap');
  const [tahunAjaran, setTahunAjaran] = useState<string>(() => {
    const aktif = getTahunAjaranAktif();
    if (aktif) return aktif.tahun;
    const y = new Date().getFullYear();
    return `${y}/${y + 1}`;
  });
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [notice, setNotice] = useState<string>('');

  const [daftarMapel, setDaftarMapel] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_daftar_mapel');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MASTER_MAPEL_DEFAULT;
      }
    }
    return MASTER_MAPEL_DEFAULT;
  });

  const [formMapel, setFormMapel] = useState<string>('');
  const [manualMapel, setManualMapel] = useState<string>('');
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [formTugas, setFormTugas] = useState<number | ''>('');
  const [formUTS, setFormUTS] = useState<number | ''>('');
  const [formUAS, setFormUAS] = useState<number | ''>('');
  const [formCatatan, setFormCatatan] = useState<string>('');

  const teacherClasses = useMemo(() => {
    const teacher = getTeacherByUser(user);
    return getClasses().filter((item) => teacher?.classIds.includes(item.id));
  }, [user, storeVersion]);

  useEffect(() => {
    if (!selectedClassId && teacherClasses.length > 0) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClassId]);

  const students = useMemo(() => {
    if (!selectedClassId) return [];
    return getStudentsByClass(selectedClassId).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedClassId, storeVersion]);

  const filteredStudents = useMemo(() => {
    if (!searchStudent.trim()) return students;
    const key = searchStudent.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(key) || s.nis.includes(searchStudent)
    );
  }, [students, searchStudent]);

  const nilaiKelas = useMemo(() => {
    if (!selectedClassId) return [];
    return getNilaiRapotByKelas(selectedClassId, tahunAjaran, semester);
  }, [selectedClassId, tahunAjaran, semester, storeVersion]);

  const nilaiSiswa = useMemo(() => {
    return nilaiKelas.filter((item) => item.studentId === selectedStudentId);
  }, [nilaiKelas, selectedStudentId]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const masterMapel = useMemo(() => getMataPelajaran().map((m) => m.nama), [storeVersion]);
  const masterTahunAjaran = useMemo(() => getTahunAjaran(), [storeVersion]);

  const availableMapel = useMemo(() => {
    return Array.from(new Set([...masterMapel, ...daftarMapel]));
  }, [masterMapel, daftarMapel]);

  const tahunOptions = useMemo(() => {
    const fromMaster = masterTahunAjaran.map((t) => t.tahun);
    return Array.from(new Set([...fromMaster, ...generateTahunAjaran()]));
  }, [masterTahunAjaran]);

  const resetForm = () => {
    setFormMapel('');
    setManualMapel('');
    setIsManualMode(false);
    setFormTugas('');
    setFormUTS('');
    setFormUAS('');
    setFormCatatan('');
  };

  const nilaiTugasNum = formTugas === '' ? 0 : formTugas;
  const nilaiUTSNum = formUTS === '' ? 0 : formUTS;
  const nilaiUASNum = formUAS === '' ? 0 : formUAS;

  const mapelToSubmit = isManualMode ? manualMapel.trim() : formMapel.trim();

  const handleSimpanNilai = () => {
    if (!user || !selectedStudentId || !selectedClassId || !mapelToSubmit) {
      setNotice('Pilih siswa dan tentukan mata pelajaran terlebih dahulu.');
      return;
    }

    const nilaiAkhir = hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum);
    const predikat = hitungPredikat(nilaiAkhir);

    const isExist = daftarMapel.some((m) => m.toLowerCase() === mapelToSubmit.toLowerCase());
    if (!isExist) {
      const updatedList = [...daftarMapel, mapelToSubmit];
      setDaftarMapel(updatedList);
      localStorage.setItem('app_daftar_mapel', JSON.stringify(updatedList));
    }

    const item: NilaiRapot = {
      id: `rapot_${selectedStudentId}_${tahunAjaran}_${semester}_${mapelToSubmit}`,
      studentId: selectedStudentId,
      classId: selectedClassId,
      semester,
      tahunAjaran,
      mataPelajaran: mapelToSubmit,
      nilaiHarian: 0,
      nilaiTugas: nilaiTugasNum,
      nilaiUTS: nilaiUTSNum,
      nilaiUAS: nilaiUASNum,
      nilaiAkhir,
      predikat,
      catatanGuru: formCatatan.trim() || undefined,
      inputBy: getLocalTeacherId(user) || user.id || 'SYSTEM_GURU',
      updatedAt: Date.now(),
    };

    upsertNilaiRapot({
      ...item,
      nilaiHarian: item.nilaiHarian ?? 0,
      inputBy: item.inputBy || 'SYSTEM_GURU',
    });

    setNotice(
      `LOG_SUCCESS: Nilai ${mapelToSubmit} untuk ${selectedStudent?.name} berhasil disimpan.`
    );
    resetForm();
  };

  const handleEditNilai = (item: NilaiRapot) => {
    if (availableMapel.includes(item.mataPelajaran)) {
      setFormMapel(item.mataPelajaran);
      setIsManualMode(false);
    } else {
      setFormMapel('__MANUAL_INPUT__');
      setManualMapel(item.mataPelajaran);
      setIsManualMode(true);
    }
    setFormTugas(item.nilaiTugas ?? '');
    setFormUTS(item.nilaiUTS ?? '');
    setFormUAS(item.nilaiUAS ?? '');
    setFormCatatan(item.catatanGuru || '');
    setNotice('');
  };

  const handleHapusNilai = (id: string) => {
    if (!window.confirm('Hapus log nilai mata pelajaran ini?')) return;
    deleteNilaiRapot(id);
    setNotice('LOG_DELETED: Nilai berhasil dihapus.');
  };

  const predikatClassName = (p: string | undefined) => {
    switch (p) {
      case 'A':
      case 'B':
      case 'C':
      case 'D':
        return 'border-2 border-black bg-white text-black font-bold';
      default:
        return 'border-2 border-black bg-white text-black line-through';
    }
  };

  const rataRata =
    nilaiSiswa.length > 0
      ? Math.round(nilaiSiswa.reduce((sum, item) => sum + item.nilaiAkhir, 0) / nilaiSiswa.length)
      : 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── HEADER ──────────────────────── */}
      <header className="flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-lg leading-none font-bold tracking-tight text-black">
            Input Rapot Siswa
          </h1>
          <p className="mt-1.5 text-xs leading-none font-bold text-black">
            Panel input, manajemen, dan arsip transkrip nilai rapot resmi per kompartemen kelas
            binaan.
          </p>
        </div>

        <div className="flex items-center gap-4 self-start border-l-2 border-black pl-4 sm:self-end">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-wider text-black uppercase">
              Kompartemen Kelas
            </span>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedStudentId('');
              }}
              className="mt-0.5 w-full cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1 font-mono text-xs font-bold text-black uppercase transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              {teacherClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name.toUpperCase()}
                </option>
              ))}
              {teacherClasses.length === 0 && <option value="">NULL_CLASS</option>}
            </select>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-wider text-black uppercase">
              Tahun Ajaran
            </span>
            <select
              value={tahunAjaran}
              onChange={(e) => setTahunAjaran(e.target.value)}
              className="mt-0.5 w-full cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1 font-mono text-xs font-bold text-black uppercase transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              {tahunOptions.map((ta) => (
                <option key={ta} value={ta}>
                  {ta}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-wider text-black uppercase">
              Semester
            </span>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value as 'ganjil' | 'genap')}
              className="mt-0.5 w-full cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1 font-mono text-xs font-bold text-black uppercase transition-colors outline-none focus:border-black focus:bg-neutral-50"
            >
              <option value="ganjil">GANJIL</option>
              <option value="genap">GENAP</option>
            </select>
          </div>
        </div>
      </header>

      {/* ── NOTICE LOG BAR ──────────────────────────────────────── */}
      {notice && (
        <div className="border-2 border-black bg-white p-2.5 text-[11px] font-bold tracking-tight text-black uppercase">
          {notice}
        </div>
      )}

      {/* ── TWO-COLUMN WORKSPACE ────────────────────────────────── */}
      <div className="grid items-start gap-4 xl:grid-cols-[300px_1fr]">
        {/* PANEL KIRI — DAFTAR SISWA */}
        <section className="border-2 border-black p-3">
          <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-2 text-[10px] font-bold tracking-wider text-black uppercase">
            <Search className="h-4 w-4 text-black" />
            <span>Manifes Siswa Kelas</span>
          </div>

          <div className="relative mb-3">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-black" />
            <input
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Cari nama atau NIS..."
              className="w-full rounded-md border-2 border-black bg-white py-1.5 pr-3 pl-8 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
            />
          </div>

          <div className="max-h-[560px] space-y-1 overflow-y-auto pr-0.5">
            {filteredStudents.map((s) => {
              const isSelected = selectedStudentId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedStudentId(s.id);
                    resetForm();
                    setNotice('');
                  }}
                  className={`w-full cursor-pointer border bg-white px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? 'border-black bg-neutral-100 font-bold'
                      : 'border-transparent font-semibold hover:border-black'
                  }`}
                >
                  <span className="truncate text-xs font-bold text-black uppercase">{s.name}</span>
                </button>
              );
            })}

            {filteredStudents.length === 0 && (
              <div className="border-2 border-dashed border-black bg-white py-14 text-center">
                <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                  QUERY_EMPTY
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-black">
                  Tidak ada siswa sesuai pencarian.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* PANEL KANAN — MAIN INTERFACE */}
        <div className="space-y-4">
          {!selectedStudent ? (
            <div className="border-2 border-dashed border-black bg-white py-24 text-center">
              <BookOpenCheck className="mx-auto mb-2 h-8 w-8 text-black" />
              <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                AWAITING_STUDENT_SELECTION
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-black">
                Pilih entitas siswa pada panel manifes kiri untuk memulai konfigurasi pengisian log
                nilai rapot.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-black p-4">
                <div className="space-y-0.5">
                  <div className="text-[9px] font-bold tracking-wider text-black uppercase">
                    ENTITAS_SISWA_AKTIF
                  </div>
                  <h2 className="text-sm font-black tracking-tight text-black uppercase">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-[10px] font-semibold text-black">
                    NIS: {selectedStudent.nis} &bull; {tahunAjaran} &bull; SEMESTER_
                    {semester.toUpperCase()}
                  </p>
                </div>
                <div className="border-l border-black pl-4 text-right">
                  <p className="text-2xl font-black tracking-tighter text-black">{rataRata}</p>
                  <p className="text-[9px] font-bold tracking-wider text-black uppercase">
                    CUMULATIVE_AVG
                  </p>
                </div>
              </div>

              {/* FORM INPUT NILAI */}
              <section className="border-2 border-black p-3">
                <div className="mb-4 flex items-center gap-2 border-b-2 border-black pb-2 text-[10px] font-bold tracking-wider text-black uppercase">
                  <Plus className="h-4 w-4 text-black" />
                  <span>
                    {mapelToSubmit
                      ? `Edit Log: ${mapelToSubmit.toUpperCase()}`
                      : 'Input Nilai Mata Pelajaran'}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold tracking-wide text-black uppercase">
                      Mata Pelajaran
                    </label>
                    {!isManualMode ? (
                      <select
                        value={formMapel}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '__MANUAL_INPUT__') {
                            setIsManualMode(true);
                            setFormMapel('__MANUAL_INPUT__');
                          } else {
                            setFormMapel(val);
                          }
                        }}
                        className="w-full cursor-pointer rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                      >
                        <option value="">-- Pilih Mapel --</option>
                        {availableMapel.map((mapel) => (
                          <option key={mapel} value={mapel}>
                            {mapel}
                          </option>
                        ))}
                        <option value="__MANUAL_INPUT__">+ Tulis Mapel Manual...</option>
                      </select>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={manualMapel}
                          onChange={(e) => setManualMapel(e.target.value)}
                          placeholder="Ketik mapel khusus..."
                          className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsManualMode(false);
                            setFormMapel('');
                            setManualMapel('');
                          }}
                          className="text-[9px] font-bold tracking-wide text-black uppercase hover:text-black hover:underline"
                        >
                          [ Kembali ke Pilihan ]
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold tracking-wide text-black uppercase">
                      Nilai Tugas (30%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formTugas}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormTugas(val === '' ? '' : Math.min(100, Math.max(0, Number(val))));
                      }}
                      className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold tracking-wide text-black uppercase">
                      Nilai UTS (30%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formUTS}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormUTS(val === '' ? '' : Math.min(100, Math.max(0, Number(val))));
                      }}
                      className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold tracking-wide text-black uppercase">
                      Nilai UAS (40%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formUAS}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormUAS(val === '' ? '' : Math.min(100, Math.max(0, Number(val))));
                      }}
                      className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                    />
                  </div>

                  <div className="flex items-center justify-center border-2 border-black bg-white p-2 text-center">
                    <div>
                      <span className="block text-[9px] font-bold tracking-wider text-black uppercase">
                        RESULT_FINAL
                      </span>
                      <p className="text-xl font-black tracking-tighter text-black">
                        {hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum)}
                      </p>
                      <span
                        className={`mt-0.5 inline-block border px-1 text-[9px] font-bold ${predikatClassName(
                          hitungPredikat(hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum))
                        )}`}
                      >
                        {hitungPredikat(hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum))}
                      </span>
                      <span
                        className={`mt-0.5 block text-[9px] font-bold ${
                          isTuntas(hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum))
                            ? 'text-green-700'
                            : 'text-red-600'
                        }`}
                      >
                        {isTuntas(hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum))
                          ? 'TUNTAS'
                          : `BELUM TUNTAS (KKM ${KONFIGURASI_PENILAIAN.kkm})`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <label className="block text-[10px] font-bold tracking-wide text-black uppercase">
                    Catatan Korespondensi Akademik (Opsional)
                  </label>
                  <input
                    value={formCatatan}
                    onChange={(e) => setFormCatatan(e.target.value)}
                    placeholder="Input catatan guru mengenai perkembangan akademis siswa..."
                    className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black focus:bg-neutral-50"
                  />
                </div>

                <div className="mt-4 flex gap-2 border-t-2 border-black pt-3">
                  <button
                    type="button"
                    onClick={handleSimpanNilai}
                    disabled={!mapelToSubmit}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-black disabled:opacity-60"
                  >
                    <Save className="h-3.5 w-3.5" />
                    COMMIT_RECORD
                  </button>
                  {(formMapel || manualMapel) && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="cursor-pointer rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                    >
                      ABORT
                    </button>
                  )}
                </div>
              </section>

              {/* TABEL ARSIP NILAI */}
              <section className="overflow-hidden border-2 border-black">
                <div className="flex items-center gap-2 border-b-2 border-black bg-white px-4 py-2.5 text-[10px] font-bold tracking-wider text-black uppercase">
                  <BookOpenCheck className="h-4 w-4 text-black" />
                  <span>Arsip Transkrip Akademis ({nilaiSiswa.length} Mata Pelajaran)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] table-fixed border-collapse text-left">
                    <thead>
                      <tr className="border-b-2 border-black bg-white text-[10px] font-bold tracking-wider text-black uppercase">
                        <th className="w-12 border-r-2 border-black/10 px-3 py-2 text-center">
                          NO
                        </th>
                        <th className="w-48 border-r-2 border-black/10 px-3 py-2">
                          MATA_PELAJARAN
                        </th>
                        <th className="w-20 border-r-2 border-black/10 px-3 py-2 text-center">
                          TUGAS
                        </th>
                        <th className="w-20 border-r-2 border-black/10 px-3 py-2 text-center">
                          UTS
                        </th>
                        <th className="w-20 border-r-2 border-black/10 px-3 py-2 text-center">
                          UAS
                        </th>
                        <th className="w-20 border-r-2 border-black/10 bg-white px-3 py-2 text-center text-black">
                          AKHIR
                        </th>
                        <th className="w-24 border-r-2 border-black/10 px-3 py-2 text-center">
                          PREDIKAT
                        </th>
                        <th className="border-r-2 border-black/10 px-3 py-2">EVALUASI_CATATAN</th>
                        <th className="w-20 px-3 py-2 text-center">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black/10 text-xs font-semibold text-black">
                      {nilaiSiswa.map((item, idx) => (
                        <tr key={item.id} className="transition-colors hover:bg-white">
                          <td className="border-r-2 border-black/10 px-3 py-2 text-center font-bold text-black">
                            {idx + 1}
                          </td>
                          <td className="border-r-2 border-black/10 px-3 py-2 font-bold tracking-tight text-black uppercase">
                            {item.mataPelajaran}
                          </td>
                          <td className="border-r-2 border-black/10 px-3 py-2 text-center font-bold text-black">
                            {item.nilaiTugas}
                          </td>
                          <td className="border-r-2 border-black/10 px-3 py-2 text-center font-bold text-black">
                            {item.nilaiUTS}
                          </td>
                          <td className="border-r-2 border-black/10 px-3 py-2 text-center font-bold text-black">
                            {item.nilaiUAS}
                          </td>
                          <td className="border-r-2 border-black/10 bg-white px-3 py-2 text-center font-black text-black">
                            {item.nilaiAkhir}
                          </td>
                          <td className="border-r-2 border-black/10 px-3 py-2 text-center align-middle">
                            <span
                              className={`inline-flex h-5 w-5 items-center justify-center rounded-md border-2 text-[9px] font-bold ${predikatClassName(
                                item.predikat
                              )}`}
                            >
                              {item.predikat}
                            </span>
                          </td>
                          <td
                            className="truncate border-r-2 border-black/10 px-3 py-2 text-xs font-bold text-black"
                            title={item.catatanGuru}
                          >
                            {item.catatanGuru || '-'}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditNilai(item)}
                                className="cursor-pointer rounded-md border-2 border-black bg-white p-1 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                                title="Edit record"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleHapusNilai(item.id)}
                                className="cursor-pointer rounded-md border-2 border-black bg-white p-1 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                                title="Hapus record"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {nilaiSiswa.length === 0 && (
                        <tr>
                          <td
                            colSpan={9}
                            className="px-4 py-12 text-center tracking-wider text-black uppercase"
                          >
                            <p className="text-[10px] font-bold">NO_ACADEMIC_RECORDS_REGISTERED</p>
                            <p className="mt-0.5 text-[10px] font-semibold text-black">
                              Belum ada nilai yang diinput untuk siswa ini.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {nilaiSiswa.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between border-t-2 border-black bg-white px-4 py-2.5 text-xs font-bold text-black">
                    <div className="flex items-center gap-2">
                      <span>
                        TOTAL: <strong className="font-bold text-black">{nilaiSiswa.length}</strong>{' '}
                        MATA PELAJARAN
                      </span>
                      <span className="text-black">|</span>
                      <button type="button"
                        onClick={() =>
                          exportRapotPdf(
                            nilaiSiswa,
                            selectedStudent?.name || '',
                            teacherClasses.find((c) => c.id === selectedClassId)?.name || '',
                            tahunAjaran,
                            semester
                          )
                        }
                        className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                        title="Export PDF"
                      >
                        <Download className="h-3 w-3" /> PDF
                      </button>
                      <button type="button"
                        onClick={() =>
                          exportRapotCsv(
                            nilaiSiswa,
                            `Rapot_${(selectedStudent?.name || 'siswa').replace(/\s+/g, '_')}_${tahunAjaran}_${semester}.csv`
                          )
                        }
                        className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                        title="Export CSV (Excel)"
                      >
                        <Download className="h-3 w-3" /> CSV
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      RATA-RATA AKHIR:{' '}
                      <strong className="text-xs font-black text-black">{rataRata}</strong>
                      <span className="text-black">|</span>
                      PREDIKAT:{' '}
                      <span
                        className={`border px-1 text-[9px] font-bold ${predikatClassName(
                          hitungPredikat(rataRata)
                        )}`}
                      >
                        {hitungPredikat(rataRata)}
                      </span>
                      <span className="text-black">|</span>
                      <span
                        className={`text-[10px] font-bold ${
                          isTuntas(rataRata) ? 'text-green-700' : 'text-red-600'
                        }`}
                      >
                        {isTuntas(rataRata)
                          ? 'TUNTAS'
                          : `BELUM TUNTAS (KKM ${KONFIGURASI_PENILAIAN.kkm})`}
                      </span>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
