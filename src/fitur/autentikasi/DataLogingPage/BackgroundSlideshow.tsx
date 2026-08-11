import { memo } from 'react';
import { BackgroundSlideshowProps } from './types';

const BackgroundSlideshow = memo<BackgroundSlideshowProps>(({ images, currentSlide }) => (
  <div className="absolute inset-0 z-0 bg-slate-900">
    {images.map((image, index) => {
      const isActive = index === currentSlide;
      const isNear = index === (currentSlide + 1) % images.length;
      // Only keep the visible slide (and the next one after first) in the DOM
      // so PSI does not download 5 full-bleed photos on first paint.
      if (!isActive && !(currentSlide > 0 && isNear)) return null;

      const isHtmlLcp = index === 0;
      return (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={!isActive}
        >
          {/* Slide 0: gambar LCP sudah ada di index.html (#lcp-hero) agar
              Lighthouse tidak menunggu JS. Jangan remount <img> yang sama. */}
          {isHtmlLcp ? null : (
            <picture>
              {image.src.endsWith('.webp') && (
                <source
                  type="image/webp"
                  srcSet={image.srcSet || image.src}
                  sizes="100vw"
                />
              )}
              <img
                src={image.fallback || image.src}
                alt={isActive ? image.caption : ''}
                className="h-full w-full object-cover"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
                width={1920}
                height={752}
                sizes="100vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </picture>
          )}
        </div>
      );
    })}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />
  </div>
));

BackgroundSlideshow.displayName = 'BackgroundSlideshow';

export default BackgroundSlideshow;
