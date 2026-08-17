# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-journey.spec.ts >> Admin journey (Phase 25) >> insufficient role is forbidden from privileged admin APIs (RBAC)
- Location: tests\e2e\admin-journey.spec.ts:64:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/admin" until "load"
  navigated to "http://127.0.0.1:3000/auth/login?email=editor%40scholarschool.edu.pk&password=Editor%40123"
============================================================
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
    - generic [ref=f1e4]:
        - heading "Scholar School" [level=1] [ref=f1e5]
        - paragraph [ref=f1e6]: Sign in to the administration panel.
        - generic [ref=f1e7]:
            - generic [ref=f1e8]:
                - generic [ref=f1e9]: Email
                - textbox "Email" [ref=f1e10]
            - generic [ref=f1e11]:
                - generic [ref=f1e12]: Password
                - textbox "Password" [ref=f1e13]
            - button "Sign in" [ref=f1e14]
    - paragraph [ref=f1e15]: Scholar Higher Secondary School — administration panel
```

# Test source

```ts
  1  | import { test, expect, type Page } from "@playwright/test";
  2  |
  3  | const ADMIN_EMAIL = "admin@scholarschool.edu.pk";
  4  | const ADMIN_PASSWORD = "Admin@12345";
  5  |
  6  | async function login(page: Page): Promise<void> {
  7  |   await page.goto("/auth/login");
  8  |   await page.fill('input[name="email"]', ADMIN_EMAIL);
  9  |   await page.fill('input[name="password"]', ADMIN_PASSWORD);
  10 |   await Promise.all([page.waitForURL("/admin"), page.click('button[type="submit"]')]);
  11 | }
  12 |
  13 | test.describe("Admin journey (Phase 25)", () => {
  14 |   test("unauthenticated /admin redirects to login", async ({ page }) => {
  15 |     const response = await page.goto("/admin", { waitUntil: "networkidle" });
  16 |
  17 |     // Unauthenticated access must never reach the dashboard.
  18 |     await expect(page).toHaveURL(/\/auth\/login/);
  19 |     expect(response?.status()).toBe(200);
  20 |   });
  21 |
  22 |   test("login -> dashboard -> logout", async ({ page }) => {
  23 |     await login(page);
  24 |
  25 |     await expect(page).toHaveURL("/admin");
  26 |     await expect(page.locator("text=Scholar School Admin")).toBeVisible();
  27 |
  28 |     const roleBadge = page.locator("body", { hasText: /SUPER_ADMIN|ADMIN/i });
  29 |     await expect(roleBadge).toBeVisible();
  30 |
  31 |     await page.click("text=Logout");
  32 |     await expect(page).toHaveURL(/\/auth\/login/);
  33 |   });
  34 |
  35 |   test("authenticated admin can publish a blog and it appears publicly", async ({ page }) => {
  36 |     await login(page);
  37 |     await expect(page).toHaveURL("/admin");
  38 |
  39 |     const title = `E2E Post ${Date.now()}`;
  40 |     const slug = title.toLowerCase().replace(/\s+/g, "-");
  41 |
  42 |     const create = await page.request.post("/api/v1/admin/blogs", {
  43 |       data: {
  44 |         title,
  45 |         slug,
  46 |         excerpt: "Created by end-to-end test.",
  47 |         content: '<p>End-to-end blog content.</p>',
  48 |         status: "PUBLISHED",
  49 |       },
  50 |     });
  51 |
  52 |     expect(create.status(), "Blog create response").toBe(201);
  53 |
  54 |     const publicPage = await page.context().newPage();
  55 |     await publicPage.goto("/blogs");
  56 |     await expect(publicPage.locator("article")).toHaveCount(0);
  57 |     await expect(publicPage.locator(`a[href="/blogs/${slug}"]`)).toBeVisible();
  58 |
  59 |     await publicPage.goto(`/blogs/${slug}`);
  60 |     await expect(publicPage).toHaveURL(`/blogs/${slug}`);
  61 |     await expect(publicPage.locator("article h1")).toContainText(title);
  62 |   });
  63 |
  64 |   test("insufficient role is forbidden from privileged admin APIs (RBAC)", async ({ page }) => {
  65 |     await page.goto("/auth/login");
  66 |     await page.fill('input[name="email"]', "editor@scholarschool.edu.pk");
  67 |     await page.fill('input[name="password"]', "Editor@123");
  68 |     await Promise.all([
> 69 |       page.waitForURL("/admin"),
     |            ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  70 |       page.click('button[type="submit"]'),
  71 |     ]);
  72 |
  73 |     // An authenticated EDITOR can enter the dashboard (authenticated) but the
  74 |     // Users API requires the USER permission, which only SUPER_ADMIN/ADMIN hold.
  75 |     await expect(page).toHaveURL("/admin");
  76 |     const usersApi = await page.request.get("/api/v1/admin/users");
  77 |     expect(usersApi.status()).toBe(403);
  78 |   });
  79 | });
  80 |
```
