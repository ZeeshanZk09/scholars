# Scholar Higher Secondary School Website

This is a comprehensive full-stack Next.js web application for the Scholar Higher Secondary School, featuring a public-facing informative website and a robust backend administration panel (CMS).

## Tech Stack

- **Framework**: Next.js 16.3 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js (Auth.js) v5
- **Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons
- **Validation**: Zod + React Hook Form
- **Code Quality**: ESLint, SonarQube, TypeScript Compiler
- **Testing**: Vitest (Unit & Integration), Playwright (End-to-End)

## Installation

Ensure you have Node.js (v20+) and PostgreSQL running on your machine.

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env.local` file in the root directory by copying the example environment file:

```bash
cp .env.example .env.local
```

Fill in the necessary values, including your PostgreSQL `DATABASE_URL` and Auth.js `AUTH_SECRET`.

## Database Setup

Initialize the database schema and push the Prisma configuration:

```bash
# Push the schema to the database
npm run db:push

# Generate the Prisma client
npm run db:generate

# (Optional) Seed the database with initial admin data
npm run db:seed
```

## Development Commands

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Launch Prisma Studio to manage your database:
  ```bash
  npm run db:studio
  ```
- Run linter:
  ```bash
  npm run lint
  ```
- Run type checker:
  ```bash
  npm run typecheck
  ```
- Run Tests:
  ```bash
  npm run test        # Unit Tests (Vitest)
  npm run test:e2e    # E2E Smoke Tests (Playwright)
  ```

## Production Build

To build the application for production, execute:

```bash
npm run build
```

This command ensures an optimized, compiled build ready for your server environment.

## Deployment

The application is fully compatible with Vercel or any Node.js hosting platform (Docker, Railway, etc.).
For standard deployments:

1. Ensure your `.env` contains all required production secrets.
2. Build the project (`npm run build`).
3. Run database migrations (`npm run db:push`).
4. Start the application:
   ```bash
   npm run start
   ```

## Administration

Access the admin portal at `/admin`. Authentication is required. Users without appropriate roles are securely blocked at the middleware and API layers.
