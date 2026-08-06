import React, { lazy, Suspense, useRef } from 'react';
import { PpdbModalProps, PpdbView } from './types';
import { Z_INDEX } from './constants';
import { useModalBehavior } from './hooks';

const PPDBForm = lazy(() => import('../../penerimaan-siswa-baru/PPDBForm'));
const LandingPage = lazy(() => import('../../penerimaan-siswa-baru/LandingPage'));
const CekKelulusanPage = lazy(() => import('../../penerimaan-siswa-baru/CekKelulusanPage'));

const PpdbModal: React.FC<PpdbModalProps> = ({ isOpen, view, onViewChange, onClose }) => {
  useModalBehavior(isOpen, onClose);

  // Simpan posisi scroll per view — saat kembali ke view sebelumnya,
  // posisi scroll dipulihkan ke tempat user terakhir berada.
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollPositions = useRef<Record<string, number>>({});

  const handleViewChange = (next: PpdbView) => {
    if (scrollRef.current) {
      scrollPositions.current[view] = scrollRef.current.scrollTop;
    }
    onViewChange(next);
    const pos = scrollPositions.current[next] ?? 0;
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = pos;
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Suspense
      fallback={
        <div
          style={{ zIndex: Z_INDEX.ppdbModal }}
          className="fixed inset-0 flex items-center justify-center bg-white"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-transparent" />
        </div>
      }
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Portal Penerimaan Peserta Didik Baru"
        style={{ zIndex: Z_INDEX.ppdbModal }}
        className="fixed inset-0 overflow-y-auto bg-white"
        ref={scrollRef}
      >
        {view === 'landing' && (
          <LandingPage
            scrollRef={scrollRef}
            onOpenForm={() => handleViewChange('form')}
            onOpenCekKelulusan={() => handleViewChange('cek-kelulusan')}
            onClose={onClose}
          />
        )}
        {view === 'form' && (
          <PPDBForm
            isModal={false}
            onBack={() => handleViewChange('landing')}
            onClose={() => {
              onClose();
              handleViewChange('landing');
            }}
          />
        )}
        {view === 'cek-kelulusan' && (
          <CekKelulusanPage onBack={() => handleViewChange('landing')} />
        )}
      </div>
    </Suspense>
  );
};

export default PpdbModal;
