import { create } from 'zustand';
import * as s from './index';

interface TeacherState {
  teachers: s.Teacher[];
  load: () => void;
}

export const useTeacherStore = create<TeacherState>((set) => ({
  teachers: [],
  load: () => set({ teachers: s.getTeachers() }),
}));

interface StudentState {
  students: s.Student[];
  load: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  load: () => set({ students: s.getStudents() }),
}));

interface AttendanceState {
  records: s.AttendanceRecord[];
  load: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  records: [],
  load: () => set({ records: s.getAttendance() }),
}));

interface PPDBState {
  applications: s.PPDBApplication[];
  notifications: s.PPDBNotification[];
  load: () => void;
}

export const usePPDBStore = create<PPDBState>((set) => ({
  applications: [],
  notifications: [],
  load: () =>
    set({
      applications: s.getPPDBApplications(),
      notifications: s.getPPDBNotifications(),
    }),
}));

interface LibraryState {
  books: s.Book[];
  transactions: s.LibraryTransaction[];
  load: () => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  books: [],
  transactions: [],
  load: () =>
    set({
      books: s.getBooks(),
      transactions: s.getLibraryTransactions(),
    }),
}));

interface AnnouncementState {
  announcements: s.Announcement[];
  load: () => void;
}

export const useAnnouncementStore = create<AnnouncementState>((set) => ({
  announcements: [],
  load: () => set({ announcements: s.getSchoolAnnouncements() }),
}));

interface BillingState {
  bills: s.Bill[];
  tagihan: s.TagihanSekolah[];
  load: (studentId?: string) => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  bills: [],
  tagihan: [],
  load: (studentId) =>
    set({
      bills: s.getBills(),
      tagihan: studentId ? s.getTagihanSekolahBySiswa(studentId, new Date().getFullYear()) : [],
    }),
}));

interface RapotState {
  nilai: s.NilaiRapot[];
  load: (studentId?: string) => void;
}

export const useRapotStore = create<RapotState>((set) => ({
  nilai: [],
  load: (studentId) =>
    set({
      nilai: studentId ? s.getNilaiRapotBySiswa(studentId) : s.getNilaiRapot(),
    }),
}));

interface MessageState {
  messages: s.Message[];
  load: (role: 'teacher' | 'student') => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  load: (role) => set({ messages: s.getMessagesForRole(role) }),
}));
