/**
 * Performance metrics store untuk monitoring aplikasi.
 * Menyimpan data request dalam memori (ring buffer) untuk analisis performa.
 */

export interface RouteMetrics {
  count: number;
  totalDuration: number;
  minDuration: number;
  maxDuration: number;
  errorCount: number;
  lastDuration: number;
}

export interface RequestRecord {
  method: string;
  path: string;
  duration: number;
  statusCode: number;
  timestamp: number;
}

export interface PerformanceSnapshot {
  startedAt: number;
  uptime: number;
  totalRequests: number;
  totalErrors: number;
  slowRequestCount: number;
  averageResponseTime: number;
  slowThresholdMs: number;
  routes: Record<string, RouteMetrics>;
  recentRequests: RequestRecord[];
}

const DEFAULT_SLOW_THRESHOLD_MS = 1000;
const MAX_RECENT_REQUESTS = 100;

/**
 * In-memory performance metrics store
 */
export class PerformanceMetricsStore {
  private startedAt: number;
  private routes: Map<string, RouteMetrics>;
  private recentRequests: RequestRecord[];
  private slowRequestCount: number;
  private slowThresholdMs: number;

  constructor(slowThresholdMs: number = DEFAULT_SLOW_THRESHOLD_MS) {
    this.startedAt = Date.now();
    this.routes = new Map();
    this.recentRequests = [];
    this.slowRequestCount = 0;
    this.slowThresholdMs = slowThresholdMs;
  }

  /**
   * Get or initialize route metrics bucket
   */
  private getRouteMetrics(key: string): RouteMetrics {
    let metrics = this.routes.get(key);
    if (!metrics) {
      metrics = {
        count: 0,
        totalDuration: 0,
        minDuration: Number.POSITIVE_INFINITY,
        maxDuration: 0,
        errorCount: 0,
        lastDuration: 0,
      };
      this.routes.set(key, metrics);
    }
    return metrics;
  }

  /**
   * Record a completed request
   */
  recordRequest(method: string, path: string, duration: number, statusCode: number): void {
    const key = `${method} ${path}`;
    const metrics = this.getRouteMetrics(key);

    metrics.count += 1;
    metrics.totalDuration += duration;
    metrics.minDuration = Math.min(metrics.minDuration, duration);
    metrics.maxDuration = Math.max(metrics.maxDuration, duration);
    metrics.lastDuration = duration;

    if (statusCode >= 400) {
      metrics.errorCount += 1;
    }

    const record: RequestRecord = {
      method,
      path,
      duration,
      statusCode,
      timestamp: Date.now(),
    };

    this.recentRequests.push(record);
    if (this.recentRequests.length > MAX_RECENT_REQUESTS) {
      this.recentRequests.shift();
    }

    if (duration >= this.slowThresholdMs) {
      this.slowRequestCount += 1;
    }
  }

  /**
   * Get a snapshot of all metrics
   */
  getSnapshot(): PerformanceSnapshot {
    const routes: Record<string, RouteMetrics> = {};
    let totalRequests = 0;
    let totalErrors = 0;

    for (const [key, value] of this.routes.entries()) {
      routes[key] = { ...value };
      totalRequests += value.count;
      totalErrors += value.errorCount;
    }

    const now = Date.now();

    return {
      startedAt: this.startedAt,
      uptime: Math.round((now - this.startedAt) / 1000),
      totalRequests,
      totalErrors,
      slowRequestCount: this.slowRequestCount,
      averageResponseTime: totalRequests > 0
        ? Array.from(this.routes.values())
            .reduce((acc, m) => acc + m.totalDuration, 0) / totalRequests
        : 0,
      slowThresholdMs: this.slowThresholdMs,
      routes,
      recentRequests: [...this.recentRequests].reverse(),
    };
  }

  /**
   * Get list of slowest requests (recent)
   */
  getSlowRequests(limit: number = 10): RequestRecord[] {
    return [...this.recentRequests]
      .filter((r) => r.duration >= this.slowThresholdMs)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.routes.clear();
    this.recentRequests = [];
    this.slowRequestCount = 0;
    this.startedAt = Date.now();
  }
}

/**
 * Singleton instance untuk aplikasi
 */
export const performanceMetrics = new PerformanceMetricsStore();

export { DEFAULT_SLOW_THRESHOLD_MS, MAX_RECENT_REQUESTS };
