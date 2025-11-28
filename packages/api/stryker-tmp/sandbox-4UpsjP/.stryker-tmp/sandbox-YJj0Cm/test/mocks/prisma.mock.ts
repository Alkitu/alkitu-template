// @ts-nocheck
// 
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
  mockPrisma.user.findMany.mockResolvedValue([]);
  mockPrisma.user.findUnique.mockResolvedValue(null);
  mockPrisma.user.findFirst.mockResolvedValue(null);
  mockPrisma.user.create.mockResolvedValue(mockUserRepository.create());
  mockPrisma.user.update.mockResolvedValue(mockUserRepository.update());
  mockPrisma.user.delete.mockResolvedValue(mockUserRepository.delete());
  mockPrisma.user.count.mockResolvedValue(0);
  mockPrisma.user.findUniqueOrThrow.mockResolvedValue(mockUserRepository.findUnique());
  mockPrisma.user.findFirstOrThrow.mockResolvedValue(mockUserRepository.findFirst());
  mockPrisma.user.updateMany.mockResolvedValue({ count: 0 });
  mockPrisma.user.deleteMany.mockResolvedValue({ count: 0 });
  mockPrisma.user.createMany.mockResolvedValue({ count: 0 });
  mockPrisma.user.upsert.mockResolvedValue(mockUserRepository.upsert());

  mockPrisma.notification.findMany.mockResolvedValue([]);
  mockPrisma.notification.findUnique.mockResolvedValue(null);
  mockPrisma.notification.findFirst.mockResolvedValue(null);
  mockPrisma.notification.create.mockResolvedValue(
    mockNotificationRepository.create()
  );
  mockPrisma.notification.update.mockResolvedValue(
    mockNotificationRepository.update()
  );
  mockPrisma.notification.delete.mockResolvedValue(
    mockNotificationRepository.delete()
  );
  mockPrisma.notification.count.mockResolvedValue(0);
  mockPrisma.notification.updateMany.mockResolvedValue({ count: 0 });
  mockPrisma.notification.deleteMany.mockResolvedValue({ count: 0 });
  mockPrisma.notification.upsert.mockResolvedValue(mockNotificationRepository.upsert());
  mockPrisma.notification.groupBy.mockResolvedValue([]);

  mockPrisma.conversation.findMany.mockResolvedValue([]);
  mockPrisma.conversation.findUnique.mockResolvedValue(null);
  mockPrisma.conversation.findFirst.mockResolvedValue(null);
  mockPrisma.conversation.create.mockResolvedValue(
    mockConversationRepository.create()
  );
  mockPrisma.conversation.update.mockResolvedValue(
    mockConversationRepository.update()
  );
  mockPrisma.conversation.delete.mockResolvedValue(
    mockConversationRepository.delete()
  );
  mockPrisma.conversation.count.mockResolvedValue(0);
  mockPrisma.conversation.updateMany.mockResolvedValue({ count: 0 });
  mockPrisma.conversation.deleteMany.mockResolvedValue({ count: 0 });
  mockPrisma.conversation.upsert.mockResolvedValue(mockConversationRepository.upsert());

  mockPrisma.chatMessage.findMany.mockResolvedValue([]);
  mockPrisma.chatMessage.findUnique.mockResolvedValue(null);
  mockPrisma.chatMessage.findFirst.mockResolvedValue(null);
  mockPrisma.chatMessage.create.mockResolvedValue(
    mockChatMessageRepository.create()
  );
  mockPrisma.chatMessage.update.mockResolvedValue(
    mockChatMessageRepository.update()
  );
  mockPrisma.chatMessage.delete.mockResolvedValue(
    mockChatMessageRepository.delete()
  );
  mockPrisma.chatMessage.count.mockResolvedValue(0);
  mockPrisma.chatMessage.updateMany.mockResolvedValue({ count: 0 });
  mockPrisma.chatMessage.deleteMany.mockResolvedValue({ count: 0 });
  mockPrisma.chatMessage.upsert.mockResolvedValue(mockChatMessageRepository.upsert());

  mockPrisma.chatbotConfig.findMany.mockResolvedValue([]);
  mockPrisma.chatbotConfig.findUnique.mockResolvedValue(null);
  mockPrisma.chatbotConfig.findFirst.mockResolvedValue(null);
  mockPrisma.chatbotConfig.create.mockResolvedValue(
    mockChatbotConfigRepository.create()
  );
  mockPrisma.chatbotConfig.update.mockResolvedValue(
    mockChatbotConfigRepository.update()
  );
  mockPrisma.chatbotConfig.delete.mockResolvedValue(
    mockChatbotConfigRepository.delete()
  );
  mockPrisma.chatbotConfig.count.mockResolvedValue(0);
  mockPrisma.chatbotConfig.updateMany.mockResolvedValue({ count: 0 });
  mockPrisma.chatbotConfig.deleteMany.mockResolvedValue({ count: 0 });
  mockPrisma.chatbotConfig.upsert.mockResolvedValue(mockChatbotConfigRepository.upsert());

  mockPrisma.$transaction.mockImplementation(mockTransaction);
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
          return createMockUserForTest({ id: args.where.id || 'test-user-id' });
        }
        return null;
      });
      
      mockPrisma.user.update.mockImplementation(async (args) => {
        return createMockUserForTest({ 
          id: args.where.id, 
          ...args.data 
        });
      });
      
      mockPrisma.user.delete.mockImplementation(async (args) => {
        return createMockUserForTest({ id: args.where.id });
      });
      break;
      
    case 'NotificationService':
      mockPrisma.notification.findUnique.mockImplementation(async (args) => {
        if (args.where.id === 'test-notification-id') {
          return createMockNotificationForTest({ id: args.where.id });
        }
        return null;
      });
      
      mockPrisma.notification.update.mockImplementation(async (args) => {
        return createMockNotificationForTest({ 
          id: args.where.id, 
          ...args.data 
        });
      });
      break;
      
    case 'AuthService':
      mockPrisma.user.findUnique.mockImplementation(async (args) => {
        if (args.where.email === 'test@example.com') {
          return createMockUserForTest({ email: args.where.email });
        }
        return null;
      });
      
      mockPrisma.user.create.mockImplementation(async (args) => {
        return createMockUserForTest({ ...args.data });
      });
      break;
      
    default:
      setupPrismaMocks();
  }
};

// Initialize mocks
setupPrismaMocks();
