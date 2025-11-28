// 🚀 Optimized Stryker Configuration for Modular Mutation Testing
export default {
  packageManager: 'npm',
  reporters: ['clear-text', 'progress'], // Removed heavy HTML reporter
  testRunner: 'jest',
  coverageAnalysis: 'off',

  // 🎯 MODULAR APPROACH: Test one service at a time
  mutate: [
    'src/users/services/user-facade.service.ts', // Primary target
  ],

  // 🚀 PERFORMANCE OPTIMIZATIONS
  concurrency: 4,              // Increased from 2
  timeoutMS: 15000,            // Reduced from 30000

  // 📊 REALISTIC THRESHOLDS
  thresholds: {
    high: 75,    // Achievable excellence
    low: 60,     // Good enough
    break: 45,   // Minimum acceptable
  },

  // 🧪 JEST OPTIMIZATION
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.mjs',
  },

  // 🔄 INCREMENTAL TESTING
  incremental: true,
  incrementalFile: '.stryker-tmp/incremental.json'
};
