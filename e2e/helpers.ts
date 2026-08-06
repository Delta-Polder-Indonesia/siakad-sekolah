import { type Page, expect } from '@playwright/test';

/**
 * Navigate to the app and clear localStorage, then reload to get fresh seed data.
 * Must be called after navigation to avoid SecurityError.
 */
export async function resetApp(page: Page) {
  // Navigate to the page so localStorage is accessible, then re-init data
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  // Clear and reload in one step to avoid double load
  await page.evaluate(() => {
    localStorage.clear();
    location.reload();
  });
  // Wait for React app to render and initialize seed data
  await page.waitForTimeout(2000);
}

/**
 * Buka panel login dari header halaman login (LoginPage selalu merender panel
 * tersembunyi di DOM via translate-x-full, jadi harus diklik tombol "Masuk").
 */
export async function openLoginPanel(page: Page) {
  const openBtn = page.locator('button:has-text("Masuk")').first();
  if (await openBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await openBtn.click();
    await page.waitForTimeout(400);
  }
}

/**
 * Login with given credentials.
 *
 * UI login baru: panel sliding + <select id="login-role"> berisi opsi
 * teacher ("Pegawai") / student ("Siswa") / parent ("Orang Tua") / guest
 * ("Tamu"). Admin tidak ada di opsi — login memakai role "Pegawai" dengan
 * kredensial admin (bypass validasi di login page).
 */
export async function loginAs(page: Page, id: string, password: string, role?: 'teacher' | 'student' | 'parent' | 'admin' | 'guest') {
  await openLoginPanel(page);

  const roleSelect = page.locator('#login-role');
  if (role && (await roleSelect.isVisible().catch(() => false))) {
    await roleSelect.selectOption(role === 'admin' ? 'teacher' : role);
    await page.waitForTimeout(200);
  }

  // Tamu: login via Google saja — tidak ada form id/password
  if (role === 'guest') {
    await page.waitForTimeout(300);
    return;
  }

  await page.locator('#login-id').fill(id);
  await page.locator('#login-password').fill(password);

  // Submit via Enter lebih kokoh daripada klik tombol (tombol bisa "di luar
  // viewport" saat panel sedang animasi/belum penuh).
  await page.locator('#login-password').press('Enter');
  await page.waitForTimeout(2000);
}

/**
 * Seed credentials from initial data in core.ts
 */
export const SEED = {
  TEACHER_NIP: '198501012010011001',
  TEACHER_PASSWORD: 'guru123',
  TEACHER_NAME: 'Bapak Andi Pratama',

  STUDENT_NIS: '2024001',
  STUDENT_PASSWORD: 'siswa123',
  STUDENT_NAME: 'Siti Rahma',

  PARENT_NAME: 'Siti Aminah',
  PARENT_PASSWORD: 'ortu123',

  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin123',

  GUEST_NAME: 'Tamu Pengunjung',
  GUEST_ACCESS_CODE: 'TAMU2026',
} as const;

/**
 * Check if a specific user element is visible in the app after login.
 */
export async function expectLoggedInAs(page: Page, name: string) {
  await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 8000 });
}
