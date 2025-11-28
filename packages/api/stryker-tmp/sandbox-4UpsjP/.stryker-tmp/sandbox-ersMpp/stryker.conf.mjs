// @ts-nocheck
// 
export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  coverageAnalysis: 'off',

  // Mutation testing completo en archivos con tests 100% funcionales
  mutate: [
    'src/email/email.controller.ts',
    'src/auth/token.service.ts',
    'src/auth/guards/roles.guard.ts',
    'src/users/services/user-facade.service.ts',
  ],

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
