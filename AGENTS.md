# Frontpage

Federated link aggregator built on AT Protocol (like Reddit/HN, but decentralized).

## Monorepo Structure

- **pnpm workspaces** (`packages/`) + **Cargo workspace** (`packages-rs/`)
- **Turbo** for task orchestration
- Main app: `packages/frontpage` (Next.js, App Router)
- Rust services: `packages-rs/` (drainpipe data pipeline, jetstream client)

## Key Tech

- **Next.js 16** with App Router, Turbopack, React Compiler
- **React 19** with Server Components and Server Actions
- **Drizzle ORM** with **Turso** (libSQL/SQLite)
- **Tailwind CSS** + shadcn/ui
- **Vitest** + React Testing Library for tests
- **AT Protocol** libraries (`@atproto/*`, `@atcute/*`)
- Deployed on **Vercel**

## Code Style

- ES modules everywhere (import/export, no CommonJS)
- Path alias: `@/*` maps to frontpage package root
- Shared ESLint config in `packages/eslint-config`
- Shared TypeScript config in `packages/typescript-config`
- Prettier for formatting

## Commands

```bash
pnpm install              # Install dependencies
pnpm turbo dev            # Run dev servers
pnpm turbo build          # Build all packages
pnpm turbo lint           # Lint
pnpm turbo test           # Run tests
pnpm turbo type-check     # Type check

# In packages/frontpage:
pnpm db:generate          # Generate Drizzle migrations
pnpm db:generate --custom --name=<name>  # Create empty migration for custom SQL
pnpm db:migrate           # Run migrations
pnpm db:studio            # Open Drizzle Studio
```

## Before Every Commit

Run these before committing — CI will catch failures but it's faster to catch them locally:

```bash
pnpm turbo lint type-check    # Lint + type errors
pnpm prettier --check "packages/frontpage/**/*.{ts,tsx}"  # Formatting
pnpm turbo build              # Full build (catches runtime config issues)
```

## Testing

- Vitest with jsdom environment
- Test files colocated next to source: `foo.test.tsx`
- Use `@testing-library/react` for component tests
- Run single package tests: `cd packages/frontpage && pnpm test`

## Next.js Conventions

- Page props and `generateMetadata` functions should be typed using the `PageProps` generic
- Route handler functions should receive context as generic type `RouteHandlerContext`

## Lexicon Tooling

- Lexicon changes require Go toolchain (`glot lint`, `glot compat`)
- Codegen: `pnpm exec lex gen-api ./src ../../lexicons/**/*.json` (must glob files, not pass directory)
- Lexicon CI runs `glot lint` and `glot compat` on `lexicons/**` changes

## Important Gotchas

- All `@atproto/*` and `@atcute/*` packages must be version-bumped together (see catalog in `pnpm-workspace.yaml`). New `@atproto/*` deps MUST use `"catalog:"` not a pinned version.
- `NODE_OPTIONS=--use-openssl-ca` is required for most commands (already baked into scripts). Set it manually if running Node commands outside package scripts.
- `typescript.ignoreBuildErrors: true` in Next.js config — type errors won't fail builds
- Secrets managed via 1Password (`dev-1pw` / `build-1pw` scripts)
- Local dev infra setup: see `packages/frontpage/local-infra/README.md`
- Node v24+ runs TypeScript natively — use `node script.ts` not `npx tsx`
- `next.config.mjs` has `cacheComponents: false` (implicit) — `dynamic = "force-static"` in existing routes is incompatible with `cacheComponents: true`. Enable only after migrating those routes.
- If `pnpm install` fails with `ENOTFOUND npm.jsr.io`, it's a DNS issue — confirm network can reach `npm.jsr.io`
- When adding new GitHub Actions, prefer fixed SHAs over floating tags. Include the version in a comment.

## Feeds

Feed generator system (issue #332). Key files:

- **Lexicons**: `lexicons/fyi/frontpage/feed/{generator,getFeedSkeleton,describeFeedGenerator}.json`
- **XRPC endpoints**: `app/xrpc/fyi.frontpage.feed.{getFeedSkeleton,describeFeedGenerator}/route.ts`, `app/.well-known/did.json/route.ts`
- **Data layer**: `lib/data/db/feed-skeleton.ts` (skeleton queries), `lib/data/db/hydrate-posts.ts` (hydration), `lib/data/db/visibility.ts` (shared filters)
- **Consumer**: `lib/data/feed-resolver.ts` (generic resolution), `lib/feed-action.tsx` (shared server action)
- **Constants**: `lib/data/feed-constants.ts` (FEED_SERVICE_DID env var, cache durations)
- **Security**: `lib/data/ssrf.ts` (shared SSRF protection)

Two DIDs:

- `did:plc:klmr76mpewpv7rtm3xgpzd7x` — the `frontpage.fyi` repo (publishes generator records)
- `did:web:frontpage.fyi` — the feed generator service (where `getFeedSkeleton` lives)
