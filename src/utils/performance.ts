import { logger } from './logger';

/**
 * Performance Monitor untuk melacak performa aplikasi
 * Menangani Web Vitals, waktu load halaman, dan performa komponen
 */
export class PerformanceMonitor {
  private static initialized = false;
  private static metrics: Map<string, number> = new Map();

  /**
   * Inisialisasi performance monitor
   */
  static init(): void {
    if (this.initialized) {
      logger.warn('PerformanceMonitor sudah diinisialisasi');
      return;
    }

    // Track page load time
    if (document.readyState === 'complete') {
      this.trackPageLoad();
    } else {
      window.addEventListener('load', () => this.trackPageLoad());
    }

    // Track Web Vitals jika API tersedia
    this.trackWebVitals();

    // Track navigation timing
    this.trackNavigationTiming();

    this.initialized = true;
    logger.log('PerformanceMonitor diinisialisasi');
  }

  /**
   * Track waktu load halaman
   */
  static trackPageLoad(): void {
    try {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (!perfData) {
        logger.warn('Navigation timing data tidak tersedia');
        return;
      }

      const metrics = {
        // Timing utama
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart,
        
        // Timing detail
        dnsLookup: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcpConnection: perfData.connectEnd - perfData.connectStart,
        requestTime: perfData.responseEnd - perfData.requestStart,
        domProcessing: perfData.domComplete - perfData.domInteractive,
        
        // Resource timing
        redirectTime: perfData.redirectEnd - perfData.redirectStart,
        unloadTime: perfData.unloadEventEnd - perfData.unloadEventStart,
      };

      // Simpan metrics
      Object.entries(metrics).forEach(([key, value]) => {
        this.metrics.set(key, value);
      });

      logger.log('Page Load Metrics:', metrics);

      // Log warning jika load time terlalu lambat
      if (metrics.loadComplete > 3000) {
        logger.warn(`Page load time lambat: ${metrics.loadComplete}ms`);
      }
    } catch (error) {
      logger.error('Gagal track page load:', error);
    }
  }

  /**
   * Track Web Vitals (Core Web Vitals)
   */
  static trackWebVitals(): void {
    try {
      // LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1] as PerformanceEntry;
          logger.log('LCP:', lcp.startTime);
          this.metrics.set('LCP', lcp.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as { processingStart: number; startTime: number };
            logger.log('FID:', fidEntry.processingStart - fidEntry.startTime);
            this.metrics.set('FID', fidEntry.processingStart - fidEntry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let clsValue = 0;
          entries.forEach((entry) => {
            const clsEntry = entry as { value: number; hadRecentInput: boolean };
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value;
            }
          });
          logger.log('CLS:', clsValue);
          this.metrics.set('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }
    } catch (error) {
      logger.error('Gagal track Web Vitals:', error);
    }
  }

  /**
   * Track navigation timing
   */
  static trackNavigationTiming(): void {
    try {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (!perfData) return;

      const navigationMetrics = {
        fetchStart: perfData.fetchStart,
        domainLookupStart: perfData.domainLookupStart,
        domainLookupEnd: perfData.domainLookupEnd,
        connectStart: perfData.connectStart,
        connectEnd: perfData.connectEnd,
        requestStart: perfData.requestStart,
        responseStart: perfData.responseStart,
        responseEnd: perfData.responseEnd,
        domInteractive: perfData.domInteractive,
        domContentLoadedEventStart: perfData.domContentLoadedEventStart,
        domContentLoadedEventEnd: perfData.domContentLoadedEventEnd,
        domComplete: perfData.domComplete,
        loadEventStart: perfData.loadEventStart,
        loadEventEnd: perfData.loadEventEnd,
      };

      logger.log('Navigation Timing:', navigationMetrics);
    } catch (error) {
      logger.error('Gagal track navigation timing:', error);
    }
  }

  /**
   * Track performa komponen (manual call)
   */
  static trackComponentRender(componentName: string, renderTime: number): void {
    this.metrics.set(`component_${componentName}`, renderTime);
    
    if (renderTime > 100) {
      logger.warn(`Component ${componentName} render lambat: ${renderTime}ms`);
    } else {
      logger.log(`Component ${componentName} render: ${renderTime}ms`);
    }
  }

  /**
   * Mulai timing untuk operasi tertentu
   */
  static startTiming(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.metrics.set(operation, duration);
      logger.log(`${operation}: ${duration.toFixed(2)}ms`);
      
      return duration;
    };
  }

  /**
   * Track resource loading performance
   */
  static trackResourcePerformance(): void {
    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const slowResources = resources.filter(
        (resource) => resource.duration > 1000
      );

      if (slowResources.length > 0) {
        logger.warn('Slow resources detected:', slowResources.map(r => ({
          name: r.name,
          duration: r.duration,
          size: r.transferSize,
        })));
      }

      const totalTransferSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      logger.log(`Total transfer size: ${(totalTransferSize / 1024).toFixed(2)}KB`);
    } catch (error) {
      logger.error('Gagal track resource performance:', error);
    }
  }

  /**
   * Dapatkan semua metrics yang terkumpul
   */
  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Dapatkan metrics tertentu
   */
  static getMetric(key: string): number | undefined {
    return this.metrics.get(key);
  }

  /**
   * Reset semua metrics
   */
  static resetMetrics(): void {
    this.metrics.clear();
    logger.log('Performance metrics di-reset');
  }

  /**
   * Format durasi ke format yang readable
   */
  static formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms.toFixed(0)}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(0);
      return `${minutes}m ${seconds}s`;
    }
  }

  /**
   * Dapatkan skor performa (0-100)
   */
  static getPerformanceScore(): number {
    try {
      const lcp = this.metrics.get('LCP') || 0;
      const fid = this.metrics.get('FID') || 0;
      const cls = this.metrics.get('CLS') || 0;
      const loadTime = this.metrics.get('loadComplete') || 0;

      // Skor berdasarkan Core Web Vitals
      let score = 100;

      // LCP: baik < 2.5s, perlu perbaikan 2.5-4s, buruk > 4s
      if (lcp > 4000) score -= 30;
      else if (lcp > 2500) score -= 15;

      // FID: baik < 100ms, perlu perbaikan 100-300ms, buruk > 300ms
      if (fid > 300) score -= 20;
      else if (fid > 100) score -= 10;

      // CLS: baik < 0.1, perlu perbaikan 0.1-0.25, buruk > 0.25
      if (cls > 0.25) score -= 20;
      else if (cls > 0.1) score -= 10;

      // Load time: baik < 3s, perlu perbaikan 3-5s, buruk > 5s
      if (loadTime > 5000) score -= 30;
      else if (loadTime > 3000) score -= 15;

      return Math.max(0, score);
    } catch (error) {
      logger.error('Gagal menghitung performance score:', error);
      return 0;
    }
  }

  /**
   * Dapatkan laporan performa yang komprehensif
   */
  static getPerformanceReport(): {
    score: number;
    metrics: Record<string, number>;
    recommendations: string[];
  } {
    const score = this.getPerformanceScore();
    const metrics = this.getMetrics();
    const recommendations: string[] = [];

    // Generate rekomendasi berdasarkan metrics
    const lcp = metrics.LCP || 0;
    if (lcp > 4000) {
      recommendations.push('LCP terlalu lambat. Pertimbangkan untuk mengoptimasi loading resource utama.');
    } else if (lcp > 2500) {
      recommendations.push('LCP bisa ditingkatkan dengan optimasi loading resource.');
    }

    const fid = metrics.FID || 0;
    if (fid > 300) {
      recommendations.push('FID terlalu tinggi. Kurangi JavaScript execution time.');
    } else if (fid > 100) {
      recommendations.push('FID bisa ditingkatkan dengan code splitting.');
    }

    const cls = metrics.CLS || 0;
    if (cls > 0.25) {
      recommendations.push('CLS terlalu tinggi. Pastikan ukuran elemen sudah ditentukan.');
    } else if (cls > 0.1) {
      recommendations.push('CLS bisa ditingkatkan dengan menghindari pergeseran layout.');
    }

    const loadTime = metrics.loadComplete || 0;
    if (loadTime > 5000) {
      recommendations.push('Load time terlalu lambat. Pertimbangkan untuk mengoptimasi bundle size.');
    } else if (loadTime > 3000) {
      recommendations.push('Load time bisa ditingkatkan dengan lazy loading.');
    }

    return {
      score,
      metrics,
      recommendations,
    };
  }

  /**
   * Cleanup
   */
  static destroy(): void {
    if (!this.initialized) return;

    this.resetMetrics();
    this.initialized = false;
    logger.log('PerformanceMonitor dihancurkan');
  }
}

/**
 * Helper function untuk measure performa komponen React
 */
export function usePerformanceMeasure(componentName: string) {
  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;

  return {
    start: () => performance.mark(startMark),
    end: () => {
      performance.mark(endMark);
      performance.measure(componentName, startMark, endMark);
      
      const measure = performance.getEntriesByName(componentName)[0];
      if (measure) {
        PerformanceMonitor.trackComponentRender(componentName, measure.duration);
      }
      
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(componentName);
    },
  };
}