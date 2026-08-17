# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-journey.spec.ts >> Public user journey (Phase 25) >> facilities page lists seeded facilities
- Location: tests\e2e\user-journey.spec.ts:40:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('img, .lucide-graduation-cap, .lucide-flask-conical')
Expected: visible
Error: strict mode violation: locator('img, .lucide-graduation-cap, .lucide-flask-conical') resolved to 8 elements:
    1) <svg width="24" height="24" fill="none" stroke-width="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="lucide lucide-graduation-cap h-5 w-5">…</svg> aka getByRole('link', { name: 'Scholar Higher Secondary' })
    2) <img loading="lazy" decoding="async" data-nimg="fill" alt="Computer Lab" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" class="object-cover transition-transform duration-300 group-hover:scale-105" src="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2F1e3a5f%2Fffffff%2Fpng%3Ftext%3DComputer%2BLab&w=3840&q=75" srcset="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2F1e3a5f%2Fffffff%2Fpng%3Ftext%3DComputer%2BLab&w=256&q=75 256w, /_next/image?url=https%3A%2F%2Fplacehold.…/> aka getByRole('img', { name: 'Computer Lab' })
    3) <img loading="lazy" decoding="async" data-nimg="fill" alt="Science Lab" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" class="object-cover transition-transform duration-300 group-hover:scale-105" src="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2F0f766e%2Fffffff%2Fpng%3Ftext%3DScience%2BLab&w=3840&q=75" srcset="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2F0f766e%2Fffffff%2Fpng%3Ftext%3DScience%2BLab&w=256&q=75 256w, /_next/image?url=https%3A%2F%2Fplacehold.co%…/> aka getByRole('img', { name: 'Science Lab' })
    4) <svg width="24" height="24" fill="none" stroke-width="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="lucide lucide-flask-conical h-5 w-5">…</svg> aka locator('svg').nth(5)
    5) <img alt="Library" loading="lazy" decoding="async" data-nimg="fill" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" class="object-cover transition-transform duration-300 group-hover:scale-105" src="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2F7c3aed%2Fffffff%2Fpng%3Ftext%3DLibrary&w=3840&q=75" srcset="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2F7c3aed%2Fffffff%2Fpng%3Ftext%3DLibrary&w=256&q=75 256w, /_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2F7c3a…/> aka getByRole('img', { name: 'Library' })
    6) <img loading="lazy" alt="Classrooms" decoding="async" data-nimg="fill" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" class="object-cover transition-transform duration-300 group-hover:scale-105" src="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2F991b1b%2Fffffff%2Fpng%3Ftext%3DClassrooms&w=3840&q=75" srcset="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2F991b1b%2Fffffff%2Fpng%3Ftext%3DClassrooms&w=256&q=75 256w, /_next/image?url=https%3A%2F%2Fplacehold.co%2F800x4…/> aka getByRole('img', { name: 'Classrooms' })
    7) <img loading="lazy" decoding="async" data-nimg="fill" alt="Sports Ground" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" class="object-cover transition-transform duration-300 group-hover:scale-105" src="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2Fb45309%2Fffffff%2Fpng%3Ftext%3DSports%2BGround&w=3840&q=75" srcset="/_next/image?url=https%3A%2F%2Fplacehold.co%2F800x450%2Fb45309%2Fffffff%2Fpng%3Ftext%3DSports%2BGround&w=256&q=75 256w, /_next/image?url=https%3A%2F%2Fplaceho…/> aka getByRole('img', { name: 'Sports Ground' })
    8) <svg width="24" height="24" fill="none" stroke-width="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="lucide lucide-graduation-cap h-5 w-5">…</svg> aka locator('.flex.h-9.w-9.items-center.justify-center.rounded-lg.bg-white\\/10 > .lucide')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('img, .lucide-graduation-cap, .lucide-flask-conical')

```

# Page snapshot

```yaml
- generic [ref=e2]:
    - banner [ref=e3]:
        - generic [ref=e4]:
            - link "Scholar Higher Secondary School home" [ref=e5] [cursor=pointer]:
                - /url: /
                - generic [ref=e10]:
                    - generic [ref=e11]: Scholar
                    - generic [ref=e12]: School & College
            - navigation "Main" [ref=e13]:
                - link "About" [ref=e14] [cursor=pointer]:
                    - /url: /about
                - link "School" [ref=e15] [cursor=pointer]:
                    - /url: /school
                - link "College" [ref=e16] [cursor=pointer]:
                    - /url: /college
                - link "Coaching" [ref=e17] [cursor=pointer]:
                    - /url: /coaching
                - link "Computer Courses" [ref=e18] [cursor=pointer]:
                    - /url: /computer-courses
                - button "Explore" [ref=e19]
                - link "Admissions" [ref=e22] [cursor=pointer]:
                    - /url: /admissions
                - link "Contact" [ref=e23] [cursor=pointer]:
                    - /url: /contact
            - link "Apply Now" [ref=e25] [cursor=pointer]:
                - /url: /admissions/apply
    - main [ref=e26]:
        - generic [ref=e28]:
            - navigation "breadcrumb" [ref=e29]:
                - list [ref=e30]:
                    - listitem [ref=e31]:
                        - link "Home" [ref=e32] [cursor=pointer]:
                            - /url: /
                    - listitem [ref=e33]
                    - listitem [ref=e36]:
                        - link "Campus" [disabled] [ref=e37]
            - paragraph [ref=e38]: Campus
            - heading "Facilities That Support Learning" [level=1] [ref=e39]
            - paragraph [ref=e40]: Purpose-built classrooms, labs and spaces that make learning comfortable, safe and effective.
        - generic [ref=e43]:
            - generic [ref=e44]:
                - img "Computer Lab" [ref=e46]
                - heading "Computer Lab" [level=3] [ref=e51]
                - paragraph [ref=e53]: Modern computer lab facility at Scholar School
            - generic [ref=e54]:
                - img "Science Lab" [ref=e56]
                - heading "Science Lab" [level=3] [ref=e61]
                - paragraph [ref=e63]: Modern science lab facility at Scholar School
            - generic [ref=e64]:
                - img "Library" [ref=e66]
                - heading "Library" [level=3] [ref=e71]
                - paragraph [ref=e73]: Modern library facility at Scholar School
            - generic [ref=e74]:
                - img "Classrooms" [ref=e76]
                - heading "Classrooms" [level=3] [ref=e84]
                - paragraph [ref=e86]: Modern classrooms facility at Scholar School
            - generic [ref=e87]:
                - img "Sports Ground" [ref=e89]
                - heading "Sports Ground" [level=3] [ref=e98]
                - paragraph [ref=e100]: Modern sports ground facility at Scholar School
        - generic [ref=e103]:
            - heading "Visit Our Campus" [level=2] [ref=e104]
            - paragraph [ref=e105]: Book a guided tour to see our classrooms, laboratories and facilities for yourself.
            - generic [ref=e106]:
                - link "Book a Visit" [ref=e107] [cursor=pointer]:
                    - /url: /admissions/apply
                - link "Contact Us" [ref=e108] [cursor=pointer]:
                    - /url: /contact
    - contentinfo [ref=e109]:
        - generic [ref=e111]:
            - generic [ref=e112]:
                - generic [ref=e113]: Scholar
                - paragraph [ref=e119]: Excellence in education, character, and opportunity. A single campus family — school, college, coaching and computer courses.
            - navigation "Quick links" [ref=e120]:
                - heading "Quick Links" [level=2] [ref=e121]
                - list [ref=e122]:
                    - listitem [ref=e123]:
                        - link "About" [ref=e124] [cursor=pointer]:
                            - /url: /about
                    - listitem [ref=e125]:
                        - link "School" [ref=e126] [cursor=pointer]:
                            - /url: /school
                    - listitem [ref=e127]:
                        - link "College" [ref=e128] [cursor=pointer]:
                            - /url: /college
                    - listitem [ref=e129]:
                        - link "Coaching" [ref=e130] [cursor=pointer]:
                            - /url: /coaching
                    - listitem [ref=e131]:
                        - link "Computer Courses" [ref=e132] [cursor=pointer]:
                            - /url: /computer-courses
                    - listitem [ref=e133]:
                        - link "Explore" [ref=e134] [cursor=pointer]:
                            - /url: /programs
                    - listitem [ref=e135]:
                        - link "Admissions" [ref=e136] [cursor=pointer]:
                            - /url: /admissions
                    - listitem [ref=e137]:
                        - link "Contact" [ref=e138] [cursor=pointer]:
                            - /url: /contact
            - navigation "Academics" [ref=e139]:
                - heading "Academics" [level=2] [ref=e140]
                - list [ref=e141]:
                    - listitem [ref=e142]:
                        - link "School" [ref=e143] [cursor=pointer]:
                            - /url: /school
                    - listitem [ref=e144]:
                        - link "College" [ref=e145] [cursor=pointer]:
                            - /url: /college
                    - listitem [ref=e146]:
                        - link "Coaching" [ref=e147] [cursor=pointer]:
                            - /url: /coaching
                    - listitem [ref=e148]:
                        - link "Computer Courses" [ref=e149] [cursor=pointer]:
                            - /url: /computer-courses
                    - listitem [ref=e150]:
                        - link "Academic Programs" [ref=e151] [cursor=pointer]:
                            - /url: /programs
                    - listitem [ref=e152]:
                        - link "Blogs" [ref=e153] [cursor=pointer]:
                            - /url: /blogs
            - generic [ref=e154]:
                - heading "Contact" [level=2] [ref=e155]
                - list [ref=e156]:
                    - listitem [ref=e157]:
                        - generic [ref=e161]: Main Boulevard, City, Pakistan
                    - listitem [ref=e162]:
                        - link "+92 300 0000000" [ref=e165] [cursor=pointer]:
                            - /url: tel:+923000000000
                    - listitem [ref=e166]:
                        - link "info@scholarschool.edu.pk" [ref=e170] [cursor=pointer]:
                            - /url: mailto:info@scholarschool.edu.pk
        - generic [ref=e172]:
            - paragraph [ref=e173]: © 2026 Scholar Higher Secondary School. All rights reserved.
            - generic [ref=e174]:
                - link "Apply Now" [ref=e175] [cursor=pointer]:
                    - /url: /admissions/apply
                - link "Admissions" [ref=e176] [cursor=pointer]:
                    - /url: /admissions
    - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | const VALID_CONTACT = {
  4  |   name: "Playwright E2E",
  5  |   email: `pw-${Date.now()}@example.com`,
  6  |   message: "End-to-end submission test from the public contact form.",
  7  |   phone: "+92 300 0000000",
  8  | };
  9  |
  10 | test.describe("Public user journey (Phase 25)", () => {
  11 |   test("navigation: homepage -> programs -> admissions -> contact", async ({ page }) => {
  12 |     await page.goto("/");
  13 |     await expect(page).toHaveTitle(/Scholar/i);
  14 |     await expect(page.locator("header")).toBeVisible();
  15 |     await expect(page.locator("footer")).toBeVisible();
  16 |
  17 |     await page.goto("/programs");
  18 |     await expect(page).toHaveTitle(/Program/i);
  19 |
  20 |     await page.goto("/admissions");
  21 |     await expect(page).toHaveTitle(/Admission/i);
  22 |
  23 |     await page.goto("/contact");
  24 |     await expect(page).toHaveTitle(/Contact/i);
  25 |     await expect(page.locator('input[name="name"]')).toBeVisible();
  26 |   });
  27 |
  28 |   test("blog listing and detail render the seeded post", async ({ page }) => {
  29 |     await page.goto("/blogs");
  30 |     await expect(page.locator("h1")).toContainText(/Blog/i);
  31 |     const firstCard = page.locator('a[href*="/blogs/"]').first();
  32 |     await expect(firstCard).toBeVisible();
  33 |
  34 |     await firstCard.click();
  35 |     await expect(page).toHaveURL(/\/blogs\/[^/]+$/);
  36 |     await expect(page.locator("article h1")).toBeVisible();
  37 |     await expect(page.locator("time")).toBeVisible();
  38 |   });
  39 |
  40 |   test("facilities page lists seeded facilities", async ({ page }) => {
  41 |     await page.goto("/facilities");
  42 |     await expect(page.locator("h1")).toContainText(/Facilit/i);
> 43 |     await expect(page.locator("img, .lucide-graduation-cap, .lucide-flask-conical")).toBeVisible();
     |                                                                                      ^ Error: expect(locator).toBeVisible() failed
  44 |   });
  45 |
  46 |   test("contact inquiry POST is rate-limited and accepted", async ({ page }) => {
  47 |     const response = await page.request.post("/api/v1/contact", { data: VALID_CONTACT });
  48 |
  49 |     expect(response.status()).toBe(201);
  50 |     const body = await response.json();
  51 |     expect(body.success).toBe(true);
  52 |   });
  53 | });
  54 |
```
