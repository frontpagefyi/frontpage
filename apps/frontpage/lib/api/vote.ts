import "server-only";
import * as db from "../data/db/vote";
import { DataLayerError } from "../data/error";
import { ensureUser } from "../data/user";
import { type DID } from "../data/atproto/did";
import { invariant } from "../utils";
import { TID } from "@atproto/common-web";
import { l } from "@atproto/lex";
import * as fyi from "@repo/frontpage-atproto-client/fyi";
import { after } from "next/server";
import { getAtprotoClient } from "../data/atproto/repo";
import { nsids } from "../data/atproto/nsids";
import { buildStrongRef } from "../data/atproto/records";

// TODO: Should use a strongRef
export type ApiCreateVoteInput = {
  rkey: string;
  cid: string;
  authorDid: DID;
  collection:
    | typeof nsids.FyiUnravelFrontpagePost
    | typeof nsids.FyiUnravelFrontpageComment;
};

export async function createVote(subject: ApiCreateVoteInput) {
  const user = await ensureUser();

  const rkey = TID.next().toString();
  try {
    if (subject.collection == nsids.FyiUnravelFrontpagePost) {
      const dbCreatedVote = await db.createPostVote({
        repo: user.did,
        rkey,
        subject: {
          rkey: subject.rkey,
          authorDid: subject.authorDid,
          cid: subject.cid,
        },
        status: "pending",
        collection: nsids.FyiUnravelFrontpageVote,
      });

      invariant(dbCreatedVote, "Failed to insert post vote in database");
    } else if (subject.collection == nsids.FyiUnravelFrontpageComment) {
      const dbCreatedVote = await db.createCommentVote({
        repo: user.did,
        rkey,
        subject: {
          rkey: subject.rkey,
          authorDid: subject.authorDid,
          cid: subject.cid,
        },
        status: "pending",
        collection: nsids.FyiUnravelFrontpageVote,
      });

      invariant(dbCreatedVote, "Failed to insert comment vote in database");
    }
    const atproto = getAtprotoClient();
    const record = fyi.unravel.frontpage.vote.$build({
      subject: buildStrongRef(subject),
      createdAt: l.currentDatetimeString(),
    });
    after(() =>
      atproto.create(fyi.unravel.frontpage.vote, record, {
        rkey,
        repo: user.did,
        validate: true,
        validateRequest: true,
      }),
    );
  } catch (e) {
    await db.deleteVote({ authorDid: user.did, rkey });
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new DataLayerError(`Failed to create post vote: ${e}`);
  }
}

export async function deleteVote({ authorDid, rkey }: db.DeleteVoteInput) {
  const user = await ensureUser();
  if (authorDid !== user.did) {
    throw new DataLayerError("You can only delete your own votes");
  }

  try {
    const atproto = getAtprotoClient();
    after(() =>
      atproto.delete(fyi.unravel.frontpage.vote, {
        repo: user.did,
        rkey,
      }),
    );
    await db.deleteVote({ authorDid: user.did, rkey });
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new DataLayerError(`Failed to delete vote: ${e}`);
  }
}
