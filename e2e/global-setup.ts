import * as fs from 'fs';
import * as path from 'path';
import { request } from '@playwright/test';

const E2E_BACKEND_URL = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:9055';
const AUTH_STATE_PATH = path.join(__dirname, '.auth', 'state.json');
const APP_URL = 'http://localhost:4200';

async function globalSetup() {
  const api = await request.newContext({ baseURL: E2E_BACKEND_URL });

  const setupRes = await api.post('/api/test/setup', {
    headers: { 'Content-Type': 'application/json', 'X-Test-Mode': 'true' },
    timeout: 120_000,
  });
  if (!setupRes.ok()) {
    throw new Error(`E2E setup failed: ${setupRes.status()} ${await setupRes.text()}`);
  }

  const loginRes = await api.post('/api/auth/test-login', {
    headers: { 'Content-Type': 'application/json', 'X-Test-Mode': 'true' },
  });
  if (!loginRes.ok()) {
    throw new Error(`E2E test-login failed: ${loginRes.status()} ${await loginRes.text()}`);
  }
  const tokens = await loginRes.json();

  await api.dispose();

  const localStorage = [
    { name: 'accessToken', value: String(tokens.access_token ?? '') },
    { name: 'tokenType', value: String(tokens.token_type ?? 'Bearer') },
    { name: 'expiresIn', value: String(tokens.expires_in ?? 3600) },
    { name: 'refreshToken', value: String(tokens.refresh_token ?? '') },
    { name: 'refreshExpiresIn', value: String(tokens.refresh_expires_in ?? 3600) },
    { name: 'scope', value: String(tokens.scope ?? '') },
    { name: 'idToken', value: String(tokens.id_token ?? '') },
    { name: 'notBeforePolicy', value: String(tokens.not_before_policy ?? '') },
    { name: 'sessionState', value: String(tokens.session_state ?? '') },
  ];

  fs.mkdirSync(path.dirname(AUTH_STATE_PATH), { recursive: true });
  fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify({
    cookies: [],
    origins: [{ origin: APP_URL, localStorage }],
  }, null, 2));
}

export default globalSetup;
