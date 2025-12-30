import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load environment variables
loadEnvConfig(process.cwd());

const URL = process.env.VERCEL_TURSO_TURSO_DATABASE_URL!;
const AUTH_TOKEN = process.env.VERCEL_TURSO_TURSO_AUTH_TOKEN;

if (!URL) {
  throw new Error("VERCEL_TURSO_TURSO_DATABASE_URL must be set");
}

console.log("Connecting to", URL);

if (URL.endsWith(".turso.io") && !AUTH_TOKEN) {
  throw new Error(
    "VERCEL_TURSO_TURSO_AUTH_TOKEN must be set when connecting to turso.io",
  );
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
