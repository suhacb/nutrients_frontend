import { test, expect } from '../fixtures';

test.describe('Authentication', () => {
  test('redirects unauthenticated users to /welcome', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/welcome/);
  });

  test('loads the home page when authenticated via localStorage tokens', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    await expect(authenticatedPage.getByText('home works!')).toBeVisible({ timeout: 10_000 });
    await expect(authenticatedPage).toHaveURL('/');
  });

  test('isLoggedIn is true on home page for an authenticated user', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    await expect(authenticatedPage.getByText('isLoggedIn: true')).toBeVisible({ timeout: 10_000 });
  });
});
