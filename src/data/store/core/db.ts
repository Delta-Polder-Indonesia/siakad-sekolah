import { initialData } from './seedData';
import { initialCatatanBK } from './seedData';
import { initialEkskul, initialEkskulMember, initialEkskulKehadiran } from './seedData';
import { notifyStoreUpdated } from './storeEvents';

export { notifyStoreUpdated, subscribeStore, store } from './storeEvents';
// ==================== TYPES ====================
// Type definitions moved to types.ts to avoid duplication
// Import shared types from types.ts
import type {
  Student,
  Teacher,
  ClassRoom as SchoolClass,
  AttendanceRecord,
  ClassRosterItem,
  ClassAnnouncement,
  OnlineAssignment,
  Book,
  LibraryMember,
  LibraryTransaction,
} from '../../../types';

export type { Student, Teacher, Book, AttendanceRecord, LibraryTransaction } from '../../../types';

// Local type aliases for compatibility
export type AttendanceEntry = AttendanceRecord;
export type ClassRoster = ClassRosterItem;

// Import additional types from types.ts
import type {
  Announcement,
  PPDBApplicationStatus,
  PPDBDocumentFile,
  PPDBApplication,
  PPDBAuditAction,
  PPDBAuditLog,
  Message,
  Task,
  Bill,
  Grade,
  SuratIzin,
  TagihanSekolah,
  PengaturanTagihan,
  PengumumanAdmin,
  AssignmentSubmission,
  AssignmentDiscussion,
  AssignmentQuizResult,
  ChatGroup,
  GroupChatMessage,
  PrivateMessage,
  NilaiRapot,
  StudentClassMutation,
  StudentStatusMutation,
  StudentStatus,
  RpsMeetingRow,
  RpsDocument,
  TeacherLessonNote,
  PPDBNotification,
  GuestConfig,
} from '../../../types';

// Re-export for backward compatibility
export {
  Announcement,
  PPDBApplicationStatus,
  PPDBDocumentFile,
  PPDBApplication,
  PPDBAuditAction,
  PPDBAuditLog,
  Message,
  Task,
  Bill,
  Grade,
  SuratIzin,
  TagihanSekolah,
  PengaturanTagihan,
  PengumumanAdmin,
  AssignmentSubmission,
  AssignmentDiscussion,
  AssignmentQuizResult,
  ChatGroup,
  GroupChatMessage,
  PrivateMessage,
  NilaiRapot,
  StudentClassMutation,
  StudentStatusMutation,
  StudentStatus,
  RpsMeetingRow,
  RpsDocument,
  TeacherLessonNote,
  PPDBNotification,
  GuestConfig,
};

export type Database = {
  announcements: Announcement[];
  teachers: Teacher[];
  classes: SchoolClass[];
  students: Student[];
  ppdbApplications: PPDBApplication[];
  ppdbNotifications: PPDBNotification[];
  adminSettings: {
    email: string;
  };
  guestConfig: GuestConfig;
  attendances: AttendanceEntry[];
  classRosters: ClassRoster[];
  classAnnouncements: ClassAnnouncement[];
  onlineAssignments: OnlineAssignment[];
  assignmentDiscussions: AssignmentDiscussion[];
  chatGroups: ChatGroup[];
  groupChatMessages: GroupChatMessage[];
  privateMessages: PrivateMessage[];
  studentPresence: Record<string, number>;
  chatReadState: Record<string, Record<string, number>>;
  typingState: Record<string, Record<string, { ts: number; name: string; role: string }>>;
  // Library
  books: Book[];
  libraryMembers: LibraryMember[];
  libraryTransactions: LibraryTransaction[];
  messages: Message[];
  attendance: Array<{ date: string; status: 'hadir' | 'izin' | 'sakit' | 'alpha' }>;
  tasks: Task[];
  bills: Bill[];
  grades: Grade[];
  schedule: Array<{ day: string; subject: string; time: string; teacher: string }>;
  _version?: number;
};

// ==================== CONSTANTS ====================

export const STORAGE_KEY = 'portal-siswa-db-v1';
export const SURAT_KEY = 'portal-siswa-surat';
export const BK_KEY = 'siakad-bk-records';
export const EKSKUL_KEY = 'siakad-ekskul';
export const EKSKUL_MEMBER_KEY = 'siakad-ekskul-member';
export const EKSKUL_HADIR_KEY = 'siakad-ekskul-hadir';
export const TAHUN_AJARAN_KEY = 'siakad-tahun-ajaran';
export const MAPEL_KEY = 'siakad-mapel';
export const TAGIHAN_KEY = 'portal-siswa-tagihan';
export const PENGATURAN_TAGIHAN_KEY = 'portal-siswa-pengaturan-tagihan';
export const PENGUMUMAN_ADMIN_KEY = 'portal-siswa-pengumuman-admin';
export const SUBMISSION_KEY = 'portal-siswa-submissions';
export const QUIZ_RESULT_KEY = 'portal-siswa-quiz-results';
export const RAPOT_KEY = 'portal-siswa-rapot';
export const STUDENT_CLASS_MUTATION_KEY = 'portal-siswa-class-mutations';
export const STUDENT_STATUS_MUTATION_KEY = 'portal-siswa-status-mutations';
export const PPDB_AUDIT_KEY = 'portal-siswa-ppdb-audit';
export const PPDB_ADMIN_SESSION_KEY = 'portal-siswa-ppdb-admin-session';
export const PPDB_ADMIN_LOCK_KEY = 'portal-siswa-ppdb-admin-lock';
// State EPHEMERAL (presence, typing, chat read state) dipisah dari DB utama.
// State ini berubah SANGAT sering (tiap keystroke saat mengetik, tiap 10 dtk
// heartbeat presence). Kalau ikut di key utama, setiap perubahan men-serialize
// SELURUH database (bisa ratusan KB-MB karena lampiran base64) — boros CPU,
// localStorage, dan memicu re-render global. Key kecil terpisah = jauh lebih cepat.
export const PRESENCE_KEY = 'siakad-presence-v1';
export const TYPING_KEY = 'siakad-typing-v1';
export const CHAT_READ_KEY = 'siakad-chat-read-v1';
const APPROX_LOCAL_STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;

export const ADMIN_MAX_ATTEMPTS = Number(import.meta.env.VITE_ADMIN_MAX_ATTEMPTS || '5');
export const ADMIN_LOCK_MINUTES = Number(import.meta.env.VITE_ADMIN_LOCK_MINUTES || '15');
export const ADMIN_SESSION_MINUTES = Number(import.meta.env.VITE_ADMIN_SESSION_MINUTES || '480');
// Tanpa nilai env → PIN kosong → login admin PPDB mode lokal DIMATIKAN.
export const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '';

// ==================== INTERFACES ====================

export interface RingkasanPenyimpananBrowser {
  usedBytes: number;
  limitBytes: number;
  usedPercent: number;
  remainingBytes: number;
}

export interface RingkasanKompresFoto {
  totalDitemukan: number;
  totalBerhasil: number;
  totalGagal: number;
}

export interface HasilPulihkanCadangan {
  berhasil: boolean;
  pesan: string;
}

// ==================== PERFORMANCE: LOCALSTORAGE OPTIMIZATION ====================

/**
 * Garbage collection — clean up old/expired data from localStorage.
 * Removes: PPDB admin sessions > 48h, audit logs > 1000 entries, old notifications.
 */
export function runLocalStorageGC(): { removedKeys: number; freedBytes: number } {
  let removedKeys = 0;
  let freedBytes = 0;

  const measureSize = (key: string, val: string | null): number => {
    if (!val) return 0;
    return (key.length + val.length) * 2;
  };

  // 1. Remove expired PPDB admin sessions
  const sessionRaw = localStorage.getItem(PPDB_ADMIN_SESSION_KEY);
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw) as { expiresAt?: string };
      if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
        const size = measureSize(PPDB_ADMIN_SESSION_KEY, sessionRaw);
        localStorage.removeItem(PPDB_ADMIN_SESSION_KEY);
        removedKeys++;
        freedBytes += size;
      }
    } catch {
      // corrupted session, clean it
      localStorage.removeItem(PPDB_ADMIN_SESSION_KEY);
      removedKeys++;
    }
  }

  // 2. Cap audit logs to 1000 entries
  const auditRaw = localStorage.getItem(PPDB_AUDIT_KEY);
  if (auditRaw) {
    try {
      const logs = JSON.parse(auditRaw) as unknown[];
      if (Array.isArray(logs) && logs.length > 1000) {
        const trimmed = logs.slice(0, 1000);
        const newVal = JSON.stringify(trimmed);
        const oldSize = measureSize(PPDB_AUDIT_KEY, auditRaw);
        const newSize = measureSize(PPDB_AUDIT_KEY, newVal);
        localStorage.setItem(PPDB_AUDIT_KEY, newVal);
        freedBytes += Math.max(0, oldSize - newSize);
      }
    } catch {
      // corrupted, skip
    }
  }

  return { removedKeys, freedBytes };
}

// Run GC lazily after initialization (not blocking first paint)
if (typeof window !== 'undefined') {
  const scheduleGC = () => {
    setTimeout(() => {
      try {
        runLocalStorageGC();
      } catch {
        // GC is best-effort
      }
    }, 5000);
  };
  if (document.readyState === 'complete') {
    scheduleGC();
  } else {
    window.addEventListener('load', scheduleGC, { once: true });
  }
}

/**
 * Returns whether the localStorage has been initialized (lazy hydration check).
 * Components can use this to show skeletons until data is ready.
 */
export function isStorageHydrated(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

// ==================== UTILS ====================

/**
 * Simulasi hashing password sederhana untuk demo/local storage.
 * Dalam produksi sesungguhnya, gunakan bcrypt/argon2 di server.
 */
export async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain + 'sekolah_salt'); // Simple salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getStorageSummary(): RingkasanPenyimpananBrowser {
  let usedBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        // approximate size in bytes for a string in JS (UTF-16 mostly, but we can do simple char count * 2)
        usedBytes += (key.length + value.length) * 2;
      }
    }
  }
  return {
    usedBytes,
    limitBytes: APPROX_LOCAL_STORAGE_LIMIT_BYTES,
    usedPercent: Number(((usedBytes / APPROX_LOCAL_STORAGE_LIMIT_BYTES) * 100).toFixed(2)),
    remainingBytes: Math.max(0, APPROX_LOCAL_STORAGE_LIMIT_BYTES - usedBytes),
  };
}

export const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

// ==================== DB HELPERS ====================

export function readDB(): Database {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialData;

  try {
    const parsed = JSON.parse(raw) as Partial<Database>;
    return {
      ...initialData,
      ...parsed,
      teachers: (parsed.teachers ?? initialData.teachers).map((teacher) => ({
        ...teacher,
        classIds: teacher.classIds ?? [],
      })),
      classes: (parsed.classes ?? initialData.classes).map((classItem) => ({
        ...classItem,
        grade: classItem.grade ?? 'X',
      })),
      students: (parsed.students ?? initialData.students).map((student) => ({
        ...student,
        gender: student.gender === 'P' ? 'P' : 'L',
      })),
      ppdbApplications: parsed.ppdbApplications ?? initialData.ppdbApplications,
      ppdbNotifications: parsed.ppdbNotifications ?? initialData.ppdbNotifications,
      adminSettings: parsed.adminSettings ?? initialData.adminSettings,
      guestConfig: parsed.guestConfig ?? initialData.guestConfig,
      attendances: parsed.attendances ?? initialData.attendances,
      classRosters: parsed.classRosters ?? initialData.classRosters,
      classAnnouncements: parsed.classAnnouncements ?? initialData.classAnnouncements,
      onlineAssignments:
        parsed.onlineAssignments && parsed.onlineAssignments.length > 0
          ? parsed.onlineAssignments
          : initialData.onlineAssignments,
      assignmentDiscussions:
        parsed.assignmentDiscussions && parsed.assignmentDiscussions.length > 0
          ? parsed.assignmentDiscussions
          : initialData.assignmentDiscussions,
      chatGroups: parsed.chatGroups ?? initialData.chatGroups,
      groupChatMessages: parsed.groupChatMessages ?? initialData.groupChatMessages,
      privateMessages: parsed.privateMessages ?? initialData.privateMessages,
      studentPresence: parsed.studentPresence ?? initialData.studentPresence,
      chatReadState: parsed.chatReadState ?? initialData.chatReadState,
      typingState: parsed.typingState ?? initialData.typingState,
    };
  } catch {
    return initialData;
  }
}

export function writeDB(data: Database) {
  const raw = JSON.stringify(data);
  if (localStorage.getItem(STORAGE_KEY) === raw) return; // tidak ada perubahan nyata → skip
  localStorage.setItem(STORAGE_KEY, raw);
  notifyStoreUpdated();
}

// ==================== EPHEMERAL STATE HELPERS ====================
// Baca/tulis state kecil (presence, typing, chat-read) di key terpisah.
// Fallback otomatis ke nilai legacy di DB utama → migrasi sekali tanpa kode khusus.

export function readEphemeral<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (raw !== null) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      // data rusak → fallback
    }
  }
  return fallback;
}

export function writeEphemeral<T>(key: string, value: T, notify = true): void {
  const raw = JSON.stringify(value);
  if (localStorage.getItem(key) === raw) return; // skip identik
  localStorage.setItem(key, raw);
  if (notify) notifyStoreUpdated();
}

export function readLocalKey<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveLocalKey<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  notifyStoreUpdated();
}

function createAuditId() {
  return `ppdb-audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getPPDBAuditLogsRaw(): PPDBAuditLog[] {
  return readLocalKey<PPDBAuditLog[]>(PPDB_AUDIT_KEY, []);
}

export function savePPDBAuditLogs(logs: PPDBAuditLog[]) {
  saveLocalKey(PPDB_AUDIT_KEY, logs.slice(0, 1000));
}

export function appendPPDBAuditLog(
  action: PPDBAuditAction,
  actor: string,
  metadata?: Record<string, string>
) {
  const logs = getPPDBAuditLogsRaw();
  logs.unshift({
    id: createAuditId(),
    action,
    actor,
    occurredAt: new Date().toISOString(),
    metadata,
  });
  savePPDBAuditLogs(logs);
}

// ==================== INIT ====================

/**
 * Migrasi v3: perbaiki timestamp masa depan pada data chat/demo.
 * Seed lama memakai tanggal Oktober 2026 (di masa depan) sehingga read-state
 * (markScopeRead = Date.now()) tidak pernah >= createdAt → badge unread tidak hilang.
 * Data yang `createdAt`-nya di masa depan digeser ke 1 hari lalu.
 */
function migrateFutureTimestamps(data: Partial<Database>): boolean {
  const now = Date.now();
  const target = now - 24 * 60 * 60 * 1000;
  let changed = false;
  const fix = <T extends { createdAt?: number }>(items?: T[]) => {
    if (!Array.isArray(items)) return items;
    const next = items.map((item) => {
      if (typeof item.createdAt === 'number' && item.createdAt > now) {
        changed = true;
        return { ...item, createdAt: target };
      }
      return item;
    });
    return next;
  };
  data.assignmentDiscussions = fix(data.assignmentDiscussions);
  data.groupChatMessages = fix(data.groupChatMessages);
  data.privateMessages = fix(data.privateMessages);
  data.chatGroups = fix(data.chatGroups);
  return changed;
}

export async function initializeData() {
  const existingRaw = localStorage.getItem(STORAGE_KEY);
  if (!existingRaw) {
    // Fresh install - hash seed passwords before storing
    const hashedTeachers = await Promise.all(
      initialData.teachers.map(async (t) => ({
        ...t,
        password: await hashPassword(t.password),
      }))
    );
    const hashedStudents = await Promise.all(
      initialData.students.map(async (s) => ({
        ...s,
        password: await hashPassword(s.password),
        parentPassword: s.parentPassword ? await hashPassword(s.parentPassword) : undefined,
      }))
    );
    writeDB({
      ...initialData,
      teachers: hashedTeachers as typeof initialData.teachers,
      students: hashedStudents as typeof initialData.students,
      _version: 2,
    });
    localStorage.setItem(BK_KEY, JSON.stringify(initialCatatanBK));
    localStorage.setItem(EKSKUL_KEY, JSON.stringify(initialEkskul));
    localStorage.setItem(EKSKUL_MEMBER_KEY, JSON.stringify(initialEkskulMember));
    localStorage.setItem(EKSKUL_HADIR_KEY, JSON.stringify(initialEkskulKehadiran));
    localStorage.setItem(
      '__seed_ids',
      JSON.stringify({
        announcements: initialData.announcements.map((a) => a.id),
        messages: initialData.messages.map((m) => m.id),
      })
    );
  } else {
    // Migration: check if stored data needs version upgrade
    try {
      const existing = JSON.parse(existingRaw) as Partial<Database>;
      const needsUpgrade = !existing._version || existing._version < 2;
      const needsTimestampFix = !existing._version || existing._version < 3;
      const timestampChanged = needsTimestampFix && migrateFutureTimestamps(existing);
      if (needsUpgrade) {
        // Version 1 had plain text passwords. Re-hash them.
        if (existing.teachers && Array.isArray(existing.teachers)) {
          existing.teachers = await Promise.all(
            existing.teachers.map(async (t) => ({
              ...t,
              password: await hashPassword(t.password),
            }))
          );
        }
        if (existing.students && Array.isArray(existing.students)) {
          existing.students = await Promise.all(
            existing.students.map(async (s) => ({
              ...s,
              password: await hashPassword(s.password),
              parentPassword: s.parentPassword ? await hashPassword(s.parentPassword) : undefined,
            }))
          );
        }
        existing._version = 2;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        notifyStoreUpdated();
      }
      if (timestampChanged && (existing._version ?? 2) >= 2) {
        existing._version = 3;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        notifyStoreUpdated();
      }
      if (!localStorage.getItem('__seed_ids')) {
        localStorage.setItem(
          '__seed_ids',
          JSON.stringify({
            announcements: initialData.announcements.map((a) => a.id),
            messages: initialData.messages.map((m) => m.id),
          })
        );
      }
    } catch {
      // If migration fails, leave existing data as-is
    }
  }
  notifyStoreUpdated();
}
