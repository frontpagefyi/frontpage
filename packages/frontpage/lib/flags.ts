import { flag, dedupe } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";
import type { DID } from "./data/atproto/did";
import { getSession } from "./auth";
import type { Adapter } from "flags";

// Defined here: https://vercel.com/frontpagefyi/frontpage/flags/entities
type Entities = {
  user?: {
    did: DID;
  };
};

const identify = dedupe(async (): Promise<Entities> => {
  const session = await getSession();

  if (!session) {
    return {};
  }

  return {
    user: {
      did: session.did,
    },
  };
});

function adapter(): Adapter<unknown, unknown> {
  if (process.env.FLAGS && process.env.FLAGS_SECRET) {
    return vercelAdapter();
  }

  return {
    // Default to all flags off when FLAGS env var is not set, which is the case in development when running locally without Vercel linked.
    // TODO: Read from a file or something to allow contributors without access to the vercel toolbar/project to override flag values locally.
    decide: () => false,
  };
}

export const newPostAutoTitleUi = flag({
  key: "new-post-auto-title-ui",
  adapter: adapter(),
  identify,
});
