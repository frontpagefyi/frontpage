import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load environment variables
loadEnvConfig(process.cwd());

// Allowing reading from env here so that this file can be used in scripts (eg. db migrations) without needing the full env vars defined in @/lib/config/server-config
// eslint-disable-next-line node/no-process-env
const URL = process.env.TURSO_CONNECTION_URL!;
// eslint-disable-next-line node/no-process-env
const AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!URL) {
  throw new Error("TURSO_CONNECTION_URL must be set");
}

console.log("Connecting to", URL);

if (URL.endsWith(".turso.io") && !AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN must be set when connecting to turso.io");
}

export default defineConfig({
  dialect: "turso",
  schema: "./lib/schema.ts",
  strict: true,
  out: "./drizzle",
  dbCredentials: {
    url: URL,
    authToken: AUTH_TOKEN,
  },
});
