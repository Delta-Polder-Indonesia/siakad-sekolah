import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '../../src/lib/prisma.js';
import { app } from '../../src/app.js';

describe('School Config E2E Tests', () => {
  let authToken: string;
  let dbAvailable = false;
  
  beforeAll(async () => {
    // Check if database is available
    try {
      await prisma.$connect();
      dbAvailable = true;
      
      // Login as admin to get auth token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          role: 'GURU',
          id: '198501012010011001',
          password: 'guru123',
        });
      
      if (loginResponse.body.ok && loginResponse.body.data) {
        authToken = loginResponse.body.data.accessToken;
      }
    } catch (error) {
      console.warn('Database not available for E2E tests, skipping database-dependent tests');
      dbAvailable = false;
    }
  });
  
  afterAll(async () => {
    if (dbAvailable) {
      await prisma.$disconnect();
    }
  });
  
  describe('Get School Config', () => {
    it('should get school config without authentication', async () => {
      const response = await request(app)
        .get('/api/school-config');
      
      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('shortName');
    });
  });
  
  describe('Update School Config', () => {
    it('should update school config with admin authentication', async () => {
      if (!dbAvailable) {
        console.warn('Skipping test - database not available');
        return;
      }
      
      const updateData = {
        name: 'Updated School Name',
        shortName: 'Updated',
        type: 'SMA',
      };
      
      const response = await request(app)
        .put('/api/school-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
    
    it('should fail update without authentication', async () => {
      const response = await request(app)
        .put('/api/school-config')
        .send({
          name: 'Unauthorized Update',
        });
      
      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    });
  });
});