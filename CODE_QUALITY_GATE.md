# Code Quality Gate Documentation

## Overview

This project enforces a strict code quality gate before any production release. The gate consists of ESLint and TypeScript strict typechecking. A release MUST NOT proceed if critical issues remain unresolved.

## ESLint Rule Set Status

The ESLint configuration (`eslint.config.mgs`) is enforced on every commit via `npm run lint`. The following rule groups are enabled:

### Unused Variables & Imports

- `no-unused-vars`: Error — detects unused function parameters and variables; `argsIgnorePattern: "^_"` and `varsIgnorePattern: "^_"` suppress intentionally prefixed-underscore variables
- `no-unused-expressions`: Error — disallows unused expressions
- `array-callback-return`: Error — requires return values in array callback functions (critical for async pipelines)

### React Rules

- `react-hooks/exhaustive-deps`: Error — requires complete dependency arrays in `useEffect`, `useCallback`, `useMemo` (was `"warn"`, now `"error"` for production gate)
- `react/no-unknown-property`: Error — disallows unknown DOM properties
- `react/no-unknown-in-pattern`: Error — disallows unrecognized patterns in assignment destructuring
- `react/destructuring-assignment`: Error — requires destructuring assignment syntax
- `react/jsx-no-useless-fragment`: Error — disallows useless `<>...</>` fragments
- `react/jsx-no-bind`: Error — disallows unnecessary inline event handlers; allows arrow functions and refs

### TypeScript (via `eslint-plugin-typescript`)

- `ts/no-explicit-any`: Error — disallows `any` type usage
- `ts/ban-types`: Error — bans the `any` type entirely

### Complexity & Maintainability

- `complexity`: [error, 10] — maximum cyclomatic complexity of 10 per function
- `max-len`: [error, {code: 120}] — maximum line length of 120 characters (comments/urls/strings/template literals ignored)
- `no-extra-semi`: Error — disallows unnecessary semicolons
- `no-fallthrough-defaults`: Error — disallows fall-through cases in switch statements

### Import Correctness

- `import/no-duplicates`: Error — disallows duplicate imports
- `import/named`: Error — ensures named imports are used
- `import/default`: Error — ensures default imports are used
- `import/namespace`: Error — ensures namespace imports are used
- `import/order`: Off — intentionally disabled; project uses path aliases (`@/*`) resolved by TypeScript

### Potential Unsafe Patterns

- `no-implicit-coercion`: Error — disallows boolean/number/string implicit coercion
- `no-prototype-builtins`: Error — disallows direct prototype property access (use `hasOwnProperty`)
- `no-confusing-arrow`: Error — disallows confusing arrow function syntax

### Style Rules

- `semi`: [error, always] — semicolons required
- `quotes`: [error, double] — double quotes preferred
- `eol-last`: [error, never] — disallow trailing newlines at end of file
- `no-empty-pattern`: Error — disallows empty destructuring patterns
- `no-restricted-globals`: Error — restricts `event`, `arguments`, `caller`, `callee`

### Acceptable Known Issues

| Rule                          | Justification                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `react/prop-types`            | Off — TypeScript strict null checks provide type safety at compile time; prop-types would add unnecessary runtime overhead |
| `react/require-default-props` | Off — Not all components require default props; enforced where needed case-by-case                                         |
| `import/order`                | Off — Project uses `@/*` path aliases managed by TypeScript; order enforcement would conflict with path resolution         |

- `react/jsx-no-bind` allows `allowRefs: true` — some ref callbacks require the current pattern

## TypeScript Strictness Configuration

The TypeScript configuration (`tsconfig.json`) uses strict mode settings:

| Compiler Option              | Value  | Purpose                                                               |
| ---------------------------- | ------ | --------------------------------------------------------------------- |
| `strict`                     | `true` | Enables all strict type-checking options                              |
| `noImplicitAny`              | `true` | Warns on implicit `any`                                               |
| `strictNullChecks`           | `true` | Prevents `null`/`undefined` from being called/accessed without checks |
| `noUncheckedIndexedAccess`   | `true` | Prevents optional element access without checking                     |
| `noImplicitReturns`          | `true` | Ensures all code paths return a value in non-void functions           |
| `noFallthroughCasesInSwitch` | `true` | Ensures switch cases don't fall through without intent                |
| `noEmit`                     | `true` | Type checking only, no JavaScript output                              |
| `isolatedModules`            | `true` | Emits files individually without emitting dependents                  |
| `skipLibCheck`               | `true` | Skips type checking of declaration files                              |

**Critical TypeScript Issues That Block Production:**

- Use of `any` type (violates `no-explicit-any` ESLint rule)
- Accessing `.prop` on potentially `null`/`undefined` values
- Missing return statements in non-void functions
- Implicit `any` from untyped function parameters

**How to run TypeScript strict check:**

```bash
npm run typecheck
```

This runs `tsc --noEmit` which performs full type checking and exits with a non-zero status on any error.

## Quality Gate Execution

The production quality gate is run via two commands:

```bash
npm run lint      # ESLint quality check
npm run typecheck # TypeScript strict type check
```

Both must pass (exit code 0) for a release to be considered production-ready. The gate is enforced in the deployment pipeline:

```
ESLint → TypeScript Check → Tests → SonarQube → Production Build
```

## SonarQube Quality Metrics

SonarQube analysis is configured via `sonar-project.properties`. The codebase is set up for SonarQube analysis but requires a running SonarQube instance for gate evaluation.

### SonarQube Project Configuration

- **Project Key:** `scholar-school`
- **Project Name:** `Scholar School`
- **Sources:** `src/`
- **Tests:** `tests/`
- **Source Encoding:** UTF-8

### Excluded Paths (from SonarQube analysis)

- `**/node_modules/**`
- `**/.next/**`
- `**/public/**`
- `**/prisma/migrations/**`
- `**/.agents/**`
- `**/.claude/**`
- `**/agent/`

### SonarQube Quality Metrics Typically Caught

| Category            | What SonarQube Detects                            | ESLint Equivalent                                                      |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| **Bugs**            | Runtime errors, null dereferences, infinite loops | `no-unused-expressions`, `array-callback-return`, `no-confusing-arrow` |
| **Vulnerabilities** | Security-sensitive patterns, injection risks      | `no-restricted-syntax`, `no-implicit-coercion`                         |
| **Code Smells**     | Poor maintainability, complex methods             | `complexity: [error, 10]`, `max-len`, `no-prototype-builtins`          |
| **Duplicated Code** | Copy-pasted code blocks > 3% similarity           | Not covered by ESLint; requires SonarQube duplication analysis         |
| **Complexity**      | Cyclomatic complexity beyond threshold            | `complexity: [error, 10]`                                              |
| **Maintainability** | Readability, understandability issues             | `max-len`, `no-extra-semi`, `no-fallthrough-defaults`                  |
| **Reliability**     | Risk of runtime failure                           | `no-unused-vars`, `array-callback-return`, `strictNullChecks` (TS)     |

### Critical SonarQube Thresholds for Production Blocking

| Metric                  | Blocking Threshold          | Rationale                                       |
| ----------------------- | --------------------------- | ----------------------------------------------- |
| **Bug Count**           | > 0 critical/high bugs      | Any unresolved bug blocks release               |
| **Vulnerability Count** | > 0 high vulnerabilities    | Security vulnerabilities must be fixed          |
| **Code Smells**         | > 50 total smells           | High smell count indicates maintainability debt |
| **Duplicated Lines**    | > 5% duplication            | Excessive duplication violates DRY principle    |
| **Complexity**          | Avg. method complexity > 10 | Exceeds the ESLint threshold already configured |
| **Coverage**            | < 80%                       | Not yet configured; would block if too low      |

### How to Run SonarQube Analysis

```bash
# Requires SonarQube server running
sonar-scanner -Dsonar.projectKey=scholar-school \
  -Dsonar.sources=src \
  -Dsonar.tests=tests \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
```

**Note:** SonarQube is configured and ready for external gate integration. The project properties file is in place; analysis requires a running SonarQube instance.

## Production Release Blocking Criteria

A production release is blocked if **any** of the following conditions are true:

1. **ESLint exits with non-zero status** — any rule violation prevents release
2. **TypeScript `tsc --noEmit` exits with non-zero status** — any type error prevents release
3. **SonarQube reports critical/high bugs or vulnerabilities** — security and stability issues block release
4. **Cyclomatic complexity exceeds 10** in any function — already enforced by ESLint
5. **Lines of code > 120** in any file — already enforced by ESLint `max-len`

## Summary

The quality gate ensures that no production release contains:

- Unused variables or imports
- Incomplete React Hook dependency arrays
- Implicit type coercion bugs
- Complexity beyond maintainable thresholds
- TypeScript type errors
- Import correctness issues

All of the above must be resolved before `npm run build` and deployment proceed.
