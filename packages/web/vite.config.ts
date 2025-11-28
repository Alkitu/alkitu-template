import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/tests/e2e/**'],
    deps: {
      inline: ["@testing-library/jest-dom"],
    },
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@src": path.resolve(__dirname, "./src"),
      "@drive": path.resolve(__dirname, "./src/features/drive"),
      "@drive-components": path.resolve(
        __dirname,
        "./src/app/[lang]/(marketing)/drive/components"
      ),
      "@ui": path.resolve(__dirname, "./src/components"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@src": path.resolve(__dirname, "./src"),
      "@drive": path.resolve(__dirname, "./src/features/drive"),
      "@drive-components": path.resolve(
        __dirname,
        "./src/app/[lang]/(marketing)/drive/components"
      ),
      "@ui": path.resolve(__dirname, "./src/components"),
    },
  },
});
