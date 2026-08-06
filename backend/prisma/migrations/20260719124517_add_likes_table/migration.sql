/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contentId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `likedBy` on the `Like` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[programId,ip]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ip` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Like_contentId_key";

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
DROP COLUMN "contentId",
DROP COLUMN "count",
DROP COLUMN "likedBy",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "programId" TEXT NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Like_programId_idx" ON "Like"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_programId_ip_key" ON "Like"("programId", "ip");
