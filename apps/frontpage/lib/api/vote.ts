import "server-only";
import * as db from "../data/db/vote";
import { DataLayerError } from "../data/error";
import { ensureUser } from "../data/user";
import { type DID } from "../data/atproto/did";
import { invariant } from "../utils";
import { TID } from "@atproto/common-web";
import { l } from "@atproto/lex";
import * as com from "@repo/frontpage-atproto-client/com";
import * as fyi from "@repo/frontpage-atproto-client/fyi";
import { after } from "next/server";
import { getAtprotoClient } from "../data/atproto/repo";

// TODO: Should use the strong ref type instead of creating our own. This matches the data layer conventions that we have, where the api accepts generic input
export type ApiCreateVoteInput = {
  rkey: string;
  cid: string;
  authorDid: DID;
  collection:
    | typeof fyi.unravel.frontpage.post.$type
    | typeof fyi.unravel.frontpage.comment.$type;
};

export async function createVote(subject: ApiCreateVoteInput) {
  const user = await ensureUser();

  const rkey = TID.next().toString();
  try {
    if (subject.collection == fyi.unravel.frontpage.post.$type) {
      const dbCreatedVote = await db.createPostVote({
        repo: user.did,
        rkey,
        subject: {
          rkey: subject.rkey,
          authorDid: subject.authorDid,
          cid: subject.cid,
        },
        status: "pending",
        collection: fyi.unravel.frontpage.vote.$type,
      });

      invariant(dbCreatedVote, "Failed to insert post vote in database");
    } else if (subject.collection == fyi.unravel.frontpage.comment.$type) {
      const dbCreatedVote = await db.createCommentVote({
        repo: user.did,
        rkey,
        subject: {
          rkey: subject.rkey,
          authorDid: subject.authorDid,
          cid: subject.cid,
        },
        status: "pending",
        collection: fyi.unravel.frontpage.vote.$type,
      });

      invariant(dbCreatedVote, "Failed to insert comment vote in database");
    }
    const atproto = getAtprotoClient();
    // TODO: We should create this up front to take advantage of validation, but it requires some refactors that relate to fixing bugs with handling both lexicon types.
    // Will be handled in #327
    const record = fyi.unravel.frontpage.vote.$build({
      subject: com.atproto.repo.strongRef.$build({
        uri: `at://${subject.authorDid}/${subject.collection}/${subject.rkey}`,
        cid: subject.cid,
      }),
      createdAt: l.currentDatetimeString(),
    });
    after(() =>
      atproto.create(fyi.unravel.frontpage.vote, record, {
        rkey,
        repo: user.did,
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
