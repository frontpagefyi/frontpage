import "server-only";
import { getUser } from "../user";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { and, eq, type InferSelectModel } from "drizzle-orm";
import { cache } from "react";
import { type DID } from "../atproto/did";
import {
  deleteCommentVoteAggregateTrigger,
  deletePostVoteAggregateTrigger,
  newCommentVoteAggregateTrigger,
  newPostVoteAggregateTrigger,
} from "./triggers";
import { invariant } from "@/lib/utils";
import { nsids, type VoteCollectionType } from "../atproto/repo";
import type { AtUri } from "@atproto/syntax";
import { getDidFromHandleOrDid } from "../atproto/identity";
import { type PostUri } from "./post";
import { type CommentUri } from "./comment";

export type VoteUri = {
  actor: DID;
  collection: VoteCollectionType;
  rkey: string;
};

export async function resolveVoteUri(uri: AtUri): Promise<VoteUri> {
  invariant(
    uri.collection === nsids.FyiUnravelFrontpageVote ||
      uri.collection === nsids.FyiFrontpageFeedVote,
    "Invalid vote collection",
  );

  const actor = await getDidFromHandleOrDid(uri.host);

  invariant(actor, "Failed to resolve actor from URI");

  return {
    actor,
    collection: uri.collection,
    rkey: uri.rkey,
  };
}

export const getVoteForPost = cache(async (postId: number) => {
  const user = await getUser();
  if (!user) return null;

  const rows = await db
    .select()
    .from(schema.PostVote)
    .where(
      and(
        eq(schema.PostVote.authorDid, user.did),
        eq(schema.PostVote.postId, postId),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
});

export const uncached_doesPostVoteExist = async (uri: VoteUri) => {
  const row = await db
    .select({ id: schema.PostVote.id })
    .from(schema.PostVote)
    .where(
      and(
        eq(schema.PostVote.authorDid, uri.actor),
        eq(schema.PostVote.collection, uri.collection),
        eq(schema.PostVote.rkey, uri.rkey),
      ),
    )
    .limit(1);

  return Boolean(row[0]);
};

export const uncached_doesCommentVoteExist = async (uri: VoteUri) => {
  const row = await db
    .select({ id: schema.CommentVote.id })
    .from(schema.CommentVote)
    .where(
      and(
        eq(schema.CommentVote.authorDid, uri.actor),
        eq(schema.CommentVote.collection, uri.collection),
        eq(schema.CommentVote.rkey, uri.rkey),
      ),
    )
    .limit(1);

  return Boolean(row[0]);
};

export const getVoteForComment = cache(
  async (commentId: number, userDid: DID) => {
    const rows = await db
      .select()
      .from(schema.CommentVote)
      .where(
        and(
          eq(schema.CommentVote.authorDid, userDid),
          eq(schema.CommentVote.commentId, commentId),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  },
);

export type CreateVoteInputCommon = {
  uri: VoteUri;
  cid?: string;
  subjectCid: string;
  status: "live" | "pending";
};

export const createPostVote = async ({
  uri,
  cid,
  subject,
  subjectCid,
}: CreateVoteInputCommon & { subject: PostUri }) => {
  return await db.transaction(async (tx) => {
    const post = (
      await tx
        .select()
        .from(schema.Post)
        .where(
          and(
            eq(schema.Post.authorDid, subject.actor),
            eq(schema.Post.collection, subject.collection),
            eq(schema.Post.rkey, subject.rkey),
            eq(schema.Post.cid, subjectCid),
          ),
        )
    )[0];

    invariant(
      post,
      `Post not found with rkey: ${subject.rkey} repo: ${subject.actor} cid: ${subjectCid}`,
    );

    if (post.authorDid === uri.actor) {
      throw new Error(`[naughty] Cannot vote on own content ${uri.actor}`);
    }
    const [insertedVote] = await tx
      .insert(schema.PostVote)
      .values({
        postId: post.id,
        authorDid: uri.actor,
        createdAt: new Date(),
        cid: cid ?? "",
        rkey: uri.rkey,
        collection: uri.collection,
      })
      .returning({ id: schema.PostVote.id });

    if (!insertedVote) {
      throw new Error("Failed to insert vote");
    }

    await newPostVoteAggregateTrigger(post.id, tx);

    return { id: insertedVote?.id };
  });
};

export async function createCommentVote({
  uri,
  cid,
  subject,
  subjectCid,
}: CreateVoteInputCommon & { subject: CommentUri }) {
  return await db.transaction(async (tx) => {
    const comment = (
      await tx
        .select()
        .from(schema.Comment)
        .where(
          and(
            eq(schema.Comment.authorDid, subject.actor),
            eq(schema.Comment.collection, subject.collection),
            eq(schema.Comment.rkey, subject.rkey),
            eq(schema.Comment.cid, subjectCid),
          ),
        )
    )[0];

    invariant(comment, `Comment not found with rkey: ${subject.rkey}`);

    if (comment.authorDid === uri.actor) {
      throw new Error(`[naughty] Cannot vote on own content ${uri.actor}`);
    }

    const [insertedVote] = await tx
      .insert(schema.CommentVote)
      .values({
        commentId: comment.id,
        authorDid: uri.actor,
        createdAt: new Date(),
        cid: cid ?? "",
        rkey: uri.rkey,
        collection: uri.collection,
      })
      .returning({ id: schema.CommentVote.id });

    if (!insertedVote) {
      throw new Error("Failed to insert vote");
    }

    await newCommentVoteAggregateTrigger(comment.postId, comment.id, tx);

    return { id: insertedVote?.id };
  });
}

type UpdatePostVoteInput = Partial<
  Omit<InferSelectModel<typeof schema.PostVote>, "id">
>;

export const updatePostVote = async (
  uri: VoteUri,
  input: UpdatePostVoteInput,
) => {
  return await db
    .update(schema.PostVote)
    .set(input)
    .where(
      and(
        eq(schema.PostVote.authorDid, uri.actor),
        eq(schema.PostVote.collection, uri.collection),
        eq(schema.PostVote.rkey, uri.rkey),
      ),
    );
};

type UpdateCommentVoteInput = Partial<
  Omit<InferSelectModel<typeof schema.CommentVote>, "id">
>;

export const updateCommentVote = async (
  uri: VoteUri,
  input: UpdateCommentVoteInput,
) => {
  return await db
    .update(schema.CommentVote)
    .set(input)
    .where(
      and(
        eq(schema.CommentVote.authorDid, uri.actor),
        eq(schema.CommentVote.collection, uri.collection),
        eq(schema.CommentVote.rkey, uri.rkey),
      ),
    );
};

export const deleteVote = async (uri: VoteUri) => {
  // Try deleting from both tables. In reality only one will have a record.
  // Relies on sqlite not throwing an error if the record doesn't exist.
  await db.transaction(async (tx) => {
    const [deletedCommentVoteRow] = await tx
      .delete(schema.CommentVote)
      .where(
        and(
          eq(schema.CommentVote.authorDid, uri.actor),
          eq(schema.CommentVote.collection, uri.collection),
          eq(schema.CommentVote.rkey, uri.rkey),
        ),
      )
      .returning({
        commentId: schema.CommentVote.commentId,
      });

    const [deletedPostVoteRow] = await tx
      .delete(schema.PostVote)
      .where(
        and(
          eq(schema.PostVote.authorDid, uri.actor),
          eq(schema.PostVote.collection, uri.collection),
          eq(schema.PostVote.rkey, uri.rkey),
        ),
      )
      .returning({ postId: schema.PostVote.postId });

    if (deletedCommentVoteRow?.commentId != null) {
      //the vote is a comment vote

      const [deletedCommentVoteCommentRow] = await tx
        .select({ postId: schema.Comment.postId })
        .from(schema.Comment)
        .where(eq(schema.Comment.id, deletedCommentVoteRow.commentId));

      if (!deletedCommentVoteCommentRow?.postId) {
        throw new Error("Post id not found");
      }

      await deleteCommentVoteAggregateTrigger(
        deletedCommentVoteCommentRow.postId,
        deletedCommentVoteRow.commentId,
        tx,
      );
    } else if (deletedPostVoteRow?.postId != null) {
      //the vote is a post vote
      await deletePostVoteAggregateTrigger(deletedPostVoteRow.postId, tx);
    }
  });
};
