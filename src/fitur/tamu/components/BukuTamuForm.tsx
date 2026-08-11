import { useState } from 'react';
import { useSchoolIdentity } from '../../../hooks/useSchoolIdentity';
import {
  User,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  Target,
} from 'lucide-react';
import { GuestEntry } from '../types';
import { tujuanOptions } from '../data/guestData';

interface BukuTamuFormProps {
  onSubmit: (entry: GuestEntry) => void;
  onClose?: () => void;
}

export default function BukuTamuForm({ onSubmit, onClose }: BukuTamuFormProps) {
  const identity = useSchoolIdentity();
  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    email: '',
    noHp: '',
    tujuan: '',
    pesan: '',
    rating: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeTujuanOptions = Array.isArray(tujuanOptions) ? tujuanOptions : [];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama lengkap wajib diisi';
    if (!formData.instansi.trim()) newErrors.instansi = 'Instansi/asal wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.noHp.trim()) {
      newErrors.noHp = 'Nomor HP wajib diisi';
    } else if (!/^[0-9+\-\s()]{8,15}$/.test(formData.noHp)) {
      newErrors.noHp = 'Format nomor HP tidak valid';
    }
    if (!formData.tujuan) newErrors.tujuan = 'Pilih tujuan kunjungan';
    if (!formData.pesan.trim()) {
      newErrors.pesan = 'Pesan/kesan wajib diisi';
    } else if (formData.pesan.trim().length < 10) {
      newErrors.pesan = 'Pesan minimal 10 karakter';
    }
    if (formData.rating === 0) newErrors.rating = 'Beri rating pengalaman Anda';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const entry: GuestEntry = {
        id: Date.now().toString(),
        ...formData,
        tanggal: now.toISOString().split('T')[0],
        waktu: now.toTimeString().slice(0, 5),
      };
      onSubmit(entry);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50 shadow-2xs">
          <CheckCircle2 className="h-8 w-8 text-slate-700" />
        </div>
        <h3 className="font-serif text-xl font-bold text-slate-950">Terima Kasih!</h3>
        <p className="max-w-sm text-xs font-semibold text-slate-600">
          Pesan Anda telah berhasil tercatat dalam buku tamu {identity.namaSekolah}. Kami menghargai
          kunjungan dan masukan Anda.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                nama: '',
                instansi: '',
                email: '',
                noHp: '',
                tujuan: '',
                pesan: '',
                rating: 0,
              });
            }}
            className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
          >
            Isi Lagi
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
            >
              Kembali
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nama */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <User className="h-3.5 w-3.5 text-slate-500" />
          Nama Lengkap <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          value={formData.nama}
          onChange={(e) => handleChange('nama', e.target.value)}
          placeholder="Masukkan nama lengkap Anda"
          className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-2xs transition-colors outline-none hover:border-slate-950 focus:border-slate-950"
        />
        {errors.nama && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
            <AlertCircle className="h-3 w-3" /> {errors.nama}
          </p>
        )}
      </div>

      {/* Instansi */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Building2 className="h-3.5 w-3.5 text-slate-500" />
          Instansi / Asal <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          value={formData.instansi}
          onChange={(e) => handleChange('instansi', e.target.value)}
          placeholder="Contoh: Dinas Pendidikan, Wali Murid, dll."
          className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-2xs transition-colors outline-none hover:border-slate-950 focus:border-slate-950"
        />
        {errors.instansi && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
            <AlertCircle className="h-3 w-3" /> {errors.instansi}
          </p>
        )}
      </div>

      {/* Email & No HP Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Mail className="h-3.5 w-3.5 text-slate-500" />
            Email <span className="text-rose-600">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@contoh.com"
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-2xs transition-colors outline-none hover:border-slate-950 focus:border-slate-950"
          />
          {errors.email && (
            <p className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
              <AlertCircle className="h-3 w-3" /> {errors.email}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Phone className="h-3.5 w-3.5 text-slate-500" />
            No. HP <span className="text-rose-600">*</span>
          </label>
          <input
            type="tel"
            value={formData.noHp}
            onChange={(e) => handleChange('noHp', e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-2xs transition-colors outline-none hover:border-slate-950 focus:border-slate-950"
          />
          {errors.noHp && (
            <p className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
              <AlertCircle className="h-3 w-3" /> {errors.noHp}
            </p>
          )}
        </div>
      </div>

      {/* Tujuan */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Target className="h-3.5 w-3.5 text-slate-500" />
          Tujuan Kunjungan <span className="text-rose-600">*</span>
        </label>
        <select
          value={formData.tujuan}
          onChange={(e) => handleChange('tujuan', e.target.value)}
          className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-2xs transition-colors outline-none hover:border-slate-950 focus:border-slate-950"
        >
          <option value="">— Pilih tujuan kunjungan —</option>
          {safeTujuanOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.tujuan && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
            <AlertCircle className="h-3 w-3" /> {errors.tujuan}
          </p>
        )}
      </div>

      {/* Pesan */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
          Pesan & Kesan <span className="text-rose-600">*</span>
        </label>
        <textarea
          value={formData.pesan}
          onChange={(e) => handleChange('pesan', e.target.value)}
          placeholder="Tuliskan pesan, kesan, atau saran Anda untuk {identity.namaSekolah}..."
          rows={4}
          className="w-full resize-none rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-2xs transition-colors outline-none hover:border-slate-950 focus:border-slate-950"
        />
        <div className="flex justify-between">
          {errors.pesan ? (
            <p className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
              <AlertCircle className="h-3 w-3" /> {errors.pesan}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs font-semibold text-slate-500">{formData.pesan.length}/500</span>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Star className="h-3.5 w-3.5 text-slate-500" />
          Rating Pengalaman <span className="text-rose-600">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleChange('rating', star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="cursor-pointer rounded-md p-1 text-slate-700 transition-colors hover:text-slate-950"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hoverRating || formData.rating)
                    ? 'fill-slate-900 text-slate-900'
                    : 'fill-white text-slate-300'
                }`}
              />
            </button>
          ))}
          {formData.rating > 0 && (
            <span className="ml-2 text-xs font-bold text-slate-700">
              {formData.rating === 1 && 'Kurang'}
              {formData.rating === 2 && 'Cukup'}
              {formData.rating === 3 && 'Baik'}
              {formData.rating === 4 && 'Sangat Baik'}
              {formData.rating === 5 && 'Luar Biasa'}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
            <AlertCircle className="h-3 w-3" /> {errors.rating}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 border-t border-slate-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-6 py-3.5 text-xs font-bold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin text-slate-700" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Mengirim...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Kirim Buku Tamu
            </>
          )}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
