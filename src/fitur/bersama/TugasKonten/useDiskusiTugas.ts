/**
 * Hook logika DiskusiTugas — semua state, memo, effect, dan handler chat
 * (forum / grup / privat) dipisah dari JSX agar komponen murni presentasional.
 * Dipecah dari DiskusiTugas.tsx.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { useToast } from '../../../components/ui';
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
  markScopeRead,
  getUnreadCountForScope,
  setTyping,
  clearTyping,
  getTypingUsers,
  touchPresence,
  touchPresenceSilent,
  getLocalTeacherId,
  getLocalStudentId,
} from '../../../data/services';
import type {
  AuthUser,
  OnlineAssignment,
  AssignmentDiscussion,
  ChatGroup,
  PrivateMessage,
} from '../../../types';
import {
  type ChatMode,
  type ChatStreamItem,
  type PendingAttachment,
  type PrivateTarget,
  type TypingUser,
} from './DiskusiTugas.types';

export interface UseDiskusiTugasResult {
  // state mentah
  draft: string;
  setDraft: (v: string) => void;
  mode: ChatMode;
  setMode: (m: ChatMode) => void;
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  addingMembers: boolean;
  setAddingMembers: (v: boolean) => void;
  streamRef: React.RefObject<HTMLDivElement | null>;
  privateTarget: PrivateTarget | null;
  setPrivateTarget: (t: PrivateTarget | null) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editingText: string;
  setEditingText: (v: string) => void;
  menuOpenId: string | null;
  setMenuOpenId: (id: string | null) => void;
  pendingAttachment: PendingAttachment | null;
  setPendingAttachment: (a: PendingAttachment | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  typingUsers: TypingUser[];

  // data turunan
  isTeacher: boolean;
  selfId: string;
  discussions: AssignmentDiscussion[];
  groups: ChatGroup[];
  visibleGroups: ChatGroup[];
  students: ReturnType<typeof getStudentsByClass>;
  selectedGroup: ChatGroup | null;
  isMemberOfSelected: boolean;
  groupMessages: ReturnType<typeof getGroupMessages>;
  privateMessages: PrivateMessage[];
  privateUnreadMap: Record<string, number>;
  stream: ChatStreamItem[];
  q: string;
  filteredStudents: ReturnType<typeof getStudentsByClass>;
  groupMembers: ReturnType<typeof getStudentsByClass>;
  groupCandidates: ReturnType<typeof getStudentsByClass>;
  shownMembers: ReturnType<typeof getStudentsByClass>;
  shownCandidates: ReturnType<typeof getStudentsByClass>;
  filteredGroups: ChatGroup[];
  filteredStream: ChatStreamItem[];
  forumUnread: number;
  groupUnreadMap: Record<string, number>;
  activeScopeKey: string;

  // handler
  handleTyping: () => void;
  handleStopTyping: () => void;
  handleSend: () => void;
  handleSendForum: () => void;
  handlePickFile: (file: File | undefined | null) => void;
  handleStartEdit: (id: string, message: string) => void;
  handleSaveEdit: () => void;
  handleDeleteMessage: (id: string) => void;
  handleCreateGroup: () => void;
  handleToggleMember: (studentId: string) => void;
  handleJoinLeaveGroup: (groupId: string) => void;
}

/**
 * Semua logika DiskusiTugas dalam satu hook. Komponen hanya membaca hasilnya.
 */
export function useDiskusiTugas(
  assignment: OnlineAssignment,
  user?: AuthUser | null,
  onPosted?: () => void
): UseDiskusiTugasResult {
  const storeVersion = useStoreVersion();
  const { showToast } = useToast();
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState<ChatMode>('forum');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingMembers, setAddingMembers] = useState(false);
  const streamRef = useRef<HTMLDivElement | null>(null);
  const [presenceTick, setPresenceTick] = useState(0);

  const [privateTarget, setPrivateTarget] = useState<PrivateTarget | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingRef = useRef<string | null>(null);

  const isTeacher = user?.role === 'teacher';

  // Identitas diri pada data chat/grup selalu memakai id lokal (backend memakai
  // CUID yang tidak pernah cocok dengan id store lokal / memberIds grup).
  const selfId = useMemo(() => {
    if (!user) return '';
    if (user.role === 'teacher') return getLocalTeacherId(user) || user.id;
    if (user.role === 'student') return getLocalStudentId(user) || user.id;
    return user.id;
  }, [user]);

  // Presensi: tick berkala (10 dtk) + online/offline event → badge Aktif selalu segar.
  useEffect(() => {
    const tick = () => setPresenceTick((v) => v + 1);
    const id = window.setInterval(tick, 10000);
    const online = () => {
      tick();
      if (selfId) touchPresenceSilent(selfId);
    };
    const offline = () => tick();
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    if (selfId) touchPresence(selfId);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, [selfId]);

  const discussions = useMemo(
    () => getDiscussionsByAssignment(assignment.id),
    [assignment.id, storeVersion]
  );
  const groups = useMemo(
    () => getChatGroupsByClass(assignment.classId),
    [assignment.classId, storeVersion]
  );
  const visibleGroups = useMemo(() => groups, [groups]);
  const students = useMemo(
    () => getStudentsByClass(assignment.classId),
    [assignment.classId, storeVersion]
  );
  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) ?? null,
    [groups, selectedGroupId]
  );
  const isMemberOfSelected = useMemo(
    () => !!user && !!selectedGroup && selectedGroup.memberIds.includes(selfId),
    [user, selectedGroup, selfId]
  );
  const groupMessages = useMemo(
    () => (selectedGroupId ? getGroupMessages(selectedGroupId) : []),
    [selectedGroupId, storeVersion]
  );
  const privateMessages = useMemo(
    () => (privateTarget && user ? getPrivateMessages(selfId, privateTarget.id) : []),
    [privateTarget, selfId, storeVersion]
  );
  const privateUnreadMap = useMemo(() => {
    if (!user) return {};
    const map: Record<string, number> = {};
    for (const student of students) {
      map[student.id] = getUnreadPrivateCount(selfId, student.id);
    }
    return map;
  }, [students, selfId, storeVersion]);

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
    if (mode === 'forum' && selfId && discussions.length > 0) {
      markScopeRead(`forum:${assignment.id}`, selfId);
    }
  }, [mode, assignment.id, selfId, discussions.length]);

  // Tandai grup sudah dibaca saat dipilih.
  useEffect(() => {
    if (mode === 'group' && selfId && selectedGroupId && groupMessages.length > 0) {
      markScopeRead(`group:${selectedGroupId}`, selfId);
    }
  }, [mode, selectedGroupId, selfId, groupMessages.length]);

  // C14: tandai chat privat sudah dibaca saat dibuka.
  useEffect(() => {
    if (privateTarget && selfId && privateMessages.length > 0) {
      markScopeRead(`private:${selfId}|${privateTarget.id}`, selfId);
    }
  }, [privateTarget, selfId, privateMessages.length]);

  // C13: tutup menu opsi pesan saat klik di luar.
  useEffect(() => {
    if (!menuOpenId) return;
    const close = () => setMenuOpenId(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menuOpenId]);

  // C15: scope percakapan aktif (forum / grup / private).
  const activeScopeKey = privateTarget
    ? `private:${selfId}|${privateTarget.id}`
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
    const refresh = () => setTypingUsers(getTypingUsers(activeScopeKey, selfId));
    refresh();
    const id = window.setInterval(refresh, 1500);
    return () => window.clearInterval(id);
  }, [activeScopeKey, selfId]);

  // C15: hentikan status ketikan saat meninggalkan percakapan.
  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearTyping(typingRef.current, selfId);
        typingRef.current = null;
      }
    };
  }, [selfId]);

  // C15: tandai user sedang mengetik (throttle via timestamp di store) + beri jeda hidup.
  const handleTyping = () => {
    if (!activeScopeKey || !user) return;
    typingRef.current = activeScopeKey;
    setTyping(activeScopeKey, selfId, user.name || 'Pengguna', user.role || 'guest');
  };

  // C15: bersihkan status ketikan setelah kirim.
  const handleStopTyping = () => {
    if (typingRef.current) {
      clearTyping(typingRef.current, selfId);
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
      authorId: selfId,
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
    const isMember = selectedGroup.memberIds.includes(selfId);
    if (!isMember && !isTeacher) return;
    addGroupMessage({
      id: `gm_${Date.now()}`,
      groupId: selectedGroup.id,
      authorId: selfId,
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
      senderId: selfId,
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
        createdBy: selfId,
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
    if (group.memberIds.includes(selfId)) {
      removeGroupMember(groupId, selfId);
      if (selectedGroupId === groupId) setSelectedGroupId('');
    } else {
      addGroupMember(groupId, selfId);
      setSelectedGroupId(groupId);
    }
  };

  const stream: ChatStreamItem[] = privateTarget
    ? privateMessages
    : mode === 'forum'
      ? discussions
      : groupMessages;

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
    () => getUnreadCountForScope(forumScopeKey, selfId, discussions),
    [forumScopeKey, selfId, discussions, storeVersion]
  );
  const groupUnreadMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const group of groups) {
      map[group.id] = getUnreadCountForScope(
        `group:${group.id}`,
        selfId,
        getGroupMessages(group.id)
      );
    }
    return map;
  }, [groups, selfId, storeVersion]);

  return {
    draft,
    setDraft,
    mode,
    setMode,
    selectedGroupId,
    setSelectedGroupId,
    searchQuery,
    setSearchQuery,
    addingMembers,
    setAddingMembers,
    streamRef,
    privateTarget,
    setPrivateTarget,
    editingId,
    setEditingId,
    editingText,
    setEditingText,
    menuOpenId,
    setMenuOpenId,
    pendingAttachment,
    setPendingAttachment,
    fileInputRef,
    typingUsers,
    isTeacher,
    selfId,
    discussions,
    groups,
    visibleGroups,
    students,
    selectedGroup,
    isMemberOfSelected,
    groupMessages,
    privateMessages,
    privateUnreadMap,
    stream,
    q,
    filteredStudents,
    groupMembers,
    groupCandidates,
    shownMembers,
    shownCandidates,
    filteredGroups,
    filteredStream,
    forumUnread,
    groupUnreadMap,
    activeScopeKey,
    handleTyping,
    handleStopTyping,
    handleSend,
    handleSendForum,
    handlePickFile,
    handleStartEdit,
    handleSaveEdit,
    handleDeleteMessage,
    handleCreateGroup,
    handleToggleMember,
    handleJoinLeaveGroup,
  };
}

// Re-export agar komponen pemakai tetap bisa memakai helper presence.
export { isStudentOnline };
