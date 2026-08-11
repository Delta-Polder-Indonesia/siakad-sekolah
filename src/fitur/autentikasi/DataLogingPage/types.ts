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
}

export interface Teacher {
  id: string;
  name: string;
  nip: string; // Nomor Induk Pegawai
  subject: string;
  password: string;
  classIds: string[];
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

export interface OnlineAssignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  createdBy: string;
  createdAt: number;
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
  isAdmin?: boolean;
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

// ── Login Page Types ───────────────────────────────────────────────────────
export type ValidRole = 'teacher' | 'student' | 'parent' | 'guest';

export interface BackgroundImage {
  src: string;
  fallback?: string;
  caption: string;
  description: string;
}

export interface BackgroundSlideshowProps {
  images: readonly BackgroundImage[];
  currentSlide: number;
}

export type PpdbView = 'landing' | 'form' | 'cek-kelulusan';

export interface LoginPanelProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  id: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  onRoleChange: (newRole: UserRole) => void;
  onIdChange: (newId: string) => void;
  onPasswordChange: (newPassword: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  onHelpClick: () => void;
  onGoogleLogin: (credential?: string) => void;
  disabled?: boolean;
}

export interface PerpustakaanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PpdbModalProps {
  isOpen: boolean;
  view: PpdbView;
  onViewChange: (view: PpdbView) => void;
  onClose: () => void;
}
