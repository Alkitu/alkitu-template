// @ts-nocheck
// 
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
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
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    // SOLID Services - Higher standards
    './src/users/services/': {
      branches: 95,
      functions: 100,
      lines: 98,
      statements: 98,
    },
    './src/auth/services/': {
      branches: 95,
      functions: 100,
      lines: 98,
      statements: 98,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@alkitu/shared$': '<rootDir>/../shared/src',
  },
  // setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testTimeout: 10000,
  maxWorkers: '50%',
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  collectCoverage: true,
  forceExit: true,
  detectOpenHandles: true,
};
