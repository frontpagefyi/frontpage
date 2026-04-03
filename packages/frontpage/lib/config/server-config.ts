/* eslint-disable node/no-process-env */
import "server-only";
import z from "zod";
// Not using our own did function here to prevent circular dependencies
import { isAtprotoDid } from "@atcute/identity";
import type { DID } from "../data/atproto/did";

const ServerEnv = z.object({
  TURSO_CONNECTION_URL: z.string(),
  // Optional in dev (turso runs unauthenticated)
  TURSO_AUTH_TOKEN: z.string().optional(),
  DRAINPIPE_CONSUMER_SECRET: z.string(),
  // Optional in dev (crons don't run there)
  CRON_SECRET: z.string().optional(),
  PRIVATE_JWK: z.string(),
  PUBLIC_JWK: z.string(),
  FRONTPAGE_DID: z
    .string()
    .refine((val) => (isAtprotoDid as (val: string) => val is DID)(val), {
      message: "FRONTPAGE_DID must be a valid atproto DID",
    }),
  DISCORD_WEBHOOK_URL: z.string().optional(),
  FLAGS: z.string().optional(),
  FLAGS_SECRET: z.string(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  VERCEL_ENV: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_BRANCH_URL: z.string().optional(),
  PLC_DIRECTORY_URL: z.string().optional(),
});

export const serverConfig = ServerEnv.parse({
  // We write these out manually so that turbo eslint can catch new env vars and ensure we add them to turbo.json
  TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  DRAINPIPE_CONSUMER_SECRET: process.env.DRAINPIPE_CONSUMER_SECRET,
  CRON_SECRET: process.env.CRON_SECRET,
  PRIVATE_JWK: process.env.PRIVATE_JWK,
  PUBLIC_JWK: process.env.PUBLIC_JWK,
  FRONTPAGE_DID: process.env.FRONTPAGE_DID,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  FLAGS: process.env.FLAGS,
  FLAGS_SECRET: process.env.FLAGS_SECRET,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
  PLC_DIRECTORY_URL: process.env.PLC_DIRECTORY_URL,
});
