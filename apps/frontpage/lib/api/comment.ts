import "server-only";
import { DataLayerError } from "../data/error";
import { ensureUser } from "../data/user";
import * as db from "../data/db/comment";
import { type DID } from "../data/atproto/did";
import { createNotification } from "../data/db/notification";
import { invariant } from "../utils";
import { TID } from "@atproto/common-web";
import { l } from "@atproto/lex";
import * as fyi from "@repo/frontpage-atproto-client/fyi";
import { after } from "next/server";
import { getAtprotoClient } from "../data/atproto/repo";
import { nsids } from "../data/atproto/nsids";
import { buildStrongRef } from "../data/atproto/records";

export type ApiCreateCommentInput = {
  // TODO: Use strongRef type for parent and post
  parent?: { cid: string; rkey: string; authorDid: DID };
  post: { cid: string; rkey: string; authorDid: DID };
  content: string;
  authorDid: DID;
};

export async function createComment({
  parent,
  post,
  content,
  authorDid,
}: ApiCreateCommentInput) {
  const user = await ensureUser();

  const rkey = TID.next().toString();
  try {
    const sanitizedContent = content.replace(/\n\n+/g, "\n\n").trim();

    const dbCreatedComment = await db.createComment({
      authorDid: user.did,
      rkey,
      content: sanitizedContent,
      createdAt: new Date(),
      parent,
      post,
      status: "pending",
      collection: nsids.FyiUnravelFrontpageComment,
    });

    invariant(dbCreatedComment, "Failed to insert comment in database");

    const record = fyi.unravel.frontpage.comment.$build({
      parent: parent
        ? buildStrongRef({
            authorDid: parent.authorDid,
            collection: nsids.FyiUnravelFrontpageComment,
            rkey: parent.rkey,
            cid: parent.cid,
          })
        : undefined,
      post: buildStrongRef({
        authorDid: post.authorDid,
        collection: nsids.FyiUnravelFrontpagePost,
        rkey: post.rkey,
        cid: post.cid,
      }),
      content: sanitizedContent,
      createdAt: l.currentDatetimeString(),
    });

    after(() =>
      getAtprotoClient().create(fyi.unravel.frontpage.comment, record, {
        repo: user.did,
        rkey,
        validate: true,
        validateRequest: true,
      }),
    );

    const didToNotify = parent ? parent.authorDid : post.authorDid;

    if (didToNotify !== authorDid) {
      await createNotification({
        commentId: dbCreatedComment.id,
        did: didToNotify,
        reason: parent ? "commentReply" : "postComment",
      });
    }
  } catch (e) {
    await db.deleteComment({ authorDid: user.did, rkey });
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new DataLayerError(`Failed to create comment: ${e}`);
  }
}

export async function deleteComment({
  authorDid,
  rkey,
}: db.DeleteCommentInput) {
  const user = await ensureUser();

  if (user.did !== authorDid) {
    throw new DataLayerError("You can only delete your own comments");
  }

  try {
    after(() =>
      getAtprotoClient().delete(fyi.unravel.frontpage.comment, {
        repo: authorDid,
        rkey,
      }),
    );
    await db.deleteComment({ authorDid: user.did, rkey });
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new DataLayerError(`Failed to delete comment: ${e}`);
  }
}
