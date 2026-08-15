import { test, expect } from "@playwright/test";

test("homepage loads successfully", async ({ page }) => {
  await page.goto("/");

  // Wait for the page to be loaded
  await expect(page).toHaveTitle(/Scholar/);

  // Check if primary navigation is visible
  const nav = page.locator("nav");
  await expect(nav).toBeVisible();

  // Look for key sections
  const header = page.locator("header");
  await expect(header).toBeVisible();

  const footer = page.locator("footer");
  await expect(footer).toBeVisible();
});
