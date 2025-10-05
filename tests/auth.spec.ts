import { test, expect } from '@playwright/test';
import { fork } from 'child_process';
import type { ChildProcess } from 'child_process';

let mockOAuthServer: ChildProcess;

test.beforeAll(async () => {
  mockOAuthServer = fork('tests/mocks/oauth-server.mjs', [], { silent: true });
  await new Promise<void>((resolve) => {
    mockOAuthServer.stdout?.on('data', (data) => {
      console.log(`Mock OAuth Server: ${data}`);
      if (data.toString().includes('listening on port')) {
        resolve();
      }
    });
  });
});

test.afterAll(() => {
  mockOAuthServer.kill();
});

test.describe('Authentication Flow', () => {
  test('Successful login flow', async ({ page, context }) => {
    // 1. Navigate to the home page.
    await page.goto('/');

    // 2. Click the "Sign in with OAuth Provider" button.
    await page.getByRole('link', { name: /Sign in with OAuth Provider/i }).click();

    // 3. Wait for the redirect to the dashboard.
    await page.waitForURL('/dashboard');

    // 4. Verify that the user is on the dashboard and their name is displayed.
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome, Test User')).toBeVisible();

    // 5. Verify that a session cookie has been set.
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'session');
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).not.toBe('');
  });

  test('Successful logout flow', async ({ page, context }) => {
    // First, complete the login flow to establish a session.
    await page.goto('/');
    await page.getByRole('link', { name: /Sign in with OAuth Provider/i }).click();
    await page.waitForURL('/dashboard');

    // 2. Click the logout button.
    await page.getByRole('link', { name: /logout/i }).click();

    // 3. Wait for the redirect to the home page.
    await page.waitForURL('/');

    // 4. Verify that the user is on the home page and the login card is visible.
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Welcome Back')).toBeVisible();

    // 5. Verify that the session cookie has been destroyed.
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'session');
    expect(sessionCookie).toBeUndefined();
  });
});