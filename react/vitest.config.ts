import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@timer": path.resolve(__dirname, "src/domains/timer"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "src/setupTests.js",
        "src/public/**",
        "**/*.d.ts",
        "**/*Style.{ts,tsx}",
        "**/index.{ts,tsx}",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "vitest.config.ts",
        "vite.config.ts",
        "src/style/**",
        "build/",
        "coverage/",
      ],
      include: ["src/**/*.{ts,tsx}"],
      thresholds: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
      },
    },
  },
});
