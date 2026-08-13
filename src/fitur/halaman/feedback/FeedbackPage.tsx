import { useState, useEffect, useCallback, useMemo, useRef, type FormEvent } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { sendFeedbackToEmail, type Feedback } from '../../../data/services';
import {
  fetchFeedbackReviews,
  fetchFeedbackStats,
  getAnonymousLikeId,
  submitFeedback,
  toggleFeedbackLikeApi,
  type FeedbackStats,
} from '../../../services/feedbackService';
import { useToast } from '../../../components/ui';
import { PageProps } from '../../../types';
import RatingsReviews from './RatingsReviews';
import FeedbackForm, { type FeedbackFormData } from './FeedbackForm';

const FIELD_LIMITS = {
  name: 120,
  email: 254,
  subject: 200,
  message: 5000,
} as const;

export default function FeedbackPage({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [view, setView] = useState<'reviews' | 'form'>('reviews');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all');
  // Nomor tiket berasal dari id feedback asli (dari backend/store), bukan
  // random UUID yang tidak bisa dilacak.
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FeedbackFormData>({
    name: user?.name || '',
    email: '',
    category: 'saran',
    subject: '',
    message: '',
    priority: 'sedang',
    rating: 5,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timer navigasi otomatis setelah submit sukses, dibersihkan saat unmount
  // atau saat user berpindah view/keluar lebih dulu.
  const navigateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelAutoNavigate = useCallback(() => {
    if (navigateTimerRef.current) {
      clearTimeout(navigateTimerRef.current);
      navigateTimerRef.current = null;
    }
  }, []);

  useEffect(() => cancelAutoNavigate, [cancelAutoNavigate]);

  // Data feedback (backend kalau aktif, else localStorage)
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const loadFeedback = useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const [list, stats] = await Promise.all([fetchFeedbackReviews(), fetchFeedbackStats()]);
      setReviews(list);
      setFeedbackStats(stats);
    } catch (error) {
      console.error('Error loading feedback:', error);
      setReviewsError('Gagal memuat ulasan. Silakan coba lagi.');
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeedback();
  }, [loadFeedback]);

  // Status like diturunkan langsung dari daftar review (single source of truth),
  // jadi tidak ada state terpisah yang bisa melenceng dari data. Pengunjung yang
  // belum login memakai ID perangkat yang stabil (getAnonymousLikeId) sehingga
  // tetap bisa menyukai & membatalkan suka.
  const likedReviews = useMemo(() => {
    const likerId = user?.id || getAnonymousLikeId();
    const liked: Record<string, boolean> = {};
    reviews.forEach((f) => {
      if (f.likedBy?.includes(likerId)) liked[f.id] = true;
    });
    return liked;
  }, [reviews, user?.id]);

  // Calculate rating statistics from real data
  const overallRating = feedbackStats?.averageRating || 0;
  const totalReviews = feedbackStats?.total || 0;
  const ratingCounts = [
    feedbackStats?.ratingBreakdown[5] || 0,
    feedbackStats?.ratingBreakdown[4] || 0,
    feedbackStats?.ratingBreakdown[3] || 0,
    feedbackStats?.ratingBreakdown[2] || 0,
    feedbackStats?.ratingBreakdown[1] || 0,
  ];

  // Persentase bar dihitung dari total review yang ber-rating — kalau pakai
  // totalReviews (termasuk feedback tanpa rating) angkanya jadi salah.
  const totalRated = ratingCounts.reduce((sum, n) => sum + n, 0);
  const ratingBreakdown =
    totalRated > 0
      ? ratingCounts.map((count) => Math.min(100, Math.max(0, (count / totalRated) * 100)))
      : [0, 0, 0, 0, 0];

  const pendingLikeIds = useRef(new Set<string>());

  const handleLike = useCallback(
    async (feedbackId: string) => {
      const likerId = user?.id || getAnonymousLikeId();
      if (pendingLikeIds.current.has(feedbackId)) return;
      pendingLikeIds.current.add(feedbackId);

      const snapshot = reviews;
      const wasLiked = Boolean(
        snapshot.find((r) => r.id === feedbackId)?.likedBy?.includes(likerId)
      );

      // Optimistik UI — status dan jumlah like diubah dari satu sumber (likedBy).
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id !== feedbackId) return r;
          const likedBy = wasLiked
            ? (r.likedBy || []).filter((id) => id !== likerId)
            : [...(r.likedBy || []), likerId];
          return { ...r, likedBy, likes: likedBy.length };
        })
      );

      try {
        const result = await toggleFeedbackLikeApi(feedbackId, likerId);
        // Terapkan hasil dari backend agar jumlah like sinkron tanpa fetch ulang
        // seluruh review.
        setReviews((prev) =>
          prev.map((r) => {
            if (r.id !== feedbackId) return r;
            const likedBy = result.liked
              ? [...new Set([...(r.likedBy || []), likerId])]
              : (r.likedBy || []).filter((id) => id !== likerId);
            return { ...r, likedBy, likes: result.likes };
          })
        );
      } catch (error) {
        console.error('Error toggling feedback like:', error);
        // Rollback ke kondisi sebelum klik
        setReviews(snapshot);
        showToast('error', 'Gagal memperbarui suka. Silakan coba lagi.');
      } finally {
        pendingLikeIds.current.delete(feedbackId);
      }
    },
    [reviews, user?.id, showToast]
  );

  const handleFilter = (filter: number | 'all') => {
    setActiveFilter(filter);
  };

  const filteredReviews =
    activeFilter === 'all' ? reviews : reviews.filter((review) => review.rating === activeFilter);

  const validateForm = (data: FeedbackFormData): Record<string, string> => {
    const next: Record<string, string> = {};

    const name = data.name.trim();
    if (!name) {
      next.name = 'Nama lengkap wajib diisi';
    } else if (name.length > FIELD_LIMITS.name) {
      next.name = `Nama maksimal ${FIELD_LIMITS.name} karakter`;
    }

    const email = data.email.trim();
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        next.email = 'Format email tidak valid';
      } else if (email.length > FIELD_LIMITS.email) {
        next.email = `Email maksimal ${FIELD_LIMITS.email} karakter`;
      }
    }

    const subject = data.subject.trim();
    if (!subject) {
      next.subject = 'Subjek wajib diisi';
    } else if (subject.length > FIELD_LIMITS.subject) {
      next.subject = `Subjek maksimal ${FIELD_LIMITS.subject} karakter`;
    }

    const message = data.message.trim();
    if (!message) {
      next.message = 'Pesan wajib diisi';
    } else if (message.length < 10) {
      next.message = 'Pesan minimal 10 karakter';
    } else if (message.length > FIELD_LIMITS.message) {
      next.message = `Pesan maksimal ${FIELD_LIMITS.message} karakter`;
    }

    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
      next.rating = 'Rating harus antara 1 dan 5';
    }

    return next;
  };

  const openForm = useCallback(() => {
    cancelAutoNavigate();
    setSubmitStatus('idle');
    setErrors({});
    setView('form');
  }, [cancelAutoNavigate]);

  const showReviews = useCallback(() => {
    cancelAutoNavigate();
    setSubmitStatus('idle');
    setView('reviews');
  }, [cancelAutoNavigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Trim sebelum validasi & dikirim, tanpa mengubah apa yang tampil di form.
    const trimmedData: FeedbackFormData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    const nextErrors = validateForm(trimmedData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);
    setTicketId(null);

    try {
      // Simpan feedback (backend kalau aktif, else localStorage)
      const feedback = await submitFeedback({
        name: trimmedData.name,
        email: trimmedData.email || undefined,
        role: user?.role || 'guest',
        category: trimmedData.category,
        subject: trimmedData.subject,
        message: trimmedData.message,
        priority: trimmedData.priority,
        rating: trimmedData.rating,
        likes: 0,
        likedBy: [],
      });

      // Kirim notifikasi email (opsional — tidak memblokir submit sukses)
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (adminEmail) {
        try {
          const emailResult = await sendFeedbackToEmail(feedback, adminEmail);
          if (!emailResult.success) {
            console.warn('Notifikasi email gagal dikirim:', emailResult.message);
          }
        } catch (emailError) {
          console.warn('Notifikasi email error:', emailError);
        }
      }

      setSubmitStatus('success');
      // Nomor tiket = id feedback asli (bisa dilacak admin)
      setTicketId(feedback.id);

      // Tampilkan feedback baru langsung di daftar, lalu sinkronkan ulasan & statistik.
      setReviews((prev) => [feedback, ...prev.filter((f) => f.id !== feedback.id)]);
      void loadFeedback();

      // Reset form
      setFormData({
        name: user?.name || '',
        email: '',
        category: 'saran',
        subject: '',
        message: '',
        priority: 'sedang',
        rating: 5,
      });
      setErrors({});

      // Arahkan ke daftar ulasan setelah beberapa detik agar user melihat hasilnya.
      cancelAutoNavigate();
      navigateTimerRef.current = setTimeout(() => {
        showReviews();
      }, 4000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMsg = error instanceof Error ? error.message : 'Terjadi kesalahan tidak dikenal';
      setErrorMessage(errorMsg);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (view === 'form') {
                  showReviews();
                } else {
                  onNavigate?.('dashboard');
                }
              }}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {view === 'reviews' ? 'Ratings & Reviews' : 'Form Feedback'}
                </h1>
                <p className="text-xs text-gray-500">
                  {view === 'reviews' ? 'Portal Pengaduan & Masukan' : 'Isi formulir di bawah ini'}
                </p>
              </div>
            </div>
          </div>
          {view === 'reviews' ? (
            <button
              type="button"
              onClick={openForm}
              className="rounded-md bg-orange-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-orange-600"
            >
              Tulis Ulasan
            </button>
          ) : (
            <div className="text-xs text-gray-500">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {view === 'reviews' ? (
          <RatingsReviews
            reviewsLoading={reviewsLoading}
            reviewsError={reviewsError}
            onRetry={() => void loadFeedback()}
            hasReviews={reviews.length > 0}
            overallRating={overallRating}
            totalReviews={totalReviews}
            ratingCounts={ratingCounts}
            ratingBreakdown={ratingBreakdown}
            activeFilter={activeFilter}
            onFilter={handleFilter}
            filteredReviews={filteredReviews}
            likedReviews={likedReviews}
            onLike={handleLike}
            onWriteReview={openForm}
          />
        ) : (
          <FeedbackForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            isSubmitting={isSubmitting}
            submitStatus={submitStatus}
            ticketId={ticketId}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
            onBack={showReviews}
            onViewReviews={showReviews}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Portal Sekolah - Sistem Informasi Akademik
          </p>
          <p className="text-[10px] text-gray-500">
            Feedback Anda sangat berharga untuk meningkatkan kualitas layanan kami
          </p>
        </div>
      </footer>
    </div>
  );
}
