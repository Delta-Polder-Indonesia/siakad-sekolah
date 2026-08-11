import { useEffect, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = 'Konfirmasi',
  message,
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative z-10 mx-4 w-full max-w-sm rounded-md border-2 border-black bg-white p-5"
      >
        <button type="button"
          onClick={onCancel}
          className="absolute top-3 right-3 rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:bg-neutral-100"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-md border-2 ${
              variant === 'danger'
                ? 'border-rose-600 bg-white text-rose-600'
                : 'border-black bg-black text-white'
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3
            id="confirm-modal-title"
            className="text-xs font-bold tracking-wider text-black uppercase"
          >
            {title}
          </h3>
        </div>

        <p className="mb-5 text-xs leading-relaxed font-bold text-black">{message}</p>

        <div className="flex justify-end gap-2">
          <button type="button"
            onClick={onCancel}
            className="rounded-md border-2 border-black bg-white px-4 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
          >
            {cancelLabel}
          </button>
          <button type="button"
            onClick={onConfirm}
            className={`rounded-md border-2 px-4 py-1.5 text-xs font-bold transition-colors ${
              variant === 'danger'
                ? 'border-rose-600 bg-white text-rose-600 hover:bg-rose-50'
                : 'border-black bg-black text-white hover:bg-neutral-900'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
