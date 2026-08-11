import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getStudents,
  getEkskul,
  addEkskul,
  updateEkskul,
  deleteEkskul,
  getEkskulMembersByEkskul,
  getAktifMemberCount,
  daftarEkskul,
  keluarEkskul,
  getEkskulKehadiran,
  addEkskulKehadiran,
  type Ekskul,
  type EkskulKehadiran,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  UserMinus,
  Calendar,
  Check,
} from 'lucide-react';
import { BarChart } from '../../components/ui';

const STATUS_LABEL: Record<EkskulKehadiran['status'], string> = {
  hadir: 'Hadir',
  izin: 'Izin',
  alpha: 'Alpha',
};

export default function ManajemenEkskul({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();

  // ── State form CRUD ekskul ──
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('');
  const [pembina, setPembina] = useState('');
  const [hari, setHari] = useState('');
  const [jam, setJam] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [kuota, setKuota] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [feedback, setFeedback] = useState('');

  // ── State panel anggota ──
  const [kelolaEkskulId, setKelolaEkskulId] = useState('');
  const [siswaBaru, setSiswaBaru] = useState('');
  const [feedbackAnggota, setFeedbackAnggota] = useState('');

  // ── State panel absensi ──
  const [absenEkskulId, setAbsenEkskulId] = useState('');
  const [tanggalAbsen, setTanggalAbsen] = useState(new Date().toISOString().split('T')[0]);
  const [statusMap, setStatusMap] = useState<Record<string, EkskulKehadiran['status']>>({});
  const [feedbackAbsen, setFeedbackAbsen] = useState('');

  const students = useMemo(() => getStudents(), [storeVersion]);
  const ekskulList = useMemo(() => getEkskul(), [storeVersion]);

  const studentName = (id: string) => students.find((s) => s.id === id)?.name || id;

  // ── Rekap anggota ──
  const rekapAnggota = useMemo(
    () =>
      ekskulList.map((e) => ({
        label: e.nama.split(' ')[0],
        value: getAktifMemberCount(e.id),
        color: '#1e3a8a',
      })),
    [ekskulList, storeVersion]
  );

  const totalAnggota = useMemo(
    () => ekskulList.reduce((acc, e) => acc + getAktifMemberCount(e.id), 0),
    [ekskulList, storeVersion]
  );

  // ── Reset status absensi saat ekskul/tanggal berubah ──
  useEffect(() => {
    const records = getEkskulKehadiran(absenEkskulId).filter((k) => k.tanggal === tanggalAbsen);
    const map: Record<string, EkskulKehadiran['status']> = {};
    records.forEach((r) => {
      map[r.studentId] = r.status;
    });
    setStatusMap(map);
  }, [absenEkskulId, tanggalAbsen, storeVersion]);

  const membersKelola = useMemo(
    () =>
      kelolaEkskulId
        ? getEkskulMembersByEkskul(kelolaEkskulId).filter((m) => m.status === 'aktif')
        : [],
    [kelolaEkskulId, storeVersion]
  );

  const membersAbsen = useMemo(
    () =>
      absenEkskulId
        ? getEkskulMembersByEkskul(absenEkskulId).filter((m) => m.status === 'aktif')
        : [],
    [absenEkskulId, storeVersion]
  );

  const selectedEkskul = ekskulList.find((e) => e.id === kelolaEkskulId);

  const resetForm = () => {
    setEditingId(null);
    setNama('');
    setKategori('');
    setPembina('');
    setHari('');
    setJam('');
    setLokasi('');
    setKuota('');
    setDeskripsi('');
  };

  const handleSubmit = () => {
    if (!nama.trim() || !kategori.trim() || !pembina.trim() || !hari.trim() || !jam.trim()) {
      setFeedback('Error: Nama, kategori, pembina, hari, dan jam wajib diisi.');
      return;
    }
    const kuotaNum = kuota.trim() === '' ? undefined : Number(kuota);
    if (kuota.trim() !== '' && (!Number.isFinite(kuotaNum) || (kuotaNum as number) <= 0)) {
      setFeedback('Error: Kuota harus berupa angka lebih dari 0 (atau kosongkan).');
      return;
    }
    const payload = {
      nama: nama.trim(),
      kategori: kategori.trim(),
      pembina: pembina.trim(),
      hari: hari.trim(),
      jam: jam.trim(),
      lokasi: lokasi.trim(),
      kuota: kuotaNum,
      deskripsi: deskripsi.trim(),
    };
    if (editingId) {
      updateEkskul(editingId, payload);
      setFeedback('Berhasil: Data ekskul diperbarui.');
    } else {
      addEkskul({
        id: `eks_${Date.now()}`,
        ...payload,
        createdAt: Date.now(),
      } as Ekskul);
      setFeedback('Berhasil: Ekskul baru ditambahkan.');
    }
    resetForm();
  };

  const handleEdit = (e: Ekskul) => {
    setEditingId(e.id);
    setNama(e.nama);
    setKategori(e.kategori);
    setPembina(e.pembina);
    setHari(e.hari);
    setJam(e.jam);
    setLokasi(e.lokasi || '');
    setKuota(e.kuota !== undefined ? String(e.kuota) : '');
    setDeskripsi(e.deskripsi || '');
    setFeedback('');
  };

  const handleDelete = (id: string) => {
    deleteEkskul(id);
    setFeedback('Berhasil: Ekskul dan seluruh datanya dihapus.');
    if (kelolaEkskulId === id) setKelolaEkskulId('');
    if (absenEkskulId === id) setAbsenEkskulId('');
  };

  const handleTambahAnggota = () => {
    if (!kelolaEkskulId || !siswaBaru) {
      setFeedbackAnggota('Error: Pilih ekskul dan siswa terlebih dahulu.');
      return;
    }
    const ok = daftarEkskul(siswaBaru, kelolaEkskulId);
    if (ok) {
      setFeedbackAnggota('Berhasil: Siswa ditambahkan ke ekskul.');
      setSiswaBaru('');
    } else {
      setFeedbackAnggota('Error: Gagal menambah (kuota penuh atau sudah terdaftar).');
    }
  };

  const handleKeluarAnggota = (studentId: string) => {
    keluarEkskul(studentId, kelolaEkskulId);
    setFeedbackAnggota('Berhasil: Siswa dikeluarkan dari ekskul.');
  };

  const handleSaveKehadiran = () => {
    if (!absenEkskulId || !tanggalAbsen) {
      setFeedbackAbsen('Error: Pilih ekskul dan tanggal pertemuan.');
      return;
    }
    if (membersAbsen.length === 0) {
      setFeedbackAbsen('Error: Ekskul ini belum punya anggota aktif.');
      return;
    }
    membersAbsen.forEach((m) => {
      addEkskulKehadiran({
        id: `ekskul_hadir_${Date.now()}_${m.studentId}`,
        ekskulId: absenEkskulId,
        studentId: m.studentId,
        tanggal: tanggalAbsen,
        status: statusMap[m.studentId] || 'hadir',
        createdAt: Date.now(),
      });
    });
    setFeedbackAbsen('Berhasil: Kehadiran pertemuan ekskul disimpan.');
  };

  const inputCls =
    'w-full rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/50 focus:border-black';

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── HEADER ──────────────── */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
            <Trophy className="h-7 w-7 stroke-[2] text-black" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Manajemen Ekstrakurikuler
            </p>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black">
              Kelola Ekskul, Anggota & Absensi
            </h1>
            <p className="mt-1 text-xs leading-none font-bold text-black">
              Master data ekskul, pendaftaran siswa, dan pencatatan kehadiran pertemuan.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:self-end">
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">Ekskul</p>
            <p className="text-xl leading-tight font-bold text-black">{ekskulList.length}</p>
          </div>
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Anggota Aktif
            </p>
            <p className="text-xl leading-tight font-bold text-black">{totalAnggota}</p>
          </div>
        </div>
      </header>

      {/* ── GRID: FORM + REKAP ──────────────── */}
      <div className="grid items-start gap-4 lg:grid-cols-3">
        <section className="space-y-3 rounded-md border-2 border-black bg-white p-4">
          <h3 className="border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            {editingId ? 'Ubah Ekskul' : 'Tambah Ekskul'}
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Nama Ekskul
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className={inputCls}
                placeholder="Contoh: Basket"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Kategori
              </label>
              <input
                type="text"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className={inputCls}
                placeholder="Contoh: Olahraga"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Pembina
              </label>
              <input
                type="text"
                value={pembina}
                onChange={(e) => setPembina(e.target.value)}
                className={inputCls}
                placeholder="Nama pembina/guru"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Hari
              </label>
              <input
                type="text"
                value={hari}
                onChange={(e) => setHari(e.target.value)}
                className={inputCls}
                placeholder="Contoh: Senin & Kamis"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Jam
              </label>
              <input
                type="text"
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                className={inputCls}
                placeholder="Contoh: 15.00 - 17.00"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Lokasi
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className={inputCls}
                placeholder="Opsional"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Kuota
              </label>
              <input
                type="number"
                min={1}
                value={kuota}
                onChange={(e) => setKuota(e.target.value)}
                className={inputCls}
                placeholder="Opsional"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
              Deskripsi
            </label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className={`${inputCls} resize-none`}
              placeholder="Deskripsi singkat kegiatan (opsional)"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border-2 border-black bg-black px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-900"
            >
              <Plus className="h-3.5 w-3.5" />
              {editingId ? 'Simpan Perubahan' : 'Tambah Ekskul'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold tracking-wider text-black uppercase transition-colors hover:bg-neutral-100"
              >
                Batal
              </button>
            )}
          </div>

          {feedback && (
            <p
              className={`font-mono text-xs font-bold ${feedback.startsWith('Berhasil') ? 'text-black' : 'text-black'}`}
            >
              {feedback}
            </p>
          )}
        </section>

        {/* REKAP ANGGOTA */}
        <section className="space-y-3 rounded-md border-2 border-black bg-white p-4 lg:col-span-2">
          <h3 className="border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            Rekap Anggota Per Ekskul
          </h3>
          <div>
            {rekapAnggota.length > 0 ? (
              <BarChart data={rekapAnggota} height={160} maxBarWidth={40} showValues={true} />
            ) : (
              <div className="flex h-[160px] items-center justify-center rounded-md border-2 border-dashed border-black bg-white text-xs font-bold text-black">
                Belum ada ekskul
              </div>
            )}
            <div className="mt-2 border-t-2 border-black/10 pt-2 text-[10px] font-bold text-black/60">
              Jumlah anggota berstatus aktif per ekskul. Kuota dibatasi lewat form ekskul.
            </div>
          </div>
        </section>
      </div>

      {/* ── DAFTAR EKSKUL ──────────────── */}
      <div className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex items-center justify-between gap-2 border-b-2 border-black bg-white p-3">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
            <Trophy className="h-4 w-4 text-black" />
            Daftar Ekskul
          </h3>
          <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
            {ekskulList.length} Ekskul
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-black bg-white">
              <tr className="text-xs font-bold tracking-wider text-black uppercase">
                <th className="px-3 py-2">Nama</th>
                <th className="px-3 py-2">Kategori</th>
                <th className="px-3 py-2">Pembina</th>
                <th className="px-3 py-2">Jadwal</th>
                <th className="px-3 py-2 text-center">Kuota</th>
                <th className="px-3 py-2 text-center">Anggota</th>
                <th className="px-3 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {ekskulList.length > 0 ? (
                ekskulList.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-neutral-100">
                    <td className="px-3 py-2.5">{e.nama}</td>
                    <td className="px-3 py-2.5 text-black/70">{e.kategori}</td>
                    <td className="px-3 py-2.5 text-black/70">{e.pembina}</td>
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-1.5 font-mono text-black">
                        <Calendar className="h-3 w-3 text-black" />
                        {e.hari} · {e.jam}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono">{e.kuota ?? '-'}</td>
                    <td className="px-3 py-2.5 text-center font-mono">
                      {getAktifMemberCount(e.id)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(e)}
                          className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:bg-neutral-100"
                          title="Ubah ekskul"
                        >
                          <Pencil className="h-3 w-3" />
                          Ubah
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(e.id)}
                          className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:bg-neutral-100"
                          title="Hapus ekskul"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-xs font-bold text-black">
                    Belum ada ekskul. Gunakan form di atas untuk menambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── KELOLA ANGGOTA + ABSENSI ──────────────── */}
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {/* PANEL ANGGOTA */}
        <section className="space-y-3 rounded-md border-2 border-black bg-white p-4">
          <h3 className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            <Users className="h-4 w-4 text-black" />
            Kelola Anggota
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Ekskul
              </label>
              <select
                value={kelolaEkskulId}
                onChange={(e) => setKelolaEkskulId(e.target.value)}
                className={inputCls}
              >
                <option value="">— Pilih Ekskul —</option>
                {ekskulList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Tambah Siswa
              </label>
              <div className="flex gap-1.5">
                <select
                  value={siswaBaru}
                  onChange={(e) => setSiswaBaru(e.target.value)}
                  className={inputCls}
                >
                  <option value="">— Pilih Siswa —</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nis})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleTambahAnggota}
                  className="shrink-0 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:bg-neutral-100"
                  title="Tambahkan siswa"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {feedbackAnggota && (
            <p
              className={`font-mono text-xs font-bold ${feedbackAnggota.startsWith('Berhasil') ? 'text-black' : 'text-black'}`}
            >
              {feedbackAnggota}
            </p>
          )}

          <div className="scrollbar-thin max-h-[280px] space-y-2 overflow-y-auto border-t-2 border-black/10 pt-3">
            {kelolaEkskulId && selectedEkskul ? (
              membersKelola.length > 0 ? (
                membersKelola.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-2 rounded-md border-2 border-black bg-white px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-black">{studentName(m.studentId)}</p>
                      <p className="font-mono text-[10px] font-bold text-black/50">
                        {new Date(m.joinedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleKeluarAnggota(m.studentId)}
                      className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:bg-neutral-100"
                    >
                      <UserMinus className="h-3 w-3" />
                      Keluarkan
                    </button>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-xs font-bold text-black">
                  Belum ada anggota. Tambahkan siswa di atas.
                </p>
              )
            ) : (
              <p className="py-4 text-center text-xs font-bold text-black/60">
                Pilih ekskul untuk mengelola anggotanya.
              </p>
            )}
          </div>
        </section>

        {/* PANEL ABSENSI */}
        <section className="space-y-3 rounded-md border-2 border-black bg-white p-4">
          <h3 className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            <Calendar className="h-4 w-4 text-black" />
            Absensi Pertemuan Ekskul
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Ekskul
              </label>
              <select
                value={absenEkskulId}
                onChange={(e) => setAbsenEkskulId(e.target.value)}
                className={inputCls}
              >
                <option value="">— Pilih Ekskul —</option>
                {ekskulList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
                Tanggal
              </label>
              <input
                type="date"
                value={tanggalAbsen}
                onChange={(e) => setTanggalAbsen(e.target.value)}
                className={`${inputCls} font-mono`}
              />
            </div>
          </div>

          {feedbackAbsen && (
            <p
              className={`font-mono text-xs font-bold ${feedbackAbsen.startsWith('Berhasil') ? 'text-black' : 'text-black'}`}
            >
              {feedbackAbsen}
            </p>
          )}

          <div className="scrollbar-thin max-h-[280px] space-y-2 overflow-y-auto border-t-2 border-black/10 pt-3">
            {absenEkskulId ? (
              membersAbsen.length > 0 ? (
                membersAbsen.map((m) => {
                  const current = statusMap[m.studentId] || 'hadir';
                  return (
                    <div
                      key={m.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border-2 border-black bg-white px-3 py-2"
                    >
                      <p className="text-xs font-bold text-black">{studentName(m.studentId)}</p>
                      <div className="flex gap-1.5">
                        {(['hadir', 'izin', 'alpha'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setStatusMap((prev) => ({ ...prev, [m.studentId]: st }))}
                            className={`rounded-md border-2 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors ${
                              current === st
                                ? st === 'hadir'
                                  ? 'border-black bg-green-700 text-white'
                                  : st === 'izin'
                                    ? 'border-black bg-amber-500 text-white'
                                    : 'border-black bg-red-700 text-white'
                                : 'border-black bg-white text-black hover:bg-neutral-100'
                            }`}
                          >
                            {STATUS_LABEL[st]}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-4 text-center text-xs font-bold text-black">
                  Ekskul ini belum punya anggota aktif.
                </p>
              )
            ) : (
              <p className="py-4 text-center text-xs font-bold text-black/60">
                Pilih ekskul dan tanggal pertemuan untuk mencatat kehadiran.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveKehadiran}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border-2 border-black bg-black px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-900"
          >
            <Check className="h-3.5 w-3.5" />
            Simpan Kehadiran
          </button>
        </section>
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
