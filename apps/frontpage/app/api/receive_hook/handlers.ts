import { getPdsUrl, type DID } from "@/lib/data/atproto/did";
import { type Operation } from "@/lib/data/atproto/event";
import { getDidFromHandleOrDid } from "@/lib/data/atproto/identity";
import {
  type CommentCollectionType,
  getAtprotoClient,
  type VoteCollectionType,
  type PostCollectionType,
} from "@/lib/data/atproto/repo";
import * as dbComment from "@/lib/data/db/comment";
import * as dbNotification from "@/lib/data/db/notification";
import * as dbPost from "@/lib/data/db/post";
import * as dbVote from "@/lib/data/db/vote";
import { getBlueskyProfile } from "@/lib/data/user";
import { sendDiscordMessage } from "@/lib/discord";
import { invariant } from "@/lib/utils";
import { AtUri } from "@atproto/syntax";
import * as fyi from "@repo/frontpage-atproto-client/fyi";
import type z from "zod";

type HandlerInput = {
  op: z.infer<typeof Operation>;
  repo: DID;
  rkey: string;
};

// These handlers are called from the receive_hook route
// It processes operations received from the Drainpipe service
// Since we use read after write, we need to check if the record exists before creating it
// If it's a delete then setting the status to delete again doesn't matter

async function getAtprotoClientFromRepo(repo: DID) {
  const pds = await getPdsUrl(repo);
  if (!pds) {
    throw new Error("Failed to get PDS");
  }
  return getAtprotoClient(pds);
}

async function hydratePost(
  repo: DID,
  collection: string,
  rkey: string,
): Promise<{
  title: string;
  url: string;
  createdAt: Date;
  cid: string;
  $type: PostCollectionType;
}> {
  const atproto = await getAtprotoClientFromRepo(repo);
  if (collection === fyi.unravel.frontpage.post.$type) {
    const record = await atproto.get(fyi.unravel.frontpage.post, {
      repo,
      rkey,
    });
    const cid = record.cid;
    invariant(
      cid,
      `Missing CID for frontpage post at://${repo}/${collection}/${rkey}`,
    );
    return {
      title: record.value.title,
      url: record.value.url,
      createdAt: new Date(record.value.createdAt),
      cid,
      $type: record.value.$type,
    };
  } else if (collection === fyi.frontpage.feed.post.$type) {
    const record = await atproto.get(fyi.frontpage.feed.post, { repo, rkey });
    const subject = fyi.frontpage.feed.post.urlSubject.$validate(
      record.value.subject,
    );
    const cid = record.cid;
    invariant(
      cid,
      `Missing CID for frontpage feed post at://${repo}/${collection}/${rkey}`,
    );
    return {
      title: record.value.title,
      url: subject.url,
      createdAt: new Date(record.value.createdAt),
      cid,
      $type: record.value.$type,
    };
  } else {
    throw new Error(`Unknown collection for post hydration: ${collection}`);
  }
}

export async function handlePost({ op, repo, rkey }: HandlerInput) {
  if (op.action === "create") {
    const post = await hydratePost(repo, op.path.collection, rkey);

    if (await dbPost.uncached_doesPostExist(repo, rkey)) {
      await dbPost.updatePost(repo, rkey, {
        status: "live",
        cid: post.cid,
      });
    } else {
      await dbPost.createPost({
        post: {
          title: post.title,
          url: post.url,
          createdAt: post.createdAt,
        },
        rkey,
        cid: post.cid,
        authorDid: repo,
        status: "live",
        collection: post.$type,
      });
    }

    const bskyProfile = await getBlueskyProfile(repo);
    await sendDiscordMessage({
      embeds: [
        {
          title: `New ${post.$type} on Frontpage`,
          description: post.title,
          url: `https://frontpage.fyi/post/${repo}/${rkey}`,
          color: 10181046,
          author: bskyProfile
            ? {
                name: `@${bskyProfile.handle}`,
                icon_url: bskyProfile.avatar,
                url: `https://frontpage.fyi/profile/${bskyProfile.handle}`,
              }
            : undefined,
          fields: [
            {
              name: "Link",
              value: post.url,
            },
          ],
        },
      ],
    });
  } else if (op.action === "delete") {
    await dbPost.deletePost({
      authorDid: repo,
      rkey,
    });
  }
}

async function hydrateComment(
  repo: DID,
  collection: string,
  rkey: string,
): Promise<{
  cid: string;
  content: string;
  createdAt: Date;
  parentUri: AtUri | null;
  postUri: AtUri;
  $type: CommentCollectionType;
}> {
  const atproto = await getAtprotoClientFromRepo(repo);
  if (collection === fyi.unravel.frontpage.comment.$type) {
    const record = await atproto.get(fyi.unravel.frontpage.comment, {
      repo,
      rkey,
    });
    const cid = record.cid;
    invariant(
      cid,
      `Missing CID for comment at://${repo}/${collection}/${rkey}`,
    );
    return {
      cid,
      content: record.value.content,
      createdAt: new Date(record.value.createdAt),
      parentUri: record.value.parent
        ? new AtUri(record.value.parent.uri)
        : null,
      postUri: new AtUri(record.value.post.uri),
      $type: record.value.$type,
    };
  } else if (collection === fyi.frontpage.feed.comment.$type) {
    const record = await atproto.get(fyi.frontpage.feed.comment, {
      repo,
      rkey,
    });
    const cid = record.cid;
    invariant(
      cid,
      `Missing CID for comment at://${repo}/${collection}/${rkey}`,
    );

    const blockContents = record.value.blocks.flatMap((block) => {
      if (
        fyi.frontpage.richtext.block.plaintextParagraph.matches(block.content)
      ) {
        return [block.content.text];
      } else {
        return [];
      }
    });

    return {
      cid,
      content: blockContents.join("\n\n"),
      createdAt: new Date(record.value.createdAt),
      parentUri: record.value.parent
        ? new AtUri(record.value.parent.uri)
        : null,
      postUri: new AtUri(record.value.post.uri),
      $type: record.value.$type,
    };
  } else {
    throw new Error(`Unknown collection for comment hydration: ${collection}`);
  }
}

export async function handleComment({ op, repo, rkey }: HandlerInput) {
  if (op.action === "create") {
    const comment = await hydrateComment(repo, op.path.collection, rkey);

    if (await dbComment.uncached_doesCommentExist(repo, rkey)) {
      await dbComment.updateComment(repo, rkey, {
        status: "live",
        cid: comment.cid,
      });
    } else {
      const parentData = comment.parentUri
        ? {
            uri: comment.parentUri,
            authorDid: await getDidOrThrow(comment.parentUri.host),
          }
        : null;

      const postAuthorDid = await getDidOrThrow(comment.postUri.host);

      const createdComment = await dbComment.createComment({
        cid: comment.cid,
        authorDid: repo,
        rkey,
        content: comment.content,
        createdAt: comment.createdAt,
        parent: parentData
          ? {
              authorDid: parentData.authorDid,
              rkey: parentData.uri.rkey,
            }
          : undefined,
        post: {
          authorDid: postAuthorDid,
          rkey: comment.postUri.rkey,
        },
        status: "live",
        collection: comment.$type,
      });

      if (!createdComment) {
        throw new Error("Failed to insert comment from relay in database");
      }

      const didToNotify = parentData ? parentData.authorDid : postAuthorDid;

      if (didToNotify !== repo) {
        await dbNotification.createNotification({
          commentId: createdComment.id,
          did: didToNotify,
          reason: parentData ? "commentReply" : "postComment",
        });
      }
    }

    const bskyProfile = await getBlueskyProfile(repo);
    const postUrl = `https://frontpage.fyi/post/${comment.postUri.host}/${comment.postUri.rkey}`;
    const post = await dbPost.getPost(
      comment.postUri.host as DID,
      comment.postUri.rkey,
    );
    await sendDiscordMessage({
      embeds: [
        {
          title: `New ${comment.$type} on Frontpage`,
          description: comment.content,
          url: `${postUrl}/${repo}/${rkey}`,
          color: 10181046,
          author: bskyProfile
            ? {
                name: `@${bskyProfile.handle}`,
                icon_url: bskyProfile.avatar,
                url: `https://frontpage.fyi/profile/${bskyProfile.handle}`,
              }
            : undefined,
          fields: [
            {
              name: "Post",
              value: `[${post?.title}](${postUrl})`,
            },
          ],
        },
      ],
    });
  } else if (op.action === "delete") {
    await dbComment.deleteComment({ rkey, authorDid: repo });
  }
}

async function hydrateVote(
  repo: DID,
  collection: string,
  rkey: string,
): Promise<{
  cid: string;
  createdAt: Date;
  subject: {
    uri: AtUri;
    cid: string;
  };
  $type: VoteCollectionType;
}> {
  const atproto = await getAtprotoClientFromRepo(repo);
  let record;
  if (collection === fyi.unravel.frontpage.vote.$type) {
    record = await atproto.get(fyi.unravel.frontpage.vote, { repo, rkey });
  } else if (collection === fyi.frontpage.feed.vote.$type) {
    record = await atproto.get(fyi.frontpage.feed.vote, { repo, rkey });
  } else {
    throw new Error(`Unknown collection for vote hydration: ${collection}`);
  }

  const cid = record.cid;
  invariant(cid, `Missing CID for vote at://${repo}/${collection}/${rkey}`);
  return {
    cid,
    createdAt: new Date(record.value.createdAt),
    subject: {
      uri: new AtUri(record.value.subject.uri),
      cid: record.value.subject.cid,
    },
    $type: record.value.$type,
  };
}

export async function handleVote({ op, repo, rkey }: HandlerInput) {
  if (op.action === "create") {
    const vote = await hydrateVote(repo, op.path.collection, rkey);

    switch (vote.subject.uri.collection) {
      case fyi.unravel.frontpage.post.$type:
      case fyi.frontpage.feed.post.$type: {
        if (await dbVote.uncached_doesPostVoteExist(repo, rkey)) {
          await dbVote.updatePostVote({
            authorDid: repo,
            rkey,
            status: "live",
            cid: vote.cid,
          });
        } else {
          const createdDbPostVote = await dbVote.createPostVote({
            repo,
            rkey,
            cid: vote.cid,
            subject: {
              rkey: vote.subject.uri.rkey,
              authorDid: await getDidOrThrow(vote.subject.uri.host),
              cid: vote.subject.cid,
            },
            status: "live",
            collection: vote.$type,
          });

          if (!createdDbPostVote) {
            throw new Error(
              "Failed to insert post vote from relay in database",
            );
          }
        }
        break;
      }
      case fyi.unravel.frontpage.comment.$type:
      case fyi.frontpage.feed.comment.$type: {
        if (await dbVote.uncached_doesCommentVoteExist(repo, rkey)) {
          await dbVote.updateCommentVote({
            authorDid: repo,
            rkey,
            status: "live",
            cid: vote.cid,
          });
        } else {
          const createdDbCommentVote = await dbVote.createCommentVote({
            repo,
            rkey,
            cid: vote.cid,
            subject: {
              rkey: vote.subject.uri.rkey,
              authorDid: await getDidOrThrow(vote.subject.uri.host),
              cid: vote.subject.cid,
            },
            status: "live",
            collection: vote.$type,
          });

          if (!createdDbCommentVote) {
            throw new Error(
              "Failed to insert comment vote from relay in database",
            );
          }
        }
        break;
      }
      default: {
        throw new Error(
          `Unknown vote subject collection: ${vote.subject.uri.collection} received from at://${repo}/${op.path.collection}/${rkey}#${vote.cid}`,
        );
      }
    }
  } else if (op.action === "delete") {
    await dbVote.deleteVote({ authorDid: repo, rkey });
  }
}

async function getDidOrThrow(handleOrDid: string): Promise<DID> {
  const did = await getDidFromHandleOrDid(handleOrDid);
  if (!did) {
    throw new Error(`Failed to resolve DID from handle or DID: ${handleOrDid}`);
  }
  return did;
}
