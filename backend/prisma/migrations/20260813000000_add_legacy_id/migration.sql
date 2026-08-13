-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN "legacyId" TEXT;
CREATE UNIQUE INDEX "Teacher_legacyId_key" ON "Teacher"("legacyId");

-- AlterTable
ALTER TABLE "Student" ADD COLUMN "legacyId" TEXT;
CREATE UNIQUE INDEX "Student_legacyId_key" ON "Student"("legacyId");
