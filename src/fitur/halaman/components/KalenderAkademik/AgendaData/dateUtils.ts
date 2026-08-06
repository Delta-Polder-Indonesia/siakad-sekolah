// ─── Helper tanggal agenda kalender akademik — satu pintu (Sesi 55) ───
// Dipakai oleh agenda.ts, AgendaPage.tsx, dan DasborKalenderAkademik.tsx.
// Tipe memakai generic struktural (cukup `{ date: string }`) agar tidak
// perlu import AgendaItem → bebas siklus.

const MONTH_MAP: Record<string, number> = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

export function parseAgendaDate(dateStr: string): Date | null {
  const cleaned = dateStr.replace(/\u2013|\u2014/g, '-').trim();
  const m = cleaned.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (m) {
    const month = MONTH_MAP[m[2].toLowerCase()];
    if (month !== undefined) return new Date(parseInt(m[3], 10), month, parseInt(m[1], 10));
  }
  return null;
}

export function getAgendaDateInfo(item: { date: string }): {
  startDate: Date | null;
  endDate: Date | null;
} {
  const s = item.date;

  // Rentang tanggal sama bulan: "1–3 Juli 2026". Lookbehind `(?<![\d])` mencegah
  // angka pertama terambil dari dalam tahun (mis. "25 Juni 2026 – 2 Juli 2026"
  // tidak boleh terbaca sebagai "26 – 2 Juli 2026").
  const same = s.match(/(?<![\d])(\d{1,2})\s*[-–—]\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (same) {
    const month = MONTH_MAP[same[3].toLowerCase()];
    const year = parseInt(same[4], 10);
    if (month !== undefined)
      return {
        startDate: new Date(year, month, parseInt(same[1], 10)),
        endDate: new Date(year, month, parseInt(same[2], 10)),
      };
  }

  // Rentang lintas bulan/tahun: "25 Juni 2026 – 2 Juli 2026"
  const cross = s.match(
    /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\s*[-–—]\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/
  );
  if (cross) {
    const sm = MONTH_MAP[cross[2].toLowerCase()];
    const em = MONTH_MAP[cross[5].toLowerCase()];
    if (sm !== undefined && em !== undefined)
      return {
        startDate: new Date(parseInt(cross[3], 10), sm, parseInt(cross[1], 10)),
        endDate: new Date(parseInt(cross[6], 10), em, parseInt(cross[4], 10)),
      };
  }

  const single = parseAgendaDate(s);
  return { startDate: single, endDate: single };
}

export function getAgendasForDate<T extends { date: string }>(date: Date, items: T[]): T[] {
  const check = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return items.filter((item) => {
    const { startDate, endDate } = getAgendaDateInfo(item);
    if (!startDate || !endDate) return false;
    return (
      check >=
        new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime() &&
      check <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime()
    );
  });
}

export function sortByStartDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const at = getAgendaDateInfo(a).startDate?.getTime() ?? 0;
    const bt = getAgendaDateInfo(b).startDate?.getTime() ?? 0;
    return at - bt;
  });
}

export function filterBySemester<T extends { date: string }>(
  items: T[],
  sem: 'ganjil' | 'genap',
  ganjilStartYear: number,
  genapStartYear: number
): T[] {
  return items.filter((item) => {
    const { startDate } = getAgendaDateInfo(item);
    if (!startDate) return false;
    const t = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    ).getTime();
    if (sem === 'ganjil')
      return (
        t >= new Date(ganjilStartYear, 6, 1).getTime() &&
        t <= new Date(ganjilStartYear, 11, 31).getTime()
      );
    return (
      t >= new Date(genapStartYear, 0, 1).getTime() &&
      t <= new Date(genapStartYear, 6, 31).getTime()
    );
  });
}
