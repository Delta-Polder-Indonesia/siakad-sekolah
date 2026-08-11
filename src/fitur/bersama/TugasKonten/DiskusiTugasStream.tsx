/**
 * Alur pesan DiskusiTugas: pemisah hari, bubble chat, lampiran, dan menu
 * edit/hapus untuk pesan milik sendiri. Dipecah dari DiskusiTugas.tsx.
 */
import type { RefObject } from 'react';
import { MessageSquare, Users, Globe, MoreVertical, Pencil, Trash2, FileText } from 'lucide-react';
import { warnaNama } from '../../../codewarna/warnaNama';
import { formatDateTime, formatFileSize, roleLabel } from './tugasKonten';
import {
  Avatar,
  getDayKey,
  getDayLabel,
  isPrivateMessage,
  type ChatMode,
  type ChatStreamItem,
  type PrivateTarget,
} from './DiskusiTugas.types';

interface DiskusiTugasStreamProps {
  streamRef: RefObject<HTMLDivElement | null>;
  messages: ChatStreamItem[];
  q: string;
  selfId: string;
  mode: ChatMode;
  privateTarget: PrivateTarget | null;
  editingId: string | null;
  editingText: string;
  menuOpenId: string | null;
  onEditingTextChange: (v: string) => void;
  onStartEdit: (id: string, message: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDeleteMessage: (id: string) => void;
  onToggleMenu: (id: string) => void;
}

export default function DiskusiTugasStream(props: DiskusiTugasStreamProps) {
  const {
    streamRef,
    messages,
    q,
    selfId,
    mode,
    privateTarget,
    editingId,
    editingText,
    menuOpenId,
    onEditingTextChange,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDeleteMessage,
    onToggleMenu,
  } = props;

  return (
    <div ref={streamRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
      {messages.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
          {q ? (
            <MessageSquare className="h-8 w-8 text-black/30" />
          ) : privateTarget ? (
            <Users className="h-8 w-8 text-black/30" />
          ) : mode === 'forum' ? (
            <Globe className="h-8 w-8 text-black/30" />
          ) : (
            <Users className="h-8 w-8 text-black/30" />
          )}
          <p className="text-xs font-semibold text-black/50">
            {q
              ? 'Tidak ada pesan yang cocok'
              : privateTarget
                ? 'Belum ada percakapan'
                : mode === 'forum'
                  ? 'Belum ada diskusi di forum'
                  : 'Belum ada pesan di grup ini'}
          </p>
          <p className="text-[11px] text-black/40">
            {q
              ? 'Coba kata kunci lain.'
              : privateTarget
                ? 'Kirim sapaan pertama untuk memulai chat privat.'
                : mode === 'forum'
                  ? 'Jadilah yang pertama menulis pertanyaan atau tanggapan.'
                  : 'Kirim pesan pertama untuk memulai diskusi grup.'}
          </p>
        </div>
      )}

      {messages.map((item, index) => {
        const isMe = isPrivateMessage(item)
          ? selfId === item.senderId
          : selfId === item.authorId;
        const prev = index > 0 ? messages[index - 1] : null;
        const showDate = !prev || getDayKey(item.createdAt) !== getDayKey(prev.createdAt);
        const isEditing = editingId === item.id;
        return (
          <div key={item.id}>
            {showDate && (
              <div className="my-3 flex items-center justify-center">
                <span className="rounded-full border-2 border-black bg-white px-3 py-0.5 text-[10px] font-bold text-black">
                  {getDayLabel(item.createdAt)}
                </span>
              </div>
            )}

            <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              <Avatar name={item.authorName} />
              <div
                className={`flex max-w-[calc(100%-2rem)] flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="mb-0.5 flex items-center gap-2 text-[10px]">
                  <span className="font-bold" style={{ color: warnaNama(item.authorName) }}>
                    {item.authorName}
                  </span>
                  <span className="text-black/50">[{roleLabel(item.role)}]</span>
                  <span className="text-black/40">{formatDateTime(item.createdAt)}</span>
                  {isMe && (
                    <span className="relative">
                      <button
                        type="button"
                        onClick={() => onToggleMenu(item.id)}
                        title="Opsi pesan"
                        className="flex cursor-pointer items-center rounded p-0.5 text-black/50 hover:bg-neutral-100 hover:text-black"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                      {menuOpenId === item.id && (
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-full right-0 z-20 mt-1 flex flex-col border border-black bg-white py-1 text-[10px] font-bold text-black shadow-lg"
                        >
                          <button
                            type="button"
                            onClick={() => onStartEdit(item.id, item.message)}
                            className="flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-left hover:bg-neutral-100"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteMessage(item.id)}
                            className="flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-left text-red-600 hover:bg-neutral-100"
                          >
                            <Trash2 className="h-3 w-3" /> Hapus
                          </button>
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed ${
                    isMe
                      ? 'rounded-md rounded-br-sm border-2 border-black bg-white text-black'
                      : 'rounded-md rounded-bl-sm border-2 border-black bg-white text-black'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex w-64 flex-col gap-1.5">
                      <input
                        autoFocus
                        value={editingText}
                        onChange={(e) => onEditingTextChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') onSaveEdit();
                          if (e.key === 'Escape') onCancelEdit();
                        }}
                        className="bg-transparent text-xs text-black outline-none placeholder:text-black/40"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={onCancelEdit}
                          className="rounded-md border-2 border-black px-2 py-0.5 text-[10px] font-bold text-black hover:bg-neutral-100"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={onSaveEdit}
                          disabled={!editingText.trim()}
                          className="rounded-md border-2 border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white hover:bg-neutral-800 disabled:opacity-40"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.message && <p className="whitespace-pre-line">{item.message}</p>}
                      {item.attachment && (
                        <a
                          href={item.attachment.dataUrl}
                          download={item.attachment.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`mt-1.5 flex items-center gap-2 rounded-md border-2 p-2 text-[11px] font-semibold ${
                            isMe
                              ? 'border-black bg-black text-white hover:bg-neutral-100'
                              : 'border-black bg-white text-black hover:bg-neutral-100'
                          }`}
                        >
                          <FileText className="h-4 w-4 shrink-0" />
                          <span className="min-w-0">
                            <span className="block max-w-[180px] truncate">
                              {item.attachment.name}
                            </span>
                            <span className="block text-[9px] opacity-60">
                              {formatFileSize(item.attachment.size)} · buka
                            </span>
                          </span>
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
