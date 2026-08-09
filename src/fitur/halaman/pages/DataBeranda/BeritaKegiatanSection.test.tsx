import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BeritaKegiatanSection from './BeritaKegiatanSection';
import { news } from '../../data/berita/data';

describe('BeritaKegiatanSection navigation', () => {
  it('navigates to the berita content when the featured item is clicked', () => {
    const onNavigate = vi.fn();
    render(<BeritaKegiatanSection onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText(news[0].title));

    expect(onNavigate).toHaveBeenCalledWith('berita-1');
  });

  it('navigates to the berita content when secondary items are clicked', () => {
    const onNavigate = vi.fn();
    render(<BeritaKegiatanSection onNavigate={onNavigate} />);

    // Item sekunder = news index 1 dan 2 (slice(1,3)) → berita-2, berita-3.
    // Ekspektasi ini bergantung pada urutan news — ubah bersama datanya.
    fireEvent.click(screen.getByText(news[1].title));
    expect(onNavigate).toHaveBeenLastCalledWith('berita-2');

    fireEvent.click(screen.getByText(news[2].title));
    expect(onNavigate).toHaveBeenLastCalledWith('berita-3');
  });

  it('navigates to the Berita listing from the "Lihat Semua" buttons', () => {
    const onNavigate = vi.fn();
    render(<BeritaKegiatanSection onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText('Lihat Semua'));
    expect(onNavigate).toHaveBeenLastCalledWith('Berita');

    fireEvent.click(screen.getByText('Lihat semua'));
    expect(onNavigate).toHaveBeenLastCalledWith('Berita');
  });

  it('renders teaser cards from the news dataset (1 pintu dengan BeritaPage)', () => {
    render(<BeritaKegiatanSection onNavigate={vi.fn()} />);

    // Wajah berita: featured + 2 item sekunder dari data `news`.
    expect(screen.getByText(news[0].title)).toBeDefined();
    expect(screen.getByText(news[1].title)).toBeDefined();
    expect(screen.getByText(news[2].title)).toBeDefined();
  });

  it('does not crash when onNavigate is not provided', () => {
    expect(() => render(<BeritaKegiatanSection />)).not.toThrow();
  });
});
