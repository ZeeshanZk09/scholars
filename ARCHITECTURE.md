````markdown
# ARCHITECTURE.md

# Scholar School Website — Application Architecture

## 1. Document Purpose

This document defines the complete technical architecture, application structure, codebase organization, technology stack, architectural principles, security model, performance strategy, scalability strategy, data access patterns, API architecture, coding standards, and maintainability requirements for the Scholar School Website.

This document is a mandatory architectural guideline for developers and AI coding agents working on the project.

The architecture must remain:

- Modular
- Maintainable
- Secure
- Performant
- Testable
- Type-safe
- Scalable
- Reusable
- API-oriented
- Future-proof
- Localization-ready
- Mobile/desktop-client-ready

The implementation must follow this document together with:

- `PRD.md`
- `DESIGN.md`
- `RULES.md`
- `PHASES.md`

If implementation decisions conflict with this document, the architecture defined here takes precedence unless the architecture is intentionally revised.

---

# 2. Architectural Vision

The application is an institutional educational website with a secure CMS.

The public-facing website provides information about:

- School
- College
- Coaching
- Computer Courses
- Admissions
- Facilities
- Testimonials
- Blogs
- Contact information
- Institutional information

The administration area allows authorized users to manage website content without modifying source code.

The architecture must therefore separate:

1. Public presentation
2. Administrative presentation
3. API layer
4. Business/domain logic
5. Data access
6. Validation
7. Authentication/authorization
8. Shared types/contracts
9. Infrastructure utilities

The application must not become a monolithic collection of page-specific logic.

---

# 3. Core Architectural Principles

The following principles are mandatory.

## 3.1 Separation of Concerns

Every layer must have a clearly defined responsibility.

A component must not:

- Directly contain database queries
- Implement complex business rules
- Perform authorization decisions independently
- Contain reusable validation logic
- Duplicate API response formatting

Business logic belongs in services/domain modules.

Database operations belong in repositories/data-access modules.

Validation belongs in schemas.

Authentication belongs in authentication infrastructure.

Authorization belongs in authorization/policy logic.

UI rendering belongs in components/pages.

---

## 3.2 API-First Architecture

The application must use an API-oriented architecture.

Business functionality must be exposed through well-defined API endpoints where appropriate.

The API layer must be reusable by future:

- Mobile applications
- Desktop applications
- Admin applications
- Other institutional clients

The architecture must not tightly couple business logic to React components.

The frontend must never depend on database implementation details.

---

## 3.3 No Direct Database Access from UI

The following is forbidden:

```text
React Component
      ↓
Prisma
      ↓
Database
```
````

The preferred architecture is:

```text
UI
 ↓
API Client / Data Fetching
 ↓
API Route
 ↓
Controller / Request Handler
 ↓
Service
 ↓
Repository / Data Access
 ↓
Prisma
 ↓
PostgreSQL
```

For server-rendered public content, controlled server-side service access may be used when appropriate, but database access must still remain inside the defined data-access layer.

---

## 3.4 Business Logic Must Be Framework-Independent

Business logic should not depend unnecessarily on:

- React
- JSX
- Browser APIs
- Next.js page components
- Specific UI libraries

Business logic should be reusable from:

- API routes
- Background jobs if introduced later
- CLI tools if introduced later
- Mobile API consumers
- Desktop API consumers
- Tests

---

## 3.5 Modular Architecture

Every major feature should be independently understandable.

Examples:

```text
Admissions
Blogs
Banners
Facilities
Testimonials
Programs
Contact
Authentication
Users
Settings
```

Each feature should have clearly separated:

- Types
- Schemas
- Services
- Repositories
- API handlers
- Components
- Queries
- Hooks

Avoid creating a single massive:

```text
utils.ts
services.ts
api.ts
components.tsx
```

file.

---

# 4. Technology Stack

## 4.1 Core Stack

The project must use:

| Technology                   | Purpose                             |
| ---------------------------- | ----------------------------------- |
| Next.js 16.3.x               | Full-stack application framework    |
| React                        | UI                                  |
| TypeScript                   | Application language                |
| Tailwind CSS                 | Styling                             |
| shadcn/ui                    | UI component system                 |
| PostgreSQL                   | Database                            |
| Prisma ORM                   | Database access                     |
| Auth.js / NextAuth           | Authentication                      |
| Zod                          | Validation                          |
| React Hook Form              | Form management                     |
| TanStack Query / React Query | Client-side server-state management |
| ESLint                       | Linting                             |
| SonarQube                    | Static analysis / code quality      |
| Git                          | Version control                     |

---

# 5. Framework Architecture

## 5.1 Next.js App Router

The application must use the Next.js App Router.

Use:

```text
app/
```

for routing and route-level composition.

The application should use:

- Server Components by default
- Client Components only when required
- Route Handlers for API endpoints
- Metadata APIs for SEO
- Server-side rendering where beneficial
- Static generation where appropriate
- Dynamic rendering where required

---

# 6. Server Components

Server Components should be the default.

Use Server Components for:

- Public informational pages
- Blog pages
- Program pages
- Facilities
- Admissions information
- Static content sections
- SEO-critical content
- Database-backed content that does not require client interaction

Avoid unnecessary:

```tsx
"use client";
```

A component must only become a Client Component when it requires browser/client capabilities such as:

- User interaction requiring client state
- React hooks
- Browser APIs
- Interactive forms
- Client-side animations requiring client execution
- TanStack Query
- Complex interactive UI

Do not convert entire page trees into Client Components unnecessarily.

---

# 7. Client Components

Client Components should remain small and focused.

Avoid:

```text
Entire Page
   ↓
"use client"
   ↓
Everything becomes client-side
```

Prefer:

```text
Server Page
 ├── Server Content
 ├── Server Content
 └── Small Client Interaction
```

This reduces:

- JavaScript bundle size
- Hydration cost
- Memory usage
- Initial page load time

---

# 8. Rendering Strategy

Each page must use the rendering strategy appropriate to its content.

## Static/mostly static content

Prefer static generation for:

- About
- Facilities
- Contact
- Institutional information
- Stable program information

## Dynamic content

Use dynamic rendering/revalidation for:

- Admissions status
- Active banners
- Latest blogs
- CMS-controlled content

## Frequently changing content

Use appropriate cache/revalidation strategies rather than forcing all pages to be fully dynamic.

---

# 9. Application Layer Architecture

The application should follow a layered architecture.

```text
┌──────────────────────────────────────┐
│ Presentation Layer                   │
│ Pages / Components / Forms           │
└───────────────────┬──────────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│ API / Application Layer              │
│ Route Handlers / Controllers         │
└───────────────────┬──────────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│ Service / Domain Layer               │
│ Business Rules / Use Cases           │
└───────────────────┬──────────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│ Data Access Layer                    │
│ Repositories / Prisma                │
└───────────────────┬──────────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│ PostgreSQL                           │
└──────────────────────────────────────┘
```

Cross-cutting concerns:

```text
Authentication
Authorization
Validation
Logging
Error Handling
Configuration
Security
Caching
```

must be shared infrastructure rather than duplicated across features.

---

# 10. Recommended Codebase Structure

The project must use a scalable `src` structure.

Recommended structure:

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── school/
│   │   ├── college/
│   │   ├── coaching/
│   │   ├── computer-courses/
│   │   ├── admissions/
│   │   ├── facilities/
│   │   ├── testimonials/
│   │   ├── blog/
│   │   └── contact/
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── banners/
│   │   ├── admissions/
│   │   ├── programs/
│   │   ├── coaching/
│   │   ├── computer-courses/
│   │   ├── facilities/
│   │   ├── testimonials/
│   │   ├── blogs/
│   │   ├── contact/
│   │   └── settings/
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── banners/
│   │   ├── admissions/
│   │   ├── programs/
│   │   ├── coaching/
│   │   ├── computer-courses/
│   │   ├── facilities/
│   │   ├── testimonials/
│   │   ├── blogs/
│   │   ├── contact/
│   │   └── settings/
│   │
│   ├── login/
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── hero/
│   ├── forms/
│   ├── cards/
│   ├── tables/
│   ├── dialogs/
│   ├── feedback/
│   ├── admin/
│   └── shared/
│
├── features/
│   ├── admissions/
│   ├── banners/
│   ├── blogs/
│   ├── programs/
│   ├── facilities/
│   ├── testimonials/
│   ├── contact/
│   └── settings/
│
├── services/
│   ├── auth/
│   ├── admissions/
│   ├── banners/
│   ├── blogs/
│   ├── programs/
│   ├── facilities/
│   ├── testimonials/
│   ├── contact/
│   └── settings/
│
├── repositories/
│   ├── admissions/
│   ├── banners/
│   ├── blogs/
│   ├── programs/
│   ├── facilities/
│   ├── testimonials/
│   ├── contact/
│   └── settings/
│
├── schemas/
│   ├── admissions/
│   ├── banners/
│   ├── blogs/
│   ├── programs/
│   ├── facilities/
│   ├── testimonials/
│   ├── contact/
│   └── settings/
│
├── types/
│   ├── api/
│   ├── auth/
│   ├── admissions/
│   ├── banners/
│   ├── blogs/
│   ├── programs/
│   ├── facilities/
│   ├── testimonials/
│   └── common/
│
├── hooks/
│   ├── api/
│   ├── forms/
│   ├── auth/
│   └── ui/
│
├── queries/
│   ├── admissions/
│   ├── banners/
│   ├── blogs/
│   ├── programs/
│   ├── facilities/
│   └── testimonials/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── api/
│   ├── cache/
│   ├── security/
│   ├── logging/
│   └── config/
│
├── utils/
│   ├── formatting/
│   ├── validation/
│   ├── urls/
│   ├── dates/
│   └── general/
│
└── config/
    ├── site.ts
    ├── navigation.ts
    └── permissions.ts
```

The exact structure may evolve, but architectural separation must remain intact.

---

# 11. Feature Architecture

Each major feature should have a consistent structure.

Example:

```text
features/
└── admissions/
    ├── components/
    ├── types.ts
    ├── constants.ts
    ├── schemas.ts
    ├── queries.ts
    └── index.ts
```

Business logic belongs in:

```text
services/admissions/
```

Database operations belong in:

```text
repositories/admissions/
```

This allows the UI and backend responsibilities to remain separated.

---

# 12. Service Layer

The service layer is the primary location for business logic.

Example responsibilities:

```text
AdmissionService
BannerService
BlogService
ProgramService
FacilityService
TestimonialService
ContactService
SettingsService
```

A service should:

- Validate business conditions
- Coordinate repositories
- Enforce domain rules
- Handle workflows
- Transform domain data
- Coordinate transactions where necessary

A service should not:

- Render UI
- Return JSX
- Depend on React
- Contain UI-specific logic
- Read request headers directly unless explicitly required at the application boundary

---

# 13. Object-Oriented Design

The backend should use OOP where it improves modularity and maintainability.

Example:

```text
interface BlogRepository

class PrismaBlogRepository implements BlogRepository

class BlogService
```

Example conceptual architecture:

```text
BlogService
    │
    ├── BlogRepository
    │
    ├── SlugService
    │
    └── Validation
```

Interfaces should be introduced when they provide meaningful abstraction.

Do not create artificial interfaces for every trivial function merely to satisfy an OOP rule.

Use:

- Encapsulation
- Dependency inversion
- Single responsibility
- Composition
- Clear contracts

---

# 14. Repository Layer

Repositories are responsible for database interaction.

Example:

```text
BlogRepository
AdmissionRepository
BannerRepository
ProgramRepository
```

Repositories may use Prisma.

UI components must never import Prisma directly.

Example forbidden:

```tsx
import { prisma } from "@/lib/db";
```

inside a React component.

Correct:

```text
Component
   ↓
Service/API
   ↓
Repository
   ↓
Prisma
```

---

# 15. Prisma Architecture

Prisma must be centralized.

A single database client instance should be used appropriately to prevent unnecessary connection creation.

Recommended conceptual structure:

```text
src/lib/db/prisma.ts
```

Prisma models must represent the actual domain.

Avoid:

- Duplicate models
- Unnecessary relationships
- Unindexed frequently queried fields
- Ambiguous naming
- Storing multiple concepts in one field

Database constraints should enforce important invariants wherever possible.

---

# 16. PostgreSQL Architecture

PostgreSQL is the primary persistent data store.

Database design must prioritize:

- Referential integrity
- Correct relationships
- Appropriate indexes
- Unique constraints
- Foreign keys
- Nullable vs non-nullable correctness
- Transaction integrity
- Query efficiency

Do not rely exclusively on application code for data integrity.

---

# 17. Database Indexing

Indexes should exist for frequently queried fields.

Potential indexed fields include:

- Slugs
- Status
- Published state
- Publication dates
- Admission status
- Sort/order fields
- Foreign keys
- Frequently filtered timestamps

Do not blindly index every column.

Every index has storage and write-performance costs.

---

# 18. Transactions

Use database transactions when multiple operations must succeed or fail together.

Example:

```text
Update Blog
+
Update related metadata
+
Update publishing state
```

must use a transaction when partial updates could leave inconsistent data.

Transactions must be kept short.

---

# 19. API Architecture

API routes should be thin.

Recommended:

```text
HTTP Request
    ↓
Authentication
    ↓
Authorization
    ↓
Input Validation
    ↓
Controller/Handler
    ↓
Service
    ↓
Repository
    ↓
Database
    ↓
Response Mapper
    ↓
HTTP Response
```

The route handler should not contain large business logic blocks.

---

# 20. API Endpoint Organization

Use resource-oriented API structures.

Examples:

```text
/api/banners
/api/banners/[id]

/api/admissions
/api/admissions/[id]

/api/blogs
/api/blogs/[id]

/api/programs
/api/programs/[id]

/api/facilities
/api/facilities/[id]

/api/testimonials
/api/testimonials/[id]

/api/settings
```

Use HTTP methods appropriately:

```text
GET
POST
PATCH
DELETE
```

Do not use POST for every operation.

---

# 21. API Versioning

The architecture should be capable of future API versioning.

If versioning becomes necessary, use:

```text
/api/v1/...
```

rather than breaking existing clients.

Versioning should not be introduced unnecessarily for the initial release.

---

# 22. API Response Contract

All APIs must use predictable response structures.

Successful response:

```ts
{
  success: true,
  data: ...
}
```

Error response:

```ts
{
  success: false,
  error: {
    code: "...",
    message: "...",
    details?: ...
  }
}
```

Do not expose:

- Stack traces
- Database errors
- SQL details
- Internal file paths
- Secrets
- Authentication internals

---

# 23. HTTP Status Codes

Use appropriate status codes.

Examples:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

Do not return `500` for normal validation or user mistakes.

---

# 24. Error Handling

Errors must be categorized.

Recommended categories:

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

Errors must be handled centrally where possible.

Frontend messages must be meaningful but safe.

Example:

```text
"Unable to save the admission information. Please try again."
```

rather than:

```text
PrismaClientKnownRequestError: ...
```

---

# 25. Validation Architecture

All external input must be validated.

Use Zod.

Validation must occur at API boundaries.

Validate:

- Request body
- Query parameters
- Route parameters
- Search parameters
- Form submissions
- CMS content inputs

Never trust frontend validation alone.

---

# 26. Type Safety

TypeScript strict mode must be enabled.

Avoid:

```ts
any;
```

unless absolutely unavoidable and documented.

Prefer:

```ts
unknown;
```

when the type is genuinely unknown.

Use:

- Explicit interfaces
- Type aliases
- Generic types
- Zod inferred types
- Shared API contracts

Types should not be duplicated unnecessarily.

---

# 27. Authentication

Authentication must use Auth.js / NextAuth.

Authentication applies primarily to the administration area.

Public visitors do not require accounts.

Authentication must support:

- Secure login
- Session management
- Secure password handling if credentials authentication is used
- Logout
- Session expiration
- Protected admin routes

Credentials must never be stored in plain text.

---

# 28. Authorization

Authentication answers:

```text
Who are you?
```

Authorization answers:

```text
What are you allowed to do?
```

The system must enforce authorization server-side.

Never rely on:

```tsx
if (user.role === "ADMIN")
```

in the frontend alone.

Authorization must be checked in:

- API routes
- Services where required
- Administrative mutations
- Sensitive operations

---

# 29. Role-Based Access Control

The architecture must support RBAC.

Example roles:

```text
SUPER_ADMIN
ADMIN
EDITOR
```

The final roles should be defined according to actual project requirements.

Permissions should be centralized.

Example:

```text
BANNER_READ
BANNER_CREATE
BANNER_UPDATE
BANNER_DELETE

BLOG_READ
BLOG_CREATE
BLOG_UPDATE
BLOG_DELETE

ADMISSION_READ
ADMISSION_CREATE
ADMISSION_UPDATE
ADMISSION_DELETE
```

Avoid scattered role checks throughout the codebase.

---

# 30. Route Protection

Admin routes must be protected at the appropriate application boundary.

Example:

```text
/admin/*
```

must not be publicly accessible.

API mutation endpoints must also enforce authorization independently.

Never assume that protecting `/admin` automatically protects `/api`.

---

# 31. Security Architecture

Security must be treated as a system-wide requirement.

The application must protect against:

- SQL injection
- XSS
- CSRF where applicable
- Broken authentication
- Broken authorization
- Session attacks
- Brute-force attempts
- Malicious input
- Data leakage
- Insecure file handling
- Open redirects
- Injection attacks
- Sensitive information exposure
- Improper access control

---

# 32. SQL Injection Protection

Never construct SQL using unsafe string concatenation.

Use Prisma's parameterized APIs.

Raw SQL must be avoided unless genuinely required.

If raw SQL is required, parameterized queries must be used.

---

# 33. XSS Protection

CMS content must be treated as untrusted input.

Do not render arbitrary HTML using:

```tsx
dangerouslySetInnerHTML;
```

unless the content has been properly sanitized and its use is explicitly justified.

User-generated content must be sanitized before rendering where HTML is supported.

---

# 34. CSRF Protection

State-changing operations must be protected according to the authentication and request architecture.

Do not expose unsafe mutation endpoints without appropriate protection.

Cookies must use secure configuration where applicable:

```text
HttpOnly
Secure
SameSite
```

---

# 35. Security Headers

The application should configure appropriate security headers.

Potential headers include:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

Security headers must be configured carefully to avoid breaking legitimate application functionality.

---

# 36. Rate Limiting

Rate limiting should be applied to sensitive endpoints where appropriate.

Especially:

```text
Login
Authentication
Contact submissions
Public mutation endpoints
Potentially expensive search endpoints
```

Rate limiting must not unnecessarily degrade normal public browsing.

The implementation should remain compatible with future infrastructure changes.

---

# 37. Input Limits

Requests must have reasonable limits.

Examples:

- Maximum text lengths
- Maximum query length
- Maximum pagination size
- Maximum request body size
- Maximum uploaded file size if uploads are introduced

Never allow unrestricted input.

---

# 38. Open Redirect Protection

Redirect URLs must not blindly accept arbitrary external values.

Validate allowed redirect destinations.

Avoid patterns where user input is directly passed into redirects.

---

# 39. Secrets Management

Secrets must never be committed to Git.

Forbidden:

```text
DATABASE_URL=...
AUTH_SECRET=...
```

inside source code.

Use environment variables.

Provide:

```text
.env.example
```

with placeholder values.

Never expose server-only secrets to client-side code.

---

# 40. Environment Configuration

Configuration should be centralized.

Recommended:

```text
src/lib/config/
```

Separate:

```text
Server Configuration
Client Configuration
Application Configuration
```

Environment variables should be validated at startup/application boundaries.

Missing required configuration must produce clear errors.

---

# 41. Dependency Management

Dependencies must be:

- Necessary
- Maintained
- Justified
- Compatible with the project
- Free/open-source where possible

Avoid adding dependencies for trivial functionality that can be safely implemented with existing capabilities.

Before adding a package, determine whether:

1. Existing project code already provides the functionality.
2. Next.js/React provides the functionality.
3. shadcn/ui provides the required UI.
4. A lightweight dependency is genuinely necessary.

---

# 42. No Third-Party Vendor Services

The project must not depend on paid/proprietary third-party SaaS vendors for core functionality.

The architecture should remain self-contained as much as reasonably possible.

Open-source libraries are acceptable.

Infrastructure may evolve later.

---

# 43. UI Architecture

UI must be built using:

```text
React
Tailwind CSS
shadcn/ui
```

The project should reuse shadcn/ui components wherever appropriate.

Do not recreate components that shadcn already provides.

Examples:

Use:

```text
Dialog
Select
DropdownMenu
Sheet
Tabs
Table
Form
Input
Textarea
Button
Alert
Badge
Card
```

instead of manually implementing equivalent replacements.

---

# 44. Component Architecture

Components should follow single responsibility.

Bad:

```text
HugeDashboard.tsx
```

containing:

- API calls
- Forms
- Tables
- Modals
- Business logic
- Validation
- Formatting

Prefer:

```text
Dashboard
├── DashboardHeader
├── StatisticsCards
├── RecentContent
├── AdmissionStatus
└── ActivitySummary
```

---

# 45. Component Reusability

Reusable components should be extracted when they have:

- Repeated usage
- Stable responsibility
- Clear API
- Meaningful abstraction

Do not over-engineer one-off components.

Avoid premature abstraction.

---

# 46. Forms Architecture

Forms should use:

```text
React Hook Form
+
Zod
+
Reusable UI components
```

The same validation rules should not be independently recreated on frontend and backend.

Where practical:

```text
Zod Schema
      ↓
Form validation
      ↓
API validation
```

---

# 47. Data Fetching Architecture

Use server-side fetching where appropriate.

Use TanStack Query when client-side server state requires:

- Caching
- Refetching
- Mutation state
- Optimistic updates
- Client-side synchronization
- Interactive admin interfaces

Do not use TanStack Query merely because it exists.

Public static content should preferably remain server-rendered.

---

# 48. Query Architecture

Queries should be separated from UI components.

Example:

```text
queries/blogs/
    getBlogs.ts
    getBlogBySlug.ts
    getFeaturedBlogs.ts
```

Avoid putting large fetch functions directly inside JSX components.

---

# 49. Mutation Architecture

Mutations must go through the API/application layer.

Example:

```text
Admin Form
   ↓
Mutation Hook
   ↓
API Client
   ↓
API Endpoint
   ↓
Authorization
   ↓
Validation
   ↓
Service
   ↓
Repository
```

---

# 50. API Client

A centralized API client should be used for client-side API communication.

It should handle:

- Base URL
- Headers
- JSON parsing
- Error handling
- Response normalization
- Authentication/session behavior where appropriate

Avoid duplicating:

```ts
fetch(...)
```

logic throughout components.

---

# 51. Caching Strategy

Caching must be intentional.

Potential cacheable content:

- Public blog listings
- Program listings
- Facilities
- Testimonials
- Published banners
- Institutional content

Do not cache:

- Sensitive admin responses
- User-specific data
- Authentication information

unless explicitly designed for it.

---

# 52. Cache Invalidation

When CMS content changes, affected cached content must be invalidated or revalidated.

Examples:

```text
Update Blog
    ↓
Invalidate/revalidate blog listing
    ↓
Invalidate/revalidate blog detail
```

Do not allow stale CMS content to remain indefinitely.

---

# 53. Performance Architecture

Performance is a first-class architectural requirement.

Optimize:

- Server rendering
- JavaScript bundles
- Images
- Fonts
- Database queries
- API responses
- Network requests
- Component hydration
- Caching
- Content delivery

---

# 54. JavaScript Minimization

Prefer Server Components.

Avoid unnecessary client libraries.

Do not load:

- Large libraries for tiny features
- Client-side dependencies for server-only operations
- Heavy components before they are needed

Use dynamic imports where appropriate.

---

# 55. Image Optimization

Use Next.js image optimization mechanisms where appropriate.

Images should:

- Have meaningful dimensions
- Use appropriate formats
- Have descriptive alt text
- Avoid unnecessary large source files
- Use responsive sizing

Do not ship 5 MB images for small cards.

---

# 56. Font Optimization

Fonts must be loaded efficiently.

Avoid unnecessary font families.

Use only required weights.

Typography must follow `DESIGN.md`.

---

# 57. Database Performance

Avoid N+1 queries.

Prefer efficient Prisma queries.

Select only required fields where practical.

Avoid retrieving entire records when only a few fields are needed.

Pagination must be implemented for potentially large datasets.

---

# 58. Pagination

Admin tables and large public collections must support pagination where necessary.

Never assume:

```text
100,000 records
↓
fetch everything
```

Use:

- Page-based pagination
- Cursor pagination where beneficial

The API must enforce sensible maximum page sizes.

---

# 59. Search Performance

Search functionality should use database-supported querying.

Avoid loading the entire dataset into application memory merely to search it.

Search inputs must be validated and bounded.

---

# 60. SEO Architecture

SEO must be implemented at the framework level.

Use Next.js metadata APIs.

Pages should support:

- Title
- Description
- Open Graph metadata
- Canonical URL where appropriate
- Robots metadata
- Structured data where beneficial

Generate:

```text
sitemap.xml
robots.txt
```

appropriately.

---

# 61. URL Architecture

URLs must be:

- Human-readable
- Stable
- SEO-friendly
- Semantic

Examples:

```text
/about
/school
/college
/coaching
/computer-courses
/admissions
/facilities
/blog
/blog/example-post
/contact
```

Avoid meaningless IDs in public URLs when slugs are appropriate.

---

# 62. Slug Architecture

CMS-managed content should use unique slugs where applicable.

Example:

```text
/blog/annual-examination-preparation
```

Slugs must be:

- Unique
- URL-safe
- Stable
- Validated

Slug collisions must result in controlled errors.

---

# 63. Content Architecture

CMS content must not be unnecessarily hardcoded.

Examples of CMS-controlled content:

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

Hardcoded content should be limited to:

- Application structure
- Static navigation labels where appropriate
- System configuration
- UI defaults
- Technical constants

---

# 64. Content Publishing Model

CMS content should support publishing states where required.

Possible states:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Public pages must only expose content that is intended to be public.

---

# 65. Admission Architecture

Admissions are dynamic.

The system must support:

```text
OPEN
CLOSED
UPCOMING
```

or an equivalent controlled status model.

Admission configuration may include:

- Program/class
- Eligibility
- Opening date
- Closing date
- Required documents
- Instructions
- Fee information
- Contact information
- CTA
- Status

Business rules must be implemented in the service layer.

---

# 66. Banner Architecture

Banners must be CMS-controlled.

A banner may contain:

```text
Title
Subtitle
Description
Image
CTA text
CTA URL
Display order
Active status
Start date
End date
```

The backend determines which banners are currently active.

The frontend must not implement business rules such as:

```text
if date > ...
```

independently from the backend/domain layer when the rule is part of CMS publishing logic.

---

# 67. Blog Architecture

Blogs should support:

```text
Title
Slug
Excerpt
Content
Featured image
Author
Publication date
Status
SEO metadata
```

Potential future fields may include:

```text
Categories
Tags
Reading time
```

The architecture should not require them initially.

---

# 68. Shared Domain Types

Shared types should live in dedicated type modules.

Examples:

```text
AdmissionStatus
PublicationStatus
UserRole
ApiResponse
Pagination
```

Avoid redefining the same type in:

```text
Component A
API B
Service C
```

---

# 69. API Contracts

API request and response structures should have explicit contracts.

Example:

```ts
type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };
```

Contracts should remain predictable for future clients.

---

# 70. Logging Architecture

Application logging should be centralized.

Logs should help diagnose:

- Authentication failures
- Authorization failures
- Unexpected server errors
- Database failures
- Important administrative actions
- System failures

Never log:

- Passwords
- Tokens
- Secrets
- Session credentials
- Sensitive personal data unnecessarily

---

# 71. Auditability

Administrative actions should be designed so important changes can be traced where appropriate.

Future-compatible architecture should support audit records such as:

```text
User
Action
Resource
Resource ID
Timestamp
Result
```

Full audit logging may be implemented according to project requirements.

---

# 72. Observability

The architecture should allow future integration of monitoring without major rewrites.

Keep:

- Logging
- Error handling
- API boundaries
- Database access
- Services

separated so observability can later be introduced cleanly.

---

# 73. File Handling

If file uploads are introduced, file handling must be centralized.

Never trust:

- File extension
- MIME type supplied by client
- Filename
- File size

Validate:

- Type
- Size
- Content where practical
- Filename
- Storage destination

Uploaded files must never be directly executable.

---

# 74. Mobile Responsiveness

The architecture must support responsive UI without creating separate mobile applications.

Use:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

responsive layouts.

Avoid duplicating entire components solely for mobile/desktop versions unless genuinely necessary.

---

# 75. Accessibility Architecture

Accessibility must be built into reusable components.

Use:

- Semantic HTML
- Proper labels
- Keyboard navigation
- Focus management
- Accessible dialogs
- Accessible forms
- ARIA only where necessary
- Meaningful alt text
- Correct heading hierarchy

Reusable UI components must not introduce accessibility regressions.

---

# 76. Internationalization Readiness

Multilingual support is not part of the initial implementation.

However, the architecture must remain localization-ready.

Do not design the database or components in a way that makes future translation extremely difficult.

Avoid deeply embedding content assumptions that prevent future localized fields.

---

# 77. Configuration vs Content

Configuration belongs in code/configuration.

Content belongs in the CMS/database.

Example:

```text
Site name → configuration/CMS
Navigation structure → configuration
Blog title → database
Admission status → database
Database URL → environment variable
Button styling → design system
```

Do not store technical configuration as CMS content unnecessarily.

---

# 78. Error Boundaries

The application should provide appropriate error boundaries.

At minimum:

```text
Global Error
Page Error
Admin Error
```

Errors should provide:

- User-friendly message
- Recovery action where possible
- No sensitive internal information

---

# 79. Loading States

Every asynchronous user-facing operation must have a loading state where appropriate.

Examples:

```text
Skeleton
Spinner
Disabled submit button
Progress indicator
Loading table
```

Avoid blank screens during loading.

---

# 80. Empty States

Every list-based UI must have an intentional empty state.

Examples:

```text
No blogs published yet.
No facilities found.
No admissions configured.
```

Empty states should explain what happened and what the user can do next where applicable.

---

# 81. Destructive Operations

Destructive admin operations must require confirmation.

Examples:

```text
Delete Blog
Delete Banner
Delete Testimonial
Delete Program
```

Use accessible confirmation dialogs.

Prefer soft deletion/archive when appropriate for important content.

---

# 82. Admin Architecture

The admin application should have its own layout and navigation.

Conceptual structure:

```text
Admin
├── Dashboard
├── Banners
├── Admissions
├── School Programs
├── College Programs
├── Coaching
├── Computer Courses
├── Facilities
├── Testimonials
├── Blogs
├── Contact
└── Settings
```

Admin components must reuse the shared design system.

---

# 83. Public/Admin Separation

Public and admin interfaces must remain conceptually separated.

```text
Public
    ↓
Read-only published content

Admin
    ↓
Authenticated management
    ↓
CRUD operations
```

Public users must never receive admin capabilities.

---

# 84. Security Boundary

The following must always be considered a security boundary:

```text
Browser → API
```

Never trust:

- Hidden form fields
- Disabled buttons
- Frontend role checks
- Client-side validation
- Client-side route restrictions

All security-sensitive decisions must be enforced server-side.

---

# 85. Dependency Injection

Services should depend on abstractions where meaningful.

Example:

```text
BlogService
    ↓
BlogRepository interface
```

Production:

```text
PrismaBlogRepository
```

Testing:

```text
MockBlogRepository
```

This improves testability and modularity.

---

# 86. Testing Architecture

Testing must cover critical functionality.

Recommended levels:

```text
Unit Tests
Integration Tests
API Tests
End-to-End Tests
```

Critical areas:

- Authentication
- Authorization
- Validation
- CMS CRUD
- Admissions
- Blog publishing
- Banner activation
- API errors
- Database operations
- Admin flows
- Public critical flows

---

# 87. Unit Testing

Unit tests should focus on:

- Services
- Business rules
- Utility functions
- Validation
- Domain logic

Example:

```text
AdmissionService
    ├── should open admission
    ├── should close admission
    ├── should reject invalid state
```

---

# 88. Integration Testing

Integration tests should verify interactions between:

```text
Service
+
Repository
+
Database
```

where appropriate.

Test:

- CRUD behavior
- Constraints
- Transactions
- Query behavior

---

# 89. API Testing

API tests must verify:

- Authentication
- Authorization
- Validation
- Correct status codes
- Response contracts
- Error handling
- Database effects

---

# 90. End-to-End Testing

Important user flows should be tested end-to-end.

Examples:

```text
Admin Login
Admin creates blog
Blog published
Public user sees blog
Admin changes admission status
Public page reflects new status
```

---

# 91. Code Quality

The codebase must use:

```text
TypeScript strict
ESLint
SonarQube
```

No Biome.

Code quality must be checked before release.

---

# 92. ESLint

ESLint must enforce:

- Consistent coding practices
- React rules
- TypeScript rules
- Unused variable detection
- Unsafe patterns
- Import consistency
- Code smells

Rules should be configured deliberately rather than disabling warnings broadly.

Avoid:

```ts
// eslint-disable-next-line
```

unless justified.

---

# 93. SonarQube

SonarQube should be used to detect:

- Bugs
- Vulnerabilities
- Code smells
- Duplicated code
- Maintainability issues
- Reliability issues

The project should maintain a meaningful quality gate.

---

# 94. TypeScript Rules

Strict TypeScript must be enabled.

Avoid:

```ts
any;
```

Avoid unsafe casts:

```ts
as any
```

Prefer explicit runtime validation when external data is involved.

---

# 95. Naming Conventions

Use clear and consistent names.

Components:

```text
PascalCase
```

Functions:

```text
camelCase
```

Variables:

```text
camelCase
```

Types:

```text
PascalCase
```

Constants:

```text
UPPER_SNAKE_CASE
```

Files should follow a consistent project-wide convention.

Do not randomly mix:

```text
blogService.ts
BlogService.ts
blog-service.ts
```

without architectural justification.

---

# 96. Import Architecture

Prefer aliases:

```text
@/components
@/services
@/lib
@/types
```

Avoid excessive relative paths such as:

```text
../../../../../../services
```

Imports should remain readable and predictable.

---

# 97. Circular Dependencies

Circular dependencies must be avoided.

Bad:

```text
Service A
 ↓
Service B
 ↓
Service A
```

Refactor shared functionality into:

```text
Shared Domain Module
```

when necessary.

---

# 98. Barrel Exports

Barrel files may be used selectively.

Example:

```text
features/blogs/index.ts
```

Do not create enormous global barrel files that export the entire application.

Avoid import graphs that make tree-shaking and dependency analysis difficult.

---

# 99. Utility Architecture

Utilities must be focused.

Bad:

```text
utils.ts
```

containing 100 unrelated functions.

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

# 100. Constants

Repeated business constants must not be duplicated.

Examples:

```text
Admission statuses
User roles
Publication statuses
Pagination limits
```

should have centralized definitions.

---

# 101. Magic Numbers and Strings

Avoid unexplained values.

Bad:

```ts
if (items.length > 10) ...
```

Prefer:

```ts
const DEFAULT_PAGE_SIZE = 10;
```

when the value represents a meaningful application rule.

---

# 102. DRY Principle

Do not duplicate identical logic across:

- Components
- APIs
- Services
- Hooks
- Utilities

However, do not force unrelated concepts into a single abstraction merely to avoid a few repeated lines.

Prefer meaningful reuse.

---

# 103. Single Responsibility Principle

Every module should have one clear responsibility.

A service should not simultaneously become:

```text
Database layer
Authentication layer
Email layer
UI layer
Formatting layer
```

Split responsibilities appropriately.

---

# 104. Dependency Direction

Dependencies should generally flow inward:

```text
UI
 ↓
Application/API
 ↓
Domain/Service
 ↓
Data Access
 ↓
Infrastructure
```

Lower layers should not depend on higher-level UI modules.

---

# 105. Avoid God Objects

Do not create classes such as:

```text
ApplicationService
WebsiteManager
GlobalService
EverythingService
```

with dozens of unrelated responsibilities.

Prefer focused services.

---

# 106. Avoid God Components

Do not create huge components containing:

- Multiple pages
- Multiple business workflows
- Database logic
- API logic
- Complex forms
- Tables
- Dialogs

Break them into focused modules.

---

# 107. Maintainability

A new developer or AI agent should be able to understand a feature without reading the entire repository.

Feature implementation should be discoverable through predictable locations:

```text
Feature
 ├── Components
 ├── Types
 ├── Schemas
 ├── Queries
 ├── Service
 └── Repository
```

---

# 108. AI-Agent-Friendly Architecture

The codebase must be structured so AI coding agents can safely modify it.

Agents must be able to determine:

- Where UI belongs
- Where validation belongs
- Where API logic belongs
- Where business logic belongs
- Where database logic belongs
- Where types belong
- Where tests belong

Agents must not invent new architectural patterns for individual features.

They must follow existing conventions.

---

# 109. Change Isolation

Changes should affect the smallest reasonable area.

For example:

Changing blog behavior should primarily affect:

```text
features/blogs
services/blogs
repositories/blogs
schemas/blogs
API blog routes
Blog UI
```

It should not require modifying unrelated:

```text
Admissions
Facilities
Authentication
```

unless there is an actual dependency.

---

# 110. Backward Compatibility

When changing APIs or shared contracts:

- Check all consumers
- Update tests
- Update dependent components
- Avoid unnecessary breaking changes
- Preserve existing behavior unless intentionally changed

---

# 111. Database Migration Policy

Database schema changes must use Prisma migrations.

Never manually modify production database structure without a corresponding migration strategy.

Every schema change must consider:

- Existing data
- Backward compatibility
- Migration safety
- Indexes
- Constraints

---

# 112. Deployment Architecture

Initial deployment target:

```text
Vercel
    ↓
Next.js Application
    ↓
PostgreSQL
```

The architecture must not depend on Vercel-specific business logic.

The application should remain portable enough to move to another infrastructure provider later.

---

# 113. Docker

Docker is not required for the initial deployment.

The architecture should remain Docker-compatible for future deployment if required.

Do not introduce Docker complexity into the initial project unless there is a concrete requirement.

---

# 114. Scalability

The initial application is not expected to require microservices.

Start with a modular monolith.

```text
One Application
    ├── Public
    ├── Admin
    ├── API
    ├── Services
    ├── Repositories
    └── Database
```

This provides simplicity while maintaining clean boundaries.

---

# 115. Future Microservice Readiness

The application should be structured so major domains could theoretically be extracted later.

For example:

```text
BlogService
AdmissionService
ContentService
AuthService
```

should have clear boundaries.

Do not build microservices prematurely.

---

# 116. Background Jobs

Background jobs are not required initially.

If introduced later, they should be isolated from request/response logic.

Potential future jobs:

```text
Content processing
Email notifications
Scheduled publishing
Maintenance
Analytics processing
```

The service architecture should allow these workflows to be added without rewriting the domain layer.

---

# 117. Scheduled Content

Future scheduled publishing may use:

```text
startAt
endAt
publicationStatus
```

The architecture should keep scheduling logic in the service/domain layer.

---

# 118. Data Ownership

Every database entity must have a clear owner.

Examples:

```text
Blog → Blog domain
Admission → Admission domain
Banner → Banner domain
```

Avoid multiple unrelated services modifying the same entity without a clear contract.

---

# 119. Data Transfer Objects

API responses should not automatically expose raw Prisma models.

Use DTOs or response mappers when necessary.

This prevents:

- Internal database structure leakage
- Accidental sensitive-field exposure
- Tight coupling between API contracts and database schema

---

# 120. Serialization

Only serialize data that is required by the consumer.

Avoid returning:

```text
Internal IDs
Private metadata
Sensitive fields
Database-specific fields
```

unless required.

---

# 121. Public Data Safety

Public APIs must only expose content intended for public consumption.

For example, a public blog endpoint must not accidentally expose:

```text
Admin notes
Internal status metadata
Private user information
Authentication data
Internal audit information
```

---

# 122. Admin Data Safety

Admin endpoints must enforce:

```text
Authentication
+
Authorization
+
Validation
```

for every protected mutation.

---

# 123. Content Consistency

CMS content should have one authoritative source.

Do not maintain:

```text
Admission status in database
+
Admission status in config.ts
+
Admission status in homepage constants
```

The CMS/database should be authoritative for dynamic content.

---

# 124. Performance Budgets

The project should continuously monitor:

- Initial JavaScript
- Image sizes
- API response times
- Database query performance
- Core Web Vitals
- Server rendering performance

Performance regressions should be treated as defects.

---

# 125. Core Web Vitals

The public website should target strong:

```text
LCP
INP
CLS
```

performance.

Avoid:

- Layout shifts
- Blocking scripts
- Oversized images
- Excessive client hydration
- Unnecessary network requests

---

# 126. Accessibility + Performance

Accessibility must not be sacrificed for visual effects.

Animations should:

- Be lightweight
- Avoid blocking rendering
- Respect reduced-motion preferences
- Not interfere with keyboard interaction

---

# 127. Security + Performance Balance

Security controls must not be removed simply to improve benchmark numbers.

Optimize implementation rather than disabling security.

---

# 128. Documentation Requirements

Important architectural decisions should be documented.

Documentation should explain:

- Why a pattern exists
- Where new code belongs
- How to extend a feature
- Security assumptions
- Important constraints

Avoid comments that merely restate obvious code.

---

# 129. Code Comments

Comments should explain:

```text
WHY
```

rather than merely:

```text
WHAT
```

Bad:

```ts
// Get blogs
const blogs = ...
```

Good:

```ts
// Only published blogs are queried here because this repository
// method is used by the public website.
```

---

# 130. Error Messages

Errors must be:

- Meaningful
- Actionable
- Safe
- Consistent

Do not expose internal implementation details.

---

# 131. Logging vs User Errors

Internal logs may contain technical diagnostic information.

User-facing errors must remain safe.

Example:

```text
Internal:
Database constraint violation: ...

User:
Unable to save this content because a conflicting record already exists.
```

---

# 132. Security Review Requirements

Before production:

- Authentication reviewed
- Authorization reviewed
- API endpoints reviewed
- Input validation reviewed
- Database access reviewed
- Secrets reviewed
- Headers reviewed
- File handling reviewed
- Error leakage reviewed
- Rate limiting reviewed where applicable

---

# 133. Production Build Requirements

Before deployment:

```text
TypeScript
↓
ESLint
↓
Tests
↓
SonarQube
↓
Production Build
```

All required checks must pass.

---

# 134. CI/CD Architecture

The CI pipeline should eventually perform:

```text
Install dependencies
↓
Type check
↓
Lint
↓
Unit tests
↓
Integration/API tests
↓
SonarQube analysis
↓
Build
```

Deployment should not occur if mandatory quality gates fail.

---

# 135. Git Architecture

Use meaningful commits.

Examples:

```text
feat: add admission management
fix: resolve blog slug conflict
refactor: extract banner service
test: add admission service tests
security: restrict admin mutation endpoint
```

Avoid meaningless commits such as:

```text
update
changes
fix
stuff
```

---

# 136. Branching

Use a controlled branch strategy.

At minimum:

```text
main
```

should represent stable production-ready code.

Feature work should preferably happen in dedicated branches.

---

# 137. No Unnecessary Rewrites

AI agents and developers must not rewrite working architecture simply because they prefer another pattern.

Before refactoring:

1. Understand current architecture.
2. Identify actual problem.
3. Determine impact.
4. Verify tests.
5. Refactor incrementally.

---

# 138. Backward-Compatible Evolution

The architecture must evolve incrementally.

Prefer:

```text
Small change
↓
Test
↓
Validate
↓
Continue
```

over:

```text
Rewrite entire application
↓
Hope it works
```

---

# 139. Feature Completion Rule

A feature is not architecturally complete merely because the UI exists.

A complete feature may require:

```text
UI
+
Types
+
Schema
+
API
+
Authorization
+
Service
+
Repository
+
Database
+
Tests
+
Loading State
+
Error State
+
Empty State
```

depending on the feature.

---

# 140. Public Page Completion Rule

A public page is not complete until:

- Responsive
- Accessible
- SEO-ready
- Error-safe
- Loading-safe where needed
- Connected to CMS/API where required
- Performance-conscious
- Visually compliant with `DESIGN.md`

---

# 141. Admin Feature Completion Rule

An admin feature is not complete until:

- Authentication works
- Authorization works
- CRUD works
- Validation works
- API errors are handled
- Loading states exist
- Empty states exist
- Success feedback exists
- Destructive actions are confirmed
- Database constraints are respected
- Tests exist for critical behavior

---

# 142. Architectural Anti-Patterns

The following are prohibited unless explicitly justified:

```text
Direct Prisma access from components
Huge page components
Huge services
God objects
God components
Duplicated business logic
Unvalidated API input
Client-only authorization
Hardcoded CMS content
Raw SQL without justification
Excessive client components
Global mutable state without need
Unnecessary dependencies
Circular dependencies
Hardcoded secrets
Swallowed errors
Generic 500 errors for validation failures
```

---

# 143. State Management

Do not introduce a global state manager unless there is a demonstrated need.

Prefer:

```text
Server state → Server Components / TanStack Query
Form state → React Hook Form
Local UI state → React state
Authentication state → Auth.js session
```

Global state should be introduced only for genuinely cross-cutting client state.

---

# 144. API and Frontend Contract Stability

The frontend should consume APIs through explicit contracts.

If an API changes:

```text
Backend Contract
↓
Types
↓
API Client
↓
Hooks/Queries
↓
UI
```

must be reviewed together.

---

# 145. Future Mobile Application Support

Future mobile applications should be able to consume:

```text
/api/...
```

without depending on:

- React components
- Server Components
- Tailwind
- Admin UI
- Next.js page structure

This is one of the primary reasons the service/API architecture must remain separated.

---

# 146. Future Desktop Application Support

The same API architecture should support future:

- Desktop applications
- Internal admin clients
- Tablet applications

without duplicating business logic.

---

# 147. Architecture Decision Rule

When deciding where code belongs, ask:

### Is it UI?

Put it in:

```text
components/
app/
features/*/components/
```

### Is it validation?

Put it in:

```text
schemas/
```

### Is it business logic?

Put it in:

```text
services/
```

### Is it database access?

Put it in:

```text
repositories/
```

### Is it a reusable type?

Put it in:

```text
types/
```

### Is it reusable client behavior?

Put it in:

```text
hooks/
queries/
```

### Is it infrastructure?

Put it in:

```text
lib/
```

### Is it a small generic transformation?

Put it in:

```text
utils/
```

---

# 148. Architectural Golden Rule

The codebase must always preserve this separation:

```text
                    ┌───────────────┐
                    │   UI Layer    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ API / App     │
                    │ Layer         │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Service /     │
                    │ Domain Layer  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Repository /  │
                    │ Data Layer    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ PostgreSQL    │
                    └───────────────┘
```

Cross-cutting infrastructure:

```text
Authentication
Authorization
Validation
Security
Logging
Configuration
Caching
Error Handling
```

must support these layers without creating unwanted coupling.

---

# 149. Final Architectural Requirements

The final implementation must satisfy all of the following:

- Next.js 16.3.x App Router
- TypeScript strict mode
- PostgreSQL
- Prisma ORM
- Auth.js / NextAuth
- Zod
- React Hook Form
- TanStack Query where appropriate
- Tailwind CSS
- shadcn/ui
- ESLint
- SonarQube
- API-oriented architecture
- Modular monolith architecture
- Service/domain layer
- Repository/data-access layer
- Strong type safety
- Centralized validation
- Server-side authorization
- Secure authentication
- Secure API design
- Meaningful error handling
- Database integrity
- Efficient queries
- Pagination
- Caching/revalidation where appropriate
- Server Components by default
- Minimal client-side JavaScript
- Responsive architecture
- Accessibility
- SEO
- CMS-driven dynamic content
- Future localization readiness
- Future mobile API compatibility
- Future desktop API compatibility
- Testable architecture
- CI quality gates
- No hardcoded secrets
- No unnecessary third-party vendor dependency
- No direct database access from UI
- No duplicated business logic
- No unnecessary architectural complexity

---

# 150. Definition of Architectural Done

The architecture is considered complete only when:

1. Every major feature has a clearly defined architectural boundary.
2. UI is separated from business logic.
3. Business logic is separated from database access.
4. APIs expose stable and predictable contracts.
5. Authentication is implemented securely.
6. Authorization is enforced server-side.
7. All external input is validated.
8. Database integrity is enforced.
9. Critical operations are tested.
10. Public content is optimized for performance and SEO.
11. Admin functionality is protected.
12. Error handling is consistent.
13. Loading and empty states are implemented.
14. No critical secrets are exposed.
15. ESLint passes.
16. TypeScript checks pass.
17. Tests pass.
18. SonarQube quality requirements pass.
19. Production build succeeds.
20. The codebase remains understandable and modular.
21. Future mobile/desktop clients can consume the API without depending on the web UI.
22. Future multilingual support can be introduced without fundamentally redesigning the application.
23. The application can evolve from a modular monolith without requiring a complete rewrite.

---

# 151. Final Architecture Vision

The final system should behave as a **professional modular institutional web platform**, not merely a collection of webpages.

The architectural model is:

```text
                 SCHOLAR WEBSITE
                       │
        ┌──────────────┴──────────────┐
        │                             │
   PUBLIC WEBSITE                 ADMIN CMS
        │                             │
        └──────────────┬──────────────┘
                       │
                 APPLICATION API
                       │
              AUTH + AUTHORIZATION
                       │
                 SERVICE LAYER
                       │
                DOMAIN LOGIC
                       │
              REPOSITORY LAYER
                       │
                    PRISMA
                       │
                  POSTGRESQL
```

With:

```text
TypeScript
Zod
React Hook Form
TanStack Query
Tailwind
shadcn/ui
ESLint
SonarQube
Testing
Security
Caching
SEO
Performance
Accessibility
```

forming the supporting engineering ecosystem.

The objective is to build the application once with clean boundaries so that future requirements can be added through controlled extension rather than architectural rewrites.

**The architecture must favor simplicity without sacrificing correctness, modularity without unnecessary abstraction, security without shortcuts, and scalability without premature complexity.**
