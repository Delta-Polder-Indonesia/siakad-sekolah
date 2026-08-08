import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  addFeedback,
  sendFeedbackToEmail,
  getFeedbackStats,
  type Feedback,
} from '../../../data/services';
import { PageProps } from '../../../types';
import FeedbackButton from './components/FeedbackButton';
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
} from 'lucide-react';

const CATEGORIES = [
  { value: 'bug', label: 'Bug/Error', icon: Bug, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { value: 'saran', label: 'Saran Perbaikan', icon: Lightbulb, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { value: 'keluhan', label: 'Keluhan', icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { value: 'pertanyaan', label: 'Pertanyaan', icon: HelpCircle, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { value: 'lainnya', label: 'Lainnya', icon: MoreHorizontal, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
] as const;

const PRIORITIES = [
  { value: 'rendah', label: 'Rendah', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { value: 'sedang', label: 'Sedang', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { value: 'tinggi', label: 'Tinggi', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
] as const;

export default function FeedbackPage({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: '',
    category: 'saran' as Feedback['category'],
    subject: '',
    message: '',
    priority: 'sedang' as Feedback['priority'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    try {
      // Simpan feedback ke localStorage
      const feedback = addFeedback({
        name: formData.name,
        email: formData.email || undefined,
        role: user?.role || 'guest',
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
      });

      // Kirim ke email (gunakan environment variable untuk email admin)
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@sekolah.com';
      const emailResult = await sendFeedbackToEmail(feedback, adminEmail);

      if (emailResult.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: user?.name || '',
          email: '',
          category: 'saran',
          subject: '',
          message: '',
          priority: 'sedang',
        });
        
        // Kembali ke halaman sebelumnya setelah 3 detik
        setTimeout(() => {
          setSubmitStatus('idle');
          onNavigate?.('dashboard');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
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
                onClick={() => onNavigate?.('dashboard')}
                className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-blue-600">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-black">Form Feedback</h1>
                  <p className="text-xs text-gray-600">Portal Pengaduan & Masukan</p>
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
                  <p className="font-bold text-green-800">No. Tiket: FB-{Date.now().toString().slice(-6)}</p>
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
                      <label className="mb-2 block text-xs font-bold text-black">
                        Kategori *
                      </label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, category: cat.value })}
                              disabled={isSubmitting}
                              className={`flex flex-col items-center gap-2 rounded-md border-2 px-3 py-3 text-xs font-bold transition-colors ${
                                formData.category === cat.value
                                  ? `${cat.bgColor} ${cat.borderColor} ${cat.color} border-2`
                                  : 'border-black bg-white text-black hover:bg-neutral-100'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-black">
                        Prioritas *
                      </label>
                      <div className="flex gap-3">
                        {PRIORITIES.map((prio) => (
                          <button
                            key={prio.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority: prio.value })}
                            disabled={isSubmitting}
                            className={`flex-1 rounded-md border-2 px-4 py-2.5 text-xs font-bold transition-colors ${
                              formData.priority === prio.value
                                ? `${prio.bgColor} ${prio.borderColor} ${prio.color} border-2`
                                : 'border-black bg-white text-black hover:bg-neutral-100'
                            }`}
                          >
                            {prio.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section Detail Feedback */}
                  <div className="rounded-md border-2 border-black bg-slate-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-black">
                      <MessageSquare className="h-4 w-4" />
                      Detail Feedback
                    </h3>
                    
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
                      Terjadi kesalahan saat mengirim feedback. Silakan coba lagi atau hubungi admin secara langsung.
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate?.('dashboard')}
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
                    <p className="text-xs text-gray-600">+62 XXX XXX XXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-black">Email</p>
                    <p className="text-xs text-gray-600">info@sekolah.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-black">Alamat</p>
                    <p className="text-xs text-gray-600">Jl. Pendidikan No. 123</p>
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
                  <span className="text-gray-600">Senin - Jumat</span>
                  <span className="font-bold text-black">07:00 - 16:00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Sabtu</span>
                  <span className="font-bold text-black">07:00 - 12:00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Minggu</span>
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
                  <span className="text-blue-600">•</span>
                  <span>Feedback akan diproses dalam 1-2 hari kerja</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Untuk masukan urgent, gunakan prioritas "Tinggi"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Include email untuk follow-up yang lebih cepat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Data Anda aman dan hanya digunakan untuk improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
    </div>
  );
}