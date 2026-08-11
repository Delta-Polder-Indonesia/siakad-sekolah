import { useState, useMemo, ChangeEvent } from 'react';
import { Save, Trash2, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import {
  addPengumumanAdmin,
  deletePengumumanAdmin,
  getPengumumanAdmin,
  getClasses,
} from '../../../data/services';
import { PengumumanAdmin } from '../../../types';
import { kompresGambarFile } from '../../../utils/gambar';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

interface TabPengumumanAdminProps {
  scope: 'teacher' | 'student';
}

export default function TabPengumumanAdmin({ scope }: TabPengumumanAdminProps) {
  const storeVersion = useStoreVersion();
  const classes = useMemo(() => getClasses(), [storeVersion]);
  const pengumumanAdminList = useMemo(() => getPengumumanAdmin(), [storeVersion]);

  const [judulPengumumanAdmin, setJudulPengumumanAdmin] = useState('');
  const [isiPengumumanAdmin, setIsiPengumumanAdmin] = useState('');
  const [targetPengumumanAdmin, setTargetPengumumanAdmin] = useState<'all' | 'classes'>('all');
  const [targetKelasPengumumanAdmin, setTargetKelasPengumumanAdmin] = useState<string[]>([]);
  const [fotoPengumumanDataUrl, setFotoPengumumanDataUrl] = useState<string | undefined>();
  const [fotoPengumumanNama, setFotoPengumumanNama] = useState<string>('');

  // State untuk notifikasi satu baris & konfirmasi kustom
  const [localNotice, setLocalNotice] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePilihFotoPengumuman = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLocalNotice({ message: '⚠️ File pengumuman harus berupa gambar.', type: 'error' });
      event.target.value = '';
      return;
    }
    kompresGambarFile(file, 980, 0.74, 1_050_000)
      .then((dataUrl) => {
        if (dataUrl.length > 1_200_000) {
          setLocalNotice({
            message: '⚠️ Ukuran foto terlalu besar. Gunakan resolusi lebih kecil.',
            type: 'error',
          });
          return;
        }
        setFotoPengumumanDataUrl(dataUrl);
        setFotoPengumumanNama(file.name);
        setLocalNotice({ message: '✅ Foto pengumuman berhasil dipilih.', type: 'success' });
      })
      .catch(() =>
        setLocalNotice({ message: '⚠️ Gagal memproses foto. Coba file lain.', type: 'error' })
      )
      .finally(() => {
        event.target.value = '';
      });
  };

  // Validasi awal sebelum memunculkan pop-up konfirmasi kustom
  const preCheckValidation = () => {
    const title = judulPengumumanAdmin.trim();
    const message = isiPengumumanAdmin.trim();
    if (!title || !message) {
      setLocalNotice({ message: '⚠️ Judul dan isi pengumuman wajib diisi.', type: 'error' });
      return;
    }
    if (targetPengumumanAdmin === 'classes' && targetKelasPengumumanAdmin.length === 0) {
      setLocalNotice({ message: '⚠️ Pilih minimal satu kelas tujuan pengumuman.', type: 'error' });
      return;
    }

    setLocalNotice(null);
    setShowConfirm(true);
  };

  // Eksekusi final simpan data pengumuman
  const handleExecuteSimpan = () => {
    const title = judulPengumumanAdmin.trim();
    const message = isiPengumumanAdmin.trim();

    const newAnnouncement: PengumumanAdmin = {
      id: `adm_ann_${Date.now()}`,
      title,
      message,
      targetScope: targetPengumumanAdmin,
      targetClassIds: targetPengumumanAdmin === 'classes' ? targetKelasPengumumanAdmin : [],
      imageDataUrl: fotoPengumumanDataUrl,
      imageName: fotoPengumumanNama || undefined,
      createdAt: Date.now(),
      createdBy: scope,
    };

    const saved = addPengumumanAdmin(newAnnouncement);
    if (!saved) {
      setLocalNotice({
        message: '⚠️ Gagal menyimpan. Penyimpanan penuh, hapus data lama.',
        type: 'error',
      });
      setShowConfirm(false);
      return;
    }

    setJudulPengumumanAdmin('');
    setIsiPengumumanAdmin('');
    setTargetPengumumanAdmin('all');
    setTargetKelasPengumumanAdmin([]);
    setFotoPengumumanDataUrl(undefined);
    setFotoPengumumanNama('');
    setLocalNotice({ message: '✅ Pengumuman berhasil dipublikasikan.', type: 'success' });
    setShowConfirm(false);
  };

  const toggleTargetKelasPengumuman = (classId: string) => {
    setTargetKelasPengumumanAdmin((prev) =>
      prev.includes(classId) ? prev.filter((item) => item !== classId) : [...prev, classId]
    );
  };

  return (
    <div className="w-full space-y-4 rounded-md border-2 border-black bg-white p-4">
      {/* TWO-COLUMN LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* KOLOM KIRI — FORM INPUT */}
        <div className="space-y-4">
          {/* STRIP HEADER */}
          <div className="border-b-2 border-black pb-2">
            <h3 className="text-xs font-bold tracking-wide text-black uppercase">
              Pengumuman Admin Sekolah
            </h3>
            <p className="mt-0.5 text-[10px] font-semibold text-neutral-900">
              Dapat ditujukan ke semua kelas atau kelas tertentu. Mendukung teks dan foto.
            </p>
          </div>

          {/* JUDUL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Judul Pengumuman
            </label>
            <input
              value={judulPengumumanAdmin}
              onChange={(e) => {
                setJudulPengumumanAdmin(e.target.value);
                setLocalNotice(null);
                setShowConfirm(false);
              }}
              placeholder="Judul pengumuman"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>

          {/* ISI */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Isi Pengumuman
            </label>
            <textarea
              value={isiPengumumanAdmin}
              onChange={(e) => {
                setIsiPengumumanAdmin(e.target.value);
                setLocalNotice(null);
                setShowConfirm(false);
              }}
              placeholder="Isi pengumuman"
              rows={4}
              className="w-full resize-none rounded-md border-2 border-black bg-white px-2.5 py-2 text-xs leading-relaxed font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>

          {/* TARGET SCOPE */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Tujuan Pengumuman
            </label>
            <select
              value={targetPengumumanAdmin}
              onChange={(e) => {
                const nextValue = e.target.value as 'all' | 'classes';
                setTargetPengumumanAdmin(nextValue);
                setLocalNotice(null);
                setShowConfirm(false);
                if (nextValue === 'all') setTargetKelasPengumumanAdmin([]);
              }}
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
            >
              <option value="all">Semua Kelas (Global)</option>
              <option value="classes">Kelas Tertentu</option>
            </select>
          </div>

          {/* CHECKBOX KELAS */}
          {targetPengumumanAdmin === 'classes' && (
            <div className="space-y-2 rounded-md border-2 border-black bg-white p-3">
              <p className="text-[10px] font-bold tracking-wide text-black uppercase">
                Pilih Kelas Tujuan
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
                {classes.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-2 text-xs font-bold text-black select-none hover:text-blue-600"
                  >
                    <input
                      type="checkbox"
                      checked={targetKelasPengumumanAdmin.includes(item.id)}
                      onChange={() => {
                        toggleTargetKelasPengumuman(item.id);
                        setLocalNotice(null);
                        setShowConfirm(false);
                      }}
                      className="h-3.5 w-3.5 rounded border-black accent-black transition-colors"
                    />
                    <span>
                      {item.name} <span className="font-mono text-[10px]">({item.grade})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* FOTO PENGUMUMAN */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Foto Pengumuman <span className="font-normal normal-case">— opsional</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePilihFotoPengumuman}
              className="block w-full text-[10px] font-bold text-black file:mr-2 file:cursor-pointer file:rounded-md file:border-2 file:border-black file:bg-white file:px-3 file:py-1 file:text-[10px] file:font-bold file:text-black file:transition-colors file:hover:border-blue-600 file:hover:text-blue-600"
            />
            <p className="text-[10px] font-semibold text-neutral-900">
              Foto akan tampil di dasbor kelas tujuan pengumuman.
            </p>
          </div>

          {/* PREVIEW FOTO */}
          {fotoPengumumanDataUrl && (
            <div className="rounded-md border-2 border-black bg-white p-2">
              <img
                src={fotoPengumumanDataUrl}
                alt={fotoPengumumanNama || 'Preview foto pengumuman'}
                className="max-h-44 w-full rounded-md border-2 border-black/10 object-cover"  loading="lazy" decoding="async" />
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="truncate font-mono text-[10px] font-bold text-black">
                  {fotoPengumumanNama || 'Foto terpilih'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFotoPengumumanDataUrl(undefined);
                    setFotoPengumumanNama('');
                    setLocalNotice(null);
                    setShowConfirm(false);
                  }}
                  className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                >
                  Hapus Foto
                </button>
              </div>
            </div>
          )}

          {/* BAR BAWAH: NOTIFIKASI & AREA TOMBOL DENGAN POPUP KONFIRMASI */}
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
                      Yakin ingin mempublikasikan pengumuman ini sekarang?
                    </p>
                  </div>
                  <div className="flex justify-end gap-1.5 text-[10px]">
                    <button type="button"
                      onClick={() => setShowConfirm(false)}
                      className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                    >
                      Batal
                    </button>
                    <button type="button"
                      onClick={handleExecuteSimpan}
                      className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                    >
                      Ya, Publikasikan
                    </button>
                  </div>
                </div>
              )}

              {/* TOMBOL UTAMA */}
              <button type="button"
                onClick={preCheckValidation}
                className={`inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black bg-white px-5 py-2 text-xs font-bold text-black transition-colors sm:w-auto ${
                  showConfirm
                    ? 'cursor-not-allowed bg-neutral-100 opacity-60'
                    : 'hover:border-blue-600 hover:text-blue-600'
                }`}
                disabled={showConfirm}
              >
                <Save className="h-3.5 w-3.5" />
                Publikasikan Pengumuman
              </button>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN — RIWAYAT PENGUMUMAN */}
        <div className="space-y-3 lg:border-l-2 lg:border-black/10 lg:pl-4">
          <div className="border-b-2 border-black pb-2">
            <p className="text-xs font-bold tracking-wide text-black uppercase">
              Riwayat Pengumuman <span className="font-mono">({pengumumanAdminList.length})</span>
            </p>
          </div>

          {/* SCROLL CONTAINER */}
          <div className="scrollbar-thin max-h-[540px] space-y-2.5 overflow-y-auto pr-1">
            {pengumumanAdminList.map((item) => (
              <article
                key={item.id}
                className="rounded-md border-2 border-black bg-white p-3 transition-colors hover:bg-neutral-100"
              >
                {/* Header artikel */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="truncate text-xs font-bold text-black">{item.title}</h4>
                    <p className="font-mono text-[10px] font-semibold text-black">
                      {new Date(item.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button type="button"
                    onClick={() => {
                      if (window.confirm('Hapus pengumuman ini?')) {
                        deletePengumumanAdmin(item.id);
                        setLocalNotice({
                          message: '✅ Pengumuman berhasil dihapus.',
                          type: 'success',
                        });
                      }
                    }}
                    className="shrink-0 rounded-md border-2 border-black bg-white p-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                    title="Hapus pengumuman"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Target kelas */}
                <div className="mt-1.5 flex items-center">
                  <span className="rounded-md border-2 border-black bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-black">
                    {item.targetScope === 'classes' ? 'Kelas Spesifik' : 'Semua Kelas'}
                  </span>
                  {item.targetScope === 'classes' && (
                    <p className="ml-1.5 truncate text-[10px] font-bold text-black">
                      {(item.targetClassIds || [])
                        .map((classId) => classes.find((c) => c.id === classId)?.name || classId)
                        .join(', ')}
                    </p>
                  )}
                </div>

                {/* Isi pesan */}
                <p className="mt-2 border-t-2 border-black/10 pt-2 text-xs leading-relaxed font-bold whitespace-pre-line text-black">
                  {item.message}
                </p>

                {/* Gambar lampiran */}
                {item.imageDataUrl && (
                  <img
                    src={item.imageDataUrl}
                    alt={item.imageName || item.title}
                    className="mt-2.5 h-auto max-h-32 w-full rounded-md border-2 border-black object-contain"  loading="lazy" decoding="async" />
                )}
              </article>
            ))}

            {pengumumanAdminList.length === 0 && (
              <div className="rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
                <p className="text-[10px] font-bold tracking-widest text-black uppercase">
                  — Belum ada pengumuman —
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
