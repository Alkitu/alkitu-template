/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest configuration specifically for Theme Editor 3.0 testing
 * This is a separate config to avoid modifying the existing vitest.config.ts
 *
 * Usage:
 * - npm run test:theme-editor
 * - npm run test:theme-editor:watch
 * - npm run test:theme-editor:coverage
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    deps: {
      optimizer: {
        web: {
          include: ["@testing-library/react", "@testing-library/jest-dom"],
        },
      },
    },
    // Coverage configuration for Theme Editor
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage/theme-editor',
      include: [
        'src/components/admin/theme-editor-3.0/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/components/admin/theme-editor-3.0/**/*.test.{ts,tsx}',
        'src/components/admin/theme-editor-3.0/**/*.spec.{ts,tsx}',
        'src/components/admin/theme-editor-3.0/__tests__/**/*',
        'src/components/admin/theme-editor-3.0/**/*.d.ts',
        'src/components/admin/theme-editor-3.0/**/index.ts',
      ],
      thresholds: {
        global: {
          lines: 85,
          functions: 85,
          branches: 85,
          statements: 85,
        },
        // Per-directory thresholds
        'src/components/admin/theme-editor-3.0/design-system/atoms/': {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
        'src/components/admin/theme-editor-3.0/design-system/molecules/': {
          lines: 85,
          functions: 85,
          branches: 85,
          statements: 85,
        },
        'src/components/admin/theme-editor-3.0/design-system/organisms/': {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
        'src/components/admin/theme-editor-3.0/core/': {
          lines: 95,
          functions: 95,
          branches: 90,
          statements: 95,
        },
      },
    },
    // Only include Theme Editor tests
    include: [
      'src/components/admin/theme-editor-3.0/**/*.test.{ts,tsx}',
      'src/components/admin/theme-editor-3.0/**/*.spec.{ts,tsx}',
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});