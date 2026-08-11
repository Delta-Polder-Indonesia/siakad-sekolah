/**
 * Header workspace chat DiskusiTugas: judul percakapan aktif + toggle
 * Forum/Grup (dengan badge belum dibaca). Dipecah dari DiskusiTugas.tsx.
 */
import { ArrowLeft, Globe, Users } from 'lucide-react';
import type { ChatMode, PrivateTarget } from './DiskusiTugas.types';

interface DiskusiTugasHeaderProps {
  mode: ChatMode;
  privateTarget: PrivateTarget | null;
  activeTitle: string;
  activeSubtitle: string;
  forumUnread: number;
  onSetMode: (mode: ChatMode) => void;
  onBackFromPrivate: () => void;
}

export default function DiskusiTugasHeader({
  mode,
  privateTarget,
  activeTitle,
  activeSubtitle,
  forumUnread,
  onSetMode,
  onBackFromPrivate,
}: DiskusiTugasHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        {privateTarget && (
          <button
            type="button"
            onClick={onBackFromPrivate}
            title="Kembali ke forum/grup"
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md border-2 border-black px-2 py-1 text-[10px] font-bold transition-colors hover:bg-neutral-100"
          >
            <ArrowLeft className="h-3 w-3" /> Kembali
          </button>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-xs font-bold tracking-wide text-black uppercase">
            {activeTitle}
          </h3>
          <p className="truncate text-[10px] text-black/50">{activeSubtitle}</p>
        </div>
      </div>

      {!privateTarget && (
        <div className="flex shrink-0 items-center rounded-md border-2 border-black">
          <button
            type="button"
            onClick={() => onSetMode('forum')}
            className={`flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase transition-colors ${
              mode === 'forum' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            <Globe className="h-3.5 w-3.5" /> Forum
            {forumUnread > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {forumUnread}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onSetMode('group')}
            className={`flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase transition-colors ${
              mode === 'group' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            <Users className="h-3.5 w-3.5" /> Grup
          </button>
        </div>
      )}
    </div>
  );
}
