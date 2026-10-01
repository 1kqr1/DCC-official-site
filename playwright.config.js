import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.spec.js',
    fullyParallel: true,
    workers: 2,
    timeout: 30000,
    use: {
        baseURL: 'http://127.0.0.1:5178',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        launchOptions: { timeout: 20000 },
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: process.env.DCC_CHROMIUM_CHANNEL } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
    ],
    webServer: {
        command: 'npm run preview -- --host 127.0.0.1 --port 5178 --strictPort',
        url: 'http://127.0.0.1:5178',
        reuseExistingServer: !process.env.CI,
    },
});
