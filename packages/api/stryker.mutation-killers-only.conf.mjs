// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress', 'json'],
  testRunner: 'jest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.mjs',
    enableFindRelatedTests: false,
  },
  tempDirName: 'stryker-tmp',
  cleanTempDir: true,
  concurrency: 2,
  coverageAnalysis: 'perTest',

  // Focus ONLY on UserFacadeService
  mutate: ['src/users/services/user-facade.service.ts'],

  // Use ONLY our mutation killer tests
  testPathPattern: '**/user-facade.service.mutation-killers.spec.ts',

  // Enhanced mutation types - enabling the previously excluded ones
  excludedMutations: [
    'ArithmeticOperator', // Keep excluded to avoid breaking Math operations
    'RegexMutator', // Keep excluded to avoid breaking regex patterns
  ],

  // Enhanced thresholds for precision
  thresholds: {
    high: 75,
    low: 65,
    break: 60,
  },

  // Enhanced timeouts for complex tests
  timeoutMS: 60000,
  timeoutFactor: 2,

  // Verbose logging for analysis
  logLevel: 'info',
  fileLogLevel: 'trace',

  // Enhanced reporting
  htmlReporter: {
    fileName: 'mutation-killers-report.html',
  },
  jsonReporter: {
    fileName: 'mutation-killers-report.json',
  },

  // Incremental mode for efficiency
  incrementalFile: '.stryker-incremental-mutation-killers.json',
};

export default config;
