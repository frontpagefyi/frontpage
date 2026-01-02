# Frontpage Data Layers

Frontpage uses a layered data architecture to manage and interact with data from various sources, including the AT protocol and its own database. This document outlines the key data layers used in the Frontpage application.

## Why?

AT has two sources of truth for data: the PDS of the actor, and the Frontpage app<sup>1</sup> itself. The canonical store for the data is the PDS and the Frontpage app acts as a kind of index that can efficiently query and aggregate data from every actor's PDS.

This makes the data architecture and flow more complex.

## Data Layers

### API Layer

Code for this layer is in `packages/frontpage/lib/api`. This layer is responsible for handling incoming API requests, validating input, and orchestrating calls to the underlying data layers (DB and Atproto).

This layer is essentially the public API of the Frontpage app, although in reality we don't expose this API directly right now - we just call these functions from within our Next.js server-side code. In the future we will likely expose this API via [XRPC](https://atproto.com/specs/xrpc) so that other apps can interact with Frontpage programmatically.

Generally, the Next.js app should only speak to this layer, and not directly to the DB or Atproto layers. There are some exceptions to this for legacy reasons, but the goal is to eventually have all data access go through this layer.

As this layer is designed to speak XRPC, it uses AT protocol types and concepts where possible. It borrows many conventions from the Bsky API eg. Using AT URIs to identify resources. Unlike the Bsky API it also offers write operations, not just read operations. This is because Frontpage chooses option 2 in [Paul's Leaflet](https://pfrazee.leaflet.pub/3m5hwua4sh22v) while Bsky chooses option 1. The main reason for this is to allow Frontpage to read it's own writes, Bsky is able to do this via specific logic that it injects into the PDS itself - we don't have that option.

#### A note on AT URI types

In the API layer we generally use generic `AtUri` types from `@atproto/syntax` to represent resources. This matches the bsky API and also allows us to be generic about the specific collection being used (important in the case of posts/comments/votes that can exist in the old or current lexicons).

As data flows deeper into the Frontpage app we're less concerned with following conventions in other atproto apps, and more concerned with type safety and clarity. Therefore in the DB layer we convert these generic `AtUri` types into more specific types that represent exactly which collection is being used. Another difference is that the `AtUri` type allows for the actor (or `host`, in AT terms) to be either a DID or a handle, while in the DB layer we require this to always be a DID. This is because the database only stores DIDs (handles are mutable), so we need to resolve handles to DIDs before we can interact with the database.

### DB Layer

Code for this layer is in `packages/frontpage/lib/data/db`. This layer is responsible for interacting with the Frontpage database. It's structured like a traditional database access layer, with functions for creating, reading, updating, and deleting records in the database.

### Atproto Layer

Code for this layer is in `packages/frontpage/lib/data/atproto`. This layer is responsible for interacting with the PDS directly (CRUD operations on AT protocol records). It uses the AT protocol client to perform these operations.

Implementation is handled almost entirely by the `@repo/frontpage-atproto-client` package (contained in this repo) which is a generated client based on the AT protocol schemas in `lexicons/`.

### Indexing Layer

Code for this layer is in `packages/frontpage/app/api/receive_hook`. This layer is responsible for receiving and processing events from AT protocol PDSes when users create or update records. It processes these events and updates the Frontpage database accordingly.

This layer is crucial for keeping the Frontpage app's data in sync with the AT protocol network as it's always possible for users to update their data directly on their PDS or via another app without going through Frontpage.

## Example data flow: Creating a Post

![](./images/create-post-data-flow-light.png#gh-light-mode-only)
![](./images/create-post-data-flow-dark.png#gh-dark-mode-only)

---

<sup>1</sup> In this context, "app" refers to the Frontpage application and its associated backend services including the database. In AT this is often referred to as the "appview" but this can be confusing: https://pfrazee.leaflet.pub/3lyucxaykg22w
