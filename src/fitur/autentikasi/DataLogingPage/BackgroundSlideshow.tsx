import { memo } from 'react';
import { BackgroundSlideshowProps } from './types';

const BackgroundSlideshow = memo<BackgroundSlideshowProps>(({ images, currentSlide }) => (
  <div className="absolute inset-0 z-0 bg-slate-900">
    {images.map((image, index) => {
      const isActive = index === currentSlide;
      // LCP: first image is always the Largest Contentful Paint candidate — preload + high priority
      const isLcp = index === 0;
      return (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={!isActive}
        >
          <picture>
            {/* WebP modern format where available — smaller transfer */}
            {image.src.endsWith('.webp') && image.fallback && (
              <source srcSet={image.src} type="image/webp" />
            )}
            <img
              src={image.fallback || image.src}
              alt={image.caption}
              className="h-full w-full object-cover"
              // LCP image: eager + high priority, others lazy + low priority (PSI performance)
              loading={isLcp ? 'eager' : 'lazy'}
              fetchPriority={isLcp ? 'high' : 'low'}
              decoding="async"
              width={1920}
              height={752}
              sizes="100vw"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </picture>
        </div>
      );
    })}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />
  </div>
));

BackgroundSlideshow.displayName = 'BackgroundSlideshow';

export default BackgroundSlideshow;
