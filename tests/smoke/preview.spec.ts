import { test, expect } from '@playwright/test';

test.describe('preview smoke', () => {
  test('loads with no console errors', async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page.locator('.app')).toBeVisible();
    await expect(page.locator('.logo')).toHaveText(/arukone/i);

    await testInfo.attach('viewport.png', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    expect(errors, `console errors:\n${errors.join('\n')}`).toEqual([]);
  });

  test('security headers present', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    const headers = res.headers();
    // Only meaningful when running against the real preview, not local Vite.
    if (process.env.SMOKE_URL) {
      expect(headers['content-security-policy'], 'CSP header').toBeTruthy();
      expect(headers['strict-transport-security'], 'HSTS header').toBeTruthy();
      expect(headers['x-content-type-options']).toBe('nosniff');
    }
  });

  test('difficulty picker switches puzzle', async ({ page }) => {
    await page.goto('/');
    for (const label of ['Easy', 'Medium', 'Hard', 'Extreme']) {
      const btn = page.getByRole('button', { name: new RegExp(`^${label}`, 'i') });
      await btn.click();
      await expect(page.locator('.grid-wrapper')).toBeVisible();
    }
  });

  test('version footer links to release', async ({ page }) => {
    await page.goto('/');
    const versionLink = page.locator('.footer__version');
    await expect(versionLink).toBeVisible();
    const href = await versionLink.getAttribute('href');
    expect(href).toMatch(/github\.com\/arechste\/arukone\/releases\/tag\/v\d+\.\d+\.\d+/);
  });
});
