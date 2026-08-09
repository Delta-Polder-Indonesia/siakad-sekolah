import { prisma } from '../../lib/prisma.js';

// Statistik ringkas dashboard admin. Hitungan saja (tanpa data PII).
export async function getDashboardStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const [
    teachersActive,
    studentsTotal,
    classes,
    classesFilled,
    attendanceToday,
    libraryBooks,
    libraryActiveLoans,
    ppdbApplications,
    announcements,
  ] = await Promise.all([
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.classRoom.count(),
    prisma.classRoom.count({ where: { teacherId: { not: null } } }),
    prisma.attendance.count({ where: { date: { gte: todayStart, lt: todayEnd } } }),
    prisma.book.count(),
    prisma.libraryTransaction.count({ where: { status: 'DIPINJAM' } }),
    prisma.pPDBApplication.count(),
    prisma.announcement.count(),
  ]);

  return {
    teachersActive,
    studentsTotal,
    classes,
    classesFilled,
    attendanceToday,
    libraryBooks,
    libraryActiveLoans,
    ppdbApplications,
    announcements,
    updatedAt: new Date().toISOString(),
  };
}