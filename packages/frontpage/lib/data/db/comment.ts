import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import {
  eq,
  sql,
  desc,
  and,
  type InferSelectModel,
  isNotNull,
  ne,
} from "drizzle-orm";
import * as schema from "@/lib/schema";
import { getUser, isAdmin } from "../user";
import { type DID } from "../atproto/did";
import { invariant, type Prettify } from "@/lib/utils";
import {
  deleteCommentAggregateTrigger,
  newCommentAggregateTrigger,
} from "./triggers";
import { nsids, type CommentCollectionType } from "../atproto/repo";
import { type AtUri } from "@atproto/syntax";
import { getDidFromHandleOrDid } from "../atproto/identity";
import { type PostUri } from "./post";

export type CommentUri = {
  actor: DID;
  collection: CommentCollectionType;
  rkey: string;
};

export async function resolveCommentUri(uri: AtUri): Promise<CommentUri> {
  invariant(
    uri.collection === nsids.FyiUnravelFrontpageComment ||
      uri.collection === nsids.FyiFrontpageFeedComment,
    "Invalid comment collection",
  );

  const actor = await getDidFromHandleOrDid(uri.host);

  invariant(actor, "Failed to resolve actor from URI");

  return {
    actor,
    collection: uri.collection,
    rkey: uri.rkey,
  };
}

type CommentRow = Omit<InferSelectModel<typeof schema.Comment>, "cid"> & {
  cid: string | null;
};

type CommentExtras = {
  children?: CommentModel[];
  userHasVoted: boolean;
  // These properties are returned from some methods but not others
  rank: number;
  voteCount: number;
  postAuthorDid?: DID;
  postRkey?: string;
};

type LiveComment = CommentRow & CommentExtras & { status: "live" | "pending" };

type HiddenComment = Omit<CommentRow, "status" | "body"> &
  CommentExtras & {
    status: Exclude<CommentRow["status"], "live">;
    body: null;
  };

export type CommentModel = Prettify<LiveComment | HiddenComment>;

const buildUserHasVotedQuery = cache(async () => {
  const user = await getUser();

  return db
    .select({
      commentId: schema.CommentVote.commentId,
      // This is not entirely type safe but there isn't a better way to do this in drizzle right now
      userHasVoted: sql<boolean>`${isNotNull(schema.CommentVote.commentId)}`.as(
        "userHasVoted",
      ),
    })
    .from(schema.CommentVote)
    .where(user ? eq(schema.CommentVote.authorDid, user.did) : sql`false`)
    .as("hasVoted");
});

//TODO: implement banned user query for comments

// const bannedUserSubQuery = db
//   .select({
//     did: schema.LabelledProfile.did,
//     isHidden: schema.LabelledProfile.isHidden,
//   })
//   .from(schema.LabelledProfile)
//   .as("bannedUser");

export const getCommentsForPost = cache(async (postId: number) => {
  const hasVoted = await buildUserHasVotedQuery();

  const rows = await db
    .select({
      id: schema.Comment.id,
      rkey: schema.Comment.rkey,
      cid: schema.Comment.cid,
      postId: schema.Comment.postId,
      body: schema.Comment.body,
      createdAt: schema.Comment.createdAt,
      authorDid: schema.Comment.authorDid,
      status: schema.Comment.status,
      voteCount: schema.CommentAggregates.voteCount,
      rank: schema.CommentAggregates.rank,
      userHasVoted: hasVoted.userHasVoted,
      parentCommentId: schema.Comment.parentCommentId,
      collection: schema.Comment.collection,
    })
    .from(schema.Comment)
    .where(eq(schema.Comment.postId, postId))
    .innerJoin(
      schema.CommentAggregates,
      eq(schema.Comment.id, schema.CommentAggregates.commentId),
    )
    .leftJoin(hasVoted, eq(hasVoted.commentId, schema.Comment.id))
    .orderBy(desc(schema.CommentAggregates.rank));

  const currentUserDid = (await getUser())?.did;

  return nestCommentRows(
    rows
      .map((row) => ({ ...row, cid: row.cid || null }))
      .filter(
        (row) => row.status !== "pending" || row.authorDid === currentUserDid,
      ),
  );
});

export const getCommentWithChildren = cache(
  async (postId: number, authorDid: DID, rkey: string) => {
    // We're currently fetching all rows from the database, this can be made more efficient later
    const comments = await getCommentsForPost(postId);

    return findCommentSubtree(comments, authorDid, rkey);
  },
);

const nestCommentRows = (
  items: (CommentRow & {
    userHasVoted: boolean;
    voteCount: number;
    rank: number;
  })[],
  id: number | null = null,
): CommentModel[] => {
  const comments: CommentModel[] = [];

  for (const item of items) {
    if (item.parentCommentId !== id) {
      continue;
    }

    const children = nestCommentRows(items, item.id);
    const transformed = {
      userHasVoted: item.userHasVoted !== null,
      voteCount: item.voteCount,
      rank: item.rank,
    };
    if (item.status === "live" || item.status === "pending") {
      comments.push({
        ...item,
        ...transformed,
        // Explicit copy is required to avoid TS error
        status: item.status,
        children,
      });
    } else {
      comments.push({
        ...item,
        ...transformed,
        // Explicit copy is required to avoid TS error
        status: item.status,
        body: null,
        children,
      });
    }
  }

  return comments;
};

const findCommentSubtree = (
  items: CommentModel[],
  authorDid: DID,
  rkey: string,
): CommentModel | null => {
  for (const item of items) {
    if (item.rkey === rkey && item.authorDid === authorDid) {
      return item;
    }

    if (!item.children) return null;

    const child = findCommentSubtree(item.children, authorDid, rkey);
    if (child) {
      return child;
    }
  }

  return null;
};

export const getComment = cache(async (uri: CommentUri) => {
  const rows = await db
    .select()
    .from(schema.Comment)
    .where(
      and(
        eq(schema.Comment.authorDid, uri.actor),
        eq(schema.Comment.collection, uri.collection),
        eq(schema.Comment.rkey, uri.rkey),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
});

type UpdateCommentInput = Partial<Omit<CommentRow, "id">>;

export const updateComment = async (
  uri: CommentUri,
  input: UpdateCommentInput,
) => {
  await db
    .update(schema.Comment)
    .set({
      ...input,
      cid: input.cid ?? undefined,
    })
    .where(
      and(
        eq(schema.Comment.authorDid, uri.actor),
        eq(schema.Comment.collection, uri.collection),
        eq(schema.Comment.rkey, uri.rkey),
      ),
    );
};

export async function uncached_doesCommentExist(uri: CommentUri) {
  const row = await db
    .select({ id: schema.Comment.id })
    .from(schema.Comment)
    .where(
      and(
        eq(schema.Comment.authorDid, uri.actor),
        eq(schema.Comment.collection, uri.collection),
        eq(schema.Comment.rkey, uri.rkey),
      ),
    )
    .limit(1);

  return Boolean(row[0]);
}

export const getUserComments = cache(async (userDid: DID) => {
  const hasVoted = await buildUserHasVotedQuery();
  const comments = await db
    .select({
      id: schema.Comment.id,
      rkey: schema.Comment.rkey,
      cid: schema.Comment.cid,
      postId: schema.Comment.postId,
      body: schema.Comment.body,
      createdAt: schema.Comment.createdAt,
      authorDid: schema.Comment.authorDid,
      status: schema.Comment.status,
      postRkey: schema.Post.rkey,
      postAuthorDid: schema.Post.authorDid,
      parentCommentId: schema.Comment.parentCommentId,
      userHasVoted: hasVoted.userHasVoted,
    })
    .from(schema.Comment)
    .where(
      and(
        eq(schema.Comment.authorDid, userDid),
        eq(schema.Comment.status, "live"),
      ),
    )
    .leftJoin(schema.Post, eq(schema.Comment.postId, schema.Post.id))
    .leftJoin(hasVoted, eq(hasVoted.commentId, schema.Comment.id));

  return comments as LiveComment[];
});

// TODO: This shouldn't be in the database layer.
// We need to properly design the API layer to handle hidden comments, and this can be moved there.
export async function shouldHideComment(comment: CommentModel) {
  if (
    comment.status === "pending" &&
    (await getUser())?.did === comment.authorDid
  ) {
    return false;
  }
  return (
    comment.status !== "live" &&
    comment.children &&
    comment.children.length === 0
  );
}

type ModerateCommentInput = {
  uri: CommentUri;
  cid: string;
  hide: boolean;
};
export async function moderateComment({
  uri,
  cid,
  hide,
}: ModerateCommentInput) {
  const adminUser = await isAdmin();

  if (!adminUser) {
    throw new Error("User is not an admin");
  }

  console.log(`Moderating comment, setting hidden to ${hide}`);
  await db
    .update(schema.Comment)
    .set({ status: hide ? "moderator_hidden" : "live" })
    .where(
      and(
        eq(schema.Comment.authorDid, uri.actor),
        eq(schema.Comment.collection, uri.collection),
        eq(schema.Comment.rkey, uri.rkey),
        eq(schema.Comment.cid, cid),
      ),
    );
}

export type CreateCommentInput = {
  cid?: string;
  uri: CommentUri;
  content: string;
  createdAt: Date;
  // TODO: parent and post should include CIDs as they are strongRefs in atproto
  parent?: CommentUri;
  post: PostUri;
  status: "live" | "pending";
};

export async function createComment({
  cid,
  uri,
  content,
  createdAt,
  parent,
  post,
  status,
}: CreateCommentInput) {
  return await db.transaction(async (tx) => {
    const existingPost = (
      await tx
        .select({ id: schema.Post.id, status: schema.Post.status })
        .from(schema.Post)
        .where(
          and(
            eq(schema.Post.authorDid, post.actor),
            eq(schema.Post.collection, post.collection),
            eq(schema.Post.rkey, post.rkey),
          ),
        )
        .limit(1)
    )[0];

    let existingParent;
    if (parent) {
      existingParent = (
        await tx
          .select({ id: schema.Comment.id })
          .from(schema.Comment)
          .where(
            and(
              eq(schema.Comment.authorDid, parent.actor),
              eq(schema.Comment.collection, parent.collection),
              eq(schema.Comment.rkey, parent.rkey),
            ),
          )
          .limit(1)
      )[0];
    }

    invariant(existingPost, "Post not found");

    if (existingPost.status !== "live") {
      throw new Error(`[naughty] Cannot comment on deleted post. ${uri.actor}`);
    }

    const [insertedComment] = await tx
      .insert(schema.Comment)
      .values({
        cid: cid ?? "",
        rkey: uri.rkey,
        body: content,
        postId: existingPost.id,
        authorDid: uri.actor,
        createdAt: createdAt,
        parentCommentId: existingParent?.id ?? null,
        status,
        collection: uri.collection,
      })
      .returning({
        id: schema.Comment.id,
        postId: schema.Comment.postId,
        parentCommentId: schema.Comment.parentCommentId,
      });

    invariant(insertedComment, "Failed to insert comment");

    await newCommentAggregateTrigger(
      insertedComment.postId,
      insertedComment.id,
      tx,
    );

    return insertedComment;
  });
}

export type DeleteCommentInput = {
  rkey: string;
  authorDid: DID;
};

export async function deleteComment(uri: CommentUri) {
  await db.transaction(async (tx) => {
    const [updatedComment] = await tx
      .update(schema.Comment)
      .set({ status: "deleted" })
      .where(
        and(
          eq(schema.Comment.authorDid, uri.actor),
          eq(schema.Comment.collection, uri.collection),
          eq(schema.Comment.rkey, uri.rkey),
          ne(schema.Comment.status, "deleted"),
        ),
      )
      .returning({
        id: schema.Comment.id,
        postId: schema.Comment.postId,
      });

    invariant(
      updatedComment,
      "Failed to update comment status to deleted or comment not found",
    );

    await deleteCommentAggregateTrigger(
      updatedComment.postId,
      updatedComment.id,
      tx,
    );
  });
}
