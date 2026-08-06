import { CalendarDays, ChevronRight, Clock, Tag } from 'lucide-react';
import { getUpcomingAgenda } from '../../halaman/components/KalenderAkademik/AgendaData/agenda';

interface AgendaWidgetProps {
  onNavigate?: (page: string) => void;
}

export default function AgendaWidget({ onNavigate }: AgendaWidgetProps) {
  const upcoming = getUpcomingAgenda(3);

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 font-sans text-slate-900 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
          Agenda Mendatang
        </h3>
        <CalendarDays className="h-4 w-4 text-slate-700" />
      </div>

      {/* List Agenda */}
      <div className="space-y-3">
        {upcoming.length > 0 ? (
          upcoming.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate?.('academic-agenda')}
              className="group cursor-pointer space-y-2 rounded-lg border border-slate-200 bg-white p-3 shadow-2xs transition-colors hover:border-slate-950"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 transition-colors group-hover:text-slate-950">
                  {item.title || 'Tanpa Judul'}
                </h4>
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-950" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {item.date || '-'}
                  {item.time ? ` • ${item.time}` : ''}
                </span>
                {item.type && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-700 uppercase transition-colors group-hover:border-slate-950 group-hover:text-slate-950">
                    <Tag className="h-2.5 w-2.5" />
                    {item.type}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-xs font-bold text-slate-500">
            Tidak ada agenda mendatang
          </p>
        )}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => onNavigate?.('academic-agenda')}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
      >
        Lihat Semua Agenda
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
