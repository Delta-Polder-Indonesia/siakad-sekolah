import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { GlobalErrorHandler } from './utils/errorHandler';
import { PerformanceMonitor } from './utils/performance';
import App from './App';
import './index.css';
import './fitur/halaman/global.css';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '378551540056-4uh26d8e3ifgsdb1fvb2uqm0ee26nhbf.apps.googleusercontent.com';

// Inisialisasi global error handler dan performance monitor sebelum aplikasi dirender
GlobalErrorHandler.init();
PerformanceMonitor.init();

// Register Service Worker for offline caching & to mitigate GH Pages 10m cache (PSI)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        // Update SW silently in background
        if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      })
      .catch(() => {
        // SW registration failure is non-critical
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);
