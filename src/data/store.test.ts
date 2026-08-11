import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import * as store from './store';
import type { PPDBApplication } from './store';

const STORAGE_KEY = 'portal-siswa-db-v1';

beforeEach(async () => {
  localStorage.clear();
  await store.initializeData();
});

type ApplicationInput = Omit<PPDBApplication, 'id' | 'registrationNo' | 'submittedAt' | 'status'>;

const buildApplicationInput = (overrides: Partial<ApplicationInput> = {}): ApplicationInput => ({
  jenjangTujuan: 'SMA',
  sekolahTujuan: 'SMA Negeri 1',
  jalurPendaftaran: 'REGULER',
  namaLengkap: 'Calon Siswa',
  nisn: '',
  nik: '3201010101010001',
  tempatLahir: 'Medan',
  tanggalLahir: '2010-01-01',
  jenisKelamin: 'Laki-laki',
  agama: 'Islam',
  kewenangnegaraan: 'WNI',
  anakKe: '1',
  jumlahSaudara: '2',
  golonganDarah: 'O',
  alamatLengkap: 'Jl. Merdeka 1',
  rt: '01',
  rw: '02',
  dusun: '-',
  desaKelurahan: 'Sukamaju',
  kecamatan: 'Medan Kota',
  kabupatenKota: 'Medan',
  provinsi: 'Sumatera Utara',
  kodePos: '20111',
  nomorHp: '08123456789',
  email: 'calon@example.com',
  sekolahAsal: 'SMP Negeri 2',
  npsnSekolahAsal: '10101010',
  namaAyah: 'Ayah',
  namaIbu: 'Ibu',
  ...overrides,
});

describe('initializeData', () => {
  it('seeds the database only when storage is empty', async () => {
    localStorage.clear();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    await store.initializeData();
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    store.saveTeachers([]);
    await store.initializeData();
    expect(store.getTeachers()).toEqual([]);
  });
});

describe('createId', () => {
  it('produces unique, non-empty ids', () => {
    const a = store.createId();
    const b = store.createId();
    expect(a).toBeTruthy();
    expect(a).not.toBe(b);
  });
});

describe('hashPassword', () => {
  it('is deterministic and produces a 64-char hex digest', async () => {
    const first = await store.hashPassword('secret');
    const second = await store.hashPassword('secret');
    expect(first).toBe(second);
    expect(first).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces different hashes for different inputs', async () => {
    expect(await store.hashPassword('a')).not.toBe(await store.hashPassword('b'));
  });
});

describe('announcements', () => {
  it('returns the seeded announcements by default', () => {
    expect(store.getSchoolAnnouncements()).toHaveLength(2);
  });

  it('prepends a new announcement with an ISO date', () => {
    store.addSchoolAnnouncement('Judul', 'Isi');
    const list = store.getSchoolAnnouncements();
    expect(list[0].title).toBe('Judul');
    expect(list[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(list).toHaveLength(3);
  });
});

describe('teachers', () => {
  it('reads seeded teachers and getTeachers aliases getTeacherList', () => {
    expect(store.getTeachers()).toEqual(store.getTeacherList());
    expect(store.getTeachers().length).toBeGreaterThan(0);
  });

  it('updates an existing teacher in place', () => {
    const teacher = store.getTeachers()[0];
    store.updateTeacher({ ...teacher, name: 'Nama Baru' });
    expect(store.getTeachers().find((t) => t.id === teacher.id)?.name).toBe('Nama Baru');
  });
});

describe('students', () => {
  it('filters students by class', () => {
    const c1 = store.getStudentsByClass('c1');
    expect(c1.length).toBeGreaterThan(0);
    expect(c1.every((s) => s.classId === 'c1')).toBe(true);
  });

  it('adds, updates and deletes students', () => {
    store.addStudent({
      id: 'sx',
      name: 'Baru',
      nis: '999',
      password: 'p',
      classId: 'c1',
      gender: 'L',
    });
    expect(store.getStudents().some((s) => s.id === 'sx')).toBe(true);

    store.updateStudent({
      id: 'sx',
      name: 'Baru Update',
      nis: '999',
      password: 'p',
      classId: 'c1',
      gender: 'L',
    });
    expect(store.getStudents().find((s) => s.id === 'sx')?.name).toBe('Baru Update');

    store.deleteStudent('sx');
    expect(store.getStudents().some((s) => s.id === 'sx')).toBe(false);
  });

  it('removes attendance rows when the student is deleted', () => {
    store.saveAttendance([
      {
        id: 'a1',
        classId: 'c1',
        studentId: 's1',
        date: '2026-01-01',
        status: 'hadir',
        markedBy: 't1',
        timestamp: Date.now(),
      },
    ]);
    store.deleteStudent('s1');
    expect(store.getAttendance().some((a) => a.studentId === 's1')).toBe(false);
  });
});

describe('student class mutations', () => {
  it('records mutations sorted by most recent first', () => {
    store.addStudentClassMutation({
      studentId: 's1',
      studentName: 'Siti',
      fromClassId: 'c1',
      toClassId: 'c2',
      note: 'pindah',
    });
    store.addStudentClassMutation({
      studentId: 's2',
      studentName: 'Budi',
      fromClassId: 'c1',
      toClassId: 'c3',
      note: 'pindah',
    });

    expect(store.getStudentClassMutations()).toHaveLength(2);
    expect(store.getStudentClassMutations('s1')).toHaveLength(1);
    expect(store.getStudentClassMutations('s1')[0].studentId).toBe('s1');
  });
});

describe('student status mutations', () => {
  it('sets student status and records status mutation', () => {
    const ok = store.setStudentStatus('s1', 'lulus', 'lulus 2026');
    expect(ok).toBe(true);
    const student = store.getStudents().find((s) => s.id === 's1');
    expect(student?.status).toBe('lulus');
    expect(student?.statusNote).toBe('lulus 2026');

    const mutations = store.getStudentStatusMutations('s1');
    expect(mutations).toHaveLength(1);
    expect(mutations[0].fromStatus).toBe('aktif');
    expect(mutations[0].toStatus).toBe('lulus');
    expect(mutations[0].studentName).toBe('Siti Rahma');
  });

  it('does not record duplicate status change', () => {
    store.setStudentStatus('s1', 'keluar', 'dropout');
    const second = store.setStudentStatus('s1', 'keluar', 'dropout lagi');
    expect(second).toBe(false);
    expect(store.getStudentStatusMutations('s1')).toHaveLength(1);
  });

  it('returns empty list for unknown student', () => {
    expect(store.getStudentStatusMutations('unknown')).toHaveLength(0);
  });
});

describe('attendance queries', () => {
  beforeEach(() => {
    store.saveAttendance([
      {
        id: 'a1',
        classId: 'c1',
        studentId: 's1',
        date: '2026-01-10',
        status: 'hadir',
        markedBy: 't1',
        timestamp: 1,
      },
      {
        id: 'a2',
        classId: 'c2',
        studentId: 's3',
        date: '2026-01-15',
        status: 'izin',
        markedBy: 't2',
        timestamp: 2,
      },
    ]);
  });

  it('filters by exact date and optional class', () => {
    expect(store.getAttendanceByDate('2026-01-10')).toHaveLength(1);
    expect(store.getAttendanceByDate('2026-01-10', 'c2')).toHaveLength(0);
  });

  it('filters by inclusive date range', () => {
    expect(store.getAttendanceByDateRange('2026-01-01', '2026-01-31')).toHaveLength(2);
    expect(store.getAttendanceByDateRange('2026-01-11', '2026-01-31')).toHaveLength(1);
    expect(store.getAttendanceByDateRange('2026-01-01', '2026-01-31', 'c1')).toHaveLength(1);
  });

  it('filters by student', () => {
    expect(store.getAttendanceByStudent('s1')).toHaveLength(1);
  });

  it('dedupes new records by student+date when adding', () => {
    store.addAttendanceRecords([
      {
        id: 'a3',
        classId: 'c1',
        studentId: 's1',
        date: '2026-01-10',
        status: 'alpha',
        markedBy: 't1',
        timestamp: 3,
      },
    ]);
    const forDate = store.getAttendanceByDate('2026-01-10');
    expect(forDate).toHaveLength(1);
    expect(forDate[0].status).toBe('alpha');
  });
});

describe('library', () => {
  it('rejects borrowing a missing book', () => {
    expect(store.borrowBook('nope', 's1', 'Siti', '2026-01-01', '2026-01-08').ok).toBe(false);
  });

  it('creates a pending loan without changing availability', () => {
    const before = store.getBooks().find((b) => b.id === 'b1')?.available;
    const res = store.borrowBook('b1', 's1', 'Siti', '2026-01-01', '2026-01-08');
    expect(res.ok).toBe(true);
    expect(store.getBooks().find((b) => b.id === 'b1')?.available).toBe(before);
    expect(store.getLibraryTransactions().some((t) => t.status === 'menunggu')).toBe(true);
  });

  it('approves a pending loan and decrements availability', () => {
    store.borrowBook('b1', 's1', 'Siti', '2026-01-01', '2026-01-08');
    const tx = store.getLibraryTransactions().find((t) => t.status === 'menunggu')!;
    const before = store.getBooks().find((b) => b.id === 'b1')!.available;

    const res = store.approveLibraryLoan(tx.id);
    expect(res.ok).toBe(true);
    expect(store.getBooks().find((b) => b.id === 'b1')!.available).toBe(before - 1);
    expect(store.getLibraryTransactions().find((t) => t.id === tx.id)?.status).toBe('dipinjam');
  });

  it('does not approve a loan twice', () => {
    store.borrowBook('b1', 's1', 'Siti', '2026-01-01', '2026-01-08');
    const tx = store.getLibraryTransactions().find((t) => t.status === 'menunggu')!;
    store.approveLibraryLoan(tx.id);
    expect(store.approveLibraryLoan(tx.id).ok).toBe(false);
  });

  it('rejects a pending loan with a note', () => {
    store.borrowBook('b1', 's1', 'Siti', '2026-01-01', '2026-01-08');
    const tx = store.getLibraryTransactions().find((t) => t.status === 'menunggu')!;
    const res = store.rejectLibraryLoan(tx.id, 'stok terbatas');
    expect(res.ok).toBe(true);
    const updated = store.getLibraryTransactions().find((t) => t.id === tx.id);
    expect(updated?.status).toBe('ditolak');
    expect(updated?.note).toBe('stok terbatas');
  });

  it('returns a book and restores availability', () => {
    store.borrowBook('b1', 's1', 'Siti', '2026-01-01', '2026-01-08');
    const tx = store.getLibraryTransactions().find((t) => t.status === 'menunggu')!;
    store.approveLibraryLoan(tx.id);
    const afterBorrow = store.getBooks().find((b) => b.id === 'b1')!.available;

    const res = store.returnBook(tx.id, '2026-01-05');
    expect(res.ok).toBe(true);
    expect(store.getBooks().find((b) => b.id === 'b1')!.available).toBe(afterBorrow + 1);
    expect(store.getLibraryTransactions().find((t) => t.id === tx.id)?.status).toBe('dikembalikan');
  });

  it('adds, updates and deletes books', () => {
    store.addOrUpdateBook({
      id: 'bx',
      title: 'Judul',
      author: 'A',
      category: 'C',
      publisher: 'P',
      rack: 'Z',
      stock: 2,
      available: 2,
    });
    expect(store.getBooks().some((b) => b.id === 'bx')).toBe(true);

    store.addOrUpdateBook({
      id: 'bx',
      title: 'Judul Baru',
      author: 'A',
      category: 'C',
      publisher: 'P',
      rack: 'Z',
      stock: 2,
      available: 2,
    });
    expect(store.getBooks().find((b) => b.id === 'bx')?.title).toBe('Judul Baru');

    store.deleteBook('bx');
    expect(store.getBooks().some((b) => b.id === 'bx')).toBe(false);
  });
});

describe('PPDB applications', () => {
  it('creates an application with a generated registration number and notification', () => {
    const created = store.submitPPDBApplication(buildApplicationInput());
    expect(created.status).toBe('PENDING');
    expect(created.registrationNo).toMatch(/^PPDB-\d{2}-[A-Z]+-\d{6}$/);
    expect(store.getPPDBApplications()).toHaveLength(1);
    expect(store.getUnreadNotificationCount()).toBe(1);
    expect(store.getPPDBAuditLogs()[0].action).toBe('SUBMIT_APPLICATION');
  });

  it('increments the registration sequence for each application', () => {
    const first = store.submitPPDBApplication(buildApplicationInput());
    const second = store.submitPPDBApplication(buildApplicationInput());
    const seq = (regNo: string) => Number(regNo.slice(-6));
    expect(seq(second.registrationNo)).toBe(seq(first.registrationNo) + 1);
  });

  it('finds applications by id and registration number', () => {
    const created = store.submitPPDBApplication(buildApplicationInput());
    expect(store.getPPDBApplicationById(created.id)?.id).toBe(created.id);
    expect(store.getPPDBApplicationByRegNo(created.registrationNo)?.id).toBe(created.id);
    expect(store.getPPDBApplicationById('missing')).toBeNull();
    expect(store.getPPDBApplicationByRegNo('missing')).toBeNull();
  });

  it('updates status and returns null for a missing application', async () => {
    const created = store.submitPPDBApplication(buildApplicationInput());
    const updated = await store.updateApplicationStatus(created.id, 'VERIFIED', 'ok', 'Admin');
    expect(updated?.status).toBe('VERIFIED');
    expect(updated?.verifiedBy).toBe('Admin');
    expect(await store.updateApplicationStatus('missing', 'VERIFIED')).toBeNull();
  });

  it('enrolls a student when the application is accepted', async () => {
    const created = store.submitPPDBApplication(
      buildApplicationInput({
        namaLengkap: 'Diterima',
        nisn: '1234509876',
        jenisKelamin: 'Perempuan',
      })
    );
    const beforeCount = store.getStudents().length;
    await store.updateApplicationStatus(created.id, 'ACCEPTED');
    const students = store.getStudents();
    expect(students.length).toBe(beforeCount + 1);
    const added = students.find((s) => s.nis === '1234509876');
    expect(added?.name).toBe('Diterima');
    expect(added?.gender).toBe('P');
  });

  it('updates document validation state', () => {
    const created = store.submitPPDBApplication(buildApplicationInput());
    const updated = store.updateDocumentValidation(created.id, 'ijazah', 'VALID');
    expect(updated?.documentValidation?.ijazah).toBe('VALID');
    expect(store.updateDocumentValidation('missing', 'ijazah', 'VALID')).toBeNull();
  });

  it('deletes an application and reports whether it existed', () => {
    const created = store.submitPPDBApplication(buildApplicationInput());
    expect(store.deletePPDBApplication(created.id)).toBe(true);
    expect(store.getPPDBApplications()).toHaveLength(0);
    expect(store.deletePPDBApplication(created.id)).toBe(false);
  });

  it('aggregates statistics by status, jenjang and jalur', async () => {
    store.submitPPDBApplication(
      buildApplicationInput({ jenjangTujuan: 'SMA', jalurPendaftaran: 'REGULER' })
    );
    const b = store.submitPPDBApplication(
      buildApplicationInput({ jenjangTujuan: 'SMK', jalurPendaftaran: 'ZONASI' })
    );
    await store.updateApplicationStatus(b.id, 'REJECTED');

    const stats = store.getPPDBStatistics();
    expect(stats.total).toBe(2);
    expect(stats.pending).toBe(1);
    expect(stats.rejected).toBe(1);
    expect(stats.byJenjang.SMA).toBe(1);
    expect(stats.byJenjang.SMK).toBe(1);
    expect(stats.byJalur.REGULER).toBe(1);
    expect(stats.byJalur.ZONASI).toBe(1);
  });

  it('round-trips a backup through export and import', () => {
    store.submitPPDBApplication(buildApplicationInput());
    const created = store.getPPDBApplications()[0];
    const backup = store.exportPPDBBackupJson();

    store.deletePPDBApplication(created.id);
    expect(store.getPPDBApplications()).toHaveLength(0);

    const result = store.importPPDBBackupJson(backup);
    expect(result.ok).toBe(true);
    expect(store.getPPDBApplications()).toHaveLength(1);
  });

  it('rejects malformed backup input', () => {
    expect(store.importPPDBBackupJson('not json').ok).toBe(false);
    expect(store.importPPDBBackupJson('{"applications":"nope"}').ok).toBe(false);
  });
});

describe('PPDB notifications', () => {
  it('marks a notification as read and updates the unread count', () => {
    store.submitPPDBApplication(buildApplicationInput());
    const notif = store.getPPDBNotifications()[0];
    expect(store.getUnreadNotificationCount()).toBe(1);
    store.markNotificationAsRead(notif.id);
    expect(store.getUnreadNotificationCount()).toBe(0);
  });
});

describe('admin authentication', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_ADMIN_PIN', '26012026');
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('logs in with the correct pin and creates a session', () => {
    expect(store.isAdminAuthenticated()).toBe(false);
    expect(store.adminLogin('admin', '26012026')).toBe(true);
    expect(store.isAdminAuthenticated()).toBe(true);
    expect(store.getAdminProfileName()).toBe('admin');
  });

  it('rejects an empty username or wrong pin', () => {
    expect(store.adminLogin('', '26012026')).toBe(false);
    expect(store.adminLogin('admin', 'wrong')).toBe(false);
    expect(store.isAdminAuthenticated()).toBe(false);
  });

  it('refuses to authenticate when no PIN is configured', () => {
    vi.stubEnv('VITE_ADMIN_PIN', '');
    expect(store.adminLogin('admin', '26012026')).toBe(false);
    expect(store.isAdminAuthenticated()).toBe(false);
    vi.stubEnv('VITE_ADMIN_PIN', '26012026');
  });

  it('locks the account after the maximum failed attempts', () => {
    for (let i = 0; i < 5; i += 1) {
      store.adminLogin('admin', 'wrong');
    }
    expect(store.getAdminSecurityState().isLocked).toBe(true);
    expect(store.adminLogin('admin', '26012026')).toBe(false);
  });

  it('logs out by clearing the session', () => {
    store.adminLogin('admin', '26012026');
    store.adminLogout();
    expect(store.isAdminAuthenticated()).toBe(false);
    expect(store.getAdminProfileName()).toBe('Admin PPDB');
  });

  it('treats an expired session as unauthenticated', () => {
    store.adminLogin('admin', '26012026');
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 1000 * 60 * 60 * 24);
    expect(store.isAdminAuthenticated()).toBe(false);
    vi.useRealTimers();
  });
});

describe('school fees (tagihan)', () => {
  it('generates 12 monthly bills per student and clamps the due day', () => {
    store.terapkanTagihanTahunanUntukSemuaSiswa(2026, 300000, 40, 'admin');
    const bills = store.getTagihanSekolahBySiswa('s1', 2026);
    expect(bills).toHaveLength(12);
    expect(bills[0].amount).toBe(300000);
    expect(bills[0].dueDate.endsWith('-28')).toBe(true);
    expect(store.getPengaturanTagihan().dueDay).toBe(28);
  });

  it('marks a bill as paid', () => {
    store.terapkanTagihanTahunanUntukSemuaSiswa(2026, 300000, 10, 'admin');
    const bill = store.getTagihanSekolahBySiswa('s1', 2026)[0];
    store.bayarTagihanSekolah(bill.id, 'transfer');
    const updated = store.getTagihanSekolahBySiswa('s1', 2026).find((b) => b.id === bill.id);
    expect(updated?.status).toBe('lunas');
    expect(updated?.paymentMethod).toBe('transfer');
  });

  it('lists the years with bills for a student, newest first', () => {
    store.terapkanTagihanTahunanUntukSemuaSiswa(2025, 100000, 10, 'admin');
    store.terapkanTagihanTahunanUntukSemuaSiswa(2026, 100000, 10, 'admin');
    expect(store.getTahunTagihanSiswa('s1')).toEqual([2026, 2025]);
  });
});

describe('report cards (rapot)', () => {
  const nilai = {
    id: 'n1',
    studentId: 's1',
    classId: 'c1',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    mataPelajaran: 'Matematika',
    nilaiHarian: 80,
    nilaiUTS: 78,
    nilaiUAS: 85,
    nilaiAkhir: 81,
    inputBy: 't1',
    updatedAt: Date.now(),
  };

  it('upserts and filters grades by student and class', () => {
    store.upsertNilaiRapot(nilai);
    expect(store.getNilaiRapotBySiswa('s1')).toHaveLength(1);
    expect(store.getNilaiRapotBySiswa('s1', '2025/2026', 'Ganjil')).toHaveLength(1);
    expect(store.getNilaiRapotBySiswa('s1', '2024/2025')).toHaveLength(0);
    expect(store.getNilaiRapotByKelas('c1')).toHaveLength(1);

    store.upsertNilaiRapot({ ...nilai, nilaiAkhir: 90 });
    expect(store.getNilaiRapot()).toHaveLength(1);
    expect(store.getNilaiRapotBySiswa('s1')[0].nilaiAkhir).toBe(90);
  });

  it('lists distinct school years newest first and deletes grades', () => {
    store.upsertNilaiRapot(nilai);
    store.upsertNilaiRapot({ ...nilai, id: 'n2', tahunAjaran: '2024/2025' });
    expect(store.getTahunAjaranRapotSiswa('s1')).toEqual(['2025/2026', '2024/2025']);

    store.deleteNilaiRapot('n1');
    expect(store.getNilaiRapot().some((n) => n.id === 'n1')).toBe(false);
  });
});

describe('permission letters (surat izin)', () => {
  it('stores, filters and updates the status of letters', () => {
    store.addSuratIzin({
      id: 'si1',
      studentId: 's1',
      classId: 'c1',
      type: 'izin',
      subject: 'Acara keluarga',
      message: 'Mohon izin',
      letterDate: '2026-01-01',
      status: 'menunggu',
      createdAt: 1,
    });
    expect(store.getSuratIzinByStudent('s1')).toHaveLength(1);

    store.updateStatusSuratIzin('si1', 'disetujui');
    expect(store.getSuratIzin()[0].status).toBe('disetujui');
  });
});

describe('assignment submissions', () => {
  it('upserts submissions keyed by assignment + student', () => {
    store.upsertAssignmentSubmission({
      id: 'sub1',
      assignmentId: 'as1',
      studentId: 's1',
      answerText: 'jawaban',
      submittedAt: 1,
    });
    expect(store.getSubmissionsByAssignment('as1')).toHaveLength(1);
    expect(store.getSubmissionByAssignmentAndStudent('as1', 's1')?.id).toBe('sub1');

    store.upsertAssignmentSubmission({
      id: 'sub1',
      assignmentId: 'as1',
      studentId: 's1',
      answerText: 'revisi',
      submittedAt: 2,
    });
    expect(store.getSubmissionsByAssignment('as1')).toHaveLength(1);
    expect(store.getSubmissionByAssignmentAndStudent('as1', 's1')?.answerText).toBe('revisi');
    expect(store.getSubmissionByAssignmentAndStudent('as1', 'nobody')).toBeNull();
  });
});

describe('class rosters, announcements and assignments', () => {
  it('adds and deletes rosters scoped by class', () => {
    store.addClassRoster({
      id: 'r1',
      classId: 'c1',
      subject: 'Matematika',
      dayOfWeek: 1,
      startTime: '07:00',
      endTime: '08:30',
      teacherName: 'Andi',
      updatedBy: 't1',
      updatedAt: 1,
    });
    expect(store.getClassRosters('c1')).toHaveLength(1);
    expect(store.getClassRosters('c2')).toHaveLength(0);
    store.deleteClassRoster('r1');
    expect(store.getClassRosters('c1')).toHaveLength(0);
  });

  it('adds and deletes class announcements', () => {
    store.addClassAnnouncement({
      id: 'ca1',
      classId: 'c1',
      title: 'Info',
      content: 'Isi',
      createdBy: 't1',
      createdAt: Date.now(),
    });
    expect(store.getClassAnnouncements('c1')).toHaveLength(1);
    store.deleteClassAnnouncement('ca1');
    expect(store.getClassAnnouncements('c1')).toHaveLength(0);
  });

  it('adds and deletes online assignments', () => {
    store.addOnlineAssignment({
      id: 'oa1',
      classId: 'c2',
      title: 'Tugas',
      description: 'Deskripsi tugas',
      dueDate: '2026-01-10',
      createdBy: 't2',
      createdAt: Date.now(),
    });
    expect(store.getOnlineAssignmentsByClass('c2')).toHaveLength(1);
    store.deleteOnlineAssignment('oa1');
    expect(store.getOnlineAssignmentsByClass('c2')).toHaveLength(0);
  });

  it('updates an existing online assignment without changing its id', () => {
    store.addOnlineAssignment({
      id: 'oa1',
      classId: 'c2',
      title: 'Tugas',
      description: 'Deskripsi tugas',
      dueDate: '2026-01-10',
      createdBy: 't2',
      createdAt: 1,
    });
    store.updateOnlineAssignment({
      id: 'oa1',
      classId: 'c2',
      title: 'Tugas Revisi',
      description: 'Deskripsi baru',
      dueDate: '2026-01-15',
      createdBy: 't2',
      createdAt: 1,
      summary: 'Ringkasan baru',
      books: [{ title: 'Buku X', author: 'Penulis' }],
      videos: [{ title: 'Video Y', url: 'https://youtube.com/watch?v=abc' }],
      exercises: [{ question: 'Soal 1', options: ['A', 'B'], correctIndex: 1 }],
    });
    const updated = store.getOnlineAssignmentsByClass('c2');
    expect(updated).toHaveLength(1);
    expect(updated[0].id).toBe('oa1');
    expect(updated[0].title).toBe('Tugas Revisi');
    expect(updated[0].summary).toBe('Ringkasan baru');
    expect(updated[0].books?.[0].title).toBe('Buku X');
    expect(updated[0].videos?.[0].url).toBe('https://youtube.com/watch?v=abc');
    expect(updated[0].exercises?.[0].correctIndex).toBe(1);
  });
});

describe('assignment discussions', () => {
  it('adds and retrieves discussions scoped by assignment (ascending order)', () => {
    store.addAssignmentDiscussion({
      id: 'd1',
      assignmentId: 'as1',
      authorId: 's1',
      authorName: 'Budi',
      role: 'student',
      message: 'Pertanyaan pertama',
      createdAt: 1,
    });
    store.addAssignmentDiscussion({
      id: 'd2',
      assignmentId: 'as1',
      authorId: 't1',
      authorName: 'Pak Andi',
      role: 'teacher',
      message: 'Jawaban',
      createdAt: 3,
    });
    store.addAssignmentDiscussion({
      id: 'd3',
      assignmentId: 'as2',
      authorId: 's1',
      authorName: 'Budi',
      role: 'student',
      message: 'Tugas lain',
      createdAt: 2,
    });
    const as1 = store.getDiscussionsByAssignment('as1');
    expect(as1).toHaveLength(2);
    expect(as1[0].id).toBe('d1');
    expect(as1[1].id).toBe('d2');
    expect(store.getDiscussionsByAssignment('as2')).toHaveLength(1);
  });

  it('edits and deletes a forum discussion, and supports attachments', () => {
    store.addAssignmentDiscussion({
      id: 'dEdit',
      assignmentId: 'as1',
      authorId: 's1',
      authorName: 'Budi',
      role: 'student',
      message: 'Pertanyaan',
      createdAt: 1,
      attachment: {
        name: 'tugas.pdf',
        type: 'application/pdf',
        dataUrl: 'data:application/pdf;base64,xxx',
        size: 1234,
      },
    });
    store.editAssignmentDiscussion('dEdit', 'Pertanyaan diperbarui');
    let list = store.getDiscussionsByAssignment('as1');
    expect(list.find((d) => d.id === 'dEdit')?.message).toBe('Pertanyaan diperbarui');
    expect(list.find((d) => d.id === 'dEdit')?.attachment?.name).toBe('tugas.pdf');

    store.deleteAssignmentDiscussion('dEdit');
    list = store.getDiscussionsByAssignment('as1');
    expect(list.find((d) => d.id === 'dEdit')).toBeUndefined();
  });
});

describe('private messages (chat 1-1)', () => {
  it('adds and retrieves messages between two users (ascending order)', () => {
    store.addPrivateMessage({
      id: 'p1',
      senderId: 's1',
      receiverId: 't1',
      authorName: 'Budi',
      role: 'student',
      message: 'Halo Pak',
      createdAt: 1,
    });
    store.addPrivateMessage({
      id: 'p2',
      senderId: 't1',
      receiverId: 's1',
      authorName: 'Pak Andi',
      role: 'teacher',
      message: 'Hai Budi',
      createdAt: 2,
    });
    store.addPrivateMessage({
      id: 'p3',
      senderId: 's2',
      receiverId: 't1',
      authorName: 'Siti',
      role: 'student',
      message: 'Chat lain',
      createdAt: 3,
    });
    expect(store.getPrivateMessages('s1', 't1')).toHaveLength(2);
    expect(store.getPrivateMessages('s1', 't1')[0].id).toBe('p1');
    expect(store.getPrivateMessages('s1', 't1')[1].id).toBe('p2');
    expect(store.getPrivateMessages('s1', 's2')).toHaveLength(0);
  });

  it('edits and deletes a private message', () => {
    store.addPrivateMessage({
      id: 'pEdit',
      senderId: 's1',
      receiverId: 't1',
      authorName: 'Budi',
      role: 'student',
      message: 'Asli',
      createdAt: 1,
    });
    store.editPrivateMessage('pEdit', 'Suntingan');
    expect(store.getPrivateMessages('s1', 't1')[0].message).toBe('Suntingan');

    store.deletePrivateMessage('pEdit');
    expect(store.getPrivateMessages('s1', 't1')).toHaveLength(0);
  });

  it('counts unread private messages and marks a chat read', () => {
    const a = 'sUn';
    const b = 'tUn';
    store.addPrivateMessage({
      id: 'pu1',
      senderId: b,
      receiverId: a,
      authorName: 'Guru',
      role: 'teacher',
      message: 'A',
      createdAt: 100,
    });
    store.addPrivateMessage({
      id: 'pu2',
      senderId: b,
      receiverId: a,
      authorName: 'Guru',
      role: 'teacher',
      message: 'B',
      createdAt: 200,
    });
    expect(store.getUnreadPrivateCount(a, b)).toBe(2);
    store.markScopeRead(`private:${a}|${b}`, a);
    expect(store.getUnreadPrivateCount(a, b)).toBe(0);
  });
});

describe('chat groups and presence', () => {
  it('adds and scopes chat groups by class', () => {
    store.addChatGroup({
      id: 'cg1',
      classId: 'x1',
      name: 'Grup A',
      memberIds: ['s1'],
      createdBy: 't1',
      createdAt: 1,
    });
    store.addChatGroup({
      id: 'cg2',
      classId: 'x2',
      name: 'Grup B',
      memberIds: [],
      createdBy: 't2',
      createdAt: 2,
    });
    expect(store.getChatGroupsByClass('x1')).toHaveLength(1);
    expect(store.getChatGroupsByClass('x1')[0].id).toBe('cg1');
    expect(store.getChatGroupsByClass('x2')).toHaveLength(1);
  });

  it('adds and removes group members', () => {
    store.addChatGroup({
      id: 'cgX',
      classId: 'x9',
      name: 'Grup A',
      memberIds: [],
      createdBy: 't1',
      createdAt: 1,
    });
    store.addGroupMember('cgX', 's1');
    store.addGroupMember('cgX', 's2');
    expect(store.getChatGroupsByClass('x9')[0].memberIds).toEqual(['s1', 's2']);
    store.removeGroupMember('cgX', 's1');
    expect(store.getChatGroupsByClass('x9')[0].memberIds).toEqual(['s2']);
  });

  it('adds group messages scoped by group (ascending order)', () => {
    store.addGroupMessage({
      id: 'gm1',
      groupId: 'cg1',
      authorId: 's1',
      authorName: 'Budi',
      role: 'student',
      message: 'Halo',
      createdAt: 1,
    });
    store.addGroupMessage({
      id: 'gm2',
      groupId: 'cg1',
      authorId: 't1',
      authorName: 'Pak Andi',
      role: 'teacher',
      message: 'Hai',
      createdAt: 2,
    });
    store.addGroupMessage({
      id: 'gm3',
      groupId: 'cg2',
      authorId: 's1',
      authorName: 'Budi',
      role: 'student',
      message: 'Grup lain',
      createdAt: 3,
    });
    expect(store.getGroupMessages('cg1')).toHaveLength(2);
    expect(store.getGroupMessages('cg1')[0].id).toBe('gm1');
    expect(store.getGroupMessages('cg2')).toHaveLength(1);
  });

  it('deletes a group and its messages', () => {
    store.addChatGroup({
      id: 'cgY',
      classId: 'y1',
      name: 'Grup A',
      memberIds: ['s1'],
      createdBy: 't1',
      createdAt: 1,
    });
    store.addGroupMessage({
      id: 'gmY',
      groupId: 'cgY',
      authorId: 's1',
      authorName: 'Budi',
      role: 'student',
      message: 'Halo',
      createdAt: 1,
    });
    store.deleteChatGroup('cgY');
    expect(store.getChatGroupsByClass('y1')).toHaveLength(0);
    expect(store.getGroupMessages('cgY')).toHaveLength(0);
  });

  it('edits and deletes a group message, and supports attachments', () => {
    store.addChatGroup({
      id: 'cgE',
      classId: 'e1',
      name: 'Grup',
      memberIds: [],
      createdBy: 't1',
      createdAt: 1,
    });
    store.addGroupMessage({
      id: 'gmE',
      groupId: 'cgE',
      authorId: 's1',
      authorName: 'Budi',
      role: 'student',
      message: 'Asli',
      createdAt: 1,
      attachment: {
        name: 'foto.png',
        type: 'image/png',
        dataUrl: 'data:image/png;base64,xxx',
        size: 500,
      },
    });
    store.editGroupMessage('gmE', 'Suntingan');
    const list = store.getGroupMessages('cgE');
    expect(list[0].message).toBe('Suntingan');
    expect(list[0].attachment?.name).toBe('foto.png');

    store.deleteGroupMessage('gmE');
    expect(store.getGroupMessages('cgE')).toHaveLength(0);
  });

  it('tracks online presence with a freshness window', () => {
    expect(store.isStudentOnline('presence-unknown')).toBe(false);
    store.touchPresence('presence-unknown');
    expect(store.isStudentOnline('presence-unknown')).toBe(true);
  });

  it('counts unread messages per scope and marks a scope read', () => {
    const groupId = 'cgU';
    store.addChatGroup({
      id: groupId,
      classId: 'xU',
      name: 'Grup',
      memberIds: [],
      createdBy: 't1',
      createdAt: 1,
    });
    store.addGroupMessage({
      id: 'gu1',
      groupId,
      authorId: 't1',
      authorName: 'Guru',
      role: 'teacher',
      message: 'A',
      createdAt: 100,
    });
    store.addGroupMessage({
      id: 'gu2',
      groupId,
      authorId: 's1',
      authorName: 'Budi',
      role: 'student',
      message: 'B',
      createdAt: 200,
    });

    const messages = store.getGroupMessages(groupId);
    expect(store.getUnreadCountForScope(`group:${groupId}`, 's2', messages)).toBe(2);
    expect(store.getUnreadCountForScope(`group:${groupId}`, 's1', messages)).toBe(1);

    store.markScopeRead(`group:${groupId}`, 's2');
    expect(store.getUnreadCountForScope(`group:${groupId}`, 's2', messages)).toBe(0);
  });

  it('returns the last-read timestamp for a scope (0 if never read)', () => {
    const groupId = 'cgT';
    store.addChatGroup({
      id: groupId,
      classId: 'XII-A',
      name: 'Grup Test',
      memberIds: ['s1', 's2'],
      createdBy: 't1',
      createdAt: 1,
    });
    expect(store.getScopeLastRead(`group:${groupId}`, 's2')).toBe(0);

    const before = Date.now() - 1;
    store.markScopeRead(`group:${groupId}`, 's2');
    const after = Date.now() + 1;
    const lastRead = store.getScopeLastRead(`group:${groupId}`, 's2');
    expect(lastRead).toBeGreaterThanOrEqual(before);
    expect(lastRead).toBeLessThanOrEqual(after);
    expect(store.getScopeLastRead(`group:${groupId}`, 's1')).toBe(0);
  });

  it('heartbeats presence silently without notifying store', () => {
    const listener = vi.fn();
    const unsubscribe = store.subscribeStore(listener);
    store.touchPresenceSilent('silent-user');
    expect(store.isStudentOnline('silent-user')).toBe(true);
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it('tracks who is typing per scope and expires after the window', () => {
    store.setTyping('forum:a1', 's1', 'Budi', 'student');
    store.setTyping('forum:a1', 't1', 'Pak Andi', 'teacher');
    store.setTyping('group:g1', 's1', 'Budi', 'student');

    expect(store.getTypingUsers('forum:a1', 's1')).toEqual([
      expect.objectContaining({ userId: 't1', name: 'Pak Andi', role: 'teacher' }),
    ]);
    expect(store.getTypingUsers('forum:a1', 't1')).toEqual([
      expect.objectContaining({ userId: 's1', name: 'Budi', role: 'student' }),
    ]);
    expect(store.getTypingUsers('forum:a1', 'x')).toHaveLength(2);
    expect(store.getTypingUsers('group:g1', 's1')).toHaveLength(0);

    store.clearTyping('forum:a1', 't1');
    expect(store.getTypingUsers('forum:a1', 'x')).toEqual([
      expect.objectContaining({ userId: 's1' }),
    ]);
  });
});

describe('assignment quiz results', () => {
  it('saves and retrieves quiz result keyed by assignment + student', () => {
    expect(store.getQuizResult('as1', 's1')).toBeNull();
    store.saveQuizResult({
      assignmentId: 'as1',
      studentId: 's1',
      answers: [1, 0],
      score: 2,
      total: 2,
      submittedAt: 1,
    });
    const result = store.getQuizResult('as1', 's1');
    expect(result?.score).toBe(2);
    expect(result?.answers).toEqual([1, 0]);
    store.saveQuizResult({
      assignmentId: 'as1',
      studentId: 's1',
      answers: [0, 0],
      score: 1,
      total: 2,
      submittedAt: 2,
    });
    expect(store.getQuizResult('as1', 's1')?.score).toBe(1);
    expect(store.getQuizResult('as1', 's2')).toBeNull();
  });
});

describe('messages and tasks', () => {
  it('returns messages targeted at the role or everyone', () => {
    const forStudent = store.getMessagesForRole('student');
    expect(forStudent.every((m) => m.receiverRole === 'student' || m.receiverRole === 'all')).toBe(
      true
    );
  });

  it('prepends new messages and tasks', () => {
    store.addMessage('Guru', 'student', 'Subjek', 'Konten');
    expect(store.getMessagesForRole('student')[0].subject).toBe('Subjek');

    store.addTask('Tugas Baru', 'Matematika', '2026-02-01');
    const tasks = store.getTasks();
    expect(tasks[0].title).toBe('Tugas Baru');
    expect(tasks[0].status).toBe('Aktif');
  });
});

describe('admin announcements (pengumuman admin)', () => {
  it('targets classes or everyone correctly', () => {
    store.addPengumumanAdmin({
      id: 'pa-all',
      title: 'Semua',
      message: 'untuk semua',
      targetScope: 'all',
      targetClassIds: [],
      createdAt: 1,
      createdBy: 'admin',
    });
    store.addPengumumanAdmin({
      id: 'pa-c2',
      title: 'Kelas C2',
      message: 'khusus c2',
      targetScope: 'classes',
      targetClassIds: ['c2'],
      createdAt: 2,
      createdBy: 'admin',
    });

    expect(store.getPengumumanAdmin()).toHaveLength(2);
    expect(store.getPengumumanAdmin()[0].id).toBe('pa-c2');

    const forC1 = store.getPengumumanAdminUntukKelas('c1');
    expect(forC1.map((p) => p.id)).toContain('pa-all');
    expect(forC1.map((p) => p.id)).not.toContain('pa-c2');

    const forGuru = store.getPengumumanAdminUntukGuru(['c2']);
    expect(forGuru.map((p) => p.id).sort()).toEqual(['pa-all', 'pa-c2']);
  });

  it('deletes an announcement and can strip all photos', () => {
    store.addPengumumanAdmin({
      id: 'pa1',
      title: 'Foto',
      message: 'dengan foto',
      targetScope: 'all',
      targetClassIds: [],
      createdAt: 1,
      createdBy: 'admin',
      imageDataUrl: 'data:image/png;base64,xxx',
      imageName: 'foto.png',
    });

    const removed = store.hapusSemuaFotoPengumumanAdmin();
    expect(removed).toBe(1);
    expect(store.getPengumumanAdmin()[0].imageDataUrl).toBeUndefined();

    store.deletePengumumanAdmin('pa1');
    expect(store.getPengumumanAdmin()).toHaveLength(0);
  });
});

describe('RPS documents and lesson notes', () => {
  it('creates then updates an RPS document keyed by teacher/class/subject', () => {
    store.saveRpsDocument({
      id: '',
      teacherId: 't1',
      classId: 'c1',
      className: 'X IPA 1',
      subject: 'Matematika',
      programStudi: 'IPA',
      fakultas: '-',
      sks: '2',
      rows: [],
      updatedAt: 0,
    });
    const doc = store.getRpsDocument('t1', 'c1', 'Matematika');
    expect(doc).not.toBeNull();
    expect(doc?.id).toBeTruthy();

    store.saveRpsDocument({ ...doc!, sks: '4' });
    expect(store.getRpsDocument('t1', 'c1', 'Matematika')?.sks).toBe('4');
    expect(store.getRpsDocument('t1', 'c1', 'Fisika')).toBeNull();
  });

  it('upserts teacher lesson notes keyed by teacher/class/subject/date', () => {
    store.upsertTeacherLessonNote({
      teacherId: 't1',
      classId: 'c1',
      subject: 'Matematika',
      date: '2026-01-01',
      materi: 'Aljabar',
      adaPr: false,
    });
    expect(store.getTeacherLessonNotes('t1', 'c1', 'Matematika')).toHaveLength(1);

    store.upsertTeacherLessonNote({
      teacherId: 't1',
      classId: 'c1',
      subject: 'Matematika',
      date: '2026-01-01',
      materi: 'Aljabar Lanjutan',
      adaPr: true,
    });
    const notes = store.getTeacherLessonNotes('t1', 'c1', 'Matematika');
    expect(notes).toHaveLength(1);
    expect(notes[0].materi).toBe('Aljabar Lanjutan');
    expect(notes[0].adaPr).toBe(true);
  });
});

describe('admin settings and guest config', () => {
  it('reads and updates the admin email', () => {
    expect(store.getAdminSettings().email).toBe('admin@sekolah.id');
    store.updateAdminSettings({ email: 'baru@sekolah.id' });
    expect(store.getAdminSettings().email).toBe('baru@sekolah.id');
  });

  it('reads and updates the guest config', () => {
    const next = {
      accessCode: 'KODE',
      allowEmailLogin: false,
      updatedAt: Date.now(),
      updatedBy: 'admin',
    };
    store.updateGuestConfig(next);
    expect(store.getGuestConfig().accessCode).toBe('KODE');
    expect(store.getGuestConfig().allowEmailLogin).toBe(false);
  });
});

describe('storage summary and subscriptions', () => {
  it('reports used and remaining bytes', () => {
    localStorage.setItem('x', 'y');
    const summary = store.getStorageSummary();
    expect(summary.usedBytes).toBeGreaterThan(0);
    expect(summary.remainingBytes).toBe(summary.limitBytes - summary.usedBytes);
    expect(summary.usedPercent).toBeGreaterThanOrEqual(0);
  });

  it('notifies subscribers when the store changes', async () => {
    const listener = vi.fn();
    const unsubscribe = store.subscribeStore(listener);
    store.addTask('T', 'S', '2026-01-01');
    // Sejak refactor performa, notifikasi di-coalesce per frame (rAF) —
    // beberapa writeDB cepat → satu event. Tunggu satu frame.
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    expect(listener).toHaveBeenCalled();
    unsubscribe();

    listener.mockClear();
    store.addTask('T2', 'S', '2026-01-01');
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('generateStudentNis', () => {
  it('generates an incrementing NIS based on current year and max serial', () => {
    const year = new Date().getFullYear();
    const result = store.generateStudentNis([
      { id: 's1', name: 'A', nis: `${year}001`, classId: 'c1', gender: 'L', password: '' },
      { id: 's2', name: 'B', nis: `${year}007`, classId: 'c1', gender: 'P', password: '' },
    ]);
    expect(result).toBe(`${year}008`);
  });

  it('falls back to 001 when no serial can be parsed', () => {
    const year = new Date().getFullYear();
    const result = store.generateStudentNis([]);
    expect(result).toBe(`${year}001`);
  });
});
