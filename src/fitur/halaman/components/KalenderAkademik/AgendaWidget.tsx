import { CalendarDays, ChevronRight } from 'lucide-react';
import { getUpcomingAgenda } from './AgendaData/agenda';

interface AgendaWidgetProps {
  onNavigate?: (page: string) => void;
}

export default function AgendaWidget({ onNavigate }: AgendaWidgetProps) {
  const upcomingAgenda = getUpcomingAgenda(3);

  return (
    <div className="mr-auto w-full max-w-md border border-slate-300">
      {/* Header */}
      <div className="bg-slate-800 p-4 text-white">
        <h3 className="flex items-center gap-3 text-xs font-semibold tracking-wider uppercase">
          <CalendarDays className="h-4 w-4 text-white" />
          Agenda Akademik
        </h3>
      </div>

      {/* Content — menyatu dengan background putih halaman */}
      <div className="space-y-6 p-5">
        {upcomingAgenda.map((agenda) => (
          <div
            key={agenda.id}
            className="group relative space-y-2 border-l-4 border-slate-300 p-2 pl-4"
            onClick={() => onNavigate?.('academic-agenda')}
          >
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {agenda.type}
            </span>
            <h4 className="cursor-pointer text-sm leading-tight font-semibold text-slate-900 transition-colors group-hover:text-slate-600">
              {agenda.title}
            </h4>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span>{agenda.date}</span>
              <span>•</span>
              <span className="font-mono">{agenda.time}</span>
            </div>
          </div>
        ))}

        <button
          onClick={() => onNavigate?.('academic-agenda')}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-950 py-3 text-xs font-bold tracking-wider text-white uppercase transition-all hover:bg-blue-900"
        >
          Lihat Kalender Lengkap
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
