import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const HIDE_KEY = 'feedback_button_hidden_until';
const HIDE_DURATION_MS = 5 * 60 * 1000;

function getHiddenUntil(): number {
  try {
    return Number(localStorage.getItem(HIDE_KEY) || 0);
  } catch {
    return 0;
  }
}

interface FeedbackButtonProps {
  onNavigate: (page: string) => void;
}

export default function FeedbackButton({ onNavigate }: FeedbackButtonProps) {
  const [hidden, setHidden] = useState(() => getHiddenUntil() > Date.now());

  useEffect(() => {
    const remaining = getHiddenUntil() - Date.now();
    if (remaining <= 0) return;
    const timer = setTimeout(() => setHidden(false), remaining);
    return () => clearTimeout(timer);
  }, [hidden]);

  if (hidden) return null;

  const handleHide = () => {
    try {
      localStorage.setItem(HIDE_KEY, String(Date.now() + HIDE_DURATION_MS));
    } catch {
      // Abaikan — tombol tetap disembunyikan selama sesi berjalan.
    }
    setHidden(true);
  };

  return (
    <div className="group fixed right-6 bottom-6 z-50">
      <div className="relative">
        {/* Close Button — hanya muncul saat hover */}
        <button
          type="button"
          onClick={handleHide}
          aria-label="Sembunyikan tombol feedback sementara"
          title="Sembunyikan sementara (5 menit)"
          className="pointer-events-none absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-white text-black opacity-0 shadow-sm transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
        {/* Main Button */}
        <button
          type="button"
          onClick={() => onNavigate('feedback')}
          aria-label="Kirim Feedback"
          title="Kirim Feedback"
          className="transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <picture>
            <source srcSet={`${import.meta.env.BASE_URL}images/Dashboard/hubungikami.webp`} type="image/webp" />
            <img
              src={`${import.meta.env.BASE_URL}images/Dashboard/hubungikami.png`}
              alt="Hubungi kami — kirim feedback"
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
              loading="lazy"
              decoding="async"
              width={64}
              height={64}
            />
          </picture>
        </button>
      </div>
    </div>
  );
}
