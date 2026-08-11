import {
  readDB,
  writeDB,
  readEphemeral,
  writeEphemeral,
  PRESENCE_KEY,
  TYPING_KEY,
  CHAT_READ_KEY,
} from './db';
import type { ChatGroup, GroupChatMessage, PrivateMessage } from '../../../types';
// ==================== CHAT GROUPS & FORUM PRESENCE ====================

export function getChatGroupsByClass(classId: string): ChatGroup[] {
  return readDB().chatGroups.filter((item) => item.classId === classId);
}

export function addChatGroup(item: ChatGroup) {
  const db = readDB();
  db.chatGroups = [...db.chatGroups, item];
  writeDB(db);
}

export function deleteChatGroup(groupId: string) {
  const db = readDB();
  db.chatGroups = db.chatGroups.filter((item) => item.id !== groupId);
  db.groupChatMessages = db.groupChatMessages.filter((item) => item.groupId !== groupId);
  writeDB(db);
}

export function addGroupMember(groupId: string, studentId: string) {
  const db = readDB();
  db.chatGroups = db.chatGroups.map((group) =>
    group.id === groupId && !group.memberIds.includes(studentId)
      ? { ...group, memberIds: [...group.memberIds, studentId] }
      : group
  );
  writeDB(db);
}

export function removeGroupMember(groupId: string, studentId: string) {
  const db = readDB();
  db.chatGroups = db.chatGroups.map((group) =>
    group.id === groupId
      ? { ...group, memberIds: group.memberIds.filter((id) => id !== studentId) }
      : group
  );
  writeDB(db);
}

export function getGroupMessages(groupId: string): GroupChatMessage[] {
  return readDB()
    .groupChatMessages.filter((item) => item.groupId === groupId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function addGroupMessage(item: GroupChatMessage) {
  const db = readDB();
  db.groupChatMessages = [...db.groupChatMessages, item];
  writeDB(db);
}

/** C13: edit isi pesan grup. */
export function editGroupMessage(id: string, message: string) {
  const db = readDB();
  db.groupChatMessages = db.groupChatMessages.map((item) =>
    item.id === id ? { ...item, message } : item
  );
  writeDB(db);
}

/** C13: hapus pesan grup. */
export function deleteGroupMessage(id: string) {
  const db = readDB();
  db.groupChatMessages = db.groupChatMessages.filter((item) => item.id !== id);
  writeDB(db);
}

// ==================== PRIVATE MESSAGES (C14) ====================

/** Ambil pesan privat antara dua user (urutan kronologis). */
export function getPrivateMessages(userIdA: string, userIdB: string): PrivateMessage[] {
  return readDB()
    .privateMessages.filter(
      (item) =>
        (item.senderId === userIdA && item.receiverId === userIdB) ||
        (item.senderId === userIdB && item.receiverId === userIdA)
    )
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function addPrivateMessage(item: PrivateMessage) {
  const db = readDB();
  db.privateMessages = [...db.privateMessages, item];
  writeDB(db);
}

/** C13: edit isi pesan privat. */
export function editPrivateMessage(id: string, message: string) {
  const db = readDB();
  db.privateMessages = db.privateMessages.map((item) =>
    item.id === id ? { ...item, message } : item
  );
  writeDB(db);
}

/** C13: hapus pesan privat. */
export function deletePrivateMessage(id: string) {
  const db = readDB();
  db.privateMessages = db.privateMessages.filter((item) => item.id !== id);
  writeDB(db);
}

/** Hitung jumlah pesan privat belum dibaca dari user lain. */
export function getUnreadPrivateCount(userId: string, otherId: string): number {
  if (!userId) return 0;
  const lastRead = readChatReadState()[`private:${userId}|${otherId}`]?.[userId] ?? 0;
  // Baca database SEKALI (sebelumnya 2x parse penuh — mahal saat dipanggil
  // dalam loop untuk semua siswa).
  return readDB().privateMessages.filter(
    (item) => item.senderId === otherId && item.receiverId === userId && item.createdAt > lastRead
  ).length;
}

const PRESENCE_ONLINE_WINDOW = 2 * 60 * 1000;

// State presence dipisah ke key kecil (PRESENCE_KEY) — tidak lagi men-serialize
// seluruh DB setiap heartbeat.

function readPresenceState(): Record<string, number> {
  // Fallback migrasi: jika key baru belum ada, ambil dari DB utama (legacy).
  return readEphemeral<Record<string, number>>(PRESENCE_KEY, readDB().studentPresence ?? {});
}

export function touchPresence(studentId: string) {
  const next = { ...readPresenceState(), [studentId]: Date.now() };
  writeEphemeral(PRESENCE_KEY, next);
}

/** Heartbeat senyap — menulis tanpa memicu event store (untuk interval berkala). */
export function touchPresenceSilent(studentId: string) {
  const next = { ...readPresenceState(), [studentId]: Date.now() };
  writeEphemeral(PRESENCE_KEY, next, false);
}

export function isStudentOnline(studentId: string): boolean {
  const last = readPresenceState()[studentId];
  if (!last) return false;
  return Date.now() - last < PRESENCE_ONLINE_WINDOW;
}

// ==================== CHAT READ STATE (unread badge) ====================

// State read (badge belum dibaca) dipisah ke key kecil (CHAT_READ_KEY).

type ChatReadState = Record<string, Record<string, number>>;

function readChatReadState(): ChatReadState {
  return readEphemeral<ChatReadState>(CHAT_READ_KEY, readDB().chatReadState ?? {});
}

/** Tandai suatu scope (forum/grup) sudah dibaca oleh user pada waktu sekarang. */
export function markScopeRead(scopeKey: string, userId: string) {
  if (!userId) return;
  const state = readChatReadState();
  const map = state[scopeKey] ?? {};
  writeEphemeral(CHAT_READ_KEY, {
    ...state,
    [scopeKey]: { ...map, [userId]: Date.now() },
  });
}

/** Hitung jumlah pesan belum dibaca (di luar pesan user sendiri). */
export function getUnreadCountForScope(
  scopeKey: string,
  userId: string,
  messages: Array<{ authorId: string; createdAt: number }>
): number {
  if (!userId) return 0;
  const lastRead = readChatReadState()[scopeKey]?.[userId] ?? 0;
  return messages.filter((msg) => msg.authorId !== userId && msg.createdAt > lastRead).length;
}

/** Waktu terakhir suatu scope (forum/grup) dibaca oleh user (0 jika belum pernah). */
export function getScopeLastRead(scopeKey: string, userId: string): number {
  if (!userId) return 0;
  return readChatReadState()[scopeKey]?.[userId] ?? 0;
}

// ==================== TYPING INDICATOR (C15) ====================

/** Jendela waktu suatu status ketikan dianggap masih aktif. */
export const TYPING_WINDOW = 4 * 1000;

// State typing dipisah ke key kecil (TYPING_KEY) — setTyping dipanggil pada
// SETIAP keystroke; sebelumnya men-serialize seluruh DB per tombol.

type TypingState = Record<
  string,
  Record<string, { ts: number; name: string; role: string }>
>;

function readTypingState(): TypingState {
  return readEphemeral<TypingState>(TYPING_KEY, readDB().typingState ?? {});
}

/** Tandai user sedang mengetik di suatu scope (forum/grup/private). */
export function setTyping(scopeKey: string, userId: string, name: string, role: string) {
  if (!userId || !scopeKey) return;
  const state = readTypingState();
  writeEphemeral(TYPING_KEY, {
    ...state,
    [scopeKey]: {
      ...(state[scopeKey] ?? {}),
      [userId]: { ts: Date.now(), name, role },
    },
  });
}

/** Hentikan status ketikan untuk user di suatu scope. */
export function clearTyping(scopeKey: string, userId: string) {
  if (!scopeKey) return;
  const state = readTypingState();
  const scope = state[scopeKey];
  if (!scope || !scope[userId]) return;
  const next = { ...scope };
  delete next[userId];
  writeEphemeral(TYPING_KEY, { ...state, [scopeKey]: next });
}

/** Daftar user yang sedang mengetik di suatu scope (di luar user itu sendiri). */
export function getTypingUsers(
  scopeKey: string,
  excludeUserId: string
): Array<{ userId: string; name: string; role: string }> {
  if (!scopeKey) return [];
  const scope = readTypingState()[scopeKey] ?? {};
  const now = Date.now();
  return Object.entries(scope)
    .filter(([userId, entry]) => userId !== excludeUserId && now - entry.ts < TYPING_WINDOW)
    .map(([userId, entry]) => ({ userId, name: entry.name, role: entry.role }));
}
