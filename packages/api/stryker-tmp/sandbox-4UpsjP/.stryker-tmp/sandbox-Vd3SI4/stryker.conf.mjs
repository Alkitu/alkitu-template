// @ts-nocheck
// 
export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  coverageAnalysis: 'off',

  // Solo mutar el archivo objetivo
  mutate: ['src/users/services/user-facade.service.ts'],

  // Jest simple
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.mjs',
  },

  // Umbrales más permisivos para empezar
  thresholds: {
    high: 80,
    low: 60,
    break: 40,
  },

  timeoutMS: 30000,
  concurrency: 2,
};
