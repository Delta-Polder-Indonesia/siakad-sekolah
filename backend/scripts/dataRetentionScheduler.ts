import { runScheduledDataRetention } from '../src/services/dataRetention.service.js';
import { logger } from '../src/config/logger.js';
import { flushLogs } from '../src/config/logger.js';

/**
 * Data Retention Scheduler
 * 
 * This script is designed to be run periodically (e.g., daily or weekly)
 * to automatically clean up old data based on retention policies.
 * 
 * Usage:
 * - Development: npm run data-retention
 * - Production: Set up a cron job to run this script
 * 
 * Cron examples:
 * - Daily at 2 AM: 0 2 * * * cd /path/to/backend && npm run data-retention
 * - Weekly on Sunday at 3 AM: 0 3 * * 0 cd /path/to/backend && npm run data-retention
 */

async function main() {
  try {
    logger.info('Data retention scheduler started');
    
    // Run the data retention tasks
    const results = await runScheduledDataRetention();
    
    logger.info('Data retention scheduler completed successfully', { results });
    
    // Flush logs before exit
    await flushLogs();
    
    process.exit(0);
  } catch (error) {
    logger.error('Data retention scheduler failed', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Flush logs before exit
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

// Run the scheduler
main();