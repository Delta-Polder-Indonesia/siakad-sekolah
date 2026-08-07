import { MigrationTestingService } from '../src/services/migrationTesting.service.js';
import { logger } from '../src/config/logger.js';
import { flushLogs } from '../src/config/logger.js';

/**
 * Migration Test Runner
 * 
 * This script runs database migration tests to ensure migrations are safe
 * before deploying to production.
 * 
 * Usage:
 * - Development: npm run test-migrations
 * - Pre-deployment: Run this script as part of your CI/CD pipeline
 */

async function main() {
  const testDbName = process.env.TEST_DB_NAME || 'test_portal_siswa';
  
  try {
    logger.info('Starting migration test suite');
    
    // Run the full migration test suite
    const results = await MigrationTestingService.runMigrationTestSuite(testDbName);
    
    logger.info('Migration test suite completed successfully', { results });
    
    // Exit with success code
    await flushLogs();
    process.exit(0);
  } catch (error) {
    logger.error('Migration test suite failed', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Exit with error code
    await flushLogs();
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await flushLogs();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await flushLogs();
  process.exit(0);
});

// Run the migration test runner
main();