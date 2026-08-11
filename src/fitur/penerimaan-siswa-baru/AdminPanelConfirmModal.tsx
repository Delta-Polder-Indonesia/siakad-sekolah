/**
 * Modal konfirmasi hapus / ubah status (dipecah dari AdminPanel.tsx).
 */
import { HelpCircle } from 'lucide-react';
import type { ConfirmAction } from './AdminPanel.types';

interface AdminPanelConfirmModalProps {
  action: ConfirmAction;
  onCancel: () => void;
  onConfirm: (action: ConfirmAction) => void;
}

export default function AdminPanelConfirmModal({
  action,
  onCancel,
  onConfirm,
}: AdminPanelConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-100/80 p-4">
      <div className="w-full max-w-sm rounded-xl border border-black bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-start gap-2">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-black" />
          <p className="text-xs leading-relaxed font-bold text-black">{action.message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-neutral-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(action)}
            className="rounded-md border border-black bg-black px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
