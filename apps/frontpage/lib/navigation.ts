import { headers } from "next/headers";
import { type DID } from "./data/atproto/did";
import { nsids } from "./data/atproto/nsids";
import { getPostFromComment } from "./data/db/post";
import { serverConfig } from "./config/server-config";

type PostInput = {
  handleOrDid: string | DID;
  rkey: string;
};

export function getPostLink({ handleOrDid, rkey }: PostInput) {
  return `/post/${handleOrDid}/${rkey}`;
}

type CommentInput = {
  post: PostInput;
  handleOrDid: string | DID;
  rkey: string;
};

export function getCommentLink({ post, handleOrDid, rkey }: CommentInput) {
  return `/post/${post.handleOrDid}/${post.rkey}/${handleOrDid}/${rkey}`;
}

type GetFrontpageLinkInput = {
  identity: DID;
  collection?: string;
  rkey?: string;
};

/**
 * Variadic function to get the link to an arbitrary at:// URI. Prefer {@link getPostLink} or {@link getCommentLink} for most cases.
 */
export async function getFrontPageLink({
  identity,
  collection,
  rkey,
}: GetFrontpageLinkInput) {
  switch (collection) {
    case nsids.FyiUnravelFrontpagePost:
      return `/post/${identity}/${rkey}/`;

    case nsids.FyiUnravelFrontpageComment: {
      const { postAuthor, postRkey } = (await getPostFromComment({
        rkey: rkey!,
        did: identity,
      }))!;
      return `/post/${postAuthor}/${postRkey}/${identity}/${rkey}/`;
    }

    default:
      return `/profile/${identity}`;
  }
}

export async function getRootHost() {
  let host: string | null | undefined =
    serverConfig.VERCEL_PROJECT_PRODUCTION_URL;

  if (process.env.NODE_ENV === "development") {
    host = (await headers()).get("host");
  } else if (serverConfig.VERCEL_ENV === "preview") {
    const hostHeader = (await headers()).get("host");

    if (hostHeader === serverConfig.VERCEL_URL) {
      host = serverConfig.VERCEL_URL;
    } else if (hostHeader === serverConfig.VERCEL_BRANCH_URL) {
      host = serverConfig.VERCEL_BRANCH_URL;
    } else {
      throw new Error("Invalid host header");
    }
  }

  if (!host) {
    throw new Error("Host is not defined");
  }

  return host;
}
