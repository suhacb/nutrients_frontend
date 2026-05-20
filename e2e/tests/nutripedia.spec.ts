import { test, expect } from '../fixtures';

test.describe('Nutripedia - nutrients', () => {
  test('navigates to nutrients page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');
    await expect(authenticatedPage).toHaveURL('/nutripedia/nutrients');
    await expect(authenticatedPage.locator('app-nutripedia')).toBeVisible({ timeout: 10_000 });
  });

  test('shows nutrients after search', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('vitamins');
    await searchInput.press('Enter');

    await expect(authenticatedPage.locator('.pedia-entry').first()).toBeVisible({ timeout: 10_000 });
  });

  test('navigates to ingredient tab', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/ingredients');
    await expect(authenticatedPage).toHaveURL('/nutripedia/ingredients');
    await expect(authenticatedPage.locator('app-nutripedia')).toBeVisible({ timeout: 10_000 });
  });
});
