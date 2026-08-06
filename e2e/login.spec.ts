import { test, expect } from '@playwright/test';
import { resetApp, loginAs, openLoginPanel, SEED } from './helpers';

test.describe('Login Flow — Semua Role', () => {
  test.beforeEach(async ({ page }) => {
    await resetApp(page);
    // Ensure we're on the login page
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  });

  test('Guru login sukses dengan NIP dan password', async ({ page }) => {
    await loginAs(page, SEED.TEACHER_NIP, SEED.TEACHER_PASSWORD, 'teacher');
    // Verify teacher sees their dashboard or name
    await expect(page.locator(`text=${SEED.TEACHER_NAME}`).first()).toBeVisible({ timeout: 8000 });
  });

  test('Guru login gagal dengan password salah — tetap di halaman login', async ({ page }) => {
    await loginAs(page, SEED.TEACHER_NIP, 'password_salah', 'teacher');
    // Should show error and stay on login page
    await page.waitForTimeout(1000);
    const pwInput = page.locator('input[type="password"]');
    await expect(pwInput).toBeVisible({ timeout: 5000 });
  });

  test('Siswa login sukses dengan NIS dan password', async ({ page }) => {
    await loginAs(page, SEED.STUDENT_NIS, SEED.STUDENT_PASSWORD, 'student');
    // Verify student sees their name
    await expect(page.locator(`text=${SEED.STUDENT_NAME}`).first()).toBeVisible({ timeout: 8000 });
  });

  test('Orang Tua login sukses dengan nama dan password', async ({ page }) => {
    await loginAs(page, SEED.PARENT_NAME, SEED.PARENT_PASSWORD, 'parent');
    // Verify parent dashboard loads
    await page.waitForTimeout(2000);
    // Check we're not on the login page anymore
    const pwInput = page.locator('input[type="password"]');
    await expect(pwInput).not.toBeVisible({ timeout: 5000 });
  });

  test('Admin login sukses dengan credentials default', async ({ page }) => {
    await loginAs(page, SEED.ADMIN_USERNAME, SEED.ADMIN_PASSWORD, 'admin');
    // Verify admin panel loads
    await page.waitForTimeout(2000);
    const pwInput = page.locator('input[type="password"]');
    await expect(pwInput).not.toBeVisible({ timeout: 5000 });
  });

  test('Tamu dapat memilih role Tamu dan melihat opsi login Google', async ({ page }) => {
    await openLoginPanel(page);
    await page.locator('#login-role').selectOption('guest');
    await page.waitForTimeout(300);
    // Role tamu kini login via Google saja (tidak ada form id/password)
    await expect(page.locator('#login-role')).toHaveValue('guest');
    await expect(
      page.locator('text=Masuk sebagai tamu menggunakan Google').first()
    ).toBeVisible({ timeout: 5000 });
  });
});
