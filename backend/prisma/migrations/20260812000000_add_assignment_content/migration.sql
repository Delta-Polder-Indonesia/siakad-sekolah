-- AlterTable
-- Menyimpan konten kaya tugas online (summary, books, videos, attachments,
-- exercises) dari frontend yang tidak tersimpan sebagai kolom relasional.
ALTER TABLE "OnlineAssignment" ADD COLUMN "content" JSONB;
