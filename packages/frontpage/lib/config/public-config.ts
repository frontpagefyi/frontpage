/* eslint-disable node/no-process-env */
// Not using our own did function here to prevent circular dependencies (we don't want to inadvertently import a server-only module here)
import { isAtprotoDid } from "@atcute/identity";
import z from "zod";
import type { DID } from "../data/atproto/did";

const ServerEnv = z.object({
  NEXT_PUBLIC_FEED_SERVICE_DID: z
    .string()
    .refine((val) => (isAtprotoDid as (val: string) => val is DID)(val), {
      message: "NEXT_PUBLIC_FEED_SERVICE_DID must be a valid atproto DID",
    }),
  NEXT_PUBLIC_DEFAULT_PDS_HOST: z.string().optional(),
});

export const publicConfig = ServerEnv.parse({
  // We write these out manually so that turbo eslint can catch new env vars and ensure we add them to turbo.json
  NEXT_PUBLIC_FEED_SERVICE_DID: process.env.NEXT_PUBLIC_FEED_SERVICE_DID,
  NEXT_PUBLIC_DEFAULT_PDS_HOST: process.env.NEXT_PUBLIC_DEFAULT_PDS_HOST,
});
