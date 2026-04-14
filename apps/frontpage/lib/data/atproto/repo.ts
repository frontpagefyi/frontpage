import { getUser } from "../user";
import { fetchAuthenticatedAtproto } from "@/lib/auth";
import { cache } from "react";
import type * as fyi from "@repo/frontpage-atproto-client/fyi";
import { Client } from "@atproto/lex";

export const getAtprotoClient = cache(
  (service?: string) =>
    new Client(async (url: string, init: RequestInit) => {
      const user = await getUser();
      if (service && user) {
        console.warn(
          "Service URL provided, but user is authenticated. Using user authentication.",
        );
      }
      const s = service ?? user?.pdsUrl;
      if (!s) {
        throw new Error("No service url");
      }

      const u = new URL(url, s);

      if (user) {
        return fetchAuthenticatedAtproto(u, init);
      }

      return fetch(u, init);
    }),
);

export type PostCollectionType =
  | typeof fyi.unravel.frontpage.post.$type
  | typeof fyi.frontpage.feed.post.$type;

export type CommentCollectionType =
  | typeof fyi.unravel.frontpage.comment.$type
  | typeof fyi.frontpage.feed.comment.$type;

export type VoteCollectionType =
  | typeof fyi.unravel.frontpage.vote.$type
  | typeof fyi.frontpage.feed.vote.$type;
