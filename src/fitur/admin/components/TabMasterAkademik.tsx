import { useMemo, useState } from 'react';
import { Plus, Trash2, Pencil, CheckCircle2, AlertCircle, HelpCircle, Star } from 'lucide-react';
import {
  getTahunAjaran,
  getMataPelajaran,
  addTahunAjaran,
  updateTahunAjaran,
  deleteTahunAjaran,
  setTahunAjaranAktif,
  addMataPelajaran,
  updateMataPelajaran,
  deleteMataPelajaran,
  createId,
} from '../../../data/services';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

export default function TabMasterAkademik({ setNotice }: { setNotice: (msg: string) => void }) {
  const storeVersion = useStoreVersion();
  const tahunAjaran = useMemo(() => getTahunAjaran(), [storeVersion]);
  const mataPelajaran = useMemo(() => getMataPelajaran(), [storeVersion]);

  const [localNotice, setLocalNotice] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: 'tahun' | 'mapel'; id: string } | null>(
    null
  );
  const [aktifTarget, setAktifTarget] = useState<string | null>(null);

  // ── Form Tahun Ajaran ──
  const [tahun, setTahun] = useState('');
  const [semester, setSemester] = useState<'ganjil' | 'genap'>('ganjil');
  const [jadikanAktif, setJadikanAktif] = useState(true);
  const [editTahunId, setEditTahunId] = useState<string | null>(null);
  const [editTahunValue, setEditTahunValue] = useState('');

  // ── Form Mata Pelajaran ──
  const [mapelNama, setMapelNama] = useState('');
  const [mapelKode, setMapelKode] = useState('');
  const [mapelKelompok, setMapelKelompok] = useState('');
  const [editMapelId, setEditMapelId] = useState<string | null>(null);
  const [editMapelNama, setEditMapelNama] = useState('');
  const [editMapelKode, setEditMapelKode] = useState('');
  const [editMapelKelompok, setEditMapelKelompok] = useState('');

  const simpanTahun = () => {
    if (!tahun.trim()) {
      setLocalNotice({ message: '⚠️ Isi tahun ajaran terlebih dahulu.', type: 'error' });
      return;
    }
    const id = createId();
    addTahunAjaran({
      id,
      tahun: tahun.trim(),
      semester,
      aktif: false,
      createdAt: Date.now(),
    });
    if (jadikanAktif) {
      setTahunAjaranAktif(id);
    }
    setTahun('');
    setSemester('ganjil');
    setJadikanAktif(true);
    setLocalNotice({ message: '✅ Tahun ajaran berhasil ditambahkan.', type: 'success' });
    setNotice('✅ Tahun ajaran berhasil ditambahkan.');
  };

  const simpanEditTahun = () => {
    if (!editTahunId || !editTahunValue.trim()) return;
    updateTahunAjaran(editTahunId, { tahun: editTahunValue.trim() });
    setEditTahunId(null);
    setEditTahunValue('');
    setLocalNotice({ message: '✅ Tahun ajaran diperbarui.', type: 'success' });
  };

  const jadikanAktifHandler = (id: string) => {
    setAktifTarget(id);
  };

  const confirmAktif = () => {
    if (aktifTarget) {
      setTahunAjaranAktif(aktifTarget);
      setLocalNotice({ message: '✅ Tahun ajaran dijadikan aktif.', type: 'success' });
      setAktifTarget(null);
    }
  };

  const simpanMapel = () => {
    if (!mapelNama.trim() || !mapelKode.trim()) {
      setLocalNotice({ message: '⚠️ Nama dan kode mata pelajaran wajib diisi.', type: 'error' });
      return;
    }
    addMataPelajaran({
      id: createId(),
      nama: mapelNama.trim(),
      kode: mapelKode.trim().toUpperCase(),
      kelompok: mapelKelompok.trim() || undefined,
      createdAt: Date.now(),
    });
    setMapelNama('');
    setMapelKode('');
    setMapelKelompok('');
    setLocalNotice({ message: '✅ Mata pelajaran berhasil ditambahkan.', type: 'success' });
    setNotice('✅ Mata pelajaran berhasil ditambahkan.');
  };

  const simpanEditMapel = () => {
    if (!editMapelId) return;
    if (!editMapelNama.trim() || !editMapelKode.trim()) {
      setLocalNotice({ message: '⚠️ Nama dan kode mata pelajaran wajib diisi.', type: 'error' });
      return;
    }
    updateMataPelajaran(editMapelId, {
      nama: editMapelNama.trim(),
      kode: editMapelKode.trim().toUpperCase(),
      kelompok: editMapelKelompok.trim() || undefined,
    });
    setEditMapelId(null);
    setEditMapelNama('');
    setEditMapelKode('');
    setEditMapelKelompok('');
    setLocalNotice({ message: '✅ Mata pelajaran diperbarui.', type: 'success' });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === 'tahun') {
      deleteTahunAjaran(deleteTarget.id);
      setLocalNotice({ message: '✅ Tahun ajaran dihapus.', type: 'success' });
    } else {
      deleteMataPelajaran(deleteTarget.id);
      setLocalNotice({ message: '✅ Mata pelajaran dihapus.', type: 'success' });
    }
    setNotice('✅ Data master akademik berhasil dihapus.');
    setDeleteTarget(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* ======== SUB-BAGIAN 1: TAHUN AJARAN ======== */}
      <div className="w-full space-y-4 bg-white p-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div>
            <h3 className="text-xs font-bold tracking-wide text-black uppercase">
              Master Tahun Ajaran & Semester
            </h3>
            <p className="mt-0.5 text-[10px] text-black">
              Kelola satu-satunya tahun ajaran aktif sebagai sumber pilihan di seluruh fitur.
            </p>
          </div>
        </div>

        {/* FORM TAMBAH TAHUN AJARAN */}
        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Tahun Ajaran
            </label>
            <input
              type="text"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              placeholder="2025/2026"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value as 'ganjil' | 'genap')}
              className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
            >
              <option value="ganjil">Ganjil</option>
              <option value="genap">Genap</option>
            </select>
          </div>
          <label className="flex h-full items-center gap-2 pb-1 text-[10px] font-bold text-black">
            <input
              type="checkbox"
              checked={jadikanAktif}
              onChange={(e) => setJadikanAktif(e.target.checked)}
              className="h-4 w-4 accent-black"
            />
            Jadikan Aktif
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={simpanTahun}
              className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:text-blue-600 sm:w-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Tahun Ajaran
            </button>
          </div>
        </div>

        {/* TABEL TAHUN AJARAN */}
        <div className="overflow-x-auto rounded-md border-2 border-black">
          <table className="w-full border-collapse bg-white text-left">
            <thead>
              <tr className="border-b-2 border-black text-[10px] font-bold tracking-wider text-black uppercase">
                <th className="border-r border-black p-3">Tahun Ajaran</th>
                <th className="w-[100px] border-r border-black p-3">Semester</th>
                <th className="w-[90px] border-r border-black p-3 text-center">Status</th>
                <th className="w-[220px] p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {tahunAjaran.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-neutral-100">
                  <td className="border-r-2 border-black/10 p-3 text-black">
                    {editTahunId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTahunValue}
                          onChange={(e) => setEditTahunValue(e.target.value)}
                          className="w-28 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black outline-none"
                        />
                        <button
                          type="button"
                          onClick={simpanEditTahun}
                          className="rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditTahunId(null)}
                          className="rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      item.tahun
                    )}
                  </td>
                  <td className="border-r-2 border-black/10 p-3 text-black">
                    {item.semester === 'ganjil' ? 'Ganjil' : 'Genap'}
                  </td>
                  <td className="border-r-2 border-black/10 p-3 text-center">
                    {item.aktif ? (
                      <span className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-black px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                        <Star className="h-3 w-3" /> Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] text-black/50">—</span>
                    )}
                  </td>
                  <td className="relative p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {aktifTarget === item.id && (
                        <div className="absolute right-0 bottom-full z-10 mb-2 w-60 space-y-2 rounded-md border-2 border-black bg-white p-2.5 text-right">
                          <div className="flex items-start gap-1.5 text-left">
                            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                            <p className="text-[10px] leading-tight font-bold text-black">
                              Jadikan tahun ajaran ini aktif? Tahun ajaran lain otomatis non-aktif.
                            </p>
                          </div>
                          <div className="flex justify-end gap-1.5 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setAktifTarget(null)}
                              className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={confirmAktif}
                              className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                            >
                              Ya, Aktifkan
                            </button>
                          </div>
                        </div>
                      )}
                      {deleteTarget?.kind === 'tahun' && deleteTarget.id === item.id && (
                        <div className="absolute right-0 bottom-full z-10 mb-2 w-56 space-y-2 rounded-md border-2 border-black bg-white p-2.5 text-right">
                          <div className="flex items-start gap-1.5 text-left">
                            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                            <p className="text-[10px] leading-tight font-bold text-black">
                              Yakin ingin menghapus tahun ajaran ini?
                            </p>
                          </div>
                          <div className="flex justify-end gap-1.5 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(null)}
                              className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={confirmDelete}
                              className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                            >
                              Ya, Hapus
                            </button>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setEditTahunId(item.id);
                          setEditTahunValue(item.tahun);
                        }}
                        className="shrink-0 rounded-md border-2 border-black bg-white p-1.5 text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                        title="Ubah Tahun Ajaran"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      {!item.aktif && (
                        <button
                          type="button"
                          onClick={() => jadikanAktifHandler(item.id)}
                          className="shrink-0 rounded-md border-2 border-black bg-white p-1.5 text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                          title="Jadikan Aktif"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ kind: 'tahun', id: item.id })}
                        className="shrink-0 rounded-md border-2 border-black bg-white p-1.5 text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                        title="Hapus Tahun Ajaran"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tahunAjaran.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <p className="text-[10px] font-bold tracking-widest text-black uppercase">
                      — Belum ada data tahun ajaran —
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======== SUB-BAGIAN 2: MATA PELAJARAN ======== */}
      <div className="w-full space-y-4 bg-white p-4">
        <div className="border-b-2 border-black pb-2">
          <h3 className="text-xs font-bold tracking-wide text-black uppercase">
            Master Mata Pelajaran
          </h3>
          <p className="mt-0.5 text-[10px] text-black">
            Satu sumber kebenaran daftar mata pelajaran untuk pilihan di seluruh fitur akademik.
          </p>
        </div>

        {/* FORM TAMBAH MAPEL */}
        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Nama Mata Pelajaran
            </label>
            <input
              type="text"
              value={mapelNama}
              onChange={(e) => setMapelNama(e.target.value)}
              placeholder="Matematika"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">Kode</label>
            <input
              type="text"
              value={mapelKode}
              onChange={(e) => setMapelKode(e.target.value)}
              placeholder="MTK"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Kelompok
            </label>
            <input
              type="text"
              value={mapelKelompok}
              onChange={(e) => setMapelKelompok(e.target.value)}
              placeholder="Wajib / Peminatan"
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={simpanMapel}
              className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:text-blue-600 sm:w-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Mapel
            </button>
          </div>
        </div>

        {/* TABEL MAPEL */}
        <div className="overflow-x-auto rounded-md border-2 border-black">
          <table className="w-full border-collapse bg-white text-left">
            <thead>
              <tr className="border-b-2 border-black text-[10px] font-bold tracking-wider text-black uppercase">
                <th className="border-r border-black p-3">Nama</th>
                <th className="w-[100px] border-r border-black p-3">Kode</th>
                <th className="w-[140px] border-r border-black p-3">Kelompok</th>
                <th className="w-[80px] p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {mataPelajaran.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-neutral-100">
                  <td className="border-r-2 border-black/10 p-3 text-black">
                    {editMapelId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editMapelNama}
                          onChange={(e) => setEditMapelNama(e.target.value)}
                          className="w-28 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black outline-none"
                        />
                        <input
                          type="text"
                          value={editMapelKode}
                          onChange={(e) => setEditMapelKode(e.target.value)}
                          className="w-16 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black outline-none"
                        />
                        <button
                          type="button"
                          onClick={simpanEditMapel}
                          className="rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMapelId(null)}
                          className="rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      item.nama
                    )}
                  </td>
                  <td className="border-r-2 border-black/10 p-3 font-mono text-black">
                    {item.kode}
                  </td>
                  <td className="border-r-2 border-black/10 p-3 text-black">
                    {item.kelompok || '-'}
                  </td>
                  <td className="relative p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {deleteTarget?.kind === 'mapel' && deleteTarget.id === item.id && (
                        <div className="absolute right-0 bottom-full z-10 mb-2 w-56 space-y-2 rounded-md border-2 border-black bg-white p-2.5 text-right">
                          <div className="flex items-start gap-1.5 text-left">
                            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                            <p className="text-[10px] leading-tight font-bold text-black">
                              Yakin ingin menghapus mata pelajaran ini?
                            </p>
                          </div>
                          <div className="flex justify-end gap-1.5 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(null)}
                              className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={confirmDelete}
                              className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                            >
                              Ya, Hapus
                            </button>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setEditMapelId(item.id);
                          setEditMapelNama(item.nama);
                          setEditMapelKode(item.kode);
                          setEditMapelKelompok(item.kelompok || '');
                        }}
                        className="shrink-0 rounded-md border-2 border-black bg-white p-1.5 text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                        title="Ubah Mata Pelajaran"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ kind: 'mapel', id: item.id })}
                        className="shrink-0 rounded-md border-2 border-black bg-white p-1.5 text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                        title="Hapus Mata Pelajaran"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {mataPelajaran.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <p className="text-[10px] font-bold tracking-widest text-black uppercase">
                      — Belum ada data mata pelajaran —
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTIFIKASI */}
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
  );
}
