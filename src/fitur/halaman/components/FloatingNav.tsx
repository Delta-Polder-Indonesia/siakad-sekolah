import { useState, useEffect } from 'react';
import { ArrowUp, Bookmark, Heart } from 'lucide-react';

type Props = { contentId?: string };

export default function FloatingNav({ contentId = 'global' }: Props) {
  const [show, setShow] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api')
    .trim()
    .replace(/\/$/, '');

  useEffect(() => {
    const container = document.getElementById('berita-scroll-container');
    if (!container) return;

    const handleScroll = () => {
      setShow(container.scrollTop > 600);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Ambil jumlah like nyata dari API jika tersedia
  useEffect(() => {
    if (!API_BASE) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/likes/${encodeURIComponent(contentId)}`);
        if (!res.ok) return;
        const payload = await res.json();
        if (!mounted) return;
        setLikeCount(Number(payload.count) || 0);
        setLiked(Boolean(payload.userLiked));
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [API_BASE, contentId]);

  const scrollToTop = () => {
    const container = document.getElementById('berita-scroll-container');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`fixed right-5 bottom-6 z-[90] flex flex-col gap-2 transition-all duration-500 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'
      }`}
    >
      {/* Like */}
      <button
        type="button"
        onClick={async () => {
          // Optimistik UI
          setLiked((v) => !v);
          setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));

          if (API_BASE) {
            try {
              const res = await fetch(`${API_BASE}/likes/${encodeURIComponent(contentId)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              });
              if (!res.ok) return;
              const payload = await res.json();
              setLikeCount(Number(payload.count) || 0);
              setLiked(Boolean(payload.liked));
            } catch {
              // ignore network errors
            }
          }
        }}
        className={`group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-lg transition-all duration-200 ${
          liked
            ? 'border-red-200 bg-red-50 text-red-500'
            : 'border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:text-red-400'
        }`}
        aria-label="Suka"
      >
        <Heart className={`h-5 w-5 ${liked ? 'fill-red-500' : ''}`} />
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
          {likeCount}
        </span>
      </button>

      {/* Bookmark */}
      <button
        type="button"
        onClick={() => setSaved(!saved)}
        className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-lg transition-all duration-200 ${
          saved
            ? 'border-blue-200 bg-blue-50 text-blue-600'
            : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-500'
        }`}
        aria-label="Simpan"
      >
        <Bookmark className={`h-5 w-5 ${saved ? 'fill-blue-600' : ''}`} />
      </button>

      {/* Scroll to top */}
      <button
        type="button"
        onClick={scrollToTop}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
        aria-label="Kembali ke atas"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
