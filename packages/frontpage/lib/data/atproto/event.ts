import "server-only";
import { z } from "zod";
import { isDid } from "./did";
import { nsids } from "./repo";

// This module refers to the event emitted by Jetstream

export const KnownCollection = z.union([
  z.literal(nsids.FyiUnravelFrontpagePost),
  z.literal(nsids.FyiFrontpageFeedPost),
  z.literal(nsids.FyiUnravelFrontpageComment),
  z.literal(nsids.FyiFrontpageFeedComment),
  z.literal(nsids.FyiUnravelFrontpageVote),
  z.literal(nsids.FyiFrontpageFeedVote),
]);

export type KnownCollection = z.infer<typeof KnownCollection>;

const Path = z.string().transform((p, ctx) => {
  const collection = p.split("/")[0];
  if (!collection) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid path: ${p}`,
    });
    return z.NEVER;
  }
  const rkey = p.split("/")[1];
  if (!rkey) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid path: ${p}`,
    });
    return z.NEVER;
  }

  return {
    collection,
    rkey,
    value: p,
  };
});

export const Operation = z.union([
  z.object({
    action: z.union([z.literal("create"), z.literal("update")]),
    path: Path,
    cid: z.string(),
  }),
  z.object({
    action: z.literal("delete"),
    path: Path,
  }),
]);

export const Commit = z.object({
  ops: z.array(Operation),
  repo: z.string().refine(isDid),
  seq: z.string().transform((x, ctx) => {
    try {
      const n = parseInt(x);
      if (isNaN(n)) {
        throw new Error("Invalid BigInt");
      }

      return parseInt(x);
    } catch (_e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid BigInt",
      });

      return z.NEVER;
    }
  }),
});
