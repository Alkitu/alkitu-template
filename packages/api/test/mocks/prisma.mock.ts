import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

// Create a deep mock of PrismaClient
export const mockPrisma = mockDeep<PrismaClient>();

// Type for the mocked Prisma client
export type MockPrisma = DeepMockProxy<PrismaClient>;

// Reset function to clear all mocks between tests
export const resetPrismaMocks = () => {
  mockReset(mockPrisma);
};

// Export commonly used aliases for backward compatibility
export const resetAllMocks = resetPrismaMocks;

// Common mock implementations
export const createMockPrismaService = () => {
  const service = {
    user: mockPrisma.user,
    notification: mockPrisma.notification,
    conversation: mockPrisma.conversation,
    chatMessage: mockPrisma.chatMessage,
    contactInfo: mockPrisma.contactInfo,
    chatbotConfig: mockPrisma.chatbotConfig,
    billing: mockPrisma.billing,
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(),
    $executeRaw: jest.fn(),
    $queryRaw: jest.fn(),
  };

  return service;
};

// Database transaction mock
export const mockTransaction = jest
  .fn()
  .mockImplementation(async (callback) => {
    return await callback(mockPrisma);
  });

// Common Prisma method mocks
export const createMockRepository = <T>(defaultValue: T) => {
  return {
    findMany: jest.fn().mockResolvedValue([defaultValue]),
    findUnique: jest.fn().mockResolvedValue(defaultValue),
    findFirst: jest.fn().mockResolvedValue(defaultValue),
    findUniqueOrThrow: jest.fn().mockResolvedValue(defaultValue),
    findFirstOrThrow: jest.fn().mockResolvedValue(defaultValue),
    create: jest.fn().mockResolvedValue(defaultValue),
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
    update: jest.fn().mockResolvedValue(defaultValue),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    upsert: jest.fn().mockResolvedValue(defaultValue),
    delete: jest.fn().mockResolvedValue(defaultValue),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    count: jest.fn().mockResolvedValue(1),
    aggregate: jest.fn().mockResolvedValue({}),
    groupBy: jest.fn().mockResolvedValue([]),
  };
};

// User repository mock
export const mockUserRepository = createMockRepository({
  id: "test-user-id",
  email: "test@example.com",
  name: "Test",
  lastName: "User",
  role: "USER",
  status: "ACTIVE",
  emailVerified: new Date(),
  contactNumber: "+1234567890",
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Notification repository mock
export const mockNotificationRepository = createMockRepository({
  id: "test-notification-id",
  userId: "test-user-id",
  type: "info",
  message: "Test message",
  link: null,
  read: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Chat message repository mock
export const mockChatMessageRepository = createMockRepository({
  id: "test-message-id",
  conversationId: "test-conversation-id",
  content: "Test message",
  isFromVisitor: true,
  senderUserId: null,
  isRead: false,
  metadata: null,
  createdAt: new Date(),
});

// Conversation repository mock
export const mockConversationRepository = createMockRepository({
  id: "test-conversation-id",
  contactInfoId: "test-contact-info-id",
  assignedToId: "test-user-id",
  status: "OPEN",
  priority: "NORMAL",
  source: "website",
  tags: [],
  internalNotes: null,
  lastMessageAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Chatbot config repository mock
export const mockChatbotConfigRepository = createMockRepository({
  id: "test-config-id",
  primaryColor: "#007ee6",
  textColor: "#FFFFFF",
  backgroundColor: "#222222",
  borderRadius: 8,
  position: "bottom-right",
  autoOpen: false,
  autoOpenDelay: 5000,
  offlineMode: false,
  requireEmail: true,
  requirePhone: false,
  requireName: true,
  requireCompany: false,
  allowAnonymous: false,
  welcomeMessage: "Hi there! How can we help you today?",
  offlineMessage: "We are currently offline. Please leave a message and we'll get back to you.",
  thankYouMessage: "Thank you for your message! We'll get back to you shortly.",
  businessHoursEnabled: false,
  timezone: null,
  schedule: null,
  rateLimitMessages: 5,
  rateLimitWindow: 60,
  blockSpamKeywords: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Setup default mocks for Prisma client
export const setupPrismaMocks = () => {
  (mockPrisma.user.findMany as any).mockResolvedValue([]);
  (mockPrisma.user.findUnique as any).mockResolvedValue(null);
  (mockPrisma.user.findFirst as any).mockResolvedValue(null);
  (mockPrisma.user.create as any).mockResolvedValue(mockUserRepository.create());
  (mockPrisma.user.update as any).mockResolvedValue(mockUserRepository.update());
  (mockPrisma.user.delete as any).mockResolvedValue(mockUserRepository.delete());
  (mockPrisma.user.count as any).mockResolvedValue(0);
  (mockPrisma.user.findUniqueOrThrow as any).mockResolvedValue(mockUserRepository.findUnique());
  (mockPrisma.user.findFirstOrThrow as any).mockResolvedValue(mockUserRepository.findFirst());
  (mockPrisma.user.updateMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.user.deleteMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.user.createMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.user.upsert as any).mockResolvedValue(mockUserRepository.upsert());

  (mockPrisma.notification.findMany as any).mockResolvedValue([]);
  (mockPrisma.notification.findUnique as any).mockResolvedValue(null);
  (mockPrisma.notification.findFirst as any).mockResolvedValue(null);
  (mockPrisma.notification.create as any).mockResolvedValue(
    mockNotificationRepository.create()
  );
  (mockPrisma.notification.update as any).mockResolvedValue(
    mockNotificationRepository.update()
  );
  (mockPrisma.notification.delete as any).mockResolvedValue(
    mockNotificationRepository.delete()
  );
  (mockPrisma.notification.count as any).mockResolvedValue(0);
  (mockPrisma.notification.updateMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.notification.deleteMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.notification.upsert as any).mockResolvedValue(mockNotificationRepository.upsert());
  (mockPrisma.notification.groupBy as any).mockResolvedValue([]);

  (mockPrisma.conversation.findMany as any).mockResolvedValue([]);
  (mockPrisma.conversation.findUnique as any).mockResolvedValue(null);
  (mockPrisma.conversation.findFirst as any).mockResolvedValue(null);
  (mockPrisma.conversation.create as any).mockResolvedValue(
    mockConversationRepository.create()
  );
  (mockPrisma.conversation.update as any).mockResolvedValue(
    mockConversationRepository.update()
  );
  (mockPrisma.conversation.delete as any).mockResolvedValue(
    mockConversationRepository.delete()
  );
  (mockPrisma.conversation.count as any).mockResolvedValue(0);
  (mockPrisma.conversation.updateMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.conversation.deleteMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.conversation.upsert as any).mockResolvedValue(mockConversationRepository.upsert());

  (mockPrisma.chatMessage.findMany as any).mockResolvedValue([]);
  (mockPrisma.chatMessage.findUnique as any).mockResolvedValue(null);
  (mockPrisma.chatMessage.findFirst as any).mockResolvedValue(null);
  (mockPrisma.chatMessage.create as any).mockResolvedValue(
    mockChatMessageRepository.create()
  );
  (mockPrisma.chatMessage.update as any).mockResolvedValue(
    mockChatMessageRepository.update()
  );
  (mockPrisma.chatMessage.delete as any).mockResolvedValue(
    mockChatMessageRepository.delete()
  );
  (mockPrisma.chatMessage.count as any).mockResolvedValue(0);
  (mockPrisma.chatMessage.updateMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.chatMessage.deleteMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.chatMessage.upsert as any).mockResolvedValue(mockChatMessageRepository.upsert());

  (mockPrisma.chatbotConfig.findMany as any).mockResolvedValue([]);
  (mockPrisma.chatbotConfig.findUnique as any).mockResolvedValue(null);
  (mockPrisma.chatbotConfig.findFirst as any).mockResolvedValue(null);
  (mockPrisma.chatbotConfig.create as any).mockResolvedValue(
    mockChatbotConfigRepository.create()
  );
  (mockPrisma.chatbotConfig.update as any).mockResolvedValue(
    mockChatbotConfigRepository.update()
  );
  (mockPrisma.chatbotConfig.delete as any).mockResolvedValue(
    mockChatbotConfigRepository.delete()
  );
  (mockPrisma.chatbotConfig.count as any).mockResolvedValue(0);
  (mockPrisma.chatbotConfig.updateMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.chatbotConfig.deleteMany as any).mockResolvedValue({ count: 0 });
  (mockPrisma.chatbotConfig.upsert as any).mockResolvedValue(mockChatbotConfigRepository.upsert());

  (mockPrisma.$transaction as any).mockImplementation(mockTransaction);
};

// Export default mock instance
export default mockPrisma;

// Provider mock for NestJS testing
export const PrismaServiceMock = {
  provide: "PrismaService",
  useValue: mockPrisma,
};

// Testing module providers array
export const PRISMA_TESTING_PROVIDERS = [
  {
    provide: "PrismaService",
    useValue: mockPrisma,
  },
];

// Helper function to create isolated mock for specific tests
export const createIsolatedPrismaMock = () => {
  const isolatedMock = mockDeep<PrismaClient>();
  setupPrismaMocks();
  return isolatedMock;
};

// Common test database operations
export const mockDatabaseOperations = {
  // User operations
  createUser: jest.fn().mockResolvedValue(mockUserRepository.create()),
  findUserById: jest.fn().mockResolvedValue(mockUserRepository.findUnique()),
  findUserByEmail: jest.fn().mockResolvedValue(mockUserRepository.findUnique()),
  updateUser: jest.fn().mockResolvedValue(mockUserRepository.update()),
  deleteUser: jest.fn().mockResolvedValue(mockUserRepository.delete()),

  // Notification operations
  createNotification: jest
    .fn()
    .mockResolvedValue(mockNotificationRepository.create()),
  findNotificationById: jest
    .fn()
    .mockResolvedValue(mockNotificationRepository.findUnique()),
  updateNotification: jest
    .fn()
    .mockResolvedValue(mockNotificationRepository.update()),
  deleteNotification: jest
    .fn()
    .mockResolvedValue(mockNotificationRepository.delete()),

  // Chat operations
  createConversation: jest
    .fn()
    .mockResolvedValue(mockConversationRepository.create()),
  createChatMessage: jest
    .fn()
    .mockResolvedValue(mockChatMessageRepository.create()),
  findConversationById: jest
    .fn()
    .mockResolvedValue(mockConversationRepository.findUnique()),
  findChatMessageById: jest
    .fn()
    .mockResolvedValue(mockChatMessageRepository.findUnique()),
};

// Advanced mock helpers for specific test scenarios
export const createMockUserForTest = (overrides = {}) => ({
  id: "test-user-id",
  name: "Test",
  lastName: "User",
  email: "test@example.com",
  emailVerified: new Date(),
  image: null,
  password: "$2b$10$hashedpassword",
  contactNumber: null,
  role: "CLIENT",
  status: "ACTIVE",
  terms: true,
  isTwoFactorEnabled: false,
  groupIds: [],
  tagIds: [],
  resourceIds: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: null,
  ...overrides,
});

export const createMockNotificationForTest = (overrides = {}) => ({
  id: "test-notification-id",
  userId: "test-user-id",
  type: "info",
  message: "Test message",
  link: null,
  read: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Mock factory for JWT payload
export const createMockJwtPayload = (overrides = {}) => ({
  sub: "test-user-id",
  email: "test@example.com",
  role: "CLIENT",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
  ...overrides,
});

// Mock factory for authentication
export const createMockAuthResult = (overrides = {}) => ({
  user: createMockUserForTest(),
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  ...overrides,
});

// Enhanced mock setup for specific services
export const setupMocksForService = (serviceName: string) => {
  resetPrismaMocks();
  
  switch (serviceName) {
    case 'UserRepository':
      // Configure mocks for user repository service
      mockPrisma.user.findUnique.mockImplementation(async (args) => {
        if (args.where.id === '1' || args.where.email === 'test@example.com') {
          return createMockUserForTest({ id: args.where.id || 'test-user-id' }) as any;
        }
        return null;
      });
      
      mockPrisma.user.update.mockImplementation(async (args) => {
        return createMockUserForTest({ 
          id: args.where.id, 
          ...args.data 
        }) as any;
      });
      
      mockPrisma.user.delete.mockImplementation(async (args) => {
        return createMockUserForTest({ id: args.where.id }) as any;
      });
      break;
      
    case 'NotificationService':
      mockPrisma.notification.findUnique.mockImplementation(async (args) => {
        if (args.where.id === 'test-notification-id') {
          return createMockNotificationForTest({ id: args.where.id }) as any;
        }
        return null;
      });
      
      mockPrisma.notification.update.mockImplementation(async (args) => {
        return createMockNotificationForTest({ 
          id: args.where.id, 
          ...args.data 
        }) as any;
      });
      break;
      
    case 'AuthService':
      mockPrisma.user.findUnique.mockImplementation(async (args) => {
        if (args.where.email === 'test@example.com') {
          return createMockUserForTest({ email: args.where.email }) as any;
        }
        return null;
      });
      
      mockPrisma.user.create.mockImplementation(async (args) => {
        return createMockUserForTest({ ...args.data }) as any;
      });
      break;
      
    case 'TokenService':
      // Password reset token mocks
      mockPrisma.passwordResetToken.create.mockImplementation(async (args) => ({
        id: 'token-id',
        email: args.data.email,
        token: args.data.token,
        expires: args.data.expires,
      }) as any);
      
      mockPrisma.passwordResetToken.findUnique.mockImplementation(async (args) => {
        if (args.where.token === 'valid-token') {
          return {
            id: 'token-id',
            email: 'test@example.com',
            token: 'valid-token',
            expires: new Date(Date.now() + 3600000),
          } as any;
        }
        return null;
      });
      
      mockPrisma.passwordResetToken.delete.mockImplementation(async (args) => ({
        id: 'token-id',
        email: 'test@example.com',
        token: args.where.token,
        expires: new Date(),
      }) as any);
      
      // Verification token mocks
      mockPrisma.verificationToken.create.mockImplementation(async (args) => ({
        id: 'token-id',
        identifier: args.data.identifier,
        token: args.data.token,
        expires: args.data.expires,
      }) as any);
      
      mockPrisma.verificationToken.findUnique.mockImplementation(async (args) => {
        if (args.where.token === 'valid-token') {
          return {
            id: 'token-id',
            identifier: 'test@example.com',
            token: 'valid-token',
            expires: new Date(Date.now() + 3600000),
          } as any;
        }
        return null;
      });
      
      // Refresh token mocks
      mockPrisma.refreshToken.create.mockImplementation(async (args) => ({
        id: 'token-id',
        userId: args.data.userId,
        token: args.data.token,
        expires: args.data.expires,
        createdAt: new Date(),
      }) as any);
      
      mockPrisma.refreshToken.findUnique.mockImplementation(async (args) => {
        if (args.where.token === 'valid-token') {
          return {
            id: 'token-id',
            userId: 'test-user-id',
            token: 'valid-token',
            expires: new Date(Date.now() + 86400000),
            createdAt: new Date(),
          } as any;
        }
        return null;
      });
      break;
      
    default:
      setupPrismaMocks();
  }
};

// Initialize mocks
setupPrismaMocks();
