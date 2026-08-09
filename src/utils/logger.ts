const isDev = import.meta.env.DEV;
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@sekolah.id';

/**
 * Laporan terstruktur untuk bug/error yang dialami pengguna.
 */
export interface ErrorReport {
  message: string;
  url: string;
  timestamp: string;
  page?: string;
  userAction?: string;
  stacktrace?: string;
  userAgent?: string;
}

/**
 * Menangkap konteks error saat ini untuk keperluan pelaporan.
 */
export function captureErrorContext(
  error: Error | string,
  context?: { page?: string; action?: string }
): ErrorReport {
  const isErrorObj = error instanceof Error;

  return {
    message: isErrorObj ? error.message : String(error),
    stacktrace: isErrorObj ? error.stack : undefined,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    timestamp: new Date().toISOString(),
    page: context?.page,
    userAction: context?.action,
  };
}

/**
 * Membuat tautan `mailto:` terformat untuk mengirimkan laporan bug via email.
 */
export function getErrorReportLink(report: ErrorReport): string {
  // Potong pesan agar URL tidak terlalu panjang (mencegah error pada browser mail client)
  const safeMessage = report.message.length > 100 
    ? `${report.message.slice(0, 97)}...` 
    : report.message;

  const subject = encodeURIComponent(`[Laporan Bug SIAKAD] - ${safeMessage}`);

  const bodyLines = [
    'Halo Tim Dukungan Sistem,',
    '',
    'Saya mengalami kendala pada aplikasi SIAKAD dengan rincian berikut:',
    '',
    '--------------------------------------------------',
    'DETAIL MASALAH (Tolong jelaskan secara singkat)',
    '--------------------------------------------------',
    '[Tuliskan apa yang sedang Anda lakukan atau lampirkan foto/screenshot]',
    '',
    '--------------------------------------------------',
    'INFORMASI TEKNIS (Otomatis)',
    '--------------------------------------------------',
    `Pesan Error  : ${report.message}`,
    `Halaman      : ${report.page || '-'}`,
    `Tindakan     : ${report.userAction || '-'}`,
    `URL          : ${report.url}`,
    `Waktu Akses  : ${new Date(report.timestamp).toLocaleString('id-ID')}`,
    `Browser/OS   : ${report.userAgent || '-'}`,
  ];

  if (report.stacktrace) {
    bodyLines.push('', '--- Stack Trace ---', report.stacktrace.slice(0, 500));
  }

  const body = encodeURIComponent(bodyLines.join('\n'));
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}

/**
 * Logger terpusat untuk aplikasi.
 */
export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Error selalu dicatat di konsol browser untuk pemantauan Sentry/LogRocket/DevTools
    console.error(...args);
  },
  report: (error: Error | string, context?: { page?: string; action?: string }): ErrorReport => {
    const report = captureErrorContext(error, context);
    logger.error('[REPORT_CAPTURED]', report.message, { context, report });
    return report;
  },
};