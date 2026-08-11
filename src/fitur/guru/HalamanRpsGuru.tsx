import { useEffect, useMemo, useState, useCallback } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import type { RpsMeetingRow } from '../../data/services';
import { getRpsDocument, saveRpsDocument, createId } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { useToast } from '../../components/ui';

type HalamanRpsGuruProps = {
  teacherId: string;
  classId: string;
  className: string;
  subject: string;
  onBack: () => void;
  setNotice?: (msg: string) => void;
};

function createDefaultRows(): (RpsMeetingRow & { tanggal?: string })[] {
  return Array.from({ length: 10 }, (_, index) => ({
    pertemuan: String(index + 1),
    tanggal: '',
    kemampuanAkhir: '',
    materiPembelajaran: '',
    indikator: '',
    outputPembelajaran: '',
    strategiPembelajaran: '',
    bentukPembelajaran: 'Tatap muka di kelas',
    estimasiWaktu: '2 x 40 menit',
    bobotPenilaian: '',
  }));
}

function hasAnyContent(rows: (RpsMeetingRow & { tanggal?: string })[]): boolean {
  return rows.some(
    (r) =>
      r.kemampuanAkhir.trim() ||
      r.materiPembelajaran.trim() ||
      r.indikator.trim() ||
      r.outputPembelajaran.trim() ||
      r.strategiPembelajaran.trim()
  );
}

export default function HalamanRpsGuru({
  teacherId,
  classId,
  className,
  subject,
  onBack,
  setNotice,
}: HalamanRpsGuruProps) {
  const storeVersion = useStoreVersion();
  const { showToast } = useToast();
  const [tingkatPendidikan, setTingkatPendidikan] = useState('SMA / SMK');
  const [kurikulum, setKurikulum] = useState('Kurikulum Merdeka');
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [rows, setRows] = useState<(RpsMeetingRow & { tanggal?: string })[]>(createDefaultRows());
  const [docId, setDocId] = useState('');
  const [saving, setSaving] = useState(false);

  const existing = useMemo(
    () => getRpsDocument(teacherId, classId, subject),
    [teacherId, classId, subject, storeVersion]
  );

  useEffect(() => {
    if (!existing) {
      setDocId('');
      setRows(createDefaultRows());
      return;
    }
    setDocId(existing.id);
    setTingkatPendidikan(existing.programStudi || 'SMA / SMK');
    setKurikulum(existing.fakultas || 'Kurikulum Merdeka');
    setTahunAjaran(existing.sks || '2025/2026');
    setRows(existing.rows.length > 0 ? existing.rows : createDefaultRows());
  }, [existing]);

  const updateCell = (index: number, key: keyof RpsMeetingRow | 'tanggal', value: string) => {
    setRows((prev) =>
      prev.map((item, rowIndex) => (rowIndex === index ? { ...item, [key]: value } : item))
    );
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        pertemuan: String(prev.length + 1),
        tanggal: '',
        kemampuanAkhir: '',
        materiPembelajaran: '',
        indikator: '',
        outputPembelajaran: '',
        strategiPembelajaran: '',
        bentukPembelajaran: 'Tatap muka di kelas',
        estimasiWaktu: '2 x 40 menit',
        bobotPenilaian: '',
      },
    ]);
  };

  const handleRemoveRow = useCallback(() => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      if (!hasAnyContent([prev[prev.length - 1]])) {
        return prev.slice(0, -1);
      }
      if (!window.confirm(`Hapus baris pertemuan ${prev[prev.length - 1].pertemuan}?`)) {
        return prev;
      }
      return prev.slice(0, -1);
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!hasAnyContent(rows)) {
      showToast('error', 'Isi minimal satu kolom sebelum menyimpan.');
      return;
    }

    setSaving(true);
    saveRpsDocument({
      id: docId || createId(),
      teacherId,
      classId,
      className,
      subject,
      programStudi: tingkatPendidikan.trim() || '-',
      fakultas: kurikulum.trim() || '-',
      sks: tahunAjaran.trim() || '-',
      rows: rows as RpsMeetingRow[],
      updatedAt: Date.now(),
    });
    setSaving(false);

    const msg = `RPP/RPS ${subject} kelas ${className} berhasil disimpan.`;
    showToast('success', msg);
    setNotice?.(msg);
  }, [
    rows,
    docId,
    teacherId,
    classId,
    className,
    subject,
    tingkatPendidikan,
    kurikulum,
    tahunAjaran,
    showToast,
    setNotice,
  ]);

  const filledCount = rows.filter(
    (r) => r.kemampuanAkhir.trim() || r.materiPembelajaran.trim()
  ).length;

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── HEADER ── */}
      <div className="flex flex-col items-center justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-lg leading-none font-bold tracking-tight text-black uppercase">
            RPP / RPS
          </h2>
          <p className="mt-1 text-xs leading-none font-bold text-black">
            Rencana Pelaksanaan Pembelajaran
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 hover:text-black"
          >
            <Plus className="h-3.5 w-3.5" /> Baris
          </button>
          <button
            type="button"
            onClick={handleRemoveRow}
            className="inline-flex items-center gap-1 rounded-md border-2 border-rose-600 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Hapus
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-black disabled:opacity-60"
          >
            {saving ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Simpan
          </button>
        </div>
      </div>

      {/* ── METADATA ── */}
      <div className="rounded-md border-2 border-black bg-white p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <span className="w-28 text-[10px] font-bold tracking-wider text-black uppercase">
              Mata Pelajaran
            </span>
            <input
              value={subject}
              readOnly
              className="flex-1 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-28 text-[10px] font-bold tracking-wider text-black uppercase">
              Tingkat
            </span>
            <input
              value={tingkatPendidikan}
              onChange={(e) => setTingkatPendidikan(e.target.value)}
              placeholder="SD / SMP / SMA / SMK"
              className="flex-1 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-28 text-[10px] font-bold tracking-wider text-black uppercase">
              Kurikulum
            </span>
            <input
              value={kurikulum}
              onChange={(e) => setKurikulum(e.target.value)}
              placeholder="Kurikulum Merdeka / K13"
              className="flex-1 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-28 text-[10px] font-bold tracking-wider text-black uppercase">
              TA / Kelas
            </span>
            <div className="flex flex-1 gap-2">
              <input
                value={tahunAjaran}
                onChange={(e) => setTahunAjaran(e.target.value)}
                placeholder="2025/2026"
                className="w-24 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
              />
              <input
                value={className}
                readOnly
                className="flex-1 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 border-t-2 border-black/10 pt-3 text-[10px] font-bold text-black">
          <span>
            Total pertemuan: <strong className="text-black">{rows.length}</strong>
          </span>
          <span>
            Terisi: <strong className="text-black">{filledCount}</strong>
          </span>
          <span>
            Kosong: <strong className="text-black">{rows.length - filledCount}</strong>
          </span>
        </div>
      </div>

      {/* ── TABEL ── */}
      <div className="overflow-x-auto rounded-md border-2 border-black bg-white">
        <table className="w-full min-w-[1300px] table-fixed text-left text-xs">
          <thead className="border-b-2 border-black bg-white">
            <tr className="text-[10px] font-bold tracking-wider text-black uppercase">
              <th className="w-[44px] border-r-2 border-black/10 p-2 text-center">Pert.</th>
              <th className="w-[100px] border-r-2 border-black/10 p-2 text-center">Tanggal</th>
              <th className="w-[200px] border-r-2 border-black/10 p-2">TP / CP</th>
              <th className="w-[200px] border-r-2 border-black/10 p-2">Materi Pokok</th>
              <th className="w-[200px] border-r-2 border-black/10 p-2">Indikator (IKTP)</th>
              <th className="min-w-[200px] border-r-2 border-black/10 p-2">Kegiatan Siswa</th>
              <th className="min-w-[200px] border-r-2 border-black/10 p-2">Strategi Guru</th>
              <th className="w-[120px] border-r-2 border-black/10 p-2">Bentuk</th>
              <th className="w-[80px] border-r-2 border-black/10 p-2">Durasi</th>
              <th className="w-[120px] p-2">PR / Remedial</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10">
            {rows.map((row, index) => (
              <tr key={`${row.pertemuan}-${index}`} className="align-top hover:bg-neutral-100">
                <td className="border-r-2 border-black/10 bg-white p-1.5 text-center font-bold text-black">
                  <input
                    value={row.pertemuan}
                    onChange={(e) => updateCell(index, 'pertemuan', e.target.value)}
                    className="w-full bg-transparent text-center font-bold text-black focus:outline-none"
                  />
                </td>
                <td className="border-r-2 border-black/10 bg-white p-1.5 text-center">
                  <input
                    type="date"
                    value={row.tanggal || ''}
                    onChange={(e) => updateCell(index, 'tanggal', e.target.value)}
                    className="w-full rounded-md border-2 border-black bg-white px-1 py-0.5 text-center font-mono text-[10px] transition-colors focus:border-black focus:bg-neutral-50 focus:outline-none"
                  />
                </td>
                <td className="border-r-2 border-black/10 p-1.5 break-words whitespace-normal">
                  <textarea
                    value={row.kemampuanAkhir}
                    onChange={(e) => updateCell(index, 'kemampuanAkhir', e.target.value)}
                    rows={2}
                    className="h-auto min-h-[44px] w-full resize-y rounded-md border-2 border-black bg-white p-1.5 text-xs transition-colors focus:border-black focus:bg-neutral-50 focus:outline-none"
                  />
                </td>
                <td className="border-r-2 border-black/10 p-1.5 break-words whitespace-normal">
                  <textarea
                    value={row.materiPembelajaran}
                    onChange={(e) => updateCell(index, 'materiPembelajaran', e.target.value)}
                    rows={2}
                    className="h-auto min-h-[44px] w-full resize-y rounded-md border-2 border-black bg-white p-1.5 text-xs transition-colors focus:border-black focus:bg-neutral-50 focus:outline-none"
                  />
                </td>
                <td className="border-r-2 border-black/10 p-1.5 break-words whitespace-normal">
                  <textarea
                    value={row.indikator}
                    onChange={(e) => updateCell(index, 'indikator', e.target.value)}
                    rows={2}
                    className="h-auto min-h-[44px] w-full resize-y rounded-md border-2 border-black bg-white p-1.5 text-xs transition-colors focus:border-black focus:bg-neutral-50 focus:outline-none"
                  />
                </td>
                <td className="border-r-2 border-black/10 p-1.5">
                  <textarea
                    value={row.outputPembelajaran}
                    onChange={(e) => updateCell(index, 'outputPembelajaran', e.target.value)}
                    rows={2}
                    className="h-auto min-h-[44px] w-full resize rounded-md border-2 border-black bg-white p-1.5 text-xs transition-colors focus:border-black focus:bg-neutral-50 focus:outline-none"
                  />
                </td>
                <td className="border-r-2 border-black/10 p-1.5">
                  <textarea
                    value={row.strategiPembelajaran}
                    onChange={(e) => updateCell(index, 'strategiPembelajaran', e.target.value)}
                    rows={2}
                    className="h-auto min-h-[44px] w-full resize rounded-md border-2 border-black bg-white p-1.5 text-xs transition-colors focus:border-black focus:bg-neutral-50 focus:outline-none"
                  />
                </td>
                <td className="border-r-2 border-black/10 p-1.5">
                  <input
                    value={row.bentukPembelajaran}
                    onChange={(e) => updateCell(index, 'bentukPembelajaran', e.target.value)}
                    className="w-full rounded-md border-2 border-black bg-white px-1.5 py-1 text-xs transition-colors focus:border-black focus:bg-neutral-50 focus:outline-none"
                  />
                </td>
                <td className="border-r-2 border-black/10 p-1.5">
                  <input
                    value={row.estimasiWaktu}
                    onChange={(e) => updateCell(index, 'estimasiWaktu', e.target.value)}
                    className="w-full rounded-md border-2 border-black bg-white px-1.5 py-1 text-xs transition-colors focus:border-black focus:bg-neutral-50 focus:outline-none"
                  />
                </td>
                <td className="p-1.5">
                  <input
                    value={row.bobotPenilaian}
                    onChange={(e) => updateCell(index, 'bobotPenilaian', e.target.value)}
                    className="w-full rounded-md border-2 border-black bg-white px-1.5 py-1 text-xs transition-colors focus:border-black focus:bg-neutral-50 focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
