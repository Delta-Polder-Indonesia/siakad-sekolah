/**
 * TAB DATA SEKOLAH — Ekspor, Impor & Reset data.
 *
 * Untuk setup sekolah baru (template universal):
 *   1. Ekspor data master sekolah lama (guru/siswa/kelas/roster) → file JSON
 *   2. Reset/kosongkan data demo
 *   3. Impor file hasil ekspor → data sekolah pembeli masuk dalam hitungan menit
 */
import { useState, type ChangeEvent } from 'react';
import { Download, Upload, Trash2, RotateCcw, Info, Database } from 'lucide-react';
import {
  exportMasterData,
  masterDataFilename,
  importMasterData,
  resetAllData,
  type ImportSummary,
} from '../../../data/store/core/dataTools';
import { useToast } from '../../../components/ui';

interface TabDataSekolahProps {
  setNotice?: (message: string) => void;
}

/** Unduh string sebagai file (helper lokal). */
function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function TabDataSekolah({ setNotice }: TabDataSekolahProps) {
  const { showToast } = useToast();
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [lastSummary, setLastSummary] = useState<ImportSummary | null>(null);

  const handleExport = () => {
    try {
      downloadTextFile(exportMasterData(), masterDataFilename());
      showToast('success', 'Data master berhasil diekspor.');
    } catch {
      showToast('error', 'Gagal mengekspor data.');
    }
  };

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setFileName(file.name);
    setLastSummary(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const summary = await importMasterData(String(reader.result ?? ''));
        setLastSummary(summary);
        showToast('success', `Impor berhasil: ${summary.teachers} guru, ${summary.students} siswa.`);
        setNotice?.('Data master berhasil diimpor.');
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : 'Gagal mengimpor file.');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async (mode: 'demo' | 'empty') => {
    const msg =
      mode === 'demo'
        ? 'Kembalikan SEMUA data ke contoh bawaan? Data yang Anda tambahkan akan hilang (identitas sekolah tetap aman).'
        : 'KOSONGKAN semua data (guru, siswa, kelas, nilai, dll)? Identitas sekolah tetap aman. Lanjutkan?';
    if (!window.confirm(msg)) return;
    setImporting(true);
    try {
      const result = await resetAllData(mode);
      showToast('success', result);
      setNotice?.(result);
      // Muat ulang agar seluruh aplikasi membaca state baru yang konsisten.
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      showToast('error', 'Gagal melakukan reset data.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 p-5">
      {/* Info */}
      <div className="flex items-start gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 p-3 text-[11px] leading-relaxed text-blue-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <b>Alur setup sekolah baru:</b> (1) Ekspor data master sekolah lama → (2) Kosongkan
          data → (3) Impor file tadi. Data guru, siswa, kelas & roster pindah dalam hitungan
          menit. <b>Identitas sekolah (nama/logo) tidak ikut ter-reset.</b>
        </p>
      </div>

      {/* Ekspor */}
      <section className="rounded-xl border-2 border-black bg-white p-4">
        <div className="mb-2 flex items-center gap-2">
          <Download className="h-4 w-4 text-black" />
          <h3 className="text-xs font-bold tracking-wide text-black uppercase">Ekspor Data Master</h3>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-neutral-600">
          Simpan data guru, siswa, kelas & roster ke file JSON. File ini bisa diimpor ke
          instalasi SIAKAD lain (sekolah baru) atau dijadikan cadangan.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-md border-2 border-black px-4 py-2 text-[11px] font-bold text-black transition-colors hover:bg-black hover:text-white"
        >
          <Download className="h-3.5 w-3.5" /> Ekspor Data Master (.json)
        </button>
      </section>

      {/* Impor */}
      <section className="rounded-xl border-2 border-black bg-white p-4">
        <div className="mb-2 flex items-center gap-2">
          <Upload className="h-4 w-4 text-black" />
          <h3 className="text-xs font-bold tracking-wide text-black uppercase">Impor Data Master</h3>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-neutral-600">
          Unggah file hasil ekspor. Data guru/siswa/kelas/roster akan <b>mengganti</b> data yang
          ada sekarang. Password polos otomatis di-hash. <b>Saran:</b> kosongkan data dulu
          sebelum impor agar bersih.
        </p>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-black bg-black px-4 py-2 text-[11px] font-bold text-white transition-colors hover:bg-neutral-800">
          <Upload className="h-3.5 w-3.5" />
          {importing ? 'Memproses...' : 'Pilih File JSON'}
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            disabled={importing}
            onChange={handleImportFile}
          />
        </label>
        {fileName && (
          <p className="mt-2 text-[10px] text-neutral-500">File dipilih: {fileName}</p>
        )}
        {lastSummary && (
          <div className="mt-3 rounded-lg border border-green-300 bg-green-50 p-3 text-[11px] text-green-900">
            <p className="font-bold">✅ Impor berhasil:</p>
            <ul className="mt-1 list-inside list-disc">
              <li>{lastSummary.teachers} guru</li>
              <li>{lastSummary.students} siswa</li>
              <li>{lastSummary.classes} kelas</li>
              <li>{lastSummary.classRosters} baris roster</li>
            </ul>
          </div>
        )}
      </section>

      {/* Reset */}
      <section className="rounded-xl border-2 border-red-200 bg-red-50/40 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Database className="h-4 w-4 text-red-700" />
          <h3 className="text-xs font-bold tracking-wide text-red-800 uppercase">
            Reset / Kosongkan Data
          </h3>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-red-800/80">
          Untuk menyiapkan instalasi baru. Kedua aksi <b>tidak bisa dibatalkan</b> — pastikan
          sudah mengekspor data bila masih dibutuhkan. Identitas sekolah (nama/logo) tetap aman.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleReset('demo')}
            disabled={importing}
            className="inline-flex items-center gap-1.5 rounded-md border-2 border-amber-600 px-4 py-2 text-[11px] font-bold text-amber-700 transition-colors hover:bg-amber-600 hover:text-white disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset ke Data Demo
          </button>
          <button
            type="button"
            onClick={() => handleReset('empty')}
            disabled={importing}
            className="inline-flex items-center gap-1.5 rounded-md border-2 border-red-600 px-4 py-2 text-[11px] font-bold text-red-700 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" /> Kosongkan Semua Data
          </button>
        </div>
      </section>
    </div>
  );
}
