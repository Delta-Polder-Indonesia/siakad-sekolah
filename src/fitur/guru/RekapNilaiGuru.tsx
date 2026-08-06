import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClasses,
  getTeachers,
  getStudentsByClass,
  getNilaiRapotByKelas,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { BarChart3, Download, ClipboardList } from 'lucide-react';
import { exportRekapNilaiPdf, exportRekapNilaiCsv, type RekapNilaiRow } from '../../utils/export';
import { hitungPredikat, isTuntas, KONFIGURASI_PENILAIAN } from '../../utils/penilaian';

function generateTahunAjaran(): string[] {
  const currentYear = new Date().getFullYear();
  const items: string[] = [];
  for (let i = -1; i <= 2; i += 1) {
    items.push(`${currentYear - i}/${currentYear - i + 1}`);
  }
  return items;
}

export default function RekapNilaiGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [semester, setSemester] = useState<'ganjil' | 'genap'>('genap');
  const [tahunAjaran, setTahunAjaran] = useState(() => {
    const y = new Date().getFullYear();
    return `${y}/${y + 1}`;
  });

  const teacher = useMemo(() => getTeachers().find((t) => t.id === user?.id), [user]);

  const classes = useMemo(
    () => getClasses().filter((c) => teacher?.classIds.includes(c.id)),
    [teacher, storeVersion]
  );

  const nilaiKelas = useMemo(() => {
    if (!selectedClassId) return [];
    return getNilaiRapotByKelas(selectedClassId, tahunAjaran, semester);
  }, [selectedClassId, tahunAjaran, semester, storeVersion]);

  const subjects = useMemo(() => {
    const set = new Set<string>();
    nilaiKelas.forEach((n) => set.add(n.mataPelajaran));
    return Array.from(set).sort();
  }, [nilaiKelas]);

  const rows = useMemo<RekapNilaiRow[]>(() => {
    if (!selectedClassId || !selectedSubject) return [];
    const students = getStudentsByClass(selectedClassId).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return students
      .map((s) => {
        const item = nilaiKelas.find(
          (n) => n.studentId === s.id && n.mataPelajaran === selectedSubject
        );
        if (!item) return null;
        return {
          studentName: s.name,
          nis: s.nis,
          nilaiTugas: item.nilaiTugas ?? 0,
          nilaiUTS: item.nilaiUTS,
          nilaiUAS: item.nilaiUAS,
          nilaiAkhir: item.nilaiAkhir,
          predikat: item.predikat || hitungPredikat(item.nilaiAkhir),
          tuntas: isTuntas(item.nilaiAkhir),
        };
      })
      .filter((r): r is RekapNilaiRow => r !== null);
  }, [selectedClassId, selectedSubject, nilaiKelas, storeVersion]);

  const stats = useMemo(() => {
    if (rows.length === 0) return { avg: 0, tuntas: 0, belum: 0, pct: 0 };
    const total = rows.reduce((acc, r) => acc + r.nilaiAkhir, 0);
    const tuntas = rows.filter((r) => r.tuntas).length;
    return {
      avg: Math.round(total / rows.length),
      tuntas,
      belum: rows.length - tuntas,
      pct: Math.round((tuntas / rows.length) * 100),
    };
  }, [rows]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const handleExportPdf = () => {
    if (rows.length === 0) return;
    exportRekapNilaiPdf(
      rows,
      selectedClass?.name || selectedClassId,
      selectedSubject,
      tahunAjaran,
      semester
    );
  };

  const handleExportCsv = () => {
    if (rows.length === 0) return;
    exportRekapNilaiCsv(rows, selectedClass?.name || selectedClassId, selectedSubject, semester);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER HALAMAN */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-black" />
          <div>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black uppercase">
              Rekap Nilai
            </h1>
            <p className="mt-1.5 text-xs leading-none font-bold text-black">
              Matriks nilai siswa per mata pelajaran lengkap dengan ketuntasan KKM.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-3 rounded-md border-2 border-black bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
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
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
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
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-black/50"
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
            Semester
          </span>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value as 'ganjil' | 'genap')}
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
          >
            <option value="ganjil">Ganjil</option>
            <option value="genap">Genap</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
            Tahun Ajaran
          </span>
          <select
            value={tahunAjaran}
            onChange={(e) => setTahunAjaran(e.target.value)}
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
          >
            {generateTahunAjaran().map((ta) => (
              <option key={ta} value={ta}>
                {ta}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!selectedClassId ? (
        <div className="rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
          <ClipboardList className="mx-auto mb-1 h-6 w-6 text-black" />
          <p className="text-xs font-bold text-black">Pilih kelas untuk melihat rekap nilai.</p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
          <ClipboardList className="mx-auto mb-1 h-6 w-6 text-black" />
          <p className="text-xs font-bold text-black">
            Belum ada nilai diinput untuk kelas ini pada semester & tahun ajaran terpilih.
          </p>
        </div>
      ) : !selectedSubject ? (
        <div className="rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
          <ClipboardList className="mx-auto mb-1 h-6 w-6 text-black" />
          <p className="text-xs font-bold text-black">
            Pilih mata pelajaran untuk menampilkan rekap.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-black bg-white p-3">
              <p className="text-[10px] font-bold tracking-wider text-black uppercase">
                Rata-rata Kelas
              </p>
              <p className="mt-1 text-xl leading-tight font-bold text-black">{stats.avg}</p>
            </div>
            <div className="rounded-md border-2 border-emerald-600 bg-white p-3">
              <p className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                Tuntas (≥ {KONFIGURASI_PENILAIAN.kkm})
              </p>
              <p className="mt-1 text-xl leading-tight font-bold text-emerald-700">
                {stats.tuntas}
                <span className="text-xs font-bold text-black/60">
                  {' '}
                  / {rows.length} · {stats.pct}%
                </span>
              </p>
            </div>
            <div className="rounded-md border-2 border-rose-600 bg-white p-3">
              <p className="text-[10px] font-bold tracking-wider text-rose-700 uppercase">
                Belum Tuntas
              </p>
              <p className="mt-1 text-xl leading-tight font-bold text-rose-700">{stats.belum}</p>
            </div>
          </div>

          <section className="rounded-md border-2 border-black bg-white">
            <div className="flex flex-col justify-between gap-2 border-b-2 border-black p-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xs font-bold tracking-wider text-black uppercase">
                  Rekap Nilai {selectedSubject}
                </h2>
                <p className="mt-0.5 text-[10px] font-bold text-black/60">
                  {selectedClass?.name} · Semester {semester} {tahunAjaran} · {rows.length} siswa
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={rows.length === 0}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-blue-600 bg-blue-600 px-2.5 py-1 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-3 w-3" /> PDF
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={rows.length === 0}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-3 w-3" /> CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b-2 border-black bg-white">
                  <tr className="text-[10px] font-bold tracking-wider text-black uppercase">
                    <th className="px-3 py-2">No</th>
                    <th className="px-3 py-2">Nama Siswa</th>
                    <th className="px-3 py-2">NIS</th>
                    <th className="px-3 py-2 text-center">Tugas</th>
                    <th className="px-3 py-2 text-center">UTS</th>
                    <th className="px-3 py-2 text-center">UAS</th>
                    <th className="px-3 py-2 text-center">Akhir</th>
                    <th className="px-3 py-2 text-center">Pred</th>
                    <th className="px-3 py-2 text-center">Tuntas</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10">
                  {rows.map((r, idx) => (
                    <tr key={r.nis} className="hover:bg-neutral-100">
                      <td className="px-3 py-2 font-mono text-black/60">{idx + 1}</td>
                      <td className="px-3 py-2 font-bold text-black">{r.studentName}</td>
                      <td className="px-3 py-2 font-mono text-[10px] font-bold text-black">
                        {r.nis}
                      </td>
                      <td className="px-3 py-2 text-center font-mono text-black">{r.nilaiTugas}</td>
                      <td className="px-3 py-2 text-center font-mono text-black">{r.nilaiUTS}</td>
                      <td className="px-3 py-2 text-center font-mono text-black">{r.nilaiUAS}</td>
                      <td className="px-3 py-2 text-center font-mono font-bold text-black">
                        {r.nilaiAkhir}
                      </td>
                      <td className="px-3 py-2 text-center font-bold text-black">{r.predikat}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-block rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                            r.tuntas
                              ? 'border-emerald-600 bg-white text-emerald-700'
                              : 'border-rose-600 bg-white text-rose-700'
                          }`}
                        >
                          {r.tuntas ? 'TUNTAS' : 'BELUM'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
