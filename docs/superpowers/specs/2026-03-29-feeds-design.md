# Frontpage Feeds — Design Specification

**Date:** 2026-03-29
**Authors:** Will, Tom, Claude
**Status:** Draft
**Issue:** #332

---

## 1. Overview

Frontpage feeds bring the AT Protocol feed generator pattern to Frontpage. A feed generator declares an algorithm that returns a ranked list of post AT URIs (a "skeleton"). Frontpage's AppView resolves the skeleton and hydrates it with vote counts, comment counts, author info, and moderation state from its own Turso DB.

This covers both sides:

- **Generator**: Frontpage serves `getFeedSkeleton` as XRPC endpoints so other AT Protocol apps can consume Frontpage feeds.
- **Consumer**: Frontpage resolves any `fyi.frontpage.feed.generator` record, calls the generator's skeleton endpoint, and hydrates the results for display.

Built-in feeds (hot/new/top) are local feed generators — same code path as external ones, just skip the network hop.

---

## 2. Lexicons

Three new lexicon JSON files in `lexicons/fyi/frontpage/feed/`, mirroring the Bluesky feed generator pattern under Frontpage's namespace.

### 2.1 `fyi.frontpage.feed.generator` (Record)

Declares a feed exists. Stored in any AT Protocol repo. The `did` field points to the service that runs the algorithm.

| Field                 | Type         | Required | Notes                             |
| --------------------- | ------------ | -------- | --------------------------------- |
| `did`                 | string (DID) | yes      | DID of the feed generator service |
| `displayName`         | string       | yes      | Max 240 graphemes                 |
| `description`         | string       | no       | Max 3000 graphemes                |
| `avatar`              | blob         | no       | PNG or JPEG                       |
| `acceptsInteractions` | boolean      | no       | Deferred — always false for v1    |
| `createdAt`           | datetime     | yes      |                                   |

Frontpage publishes three generator records to the `frontpage.fyi` repo (`did:plc:klmr76mpewpv7rtm3xgpzd7x`):

- `at://frontpage.fyi/fyi.frontpage.feed.generator/hot`
- `at://frontpage.fyi/fyi.frontpage.feed.generator/new`
- `at://frontpage.fyi/fyi.frontpage.feed.generator/top`

These are created manually via `com.atproto.repo.putRecord` — no automation needed for v1.

### 2.2 `fyi.frontpage.feed.getFeedSkeleton` (Query)

Implemented by feed generator services. Returns a ranked list of post AT URIs.

- **Params**: `feed` (at-uri, required), `limit` (int 1-100, default 50), `cursor` (string, optional)
- **Output**: `{ feed: [{ post: at-uri }], cursor?: string }`
- **Error**: `UnknownFeed`
- **Auth**: Optional service auth JWT (verified but not required for v1 public feeds)

Note: This is a query-type lexicon, not a record type. Codegen produces a method on the namespace class (like `describeRepo`) rather than a record class with CRUD methods. This is a new pattern under `fyi.frontpage.*` but already exists for `com.atproto.repo.*` in the generated client.

### 2.3 `fyi.frontpage.feed.describeFeedGenerator` (Query)

Self-description endpoint. Returns the service DID and list of feeds served.

- **Output**: `{ did: string, feeds: [{ uri: at-uri }] }`

### 2.4 Codegen

Adding these JSON files to `lexicons/fyi/frontpage/feed/` and running `@atproto/lex-cli` generates:

- Type files in `packages/frontpage-atproto-client/src/types/fyi/frontpage/feed/`
- Updated schema dict and client classes in `lexicons.ts` and `index.ts`

The CI workflow (`lexicon-check.yml`) runs `glot lint` and `glot compat` on PRs touching `lexicons/fyi/**`.

---

## 3. Feed Generator Identity

### 3.1 Generator Records

Published to `frontpage.fyi`'s PDS repo. Example:

```json
{
  "$type": "fyi.frontpage.feed.generator",
  "did": "did:web:frontpage.fyi",
  "displayName": "Hot",
  "description": "Trending posts on Frontpage",
  "createdAt": "2026-03-29T00:00:00Z"
}
```

The `did` field points consumers to the feed generator service.

### 3.2 `did:web:frontpage.fyi`

A `did:web` identity for the feed generator service. Served at `https://frontpage.fyi/.well-known/did.json`:

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:frontpage.fyi",
  "service": [
    {
      "id": "#frontpage_fg",
      "type": "FrontpageFeedGenerator",
      "serviceEndpoint": "https://frontpage.fyi"
    }
  ]
}
```

No custom domain needed — XRPC endpoints and the DID document are served on `frontpage.fyi` directly. If the feed generator moves to a separate service later, update the `did` field in the generator records to point to the new DID — the indirection is already there.

---

## 4. XRPC Endpoints (Generator Side)

Next.js API route handlers serving XRPC on `frontpage.fyi`:

```
packages/frontpage/app/
  .well-known/did.json/route.ts
  xrpc/fyi.frontpage.feed.getFeedSkeleton/route.ts
  xrpc/fyi.frontpage.feed.describeFeedGenerator/route.ts
```

### 4.1 `getFeedSkeleton`

1. Parse `feed` query param → validate:
   - URI authority (DID) matches our service DID (`did:web:frontpage.fyi`) — reject with `UnknownFeed` otherwise
   - Collection NSID is `fyi.frontpage.feed.generator` — reject with `UnknownFeed` otherwise
   - Rkey is in the known set (`hot`, `new`, `top`) — reject with `UnknownFeed` otherwise
2. Verify service auth JWT via `verifyServiceJwt` from `@atproto/xrpc-server`
   - `aud` must match `did:web:frontpage.fyi`
   - `lxm` must match `fyi.frontpage.feed.getFeedSkeleton` (prevents cross-endpoint token reuse)
   - Signature verified against issuer's DID document
   - Extracts requesting user's DID (available for future personalization)
   - Wrap in try/catch — return 401 on unresolvable `iss` DID without leaking resolution errors
3. Call local skeleton function based on rkey. All require `Post` inner join `PostAggregates`, with shared visibility filters applied (skeleton must not include banned/hidden posts — external consumers see the skeleton directly):
   - `hot` → `ORDER BY PostAggregates.rank DESC` (existing time-decay ranking)
   - `new` → `ORDER BY Post.createdAt DESC`
   - `top` → `ORDER BY PostAggregates.voteCount DESC`
4. Return `{ feed: [{ post: at-uri }], cursor }` with `Cache-Control: max-age=30, stale-while-revalidate=60` and `Vary: Authorization`
5. Cursor format varies by feed type:
   - `new`: `createdAt::postId` compound cursor (keyset pagination, stable under concurrent writes)
   - `top`: `voteCount::postId` compound cursor
   - `hot`: `rank::postId` compound cursor (rank changes dynamically, but is stable within a request)
6. Use `after()` for any logging/analytics to avoid blocking the response

### 4.2 `describeFeedGenerator`

Static JSON response listing the three feeds. `Cache-Control: public, max-age=86400`.

### 4.3 `did.json`

Static JSON response with the DID document. `Cache-Control: public, max-age=86400`. Must only be served on `frontpage.fyi` — see section 9.6 for host-based routing.

---

## 5. Feed Consumer (Generic Resolution)

The consumer takes any feed AT URI and resolves it to hydrated posts. This is generic — works for Frontpage's own feeds and any third-party feed generator.

### 5.1 Resolution Flow

```
resolveFeed("at://anyone/fyi.frontpage.feed.generator/whatever")
  │
  ├─ 1. Fetch generator record from the repo (any PDS)
  │     → com.atproto.repo.getRecord
  │     → extract `did` field
  │     (cached with `use cache` + cacheLife('hours'))
  │
  ├─ 2. Resolve service DID → DID document → service endpoint
  │     (cached with `use cache` + cacheLife('hours'))
  │
  ├─ 3. Is the service endpoint ours?
  │     ├─ yes → call local skeleton function (direct DB query)
  │     └─ no  → get service auth JWT from user's PDS (getServiceAuth)
  │              → XRPC call to external getFeedSkeleton with plain Bearer JWT
  │
  └─ 4. hydratePosts(skeleton.feed.map(s => s.post))
```

### 5.2 External Feed Auth Flow

When calling an external feed generator, Frontpage obtains a service auth JWT from the user's PDS:

```
User's PDS                    Frontpage (AppView)              External Feed Gen
     │                              │                                │
     │   getServiceAuth             │                                │
     │   aud: feedgen DID           │                                │
     │   (via fetchAuthenticatedAtproto │                            │
     │    — DPoP-bound to PDS)      │                                │
     │ ◄──────────────────────────  │                                │
     │                              │                                │
     │  JWT { iss: user DID,        │                                │
     │        aud: feedgen DID }    │                                │
     │ ──────────────────────────►  │                                │
     │                              │  getFeedSkeleton               │
     │                              │  Auth: Bearer <JWT>            │
     │                              │  (plain Bearer, NOT DPoP)      │
     │                              │ ─────────────────────────────► │
     │                              │ ◄───────────────────────────── │
     │                              │  skeleton                      │
```

Frontpage doesn't sign anything. The user's PDS issues the JWT; the feed generator verifies it against the user's DID document.

**Implementation notes:**

- The `getServiceAuth` call to the user's PDS uses the existing DPoP auth via `fetchAuthenticatedAtproto` — this is a standard authenticated PDS call.
- The subsequent call to the external feed generator uses a **plain Bearer token** (the service auth JWT), NOT DPoP. The existing `getAtprotoClient` applies DPoP to all authenticated calls, so external feed generator calls need a separate fetch path that sends `Authorization: Bearer <jwt>` without DPoP headers.
- A new exported helper in `auth.ts` is needed (e.g., `getServiceAuthToken(aud: string): Promise<string>`) since `getFullSession` is intentionally private.
- For unauthenticated visitors, skip the `getServiceAuth` call entirely — the external feed generator may still serve public feeds without auth.

**Security: External calls**

- **SSRF protection**: Before making any outbound request (skeleton call, DID resolution), validate the resolved URL: require HTTPS, resolve hostname to IP, reject private/reserved ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`), reject `localhost` and `*.local`.
- **Timeout**: 5-second `AbortSignal` on external skeleton calls (matches existing `AbortSignal.timeout(1500)` pattern in `identity.ts`). Return "feed temporarily unavailable" on timeout.
- **Privacy**: The service auth JWT exposes the user's DID to external feed generators. Display a disclosure before first access to a third-party feed.
- **`feedUri` validation**: The server action's `feedUri` parameter is user-controlled and triggers outbound requests. Validate it's a well-formed AT URI with `fyi.frontpage.feed.generator` collection before processing.

### 5.3 Moderation Model

Visibility filtering (banned users, hidden posts) is applied at two layers for different reasons:

**Layer 1: Skeleton (best-effort filtering)**

Our skeleton queries (hot/new/top) apply visibility filters before returning AT URIs. This means:

- External apps calling our `getFeedSkeleton` get a clean skeleton — banned/hidden posts are excluded
- This is a courtesy, not a guarantee — moderation state could change between skeleton and hydration

External skeletons (from third-party generators) may include URIs for posts banned on Frontpage. They have no access to our moderation data, so we can't expect them to filter. In the future, external generators can subscribe to our labeler to get moderation signals — but this can't be relied upon.

**Layer 2: `hydratePosts` (enforcement)**

`hydratePosts` always applies visibility filters regardless of skeleton source. This is the real safety net:

- Internal skeleton → hydration filters again (belt and suspenders, typically drops nothing)
- External skeleton → hydration filters out posts banned on Frontpage (may drop several)

**Short pages from external feeds:**

If an external skeleton returns 50 URIs and `hydratePosts` drops 8 (banned users), the client gets 42 posts. The client keeps paginating with the cursor until it reaches a minimum number of posts. This is the standard AT Protocol pattern (same as Bluesky).

**Future: AT Protocol labelers**

Currently moderation uses the internal `LabelledProfile` table. Migration to AT Protocol labelers is planned but not part of this spec. When it happens, the shared `visibility.ts` helper is the single place to update — swap `LabelledProfile` queries for label-based queries. External apps will be able to subscribe to Frontpage's labeler to get the same moderation signals.

### 5.4 Caching Strategy

| Data                | Cache                                           | Rationale                       |
| ------------------- | ----------------------------------------------- | ------------------------------- |
| Generator record    | `use cache` + `cacheLife('hours')` + `cacheTag` | Changes rarely                  |
| DID document        | `use cache` + `cacheLife('hours')` + `cacheTag` | Changes rarely                  |
| Skeleton (local)    | No cache — direct DB query                      | Feed rankings change frequently |
| Skeleton (external) | No cache — per-request                          | External state unknown          |
| hydratePosts        | No cache — user-specific                        | Vote state varies per user      |

Caching generator records and DID documents collapses the 3-hop resolution waterfall to near-zero on warm requests.

---

## 6. Visibility Layer

Extract the existing `bannedUserSubQuery` from `post.ts` into a shared module. All post/comment queries import it from one place.

### 6.1 Shared Helper

```ts
// lib/data/db/visibility.ts
export const bannedUserSubQuery = db
  .select({
    did: schema.LabelledProfile.did,
    isHidden: schema.LabelledProfile.isHidden,
  })
  .from(schema.LabelledProfile)
  .as("bannedUser");

export const visibilityFilters = (bannedUser: typeof bannedUserSubQuery) =>
  and(
    eq(schema.Post.status, "live"),
    or(isNull(bannedUser.isHidden), eq(bannedUser.isHidden, false)),
  );
```

### 6.2 Usage

- Existing `getFrontpagePosts` imports from shared module instead of defining inline
- New `hydratePosts` uses the same shared helper
- New skeleton functions (hot/new/top) use it
- Resolves the `TODO: implement banned user query for comments` in `comment.ts`. Note: comments from banned users must be marked as hidden (body nulled, `HiddenComment` type), NOT excluded entirely — their children need to stay in the tree. The shared helper needs two modes: full exclusion (for posts/skeletons) and hide-in-place (for comments)

---

## 7. `hydratePosts`

New function that takes AT URIs from any skeleton source and returns fully hydrated posts.

### 7.1 Signature

```ts
import { AtUri } from "@atproto/syntax";

async function hydratePosts(
  uris: AtUri[],
  userDid?: DID,
): Promise<HydratedPost[]>;
```

Uses the `AtUri` class from `@atproto/syntax` (already a dependency, already used in `receive_hook/handlers.ts`). Following Tom's convention from PR #327: generic `AtUri` types at the API layer, decomposed into specific types (DID + collection + rkey) at the DB layer.

### 7.2 Behavior

1. Parse each `AtUri` into `(host, collection, rkey)` via `@atproto/syntax`
2. Resolve `host` to DID if it's a handle (posts are stored by DID, not handle)
3. Query posts by `(authorDid, collection, rkey)` tuples with shared visibility filters applied. No `at_uri` column exists — use an OR-fan or VALUES CTE for the WHERE clause (skeleton sizes are bounded at 100)
4. Join `PostAggregates` for vote/comment counts and rank
5. Left join user's votes for viewer state (if `userDid` provided)
6. Return results in the same order as input URIs (preserve skeleton ranking)
7. Skip URIs not found in the DB (external generator returned a post we haven't indexed)

### 7.3 Extraction

This extracts hydration logic from the existing `getFrontpagePosts` function. The existing function becomes: local skeleton query (ordered by rank) → `hydratePosts`.

---

## 8. UI

### 8.1 Feed Page

Route: `frontpage.fyi/feed?uri=at://frontpage.fyi/fyi.frontpage.feed.generator/hot`

```tsx
// app/(app)/feed/page.tsx (sync — renders instantly)
export default async function FeedPage({ searchParams }) {
  const { uri } = await searchParams;
  return (
    <>
      <FeedHeader />
      <Suspense fallback={<FeedSkeleton />}>
        <FeedContent uri={uri} />
      </Suspense>
    </>
  );
}

// FeedContent (async — streams in)
async function FeedContent({ uri }: { uri: string }) {
  const initialData = await getMoreFeedPostsAction(uri, null);
  return (
    <InfiniteList
      cacheKey={`feed:${uri}`}
      getMoreItemsAction={getMoreFeedPostsAction.bind(null, uri)}
      fallback={initialData}
      emptyMessage="No posts in this feed"
    />
  );
}
```

Note: The action is passed via `.bind(null, uri)`, NOT an arrow function closure. Arrow functions are plain functions that can't cross the server→client boundary. `.bind()` on a server action is supported by React and preserves the server action reference. This matches the existing pattern in `profile/[user]/page.tsx`.

### 8.2 Server Action

```ts
async function getMoreFeedPostsAction(feedUri: string, cursor: string | null) {
  "use server";
  const skeleton = await getFeedSkeleton(feedUri, cursor);
  const posts = await hydratePosts(skeleton.feed.map(s => s.post));
  return {
    content: <>{posts.map(post => <PostCard key={post.id} {...post} />)}</>,
    pageSize: posts.length,
    nextCursor: skeleton.cursor,
  };
}
```

Returns JSX (rendered PostCard components), matching the existing InfiniteList pattern. SWR handles client-side caching.

### 8.3 Home Page Migration

The current home page (`/`) switches to use the `hot` feed URI internally, going through the same `getFeedSkeleton` → `hydratePosts` pipeline.

### 8.4 Suspense

The feed page shell (header, navigation) renders instantly. Feed content streams in via a Suspense boundary. This prevents the resolution waterfall from blocking initial paint. A `FeedSkeleton` loading component needs to be created (no post-list skeleton exists today; the only existing skeleton is `CommentsLoading` in the post page `loading.tsx`).

---

## 9. Infrastructure

### 9.1 No Additional Infrastructure

XRPC endpoints and `/.well-known/did.json` are served on `frontpage.fyi` directly. No custom domain, no DNS changes, no separate service. Only two identities: `did:plc:klmr76mpewpv7rtm3xgpzd7x` (the `frontpage.fyi` repo) and `did:web:frontpage.fyi` (the feed generator service).

### 9.3 Drainpipe

The Jetstream subscription uses glob `fyi.frontpage.*` which matches any `fyi.frontpage.*` collection — including `fyi.frontpage.feed.generator` and arbitrary user-created records like `fyi.frontpage.junk`. The receive hook's `Collection` Zod union is closed with `exhaustiveCheck`, so unknown collections 400 and produce dead letters.

**Fix required:** Change the receive hook to silently drop unknown collections instead of returning 400. Replace the `exhaustiveCheck` default case with a no-op that returns 200. This is a general fix — users can create arbitrary `fyi.frontpage.*` records and the receive hook should handle those gracefully, not just generator records.

### 9.4 Dependencies

- `@atproto/xrpc-server` — for `verifyServiceJwt` in the XRPC route handlers

### 9.5 DB Migration

- `CREATE INDEX idx_live_posts_created_at ON posts(created_at DESC) WHERE status = 'live'` — partial index for "new" feed skeleton queries. The existing `rank_idx` on `post_aggregates(rank)` already covers the "hot" feed.

Note: A partial index spanning `rank` and `status` is not possible in SQLite since `rank` is on `post_aggregates` and `status` is on `posts` — different tables.

### 9.6 Route Exposure

XRPC endpoints and `/.well-known/did.json` are served on `frontpage.fyi` alongside the main app. No host-based gating needed since there's only one domain.

### 9.7 `did:web` Support

The existing `did.ts` module only supports `did:plc`. The `DID` branded type is `Brand<\`did:plc:${string}\`, "DID">`and`isDid()`explicitly rejects`did:web`.

**Required changes:**

- Extend `isDid()` to accept `did:web:` prefix
- Widen the `DID` branded type to `Brand<\`did:${string}\`, "DID">`(or introduce a separate`DidWeb` type)
- Add a `did:web` resolver alongside the existing `PlcDidDocumentResolver`. Use `@atproto/identity`'s `DidResolver` which already handles `did:web` with appropriate restrictions (the `atproto-browser` package already uses it — share into the main app)
- **Security hardening**: HTTPS only (reject HTTP redirects), apply SSRF protections (reject private IPs), reject `did:web:localhost` in production, enforce hostname-only (no path-based did:web variants)

### 9.8 Next.js Config

`cacheComponents: true` is required for the `"use cache"` directive (section 5.4) but is currently incompatible with existing `dynamic = "force-static"` route segment configs in pgp, og-image, and blog routes. Enable after migrating those routes to `"use cache"` + `cacheLife('max')`.

---

## 10. What's NOT in v1

- Feed discovery, navigation, and subscription UI
- `sendInteractions` (interaction feedback to feed generators)
- Personalized feeds (JWT gives us the user's DID but algorithms don't use it yet)
- Feed avatars on generator records (manual creation, no avatar upload UX)
- `top` feed time period scoping (all-time only)

## 11. Stretch Goal: Branded Visibility Types

Compile-time enforcement that user-facing queries have been through visibility filtering. Uses TypeScript's `unique symbol` to create branded types that only producer functions can create.

```ts
const visible = Symbol("visible");
type VisiblePost = PostRow & { [typeof visible]: true };

// Only producer — applies visibility filter, returns branded type
async function hydratePosts(uris: AtUri[]): Promise<VisiblePost[]> {
  const rows = await db.select().from(Post)
    .leftJoin(bannedUserSubQuery, ...)
    .where(and(inArray(Post.uri, uris), ...visibilityFilters));
  return rows as VisiblePost[];
}

// Consumer — requires branded type, raw PostRow[] is a compile error
function renderFeed(posts: VisiblePost[]) { ... }

// ❌ db.select().from(Post) → PostRow[] — can't pass to renderFeed
// ✅ hydratePosts(uris)     → VisiblePost[] — compiles fine
```

Each brand is an independent symbol. Compose with `&` for multiple concerns (e.g., `VisiblePost & TenantPost`). No all-or-nothing — unlike EF Core's `IgnoreQueryFilters()`, each brand is selectively requireable. Bypass requires explicit `as` cast which is grepable in PR review.

Applies to posts, comments. Votes don't need their own brand — they reference already-filtered posts/comments.

---

## 12. References

### AT Protocol

- [Feed Generator Guide](https://atproto.com/guides/feeds)
- [Service Auth Spec](https://atproto.com/specs/xrpc#service-auth)
- [Bluesky Custom Feeds Tutorial](https://docs.bsky.app/docs/tutorials/custom-feeds)

### Existing Implementations

- [Bluesky Feed Generator Starter](https://github.com/bluesky-social/feed-generator)
- [Bluesky's Discover feed record](https://pdsls.dev/at://bsky.app/app.bsky.feed.generator/whats-hot)

### Frontpage

- [Issue #332 — Feeds](https://github.com/likeandscribe/frontpage/issues/332)
- [Communities Design Spec](./2026-03-24-communities-design.md) — Section 5 (Feed Architecture)
- [PR #327 — AtUri types](https://github.com/likeandscribe/frontpage/pull/327) — Tom's AT URI type conventions
