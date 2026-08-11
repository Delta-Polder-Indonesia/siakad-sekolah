/**
 * Modal audit trail AdminPanel PPDB (dipecah dari AdminPanel.tsx).
 */
import { X } from 'lucide-react';
import type { PPDBAuditLog } from '../../data/services';
import { formatDate } from './AdminPanel.types';

interface AdminPanelAuditModalProps {
  logs: PPDBAuditLog[];
  onClose: () => void;
}

export default function AdminPanelAuditModal({ logs, onClose }: AdminPanelAuditModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-100/80 p-4">
      <div className="mx-auto mt-4 w-full max-w-4xl rounded-xl border border-black bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black px-5 py-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">
              Audit Trail
            </p>
            <h2 className="text-base font-bold text-black">Log Aktivitas Sistem</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-black p-1 text-black transition-colors hover:bg-black hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-[10px] font-bold tracking-widest text-black uppercase">
                — Belum ada log audit —
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/20">
              {logs.map((log) => (
                <div key={log.id} className="px-5 py-3 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-black">{log.action}</p>
                    <p className="font-mono text-[10px] text-black">{formatDate(log.occurredAt)}</p>
                  </div>
                  <p className="text-[10px] text-black">Aktor: {log.actor}</p>
                  {log.metadata && (
                    <p className="text-[10px] text-black">
                      {Object.entries(log.metadata)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' | ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
