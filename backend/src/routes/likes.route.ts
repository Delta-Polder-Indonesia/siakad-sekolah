import { Router } from 'express';
import requestIp from 'request-ip';
import { prisma } from '../lib/prisma.js';
import { logger } from '../config/logger.js';

export const likesRouter = Router();

// GET /api/likes/:programId
likesRouter.get('/:programId', async (req, res) => {
  try {
    const { programId } = req.params;
    const userIp = requestIp.getClientIp(req) || '';

    const count = await prisma.like.count({
      where: { programId }
    });

    const userLiked = await prisma.like.findUnique({
      where: {
        programId_ip: { programId, ip: userIp }
      }
    });

    res.json({ count, userLiked: !!userLiked, programId });

  } catch (error) {
    logger.error('GET /likes error:', { error: (error as Error).message });
    res.status(500).json({ error: 'Gagal mengambil data like' });
  }
});

// POST /api/likes/:programId
likesRouter.post('/:programId', async (req, res) => {
  try {
    const { programId } = req.params;
    const userIp = requestIp.getClientIp(req) || '';

    const existingLike = await prisma.like.findUnique({
      where: {
        programId_ip: { programId, ip: userIp }
      }
    });

    if (existingLike) {
      // Unlike → hapus record
      await prisma.like.delete({
        where: {
          programId_ip: { programId, ip: userIp }
        }
      });
    } else {
      // Like → buat record baru
      await prisma.like.create({
        data: { programId, ip: userIp }
      });
    }

    const count = await prisma.like.count({ where: { programId } });

    res.json({
      count,
      liked: !existingLike,
      programId
    });

  } catch (error) {
    logger.error('POST /likes error:', { error: (error as Error).message });
    res.status(500).json({ error: 'Gagal memproses like' });
  }
});