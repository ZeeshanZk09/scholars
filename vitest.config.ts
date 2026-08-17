import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/unit/setup.ts"],
    include: [
      "tests/unit/**/*.test.ts",
      "tests/unit/**/*.test.tsx",
      "tests/integration/**/*.test.ts",
      "tests/integration/**/*.test.tsx",
    ],
    globals: true,
    pool: "threads",
    testTimeout: 30000,
    hookTimeout: 30000,
    env: {
      DATABASE_URL:
        "postgresql://test:test@localhost:5432/scholar_school?schema=public",
      AUTH_SECRET: "test-secret",
      APP_URL: "http://localhost:3000",
      AUTH_URL: "http://localhost:3000",
      AUTH_TRUST_HOST: "true",
      NODE_ENV: "test",
    },
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
