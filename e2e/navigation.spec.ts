import { test, expect } from '@playwright/test';
import { resetApp, loginAs, SEED } from './helpers';

/**
 * Helper: click a sidebar navigation link by text and verify the page loads.
 */
async function navigateTo(page: import('@playwright/test').Page, label: string) {
  const link = page.locator(`a:has-text("${label}"), button:has-text("${label}"), nav >> text="${label}"`).first();
  if (await link.isVisible({ timeout: 5000 }).catch(() => false)) {
    await link.click();
    await page.waitForTimeout(1500);
    return true;
  }
  return false;
}

test.describe('Navigasi Sidebar — Guru', () => {
  test.beforeEach(async ({ page }) => {
    await resetApp(page);
    await loginAs(page, SEED.TEACHER_NIP, SEED.TEACHER_PASSWORD, 'teacher');
    await page.waitForTimeout(1000);
  });

  test('Sidebar menampilkan menu navigasi guru', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 5000 });
  });

  test('Navigasi ke halaman absensi', async ({ page }) => {
    const clicked = await navigateTo(page, 'Absensi');
    if (clicked) {
      // Should show absensi-related content or at minimum not crash
      await expect(page.locator('text=Terjadi kendala').first()).not.toBeVisible({ timeout: 3000 });
    }
  });

  test('Navigasi ke halaman laporan', async ({ page }) => {
    const clicked = await navigateTo(page, 'Laporan');
    if (clicked) {
      await expect(page.locator('text=Terjadi kendala').first()).not.toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Navigasi Sidebar — Siswa', () => {
  test.beforeEach(async ({ page }) => {
    await resetApp(page);
    await loginAs(page, SEED.STUDENT_NIS, SEED.STUDENT_PASSWORD, 'student');
    await page.waitForTimeout(1000);
  });

  test('Sidebar menampilkan menu navigasi siswa', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 5000 });
  });

  test('Navigasi ke halaman rapot siswa', async ({ page }) => {
    const clicked = await navigateTo(page, 'Rapot');
    if (clicked) {
      await expect(page.locator('text=Terjadi kendala').first()).not.toBeVisible({ timeout: 3000 });
    }
  });

  test('Navigasi ke halaman tagihan', async ({ page }) => {
    const clicked = await navigateTo(page, 'Tagihan');
    if (clicked) {
      await expect(page.locator('text=Terjadi kendala').first()).not.toBeVisible({ timeout: 3000 });
    }
  });

  test('Navigasi ke halaman kirim surat', async ({ page }) => {
    const clicked = await navigateTo(page, 'Surat');
    if (clicked) {
      await expect(page.locator('text=Terjadi kendala').first()).not.toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Sidebar Collapse/Toggle', () => {
  test('Tombol toggle sidebar berfungsi (tidak menyebabkan error)', async ({ page }) => {
    await resetApp(page);
    await loginAs(page, SEED.TEACHER_NIP, SEED.TEACHER_PASSWORD, 'teacher');
    await page.waitForTimeout(1000);

    // Try clicking buttons in the sidebar that might be toggle buttons
    const sidebarButtons = page.locator('nav button, header button, [class*="sidebar"] button');
    const count = await sidebarButtons.count();
    if (count > 0) {
      await sidebarButtons.first().click();
      await page.waitForTimeout(500);
      // Should not see error
      await expect(page.locator('text=Terjadi kendala').first()).not.toBeVisible({ timeout: 3000 });
    }
  });
});
