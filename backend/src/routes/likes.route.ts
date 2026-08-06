import { Router } from 'express';
import requestIp from 'request-ip';
import { prisma } from '../lib/prisma.js';

export const likesRoute = Router();

// GET /api/likes/:programId
likesRoute.get('/:programId', async (req, res) => {
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
    console.error('GET /likes error:', error);
    res.status(500).json({ error: 'Gagal mengambil data like' });
  }
});

// POST /api/likes/:programId
likesRoute.post('/:programId', async (req, res) => {
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
    console.error('POST /likes error:', error);
    res.status(500).json({ error: 'Gagal memproses like' });
  }
});

export default likesRoute;