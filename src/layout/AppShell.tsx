import { useState, useCallback } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { GuestBookProvider } from '../fitur/tamu/context/GuestBookContext';
import { NotificationProvider } from '../fitur/bersama/NotificationProvider';
import { getDefaultPath, pageToPath } from '../routes';
import LoginPage from '../fitur/autentikasi/LoginPage';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { ToastProvider } from '../components/ui';

export default function AppShell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activePage = '';
  const handleSidebarNavigate = useCallback(
    (page: string) => {
      navigate(pageToPath(page, user?.role));
    },
    [navigate, user?.role]
  );

  if (!user) {
    return <LoginPage />;
  }

  const currentPath = window.location.pathname;
  if (currentPath === '/' || currentPath === '') {
    return <Navigate to={getDefaultPath(user.role)} replace />;
  }

  return (
    <GuestBookProvider>
      <NotificationProvider>
        <ToastProvider>
          <div className="h-screen overflow-hidden bg-white">
            <Sidebar
              activePage={activePage}
              onNavigate={handleSidebarNavigate}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
            />
            <main
              className={`fixed top-14 right-0 bottom-0 z-10 overflow-y-auto bg-slate-50 transition-all duration-300 ${
                sidebarCollapsed ? 'left-0 md:left-16' : 'left-0 md:left-64'
              }`}
            >
              <div className="panel-padding min-h-full">
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </div>
            </main>
          </div>
        </ToastProvider>
      </NotificationProvider>
    </GuestBookProvider>
  );
}
