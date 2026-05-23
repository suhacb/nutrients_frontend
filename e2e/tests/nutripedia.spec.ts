import { test, expect } from '../fixtures';

test.describe('Nutripedia - nutrients', () => {
  test('navigates to nutrients page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');
    await expect(authenticatedPage).toHaveURL('/nutripedia/nutrients');
    await expect(authenticatedPage.locator('app-nutripedia')).toBeVisible({ timeout: 5_000 });
  });

  test('shows nutrients after search', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('vitamins');
    await searchInput.press('Enter');

    await expect(authenticatedPage.locator('.pedia-entry').first()).toBeVisible({ timeout: 5_000 });
  });

  test('load more appends additional nutrients', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('test-nutrient');
    await searchInput.press('Enter');

    const loadMoreBtn = authenticatedPage.locator('.load-more');
    await expect(loadMoreBtn).toBeVisible({ timeout: 5_000 });

    const countBefore = await authenticatedPage.locator('.pedia-entry').count();
    await loadMoreBtn.click();

    await expect(authenticatedPage.locator('.pedia-entry')).not.toHaveCount(countBefore, { timeout: 5_000 });
  });

  test('selects a nutrient and shows its detail panel', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('vitamins');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 5_000 });
    await firstEntry.click();

    await expect(authenticatedPage).toHaveURL(/\/nutripedia\/nutrients\/\d+/);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 5_000 });
  });

  test('navigates to a child nutrient via subcategory link', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('vitamins');
    await searchInput.press('Enter');

    const vitaminsEntry = authenticatedPage.locator('.pedia-entry', {
      has: authenticatedPage.locator('.entry-name', { hasText: /^Vitamins$/ }),
    });
    await expect(vitaminsEntry).toBeVisible({ timeout: 5_000 });
    await vitaminsEntry.click();

    const subcategoriesCard = authenticatedPage.locator('.detail-card', { hasText: 'Subcategories' });
    await expect(subcategoriesCard).toBeVisible({ timeout: 5_000 });

    const parentUrl = authenticatedPage.url();
    await subcategoriesCard.locator('.related-link').first().click();

    await expect(authenticatedPage).toHaveURL(/\/nutripedia\/nutrients\/\d+/);
    await expect(authenticatedPage.url()).not.toBe(parentUrl);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 5_000 });
  });

  test('navigates to parent nutrient via breadcrumb', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('fat-soluble');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 5_000 });
    await firstEntry.click();

    const breadcrumb = authenticatedPage.locator('.breadcrumb');
    await expect(breadcrumb).toBeVisible({ timeout: 5_000 });

    const breadcrumbLink = authenticatedPage.locator('.breadcrumb-link').last();
    const parentName = (await breadcrumbLink.textContent())!.trim();
    await breadcrumbLink.click();

    await expect(authenticatedPage).toHaveURL(/\/nutripedia\/nutrients\/\d+/);
    await expect(authenticatedPage.locator('.detail-title')).toHaveText(parentName, { timeout: 5_000 });
  });

  test('direct URL loads nutrient detail without searching', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/nutrients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('vitamins');
    await searchInput.press('Enter');

    await authenticatedPage.locator('.pedia-entry').first().click();
    const detailUrl = authenticatedPage.url();

    await authenticatedPage.goto(detailUrl);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 5_000 });
  });
});

test.describe('Nutripedia - recipes', () => {
  test('shows recipes after search', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/recipes');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('grilled');
    await searchInput.press('Enter');

    await expect(authenticatedPage.locator('.pedia-entry').first()).toBeVisible({ timeout: 5_000 });
  });

  test('selects a recipe and shows its detail panel', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/recipes');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('grilled');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 5_000 });
    await firstEntry.click();

    await expect(authenticatedPage).toHaveURL(/\/nutripedia\/recipes\/\d+/);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 5_000 });
  });

  test('recipe detail shows nutrient profile', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/recipes');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('grilled');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 5_000 });
    await firstEntry.click();

    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('.profile-list .related-item').first()).toBeVisible({ timeout: 5_000 });
  });

  test('direct URL loads recipe detail without searching', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/recipes');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('grilled');
    await searchInput.press('Enter');

    await authenticatedPage.locator('.pedia-entry').first().click();
    const detailUrl = authenticatedPage.url();

    await authenticatedPage.goto(detailUrl);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 5_000 });
    await expect(authenticatedPage.locator('.profile-list .related-item').first()).toBeVisible({ timeout: 5_000 });
  });

  test('switches between nutrient profile total and per-portion views', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/recipes');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('grilled');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 5_000 });
    await firstEntry.click();

    await expect(authenticatedPage.locator('.profile-list .related-item').first()).toBeVisible({ timeout: 5_000 });

    const totalBtn = authenticatedPage.locator('.toggle-btn', { hasText: 'Total' });
    const perPortionBtn = authenticatedPage.locator('.toggle-btn', { hasText: 'Per portion' });

    await expect(totalBtn).toHaveClass(/active/);
    await perPortionBtn.click();
    await expect(perPortionBtn).toHaveClass(/active/);
    await expect(totalBtn).not.toHaveClass(/active/);
  });
});

test.describe('Nutripedia - ingredients', () => {
  test('navigates to ingredients page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/ingredients');
    await expect(authenticatedPage).toHaveURL('/nutripedia/ingredients');
    await expect(authenticatedPage.locator('app-nutripedia')).toBeVisible({ timeout: 5_000 });
  });

  test('shows ingredients after search', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/ingredients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('chicken');
    await searchInput.press('Enter');

    await expect(authenticatedPage.locator('.pedia-entry').first()).toBeVisible({ timeout: 5_000 });
  });

  test('selects an ingredient and shows its detail panel', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/ingredients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('chicken');
    await searchInput.press('Enter');

    const firstEntry = authenticatedPage.locator('.pedia-entry').first();
    await expect(firstEntry).toBeVisible({ timeout: 5_000 });
    await firstEntry.click();

    await expect(authenticatedPage).toHaveURL(/\/nutripedia\/ingredients\/\d+/);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 5_000 });
  });

  test('direct URL loads ingredient detail without searching', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nutripedia/ingredients');

    const searchInput = authenticatedPage.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('chicken');
    await searchInput.press('Enter');

    await authenticatedPage.locator('.pedia-entry').first().click();
    const detailUrl = authenticatedPage.url();

    await authenticatedPage.goto(detailUrl);
    await expect(authenticatedPage.locator('.detail-title')).toBeVisible({ timeout: 5_000 });
  });
});
