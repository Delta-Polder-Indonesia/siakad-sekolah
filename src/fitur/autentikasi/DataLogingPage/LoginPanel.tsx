import React, { memo, useEffect, useRef, lazy, Suspense } from 'react';
import { Eye, EyeOff, ChevronDown, X } from 'lucide-react';
import { LoginPanelProps } from './types';
import { SCHOOL_CONFIG, Z_INDEX, VALID_ROLES, ROLE_CONFIG } from './constants';
import { useSchoolIdentity } from '../../../hooks/useSchoolIdentity';
import { isValidRole } from './utils';

const GoogleLoginButton = lazy(() => import('../GoogleLoginButton'));

const LoginPanel = memo<LoginPanelProps>(
  ({
    isOpen,
    onClose,
    role,
    id,
    password,
    showPassword,
    isLoading,
    hasError,
    errorMessage,
    onRoleChange,
    onIdChange,
    onPasswordChange,
    onTogglePassword,
    onSubmit,
    onHelpClick,
    onGoogleLogin,
    disabled = false,
  }) => {
    const identity = useSchoolIdentity();
    const panelRef = useRef<HTMLDivElement>(null);
    const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.student;
    const isBlocked = isLoading || disabled;

    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
      if (!isOpen) return;

      const handleClick = (e: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          onClose();
        }
      };

      const timerId = setTimeout(() => {
        document.addEventListener('mousedown', handleClick);
      }, 100);

      return () => {
        clearTimeout(timerId);
        document.removeEventListener('mousedown', handleClick);
      };
    }, [isOpen, onClose]);

    return (
      <>
        {/* Overlay Backdrop */}
        <div
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          style={{ zIndex: Z_INDEX.overlay }}
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Sliding Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Panel Login Pengguna"
          style={{ zIndex: Z_INDEX.loginPanel }}
          className={`fixed top-0 right-0 bottom-0 w-full max-w-[440px] transform bg-white shadow-2xl transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between px-8 pt-6">
              <div className="flex items-center gap-4">
                <img src={identity.logo} alt="Logo Sekolah" className="h-9 w-9 object-contain" />
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.15em] text-slate-500 uppercase">
                    {SCHOOL_CONFIG.systemTitle}
                  </p>
                  <p className="text-xs font-bold text-slate-800">{SCHOOL_CONFIG.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup panel login"
                className="text-slate-400 transition-colors hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body Form */}
            <div className="flex flex-1 flex-col justify-start overflow-y-auto px-8 pt-12 pb-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Masuk</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Silakan masuk ke akun Anda untuk melanjutkan
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Admin dapat login langsung dari formulir ini menggunakan kredensial admin.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                {/* Selector Role */}
                <div className="space-y-1.5">
                  <label htmlFor="login-role" className="text-xs font-semibold text-slate-700">
                    Masuk Sebagai
                  </label>
                  <div className="relative">
                    <select
                      id="login-role"
                      value={role}
                      onChange={(e) => isValidRole(e.target.value) && onRoleChange(e.target.value)}
                      disabled={isBlocked}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 disabled:opacity-60"
                    >
                      {VALID_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_CONFIG[r].label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Guest: Google Login Only */}
                {role === 'guest' ? (
                  <div className="flex flex-col items-center gap-4 pt-8 pb-4">
                    <p className="text-sm text-slate-600">Masuk sebagai tamu menggunakan Google</p>
                    <div className="w-full">
                      <Suspense fallback={<div className="h-10 w-full animate-pulse rounded bg-slate-100" />}>
                        <GoogleLoginButton
                          onGoogleLogin={onGoogleLogin}
                          disabled={isBlocked}
                          fullWidth
                        />
                      </Suspense>
                    </div>
                    {hasError && (
                      <div
                        role="alert"
                        aria-live="polite"
                        className="w-full rounded-lg bg-red-50 px-4 py-2.5 text-xs text-red-700"
                      >
                        {errorMessage}
                      </div>
                    )}
                    <p className="max-w-[260px] text-center text-[10px] text-slate-400">
                      Hanya menerima email aktif (Gmail, Google Workspace, dll).
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Input ID / Email / NIS */}
                    <div className="space-y-1.5">
                      <label htmlFor="login-id" className="text-xs font-semibold text-slate-700">
                        {config.idLabel}
                      </label>
                      <input
                        id="login-id"
                        type={config.inputType}
                        value={id}
                        onChange={(e) => onIdChange(e.target.value)}
                        placeholder={config.idPlaceholder}
                        disabled={isBlocked}
                        autoComplete="username"
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 disabled:opacity-60"
                      />
                    </div>

                    {/* Input Password */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="login-password"
                          className="text-xs font-semibold text-slate-700"
                        >
                          {config.passwordLabel}
                        </label>
                        <button
                          type="button"
                          onClick={onHelpClick}
                          className="text-xs text-slate-500 hover:underline"
                        >
                          Lupa sandi?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => onPasswordChange(e.target.value)}
                          placeholder={config.passwordPlaceholder}
                          disabled={isBlocked}
                          autoComplete="current-password"
                          className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={onTogglePassword}
                          aria-label={
                            showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'
                          }
                          className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error Alert */}
                    {hasError && (
                      <div
                        role="alert"
                        aria-live="polite"
                        className="rounded-lg bg-red-50 px-4 py-2.5 text-xs text-red-700"
                      >
                        {errorMessage}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isBlocked}
                      className={`w-full rounded-lg border py-3.5 text-sm font-semibold transition-all ${
                        disabled
                          ? 'cursor-not-allowed border-red-200 bg-red-50 text-red-600'
                          : 'border-black hover:border-black hover:bg-neutral-100'
                      }`}
                    >
                      {isLoading ? 'Memproses...' : disabled ? 'Akun Terkunci' : 'Masuk ke Akun'}
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-slate-100 px-8 py-5 text-center">
              <p className="text-xs text-slate-500">
                Butuh bantuan?{' '}
                <button
                  type="button"
                  onClick={onHelpClick}
                  className="font-semibold text-slate-800 hover:underline"
                >
                  Hubungi Admin
                </button>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
);

LoginPanel.displayName = 'LoginPanel';
export default LoginPanel;
