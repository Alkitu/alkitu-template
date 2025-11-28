// @ts-nocheck
// 
import { JwtService } from '@nestjs/jwt';
import { createMockJwtPayload, createMockUserForTest } from './prisma.mock';

// JWT Service Mock
export const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue(createMockJwtPayload()),
  decode: jest.fn().mockReturnValue(createMockJwtPayload()),
};

export const JwtServiceMock = {
  provide: JwtService,
  useValue: mockJwtService,
};

// Password Service Mock
export const mockPasswordService = {
  hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
};

// Email Service Mock
export const mockEmailService = {
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
};

// Notification Service Mock
export const mockNotificationService = {
  createNotification: jest.fn().mockResolvedValue({
    id: 'test-notification-id',
    userId: 'test-user-id',
    message: 'Test notification',
    type: 'info',
    link: null,
    read: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getNotifications: jest.fn().mockResolvedValue([]),
  markAsRead: jest.fn().mockResolvedValue(true),
};

// User Repository Mock
export const mockUserRepository = {
  findById: jest.fn().mockResolvedValue(createMockUserForTest()),
  findByEmail: jest.fn().mockResolvedValue(createMockUserForTest()),
  create: jest.fn().mockResolvedValue(createMockUserForTest()),
  update: jest.fn().mockResolvedValue(createMockUserForTest()),
  delete: jest.fn().mockResolvedValue(createMockUserForTest()),
  findMany: jest.fn().mockResolvedValue([]),
  count: jest.fn().mockResolvedValue(0),
};

// Auth Guard Mock
export const mockAuthGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};

// Roles Guard Mock
export const mockRolesGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};

// Passport Strategy Mocks
export const mockLocalStrategy = {
  validate: jest.fn().mockResolvedValue(createMockUserForTest()),
};

export const mockJwtStrategy = {
  validate: jest.fn().mockResolvedValue(createMockUserForTest()),
};

// Request Mock with User
export const createMockRequest = (user = createMockUserForTest()) => ({
  user,
  body: {},
  params: {},
  query: {},
  headers: {},
});

// Response Mock
export const createMockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
});

// Reset all auth mocks
export const resetAuthMocks = () => {
  Object.values(mockJwtService).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  
  Object.values(mockPasswordService).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  
  Object.values(mockEmailService).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  
  Object.values(mockNotificationService).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  
  Object.values(mockUserRepository).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
};

// Mock providers array for easy testing module setup
export const AUTH_MOCK_PROVIDERS = [
  JwtServiceMock,
  {
    provide: 'EmailService',
    useValue: mockEmailService,
  },
  {
    provide: 'NotificationService',
    useValue: mockNotificationService,
  },
  {
    provide: 'UserRepository',
    useValue: mockUserRepository,
  },
  {
    provide: 'PasswordService',
    useValue: mockPasswordService,
  },
];