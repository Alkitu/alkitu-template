// @ts-nocheck
// 
// ✅ SIMPLE ENHANCED STRYKER CONFIG: Enable more mutations for better coverage
// packages/api/stryker.simple-enhanced.conf.mjs

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: 'npm',
  testRunner: 'jest',
  coverageAnalysis: 'perTest',

  // Jest configuration
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.mjs',
    enableFindRelatedTests: true,
  },

  // Target specific modules
  mutate: [
    'src/users/services/**/*.ts',
    'src/email/channels/**/*.ts',
    'src/notification/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/test/**',
    '!src/**/__tests__/**',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],

  // ENABLE MORE MUTATIONS - Remove some exclusions
  mutator: {
    excludedMutations: [
      // Remove StringLiteral exclusion to test string mutations
      // Remove ConditionalExpression exclusion to test conditional logic
      'ArithmeticOperator', // Keep this to avoid breaking math
      'RegexMutator', // Keep this to avoid breaking regex
    ],
  },

  // Higher thresholds targeting 70%+
  thresholds: {
    high: 75,
    low: 65,
    break: 60,
  },

  // Enhanced reporting
  reporters: ['progress', 'clear-text', 'html', 'json'],

  // Timeouts
  timeoutMS: 25000,
  timeoutFactor: 2,

  // Reports configuration
  htmlReporter: {
    fileName: 'reports/mutation/enhanced-mutation.html',
  },

  jsonReporter: {
    fileName: 'reports/mutation/enhanced-mutation-report.json',
  },

  // Concurrency for performance
  concurrency: 3,

  // Essential plugins only
  plugins: ['@stryker-mutator/jest-runner'],

  // Ignore patterns instead of files
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    'coverage/**',
    '.stryker-tmp/**',
    'reports/**',
  ],

  // Logging
  logLevel: 'info',
  fileLogLevel: 'debug',

  // Clear temp directory
  cleanTempDir: true,
};
