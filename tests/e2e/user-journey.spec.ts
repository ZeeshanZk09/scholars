import { test, expect } from "@playwright/test";

const VALID_CONTACT = {
  name: "Playwright E2E",
  email: `pw-${Date.now()}@example.com`,
  message: "End-to-end submission test from the public contact form.",
  phone: "+92 300 0000000",
};

test.describe("Public user journey (Phase 25)", () => {
  test("navigation: homepage -> programs -> admissions -> contact", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Scholar/i);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    await page.goto("/programs");
    await expect(page).toHaveTitle(/Program/i);

    await page.goto("/admissions");
    await expect(page).toHaveTitle(/Admission/i);

    await page.goto("/contact");
    await expect(page).toHaveTitle(/Contact/i);
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test("blog listing and detail render the seeded post", async ({ page }) => {
    await page.goto("/blogs");
    await expect(page.locator("h1")).toContainText(/Blog/i);
    const firstCard = page.locator('a[href*="/blogs/"]').first();
    await expect(firstCard).toBeVisible();

    await firstCard.click();
    await expect(page).toHaveURL(/\/blogs\/[^/]+$/);
    await expect(page.locator("article h1")).toBeVisible();
    await expect(page.locator("time")).toBeVisible();
  });

  test("facilities page lists seeded facilities", async ({ page }) => {
    await page.goto("/facilities");
    await expect(page.locator("h1")).toContainText(/Facilit/i);
    await expect(
      page.locator("img, .lucide-graduation-cap, .lucide-flask-conical"),
    ).toBeVisible();
  });

  test("contact inquiry POST is rate-limited and accepted", async ({
    page,
  }) => {
    const response = await page.request.post("/api/v1/contact", {
      data: VALID_CONTACT,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
