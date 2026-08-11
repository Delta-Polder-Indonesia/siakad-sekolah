/**
 * Shared types & pure helpers untuk DiskusiTugas (dipecah dari DiskusiTugas.tsx).
 */
import type { ReactNode } from 'react';
import type { AuthUser, OnlineAssignment } from '../../../types';
import type {
  AssignmentDiscussion,
  ChatGroup,
  GroupChatMessage,
  PrivateMessage,
  Student,
} from '../../../types';

export interface DiskusiTugasProps {
  assignment: OnlineAssignment;
  /** Pengguna yang sedang aktif (guru/murid). Tanpa user, kiriman nonaktif. */
  user?: AuthUser | null;
  /** `full` = tampilan chat lengkap, `compact` = tampilan ringkas. */
  variant?: 'full' | 'compact';
  /** Dipanggil setelah komentar terkirim. */
  onPosted?: () => void;
  /** Isi penuh tinggi induk (`h-full`) alih-alih tinggi tetap 600px. */
  fill?: boolean;
  /** Konten opsional di bagian bawah panel kiri (kolom peserta). */
  leftFooter?: ReactNode;
}

export type ChatMode = 'forum' | 'group';

/** Tipe gabungan pesan yang tampil di alur chat (forum / grup / privat). */
export type ChatStreamItem = AssignmentDiscussion | GroupChatMessage | PrivateMessage;

export interface PrivateTarget {
  id: string;
  name: string;
}

export interface PendingAttachment {
  name: string;
  type: string;
  dataUrl: string;
  size: number;
}

export interface TypingUser {
  userId: string;
  name: string;
  role: string;
}

export function isPrivateMessage(item: ChatStreamItem): item is PrivateMessage {
  return 'senderId' in item;
}

/** Titik indikator status aktif (online/offline). */
export function PresenceDot({ online }: { online: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${
        online ? 'bg-emerald-500' : 'bg-neutral-300'
      }`}
      title={online ? 'Aktif' : 'Tidak aktif'}
    />
  );
}

/** Avatar inisial bulat — hitam untuk guru, biru muda untuk siswa. */
export function Avatar({ name, online }: { name: string; online?: boolean }) {
  const initial = (name.trim().charAt(0) || '?').toUpperCase();
  return (
    <div className="relative shrink-0">
      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-white text-xs font-bold text-black">
        {initial}
      </div>
      {typeof online === 'boolean' && (
        <span
          className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
            online ? 'bg-emerald-500' : 'bg-neutral-300'
          }`}
        />
      )}
    </div>
  );
}

/** Kunci hari (YYYY-M-D) — format persis implementasi asli (bulan 0-indexed). */
export function getDayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Label hari: "Hari Ini", "Kemarin", atau tanggal lokal. */
export function getDayLabel(ts: number) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const day = new Date(ts);
  if (getDayKey(ts) === getDayKey(today.getTime())) return 'Hari Ini';
  if (getDayKey(ts) === getDayKey(yesterday.getTime())) return 'Kemarin';
  return day.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export type {
  AuthUser,
  OnlineAssignment,
  AssignmentDiscussion,
  ChatGroup,
  GroupChatMessage,
  PrivateMessage,
  Student,
};
