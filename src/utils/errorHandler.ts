import { logger } from './logger';

/**
 * Global Error Handler untuk menangani error di seluruh aplikasi
 * Menangkap error global dan unhandled promise rejections
 */
export class GlobalErrorHandler {
  private static initialized = false;

  /**
   * Inisialisasi global error handler
   * Harus dipanggil sekali di entry point aplikasi (main.tsx)
   */
  static init(): void {
    if (this.initialized) {
      logger.warn('GlobalErrorHandler sudah diinisialisasi');
      return;
    }

    // Tangkap error JavaScript global
    window.addEventListener('error', this.handleError);

    // Tangkap unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);

    // Tangkap error resource loading
    window.addEventListener('error', this.handleResourceError, true);

    this.initialized = true;
    logger.log('GlobalErrorHandler diinisialisasi');
  }

  /**
   * Tangkap error JavaScript global
   */
  private static handleError = (event: ErrorEvent): void => {
    // Abaikan error dari ekstensi browser
    if (event.filename && event.filename.includes('extension')) {
      return;
    }

    logger.error('Global error terdeteksi:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });

    // Di sini bisa ditambahkan integrasi dengan error tracking service
    // contoh: Sentry.captureException(event.error);
  };

  /**
   * Tangkap unhandled promise rejections
   */
  private static handlePromiseRejection = (event: PromiseRejectionEvent): void => {
    logger.error('Unhandled promise rejection terdeteksi:', {
      reason: event.reason,
      promise: event.promise,
    });

    // Mencegah error muncul di console
    event.preventDefault();

    // Integrasi dengan error tracking service
    // contoh: Sentry.captureException(event.reason);
  };

  /**
   * Tangkap error resource loading (gambar, script, css)
   */
  private static handleResourceError = (event: Event): void => {
    const target = event.target as HTMLElement;

    // Cek apakah ini error resource loading
    if (
      target &&
      (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')
    ) {
      let src = '';

      if (target.tagName === 'IMG') {
        src = (target as HTMLImageElement).src;
      } else if (target.tagName === 'SCRIPT') {
        src = (target as HTMLScriptElement).src;
      } else if (target.tagName === 'LINK') {
        src = (target as HTMLLinkElement).href;
      }

      logger.warn('Resource loading error:', {
        tag: target.tagName,
        src: src,
      });
    }
  };

  /**
   * Cleanup - hapus event listeners
   */
  static destroy(): void {
    if (!this.initialized) return;

    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
    window.removeEventListener('error', this.handleResourceError, true);

    this.initialized = false;
    logger.log('GlobalErrorHandler dihancurkan');
  }

  /**
   * Cek apakah error handler sudah diinisialisasi
   */
  static isInitialized(): boolean {
    return this.initialized;
  }
}

/**
 * Helper function untuk membuat error yang terstruktur
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error codes yang umum digunakan
 */
export const ERROR_CODES = {
  AUTH_FAILED: 'AUTH_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NOT_FOUND: 'NOT_FOUND',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN',
} as const;
