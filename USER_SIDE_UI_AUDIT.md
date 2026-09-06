# User-Side UI/UX Audit

Audit date: 2026-09-05  
Scope: Public website only  
Method: Source inspection, route/component inventory, design-document comparison, static accessibility/state review, and lint validation. No application code was modified.

## 1. Executive Summary

Scholar has a sound public information architecture and a reusable component foundation, but the current experience reads as a functional content shell rather than a finished institutional website. The largest credibility and conversion risks are the text-only hero despite banner image data being available, a highly repeated card/grid language, limited proof-oriented content, weak offering-specific journeys, and inconsistent global error/404 styling.

The strongest implementation priorities are:

1. Restore meaningful hero imagery and build a real visual story around the four Scholar divisions.
2. Replace repeated equal-weight card grids with editorial feature layouts, metadata, imagery, and clear primary/secondary hierarchy.
3. Make every offering and program page conversion-ready with clear outcomes, eligibility, duration, next steps, and contextual CTAs.
4. Add route-level loading, failure, empty, and image-failure experiences that use the public design system.
5. Resolve mobile navigation hierarchy, keyboard/focus details, form feedback, and the current public lint failures.
6. Validate the public experience at mobile, tablet, desktop, and large desktop widths with real content and route-level browser tests.

## 2. Audit Scope

Included: public routes, public layout, header, footer, public sections, cards, forms, shared states, typography, spacing, responsive classes, interactions, accessibility evidence, public image usage, metadata, and user conversion paths.

Excluded: admin panel, admin authentication, CMS, APIs, repositories, services, Prisma, database, server architecture, and developer tooling except where a public UI symptom is directly visible. The existing modifications in `src/components/cards/blog-card.tsx` and `src/schemas/settings/site-setting.schema.ts` were not changed.

Documentation reviewed: `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `RULES.md`, `SOPs.md`, `AGENTS.md`, `README.md`, and `CODE_QUALITY_GATE.md`. `PHASES.md` is referenced by the project documents but is not present in the repository.

## 3. Project Understanding

The product is an institutional website for four offerings: Scholar Higher Secondary School, Scholar College, Scholar Coaching, and Scholar Computer Courses. The PRD also requires admissions, facilities, testimonials, blogs, contact, responsive behavior, SEO, and lead generation.

The public implementation uses the Next.js App Router under `src/app/(public)`, a shared `PublicLayout`, Tailwind CSS, shadcn-style primitives, lucide icons, server-rendered route pages, and small client components for the header, carousel, and forms. Public data is assembled through service calls in route pages. The design system specifies navy `#0F2747`, dark navy `#091C33`, white, light surface `#F8FAFC`, slate borders/text, and shadcn reuse.

Static implementation evidence:

- `src/app/(public)/page.tsx` composes hero, quick links, institution cards, programs, admissions, application steps, facilities, reasons to choose Scholar, coaching/computer promo, testimonials, blogs, contact, and a final CTA.
- `src/components/sections/hero-carousel.tsx` receives banner image data, but the `Image` layer and overlay are commented out.
- `src/components/layout/site-header.tsx` is a client component because it owns pathname state, desktop dropdowns, and a mobile sheet.
- `src/components/layout/site-footer.tsx` is server-rendered and reads contact/site settings.
- `src/components/shared/empty-state.tsx` and `src/components/shared/error-state.tsx` exist, but public route-level loading/error boundaries are not present.
- `src/app/error.tsx` and `src/app/not-found.tsx` use blue/gray utility styling rather than the defined navy/white public system.

## 4. Public Route Inventory

| Route                                | Purpose / target user                                | Main UI                                                                                                                | Current maturity | Main gaps                                                                                                                |
| ------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `/`                                  | Institutional overview for all visitors              | Hero, quick links, four divisions, programs, admissions, facilities, values, promos, testimonials, blogs, contact, CTA | Medium           | Hero is text-only; many equal-weight grids; limited proof and imagery; no visible section-level empty handling           |
| `/about`                             | Institutional trust for parents, students, community | Page header, institution story, principal/management content                                                           | Medium           | Needs stronger timeline, metrics, leadership hierarchy, campus proof, and differentiated visual storytelling             |
| `/academics`                         | Route-level discovery of academic areas              | Academic header and offering/program links                                                                             | Low-Medium       | Acts mainly as a directory; needs comparison, pathway guidance, and clearer school/college/coaching/course distinction   |
| `/school`                            | School prospects and parents                         | School overview, class/program cards, CTA                                                                              | Medium           | Needs age/level navigation, outcomes, schedule/eligibility context, school-specific imagery, and parent reassurance      |
| `/college`                           | Intermediate students and parents                    | College overview and program content                                                                                   | Medium           | Needs group comparison, subjects, eligibility, outcomes, deadlines, and stronger apply path                              |
| `/coaching`                          | Exam-preparation seekers                             | Coaching overview and course cards                                                                                     | Medium           | Needs exam/subject/timing/benefit context and lead capture beyond generic cards                                          |
| `/computer-courses`                  | Skills/course seekers                                | Computer course overview and cards                                                                                     | Medium           | Needs course comparison, duration, eligibility, syllabus/outcomes, certificate or career context                         |
| `/academics/school/[slug]`           | Detail view for a school program                     | Dynamic page header, details, CTA                                                                                      | Medium           | Needs breadcrumbs/path context, related programs, structured facts, and persistent next step                             |
| `/academics/college/[slug]`          | Detail view for a college program                    | Dynamic program detail                                                                                                 | Medium           | Same detail template risks treating college choices as generic; needs group/subject comparison                           |
| `/academics/coaching/[slug]`         | Detail view for coaching program                     | Dynamic coaching detail                                                                                                | Medium           | Needs schedule, target exam, faculty/proof, and inquiry CTA                                                              |
| `/academics/computer-courses/[slug]` | Detail view for computer course                      | Dynamic course detail                                                                                                  | Medium           | Needs duration, eligibility, outline, benefits, and enrollment CTA                                                       |
| `/programs`                          | Browse all academic programs                         | Header, program cards, filters/pagination if available                                                                 | Medium           | Cards expose limited context and generic CTA; no offering-level grouping or comparison                                   |
| `/facilities`                        | Establish campus quality                             | Facility card grid                                                                                                     | Medium           | Image-less facilities fall back to icons and generic copy; no gallery/depth/detail interaction                           |
| `/faculty`                           | Build academic trust                                 | Faculty card grid                                                                                                      | Medium           | Portrait cards lack subject expertise, credentials, social proof, and profile detail route                               |
| `/testimonials`                      | Social proof                                         | Testimonial card grid                                                                                                  | Low-Medium       | Text-only quote cards lack context, cohort/program, date, photos, and filtering/featured story hierarchy                 |
| `/admissions`                        | Explain availability and requirements                | Admission periods, requirements, four steps, CTA                                                                       | Medium           | No clear status date/next action when closed; requirements are dense text blocks; no FAQ or downloadable checklist       |
| `/admissions/apply`                  | Convert intent into an inquiry                       | Application form                                                                                                       | Medium           | Form is usable but lacks contextual summary, privacy/response expectations, success state page, and program preselection |
| `/blogs`                             | Provide updates and SEO content                      | Blog cards and pagination                                                                                              | Medium           | Content discovery lacks featured article hierarchy, search/category navigation, and strong image treatment               |
| `/blogs/[slug]`                      | Read an article                                      | Article content, metadata, related navigation if present                                                               | Medium           | Needs reading progress, related content, author/date hierarchy, robust image alt treatment, and next CTA                 |
| `/contact`                           | Answer questions and generate inquiries              | Contact details, hours, map link, form                                                                                 | Medium           | No embedded map or visit scheduling; form success is toast-only; limited department/routing guidance                     |

Dynamic slug routes should be tested with valid, empty, invalid, and stale slugs. A generic not-found experience exists globally, but there is no evidence of a public route-specific recovery path or related-content fallback.

## 5. Global UI Findings

### [G-001] — Public visual language is structurally consistent but visually underdeveloped

- Route: All public routes
- Section: Global surfaces and content sections
- Category: Visual design
- Severity: HIGH
- Priority: P1

#### Current State

The system defines a coherent navy/white palette, rounded cards, thin borders, muted text, and alternating white/light-surface sections. Most public pages use the same `Container`, `PageHeader`, `SectionHeader`, `Card`, and grid pattern.

#### Problem

Consistency is achieved mainly through repeated containers and card grids. There is little visual differentiation between a primary institutional message, a program choice, a trust signal, and a secondary link. The page rhythm becomes predictable and template-like.

#### Why It Matters

Institutional credibility depends on hierarchy and evidence, not only color consistency. Equal-weight blocks make important decisions harder to scan and reduce perceived depth.

#### Recommended Direction

Define a small set of public composition patterns: featured split section, editorial story, metric/proof band, comparison table, image-led card, testimonial spotlight, and conversion panel. Assign each section a primary objective and a visual weight rather than rendering every item as an equal card.

#### Expected Result

The site should feel like a credible campus with a distinct story, not a collection of database records.

### [G-002] — Public image assets are not consistently used to carry meaning

- Route: `/`, `/facilities`, `/faculty`, `/blogs`
- Section: Hero and content cards
- Category: Visual storytelling / performance
- Severity: HIGH
- Priority: P0

#### Current State

Facility, faculty, and blog cards can render images, but several components fall back to icons or blank-color surfaces. The hero receives `imageUrl` but its `Image` and overlay code is commented out.

#### Problem

The highest-visibility area cannot show the institution, students, campus, or current campaign. Generic icon fallbacks make a real school look abstract and reduce emotional evidence.

#### Why It Matters

Parents and students need to see the campus experience quickly. Missing hero imagery is a major credibility and conversion loss.

#### Recommended Direction

Use curated, optimized hero images with readable overlay treatment, explicit crop rules, focal-point control, and meaningful alt text. Use real facility/faculty/blog imagery where available; reserve icon fallback for genuine missing data and label it as unavailable where appropriate.

#### Expected Result

The first viewport communicates place, people, and institutional quality before the user reads multiple paragraphs.

### [G-003] — Repeated card treatment creates low information density

- Route: Most listing pages and homepage grids
- Section: Cards and grids
- Category: Information architecture / visual hierarchy
- Severity: HIGH
- Priority: P1

#### Current State

Cards commonly use `border`, `rounded`, `p-6`, muted paragraph text, and a single hover shadow. Program, institution, facility, testimonial, and blog cards repeat this structure with modest content differences.

#### Problem

The cards do not consistently expose the decision-making metadata users need: eligibility, audience, duration, dates, subjects, outcome, capacity, or next action. Hover shadow is the dominant interaction signal.

#### Why It Matters

Users scan education choices comparatively. A generic card forces unnecessary page visits and makes the site feel sparse even when data exists.

#### Recommended Direction

Add structured metadata rows, badges, status, audience labels, date/availability, and one clearly prioritized action. Use featured cards or comparison rows for important offerings and compact cards for secondary links.

#### Expected Result

More useful information appears above the fold without simply adding more paragraphs.

### [G-004] — Global fallback screens break the brand system

- Route: Global error and not-found states
- Section: `src/app/error.tsx`, `src/app/not-found.tsx`
- Category: Error UX / design system
- Severity: HIGH
- Priority: P0

#### Current State

The public system uses navy, slate, shadcn buttons, and semantic tokens. The global error and 404 screens use direct `blue-600`, `gray-600`, and raw `<button>`/link classes.

#### Problem

Failure states look like a different application and do not include the public header/footer, context, support/contact path, or a consistent recovery action.

#### Why It Matters

Errors and invalid links are high-anxiety moments. A branded recovery path protects trust and helps users continue their task.

#### Recommended Direction

Use the public layout and shared `ErrorState`, `Button`, and `PageHeader` conventions. Provide home, back, contact, and retry options appropriate to the failure. Keep the error message concise and human.

#### Expected Result

Failure states remain recognizable, accessible, and useful instead of exposing a generic framework screen.

## 6. Navigation Findings

### [N-001] — Mobile navigation loses dropdown hierarchy

- Route: All public routes at mobile widths
- Section: Mobile sheet navigation
- Category: Navigation / responsive UX
- Severity: HIGH
- Priority: P1

#### Current State

Desktop `Academics` and `Explore` use dropdowns with child descriptions. The mobile sheet renders each parent link and then child links as a flat list, without a visible group label, divider, expanded/collapsed state, or child descriptions.

#### Problem

The mobile information architecture is less understandable than desktop and duplicates parent links that may not be obvious destinations.

#### Why It Matters

Mobile visitors are likely to be students/parents arriving from search or social links. They need to distinguish offering discovery from utility pages quickly.

#### Recommended Direction

Use labeled navigation groups or disclosure sections. Keep child descriptions where they help choice, mark the active child, and give parent landing routes a distinct visual treatment.

#### Expected Result

Mobile navigation becomes scannable and preserves the intended IA instead of flattening it.

### [N-002] — Header hierarchy underuses the primary conversion action

- Route: All public routes
- Section: Sticky header
- Category: Conversion / navigation
- Severity: MEDIUM
- Priority: P1

#### Current State

The header has a single `Apply Now` button visible from `md` upward and a mobile menu button. There is no persistent contact/visit shortcut, admission status, phone affordance, or scroll-state change.

#### Problem

The header is functional but does not adapt to the user's intent or communicate urgency/status. On small screens, the primary CTA is only inside the menu.

#### Why It Matters

Application intent can be lost when the user must reopen navigation. Parents also need a fast route to contact or directions.

#### Recommended Direction

Keep one compact mobile CTA or an admission/contact action row, expose phone/contact where appropriate, and provide an active/condensed sticky state only if it improves content visibility.

#### Expected Result

High-intent users can take the next step from every viewport.

### [N-003] — Header logo is an icon lockup rather than an institutional mark

- Route: All public routes
- Section: Header/footer branding
- Category: Brand identity
- Severity: MEDIUM
- Priority: P2

#### Current State

The logo uses a lucide graduation-cap icon and text `Scholar / School & College`; the footer repeats a shortened version.

#### Problem

The lockup is generic and does not visually distinguish Scholar or communicate all four offerings.

#### Recommended Direction

Use the approved institutional logo/wordmark if available, preserve a text fallback, and define compact/mobile and full desktop variants with consistent alt/label behavior.

## 7. Hero/Banner Findings

### [H-001] — Hero carousel is a text panel with disabled imagery

- Route: `/`
- Section: Hero carousel
- Category: Hero / conversion
- Severity: CRITICAL
- Priority: P0

#### Current State

The hero uses a dark navy background, eyebrow, title, description, and one CTA. `imageUrl` is mapped into each slide, but the `Image` and overlay block is commented out. `Image` is still imported and `index` is unused.

#### Problem

The highest-impact surface is visually flat and cannot tell a campus story. All slides share the same composition even when banner content should have different emphasis.

#### Why It Matters

The first viewport sets institutional credibility and directs admissions. A text-only hero resembles a placeholder and wastes the banner CMS capability.

#### Recommended Direction

Restore the image layer with controlled crop/focal positioning, accessible contrast overlay, and a content-safe zone. Add a secondary contextual action such as Explore Programs or Visit Campus. Ensure image presence is optional without leaving excessive empty space.

#### Expected Result

The homepage immediately communicates Scholar's physical and academic experience and gives users two sensible next steps.

### [H-002] — Carousel semantics and control discoverability need a complete pass

- Route: `/`
- Section: Hero carousel controls
- Category: Accessibility / interaction
- Severity: HIGH
- Priority: P1

#### Current State

Autoplay runs every six seconds and stops on interaction/hover. Arrow controls are hidden below `sm`; dots are `role=tab` items. There is no visible pause control.

#### Problem

Small-screen users cannot use arrows, autoplay can change content without an explicit pause affordance, and tab semantics should be verified against the carousel implementation rather than assumed.

#### Recommended Direction

Provide touch-friendly previous/next controls or a clearly labeled pause/play control, keep controls visible at mobile sizes when multiple slides exist, announce slide changes appropriately, and verify focus order and reduced-motion behavior.

#### Expected Result

Users can control or understand the hero on every viewport without racing autoplay.

## 8. Homepage Findings

### [HP-001] — The homepage has breadth but weak prioritization

- Route: `/`
- Section: Full page composition
- Category: Information architecture
- Severity: HIGH
- Priority: P1

#### Current State

The homepage includes nearly every product area: four divisions, programs, admissions, how-to-apply, facilities, values, coaching/computer courses, testimonials, blogs, contact, and a final CTA.

#### Problem

Many sections have equal spacing, equal grid density, and generic headings. The page risks becoming a long catalog rather than a guided journey from trust to program discovery to admission.

#### Recommended Direction

Establish a deliberate sequence: visual identity/proof, four offering choice, featured admissions status, outcomes/proof, campus evidence, testimonials, updates, visit/contact. Use one or two featured stories instead of showing six items in every grid.

#### Expected Result

Visitors understand what Scholar is, which path fits them, and what to do next without scanning the entire page.

### [HP-002] — Homepage content depends too heavily on text and icons

- Route: `/`
- Section: Institution intro, Why Choose Scholar, division grid
- Category: Visual storytelling
- Severity: HIGH
- Priority: P1

#### Current State

The four value items are icon, heading, and paragraph; institution cards use icon, title, description, and outline CTA. The visual rhythm is repeated icon-plus-copy.

#### Problem

The page does not provide a strong human/campus proof point between abstract promises.

#### Recommended Direction

Pair key claims with real photography, measurable evidence, principal/faculty quote, campus facts, or a featured student journey. Use iconography for navigation and supporting metadata, not as the primary representation of the institution.

## 9. Page-by-Page Findings

### [P-001] — Offering pages need distinct decision frameworks

- Route: `/school`, `/college`, `/coaching`, `/computer-courses`
- Section: Page body and program lists
- Category: Content presentation / conversion
- Severity: HIGH
- Priority: P0

#### Current State

All four offerings share the same institutional visual language and broadly similar card/list patterns.

#### Problem

The offerings have different users and decisions, but the UI does not visibly change its evidence model. School needs age/parent reassurance; college needs groups/subjects; coaching needs exam outcomes/timings; computer courses need duration/skills/career outcomes.

#### Recommended Direction

Create offering-specific information blocks while keeping shared primitives: age/class pathway for school, subject/group comparison for college, exam/timing/teacher proof for coaching, and syllabus/duration/outcome comparison for computer courses.

#### Expected Result

Each visitor can answer “is this for me, what will I learn, what does it cost in time, and how do I enroll?” from the relevant page.

### [P-002] — Academic directory is a weak landing experience

- Route: `/academics`
- Section: Academic hub
- Category: Information architecture
- Severity: MEDIUM
- Priority: P1

#### Current State

The route exists as a central academic entry while the header also exposes `Academics` as a dropdown parent.

#### Problem

The parent route and child routes can compete without a clear “choose your path” framework or comparison view.

#### Recommended Direction

Make `/academics` a purposeful hub with four distinct panels, audience labels, progression map, and direct “view programs”/“ask a question” actions.

### [P-003] — Facilities page lacks inspection depth

- Route: `/facilities`
- Section: Facility grid
- Category: Trust / visual content
- Severity: MEDIUM
- Priority: P1

#### Current State

`FacilityCard` uses an image when available, otherwise a generic icon and fallback copy such as “A modern, well-maintained facility at Scholar.”

#### Problem

Generic fallback claims are not evidence, and there is no detail view, gallery, caption, equipment information, or visit CTA.

#### Recommended Direction

Use real images with captions and categories, provide a lightbox/detail path where meaningful, and connect facilities to visit/contact rather than leaving the user at a static grid.

### [P-004] — Faculty page is a directory without expertise proof

- Route: `/faculty`
- Section: Faculty cards
- Category: Trust / content
- Severity: MEDIUM
- Priority: P1

#### Current State

`FacultyCard` displays profile image or icon, name, designation, department, and a clamped biography.

#### Problem

There is no subject expertise, qualification, years of experience, teaching level, or profile detail interaction.

#### Recommended Direction

Expose concise credentials and subject areas, add filters by offering/department where the dataset supports them, and provide a profile detail or expanded accessible view.

### [P-005] — Testimonials lack context and authenticity signals

- Route: `/testimonials` and homepage testimonial section
- Section: Testimonial cards
- Category: Social proof
- Severity: HIGH
- Priority: P1

#### Current State

`TestimonialCard` shows quote, name, role, and optional star rating.

#### Problem

The user cannot tell which program, year, or outcome the quote relates to. Six similar quote cards are visually interchangeable.

#### Recommended Direction

Add program/cohort context, optional photo, date, outcome, and one featured long-form story. Use rating only when the rating methodology is meaningful.

### [P-006] — Blog discovery is functional but not editorial

- Route: `/blogs`, `/blogs/[slug]`
- Section: Blog listing and article
- Category: Content discovery
- Severity: MEDIUM
- Priority: P1

#### Current State

`BlogCard` supports featured image, tags/date, title, excerpt, and Read More. The listing supports pagination.

#### Problem

There is no featured article hierarchy, category/search/filter experience, author context, or strong connection from article to admissions/programs.

#### Recommended Direction

Feature one current story, add category/search controls if the content volume warrants them, improve article metadata/related content, and add contextual CTAs based on article topic.

### [P-007] — Admissions closed/empty state needs a more useful next step

- Route: `/admissions`
- Section: Admission periods
- Category: Conversion / empty state
- Severity: HIGH
- Priority: P0

#### Current State

When there are no active periods, the page renders “No open admission periods right now” and suggests contacting the institution. Requirements are shown only for the selected featured period.

#### Problem

The most conversion-sensitive route can become a dead end, and users may not know when to return, what documents to prepare, or which general inquiry to submit.

#### Recommended Direction

Show next expected cycle when known, preparation checklist, notify/express-interest CTA, contact channel, and a clear “explore programs” path. Separate open, upcoming, and closed periods with dates and status badges.

### [P-008] — Application form needs contextual and confirmed completion UX

- Route: `/admissions/apply`
- Section: Application form
- Category: Form UX / conversion
- Severity: HIGH
- Priority: P0

#### Current State

The form validates fields, disables inputs while submitting, and reports success/failure via Sonner toast. It resets after success.

#### Problem

Resetting the form removes the submitted data and leaves the user dependent on a transient toast. The form does not visibly summarize the selected program/period, response timeline, privacy expectation, or reference number.

#### Recommended Direction

Render an in-page success state with submission reference and next steps, preserve a summary, prefill program/period from originating CTAs, add response-time/privacy copy, and provide a contact fallback.

### [P-009] — Contact page has good basics but no visit experience

- Route: `/contact`
- Section: Contact details, hours, form
- Category: Conversion / local UX
- Severity: MEDIUM
- Priority: P1

#### Current State

The page provides address, phone, email, office hours, Google Maps directions link, and a contact form.

#### Problem

There is no embedded map preview, campus visit request flow, department routing, response status, or visible form success state.

#### Recommended Direction

Add an accessible map/visual location block, “book a visit” or inquiry intent, expected response timing, and persistent confirmation after submission.

## 10. Component Findings

### [C-001] — Shared cards have insufficient state and content variants

- Route: All listing pages
- Section: Public card components
- Category: Component system
- Severity: HIGH
- Priority: P1

#### Current State

Cards mostly implement default, hover-shadow, image/no-image, and text-content states.

#### Problem

There are few featured, compact, unavailable, loading, error, selected, or status-aware variants. Pages therefore use the same visual unit for unrelated content.

#### Recommended Direction

Define documented variants for featured/compact/with-media/status/empty/loading and specify minimum content contracts. Keep shadcn `Card`, `Badge`, and `Button` primitives underneath.

### [C-002] — Interaction states are mostly hover-only

- Route: Shared cards and links
- Section: Cards/buttons/links
- Category: Interaction/accessibility
- Severity: MEDIUM
- Priority: P1

#### Current State

Many cards use `hover:shadow-md` or image scale on hover. Some links have focus-visible styles, but cards are not generally interactive as a whole.

#### Problem

Touch users receive no equivalent feedback, and keyboard users may need to tab to a small nested link rather than understanding the card action.

#### Recommended Direction

Use explicit interactive affordances only where the whole card is actionable, add focus-within treatment, preserve visible focus contrast, and avoid making noninteractive cards look clickable.

### [C-003] — Image fallback behavior is not consistently informative

- Route: Blog, facility, faculty, hero components
- Section: Media blocks
- Category: Accessibility / content
- Severity: MEDIUM
- Priority: P1

#### Current State

Blog featured images use `alt=""` because the enclosing link has an aria-label; facilities and faculty use names as alt text; hero image code is disabled.

#### Problem

The approach is valid for a redundant linked image in some contexts, but the fallback icon and missing-media states do not communicate whether content is unavailable. Hero image accessibility cannot be evaluated while the layer is commented out.

#### Recommended Direction

Define a media contract: decorative vs informative, meaningful alt, fallback label, aspect ratio, object position, and loading priority. Test screen-reader output on cards and article pages.

## 11. Typography Findings

### [T-001] — Typography is readable but generic and lacks an institutional display layer

- Route: All public routes
- Section: Global typography
- Category: Typography
- Severity: MEDIUM
- Priority: P2

#### Current State

The root layout loads Inter and the design token maps `--font-sans` to Inter/system fallbacks. Headings use weight, size, and navy color as the primary hierarchy.

#### Problem

Inter is functional but does not create a distinctive institutional voice. Section headers, page headers, and hero headings are differentiated mostly by size.

#### Recommended Direction

Keep a restrained sans body face but introduce a purposeful display treatment or approved institutional font for major headings. Define a type scale, maximum measure, and mobile line-length rules. Avoid using tracking as the only display signal.

#### Expected Result

The site gains a recognizable voice without sacrificing readability or the documented professional tone.

### [T-002] — Text-heavy sections need stronger measure and metadata hierarchy

- Route: About, admissions, detail pages, blog article
- Section: Long-form content
- Category: Readability
- Severity: MEDIUM
- Priority: P1

#### Current State

Most descriptions use muted text, max widths, and line-height, but content blocks are visually similar.

#### Problem

Important facts such as duration, eligibility, dates, and next steps can disappear inside prose.

#### Recommended Direction

Use labeled fact rows, definition lists, callout panels, numbered steps, and short summaries before long copy.

## 12. Layout & Spacing Findings

### [L-001] — Section spacing is consistent but not content-sensitive

- Route: Homepage and most listing pages
- Section: Section containers
- Category: Layout / density
- Severity: MEDIUM
- Priority: P1

#### Current State

Many sections use `py-16 sm:py-24`, `mt-12`, and grid gaps of 6. This creates predictable rhythm across very different content volumes.

#### Problem

Short sections can feel over-padded while dense sections still feel like repeated blocks. Empty or low-data pages inherit the same large vertical footprint.

#### Recommended Direction

Create compact/standard/feature section spacing tokens and select based on content role. Use stronger transitions for major narrative changes and tighter rhythm for related data.

### [L-002] — Desktop grids are not always optimized for scan comparison

- Route: `/programs`, `/facilities`, `/faculty`, `/testimonials`, homepage
- Section: Listing grids
- Category: Information density
- Severity: MEDIUM
- Priority: P1

#### Current State

Many pages use 3- or 4-column grids with equal cards.

#### Problem

Wide screens amplify whitespace inside short cards and make comparison harder than a compact table/list or feature-plus-supporting layout.

#### Recommended Direction

Use 2-column feature layouts, compact comparison rows, or denser list variants when the content is decision-oriented. Keep cards for genuinely independent items.

## 13. Responsive Findings

### [R-001] — Responsive classes are present, but critical mobile behavior needs runtime verification

- Route: All public routes
- Section: Mobile/tablet layouts
- Category: Responsive UX
- Severity: HIGH
- Priority: P0

#### Current State

The implementation uses `sm`, `md`, `lg`, responsive grids, a mobile sheet, hidden desktop arrows, and flexible containers.

#### Problem

Static classes do not prove that long titles, badges, nav children, images, forms, and CTA rows fit at 320px, 375px, tablet, and large desktop widths. The hero's hidden mobile arrows are a concrete control gap.

#### Recommended Direction

Add route-level Playwright viewport coverage at 320/375/768/1024/1440/1920 widths. Assert no horizontal overflow, visible focus, card height stability, usable form fields, and readable hero/CTA composition.

### [R-002] — Mobile conversion access is weaker than desktop

- Route: All public routes
- Section: Header and CTAs
- Category: Mobile conversion
- Severity: HIGH
- Priority: P1

#### Current State

The desktop header shows Apply Now from `md`; mobile users access it inside the sheet. Homepage CTAs are generally below each large section.

#### Problem

The primary action is less persistent on the smallest screens, where a substantial share of prospective students/parents may arrive.

#### Recommended Direction

Use a compact mobile apply/contact action in the header or an intentional bottom action pattern, ensuring it does not obscure content or violate touch-target/accessibility requirements.

## 14. Interaction & Motion Findings

### [M-001] — Motion is limited to carousel and hover effects

- Route: All public routes
- Section: Page transitions, reveals, cards
- Category: Motion / perceived quality
- Severity: MEDIUM
- Priority: P2

#### Current State

The hero uses Embla autoplay; cards use hover shadow/image scale; reduced-motion CSS is present globally.

#### Problem

The site can feel static between sections, but adding arbitrary animation would conflict with the institutional design goal.

#### Recommended Direction

Add restrained, meaningful reveal behavior for major sections, stagger only repeated content when it improves scanning, and animate state feedback for filters/forms. Respect reduced motion and avoid delaying content.

### [M-002] — Form feedback is transient and not fully task-oriented

- Route: `/contact`, `/admissions/apply`
- Section: Submission states
- Category: Interaction / feedback
- Severity: HIGH
- Priority: P0

#### Current State

Forms use disabled controls and Sonner success/error toasts.

#### Problem

Toasts can be missed by keyboard/screen-reader users, are not durable confirmation, and do not give a reference or next action.

#### Recommended Direction

Add an in-page `role=status` success panel, focus it after submission, preserve errors near fields and at form level, and provide recovery/contact actions.

## 15. shadcn/UI Design-System Findings

### [DS-001] — Public code generally uses shadcn primitives, but fallback screens bypass them

- Route: Global error/404 and some card-level markup
- Section: Design-system compliance
- Category: shadcn consistency
- Severity: MEDIUM
- Priority: P1

#### Current State

Public forms and most cards use `Button`, `Input`, `Label`, `Textarea`, `Card`, `Badge`, `Sheet`, `DropdownMenu`, `Carousel`, and `Breadcrumb`. Global error/404 use raw styled elements.

#### Problem

Variants, focus behavior, tokens, and visual language can drift when raw utility styling is used for shared states.

#### Recommended Direction

Use the existing primitives for public recovery screens and document when a custom composition is necessary. Audit raw `<button>`, `<a>`, and duplicated card surfaces against available primitives.

### [DS-002] — Component contracts are not visibly documented for empty/loading/error variants

- Route: All data-driven public pages
- Section: Reusable component strategy
- Category: Design-system completeness
- Severity: MEDIUM
- Priority: P1

#### Current State

Shared `EmptyState` and `ErrorState` exist, but route pages do not consistently show how cards/list sections behave when data is absent or fails.

#### Recommended Direction

Define public component state matrices and use skeletons, empty states, retry states, and unavailable-media states consistently.

## 16. Content Presentation Findings

### [CP-001] — Four offerings are named clearly but not equally evidenced

- Route: `/`, `/academics`, offering pages
- Section: School, College, Coaching, Computer Courses
- Category: Content strategy
- Severity: HIGH
- Priority: P0

#### Current State

The homepage explicitly says “One Campus, Four Paths to Success” and renders four institution cards.

#### Problem

The naming is clear, but the evidence and decision support differ inconsistently. The shared card treatment does not make each path feel like a complete service line.

#### Recommended Direction

Give each offering a distinct summary contract: audience, level, key outcomes, representative programs, proof point, and CTA. Keep the four paths visually related but not interchangeable.

### [CP-002] — Institutional proof is asserted more often than demonstrated

- Route: Homepage, About, Facilities, Faculty, Testimonials
- Section: Trust content
- Category: Credibility
- Severity: HIGH
- Priority: P1

#### Current State

Copy references safety, dedicated faculty, structured academics, values, facilities, and community testimonials.

#### Problem

The current UI provides limited metrics, named qualifications, result/outcome evidence, campus photography, dates, or contextual stories to substantiate claims.

#### Recommended Direction

Add verifiable proof blocks: years, enrollment if publishable, board/exam outcomes if approved, faculty qualifications, facility labels, campus visit, and dated student/parent stories.

## 17. Conversion & CTA Findings

### [CTA-001] — CTAs are present but often generic and disconnected from context

- Route: Homepage, cards, offering/detail pages
- Section: Apply, Explore, Learn More, Contact
- Category: Conversion
- Severity: HIGH
- Priority: P1

#### Current State

The site uses `Apply Now`, `Explore`, `Admissions`, `Read More`, `View All`, and `Contact Us` repeatedly.

#### Problem

The labels do not always communicate what happens next or retain the user's selected program context. Generic “Admissions” links from every program card can feel like a dead jump.

#### Recommended Direction

Use contextual labels such as “View School Classes,” “Compare College Groups,” “Ask About Entry Test Coaching,” or “Apply for this course.” Pass program/period context into forms.

### [CTA-002] — Several pages can end without a next-step bridge

- Route: `/faculty`, `/facilities`, `/testimonials`, `/blogs`, detail pages
- Section: Page endings
- Category: Conversion flow
- Severity: MEDIUM
- Priority: P1

#### Current State

Some routes are primarily listing pages and may end after content or a generic footer.

#### Problem

Users who gain trust from faculty/facilities/testimonials are not consistently offered a visit, inquiry, program, or admissions action.

#### Recommended Direction

Add a route-specific closing action matched to intent, with a secondary contact option and no competing CTA overload.

## 18. Accessibility Findings

### [A-001] — Public focus treatment is uneven across raw and primitive controls

- Route: All public routes
- Section: Links, buttons, recovery screens, cards
- Category: Accessibility
- Severity: HIGH
- Priority: P0

#### Current State

Header links, logo, dropdown triggers, blog links, and several primitives have `focus-visible` styles. Global error/404 raw controls do not use the same ring tokens. Cards are not generally focusable as a whole.

#### Problem

Keyboard users may receive inconsistent focus visibility and interaction expectations.

#### Recommended Direction

Audit every interactive element with keyboard-only navigation, ensure a visible two-color-safe focus indicator, keep focus inside the mobile sheet, and avoid nested interactive controls.

### [A-002] — Error and success announcements need durable live-region behavior

- Route: Contact and apply forms
- Section: Validation/submission feedback
- Category: Accessibility
- Severity: HIGH
- Priority: P0

#### Current State

Field errors use `role=alert`; success/error outcomes use Sonner toast.

#### Problem

Field errors are covered, but successful completion and server failures are not guaranteed to remain available or receive focus.

#### Recommended Direction

Add a form-level live status, focus it after submit, identify the first invalid field, and preserve server errors in the form context.

### [A-003] — Heading and semantic structure need route-level verification

- Route: All public pages
- Section: Page headers, sections, cards
- Category: Semantics
- Severity: MEDIUM
- Priority: P1

#### Current State

Shared components use semantic headings and nav labels in many places.

#### Problem

Repeated card titles and nested section headings can produce inconsistent heading order across dynamic pages. Static inspection alone cannot confirm the final accessibility tree.

#### Recommended Direction

Add automated heading-order and landmark checks to public route tests and manually verify one representative page per route family.

### [A-004] — Contrast and touch target checks are not evidenced

- Route: All public routes
- Section: Buttons, muted text, carousel dots, mobile nav
- Category: Accessibility / responsive
- Severity: MEDIUM
- Priority: P1

#### Current State

The palette is intentionally high contrast in primary areas and reduced motion is supported.

#### Problem

Muted text, translucent hero controls, small carousel dots, and compact links require runtime contrast and target-size checks at actual rendered sizes.

#### Recommended Direction

Run axe/contrast checks and assert minimum touch targets for navigation, carousel, and form controls.

## 19. Performance-Related UI Findings

### [PF-001] — Hero image optimization is currently moot because the image layer is disabled

- Route: `/`
- Section: Hero media
- Category: Performance / visual quality
- Severity: HIGH
- Priority: P0

#### Current State

The code imports `next/image` and defines intended priority behavior, but the block is commented out. Other cards use `Image` with responsive `sizes`.

#### Problem

The site avoids hero image cost by removing the main visual asset, trading performance for a visibly weaker experience rather than optimizing it.

#### Recommended Direction

Re-enable a properly sized responsive hero image, use a limited set of optimized sources, preload only the first slide, lazy-load later slides, and measure LCP/CLS.

### [PF-002] — Parallel homepage data loading needs resilient partial-failure behavior

- Route: `/`
- Section: Homepage service data
- Category: Loading/resilience
- Severity: HIGH
- Priority: P1

#### Current State

The homepage requests banners, programs, facilities, testimonials, blogs, admissions, coaching, and computer courses in one `Promise.all`.

#### Problem

A single rejected request can prevent the entire public homepage from rendering, and there are no visible section-level fallback states in the composition.

#### Recommended Direction

Use resilient boundaries or settled results for noncritical sections, preserve the hero/contact/admissions core, and render section-specific empty/error states without exposing raw failures.

#### Expected Result

One unavailable content source does not make the institution homepage unavailable.

### [PF-003] — Public route loading experience is not explicit

- Route: All public routes
- Section: Navigation and data fetching
- Category: Perceived performance
- Severity: HIGH
- Priority: P1

#### Current State

Only `src/app/loading.tsx` exists at the app root; no loading files exist under `(public)`.

#### Problem

Route transitions can fall back to one global experience that may not match page shape, while users wait for server data.

#### Recommended Direction

Add public skeletons matching page headers, cards, forms, and hero dimensions. Avoid layout shifts by reserving media and grid dimensions.

## 20. Loading / Empty / Error State Findings

### [S-001] — State primitives exist but are not consistently integrated

- Route: All data-driven pages
- Section: Loading, empty, error
- Category: Resilience
- Severity: HIGH
- Priority: P0

#### Current State

`EmptyState` and `ErrorState` are available; admissions explicitly handles no active periods. Root error and not-found boundaries exist.

#### Problem

There is no consistent evidence that programs, facilities, faculty, testimonials, blogs, and offering detail routes provide tailored empty/error/loading states. The reusable primitives are not enough unless route sections use them.

#### Recommended Direction

Create a state matrix for every public data section and test: loading, zero records, partial records, failed request, invalid slug, missing image, form submitting, form success, and form failure.

### [S-002] — Empty states do not always preserve discovery

- Route: Admissions and listing routes
- Section: Empty content
- Category: UX
- Severity: MEDIUM
- Priority: P1

#### Current State

The admissions empty state recommends contact, but generic listing empty behavior is not established in the route inventory.

#### Problem

An empty page can feel unfinished and offer no alternative task.

#### Recommended Direction

Every empty state should explain why content is absent, offer the nearest useful alternative, and provide a contact/support route where appropriate.

## 21. Missing Features / Missing UI

These are public-experience gaps, not requests to expand the excluded product scope:

- Featured campus/hero imagery with editorial crop control.
- Offering-specific comparison and pathway guidance.
- Clear program facts: eligibility, duration, subjects, audience, status, and next step.
- Campus visit/request flow or richer location experience.
- Faculty expertise and qualification context.
- Testimonial context, date, program, and outcome.
- Blog featured story, category/search discovery, and article-to-program CTA.
- Admissions preparation checklist, upcoming/closed status detail, and expression-of-interest flow.
- Durable in-page form success states with reference/next steps.
- Public route-level skeleton/loading boundaries.
- Public section-level partial-failure handling.
- Consistent branded error/404 recovery screens.
- Mobile navigation grouping and persistent high-intent action.
- Automated public accessibility/responsive assertions.

## 22. Visual Simplicity Analysis

The site feels simple for five concrete reasons:

1. **Hero simplification:** the main visual asset is disabled, leaving a single navy text panel.
2. **Repeated geometry:** many sections use the same section header, 3/4-column grid, white card, border, and outline button.
3. **Icon substitution:** icons stand in for campus, facilities, values, and offering evidence where photography or structured facts would be stronger.
4. **Weak content metadata:** cards often show title/description/action but not the facts needed to compare educational choices.
5. **Limited interaction depth:** motion is mostly autoplay and hover shadow/scale; filtering, comparison, disclosure, progress, and durable feedback are limited.

The remedy is not blanket decoration or animation. The remedy is stronger hierarchy, real visual evidence, contextual data, differentiated compositions, and purposeful interaction at decision points.

## 23. Critical Issues

1. **H-001:** Hero imagery is disabled despite banner image data, making the first viewport visually flat and weakening conversion.
2. **P-007:** Admissions can become a dead end when no period is open, with insufficient preparation/return guidance.
3. **P-008:** Application completion is only a transient toast followed by form reset.
4. **M-002:** Contact/application success and failure feedback is not durable or fully task-oriented.
5. **A-001/A-002:** Focus and live feedback are inconsistent across public interactive states.
6. **S-001/PF-002/PF-003:** Public route and section loading/failure behavior is incomplete for a data-driven site.

## 24. High Priority Issues

- G-001/G-003: Repeated card/grid language reduces hierarchy and information density.
- G-002: Real images are not consistently carrying institutional meaning.
- G-004: Error/404 surfaces use a separate visual language.
- N-001/N-002: Mobile navigation and mobile conversion access are weaker than desktop.
- H-002: Carousel controls and autoplay need an accessibility/runtime pass.
- P-001/CP-001: Four offerings are named but not presented as four distinct decision journeys.
- P-005: Testimonials lack authenticity/context signals.
- R-001/R-002: Responsive behavior and mobile conversion require runtime coverage.
- PF-001/PF-002/PF-003: Hero/image and data-loading strategy need resilient optimization.

## 25. Medium Priority Issues

- N-003: Generic icon/text logo lockup needs stronger brand identity.
- P-002: Academic hub needs purposeful pathway comparison.
- P-003/P-004: Facilities and faculty need inspection depth and expertise proof.
- P-006: Blog listing/article experience needs editorial discovery.
- P-009: Contact needs a richer visit/location experience.
- C-002/C-003: Card interaction and media fallback contracts need consistency.
- T-002: Long-form content needs stronger fact/metadata hierarchy.
- L-001/L-002: Spacing and grid patterns should respond to content role.
- A-003/A-004: Semantic, contrast, and target-size checks need route coverage.
- S-002: Empty states should preserve discovery.

## 26. Low Priority Issues

- Add subtle page/section reveal motion only after hierarchy and state behavior are stable.
- Consider a display type treatment after brand assets and content structure are approved.
- Add decorative separators or campus motifs only where they clarify section changes; avoid decoration as a substitute for evidence.
- Add richer footer social/legal/help links if those destinations exist and are approved.

## 27. Recommended Improvement Roadmap

### P0 — Trust, resilience, conversion

1. Restore optimized hero imagery and validate contrast, crop, controls, autoplay, and mobile composition.
2. Add durable application/contact success states, references, next steps, focus management, and server-error summaries.
3. Design admissions closed/upcoming states with dates, preparation checklist, expression of interest, and contact alternatives.
4. Add public loading and error boundaries plus section-level partial-failure handling.
5. Bring error/404 screens into the public navy/shadcn system.
6. Run a complete keyboard, screen-reader, contrast, and touch-target pass.

### P1 — Information architecture and content depth

1. Build distinct offering templates for school, college, coaching, and computer courses.
2. Replace selected equal grids with featured/secondary compositions and comparison metadata.
3. Add proof-oriented facility, faculty, testimonial, and About content.
4. Improve mobile navigation grouping and keep a high-intent action available.
5. Add route-level responsive/overflow/heading/landmark tests.
6. Improve blog discovery and article-to-program/admission pathways.

### P2 — Polish and institutional identity

1. Approve a distinctive display type treatment or institutional wordmark.
2. Add restrained reveal motion and richer state transitions where they aid comprehension.
3. Add optional visit/map enhancements, social/legal links, and decorative campus motifs.

## 28. Final UI Quality Assessment

Current public UI quality: **functional foundation, visually underdeveloped, not yet institution-grade**.

The implementation has useful structural strengths: clear public route coverage, reusable shadcn-style primitives, a defined color system, server-rendered pages by default, responsive utility classes, semantic labels in many shared components, reduced-motion support, and basic form validation.

It is not yet ready to present as a polished professional school/college website because the first viewport lacks visual storytelling, the four offerings lack distinct decision support, repeated cards flatten hierarchy, state handling is incomplete, mobile navigation loses structure, and fallback/error surfaces drift from the documented design system.

### Final quality gate

- [x] Public routes inventoried.
- [x] Public layout, header, footer, sections, cards, forms, and shared states inspected.
- [x] Homepage sections audited individually at the source-structure level.
- [x] Navbar and hero audited.
- [x] Footer audited.
- [x] School, college, coaching, and computer-course presentation audited.
- [x] Typography, spacing, visual depth, and design-system usage audited.
- [x] Accessibility and interaction evidence audited.
- [x] Loading, empty, error, and form states audited.
- [x] Performance-related public UI concerns audited.
- [x] Severity and priority assigned to findings.
- [x] No source code, styles, routes, admin code, backend, database, or dependencies modified.
- [ ] Browser screenshots and live multi-viewport measurements: recommended follow-up validation; this report's claims are grounded in source inspection and available static checks.
