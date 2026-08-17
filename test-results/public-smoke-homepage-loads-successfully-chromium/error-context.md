# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-smoke.spec.ts >> homepage loads successfully
- Location: tests\e2e\public-smoke.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('nav')
Expected: visible
Error: strict mode violation: locator('nav') resolved to 3 elements:
    1) <nav aria-label="Main" class="hidden items-center lg:flex lg:gap-1">…</nav> aka getByRole('navigation', { name: 'Main' })
    2) <nav aria-label="Quick links">…</nav> aka getByRole('navigation', { name: 'Quick links' })
    3) <nav aria-label="Academics">…</nav> aka getByRole('navigation', { name: 'Academics' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('nav')

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
            - generic [ref=e30]:
                - generic [ref=e33]:
                    - paragraph [ref=e34]: School, College, Coaching & Computer Courses
                    - heading "Admissions Open for Session 2026-27" [level=1] [ref=e35]
                    - paragraph [ref=e36]: Applications for the new academic session are now open. Submit your application before the deadline and secure a seat.
                    - link "Apply Now" [ref=e38] [cursor=pointer]:
                        - /url: /admissions
                - generic [ref=e41]:
                    - paragraph [ref=e42]: Short-term certifications for students and professionals
                    - heading "Enroll in Professional Computer Courses" [level=1] [ref=e43]
                    - paragraph [ref=e44]: Learn web development, office productivity and programming with hands-on, job-ready training.
                    - link "Explore Courses" [ref=e46] [cursor=pointer]:
                        - /url: /computer-courses
            - button "Previous slide" [disabled]
            - button "Next slide" [disabled]
            - tablist "Hero slides" [ref=e47]:
                - tab "Go to slide 1" [selected] [ref=e48]
                - tab "Go to slide 2" [ref=e49]
        - generic [ref=e52]:
            - link "Admissions Open Admissions are currently open. Check dates and apply. Learn More" [ref=e53] [cursor=pointer]:
                - /url: /admissions
                - generic [ref=e54]:
                    - generic [ref=e55]:
                        - heading "Admissions" [level=3] [ref=e60]
                        - generic [ref=e61]: Open
                    - generic [ref=e62]:
                        - paragraph [ref=e63]: Admissions are currently open. Check dates and apply.
                        - generic [ref=e64]: Learn More
            - link [ref=e67] [cursor=pointer]:
                - /url: /programs
                - generic [ref=e68]:
                    - heading "Academic Programs" [level=3] [ref=e73]
                    - generic [ref=e74]:
                        - paragraph [ref=e75]: Intermediate programs in Pre-Medical, Pre-Engineering, Computer Science and more.
                        - generic [ref=e76]: Learn More
            - link [ref=e79] [cursor=pointer]:
                - /url: /coaching
                - generic [ref=e80]:
                    - heading "Coaching" [level=3] [ref=e86]
                    - generic [ref=e87]:
                        - paragraph [ref=e88]: Board exam preparation and entry test coaching with regular assessments.
                        - generic [ref=e89]: Learn More
            - link [ref=e92] [cursor=pointer]:
                - /url: /computer-courses
                - generic [ref=e93]:
                    - heading "Computer Courses" [level=3] [ref=e98]
                    - generic [ref=e99]:
                        - paragraph [ref=e100]: Practical, career-focused courses in modern digital skills.
                        - generic [ref=e101]: Learn More
        - generic [ref=e106]:
            - generic [ref=e107]:
                - paragraph [ref=e108]: Welcome to Scholar
                - heading "A Place to Learn, Grow and Succeed" [level=2] [ref=e109]
                - paragraph [ref=e110]: Scholar Higher Secondary School, Scholar College, Scholar Coaching and Scholar Computer Courses provide a complete, well-rounded educational journey for students at every stage.
                - paragraph [ref=e111]: We combine strong academics with character development, so every student leaves Scholar prepared for examinations, higher education and the world beyond.
                - list [ref=e112]:
                    - listitem [ref=e113]: Complete education from Nursery to Intermediate
                    - listitem [ref=e115]: School, College, Coaching and Computer Courses in one campus
                    - listitem [ref=e117]: Experienced faculty and structured board preparation
                    - listitem [ref=e119]: A safe, disciplined and student-focused environment
                - link "Learn More About Scholar" [ref=e122] [cursor=pointer]:
                    - /url: /about
            - img "Students learning together in a classroom at Scholar" [ref=e124]
        - generic [ref=e126]:
            - generic [ref=e127]:
                - paragraph [ref=e128]: Our Divisions
                - heading "One Campus, Four Paths to Success" [level=2] [ref=e129]
                - paragraph [ref=e130]: Scholar combines a higher secondary school, an intermediate college, exam coaching and professional computer courses under one roof — so students can grow with a single trusted institution.
            - generic [ref=e131]:
                - generic [ref=e132]:
                    - heading "Scholar Higher Secondary School" [level=3] [ref=e140]
                    - paragraph [ref=e142]: A strong academic foundation from Nursery to Secondary with a focus on values, discipline and holistic growth.
                    - link "Explore School" [ref=e144] [cursor=pointer]:
                        - /url: /school
                - generic [ref=e145]:
                    - heading "Scholar College" [level=3] [ref=e151]
                    - paragraph [ref=e153]: Intermediate programs in Pre-Medical, Pre-Engineering and Computer Science guided by experienced faculty.
                    - link "Explore College" [ref=e155] [cursor=pointer]:
                        - /url: /college
                - generic [ref=e156]:
                    - heading "Scholar Coaching" [level=3] [ref=e161]
                    - paragraph [ref=e163]: Board exam preparation and entry test coaching with structured study plans and regular assessments.
                    - link "Explore Coaching" [ref=e165] [cursor=pointer]:
                        - /url: /coaching
                - generic [ref=e166]:
                    - heading "Scholar Computer Courses" [level=3] [ref=e174]
                    - paragraph [ref=e176]: Practical, career-focused courses in modern technologies designed for students and professionals.
                    - link "Explore Computer Courses" [ref=e178] [cursor=pointer]:
                        - /url: /computer-courses
        - generic [ref=e180]:
            - generic [ref=e181]:
                - paragraph [ref=e182]: Academics
                - heading "Academic Programs" [level=2] [ref=e183]
                - paragraph [ref=e184]: From foundational schooling to Intermediate groups in Pre-Medical, Pre-Engineering and Computer Science.
            - generic [ref=e185]:
                - generic [ref=e186]:
                    - generic [ref=e188]:
                        - heading "FSc Pre-Medical" [level=3] [ref=e189]
                        - generic [ref=e190]: Science
                    - generic [ref=e191]:
                        - paragraph [ref=e192]: A two-year intermediate program preparing students for MBBS and other medical careers.
                        - generic [ref=e193]:
                            - paragraph [ref=e194]: 2 Years
                            - paragraph [ref=e198]: "Subjects: Biology, Chemistry, Physics, English"
                    - link "Admissions" [ref=e200] [cursor=pointer]:
                        - /url: /admissions
                - generic [ref=e201]:
                    - generic [ref=e203]:
                        - heading "FSc Pre-Engineering" [level=3] [ref=e204]
                        - generic [ref=e205]: Science
                    - generic [ref=e206]:
                        - paragraph [ref=e207]: A two-year intermediate program building the foundation for engineering and technology careers.
                        - generic [ref=e208]:
                            - paragraph [ref=e209]: 2 Years
                            - paragraph [ref=e213]: "Subjects: Mathematics, Chemistry, Physics, English"
                    - link "Admissions" [ref=e215] [cursor=pointer]:
                        - /url: /admissions
                - generic [ref=e216]:
                    - generic [ref=e218]:
                        - heading "ICS Computer Science" [level=3] [ref=e219]
                        - generic [ref=e220]: Computer Science
                    - generic [ref=e221]:
                        - paragraph [ref=e222]: An intermediate program for students aiming at computing, IT and software careers.
                        - generic [ref=e223]:
                            - paragraph [ref=e224]: 2 Years
                            - paragraph [ref=e228]: "Subjects: Computer Science, Mathematics, Physics, English"
                    - link "Admissions" [ref=e230] [cursor=pointer]:
                        - /url: /admissions
                - generic [ref=e231]:
                    - generic [ref=e233]:
                        - heading "I.Com Commerce" [level=3] [ref=e234]
                        - generic [ref=e235]: Commerce
                    - generic [ref=e236]:
                        - paragraph [ref=e237]: A two-year commerce program preparing students for business, finance and accounting degrees.
                        - generic [ref=e238]:
                            - paragraph [ref=e239]: 2 Years
                            - paragraph [ref=e243]: "Subjects: Accounting, Business Studies, Economics, English"
                    - link "Admissions" [ref=e245] [cursor=pointer]:
                        - /url: /admissions
            - link "View All Programs" [ref=e247] [cursor=pointer]:
                - /url: /programs
        - generic [ref=e250]:
            - generic [ref=e251]: Admissions Open
            - heading "Admissions Are Now Open" [level=2] [ref=e253]
            - paragraph [ref=e254]: Begin your journey with Scholar. School, College, Coaching and Computer Course admissions are accepting applications.
            - generic [ref=e255]:
                - generic [ref=e256]:
                    - term [ref=e257]: "Session:"
                    - definition [ref=e258]: 2026-27
                - generic [ref=e259]:
                    - term [ref=e262]: "Opens:"
                    - definition [ref=e263]: 1 May 2026
                - generic [ref=e264]:
                    - term [ref=e265]: "Closes:"
                    - definition [ref=e266]: 31 July 2026
            - generic [ref=e267]:
                - link "Apply Now" [ref=e268] [cursor=pointer]:
                    - /url: /admissions/apply
                - link "Admission Details" [ref=e269] [cursor=pointer]:
                    - /url: /admissions
        - generic [ref=e271]:
            - generic [ref=e272]:
                - paragraph [ref=e273]: How to Apply
                - heading "A Simple Path to Admission" [level=2] [ref=e274]
                - paragraph [ref=e275]: Applying to Scholar takes just a few steps. Here is how it works.
            - list [ref=e276]:
                - listitem [ref=e277]:
                    - generic [ref=e282]: "01"
                    - heading "Choose Your Program" [level=3] [ref=e283]
                    - paragraph [ref=e284]: Explore our school classes, college groups, coaching batches or computer courses to find the right fit.
                - listitem [ref=e285]:
                    - generic [ref=e290]: "02"
                    - heading "Check Eligibility & Dates" [level=3] [ref=e291]
                    - paragraph [ref=e292]: Review the admission requirements, opening dates and required documents for the current session.
                - listitem [ref=e293]:
                    - generic [ref=e298]: "03"
                    - heading "Submit Your Application" [level=3] [ref=e299]
                    - paragraph [ref=e300]: Fill out the online admission form with your details, or visit the campus office for assistance.
                - listitem [ref=e301]:
                    - generic [ref=e307]: "04"
                    - heading "Complete Admission" [level=3] [ref=e308]
                    - paragraph [ref=e309]: Our team confirms your admission and guides you through fee submission and the first day of class.
            - link "View Complete Admission Procedure" [ref=e311] [cursor=pointer]:
                - /url: /admissions
        - generic [ref=e313]:
            - generic [ref=e314]:
                - paragraph [ref=e315]: Campus
                - heading "Facilities That Support Learning" [level=2] [ref=e316]
                - paragraph [ref=e317]: Purpose-built classrooms, labs and spaces that make learning comfortable and effective.
            - generic [ref=e318]:
                - generic [ref=e319]:
                    - img "Computer Lab" [ref=e321]
                    - heading "Computer Lab" [level=3] [ref=e326]
                    - paragraph [ref=e328]: Modern computer lab facility at Scholar School
                - generic [ref=e329]:
                    - img "Science Lab" [ref=e331]
                    - heading "Science Lab" [level=3] [ref=e336]
                    - paragraph [ref=e338]: Modern science lab facility at Scholar School
                - generic [ref=e339]:
                    - img "Library" [ref=e341]
                    - heading "Library" [level=3] [ref=e346]
                    - paragraph [ref=e348]: Modern library facility at Scholar School
                - generic [ref=e349]:
                    - img "Classrooms" [ref=e351]
                    - heading "Classrooms" [level=3] [ref=e359]
                    - paragraph [ref=e361]: Modern classrooms facility at Scholar School
                - generic [ref=e362]:
                    - img "Sports Ground" [ref=e364]
                    - heading "Sports Ground" [level=3] [ref=e373]
                    - paragraph [ref=e375]: Modern sports ground facility at Scholar School
            - link "Explore Facilities" [ref=e377] [cursor=pointer]:
                - /url: /facilities
        - generic [ref=e379]:
            - generic [ref=e380]:
                - paragraph [ref=e381]: Why Choose Scholar
                - heading "An Education Built on Values" [level=2] [ref=e382]
                - paragraph [ref=e383]: Everything we do is designed to help students learn well, behave well and succeed confidently.
            - generic [ref=e384]:
                - generic [ref=e385]:
                    - heading "Safe & Disciplined Campus" [level=3] [ref=e390]
                    - paragraph [ref=e391]: A secure, well-managed environment with trained staff and clear conduct policies.
                - generic [ref=e392]:
                    - heading "Dedicated Faculty" [level=3] [ref=e399]
                    - paragraph [ref=e400]: Qualified and experienced teachers committed to every student's progress.
                - generic [ref=e401]:
                    - heading "Structured Academics" [level=3] [ref=e406]
                    - paragraph [ref=e407]: Clear syllabi, regular assessments and focused preparation for board exams.
                - generic [ref=e408]:
                    - heading "Character & Confidence" [level=3] [ref=e413]
                    - paragraph [ref=e414]: Co-curricular activities and mentorship build leadership and strong values.
        - generic [ref=e416]:
            - generic [ref=e417]:
                - paragraph [ref=e418]: Beyond the Classroom
                - heading "Coaching & Computer Courses" [level=2] [ref=e419]
                - paragraph [ref=e420]: Developed for students who want extra preparation for board exams and practical digital skills for the future.
            - generic [ref=e421]:
                - link [ref=e422] [cursor=pointer]:
                    - /url: /coaching
                    - img "Students studying in a Scholar coaching class" [ref=e424]
                    - generic [ref=e425]:
                        - heading "Scholar Coaching" [level=3] [ref=e426]
                        - paragraph [ref=e427]: "Featured program: Matric Coaching."
                        - generic [ref=e428]: Explore Coaching Programs
                - link [ref=e431] [cursor=pointer]:
                    - /url: /computer-courses
                    - img "Students learning computer skills in a Scholar computer course" [ref=e433]
                    - generic [ref=e434]:
                        - heading "Scholar Computer Courses" [level=3] [ref=e435]
                        - paragraph [ref=e436]: "Featured course: Web Development."
                        - generic [ref=e437]: Browse Computer Courses
            - link "Enroll Now" [ref=e441] [cursor=pointer]:
                - /url: /admissions
        - generic [ref=e443]:
            - generic [ref=e444]:
                - paragraph [ref=e445]: Testimonials
                - heading "What Our Community Says" [level=2] [ref=e446]
                - paragraph [ref=e447]: Parents and students share their experience of studying and growing at Scholar.
            - generic [ref=e448]:
                - generic [ref=e449]:
                    - generic "Rated 5 out of 5" [ref=e456]
                    - generic [ref=e467]:
                        - blockquote [ref=e468]: “Scholar School has been a wonderful experience for student Ahmed Raza.”
                        - generic [ref=e469]:
                            - paragraph [ref=e470]: Ahmed Raza
                            - paragraph [ref=e471]: Student
                - generic [ref=e472]:
                    - generic "Rated 5 out of 5" [ref=e479]
                    - generic [ref=e490]:
                        - blockquote [ref=e491]: “Scholar School has been a wonderful experience for parent Fatima Noor.”
                        - generic [ref=e492]:
                            - paragraph [ref=e493]: Fatima Noor
                            - paragraph [ref=e494]: Parent
            - link "Read More Stories" [ref=e496] [cursor=pointer]:
                - /url: /testimonials
        - generic [ref=e498]:
            - generic [ref=e499]:
                - paragraph [ref=e500]: News & Updates
                - heading "Latest From the Blog" [level=2] [ref=e501]
                - paragraph [ref=e502]: Insights, updates and stories from the Scholar campus.
            - generic [ref=e504]:
                - link "Welcome to Scholar Higher Secondary School" [ref=e505] [cursor=pointer]:
                    - /url: /blogs/welcome-to-scholar-school
                - generic [ref=e510]:
                    - time [ref=e514]: 15 Aug 2026
                    - heading [level=3] [ref=e515]:
                        - link "Welcome to Scholar Higher Secondary School" [ref=e516] [cursor=pointer]:
                            - /url: /blogs/welcome-to-scholar-school
                - paragraph [ref=e518]: An introduction to our academic programs and admissions.
                - link "Read More" [ref=e520] [cursor=pointer]:
                    - /url: /blogs/welcome-to-scholar-school
            - link "View All Posts" [ref=e524] [cursor=pointer]:
                - /url: /blogs
        - generic [ref=e526]:
            - generic [ref=e527]:
                - paragraph [ref=e528]: Contact & Visit Us
                - heading "We Would Love to Hear From You" [level=2] [ref=e529]
                - paragraph [ref=e530]: Questions about admissions, programs or the campus? Reach out and our team will be happy to help.
            - generic [ref=e531]:
                - generic [ref=e532]:
                    - heading "Contact Details" [level=3] [ref=e533]
                    - list [ref=e534]:
                        - listitem [ref=e535]:
                            - generic [ref=e539]:
                                - paragraph [ref=e540]: Phone
                                - link "+92 300 0000000" [ref=e541] [cursor=pointer]:
                                    - /url: tel:+923000000000
                        - listitem [ref=e542]:
                            - generic [ref=e547]:
                                - paragraph [ref=e548]: Email
                                - link "info@scholarschool.edu.pk" [ref=e549] [cursor=pointer]:
                                    - /url: mailto:info@scholarschool.edu.pk
                        - listitem [ref=e550]:
                            - generic [ref=e555]:
                                - paragraph [ref=e556]: Address
                                - paragraph [ref=e557]: Main Boulevard, City, Pakistan
                        - listitem [ref=e558]:
                            - generic [ref=e563]:
                                - paragraph [ref=e564]: Office Hours
                                - list [ref=e565]:
                                    - listitem [ref=e566]:
                                        - generic [ref=e567]: Monday – Saturday
                                        - generic [ref=e568]: 8:00 AM – 4:00 PM
                                    - listitem [ref=e569]:
                                        - generic [ref=e570]: Sunday
                                        - generic [ref=e571]: Closed
                    - generic [ref=e572]:
                        - link "Send a Message" [ref=e573] [cursor=pointer]:
                            - /url: /contact
                        - link "Get Directions" [ref=e574] [cursor=pointer]:
                            - /url: https://www.google.com/maps/search/?api=1&query=Main%20Boulevard%2C%20City%2C%20Pakistan
                - generic [ref=e575]:
                    - heading "Visit Our Campus" [level=3] [ref=e576]
                    - paragraph [ref=e577]: See our classrooms, labs and facilities in person. Book a campus visit during office hours — we will arrange a guided tour and answer all your questions about admissions.
                    - generic [ref=e578]:
                        - paragraph [ref=e579]: Why visit?
                        - list [ref=e580]:
                            - listitem [ref=e581]: Meet our faculty and admissions team
                            - listitem [ref=e582]: Tour classrooms, labs and facilities
                            - listitem [ref=e583]: Understand programs and fee structure
                            - listitem [ref=e584]: Start or speed up your admission process
        - generic [ref=e587]:
            - heading "Begin Your Journey at Scholar" [level=2] [ref=e588]
            - paragraph [ref=e589]: Admissions are open for the upcoming academic session. Contact us to book a visit or submit your application today.
            - generic [ref=e590]:
                - link "Apply Now" [ref=e591] [cursor=pointer]:
                    - /url: /admissions/apply
                - link "Contact Us" [ref=e592] [cursor=pointer]:
                    - /url: /contact
    - contentinfo [ref=e593]:
        - generic [ref=e595]:
            - generic [ref=e596]:
                - generic [ref=e597]: Scholar
                - paragraph [ref=e603]: Excellence in education, character, and opportunity. A single campus family — school, college, coaching and computer courses.
            - navigation "Quick links" [ref=e604]:
                - heading "Quick Links" [level=2] [ref=e605]
                - list [ref=e606]:
                    - listitem [ref=e607]:
                        - link "About" [ref=e608] [cursor=pointer]:
                            - /url: /about
                    - listitem [ref=e609]:
                        - link "School" [ref=e610] [cursor=pointer]:
                            - /url: /school
                    - listitem [ref=e611]:
                        - link "College" [ref=e612] [cursor=pointer]:
                            - /url: /college
                    - listitem [ref=e613]:
                        - link "Coaching" [ref=e614] [cursor=pointer]:
                            - /url: /coaching
                    - listitem [ref=e615]:
                        - link "Computer Courses" [ref=e616] [cursor=pointer]:
                            - /url: /computer-courses
                    - listitem [ref=e617]:
                        - link "Explore" [ref=e618] [cursor=pointer]:
                            - /url: /programs
                    - listitem [ref=e619]:
                        - link "Admissions" [ref=e620] [cursor=pointer]:
                            - /url: /admissions
                    - listitem [ref=e621]:
                        - link "Contact" [ref=e622] [cursor=pointer]:
                            - /url: /contact
            - navigation "Academics" [ref=e623]:
                - heading "Academics" [level=2] [ref=e624]
                - list [ref=e625]:
                    - listitem [ref=e626]:
                        - link "School" [ref=e627] [cursor=pointer]:
                            - /url: /school
                    - listitem [ref=e628]:
                        - link "College" [ref=e629] [cursor=pointer]:
                            - /url: /college
                    - listitem [ref=e630]:
                        - link "Coaching" [ref=e631] [cursor=pointer]:
                            - /url: /coaching
                    - listitem [ref=e632]:
                        - link "Computer Courses" [ref=e633] [cursor=pointer]:
                            - /url: /computer-courses
                    - listitem [ref=e634]:
                        - link "Academic Programs" [ref=e635] [cursor=pointer]:
                            - /url: /programs
                    - listitem [ref=e636]:
                        - link "Blogs" [ref=e637] [cursor=pointer]:
                            - /url: /blogs
            - generic [ref=e638]:
                - heading "Contact" [level=2] [ref=e639]
                - list [ref=e640]:
                    - listitem [ref=e641]:
                        - generic [ref=e645]: Main Boulevard, City, Pakistan
                    - listitem [ref=e646]:
                        - link "+92 300 0000000" [ref=e649] [cursor=pointer]:
                            - /url: tel:+923000000000
                    - listitem [ref=e650]:
                        - link "info@scholarschool.edu.pk" [ref=e654] [cursor=pointer]:
                            - /url: mailto:info@scholarschool.edu.pk
        - generic [ref=e656]:
            - paragraph [ref=e657]: © 2026 Scholar Higher Secondary School. All rights reserved.
            - generic [ref=e658]:
                - link "Apply Now" [ref=e659] [cursor=pointer]:
                    - /url: /admissions/apply
                - link "Admissions" [ref=e660] [cursor=pointer]:
                    - /url: /admissions
    - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test("homepage loads successfully", async ({ page }) => {
  4  |   await page.goto("/");
  5  |
  6  |   // Wait for the page to be loaded
  7  |   await expect(page).toHaveTitle(/Scholar/);
  8  |
  9  |   // Check if primary navigation is visible
  10 |   const nav = page.locator("nav");
> 11 |   await expect(nav).toBeVisible();
     |                     ^ Error: expect(locator).toBeVisible() failed
  12 |
  13 |   // Look for key sections
  14 |   const header = page.locator("header");
  15 |   await expect(header).toBeVisible();
  16 |
  17 |   const footer = page.locator("footer");
  18 |   await expect(footer).toBeVisible();
  19 | });
  20 |
```
