import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getParentStudent, getSuratIzinByStudent, type SuratIzin } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { FileText, Calendar, Send, CheckCircle2, Clock } from 'lucide-react';

const TYPE_LABEL: Record<SuratIzin['type'], string> = {
  izin: 'Izin',
  sakit: 'Sakit',
  dispensasi: 'Dispensasi',
  lainnya: 'Keperluan Lain',
};

const STATUS_META: Record<
  SuratIzin['status'],
  { label: string; badgeClass: string; icon: typeof Clock }
> = {
  menunggu: {
    label: 'Menunggu Persetujuan',
    badgeClass: 'border-black bg-white text-black',
    icon: Clock,
  },
  disetujui: {
    label: 'Disetujui',
    badgeClass: 'border-black bg-black text-white',
    icon: CheckCircle2,
  },
  ditolak: { label: 'Ditolak', badgeClass: 'border-black bg-neutral-200 text-black', icon: Send },
};

export default function StatusSuratIzinAnak({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const student = useMemo(() => getParentStudent(user), [user, storeVersion]);
  const studentId = student?.id;

  const letters = useMemo(() => {
    if (!studentId) return [];
    return [...getSuratIzinByStudent(studentId)].sort((a, b) => b.createdAt - a.createdAt);
  }, [studentId, storeVersion]);

  const stats = useMemo(() => {
    const count = (status: SuratIzin['status']) =>
      letters.filter((l) => l.status === status).length;
    return {
      total: letters.length,
      menunggu: count('menunggu'),
      disetujui: count('disetujui'),
      ditolak: count('ditolak'),
    };
  }, [letters]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* ── HEADER ENTITAS ──────────────── */}
      <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
            <FileText className="h-7 w-7 stroke-[2] text-black" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
              Akun Orang Tua / Wali
            </p>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black">
              Status Surat Izin Anak
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md border-2 border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                Wali Dari: {student?.name || '-'}
              </span>
              <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
                NIS: {student?.nis || '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:self-end">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Menunggu', value: stats.menunggu },
            { label: 'Disetujui', value: stats.disetujui },
            { label: 'Ditolak', value: stats.ditolak },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-md border-2 border-black bg-white px-4 py-2 text-center"
            >
              <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
                {s.label}
              </p>
              <p className="text-xl leading-tight font-bold text-black">{s.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ── DAFTAR SURAT IZIN ──────────────── */}
      <div className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex items-center justify-between gap-2 border-b-2 border-black bg-white p-3">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
            <FileText className="h-4 w-4 text-black" />
            Surat Izin yang Diajukan Anak
          </h3>
          <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
            {stats.total} Surat
          </span>
        </div>

        <div className="scrollbar-thin max-h-[600px] space-y-3 overflow-y-auto p-3">
          {letters.length > 0 ? (
            letters.map((item) => {
              const meta = STATUS_META[item.status];
              const StatusIcon = meta.icon;
              return (
                <div key={item.id} className="rounded-md border-2 border-black bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3 className="truncate text-xs leading-tight font-bold text-black">
                        {item.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-black">
                        <span className="rounded border-2 border-black bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase">
                          {TYPE_LABEL[item.type]}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="h-3 w-3 text-black" />
                          <span>
                            Izin:{' '}
                            {new Date(`${item.letterDate}T00:00:00`).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 text-black" />
                          <span>
                            Dibuat:{' '}
                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-md border-2 px-2 py-0.5 text-[10px] font-bold tracking-wide ${meta.badgeClass}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {meta.label}
                    </span>
                  </div>

                  <p className="mt-2.5 border-t-2 border-black/10 pt-2 text-xs leading-relaxed font-semibold whitespace-pre-line text-black">
                    {item.message}
                  </p>

                  {item.attachmentName && (
                    <div className="mt-2.5 flex items-center gap-1.5 border-t-2 border-black/10 pt-2 font-mono text-[10px] font-bold text-black">
                      <FileText className="h-3 w-3 shrink-0 text-black" />
                      <span className="truncate">Lampiran: {item.attachmentName}</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-md border-2 border-dashed border-black bg-white py-10 text-center">
              <FileText className="mx-auto mb-1 h-6 w-6 text-black" />
              <p className="text-xs font-bold tracking-widest text-black uppercase">
                — Belum ada surat izin yang diajukan anak —
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-black bg-white p-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <Send className="h-4 w-4 text-black" />
          <p className="text-[10px] font-bold tracking-wider text-black uppercase">
            Halaman ini read-only — surat izin diajukan oleh anak melalui portal siswa.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.('dashboard')}
          className="shrink-0 rounded-md border-2 border-black bg-black px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-900"
        >
          Kembali ke Ikhtisar
        </button>
      </div>
    </div>
  );
}
