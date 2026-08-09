import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { sendFeedbackToEmail, type Feedback } from '../../../data/services';
import {
  fetchFeedbackReviews,
  fetchFeedbackStats,
  submitFeedback,
  toggleFeedbackLikeApi,
} from '../../../services/feedbackService';
import { PageProps } from '../../../types';
import RatingsReviews from './RatingsReviews';
import FeedbackForm, { type FeedbackFormData } from './FeedbackForm';

export default function FeedbackPage({ onNavigate }: PageProps) {
  const { user } = useAuth();
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
    category: 'saran' as Feedback['category'],
    subject: '',
    message: '',
    priority: 'sedang' as Feedback['priority'],
    rating: 5 as number, // Default rating
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

  // Load real feedback data (dari backend kalau aktif, else localStorage)
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [feedbackStats, setFeedbackStats] = useState<Awaited<ReturnType<typeof fetchFeedbackStats>> | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const refreshReviews = useCallback(async () => {
    const list = await fetchFeedbackReviews();
    setReviews(list);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [list, stats] = await Promise.all([fetchFeedbackReviews(), fetchFeedbackStats()]);
        if (!mounted) return;
        setReviews(list);
        setFeedbackStats(stats);
      } catch (error) {
        console.error('Error loading feedback:', error);
      } finally {
        if (mounted) setReviewsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Rekomputasi status like setelah daftar review berubah
  useEffect(() => {
    if (!user?.id) return;
    const liked: Record<string, boolean> = {};
    reviews.forEach((f) => {
      if (f.likedBy?.includes(user.id)) liked[f.id] = true;
    });
    setLikedReviews(liked);
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
  const ratingBreakdown = totalRated > 0
    ? ratingCounts.map((count) => (count / totalRated) * 100)
    : [0, 0, 0, 0, 0];

  const handleLike = async (feedbackId: string) => {
    if (!user?.id) return;

    // Optimistik UI
    setLikedReviews(prev => ({
      ...prev,
      [feedbackId]: !prev[feedbackId]
    }));

    try {
      await toggleFeedbackLikeApi(feedbackId, user.id);
      // Refresh reviews to get updated like counts
      setReviews(await fetchFeedbackReviews());
    } catch (error) {
      console.error('Error toggling feedback like:', error);
      // Revert optimistic UI agar tidak melenceng dari data sebenarnya
      setLikedReviews(prev => ({
        ...prev,
        [feedbackId]: !prev[feedbackId]
      }));
    }
  };

  const handleFilter = (filter: number | 'all') => {
    setActiveFilter(filter);
  };

  const filteredReviews = activeFilter === 'all'
    ? reviews
    : reviews.filter(review => review.rating === activeFilter);

  // Helper function to generate avatar URL based on user name
  const generateAvatarUrl = (name: string): string => {
    // Using UI Avatars API for generating avatars based on initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subjek wajib diisi';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Pesan wajib diisi';
    }

    if (formData.message.length < 10) {
      newErrors.message = 'Pesan minimal 10 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);
    setTicketId(null);

    try {
      // Simpan feedback (backend kalau aktif, else localStorage)
      const feedback = await submitFeedback({
        name: formData.name,
        email: formData.email || undefined,
        role: user?.role || 'guest',
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        rating: formData.rating,
        avatar: generateAvatarUrl(formData.name),
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

      // Kembali ke halaman sebelumnya setelah 3 detik
      cancelAutoNavigate();
      navigateTimerRef.current = setTimeout(() => {
        setSubmitStatus('idle');
        setView('reviews');
        // Refresh reviews to show the new feedback
        refreshReviews();
        onNavigate?.('dashboard');
      }, 3000);
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
                  cancelAutoNavigate();
                  setView('reviews');
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
                <h1 className="text-lg font-semibold text-gray-900">{view === 'reviews' ? 'Ratings & Reviews' : 'Form Feedback'}</h1>
                <p className="text-xs text-gray-500">{view === 'reviews' ? 'Portal Pengaduan & Masukan' : 'Isi formulir di bawah ini'}</p>
              </div>
            </div>
          </div>
          {view === 'reviews' ? (
            <button
              type="button"
              onClick={() => setView('form')}
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
                day: 'numeric'
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
            overallRating={overallRating}
            totalReviews={totalReviews}
            ratingCounts={ratingCounts}
            ratingBreakdown={ratingBreakdown}
            activeFilter={activeFilter}
            onFilter={handleFilter}
            filteredReviews={filteredReviews}
            likedReviews={likedReviews}
            onLike={handleLike}
            onWriteReview={() => setView('form')}
            generateAvatarUrl={generateAvatarUrl}
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
            onBack={() => {
              cancelAutoNavigate();
              setView('reviews');
            }}
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
