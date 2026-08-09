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
    <div className="max-w-4xl mx-auto">
      {/* Overall Rating Summary Card */}
      <div className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-6">
            {/* Left: Numeric Rating */}
            <div className="flex flex-col items-center justify-center pr-2">
              <span className="text-4xl font-bold text-gray-900 leading-none tracking-tight">{overallRating.toFixed(1)}</span>
              {/* 5 Stars */}
              {renderStars(Math.round(overallRating), 'text-lg')}
              <span className="text-xs font-medium text-gray-500 mt-2">
                ({totalReviews >= 1000 ? `${(totalReviews / 1000).toFixed(1)}k` : totalReviews} reviews)
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-32 bg-gray-200"></div>

            {/* Right: Bar Progress Breakdown */}
            <div className="flex-1 flex flex-col justify-between h-32 pl-1 py-1">
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-3">{star}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${ratingBreakdown[index]}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{ratingCounts[index]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Pills Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto py-4 my-2">
            {(['all', 5, 4, 3, 2, 1] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => onFilter(filter)}
                className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-1.5 shrink-0 transition-colors ${
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
            <div className="flex flex-col gap-4 mt-3">
              {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <MessageSquare className="h-16 w-16 text-gray-200" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Review</h3>
                <p className="text-sm text-gray-600 mb-4">Jadilah yang pertama memberikan review!</p>
                <button
                  onClick={onWriteReview}
                  className="px-6 py-2.5 bg-orange-500 text-white rounded-md font-medium text-sm hover:bg-orange-600 transition-colors"
                >
                  Tulis Review Pertama
                </button>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.avatar || generateAvatarUrl(review.name)}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{review.name}</h3>
                        <p className="text-xs text-gray-500">{review.role || 'User'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.rating && (
                        <span className="px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium flex items-center gap-1">
                          <Star className="text-[10px]" size={10} /> {review.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  {review.subject && (
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{review.subject}</h4>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {review.message}
                  </p>
                  <div className="flex items-center gap-5 text-gray-500 text-xs font-medium">
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
              )))}
            </div>
          )}
        </div>
      );
}
