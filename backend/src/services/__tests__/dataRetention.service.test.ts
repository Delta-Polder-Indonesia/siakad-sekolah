import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataRetentionService } from '../dataRetention.service.js';
import { prisma } from '../../lib/prisma.js';

// Mock Prisma client
vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    sessionToken: {
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    pPDBAuditLog: {
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    pPDBNotification: {
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    attendance: {
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    libraryTransaction: {
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    suratIzin: {
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    assignmentSubmission: {
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('DataRetentionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('cleanupExpiredTokens', () => {
    it('should delete expired tokens and sessions', async () => {
      (prisma.sessionToken.deleteMany as any).mockResolvedValue({ count: 7 });
      
      const result = await DataRetentionService.cleanupExpiredTokens();
      
      expect(result).toBe(7);
      expect(prisma.sessionToken.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lt: expect.any(Date),
          },
        },
      });
    });

    it('should return 0 when no expired tokens/sessions', async () => {
      (prisma.sessionToken.deleteMany as any).mockResolvedValue({ count: 0 });
      
      const result = await DataRetentionService.cleanupExpiredTokens();
      
      expect(result).toBe(0);
    });
  });

  describe('cleanupOldPPDBAuditLogs', () => {
    it('should delete audit logs older than retention period', async () => {
      (prisma.pPDBAuditLog.deleteMany as any).mockResolvedValue({ count: 10 });
      
      const result = await DataRetentionService.cleanupOldPPDBAuditLogs();
      
      expect(result).toBe(10);
      expect(prisma.pPDBAuditLog.deleteMany).toHaveBeenCalledWith({
        where: {
          occurredAt: {
            lt: expect.any(Date),
          },
        },
      });
    });
  });

  describe('cleanupOldPPDBNotifications', () => {
    it('should delete read notifications older than retention period', async () => {
      (prisma.pPDBNotification.deleteMany as any).mockResolvedValue({ count: 8 });
      
      const result = await DataRetentionService.cleanupOldPPDBNotifications();
      
      expect(result).toBe(8);
      expect(prisma.pPDBNotification.deleteMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            lt: expect.any(Date),
          },
          isRead: true,
        },
      });
    });
  });

  describe('cleanupOldAttendance', () => {
    it('should delete attendance records older than retention period', async () => {
      (prisma.attendance.deleteMany as any).mockResolvedValue({ count: 100 });
      
      const result = await DataRetentionService.cleanupOldAttendance();
      
      expect(result).toBe(100);
      expect(prisma.attendance.deleteMany).toHaveBeenCalledWith({
        where: {
          date: {
            lt: expect.any(Date),
          },
        },
      });
    });
  });

  describe('cleanupOldLibraryTransactions', () => {
    it('should delete completed library transactions older than retention period', async () => {
      (prisma.libraryTransaction.deleteMany as any).mockResolvedValue({ count: 15 });
      
      const result = await DataRetentionService.cleanupOldLibraryTransactions();
      
      expect(result).toBe(15);
      expect(prisma.libraryTransaction.deleteMany).toHaveBeenCalledWith({
        where: {
          updatedAt: {
            lt: expect.any(Date),
          },
          status: {
            in: ['DIKEMBALIKAN', 'TERLAMBAT', 'DITOLAK'],
          },
        },
      });
    });
  });

  describe('cleanupOldSuratIzin', () => {
    it('should delete approved/rejected surat izin older than retention period', async () => {
      (prisma.suratIzin.deleteMany as any).mockResolvedValue({ count: 3 });
      
      const result = await DataRetentionService.cleanupOldSuratIzin();
      
      expect(result).toBe(3);
      expect(prisma.suratIzin.deleteMany).toHaveBeenCalledWith({
        where: {
          updatedAt: {
            lt: expect.any(Date),
          },
          status: {
            in: ['DISETUJUI', 'DITOLAK'],
          },
        },
      });
    });
  });

  describe('cleanupOldAssignmentSubmissions', () => {
    it('should delete assignment submissions older than retention period', async () => {
      (prisma.assignmentSubmission.deleteMany as any).mockResolvedValue({ count: 25 });
      
      const result = await DataRetentionService.cleanupOldAssignmentSubmissions();
      
      expect(result).toBe(25);
      expect(prisma.assignmentSubmission.deleteMany).toHaveBeenCalledWith({
        where: {
          submittedAt: {
            lt: expect.any(Date),
          },
        },
      });
    });
  });

  describe('runAllRetentionTasks', () => {
    it('should run all retention tasks and return results', async () => {
      (prisma.sessionToken.deleteMany as any).mockResolvedValue({ count: 5 });
      (prisma.pPDBAuditLog.deleteMany as any).mockResolvedValue({ count: 10 });
      (prisma.pPDBNotification.deleteMany as any).mockResolvedValue({ count: 8 });
      (prisma.attendance.deleteMany as any).mockResolvedValue({ count: 100 });
      (prisma.libraryTransaction.deleteMany as any).mockResolvedValue({ count: 15 });
      (prisma.suratIzin.deleteMany as any).mockResolvedValue({ count: 3 });
      (prisma.assignmentSubmission.deleteMany as any).mockResolvedValue({ count: 25 });
      
      const results = await DataRetentionService.runAllRetentionTasks();
      
      expect(results).toEqual({
        tokenBlacklist: 5,
        ppdbAuditLog: 10,
        ppdbNotification: 8,
        attendance: 100,
        libraryTransaction: 15,
        suratIzin: 3,
        assignmentSubmission: 25,
      });
    });
  });

  describe('getRetentionStats', () => {
    it('should return retention statistics', async () => {
      (prisma.sessionToken.count as any).mockResolvedValue(5);
      (prisma.pPDBAuditLog.count as any).mockResolvedValue(10);
      (prisma.pPDBNotification.count as any).mockResolvedValue(8);
      
      const stats = await DataRetentionService.getRetentionStats();
      
      expect(stats).toEqual({
        tokenBlacklist: 5,
        ppdbAuditLog: 10,
        ppdbNotification: 8,
        config: expect.any(Object),
      });
    });
  });
});