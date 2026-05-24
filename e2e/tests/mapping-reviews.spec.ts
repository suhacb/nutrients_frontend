import { test, expect } from '../fixtures';

test.describe('Admin - mapping reviews', () => {
  test('displays the pending mapping reviews list', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/mapping-reviews');

    await expect(authenticatedPage.locator('.reviews-table')).toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('tr', { hasText: 'Test Nutrient 01' })).toBeVisible({ timeout: 5_000 });
  });

  test('shows empty state when switching to approved tab', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/mapping-reviews');

    await expect(authenticatedPage.locator('.reviews-table')).toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('.toggle-btn', { hasText: 'Approved' }).click();

    await expect(authenticatedPage.locator('.reviews-empty')).toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('.reviews-table')).not.toBeVisible();
  });

  test('rejecting a review removes it from the pending list', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/mapping-reviews');

    await expect(authenticatedPage.locator('tr', { hasText: 'Test Nutrient 01' })).toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('tr', { hasText: 'Test Nutrient 01' })
      .locator('button', { hasText: 'Reject' }).click();

    await expect(authenticatedPage.locator('tr', { hasText: 'Test Nutrient 01' })).not.toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('.reviews-empty')).toBeVisible({ timeout: 5_000 });
  });
});
