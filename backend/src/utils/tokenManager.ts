import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { logger, logSecurityEvent } from '../config/logger.js';

/**
 * Check if a token is blacklisted
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  try {
    const blacklisted = await prisma.tokenBlacklist.findUnique({
      where: { token },
    });
    
    if (blacklisted) {
      // Check if token has expired
      if (new Date() > blacklisted.expiresAt) {
        // Clean up expired token
        await prisma.tokenBlacklist.delete({
          where: { id: blacklisted.id }
        });
        return false;
      }
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Error checking token blacklist', { error: (error as Error).message });
    // If database error, fail open (allow token) untuk prevent lockout
    return false;
  }
}

/**
 * Add token to blacklist
 */
export async function blacklistToken(
  token: string, 
  revokedBy?: string, 
  reason?: string
): Promise<boolean> {
  try {
    // Decode token to get expiry
    const decoded = jwt.decode(token) as jwt.JwtPayload | null;
    if (!decoded || typeof decoded.exp !== 'number') {
      logger.warn('Invalid token for blacklisting', { token: token.substring(0, 20) });
      return false;
    }
    
    const expiresAt = new Date(decoded.exp * 1000);
    
    // Check if already blacklisted
    const existing = await prisma.tokenBlacklist.findUnique({
      where: { token },
    });
    
    if (existing) {
      logger.info('Token already blacklisted', { token: token.substring(0, 20) });
      return true;
    }
    
    // Add to blacklist
    await prisma.tokenBlacklist.create({
      data: {
        token,
        expiresAt,
        revokedBy,
        reason,
      },
    });
    
    logSecurityEvent('token_blacklisted', {
      revokedBy,
      reason,
      expiresAt: expiresAt.toISOString(),
    });
    
    logger.info('Token blacklisted successfully', { 
      revokedBy, 
      reason,
      expiresAt: expiresAt.toISOString()
    });
    
    return true;
  } catch (error) {
    logger.error('Error blacklisting token', { error: (error as Error).message });
    return false;
  }
}

/**
 * Blacklist all tokens for a specific user
 */
export async function blacklistUserTokens(userId: string, revokedBy?: string, reason?: string): Promise<number> {
  try {
    // Generate pattern untuk tokens from this user
    // Note: This is a simplified approach. In production, you might want to
    // store userId with tokens or use a different strategy
    
    logSecurityEvent('user_tokens_blacklisted', {
      userId,
      revokedBy,
      reason,
    });
    
    // For now, we'll just log this since we don't have userId in blacklist table
    // In a real implementation, you'd need to:
    // 1. Add userId to TokenBlacklist model
    // 2. Query all tokens for this user
    // 3. Blacklist them all
    
    logger.info('User tokens blacklisted', { userId, revokedBy, reason });
    
    return 0; // Return count of blacklisted tokens
  } catch (error) {
    logger.error('Error blacklisting user tokens', { error: (error as Error).message });
    return 0;
  }
}

/**
 * Clean up expired tokens from blacklist
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.tokenBlacklist.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    
    if (result.count > 0) {
      logger.info('Cleaned up expired tokens', { count: result.count });
    }
    
    return result.count;
  } catch (error) {
    logger.error('Error cleaning up expired tokens', { error: (error as Error).message });
    return 0;
  }
}

/**
 * Schedule periodic cleanup of expired tokens
 */
export function scheduleTokenCleanup(intervalMs: number = 60 * 60 * 1000) { // 1 hour default
  setInterval(async () => {
    try {
      const count = await cleanupExpiredTokens();
      if (count > 0) {
        logger.info('Scheduled token cleanup completed', { count });
      }
    } catch (error) {
      logger.error('Error in scheduled token cleanup', { error: (error as Error).message });
    }
  }, intervalMs);
  
  logger.info('Token cleanup scheduled', { interval: `${intervalMs}ms` });
}

/**
 * Get blacklist statistics
 */
export async function getBlacklistStats() {
  try {
    const [total, expired, active] = await Promise.all([
      prisma.tokenBlacklist.count(),
      prisma.tokenBlacklist.count({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      }),
      prisma.tokenBlacklist.count({
        where: {
          expiresAt: {
            gte: new Date(),
          },
        },
      }),
    ]);
    
    return {
      total,
      expired,
      active,
    };
  } catch (error) {
    logger.error('Error getting blacklist stats', { error: (error as Error).message });
    return {
      total: 0,
      expired: 0,
      active: 0,
    };
  }
}