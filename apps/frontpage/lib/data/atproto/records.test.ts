import { expect, test } from "vitest";
import * as com from "@repo/frontpage-atproto-client/com";
import * as fyi from "@repo/frontpage-atproto-client/fyi";
import { nsids } from "./nsids";
import { buildStrongRef, extractPlaintextCommentContent } from "./records";

const VALID_CID = "bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

test("buildStrongRef returns a schema-valid strong ref", () => {
  const ref = buildStrongRef({
    authorDid: "did:plc:4hqjfn7m6n5hno3doamuhgef",
    collection: nsids.FyiUnravelFrontpagePost,
    rkey: "3k2abc",
    cid: VALID_CID,
  });

  expect(ref).toEqual(
    com.atproto.repo.strongRef.$validate({
      $type: com.atproto.repo.strongRef.$type,
      uri: "at://did:plc:4hqjfn7m6n5hno3doamuhgef/fyi.unravel.frontpage.post/3k2abc",
      cid: VALID_CID,
    }),
  );
});

test("extractPlaintextCommentContent joins plaintext paragraphs", () => {
  const blocks = [
    fyi.frontpage.richtext.block.$build({
      content: fyi.frontpage.richtext.block.plaintextParagraph.$build({
        text: "first",
      }),
    }),
    fyi.frontpage.richtext.block.$build({
      content: fyi.frontpage.richtext.block.plaintextParagraph.$build({
        text: "second",
      }),
    }),
  ];

  expect(extractPlaintextCommentContent(blocks)).toBe("first\n\nsecond");
});

test("extractPlaintextCommentContent rejects non-plaintext block content", () => {
  const blocks = [
    {
      content: {
        $type: "fyi.frontpage.richtext.block#unsupported",
      },
    },
  ] as unknown as fyi.frontpage.feed.comment.Main["blocks"];

  expect(() => extractPlaintextCommentContent(blocks)).toThrow();
});
