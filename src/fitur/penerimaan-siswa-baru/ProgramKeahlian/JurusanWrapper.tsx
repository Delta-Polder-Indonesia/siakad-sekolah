import type { ComponentType } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { PageProps } from '../../halaman/types';
import { NavigationContext } from '../../halaman/context/NavigationContext';
import { logger } from '../../../utils/logger';

type JurusanWrapperProps = {
  onBack: () => void;
  Component: ComponentType<PageProps>;
};

/**
 * Wrapper untuk halaman Program Keahlian (REG-01 s/d REG-07).
 *
 * REG-XX.tsx kini memakai `useBackNavigation()` untuk tombol kembali —
 * hook tersebut membutuhkan Router + NavigationContext. Wrapper ini
 * membungkus komponen dengan MemoryRouter dan provider yang memetakan
 * `goBack` → `onBack()` supaya cocok dengan sistem LandingPage.
 * Navigasi footer (onNavigate) tetap dialihkan/diabaikan seperti sebelumnya.
 */
export default function JurusanWrapper({ onBack, Component }: JurusanWrapperProps) {
  const handleNavigate = (menu: string) => {
    // Tombol back REG-XX memanggil goBack (dari context), bukan onNavigate.
    // Khusus footer, menu 'Program Keahlian' tetap diterjemahkan ke onBack()
    // agar perilaku di LandingPage tidak berubah.
    if (menu === 'Program Keahlian') {
      onBack();
      return;
    }

    // Menu navigasi lain (Beranda, Berita, dll) diabaikan
    // karena tidak relevan di dalam LandingPage
    logger.log('Navigasi diabaikan:', menu);
  };

  return (
    <MemoryRouter>
      <NavigationContext.Provider
        value={{
          goBack: onBack,
          navigateTo: handleNavigate,
          isModalNavigation: true,
        }}
      >
        <Component onNavigate={handleNavigate as PageProps['onNavigate']} />
      </NavigationContext.Provider>
    </MemoryRouter>
  );
}
