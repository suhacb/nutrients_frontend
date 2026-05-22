import { test, expect } from '../fixtures';

test.describe('Admin - recipes', () => {
  test('displays the recipes list', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/recipes');
    await expect(authenticatedPage).toHaveURL('/admin/recipes');
    await expect(authenticatedPage.locator('.recipes-table')).toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('button', { hasText: 'New recipe' })).toBeVisible();
    await expect(authenticatedPage.locator('.recipe-name', { hasText: 'Test Grilled Chicken with Rice' })).toBeVisible();
  });

  test('creates a new recipe', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/recipes/new');

    await authenticatedPage.locator('input[name="name"]').fill('E2E Test Recipe');
    await authenticatedPage.locator('input[name="portions"]').fill('4');
    await authenticatedPage.locator('button[type="submit"]').click();

    await expect(authenticatedPage).toHaveURL(/\/admin\/recipes\/\d+\/edit/, { timeout: 5_000 });
    await expect(authenticatedPage.locator('input[name="name"]')).toHaveValue('E2E Test Recipe', { timeout: 5_000 });
  });

  test('updates an existing recipe', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/recipes');
    await authenticatedPage.locator('.actions-cell button:not(.delete-btn)').first().click();
    await expect(authenticatedPage).toHaveURL(/\/admin\/recipes\/\d+\/edit/, { timeout: 5_000 });

    const nameInput = authenticatedPage.locator('input[name="name"]');
    await expect(nameInput).not.toHaveValue('', { timeout: 5_000 });
    await nameInput.clear();
    await nameInput.fill('Updated Recipe Name');
    await authenticatedPage.locator('button[type="submit"]').click();

    await expect(authenticatedPage).toHaveURL(/\/admin\/recipes\/\d+\/edit/, { timeout: 5_000 });
    await expect(authenticatedPage.locator('input[name="name"]')).toHaveValue('Updated Recipe Name', { timeout: 5_000 });
  });

  test('deletes a recipe via confirm dialog', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/recipes');
    await expect(authenticatedPage.locator('.recipe-name', { hasText: 'Test Grilled Chicken with Rice' })).toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('tr', {
      has: authenticatedPage.locator('.recipe-name', { hasText: 'Test Grilled Chicken with Rice' }),
    }).locator('.delete-btn').click();
    await authenticatedPage.locator('mat-dialog-container button', { hasText: 'Delete' }).click();

    await expect(authenticatedPage.locator('.recipe-name', { hasText: 'Test Grilled Chicken with Rice' })).not.toBeVisible({ timeout: 5_000 });
  });

  test('attaches an ingredient to a recipe', async ({ authenticatedPage }) => {
    // Create a fresh recipe to avoid duplicate-ingredient conflicts with the seeded recipe
    await authenticatedPage.goto('/admin/recipes/new');
    await authenticatedPage.locator('input[name="name"]').fill('E2E Ingredient Attach Test');
    await authenticatedPage.locator('input[name="portions"]').fill('2');
    await authenticatedPage.locator('button[type="submit"]').click();
    await expect(authenticatedPage).toHaveURL(/\/admin\/recipes\/\d+\/edit/, { timeout: 5_000 });

    const ingSearchInput = authenticatedPage.locator('.add-ing-search input');
    await expect(ingSearchInput).toBeVisible({ timeout: 5_000 });
    await ingSearchInput.fill('chicken');
    await authenticatedPage.locator('.add-ing-search button', { hasText: 'Search' }).click();

    await expect(authenticatedPage.locator('.add-ing-row')).toBeVisible({ timeout: 5_000 });
    await authenticatedPage.locator('.ing-select mat-select').click();
    await authenticatedPage.locator('mat-option').first().click();
    await expect(authenticatedPage.locator('mat-option').first()).not.toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('.add-amount-field input').fill('150');
    await authenticatedPage.locator('.add-unit-field mat-select').click();
    await authenticatedPage.locator('mat-option').first().click();
    await expect(authenticatedPage.locator('mat-option').first()).not.toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('.add-ing-row button', { hasText: 'Add' }).click();

    await expect(authenticatedPage.locator('.ing-table td', { hasText: 'Test Chicken Breast' })).toBeVisible({ timeout: 5_000 });
  });

  test('detaches an ingredient from a recipe', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/recipes');
    await authenticatedPage.locator('.actions-cell button:not(.delete-btn)').first().click();
    await expect(authenticatedPage).toHaveURL(/\/admin\/recipes\/\d+\/edit/, { timeout: 5_000 });

    // Wait for recipe data to load before checking the ingredient table
    await expect(authenticatedPage.locator('input[name="name"]')).not.toHaveValue('', { timeout: 5_000 });
    await expect(authenticatedPage.locator('.ing-table')).toBeVisible({ timeout: 5_000 });
    const rowsBefore = await authenticatedPage.locator('.ing-table tr.mat-mdc-row').count();
    expect(rowsBefore).toBeGreaterThan(0);

    await authenticatedPage.locator('.ing-table .delete-btn').first().click();

    await expect(authenticatedPage.locator('.ing-table tr.mat-mdc-row')).toHaveCount(rowsBefore - 1, { timeout: 5_000 });
  });

  test('edits ingredient pivot amount', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/recipes');
    await authenticatedPage.locator('.actions-cell button:not(.delete-btn)').first().click();
    await expect(authenticatedPage).toHaveURL(/\/admin\/recipes\/\d+\/edit/, { timeout: 5_000 });

    // Wait for recipe data to load before checking the ingredient table
    await expect(authenticatedPage.locator('input[name="name"]')).not.toHaveValue('', { timeout: 5_000 });
    await expect(authenticatedPage.locator('.ing-table')).toBeVisible({ timeout: 5_000 });
    expect(await authenticatedPage.locator('.ing-table tr.mat-mdc-row').count()).toBeGreaterThan(0);

    await authenticatedPage.locator('.ing-table .actions-cell button:not(.delete-btn)').first().click();

    const amountInput = authenticatedPage.locator('.pivot-edit input[type="number"]');
    await expect(amountInput).toBeVisible({ timeout: 5_000 });
    await amountInput.clear();
    await amountInput.fill('999');

    await authenticatedPage.locator('.ing-table .actions-cell button', {
      has: authenticatedPage.locator('mat-icon', { hasText: 'check' }),
    }).click();

    await expect(authenticatedPage.locator('.ing-table td', { hasText: '999' })).toBeVisible({ timeout: 5_000 });
  });

  test('attaches a diet tag to a recipe', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/recipes');
    await expect(authenticatedPage.locator('.recipe-name').first()).toBeVisible({ timeout: 5_000 });
    await authenticatedPage.locator('.actions-cell button:not(.delete-btn)').first().click();
    await expect(authenticatedPage).toHaveURL(/\/admin\/recipes\/\d+\/edit/, { timeout: 5_000 });

    await expect(authenticatedPage.locator('.tag-add-row')).toBeVisible({ timeout: 5_000 });
    const chipsBefore = await authenticatedPage.locator('mat-chip').count();

    await authenticatedPage.locator('.tag-select mat-select').click();
    await authenticatedPage.locator('mat-option').first().click();
    await expect(authenticatedPage.locator('mat-option').first()).not.toBeVisible({ timeout: 5_000 });

    await authenticatedPage.locator('.tag-add-row button', { hasText: 'Add' }).click();

    await expect(authenticatedPage.locator('mat-chip')).toHaveCount(chipsBefore + 1, { timeout: 5_000 });
  });

  test('detaches a diet tag from a recipe', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/recipes');
    await expect(authenticatedPage.locator('.recipe-name').first()).toBeVisible({ timeout: 5_000 });
    await authenticatedPage.locator('.actions-cell button:not(.delete-btn)').first().click();
    await expect(authenticatedPage).toHaveURL(/\/admin\/recipes\/\d+\/edit/, { timeout: 5_000 });

    // Attach a tag first so there is one to remove
    await expect(authenticatedPage.locator('.tag-add-row')).toBeVisible({ timeout: 5_000 });
    const chipsBefore = await authenticatedPage.locator('mat-chip').count();

    await authenticatedPage.locator('.tag-select mat-select').click();
    await authenticatedPage.locator('mat-option').first().click();
    await expect(authenticatedPage.locator('mat-option').first()).not.toBeVisible({ timeout: 5_000 });
    await authenticatedPage.locator('.tag-add-row button', { hasText: 'Add' }).click();

    await expect(authenticatedPage.locator('mat-chip')).toHaveCount(chipsBefore + 1, { timeout: 5_000 });

    // Remove the chip that was just attached (it is the last one in the list)
    await authenticatedPage.locator('mat-chip').last().locator('button').click();

    await expect(authenticatedPage.locator('mat-chip')).toHaveCount(chipsBefore, { timeout: 5_000 });
  });

  test('nutrient profile loads in recipe edit form', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/recipes');
    await authenticatedPage.locator('.actions-cell button:not(.delete-btn)').first().click();
    await expect(authenticatedPage).toHaveURL(/\/admin\/recipes\/\d+\/edit/, { timeout: 5_000 });

    await authenticatedPage.locator('mat-expansion-panel').click();

    await expect(authenticatedPage.locator('.profile-row').first()).toBeVisible({ timeout: 5_000 });
  });
});
