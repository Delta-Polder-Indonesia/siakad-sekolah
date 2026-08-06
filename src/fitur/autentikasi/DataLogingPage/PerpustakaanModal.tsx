import React, { lazy, Suspense } from 'react';
import { PerpustakaanModalProps } from './types';
import { Z_INDEX } from './constants';
import { useModalBehavior } from './hooks';

const PerpustakaanApp = lazy(() => import('../../../fitur/perpustakaan/PerpustakaanApp'));

const PerpustakaanModal: React.FC<PerpustakaanModalProps> = ({ isOpen, onClose }) => {
  useModalBehavior(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <Suspense
      fallback={
        <div
          style={{ zIndex: Z_INDEX.perpustakaanModal }}
          className="fixed inset-0 flex items-center justify-center bg-white"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-transparent" />
        </div>
      }
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Layanan Perpustakaan Digital"
        style={{ zIndex: Z_INDEX.perpustakaanModal }}
        className="fixed inset-0"
      >
        <PerpustakaanApp onClose={onClose} />
      </div>
    </Suspense>
  );
};

export default PerpustakaanModal;
