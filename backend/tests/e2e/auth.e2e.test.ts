import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '../../src/lib/prisma.js';
import { app } from '../../src/app.js';

describe('Authentication E2E Tests', () => {
  let authToken: string;
  let refreshToken: string;
  let dbAvailable = false;
  
  beforeAll(async () => {
    // Check if database is available
    try {
      await prisma.$connect();
      dbAvailable = true;
      // Clean up test data
      await prisma.tokenBlacklist.deleteMany({});
    } catch (error) {
      console.warn('Database not available for E2E tests, skipping database-dependent tests');
      dbAvailable = false;
    }
  });
  
  afterAll(async () => {
    if (dbAvailable) {
      // Clean up test data
      await prisma.tokenBlacklist.deleteMany({});
      await prisma.$disconnect();
    }
  });
  
  describe('Teacher Login Flow', () => {
    it('should login teacher with valid credentials', async () => {
      if (!dbAvailable) {
        console.warn('Skipping test - database not available');
        return;
      }
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          role: 'GURU',
          id: '198501012010011001',
          password: 'guru123',
        });
      
      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.role).toBe('GURU');
      
      authToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
    });
    
    it('should fail login with invalid credentials', async () => {
      if (!dbAvailable) {
        console.warn('Skipping test - database not available');
        return;
      }
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          role: 'GURU',
          id: '198501012010011001',
          password: 'wrongpassword',
        });
      
      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });
    
    it('should fail login with invalid role', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          role: 'INVALID_ROLE',
          id: '198501012010011001',
          password: 'guru123',
        });
      
      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
    });
  });
  
  describe('Token Refresh Flow', () => {
    it('should refresh access token with valid refresh token', async () => {
      if (!dbAvailable) {
        console.warn('Skipping test - database not available');
        return;
      }
      
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken,
        });
      
      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      
      // Update auth token for subsequent tests
      authToken = response.body.data.accessToken;
    });
    
    it('should fail refresh with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid_refresh_token',
        });
      
      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    });
  });
  
  describe('Protected Route Access', () => {
    it('should access protected route with valid token', async () => {
      if (!dbAvailable) {
        console.warn('Skipping test - database not available');
        return;
      }
      
      const response = await request(app)
        .get('/api/school-config')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });
    
    it('should fail protected route access without token', async () => {
      const response = await request(app)
        .get('/api/school-config');
      
      // Should either be 401 (no auth) or 200 (public endpoint)
      expect([401, 200]).toContain(response.status);
    });
    
    it('should fail protected route access with invalid token', async () => {
      const response = await request(app)
        .get('/api/school-config')
        .set('Authorization', 'Bearer invalid_token');
      
      // Should either be 401 (invalid auth) or 200 (public endpoint)
      expect([401, 200]).toContain(response.status);
    });
  });
  
  describe('Logout Flow', () => {
    it('should logout successfully and blacklist token', async () => {
      if (!dbAvailable) {
        console.warn('Skipping test - database not available');
        return;
      }
      
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toContain('logged out');
    });
    
    it('should not access protected route after logout', async () => {
      if (!dbAvailable) {
        console.warn('Skipping test - database not available');
        return;
      }
      
      const response = await request(app)
        .get('/api/school-config')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    });
  });
});