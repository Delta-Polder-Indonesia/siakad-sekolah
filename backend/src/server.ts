import { env }          from './config/env.js';
import { app }          from './app.js';
import { logger }       from './config/logger.js';
import { scheduleTokenCleanup } from './utils/tokenManager.js';
import { scheduleBackup } from './utils/backup.js';
import { scheduleDataRetention } from './utils/retention.js';

app.listen(env.PORT, () => {
  logger.info(`Backend berjalan di http://localhost:${env.PORT}`, {
    port: env.PORT,
    environment: env.NODE_ENV,
  });
  
  // Schedule token cleanup task (setiap 1 jam)
  scheduleTokenCleanup(60 * 60 * 1000);

  // Schedule data retention (setiap 24 jam)
  scheduleDataRetention(24 * 60 * 60 * 1000);
  
  // Schedule automated backups (setiap 24 jam) jika di production
  if (env.NODE_ENV === 'production') {
    scheduleBackup(24 * 60 * 60 * 1000);
  }
});
