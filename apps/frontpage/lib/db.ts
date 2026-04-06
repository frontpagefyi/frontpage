import "server-only";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { serverConfig } from "./config/server-config";

const client = createClient({
  url: serverConfig.TURSO_CONNECTION_URL,
  authToken: serverConfig.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
