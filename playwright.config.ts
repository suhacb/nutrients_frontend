import { defineConfig, devices } from '@playwright/test';

const E2E_APP_URL = 'http://localhost:4200';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: E2E_APP_URL,
    trace: 'on-first-retry',
    actionTimeout: 10_000,
  },
  globalSetup: './e2e/global-setup',
  globalTeardown: './e2e/global-teardown',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'ng serve --configuration e2e --port 4200',
    url: E2E_APP_URL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
