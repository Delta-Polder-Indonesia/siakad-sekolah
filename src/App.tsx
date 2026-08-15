import { useEffect, lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import { useSchoolIdentity } from './hooks/useSchoolIdentity';
import LoginPage from './fitur/autentikasi/LoginPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import { scheduleAfterInitialPaint } from './utils/scheduler';

const AuthenticatedApp = lazy(() => import('./layout/AuthenticatedApp'));

function AppContent() {
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('is-authed', !!user);
  }, [user]);

  if (!user) return <LoginPage />;

  return (
    <Suspense fallback={<div className="h-screen bg-white" />}>
      <AuthenticatedApp />
    </Suspense>
  );
}

export default function App() {
  const identity = useSchoolIdentity();

  useEffect(() => {
    document.title = `Portal SIAKAD │ ${identity.namaSekolah}`;
  }, [identity.namaSekolah]);

  useEffect(
    () =>
      scheduleAfterInitialPaint(() => {
        // Seed/migrasi localStorage dapat melibatkan JSON besar. Jalankan setelah
        // LCP dan idle period, bukan pada task commit React pertama.
        void import('./data/services/coreService')
          .then((module) => module.initializeData())
          .catch(() => {
            // Inisialisasi demo bersifat best-effort; login backend tetap berfungsi.
          });
      }),
    []
  );

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
