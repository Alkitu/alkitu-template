// @ts-nocheck
// Centralized mock exports for easy importing

// Prisma mocks
export * from './prisma.mock';

// Authentication mocks
export { 
  mockJwtService, 
  mockEmailService, 
  mockNotificationService,
  mockUserRepository as mockAuthUserRepository,
  mockAuthGuard,
  mockRolesGuard,
  mockLocalStrategy,
  mockJwtStrategy,
  createMockRequest,
  createMockResponse,
  resetAuthMocks,
  AUTH_MOCK_PROVIDERS,
  JwtServiceMock
} from './auth.mock';

// Service mocks
export * from './services.mock';

// Combined reset function
export const resetAllMocks = () => {
  // Import functions inside to avoid circular dependencies
  const { resetPrismaMocks } = require('./prisma.mock');
  const { resetAuthMocks } = require('./auth.mock');
  const { resetServiceMocks } = require('./services.mock');
  
  resetPrismaMocks();
  resetAuthMocks();
  resetServiceMocks();
};

// Combined providers for testing modules
export const getAllMockProviders = () => {
  const { PRISMA_TESTING_PROVIDERS } = require('./prisma.mock');
  const { AUTH_MOCK_PROVIDERS } = require('./auth.mock');
  const { SERVICE_MOCK_PROVIDERS } = require('./services.mock');
  
  return [
    ...PRISMA_TESTING_PROVIDERS,
    ...AUTH_MOCK_PROVIDERS,
    ...SERVICE_MOCK_PROVIDERS,
  ];
};

// Helper to get specific mock providers
export const getMockProvidersFor = (services: string[]) => {
  const allProviders = getAllMockProviders();
  return allProviders.filter(provider => 
    services.includes(provider.provide) || 
    services.includes(provider.provide.name)
  );
};

// Test utilities
export const createTestingModuleWithMocks = async (
  providers: any[] = [],
  mockServices: string[] = []
) => {
  const { Test } = await import('@nestjs/testing');
  
  const selectedMocks = mockServices.length > 0 
    ? getMockProvidersFor(mockServices)
    : getAllMockProviders();
  
  return Test.createTestingModule({
    providers: [
      ...providers,
      ...selectedMocks,
    ],
  });
};