# Agent Skills Inventory — AIMS School Website

Source of truth for all OpenCode agent skills available to this project.

## Skill-discovery convention

Whenever a specific capability/knowledge gap arises for this project:

1. Use the `find-skills` skill (skills.sh / vercel-labs/skills) to search the skills.sh directory.
2. Find the most relevant existing skill on skills.sh (official repos > vendor > well-maintained OSS > established collections > trusted community).
3. Security-review the full skill contents (SKILL.md + scripts + references) before installing.
4. Install into `.opencode/skills/` (project) unless global availability is clearly warranted.
5. Never invent/fabricate skills — only find and install existing ones; document gaps instead.

Note: `find-skills` is installed at `.agents/skills/find-skills/SKILL.md` (agent-compatible path, also scanned by OpenCode; mirrored globally at `~/.agents/skills/find-skills`). Use it as the entry point for skill discovery.

## Loading rules

- Skills are loaded at OpenCode session start from `.opencode/skills/<name>/SKILL.md` (project) plus global locations. Restart OpenCode after installing/editing skills.
- Skill `name` (frontmatter) must match its directory name and match `^[a-z0-9]+(-[a-z0-9]+)*$`.
- A skill is only advertised to the agent if it has both `name` and `description`.
- If a skill ID exists in both project and global scope, the later/precedence source wins (project overrides global).

## Installed skills

### Design / Brand / UI (in place before this task; global + project mirror)

| Skill | Scope | Purpose |
| --- | --- | --- |
| `banner-design` | global + project | Social/ads/hero/print banner design with AI visuals |
| `brand` | global + project | Brand voice, visual identity, messaging, brand compliance |
| `design` | global + project | Comprehensive design (logo, CIP, presentations, banners, icons, social photos) |
| `design-system` | global + project | Design tokens, component specs, brand-compliant presentations |
| `slides` | global + project | Strategic HTML presentations with Chart.js |
| `ui-styling` | global + project | shadcn/ui + Tailwind UI implementation, accessible components |
| `ui-ux-pro-max` | global + project | UI/UX design intelligence (searchable local database) |
| `codebase-memory` | global (`~/.config/opencode/skills`) | Codebase knowledge-graph usage for structural queries |

### Added by skills task (project `.opencode/skills/`, all security-reviewed)

| Skill | Source (repo) | Domain gap | Phase relevance |
| --- | --- | --- | --- |
| `vercel-react-best-practices` | vercel-labs/agent-skills | Next.js/React performance | 10, 11, 12, 28 |
| `vercel-composition-patterns` | vercel-labs/agent-skills | React component architecture | 10, 11, 12 |
| `prisma-cli` | prisma/skills | Prisma CLI workflows | 04, 05 |
| `prisma-database-setup` | prisma/skills | Prisma + database provider setup | 04 |
| `prisma-client-api` | prisma/skills | Prisma Client query/API | 04, 07, 12 |
| `supabase-postgres-best-practices` | supabase/agent-skills | PostgreSQL best practices | 04, 28 |
| `seo-audit` | coreyhaines31/marketingskills | Technical SEO audit | 26 |
| `webapp-testing` | anthropics/skills | Playwright web-app E2E testing | 30 |
| `test-driven-development` | obra/superpowers | TDD red/green/refactor | 30 |
| `systematic-debugging` | obra/superpowers | Root-cause debugging discipline | all |
| `verification-before-completion` | obra/superpowers | Evidence-before-claims, DoD gate | 33, 34, all |
| `domain-modeling` | mattpocock/skills | Domain model + shared vocabulary | 03, 04, PRD alignment |

Sources (all MIT-licensed unless noted):
- `vercel-labs/agent-skills` (official Vercel)
- `prisma/skills` (official Prisma)
- `supabase/agent-skills` (official Supabase)
- `anthropics/skills` (official Anthropic; `webapp-testing` license: LICENSE.txt)
- `coreyhaines31/marketingskills` (trusted community)
- `obra/superpowers` (superpowers by Jesse Vincent, community)
- `mattpocock/skills` (Matt Pocock, community)

## Evaluated and NOT installed (with reason)

- `vercel-react-view-transitions` — React View Transition API; Next 16.2+ required, only useful if routing transitions are adopted (deferred).
- `vercel-optimize` / `deploy-to-vercel` / `vercel-cli-with-tokens` — deployment-phase operator tools; not needed during build phases. `deploy-to-vercel` also uploads the repo to a remote deploy service (accepted only when the user opts in).
- `vercel-react-native-skills` — React Native/Expo; N/A for web.
- `web-design-guidelines` — duplicates existing UI/UX skills (`ui-ux-pro-max`, `ui-styling`, `design-system`).
- `writing-guidelines` — docs/prose voice review; not a front-end gap.
- `prisma-postgres`, `prisma-postgres-setup` — Prisma Postgres (cloud/Management-API paradigm); project uses standard PostgreSQL per ACHITECHTURE/README; skipped to avoid steering to the cloud paradigm.
- Prisma/Postgres skills target **local development via Docker PostgreSQL image** and **Vercel-managed PostgreSQL in production** — there is NO local PostgreSQL install; a local dev DB must be provided through the Docker `postgres` image. Production is set up manually by the owner on Vercel.
- `supabase` (full) — the full Supabase platform skill duplicates; only the Postgres best-practices skill was installed.
- `frontend-design`, `canvas-design`, `brand-guidelines`, `skill-creator` (anthropics) — `frontend-design`/`canvas-design` duplicate existing design skills; `brand-guidelines` is Anthropic-specific (N/A); `skill-creator` is Claude-Code-`claude -p`-specific and incompatible with OpenCode runtime. No gap filled.
- mattpocock skills NOT installed: `tdd` (covered by `test-driven-development`), `diagnosing-bugs` (covered by `systematic-debugging`), `code-review`, `to-spec`, `to-tickets`, `wayfinder`, `triage`, `implement`, `wizard`, `resolving-merge-conflicts`, `setup-pre-commit`, `codebase-design`, `grilling`, `grill-with-docs`, `research`, `improve-codebase-architecture` — all security-clean but deferred to avoid skill duplication / preserve quality-over-quantity; `domain-modeling` was the single highest-value pick.
- obra/superpowers NOT installed: `writing-plans`, `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`, `brainstorming`, `test-driven-development` keepers, `using-superpowers`, `using-git-worktrees`, `finishing-a-development-branch`, `requesting-code-review`, `receiving-code-review`, `writing-skills` — the full superpowers **plugin + hooks** install (with session bootstrap and hooks) was not applied because the task scope is skills-only; the three highest-value standalone skills (TDD, systematic-debugging, verification-before-completion) were installed.

## Domain gaps still open (no skill installed)

- **Accessibility** (Phase 29) — no dedicated a11y skill installed.
- **Application security** (Phase 27) — no app-level security skill installed.
- **Media/3D/Three.js/R3F** (Phases 13, 16, 18) — 3D domain generally lacks a mature, secure, installable skill; must rely on `AIMS-3D-PERFORMANCE-AI-DEVELOPMENT-GUIDE.md` + `design`/`ui-ux-pro-max` skills and agent knowledge.
- **CMS/Prisma schema modeling** beyond basic setup — covered indirectly by `prisma-*` + `domain-modeling`; no full CMS-build skill.
- **Admissions/CRM logic** — covered only indirectly by `domain-modeling`; no dedicated skill found.
- **Animation** — no dedicated animation skill installed (`ui-ux-pro-max` includes GSAP presets; `design` covers motion).

## Security review record

Every installed skill's `SKILL.md` body and all bundled `scripts/` / `references/` were reviewed for: credential harvesting, network exfiltration, obfuscated code, unsafe `curl | bash`, env-var theft, and unknown-host calls. All installed skills are **SAFE** (no executable code with exfiltration surfaces; pure-markdown skills for React/Prisma/Postgres/SEO). `webapp-testing` uses a localhost-only server lifecycle wrapper (`subprocess.Popen` executes only the user-supplied server command). For ongoing hygiene, re-review any skill downloaded in the future before installing.