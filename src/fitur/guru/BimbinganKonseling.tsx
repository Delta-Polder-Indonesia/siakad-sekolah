import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getStudents,
  getClasses,
  getCatatanBK,
  getCatatanBKByStudent,
  getTotalPoinBK,
  addCatatanBK,
  deleteCatatanBK,
  type CatatanBK,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { ShieldAlert, ShieldCheck, Plus, Trash2, Calendar } from 'lucide-react';
import { BarChart, DonutChart } from '../../components/ui';

const KATEGORI_SUGGESTIONS = [
  'Akademik',
  'Non-akademik',
  'Kedisiplinan',
  'Kerajinan',
  'Sikap',
  'Organisasi',
];

export default function BimbinganKonseling({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [jenis, setJenis] = useState<CatatanBK['jenis']>('pelanggaran');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [poin, setPoin] = useState('5');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [feedback, setFeedback] = useState('');

  const students = useMemo(() => getStudents(), [storeVersion]);
  const records = useMemo(() => getCatatanBK(), [storeVersion]);

  const studentName = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId)?.name || '-';
  }, [students, selectedStudentId]);

  const rekapPoin = useMemo(() => {
    return students
      .map((s) => ({ id: s.id, name: s.name, poin: getTotalPoinBK(s.id) }))
      .sort((a, b) => b.poin - a.poin);
  }, [students, storeVersion]);

  const komposisi = useMemo(() => {
    const pelanggaran = records.filter((r) => r.jenis === 'pelanggaran').length;
    const prestasi = records.filter((r) => r.jenis === 'prestasi').length;
    return { pelanggaran, prestasi, total: records.length };
  }, [records]);

  const handleSubmit = () => {
    if (!selectedStudentId || !deskripsi.trim() || !kategori.trim()) {
      setFeedback('Error: Siswa, kategori, dan deskripsi wajib diisi.');
      return;
    }
    const raw = Number(poin);
    if (!Number.isFinite(raw) || raw <= 0) {
      setFeedback('Error: Poin harus berupa angka lebih dari 0.');
      return;
    }
    const signed = jenis === 'pelanggaran' ? -Math.abs(raw) : Math.abs(raw);
    addCatatanBK({
      id: `bk_${Date.now()}`,
      studentId: selectedStudentId,
      jenis,
      kategori: kategori.trim(),
      deskripsi: deskripsi.trim(),
      poin: signed,
      tanggal,
      dicatatOleh: user?.name || user?.id || '-',
      createdAt: Date.now(),
    });
    setFeedback('Berhasil: Catatan BK berhasil disimpan.');
    setDeskripsi('');
    setKategori('');
    setPoin('5');
  };

  const handleDelete = (id: string) => {
    deleteCatatanBK(id);
    setFeedback('Berhasil: Catatan BK dihapus.');
  };

  const poinLabel = (p: number) => (p > 0 ? `+${p}` : `${p}`);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── HEADER ──────────────── */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
            <ShieldAlert className="h-7 w-7 stroke-[2] text-black" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Bimbingan Konseling
            </p>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black">
              Catatan Kedisiplinan & Prestasi Siswa
            </h1>
            <p className="mt-1 text-xs leading-none font-bold text-black">
              Poin pelanggaran bernilai negatif, poin prestasi bernilai positif.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:self-end">
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Total Catatan
            </p>
            <p className="text-xl leading-tight font-bold text-black">{komposisi.total}</p>
          </div>
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Prestasi
            </p>
            <p className="text-xl leading-tight font-bold text-black">{komposisi.prestasi}</p>
          </div>
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Pelanggaran
            </p>
            <p className="text-xl leading-tight font-bold text-black">{komposisi.pelanggaran}</p>
          </div>
        </div>
      </header>

      {/* ── GRID: FORM + REKAP ──────────────── */}
      <div className="grid items-start gap-4 lg:grid-cols-3">
        {/* FORM TAMBAH */}
        <section className="space-y-3 rounded-md border-2 border-black bg-white p-4">
          <h3 className="border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            Tambah Catatan Baru
          </h3>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
              Siswa
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-blue-600"
            >
              <option value="">— Pilih Siswa —</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.nis})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Jenis
              </label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value as CatatanBK['jenis'])}
                className="w-full rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-blue-600"
              >
                <option value="pelanggaran">Pelanggaran</option>
                <option value="prestasi">Prestasi</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Poin
              </label>
              <input
                type="number"
                min={1}
                value={poin}
                onChange={(e) => setPoin(e.target.value)}
                className="w-full rounded-md border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
              Kategori
            </label>
            <input
              type="text"
              value={kategori}
              list="bk-kategori"
              onChange={(e) => setKategori(e.target.value)}
              placeholder="Contoh: Kedisiplinan"
              className="w-full rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/50 focus:border-blue-600"
            />
            <datalist id="bk-kategori">
              {KATEGORI_SUGGESTIONS.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
              Deskripsi
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Uraikan kejadian/pencapaian secara singkat..."
              className="w-full resize-none rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs leading-relaxed font-bold text-black transition-colors outline-none placeholder:text-black/50 focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
              Tanggal Kejadian
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full rounded-md border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border-2 border-black bg-black px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-900"
          >
            <Plus className="h-3.5 w-3.5" />
            Simpan Catatan
          </button>

          {feedback && (
            <p
              className={`font-mono text-xs font-bold ${feedback.startsWith('Berhasil') ? 'text-blue-600' : 'text-black'}`}
            >
              {feedback}
            </p>
          )}

          <p className="border-t-2 border-black/10 pt-2 text-[10px] leading-snug font-bold text-black/60">
            Dicatat oleh: {user?.name || '-'} · Total poin {studentName}:{' '}
            {selectedStudentId ? poinLabel(getTotalPoinBK(selectedStudentId)) : '-'}
          </p>
        </section>

        {/* REKAP POIN PER SISWA */}
        <section className="space-y-3 rounded-md border-2 border-black bg-white p-4 lg:col-span-2">
          <h3 className="border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            Rekap Poin Per Siswa
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center">
              <DonutChart
                segments={[
                  { label: 'Prestasi', value: komposisi.prestasi, color: '#15803d' },
                  { label: 'Pelanggaran', value: komposisi.pelanggaran, color: '#b91c1c' },
                ]}
                centerLabel={`${komposisi.total}`}
                centerSubLabel="Catatan"
                size={140}
                strokeWidth={20}
              />
              <div className="mt-2 flex gap-4 text-xs font-bold text-black">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm border border-black bg-green-700" />
                  Prestasi: {komposisi.prestasi}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm border border-black bg-red-700" />
                  Pelanggaran: {komposisi.pelanggaran}
                </span>
              </div>
            </div>

            <div>
              {rekapPoin.length > 0 ? (
                <BarChart
                  data={rekapPoin.map((s) => ({
                    label: s.name.split(' ')[0],
                    value: s.poin,
                    color: s.poin >= 0 ? '#15803d' : '#b91c1c',
                  }))}
                  height={160}
                  maxBarWidth={40}
                  showValues={true}
                />
              ) : (
                <div className="flex h-[160px] items-center justify-center rounded-md border-2 border-dashed border-black bg-white text-xs font-bold text-black">
                  Belum ada data siswa
                </div>
              )}
              <div className="mt-2 border-t-2 border-black/10 pt-2 text-[10px] font-bold text-black/60">
                Nilai negatif = total pelanggaran, positif = total prestasi. Nominal berdasarkan
                konvensi poin BK.
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── TABEL DAFTAR CATATAN ──────────────── */}
      <div className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex items-center justify-between gap-2 border-b-2 border-black bg-white p-3">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
            <ShieldCheck className="h-4 w-4 text-black" />
            Daftar Catatan BK
          </h3>
          <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
            {records.length} Catatan
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-black bg-white">
              <tr className="text-xs font-bold tracking-wider text-black uppercase">
                <th className="px-3 py-2">Tanggal</th>
                <th className="px-3 py-2">Siswa</th>
                <th className="px-3 py-2 text-center">Jenis</th>
                <th className="px-3 py-2">Kategori</th>
                <th className="px-3 py-2">Deskripsi</th>
                <th className="px-3 py-2 text-center">Poin</th>
                <th className="px-3 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {records.length > 0 ? (
                records.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-neutral-100">
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-1.5 font-mono text-black">
                        <Calendar className="h-3 w-3 text-black" />
                        {r.tanggal}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-black">
                      {students.find((s) => s.id === r.studentId)?.name || r.studentId}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-block rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                          r.jenis === 'prestasi'
                            ? 'border-black bg-green-700 text-white'
                            : 'border-black bg-red-700 text-white'
                        }`}
                      >
                        {r.jenis === 'prestasi' ? 'Prestasi' : 'Pelanggaran'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-black">{r.kategori}</td>
                    <td className="max-w-[260px] px-3 py-2.5 text-black/70">{r.deskripsi}</td>
                    <td
                      className={`px-3 py-2.5 text-center font-mono font-bold ${r.poin > 0 ? 'text-green-700' : 'text-red-700'}`}
                    >
                      {poinLabel(r.poin)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:bg-neutral-100"
                        title="Hapus catatan"
                      >
                        <Trash2 className="h-3 w-3" />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-xs font-bold text-black">
                    Belum ada catatan BK. Gunakan form di atas untuk menambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNavigate?.('dashboard')}
        className="rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}
