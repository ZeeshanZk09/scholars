````markdown
# RULES.md

# Scholar School Website — Engineering Rules & Development Standards

> **This document defines the mandatory engineering rules for the Scholar School Website.**
>
> `SOPs.md` contains the general company-wide Standard Operating Procedures. This document adapts those standards specifically for this project and must be followed together with:
>
> - `PRD.md`
> - `ARCHITECTURE.md`
> - `DESIGN.md`
> - `PHASES.md`
> - `SOPs.md`

---

# 1. Purpose

These rules exist to ensure that the Scholar School Website remains:

- Secure
- Modular
- Maintainable
- Performant
- Scalable
- Testable
- Type-safe
- Accessible
- SEO-friendly
- Consistent
- AI-agent-friendly
- Future-proof

The project must be developed as a professional production application, not as a quick prototype.

---

# 2. Rule Priority

When implementing or modifying the project, follow this priority:

1. Security
2. Correctness
3. Architecture
4. Requirements in `PRD.md`
5. Design requirements in `DESIGN.md`
6. Company standards in `SOPs.md`
7. Code quality
8. Performance
9. Maintainability
10. Convenience

Convenience must never override security, correctness, or architectural integrity.

---

# 3. Source of Truth

The following documents have defined responsibilities.

| Document          | Responsibility                                     |
| ----------------- | -------------------------------------------------- |
| `PRD.md`          | What the product must do                           |
| `ARCHITECTURE.md` | How the application is architected                 |
| `DESIGN.md`       | How the application looks and behaves visually     |
| `RULES.md`        | Mandatory engineering and coding rules             |
| `PHASES.md`       | Development order and implementation phases        |
| `SOPs.md`         | Company-wide engineering and operational standards |

Do not contradict these documents without explicitly updating the relevant document.

---

# 4. Project Scope Rule

This project is an **institutional website + CMS**.

It is NOT:

- A School Management System
- An LMS
- A Student Portal
- A Parent Portal
- A Teacher Portal
- A Fee Management System
- An Attendance Management System
- A Payroll System
- A full ERP
- A mobile application

Do not introduce functionality from these systems unless the project requirements are explicitly expanded.

---

# 5. Technology Stack Rules

The project must use the following stack:

```text
Next.js 16.3.x
React
TypeScript
Tailwind CSS
shadcn/ui
PostgreSQL
Prisma ORM
Auth.js / NextAuth
Zod
React Hook Form
TanStack Query
ESLint
SonarQube
Git
```
````

Do not replace these technologies without an explicit architectural decision.

---

# 6. Framework Rules

## 6.1 Next.js

Use Next.js App Router.

Do not introduce the legacy Pages Router.

Use:

```text
src/app/
```

for application routing.

---

## 6.2 Server Components

Server Components are the default.

Do not add:

```tsx
"use client";
```

unless the component genuinely requires client-side execution.

Valid reasons include:

- React hooks
- Browser APIs
- Interactive state
- Client-side event handlers
- TanStack Query
- Interactive forms
- Client-side UI behavior

Do not make an entire page client-side merely because one small component requires client behavior.

---

# 7. Client JavaScript Rules

Minimize client-side JavaScript.

Prefer:

```text
Server Component
    ↓
Server-rendered content
    ↓
Small Client Component where necessary
```

Avoid:

```text
Entire application
    ↓
"use client"
```

The public website should remain as server-rendered as reasonably possible.

---

# 8. Architecture Rules

The application must follow the architecture defined in `ARCHITECTURE.md`.

The preferred dependency flow is:

```text
UI
 ↓
API / Application Layer
 ↓
Service / Domain Layer
 ↓
Repository / Data Access Layer
 ↓
Prisma
 ↓
PostgreSQL
```

Do not bypass architectural layers without a documented reason.

---

# 9. Database Access Rule

Direct Prisma/database access from React components is forbidden.

Never do:

```tsx
const data = await prisma.blog.findMany();
```

inside a UI component.

Database access must occur through the appropriate repository/data-access layer.

---

# 10. Business Logic Rule

Business logic must not be implemented inside UI components.

Bad:

```tsx
if (admission.openingDate < new Date()) {
  ...
}
```

when that condition represents a domain/business rule.

Business rules belong in the service/domain layer.

---

# 11. API Rules

API endpoints must remain thin.

An API handler should primarily perform:

```text
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Service invocation
 ↓
Response
```

Do not place large business workflows inside route handlers.

---

# 12. REST API Rules

Use resource-oriented API endpoints.

Correct:

```text
GET    /api/blogs
POST   /api/blogs
GET    /api/blogs/:id
PATCH  /api/blogs/:id
DELETE /api/blogs/:id
```

Avoid:

```text
/api/getBlogs
/api/createBlog
/api/updateBlog
/api/deleteBlog
```

---

# 13. HTTP Method Rules

Use HTTP methods according to their semantic purpose.

```text
GET     → Read
POST    → Create
PATCH   → Partial update
PUT     → Full replacement where appropriate
DELETE  → Delete
```

Do not use `POST` for every operation.

---

# 14. API Validation Rule

Every external API input must be validated.

Validate:

- Request bodies
- Query parameters
- Route parameters
- Search parameters
- Pagination
- Filters
- CMS content

Use Zod.

Frontend validation does not replace backend validation.

---

# 15. Never Trust Client Input

Everything coming from the browser must be considered untrusted.

Never trust:

- User roles
- User IDs
- Hidden form fields
- Disabled fields
- Client-side validation
- Client-side permissions
- Client-provided status
- Client-provided ownership information

Verify sensitive information server-side.

---

# 16. Authentication Rules

Admin authentication must use Auth.js / NextAuth.

Authentication must be secure and centralized.

Never implement authentication independently inside individual pages.

---

# 17. Authorization Rules

Authentication is not authorization.

Every protected mutation must verify:

```text
Authenticated?
      ↓
Authorized?
      ↓
Allowed to perform this action?
```

Never rely solely on frontend role checks.

---

# 18. RBAC Rules

Roles and permissions must be centralized.

Do not scatter:

```ts
if (user.role === "ADMIN")
```

throughout the application.

Use centralized authorization policies/services.

The architecture must support roles such as:

```text
SUPER_ADMIN
ADMIN
EDITOR
```

where required.

---

# 19. Admin Security Rule

Protect:

```text
/admin/*
```

and protected API endpoints independently.

Protecting the UI route does not automatically protect the API.

---

# 20. Password Rules

Passwords must never be:

- Stored in plaintext
- Logged
- Returned through APIs
- Embedded in source code
- Included in client bundles

Use secure password hashing when credentials-based authentication is used.

---

# 21. Session Rules

Sessions must use secure configuration.

Where applicable, authentication cookies should use:

```text
HttpOnly
Secure
SameSite
```

Do not expose session secrets to client-side JavaScript.

---

# 22. Secret Management Rules

Never hardcode:

- Database URLs
- Authentication secrets
- Passwords
- API keys
- Encryption keys
- Tokens
- Private credentials

Use environment variables.

---

# 23. `.env` Rules

Local secrets belong in:

```text
.env.local
```

or the appropriate environment-specific file.

Never commit real secrets.

`.gitignore` must protect local environment files.

Provide:

```text
.env.example
```

with safe placeholders.

---

# 24. Environment Separation

The project should conceptually separate:

```text
Development
Testing
Staging
Production
```

Environment-specific configuration must not be hardcoded.

---

# 25. Sensitive Environment Variables

Server-only secrets must never use client-exposed environment variable prefixes.

Only values intentionally required by the browser should be exposed to client-side code.

---

# 26. Database Rules

PostgreSQL is the project's database.

Prisma is the ORM/data-access technology.

Database design must prioritize:

- Integrity
- Correct relationships
- Appropriate indexes
- Constraints
- Consistent naming
- Efficient queries
- Migration safety

---

# 27. Prisma Rules

Use a centralized Prisma client.

Do not instantiate Prisma repeatedly throughout the application.

Do not import Prisma directly into:

- React components
- UI utilities
- Client components
- Browser code

---

# 28. Database Migration Rules

All schema changes must use Prisma migrations.

Never manually alter the production schema as a normal development workflow.

Before changing the schema:

1. Understand existing relationships.
2. Check existing data.
3. Create migration.
4. Test migration.
5. Run relevant tests.
6. Verify generated Prisma client.
7. Verify application behavior.

---

# 29. Database Naming Rules

Follow the company database naming convention from `SOPs.md`.

Database tables and columns should use:

```text
snake_case
```

Examples:

```text
created_at
updated_at
published_at
admission_status
```

Tables should use meaningful plural names where applicable.

---

# 30. Primary Key Rules

Every persistent entity must have a primary key.

The key strategy must remain consistent across the project.

Do not introduce multiple incompatible ID strategies without architectural justification.

---

# 31. Foreign Key Rules

Relationships must use proper foreign keys.

Foreign key naming should follow:

```text
<referenced_entity>_id
```

Example:

```text
author_id
created_by
updated_by
```

---

# 32. Audit Field Rules

CMS-managed entities should support auditing where required.

Important content entities should consider fields such as:

```text
created_at
updated_at
created_by
updated_by
```

Use the project's finalized schema naming consistently.

---

# 33. Database Integrity

Do not rely entirely on application-level validation.

Use database constraints where appropriate:

- Unique constraints
- Foreign keys
- Not-null constraints
- Appropriate indexes
- Check constraints where useful

---

# 34. Database Query Rules

Do not use:

```text
SELECT *
```

when only a subset of fields is required.

With Prisma, select only the necessary fields where doing so improves efficiency or protects data exposure.

---

# 35. N+1 Query Rule

Avoid N+1 queries.

Do not perform:

```text
Fetch 100 blogs
↓
Run another database query for each blog
```

Prefer appropriate joins/relations/selects/includes or batched operations.

---

# 36. Index Rules

Index fields that are frequently used for:

- Filtering
- Sorting
- Searching
- Relationships
- Uniqueness

Do not blindly index every field.

Indexes must have a performance justification.

---

# 37. Pagination Rules

Never retrieve potentially unlimited records.

Admin lists must use pagination where appropriate.

The backend must enforce maximum page sizes.

Never trust the client to provide a reasonable page size.

---

# 38. Transaction Rules

Use transactions when multiple database operations must succeed or fail together.

Transactions must remain short and focused.

Do not place unnecessary network requests inside database transactions.

---

# 39. Service Layer Rules

Services own business logic.

Examples:

```text
AdmissionService
BlogService
BannerService
ProgramService
FacilityService
TestimonialService
ContactService
SettingsService
```

Services must remain focused.

---

# 40. Service Responsibility

A service may:

- Apply business rules
- Coordinate repositories
- Validate business conditions
- Coordinate transactions
- Transform domain data
- Execute workflows

A service must not:

- Render UI
- Return JSX
- Contain Tailwind classes
- Depend on React unnecessarily
- Manipulate DOM elements

---

# 41. Repository Rules

Repositories are responsible for data access.

Repositories may use Prisma.

Repositories must not contain:

- React logic
- JSX
- UI state
- Presentation concerns
- Browser APIs

---

# 42. OOP Rules

Use OOP where it improves:

- Encapsulation
- Dependency inversion
- Testability
- Modularity
- Domain boundaries

Do not create classes merely for the sake of using classes.

Avoid meaningless abstractions.

---

# 43. Interface Rules

Interfaces should be introduced where they provide a useful abstraction.

Example:

```ts
interface BlogRepository {
  findById(id: string): Promise<Blog | null>;
}
```

Avoid creating unnecessary interfaces for trivial functions.

---

# 44. Dependency Inversion

High-level business logic should depend on abstractions where useful rather than tightly coupling itself to implementation details.

Example:

```text
BlogService
    ↓
BlogRepository
    ↓
PrismaBlogRepository
```

This improves testing and future adaptability.

---

# 45. Component Rules

Components must have a clear responsibility.

Avoid massive components containing:

- API requests
- Business logic
- Validation
- Tables
- Forms
- Modals
- Formatting
- Multiple unrelated workflows

Split large components into focused components.

---

# 46. Component Naming

Component names must use PascalCase.

Examples:

```text
HeroSection
BlogCard
AdmissionStatus
AdminSidebar
ContactForm
```

Avoid unclear names:

```text
Thing
Box
Component1
DataCard2
```

---

# 47. Component Folder Rules

Organize components logically.

Use structures such as:

```text
components/
├── ui/
├── layout/
├── navigation/
├── hero/
├── cards/
├── forms/
├── dialogs/
├── tables/
├── feedback/
└── admin/
```

Do not dump every component into one directory.

---

# 48. shadcn/ui Rule

Use shadcn/ui components wherever an appropriate component already exists.

Examples:

```text
Button
Dialog
Select
DropdownMenu
Sheet
Tabs
Table
Form
Input
Textarea
Card
Alert
Badge
```

Do not create custom replacements unnecessarily.

---

# 49. No Custom Select Rule

If a proper shadcn Select is available, do not replace it with a custom HTML dropdown merely for convenience.

Follow the design system.

---

# 50. Tailwind Rules

Tailwind CSS is the primary styling mechanism.

Avoid introducing arbitrary CSS when Tailwind or the design system can solve the problem cleanly.

Do not create large amounts of duplicated CSS.

---

# 51. Design Consistency

All UI implementation must follow `DESIGN.md`.

Do not independently invent:

- Colors
- Typography
- Button styles
- Spacing
- Shadows
- Border radii
- Form patterns
- Card styles

for individual pages.

---

# 52. Theme Rules

The primary institutional visual language is:

```text
Navy Blue
+
White
```

The interface must remain professional and educational.

Avoid turning individual sections into unrelated visual themes.

---

# 53. Responsive Design Rules

Every UI must support:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Do not design desktop first and leave mobile as an afterthought.

---

# 54. No Horizontal Overflow

Pages must not introduce unintended horizontal scrolling.

Check:

- Tables
- Cards
- Navigation
- Forms
- Images
- Carousels
- Admin layouts

at small screen sizes.

---

# 55. Accessibility Rules

All interactive components must be accessible.

Required considerations include:

- Semantic HTML
- Keyboard navigation
- Focus states
- Accessible labels
- Accessible dialogs
- Proper heading hierarchy
- Meaningful alt text
- Sufficient color contrast

---

# 56. Keyboard Navigation

Users must be able to operate essential UI controls using a keyboard.

Do not create mouse-only interactions.

---

# 57. Form Rules

Forms must use:

```text
React Hook Form
+
Zod
```

where appropriate.

Forms must provide:

- Labels
- Validation
- Error messages
- Loading state
- Success feedback
- Disabled state during submission where appropriate

---

# 58. Form Validation

Validation should be consistent between frontend and backend.

Prefer shared Zod schemas where practical.

Never remove backend validation because frontend validation exists.

---

# 59. Error Message Rules

Errors must be:

- Clear
- Meaningful
- Safe
- Actionable

Never expose raw:

```text
Prisma errors
SQL errors
Stack traces
File paths
Internal exception details
```

to users.

---

# 60. HTTP Error Rules

Use appropriate status codes.

Examples:

```text
200 → Success
201 → Created
204 → No Content
400 → Bad Request
401 → Unauthenticated
403 → Forbidden
404 → Not Found
409 → Conflict
422 → Validation/semantic failure where appropriate
429 → Rate Limited
500 → Unexpected internal failure
```

Do not use `500` for ordinary validation errors.

---

# 61. Central Error Handling

Error handling should be standardized.

Use application-level error types where appropriate:

```text
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
RateLimitError
DatabaseError
InternalServerError
```

---

# 62. Logging Rules

Use centralized structured logging.

Log important:

- Errors
- Exceptions
- Authentication events
- Important administrative actions
- Unexpected system failures

Do not log:

- Passwords
- Tokens
- Authentication secrets
- Database credentials
- Private session data

---

# 63. User-Facing vs Internal Errors

Internal logs may contain diagnostic details.

User-facing errors must remain safe.

Example:

```text
Internal:
Database unique constraint violation on slug.

User:
A page with this slug already exists.
```

---

# 64. XSS Rules

CMS content must be treated as untrusted.

Do not render arbitrary HTML using:

```tsx
dangerouslySetInnerHTML;
```

unless absolutely necessary and the content has been properly sanitized.

---

# 65. Injection Protection

Never construct database queries using unsafe string concatenation.

Use Prisma's parameterized query mechanisms.

Raw SQL must only be used when genuinely required and must be safely parameterized.

---

# 66. CSRF Rules

State-changing authenticated operations must use appropriate CSRF protections according to the chosen authentication architecture.

Do not create unsafe mutation endpoints.

---

# 67. Security Headers

Where appropriate, configure security headers such as:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

Do not blindly copy a restrictive CSP without testing the application.

---

# 68. Rate Limiting Rules

Apply rate limiting where appropriate to:

- Login
- Authentication endpoints
- Contact submissions
- Public mutation endpoints
- Expensive APIs
- Abuse-prone endpoints

Do not rate-limit ordinary public browsing unnecessarily.

---

# 69. Open Redirect Protection

Never redirect users to arbitrary client-supplied URLs without validation.

Allowed redirect destinations must be controlled.

---

# 70. File Upload Rules

If file uploads are introduced:

Validate:

- File size
- MIME type
- File extension
- Filename
- Actual content where practical

Never trust the client-provided MIME type or extension.

Uploaded files must not be executable.

---

# 71. CMS Rules

CMS-controlled content must not require source-code changes for ordinary content updates.

The following should be dynamically manageable:

```text
Banners
Admissions
Programs
Facilities
Testimonials
Blogs
Contact Information
Site Settings
```

---

# 72. CMS Content Authority

The database/CMS is the authoritative source for dynamic content.

Do not duplicate dynamic content in:

```text
database
+
constants.ts
+
page.tsx
```

unless there is a clearly defined fallback mechanism.

---

# 73. Publishing Rules

Content that is not published must not accidentally appear publicly.

Support appropriate states such as:

```text
DRAFT
PUBLISHED
ARCHIVED
```

where required.

---

# 74. Blog Rules

Blog records must support appropriate fields such as:

```text
Title
Slug
Excerpt
Content
Featured Image
Author
Publication Date
Status
SEO Metadata
```

Public blog listings must only expose intended public content.

---

# 75. Banner Rules

Banners must be CMS-driven.

Banner configuration may include:

```text
Title
Subtitle
Description
Image
CTA Text
CTA URL
Order
Active Status
Start Date
End Date
```

The backend/service layer determines banner eligibility.

---

# 76. Admission Rules

Admissions must be dynamically controlled.

The system must support appropriate states such as:

```text
OPEN
CLOSED
UPCOMING
```

Admission business rules belong in the service/domain layer.

Do not duplicate admission logic across pages.

---

# 77. SEO Rules

Every public page must be SEO-conscious.

Where applicable provide:

- Unique title
- Meta description
- Semantic headings
- Canonical URL
- Open Graph metadata
- Descriptive URLs
- Image alt text
- Structured data where beneficial

---

# 78. URL Rules

Public URLs must be readable and semantic.

Use:

```text
/about
/school
/college
/coaching
/computer-courses
/admissions
/facilities
/blog
/contact
```

Avoid unnecessary technical IDs in public URLs.

---

# 79. Slug Rules

CMS-managed public content should use unique slugs.

Slugs must be:

- URL-safe
- Unique
- Stable
- Validated

Slug conflicts must produce controlled errors.

---

# 80. Performance Rules

Performance must be considered during implementation, not after completion.

Prioritize:

- Server Components
- Small client bundles
- Optimized images
- Efficient queries
- Caching
- Revalidation
- Pagination
- Lazy loading
- Minimal hydration

---

# 81. Image Rules

Use Next.js image optimization where appropriate.

Images must:

- Have meaningful alt text
- Use appropriate dimensions
- Avoid unnecessary large source files
- Be responsive
- Avoid layout shifts

Do not ship unnecessarily huge images.

---

# 82. Font Rules

Use only required fonts and weights.

Do not load unnecessary font families or weights.

Follow typography specifications from `DESIGN.md`.

---

# 83. Caching Rules

Cache only data that is safe and useful to cache.

Good candidates:

- Public blogs
- Public programs
- Facilities
- Testimonials
- Published banners
- Institutional information

Do not accidentally cache:

- Sensitive admin information
- User-specific private data
- Authentication information

---

# 84. Cache Invalidation

When CMS content changes, affected public content must be revalidated or invalidated appropriately.

Example:

```text
Admin updates Blog
        ↓
Blog cache invalidated/revalidated
        ↓
Public blog page reflects update
```

---

# 85. State Management Rules

Do not introduce global state unnecessarily.

Prefer:

```text
Server data
→ Server Components

Client server-state
→ TanStack Query

Form state
→ React Hook Form

Local UI state
→ React state

Authentication
→ Auth.js
```

Only introduce global client state when there is a real cross-component requirement.

---

# 86. TanStack Query Rules

Use TanStack Query where client-side server-state management is genuinely useful.

Appropriate use cases:

- Admin CRUD interfaces
- Client-side refetching
- Mutations
- Interactive filtering
- Optimistic updates
- Client-side cache management

Do not use it automatically for every public page.

---

# 87. API Client Rules

Client-side API calls should use a centralized API client.

Do not duplicate API handling logic throughout components.

Centralize:

- Request handling
- Response parsing
- Error normalization
- Common headers
- Authentication behavior where appropriate

---

# 88. Type Safety Rules

TypeScript strict mode is mandatory.

Avoid:

```ts
any;
```

unless absolutely unavoidable and explicitly justified.

Avoid unsafe casts such as:

```ts
as any
```

Use runtime validation for untrusted data.

---

# 89. Shared Types

Do not redefine identical domain types in multiple places.

Centralize reusable types such as:

```text
AdmissionStatus
PublicationStatus
UserRole
ApiResponse
Pagination
```

---

# 90. DTO Rules

Do not automatically return raw Prisma models from public APIs.

Use DTOs/response mappers where necessary.

Never expose private/internal fields accidentally.

---

# 91. Public API Data Rules

Public APIs must expose only public information.

Never expose:

- Password hashes
- Admin metadata
- Internal notes
- Private user information
- Authentication information
- Internal audit details
- Database internals

---

# 92. Admin API Rules

Every protected mutation must enforce:

```text
Authentication
+
Authorization
+
Validation
```

server-side.

---

# 93. Utility Rules

Utilities must have focused responsibilities.

Avoid:

```text
utils.ts
```

containing dozens of unrelated functions.

Prefer:

```text
utils/
├── dates/
├── formatting/
├── urls/
├── validation/
└── general/
```

---

# 94. Constants Rules

Avoid magic values.

Bad:

```ts
if (items.length > 10)
```

Prefer:

```ts
const DEFAULT_PAGE_SIZE = 10;
```

when the value represents an actual application rule.

---

# 95. DRY Rule

Do not unnecessarily duplicate logic.

But do not create complicated abstractions merely to eliminate a few repeated lines.

Prefer meaningful reuse.

---

# 96. Single Responsibility Rule

Every module should have one primary responsibility.

Do not create:

```text
GlobalService
EverythingService
WebsiteManager
UtilsEverything
```

containing unrelated functionality.

---

# 97. God Component Rule

Avoid huge components.

If a component becomes responsible for multiple independent concerns, split it.

---

# 98. God Object Rule

Avoid classes with dozens of unrelated responsibilities.

Prefer focused services and domain objects.

---

# 99. Circular Dependency Rule

Circular dependencies are prohibited unless there is an extraordinary and documented reason.

Refactor shared functionality into an appropriate lower-level/shared module.

---

# 100. Import Rules

Use project aliases such as:

```text
@/components
@/services
@/lib
@/types
@/schemas
```

Avoid deeply nested relative imports such as:

```text
../../../../../../services
```

---

# 101. Barrel Export Rules

Barrel files may be used selectively.

Do not create one enormous barrel file exporting the entire application.

Avoid dependency graphs that become difficult to understand.

---

# 102. Dependency Rules

Before installing a new package, ask:

1. Is it already supported by Next.js?
2. Is it already provided by React?
3. Is it already available through shadcn/ui?
4. Can existing project code solve it?
5. Is the dependency actively maintained?
6. Does it add meaningful value?

Do not add dependencies for trivial tasks.

---

# 103. Third-Party Vendor Rule

The project should not depend on paid/proprietary third-party vendor services for core application functionality.

Prefer open-source libraries and self-contained architecture.

---

# 104. Docker Rule

Docker is not required for the initial deployment.

Do not introduce Docker solely because company SOPs mention it.

The current project architecture must remain compatible with future containerization without unnecessarily adding Docker complexity now.

---

# 105. Deployment Rule

Initial deployment target:

```text
Vercel
+
PostgreSQL
```

Application business logic must not become tightly coupled to Vercel-specific behavior.

The application should remain portable.

---

# 106. CI/CD Rules

The CI pipeline should validate:

```text
Install
 ↓
Type Check
 ↓
ESLint
 ↓
Tests
 ↓
SonarQube
 ↓
Build
```

A mandatory quality gate failure must prevent release.

---

# 107. ESLint Rules

ESLint is mandatory.

Do not use Biome as the project's primary linting system.

Do not broadly disable ESLint rules merely to make CI pass.

Every disable should have a legitimate reason.

---

# 108. SonarQube Rules

SonarQube must be used for static code quality analysis.

Address:

- Bugs
- Vulnerabilities
- Code smells
- Duplication
- Maintainability problems
- Reliability issues

Do not intentionally introduce SonarQube issues to complete a feature faster.

---

# 109. Testing Rules

Critical functionality must be tested.

Testing should include, where appropriate:

```text
Unit Tests
Integration Tests
API Tests
End-to-End Tests
```

---

# 110. Service Testing

Business rules should have unit tests.

Example:

```text
AdmissionService
├── opens valid admission
├── rejects invalid state
├── handles closing date
└── returns correct status
```

---

# 111. API Testing

API tests should verify:

- Authentication
- Authorization
- Validation
- Status codes
- Response shape
- Error behavior
- Database effects

---

# 112. Critical E2E Testing

Important flows should be tested end-to-end.

Example:

```text
Admin Login
    ↓
Create Blog
    ↓
Publish Blog
    ↓
Public Website
    ↓
Blog Appears
```

Another:

```text
Admin Changes Admission Status
    ↓
Public Admissions Page
    ↓
Updated Status Appears
```

---

# 113. Loading State Rules

Every asynchronous user operation must have an intentional loading state where applicable.

Examples:

```text
Skeleton
Spinner
Loading button
Disabled submit button
Loading table
```

Never leave users staring at an unexplained blank area.

---

# 114. Empty State Rules

Every list-based interface must have a meaningful empty state.

Examples:

```text
No blogs have been published yet.
No facilities are currently available.
No admission programs have been configured.
```

---

# 115. Success State Rules

Important admin mutations should provide success feedback.

Examples:

```text
Blog published successfully.
Admission settings updated successfully.
Banner deleted successfully.
```

---

# 116. Destructive Action Rules

Destructive operations require confirmation.

Examples:

```text
Delete Blog
Delete Banner
Delete Facility
Delete Testimonial
```

Use accessible confirmation dialogs.

---

# 117. Soft Delete Rule

Use archive/soft-delete behavior where preserving historical content is important.

Do not permanently delete important records without considering auditability and recovery requirements.

---

# 118. Git Rules

Use Git for all source-code changes.

Do not commit:

```text
.env
node_modules
build artifacts
temporary files
logs
editor-specific junk
secrets
```

---

# 119. Branch Rules

Recommended branches:

```text
main
dev
feature/*
bugfix/*
```

`main` must remain production-ready.

---

# 120. Commit Message Rules

Commit messages must be meaningful.

Preferred:

```text
feat: add admission management
fix: resolve blog slug conflict
refactor: extract banner service
test: add admission service tests
docs: update architecture rules
security: protect admin mutation endpoint
```

Avoid:

```text
update
changes
fix
stuff
done
```

---

# 121. Pull Request Rules

Changes should be reviewed before merging into protected production branches.

A PR should explain:

- What changed
- Why it changed
- Important implementation details
- Testing performed
- Screenshots for UI changes where useful
- Any migration or configuration changes

---

# 122. Code Review Rules

Reviewers should verify:

- Requirements
- Architecture
- Security
- Validation
- Authorization
- Database correctness
- Performance
- Accessibility
- Testing
- Maintainability

Do not approve code merely because it works locally.

---

# 123. No Unnecessary Rewrites

Do not rewrite functioning architecture merely because a developer or AI agent prefers another style.

Before refactoring:

1. Understand the current architecture.
2. Identify the actual problem.
3. Evaluate impact.
4. Update tests if required.
5. Refactor incrementally.
6. Verify the result.

---

# 124. AI Coding Agent Rules

AI coding agents must follow all project documentation.

Before implementing a feature, the agent should understand:

```text
PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
PHASES.md
SOPs.md
```

Do not invent architecture for individual tasks.

---

# 125. AI Agent Scope Rule

An AI agent must not modify unrelated code simply because it notices something that could theoretically be improved.

Keep changes scoped to the requested task unless:

- The issue blocks implementation.
- The issue creates a security problem.
- The issue violates a mandatory architectural rule.
- The issue causes the requested feature to fail.

---

# 126. AI Agent Verification Rule

After implementation, an AI agent must verify:

```text
TypeScript
ESLint
Tests
Build
SonarQube where configured
```

and verify that the implementation actually satisfies the requirement.

---

# 127. No Fake Completion Rule

An agent must never claim a feature is complete if:

- API is missing
- Database changes are missing
- Validation is missing
- Authorization is missing
- Tests are missing where required
- UI is disconnected
- Error handling is missing
- Important states are missing

---

# 128. No Placeholder Production Logic

Do not leave:

```text
TODO
FIXME
coming soon
mock data
fake API
hardcoded production response
```

in production functionality unless explicitly required by the project phase.

---

# 129. Mock Data Rules

Mock data may be used during development only when explicitly appropriate.

Production public pages must not silently depend on mock data.

---

# 130. Hardcoded Content Rule

Do not hardcode CMS-controlled content into components.

Bad:

```tsx
<h1>Admissions Open 2026</h1>
```

when admission status is CMS-controlled.

Correct:

```text
CMS
 ↓
API/Service
 ↓
Page
 ↓
Rendered content
```

---

# 131. Configuration vs Content

Use this distinction:

```text
Environment variables
→ Secrets/environment configuration

Config files
→ Technical/application configuration

Database/CMS
→ Dynamic institutional content

Components
→ Presentation
```

---

# 132. Localization Rules

Multilingual support is not part of the initial implementation.

However:

- Do not architect the application in a way that prevents future localization.
- Avoid unnecessary language-specific assumptions in domain models.
- Keep content architecture extensible.

Do not implement a full i18n system unless required by the project phase.

---

# 133. Future Mobile Client Rule

The API must remain independent of the web UI.

A future mobile application should be able to consume the API without depending on:

```text
React Components
Tailwind
Server Components
Admin UI
Next.js page structure
```

---

# 134. Future Desktop Client Rule

The same API/domain architecture should remain usable by future desktop clients.

Do not embed business rules into web-only presentation code.

---

# 135. Scalability Rule

The project starts as a modular monolith.

Do not prematurely introduce:

- Microservices
- Kafka
- Kubernetes
- Service discovery
- Distributed databases
- Complex event buses

unless the project requirements genuinely demand them.

---

# 136. Modular Monolith Rule

The application should remain one deployable system while maintaining internal domain boundaries.

Conceptually:

```text
Application
├── Admissions
├── Blogs
├── Banners
├── Programs
├── Facilities
├── Testimonials
├── Contact
├── Settings
└── Authentication
```

Each domain should remain internally organized.

---

# 137. Future Microservice Rule

The architecture should make future extraction possible but must not build microservices prematurely.

Good:

```text
Well-isolated BlogService
Well-isolated AdmissionService
```

Bad:

```text
Separate server for every feature
```

without a real requirement.

---

# 138. Documentation Rules

Documentation must remain synchronized with implementation.

If architecture changes materially, update:

```text
ARCHITECTURE.md
RULES.md
```

If requirements change:

```text
PRD.md
```

If visual behavior changes:

```text
DESIGN.md
```

---

# 139. Comment Rules

Comments must explain why something exists when the reason is not obvious.

Do not write comments that merely restate the code.

Bad:

```ts
// Get blogs
const blogs = await ...
```

Good:

```ts
// Public queries intentionally return only published blogs
// so unpublished CMS content can never leak to visitors.
```

---

# 140. Magic String Rules

Avoid repeated literal business values.

Bad:

```ts
if (status === "published")
```

throughout dozens of files.

Prefer centralized domain constants/types where appropriate.

---

# 141. Feature Isolation Rule

Changes to one feature should not unnecessarily modify unrelated domains.

For example:

```text
Blog changes
```

should not require unrelated modifications to:

```text
Admissions
Facilities
Testimonials
```

unless an actual dependency exists.

---

# 142. Data Ownership Rule

Every entity should have a clear domain owner.

Example:

```text
Blog
→ Blog domain

Admission
→ Admission domain

Banner
→ Banner domain

Facility
→ Facility domain
```

Do not allow unrelated modules to arbitrarily mutate another domain's data.

---

# 143. API Contract Stability

Do not casually change API response structures.

Before changing an API contract:

1. Find all consumers.
2. Update shared types.
3. Update API client.
4. Update hooks/queries.
5. Update UI.
6. Update tests.
7. Verify future-client compatibility.

---

# 144. No Internal Data Leakage

Never expose database implementation details through APIs.

Do not return:

```text
Prisma internal metadata
Private fields
Password hashes
Internal audit information
Database errors
```

unless explicitly required and safe.

---

# 145. Performance Regression Rule

A feature must not unnecessarily degrade:

- Initial load
- JavaScript bundle size
- Database performance
- API latency
- Core Web Vitals

If a feature introduces significant performance cost, evaluate alternatives.

---

# 146. Core Web Vitals Rule

The public website should target strong:

```text
LCP
INP
CLS
```

performance.

Avoid:

- Large blocking scripts
- Unoptimized images
- Layout shifts
- Excessive hydration
- Unnecessary client rendering

---

# 147. Accessibility Regression Rule

A visual improvement must not create an accessibility regression.

Check:

- Keyboard navigation
- Focus
- Contrast
- Labels
- Screen-reader semantics
- Reduced motion

---

# 148. Security Review Rule

Before production release, review:

```text
Authentication
Authorization
API endpoints
Input validation
Database access
Secrets
Security headers
File handling
Error leakage
Rate limiting
```

---

# 149. Production Readiness Rule

A feature is production-ready only when all relevant layers are complete:

```text
Requirement
 ↓
UI
 ↓
Types
 ↓
Validation
 ↓
API
 ↓
Authorization
 ↓
Service
 ↓
Repository
 ↓
Database
 ↓
Tests
 ↓
Error/Loading/Empty States
 ↓
Quality Checks
```

Not every feature requires every layer, but every required layer must be complete.

---

# 150. No Shortcut Rule

Do not bypass architecture simply to finish a task faster.

Examples of prohibited shortcuts:

```text
Component → Prisma
Component → Database
Client → privileged API without authorization
Hardcoded CMS data
Skipping validation
Skipping tests for critical business logic
Disabling lint rules
Returning raw database errors
```

---

# 151. Refactoring Rules

Refactoring must preserve behavior unless behavior change is intentional.

Before refactoring:

- Understand dependencies.
- Check tests.
- Identify consumers.
- Make incremental changes.
- Run quality checks.

---

# 152. Backward Compatibility

When modifying shared modules:

- Search all usages.
- Update dependent modules.
- Maintain compatible contracts where possible.
- Avoid unnecessary breaking changes.

---

# 153. Feature Development Sequence

New features should generally follow:

```text
1. Understand requirement
2. Review architecture
3. Define types
4. Define validation
5. Define database changes if required
6. Implement repository
7. Implement service
8. Implement API
9. Implement client queries/hooks
10. Implement UI
11. Add states
12. Add tests
13. Run quality checks
14. Review security
15. Review performance
16. Verify requirements
```

---

# 154. Database Change Sequence

When database changes are needed:

```text
Schema
 ↓
Migration
 ↓
Prisma generation
 ↓
Repository
 ↓
Service
 ↓
API
 ↓
UI
 ↓
Tests
```

Do not update only the UI and assume the database architecture will automatically follow.

---

# 155. Public Page Completion Rules

A public page is complete only when:

- Requirements are satisfied
- Responsive behavior works
- Accessibility is considered
- SEO is implemented
- Loading states exist where necessary
- Error states exist where necessary
- Empty states exist where applicable
- CMS/API integration works where required
- Performance is acceptable
- Design follows `DESIGN.md`

---

# 156. Admin Feature Completion Rules

An admin feature is complete only when:

- Authentication works
- Authorization works
- CRUD works
- Validation works
- API contract works
- Database operations work
- Loading state exists
- Empty state exists
- Success state exists
- Error handling exists
- Destructive actions are confirmed
- Critical tests exist

---

# 157. Security-First Development Rule

When a feature has multiple implementation options, prefer the option that provides the stronger security boundary without unnecessary complexity.

Never sacrifice security merely for convenience.

---

# 158. Performance-First Where Appropriate

Do not optimize prematurely, but do not knowingly introduce expensive patterns.

Examples:

Avoid:

```text
Fetch entire database
→ Send all records to browser
→ Filter in JavaScript
```

Prefer:

```text
Validated query
→ Database filtering
→ Pagination
→ Minimal response
```

---

# 159. Maintainability Rule

Code should be understandable months after it was written.

Prefer:

```text
Clear names
Small modules
Predictable structure
Explicit contracts
Focused services
Consistent patterns
```

over clever but difficult implementations.

---

# 160. Readability Rule

Code must prioritize readability.

Avoid overly compressed logic when it makes behavior difficult to understand.

Prefer explicit code when it improves maintainability.

---

# 161. Reusability Rule

Reusable abstractions should be extracted when they provide meaningful reuse.

Do not abstract every tiny piece of code.

Good abstraction:

```text
Reusable DataTable
```

when multiple admin modules require the same behavior.

Bad abstraction:

```text
UniversalThingRenderer
```

for one isolated component.

---

# 162. Simplicity Rule

The simplest correct architecture is preferred.

Do not introduce complexity without a real requirement.

---

# 163. No Premature Optimization

Do not introduce:

- Complex caching
- Distributed systems
- Microservices
- Advanced queues
- Multiple databases

without a measurable requirement.

---

# 164. No Premature Abstraction

Do not create elaborate generic systems before multiple real use cases exist.

Build clear, focused abstractions.

---

# 165. Production Safety Rule

Before any production deployment:

```text
Git status clean
+
Environment verified
+
Database migration verified
+
TypeScript passes
+
ESLint passes
+
Tests pass
+
SonarQube quality gate passes
+
Production build passes
```

---

# 166. Final Quality Gate

A release must not proceed if there is a known critical:

- Security vulnerability
- Authorization bypass
- Data integrity issue
- Broken critical flow
- Failed production build
- Failed mandatory test
- Severe architectural violation

---

# 167. Rule for Changing These Rules

Do not silently change `RULES.md`.

If a project requirement makes an existing rule inappropriate:

1. Identify the conflict.
2. Determine the correct architectural decision.
3. Update the relevant documentation.
4. Ensure dependent code follows the new rule.
5. Verify the project remains internally consistent.

---

# 168. Golden Rules

The following rules are absolute unless explicitly changed through an architectural decision:

```text
1. Never expose secrets.
2. Never trust client input.
3. Never rely on frontend authorization.
4. Never access Prisma directly from UI components.
5. Never put business logic inside UI components.
6. Never skip backend validation.
7. Never expose internal errors to users.
8. Never hardcode CMS-controlled content.
9. Never bypass authentication/authorization for convenience.
10. Never introduce unnecessary dependencies.
11. Never create unnecessary architectural complexity.
12. Never ignore security issues.
13. Never ignore critical test failures.
14. Never disable quality tools just to pass CI.
15. Never claim unfinished work is complete.
16. Always keep APIs reusable for future clients.
17. Always preserve modularity.
18. Always follow the established design system.
19. Always consider accessibility.
20. Always consider performance.
21. Always keep documentation synchronized with architecture.
22. Always verify the complete feature before marking it done.
```

---

# 169. Final Engineering Standard

The Scholar School Website must be developed as a **production-grade modular monolith** with:

```text
Next.js 16.3.x
        +
React
        +
TypeScript
        +
Tailwind CSS
        +
shadcn/ui
        +
Auth.js
        +
Zod
        +
React Hook Form
        +
TanStack Query
        +
Prisma
        +
PostgreSQL
        +
ESLint
        +
SonarQube
```

The implementation must maintain:

```text
Strong Architecture
        +
Strong Security
        +
Strong Type Safety
        +
Strong Validation
        +
Strong Testing
        +
Strong Performance
        +
Strong Accessibility
        +
Strong SEO
        +
Strong Modularity
        +
Strong Maintainability
```

The goal is not simply to make the website work.

The goal is to build a codebase that another developer or AI coding agent can understand, safely extend, test, deploy, maintain, and eventually reuse for future web, mobile, or desktop clients without requiring an architectural rewrite.

---

# 170. Definition of Done

A task is **DONE** only when:

```text
Requirement understood
        ↓
Implementation completed
        ↓
Architecture respected
        ↓
Security verified
        ↓
Validation implemented
        ↓
Authorization verified
        ↓
Database verified
        ↓
API verified
        ↓
UI verified
        ↓
Loading/Error/Empty states verified
        ↓
Responsive behavior verified
        ↓
Accessibility verified
        ↓
Tests completed
        ↓
TypeScript passes
        ↓
ESLint passes
        ↓
SonarQube passes
        ↓
Production build passes
        ↓
Documentation updated if required
        ↓
Feature manually verified
        ↓
DONE
```

**Nothing should be considered production-ready merely because the UI appears to work.**
