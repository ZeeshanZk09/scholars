import { test, expect, type Page } from "@playwright/test";

const ADMIN_EMAIL = "admin@scholarschool.edu.pk";
const ADMIN_PASSWORD = "Admin@12345";

async function login(page: Page): Promise<void> {
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  await Promise.all([
    page.waitForURL("/admin"),
    page.click('button[type="submit"]'),
  ]);
}

test.describe("Admin journey (Phase 25)", () => {
  test("unauthenticated /admin redirects to login", async ({ page }) => {
    const response = await page.goto("/admin", { waitUntil: "networkidle" });

    // Unauthenticated access must never reach the dashboard.
    await expect(page).toHaveURL(/\/auth\/login/);
    expect(response?.status()).toBe(200);
  });

  test("login -> dashboard -> logout", async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL("/admin");
    await expect(page.locator("text=Scholar School Admin")).toBeVisible();

    const roleBadge = page.locator("body", { hasText: /SUPER_ADMIN|ADMIN/i });
    await expect(roleBadge).toBeVisible();

    await page.click("text=Logout");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("authenticated admin can publish a blog and it appears publicly", async ({
    page,
  }) => {
    await login(page);
    await expect(page).toHaveURL("/admin");

    const title = `E2E Post ${Date.now()}`;
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const create = await page.request.post("/api/v1/admin/blogs", {
      data: {
        title,
        slug,
        excerpt: "Created by end-to-end test.",
        content: "<p>End-to-end blog content.</p>",
        status: "PUBLISHED",
      },
    });

    expect(create.status(), "Blog create response").toBe(201);

    const publicPage = await page.context().newPage();
    await publicPage.goto("/blogs");
    await expect(publicPage.locator("article")).toHaveCount(0);
    await expect(publicPage.locator(`a[href="/blogs/${slug}"]`)).toBeVisible();

    await publicPage.goto(`/blogs/${slug}`);
    await expect(publicPage).toHaveURL(`/blogs/${slug}`);
    await expect(publicPage.locator("article h1")).toContainText(title);
  });

  test("insufficient role is forbidden from privileged admin APIs (RBAC)", async ({
    page,
  }) => {
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', "editor@scholarschool.edu.pk");
    await page.fill('input[name="password"]', "Editor@123");
    await Promise.all([
      page.waitForURL("/admin"),
      page.click('button[type="submit"]'),
    ]);

    // An authenticated EDITOR can enter the dashboard (authenticated) but the
    // Users API requires the USER permission, which only SUPER_ADMIN/ADMIN hold.
    await expect(page).toHaveURL("/admin");
    const usersApi = await page.request.get("/api/v1/admin/users");
    expect(usersApi.status()).toBe(403);
  });
});
