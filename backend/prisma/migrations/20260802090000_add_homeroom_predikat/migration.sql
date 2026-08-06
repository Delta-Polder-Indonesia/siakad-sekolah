-- AlterTable
ALTER TABLE "ClassRoom" ADD COLUMN     "teacherId" TEXT;

-- AlterTable
ALTER TABLE "ClassRoomTeacher" ADD COLUMN     "isHomeroom" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ReportCard" ADD COLUMN     "predikat" TEXT;

-- CreateIndex
CREATE INDEX "ClassRoom_teacherId_idx" ON "ClassRoom"("teacherId");

-- AddForeignKey
ALTER TABLE "ClassRoom" ADD CONSTRAINT "ClassRoom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
