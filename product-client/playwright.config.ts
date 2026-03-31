import { defineConfig, devices } from '@playwright/test'

const isCI = !!((globalThis as unknown as { process?: { env?: { CI?: string } } }).process?.env?.CI)

export default defineConfig({
  testDir: 'e2e',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  // Run tests sequentially locally so you can watch the flow
  fullyParallel: false,
  // Use a single worker locally for human-observable runs; keep CI unchanged.
  workers: isCI ? undefined : 1,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  use: {
    baseURL: 'http://localhost:5173',
    actionTimeout: 10000,
    // Run headed locally and slow actions so tests look human-paced.
    headless: isCI ? true : false,
    launchOptions: {
      slowMo: isCI ? 0 : 900, // change this value to adjust the speed of actions (e.g., clicks, typing) in non-CI environments
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    timeout: 120 * 1000,
    reuseExistingServer: !isCI,
  },
})
