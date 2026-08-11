import { prisma } from '../lib/prisma.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

interface SlowQueryInfo {
  queryid: string;
  query: string;
  calls: number;
  total_time: number;
  mean_time: number;
  max_time: number;
  optimizationTips: string[];
}

interface MissingIndexInfo {
  table: string;
  column: string;
  distinctValues: number;
  correlation: number;
  recommendation: string;
}

interface UnusedIndexInfo {
  schema: string;
  table: string;
  index: string;
  recommendation: string;
}

interface TableSizeInfo {
  tablename: string;
  total_size: string;
  index_size: string;
  table_size: string;
}

interface QueryAnalysis {
  slowQueries: SlowQueryInfo[];
  missingIndexes: MissingIndexInfo[];
  unusedIndexes: UnusedIndexInfo[];
  tableSizes: TableSizeInfo[];
  recommendations: string[];
}

/**
 * Query Optimization Service
 * Identifies and provides recommendations for slow queries
 */
export class QueryOptimizationService {
  /**
   * Analisis ini bergantung pada tabel/ekstensi PostgreSQL (pg_stat_statements,
   * pg_stats, pg_tables). Dengan SQLite query berikut tidak akan pernah jalan —
   * deteksi provider agar endpoint admin mengembalikan pesan jelas, bukan
   * error mentah / data kosong yang membingungkan.
   */
  static isPostgresSupported(): boolean {
    const url = env.DATABASE_URL.toLowerCase();
    return !url.startsWith('file:') && !url.startsWith('sqlite:') && !url.endsWith('.db');
  }

  /**
   * Analyze query performance and provide optimization recommendations
   */
  static async analyzeQueryPerformance() {
    try {
      if (!this.isPostgresSupported()) {
        logger.warn('Query optimization tidak didukung dengan database non-PostgreSQL');
        return {
          slowQueries: [],
          missingIndexes: [],
          unusedIndexes: [],
          tableSizes: [],
          recommendations: [
            'Analisis query performance hanya didukung untuk database PostgreSQL.',
          ],
        };
      }

      logger.info('Starting query performance analysis');
      
      const analysis = {
        slowQueries: await this.identifySlowQueries(),
        missingIndexes: await this.identifyMissingIndexes(),
        unusedIndexes: await this.identifyUnusedIndexes(),
        tableSizes: await this.analyzeTableSizes(),
        recommendations: [] as string[],
      };
      
      // Generate recommendations based on analysis
      analysis.recommendations = this.generateRecommendations(analysis);
      
      logger.info('Query performance analysis completed', { 
        slowQueryCount: analysis.slowQueries.length,
        missingIndexCount: analysis.missingIndexes.length,
        recommendationCount: analysis.recommendations.length,
      });
      
      return analysis;
    } catch (error) {
      logger.error('Query performance analysis failed', {
        error: (error as Error).message,
      });
      throw error;
    }
  }
  
  /**
   * Identify slow queries from PostgreSQL statistics
   */
  static async identifySlowQueries() {
    try {
      // Query pg_stat_statements for slow queries
      const slowQueries = await prisma.$queryRaw<Array<{
        queryid: string;
        query: string;
        calls: number;
        total_time: number;
        mean_time: number;
        max_time: number;
      }>>`
        SELECT 
          queryid,
          query,
          calls,
          total_time,
          mean_time,
          max_time
        FROM pg_stat_statements
        WHERE mean_time > 100 -- queries taking more than 100ms on average
        ORDER BY mean_time DESC
        LIMIT 20
      `;
      
      return slowQueries.map(q => ({
        ...q,
        query: this.sanitizeQuery(q.query),
        optimizationTips: this.getQueryOptimizationTips(q.query),
      }));
    } catch (error) {
      logger.warn('Could not identify slow queries (pg_stat_statements may not be enabled)', {
        error: (error as Error).message,
      });
      return [];
    }
  }
  
  /**
   * Identify potentially missing indexes based on query patterns
   */
  static async identifyMissingIndexes() {
    try {
      const missingIndexes = await prisma.$queryRaw<Array<{
        tablename: string;
        attname: string;
        n_distinct: number;
        correlation: number;
      }>>`
        SELECT 
          schemaname || '.' || tablename as tablename,
          attname,
          n_distinct,
          correlation
        FROM pg_stats
        WHERE schemaname = 'public'
          AND n_distinct > 100 -- columns with many distinct values
          AND correlation < 0.1 -- low correlation indicates potential for index
        ORDER BY n_distinct DESC
        LIMIT 20
      `;
      
      return missingIndexes.map(index => ({
        table: index.tablename,
        column: index.attname,
        distinctValues: index.n_distinct,
        correlation: index.correlation,
        recommendation: `Consider adding index on ${index.tablename}.${index.attname}`,
      }));
    } catch (error) {
      logger.warn('Could not identify missing indexes', {
        error: (error as Error).message,
      });
      return [];
    }
  }
  
  /**
   * Identify unused indexes that can be dropped
   */
  static async identifyUnusedIndexes() {
    try {
      const unusedIndexes = await prisma.$queryRaw<Array<{
        schemaname: string;
        tablename: string;
        indexname: string;
        idx_scan: number;
      }>>`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_scan
        FROM pg_stat_user_indexes
        WHERE idx_scan = 0 -- never used
          AND indexname NOT LIKE '%_pkey' -- not primary key
        ORDER BY schemaname, tablename
      `;
      
      return unusedIndexes.map(index => ({
        schema: index.schemaname,
        table: index.tablename,
        index: index.indexname,
        recommendation: `Consider dropping unused index: ${index.indexname}`,
      }));
    } catch (error) {
      logger.warn('Could not identify unused indexes', {
        error: (error as Error).message,
      });
      return [];
    }
  }
  
  /**
   * Analyze table sizes to identify large tables
   */
  static async analyzeTableSizes() {
    try {
      const tableSizes = await prisma.$queryRaw<Array<{
        tablename: string;
        total_size: string;
        index_size: string;
        table_size: string;
      }>>`
        SELECT 
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
          pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
          pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      `;
      
      return tableSizes;
    } catch (error) {
      logger.warn('Could not analyze table sizes', {
        error: (error as Error).message,
      });
      return [];
    }
  }
  
  /**
   * Generate optimization recommendations based on analysis
   */
  static generateRecommendations(analysis: QueryAnalysis) {
    const recommendations: string[] = [];
    
    // Slow query recommendations
    if (analysis.slowQueries.length > 0) {
      recommendations.push(
        `Found ${analysis.slowQueries.length} slow queries. Consider reviewing and optimizing them.`
      );
      analysis.slowQueries.forEach((query: SlowQueryInfo) => {
        if (query.optimizationTips.length > 0) {
          recommendations.push(...query.optimizationTips);
        }
      });
    }
    
    // Missing index recommendations
    if (analysis.missingIndexes.length > 0) {
      recommendations.push(
        `Found ${analysis.missingIndexes.length} potential missing indexes. Consider adding them for better performance.`
      );
    }
    
    // Unused index recommendations
    if (analysis.unusedIndexes.length > 0) {
      recommendations.push(
        `Found ${analysis.unusedIndexes.length} unused indexes. Consider dropping them to improve write performance.`
      );
    }
    
    // Table size recommendations
    const largeTables = analysis.tableSizes.filter((t) => 
      parseInt(t.total_size) > 1000000000 // > 1GB
    );
    if (largeTables.length > 0) {
      recommendations.push(
        `Found ${largeTables.length} large tables (>1GB). Consider partitioning or archiving old data.`
      );
    }
    
    return recommendations;
  }
  
  /**
   * Get optimization tips for specific query patterns
   */
  static getQueryOptimizationTips(query: string): string[] {
    const tips: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    // N+1 query pattern
    if (lowerQuery.includes('select') && lowerQuery.includes('where') && 
        (lowerQuery.match(/select/g) || []).length > 1) {
      tips.push('Potential N+1 query detected. Consider using include/select in Prisma or JOINs.');
    }
    
    // Missing WHERE clause
    if (lowerQuery.includes('select') && !lowerQuery.includes('where') && 
        !lowerQuery.includes('limit')) {
      tips.push('Query without WHERE or LIMIT clause. Consider adding constraints.');
    }
    
    // ORDER BY without index
    if (lowerQuery.includes('order by') && !lowerQuery.includes('where')) {
      tips.push('ORDER BY without WHERE clause. Consider adding index for sorting.');
    }
    
    // LIKE without leading wildcard
    if (lowerQuery.includes('like') && !lowerQuery.includes('like %')) {
      tips.push('LIKE pattern with leading wildcard prevents index usage. Consider full-text search.');
    }
    
    // SELECT *
    if (lowerQuery.includes('select *')) {
      tips.push('SELECT * retrieves all columns. Consider selecting only needed columns.');
    }
    
    return tips;
  }
  
  /**
   * Sanitize query for logging (remove sensitive data)
   */
  static sanitizeQuery(query: string): string {
    // Remove potential sensitive values
    return query
      .replace(/'[^']*'/g, "'XXXX'") // Replace string literals
      .replace(/\b\d+\b/g, 'XXX') // Replace numbers
      .substring(0, 200) + (query.length > 200 ? '...' : ''); // Truncate
  }
  
  /**
   * Enable query statistics tracking
   */
  static async enableQueryStatistics() {
    try {
      if (!this.isPostgresSupported()) {
        logger.warn('pg_stat_statements tidak didukung dengan database non-PostgreSQL');
        return false;
      }

      await prisma.$executeRaw`
        CREATE EXTENSION IF NOT EXISTS pg_stat_statements
      `;
      
      logger.info('pg_stat_statements extension enabled');
      return true;
    } catch (error) {
      logger.error('Failed to enable pg_stat_statements', {
        error: (error as Error).message,
      });
      return false;
    }
  }
  
  /**
   * Validasi bahwa query yang dikirim admin hanya boleh untuk ANALISIS:
   * - Satu statement (tanpa titik koma tambahan)
   * - Tanpa komentar SQL (bisa menyembunyikan statement lain)
   * - Hanya SELECT, atau WITH-query yang MUDAH tidak berisi DML
   */
  static isSafeAnalysisQuery(query: string): boolean {
    if (typeof query !== 'string') return false;

    const trimmed = query.trim().replace(/;+\s*$/, '');
    if (!trimmed) return false;

    // Multi-statement memakai titik koma di tengah → tolak
    if (trimmed.includes(';')) return false;

    // Komentar SQL bisa menyamarkan statement berbahaya → tolak
    if (/--|\/\*/u.test(trimmed)) return false;

    if (/^WITH\b/i.test(trimmed)) {
      // WITH ... SELECT boleh, tetapi WITH ... UPDATE/INSERT/DELETE dilarang
      return !/\b(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE|GRANT|COPY)\b/i.test(trimmed);
    }

    return /^SELECT\b/i.test(trimmed);
  }

  /**
   * Get query execution plan
   */
  static async getQueryExecutionPlan(query: string) {
    try {
      if (!this.isPostgresSupported()) {
        throw new Error('Query execution plan hanya didukung untuk database PostgreSQL');
      }

      const safeQuery = query.trim().replace(/;+\s*$/, '');
      if (!this.isSafeAnalysisQuery(safeQuery)) {
        throw new Error('Hanya query SELECT (satu statement) yang boleh dianalisis.');
      }

      // Keamanan: tanpa ANALYZE (tidak mengeksekusi query target) &
      // dibungkus transaksi yang di-rollback — mustahil memodifikasi data.
      const plan = await prisma.$transaction(async (tx) => {
        return tx.$queryRawUnsafe(`EXPLAIN (FORMAT JSON) ${safeQuery}`);
      });

      return plan;
    } catch (error) {
      logger.error('Failed to get query execution plan', {
        error: (error as Error).message,
      });
      throw error;
    }
  }
  
  /**
   * Optimize specific query with execution plan analysis
   */
  static async optimizeQuery(query: string) {
    try {
      if (!this.isPostgresSupported()) {
        return {
          notSupported: true as const,
          message: 'Fitur ini hanya didukung untuk database PostgreSQL.',
        };
      }

      const executionPlan = await this.getQueryExecutionPlan(query);
      const tips: string[] = [];
      
      // Analyze execution plan for optimization opportunities
      const plan = JSON.parse(JSON.stringify(executionPlan))[0];
      
      if (plan['Execution Time'] > 100) {
        tips.push('Query execution time is high. Consider adding indexes or optimizing joins.');
      }
      
      if (plan['Planning Time'] > 10) {
        tips.push('Query planning time is high. Consider simplifying the query or updating statistics.');
      }
      
      return {
        executionPlan,
        tips,
        originalQuery: this.sanitizeQuery(query),
      };
    } catch (error) {
      logger.error('Query optimization failed', {
        error: (error as Error).message,
      });
      throw error;
    }
  }
}