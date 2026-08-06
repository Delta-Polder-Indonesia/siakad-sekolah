// E:\guthub\projeck-portal-siswa\src\fitur\autentikasi\DataLogingPage\hooks.ts

import { useEffect } from 'react';

/**
 * Hook untuk menangani perilaku modal:
 * - Mengunci scroll body saat modal terbuka
 * - Menutup modal saat tombol Escape ditekan
 */
export function useModalBehavior(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
}
