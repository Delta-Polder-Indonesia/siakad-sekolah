export interface Student {
  id: string;
  name: string;
  nis: string; // Nomor Induk Siswa
  classId: string;
  className?: string; // Added for library/admin display
  gender: 'L' | 'P';
  password: string;
  avatar?: string;
  phone?: string;
  email?: string;
  address?: string;
  parentName?: string;
  parentPassword?: string;
  parentAvatar?: string;
  parentFullKtpName?: string;
  parentNik?: string;
  status?: StudentStatus;
  statusNote?: string;
  statusUpdatedAt?: string;
}

export type StudentStatus = 'aktif' | 'keluar' | 'lulus' | 'pindah';

export interface Teacher {
  id: string;
  name: string;
  nip: string; // Nomor Induk Pegawai
  subject: string;
  password: string;
  classIds: string[];
  homeroomClassIds?: string[]; // kelas binaan dari backend (ClassRoom.teacherId)
  avatar?: string;
  whatsapp?: string;
  phone?: string;
  email: string; // Made required to match store.ts
  address?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  teacherId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  note?: string;
  markedBy: string; // teacher id
  timestamp: number;
}

export interface ClassRosterItem {
  id: string;
  classId: string;
  subject: string;
  dayOfWeek: number; // 0=Min, 1=Sen, ..., 6=Sab
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  room?: string;
  teacherName?: string;
  updatedBy: string;
  updatedAt: number;
}

export interface ClassAnnouncement {
  id: string;
  classId: string;
  title: string;
  message?: string; // alias for content
  content?: string; // alias for message
  createdBy: string;
  createdAt: number;
}

export interface AssignmentBook {
  title: string;
  author: string;
  year?: string;
  link?: string;
  dataUrl?: string;
  fileName?: string;
}

export interface AssignmentVideo {
  title: string;
  url: string;
  description?: string;
}

export interface AssignmentAttachment {
  name: string;
  dataUrl: string;
  size?: number;
}

export interface AssignmentExercise {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface AssignmentDiscussion {
  id: string;
  assignmentId: string;
  authorId: string;
  authorName: string;
  role: string;
  message: string;
  createdAt: number;
  /** C12: lampiran file opsional (dataUrl). */
  attachment?: MessageAttachment;
}

export interface AssignmentQuizResult {
  assignmentId: string;
  studentId: string;
  answers: number[];
  score: number;
  total: number;
  submittedAt: number;
}

export interface ChatGroup {
  id: string;
  classId: string;
  name: string;
  memberIds: string[];
  createdBy: string;
  createdAt: number;
}

export interface GroupChatMessage {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  role: string;
  message: string;
  createdAt: number;
  /** C12: lampiran file opsional (dataUrl). */
  attachment?: MessageAttachment;
}

/** C12: lampiran file pada pesan. */
export interface MessageAttachment {
  name: string;
  type: string;
  /** Data file sebagai base64 data-URL. */
  dataUrl: string;
  /** Ukuran file dalam byte. */
  size: number;
}

/** C14: pesan chat privat 1-1. */
export interface PrivateMessage {
  id: string;
  senderId: string;
  receiverId: string;
  authorName: string;
  role: string;
  message: string;
  createdAt: number;
  /** C12: lampiran file opsional (dataUrl). */
  attachment?: MessageAttachment;
}

export interface OnlineAssignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  createdBy: string;
  createdAt: number;
  summary?: string;
  books?: AssignmentBook[];
  videos?: AssignmentVideo[];
  attachments?: AssignmentAttachment[];
  exercises?: AssignmentExercise[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  answerText: string;
  attachmentName?: string;
  attachmentDataUrl?: string;
  submittedAt: number;
}

export interface SuratIzin {
  id: string;
  studentId: string;
  classId: string;
  type: 'izin' | 'sakit' | 'dispensasi' | 'lainnya';
  status: 'menunggu' | 'disetujui' | 'ditolak';
  subject: string;
  message: string;
  letterDate: string; // YYYY-MM-DD
  attachmentName?: string;
  attachmentDataUrl?: string;
  createdAt: number;
}

/** Catatan Bimbingan Konseling (BK): poin kedisiplinan & prestasi siswa.
 * Konvensi poin: pelanggaran bernilai NEGATIF (<= 0), prestasi bernilai POSITIF (>= 0).
 * `getTotalPoinBK` menjumlahkan langsung (negatif menurunkan, positif menaikkan). */
export interface CatatanBK {
  id: string;
  studentId: string;
  jenis: 'pelanggaran' | 'prestasi';
  kategori: string;
  deskripsi: string;
  poin: number;
  tanggal: string; // YYYY-MM-DD
  dicatatOleh: string;
  createdAt: number;
}

/** Master data ekstrakurikuler (ekskul) yang dikelola admin/guru. */
export interface Ekskul {
  id: string;
  nama: string;
  kategori: string;
  pembina: string;
  hari: string;
  jam: string;
  lokasi?: string;
  kuota?: number;
  deskripsi?: string;
  createdAt: number;
}

/** Keanggotaan siswa pada sebuah ekskul. */
export interface EkskulMember {
  id: string;
  ekskulId: string;
  studentId: string;
  joinedAt: number;
  status: 'aktif' | 'keluar';
}

/** Absensi/kehadiran siswa pada pertemuan ekskul. */
export interface EkskulKehadiran {
  id: string;
  ekskulId: string;
  studentId: string;
  tanggal: string; // YYYY-MM-DD
  status: 'hadir' | 'izin' | 'alpha';
  catatan?: string;
  createdAt: number;
}

export interface TagihanSekolah {
  id: string;
  studentId: string;
  year: number;
  month: number; // 1-12
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: 'lunas' | 'belum_lunas';
  paymentMethod?: 'atm' | 'mobile_banking' | 'internet_banking' | 'ewallet' | 'tunai';
  paidAt?: number;
}

export interface PengaturanTagihan {
  monthlyAmount: number;
  dueDay: number;
  updatedAt: number;
  updatedBy: string;
}

export interface PengumumanAdmin {
  id: string;
  title: string;
  message: string;
  targetScope?: 'all' | 'classes';
  targetClassIds?: string[];
  imageDataUrl?: string;
  imageName?: string;
  createdAt: number;
  createdBy: string;
}

export interface NilaiRapot {
  id: string;
  studentId: string;
  classId: string;
  semester: string;
  tahunAjaran: string; // contoh: '2024/2025'
  mataPelajaran: string;
  nilaiHarian?: number;
  nilaiTugas?: number;
  nilaiUTS: number;
  nilaiUAS: number;
  nilaiAkhir: number;
  predikat?: string;
  catatanGuru?: string;
  inputBy?: string; // teacher id
  createdBy?: string; // teacher id
  updatedAt: number;
  createdAt?: number;
}

export type UserRole = 'teacher' | 'student' | 'parent' | 'guest' | 'admin';

export interface PageProps {
  onNavigate?: (page: string) => void;
  isActive?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  /** ID lokal store (s1/t1) bila login lewat backend CUID. */
  legacyId?: string;
  nis?: string;
  nip?: string;
}

export interface LoginLog {
  id: string;
  name: string;
  role: UserRole;
  timestamp: number;
  date: string; // YYYY-MM-DD
  method: 'form' | 'google';
  email?: string;
}

// ── Perpustakaan ────────────────────────────────────────────────────────
export interface Book {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  rack: string;
  stock: number;
  available: number;
  description?: string;
  coverImage?: string;
}

export interface LibraryMember {
  id: string; // usually maps to student ID or custom ID
  name: string;
  memberType: 'siswa' | 'guru' | 'staf';
  joinedAt: number;
  nis?: string;
  className?: string;
}

export interface LibraryTransaction {
  id: string;
  bookId: string;
  memberId: string;
  memberName: string;
  borrowDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  status: 'dipinjam' | 'dikembalikan' | 'terlambat' | 'menunggu' | 'ditolak';
  dueDate: string; // YYYY-MM-DD
  note?: string;
}

export interface GuestConfig {
  accessCode: string;
  allowEmailLogin: boolean;
  updatedAt: number;
  updatedBy: string;
}

// ── Additional Types from store.ts ────────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Message {
  id: string;
  sender: string;
  receiverRole: 'teacher' | 'student' | 'parent' | 'admin' | 'all';
  subject: string;
  content: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Aktif' | 'Selesai';
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'Lunas' | 'Belum Lunas';
}

export interface Grade {
  subject: string;
  assignment: number;
  midterm: number;
  final: number;
}

export interface StudentClassMutation {
  id: string;
  studentId: string;
  studentName: string;
  fromClassId: string;
  toClassId: string;
  note: string;
  movedAt: string;
}

export interface StudentStatusMutation {
  id: string;
  studentId: string;
  studentName: string;
  fromStatus: StudentStatus;
  toStatus: StudentStatus;
  note: string;
  movedAt: string;
}

export interface RpsMeetingRow {
  pertemuan: string;
  kemampuanAkhir: string;
  materiPembelajaran: string;
  indikator: string;
  outputPembelajaran: string;
  strategiPembelajaran: string;
  bentukPembelajaran: string;
  estimasiWaktu: string;
  bobotPenilaian: string;
}

export interface RpsDocument {
  id: string;
  teacherId: string;
  classId: string;
  className: string;
  subject: string;
  programStudi: string;
  fakultas: string;
  sks: string;
  rows: RpsMeetingRow[];
  updatedAt: number;
}

export interface TeacherLessonNote {
  id: string;
  teacherId: string;
  classId: string;
  subject: string;
  date: string;
  materi: string;
  adaPr: boolean;
  prDetail?: string;
  catatan?: string;
  updatedAt: number;
}

// ── PPDB Types ───────────────────────────────────────────────────────────
export type PPDBApplicationStatus = 'PENDING' | 'VERIFIED' | 'ACCEPTED' | 'REJECTED';

export interface PPDBDocumentFile {
  name: string;
  data: string;
}

export interface PPDBApplication {
  id: string;
  registrationNo: string;
  submittedAt: string;
  status: PPDBApplicationStatus;
  jenjangTujuan: string;
  sekolahTujuan: string;
  jalurPendaftaran: string;
  majorId?: string;
  namaLengkap: string;
  nisn: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  kewenangnegaraan: string;
  anakKe: string;
  jumlahSaudara: string;
  golonganDarah: string;
  alamatLengkap: string;
  rt: string;
  rw: string;
  dusun: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  nomorHp: string;
  whatsApp?: string;
  email: string;
  sekolahAsal: string;
  npsnSekolahAsal: string;
  alasanPindah?: string;
  namaAyah: string;
  nikAyah?: string;
  pendidikanAyah?: string;
  pekerjaanAyah?: string;
  penghasilanAyah?: string;
  namaIbu: string;
  nikIbu?: string;
  pendidikanIbu?: string;
  pekerjaanIbu?: string;
  penghasilanIbu?: string;
  namaWali?: string;
  hubunganWali?: string;
  pendidikanWali?: string;
  pekerjaanWali?: string;
  penghasilanWali?: string;
  nomorHpWali?: string;
  pasFotoDataUrl?: string;
  dokumen?: string[];
  documents?: Record<string, PPDBDocumentFile | null>;
  documentValidation?: Record<string, 'PENDING' | 'VALID' | 'INVALID'>;
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type PPDBAuditAction =
  | 'SUBMIT_APPLICATION'
  | 'UPDATE_STATUS'
  | 'UPDATE_DOCUMENT_VALIDATION'
  | 'DELETE_APPLICATION'
  | 'IMPORT_BACKUP'
  | 'ADMIN_LOGIN_SUCCESS'
  | 'ADMIN_LOGIN_FAILED'
  | 'ADMIN_LOGOUT';

export interface PPDBAuditLog {
  id: string;
  action: PPDBAuditAction;
  actor: string;
  occurredAt: string;
  metadata?: Record<string, string>;
}

export interface PPDBNotification {
  id: string;
  applicationId: string;
  registrationNo: string;
  namaLengkap: string;
  type: 'NEW_REGISTRATION' | 'STATUS_CHANGED';
  message: string;
  isRead: boolean;
  createdAt: string;
}

/** Master data tahun ajaran + semester. Hanya satu record boleh `aktif: true`. */
export interface TahunAjaran {
  id: string;
  tahun: string; // mis. "2025/2026"
  semester: 'ganjil' | 'genap';
  aktif: boolean;
  createdAt: number;
}

/** Master data mata pelajaran. */
export interface MataPelajaran {
  id: string;
  nama: string;
  kode: string;
  kelompok?: string; // mis. "Wajib" | "Peminatan"
  createdAt: number;
}

/** Feedback dari pengguna sistem. */
export interface Feedback {
  id: string;
  name: string;
  email?: string;
  role: string;
  category: 'bug' | 'saran' | 'keluhan' | 'pertanyaan' | 'lainnya';
  subject: string;
  message: string;
  priority: 'rendah' | 'sedang' | 'tinggi';
  status: 'pending' | 'dibaca' | 'diproses' | 'selesai';
  submittedAt: number;
  adminNotes?: string;
  processedAt?: number;
}
