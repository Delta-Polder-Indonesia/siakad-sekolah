import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabSetupSekolah from './TabSetupSekolah';
import { ToastProvider } from '../../../components/ui';
import { getSchoolIdentity } from '../../../config/school';

function renderTab() {
  return render(
    <ToastProvider>
      <TabSetupSekolah />
    </ToastProvider>
  );
}

describe('TabSetupSekolah (template universal)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('menampilkan form identitas dengan nilai default', () => {
    renderTab();
    expect(screen.getByText('Nama Sekolah')).toBeTruthy();
    expect(screen.getByText('Logo Sekolah')).toBeTruthy();
    const nama = document.querySelector('input[placeholder="contoh: SMA Negeri 1 Medan"]') as HTMLInputElement;
    expect(nama?.value).toBe('SMA Negeri 1 Medan');
  });

  it('menyimpan identitas baru ke localStorage', () => {
    renderTab();
    const nama = document.querySelector('input[placeholder="contoh: SMA Negeri 1 Medan"]') as HTMLInputElement;
    fireEvent.change(nama, { target: { value: 'SMKN 2 Surabaya' } });
    fireEvent.click(screen.getByText('Simpan Identitas Sekolah'));
    expect(getSchoolIdentity().namaSekolah).toBe('SMKN 2 Surabaya');
  });

  it('reset mengembalikan ke bawaan', () => {
    localStorage.setItem('siakad-school-identity', JSON.stringify({ namaSekolah: 'SMPN X' }));
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderTab();
    fireEvent.click(screen.getByText('Reset ke Bawaan'));
    expect(getSchoolIdentity().namaSekolah).toBe('SMA Negeri 1 Medan');
    confirmSpy.mockRestore();
  });
});
