// @ts-nocheck
// 
// ✅ ENHANCED STRYKER CONFIG: Enable excluded mutations and improve coverage
// packages/api/stryker.enhanced.conf.mjs

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: 'npm',
  testRunner: 'jest',
  testFramework: 'jest',
  coverageAnalysis: 'perTest',

  // Enhanced Jest configuration
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
    enableFindRelatedTests: true,
  },

  // Target specific modules for better mutation coverage
  mutate: [
    'src/users/services/**/*.ts',
    'src/email/channels/**/*.ts',
    'src/plugins/**/*.ts',
    'src/websocket/**/*.ts',
    'src/notification/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/test/**',
    '!src/**/__tests__/**',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],

  // ENABLE PREVIOUSLY EXCLUDED MUTATIONS
  mutator: {
    // Include string literal mutations
    excludedMutations: [
      // Remove these exclusions to enable more mutations:
      // 'StringLiteral',      // NOW ENABLED
      // 'ConditionalExpression', // NOW ENABLED

      // Keep only truly problematic mutations excluded:
      'ArithmeticOperator', // Keep this to avoid breaking math operations
      'ArrayDeclaration', // Keep this to avoid breaking array structures
      'RegexMutator', // Keep this to avoid breaking regex patterns
    ],
  },

  // Improved thresholds targeting 70%+ mutation score
  thresholds: {
    high: 80,
    low: 70,
    break: 65, // Fail build if below 65%
  },

  // Enhanced reporting
  reporters: ['progress', 'clear-text', 'html', 'json', 'dashboard'],

  // Optimized timeouts for comprehensive testing
  timeoutMS: 30000,
  timeoutFactor: 3,

  // Enhanced HTML report configuration
  htmlReporter: {
    fileName: 'reports/mutation/enhanced-mutation.html',
    baseDir: 'reports/mutation',
  },

  // JSON report for CI/CD analysis
  jsonReporter: {
    fileName: 'reports/mutation/enhanced-mutation-report.json',
  },

  // Dashboard configuration for trend tracking
  dashboard: {
    reportType: 'full',
    baseUrl: 'https://dashboard.stryker-mutator.io',
    project: 'github.com/alkitu/backend-api',
    version: 'enhanced-mutation-testing',
  },

  // Concurrency configuration for faster execution
  concurrency: 4,
  maxConcurrentTestRunners: 8,

  // Enhanced plugins
  plugins: [
    '@stryker-mutator/jest-runner',
    '@stryker-mutator/typescript-checker',
  ],

  // TypeScript configuration
  tsconfigFile: 'tsconfig.json',
  typescriptChecker: {
    enable: true,
    prioritizePerformanceOverAccuracy: false,
  },

  // Improved ignoring patterns
  ignorers: ['node_modules/**', 'dist/**', 'coverage/**', '.stryker-tmp/**'],

  // Enhanced file patterns for better coverage
  files: [
    'src/**/*.ts',
    'src/**/*.js',
    'src/**/*.json',
    'test/**/*.ts',
    'jest.config.js',
    'tsconfig.json',
    'package.json',
  ],

  // Logging configuration
  logLevel: 'info',
  fileLogLevel: 'trace',
  appendLogToFile: true,

  // Build command to ensure fresh state
  buildCommand: 'npm run build',

  // Clear stryker temp before running
  cleanTempDir: true,

  // Enhanced test selection
  testFilter: [
    // Focus on our new comprehensive tests
    '**/*edge-cases*.spec.ts',
    '**/*integration-mutants*.spec.ts',
    '**/*string-conditional-mutants*.spec.ts',
    // Include existing tests
    '**/*.spec.ts',
    '**/*.test.ts',
  ],

  // Disable cache to ensure fresh mutation testing
  disableTypeChecks: false,
  allowConsoleColors: true,

  // Advanced configuration for better mutation targeting
  incremental: false, // Disable incremental mode for comprehensive testing

  // Custom environment variables for testing
  commandRunner: {
    command: 'npm test',
  },
};
