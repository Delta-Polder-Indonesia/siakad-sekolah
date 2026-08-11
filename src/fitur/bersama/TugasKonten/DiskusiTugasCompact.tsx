/**
 * Varian ringkas DiskusiTugas — hanya forum + kotak balasan.
 * Dipecah dari DiskusiTugas.tsx.
 */
import { MessageSquare } from 'lucide-react';
import type { AuthUser, AssignmentDiscussion } from '../../../types';
import { warnaNama } from '../../../codewarna/warnaNama';
import { formatDateTime, roleLabel } from './tugasKonten';

interface DiskusiTugasCompactProps {
  discussions: AssignmentDiscussion[];
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  user?: AuthUser | null;
}

export default function DiskusiTugasCompact({
  discussions,
  draft,
  onDraftChange,
  onSend,
  user,
}: DiskusiTugasCompactProps) {
  return (
    <div className="mt-4 border-t-2 border-black pt-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
        <MessageSquare className="h-3.5 w-3.5" />
        <span>Diskusi ({discussions.length})</span>
      </div>

      <div className="max-h-[200px] space-y-2 overflow-y-auto overscroll-contain pr-1">
        {discussions.length === 0 && (
          <p className="text-xs text-black/50 italic">Belum ada diskusi pada tugas ini.</p>
        )}
        {discussions.map((d) => (
          <div key={d.id} className="border-b border-black/10 pb-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold" style={{ color: warnaNama(d.authorName) }}>
                {d.authorName}{' '}
                <span className="text-[10px] text-black/50">({roleLabel(d.role)})</span>
              </span>
              <span className="text-[10px] text-black/40">{formatDateTime(d.createdAt)}</span>
            </div>
            <p className="mt-1 text-xs whitespace-pre-line text-black">{d.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 border-t border-black/10 pt-2">
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend();
          }}
          placeholder="Ketik balasan..."
          className="flex-1 bg-transparent text-xs text-black outline-none placeholder:text-black/40"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!draft.trim() || !user}
          className="rounded-md border-2 border-black bg-black px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-neutral-800 disabled:opacity-40"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
