## Plan: Lex Schema-First Client Migration

Migrate apps/frontpage from old dotted convenience client calls to schema-first @atproto/lex usage in one cutover, reusing the already-refactored getAtprotoClient. Replace record create/get/delete call sites with client.create/get/delete(schema, ...), use generated $build helpers for outbound record and strongRef construction, and use generated $validate helpers for inbound hydration/ingestion records while preserving current fail-fast behavior.

**Steps**

1. Phase 1: Stabilize shared ATProto entrypoints and constants.
2. Add a pure/shared NSID export module (no server-only deps) and move all frontpage NSID consumers to it so client and server code no longer rely on stale repo.ts exports (blocks later call-site migration).
3. Keep getAtprotoClient in repo.ts as the single client factory, but update imports/exports so API, receive_hook, and feed code pull schemas/nsids from generated lex exports and shared constants (depends on 2).
4. Phase 2: Migrate write-path API modules to schema-first create/delete.
5. In lib/api/post.ts, replace dotted post.create/delete usage with client.create and client.delete using fyi.unravel.frontpage.post schema objects; build outbound records with post.$build and datetime utilities.
6. In lib/api/comment.ts, replace dotted comment.create/delete with schema-first calls; replace manual parent/post strongRef object literals and at:// string concatenation with com.atproto.repo.strongRef.$build and schema-driven values (parallel with 5 after step 2).
7. In lib/api/vote.ts, replace dotted vote.create/delete with schema-first calls; construct subject using strongRef.$build and validate/normalize subject collection branching before write (parallel with 5/6 after step 2).
8. Ensure read-after-write after hooks keep current semantics (DB first, async network write) and error handling remains equivalent in all three API modules (depends on 5-7).
9. Phase 3: Migrate ingestion hydration and validation.
10. In app/api/receive_hook/handlers.ts, replace dotted get calls with client.get(schema, { repo, rkey }) per collection branch and preserve dual-collection support.
11. In hydratePost, hydrateComment, and hydrateVote, validate incoming record values via schema.$validate before extraction; keep current behavior by throwing on invalid records so offset is not committed.
12. Replace ad-hoc type guards/invariants used only for schema shape checking with schema validation plus targeted domain assertions (for example expected subject variant handling) (depends on 10-11).
13. Phase 4: Migrate remaining schema consumers and resolve feed paths.
14. In lib/data/feed-resolver.ts, replace old getRecord response handling and validation calls with schema-first validation from generated lex exports where applicable, and keep external XRPC output validation unchanged.
15. In app/api/receive_hook/route.ts and any helper modules, ensure known collection checks and handler routing reference the same canonical nsid constants used by migrated schema calls to avoid drift (parallel with 14).
16. Remove obsolete old-client symbols/imports/usages (including deprecated helper classes/functions from @repo/frontpage-atproto-client root API) and enforce schema-first imports from fyi/com exports (depends on 5-15).
17. Phase 5: Hardening and cleanup.
18. Add/adjust unit tests around create/delete API modules and receive_hook hydration to cover valid/invalid schema payloads and dual-collection behavior.
19. Add a focused regression test for malformed incoming record validation to confirm current fail-fast semantics (offset not inserted when hydration validation throws).
20. Run lint/type-check/tests and fix migration fallout; confirm no remaining dotted old-client method usage via search checks (depends on all prior steps).

**Relevant files**

- /home/tom/code/unravel/apps/frontpage/lib/data/atproto/repo.ts — existing client factory already switched to @atproto/lex Client; keep as canonical factory.
- /home/tom/code/unravel/apps/frontpage/lib/api/post.ts — create/delete migration to client.create/client.delete with schema $build.
- /home/tom/code/unravel/apps/frontpage/lib/api/comment.ts — strongRef + comment schema migration and removal of manual at:// string assembly.
- /home/tom/code/unravel/apps/frontpage/lib/api/vote.ts — vote schema migration and subject strongRef construction.
- /home/tom/code/unravel/apps/frontpage/app/api/receive_hook/handlers.ts — hydration get calls and inbound schema $validate enforcement.
- /home/tom/code/unravel/apps/frontpage/app/api/receive_hook/route.ts — known collection routing aligned to canonical nsid source.
- /home/tom/code/unravel/apps/frontpage/lib/data/feed-resolver.ts — generator/fetch validation alignment with schema exports.
- /home/tom/code/unravel/apps/frontpage/lib/feed-constants.ts — existing client-safe nsid usage pattern to mirror/centralize.
- /home/tom/code/unravel/packages/frontpage-atproto-client/dist/fyi/unravel/frontpage/post.defs.d.ts — schema helper signatures ($build/$validate) used as migration target API shape.
- /home/tom/code/unravel/packages/frontpage-atproto-client/dist/fyi/unravel/frontpage/comment.defs.d.ts — comment record + strongRef schema contracts.
- /home/tom/code/unravel/packages/frontpage-atproto-client/dist/com/atproto/repo/strongRef.defs.d.ts — strongRef.$build/$validate target for subject/parent/post refs.

**Verification**

1. Search for leftover old dotted method usage and old imports: confirm no getAtprotoClient().fyi...create/get/delete call sites remain in apps/frontpage.
2. Run package checks in apps/frontpage: lint + type-check + tests.
3. Execute receive_hook path tests (or add targeted tests) for valid post/comment/vote hydration in both fyi.unravel.frontpage._ and fyi.frontpage.feed._ collections.
4. Add/execute malformed payload tests ensuring schema validation throws and consumed offset insertion does not occur for invalid records (matching current fail-fast behavior).
5. Smoke-test create/delete flows for post/comment/vote in local dev and verify DB pending/live transitions remain unchanged.

**Decisions**

- Single cutover migration (no temporary compatibility adapter).
- Remove old convenience/dotted client usage immediately.
- Validation mode should match current behavior: fail-fast on invalid ingestion/hydration data.

**Further Considerations**

1. Keep generated-schema import style consistent across app code (namespace import from @repo/frontpage-atproto-client/fyi and /com) to minimize churn and improve grep-ability.
2. Optionally expose canonical nsids from a new client-safe shared module under apps/frontpage/lib/data/atproto to remove schema.ts duplication and avoid future drift.
3. If strict datetime/cid parsing introduces production noise, add explicit logging with record URI context before throw to preserve operability while retaining fail-fast semantics.
