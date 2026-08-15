export type CancelScheduledTask = () => void;

type BrowserScheduler = {
  yield?: () => Promise<void>;
};

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Memberi kesempatan browser melakukan paint/input sebelum melanjutkan batch
 * pekerjaan berikutnya. `scheduler.yield()` dipakai bila tersedia; setTimeout
 * menjadi fallback lintas-browser.
 */
export function yieldToMainThread(): Promise<void> {
  const browserScheduler = (globalThis as typeof globalThis & { scheduler?: BrowserScheduler })
    .scheduler;

  if (browserScheduler?.yield) return browserScheduler.yield();
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

/**
 * Menjalankan pekerjaan non-kritis setelah load, dua paint awal, lalu pada idle
 * period. Ini mencegah inisialisasi storage/fitur tambahan bersaing dengan LCP.
 */
export function scheduleAfterInitialPaint(
  task: () => void,
  idleTimeout = 4_000
): CancelScheduledTask {
  const idleWindow = window as WindowWithIdleCallback;
  let cancelled = false;
  let firstFrame: number | null = null;
  let secondFrame: number | null = null;
  let idleId: number | null = null;
  let timeoutId: number | null = null;

  const run = () => {
    if (!cancelled) task();
  };

  const scheduleIdleWork = () => {
    if (cancelled) return;
    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(run, { timeout: idleTimeout });
    } else {
      timeoutId = window.setTimeout(run, 0);
    }
  };

  const waitForPaints = () => {
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(scheduleIdleWork);
    });
  };

  if (document.readyState === 'complete') {
    waitForPaints();
  } else {
    window.addEventListener('load', waitForPaints, { once: true });
  }

  return () => {
    cancelled = true;
    window.removeEventListener('load', waitForPaints);
    if (firstFrame !== null) window.cancelAnimationFrame(firstFrame);
    if (secondFrame !== null) window.cancelAnimationFrame(secondFrame);
    if (idleId !== null) idleWindow.cancelIdleCallback?.(idleId);
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  };
}
