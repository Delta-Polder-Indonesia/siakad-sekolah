import { useState, useMemo } from 'react';
import {
  getStudents,
  saveStudents,
  getGuestConfig,
  updateGuestConfig,
} from '../../../data/services';
import {
  Users,
  Key,
  Search,
  Edit2,
  Save,
  X,
  ShieldCheck,
  Globe,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

import { Student } from '../../../data/services';

export default function TabAkunOrangTua({ setNotice }: { setNotice: (msg: string) => void }) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ parentName: '', parentPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);

  // Guest Config State
  const [guestConfig, setGuestConfig] = useState(getGuestConfig());
  const [isEditingGuest, setIsEditingGuest] = useState(false);

  const students = useMemo(() => getStudents(), []);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.parentName?.toLowerCase().includes(search.toLowerCase()) ||
        s.nis.includes(search)
    );
  }, [students, search]);

  const handleEdit = (s: Student) => {
    setEditingId(s.id);
    setEditForm({
      parentName: s.parentName || '',
      parentPassword: s.parentPassword || 'ortu123',
    });
  };

  const handleSave = (id: string) => {
    const nextStudents = students.map((s) => (s.id === id ? { ...s, ...editForm } : s));
    saveStudents(nextStudents);
    setEditingId(null);
    setNotice('Data akun orang tua berhasil diperbarui');
  };

  const handleSaveGuest = () => {
    updateGuestConfig(guestConfig);
    setIsEditingGuest(false);
    setNotice('Konfigurasi akses tamu berhasil diperbarui');
  };

  return (
    <div className="space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── SEKSI 1: MANAJEMEN AKSES TAMU ──────────────── */}
      <section className="rounded-md border-2 border-black bg-white p-4">
        <div className="mb-3 flex flex-col justify-between gap-3 border-b-2 border-black pb-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-md border-2 border-black bg-white p-1.5 text-black">
              <Globe className="h-4 w-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wider text-black uppercase">
                Manajemen Akses Tamu
              </h2>
              <p className="mt-0.5 text-[10px] font-bold text-black/60">
                Konfigurasi kode akses publik untuk pengunjung dan mitra eksternal
              </p>
            </div>
          </div>
          <div className="sm:mt-0">
            {!isEditingGuest ? (
              <button
                onClick={() => setIsEditingGuest(true)}
                className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/50"
              >
                <Edit2 className="h-3 w-3" /> Ubah
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveGuest}
                  className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/50"
                >
                  <Save className="h-3 w-3" /> Simpan
                </button>
                <button
                  onClick={() => setIsEditingGuest(false)}
                  className="rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/50"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
              Kode Akses Global (Sistem)
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-black" />
              <input
                type="text"
                disabled={!isEditingGuest}
                value={guestConfig.accessCode}
                onChange={(e) => setGuestConfig({ ...guestConfig, accessCode: e.target.value })}
                className="w-full rounded-md border-2 border-black bg-white py-1.5 pr-3 pl-9 font-mono text-xs font-bold tracking-widest text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border-2 border-black bg-white p-3">
            <div className="pr-3">
              <p className="text-xs leading-tight font-bold text-black">
                Otorisasi Log Masuk Email
              </p>
              <p className="mt-0.5 text-[10px] font-bold text-black/60">
                Izinkan masuk via verifikasi email eksternal
              </p>
            </div>

            <button
              disabled={!isEditingGuest}
              onClick={() =>
                setGuestConfig({ ...guestConfig, allowEmailLogin: !guestConfig.allowEmailLogin })
              }
              className="flex w-28 shrink-0 items-center gap-2 rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors select-none hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/50"
            >
              <div className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-black bg-white font-bold text-black">
                {guestConfig.allowEmailLogin && '✓'}
              </div>
              <span>{guestConfig.allowEmailLogin ? 'Aktif' : 'Nonaktif'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── SEKSI 2: KREDENSIAL ORANG TUA ──────────────── */}
      <section className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex flex-col justify-between gap-3 border-b-2 border-black bg-white p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-md border-2 border-black bg-white p-1.5 text-black">
              <Users className="h-4 w-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wider text-black uppercase">
                Kredensial Orang Tua / Wali Murid
              </h2>
              <p className="mt-0.5 text-[10px] font-bold text-black/60">
                Otorisasi hak akses reguler dan pengelolaan kata sandi wali murid
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-xs">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-black" />
            <input
              type="text"
              placeholder="Cari siswa, orang tua, atau NIS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border-2 border-black bg-white py-1.5 pr-3 pl-9 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-black bg-white text-xs font-bold tracking-wider text-black uppercase">
                <th className="w-1/3 border-r border-black px-4 py-2.5">Informasi Data Siswa</th>
                <th className="w-1/3 border-r border-black px-4 py-2.5">
                  Nama Orang Tua (ID Log Masuk)
                </th>
                <th className="w-1/4 border-r border-black px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span>Kata Sandi</span>
                    <button
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="rounded-md border-2 border-black bg-white p-1 font-bold text-black transition-colors outline-none hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/50"
                      title={showPasswords ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {showPasswords ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                  </div>
                </th>
                <th className="w-28 px-4 py-2.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-neutral-100">
                  <td className="border-r border-black px-4 py-3">
                    <div>
                      <p className="text-xs font-bold text-black">{s.name}</p>
                      <p className="mt-0.5 font-mono text-xs font-bold text-neutral-900">
                        NIS: {s.nis}
                      </p>
                    </div>
                  </td>
                  <td className="border-r border-black px-4 py-3">
                    {editingId === s.id ? (
                      <input
                        type="text"
                        value={editForm.parentName}
                        onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })}
                        className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                      />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold ${s.parentName ? 'text-black' : 'text-neutral-900 italic'}`}
                        >
                          {s.parentName || 'Belum Dikonfigurasi'}
                        </span>
                        {!s.parentName && (
                          <AlertCircle className="h-3 w-3 flex-shrink-0 text-black" />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="border-r border-black px-4 py-3">
                    {editingId === s.id ? (
                      <div className="relative">
                        <Key className="absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 text-black" />
                        <input
                          type="text"
                          value={editForm.parentPassword}
                          onChange={(e) =>
                            setEditForm({ ...editForm, parentPassword: e.target.value })
                          }
                          className="w-full rounded-md border-2 border-black bg-white py-1 pr-2.5 pl-7 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                        />
                      </div>
                    ) : (
                      <span className="font-mono text-xs font-bold tracking-wide text-black">
                        {showPasswords ? s.parentPassword || 'ortu123' : '••••••••'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === s.id ? (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleSave(s.id)}
                          className="rounded-md border-2 border-black bg-white p-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/50"
                          title="Simpan"
                        >
                          <Save className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-md border-2 border-black bg-white p-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/50"
                          title="Batal"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(s)}
                        className="ml-auto inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-3 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/50"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="border-none bg-white px-4 py-8 text-center text-black">
                    <UserCheck className="mx-auto mb-1.5 h-6 w-6 text-black" />
                    <p className="text-xs font-bold text-black">Data entitas tidak ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── SEKSI 3: REGULASI KEAMANAN ──────────────── */}
      <section className="rounded-md border-2 border-black bg-white p-3">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-black" />
          <div>
            <h4 className="text-xs font-bold tracking-wider text-black uppercase">
              Prosedur Standar Keamanan & Autentikasi Sistem
            </h4>
            <p className="mt-1 text-xs leading-relaxed font-bold text-black/70">
              Administrator memegang kendali kepatuhan tata kelola penuh atas pemulihan dan
              pembaruan kata sandi operasional. Pastikan Login ID bersifat unik untuk mencegah
              duplikasi identitas. Gunakan format{' '}
              <span className="font-bold text-black">"NamaLengkapAnak"</span> atau email terdaftar
              sebagai identitas tunggal sistem.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
