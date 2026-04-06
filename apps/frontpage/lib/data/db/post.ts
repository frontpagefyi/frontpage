import "server-only";

import { cache } from "react";
import { db } from "@/lib/db";
import { eq, desc, and, type InferSelectModel, ne, or } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { isAdmin } from "../user";
import { parseDid, type DID } from "../atproto/did";
import { newPostAggregateTrigger } from "./triggers";
import {
  bannedUserSubQuery,
  postVisibilityFilters,
  buildUserHasVotedQuery,
} from "./visibility";
import { invariant } from "@/lib/utils";
import type { PostCollectionType } from "../atproto/repo";
import { AtUri } from "@atproto/syntax";

export const getFrontpagePosts = cache(async (offset: number) => {
  const POSTS_PER_PAGE = 10;

  const userHasVoted = await buildUserHasVotedQuery();

  const rows = await db
    .select({
      id: schema.PostAggregates.postId,
      rkey: schema.Post.rkey,
      cid: schema.Post.cid,
      title: schema.Post.title,
      url: schema.Post.url,
      createdAt: schema.Post.createdAt,
      authorDid: schema.Post.authorDid,
      voteCount: schema.PostAggregates.voteCount,
      commentCount: schema.PostAggregates.commentCount,
      rank: schema.PostAggregates.rank,
      userHasVoted: userHasVoted.postId,
      status: schema.Post.status,
    })
    .from(schema.PostAggregates)
    .innerJoin(schema.Post, eq(schema.PostAggregates.postId, schema.Post.id))
    .leftJoin(userHasVoted, eq(userHasVoted.postId, schema.Post.id))
    .leftJoin(
      bannedUserSubQuery,
      eq(bannedUserSubQuery.did, schema.Post.authorDid),
    )
    .where(postVisibilityFilters(bannedUserSubQuery))
    .orderBy(desc(schema.PostAggregates.rank))
    .limit(POSTS_PER_PAGE)
    .offset(offset);

  const posts = rows.map((row) => ({
    id: row.id,
    rkey: row.rkey,
    cid: row.cid || null,
    title: row.title,
    url: row.url,
    createdAt: row.createdAt,
    authorDid: row.authorDid,
    voteCount: row.voteCount,
    commentCount: row.commentCount,
    userHasVoted: Boolean(row.userHasVoted),
  }));

  return {
    posts,
    nextCursor: offset + POSTS_PER_PAGE,
  };
});

export const getUserPosts = cache(async (userDid: DID) => {
  const userHasVoted = await buildUserHasVotedQuery();

  const posts = await db
    .select({
      id: schema.Post.id,
      rkey: schema.Post.rkey,
      cid: schema.Post.cid,
      title: schema.Post.title,
      url: schema.Post.url,
      createdAt: schema.Post.createdAt,
      authorDid: schema.Post.authorDid,
      voteCount: schema.PostAggregates.voteCount,
      commentCount: schema.PostAggregates.commentCount,
      userHasVoted: userHasVoted.postId,
      status: schema.Post.status,
    })
    .from(schema.PostAggregates)
    .innerJoin(schema.Post, eq(schema.PostAggregates.postId, schema.Post.id))
    .leftJoin(userHasVoted, eq(userHasVoted.postId, schema.Post.id))
    .where(
      and(eq(schema.Post.authorDid, userDid), eq(schema.Post.status, "live")),
    );

  return posts.map((row) => ({
    id: row.id,
    rkey: row.rkey,
    cid: row.cid,
    title: row.title,
    url: row.url,
    createdAt: row.createdAt,
    authorDid: row.authorDid,
    voteCount: row.voteCount,
    commentCount: row.commentCount,
    userHasVoted: Boolean(row.userHasVoted),
  }));
});

export const getPost = cache(async (authorDid: DID, rkey: string) => {
  const userHasVoted = await buildUserHasVotedQuery();

  const rows = await db
    .select()
    .from(schema.Post)
    .where(
      and(eq(schema.Post.authorDid, authorDid), eq(schema.Post.rkey, rkey)),
    )
    .innerJoin(
      schema.PostAggregates,
      eq(schema.PostAggregates.postId, schema.Post.id),
    )
    .leftJoin(userHasVoted, eq(userHasVoted.postId, schema.Post.id))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    ...row.posts,
    cid: row.posts.cid || null,
    commentCount: row.post_aggregates.commentCount,
    voteCount: row.post_aggregates.voteCount,
    userHasVoted: Boolean(row.hasVoted),
  };
});

export async function uncached_doesPostExist(authorDid: DID, rkey: string) {
  const row = await db
    .select({ id: schema.Post.id })
    .from(schema.Post)
    .where(
      and(eq(schema.Post.authorDid, authorDid), eq(schema.Post.rkey, rkey)),
    )
    .limit(1);

  return Boolean(row[0]);
}

export type CreatePostInput = {
  post: { title: string; url: string; createdAt: Date };
  authorDid: DID;
  rkey: string;
  cid?: string;
  status: "live" | "pending";
  collection: PostCollectionType;
};

export async function createPost({
  post,
  authorDid,
  rkey,
  cid,
  status,
  collection,
}: CreatePostInput) {
  return await db.transaction(async (tx) => {
    const [insertedPostRow] = await tx
      .insert(schema.Post)
      .values({
        rkey,
        cid: cid ?? "",
        authorDid,
        title: post.title,
        url: post.url,
        createdAt: post.createdAt,
        status,
        collection,
      })
      .returning({ postId: schema.Post.id });

    if (!insertedPostRow) {
      throw new Error("Failed to insert post");
    }

    await newPostAggregateTrigger(insertedPostRow.postId, tx);

    return {
      postId: insertedPostRow.postId,
    };
  });
}

type UpdatePostInput = Partial<
  Omit<InferSelectModel<typeof schema.Post>, "id">
>;

export const updatePost = async (
  repo: DID,
  rkey: string,
  input: UpdatePostInput,
) => {
  await db
    .update(schema.Post)
    .set(input)
    .where(and(eq(schema.Post.authorDid, repo), eq(schema.Post.rkey, rkey)));
};

export type DeletePostInput = {
  authorDid: DID;
  rkey: string;
};

export async function deletePost({ authorDid, rkey }: DeletePostInput) {
  console.log("Deleting post", rkey);
  await db.transaction(async (tx) => {
    console.log("Updating post status to deleted", rkey);
    const [updatedPost] = await tx
      .update(schema.Post)
      .set({ status: "deleted" })
      .where(
        and(
          eq(schema.Post.rkey, rkey),
          eq(schema.Post.authorDid, authorDid),
          ne(schema.Post.status, "deleted"),
        ),
      )
      .returning({ id: schema.Post.id });

    invariant(
      updatedPost,
      "Failed to update post status to deleted or post not found",
    );

    console.log("Done deleting post transaction");
  });
}

type ModeratePostInput = {
  rkey: string;
  authorDid: DID;
  cid: string;
  hide: boolean;
};
export async function moderatePost({
  rkey,
  authorDid,
  cid,
  hide,
}: ModeratePostInput) {
  const adminUser = await isAdmin();

  if (!adminUser) {
    throw new Error("User is not an admin");
  }
  console.log(`Moderating post, setting hidden to ${hide}`);
  await db
    .update(schema.Post)
    .set({ status: hide ? "moderator_hidden" : "live" })
    .where(
      and(
        eq(schema.Post.rkey, rkey),
        eq(schema.Post.authorDid, authorDid),
        eq(schema.Post.cid, cid),
      ),
    );
}

export const getPostFromComment = cache(
  async ({ did, rkey }: { did: DID; rkey: string }) => {
    const [join] = await db
      .select()
      .from(schema.Comment)
      .where(
        and(eq(schema.Comment.rkey, rkey), eq(schema.Comment.authorDid, did)),
      )
      .leftJoin(schema.Post, eq(schema.Comment.postId, schema.Post.id));

    if (!join || !join.posts) {
      return null;
    }

    return { postRkey: join.posts.rkey, postAuthor: join.posts.authorDid };
  },
);

export type HydratedPost = {
  id: number;
  rkey: string;
  cid: string | null;
  title: string;
  url: string;
  createdAt: Date;
  authorDid: DID;
  voteCount: number;
  commentCount: number;
  userHasVoted: boolean;
};

export async function hydratePosts(
  postUris: string[],
): Promise<HydratedPost[]> {
  if (postUris.length === 0) return [];

  const parsedUris = postUris.map((uri) => {
    const atUri = new AtUri(uri);
    const authorDid = parseDid(atUri.host);
    invariant(authorDid, `Invalid DID in post URI: ${atUri.host}`);
    return { authorDid, collection: atUri.collection, rkey: atUri.rkey, uri };
  });

  const userHasVoted = await buildUserHasVotedQuery();

  const rows = await db
    .select({
      id: schema.Post.id,
      rkey: schema.Post.rkey,
      cid: schema.Post.cid,
      title: schema.Post.title,
      url: schema.Post.url,
      createdAt: schema.Post.createdAt,
      authorDid: schema.Post.authorDid,
      collection: schema.Post.collection,
      voteCount: schema.PostAggregates.voteCount,
      commentCount: schema.PostAggregates.commentCount,
      userHasVoted: userHasVoted.postId,
    })
    .from(schema.Post)
    .innerJoin(
      schema.PostAggregates,
      eq(schema.PostAggregates.postId, schema.Post.id),
    )
    .leftJoin(userHasVoted, eq(userHasVoted.postId, schema.Post.id))
    .leftJoin(
      bannedUserSubQuery,
      eq(bannedUserSubQuery.did, schema.Post.authorDid),
    )
    .where(
      and(
        postVisibilityFilters(bannedUserSubQuery),
        or(
          ...parsedUris.map((p) =>
            and(
              eq(schema.Post.authorDid, p.authorDid),
              eq(schema.Post.rkey, p.rkey),
            ),
          ),
        ),
      ),
    );

  const rowMap = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    const key = `${row.authorDid}:${row.collection}:${row.rkey}`;
    rowMap.set(key, row);
  }

  const hydrated: HydratedPost[] = [];
  for (const parsedUri of parsedUris) {
    const row = rowMap.get(
      `${parsedUri.authorDid}:${parsedUri.collection}:${parsedUri.rkey}`,
    );
    if (!row) continue;
    hydrated.push({
      id: row.id,
      rkey: row.rkey,
      cid: row.cid || null,
      title: row.title,
      url: row.url,
      createdAt: row.createdAt,
      authorDid: row.authorDid,
      voteCount: row.voteCount,
      commentCount: row.commentCount,
      userHasVoted: Boolean(row.userHasVoted),
    });
  }

  const dropped = parsedUris.length - hydrated.length;
  if (dropped > 0) {
    console.warn(
      `hydratePosts: ${dropped}/${parsedUris.length} posts not found in DB`,
    );
  }

  return hydrated;
}
