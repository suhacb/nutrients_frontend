import { test, expect } from '../fixtures';

test.describe('Admin - diet tags', () => {
  test('displays the diet tags list', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/diet-tags');
    await expect(authenticatedPage.locator('.tags-table')).toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('button', { hasText: 'New tag' })).toBeVisible();
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'Test Vegan' })).toBeVisible();
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'Test Gluten Free' })).toBeVisible();
  });

  test('creates a new diet tag', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/diet-tags');
    await expect(authenticatedPage.locator('.tags-table')).toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('button', { hasText: 'New tag' }).click();
    await expect(authenticatedPage.locator('mat-dialog-container')).toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('mat-dialog-container input[name="name"]').fill('E2E Diet Tag');
    await authenticatedPage.locator('mat-dialog-container button', { hasText: 'Create' }).click();

    await expect(authenticatedPage.locator('mat-dialog-container')).not.toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'E2E Diet Tag' })).toBeVisible({ timeout: 5_000 });
  });

  test('edits an existing diet tag', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/diet-tags');
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'Test Vegan' })).toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('tr', { hasText: 'Test Vegan' })
      .locator('.actions-cell button:not(.delete-btn)').click();
    await expect(authenticatedPage.locator('mat-dialog-container')).toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('mat-dialog-container input[name="name"]'))
      .toHaveValue('Test Vegan', { timeout: 5_000 });

    await authenticatedPage.locator('mat-dialog-container input[name="name"]').fill('Test Vegan Updated');
    await authenticatedPage.locator('mat-dialog-container button', { hasText: 'Save' }).click();

    await expect(authenticatedPage.locator('mat-dialog-container')).not.toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'Test Vegan Updated' }))
      .toBeVisible({ timeout: 5_000 });
  });

  test('deletes a diet tag via confirm dialog', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/diet-tags');
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'Test Vegan' })).toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('tr', { hasText: 'Test Vegan' }).locator('.delete-btn').click();
    await expect(authenticatedPage.locator('mat-dialog-container')).toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('mat-dialog-container'))
      .toContainText('Delete "Test Vegan"');

    await authenticatedPage.locator('mat-dialog-container button', { hasText: 'Delete' }).click();

    await expect(authenticatedPage.locator('mat-dialog-container')).not.toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'Test Vegan' }))
      .not.toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'Test Gluten Free' })).toBeVisible();
  });

  test('cancels delete via confirm dialog', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/diet-tags');
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'Test Vegan' })).toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('tr', { hasText: 'Test Vegan' }).locator('.delete-btn').click();
    await expect(authenticatedPage.locator('mat-dialog-container')).toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('mat-dialog-container button', { hasText: 'Cancel' }).click();

    await expect(authenticatedPage.locator('mat-dialog-container')).not.toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('.tag-name', { hasText: 'Test Vegan' })).toBeVisible({ timeout: 5_000 });
  });
});
