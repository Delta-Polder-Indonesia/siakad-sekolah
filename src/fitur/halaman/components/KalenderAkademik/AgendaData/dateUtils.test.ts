import { describe, expect, it } from 'vitest';
import {
  filterBySemester,
  getAgendaDateInfo,
  getAgendasForDate,
  parseAgendaDate,
  sortByStartDate,
} from './dateUtils';

describe('parseAgendaDate', () => {
  it('parses a single Indonesian date', () => {
    expect(parseAgendaDate('1 Juli 2026')).toEqual(new Date(2026, 6, 1));
    expect(parseAgendaDate('25 Desember 2026')).toEqual(new Date(2026, 11, 25));
  });

  it('returns null for unparseable strings', () => {
    expect(parseAgendaDate('invalid')).toBeNull();
  });

  it('matches the first date-like substring (perilaku dipakai getUpcomingAgenda)', () => {
    // Rentang sama bulan: substring "3 Juli 2026" ter-parse (perilaku asli)
    expect(parseAgendaDate('1–3 Juli 2026')).toEqual(new Date(2026, 6, 3));
    expect(parseAgendaDate('15 - 18 Desember 2026')).toEqual(new Date(2026, 11, 18));
  });
});

describe('getAgendaDateInfo', () => {
  it('handles same-month ranges', () => {
    const { startDate, endDate } = getAgendaDateInfo({ date: '1–3 Juli 2026' });
    expect(startDate).toEqual(new Date(2026, 6, 1));
    expect(endDate).toEqual(new Date(2026, 6, 3));
  });

  it('handles cross-month ranges', () => {
    const { startDate, endDate } = getAgendaDateInfo({ date: '25 Juni 2026 – 2 Juli 2026' });
    expect(startDate).toEqual(new Date(2026, 5, 25));
    expect(endDate).toEqual(new Date(2026, 6, 2));
  });

  it('falls back to a single date when no range is present', () => {
    const { startDate, endDate } = getAgendaDateInfo({ date: '10 Agustus 2026' });
    expect(startDate).toEqual(new Date(2026, 7, 10));
    expect(endDate).toEqual(new Date(2026, 7, 10));
  });
});

describe('getAgendasForDate', () => {
  const items = [
    { id: 'a', date: '1–3 Juli 2026' },
    { id: 'b', date: '10 Juli 2026' },
  ];

  it('includes items whose range covers the given date', () => {
    const result = getAgendasForDate(new Date(2026, 6, 2), items);
    expect(result.map((i) => i.id)).toEqual(['a']);
  });

  it('excludes items outside the given date', () => {
    expect(getAgendasForDate(new Date(2026, 6, 4), items)).toEqual([]);
  });
});

describe('sortByStartDate', () => {
  it('sorts by ascending start date', () => {
    const items = [
      { id: 'later', date: '20 Desember 2026' },
      { id: 'earlier', date: '2 Januari 2026' },
    ];
    expect(sortByStartDate(items).map((i) => i.id)).toEqual(['earlier', 'later']);
  });
});

describe('filterBySemester', () => {
  const items = [
    { id: 'ganjil', date: '15 Juli 2026' },
    { id: 'genap', date: '15 Januari 2027' },
  ];

  it('filters ganjil (Juli–Desember tahun ganjil)', () => {
    const result = filterBySemester(items, 'ganjil', 2026, 2027);
    expect(result.map((i) => i.id)).toEqual(['ganjil']);
  });

  it('filters genap (Januari–Juli tahun genap)', () => {
    const result = filterBySemester(items, 'genap', 2026, 2027);
    expect(result.map((i) => i.id)).toEqual(['genap']);
  });
});
