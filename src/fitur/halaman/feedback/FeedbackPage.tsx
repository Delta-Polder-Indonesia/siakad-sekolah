import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { sendFeedbackToEmail, type Feedback } from '../../../data/services';
import {
  fetchFeedbackReviews,
  fetchFeedbackStats,
  submitFeedback,
  toggleFeedbackLikeApi,
} from '../../../services/feedbackService';
import { PageProps } from '../../../types';
import FeedbackButton from './components/FeedbackButton';
import { schoolConfig } from '../../../config/school';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Bug,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  MoreHorizontal,
  CheckCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Star,
  Pen,
  Heart,
  MoreVertical,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'bug', label: 'Bug/Error', icon: Bug },
  { value: 'saran', label: 'Saran Perbaikan', icon: Lightbulb },
  { value: 'keluhan', label: 'Keluhan', icon: AlertTriangle },
  { value: 'pertanyaan', label: 'Pertanyaan', icon: HelpCircle },
  { value: 'lainnya', label: 'Lainnya', icon: MoreHorizontal },
] as const;

const PRIORITIES = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
] as const;

export default function FeedbackPage({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [view, setView] = useState<'reviews' | 'form'>('reviews');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all');
  // Nomor tiket berasal dari id feedback asli (dari backend/store), bukan
  // random UUID yang tidak bisa dilacak.
  const [ticketId, setTicketId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
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
    }
  };

  const handleFilter = (filter: number | 'all') => {
    setActiveFilter(filter);
  };

  const filteredReviews = activeFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === activeFilter);

  // Helper function to format time ago
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

  // Helper function to generate avatar URL based on user name
  const generateAvatarUrl = (name: string): string => {
    // Using UI Avatars API for generating avatars based on initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      setTimeout(() => {
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
      <header className="border-b-2 border-black bg-white px-6 py-4 shadow-md">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (view === 'form') {
                    setView('reviews');
                  } else {
                    onNavigate?.('dashboard');
                  }
                }}
                className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{view === 'form' ? 'Kembali ke Reviews' : 'Kembali'}</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-blue-600">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-black">{view === 'reviews' ? 'Ratings & Reviews' : 'Form Feedback'}</h1>
                  <p className="text-xs text-gray-600">{view === 'reviews' ? 'Portal Pengaduan & Masukan' : 'Isi formulir di bawah ini'}</p>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {view === 'reviews' ? (
          /* Reviews View */
          <div className="max-w-4xl mx-auto">
            {reviewsLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <p className="mt-3 text-sm font-semibold">Memuat review...</p>
              </div>
            ) : (
            <>
            {/* Overall Rating Summary Card */}
            <div className="flex items-center my-4 py-2 gap-4 bg-white rounded-lg border-2 border-black p-6 shadow-xl">
              {/* Left: Numeric Rating */}
              <div className="flex flex-col items-center justify-center pr-2">
                <span className="text-[52px] font-extrabold text-black leading-none tracking-tight">{overallRating.toFixed(1)}</span>
                {/* 5 Stars */}
                {renderStars(Math.round(overallRating), 'text-lg')}
                <span className="text-xs font-semibold text-gray-500 mt-2.5">
                  ({totalReviews >= 1000 ? `${(totalReviews / 1000).toFixed(1)}k` : totalReviews} reviews)
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-32 bg-gray-200 mx-1"></div>

              {/* Right: Bar Progress Breakdown */}
              <div className="flex-1 flex flex-col justify-between h-32 pl-1 py-1">
                {[5, 4, 3, 2, 1].map((star, index) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-black w-3">{star}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
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
            <div className="flex items-center gap-2.5 overflow-x-auto py-3 my-2">
              {(['all', 5, 4, 3, 2, 1] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilter(filter)}
                  className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 shrink-0 transition-all ${
                    activeFilter === filter
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <Star className="text-xs" size={12} />
                  {filter === 'all' ? 'All' : filter}
                </button>
              ))}
            </div>

            {/* Reviews Container */}
            <div className="flex flex-col gap-7 mt-3">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <MessageSquare className="h-16 w-16 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">Belum Ada Review</h3>
                  <p className="text-sm text-gray-600 mb-4">Jadilah yang pertama memberikan review!</p>
                  <button
                    onClick={() => setView('form')}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors"
                  >
                    Tulis Review Pertama
                  </button>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={review.avatar || generateAvatarUrl(review.name)} 
                          alt={review.name} 
                          className="w-11 h-11 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-black text-[15px]">{review.name}</h3>
                          <p className="text-xs text-gray-500">{review.role || 'User'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.rating && (
                          <span className="px-3.5 py-1 rounded-full border-2 border-orange-500 text-orange-500 text-xs font-bold flex items-center gap-1">
                            <Star className="text-[10px]" size={10} /> {review.rating}
                          </span>
                        )}
                        <button className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-gray-300 text-black hover:bg-gray-100">
                          <MoreVertical className="text-xs" size={12} />
                        </button>
                      </div>
                    </div>
                    {review.subject && (
                      <h4 className="text-sm font-bold text-black mb-2">{review.subject}</h4>
                    )}
                    <p className="text-gray-700 text-[14px] leading-relaxed font-normal mb-3">
                      {review.message}
                    </p>
                    <div className="flex items-center gap-5 text-gray-500 text-xs font-medium">
                      <button 
                        onClick={() => handleLike(review.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          likedReviews[review.id] ? 'text-orange-500' : 'hover:text-orange-500'
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

            {/* Floating Write Review Action Button */}
            <div className="fixed bottom-6 right-6">
              <button
                onClick={() => setView('form')}
                className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Pen className="text-xl" size={20} />
              </button>
            </div>
            </>
            )}
          </div>
        ) : (
          /* Form View */
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              {submitStatus === 'success' ? (
              <div className="rounded-lg border-2 border-black bg-white p-8 text-center shadow-xl">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-600 bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h2 className="mb-4 text-xl font-bold text-black">Terima Kasih!</h2>
                <p className="mb-6 text-sm text-gray-600">
                  Feedback Anda telah berhasil dikirim. Kami akan segera memproses masukan Anda dan memberikan tanggapan yang diperlukan.
                </p>
<div className="rounded-md border-2 border-green-200 bg-green-50 px-4 py-3 text-sm">
          <p className="font-bold text-green-800">No. Tiket: FB-{(ticketId || '').slice(0, 8).toUpperCase()}</p>
          <p className="text-xs text-green-600">Simpan nomor ini untuk tracking</p>
        </div>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-black bg-white p-6 shadow-xl">
                <div className="mb-6 border-b-2 border-black pb-4">
                  <h2 className="text-base font-bold text-black">Formulir Feedback</h2>
                  <p className="text-xs text-gray-600">Isi formulir di bawah ini untuk mengirim masukan atau keluhan</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Section Informasi Pengirim */}
                  <div className="rounded-md border-2 border-black bg-slate-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-black">
                      <Shield className="h-4 w-4" />
                      Informasi Pengirim
                    </h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-black">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={isSubmitting}
                          className={`w-full rounded-md border-2 px-3 py-2.5 text-xs font-bold outline-none transition-colors ${
                            errors.name
                              ? 'border-red-600 bg-red-50 focus:border-red-800'
                              : 'border-black bg-white focus:border-blue-600'
                          }`}
                          placeholder="Masukkan nama lengkap"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-black">
                          Email (Opsional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={isSubmitting}
                          className={`w-full rounded-md border-2 px-3 py-2.5 text-xs font-bold outline-none transition-colors ${
                            errors.email
                              ? 'border-red-600 bg-red-50 focus:border-red-800'
                              : 'border-black bg-white focus:border-blue-600'
                          }`}
                          placeholder="email@contoh.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                        )}
                        <p className="mt-1 text-[10px] text-gray-500">
                          Opsional - untuk kami bisa menghubungi Anda jika perlu
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section Kategori & Prioritas */}
                  <div className="rounded-md border-2 border-black bg-slate-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-black">
                      <MapPin className="h-4 w-4" />
                      Kategori & Prioritas
                    </h3>
                    
                    <div className="mb-4">
                      <fieldset>
                        <legend className="mb-2 block text-xs font-bold text-black">Kategori *</legend>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Kategori feedback">
                          {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <label
                                key={cat.value}
                                className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 px-3 py-3 text-xs font-bold transition-colors bg-white text-black hover:bg-neutral-100 cursor-pointer ${
                                  formData.category === cat.value
                                    ? 'border-blue-600'
                                    : 'border-black'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="category"
                                  value={cat.value}
                                  checked={formData.category === cat.value}
                                  onChange={() => setFormData({ ...formData, category: cat.value })}
                                  disabled={isSubmitting}
                                  className="sr-only"
                                />
                                <Icon className="h-5 w-5" />
                                <span>{cat.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>

                    <div>
                      <fieldset>
                        <legend className="mb-2 block text-xs font-bold text-black">Prioritas *</legend>
                        <div className="flex gap-3" role="radiogroup" aria-label="Prioritas feedback">
                          {PRIORITIES.map((prio) => (
                            <label
                              key={prio.value}
                              className={`flex-1 flex items-center justify-center rounded-md border-2 px-4 py-2.5 text-xs font-bold transition-colors bg-white text-black hover:bg-neutral-100 cursor-pointer ${
                                formData.priority === prio.value
                                  ? 'border-blue-600'
                                  : 'border-black'
                              }`}
                            >
                              <input
                                type="radio"
                                name="priority"
                                value={prio.value}
                                checked={formData.priority === prio.value}
                                onChange={() => setFormData({ ...formData, priority: prio.value })}
                                disabled={isSubmitting}
                                className="sr-only"
                              />
                              {prio.label}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  {/* Section Detail Feedback */}
                  <div className="rounded-md border-2 border-black bg-slate-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-black">
                      <MessageSquare className="h-4 w-4" />
                      Detail Feedback
                    </h3>
                    
                    {/* Rating Field */}
                    <div className="mb-4">
                      <label className="mb-2 block text-xs font-bold text-black">
                        Rating *
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            disabled={isSubmitting}
                            className="transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`${
                                star <= formData.rating
                                  ? 'fill-orange-500 text-orange-500'
                                  : 'text-gray-300'
                              }`}
                              size={32}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-black">
                          {formData.rating} / 5
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-1 block text-xs font-bold text-black">
                        Subjek *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        disabled={isSubmitting}
                        className={`w-full rounded-md border-2 px-3 py-2.5 text-xs font-bold outline-none transition-colors ${
                          errors.subject
                            ? 'border-red-600 bg-red-50 focus:border-red-800'
                            : 'border-black bg-white focus:border-blue-600'
                        }`}
                        placeholder="Ringkasan feedback Anda"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-black">
                        Pesan *
                      </label>
                      <textarea
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        disabled={isSubmitting}
                        className={`w-full resize-none rounded-md border-2 px-3 py-2.5 text-xs font-bold outline-none transition-colors ${
                          errors.message
                            ? 'border-red-600 bg-red-50 focus:border-red-800'
                            : 'border-black bg-white focus:border-blue-600'
                        }`}
                        placeholder="Jelaskan feedback Anda secara detail..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[10px] text-gray-500">
                          Minimal 10 karakter
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {formData.message.length} karakter
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="rounded-md border-2 border-red-600 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
                      {errorMessage || 'Terjadi kesalahan saat mengirim feedback. Silakan coba lagi atau hubungi admin secara langsung.'}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setView('reviews')}
                      disabled={isSubmitting}
                      className="flex-1 rounded-md border-2 border-black bg-white px-6 py-3 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 rounded-md border-2 border-black bg-blue-600 px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Kirim Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="rounded-lg border-2 border-black bg-white p-6 shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-black">
                <Phone className="h-4 w-4" />
                Kontak Sekolah
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-black">Telepon</p>
                    <p className="text-xs text-gray-600">{schoolConfig.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-black">Email</p>
                    <p className="text-xs text-gray-600">{schoolConfig.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-black">Alamat</p>
                    <p className="text-xs text-gray-600">{schoolConfig.contact.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="rounded-lg border-2 border-black bg-white p-6 shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-black">
                <Clock className="h-4 w-4" />
                Jam Operasional
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{schoolConfig.hours.weekdays.label}</span>
                  <span className="font-bold text-black">{schoolConfig.hours.weekdays.open} - {schoolConfig.hours.weekdays.close}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{schoolConfig.hours.saturday.label}</span>
                  <span className="font-bold text-black">{schoolConfig.hours.saturday.open} - {schoolConfig.hours.saturday.close}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{schoolConfig.hours.sunday.label}</span>
                  <span className="font-bold text-red-600">Tutup</span>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-lg border-2 border-black bg-blue-50 p-6 shadow-xl">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-black">
                <Lightbulb className="h-4 w-4" />
                Informasi Penting
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">\u2022</span>
                  <span>Feedback akan diproses dalam {schoolConfig.feedback.processingTime}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">\u2022</span>
                  <span>Untuk masukan urgent, gunakan prioritas \"{schoolConfig.feedback.urgentPriorityLabel}\"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">\u2022</span>
                  <span>Include email untuk follow-up yang lebih cepat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">\u2022</span>
                  <span>Data Anda aman dan hanya digunakan untuk improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        )}
      </main>

      {/* Footer - Only show in form view */}
      {view === 'form' && (
        <footer className="mt-8 border-t-2 border-black bg-white px-6 py-4">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Portal Sekolah - Sistem Informasi Akademik
            </p>
            <p className="text-[10px] text-gray-500">
              Feedback Anda sangat berharga untuk meningkatkan kualitas layanan kami
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}