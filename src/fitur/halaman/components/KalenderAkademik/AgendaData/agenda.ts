import { parseAgendaDate } from './dateUtils';

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type:
    | 'Pendaftaran Akademik'
    | 'Ujian Akhir'
    | 'Ujian Tengah Semester'
    | 'Kelulusan'
    | 'Aktivitas Akademik'
    | 'Rapat'
    | 'Libur Nasional';
  location?: string;
  description: string;
  excerpt: string;
  image?: string;
  isHighlighted?: boolean;
}

export interface AcademicYearOption {
  value: string;
  label: string;
  ganjilStartYear: number;
  genapStartYear: number;
}

const AGENDA_FILES = import.meta.glob('../KalenderAkademiData/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, AgendaItem[]>;

interface YearEntry {
  ganjilStartYear: number;
  genapStartYear: number;
  items: AgendaItem[];
}

function yearFromFilename(
  path: string
): { ganjilStartYear: number; genapStartYear: number } | null {
  const match = path.match(/(\d{4})-(\d{4})\.json$/);
  if (!match) return null;
  return { ganjilStartYear: parseInt(match[1], 10), genapStartYear: parseInt(match[2], 10) };
}

const yearEntries: YearEntry[] = Object.entries(AGENDA_FILES)
  .map(([path, items]) => {
    const y = yearFromFilename(path);
    if (!y) return null;
    return { ...y, items };
  })
  .filter((x): x is YearEntry => x !== null)
  .sort((a, b) => b.ganjilStartYear - a.ganjilStartYear);

export const academicYears: AcademicYearOption[] = yearEntries.map((y) => ({
  value: `${y.ganjilStartYear}/${y.genapStartYear}`,
  label: `TA ${y.ganjilStartYear}/${y.genapStartYear}`,
  ganjilStartYear: y.ganjilStartYear,
  genapStartYear: y.genapStartYear,
}));

export const agendaItems: AgendaItem[] = yearEntries.flatMap((y) => y.items);

export const getUpcomingAgenda = (count: number = 3, from: Date = new Date()): AgendaItem[] => {
  const fromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  return agendaItems
    .filter((item) => {
      const start = parseAgendaDate(item.date);
      if (!start) return false;
      return new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime() >= fromTime;
    })
    .sort((a, b) => {
      const at = parseAgendaDate(a.date)?.getTime() ?? 0;
      const bt = parseAgendaDate(b.date)?.getTime() ?? 0;
      return at - bt;
    })
    .slice(0, count);
};

export const getAgendaByType = (type: AgendaItem['type']): AgendaItem[] => {
  return agendaItems.filter((item) => item.type === type);
};

export const getAgendaById = (id: string): AgendaItem | undefined => {
  return agendaItems.find((item) => item.id === id);
};
