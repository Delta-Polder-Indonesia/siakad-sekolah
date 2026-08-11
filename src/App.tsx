import { useEffect, lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import { useSchoolIdentity } from './hooks/useSchoolIdentity';
import LoginPage from './fitur/autentikasi/LoginPage';
import ErrorBoundary from './components/common/ErrorBoundary';

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

  useEffect(() => {
    void import('./data/services/coreService').then((m) => m.initializeData());
  }, []);

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
