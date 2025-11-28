// @ts-nocheck
// 
export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress', 'json', 'dashboard'],
  testRunner: 'jest',
  testRunnerNodeArgs: ['--max_old_space_size=4096'],
  coverageAnalysis: 'perTest',

  // Archivos a mutar - foco en lógica de negocio crítica
  mutate: ['src/users/services/user-facade.service.ts'],

  // Configuración Jest
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.mjs',
  },

  // Umbrales de calidad agresivos para 100% mutation score
  thresholds: {
    high: 95, // Meta: 95%+
    low: 85, // Mínimo: 85%
    break: 80, // Bloquear si < 80%
  },

  // Optimización de performance
  timeoutMS: 60000, // 60 segundos por test
  concurrency: 4, // 4 procesos paralelos

  // Configuración de mutaciones específicas
  mutator: {
    plugins: ['typescript'],
    excludedMutations: [
      'Console', // No mutar console.log
      'Regex', // No mutar regex complejas
    ],
  },

  // Configuración de reportes
  htmlReporter: {
    baseDir: 'reports/mutation',
  },

  // Dashboard configuration
  dashboard: {
    project: 'alkitu-template-api',
    version: '1.0.0',
  },

  // Configuración TypeScript
  tsconfigFile: 'tsconfig.test.json',

  // Archivos ignorados para mejor performance
  ignorers: ['dist', 'node_modules', 'coverage'],

  // Plugins
  plugins: [
    '@stryker-mutator/jest-runner',
    '@stryker-mutator/typescript-checker',
  ],
};
