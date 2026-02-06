import "server-only";
import * as db from "../data/db/post";
import { ensureUser } from "../data/user";
import { DataLayerError } from "../data/error";
import { exhaustiveCheck, invariant } from "../utils";
import { TID } from "@atproto/common-web";
import { type DID } from "../data/atproto/did";
import { after } from "next/server";
import { getAtprotoClient, nsids } from "../data/atproto/repo";
import { type AtUri } from "@atproto/syntax";

export type ApiCreatePostInput = {
  actor: DID;
  title: string;
  url: string;
};

export async function createPost({ actor, title, url }: ApiCreatePostInput) {
  const user = await ensureUser();

  if (user.did !== actor) {
    throw new DataLayerError("You can only create posts for yourself");
  }

  const rkey = TID.next().toString();
  const uri = { actor, collection: nsids.FyiUnravelFrontpagePost, rkey };
  try {
    const dbCreatedPost = await db.createPost({
      post: { title, url, createdAt: new Date() },
      uri,
      status: "pending",
    });
    invariant(dbCreatedPost, "Failed to insert post in database");

    const atproto = getAtprotoClient();
    after(() =>
      atproto.fyi.unravel.frontpage.post.create(
        {
          repo: user.did,
          rkey,
        },
        {
          title: title,
          url: url,
          createdAt: new Date().toISOString(),
        },
      ),
    );

    return { rkey };
  } catch (e) {
    await db.deletePost(uri);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new DataLayerError(`Failed to create post: ${e}`);
  }
}

export async function deletePost(uri: AtUri) {
  const user = await ensureUser();
  const postUri = await db.resolvePostUri(uri);

  if (postUri.actor !== user.did) {
    throw new DataLayerError("You can only delete your own posts");
  }

  try {
    after(async () => {
      const atproto = getAtprotoClient();
      if (postUri.collection === nsids.FyiUnravelFrontpagePost) {
        await atproto.fyi.unravel.frontpage.post.delete({
          repo: user.did,
          rkey: postUri.rkey,
        });
      } else if (postUri.collection === nsids.FyiFrontpageFeedPost) {
        await atproto.fyi.frontpage.feed.post.delete({
          repo: user.did,
          rkey: postUri.rkey,
        });
      } else {
        exhaustiveCheck(
          postUri.collection,
          "Cannot delete post. Unknown post collection",
        );
      }
    });
    await db.deletePost(postUri);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new DataLayerError(`Failed to delete post: ${e}`);
  }
}
