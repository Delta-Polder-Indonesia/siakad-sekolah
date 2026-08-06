import { describe, expect, it } from 'vitest';
import {
  agendaItems,
  academicYears,
  getAgendaById,
  getAgendaByType,
  getUpcomingAgenda,
} from './agenda';

describe('getUpcomingAgenda', () => {
  const from = new Date(2026, 5, 1);

  it('returns the nearest upcoming items sorted by date', () => {
    const result = getUpcomingAgenda(3, from);
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('open-house-2026');
    expect(result[1].id).toBe('seminar-parenting-2026');
    expect(result[2].id).toBe('futsal-cup-2026');
  });

  it('skips items that are before the given date', () => {
    const result = getUpcomingAgenda(10, new Date(2026, 10, 1));
    const ids = result.map((item) => item.id);
    expect(ids).toContain('workshop-ai-2026');
    expect(ids).not.toContain('open-house-2026');
  });

  it('respects a custom count', () => {
    expect(getUpcomingAgenda(1, from)).toHaveLength(1);
    expect(getUpcomingAgenda(0, from)).toEqual([]);
  });

  it('never returns more items than exist', () => {
    expect(getUpcomingAgenda(agendaItems.length + 10, from)).toHaveLength(agendaItems.length);
  });
});

describe('getAgendaByType', () => {
  it('only returns items matching the requested type', () => {
    const result = getAgendaByType('Aktivitas Akademik');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.type === 'Aktivitas Akademik')).toBe(true);
  });

  it('returns an empty array when no item matches', () => {
    expect(getAgendaByType('Kelulusan')).toEqual([]);
  });
});

describe('getAgendaById', () => {
  it('returns the matching agenda item', () => {
    const first = agendaItems[0];
    expect(getAgendaById(first.id)).toEqual(first);
  });

  it('returns undefined for an unknown id', () => {
    expect(getAgendaById('does-not-exist')).toBeUndefined();
  });
});

describe('agendaItems dataset', () => {
  it('has unique ids', () => {
    const ids = agendaItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every item has the required display fields', () => {
    for (const item of agendaItems) {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.date).toBeTruthy();
      expect(item.excerpt).toBeTruthy();
    }
  });
});

describe('academicYears', () => {
  it('is derived from the JSON data files', () => {
    expect(academicYears.length).toBeGreaterThanOrEqual(4);
    expect(academicYears[0].value).toBe('2026/2027');
    expect(academicYears[0].label).toBe('TA 2026/2027');
  });

  it('is sorted from newest to oldest', () => {
    const years = academicYears.map((y) => y.ganjilStartYear);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });
});
