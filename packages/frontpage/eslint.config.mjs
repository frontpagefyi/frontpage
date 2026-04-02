import { defineConfig } from "eslint/config";
import base from "@repo/eslint-config/next.js";
import nodePlugin from "eslint-plugin-n";

export default defineConfig(base, {
  plugins: {
    node: nodePlugin,
  },
  rules: {
    // Ban process.env except process.env.NODE_ENV from all files
    // We allow process.env.NODE_ENV to allow for bundle-time optimizations, putting indirection on it would prevent those optimizations from working
    "node/no-process-env": [
      "error",
      {
        allowedVariables: ["NODE_ENV"],
      },
    ],
  },
});
