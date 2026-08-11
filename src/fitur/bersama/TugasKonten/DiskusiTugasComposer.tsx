/**
 * Kotak input pesan DiskusiTugas: indikator "sedang mengetik", lampiran file,
 * input teks, dan tombol kirim. Dipecah dari DiskusiTugas.tsx.
 */
import type { RefObject } from 'react';
import { Paperclip, Send, X, FileText } from 'lucide-react';
import { formatFileSize } from './tugasKonten';
import type { ChatMode, PendingAttachment, PrivateTarget, TypingUser } from './DiskusiTugas.types';

interface DiskusiTugasComposerProps {
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  canSend: boolean;
  typingUsers: TypingUser[];
  pendingAttachment: PendingAttachment | null;
  onRemoveAttachment: () => void;
  onPickFile: (file: File | undefined | null) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onTyping: () => void;
  onStopTyping: () => void;
  mode: ChatMode;
  privateTarget: PrivateTarget | null;
}

export default function DiskusiTugasComposer(props: DiskusiTugasComposerProps) {
  const {
    draft,
    onDraftChange,
    onSend,
    canSend,
    typingUsers,
    pendingAttachment,
    onRemoveAttachment,
    onPickFile,
    fileInputRef,
    onTyping,
    onStopTyping,
    mode,
    privateTarget,
  } = props;

  return (
    <div className="border-t-2 border-black p-4">
      {typingUsers.length > 0 && (
        <div className="mb-2 flex items-center gap-2 px-1 text-[11px] text-black/50 italic">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="truncate">
            {typingUsers.length === 1
              ? `${typingUsers[0].name} sedang mengetik…`
              : `${typingUsers
                  .map((u) => u.name)
                  .slice(0, 2)
                  .join(
                    ', '
                  )}${typingUsers.length > 2 ? ` +${typingUsers.length - 2} lainnya` : ''} sedang mengetik…`}
          </span>
        </div>
      )}
      {pendingAttachment && (
        <div className="mb-2 flex items-center gap-2 rounded-md border-2 border-black bg-white px-2 py-1.5">
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-bold">{pendingAttachment.name}</span>
            <span className="block text-[9px] text-black/50">
              {formatFileSize(pendingAttachment.size)}
            </span>
          </span>
          <button
            type="button"
            onClick={onRemoveAttachment}
            title="Hapus lampiran"
            className="flex shrink-0 cursor-pointer items-center rounded p-0.5 text-black/50 hover:bg-neutral-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-600">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            onPickFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          title="Lampirkan File (maks. 1.5MB)"
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer items-center text-black hover:opacity-60"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          type="text"
          value={draft}
          onChange={(e) => {
            onDraftChange(e.target.value);
            onTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend();
            else onTyping();
          }}
          onBlur={onStopTyping}
          placeholder={
            privateTarget
              ? `Tulis pesan untuk ${privateTarget.name}...`
              : mode === 'forum'
                ? 'Tulis pesan forum (terlihat semua murid)...'
                : 'Tulis pesan grup...'
          }
          className="flex-1 bg-transparent text-xs text-black outline-none placeholder:text-black/40"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={(!draft.trim() && !pendingAttachment) || !canSend}
          className="flex items-center gap-1 rounded-md border-2 border-black bg-black px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-neutral-800 disabled:opacity-40"
        >
          <span>KIRIM</span>
          <Send className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
