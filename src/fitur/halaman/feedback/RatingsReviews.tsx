import { Star, MessageSquare, Loader2, Heart } from 'lucide-react';
import type { Feedback } from '../../../data/services';

interface RatingsReviewsProps {
  reviewsLoading: boolean;
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
  generateAvatarUrl: (name: string) => string;
}

export default function RatingsReviews({
  reviewsLoading,
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
  generateAvatarUrl,
}: RatingsReviewsProps) {
  const renderStars = (rating: number, size = 'text-sm') => {
    return (
      <div className={`flex items-center text-orange-500 ${size} gap-1`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${
              star <= Math.floor(rating)
                ? 'fill-orange-500'
                : star === Math.ceil(rating) && rating % 1 !== 0
                  ? 'fill-orange-500/50'
                  : 'text-gray-300'
            }`}
            size={size === 'text-lg' ? 20 : 16}
          />
        ))}
      </div>
    );
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit yang lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam yang lalu`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari yang lalu`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} minggu yang lalu`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} bulan yang lalu`;
    return `${Math.floor(seconds / 31536000)} tahun yang lalu`;
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Overall Rating Summary Card */}
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
        {/* Left: Numeric Rating */}
        <div className="flex flex-col items-center justify-center pr-2">
          <span className="text-4xl leading-none font-bold tracking-tight text-gray-900">
            {overallRating.toFixed(1)}
          </span>
          {/* 5 Stars */}
          {renderStars(Math.round(overallRating), 'text-lg')}
          <span className="mt-2 text-xs font-medium text-gray-500">
            ({totalReviews >= 1000 ? `${(totalReviews / 1000).toFixed(1)}k` : totalReviews} reviews)
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
        {(['all', 5, 4, 3, 2, 1] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onFilter(filter)}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star className="text-xs" size={12} />
            {filter === 'all' ? 'All' : filter}
          </button>
        ))}
      </div>

      {/* Reviews Container */}
      {reviewsLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="mt-3 text-sm font-medium">Memuat review...</p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          {filteredReviews.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 flex justify-center">
                <MessageSquare className="h-16 w-16 text-gray-200" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Belum Ada Review</h3>
              <p className="mb-4 text-sm text-gray-600">Jadilah yang pertama memberikan review!</p>
              <button
                onClick={onWriteReview}
                className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
              >
                Tulis Review Pertama
              </button>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar || generateAvatarUrl(review.name)}
                      alt={review.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{review.name}</h3>
                      <p className="text-xs text-gray-500">{review.role || 'User'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.rating && (
                      <span className="flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                        <Star className="text-[10px]" size={10} /> {review.rating}
                      </span>
                    )}
                  </div>
                </div>
                {review.subject && (
                  <h4 className="mb-2 text-sm font-semibold text-gray-900">{review.subject}</h4>
                )}
                <p className="mb-3 text-sm leading-relaxed text-gray-600">{review.message}</p>
                <div className="flex items-center gap-5 text-xs font-medium text-gray-500">
                  <button
                    onClick={() => onLike(review.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      likedReviews[review.id] ? 'text-orange-600' : 'hover:text-orange-600'
                    }`}
                  >
                    <Heart
                      className={`text-base ${likedReviews[review.id] ? 'fill-orange-500' : ''}`}
                      size={16}
                    />
                    <span>{review.likes || 0}</span>
                  </button>
                  <span>{formatTimeAgo(review.submittedAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
