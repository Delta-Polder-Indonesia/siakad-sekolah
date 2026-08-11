import type { AuthUser } from '../../types';
import {
  getMessagesForRole,
  getSuratIzin,
  getSchoolAnnouncements,
  getAllOnlineAssignments,
  getDiscussionsByAssignment,
  getChatGroupsByClass,
  getGroupMessages,
  getStudentByUser,
  getTeacherByUser,
  getLocalTeacherId,
  getLocalStudentId,
  getParentStudentId,
  getScopeLastRead,
  markScopeRead,
} from '../../data/services';

export type NotifItemType =
  'message' | 'suratIzin' | 'announcement' | 'discussion' | 'groupMessage';

export interface NotifItem {
  id: string;
  /** Kunci stabil per item (dipakai untuk read-state per item). */
  itemKey: string;
  type: NotifItemType;
  title: string;
  description: string;
  time: string;
  /** Waktu pembuatan item (ms epoch) — dipakai sinkron read-state chat. */
  createdAt: number;
  /** Scope chat terkait (`forum:<assignmentId>` / `group:<groupId>`) untuk sinkron D5. */
  scopeKey?: string;
  navigateTo: string;
}

const ITEM_READ_KEY = 'app_notification_item_read';
const LEGACY_READ_KEY = 'app_notification_read_state';

/**
 * Id stabil untuk read-state notifikasi. Backend memakai CUID yang berbeda-beda,
 * sedangkan read-state (localStorage) dipetakan per id — pakai id lokal agar
 * state tetap konsisten antar sesi (mode lokal maupun backend).
 */
export function getNotificationUserId(user: AuthUser | null | undefined): string {
  if (!user) return '';
  if (user.role === 'teacher') return getLocalTeacherId(user) || user.id;
  if (user.role === 'student') return getLocalStudentId(user) || user.id;
  if (user.role === 'parent') {
    const sid = getParentStudentId(user);
    return sid ? `p_${sid}` : user.id;
  }
  return user.id;
}

/** Migrasi dari read-state lama (per kategori/timestamp) ke read-state per item. */
export function migrateLegacyReadState(userId: string, items: NotifItem[]) {
  if (!userId || localStorage.getItem(ITEM_READ_KEY)) return;
  try {
    const legacy: Record<string, number> = JSON.parse(
      localStorage.getItem(LEGACY_READ_KEY) || '{}'
    );
    if (Object.keys(legacy).length === 0) return;
    const unread: string[] = [];
    for (const item of items) {
      const typeKey =
        item.type === 'message'
          ? 'messages'
          : item.type === 'suratIzin'
            ? 'suratIzin'
            : item.type === 'announcement'
              ? 'announcements'
              : 'discussions';
      const lastRead = legacy[`${typeKey}_${userId}`] || 0;
      if (!item.createdAt || item.createdAt > lastRead) unread.push(item.itemKey);
    }
    markItemsRead(userId, items);
    if (unread.length > 0) {
      const map = getReadMap();
      for (const k of unread) delete map[readKey(userId, k)];
      saveReadMap(map);
    }
    localStorage.removeItem(LEGACY_READ_KEY);
  } catch {
    // ignore migration failures
  }
}

function getReadMap(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(ITEM_READ_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveReadMap(map: Record<string, number>) {
  try {
    localStorage.setItem(ITEM_READ_KEY, JSON.stringify(map));
  } catch {
    // quota exceeded — ignore
  }
}

function readKey(userId: string, itemKey: string) {
  return `${userId}|${itemKey}`;
}

/**
 * Cek apakah item sudah dibaca.
 * - Item chat (punya `scopeKey`): dibaca jika scope chat sudah dibaca setelah item dibuat
 *   (sinkron D5: baca chat → notif berkurang), atau sudah ditandai dibaca.
 * - Item lain: cek read-state per item.
 */
export function isItemRead(userId: string, item: NotifItem): boolean {
  if (!userId) return false;
  if (item.scopeKey && item.createdAt) {
    const lastRead = getScopeLastRead(item.scopeKey, userId);
    if (lastRead >= item.createdAt) return true;
  }
  return !!getReadMap()[readKey(userId, item.itemKey)];
}

/**
 * Tandai item sebagai dibaca.
 * - Item chat (punya `scopeKey`): `markScopeRead` → badge chat ikut hilang (sinkron D5).
 * - Item lain: tulis read-state per item.
 */
export function markItemsRead(userId: string, items: NotifItem[]) {
  if (!userId || items.length === 0) return;
  const map = getReadMap();
  for (const item of items) {
    if (item.scopeKey) {
      markScopeRead(item.scopeKey, userId);
      delete map[readKey(userId, item.itemKey)];
    } else {
      map[readKey(userId, item.itemKey)] = Date.now();
    }
  }
  saveReadMap(map);
}

export function markAllItemsRead(userId: string, items: NotifItem[]) {
  markItemsRead(userId, items);
}

function getSeedIds(): { announcements: string[]; messages: string[] } {
  try {
    return JSON.parse(localStorage.getItem('__seed_ids') || '{"announcements":[],"messages":[]}');
  } catch {
    return { announcements: [], messages: [] };
  }
}

function timeLabel(ts: number | string): string {
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

/** Bangun seluruh item notifikasi untuk user aktif (belum difilter dibaca). */
export function getNotificationItems(user: AuthUser | null): NotifItem[] {
  if (!user) return [];
  const result: NotifItem[] = [];
  const seedIds = getSeedIds();

  if (['teacher', 'student', 'parent', 'admin'].includes(user.role)) {
    const role = user.role as 'teacher' | 'student' | 'parent' | 'admin';
    getMessagesForRole(role)
      .filter((m) => !seedIds.messages.includes(m.id))
      .forEach((m) => {
        const createdAt = new Date(m.date).getTime();
        result.push({
          id: `msg-${m.id}`,
          itemKey: `message:${m.id}`,
          type: 'message',
          title: m.subject,
          description: `Dari: ${m.sender}`,
          time: timeLabel(m.date),
          createdAt,
          navigateTo: 'personal-messages',
        });
      });
  }

  if (user.role === 'teacher') {
    getSuratIzin()
      .filter((s) => s.status === 'menunggu')
      .forEach((s) => {
        result.push({
          id: `surat-${s.id}`,
          itemKey: `surat:${s.id}`,
          type: 'suratIzin',
          title: s.subject,
          description: `${s.type === 'sakit' ? 'Sakit' : s.type === 'izin' ? 'Izin' : s.type} — ${s.studentId}`,
          time: timeLabel(s.createdAt),
          createdAt: s.createdAt,
          navigateTo: 'letters-teacher',
        });
      });
  }

  getSchoolAnnouncements()
    .filter((a) => !seedIds.announcements.includes(a.id))
    .forEach((a) => {
      const createdAt = new Date(a.date).getTime();
      result.push({
        id: `ann-${a.id}`,
        itemKey: `announcement:${a.id}`,
        type: 'announcement',
        title: a.title,
        description: a.content.slice(0, 80),
        time: timeLabel(a.date),
        createdAt,
        navigateTo: 'school-announcements',
      });
    });

  if (user.role === 'teacher') {
    const selfId = getLocalTeacherId(user) || user.id;
    const own = getAllOnlineAssignments().filter((a) => a.createdBy === selfId);
    own.forEach((a) => {
      getDiscussionsByAssignment(a.id)
        .filter((d) => d.authorId !== selfId)
        .forEach((d) => {
          result.push({
            id: `disc-${d.id}`,
            itemKey: `discussion:${d.id}`,
            type: 'discussion',
            title: `Diskusi: ${a.title}`,
            description: `${d.authorName}: ${d.message.slice(0, 70)}`,
            time: timeLabel(d.createdAt),
            createdAt: d.createdAt,
            scopeKey: `forum:${a.id}`,
            navigateTo: 'assignment-settings',
          });
        });
    });
  } else if (user.role === 'student') {
    const student = getStudentByUser(user);
    if (student) {
      const selfId = getLocalStudentId(user) || user.id;
      getAllOnlineAssignments()
        .filter((a) => a.classId === student.classId)
        .forEach((a) => {
          getDiscussionsByAssignment(a.id)
            .filter((d) => d.role === 'teacher' && d.authorId !== selfId)
            .forEach((d) => {
              result.push({
                id: `disc-${d.id}`,
                itemKey: `discussion:${d.id}`,
                type: 'discussion',
                title: `Diskusi: ${a.title}`,
                description: `${d.authorName}: ${d.message.slice(0, 70)}`,
                time: timeLabel(d.createdAt),
                createdAt: d.createdAt,
                scopeKey: `forum:${a.id}`,
                navigateTo: 'tasks',
              });
            });
        });
    }
  }

  // D6: pesan grup — guru: semua grup di kelas tugas yang ia buat; murid: grup yang ia ikuti.
  if (user.role === 'teacher') {
    const selfId = getLocalTeacherId(user) || user.id;
    const teacherClassIds = Array.from(
      new Set(
        getAllOnlineAssignments()
          .filter((a) => a.createdBy === selfId)
          .map((a) => a.classId)
      )
    );
    teacherClassIds.forEach((classId) => {
      getChatGroupsByClass(classId).forEach((group) => {
        getGroupMessages(group.id)
          .filter((gm) => gm.authorId !== selfId)
          .forEach((gm) => {
            result.push({
              id: `gmsg-${gm.id}`,
              itemKey: `groupmessage:${gm.id}`,
              type: 'groupMessage',
              title: `Grup: ${group.name}`,
              description: `${gm.authorName}: ${gm.message.slice(0, 70)}`,
              time: timeLabel(gm.createdAt),
              createdAt: gm.createdAt,
              scopeKey: `group:${group.id}`,
              navigateTo: 'assignment-settings',
            });
          });
      });
    });
  } else if (user.role === 'student') {
    const student = getStudentByUser(user);
    if (student) {
      const selfId = getLocalStudentId(user) || user.id;
      getChatGroupsByClass(student.classId)
        .filter((group) => group.memberIds.includes(selfId))
        .forEach((group) => {
          getGroupMessages(group.id)
            .filter((gm) => gm.authorId !== selfId)
            .forEach((gm) => {
              result.push({
                id: `gmsg-${gm.id}`,
                itemKey: `groupmessage:${gm.id}`,
                type: 'groupMessage',
                title: `Grup: ${group.name}`,
                description: `${gm.authorName}: ${gm.message.slice(0, 70)}`,
                time: timeLabel(gm.createdAt),
                createdAt: gm.createdAt,
                scopeKey: `group:${group.id}`,
                navigateTo: 'tasks',
              });
            });
        });
    }
  }

  return result.sort((a, b) => b.createdAt - a.createdAt);
}
