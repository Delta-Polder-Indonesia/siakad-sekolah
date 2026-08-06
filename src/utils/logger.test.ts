import { describe, expect, it, vi, beforeEach } from 'vitest';
import { captureErrorContext, getErrorReportLink, logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls console.log in dev mode', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const mod = await import('./logger');
    mod.logger.log('test message');
    expect(consoleSpy).toHaveBeenCalledWith('test message');
  });

  it('calls console.warn in dev mode', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mod = await import('./logger');
    mod.logger.warn('warning message');
    expect(consoleSpy).toHaveBeenCalledWith('warning message');
  });

  it('calls console.error in dev mode', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mod = await import('./logger');
    mod.logger.error('error message');
    expect(consoleSpy).toHaveBeenCalledWith('error message');
  });
});

describe('captureErrorContext', () => {
  it('captures error message from Error object', () => {
    const report = captureErrorContext(new Error('Something went wrong'));
    expect(report.message).toBe('Something went wrong');
    expect(report.timestamp).toBeDefined();
    expect(report.url).toBeDefined();
  });

  it('captures error message from string', () => {
    const report = captureErrorContext('Simple error string');
    expect(report.message).toBe('Simple error string');
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

  it('includes page and action in the body', () => {
    const report = captureErrorContext(new Error('Login failed'), {
      page: 'login',
      action: 'submit',
    });
    const link = getErrorReportLink(report);
    expect(link).toContain('login');
    expect(link).toContain('submit');
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

  it('calls console.error with the error context', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.report(new Error('Console error'), { page: 'page1' });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
