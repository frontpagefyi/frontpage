import "server-only";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.VERCEL_TURSO_TURSO_DATABASE_URL!,
  authToken: process.env.VERCEL_TURSO_TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
