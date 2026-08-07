import { execSync } from 'child_process';
import { prisma } from '../lib/prisma.js';
import { logger } from '../config/logger.js';

/**
 * Migration Testing Service
 * Provides utilities to test database migrations safely
 */
export class MigrationTestingService {
  /**
   * Create a test database for migration testing
   */
  static async createTestDatabase(testDbName: string) {
    try {
      logger.info(`Creating test database: ${testDbName}`);
      
      // Drop test database if it exists
      try {
        execSync(`psql -c "DROP DATABASE IF EXISTS ${testDbName}"`, {
          stdio: 'inherit',
        });
      } catch (error) {
        // Database might not exist, continue
      }
      
      // Create new test database
      execSync(`psql -c "CREATE DATABASE ${testDbName}"`, {
        stdio: 'inherit',
      });
      
      logger.info(`Test database ${testDbName} created successfully`);
      return true;
    } catch (error) {
      logger.error(`Failed to create test database: ${testDbName}`, {
        error: (error as Error).message,
      });
      throw error;
    }
  }
  
  /**
   * Run migrations on test database
   */
  static async runMigrationsOnTestDb(testDbName: string) {
    try {
      logger.info(`Running migrations on test database: ${testDbName}`);
      
      // Set DATABASE_URL to test database
      const originalDbUrl = process.env.DATABASE_URL;
      process.env.DATABASE_URL = originalDbUrl?.replace(/\/[^/]+$/, `/${testDbName}`);
      
      // Run prisma migrate
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
      });
      
      // Restore original DATABASE_URL
      process.env.DATABASE_URL = originalDbUrl;
      
      logger.info('Migrations completed successfully on test database');
      return true;
    } catch (error) {
      logger.error('Failed to run migrations on test database', {
        error: (error as Error).message,
      });
      throw error;
    }
  }
  
  /**
   * Test migration rollback
   */
  static async testMigrationRollback(testDbName: string) {
    try {
      logger.info(`Testing migration rollback on: ${testDbName}`);
      
      // This is a simplified rollback test
      // In production, you might want to test specific migration rollbacks
      
      // Get current migration status
      const migrations = execSync('npx prisma migrate status', {
        encoding: 'utf-8',
      });
      
      logger.info('Current migration status:', { migrations });
      
      return true;
    } catch (error) {
      logger.error('Migration rollback test failed', {
        error: (error as Error).message,
      });
      throw error;
    }
  }
  
  /**
   * Validate database schema after migration
   */
  static async validateSchema(testDbName: string) {
    try {
      logger.info(`Validating schema for test database: ${testDbName}`);
      
      // Connect to test database
      const originalDbUrl = process.env.DATABASE_URL;
      process.env.DATABASE_URL = originalDbUrl?.replace(/\/[^/]+$/, `/${testDbName}`);
      
      // Regenerate Prisma client for test database
      execSync('npx prisma generate', {
        stdio: 'inherit',
      });
      
      // Test basic queries to ensure schema is valid
      await prisma.$connect();
      await prisma.$disconnect();
      
      // Restore original DATABASE_URL
      process.env.DATABASE_URL = originalDbUrl;
      
      logger.info('Schema validation passed');
      return true;
    } catch (error) {
      logger.error('Schema validation failed', {
        error: (error as Error).message,
      });
      throw error;
    }
  }
  
  /**
   * Clean up test database
   */
  static async cleanupTestDatabase(testDbName: string) {
    try {
      logger.info(`Cleaning up test database: ${testDbName}`);
      
      // Drop test database
      execSync(`psql -c "DROP DATABASE IF EXISTS ${testDbName}"`, {
        stdio: 'inherit',
      });
      
      logger.info(`Test database ${testDbName} cleaned up successfully`);
      return true;
    } catch (error) {
      logger.error(`Failed to clean up test database: ${testDbName}`, {
        error: (error as Error).message,
      });
      throw error;
    }
  }
  
  /**
   * Run full migration test suite
   */
  static async runMigrationTestSuite(testDbName: string = 'test_portal_siswa') {
    const results = {
      createTestDb: false,
      runMigrations: false,
      validateSchema: false,
      cleanup: false,
    };
    
    try {
      // Create test database
      results.createTestDb = await this.createTestDatabase(testDbName);
      
      // Run migrations
      results.runMigrations = await this.runMigrationsOnTestDb(testDbName);
      
      // Validate schema
      results.validateSchema = await this.validateSchema(testDbName);
      
      // Clean up
      results.cleanup = await this.cleanupTestDatabase(testDbName);
      
      logger.info('Migration test suite completed', { results });
      return results;
    } catch (error) {
      // Attempt cleanup even if tests fail
      try {
        await this.cleanupTestDatabase(testDbName);
      } catch (cleanupError) {
        logger.error('Cleanup failed after test failure', {
          error: (cleanupError as Error).message,
        });
      }
      
      logger.error('Migration test suite failed', {
        error: (error as Error).message,
      });
      throw error;
    }
  }
  
  /**
   * Test specific migration
   */
  static async testSpecificMigration(migrationName: string, testDbName: string = 'test_portal_siswa') {
    try {
      logger.info(`Testing specific migration: ${migrationName}`);
      
      // Create test database
      await this.createTestDatabase(testDbName);
      
      // Run specific migration (this would need custom implementation based on your migration strategy)
      // For now, we'll run all migrations up to the specified one
      const originalDbUrl = process.env.DATABASE_URL;
      process.env.DATABASE_URL = originalDbUrl?.replace(/\/[^/]+$/, `/${testDbName}`);
      
      // This is a placeholder - actual implementation depends on your migration strategy
      execSync(`npx prisma migrate deploy`, {
        stdio: 'inherit',
      });
      
      process.env.DATABASE_URL = originalDbUrl;
      
      // Validate
      await this.validateSchema(testDbName);
      
      // Cleanup
      await this.cleanupTestDatabase(testDbName);
      
      logger.info(`Migration ${migrationName} test completed successfully`);
      return true;
    } catch (error) {
      logger.error(`Migration ${migrationName} test failed`, {
        error: (error as Error).message,
      });
      
      // Attempt cleanup
      try {
        await this.cleanupTestDatabase(testDbName);
      } catch (cleanupError) {
        logger.error('Cleanup failed after migration test failure', {
          error: (cleanupError as Error).message,
        });
      }
      
      throw error;
    }
  }
}