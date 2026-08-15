import { GlobalErrorHandler } from './utils/errorHandler';
import { PerformanceMonitor } from './utils/performance';
import './index.css';

// Observer dipasang sebelum first paint agar kandidat LCP statis ikut tercatat.
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

let mountScheduled = false;
let fallbackTimer: number | null = null;

/**
 * Beri browser satu frame untuk menerapkan stylesheet dan satu frame untuk
 * mengecat hero statis. React baru diunduh/dievaluasi sesudahnya, sehingga
 * commit awal tidak bercampur dengan style recalculation stylesheet besar.
 */
function mountAfterCriticalPaint() {
  if (mountScheduled) return;
  mountScheduled = true;
  if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      void import('./bootstrap').then(({ mountApp }) => mountApp());
    });
  });
}

// Build produksi memuat Tailwind secara non-blocking. Jangan mount DOM React
// dalam keadaan unstyled karena penerapan CSS sesudah commit menyebabkan satu
// relayout besar. Mode dev tidak memiliki marker ini dan langsung lanjut.
const appStyles = document.querySelector<HTMLLinkElement>('link[data-app-styles]');
if (appStyles && !appStyles.dataset.loaded) {
  const activateStylesAndMount = () => {
    appStyles.media = 'all';
    appStyles.dataset.loaded = 'true';
    mountAfterCriticalPaint();
  };

  // Listener langsung tetap bekerja bila CSP memblokir inline onload handler.
  if (appStyles.sheet) {
    activateStylesAndMount();
  } else {
    appStyles.addEventListener('load', activateStylesAndMount, { once: true });
    appStyles.addEventListener('error', mountAfterCriticalPaint, { once: true });
    window.addEventListener('app-styles-ready', mountAfterCriticalPaint, { once: true });
    // Tetap usable bila stylesheet gagal mengirim event.
    fallbackTimer = window.setTimeout(mountAfterCriticalPaint, 3_000);
  }
} else {
  mountAfterCriticalPaint();
}
