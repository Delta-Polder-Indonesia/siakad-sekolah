import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BackgroundSlideshow from './BackgroundSlideshow';
import type { BackgroundImage } from './types';

const images = [
  {
    src: '/a.webp',
    fallback: '/a.jpg',
    srcSet: '/a.webp 768w',
    caption: 'Fasilitas Pembelajaran Modern',
    description: 'd1',
  },
  {
    src: '/b.webp',
    fallback: '/b.jpg',
    caption: 'Kegiatan',
    description: 'd2',
  },
] as unknown as BackgroundImage[];

describe('BackgroundSlideshow', () => {
  it('tidak merender img slide pertama karena LCP sudah di HTML', () => {
    const { container } = render(<BackgroundSlideshow images={images} currentSlide={0} />);
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('merender img slide berikutnya', () => {
    const { container } = render(<BackgroundSlideshow images={images} currentSlide={1} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe('/b.jpg');
  });
});
