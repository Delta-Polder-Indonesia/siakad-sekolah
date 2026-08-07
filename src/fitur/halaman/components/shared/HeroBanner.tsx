import { useState } from 'react';

interface HeroBannerProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  badge?: string;
  date?: string;
  subtitle?: string;
  maxHeight?: string;
  showGradient?: boolean;
  onImageError?: () => void;
}

export default function HeroBanner({
  imageSrc,
  imageAlt,
  title,
  badge,
  date,
  subtitle,
  maxHeight = 'max-h-[650px]',
  showGradient = true,
  onImageError,
}: HeroBannerProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  return (
    <div
      className={`relative h-[90vh] min-h-[280px] w-full overflow-hidden bg-slate-100 ${maxHeight}`}
    >
      {!imageError ? (
        <img
          src={`${import.meta.env.BASE_URL}${imageSrc}`}
          alt={imageAlt}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold tracking-wider text-slate-400 uppercase">
          Dokumentasi
        </div>
      )}

      {showGradient && (
        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      )}

      <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8 lg:p-10">
        {(badge || date) && (
          <div className="mb-3 flex items-center gap-3">
            {badge && (
              <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
                {badge}
              </span>
            )}
            {date && (
              <time
                dateTime={date}
                className="text-[10px] font-bold tracking-widest text-white/70 uppercase"
              >
                {date}
              </time>
            )}
          </div>
        )}

        <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-wide text-white uppercase drop-shadow-lg md:text-2xl lg:text-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm font-semibold text-slate-300 md:text-base">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
