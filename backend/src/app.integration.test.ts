import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';

const mockTeacherFindUnique = vi.fn();
const mockTeacherCount = vi.fn();
const mockStudentFindUnique = vi.fn();
const mockStudentCount = vi.fn();
const mockClassRoomCount = vi.fn();
const mockClassRoomTeacherFindMany = vi.fn();
const mockClassRoomFindMany = vi.fn();
const mockSchoolConfigFindFirst = vi.fn();
const mockTokenFindUnique = vi.fn();
const mockTokenCreate = vi.fn();
const mockLikeCount = vi.fn();
const mockLikeFindUnique = vi.fn();
const mockQueryRaw = vi.fn();

vi.mock('./lib/prisma.js', () => ({
  prisma: {
    $queryRaw: mockQueryRaw,
    teacher: {
      findUnique: mockTeacherFindUnique,
      count: mockTeacherCount,
    },
    student: {
      findUnique: mockStudentFindUnique,
      count: mockStudentCount,
    },
    classRoom: {
      count: mockClassRoomCount,
      findMany: mockClassRoomFindMany,
    },
    classRoomTeacher: {
      findMany: mockClassRoomTeacherFindMany,
    },
    schoolConfig: {
      findFirst: mockSchoolConfigFindFirst,
    },
    tokenBlacklist: {
      findUnique: mockTokenFindUnique,
      create: mockTokenCreate,
    },
    like: {
      count: mockLikeCount,
      findUnique: mockLikeFindUnique,
    },
  },
}));

const { app } = await import('./app.js');

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryRaw.mockResolvedValue([{ '?column?': 1 }]);
    mockTokenFindUnique.mockResolvedValue(null);
    mockTeacherCount.mockResolvedValue(5);
    mockStudentCount.mockResolvedValue(100);
    mockClassRoomCount.mockResolvedValue(3);
    mockClassRoomTeacherFindMany.mockResolvedValue([]);
    mockClassRoomFindMany.mockResolvedValue([]);
  });

  describe('Root & 404', () => {
    it('GET / harus mengembalikan info API', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Absensi Sekolah API');
      expect(res.body).toHaveProperty('version');
    });

    it('GET / harus menyertakan correlation ID di response header', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['x-request-id']).toBeTruthy();
    });

    it('GET / harus menghormati X-Request-Id dari client', async () => {
      const res = await request(app)
        .get('/')
        .set('X-Request-Id', 'my-trace-id-123');
      expect(res.headers['x-request-id']).toBe('my-trace-id-123');
    });

    it('GET /api/unknown harus mengembalikan 404 dengan format JSON', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        ok: false,
        message: 'Endpoint tidak ditemukan.',
      });
    });
  });

  describe('Health Check', () => {
    it('GET /api/health harus mengembalikan status healthy saat DB terhubung', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.status).toBe('healthy');
      expect(res.body.services.database).toBe('connected');
    });

    it('GET /api/health harus mengembalikan 503 saat DB gagal', async () => {
      mockQueryRaw.mockRejectedValueOnce(new Error('DB connection failed'));
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(503);
      expect(res.body.ok).toBe(false);
      expect(res.body.status).toBe('unhealthy');
    });
  });

  describe('Auth', () => {
    it('POST /api/auth/login dengan body invalid harus 400', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ role: 'INVALID_ROLE' });
      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe('Data tidak valid');
    });

    it('POST /api/auth/login dengan role GURU tidak ditemukan harus 401', async () => {
      mockTeacherFindUnique.mockResolvedValueOnce(null);
      const res = await request(app)
        .post('/api/auth/login')
        .send({ role: 'GURU', id: '198501012010011001', password: 'guru123' });
      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe('ID atau password salah.');
    });

    it('POST /api/auth/login dengan kredensial valid harus mengembalikan token', async () => {
      const hash = bcrypt.hashSync('guru123', 10);
      mockTeacherFindUnique.mockResolvedValueOnce({
        id: 'teacher-1',
        nip: '198501012010011001',
        name: 'Pak Budi',
        passwordHash: hash,
        avatarUrl: null,
        email: 'budi@sekolah.sch.id',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ role: 'GURU', id: '198501012010011001', password: 'guru123' });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.user.role).toBe('GURU');
    });

    it('POST /api/auth/admin/login dengan kredensial salah harus 401', async () => {
      const res = await request(app)
        .post('/api/auth/admin/login')
        .send({ username: 'admin_portal', pin: 'salah123' });
      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
    });
  });

  describe('Likes', () => {
    it('GET /api/likes/:programId harus mengembalikan count dan userLiked', async () => {
      mockLikeCount.mockResolvedValueOnce(3);
      mockLikeFindUnique.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/likes/program-1');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ count: 3, userLiked: false, programId: 'program-1' });
    });
  });

  describe('Metrics (Performance Monitoring)', () => {
    it('GET /api/metrics tanpa token harus 401', async () => {
      const res = await request(app).get('/api/metrics');
      expect(res.status).toBe(401);
    });

    it('GET /api/metrics dengan token non-admin harus 403', async () => {
      const jwt = await import('jsonwebtoken');
      const { env } = await import('./config/env.js');
      const token = jwt.sign(
        { userId: 'teacher-1', role: 'GURU', name: 'Pak Budi' },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const res = await request(app)
        .get('/api/metrics')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(403);
    });

    it('GET /api/metrics dengan token admin harus 200 dan berisi data', async () => {
      const jwt = await import('jsonwebtoken');
      const { env } = await import('./config/env.js');
      const token = jwt.sign(
        { userId: 'admin_portal', role: 'ADMIN', name: 'admin_portal' },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const res = await request(app)
        .get('/api/metrics')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data).toHaveProperty('totalRequests');
      expect(res.body.data).toHaveProperty('averageResponseTime');
      expect(res.body.data).toHaveProperty('routes');
    });
  });
});
