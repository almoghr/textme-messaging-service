/// <reference types="node" />
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: 'http://localhost:3001',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  webServer: {
    command: 'pnpm run start',
    url: 'http://localhost:3001/api/health',
    reuseExistingServer: !process['env']['CI'],
    timeout: 30000,
  },
});
