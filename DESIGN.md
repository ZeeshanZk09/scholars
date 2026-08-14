````markdown
# Scholar Educational Institution Platform

# Design System & UI/UX Standards

Version: 1.0.0
Status: Active
Scope: Entire Application
Primary Theme: Navy Blue + White
UI Foundation: shadcn/ui
CSS Framework: Tailwind CSS
Language: TypeScript
Design Approach: Institutional, Professional, Accessible, Responsive, Modular

---

# 1. Purpose

This document defines the mandatory design standards for the entire Scholar
Educational Institution Platform.

The application represents:

- Scholar Higher Secondary School
- Scholar College
- Scholar Coaching
- Scholar Computer Courses

The design system MUST remain consistent across:

- Public website
- Admissions pages
- Academic pages
- Program pages
- Blog pages
- Contact pages
- Admin dashboard
- CMS
- Authentication screens
- Forms
- Tables
- Modals
- Dialogs
- Notifications
- Error states
- Loading states
- Empty states
- Future applications consuming the same API

No page should introduce an unrelated visual language.

---

# 2. Core Design Philosophy

The overall design must communicate:

1. Trust
2. Academic professionalism
3. Stability
4. Clarity
5. Modern education
6. Accessibility
7. Simplicity
8. Institutional credibility

The website MUST NOT look like:

- A generic SaaS dashboard
- A gaming website
- A marketing agency website
- An overly animated startup website
- A template-heavy website
- A visually inconsistent collection of components

The visual identity should feel closer to a professional:

- School
- College
- University
- Educational institution

while maintaining a modern web experience.

---

# 3. Primary Brand Theme

## Primary Colors

The entire application MUST use a Navy Blue + White visual identity.

### Primary Navy

```text
#0F2747
```
````

Usage:

- Navbar
- Primary buttons
- Important headings
- Footer
- Major CTA sections
- Institutional branding
- Active navigation states
- Important UI elements

### Dark Navy

```text
#091C33
```

Usage:

- Footer backgrounds
- Dark sections
- Hover states where appropriate
- High-contrast institutional areas

### White

```text
#FFFFFF
```

Usage:

- Main page background
- Cards
- Content surfaces
- Text on dark backgrounds

### Light Background

```text
#F8FAFC
```

Usage:

- Secondary page sections
- Alternating section backgrounds
- Dashboard surfaces
- Content separation

### Border

```text
#E2E8F0
```

Usage:

- Card borders
- Input borders
- Table borders
- Dividers

### Muted Text

```text
#64748B
```

Usage:

- Descriptions
- Metadata
- Secondary information
- Helper text

---

# 4. Semantic Colors

Brand colors MUST NOT be used to represent application state incorrectly.

Use semantic colors for system states.

## Success

```text
Green
```

Used for:

- Successful operations
- Published content
- Active status
- Successful submissions

## Warning

```text
Amber
```

Used for:

- Pending states
- Warnings
- Upcoming deadlines

## Error

```text
Red
```

Used for:

- Validation errors
- Failed operations
- Destructive actions
- Critical warnings

## Information

```text
Blue
```

Used for:

- Informational alerts
- Help messages
- Neutral system information

Semantic colors MUST be subtle and accessible.

---

# 5. Color Usage Rules

The application MUST NOT introduce random colors.

Do NOT:

```text
Use random hex colors
Use arbitrary Tailwind colors
Use rainbow gradients
Use unrelated accent colors
Use excessive gradients
```

Every color must have a defined purpose.

Brand colors should be represented through centralized design tokens.

Example concept:

```text
primary
primary-foreground
secondary
secondary-foreground
background
foreground
muted
muted-foreground
border
input
ring
destructive
success
warning
```

---

# 6. UI Foundation — shadcn/ui

## Mandatory Rule

The application MUST use `shadcn/ui` as the primary UI component foundation.

Existing shadcn components MUST be preferred over custom UI implementations.

The application should be architected around shadcn/ui.

---

# 7. Component Reuse Policy

Before creating a custom component, developers MUST check whether
shadcn/ui already provides an equivalent component.

If an existing shadcn component exists:

```text
USE SHADCN COMPONENT
```

Do NOT create a duplicate custom implementation.

---

# 8. Mandatory shadcn Components

Where applicable, use shadcn/ui components for:

```text
Button
Input
Textarea
Label
Select
Combobox
Checkbox
Radio Group
Switch
Slider
Calendar
Date Picker
Popover
Dialog
Alert Dialog
Sheet
Drawer
Dropdown Menu
Context Menu
Command
Tabs
Accordion
Card
Badge
Avatar
Breadcrumb
Navigation Menu
Pagination
Table
Tooltip
Hover Card
Alert
Toast / Sonner
Progress
Skeleton
Separator
Scroll Area
Form
```

Additional shadcn components may be added when required.

---

# 9. Strict Component Rules

## Inputs

Do NOT create raw custom input UI when shadcn Input is appropriate.

Preferred:

```text
shadcn Input
```

Not preferred:

```html
<input />
```

with custom styling duplicated throughout the application.

---

# 10. Select / Dropdown

A major mandatory rule:

Do NOT create custom HTML select/dropdown interfaces when shadcn
provides an appropriate component.

Use:

```text
Select
DropdownMenu
Command
Combobox
Popover
```

depending on the interaction requirement.

Example:

```text
Simple selection
→ Select

Action menu
→ DropdownMenu

Searchable selection
→ Combobox / Command

Context actions
→ DropdownMenu
```

---

# 11. Buttons

All application buttons MUST use the standardized shadcn Button.

Available variants should be standardized:

```text
default
secondary
outline
ghost
destructive
link
```

Primary institutional CTA:

```text
Navy background
White text
```

Example primary actions:

```text
Apply Now
Submit Application
Save Changes
Publish
Contact Us
```

---

# 12. Cards

Use shadcn Card as the default foundation for:

- Programs
- Facilities
- Testimonials
- Blog posts
- Admissions information
- Dashboard widgets
- CMS entities

Cards MUST NOT become excessively decorative.

Preferred structure:

```text
Card
 ├── CardHeader
 ├── CardTitle
 ├── CardDescription
 ├── CardContent
 └── CardFooter
```

---

# 13. Forms

Forms MUST use:

```text
React Hook Form
+
Zod
+
shadcn Form components
```

Form architecture must remain consistent.

Every form should have:

```text
Label
Input
Validation
Helper Text
Error Message
Submit State
Loading State
Success State
```

---

# 14. Typography

Typography must be professional and highly readable.

The default typography system should use a modern sans-serif font.

Recommended primary font:

```text
Inter
```

Fallback:

```text
system-ui
-apple-system
BlinkMacSystemFont
"Segoe UI"
sans-serif
```

---

# 15. Font Loading

Fonts MUST be optimized.

For Next.js:

Prefer:

```text
next/font
```

Do NOT unnecessarily load fonts from external runtime services.

Font files should not block rendering unnecessarily.

---

# 16. Typography Scale

## Display

Used for major hero headings.

```text
Desktop:
48px – 64px

Tablet:
40px – 52px

Mobile:
32px – 40px
```

## H1

```text
Desktop:
40px – 48px

Tablet:
36px – 42px

Mobile:
30px – 36px
```

## H2

```text
Desktop:
32px – 40px

Tablet:
28px – 34px

Mobile:
26px – 32px
```

## H3

```text
Desktop:
24px – 30px

Mobile:
22px – 26px
```

## Body

```text
16px
```

## Small Text

```text
14px
```

## Caption

```text
12px – 13px
```

---

# 17. Typography Rules

Headings:

- Strong
- Clear
- Short
- Hierarchical

Body text:

- Easy to read
- Comfortable line height
- Avoid excessive text width

Recommended body line-height:

```text
1.5 – 1.75
```

Headings:

```text
1.1 – 1.3
```

Do NOT use:

- Excessive uppercase text
- Decorative fonts
- Script fonts
- Multiple font families
- Random font sizes

---

# 18. Font Weight System

Use a limited weight scale.

```text
400 → Regular
500 → Medium
600 → Semibold
700 → Bold
```

Avoid unnecessary:

```text
800
900
```

unless specifically required by the visual design.

---

# 19. Layout System

The entire application MUST use a centralized responsive layout system.

Recommended maximum content width:

```text
1280px
```

Large screens:

```text
max-width: 1280px
margin: auto
```

Some institutional sections may use:

```text
1440px
```

for large visual banners.

---

# 20. Container System

Use a reusable container component.

Concept:

```text
<Container>
  content
</Container>
```

Do NOT manually recreate container spacing on every page.

Container should handle:

- max width
- horizontal padding
- responsive spacing
- consistent alignment

---

# 21. Page Spacing

Desktop section spacing:

```text
80px – 120px
```

Tablet:

```text
64px – 80px
```

Mobile:

```text
48px – 64px
```

Sections must breathe.

Do NOT place large amounts of content without visual spacing.

---

# 22. Grid System

Use Tailwind responsive grid utilities.

Typical patterns:

```text
Desktop:
4 columns

Tablet:
2 columns

Mobile:
1 column
```

Example:

```text
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
```

Do not force four-column layouts on mobile.

---

# 23. Border Radius

Use a consistent radius system.

Recommended:

```text
sm
md
lg
xl
```

Default application radius:

```text
rounded-lg
```

Cards:

```text
rounded-xl
```

Buttons:

```text
rounded-md
```

Avoid excessive pill-shaped UI.

Pills should only be used for:

- Status badges
- Tags
- Categories
- Compact filters

---

# 24. Shadows

Shadows must remain subtle.

Use shadows primarily for:

- Cards requiring elevation
- Dropdowns
- Dialogs
- Sticky navigation
- Floating elements

Avoid:

```text
Heavy shadows
Neon shadows
Glow effects
```

The institution should feel professional, not flashy.

---

# 25. Navbar Design

Navbar must visually communicate institutional credibility.

Desktop:

```text
Logo
Navigation
Dropdowns
Primary CTA
```

Navbar should support:

- Sticky behavior
- Responsive navigation
- Active route state
- Dropdown navigation
- Mobile menu

Primary CTA:

```text
Apply Now
```

---

# 26. Hero Design

The homepage hero MUST support:

- Banner carousel
- Institutional messaging
- Admission campaigns
- Program announcements
- CTA buttons

Hero should support CMS-controlled content.

Visual hierarchy:

```text
Eyebrow
↓
Main Heading
↓
Description
↓
CTA
```

Do not overload hero sections with excessive text.

---

# 27. Carousel Design

Carousel should use a standardized implementation.

Features:

```text
Previous
Next
Indicators
Autoplay
Pause behavior
Touch support
Keyboard accessibility
```

Carousel must not become difficult to control on mobile.

Avoid excessive transition effects.

---

# 28. Navigation Dropdown Design

Dropdown menus should use shadcn components.

Do NOT build independent dropdown implementations for every menu.

Use:

```text
NavigationMenu
DropdownMenu
Sheet
```

where appropriate.

---

# 29. Tables

Tables should use shadcn Table components.

Used for:

- Admin CMS
- Programs
- Admissions
- Users
- Testimonials
- Blogs
- Records

Tables must support responsive behavior.

Mobile:

```text
Horizontal scrolling
```

or an appropriate responsive transformation.

Do NOT allow page-level horizontal overflow.

---

# 30. Dashboard Design

Admin dashboard should follow the same visual language as the public website.

However, dashboard layout may be more information-dense.

Dashboard:

```text
Sidebar
Topbar
Page Header
Content
Widgets
Tables
Forms
```

Use shadcn:

```text
Card
Table
Tabs
Dialog
Sheet
DropdownMenu
Badge
Form
```

---

# 31. Sidebar

Admin sidebar should support:

- Active navigation state
- Collapsible behavior
- Mobile drawer
- Role-aware navigation

Navigation categories should be clearly grouped.

Example:

```text
Dashboard

Content
  Banners
  Blogs
  Testimonials

Academics
  Programs
  Classes
  Courses

Admissions
  Applications
  Admission Settings

Institution
  Facilities
  Contact Information

System
  Users
  Roles
  Settings
```

---

# 32. Forms UI

Forms must be clean and structured.

Long forms should be divided into logical sections.

Example:

```text
Basic Information
-----------------

Academic Information
--------------------

Contact Information
-------------------

Additional Information
----------------------
```

Use:

```text
Card
CardHeader
CardContent
Form
FormField
FormItem
FormLabel
FormControl
FormMessage
```

---

# 33. Form States

Every form MUST support:

```text
Initial
Loading
Validation Error
Server Error
Success
Disabled
```

Submit button during loading:

```text
Loading indicator
Disabled state
```

Users should never be left wondering whether a submission succeeded.

---

# 34. Error UI

Errors must be meaningful.

Do NOT show:

```text
Something went wrong
```

when a meaningful message is available.

Prefer:

```text
Unable to save the banner.
Please verify the required fields and try again.
```

Validation errors should appear near the relevant field.

---

# 35. Loading UI

Use shadcn Skeleton where appropriate.

Examples:

```text
Skeleton Card
Skeleton Table
Skeleton Text
Skeleton Avatar
```

Avoid unnecessary full-page loading screens.

---

# 36. Empty States

Every data-driven section should have an intentional empty state.

Example:

```text
No blog posts available yet.

New content will appear here once published.
```

Admin:

```text
No banners found.

Create your first homepage banner.
```

Empty states should include a relevant action when appropriate.

---

# 37. Toasts / Notifications

Use a standardized notification system.

Use shadcn-compatible toast/Sonner implementation.

Notifications should communicate:

```text
Success
Warning
Error
Information
```

Examples:

```text
Banner published successfully.
Application submitted successfully.
Unable to delete the program.
```

Do not spam users with unnecessary notifications.

---

# 38. Modal / Dialog Rules

Use shadcn:

```text
Dialog
AlertDialog
Sheet
Drawer
```

Use:

```text
Dialog
```

for normal interactions.

Use:

```text
AlertDialog
```

for destructive confirmation.

Example:

```text
Are you sure you want to delete this banner?
This action cannot be undone.
```

---

# 39. Destructive Actions

Delete operations must:

- Use destructive styling
- Require confirmation
- Clearly explain the action
- Avoid accidental clicks

Example:

```text
Delete Banner
```

must not look visually identical to:

```text
Save Banner
```

---

# 40. Accessibility

Accessibility is mandatory.

UI must support:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Proper labels
- Accessible buttons
- Accessible dialogs
- Screen-reader-friendly forms
- Sufficient color contrast

Do not rely solely on color to communicate state.

Example:

Bad:

```text
Green = active
Red = inactive
```

Better:

```text
● Active
● Inactive
```

with text and semantic styling.

---

# 41. Focus States

All interactive elements must have a visible focus state.

Focus rings must use the standardized theme.

Do NOT remove:

```text
outline
focus-visible
```

without providing an accessible alternative.

---

# 42. Mobile-First Design

The application MUST be designed mobile-first.

Start with:

```text
320px+
```

and scale upward.

Breakpoints should follow Tailwind conventions unless there is a strong reason to customize them.

---

# 43. Mobile Responsiveness

Mobile must support:

```text
320px
375px
390px
414px
```

without:

- Horizontal overflow
- Broken navigation
- Cropped buttons
- Overflowing text
- Broken cards
- Broken tables
- Overlapping elements

---

# 44. Tablet Responsiveness

Tablet layouts must be intentionally designed.

Common range:

```text
768px – 1024px
```

Avoid simply stretching the desktop layout.

Tablet may use:

```text
2-column layouts
Collapsed navigation
Adjusted typography
Reduced spacing
```

---

# 45. Desktop Responsiveness

Desktop must support:

```text
1024px+
1280px
1440px
1920px
```

Large screens must not result in excessively wide text blocks.

Content should remain centered and controlled.

---

# 46. Responsive Images

Images must:

- Preserve aspect ratio
- Avoid layout shifts
- Use appropriate sizes
- Be optimized
- Have meaningful alt text

Use Next.js image optimization where appropriate.

---

# 47. Icons

Use a single consistent icon system.

Preferred:

```text
Lucide Icons
```

Icons must have consistent:

```text
Size
Stroke
Alignment
```

Recommended:

```text
16px
18px
20px
24px
```

Do not mix multiple unrelated icon libraries.

---

# 48. Icon Rules

Icons should support content rather than replace important text.

Bad:

```text
[trash icon]
```

for an unfamiliar action.

Better:

```text
[trash icon] Delete
```

Desktop may use icon-only controls where space is limited, but they must have:

```text
Tooltip
aria-label
```

---

# 49. Images & Visual Style

Photography should communicate:

- Education
- Students
- Learning
- Faculty
- Campus
- Technology
- Academic environment

Avoid:

- Generic corporate stock imagery
- Excessive staged imagery
- Unrelated technology images
- Overly colorful illustrations

---

# 50. Decorative Elements

Decorative elements should be subtle.

Allowed:

```text
Soft background shapes
Subtle gradients
Light patterns
Minimal geometric elements
```

Avoid:

```text
Neon
Glows
Excessive gradients
Heavy glassmorphism
Excessive floating elements
```

---

# 51. Gradient Policy

Gradients are optional and secondary.

If used, gradients MUST remain within the navy/white visual identity.

Example concept:

```text
Navy → Dark Navy
```

Do NOT introduce:

```text
Purple → Pink
Blue → Orange
Rainbow
```

unless specifically approved for a campaign banner.

---

# 52. Animation Philosophy

Animations should improve UX, not distract.

Preferred:

```text
opacity
transform
scale
slide
```

Animation duration:

```text
150ms – 400ms
```

Typical:

```text
200ms
250ms
300ms
```

Avoid long animations.

---

# 53. Motion Usage

Good uses:

- Navbar transitions
- Dropdown opening
- Dialog transitions
- Card hover
- Carousel transitions
- Section reveal

Avoid:

- Constant floating animations
- Excessive parallax
- Large page transitions
- Distracting animated backgrounds

---

# 54. Reduced Motion

The application MUST respect:

```text
prefers-reduced-motion
```

Users who disable motion should receive a simplified experience.

---

# 55. Hover States

Interactive elements must provide clear hover feedback.

Examples:

Button:

```text
Default
→ Hover
→ Active
→ Focus
→ Disabled
```

Cards may have subtle:

```text
border change
shadow change
transform
```

Do not over-animate cards.

---

# 56. Links

Links should have:

- Clear hover state
- Focus state
- Proper semantic markup

Important links must not rely only on color.

---

# 57. Status Badges

Use shadcn Badge.

Examples:

```text
Active
Inactive
Published
Draft
Pending
Closed
Open
Upcoming
```

Status should use:

```text
text
icon where appropriate
semantic color
```

---

# 58. Admission Status Design

Admission status is especially important.

Possible statuses:

```text
OPEN
CLOSED
COMING_SOON
```

Visual representation:

```text
● Admissions Open
```

or:

```text
Admissions Coming Soon
```

The status must be obvious but not visually aggressive.

---

# 59. Blog Design

Blog cards should remain institutional.

Card:

```text
Image
Category
Title
Excerpt
Published Date
Read More
```

Use shadcn Card.

No separate visual language for blogs.

---

# 60. Program Cards

Program cards should contain:

```text
Program Name
Category
Level
Description
Optional Duration
CTA
```

Examples:

```text
School
College
Coaching
Computer Course
```

Use consistent card structure.

---

# 61. Testimonial Design

Testimonials should feel authentic.

Structure:

```text
Quote
Name
Role
Optional Avatar
```

Avoid fake-looking decorative quotation designs.

---

# 62. Footer Design

Footer should use:

```text
Dark Navy
White Text
Muted White/Slate Text
```

Footer sections:

```text
Brand
Quick Links
Academics
Admissions
Contact
```

Bottom:

```text
Copyright
Legal Links
```

---

# 63. Public Website vs Admin

Both interfaces must share:

```text
Colors
Typography
Buttons
Forms
Cards
Dialogs
Badges
Spacing
Icons
```

Admin may use a denser layout.

Public website may use more whitespace.

---

# 64. Design Tokens

Do NOT hardcode design values throughout components.

Centralize:

```text
Colors
Radius
Typography
Spacing
Shadows
Transitions
Breakpoints
```

Use Tailwind/shadcn theme variables.

---

# 65. Tailwind CSS Rules

Tailwind CSS is mandatory for application styling.

Prefer:

```text
Tailwind utility classes
```

Do NOT introduce:

```text
Bootstrap
Material UI
Chakra UI
Ant Design
jQuery UI
```

Do not mix multiple CSS frameworks.

---

# 66. Custom CSS

Custom CSS should be minimized.

Use custom CSS only when:

- Tailwind cannot reasonably solve the requirement
- A global design token is required
- A complex animation requires it
- Third-party rendering requires it

Do NOT create large component-specific CSS files unnecessarily.

---

# 67. Component Architecture

Components should be reusable.

Example:

```text
components/
├── ui/
├── layout/
├── navigation/
├── forms/
├── cards/
├── sections/
├── feedback/
└── shared/
```

---

# 68. UI Components

`components/ui/` should contain standardized primitives.

Examples:

```text
button.tsx
input.tsx
select.tsx
dialog.tsx
card.tsx
table.tsx
badge.tsx
form.tsx
```

These should primarily originate from shadcn/ui.

Do NOT unnecessarily modify their behavior.

---

# 69. Feature Components

Feature-specific components should live outside the generic UI layer.

Example:

```text
components/
└── admissions/
    ├── admission-card.tsx
    ├── admission-status.tsx
    └── admission-cta.tsx
```

---

# 70. Naming Convention

Use:

```text
kebab-case
```

for file names.

Examples:

```text
admission-card.tsx
program-card.tsx
hero-carousel.tsx
contact-form.tsx
```

React components:

```text
PascalCase
```

Example:

```text
AdmissionCard
ProgramCard
HeroCarousel
ContactForm
```

---

# 71. Page Design Consistency

Every page should have a predictable structure.

Typical:

```text
Navbar
↓
Page Header / Hero
↓
Main Content
↓
CTA
↓
Footer
```

Do not invent completely different layouts without a UX reason.

---

# 72. Page Headers

Internal pages should use consistent page headers.

Example:

```text
ABOUT SCHOLAR

Discover our institution,
academic approach and educational journey.
```

Optional breadcrumb:

```text
Home / About
```

---

# 73. Breadcrumbs

Use shadcn Breadcrumb.

Useful for:

- Academic pages
- Program pages
- Blog detail pages
- Admin pages

Do not use breadcrumbs where navigation hierarchy is unnecessary.

---

# 74. Responsive Navigation

Desktop:

```text
Full navigation
```

Mobile:

```text
Hamburger
↓
Sheet
↓
Navigation
```

Use shadcn Sheet where appropriate.

Do not create an entirely separate navigation architecture.

---

# 75. Design Consistency Rules

Every new feature MUST answer:

1. Can an existing shadcn component be reused?
2. Can an existing design token be reused?
3. Can an existing layout be reused?
4. Can an existing form pattern be reused?
5. Can an existing card pattern be reused?

If yes, reuse it.

---

# 76. No Duplicate UI Systems

The application MUST NOT contain:

```text
Custom Button System
+
shadcn Button
```

or:

```text
Custom Select
+
shadcn Select
```

or:

```text
Custom Modal
+
shadcn Dialog
```

for the same purpose.

There should be one standard approach.

---

# 77. Design System Priority

When implementing UI, follow this priority:

```text
1. Existing project design tokens
        ↓
2. Existing reusable application component
        ↓
3. shadcn/ui component
        ↓
4. Tailwind composition
        ↓
5. Custom component
        ↓
6. Custom CSS
```

Custom implementation should be the last reasonable option.

---

# 78. Content Density

Public website:

```text
Low → Medium density
```

Admin:

```text
Medium → High density
```

Do not make the public website feel like an admin dashboard.

Do not make the admin dashboard unnecessarily spacious.

---

# 79. CTA Hierarchy

Primary CTA:

```text
Apply Now
```

Secondary CTA:

```text
Explore Programs
Contact Us
```

Tertiary:

```text
Learn More
View Details
```

Do not make every button visually primary.

---

# 80. Accessibility + UX Priority

Design decisions must follow:

```text
Accessibility
↓
Usability
↓
Consistency
↓
Performance
↓
Visual polish
```

Visual appearance must never compromise usability.

---

# 81. Performance Design Rules

Avoid unnecessary:

```text
Client Components
Large images
Large icon packages
Heavy animation
Duplicate assets
Unnecessary JavaScript
```

Prefer:

```text
Server Components
Optimized images
Lazy loading
Code splitting
Reusable components
```

---

# 82. Design and SEO

Visual design must support SEO.

Pages should have:

```text
Clear H1
Logical H2/H3 hierarchy
Semantic HTML
Accessible links
Descriptive image alt text
Readable content width
```

Do not use visual headings without semantic heading elements.

---

# 83. SEO-Friendly UI

Do not create:

```text
<div>Heading</div>
```

when it should be:

```text
<h1>
<h2>
<h3>
```

Buttons must be:

```text
<button>
```

Links must be:

```text
<a>
```

Use semantic HTML wherever possible.

---

# 84. Mobile Touch Targets

Interactive controls should be comfortably tappable.

Avoid tiny:

```text
10px – 12px
```

click targets.

Recommended minimum target:

```text
~44px
```

where practical.

---

# 85. Tables on Mobile

Large tables MUST NOT break the viewport.

Preferred strategies:

```text
Horizontal scroll container
```

or:

```text
Responsive card transformation
```

depending on the data.

---

# 86. Long Forms on Mobile

Forms should:

- Use one column
- Have clear labels
- Avoid tiny inputs
- Keep buttons accessible
- Group related fields

Avoid multi-column forms on narrow screens.

---

# 87. Image Aspect Ratios

Image components should define predictable aspect ratios.

Examples:

```text
Hero:
16:9 / responsive

Blog:
16:9

Card:
4:3 or 16:9

Avatar:
1:1
```

Do not allow random image dimensions across similar components.

---

# 88. Content Alignment

Use a consistent alignment system.

Default:

```text
Left aligned
```

Center alignment should be reserved for:

- Hero messaging
- Section headings
- CTA sections
- Empty states where appropriate

Avoid excessive centered paragraphs.

---

# 89. Visual Hierarchy

Every section should clearly communicate:

```text
What is this?
↓
Why does it matter?
↓
What can I do next?
```

Use:

```text
Heading
Description
Content
CTA
```

where appropriate.

---

# 90. Dark Sections

Dark Navy sections should be used strategically.

Recommended:

```text
Hero overlays
Admissions CTA
Final CTA
Footer
Selected institutional sections
```

Do not make the entire website dark.

---

# 91. White Sections

White should remain the dominant content surface.

Recommended:

```text
Cards
Forms
Content sections
Academic information
Blog content
Admissions content
```

---

# 92. Alternating Sections

Long pages may alternate:

```text
White
Light Slate
White
Light Slate
```

This creates visual separation without introducing new colors.

---

# 93. Design Review Checklist

Before considering a UI feature complete:

### Branding

- [ ] Navy/white theme maintained
- [ ] No random colors
- [ ] Typography consistent
- [ ] Logo correctly used

### Components

- [ ] shadcn component checked first
- [ ] Existing component reused
- [ ] No duplicate UI component created
- [ ] Tailwind used

### Responsive

- [ ] Mobile tested
- [ ] Tablet tested
- [ ] Desktop tested
- [ ] No horizontal overflow
- [ ] Touch targets usable

### Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Labels provided
- [ ] Contrast acceptable
- [ ] Semantic HTML used

### States

- [ ] Loading state
- [ ] Empty state
- [ ] Error state
- [ ] Success state
- [ ] Disabled state

### UX

- [ ] CTA hierarchy clear
- [ ] Content hierarchy clear
- [ ] Navigation intuitive
- [ ] Forms understandable

---

# 94. Strict Design Restrictions

The following are prohibited unless explicitly approved:

```text
Bootstrap
Material UI
Ant Design
Chakra UI
jQuery UI
Random component libraries
Random icon libraries
Random font families
Random color systems
Excessive gradients
Neon colors
Heavy glassmorphism
Excessive animations
Inconsistent border radius
Inconsistent spacing
Duplicate UI primitives
Custom dropdowns when shadcn equivalent exists
Custom selects when shadcn equivalent exists
Raw inputs when standardized component exists
Unnecessary custom CSS
```

---

# 95. Golden Rule

The most important design rule:

> DO NOT BUILD A NEW UI PATTERN IF AN EXISTING STANDARDIZED PATTERN
> ALREADY EXISTS.

Always prefer:

```text
Existing Design Token
        ↓
Existing Project Component
        ↓
shadcn/ui
        ↓
Tailwind
        ↓
Custom Implementation
```

---

# 96. Final Design Standard

The Scholar platform must consistently feel like:

```text
Professional
       +
Academic
       +
Modern
       +
Trustworthy
       +
Accessible
       +
Responsive
       +
Scalable
```

The visual identity is:

```text
NAVY BLUE
     +
WHITE
     +
LIGHT SLATE
     +
SUBTLE SEMANTIC COLORS
```

The UI foundation is:

```text
shadcn/ui
     +
Tailwind CSS
     +
TypeScript
```

The application should maintain one unified design language across:

```text
Public Website
      +
Admissions
      +
Academics
      +
School
      +
College
      +
Coaching
      +
Computer Courses
      +
Blogs
      +
Admin Dashboard
      +
CMS
      +
Authentication
```

Any future feature must extend this design system rather than creating a
separate visual system.

---

# END OF DESIGN SYSTEM
