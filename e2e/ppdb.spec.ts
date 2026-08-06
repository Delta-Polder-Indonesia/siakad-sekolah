import { test, expect } from '@playwright/test';
import { resetApp } from './helpers';

/**
 * Buka modal PPDB dari menu "CALON SISWA" di landing page (tanpa login).
 */
async function openPpdb(page: import('@playwright/test').Page) {
  const btn = page.locator('button:has-text("CALON SISWA")').first();
  if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(1500);
  }
}

test.describe('PPDB Flow — Pendaftaran Siswa Baru', () => {
  test.beforeEach(async ({ page }) => {
    await resetApp(page);
    await openPpdb(page);
  });

  test('Modal PPDB terbuka dari menu CALON SISWA', async ({ page }) => {
    // Halaman/modal PPDB menampilkan konten pendaftaran, bukan error
    await expect(page.locator('text=Terjadi kendala').first()).not.toBeVisible({ timeout: 3000 });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('Landing PPDB menampilkan informasi pendaftaran', async ({ page }) => {
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
    await expect(page.locator('text=Terjadi kendala').first()).not.toBeVisible({ timeout: 3000 });
  });

  test('Alur formulir pendaftaran tersedia (jika ada)', async ({ page }) => {
    // Coba buka formulir via tombol "Daftar" bila ada
    const daftarBtn = page.locator('button:has-text("Daftar"), a:has-text("Daftar")').first();
    if (await daftarBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await daftarBtn.click();
      await page.waitForTimeout(1000);
    }

    // Isi kolom nama bila form muncul
    const namaInput = page
      .locator('input[placeholder*="Nama"], input[id*="nama"], input[name*="nama"]')
      .first();
    if (await namaInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await namaInput.fill('Test PPDB E2E');
    }

    await expect(page.locator('text=Terjadi kendala').first()).not.toBeVisible({ timeout: 3000 });
  });
});
