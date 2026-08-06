import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Plus,
  Users,
  Globe,
  UserPlus,
  UserMinus,
  X,
  MoreVertical,
  Pencil,
  Trash2,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import type { AuthUser } from '../../../types';
import {
  addAssignmentDiscussion,
  getDiscussionsByAssignment,
  editAssignmentDiscussion,
  deleteAssignmentDiscussion,
  addChatGroup,
  deleteChatGroup,
  getChatGroupsByClass,
  addGroupMember,
  removeGroupMember,
  getGroupMessages,
  addGroupMessage,
  editGroupMessage,
  deleteGroupMessage,
  getPrivateMessages,
  addPrivateMessage,
  editPrivateMessage,
  deletePrivateMessage,
  getUnreadPrivateCount,
  getStudentsByClass,
  isStudentOnline,
  touchPresence,
  touchPresenceSilent,
  markScopeRead,
  getUnreadCountForScope,
  setTyping,
  clearTyping,
  getTypingUsers,
} from '../../../data/services';
import type { OnlineAssignment } from '../../../data/services';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { warnaNama } from '../../../codewarna/warnaNama';
import { useToast } from '../../../components/ui';
import { formatDateTime, formatFileSize, roleLabel } from './tugasKonten';

interface DiskusiTugasProps {
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

/** Titik indikator status aktif (online/offline). */
function PresenceDot({ online }: { online: boolean }) {
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
function Avatar({ name, online }: { name: string; online?: boolean }) {
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

function getDayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function getDayLabel(ts: number) {
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

export default function DiskusiTugas({
  assignment,
  user,
  variant = 'full',
  onPosted,
  fill = false,
  leftFooter,
}: DiskusiTugasProps) {
  const storeVersion = useStoreVersion();
  const { showToast } = useToast();
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState<'forum' | 'group'>('forum');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingMembers, setAddingMembers] = useState(false);
  const streamRef = useRef<HTMLDivElement | null>(null);
  const [presenceTick, setPresenceTick] = useState(0);
  // C14: target chat privat 1-1 (siswa yang dipilih)
  const [privateTarget, setPrivateTarget] = useState<{ id: string; name: string } | null>(null);
  // C13: id pesan yang sedang diedit + isi editan
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  // C13: id pesan yang menunya terbuka
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  // C12: lampiran yang menunggu dikirim
  const [pendingAttachment, setPendingAttachment] = useState<{
    name: string;
    type: string;
    dataUrl: string;
    size: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // C15: daftar user yang sedang mengetik di percakapan aktif
  const [typingUsers, setTypingUsers] = useState<
    Array<{ userId: string; name: string; role: string }>
  >([]);
  const typingRef = useRef<string | null>(null);

  const isTeacher = user?.role === 'teacher';

  // Tandai siswa aktif saat membuka + heartbeat berkala (tulis senyap agar
  // tidak me-render ulang seluruh app; komponen ini re-render via presenceTick).
  useEffect(() => {
    if (user?.role !== 'student') return;
    touchPresence(user.id);
    const id = window.setInterval(() => {
      touchPresenceSilent(user.id);
      setPresenceTick((t) => t + 1);
    }, 60_000);
    return () => window.clearInterval(id);
  }, [user?.id, user?.role]);

  const discussions = useMemo(
    () => getDiscussionsByAssignment(assignment.id),
    [assignment.id, storeVersion]
  );

  const groups = useMemo(
    () => getChatGroupsByClass(assignment.classId),
    [assignment.classId, storeVersion]
  );

  // Guru melihat semua grup kelas; murid melihat semua grup agar bisa join/keluar sendiri (C11).
  const visibleGroups = useMemo(() => groups, [groups]);

  const students = useMemo(
    () => getStudentsByClass(assignment.classId),
    [assignment.classId, storeVersion]
  );

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? null,
    [groups, selectedGroupId]
  );

  // C11: apakah user aktif adalah anggota grup yang sedang dipilih.
  const isMemberOfSelected = useMemo(
    () => (selectedGroup ? selectedGroup.memberIds.includes(user?.id ?? '') : false),
    [selectedGroup, user?.id]
  );

  const groupMessages = useMemo(
    () => (selectedGroupId ? getGroupMessages(selectedGroupId) : []),
    [selectedGroupId, storeVersion]
  );

  // C14: pesan privat antara user aktif dan target siswa.
  const privateMessages = useMemo(
    () => (privateTarget && user ? getPrivateMessages(user.id, privateTarget.id) : []),
    [privateTarget, user, storeVersion]
  );

  // C14: jumlah pesan privat belum dibaca dari target (badge di daftar siswa).
  const privateUnreadMap = useMemo(() => {
    if (!user) return {};
    const map: Record<string, number> = {};
    for (const student of students) {
      map[student.id] = getUnreadPrivateCount(user.id, student.id);
    }
    return map;
  }, [students, user, storeVersion]);

  const streamLength =
    mode === 'forum'
      ? discussions.length
      : privateTarget
        ? privateMessages.length
        : groupMessages.length;

  // Auto-scroll pesan ke paling bawah saat buka chat / kirim pesan / ganti mode.
  useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [streamLength, mode, selectedGroupId, privateTarget?.id]);

  // Tandai forum sudah dibaca saat aktif melihatnya.
  useEffect(() => {
    if (mode === 'forum' && user?.id && discussions.length > 0) {
      markScopeRead(`forum:${assignment.id}`, user.id);
    }
  }, [mode, assignment.id, user?.id, discussions.length]);

  // Tandai grup sudah dibaca saat dipilih.
  useEffect(() => {
    if (mode === 'group' && user?.id && selectedGroupId && groupMessages.length > 0) {
      markScopeRead(`group:${selectedGroupId}`, user.id);
    }
  }, [mode, selectedGroupId, user?.id, groupMessages.length]);

  // C14: tandai chat privat sudah dibaca saat dibuka.
  useEffect(() => {
    if (privateTarget && user?.id && privateMessages.length > 0) {
      markScopeRead(`private:${user.id}|${privateTarget.id}`, user.id);
    }
  }, [privateTarget, user?.id, privateMessages.length]);

  // C13: tutup menu opsi pesan saat klik di luar.
  useEffect(() => {
    if (!menuOpenId) return;
    const close = () => setMenuOpenId(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menuOpenId]);

  // C15: scope percakapan aktif (forum / grup / private).
  const activeScopeKey = privateTarget
    ? `private:${user?.id ?? ''}|${privateTarget.id}`
    : mode === 'forum'
      ? `forum:${assignment.id}`
      : selectedGroupId
        ? `group:${selectedGroupId}`
        : '';

  // C15: polling user yang sedang mengetik di percakapan aktif (cross-tab via store).
  useEffect(() => {
    if (!activeScopeKey) {
      setTypingUsers([]);
      return;
    }
    const refresh = () => setTypingUsers(getTypingUsers(activeScopeKey, user?.id ?? ''));
    refresh();
    const id = window.setInterval(refresh, 1500);
    return () => window.clearInterval(id);
  }, [activeScopeKey, user?.id]);

  // C15: hentikan status ketikan saat meninggalkan percakapan.
  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearTyping(typingRef.current, user?.id ?? '');
        typingRef.current = null;
      }
    };
  }, [user?.id]);

  // C15: tandai user sedang mengetik (throttle via timestamp di store) + beri jeda hidup.
  const handleTyping = () => {
    if (!activeScopeKey || !user) return;
    typingRef.current = activeScopeKey;
    setTyping(activeScopeKey, user.id, user.name || 'Pengguna', user.role || 'guest');
  };

  // C15: bersihkan status ketikan setelah kirim.
  const handleStopTyping = () => {
    if (typingRef.current && user) {
      clearTyping(typingRef.current, user.id);
      typingRef.current = null;
    }
    setTypingUsers([]);
  };

  // Auto-pilih grup pertama saat masuk mode grup.
  useEffect(() => {
    if (
      mode === 'group' &&
      visibleGroups.length > 0 &&
      !visibleGroups.some((group) => group.id === selectedGroupId)
    ) {
      setSelectedGroupId(visibleGroups[0].id);
    }
  }, [mode, visibleGroups, selectedGroupId]);

  const handleSendForum = () => {
    if (!user) return;
    const text = draft.trim();
    const hasContent = text || pendingAttachment;
    if (!hasContent) return;
    addAssignmentDiscussion({
      id: `disc_${Date.now()}`,
      assignmentId: assignment.id,
      authorId: user.id,
      authorName: user.name || 'Pengguna',
      role: user.role || 'guest',
      message: text,
      createdAt: Date.now(),
      ...(pendingAttachment ? { attachment: pendingAttachment } : {}),
    });
    setDraft('');
    setPendingAttachment(null);
    handleStopTyping();
    onPosted?.();
  };

  const handleSendGroup = () => {
    if (!user || !selectedGroup) return;
    const text = draft.trim();
    const hasContent = text || pendingAttachment;
    if (!hasContent) return;
    const isMember = selectedGroup.memberIds.includes(user.id);
    if (!isMember && !isTeacher) return;
    addGroupMessage({
      id: `gm_${Date.now()}`,
      groupId: selectedGroup.id,
      authorId: user.id,
      authorName: user.name || 'Pengguna',
      role: user.role || 'guest',
      message: text,
      createdAt: Date.now(),
      ...(pendingAttachment ? { attachment: pendingAttachment } : {}),
    });
    setDraft('');
    setPendingAttachment(null);
    handleStopTyping();
    onPosted?.();
  };

  const handleSendPrivate = () => {
    if (!user || !privateTarget) return;
    const text = draft.trim();
    const hasContent = text || pendingAttachment;
    if (!hasContent) return;
    addPrivateMessage({
      id: `pm_${Date.now()}`,
      senderId: user.id,
      receiverId: privateTarget.id,
      authorName: user.name || 'Pengguna',
      role: user.role || 'guest',
      message: text,
      createdAt: Date.now(),
      ...(pendingAttachment ? { attachment: pendingAttachment } : {}),
    });
    setDraft('');
    setPendingAttachment(null);
    handleStopTyping();
    onPosted?.();
  };

  const handleSend = () => {
    if (privateTarget) return handleSendPrivate();
    return mode === 'forum' ? handleSendForum() : handleSendGroup();
  };

  // C12: baca file yang dipilih → dataUrl (batasi ~1.5MB).
  const handlePickFile = (file: File | undefined | null) => {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      showToast('error', 'Ukuran file maksimal 1.5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPendingAttachment({
        name: file.name,
        type: file.type || 'application/octet-stream',
        dataUrl: String(reader.result ?? ''),
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  // C13: mulai edit pesan.
  const handleStartEdit = (id: string, message: string) => {
    setEditingId(id);
    setEditingText(message);
    setMenuOpenId(null);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const text = editingText.trim();
    if (!text) return;
    if (privateTarget) {
      editPrivateMessage(editingId, text);
    } else if (mode === 'forum') {
      editAssignmentDiscussion(editingId, text);
    } else {
      editGroupMessage(editingId, text);
    }
    setEditingId(null);
    setEditingText('');
    onPosted?.();
  };

  // C13: hapus pesan (dengan konfirmasi).
  const handleDeleteMessage = (id: string) => {
    if (!window.confirm('Hapus pesan ini?')) return;
    if (privateTarget) {
      deletePrivateMessage(id);
    } else if (mode === 'forum') {
      deleteAssignmentDiscussion(id);
    } else {
      deleteGroupMessage(id);
    }
    setMenuOpenId(null);
    onPosted?.();
  };

  const handleCreateGroup = () => {
    if (!isTeacher || !user) return;
    const name = window.prompt('Nama grup baru:');
    if (name && name.trim()) {
      addChatGroup({
        id: `cg_${Date.now()}`,
        classId: assignment.classId,
        name: name.trim(),
        memberIds: [],
        createdBy: user.id,
        createdAt: Date.now(),
      });
    }
  };

  const handleToggleMember = (studentId: string) => {
    if (!isTeacher || !selectedGroup) return;
    if (selectedGroup.memberIds.includes(studentId)) {
      removeGroupMember(selectedGroup.id, studentId);
    } else {
      addGroupMember(selectedGroup.id, studentId);
    }
  };

  // C11: murid join/keluar grup sendiri.
  const handleJoinLeaveGroup = (groupId: string) => {
    if (isTeacher || !user) return;
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    if (group.memberIds.includes(user.id)) {
      removeGroupMember(groupId, user.id);
      if (selectedGroupId === groupId) setSelectedGroupId('');
    } else {
      addGroupMember(groupId, user.id);
      setSelectedGroupId(groupId);
    }
  };

  const stream = privateTarget ? privateMessages : mode === 'forum' ? discussions : groupMessages;

  const q = searchQuery.trim().toLowerCase();

  // A1: filter pencarian — daftar siswa, daftar grup, dan alur pesan.
  const filteredStudents = useMemo(() => {
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, q]);

  // Daftar anggota grup terpilih (hanya yang benar-benar anggota) vs kandidat.
  const groupMembers = useMemo(
    () => (selectedGroup ? students.filter((s) => selectedGroup.memberIds.includes(s.id)) : []),
    [students, selectedGroup]
  );
  const groupCandidates = useMemo(
    () => (selectedGroup ? students.filter((s) => !selectedGroup.memberIds.includes(s.id)) : []),
    [students, selectedGroup]
  );
  const shownMembers = useMemo(() => {
    if (!q) return groupMembers;
    return groupMembers.filter((s) => s.name.toLowerCase().includes(q));
  }, [groupMembers, q]);
  const shownCandidates = useMemo(() => {
    if (!q) return groupCandidates;
    return groupCandidates.filter((s) => s.name.toLowerCase().includes(q));
  }, [groupCandidates, q]);

  const filteredGroups = useMemo(() => {
    if (!q) return visibleGroups;
    return visibleGroups.filter((g) => g.name.toLowerCase().includes(q));
  }, [visibleGroups, q]);

  const filteredStream = useMemo(() => {
    if (!q) return stream;
    return stream.filter(
      (m) => m.message.toLowerCase().includes(q) || (m.authorName || '').toLowerCase().includes(q)
    );
  }, [stream, q]);

  // B6: jumlah pesan belum dibaca per forum & per grup.
  const forumScopeKey = `forum:${assignment.id}`;
  const forumUnread = useMemo(
    () => getUnreadCountForScope(forumScopeKey, user?.id ?? '', discussions),
    [forumScopeKey, user?.id, discussions, storeVersion]
  );
  const groupUnreadMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const group of groups) {
      map[group.id] = getUnreadCountForScope(
        `group:${group.id}`,
        user?.id ?? '',
        getGroupMessages(group.id)
      );
    }
    return map;
  }, [groups, user?.id, storeVersion]);

  if (variant === 'compact') {
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
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendForum();
            }}
            placeholder="Ketik balasan..."
            className="flex-1 bg-transparent text-xs text-black outline-none placeholder:text-black/40"
          />
          <button
            type="button"
            onClick={handleSendForum}
            disabled={!draft.trim() || !user}
            className="rounded-md border-2 border-black bg-black px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-neutral-800 disabled:opacity-40"
          >
            Kirim
          </button>
        </div>
      </div>
    );
  }

  const activeTitle = privateTarget
    ? `Chat Privat`
    : mode === 'forum'
      ? 'Forum Diskusi Kelas'
      : (selectedGroup?.name ?? 'Grup');
  const activeSubtitle = privateTarget
    ? `Dengan ${privateTarget.name}`
    : mode === 'forum'
      ? `${discussions.length} pesan · terlihat semua murid`
      : selectedGroup
        ? `${selectedGroup.memberIds.length} anggota`
        : '';

  const canSend = privateTarget
    ? !!user
    : mode === 'forum'
      ? !!user
      : !!user && !!selectedGroup && (isTeacher || selectedGroup.memberIds.includes(user.id));

  return (
    <div
      className={`flex w-full border-2 border-black bg-white font-sans text-black ${
        fill ? 'h-full min-h-0' : 'h-[600px] max-h-[calc(100dvh-180px)]'
      }`}
    >
      {/* ----------------- PANEL KIRI: FORUM / GRUP ----------------- */}
      <aside className="flex w-72 flex-col border-r-2 border-black">
        {/* Search Input */}
        <div className="flex items-center gap-2 border-b-2 border-black px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-black/50" />
          <input
            type="text"
            placeholder="Cari percakapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs outline-none placeholder:text-black/40"
          />
        </div>

        {mode === 'forum' ? (
          /* ---------- MODE FORUM (terlihat semua murid) ---------- */
          <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain">
            <div className="border-b-2 border-black bg-white px-3 py-1.5 text-[10px] font-bold tracking-wider text-black uppercase">
              Peserta Forum (Semua)
            </div>
            {filteredStudents.length === 0 && (
              <div className="px-3 py-6 text-center">
                <Search className="mx-auto h-6 w-6 text-black/30" />
                <p className="mt-2 text-[11px] text-black/50 italic">
                  {q
                    ? 'Tidak ada siswa yang cocok dengan pencarian.'
                    : 'Belum ada siswa di kelas ini.'}
                </p>
              </div>
            )}
            <div>
              {filteredStudents.map((student) => {
                const online = isStudentOnline(student.id);
                const unread = privateUnreadMap[student.id] ?? 0;
                const isTarget = privateTarget?.id === student.id;
                return (
                  <div
                    key={student.id}
                    onClick={() => setPrivateTarget({ id: student.id, name: student.name })}
                    className={`flex cursor-pointer items-center justify-between border-b border-black/10 px-3 py-2.5 last:border-0 ${
                      isTarget
                        ? 'bg-neutral-100 text-black shadow-[inset_3px_0_0_0_#2563eb]'
                        : 'hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <PresenceDot online={online} />
                      <p className="truncate text-xs" style={{ color: warnaNama(student.name) }}>
                        {student.name}
                      </p>
                      {unread > 0 && (
                        <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                          {unread}
                        </span>
                      )}
                    </div>
                    <span
                      className={`shrink-0 text-[10px] ${isTarget ? 'text-black/60' : 'text-black/40'}`}
                    >
                      {online ? 'Aktif' : 'Offline'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ---------- MODE GRUP (chat privat per grup) ---------- */
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Kotak GRUP (bingkai terpisah, scroll sendiri) */}
            <div className="flex min-h-0 flex-1 flex-col border-b-2 border-black">
              <div className="flex items-center justify-between border-b-2 border-black bg-white px-3 py-1.5">
                <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                  Grup
                </span>
                {isTeacher && (
                  <button
                    type="button"
                    onClick={handleCreateGroup}
                    title="Buat grup baru"
                    className="inline-flex cursor-pointer items-center gap-0.5 text-[11px] font-bold text-black hover:text-black/60"
                  >
                    <Plus className="h-3.5 w-3.5" /> Grup
                  </button>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {filteredGroups.length === 0 && (
                  <div className="px-3 py-6 text-center">
                    {q ? (
                      <Search className="mx-auto h-6 w-6 text-black/30" />
                    ) : (
                      <Users className="mx-auto h-6 w-6 text-black/30" />
                    )}
                    <p className="mt-2 text-[11px] text-black/50 italic">
                      {q
                        ? 'Tidak ada grup yang cocok dengan pencarian.'
                        : isTeacher
                          ? 'Belum ada grup. Klik "+ Grup" untuk membuat.'
                          : 'Belum ada grup di kelas ini. Gabung ke grup yang dibuat guru untuk mulai berdiskusi.'}
                    </p>
                  </div>
                )}{' '}
                {filteredGroups.map((group) => {
                  const isSelected = group.id === selectedGroupId;
                  const isMember = user ? group.memberIds.includes(user.id) : false;
                  const unread = groupUnreadMap[group.id] ?? 0;
                  return (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGroupId(group.id)}
                      className={`flex cursor-pointer items-center justify-between border-b border-black/10 px-3 py-2.5 transition-colors last:border-0 ${
                        isSelected
                          ? 'bg-neutral-100 text-black shadow-[inset_3px_0_0_0_#2563eb]'
                          : 'hover:bg-neutral-100'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="flex items-center gap-1.5 truncate text-xs font-bold">
                          <span className="truncate" style={{ color: warnaNama(group.name) }}>
                            {group.name}
                          </span>
                          {isMember && unread > 0 && (
                            <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                              {unread}
                            </span>
                          )}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          {group.memberIds.length > 0 && (
                            <span className="flex shrink-0 -space-x-1.5">
                              {group.memberIds.slice(0, 4).map((mid) => {
                                const member = students.find((s) => s.id === mid);
                                return (
                                  <span
                                    key={mid}
                                    className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[8px] font-bold text-blue-800 ring-1 ring-white"
                                  >
                                    {(member?.name?.trim().charAt(0) || '?').toUpperCase()}
                                  </span>
                                );
                              })}
                            </span>
                          )}
                          <p className="truncate text-[10px] text-black/40">
                            {group.memberIds.length} anggota
                            {isMember ? ' · Anda anggota' : ' · Anda belum bergabung'}
                          </p>
                        </div>
                      </div>
                      {isTeacher ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChatGroup(group.id);
                            if (selectedGroupId === group.id) setSelectedGroupId('');
                          }}
                          title="Hapus grup"
                          className="shrink-0 rounded p-0.5 hover:bg-white/20"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinLeaveGroup(group.id);
                          }}
                          title={isMember ? 'Keluar dari grup' : 'Gabung ke grup'}
                          className={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                            isMember
                              ? 'border-black/10 text-black/50 hover:bg-neutral-100'
                              : 'border-black text-black hover:bg-black hover:text-white'
                          }`}
                        >
                          {isMember ? (
                            <UserMinus className="h-3 w-3" />
                          ) : (
                            <UserPlus className="h-3 w-3" />
                          )}
                          {isMember ? 'Keluar' : 'Gabung'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kotak ANGGOTA (hanya anggota grup; bingkai terpisah, scroll sendiri) */}
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b-2 border-black bg-white px-3 py-1.5">
                <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                  Anggota {selectedGroup ? `(${selectedGroup.memberIds.length})` : ''}
                </span>
                {isTeacher && (
                  <button
                    type="button"
                    onClick={() => setAddingMembers((v) => !v)}
                    disabled={!selectedGroup}
                    title={addingMembers ? 'Tutup daftar calon anggota' : 'Tambah anggota ke grup'}
                    className="inline-flex cursor-pointer items-center gap-0.5 text-[11px] font-bold text-black hover:text-black/60 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {addingMembers ? (
                      <X className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    {addingMembers ? 'Selesai' : '+ Tambah'}
                  </button>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {!selectedGroup && (
                  <div className="px-3 py-6 text-center">
                    <Users className="mx-auto h-6 w-6 text-black/30" />
                    <p className="mt-2 text-[11px] text-black/50 italic">
                      Pilih grup dari daftar untuk melihat anggotanya.
                    </p>
                  </div>
                )}

                {selectedGroup && !isTeacher && !isMemberOfSelected && (
                  <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
                    <p className="text-[11px] text-black/50 italic">
                      Anda belum menjadi anggota grup ini.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleJoinLeaveGroup(selectedGroup.id)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-black px-2.5 py-1 text-[10px] font-bold transition-colors hover:bg-neutral-100"
                    >
                      <UserPlus className="h-3 w-3" /> Gabung Grup
                    </button>
                  </div>
                )}

                {selectedGroup && isTeacher && !addingMembers && shownMembers.length === 0 && (
                  <div className="px-3 py-6 text-center">
                    <Users className="mx-auto h-6 w-6 text-black/30" />
                    <p className="mt-2 text-[11px] text-black/50 italic">
                      {q
                        ? 'Tidak ada siswa yang cocok dengan pencarian.'
                        : 'Belum ada anggota di grup ini. Klik "+ Tambah" untuk menambah siswa.'}
                    </p>
                  </div>
                )}

                {selectedGroup && addingMembers && shownCandidates.length === 0 && (
                  <div className="px-3 py-6 text-center">
                    <UserPlus className="mx-auto h-6 w-6 text-black/30" />
                    <p className="mt-2 text-[11px] text-black/50 italic">
                      {q ? 'Tidak ada siswa yang cocok.' : 'Semua siswa sudah menjadi anggota.'}
                    </p>
                  </div>
                )}

                {selectedGroup &&
                  !addingMembers &&
                  shownMembers.map((student) => {
                    const online = isStudentOnline(student.id);
                    const unread = privateUnreadMap[student.id] ?? 0;
                    return (
                      <div
                        key={student.id}
                        onClick={() => setPrivateTarget({ id: student.id, name: student.name })}
                        className="flex cursor-pointer items-center justify-between border-b border-black/10 px-3 py-2 last:border-0 hover:bg-neutral-100"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <PresenceDot online={online} />
                          <p
                            className="truncate text-xs"
                            style={{ color: warnaNama(student.name) }}
                          >
                            {student.name}
                          </p>
                          {unread > 0 && (
                            <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                              {unread}
                            </span>
                          )}
                        </div>
                        {isTeacher && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleMember(student.id);
                            }}
                            title="Keluarkan dari grup"
                            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border-2 border-black px-1.5 py-0.5 text-[10px] font-bold transition-colors hover:bg-neutral-100"
                          >
                            <UserMinus className="h-3 w-3" /> Keluar
                          </button>
                        )}
                      </div>
                    );
                  })}

                {selectedGroup &&
                  addingMembers &&
                  shownCandidates.map((student) => {
                    const online = isStudentOnline(student.id);
                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between border-b border-black/10 px-3 py-2 last:border-0"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <PresenceDot online={online} />
                          <p
                            className="truncate text-xs"
                            style={{ color: warnaNama(student.name) }}
                          >
                            {student.name}
                          </p>
                        </div>
                        {isTeacher && (
                          <button
                            type="button"
                            onClick={() => handleToggleMember(student.id)}
                            title="Tambahkan ke grup"
                            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border-2 border-black px-1.5 py-0.5 text-[10px] font-bold transition-colors hover:bg-neutral-100"
                          >
                            <UserPlus className="h-3 w-3" /> + Grup
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {leftFooter && <div className="border-t-2 border-black p-3">{leftFooter}</div>}
      </aside>

      {/* ----------------- PANEL KANAN: WORKSPACE CHAT ----------------- */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Workspace Header */}
        <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {privateTarget && (
              <button
                type="button"
                onClick={() => setPrivateTarget(null)}
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
                onClick={() => setMode('forum')}
                className={`flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase transition-colors ${
                  mode === 'forum'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-neutral-100'
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
                onClick={() => setMode('group')}
                className={`flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase transition-colors ${
                  mode === 'group'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                <Users className="h-3.5 w-3.5" /> Grup
              </button>
            </div>
          )}
        </div>

        {/* Message Stream */}
        <div ref={streamRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
          {filteredStream.length === 0 && (
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

          {filteredStream.map((item, index) => {
            const isMe =
              'senderId' in item ? user?.id === item.senderId : user?.id === item.authorId;
            const prev = index > 0 ? filteredStream[index - 1] : null;
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
                            onClick={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
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
                                onClick={() => handleStartEdit(item.id, item.message)}
                                className="flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-left hover:bg-neutral-100"
                              >
                                <Pencil className="h-3 w-3" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(item.id)}
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
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') {
                                setEditingId(null);
                                setEditingText('');
                              }
                            }}
                            className="bg-transparent text-xs text-black outline-none placeholder:text-black/40"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditingText('');
                              }}
                              className="rounded-md border-2 border-black px-2 py-0.5 text-[10px] font-bold text-black hover:bg-neutral-100"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveEdit}
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
                                  ? 'border-blue-600 bg-white text-black hover:bg-neutral-100'
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

        {/* Action Footer / Input Box */}
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
                <span className="block truncate text-[11px] font-bold">
                  {pendingAttachment.name}
                </span>
                <span className="block text-[9px] text-black/50">
                  {formatFileSize(pendingAttachment.size)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setPendingAttachment(null)}
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
                handlePickFile(e.target.files?.[0]);
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
                setDraft(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
                else handleTyping();
              }}
              onBlur={handleStopTyping}
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
              onClick={handleSend}
              disabled={(!draft.trim() && !pendingAttachment) || !canSend}
              className="flex items-center gap-1 rounded-md border-2 border-black bg-black px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-neutral-800 disabled:opacity-40"
            >
              <span>KIRIM</span>
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
