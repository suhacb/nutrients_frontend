import { request } from '@playwright/test';

const E2E_BACKEND_URL = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:9055';

async function globalTeardown() {
  const api = await request.newContext({ baseURL: E2E_BACKEND_URL });
  await api.post('/api/test/teardown', {
    headers: { 'Content-Type': 'application/json', 'X-Test-Mode': 'true' },
    timeout: 30_000,
  });
  await api.dispose();
}

export default globalTeardown;
