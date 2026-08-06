const isDev = import.meta.env.DEV;
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@sekolah.id';

/**
 * Collects error context into a structured report that can be shown to users
 * or sent to the development team.
 */
export interface ErrorReport {
  message: string;
  url: string;
  timestamp: string;
  page?: string;
  userAction?: string;
}

/**
 * Captures the current error context for reporting purposes.
 * Returns a formatted report string.
 */
export function captureErrorContext(
  error: Error | string,
  context?: { page?: string; action?: string }
): ErrorReport {
  return {
    message: typeof error === 'string' ? error : error.message,
    url: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: new Date().toISOString(),
    page: context?.page,
    userAction: context?.action,
  };
}

/**
 * Generates a mailto link for error reporting.
 * The link pre-fills subject and body with error context.
 */
export function getErrorReportLink(report: ErrorReport): string {
  const subject = encodeURIComponent(`[Laporan Bug] Portal Siswa - ${report.message.slice(0, 80)}`);
  const body = encodeURIComponent(
    [
      '**Deskripsi Masalah:**',
      '',
      '**Detail Teknis:**',
      `- Pesan: ${report.message}`,
      `- Halaman: ${report.page || '-'}`,
      `- Tindakan: ${report.userAction || '-'}`,
      `- URL: ${report.url}`,
      `- Waktu: ${report.timestamp}`,
      '',
      '**Screenshot/Langkah Reproduksi:**',
      '',
    ].join('\n')
  );
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  report: (error: Error | string, context?: { page?: string; action?: string }) => {
    const report = captureErrorContext(error, context);
    logger.error('[REPORT]', report.message, context);
    return report;
  },
};
