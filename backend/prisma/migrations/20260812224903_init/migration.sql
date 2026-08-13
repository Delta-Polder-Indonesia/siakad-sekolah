/*
  Warnings:

  - The `status` column on the `LibraryTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `PPDBApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `SuratIzin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `Attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `memberType` on the `LibraryMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `SuratIzin` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LibraryMember" DROP COLUMN "memberType",
ADD COLUMN     "memberType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LibraryTransaction" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'MENUNGGU';

-- AlterTable
ALTER TABLE "PPDBApplication" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "SuratIzin" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'MENUNGGU';

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "LibraryMemberType";

-- DropEnum
DROP TYPE "LibraryTransactionStatus";

-- DropEnum
DROP TYPE "PPDBStatus";

-- DropEnum
DROP TYPE "SuratIzinStatus";

-- DropEnum
DROP TYPE "SuratIzinType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateIndex
CREATE INDEX "Attendance_status_idx" ON "Attendance"("status");

-- CreateIndex
CREATE INDEX "Attendance_studentId_status_idx" ON "Attendance"("studentId", "status");

-- CreateIndex
CREATE INDEX "LibraryTransaction_status_idx" ON "LibraryTransaction"("status");

-- CreateIndex
CREATE INDEX "PPDBApplication_status_idx" ON "PPDBApplication"("status");

-- CreateIndex
CREATE INDEX "ReportCard_academicYear_semester_idx" ON "ReportCard"("academicYear", "semester");

-- CreateIndex
CREATE INDEX "ReportCard_subject_idx" ON "ReportCard"("subject");

-- CreateIndex
CREATE INDEX "ReportCard_grade_idx" ON "ReportCard"("grade");

-- CreateIndex
CREATE INDEX "Student_classId_idx" ON "Student"("classId");

-- CreateIndex
CREATE INDEX "Student_name_idx" ON "Student"("name");

-- CreateIndex
CREATE INDEX "Student_gender_idx" ON "Student"("gender");

-- CreateIndex
CREATE INDEX "Student_nis_idx" ON "Student"("nis");

-- CreateIndex
CREATE INDEX "SuratIzin_status_idx" ON "SuratIzin"("status");

-- CreateIndex
CREATE INDEX "Teacher_name_idx" ON "Teacher"("name");

-- CreateIndex
CREATE INDEX "Teacher_subject_idx" ON "Teacher"("subject");

-- CreateIndex
CREATE INDEX "Teacher_email_idx" ON "Teacher"("email");
