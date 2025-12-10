# Copilot onboarding guide

Trust these notes before searching; only explore if something here is missing or incorrect.

## What this repo is
- **Frontpage**: a federated link aggregator on the ATProto/Bluesky network. Main web app lives in `packages/frontpage` (Next.js, Turbopack, Tailwind, Drizzle ORM).
- **Other apps/libs**: `packages/atproto-browser` (Next.js browser for ATProto), `packages/unravel` (Next.js marketing site), `packages/frontpage-atproto-client` (TypeScript client + generated lexicons), `packages/frontpage-oauth` & `packages/frontpage-oauth-preview-client` (OAuth helpers/demo).
- **Rust services** (Cargo workspace in `packages-rs/*`): drainpipe + related tooling for ingesting the ATProto firehose.
- **Lexicons**: ATProto lexicon definitions under `lexicons/fyi/frontpage`.

## Tooling & runtimes
- Node **v22.18.0** (`.nvmrc`); pnpm **10.12.0** (declared in root `package.json`); turbo **2.5.0**.
- TypeScript 5.9, Next 16 beta (Turbopack), React 19, Vitest, ESLint 9, Prettier 3.
- Drizzle ORM migrations in `packages/frontpage/drizzle` with `drizzle.config.ts`.
- Go tool `glot` is used only in lexicon CI; not needed for most tasks unless touching `lexicons/`.
- Rust stable via Cargo for `packages-rs/*`.

## Repository layout (high-value paths)
- Root: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.nvmrc`, `pnpm-lock.yaml`, `Cargo.toml`, `README.md`, `CONTRIBUTING.md`, workflows in `.github/workflows/`.
- Frontend app: `packages/frontpage/` (Next config `next.config.mjs`, lint config `eslint.config.mjs`, TS config `tsconfig.json`, Tailwind/postcss configs, Vercel config, Drizzle migrations/config, `app/` routes).
- Supporting apps/libs: `packages/atproto-browser/`, `packages/unravel/`, `packages/frontpage-atproto-client/`, `packages/frontpage-oauth/`, `packages/frontpage-oauth-preview-client/`, `packages/typescript-config/`, `packages/eslint-config/`.
- Rust services: `packages-rs/drainpipe`, `packages-rs/drainpipe-cli`, `packages-rs/drainpipe-store`, `packages-rs/jetstream`.
- Local dev infra: `packages/frontpage/local-infra` (docker-compose, CA certs, Cloudflare tunnel notes, test-account script).

## CI expectations
- PR workflow runs (see `.github/workflows/pr.yml`):
  - `pnpm exec prettier --check .`
  - `pnpm exec turbo run --affected lint`
  - `pnpm exec turbo run --affected test`
  - `pnpm exec turbo run --affected type-check`
- Lexicon changes (`lexicons/fyi/frontpage/**`) trigger Go-based `glot lint` and `glot compat`.
- Label sync on PRs; `sync-tangled` push job mirrors `main` to tangled.sh (uses secret).

## Setup / bootstrap
1. Ensure Node 22.18 available (`nvm use`).
2. Enable Corepack so pnpm 10.12.0 is provisioned: `corepack enable`.
3. Install JS deps from repo root: `pnpm install`.
   - If you see `ENOTFOUND npm.jsr.io` while fetching `@jsr/lpm__core@0.2.9` (pulled by `packages/atproto-browser`), it is a network/DNS issue: confirm egress/DNS can reach `npm.jsr.io` or route through a proxy. CI typically resolves this normally.

## Common commands (run from repo root unless noted)
- **Format check**: `pnpm exec prettier --check .`
- **Lint**: `pnpm exec turbo run lint` (or `--filter <package>` to narrow). Frontpage package also supports `pnpm --filter frontpage run lint`.
- **Tests**: `pnpm exec turbo run test` (Vitest). Per-package: `pnpm --filter frontpage run test`, etc.
- **Type-check**: `pnpm exec turbo run type-check` or `pnpm --filter frontpage run type-check`.
- **Build**:
  - Frontpage app: `pnpm --filter frontpage run build` (Turbopack; uses `NODE_OPTIONS=--use-openssl-ca` in script).
  - atproto-browser/unravel: `pnpm --filter <pkg> run build`.
  - Frontpage ATProto client: `pnpm --filter @repo/frontpage-atproto-client run build` (tsc).
- **Dev servers**:
  - Frontpage app: `pnpm --filter frontpage exec turbo dev` (or `pnpm --filter frontpage run dev`). For production DB access, team uses `dev-1pw` which relies on 1Password CLI and `.env.1pw`.
  - atproto-browser/unravel: `pnpm --filter <pkg> run dev`.
- **DB / Drizzle (frontpage)**: run inside `packages/frontpage`: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, `pnpm db:studio`, `pnpm db:pull`. Scripts set `NODE_OPTIONS=--use-openssl-ca`.
- **Lexicon tooling**: From root, install Go `glot` (see workflow) then `glot lint lexicons/fyi/frontpage` / `glot compat lexicons/fyi/frontpage` when touching lexicons.
- **Rust services**: Standard Cargo; e.g., `cargo build -p drainpipe` from repo root. Docker build example in `packages-rs/drainpipe/README.md`.

## Local infra (frontpage app)
- Follow `packages/frontpage/local-infra/README.md`:
  - `docker-compose up` to run PLC, PDS, Jetstream, Drainpipe, Turso, Caddy, cloudflared tunnel.
  - Install Unravel CA (`frontpage-local-infra_caddy_data/pki/authorities/unravel/root.crt`) and set `NODE_OPTIONS=--use-openssl-ca` for Node apps (frontpage scripts already set this).
  - Generate `.env.local` via `pnpm --filter=frontpage run generate-local-env`, run `pnpm db:migrate`, start app with `pnpm turbo dev` (or `pnpm --filter frontpage run dev`), grab cloudflared tunnel URL for access.
  - Troubleshooting steps for docker platforms, SSL renewal, Cloudflare 502, Windows WSL reset are in the README.

## Notes / tips
- The repo is a pnpm + turbo monorepo; tasks cascade via `turbo.json` (`dependsOn: ["^build"]` etc.).
- Config locations: lint configs per package (`eslint.config.mjs`), TS configs per package, Tailwind/PostCSS in frontend apps, Drizzle config in `packages/frontpage/drizzle.config.ts`, Vercel config `packages/frontpage/vercel.json`.
- If you run Node commands manually (not through package scripts) while using the local CA, export `NODE_OPTIONS=--use-openssl-ca`.
- Lexicon-related changes require Go toolchain; other changes do not.
- If package installs fail with `npm.jsr.io` DNS errors, fix network access first; lint/test/build commands depend on a complete install.

## File listing (root, high level)
`CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `README.md`, `SECURITY.md`, `LICENSE`, `.nvmrc`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`, `Cargo.toml`, `lexicons/`, `packages/`, `packages-rs/`, `.github/workflows/`.
