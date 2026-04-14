import { AtUri } from "@atproto/syntax";
import * as com from "@repo/frontpage-atproto-client/com";
import * as fyi from "@repo/frontpage-atproto-client/fyi";
import type { DID } from "./did";

type BuildStrongRefInput = {
  authorDid: DID | string;
  collection: string;
  rkey: string;
  cid: string;
};

export function buildAtUri(
  authorDid: DID | string,
  collection: string,
  rkey: string,
) {
  return new AtUri(`at://${authorDid}/${collection}/${rkey}`);
}

export function buildAtUriString(
  authorDid: DID | string,
  collection: string,
  rkey: string,
) {
  return buildAtUri(authorDid, collection, rkey).toString();
}

export function buildStrongRef({
  authorDid,
  collection,
  rkey,
  cid,
}: BuildStrongRefInput) {
  return com.atproto.repo.strongRef.$build({
    uri: buildAtUriString(authorDid, collection, rkey),
    cid,
  });
}

export function extractPlaintextCommentContent(
  blocks: fyi.frontpage.feed.comment.Main["blocks"],
) {
  return blocks
    .map(
      (block) =>
        fyi.frontpage.richtext.block.plaintextParagraph.$validate(block.content)
          .text,
    )
    .join("\n\n");
}
