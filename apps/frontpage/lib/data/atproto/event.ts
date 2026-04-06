import "server-only";
import { z } from "zod";
import { NSID } from "@atproto/syntax";
import { isDid } from "./did";

// This module refers to the event emitted by Jetstream

const Path = z.string().transform((p, ctx) => {
  const parts = p.split("/");
  const [nsidStr, rkey] = parts;

  if (!nsidStr || !rkey) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid path: ${p}`,
    });
    return z.NEVER;
  }

  try {
    NSID.parse(nsidStr);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid NSID in path: ${nsidStr}`,
    });
    return z.NEVER;
  }

  return {
    collection: nsidStr,
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
