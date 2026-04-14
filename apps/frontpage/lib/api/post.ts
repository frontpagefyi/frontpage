import "server-only";
import * as db from "../data/db/post";
import { ensureUser } from "../data/user";
import { DataLayerError } from "../data/error";
import { invariant } from "../utils";
import { TID } from "@atproto/common-web";
import { l } from "@atproto/lex";
import * as fyi from "@repo/frontpage-atproto-client/fyi";
import { type DID } from "../data/atproto/did";
import { after } from "next/server";
import { getAtprotoClient } from "../data/atproto/repo";

export type ApiCreatePostInput = {
  authorDid: DID;
  title: string;
  url: string;
};

export async function createPost({
  authorDid,
  title,
  url,
}: ApiCreatePostInput) {
  const user = await ensureUser();

  if (user.did !== authorDid) {
    throw new DataLayerError("You can only create posts for yourself");
  }

  const rkey = TID.next().toString();
  if (!l.isUriString(url)) {
    throw new DataLayerError("Invalid URL");
  }
  try {
    const dbCreatedPost = await db.createPost({
      post: { title, url, createdAt: new Date() },
      rkey,
      authorDid: user.did,
      status: "pending",
      collection: fyi.unravel.frontpage.post.$type,
    });
    invariant(dbCreatedPost, "Failed to insert post in database");

    const atproto = getAtprotoClient();
    const record = fyi.unravel.frontpage.post.$build({
      title,
      url,
      createdAt: l.currentDatetimeString(),
    });
    after(() =>
      atproto.create(fyi.unravel.frontpage.post, record, {
        repo: user.did,
        rkey,
      }),
    );

    return { rkey };
  } catch (e) {
    await db.deletePost({ authorDid: user.did, rkey });
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new DataLayerError(`Failed to create post: ${e}`);
  }
}

export async function deletePost({ authorDid, rkey }: db.DeletePostInput) {
  const user = await ensureUser();

  if (authorDid !== user.did) {
    throw new DataLayerError("You can only delete your own posts");
  }

  try {
    const atproto = getAtprotoClient();
    after(() =>
      atproto.delete(fyi.unravel.frontpage.post, {
        repo: authorDid,
        rkey,
      }),
    );
    await db.deletePost({ authorDid: user.did, rkey });
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new DataLayerError(`Failed to delete post: ${e}`);
  }
}
