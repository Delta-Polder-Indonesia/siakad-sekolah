import { describe, expect, it } from 'vitest';
import {
  resolveRisetNav,
  resolveSdgsNav,
  resolveSilaNav,
  resolveAsaNav,
  resolveSilaAsaNav,
  resolveEbookNav,
  resolveRegNav,
  resolveBeritaNav,
} from './detailNav';

describe('resolveRisetNav', () => {
  it('maps known riset links to riset/{link}', () => {
    expect(resolveRisetNav('riset-air-bersih')).toBe('riset/riset-air-bersih');
    expect(resolveRisetNav('riset-infrastruktur')).toBe('riset/riset-infrastruktur');
    expect(resolveRisetNav('riset-digitalisasi')).toBe('riset/riset-digitalisasi');
  });

  it('returns null for unknown or empty links', () => {
    expect(resolveRisetNav('riset-tidak-ada')).toBeNull();
    expect(resolveRisetNav('')).toBeNull();
    expect(resolveRisetNav(undefined)).toBeNull();
  });
});

describe('resolveSdgsNav', () => {
  it('maps valid sdgs ids to sdgs/sdgs-N', () => {
    expect(resolveSdgsNav('sdgs-1')).toBe('sdgs/sdgs-1');
    expect(resolveSdgsNav('sdgs-17')).toBe('sdgs/sdgs-17');
  });

  it('accepts bare numbers and numeric strings', () => {
    expect(resolveSdgsNav(1)).toBe('sdgs/sdgs-1');
    expect(resolveSdgsNav(17)).toBe('sdgs/sdgs-17');
    expect(resolveSdgsNav('3')).toBe('sdgs/sdgs-3');
  });

  it('returns null for out-of-range ids', () => {
    expect(resolveSdgsNav('sdgs-0')).toBeNull();
    expect(resolveSdgsNav('sdgs-18')).toBeNull();
    expect(resolveSdgsNav(0)).toBeNull();
    expect(resolveSdgsNav(18)).toBeNull();
    expect(resolveSdgsNav(-1)).toBeNull();
  });

  it('returns null for non-numeric values', () => {
    expect(resolveSdgsNav('sdgs-abc')).toBeNull();
    expect(resolveSdgsNav('abc')).toBeNull();
    expect(resolveSdgsNav(undefined)).toBeNull();
    expect(resolveSdgsNav(2.5)).toBeNull();
  });
});

describe('resolveSilaNav', () => {
  it('maps valid sila ids to sila-N', () => {
    expect(resolveSilaNav('sila-1')).toBe('sila-1');
    expect(resolveSilaNav('sila-7')).toBe('sila-7');
  });

  it('returns null for out-of-range or mismatched ids', () => {
    expect(resolveSilaNav('sila-0')).toBeNull();
    expect(resolveSilaNav('sila-8')).toBeNull();
    expect(resolveSilaNav('asa-1')).toBeNull();
    expect(resolveSilaNav('sila-abc')).toBeNull();
    expect(resolveSilaNav(undefined)).toBeNull();
    expect(resolveSilaNav('')).toBeNull();
  });
});

describe('resolveAsaNav', () => {
  it('maps valid asa ids to asa-N', () => {
    expect(resolveAsaNav('asa-1')).toBe('asa-1');
    expect(resolveAsaNav('asa-14')).toBe('asa-14');
  });

  it('returns null for out-of-range or mismatched ids', () => {
    expect(resolveAsaNav('asa-0')).toBeNull();
    expect(resolveAsaNav('asa-15')).toBeNull();
    expect(resolveAsaNav('sila-1')).toBeNull();
    expect(resolveAsaNav('asa-x')).toBeNull();
    expect(resolveAsaNav(undefined)).toBeNull();
  });
});

describe('resolveSilaAsaNav', () => {
  it('resolves both sila and asa prefixes', () => {
    expect(resolveSilaAsaNav('sila-3')).toBe('sila-3');
    expect(resolveSilaAsaNav('asa-10')).toBe('asa-10');
  });

  it('returns null for invalid ids', () => {
    expect(resolveSilaAsaNav('sila-8')).toBeNull();
    expect(resolveSilaAsaNav('asa-15')).toBeNull();
    expect(resolveSilaAsaNav('lainnya-1')).toBeNull();
    expect(resolveSilaAsaNav(undefined)).toBeNull();
  });
});

describe('resolveEbookNav', () => {
  it('maps valid ebook ids to ebook-N', () => {
    expect(resolveEbookNav(1)).toBe('ebook-1');
    expect(resolveEbookNav(8)).toBe('ebook-8');
    expect(resolveEbookNav('ebook-3')).toBe('ebook-3');
    expect(resolveEbookNav('4')).toBe('ebook-4');
  });

  it('returns null for out-of-range ids', () => {
    expect(resolveEbookNav(0)).toBeNull();
    expect(resolveEbookNav(9)).toBeNull();
    expect(resolveEbookNav(-1)).toBeNull();
  });

  it('returns null for non-numeric values', () => {
    expect(resolveEbookNav('ebook-abc')).toBeNull();
    expect(resolveEbookNav('abc')).toBeNull();
    expect(resolveEbookNav(undefined)).toBeNull();
    expect(resolveEbookNav('')).toBeNull();
    expect(resolveEbookNav(2.5)).toBeNull();
  });
});

describe('resolveBeritaNav', () => {
  it('maps valid berita ids to berita-N', () => {
    expect(resolveBeritaNav(1)).toBe('berita-1');
    expect(resolveBeritaNav(4)).toBe('berita-4');
    expect(resolveBeritaNav('berita-2')).toBe('berita-2');
    expect(resolveBeritaNav('3')).toBe('berita-3');
  });

  it('returns null for out-of-range ids', () => {
    expect(resolveBeritaNav(0)).toBeNull();
    expect(resolveBeritaNav(5)).toBeNull();
    expect(resolveBeritaNav(-1)).toBeNull();
  });

  it('returns null for non-numeric values', () => {
    expect(resolveBeritaNav('berita-abc')).toBeNull();
    expect(resolveBeritaNav('abc')).toBeNull();
    expect(resolveBeritaNav(undefined)).toBeNull();
    expect(resolveBeritaNav('')).toBeNull();
    expect(resolveBeritaNav(2.5)).toBeNull();
  });
});

describe('resolveRegNav', () => {
  it('maps valid reg ids to zero-padded reg-0N', () => {
    expect(resolveRegNav('reg-01')).toBe('reg-01');
    expect(resolveRegNav('reg-07')).toBe('reg-07');
    expect(resolveRegNav('reg-3')).toBe('reg-03');
    expect(resolveRegNav(5)).toBe('reg-05');
  });

  it('returns null for out-of-range ids', () => {
    expect(resolveRegNav('reg-00')).toBeNull();
    expect(resolveRegNav('reg-08')).toBeNull();
    expect(resolveRegNav(0)).toBeNull();
    expect(resolveRegNav(8)).toBeNull();
  });

  it('returns null for non-numeric values', () => {
    expect(resolveRegNav('reg-abc')).toBeNull();
    expect(resolveRegNav('abc')).toBeNull();
    expect(resolveRegNav(undefined)).toBeNull();
    expect(resolveRegNav('')).toBeNull();
    expect(resolveRegNav(2.5)).toBeNull();
  });
});
