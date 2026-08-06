import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getEkskulTersedia,
  daftarEkskul,
  keluarEkskul,
  getEkskulKehadiranByStudent,
  type EkskulKehadiran,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Trophy, UserPlus, UserMinus, Calendar, Check } from 'lucide-react';

const STATUS_LABEL: Record<EkskulKehadiran['status'], string> = {
  hadir: 'Hadir',
  izin: 'Izin',
  alpha: 'Alpha',
};

export default function EkskulSiswa() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [feedback, setFeedback] = useState('');
  const studentId = user?.id || '';

  const tersedia = useMemo(
    () => (studentId ? getEkskulTersedia(studentId) : []),
    [studentId, storeVersion]
  );

  const kehadiranSaya = useMemo(
    () => (studentId ? getEkskulKehadiranByStudent(studentId) : []),
    [studentId, storeVersion]
  );

  const diikuti = tersedia.filter((e) => e.sudahDaftar);
  const tersediaLain = tersedia.filter((e) => !e.sudahDaftar);

  const rekapKehadiran = useMemo(() => {
    const map: Record<string, { hadir: number; izin: number; alpha: number }> = {};
    kehadiranSaya.forEach((k) => {
      if (!map[k.ekskulId]) map[k.ekskulId] = { hadir: 0, izin: 0, alpha: 0 };
      map[k.ekskulId][k.status] += 1;
    });
    return map;
  }, [kehadiranSaya]);

  const namaEkskul = (id: string) => tersedia.find((e) => e.id === id)?.nama || id;

  const handleDaftar = (ekskulId: string) => {
    const ok = daftarEkskul(studentId, ekskulId);
    setFeedback(
      ok
        ? 'Berhasil: Kamu terdaftar di ekskul ini.'
        : 'Error: Kuota penuh atau kamu sudah terdaftar.'
    );
  };

  const handleKeluar = (ekskulId: string) => {
    keluarEkskul(studentId, ekskulId);
    setFeedback('Berhasil: Kamu keluar dari ekskul ini.');
  };

  const statusBadge = (s: EkskulKehadiran['status']) =>
    s === 'hadir'
      ? 'border-black bg-green-700 text-white'
      : s === 'izin'
        ? 'border-black bg-amber-500 text-white'
        : 'border-black bg-red-700 text-white';

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
            <Trophy className="h-7 w-7 stroke-[2] text-black" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Ekstrakurikuler
            </p>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black">
              Daftar & Pantau Ekskul
            </h1>
            <p className="mt-1 text-xs leading-none font-bold text-black">
              Ikuti ekskul yang tersedia dan pantau riwayat kehadiranmu.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:self-end">
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Ekskul Diikuti
            </p>
            <p className="text-xl leading-tight font-bold text-black">{diikuti.length}</p>
          </div>
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Tersedia
            </p>
            <p className="text-xl leading-tight font-bold text-black">{tersedia.length}</p>
          </div>
        </div>
      </header>

      {feedback && (
        <p
          className={`rounded-md border-2 px-3 py-2 font-mono text-xs font-bold ${
            feedback.startsWith('Berhasil')
              ? 'border-black bg-green-700 text-white'
              : 'border-black bg-white text-black'
          }`}
        >
          {feedback}
        </p>
      )}

      {/* ── EKSKUL YANG DIKUTI ──────────────── */}
      <section className="space-y-3 rounded-md border-2 border-black bg-white p-4">
        <h3 className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
          <Check className="h-4 w-4 text-black" />
          Ekskul yang Kamu Ikuti
        </h3>

        {diikuti.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {diikuti.map((e) => {
              const rekap = rekapKehadiran[e.id] || { hadir: 0, izin: 0, alpha: 0 };
              return (
                <div
                  key={e.id}
                  className="flex flex-col rounded-md border-2 border-black bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm leading-tight font-bold text-black">{e.nama}</p>
                      <p className="text-[10px] font-bold tracking-wider text-black/60 uppercase">
                        {e.kategori}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
                      {e.anggota}/{e.kuota ?? '∞'}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] font-bold text-black">
                    <Calendar className="h-3 w-3 text-black" />
                    {e.hari} · {e.jam}
                  </p>
                  <p className="text-[10px] font-bold text-black/60">{e.pembina}</p>

                  <div className="mt-3 grid grid-cols-3 gap-1.5 border-t-2 border-black/10 pt-2">
                    <div className="rounded-md border-2 border-black bg-white px-1 py-1 text-center">
                      <p className="font-mono text-xs font-bold text-green-700">{rekap.hadir}</p>
                      <p className="text-[9px] font-bold tracking-wider text-black/60 uppercase">
                        Hadir
                      </p>
                    </div>
                    <div className="rounded-md border-2 border-black bg-white px-1 py-1 text-center">
                      <p className="font-mono text-xs font-bold text-amber-600">{rekap.izin}</p>
                      <p className="text-[9px] font-bold tracking-wider text-black/60 uppercase">
                        Izin
                      </p>
                    </div>
                    <div className="rounded-md border-2 border-black bg-white px-1 py-1 text-center">
                      <p className="font-mono text-xs font-bold text-red-700">{rekap.alpha}</p>
                      <p className="text-[9px] font-bold tracking-wider text-black/60 uppercase">
                        Alpha
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleKeluar(e.id)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 text-[10px] font-bold tracking-wider text-black uppercase transition-colors hover:bg-neutral-100"
                  >
                    <UserMinus className="h-3 w-3" />
                    Keluar
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-md border-2 border-dashed border-black bg-white py-10 text-center">
            <Trophy className="mx-auto mb-1 h-6 w-6 text-black" />
            <p className="text-xs font-bold tracking-widest text-black uppercase">
              — Belum mengikuti ekskul —
            </p>
          </div>
        )}
      </section>

      {/* ── EKSKUL TERSEDIA ──────────────── */}
      <section className="space-y-3 rounded-md border-2 border-black bg-white p-4">
        <h3 className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
          <Trophy className="h-4 w-4 text-black" />
          Ekskul Tersedia
        </h3>

        {tersediaLain.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {tersediaLain.map((e) => {
              const penuh = typeof e.kuota === 'number' && e.kuota > 0 && e.anggota >= e.kuota;
              return (
                <div
                  key={e.id}
                  className="flex flex-col rounded-md border-2 border-black bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm leading-tight font-bold text-black">{e.nama}</p>
                      <p className="text-[10px] font-bold tracking-wider text-black/60 uppercase">
                        {e.kategori}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
                      {e.anggota}/{e.kuota ?? '∞'}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] font-bold text-black">
                    <Calendar className="h-3 w-3 text-black" />
                    {e.hari} · {e.jam}
                  </p>
                  {e.lokasi && <p className="text-[10px] font-bold text-black/60">{e.lokasi}</p>}
                  {e.deskripsi && (
                    <p className="mt-1 text-[10px] leading-relaxed font-bold text-black/60">
                      {e.deskripsi}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={penuh}
                    onClick={() => handleDaftar(e.id)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border-2 border-black px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors enabled:bg-black enabled:text-white enabled:hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <UserPlus className="h-3 w-3" />
                    {penuh ? 'Kuota Penuh' : 'Daftar'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-md border-2 border-dashed border-black bg-white py-8 text-center">
            <p className="text-xs font-bold tracking-widest text-black uppercase">
              — Semua ekskul sudah diikuti —
            </p>
          </div>
        )}
      </section>

      {/* ── RIWAYAT KEHADIRAN ──────────────── */}
      <section className="space-y-3 rounded-md border-2 border-black bg-white p-4">
        <h3 className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
          <Calendar className="h-4 w-4 text-black" />
          Riwayat Kehadiran Ekskul
        </h3>

        {kehadiranSaya.length > 0 ? (
          <div className="scrollbar-thin max-h-[400px] space-y-2 overflow-y-auto">
            {kehadiranSaya.map((k) => (
              <div
                key={k.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border-2 border-black bg-white px-3 py-2"
              >
                <div>
                  <p className="text-xs font-bold text-black">{namaEkskul(k.ekskulId)}</p>
                  <p className="font-mono text-[10px] font-bold text-black/50">{k.tanggal}</p>
                </div>
                <span
                  className={`inline-block rounded-md border-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${statusBadge(k.status)}`}
                >
                  {STATUS_LABEL[k.status]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border-2 border-dashed border-black bg-white py-8 text-center">
            <p className="text-xs font-bold tracking-widest text-black uppercase">
              — Belum ada riwayat kehadiran —
            </p>
          </div>
        )}
      </section>

      <div className="rounded-md border-2 border-dashed border-black bg-white p-3 text-center">
        <p className="text-[10px] font-bold tracking-wider text-black uppercase">
          Data ekskul dikelola oleh sekolah. Hubungi pembina/wali kelas jika ada pertanyaan mengenai
          kehadiranmu.
        </p>
      </div>
    </div>
  );
}
