import { type Dispatch, type FormEvent, type SetStateAction } from 'react';
import {
  Send,
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
  MessageSquare,
} from 'lucide-react';
import type { Feedback } from '../../../data/services';
import { schoolConfig } from '../../../config/school';

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

export interface FeedbackFormData {
  name: string;
  email: string;
  category: Feedback['category'];
  subject: string;
  message: string;
  priority: Feedback['priority'];
  rating: number;
}

interface FeedbackFormProps {
  formData: FeedbackFormData;
  setFormData: Dispatch<SetStateAction<FeedbackFormData>>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  ticketId: string | null;
  errorMessage: string | null;
  onSubmit: (e: FormEvent) => void;
  onBack: () => void;
}

export default function FeedbackForm({
  formData,
  setFormData,
  errors,
  isSubmitting,
  submitStatus,
  ticketId,
  errorMessage,
  onSubmit,
  onBack,
}: FeedbackFormProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left Column - Form */}
      <div className="lg:col-span-2">
        {submitStatus === 'success' ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-green-50">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Terima Kasih!</h2>
            <p className="mb-6 text-sm text-gray-600">
              Feedback Anda telah berhasil dikirim. Kami akan segera memproses masukan Anda dan memberikan tanggapan yang diperlukan.
            </p>
            <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm">
              <p className="font-medium text-green-800">No. Tiket: FB-{(ticketId || '').slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-green-600">Simpan nomor ini untuk tracking</p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-base font-semibold text-gray-900">Formulir Feedback</h2>
              <p className="text-xs text-gray-500">Isi formulir di bawah ini untuk mengirim masukan atau keluhan</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Section Informasi Pengirim */}
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Shield className="h-4 w-4" />
                  Informasi Pengirim
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isSubmitting}
                      className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none transition-colors ${
                        errors.name
                          ? 'border-red-500 bg-red-50 focus:border-red-600'
                          : 'border-gray-300 bg-white focus:border-blue-600'
                      }`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSubmitting}
                      className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none transition-colors ${
                        errors.email
                          ? 'border-red-500 bg-red-50 focus:border-red-600'
                          : 'border-gray-300 bg-white focus:border-blue-600'
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
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <MapPin className="h-4 w-4" />
                  Kategori & Prioritas
                </h3>

                <div className="mb-4">
                  <fieldset>
                    <legend className="mb-2 block text-xs font-medium text-gray-700">Kategori *</legend>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Kategori feedback">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <label
                            key={cat.value}
                            className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-xs font-medium transition-colors bg-white cursor-pointer ${
                              formData.category === cat.value
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:bg-gray-50'
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
                            <Icon
                              className={`h-4 w-4 shrink-0 ${
                                formData.category === cat.value ? 'text-blue-600' : 'text-gray-500'
                              }`}
                            />
                            <span className="text-gray-900">{cat.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>

                <div>
                  <fieldset>
                    <legend className="mb-2 block text-xs font-medium text-gray-700">Prioritas *</legend>
                    <div className="flex gap-3" role="radiogroup" aria-label="Prioritas feedback">
                      {PRIORITIES.map((prio) => (
                        <label
                          key={prio.value}
                          className={`flex-1 flex items-center justify-center rounded-md border px-4 py-2.5 text-xs font-medium transition-colors bg-white text-gray-700 hover:bg-gray-50 cursor-pointer ${
                            formData.priority === prio.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-300'
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
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <MessageSquare className="h-4 w-4" />
                  Detail Feedback
                </h3>

                {/* Rating Field */}
                <div className="mb-4">
                  <label className="mb-2 block text-xs font-medium text-gray-700">
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
                    <span className="ml-2 text-xs font-medium text-gray-700">
                      {formData.rating} / 5
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Subjek *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    disabled={isSubmitting}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none transition-colors ${
                      errors.subject
                        ? 'border-red-500 bg-red-50 focus:border-red-600'
                        : 'border-gray-300 bg-white focus:border-blue-600'
                    }`}
                    placeholder="Ringkasan feedback Anda"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Pesan *
                  </label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={isSubmitting}
                    className={`w-full resize-none rounded-md border px-3 py-2.5 text-sm outline-none transition-colors ${
                      errors.message
                        ? 'border-red-500 bg-red-50 focus:border-red-600'
                        : 'border-gray-300 bg-white focus:border-blue-600'
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
                <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {errorMessage || 'Terjadi kesalahan saat mengirim feedback. Silakan coba lagi atau hubungi admin secara langsung.'}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-6 py-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-6 py-3 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
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
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Phone className="h-4 w-4" />
            Kontak Sekolah
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-gray-900">Telepon</p>
                <p className="text-xs text-gray-500">{schoolConfig.contact.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-gray-900">Email</p>
                <p className="text-xs text-gray-500">{schoolConfig.contact.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-gray-900">Alamat</p>
                <p className="text-xs text-gray-500">{schoolConfig.contact.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hours Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Clock className="h-4 w-4" />
            Jam Operasional
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{schoolConfig.hours.weekdays.label}</span>
              <span className="font-medium text-gray-900">{schoolConfig.hours.weekdays.open} - {schoolConfig.hours.weekdays.close}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{schoolConfig.hours.saturday.label}</span>
              <span className="font-medium text-gray-900">{schoolConfig.hours.saturday.open} - {schoolConfig.hours.saturday.close}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{schoolConfig.hours.sunday.label}</span>
              <span className="font-medium text-red-600">Tutup</span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Lightbulb className="h-4 w-4" />
            Informasi Penting
          </h3>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Feedback akan diproses dalam {schoolConfig.feedback.processingTime}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Untuk masukan urgent, gunakan prioritas "{schoolConfig.feedback.urgentPriorityLabel}"</span>
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
  );
}
