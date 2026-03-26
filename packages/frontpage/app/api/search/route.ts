import { badRequest, createApiRoute } from "@/lib/api-route";
import { bannedUserSubQuery } from "@/lib/data/db/post";
import { getBlueskyProfile } from "@/lib/data/user";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { sql, like, eq, and, or } from "drizzle-orm";
import { string } from "zod";

export const GET = createApiRoute(async (request) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (!q) {
    badRequest("Missing query parameter 'q'");
  }
  const [posts, comments] = await Promise.all([
    searchPosts(q),
    searchComments(q),
  ]);
  return {
    results: [...posts, ...comments],
  };
});

async function searchPosts(query: string): Promise<PostResult[]> {
  const rows = await db
    .select({
      id: schema.Post.id,
      title: schema.Post.title,
      url: schema.Post.url,
      rkey: schema.Post.rkey,
      createdAt: schema.Post.createdAt,
      commentCount: schema.PostAggregates.commentCount,
      authorDid: schema.Post.authorDid,
    })
    .from(schema.Post)
    .innerJoin(
      schema.PostAggregates,
      eq(schema.PostAggregates.postId, schema.Post.id),
    )
    .leftJoin(
      bannedUserSubQuery,
      eq(bannedUserSubQuery.did, schema.Post.authorDid),
    )
    .where(
      and(
        or(
          // ilike(schema.Post.title, sql`%${query}%`),
          // ilike(schema.Post.url, sql`%${query}%`),
          like(sql`UPPER(${schema.Post.title})`, `%${query.toUpperCase()}%`),
          like(sql`UPPER(${schema.Post.url})`, `%${query.toUpperCase()}%`),
        ),
        eq(bannedUserSubQuery.isHidden, false),
      ),
    )
    .limit(10);

  return Promise.all(
    rows.map(async (row) => {
      const profile = await getBlueskyProfile(row.authorDid);

      return {
        type: "post",
        id: row.id,
        path: `/posts/${row.authorDid}/${row.rkey}`,
        title: row.title,
        url: row.url,
        commentCount: row.commentCount,
        createdAt: row.createdAt.toISOString(),
        author: {
          handle: profile?.handle ?? "handle.invalid",
          avatarUrl: profile?.avatar ?? "",
        },
      };
    }),
  );
}

async function searchComments(query: string): Promise<CommentResult[]> {
  // TODO
  return [];
}

type Author = {
  handle: string;
  avatarUrl: string;
};

export type PostResult = {
  type: "post";
  path: string;
  id: number;
  title: string;
  url: string;
  commentCount: number;
  author: Author;
  createdAt: string;
};

export type CommentResult = {
  type: "comment";
  path: string;
  id: number;
  contentExcerpt: string;
  author: Author;
  replyCount: number;
  createdAt: string;
  postTitle: string;
};
