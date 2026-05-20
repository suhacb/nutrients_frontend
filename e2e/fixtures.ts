import { test as base, Page } from '@playwright/test';
import * as path from 'path';

export { expect } from '@playwright/test';

const AUTH_STATE_PATH = path.join(__dirname, '.auth', 'state.json');
const E2E_BACKEND_URL = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:9055';

type Fixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ browser }, use) => {
    await resetDb();
    const context = await browser.newContext({ storageState: AUTH_STATE_PATH });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export async function resetDb(): Promise<void> {
  const res = await fetch(`${E2E_BACKEND_URL}/api/test/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Test-Mode': 'true' },
  });
  if (!res.ok) {
    throw new Error(`DB reset failed: ${res.status}`);
  }
}
