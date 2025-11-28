// @ts-nocheck
// 
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  // Excluir tests problemáticos para Stryker
  testPathIgnorePatterns: [
    '/node_modules/',
    'user-facade.service.mutation.spec.ts',
    'user-facade.service.kill-mutants.spec.ts',
    'user-facade.service.comprehensive-fixed.spec.ts',
    'user-facade.service.100-percent.spec.ts',
    'user-facade.service.contract.spec.ts',
    'user-authentication.service.contract.spec.ts',
  ],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/test/**/*',
    '!src/trpc/**/*',
    '!src/schemas/**/*',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/test/(.*)$': '<rootDir>/test/$1',
  },
  testTimeout: 30000,
};
