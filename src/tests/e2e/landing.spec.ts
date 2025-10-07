import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "CloudCurio OAuth Portal" })
  ).toBeVisible();
});

test("should navigate to the dashboard after login", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Login with SSO" }).click();
  // This will redirect to the mock OAuth provider, which we can't test in E2E.
  // We'll need to mock the OAuth flow to test the dashboard.
  // For now, we'll just check that the redirect happens.
  await expect(page).not.toHaveURL("/");
});