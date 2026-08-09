import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  captureErrorContext,
  getErrorReportLink,
  logger,
} from './logger';

describe('logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls console.log in dev mode', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger.log('test message');
    expect(consoleSpy).toHaveBeenCalledWith('test message');
  });

  it('calls console.warn in dev mode', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('warning message');
    expect(consoleSpy).toHaveBeenCalledWith('warning message');
  });

  it('calls console.error in dev mode', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('error message');
    expect(consoleSpy).toHaveBeenCalledWith('error message');
  });
});

describe('captureErrorContext', () => {
  it('captures error message and stacktrace from Error object', () => {
    const testError = new Error('Something went wrong');
    const report = captureErrorContext(testError);

    expect(report.message).toBe('Something went wrong');
    expect(report.stacktrace).toBeDefined();
    expect(report.timestamp).toBeDefined();
    expect(report.url).toBeDefined();
    expect(report.userAgent).toBeDefined();
  });

  it('captures error message from string without stacktrace', () => {
    const report = captureErrorContext('Simple error string');

    expect(report.message).toBe('Simple error string');
    expect(report.stacktrace).toBeUndefined();
  });

  it('includes optional context (page and action)', () => {
    const report = captureErrorContext(new Error('Test'), {
      page: 'dashboard',
      action: 'loading data',
    });

    expect(report.page).toBe('dashboard');
    expect(report.userAction).toBe('loading data');
  });
});

describe('getErrorReportLink', () => {
  it('returns a mailto link for the report', () => {
    const report = captureErrorContext(new Error('Test error'), {
      page: 'login',
      action: 'submit form',
    });
    const link = getErrorReportLink(report);

    expect(link).toContain('mailto:');
    expect(link).toContain('support@sekolah.id');
    expect(link).toContain('subject=');
    expect(link).toContain('body=');
  });

  it('encodes page and action details in mailto body', () => {
    const report = captureErrorContext(new Error('Login failed'), {
      page: 'login',
      action: 'submit',
    });
    const link = getErrorReportLink(report);

    // Mengecek komponen URL-encoded dari isi body
    expect(decodeURIComponent(link)).toContain('login');
    expect(decodeURIComponent(link)).toContain('submit');
  });

  it('truncates extremely long error messages gracefully', () => {
    const longMessage = 'A'.repeat(200);
    const report = captureErrorContext(new Error(longMessage));
    const link = getErrorReportLink(report);

    expect(decodeURIComponent(link)).toContain('AAAA...');
  });
});

describe('logger.report', () => {
  it('returns an ErrorReport object', () => {
    const report = logger.report(new Error('Reported error'), {
      page: 'test',
      action: 'test action',
    });

    expect(report.message).toBe('Reported error');
    expect(report.page).toBe('test');
  });

  it('calls console.error with captured context', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.report(new Error('Console error'), { page: 'page1' });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[REPORT_CAPTURED]',
      'Console error',
      expect.objectContaining({ context: { page: 'page1' } })
    );
  });
});