/**
 * ============================================================================
 * DATA TOOLS — Ekspor, Impor & Reset data (untuk setup sekolah baru)
 * ============================================================================
 *
 * Fitur kunci template universal: pindah data sekolah dalam hitungan menit.
 *
 *  - exportMasterData():  simpan data master (guru/siswa/kelas/roster) ke JSON
 *  - importMasterData():  baca JSON hasil ekspor → hash password polos →
 *                         TIMPA koleksi master di database lokal
 *  - resetAllData():      'demo'  → kembalikan ke data contoh bawaan (factory)
 *                         'empty' → kosongkan semua data (siap diisi sekolah)
 *
 * Catatan: identitas sekolah (config/school.ts) TIDAK ikut di-reset —
 * branding sekolah pembeli tetap tersimpan.
 * ============================================================================
 */
import {
  readDB,
  writeDB,
  hashPassword,
  initializeData,
  type Database,
  STORAGE_KEY,
  SURAT_KEY,
  BK_KEY,
  EKSKUL_KEY,
  EKSKUL_MEMBER_KEY,
  EKSKUL_HADIR_KEY,
  TAHUN_AJARAN_KEY,
  MAPEL_KEY,
  TAGIHAN_KEY,
  PENGATURAN_TAGIHAN_KEY,
  PENGUMUMAN_ADMIN_KEY,
  SUBMISSION_KEY,
  QUIZ_RESULT_KEY,
  RAPOT_KEY,
  STUDENT_CLASS_MUTATION_KEY,
  STUDENT_STATUS_MUTATION_KEY,
  PPDB_AUDIT_KEY,
  PPDB_ADMIN_SESSION_KEY,
  PPDB_ADMIN_LOCK_KEY,
  PRESENCE_KEY,
  TYPING_KEY,
  CHAT_READ_KEY,
} from './db';
import { initialData } from './seedData';
import type { Teacher, Student, ClassRoom, ClassRosterItem } from '../../../types';

// ==================== EKSPOR ====================

export interface MasterDataExport {
  version: 1;
  exportedAt: string;
  app: 'siakad';
  teachers: Teacher[];
  students: Student[];
  classes: ClassRoom[];
  classRosters: ClassRosterItem[];
}

/** Baca data master dari DB → objek siap diekspor. */
export function collectMasterData(): MasterDataExport {
  const db = readDB();
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'siakad',
    teachers: db.teachers,
    students: db.students,
    classes: db.classes,
    classRosters: db.classRosters,
  };
}

/** Unduh data master sebagai file JSON (via browser). */
export function exportMasterData(): string {
  const data = collectMasterData();
  return JSON.stringify(data, null, 2);
}

export function masterDataFilename(): string {
  return `data-master-sekolah-${new Date().toISOString().slice(0, 10)}.json`;
}

// ==================== IMPOR ====================

const HEX64 = /^[0-9a-f]{64}$/;

/** Hash password bila masih plaintext (bukan hash SHA-256 64-hex). */
async function ensureHashed(pw: string | undefined | null): Promise<string> {
  const value = (pw ?? '').trim();
  if (!value) return value;
  if (HEX64.test(value)) return value; // sudah ter-hash
  return hashPassword(value);
}

export interface ImportSummary {
  teachers: number;
  students: number;
  classes: number;
  classRosters: number;
  replaced: boolean;
}

/**
 * Impor data master dari string JSON hasil ekspor.
 * - Validasi struktur & field wajib; lempar Error dengan pesan jelas bila rusak.
 * - Password plaintext di-hash; yang sudah hash (64 hex) dipertahankan.
 * - Koleksi master DIGANTI total dengan data impor (sekolah baru = bersih dulu).
 */
export async function importMasterData(raw: string): Promise<ImportSummary> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('File bukan JSON yang valid. Gunakan file hasil Ekspor Data Master.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Struktur file tidak dikenali.');
  }
  const data = parsed as Partial<MasterDataExport>;
  if (data.app !== 'siakad' || !Array.isArray(data.teachers) || !Array.isArray(data.students)) {
    throw new Error(
      'File bukan hasil Ekspor SIAKAD. Ekspor ulang dari menu Data Sekolah → Ekspor Data Master.'
    );
  }

  // Validasi field wajib per entitas
  for (const t of data.teachers) {
    if (!t?.id || !t?.name || !t?.nip) {
      throw new Error('Data guru tidak lengkap (butuh id, name, nip). Periksa file ekspor.');
    }
  }
  for (const s of data.students) {
    if (!s?.id || !s?.name || !s?.nis || !s?.classId) {
      throw new Error('Data siswa tidak lengkap (butuh id, name, nis, classId). Periksa file ekspor.');
    }
  }
  for (const c of data.classes ?? []) {
    if (!c?.id || !c?.name) {
      throw new Error('Data kelas tidak lengkap (butuh id, name). Periksa file ekspor.');
    }
  }

  // Hash password
  const teachers = await Promise.all(
    (data.teachers as Teacher[]).map(async (t) => ({
      ...t,
      password: await ensureHashed(t.password),
    }))
  );
  const students = await Promise.all(
    (data.students as Student[]).map(async (s) => ({
      ...s,
      password: await ensureHashed(s.password),
      parentPassword: s.parentPassword ? await ensureHashed(s.parentPassword) : undefined,
    }))
  );

  const db = readDB();
  db.teachers = teachers as Teacher[];
  db.students = students as Student[];
  db.classes = (data.classes ?? []) as ClassRoom[];
  db.classRosters = (data.classRosters ?? []) as ClassRosterItem[];
  writeDB(db);

  return {
    teachers: teachers.length,
    students: students.length,
    classes: db.classes.length,
    classRosters: db.classRosters.length,
    replaced: true,
  };
}

// ==================== RESET ====================

/** Semua key localStorage milik aplikasi (untuk dibersihkan saat reset). */
const APP_STORAGE_KEYS = [
  STORAGE_KEY,
  SURAT_KEY,
  BK_KEY,
  EKSKUL_KEY,
  EKSKUL_MEMBER_KEY,
  EKSKUL_HADIR_KEY,
  TAHUN_AJARAN_KEY,
  MAPEL_KEY,
  TAGIHAN_KEY,
  PENGATURAN_TAGIHAN_KEY,
  PENGUMUMAN_ADMIN_KEY,
  SUBMISSION_KEY,
  QUIZ_RESULT_KEY,
  RAPOT_KEY,
  STUDENT_CLASS_MUTATION_KEY,
  STUDENT_STATUS_MUTATION_KEY,
  PPDB_AUDIT_KEY,
  PPDB_ADMIN_SESSION_KEY,
  PPDB_ADMIN_LOCK_KEY,
  PRESENCE_KEY,
  TYPING_KEY,
  CHAT_READ_KEY,
  '__seed_ids',
];

function clearAppStorage(): void {
  for (const key of APP_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // abaikan
    }
  }
}

/** Template database kosong (semua koleksi dikosongkan, struktur tetap). */
function emptyDatabase(): Database {
  return {
    ...initialData,
    announcements: [],
    teachers: [],
    classes: [],
    students: [],
    ppdbApplications: [],
    ppdbNotifications: [],
    adminSettings: { email: '' },
    attendances: [],
    classRosters: [],
    classAnnouncements: [],
    onlineAssignments: [],
    assignmentDiscussions: [],
    chatGroups: [],
    groupChatMessages: [],
    privateMessages: [],
    studentPresence: {},
    chatReadState: {},
    typingState: {},
    books: [],
    libraryMembers: [],
    libraryTransactions: [],
    messages: [],
    attendance: [],
    tasks: [],
    bills: [],
    grades: [],
    schedule: [],
    _version: 2,
  };
}

/**
 * Reset data aplikasi.
 * @param mode 'demo'  → hapus semua key, lalu seed ulang data contoh bawaan
 *               'empty' → hapus semua key, tulis database kosong (siap diisi)
 * @returns pesan ringkas untuk ditampilkan ke pengguna
 */
export async function resetAllData(mode: 'demo' | 'empty'): Promise<string> {
  clearAppStorage();
  if (mode === 'demo') {
    await initializeData();
    return 'Data dikembalikan ke contoh bawaan (factory reset).';
  }
  writeDB(emptyDatabase());
  return 'Semua data telah dikosongkan. Silakan impor data sekolah Anda.';
}
