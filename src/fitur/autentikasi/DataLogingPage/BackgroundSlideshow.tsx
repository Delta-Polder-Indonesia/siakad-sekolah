import { memo } from 'react';
import { BackgroundSlideshowProps } from './types';

const BackgroundSlideshow = memo<BackgroundSlideshowProps>(({ images, currentSlide }) => (
  <div className="absolute inset-0 z-0 bg-slate-900">
    {images.map((image, index) => (
      <div
        key={image.src}
        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
          index === currentSlide ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={index !== currentSlide}
      >
        <img
          src={image.src}
          alt={image.caption}
          className="h-full w-full"
          loading={index === 0 ? 'eager' : 'lazy'}
          width={1920}
          height={1080}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    ))}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />
  </div>
));

BackgroundSlideshow.displayName = 'BackgroundSlideshow';

export default BackgroundSlideshow;
