import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCatatanBKByStudent, getTotalPoinBK } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { ShieldAlert, ShieldCheck, Calendar, Award } from 'lucide-react';

export default function CatatanBKSiswa() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();

  const records = useMemo(() => {
    if (!user) return [];
    return getCatatanBKByStudent(user.id);
  }, [user, storeVersion]);

  const totalPoin = useMemo(() => (user ? getTotalPoinBK(user.id) : 0), [user, storeVersion]);

  const stats = useMemo(() => {
    const prestasi = records.filter((r) => r.jenis === 'prestasi').length;
    const pelanggaran = records.filter((r) => r.jenis === 'pelanggaran').length;
    return { prestasi, pelanggaran, total: records.length };
  }, [records]);

  const poinLabel = (p: number) => (p > 0 ? `+${p}` : `${p}`);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
            <ShieldCheck className="h-7 w-7 stroke-[2] text-black" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Bimbingan Konseling
            </p>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black">
              Catatan Kedisiplinan & Prestasi
            </h1>
            <p className="mt-1 text-xs leading-none font-bold text-black">
              Pantau poin pelanggaran dan prestasi yang dicatat oleh guru BK.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:self-end">
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Total Poin
            </p>
            <p
              className={`text-xl leading-tight font-bold ${totalPoin >= 0 ? 'text-green-700' : 'text-red-700'}`}
            >
              {poinLabel(totalPoin)}
            </p>
          </div>
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Prestasi
            </p>
            <p className="text-xl leading-tight font-bold text-black">{stats.prestasi}</p>
          </div>
          <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Pelanggaran
            </p>
            <p className="text-xl leading-tight font-bold text-black">{stats.pelanggaran}</p>
          </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex items-center justify-between gap-2 border-b-2 border-black bg-white p-3">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
            <Award className="h-4 w-4 text-black" />
            Riwayat Catatan BK
          </h3>
          <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
            {stats.total} Catatan
          </span>
        </div>

        <div className="scrollbar-thin max-h-[600px] space-y-3 overflow-y-auto p-3">
          {records.length > 0 ? (
            records.map((r) => (
              <div key={r.id} className="rounded-md border-2 border-black bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                          r.jenis === 'prestasi'
                            ? 'border-black bg-green-700 text-white'
                            : 'border-black bg-red-700 text-white'
                        }`}
                      >
                        {r.jenis === 'prestasi' ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <ShieldAlert className="h-3 w-3" />
                        )}
                        {r.jenis === 'prestasi' ? 'Prestasi' : 'Pelanggaran'}
                      </span>
                      <span className="rounded border-2 border-black bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase">
                        {r.kategori}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-black">
                        <Calendar className="h-3 w-3 text-black" />
                        {r.tanggal}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed font-semibold whitespace-pre-line text-black">
                      {r.deskripsi}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-md border-2 px-2 py-0.5 font-mono text-xs font-bold ${
                      r.poin > 0
                        ? 'border-green-700 bg-green-700 text-white'
                        : 'border-red-700 bg-red-700 text-white'
                    }`}
                  >
                    {poinLabel(r.poin)}
                  </span>
                </div>

                <p className="mt-2 border-t-2 border-black/10 pt-2 font-mono text-[10px] font-bold text-black/50">
                  Dicatat oleh: {r.dicatatOleh}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-md border-2 border-dashed border-black bg-white py-10 text-center">
              <ShieldCheck className="mx-auto mb-1 h-6 w-6 text-black" />
              <p className="text-xs font-bold tracking-widest text-black uppercase">
                — Belum ada catatan BK —
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border-2 border-dashed border-black bg-white p-3 text-center">
        <ShieldAlert className="mx-auto mb-1 h-4 w-4 text-black" />
        <p className="text-[10px] font-bold tracking-wider text-black uppercase">
          Catatan ini dikelola oleh guru BK / wali kelas. Hubungi wali kelas jika ada pertanyaan
          mengenai poin Anda.
        </p>
      </div>
    </div>
  );
}
