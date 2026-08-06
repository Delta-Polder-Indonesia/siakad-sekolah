# API Documentation — Portal SIAKAD Service Layer

> **Lokasi:** `src/data/services/`
> **Entry Point:** `src/data/services/index.ts` (barrel file — import semua dari sini)
> **Backing Store:** `src/data/store/core.ts` (localStorage-based, siap migrasi ke backend)

---

## Daftar Isi

- [Cara Import](#cara-import)
- [Core Services](#core-services)
- [Teacher Services](#teacher-services)
- [Student Services](#student-services)
- [Class Services](#class-services)
- [Attendance Services](#attendance-services)
- [Announcement Services](#announcement-services)
- [Library Services](#library-services)
- [PPDB Services](#ppdb-services)
- [Class Activity Services](#class-activity-services)
- [Message Services](#message-services)
- [Task Services](#task-services)
- [Surat Izin Services](#surat-izin-services)
- [Billing Services](#billing-services)
- [Rapot Services](#rapot-services)
- [Pengumuman Admin Services](#pengumuman-admin-services)
- [Lesson Services](#lesson-services)
- [Type Definitions](#type-definitions)
- [Migration Strategy](#migration-strategy)

---

## Cara Import

```typescript
// Import semua services dari barrel
import { getStudents, getTeachers, addStudent } from '../../data/services';

// Import tipe data
import type { Student, Teacher, AttendanceRecord } from '../../data/services';
```

---

## Core Services

**File:** `coreService.ts` — Inisialisasi data & utilitas storage.

| Function | Signature | Description |
|----------|-----------|-------------|
| `initializeData` | `() => Promise<void>` | Inisialisasi seed data ke localStorage. Panggil sekali di `App.tsx` `useEffect`. |
| `hashPassword` | `(password: string) => Promise<string>` | Hash password dengan SHA-256 + salt. |
| `subscribeStore` | `(listener: () => void) => () => void` | Subscribe perubahan store. Return unsubscribe function. |
| `getStorageSummary` | `() => Record<string, { count: number; size: number }>` | Dapatkan ringkasan seluruh data di localStorage. |
| `createId` | `() => string` | Generate unique ID (timestamp + random). |
| `notifyStoreUpdated` | `() => void` | Trigger notifikasi ke semua subscriber bahwa store berubah. |

---

## Teacher Services

**File:** `teacherService.ts` — Manajemen data guru.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getTeachers` | `() => Teacher[]` | Ambil semua data guru. |
| `getTeacherList` | `() => Teacher[]` | Alias dari `getTeachers`. |
| `saveTeachers` | `(teachers: Teacher[]) => void` | Simpan array guru (overwrite seluruh data). |
| `updateTeacher` | `(teacher: Teacher) => void` | Update satu data guru (cari by ID, lalu update). |

### Type: Teacher

```typescript
interface Teacher {
  id: string;
  name: string;
  nip: string;            // Nomor Induk Pegawai
  subject: string;         // Mata pelajaran
  password: string;
  classIds: string[];      // IDs kelas yang diajar
  avatar?: string;
  whatsapp?: string;
  phone?: string;
  email: string;
  address?: string;
}
```

---

## Student Services

**File:** `studentService.ts` — Manajemen data siswa.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getStudents` | `() => Student[]` | Ambil semua data siswa. |
| `getStudentsByClass` | `(classId: string) => Student[]` | Filter siswa berdasarkan ID kelas. |
| `addStudent` | `(student: Student) => void` | Tambah satu siswa baru ke array. |
| `updateStudent` | `(student: Student) => void` | Update data siswa (cari by ID). |
| `deleteStudent` | `(studentId: string) => void` | Hapus siswa berdasarkan ID. |
| `saveStudents` | `(students: Student[]) => void` | Simpan array siswa (overwrite). |
| `getStudentClassMutations` | `() => StudentClassMutation[]` | Ambil riwayat mutasi kelas siswa. |
| `addStudentClassMutation` | `(mutation: StudentClassMutation) => void` | Catat mutasi kelas baru. |

### Type: Student

```typescript
interface Student {
  id: string;
  name: string;
  nis: string;             // Nomor Induk Siswa
  classId: string;
  className?: string;
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
```

---

## Class Services

**File:** `classService.ts` — Manajemen data kelas.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getClasses` | `() => ClassRoom[]` | Ambil semua data kelas. |
| `saveClasses` | `(classes: ClassRoom[]) => void` | Simpan array kelas (overwrite). |

### Type: ClassRoom

```typescript
interface ClassRoom {
  id: string;
  name: string;       // Contoh: "X IPA 1"
  grade: string;       // Contoh: "10", "11", "12"
  teacherId: string;   // Wali kelas
}
```

---

## Attendance Services

**File:** `attendanceService.ts` — Manajemen absensi siswa.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getAttendance` | `() => AttendanceRecord[]` | Ambil semua record absensi. |
| `getAttendanceByDate` | `(date: string) => AttendanceRecord[]` | Filter absensi berdasarkan tanggal (YYYY-MM-DD). |
| `getAttendanceByDateRange` | `(start: string, end: string) => AttendanceRecord[]` | Filter absensi berdasarkan rentang tanggal. |
| `getAttendanceByStudent` | `(studentId: string) => AttendanceRecord[]` | Filter absensi berdasarkan ID siswa. |
| `saveAttendance` | `(records: AttendanceRecord[]) => void` | Simpan array absensi (overwrite). |
| `addAttendanceRecords` | `(records: AttendanceRecord[]) => void` | Tambah record absensi baru. |
| `getAttendanceRecords` | `() => AttendanceRecord[]` | Alias dari `getAttendance`. |

### Type: AttendanceRecord

```typescript
interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;                // YYYY-MM-DD
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  note?: string;
  markedBy: string;             // teacher id
  timestamp: number;
}
```

---

## Announcement Services

**File:** `announcementService.ts` — Pengumuman tingkat sekolah.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getSchoolAnnouncements` | `() => Announcement[]` | Ambil semua pengumuman sekolah. |
| `addSchoolAnnouncement` | `(announcement: Announcement) => void` | Tambah pengumuman baru. |

### Type: Announcement

```typescript
interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}
```

---

## Library Services

**File:** `libraryService.ts` — Manajemen perpustakaan digital.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getBooks` | `() => Book[]` | Ambil semua data buku. |
| `saveBooks` | `(books: Book[]) => void` | Simpan array buku (overwrite). |
| `addOrUpdateBook` | `(book: Book) => void` | Tambah atau update buku (cari by ID). |
| `deleteBook` | `(bookId: string) => void` | Hapus buku berdasarkan ID. |
| `getLibraryMembers` | `() => LibraryMember[]` | Ambil semua anggota perpustakaan. |
| `saveLibraryMembers` | `(members: LibraryMember[]) => void` | Simpan anggota perpustakaan. |
| `getLibraryTransactions` | `() => LibraryTransaction[]` | Ambil semua transaksi peminjaman. |
| `saveLibraryTransactions` | `(txns: LibraryTransaction[]) => void` | Simpan transaksi peminjaman. |
| `borrowBook` | `(txn: LibraryTransaction) => void` | Ajukan peminjaman buku. |
| `approveLibraryLoan` | `(txnId: string) => void` | Setujui peminjaman. |
| `rejectLibraryLoan` | `(txnId: string) => void` | Tolak peminjaman. |
| `returnBook` | `(txnId: string) => void` | Proses pengembalian buku. |

### Types: Perpustakaan

```typescript
interface Book {
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

interface LibraryMember {
  id: string;
  name: string;
  memberType: 'siswa' | 'guru' | 'staf';
  joinedAt: number;
  nis?: string;
  className?: string;
}

interface LibraryTransaction {
  id: string;
  bookId: string;
  memberId: string;
  memberName: string;
  borrowDate: string;           // YYYY-MM-DD
  returnDate?: string;          // YYYY-MM-DD
  status: 'dipinjam' | 'dikembalikan' | 'terlambat' | 'menunggu' | 'ditolak';
  dueDate: string;
  note?: string;
}
```

---

## PPDB Services

**File:** `ppdbService.ts` — Penerimaan Peserta Didik Baru (22 fungsi).

### Aplikasi
| Function | Signature | Description |
|----------|-----------|-------------|
| `getPPDBApplications` | `() => PPDBApplication[]` | Ambil semua pendaftaran. |
| `getPPDBApplicationById` | `(id: string) => PPDBApplication \| undefined` | Cari pendaftaran by ID. |
| `getPPDBApplicationByRegNo` | `(regNo: string) => PPDBApplication \| undefined` | Cari pendaftaran by No. Registrasi. |
| `submitPPDBApplication` | `(data: Partial\<PPDBApplication\>) => PPDBApplication` | Submit pendaftaran baru. |
| `updateApplicationStatus` | `(id: string, status: PPDBApplicationStatus, actor: string) => void` | Update status (VERIFIED/ACCEPTED/REJECTED). |
| `updateDocumentValidation` | `(id: string, docKey: string, status: 'VALID' \| 'INVALID') => void` | Validasi dokumen pendaftaran. |
| `deletePPDBApplication` | `(id: string) => void` | Hapus pendaftaran. |

### Backup
| Function | Signature | Description |
|----------|-----------|-------------|
| `exportPPDBBackupJson` | `() => string` | Export JSON backup seluruh data PPDB. |
| `importPPDBBackupJson` | `(json: string) => void` | Import data dari JSON backup. |

### Notifikasi
| Function | Signature | Description |
|----------|-----------|-------------|
| `getPPDBNotifications` | `() => PPDBNotification[]` | Ambil semua notifikasi PPDB. |
| `addPPDBNotification` | `(notif: PPDBNotification) => void` | Tambah notifikasi baru. |
| `getUnreadNotificationCount` | `() => number` | Hitung notifikasi yang belum dibaca. |
| `markNotificationAsRead` | `(notifId: string) => void` | Tandai notifikasi sudah dibaca. |

### Admin
| Function | Signature | Description |
|----------|-----------|-------------|
| `adminLogin` | `(username: string, password: string) => boolean` | Login admin PPDB. |
| `isAdminAuthenticated` | `() => boolean` | Cek apakah admin sudah login. |
| `getAdminProfileName` | `() => string` | Ambil nama profil admin. |
| `getAdminSecurityState` | `() => { locked: boolean; attempts: number }` | Status keamanan admin. |
| `adminLogout` | `() => void` | Logout admin. |

### Settings
| Function | Signature | Description |
|----------|-----------|-------------|
| `getAdminSettings` | `() => Record<string, string>` | Ambil pengaturan admin. |
| `updateAdminSettings` | `(settings: Record<string, string>) => void` | Update pengaturan admin. |
| `getGuestConfig` | `() => GuestConfig` | Ambil konfigurasi akses tamu. |
| `updateGuestConfig` | `(config: GuestConfig) => void` | Update konfigurasi akses tamu. |

### Audit
| Function | Signature | Description |
|----------|-----------|-------------|
| `getPPDBAuditLogs` | `() => PPDBAuditLog[]` | Ambil log audit PPDB. |
| `getPPDBStatistics` | `() => { total: number; byStatus: Record<string, number> }` | Statistik pendaftaran. |

### Types: PPDB

```typescript
type PPDBApplicationStatus = 'PENDING' | 'VERIFIED' | 'ACCEPTED' | 'REJECTED';

interface PPDBApplication {
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
  // ... plus 30+ fields for student/parent data
  pasFotoDataUrl?: string;
  documents?: Record<string, PPDBDocumentFile | null>;
  documentValidation?: Record<string, 'PENDING' | 'VALID' | 'INVALID'>;
}
```

---

## Class Activity Services

**File:** `classActivityService.ts` — Aktivitas kelas (roster, tugas, pengumuman kelas).

### Roster
| Function | Signature | Description |
|----------|-----------|-------------|
| `getClassRosters` | `(classId: string) => ClassRosterItem[]` | Ambil roster jadwal kelas. |
| `addClassRoster` | `(roster: ClassRosterItem) => void` | Tambah item roster. |
| `deleteClassRoster` | `(classId: string, rosterId: string) => void` | Hapus item roster. |

### Pengumuman Kelas
| Function | Signature | Description |
|----------|-----------|-------------|
| `getClassAnnouncements` | `(classId: string) => ClassAnnouncement[]` | Ambil pengumuman kelas. |
| `addClassAnnouncement` | `(announcement: ClassAnnouncement) => void` | Tambah pengumuman kelas. |
| `deleteClassAnnouncement` | `(classId: string, announcementId: string) => void` | Hapus pengumuman kelas. |

### Tugas Online
| Function | Signature | Description |
|----------|-----------|-------------|
| `getOnlineAssignmentsByClass` | `(classId: string) => OnlineAssignment[]` | Ambil tugas online kelas. |
| `getAllOnlineAssignments` | `() => OnlineAssignment[]` | Ambil seluruh tugas online (semua kelas). |
| `addOnlineAssignment` | `(assignment: OnlineAssignment) => void` | Tambah tugas baru. |
| `updateOnlineAssignment` | `(assignment: OnlineAssignment) => void` | Update tugas existing (keyed by `id`). |
| `deleteOnlineAssignment` | `(classId: string, assignmentId: string) => void` | Hapus tugas. |

### Submission
| Function | Signature | Description |
|----------|-----------|-------------|
| `getSubmissionsByAssignment` | `(assignmentId: string) => AssignmentSubmission[]` | Ambil semua jawaban tugas. |
| `getSubmissionByAssignmentAndStudent` | `(assignmentId: string, studentId: string) => AssignmentSubmission \| undefined` | Cek apakah siswa sudah mengumpulkan. |
| `upsertAssignmentSubmission` | `(submission: AssignmentSubmission) => void` | Submit atau update jawaban. |

### Diskusi Tugas
| Function | Signature | Description |
|----------|-----------|-------------|
| `getDiscussionsByAssignment` | `(assignmentId: string) => AssignmentDiscussion[]` | Ambil thread diskusi tugas (urut naik oleh waktu). |
| `addAssignmentDiscussion` | `(item: AssignmentDiscussion) => void` | Tambah komentar diskusi baru. |
| `editAssignmentDiscussion` | `(id: string, message: string) => void` | Edit isi pesan diskusi forum. |
| `deleteAssignmentDiscussion` | `(id: string) => void` | Hapus pesan diskusi forum. |

### Chat Grup
| Function | Signature | Description |
|----------|-----------|-------------|
| `getChatGroupsByClass` | `(classId: string) => ChatGroup[]` | Ambil grup chat per kelas. |
| `addChatGroup` | `(group: ChatGroup) => void` | Buat grup baru. |
| `deleteChatGroup` | `(groupId: string) => void` | Hapus grup + seluruh pesannya. |
| `addGroupMember` / `removeGroupMember` | `(groupId: string, studentId: string) => void` | Tambah/keluarkan anggota grup. |
| `getGroupMessages` | `(groupId: string) => GroupChatMessage[]` | Ambil pesan grup (urut naik oleh waktu). |
| `addGroupMessage` | `(item: GroupChatMessage) => void` | Kirim pesan grup. |
| `editGroupMessage` | `(id: string, message: string) => void` | Edit isi pesan grup. |
| `deleteGroupMessage` | `(id: string) => void` | Hapus pesan grup. |

### Chat Privat (1-1)
| Function | Signature | Description |
|----------|-----------|-------------|
| `getPrivateMessages` | `(userIdA: string, userIdB: string) => PrivateMessage[]` | Ambil pesan privat dua arah antara dua user (urut kronologis). |
| `addPrivateMessage` | `(item: PrivateMessage) => void` | Kirim pesan privat. |
| `editPrivateMessage` | `(id: string, message: string) => void` | Edit isi pesan privat. |
| `deletePrivateMessage` | `(id: string) => void` | Hapus pesan privat. |
| `getUnreadPrivateCount` | `(userId: string, otherId: string) => number` | Jumlah pesan privat belum dibaca dari user lain (scope `private:<userId>\|<otherId>`). |

### Typing Indicator (C15)
| Function | Signature | Description |
|----------|-----------|-------------|
| `setTyping` | `(scopeKey: string, userId: string, name: string, role: string) => void` | Tandai user sedang mengetik di scope (forum/grup/private). |
| `clearTyping` | `(scopeKey: string, userId: string) => void` | Hentikan status ketikan user di scope. |
| `getTypingUsers` | `(scopeKey: string, excludeUserId: string) => Array<{ userId, name, role }>` | Daftar user yang sedang mengetik (jendela 4 detik), mengecualikan user sendiri. |

### Hasil Kuis Tugas
| Function | Signature | Description |
|----------|-----------|-------------|
| `getQuizResult` | `(assignmentId: string, studentId: string) => AssignmentQuizResult \| null` | Ambil hasil kuis siswa pada tugas. |
| `saveQuizResult` | `(item: AssignmentQuizResult) => void` | Simpan/update hasil kuis siswa (keyed assignment + student). |

### Types: Class Activity

```typescript
interface AssignmentBook {
  title: string;
  author: string;
  year?: string;        // tahun terbit
  link?: string;        // tautan eksternal
  dataUrl?: string;     // file e-book (DataURL)
  fileName?: string;
}

interface AssignmentVideo {
  title: string;
  url: string;          // URL YouTube (watch/youtu.be/shorts/embed)
  description?: string;
}

interface AssignmentAttachment {
  name: string;
  dataUrl: string;
  size?: number;
}

interface AssignmentExercise {
  question: string;
  options: string[];    // 2+ pilihan
  correctIndex: number; // indeks kunci jawaban (0-based)
}

interface AssignmentDiscussion {
  id: string;
  assignmentId: string;
  authorId: string;
  authorName: string;
  role: string;         // teacher | student | parent | admin
  message: string;
  createdAt: number;
  attachment?: MessageAttachment; // C12: lampiran file opsional
}

interface MessageAttachment {
  name: string;
  type: string;         // MIME type
  dataUrl: string;      // data URL file (maks. ~1.5MB)
  size: number;         // ukuran byte
}

interface ChatGroup {
  id: string;
  classId: string;
  name: string;
  memberIds: string[];  // siswa anggota
  createdBy: string;
  createdAt: number;
}

interface GroupChatMessage {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  role: string;
  message: string;
  createdAt: number;
  attachment?: MessageAttachment;
}

interface PrivateMessage {
  id: string;
  senderId: string;     // pengirim
  receiverId: string;   // penerima
  authorName: string;
  role: string;
  message: string;
  createdAt: number;
  attachment?: MessageAttachment;
}

interface AssignmentQuizResult {
  assignmentId: string;
  studentId: string;
  answers: number[];    // jawaban per soal (indeks pilihan)
  score: number;
  total: number;
  submittedAt: number;
}

interface OnlineAssignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string;      // YYYY-MM-DD
  createdBy: string;
  createdAt: number;
  summary?: string;                    // Ringkasan materi (tab Ringkasan)
  books?: AssignmentBook[];            // tab Buku
  videos?: AssignmentVideo[];          // tab Video
  attachments?: AssignmentAttachment[];// tab Lampiran
  exercises?: AssignmentExercise[];    // tab Latihan (kuis)
}

```typescript
interface ClassRosterItem {
  id: string;
  classId: string;
  subject: string;
  dayOfWeek: number;       // 0=Min, 1=Sen, ..., 6=Sab
  startTime: string;       // HH:mm
  endTime: string;         // HH:mm
  room?: string;
  teacherName?: string;
  updatedBy: string;
  updatedAt: number;
}

interface ClassAnnouncement {
  id: string;
  classId: string;
  title: string;
  message?: string;
  content?: string;        // alias for message
  createdBy: string;
  createdAt: number;
}

interface OnlineAssignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string;         // YYYY-MM-DD
  createdBy: string;
  createdAt: number;
}

interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  answerText: string;
  attachmentName?: string;
  attachmentDataUrl?: string;
  submittedAt: number;
}
```

---

## Message Services

**File:** `messageService.ts` — Pesan antar role.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getMessagesForRole` | `(role: UserRole) => Message[]` | Ambil pesan untuk role tertentu. |
| `addMessage` | `(message: Message) => void` | Kirim pesan baru. |

### Type: Message

```typescript
interface Message {
  id: string;
  sender: string;
  receiverRole: 'teacher' | 'student' | 'all';
  subject: string;
  content: string;
  date: string;
}
```

---

## Task Services

**File:** `taskService.ts` — Tugas, tagihan, nilai, jadwal (dashboard siswa).

| Function | Signature | Description |
|----------|-----------|-------------|
| `getTasks` | `() => Task[]` | Ambil semua tugas (dashboard). |
| `addTask` | `(task: Task) => void` | Tambah tugas baru. |
| `getBills` | `() => Bill[]` | Ambil data tagihan (dashboard). |
| `getGrades` | `() => Grade[]` | Ambil data nilai (dashboard). |
| `getSchedule` | `() => string[]` | Ambil jadwal (dashboard). |

### Types: Dashboard

```typescript
interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Aktif' | 'Selesai';
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'Lunas' | 'Belum Lunas';
}

interface Grade {
  subject: string;
  assignment: number;
  midterm: number;
  final: number;
}
```

---

## Surat Izin Services

**File:** `suratIzinService.ts` — Surat izin/sakit siswa.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getSuratIzin` | `(filter?: { status?: string }) => SuratIzin[]` | Ambil surat izin, opsional filter status. |
| `getSuratIzinByStudent` | `(studentId: string) => SuratIzin[]` | Ambil surat izin siswa tertentu. |
| `addSuratIzin` | `(surat: SuratIzin) => void` | Kirim surat izin baru. |
| `updateStatusSuratIzin` | `(id: string, status: 'disetujui' \| 'ditolak') => void` | Validasi surat izin (guru). |

### Type: SuratIzin

```typescript
interface SuratIzin {
  id: string;
  studentId: string;
  classId: string;
  type: 'izin' | 'sakit' | 'dispensasi' | 'lainnya';
  status: 'menunggu' | 'disetujui' | 'ditolak';
  subject: string;
  message: string;
  letterDate: string;    // YYYY-MM-DD
  attachmentName?: string;
  attachmentDataUrl?: string;
  createdAt: number;
}
```

---

## Billing Services

**File:** `billingService.ts` — Tagihan sekolah.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getTagihanSekolahBySiswa` | `(studentId: string) => TagihanSekolah[]` | Ambil tagihan siswa. |
| `getTahunTagihanSiswa` | `(studentId: string) => number[]` | Ambil daftar tahun tagihan siswa. |
| `bayarTagihanSekolah` | `(tagihanId: string, method: string) => void` | Bayar tagihan. |
| `getPengaturanTagihan` | `() => PengaturanTagihan \| null` | Ambil pengaturan tagihan global. |
| `setPengaturanTagihan` | `(pengaturan: PengaturanTagihan) => void` | Set pengaturan tagihan. |
| `terapkanTagihanTahunanUntukSemuaSiswa` | `(year: number) => void` | Terapkan tagihan ke semua siswa. |

### Types: Billing

```typescript
interface TagihanSekolah {
  id: string;
  studentId: string;
  year: number;
  month: number;           // 1-12
  amount: number;
  dueDate: string;         // YYYY-MM-DD
  status: 'lunas' | 'belum_lunas';
  paymentMethod?: 'atm' | 'mobile_banking' | 'internet_banking' | 'ewallet' | 'tunai';
  paidAt?: number;
}

interface PengaturanTagihan {
  monthlyAmount: number;
  dueDay: number;
  updatedAt: number;
  updatedBy: string;
}
```

---

## Rapot Services

**File:** `rapotService.ts` — Nilai rapot siswa.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getNilaiRapot` | `() => NilaiRapot[]` | Ambil semua nilai rapot. |
| `getNilaiRapotBySiswa` | `(studentId: string) => NilaiRapot[]` | Ambil nilai rapot siswa. |
| `getNilaiRapotByKelas` | `(classId: string) => NilaiRapot[]` | Ambil nilai rapot per kelas. |
| `getTahunAjaranRapotSiswa` | `(studentId: string) => string[]` | Daftar tahun ajaran yang tersedia. |
| `saveNilaiRapot` | `(nilai: NilaiRapot[]) => void` | Simpan array nilai (overwrite). |
| `upsertNilaiRapot` | `(nilai: NilaiRapot) => void` | Tambah atau update satu nilai. |
| `deleteNilaiRapot` | `(nilaiId: string) => void` | Hapus satu nilai. |

### Type: NilaiRapot

```typescript
interface NilaiRapot {
  id: string;
  studentId: string;
  classId: string;
  semester: string;
  tahunAjaran: string;      // Contoh: '2024/2025'
  mataPelajaran: string;
  nilaiHarian?: number;
  nilaiTugas?: number;
  nilaiUTS: number;
  nilaiUAS: number;
  nilaiAkhir: number;
  predikat?: string;
  catatanGuru?: string;
  inputBy?: string;          // teacher id
  createdBy?: string;
  updatedAt: number;
  createdAt?: number;
}
```

---

## Pengumuman Admin Services

**File:** `pengumumanAdminService.ts` — Pengumuman dari admin sekolah.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getPengumumanAdmin` | `() => PengumumanAdmin[]` | Ambil semua pengumuman admin. |
| `getPengumumanAdminUntukKelas` | `(classId: string) => PengumumanAdmin[]` | Filter pengumuman untuk kelas tertentu. |
| `getPengumumanAdminUntukGuru` | `(teacherClassIds: string[]) => PengumumanAdmin[]` | Filter pengumuman untuk guru (berdasarkan kelas yang diajar). |
| `addPengumumanAdmin` | `(pengumuman: PengumumanAdmin) => void` | Tambah pengumuman baru. |
| `deletePengumumanAdmin` | `(id: string) => void` | Hapus pengumuman. |
| `hapusSemuaFotoPengumumanAdmin` | `() => void` | Hapus semua foto dari pengumuman. |

### Type: PengumumanAdmin

```typescript
interface PengumumanAdmin {
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
```

---

## Lesson Services

**File:** `lessonService.ts` — RPS (Rencana Pembelajaran Semester) & catatan mengajar.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getRpsDocument` | `(teacherId: string, classId: string) => RpsDocument \| undefined` | Ambil dokumen RPS guru untuk kelas tertentu. |
| `saveRpsDocument` | `(doc: RpsDocument) => void` | Simpan dokumen RPS. |
| `getTeacherLessonNotes` | `(teacherId: string, classId: string) => TeacherLessonNote[]` | Ambil catatan mengajar guru. |
| `upsertTeacherLessonNote` | `(note: TeacherLessonNote) => void` | Tambah atau update catatan mengajar. |

### Types: Lesson

```typescript
interface RpsDocument {
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

interface RpsMeetingRow {
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

interface TeacherLessonNote {
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
```

---

## Type Definitions

**File:** `src/types.ts` — Semua tipe data utama.

### Core Types

| Type | Kind | Description |
|------|------|-------------|
| `AuthUser` | `interface` | User yang sedang login. |
| `UserRole` | `type` | `'teacher' \| 'student' \| 'parent' \| 'guest' \| 'admin'` |
| `PageProps` | `interface` | Props untuk komponen halaman: `{ onNavigate?, isActive? }` |

```typescript
interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
}
```

### Mutasi & Lainnya

| Type | Description |
|------|-------------|
| `StudentClassMutation` | Riwayat mutasi kelas siswa: `{ studentId, fromClassId, toClassId, note, movedAt }` |
| `GuestConfig` | Konfigurasi akses tamu: `{ accessCode, allowEmailLogin }` |
| `PPDBAuditLog` | Log audit PPDB: `{ action, actor, occurredAt, metadata? }` |
| `PPDBAuditAction` | Union type aksi audit: `'SUBMIT_APPLICATION' \| 'UPDATE_STATUS' \| ...` |
| `PPDBNotification` | Notifikasi PPDB: `{ applicationId, registrationNo, type, message, isRead }` |

---

## Migration Strategy

Service layer dirancang untuk memudahkan migrasi dari localStorage ke backend.

### Saat ini (localStorage)
```typescript
// service.ts — thin wrapper
import { getStudents } from '../store/core';
export { getStudents };
```

### Setelah migrasi ke backend
```typescript
// service.ts — ganti implementasi
import api from '../../services/apiConfig';

export async function getStudents(): Promise<Student[]> {
  const res = await api.get('/students');
  return res.data;
}
```

**Kelebihan:**
- Semua komponen tetap menggunakan `import from '../../data/services'` — **tidak perlu diubah**
- Cukup ganti isi file service, komponen tidak tahu menahu
- Migration per-domain bisa dilakukan bertahap

---

*Dokumentasi dibuat: 29 Juli 2026*
*Service layer: 16 domain services, 100+ function signatures*
