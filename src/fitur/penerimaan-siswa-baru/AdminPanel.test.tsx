/**
 * Smoke test render AdminPanel — memastikan komponen hasil pemecahan
 * (Login/Header/Sidebar/Applications/Modals) bisa di-render bersama.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPanel from './AdminPanel';
import { ToastProvider } from '../../components/ui';

// Paksa mode lokal (mock data di browser), bukan mode API.
// vitest.config.ts meng-set VITE_API_BASE_URL untuk semua test → tanpa mock
// ini, test akan mencoba fetch ke localhost:4000.
vi.mock('../../services/apiConfig', () => ({
  API_BASE: '',
  hasApi: false,
}));

// PIN admin gerbang PPDB lokal (dibaca saat runtime oleh readAdminPin).
vi.stubEnv('VITE_ADMIN_PIN', '26012026');

function renderPanel(props: Partial<React.ComponentProps<typeof AdminPanel>> = {}) {
  return render(
    <ToastProvider>
      <AdminPanel onClose={() => {}} {...props} />
    </ToastProvider>
  );
}

describe('AdminPanel (hasil refactor god-component)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('menampilkan layar login saat belum autentikasi', () => {
    const { container } = renderPanel();
    expect(screen.getByText('Login Admin PPDB')).toBeTruthy();
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('login sukses menampilkan dashboard ringkasan & filter', async () => {
    const { container } = renderPanel();
    const inputs = container.querySelectorAll<HTMLInputElement>('input');
    fireEvent.change(inputs[0], { target: { value: 'admin' } });
    fireEvent.change(inputs[1], { target: { value: '26012026' } });
    fireEvent.click(screen.getByText('Masuk'));

    await waitFor(() => {
      expect(screen.getByText('Ringkasan')).toBeTruthy();
      expect(screen.getByText('Filter Data')).toBeTruthy();
      expect(screen.getByText('Data Pendaftar')).toBeTruthy();
    });
  });

  it('mode embedded langsung menampilkan dashboard (tanpa login)', () => {
    renderPanel({ embedded: true });
    expect(screen.getByText('Ringkasan')).toBeTruthy();
    expect(screen.queryByText('Login Admin PPDB')).toBeNull();
  });
});
