export { getTeachers, getTeacherList, saveTeachers, updateTeacher } from './teacherService';

export {
  getStudents,
  getStudentsByClass,
  addStudent,
  updateStudent,
  deleteStudent,
  saveStudents,
  getStudentClassMutations,
  addStudentClassMutation,
  getStudentStatusMutations,
  addStudentStatusMutation,
  setStudentStatus,
  generateStudentNis,
} from './studentService';

export { getClasses, saveClasses, setClassTeacherId } from './classService';

export {
  getAttendance,
  getAttendanceByDate,
  getAttendanceByDateRange,
  getAttendanceByStudent,
  saveAttendance,
  addAttendanceRecords,
  getAttendanceRecords,
} from './attendanceService';

export { getSchoolAnnouncements, addSchoolAnnouncement } from './announcementService';

export {
  getBooks,
  saveBooks,
  addOrUpdateBook,
  deleteBook,
  getLibraryMembers,
  saveLibraryMembers,
  getLibraryTransactions,
  saveLibraryTransactions,
  borrowBook,
  approveLibraryLoan,
  rejectLibraryLoan,
  returnBook,
} from './libraryService';

export {
  getPPDBApplications,
  getPPDBApplicationById,
  getPPDBApplicationByRegNo,
  submitPPDBApplication,
  updateApplicationStatus,
  updateDocumentValidation,
  deletePPDBApplication,
  exportPPDBBackupJson,
  importPPDBBackupJson,
  getPPDBStatistics,
  getPPDBNotifications,
  addPPDBNotification,
  getUnreadNotificationCount,
  markNotificationAsRead,
  getPPDBAuditLogs,
  adminLogin,
  isAdminAuthenticated,
  getAdminProfileName,
  getAdminSecurityState,
  adminLogout,
  getAdminSettings,
  updateAdminSettings,
  getGuestConfig,
  updateGuestConfig,
} from './ppdbService';

export {
  getClassRosters,
  addClassRoster,
  deleteClassRoster,
  getClassAnnouncements,
  addClassAnnouncement,
  deleteClassAnnouncement,
  getOnlineAssignmentsByClass,
  getAllOnlineAssignments,
  addOnlineAssignment,
  updateOnlineAssignment,
  deleteOnlineAssignment,
  getSubmissionsByAssignment,
  getSubmissionByAssignmentAndStudent,
  upsertAssignmentSubmission,
  getDiscussionsByAssignment,
  addAssignmentDiscussion,
  editAssignmentDiscussion,
  deleteAssignmentDiscussion,
  getQuizResult,
  saveQuizResult,
  getChatGroupsByClass,
  addChatGroup,
  deleteChatGroup,
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
  touchPresence,
  touchPresenceSilent,
  isStudentOnline,
  markScopeRead,
  getUnreadCountForScope,
  getScopeLastRead,
  setTyping,
  clearTyping,
  getTypingUsers,
} from './classActivityService';

export { getMessagesForRole, addMessage } from './messageService';

export { getTasks, addTask, getBills, getGrades, getSchedule } from './taskService';

export {
  getSuratIzin,
  getSuratIzinByStudent,
  addSuratIzin,
  updateStatusSuratIzin,
} from './suratIzinService';

export {
  getCatatanBK,
  getCatatanBKByStudent,
  addCatatanBK,
  deleteCatatanBK,
  getTotalPoinBK,
} from './bkService';

export {
  getEkskul,
  addEkskul,
  updateEkskul,
  deleteEkskul,
  getEkskulMembers,
  getEkskulMembersByEkskul,
  getAktifMemberCount,
  getEkskulByStudent,
  getEkskulTersedia,
  daftarEkskul,
  keluarEkskul,
  getEkskulKehadiran,
  getEkskulKehadiranByStudent,
  addEkskulKehadiran,
  deleteEkskulKehadiran,
} from './ekskulService';

export {
  getTahunAjaran,
  getTahunAjaranAktif,
  addTahunAjaran,
  updateTahunAjaran,
  deleteTahunAjaran,
  setTahunAjaranAktif,
  getMataPelajaran,
  addMataPelajaran,
  updateMataPelajaran,
  deleteMataPelajaran,
} from './akademikService';

export {
  getTagihanSekolahBySiswa,
  getTahunTagihanSiswa,
  bayarTagihanSekolah,
  getPengaturanTagihan,
  setPengaturanTagihan,
  terapkanTagihanTahunanUntukSemuaSiswa,
} from './billingService';

export {
  getNilaiRapot,
  getNilaiRapotBySiswa,
  getNilaiRapotByKelas,
  getTahunAjaranRapotSiswa,
  saveNilaiRapot,
  upsertNilaiRapot,
  deleteNilaiRapot,
} from './rapotService';

export {
  getPengumumanAdmin,
  getPengumumanAdminUntukKelas,
  getPengumumanAdminUntukGuru,
  addPengumumanAdmin,
  deletePengumumanAdmin,
  hapusSemuaFotoPengumumanAdmin,
} from './pengumumanAdminService';

export {
  getRpsDocument,
  saveRpsDocument,
  getTeacherLessonNotes,
  upsertTeacherLessonNote,
} from './lessonService';

export {
  initializeData,
  hashPassword,
  subscribeStore,
  getStorageSummary,
  createId,
  notifyStoreUpdated,
} from './coreService';

export {
  getLoginHistory,
  addLoginLog,
  getGuestCountToday,
  getLoginStats,
} from './loginHistoryService';

export type {
  Student,
  Teacher,
  ClassRoom as SchoolClass,
  AttendanceRecord,
  ClassRosterItem,
  ClassAnnouncement,
  OnlineAssignment,
  AssignmentSubmission,
  AssignmentBook,
  AssignmentVideo,
  AssignmentAttachment,
  AssignmentExercise,
  AssignmentDiscussion,
  AssignmentQuizResult,
  ChatGroup,
  GroupChatMessage,
  PrivateMessage,
  MessageAttachment,
  Book,
  LibraryMember,
  LibraryTransaction,
  Announcement,
  PPDBApplicationStatus,
  PPDBDocumentFile,
  PPDBApplication,
  PPDBAuditAction,
  PPDBAuditLog,
  PPDBNotification,
  Message,
  Task,
  Bill,
  Grade,
  SuratIzin,
  CatatanBK,
  Ekskul,
  EkskulMember,
  EkskulKehadiran,
  TahunAjaran,
  MataPelajaran,
  TagihanSekolah,
  PengaturanTagihan,
  PengumumanAdmin,
  NilaiRapot,
  StudentClassMutation,
  StudentStatusMutation,
  StudentStatus,
  RpsMeetingRow,
  RpsDocument,
  TeacherLessonNote,
  GuestConfig,
  AuthUser,
  UserRole,
  PageProps,
  LoginLog,
} from '../../types';

export type { AttendanceEntry, ClassRoster, Database } from '../store/core';
