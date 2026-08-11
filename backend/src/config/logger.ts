import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import type { Request, Response, NextFunction } from 'express';
import { env } from './env.js';

/**
 * Format log message with timestamp and context
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Create daily rotating file transport for application logs
 */
const applicationLogTransport = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  format: logFormat,
});

/**
 * Create daily rotating file transport for error logs
 */
const errorLogTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: logFormat,
});

/**
 * Console transport for development
 */
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `${timestamp} [${level}]: ${message} ${metaStr}`;
    })
  ),
});

/**
 * Main logger instance
 */
export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    applicationLogTransport,
    errorLogTransport,
    ...(env.NODE_ENV === 'development' ? [consoleTransport] : []),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ],
});

/**
 * Create a child logger untuk specific context
 */
export function createChildLogger(context: string) {
  return logger.child({ context });
}

/**
 * Stream untuk morgan HTTP request logger
 */
export const httpLogStream = {
  write: (message: string) => {
    logger.info(message);
  },
};

/**
 * Log request information
 */
export function logRequest(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });
  
  next();
}

/**
 * Log error dengan additional context
 */
export function logError(error: Error, context?: Record<string, unknown>) {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    ...context,
  });
}

/**
 * Error alerting.
 * Mengirim alert ke transport error level + webhook opsional (jika diatur)
 * agar tim bisa merespons kegagalan kritis lebih cepat.
 */
const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL;

export async function sendErrorAlert(
  alertType: string,
  message: string,
  details?: Record<string, unknown>
) {
  const payload = {
    alert: alertType,
    message,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    ...details,
  };

  logger.error(`ALERT: ${alertType} - ${message}`, payload);

  if (ALERT_WEBHOOK_URL) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch(ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);
    } catch (err) {
      logger.error('Failed to send alert to webhook', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

/**
 * Log security events
 */
export function logSecurityEvent(event: string, details: Record<string, unknown>) {
  logger.warn('Security Event', {
    event,
    ...details,
  });
}

/**
 * Log database operations
 */
export function logDatabaseOperation(operation: string, details: Record<string, unknown>) {
  logger.debug('Database Operation', {
    operation,
    ...details,
  });
}

/**
 * Custom HTTP Transport untuk Log Aggregation
 * Mengirim logs ke external log aggregation service (ELK, Splunk, dll)
 */
interface LogInfo {
  timestamp?: string;
  [key: string]: unknown;
}

class HttpLogTransport {
  private endpoint: string;
  private apiKey?: string;
  private batchSize: number;
  private batch: LogInfo[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(options?: {
    host?: string;
    port?: number;
    path?: string;
    apiKey?: string;
    batchSize?: number;
    flushInterval?: number;
  }) {
    const host = options?.host || process.env.LOG_AGGREGATION_HOST;
    const port = options?.port || parseInt(process.env.LOG_AGGREGATION_PORT || '443');
    const path = options?.path || process.env.LOG_AGGREGATION_PATH || '/api/logs';
    const protocol = port === 443 ? 'https' : 'http';
    
    this.endpoint = host ? `${protocol}://${host}:${port}${path}` : '';
    this.apiKey = options?.apiKey || process.env.LOG_AGGREGATION_API_KEY;
    this.batchSize = options?.batchSize || 10;
    
    // Auto-flush setiap 30 detik
    this.flushInterval = setInterval(() => {
      this.flush();
    }, options?.flushInterval || 30000);
  }

  log(info: LogInfo, callback: () => void) {
    if (!this.endpoint) {
      callback();
      return;
    }

    setImmediate(() => {
      this.batch.push({
        ...info,
        timestamp: info.timestamp || new Date().toISOString(),
        environment: env.NODE_ENV,
        hostname: process.env.HOSTNAME || 'localhost',
      });

      if (this.batch.length >= this.batchSize) {
        this.flush();
      }

      callback();
    });
  }

  async flush() {
    if (this.batch.length === 0) return;

    const logsToSend = [...this.batch];
    this.batch = [];

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({ logs: logsToSend }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP log aggregation failed: ${response.status}`);
      }
    } catch (error) {
      // Fallback: log ke console jika aggregation gagal
      console.error('Failed to send logs to aggregation service:', error);
      // Re-add batch untuk retry
      this.batch = [...logsToSend, ...this.batch];
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

/**
 * Log aggregation configuration
 */
const logAggregationEnabled = process.env.LOG_AGGREGATION_ENABLED === 'true';
const logAggregationTransport = logAggregationEnabled
  ? new HttpLogTransport({
      host: process.env.LOG_AGGREGATION_HOST,
      port: parseInt(process.env.LOG_AGGREGATION_PORT || '443'),
      path: process.env.LOG_AGGREGATION_PATH || '/api/logs',
      apiKey: process.env.LOG_AGGREGATION_API_KEY,
      batchSize: parseInt(process.env.LOG_BATCH_SIZE || '10'),
      flushInterval: parseInt(process.env.LOG_FLUSH_INTERVAL || '30000'),
    })
  : null;

/**
 * Enhanced logger wrapper untuk log aggregation
 */
export const aggregationLogger = {
  info: (message: string, ...meta: unknown[]) => {
    logger.info(message, ...meta);
    if (logAggregationTransport) {
      logAggregationTransport.log({ level: 'info', message, meta }, () => {});
    }
  },
  error: (message: string, ...meta: unknown[]) => {
    logger.error(message, ...meta);
    if (logAggregationTransport) {
      logAggregationTransport.log({ level: 'error', message, meta }, () => {});
    }
  },
  warn: (message: string, ...meta: unknown[]) => {
    logger.warn(message, ...meta);
    if (logAggregationTransport) {
      logAggregationTransport.log({ level: 'warn', message, meta }, () => {});
    }
  },
  debug: (message: string, ...meta: unknown[]) => {
    logger.debug(message, ...meta);
    if (logAggregationTransport) {
      logAggregationTransport.log({ level: 'debug', message, meta }, () => {});
    }
  },
};

/**
 * Function untuk manual flush logs sebelum shutdown
 */
export async function flushLogs() {
  if (logAggregationTransport) {
    await logAggregationTransport.flush();
  }
}

/**
 * Function untuk query logs dari local storage (untuk debugging)
 */
export function queryLogs(options: {
  level?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  // Implementasi sederhana untuk query logs dari file system
  // Untuk production, gunakan log aggregation service query API
  const {
    level,
    startDate,
    endDate,
    limit = 100,
  } = options;

  // Return metadata tentang query
  return {
    level,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    limit,
    message: 'Log query feature available via log aggregation service',
  };
}

/**
 * Log aggregation health check
 */
export async function checkLogAggregationHealth() {
  if (!logAggregationTransport) {
    return {
      status: 'disabled',
      message: 'Log aggregation is not enabled',
    };
  }

  try {
    const endpoint = process.env.LOG_AGGREGATION_ENDPOINT;
    if (!endpoint) {
      return {
        status: 'misconfigured',
        message: 'LOG_AGGREGATION_ENDPOINT not set',
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(endpoint.replace(/\/$/, '') + '/health', {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      return {
        status: 'healthy',
        message: 'Log aggregation service is reachable',
      };
    } else {
      return {
        status: 'unhealthy',
        message: `Log aggregation service returned ${response.status}`,
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Cannot reach log aggregation service: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}