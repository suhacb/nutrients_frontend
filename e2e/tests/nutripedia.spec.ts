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

  test('selects a nutrient and shows its detail panel', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('vitamins');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 10_000 });
    await firstEntry.click();

    await expect(authenticatedPage).toHaveURL(/\/nutripedia\/nutrients\/\d+/);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 10_000 });
  });

  test('navigates to ingredient tab', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/ingredients');
    await expect(authenticatedPage).toHaveURL('/nutripedia/ingredients');
    await expect(authenticatedPage.locator('app-nutripedia')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Nutripedia - recipes', () => {
  test('selects a recipe and shows its detail panel', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/recipes');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('grilled');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 10_000 });
    await firstEntry.click();

    await expect(authenticatedPage).toHaveURL(/\/nutripedia\/recipes\/\d+/);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 10_000 });
  });

  test('recipe detail shows nutrient profile', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/recipes');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('grilled');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 10_000 });
    await firstEntry.click();

    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 10_000 });
    await expect(authenticatedPage.locator('.profile-list .related-item').first()).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Nutripedia - ingredients', () => {
  test('selects an ingredient and shows its detail panel', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/ingredients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('chicken');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 10_000 });
    await firstEntry.click();

    await expect(authenticatedPage).toHaveURL(/\/nutripedia\/ingredients\/\d+/);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 10_000 });
  });
});
