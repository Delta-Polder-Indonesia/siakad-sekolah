// src/fitur/perpustakaan/LoginPerpustakaan.tsx
import { useState, useId, useCallback } from 'react';
import { Eye, EyeOff, X, HelpCircle, BookOpen } from 'lucide-react';
import { getStudents, getClasses, hashPassword } from '../../data/services';
import BantuanPerpustakaan from './BantuanPerpustakaan';
import { namaSekolah } from '../halaman/components/Profile/dataSekolah';

// ─── Constants ────────────────────────────────────────────────────────────────

const BG_IMAGE = `${import.meta.env.BASE_URL}images/Dashboard/perpustakaan.jpg`;

const SCHOOL_NAME = namaSekolah;
const LIBRARY_NAME = `Perpustakaan ${SCHOOL_NAME}`;
const FOOTER_YEAR = new Date().getFullYear();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentSession {
  nisn: string; // untuk konsistensi UI perpustakaan, tetap pakai nama "nisn"
  nama: string;
  kelas: string;
}

interface LoginPerpustakaanProps {
  onLoginSuccess: (studentData: StudentSession) => void;
  onBackToPortal: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPerpustakaan({
  onLoginSuccess,
  onBackToPortal,
}: LoginPerpustakaanProps) {
  // ── Form state ──────────────────────────────────────────────────────────
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Modal state ─────────────────────────────────────────────────────────
  const [showBantuan, setShowBantuan] = useState(false);

  // ── Accessible IDs ──────────────────────────────────────────────────────
  const uid = useId();
  const nisnId = `${uid}-nisn`;
  const passwordId = `${uid}-password`;
  const errorId = `${uid}-error`;

  // ── Handlers ────────────────────────────────────────────────────────────

  const clearError = useCallback(() => setError(''), []);

  const handleNisnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNisn(e.target.value);
      clearError();
    },
    [clearError]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      clearError();
    },
    [clearError]
  );

  const handleTogglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) return;

      setError('');
      setIsLoading(true);

      const trimmedNisn = nisn.trim();

      if (!trimmedNisn) {
        setError('NISN tidak boleh kosong.');
        setIsLoading(false);
        return;
      }

      if (!password) {
        setError('Kata sandi tidak boleh kosong.');
        setIsLoading(false);
        return;
      }

      // Match NISN ke field "nis" di store
      const allStudents = getStudents();
      const student = allStudents.find(
        (s) =>
          s.nis === trimmedNisn &&
          s.status !== 'keluar' &&
          s.status !== 'lulus' &&
          s.status !== 'pindah'
      );

      if (!student) {
        setError('NISN tidak terdaftar di sistem sekolah.');
        setIsLoading(false);
        return;
      }

      const hashedInput = await hashPassword(password);
      if (hashedInput !== student.password) {
        setError('Kata sandi salah. Gunakan password portal Anda.');
        setIsLoading(false);
        return;
      }

      // Ambil nama kelas berdasarkan classId siswa
      const kelasSiswa = getClasses().find((c) => c.id === student.classId)?.name ?? 'Siswa';

      // Callback login berhasil (tidak perlu setIsLoading(false) untuk mencegah memory leak saat unmount)
      onLoginSuccess({
        nisn: trimmedNisn,
        nama: student.name,
        kelas: kelasSiswa,
      });
    },
    [isLoading, nisn, password, onLoginSuccess]
  );

  // ── Render: Bantuan overlay ──────────────────────────────────────────────
  if (showBantuan) {
    return <BantuanPerpustakaan onClose={() => setShowBantuan(false)} />;
  }

  // ── Render: main ────────────────────────────────────────────────────────
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-between overflow-hidden bg-slate-950 font-sans antialiased">
      {/* ── Background ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${BG_IMAGE}')` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60"
      />

      {/* ── Spacer atas ── */}
      <div className="relative z-10 h-6 shrink-0" aria-hidden="true" />

      {/* ── Card Login ── */}
      <main
        className={[
          'relative z-10 mx-4 flex w-full max-w-[22rem] flex-col',
          'rounded-[2rem] p-7 sm:max-w-sm sm:p-10',
          'border border-white/25',
          'bg-white/[0.08] backdrop-blur-[20px]',
          'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]',
          'transition-all duration-300',
        ].join(' ')}
        aria-label="Form login perpustakaan"
      >
        {/* ── Close / back ── */}
        <button
          onClick={onBackToPortal}
          type="button"
          aria-label="Kembali ke Portal"
          title="Kembali ke Portal"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 transition-all hover:bg-black/70 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg">
            <BookOpen className="h-6 w-6 text-white/80" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Login</h1>
          <p className="mt-1 text-[11px] tracking-wider text-white/50 uppercase">{LIBRARY_NAME}</p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* NISN */}
          <div className="space-y-1.5">
            <label
              htmlFor={nisnId}
              className="block pl-1 text-[10px] font-bold tracking-wider text-white/50 uppercase"
            >
              NISN / Username Siswa
            </label>
            <input
              id={nisnId}
              type="text"
              value={nisn}
              onChange={handleNisnChange}
              placeholder="Masukkan NISN Anda"
              autoComplete="username"
              disabled={isLoading}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              required
              className={[
                'w-full rounded-xl border bg-black/10 px-4 py-3 text-xs text-white',
                'transition-all outline-none placeholder:text-white/35',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error
                  ? 'border-red-500/80 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'border-white/20 focus:border-white/50 focus:bg-black/20',
              ].join(' ')}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor={passwordId}
              className="block pl-1 text-[10px] font-bold tracking-wider text-white/50 uppercase"
            >
              Kata Sandi Portal
            </label>
            <div className="relative">
              <input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Masukkan kata sandi Anda"
                autoComplete="current-password"
                disabled={isLoading}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={!!error}
                required
                className={[
                  'w-full rounded-xl border bg-black/10 px-4 py-3 pr-11 text-xs text-white',
                  'transition-all outline-none placeholder:text-white/35',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  error
                    ? 'border-red-500/80 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'border-white/20 focus:border-white/50 focus:bg-black/20',
                ].join(' ')}
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-pressed={showPassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-white/40 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Error area */}
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
            className="min-h-[1.25rem] pl-1"
          >
            {error && (
              <p className="flex items-center gap-1.5 text-[10px] leading-none font-medium text-red-400">
                <span
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-400"
                  aria-hidden="true"
                />
                {error}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={[
              'w-full rounded-xl border border-white/10 bg-slate-950 py-3',
              'text-xs font-semibold tracking-widest text-white uppercase',
              'shadow-xl transition-all',
              isLoading
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:bg-black active:scale-[0.98]',
            ].join(' ')}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/60 border-t-transparent"
                  aria-hidden="true"
                />
                Memverifikasi…
              </span>
            ) : (
              'Login'
            )}
          </button>

          {/* Bantuan */}
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => setShowBantuan(true)}
              className="group flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] text-white/45 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
            >
              <HelpCircle
                className="h-3 w-3 text-white/30 transition-colors group-hover:text-white/60"
                aria-hidden="true"
              />
              Butuh bantuan?
            </button>
          </div>
        </form>

        {/* Sub-note */}
        <p className="mt-6 text-center text-[9px] leading-relaxed text-white/25">
          Gunakan akun yang sama dengan Portal Akademik
        </p>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 shrink-0 py-5 text-center text-[10px] text-white/35">
        © {FOOTER_YEAR} {SCHOOL_NAME} · Digital Library Hub
      </footer>
    </div>
  );
}
