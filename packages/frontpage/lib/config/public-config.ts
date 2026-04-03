/* eslint-disable node/no-process-env */
import z from "zod";

const ServerEnv = z.object({
  NEXT_PUBLIC_FEED_SERVICE_DID: z.string(),
  NEXT_PUBLIC_DEFAULT_PDS_HOST: z.string().optional(),
});

export const publicConfig = ServerEnv.parse({
  // We write these out manually so that turbo eslint can catch new env vars and ensure we add them to turbo.json
  NEXT_PUBLIC_FEED_SERVICE_DID: process.env.NEXT_PUBLIC_FEED_SERVICE_DID,
  NEXT_PUBLIC_DEFAULT_PDS_HOST: process.env.NEXT_PUBLIC_DEFAULT_PDS_HOST,
});
