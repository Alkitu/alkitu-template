/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom", // Changed from jsdom - better DOM event handling
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/tests/e2e/**'],
    deps: {
      optimizer: {
        web: {
          include: ["@testing-library/react", "@testing-library/jest-dom"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Resolve @alkitu/shared subpath imports that aren't in the package's exports field
      "@alkitu/shared/enums/user-role.enum": path.resolve(__dirname, "../shared/src/enums/user-role.enum.ts"),
      "@alkitu/shared/rbac/role-hierarchy": path.resolve(__dirname, "../shared/src/rbac/role-hierarchy.ts"),
    },
  },
});
