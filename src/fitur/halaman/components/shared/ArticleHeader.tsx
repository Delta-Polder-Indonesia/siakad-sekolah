import { ArrowLeft } from 'lucide-react';
import { useBackNavigation } from '../../context/NavigationContext';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

interface ArticleHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  showLogo?: boolean;
}

export default function ArticleHeader({
  title,
  subtitle,
  category,
  showLogo = true,
}: ArticleHeaderProps) {
  const goBack = useBackNavigation();

  return (
    <div className="absolute top-6 left-6 z-20 flex flex-shrink-0 items-center gap-2 md:gap-3">
      <button
        type="button"
        onClick={goBack}
        aria-label="Kembali"
        className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-white/15"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {showLogo && (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md shadow-black/30 md:h-10 md:w-10">
            <img
              src={`${import.meta.env.BASE_URL}images/logo/gambar-2.svg`}
              alt={`Logo ${namaSekolahUppercase}`}
              className="h-full w-full object-cover"  loading="lazy" decoding="async" />
          </div>
          <div>
            <h1 className="text-sm leading-tight font-bold tracking-tight text-white drop-shadow-md md:text-base lg:text-lg">
              {namaSekolahUppercase}
            </h1>
            {subtitle && (
              <p className="hidden text-[9px] font-semibold tracking-[0.12em] text-white/80 uppercase drop-shadow sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {category && !showLogo && (
        <div>
          <h1 className="text-sm leading-tight font-bold tracking-tight text-white drop-shadow-md md:text-base lg:text-lg">
            {category}
          </h1>
          {subtitle && (
            <p className="hidden text-[9px] font-semibold tracking-[0.12em] text-white/80 uppercase drop-shadow sm:block">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
