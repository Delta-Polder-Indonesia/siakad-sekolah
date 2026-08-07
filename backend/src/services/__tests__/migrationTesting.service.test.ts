import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MigrationTestingService } from '../migrationTesting.service.js';

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

// Mock Prisma client
vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

// Mock logger
vi.mock('../../config/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MigrationTestingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTestDatabase', () => {
    it('should create a test database successfully', async () => {
      const { execSync } = await import('child_process');
      
      (execSync as any).mockImplementation((command: string) => {
        if (command.includes('CREATE DATABASE')) {
          return 'Database created';
        }
        return '';
      });
      
      const result = await MigrationTestingService.createTestDatabase('test_db');
      
      expect(result).toBe(true);
      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('CREATE DATABASE test_db'),
        expect.any(Object)
      );
    });

    it('should handle database creation errors', async () => {
      const { execSync } = await import('child_process');
      
      (execSync as any).mockImplementation(() => {
        throw new Error('Database creation failed');
      });
      
      await expect(
        MigrationTestingService.createTestDatabase('test_db')
      ).rejects.toThrow('Database creation failed');
    });
  });

  describe('validateSchema', () => {
    it('should validate database schema successfully', async () => {
      const { execSync } = await import('child_process');
      const { prisma } = await import('../../lib/prisma.js');
      
      (execSync as any).mockReturnValue('');
      (prisma.$connect as any).mockResolvedValue(undefined);
      (prisma.$disconnect as any).mockResolvedValue(undefined);
      
      const result = await MigrationTestingService.validateSchema('test_db');
      
      expect(result).toBe(true);
      expect(prisma.$connect).toHaveBeenCalled();
      expect(prisma.$disconnect).toHaveBeenCalled();
    });

    it('should handle schema validation errors', async () => {
      const { prisma } = await import('../../lib/prisma.js');
      
      (prisma.$connect as any).mockRejectedValue(new Error('Connection failed'));
      
      await expect(
        MigrationTestingService.validateSchema('test_db')
      ).rejects.toThrow('Connection failed');
    });
  });

  describe('cleanupTestDatabase', () => {
    it('should clean up test database successfully', async () => {
      const { execSync } = await import('child_process');
      
      (execSync as any).mockReturnValue('Database dropped');
      
      const result = await MigrationTestingService.cleanupTestDatabase('test_db');
      
      expect(result).toBe(true);
      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('DROP DATABASE IF EXISTS test_db'),
        expect.any(Object)
      );
    });
  });

  describe('runMigrationTestSuite', () => {
    it('should run full migration test suite successfully', async () => {
      vi.spyOn(MigrationTestingService, 'createTestDatabase').mockResolvedValue(true);
      vi.spyOn(MigrationTestingService, 'runMigrationsOnTestDb').mockResolvedValue(true);
      vi.spyOn(MigrationTestingService, 'validateSchema').mockResolvedValue(true);
      vi.spyOn(MigrationTestingService, 'cleanupTestDatabase').mockResolvedValue(true);
      
      const results = await MigrationTestingService.runMigrationTestSuite('test_db');
      
      expect(results).toEqual({
        createTestDb: true,
        runMigrations: true,
        validateSchema: true,
        cleanup: true,
      });
    });

    it('should cleanup on test failure', async () => {
      vi.spyOn(MigrationTestingService, 'createTestDatabase').mockResolvedValue(true);
      vi.spyOn(MigrationTestingService, 'runMigrationsOnTestDb').mockRejectedValue(new Error('Migration failed'));
      vi.spyOn(MigrationTestingService, 'cleanupTestDatabase').mockResolvedValue(true);
      
      await expect(
        MigrationTestingService.runMigrationTestSuite('test_db')
      ).rejects.toThrow('Migration failed');
      
      expect(MigrationTestingService.cleanupTestDatabase).toHaveBeenCalled();
    });
  });
});