import { describe, expect, it } from 'vitest';
import {
  BATAS_KEHADIRAN_BAIK,
  BATAS_KEHADIRAN_CUKUP,
  kehadiranBadgeClass,
  tingkatKehadiran,
} from './kehadiran';

describe('tingkatKehadiran', () => {
  it('mengembalikan baik saat >= ambang baik', () => {
    expect(tingkatKehadiran(BATAS_KEHADIRAN_BAIK)).toBe('baik');
    expect(tingkatKehadiran(95)).toBe('baik');
  });

  it('mengembalikan cukup saat di bawah ambang baik namun >= ambang cukup', () => {
    expect(tingkatKehadiran(BATAS_KEHADIRAN_CUKUP)).toBe('cukup');
    expect(tingkatKehadiran(70)).toBe('cukup');
  });

  it('mengembalikan rendah saat di bawah ambang cukup', () => {
    expect(tingkatKehadiran(59)).toBe('rendah');
    expect(tingkatKehadiran(0)).toBe('rendah');
  });
});

describe('kehadiranBadgeClass', () => {
  it('memetakan tingkat ke kelas CSS yang sesuai', () => {
    expect(kehadiranBadgeClass(90)).toContain('border-emerald-600');
    expect(kehadiranBadgeClass(70)).toContain('border-amber-600');
    expect(kehadiranBadgeClass(40)).toContain('border-rose-600');
  });
});
