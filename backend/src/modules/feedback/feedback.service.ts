// Service layer untuk fitur feedback/review pengguna.
// Data disimpan terpusat di database agar semua user bisa saling melihat.

import { prisma } from '../../lib/prisma.js';
import type { Feedback } from '@prisma/client';

export type FeedbackInput = {
  name: string;
  email?: string | null;
  role?: string | null;
  category?: string | null;
  subject: string;
  message: string;
  priority?: string | null;
  rating?: number | null;
  avatar?: string | null;
};

const parseLikedBy = (raw: string | null | undefined): string[] => {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
};

// Konversi row DB → bentuk yang dipakai frontend (likedBy sebagai array).
type SerializedFeedback = Omit<Feedback, 'likedBy'> & { likedBy: string[] };

const serialize = (row: Feedback): SerializedFeedback => ({
  ...row,
  likedBy: parseLikedBy(row.likedBy),
});

export async function listFeedback(): Promise<SerializedFeedback[]> {
  const rows = await prisma.feedback.findMany({
    orderBy: { submittedAt: 'desc' },
  });
  return rows.map(serialize);
}

export async function createFeedback(input: FeedbackInput): Promise<SerializedFeedback> {
  const row = await prisma.feedback.create({
    data: {
      name: input.name,
      email: input.email ?? null,
      role: input.role ?? 'guest',
      category: input.category ?? 'saran',
      subject: input.subject,
      message: input.message,
      priority: input.priority ?? 'sedang',
      rating: input.rating ?? null,
      avatar: input.avatar ?? null,
    },
  });
  return serialize(row);
}

export async function updateFeedbackStatus(
  id: string,
  input: { status: string; adminNotes?: string | null }
): Promise<SerializedFeedback | null> {
  const existing = await prisma.feedback.findUnique({ where: { id } });
  if (!existing) return null;

  const row = await prisma.feedback.update({
    where: { id },
    data: {
      status: input.status,
      adminNotes: input.adminNotes ?? existing.adminNotes,
      processedAt:
        input.status && input.status !== 'pending' ? new Date() : existing.processedAt,
    },
  });
  return serialize(row);
}

export async function toggleFeedbackLike(
  id: string,
  userId: string
): Promise<{ id: string; likes: number; liked: boolean } | null> {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.feedback.findUnique({
      where: { id },
      select: { likedBy: true, likes: true },
    });
    if (!existing) return null;

    const likedBy = parseLikedBy(existing.likedBy);
    const hasLiked = likedBy.includes(userId);
    const nextLikedBy = hasLiked ? likedBy.filter((uid) => uid !== userId) : [...likedBy, userId];

    const updated = await tx.feedback.update({
      where: { id },
      data: { likedBy: JSON.stringify(nextLikedBy), likes: nextLikedBy.length },
    });

    return { id: updated.id, likes: updated.likes, liked: !hasLiked };
  });
}

export async function deleteFeedback(id: string): Promise<boolean> {
  const existing = await prisma.feedback.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.feedback.delete({ where: { id } });
  return true;
}

export async function getFeedbackStats() {
  const all = await prisma.feedback.findMany();
  const rated = all.filter((f) => f.rating && f.rating > 0);

  const countByStatus = (status: string) => all.filter((f) => f.status === status).length;
  const countByCategory = (category: string) => all.filter((f) => f.category === category).length;
  const countByPriority = (priority: string) => all.filter((f) => f.priority === priority).length;
  const countByRating = (rating: number) => all.filter((f) => f.rating === rating).length;

  return {
    total: all.length,
    pending: countByStatus('pending'),
    dibaca: countByStatus('dibaca'),
    diproses: countByStatus('diproses'),
    selesai: countByStatus('selesai'),
    byCategory: {
      bug: countByCategory('bug'),
      saran: countByCategory('saran'),
      keluhan: countByCategory('keluhan'),
      pertanyaan: countByCategory('pertanyaan'),
      lainnya: countByCategory('lainnya'),
    },
    byPriority: {
      rendah: countByPriority('rendah'),
      sedang: countByPriority('sedang'),
      tinggi: countByPriority('tinggi'),
    },
    averageRating:
      rated.length > 0
        ? rated.reduce((sum, f) => sum + (f.rating || 0), 0) / rated.length
        : 0,
    ratingBreakdown: {
      5: countByRating(5),
      4: countByRating(4),
      3: countByRating(3),
      2: countByRating(2),
      1: countByRating(1),
    },
  };
}
