/**
 * Smoke test render TabDataSekolah (ekspor/impor/reset).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TabDataSekolah from './TabDataSekolah';
import { ToastProvider } from '../../../components/ui';

function renderTab() {
  return render(
    <ToastProvider>
      <TabDataSekolah />
    </ToastProvider>
  );
}

describe('TabDataSekolah (template universal)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('menampilkan 3 section: ekspor, impor, reset', () => {
    renderTab();
    expect(screen.getByText('Ekspor Data Master')).toBeTruthy();
    expect(screen.getByText('Impor Data Master')).toBeTruthy();
    expect(screen.getByText('Reset / Kosongkan Data')).toBeTruthy();
    expect(screen.getByText('Ekspor Data Master (.json)')).toBeTruthy();
    expect(screen.getByText('Kosongkan Semua Data')).toBeTruthy();
    expect(screen.getByText('Reset ke Data Demo')).toBeTruthy();
  });
});
