import { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2, Heart, RefreshCw } from 'lucide-react';
import type { Feedback } from '../../../data/services';

interface RatingsReviewsProps {
  reviewsLoading: boolean;
  reviewsError: string | null;
  onRetry: () => void;
  hasReviews: boolean;
  overallRating: number;
  totalReviews: number;
  ratingCounts: number[];
  ratingBreakdown: number[];
  activeFilter: number | 'all';
  onFilter: (filter: number | 'all') => void;
  filteredReviews: Feedback[];
  likedReviews: Record<string, boolean>;
  onLike: (feedbackId: string) => void;
  onWriteReview: () => void;
}

// Menampilkan rating desimal (mis. 4.5) dengan setengah bintang yang digambar
// lewat pemotongan lebar overlay, bukan sekadar opacity 50%.
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const clamped = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  const percentage = (clamped / 5) * 100;
  const label = `${clamped.toFixed(1)} dari 5 bintang`;

  return (
    <div role="img" aria-label={label} className="relative inline-flex">
      <div className="flex gap-1 text-gray-300">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={size} />
        ))}
      </div>
      <div
        className="absolute inset-0 flex gap-1 overflow-hidden text-orange-500"
        style={{ width: `${percentage}%` }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={size} className="shrink-0 fill-orange-500" />
        ))}
      </div>
    </div>
  );
}

// Avatar dengan fallback inisial lokal — tanpa ketergantungan layanan pihak
// ketiga seperti ui-avatars.com. Kalau URL avatar gagal dimuat, otomatis
// menampilkan inisial nama.
function Avatar({ name, src }: { name: string; src?: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"
      >
        {initials || '?'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      loading="lazy"
      className="h-10 w-10 shrink-0 rounded-full object-cover"
    />
  );
}

function formatTimeAgo(timestamp: number): string {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return 'Waktu tidak diketahui';

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (seconds < 60) return 'Baru saja';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit yang lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam yang lalu`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari yang lalu`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} minggu yang lalu`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} bulan yang lalu`;
  return `${Math.floor(seconds / 31536000)} tahun yang lalu`;
}

export default function RatingsReviews({
  reviewsLoading,
  reviewsError,
  onRetry,
  hasReviews,
  overallRating,
  totalReviews,
  ratingCounts,
  ratingBreakdown,
  activeFilter,
  onFilter,
  filteredReviews,
  likedReviews,
  onLike,
  onWriteReview,
}: RatingsReviewsProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Overall Rating Summary Card */}
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
        {/* Left: Numeric Rating */}
        <div className="flex flex-col items-center justify-center pr-2">
          <span className="text-4xl leading-none font-bold tracking-tight text-gray-900">
            {overallRating.toFixed(1)}
          </span>
          <div className="mt-1">
            <StarRating rating={overallRating} size={20} />
          </div>
          <span className="mt-2 text-xs font-medium text-gray-500">
            ({totalReviews >= 1000 ? `${(totalReviews / 1000).toFixed(1)}k` : totalReviews} ulasan)
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-32 w-px bg-gray-200"></div>

        {/* Right: Bar Progress Breakdown */}
        <div className="flex h-32 flex-1 flex-col justify-between py-1 pl-1">
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div key={star} className="flex items-center gap-3">
              <span className="w-3 text-sm font-medium text-gray-700">{star}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{ width: `${ratingBreakdown[index]}%` }}
                ></div>
              </div>
              <span className="w-8 text-xs text-gray-500">{ratingCounts[index]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Pills Horizontal Scroll */}
      <div className="my-2 flex items-center gap-2 overflow-x-auto py-4">
        {(['all', 5, 4, 3, 2, 1] as const).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => onFilter(filter)}
              aria-pressed={isActive}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Star className="text-xs" size={12} />
              {filter === 'all' ? 'Semua' : filter}
            </button>
          );
        })}
      </div>

      {/* Reviews Container */}
      {reviewsLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="mt-3 text-sm font-medium">Memuat ulasan...</p>
        </div>
      ) : reviewsError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="h-12 w-12 text-gray-200" />
          <p className="mt-3 text-sm font-medium text-gray-700">{reviewsError}</p>
          <button
            onClick={onRetry}
            className="mt-4 flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          {filteredReviews.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 flex justify-center">
                <MessageSquare className="h-16 w-16 text-gray-200" />
              </div>
              {hasReviews ? (
                <>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Tidak Ada Ulasan dengan Rating Ini
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Coba pilih rating lain atau tampilkan semua ulasan.
                  </p>
                  <button
                    onClick={() => onFilter('all')}
                    className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                  >
                    Tampilkan Semua
                  </button>
                </>
              ) : (
                <>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Belum Ada Ulasan</h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Jadilah yang pertama memberikan ulasan!
                  </p>
                  <button
                    onClick={onWriteReview}
                    className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                  >
                    Tulis Ulasan Pertama
                  </button>
                </>
              )}
            </div>
          ) : (
            filteredReviews.map((review) => {
              const isLiked = Boolean(likedReviews[review.id]);
              return (
                <div key={review.id} className="rounded-lg border border-gray-200 bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={review.name} src={review.avatar} />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{review.name}</h3>
                        <p className="text-xs text-gray-500">{review.role || 'User'}</p>
                      </div>
                    </div>
                    {review.rating ? (
                      <span className="flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                        <Star className="text-[10px]" size={10} /> {review.rating}
                      </span>
                    ) : null}
                  </div>
                  {review.subject && (
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">{review.subject}</h4>
                  )}
                  <p className="mb-3 text-sm leading-relaxed text-gray-600">{review.message}</p>
                  <div className="flex items-center gap-5 text-xs font-medium text-gray-500">
                    <button
                      onClick={() => onLike(review.id)}
                      aria-label={
                        isLiked
                          ? `Hapus suka untuk ulasan dari ${review.name}`
                          : `Sukai ulasan dari ${review.name}`
                      }
                      aria-pressed={isLiked}
                      className={`flex items-center gap-1.5 transition-colors ${
                        isLiked ? 'text-orange-600' : 'hover:text-orange-600'
                      }`}
                    >
                      <Heart className={`text-base ${isLiked ? 'fill-orange-500' : ''}`} size={16} />
                      <span>{review.likes || 0}</span>
                    </button>
                    <span>{formatTimeAgo(review.submittedAt)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
