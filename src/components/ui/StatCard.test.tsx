/**
 * Unit test StatCard — komponen kartu statistik dashboard.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('menampilkan label dan value', () => {
    render(<StatCard label="Total Siswa" value={120} />);
    expect(screen.getByText('Total Siswa')).toBeTruthy();
    expect(screen.getByText('120')).toBeTruthy();
  });

  it('mode loading menampilkan skeleton, bukan value', () => {
    const { container } = render(<StatCard label="Hadir" value={5} loading />);
    expect(screen.queryByText('5')).toBeNull();
    expect(container.querySelectorAll('.animate-pulse, .bg-neutral-200, [class*=skeleton], .animate-pulse')).toBeTruthy();
  });

  it('mode alert memakai warna merah untuk value', () => {
    const { container } = render(<StatCard label="Alpa" value={3} alert />);
    const valueEl = [...container.querySelectorAll('p')].find((p) => p.textContent === '3');
    expect(valueEl?.className).toContain('text-rose-700');
  });

  it('menerima ikon dan merendernya', () => {
    const { container } = render(<StatCard label="Siswa" value={1} icon={Users} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
