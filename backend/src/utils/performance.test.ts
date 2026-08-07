import { describe, it, expect, beforeEach } from 'vitest';
import {
  PerformanceMetricsStore,
  DEFAULT_SLOW_THRESHOLD_MS,
  MAX_RECENT_REQUESTS,
} from './performance.js';

describe('PerformanceMetricsStore', () => {
  let store: PerformanceMetricsStore;

  beforeEach(() => {
    store = new PerformanceMetricsStore();
  });

  describe('recordRequest', () => {
    it('should record request metrics by route', () => {
      store.recordRequest('GET', '/api/health', 50, 200);
      store.recordRequest('GET', '/api/health', 150, 200);

      const snapshot = store.getSnapshot();

      expect(snapshot.totalRequests).toBe(2);
      expect(snapshot.routes['GET /api/health']).toBeDefined();
      expect(snapshot.routes['GET /api/health'].count).toBe(2);
      expect(snapshot.routes['GET /api/health'].totalDuration).toBe(200);
      expect(snapshot.routes['GET /api/health'].minDuration).toBe(50);
      expect(snapshot.routes['GET /api/health'].maxDuration).toBe(150);
      expect(snapshot.routes['GET /api/health'].lastDuration).toBe(150);
    });

    it('should track error count for status >= 400', () => {
      store.recordRequest('POST', '/api/auth/login', 30, 401);
      store.recordRequest('POST', '/api/auth/login', 30, 200);

      const snapshot = store.getSnapshot();

      expect(snapshot.totalErrors).toBe(1);
      expect(snapshot.routes['POST /api/auth/login'].errorCount).toBe(1);
    });

    it('should limit recent requests to MAX_RECENT_REQUESTS', () => {
      for (let i = 0; i < MAX_RECENT_REQUESTS + 20; i++) {
        store.recordRequest('GET', '/api/test', 10, 200);
      }

      const snapshot = store.getSnapshot();

      expect(snapshot.recentRequests.length).toBe(MAX_RECENT_REQUESTS);
      expect(snapshot.totalRequests).toBe(MAX_RECENT_REQUESTS + 20);
    });
  });

  describe('slow request tracking', () => {
    it('should count requests at or above the slow threshold', () => {
      store.recordRequest('GET', '/api/slow', 999, 200);
      store.recordRequest('GET', '/api/slow', 1000, 200);
      store.recordRequest('GET', '/api/slow', 1500, 200);

      const snapshot = store.getSnapshot();
      expect(snapshot.slowRequestCount).toBe(2);
    });

    it('should return slow requests sorted by duration', () => {
      store.recordRequest('GET', '/api/a', 2000, 200);
      store.recordRequest('GET', '/api/b', 500, 200);
      store.recordRequest('GET', '/api/c', 3000, 200);

      const slowRequests = store.getSlowRequests();

      expect(slowRequests).toHaveLength(2);
      expect(slowRequests[0].duration).toBe(3000);
      expect(slowRequests[1].duration).toBe(2000);
    });
  });

  describe('average response time', () => {
    it('should calculate the average over all requests', () => {
      store.recordRequest('GET', '/api/a', 100, 200);
      store.recordRequest('GET', '/api/b', 300, 200);

      const snapshot = store.getSnapshot();

      expect(snapshot.averageResponseTime).toBe(200);
    });

    it('should return 0 when no requests recorded', () => {
      const snapshot = store.getSnapshot();
      expect(snapshot.averageResponseTime).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear all metrics', () => {
      store.recordRequest('GET', '/api/a', 100, 200);

      store.reset();

      const snapshot = store.getSnapshot();
      expect(snapshot.totalRequests).toBe(0);
      expect(snapshot.totalErrors).toBe(0);
      expect(snapshot.slowRequestCount).toBe(0);
      expect(Object.keys(snapshot.routes)).toHaveLength(0);
      expect(snapshot.recentRequests).toHaveLength(0);
    });
  });

  describe('constants', () => {
    it('should expose the default slow threshold', () => {
      expect(DEFAULT_SLOW_THRESHOLD_MS).toBe(1000);
    });

    it('should expose the max recent requests limit', () => {
      expect(MAX_RECENT_REQUESTS).toBe(100);
    });
  });
});
