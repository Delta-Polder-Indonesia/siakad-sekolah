import { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { logger } from '../../utils/logger';
import { ToastProvider } from '../../components/ui';
import { FeedbackButton } from '../halaman/feedback';

const FeedbackPage = lazy(() => import('../halaman/feedback/FeedbackPage'));

import {
  BACKGROUND_IMAGES,
  MAIN_NAV,
  LOGO_SMP,
  SCHOOL_CONFIG,
  SLIDESHOW_INTERVAL_MS,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION_MS,
  validateLoginInput,
  BackgroundSlideshow,
  LoginPanel,
  LoginIllustration,
  PpdbModal,
  PerpustakaanModal,
  PpdbView,
  ValidRole,
} from './DataLogingPage';

const AdminMasterPanel = lazy(() => import('../admin/PanelAdminModal'));
const TutorialModal = lazy(() => import('./TutorialModal'));
const ExpectationModal = lazy(() => import('../halaman/ExpectationModal'));

export default function LoginPage() {
  const { login, loginGoogle } = useAuth();

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [role, setRole] = useState<UserRole>('student');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFeedbackPage, setShowFeedbackPage] = useState(false);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [openAdminPanel, setOpenAdminPanel] = useState(false);
  const [adminScope] = useState<'teacher' | 'student'>('teacher');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExpectation, setShowExpectation] = useState(false);
  const [showPPDB, setShowPPDB] = useState(false);
  const [ppdbView, setPpdbView] = useState<PpdbView>('landing');
  const [showPerpustakaan, setShowPerpustakaan] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, SLIDESHOW_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!lockoutUntil) return;

    const updateRemaining = () => {
      const timeLeft = lockoutUntil - Date.now();
      if (timeLeft <= 0) {
        if (isMounted.current) {
          setLockoutUntil(null);
          setError('');
          setLoginAttempts(0);
        }
      } else {
        if (isMounted.current) {
          setError(
            `Terlalu banyak percobaan. Akses dikunci sementara. Coba lagi dalam ${Math.ceil(timeLeft / 1000)} detik.`
          );
        }
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleGoogleLogin = useCallback(
    async (credential?: string) => {
      if (lockoutUntil && Date.now() < lockoutUntil) return;

      if (!credential) {
        setError('Otentikasi Google dibatalkan atau gagal.');
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const success = await loginGoogle('guest', credential);
        if (!success && isMounted.current) {
          setError('Gagal masuk dengan Google. Email tidak terdaftar atau token tidak valid.');
        }
      } catch (err: unknown) {
        logger.error('[LoginPage] Google login error:', err);
        if (isMounted.current) {
          setError('Terjadi kesalahan saat otentikasi Google.');
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [loginGoogle, lockoutUntil]
  );

  const handleRoleChange = useCallback((newRole: UserRole) => {
    setRole(newRole);
    setId('');
    setPassword('');
    setError('');
    setShowPassword(false);
  }, []);

  const handleIdChange = useCallback((v: string) => {
    setId(v);
    setError((prev) => (prev && !prev.includes('Terlalu banyak') ? '' : prev));
  }, []);

  const handlePasswordChange = useCallback((v: string) => {
    setPassword(v);
    setError((prev) => (prev && !prev.includes('Terlalu banyak') ? '' : prev));
  }, []);

  const handleTogglePassword = useCallback(() => setShowPassword((p) => !p), []);
  const handleShowTutorial = useCallback(() => setShowTutorial(true), []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!role || isLoading) return;

      if (lockoutUntil) {
        if (Date.now() < lockoutUntil) return;
        setLockoutUntil(null);
        setLoginAttempts(0);
      }

      const trimmedId = id.trim();
      const validationError = validateLoginInput(role as ValidRole, trimmedId, password);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      setIsLoading(true);

      try {
        const success = await login(trimmedId, password, role);
        if (!isMounted.current) return;

        if (!success) {
          setLoginAttempts((prev) => {
            const nextAttempts = prev + 1;
            if (nextAttempts >= MAX_LOGIN_ATTEMPTS) {
              setLockoutUntil(Date.now() + LOCKOUT_DURATION_MS);
            } else {
              setError(
                `Kredensial tidak valid. Sisa percobaan: ${MAX_LOGIN_ATTEMPTS - nextAttempts}`
              );
            }
            return nextAttempts;
          });
        } else {
          setLoginAttempts(0);
          setLockoutUntil(null);
        }
      } catch (err: unknown) {
        logger.error('[LoginPage] Login error:', err);
        if (isMounted.current) {
          if (err instanceof TypeError && err.message.includes('fetch')) {
            setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
          } else {
            setError('Terjadi kesalahan sistem.');
          }
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [role, id, password, isLoading, login, lockoutUntil]
  );

  const handleOpenLogin = useCallback(() => setIsLoginOpen(true), []);
  const handleCloseLogin = useCallback(() => setIsLoginOpen(false), []);
  const handleOpenExpectation = useCallback(() => setShowExpectation(true), []);
  const handleCloseExpectation = useCallback(() => setShowExpectation(false), []);
  const handleOpenPPDB = useCallback(() => setShowPPDB(true), []);
  const handleClosePPDB = useCallback(() => {
    setShowPPDB(false);
    setPpdbView('landing');
  }, []);
  const handleOpenPerpustakaan = useCallback(() => setShowPerpustakaan(true), []);
  const handleClosePerpustakaan = useCallback(() => setShowPerpustakaan(false), []);
  const handleCloseAdminPanel = useCallback(() => setOpenAdminPanel(false), []);
  const handleCloseTutorial = useCallback(() => setShowTutorial(false), []);
  const handleOpenRegistrationFromExpectation = useCallback(() => {
    setShowPPDB(true);
    setPpdbView('landing');
  }, []);

  const handleNavClick = useCallback(
    (key: string) => {
      switch (key) {
        case 'about':
          handleOpenExpectation();
          break;
        case 'ppdb':
          handleOpenPPDB();
          break;
        case 'library':
          handleOpenPerpustakaan();
          break;
      }
    },
    [handleOpenExpectation, handleOpenPPDB, handleOpenPerpustakaan]
  );

  const currentImage = BACKGROUND_IMAGES[currentSlide];

  if (showFeedbackPage) {
    return (
      <ToastProvider>
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading...</div>}>
          <FeedbackPage onNavigate={() => setShowFeedbackPage(false)} />
        </Suspense>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="relative h-screen w-full overflow-hidden bg-slate-900 font-sans antialiased">
        <BackgroundSlideshow images={BACKGROUND_IMAGES} currentSlide={currentSlide} />

        <header className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto max-w-[1400px] px-6 py-6 sm:px-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={LOGO_SMP}
                  alt="Logo Sekolah"
                  className="h-11 w-11 object-contain drop-shadow-lg"
                />
                <div>
                  <h1 className="text-sm leading-tight font-extrabold tracking-tight text-white drop-shadow-md md:text-base lg:text-lg">
                    {SCHOOL_CONFIG.name}
                  </h1>
                  <p className="hidden text-[10px] font-medium tracking-[0.18em] text-white/75 uppercase sm:block">
                    Sekolah Unggulan Yang Menghasilkan SDM Bermutu
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <nav className="hidden items-center gap-8 md:flex">
                  {MAIN_NAV.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleNavClick(item.key)}
                      className="text-sm font-medium tracking-wide text-white transition-all duration-300 hover:text-blue-200"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <button
                  type="button"
                  onClick={handleOpenLogin}
                  className="rounded-full border-2 border-white/70 px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:border-[#00008B] hover:bg-transparent hover:text-white"
                >
                  Masuk
                </button>
              </div>
            </div>

            <nav className="mt-4 md:hidden">
              <div className="touch-pan-x overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="inline-flex min-w-max items-center gap-5 pr-2">
                  {MAIN_NAV.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleNavClick(item.key)}
                      className="flex-shrink-0 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:text-blue-200"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </header>

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 sm:px-10 sm:pb-16">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-6 flex items-center gap-2 text-xs text-white/70">
              <span>Beranda</span>
              <span>/</span>
              <span className="text-white">{currentImage.caption}</span>
            </div>

            <h1 className="mb-5 max-w-[1000px] text-4xl leading-tight font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
              {currentImage.caption}
            </h1>

            <p className="mb-10 max-w-[900px] text-sm leading-8 text-white/90 sm:text-base">
              {currentImage.description}
            </p>

            <div className="flex items-center gap-2">
              {BACKGROUND_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === currentSlide ? 'w-12 bg-white' : 'w-5 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <LoginIllustration isOpen={isLoginOpen} />
        <LoginPanel
          isOpen={isLoginOpen}
          onClose={handleCloseLogin}
          role={role}
          id={id}
          password={password}
          showPassword={showPassword}
          isLoading={isLoading}
          hasError={!!error}
          errorMessage={error}
          onRoleChange={handleRoleChange}
          onIdChange={handleIdChange}
          onPasswordChange={handlePasswordChange}
          onTogglePassword={handleTogglePassword}
          onSubmit={handleSubmit}
          onHelpClick={handleShowTutorial}
          onGoogleLogin={handleGoogleLogin}
          disabled={!!lockoutUntil}
        />

        <Suspense fallback={null}>
          {showTutorial && <TutorialModal open={showTutorial} onClose={handleCloseTutorial} />}
          {showExpectation && (
            <ExpectationModal
              open={showExpectation}
              onClose={handleCloseExpectation}
              onOpenRegistration={handleOpenRegistrationFromExpectation}
            />
          )}
          {showPPDB && (
            <PpdbModal
              isOpen={showPPDB}
              view={ppdbView}
              onViewChange={setPpdbView}
              onClose={handleClosePPDB}
            />
          )}
          {showPerpustakaan && (
            <PerpustakaanModal isOpen={showPerpustakaan} onClose={handleClosePerpustakaan} />
          )}
          {openAdminPanel && (
            <AdminMasterPanel
              open={openAdminPanel}
              onClose={handleCloseAdminPanel}
              scope={adminScope}
            />
          )}
        </Suspense>

        {/* Feedback Button */}
        <FeedbackButton onNavigate={() => setShowFeedbackPage(true)} />
      </div>
    </ToastProvider>
  );
}
