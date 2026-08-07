import { logger } from './logger';

/**
 * Storage Manager untuk mengelola localStorage dengan lebih baik
 * Menangani kuota, kompresi, dan cleanup data
 */
export class StorageManager {
  private static readonly QUOTA_LIMIT = 5 * 1024 * 1024; // 5MB
  private static readonly WARNING_THRESHOLD = 4 * 1024 * 1024; // 4MB
  private static readonly CRITICAL_THRESHOLD = 4.5 * 1024 * 1024; // 4.5MB

  /**
   * Cek apakah masih ada ruang di localStorage
   */
  static checkQuota(): { available: boolean; used: number; percentage: number } {
    try {
      const used = this.getUsedSpace();
      const percentage = (used / this.QUOTA_LIMIT) * 100;
      const available = used < this.QUOTA_LIMIT;

      if (used > this.WARNING_THRESHOLD) {
        logger.warn(`Storage usage tinggi: ${percentage.toFixed(1)}%`);
      }

      if (used > this.CRITICAL_THRESHOLD) {
        logger.error(`Storage usage kritis: ${percentage.toFixed(1)}%`);
      }

      return { available, used, percentage };
    } catch (error) {
      logger.error('Gagal mengecek storage quota:', error);
      return { available: false, used: 0, percentage: 100 };
    }
  }

  /**
   * Hitung ruang yang digunakan di localStorage
   */
  static getUsedSpace(): number {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          total += (localStorage[key].length + key.length) * 2; // UTF-16 uses 2 bytes per character
        }
      }
      return total;
    } catch (error) {
      logger.error('Gagal menghitung used space:', error);
      return 0;
    }
  }

  /**
   * Simpan data dengan penanganan error yang lebih baik
   */
  static setItem(key: string, value: unknown): boolean {
    try {
      const quotaCheck = this.checkQuota();

      if (!quotaCheck.available) {
        logger.error('Storage penuh, mencoba cleanup...');
        this.cleanupOldEntries();

        // Cek lagi setelah cleanup
        const quotaAfterCleanup = this.checkQuota();
        if (!quotaAfterCleanup.available) {
          throw new Error('Storage penuh setelah cleanup');
        }
      }

      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);

      logger.log(`Data tersimpan: ${key} (${serialized.length} bytes)`);
      return true;
    } catch (error) {
      logger.error(`Gagal menyimpan ${key}:`, error);
      return false;
    }
  }

  /**
   * Ambil data dengan penanganan error
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      logger.error(`Gagal mengambil ${key}:`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Hapus item dari localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      logger.log(`Data dihapus: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Gagal menghapus ${key}:`, error);
      return false;
    }
  }

  /**
   * Hapus semua data dari localStorage
   */
  static clear(): boolean {
    try {
      localStorage.clear();
      logger.log('Semua data localStorage dihapus');
      return true;
    } catch (error) {
      logger.error('Gagal membersihkan localStorage:', error);
      return false;
    }
  }

  /**
   * Cleanup entri lama yang tidak diperlukan
   */
  static cleanupOldEntries(): void {
    try {
      const keysToRemove: string[] = [];
      const now = Date.now();
      const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 hari

      // Daftar key yang tidak boleh dihapus
      const protectedKeys = [
        'absensi_auth',
        'absensi_data',
        'portal_access_token',
        'portal_refresh_token',
      ];

      for (const key in localStorage) {
        if (
          Object.prototype.hasOwnProperty.call(localStorage, key) &&
          !protectedKeys.includes(key)
        ) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsed = JSON.parse(value);

              // Hapus jika memiliki timestamp dan sudah terlalu lama
              if (parsed.createdAt && now - parsed.createdAt > MAX_AGE) {
                keysToRemove.push(key);
              }

              // Hapus cache data sementara
              if (key.startsWith('cache_') || key.startsWith('temp_')) {
                keysToRemove.push(key);
              }
            }
          } catch {
            // Jika tidak bisa parse, hapus saja
            if (!protectedKeys.includes(key)) {
              keysToRemove.push(key);
            }
          }
        }
      }

      // Hapus key yang teridentifikasi
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      if (keysToRemove.length > 0) {
        logger.log(`Cleanup ${keysToRemove.length} entri lama dari localStorage`);
      }
    } catch (error) {
      logger.error('Gagal cleanup old entries:', error);
    }
  }

  /**
   * Kompres data sebelum disimpan (basic compression)
   */
  static compressData(data: unknown): string {
    try {
      const serialized = JSON.stringify(data);

      // Basic compression: hapus whitespace yang tidak perlu
      const compressed = serialized.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1');

      logger.log(`Data dikompresi: ${serialized.length} -> ${compressed.length} bytes`);
      return compressed;
    } catch (error) {
      logger.error('Gagal kompresi data:', error);
      return JSON.stringify(data);
    }
  }

  /**
   * Dapatkan statistik storage
   */
  static getStorageStats(): {
    totalKeys: number;
    usedSpace: number;
    freeSpace: number;
    percentageUsed: number;
    keys: string[];
  } {
    try {
      const keys = Object.keys(localStorage);
      const usedSpace = this.getUsedSpace();
      const freeSpace = this.QUOTA_LIMIT - usedSpace;
      const percentageUsed = (usedSpace / this.QUOTA_LIMIT) * 100;

      return {
        totalKeys: keys.length,
        usedSpace,
        freeSpace,
        percentageUsed,
        keys,
      };
    } catch (error) {
      logger.error('Gagal mendapatkan storage stats:', error);
      return {
        totalKeys: 0,
        usedSpace: 0,
        freeSpace: this.QUOTA_LIMIT,
        percentageUsed: 0,
        keys: [],
      };
    }
  }

  /**
   * Export semua data localStorage (untuk backup)
   */
  static exportData(): Record<string, string> {
    try {
      const data: Record<string, string> = {};
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          data[key] = localStorage[key];
        }
      }
      return data;
    } catch (error) {
      logger.error('Gagal export data:', error);
      return {};
    }
  }

  /**
   * Import data localStorage (untuk restore)
   */
  static importData(data: Record<string, string>): boolean {
    try {
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      logger.log('Data berhasil diimport');
      return true;
    } catch (error) {
      logger.error('Gagal import data:', error);
      return false;
    }
  }

  /**
   * Format bytes ke format yang readable
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
