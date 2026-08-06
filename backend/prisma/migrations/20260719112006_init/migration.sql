-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'GURU', 'MURID');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALPHA');

-- CreateEnum
CREATE TYPE "PPDBStatus" AS ENUM ('PENDING', 'VERIFIED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LibraryTransactionStatus" AS ENUM ('MENUNGGU', 'DIPINJAM', 'DIKEMBALIKAN', 'TERLAMBAT', 'DITOLAK');

-- CreateEnum
CREATE TYPE "SuratIzinType" AS ENUM ('IZIN', 'SAKIT', 'DISPENSASI', 'LAINNYA');

-- CreateEnum
CREATE TYPE "SuratIzinStatus" AS ENUM ('MENUNGGU', 'DISETUJUI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "LibraryMemberType" AS ENUM ('SISWA', 'GURU', 'STAF');

-- CreateTable
CREATE TABLE "SchoolConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "npsn" TEXT,
    "founded" INTEGER,
    "accreditation" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "addressStreet" TEXT,
    "addressDistrict" TEXT,
    "addressCity" TEXT,
    "addressProvince" TEXT,
    "addressZip" TEXT,
    "mapsEmbedUrl" TEXT,
    "mapsDirectUrl" TEXT,
    "logoUrl" TEXT,
    "profilePdfUrl" TEXT,
    "heroImageUrl" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "facebook" TEXT,
    "weekdayLabel" TEXT NOT NULL DEFAULT 'Senin - Jumat',
    "weekdayHours" TEXT NOT NULL DEFAULT '07:00 - 15:30',
    "weekendLabel" TEXT NOT NULL DEFAULT 'Sabtu - Minggu',
    "weekendHours" TEXT NOT NULL DEFAULT 'Tutup',
    "statStudents" TEXT NOT NULL DEFAULT '0',
    "statTeachers" TEXT NOT NULL DEFAULT '0',
    "statAchievements" TEXT NOT NULL DEFAULT '0',
    "statAccreditation" TEXT NOT NULL DEFAULT 'A',
    "ppdbYear" TEXT NOT NULL DEFAULT '2026',
    "ppdbIsOpen" BOOLEAN NOT NULL DEFAULT false,
    "ppdbRegistrationUrl" TEXT,
    "ppdbQuota" INTEGER NOT NULL DEFAULT 0,
    "ppdbOpenDate" TIMESTAMP(3),
    "ppdbCloseDate" TIMESTAMP(3),
    "featureContactForm" BOOLEAN NOT NULL DEFAULT true,
    "featurePpdb" BOOLEAN NOT NULL DEFAULT true,
    "featureLibrary" BOOLEAN NOT NULL DEFAULT true,
    "featureOnlineAssignment" BOOLEAN NOT NULL DEFAULT true,
    "featureReportCard" BOOLEAN NOT NULL DEFAULT true,
    "featureBilling" BOOLEAN NOT NULL DEFAULT true,
    "featureElearning" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassRoom" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "gender" TEXT,
    "classId" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassRoomTeacher" (
    "classRoomId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "ClassRoomTeacher_pkey" PRIMARY KEY ("classRoomId","teacherId")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "note" TEXT,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "classId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassAnnouncement" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassRoster" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" TEXT,
    "teacherName" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassRoster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineAssignment" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnlineAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSubmission" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "answerText" TEXT,
    "attachmentUrl" TEXT,
    "attachmentName" TEXT,
    "grade" DOUBLE PRECISION,
    "feedback" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportCard" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "dailyScore" DOUBLE PRECISION,
    "assignScore" DOUBLE PRECISION,
    "midScore" DOUBLE PRECISION,
    "finalScore" DOUBLE PRECISION,
    "totalScore" DOUBLE PRECISION,
    "grade" TEXT,
    "teacherNote" TEXT,
    "inputBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingConfig" (
    "id" TEXT NOT NULL,
    "monthlyAmount" INTEGER NOT NULL,
    "dueDay" INTEGER NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Billing" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuratIzin" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "type" "SuratIzinType" NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "letterDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "SuratIzinStatus" NOT NULL DEFAULT 'MENUNGGU',
    "attachmentUrl" TEXT,
    "attachmentName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuratIzin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "isbn" TEXT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "rack" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "available" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "memberType" "LibraryMemberType" NOT NULL,
    "nis" TEXT,
    "className" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryTransaction" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "studentId" TEXT,
    "borrowDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "status" "LibraryTransactionStatus" NOT NULL DEFAULT 'MENUNGGU',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PPDBApplication" (
    "id" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "status" "PPDBStatus" NOT NULL DEFAULT 'PENDING',
    "fullName" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT NOT NULL,
    "previousSchool" TEXT NOT NULL,
    "previousNpsn" TEXT,
    "majorId" TEXT,
    "pathway" TEXT NOT NULL,
    "fatherName" TEXT,
    "motherName" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "adminNotes" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PPDBApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PPDBDocument" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "docKey" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "validation" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PPDBDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PPDBAuditLog" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PPDBAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PPDBNotification" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PPDBNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentClassMutation" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fromClassId" TEXT NOT NULL,
    "toClassId" TEXT NOT NULL,
    "note" TEXT,
    "movedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentClassMutation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherLessonNote" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "materi" TEXT NOT NULL,
    "hasPr" BOOLEAN NOT NULL DEFAULT false,
    "prDetail" TEXT,
    "note" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherLessonNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "contentId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "likedBy" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("contentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassRoom_code_key" ON "ClassRoom"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_nip_key" ON "Teacher"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Student_nis_key" ON "Student"("nis");

-- CreateIndex
CREATE INDEX "ClassRoomTeacher_teacherId_idx" ON "ClassRoomTeacher"("teacherId");

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

-- CreateIndex
CREATE INDEX "Attendance_studentId_date_idx" ON "Attendance"("studentId", "date");

-- CreateIndex
CREATE INDEX "Attendance_classId_date_idx" ON "Attendance"("classId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_date_key" ON "Attendance"("studentId", "date");

-- CreateIndex
CREATE INDEX "Announcement_classId_idx" ON "Announcement"("classId");

-- CreateIndex
CREATE INDEX "ClassAnnouncement_classId_idx" ON "ClassAnnouncement"("classId");

-- CreateIndex
CREATE INDEX "ClassRoster_classId_idx" ON "ClassRoster"("classId");

-- CreateIndex
CREATE INDEX "OnlineAssignment_classId_idx" ON "OnlineAssignment"("classId");

-- CreateIndex
CREATE INDEX "AssignmentSubmission_assignmentId_idx" ON "AssignmentSubmission"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentSubmission_studentId_idx" ON "AssignmentSubmission"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSubmission_assignmentId_studentId_key" ON "AssignmentSubmission"("assignmentId", "studentId");

-- CreateIndex
CREATE INDEX "ReportCard_studentId_idx" ON "ReportCard"("studentId");

-- CreateIndex
CREATE INDEX "ReportCard_classId_idx" ON "ReportCard"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportCard_studentId_classId_academicYear_semester_subject_key" ON "ReportCard"("studentId", "classId", "academicYear", "semester", "subject");

-- CreateIndex
CREATE INDEX "Billing_studentId_idx" ON "Billing"("studentId");

-- CreateIndex
CREATE INDEX "Billing_isPaid_idx" ON "Billing"("isPaid");

-- CreateIndex
CREATE UNIQUE INDEX "Billing_studentId_year_month_key" ON "Billing"("studentId", "year", "month");

-- CreateIndex
CREATE INDEX "SuratIzin_studentId_idx" ON "SuratIzin"("studentId");

-- CreateIndex
CREATE INDEX "SuratIzin_classId_idx" ON "SuratIzin"("classId");

-- CreateIndex
CREATE INDEX "SuratIzin_status_idx" ON "SuratIzin"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE INDEX "Book_category_idx" ON "Book"("category");

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- CreateIndex
CREATE INDEX "LibraryTransaction_bookId_idx" ON "LibraryTransaction"("bookId");

-- CreateIndex
CREATE INDEX "LibraryTransaction_memberId_idx" ON "LibraryTransaction"("memberId");

-- CreateIndex
CREATE INDEX "LibraryTransaction_status_idx" ON "LibraryTransaction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PPDBApplication_registrationNo_key" ON "PPDBApplication"("registrationNo");

-- CreateIndex
CREATE INDEX "PPDBApplication_status_idx" ON "PPDBApplication"("status");

-- CreateIndex
CREATE INDEX "PPDBApplication_registrationNo_idx" ON "PPDBApplication"("registrationNo");

-- CreateIndex
CREATE INDEX "PPDBDocument_applicationId_idx" ON "PPDBDocument"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PPDBDocument_applicationId_docKey_key" ON "PPDBDocument"("applicationId", "docKey");

-- CreateIndex
CREATE INDEX "PPDBAuditLog_applicationId_idx" ON "PPDBAuditLog"("applicationId");

-- CreateIndex
CREATE INDEX "PPDBAuditLog_occurredAt_idx" ON "PPDBAuditLog"("occurredAt");

-- CreateIndex
CREATE INDEX "PPDBNotification_applicationId_idx" ON "PPDBNotification"("applicationId");

-- CreateIndex
CREATE INDEX "PPDBNotification_isRead_idx" ON "PPDBNotification"("isRead");

-- CreateIndex
CREATE INDEX "StudentClassMutation_studentId_idx" ON "StudentClassMutation"("studentId");

-- CreateIndex
CREATE INDEX "TeacherLessonNote_teacherId_classId_idx" ON "TeacherLessonNote"("teacherId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherLessonNote_teacherId_classId_subject_date_key" ON "TeacherLessonNote"("teacherId", "classId", "subject", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Like_contentId_key" ON "Like"("contentId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRoomTeacher" ADD CONSTRAINT "ClassRoomTeacher_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRoomTeacher" ADD CONSTRAINT "ClassRoomTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAnnouncement" ADD CONSTRAINT "ClassAnnouncement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRoster" ADD CONSTRAINT "ClassRoster_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineAssignment" ADD CONSTRAINT "OnlineAssignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "OnlineAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratIzin" ADD CONSTRAINT "SuratIzin_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryTransaction" ADD CONSTRAINT "LibraryTransaction_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryTransaction" ADD CONSTRAINT "LibraryTransaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "LibraryMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryTransaction" ADD CONSTRAINT "LibraryTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PPDBDocument" ADD CONSTRAINT "PPDBDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PPDBApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PPDBAuditLog" ADD CONSTRAINT "PPDBAuditLog_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PPDBApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PPDBNotification" ADD CONSTRAINT "PPDBNotification_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PPDBApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClassMutation" ADD CONSTRAINT "StudentClassMutation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherLessonNote" ADD CONSTRAINT "TeacherLessonNote_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
