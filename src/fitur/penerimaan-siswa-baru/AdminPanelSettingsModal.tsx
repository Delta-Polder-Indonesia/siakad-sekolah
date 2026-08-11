/**
 * Modal pengaturan email notifikasi admin (dipecah dari AdminPanel.tsx).
 */
import { X } from 'lucide-react';
import type { FormEvent } from 'react';

interface AdminPanelSettingsModalProps {
  adminEmail: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}

export default function AdminPanelSettingsModal({
  adminEmail,
  onEmailChange,
  onSubmit,
  onClose,
}: AdminPanelSettingsModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-black bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-black tracking-tight uppercase">Pengaturan Notifikasi</h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
              Email Notifikasi Admin
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="admin@sekolah.id"
              className="w-full rounded-xl border border-black bg-neutral-50 px-4 py-3 text-sm transition-all outline-none focus:ring-4 focus:ring-black/5"
              required
            />
            <p className="text-[9px] leading-relaxed text-neutral-400 italic">
              * Email ini akan menerima notifikasi otomatis setiap ada pendaftar baru yang masuk ke
              sistem.
            </p>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-black px-4 py-3 text-xs font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
