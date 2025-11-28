// Mock implementations for services with 0% coverage

// Email Service Mocks
export const mockEmailChannelRegistry = {
  registerChannel: jest.fn().mockReturnValue(true),
  getChannel: jest.fn().mockReturnValue(null),
  getAllChannels: jest.fn().mockReturnValue([]),
  removeChannel: jest.fn().mockReturnValue(true),
};

export const mockEmailChannel = {
  send: jest.fn().mockResolvedValue(true),
  isSupported: jest.fn().mockReturnValue(true),
  getName: jest.fn().mockReturnValue('test-channel'),
};

// Health Service Mocks
export const mockHealthService = {
  check: jest.fn().mockResolvedValue({
    status: 'ok',
    info: {
      database: { status: 'up' },
      redis: { status: 'up' },
    },
    error: {},
    details: {
      database: { status: 'up' },
      redis: { status: 'up' },
    },
  }),
  getHealth: jest.fn().mockResolvedValue({ status: 'healthy' }),
};

// User Analytics Service Mocks
export const mockUserAnalyticsService = {
  trackUserActivity: jest.fn().mockResolvedValue(true),
  getUserStats: jest.fn().mockResolvedValue({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
  }),
  getActivityReport: jest.fn().mockResolvedValue([]),
};

// User Events Service Mocks
export const mockUserEventsService = {
  emitUserCreated: jest.fn().mockResolvedValue(true),
  emitUserUpdated: jest.fn().mockResolvedValue(true),
  emitUserDeleted: jest.fn().mockResolvedValue(true),
  emitUserLoggedIn: jest.fn().mockResolvedValue(true),
  emitUserLoggedOut: jest.fn().mockResolvedValue(true),
};

// User Management Service Mocks
export const mockUserManagementService = {
  createUser: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  }),
  updateUser: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Updated User',
  }),
  deleteUser: jest.fn().mockResolvedValue(true),
  getUserById: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  }),
  getAllUsers: jest.fn().mockResolvedValue([]),
};

// User Authentication Service Mocks
export const mockUserAuthenticationService = {
  validateUser: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  }),
  login: jest.fn().mockResolvedValue({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  }),
  logout: jest.fn().mockResolvedValue(true),
  refreshToken: jest.fn().mockResolvedValue({
    accessToken: 'new-access-token',
  }),
  changePassword: jest.fn().mockResolvedValue(true),
  resetPassword: jest.fn().mockResolvedValue(true),
};

// Chat Service Mocks
export const mockChatService = {
  createConversation: jest.fn().mockResolvedValue({
    id: 'test-conversation-id',
    contactInfoId: 'test-contact-info-id',
    status: 'OPEN',
  }),
  sendMessage: jest.fn().mockResolvedValue({
    id: 'test-message-id',
    content: 'Test message',
    conversationId: 'test-conversation-id',
  }),
  getMessages: jest.fn().mockResolvedValue([]),
  getConversations: jest.fn().mockResolvedValue([]),
  updateConversationStatus: jest.fn().mockResolvedValue(true),
};

// Chatbot Config Service Mocks
export const mockChatbotConfigService = {
  getConfig: jest.fn().mockResolvedValue({
    id: 'test-config-id',
    primaryColor: '#007ee6',
    welcomeMessage: 'Hello! How can I help you?',
  }),
  updateConfig: jest.fn().mockResolvedValue({
    id: 'test-config-id',
    primaryColor: '#007ee6',
    welcomeMessage: 'Hello! How can I help you?',
  }),
  createConfig: jest.fn().mockResolvedValue({
    id: 'test-config-id',
    primaryColor: '#007ee6',
    welcomeMessage: 'Hello! How can I help you?',
  }),
};

// Billing Service Mocks
export const mockBillingService = {
  createBilling: jest.fn().mockResolvedValue({
    id: 'test-billing-id',
    userId: 'test-user-id',
    plan: 'premium',
    amount: 99.99,
    status: 'active',
  }),
  updateBilling: jest.fn().mockResolvedValue({
    id: 'test-billing-id',
    status: 'cancelled',
  }),
  getBillingByUserId: jest.fn().mockResolvedValue([]),
  cancelBilling: jest.fn().mockResolvedValue(true),
};

// WebSocket Gateway Mocks
export const mockWebSocketGateway = {
  sendNotificationToUser: jest.fn().mockResolvedValue(true),
  sendMessageToRoom: jest.fn().mockResolvedValue(true),
  broadcastMessage: jest.fn().mockResolvedValue(true),
  handleConnection: jest.fn().mockReturnValue(true),
  handleDisconnect: jest.fn().mockReturnValue(true),
};

// Contact Info Service Mocks
export const mockContactInfoService = {
  createContactInfo: jest.fn().mockResolvedValue({
    id: 'test-contact-id',
    email: 'contact@example.com',
    name: 'Test Contact',
  }),
  updateContactInfo: jest.fn().mockResolvedValue({
    id: 'test-contact-id',
    email: 'updated@example.com',
  }),
  getContactById: jest.fn().mockResolvedValue({
    id: 'test-contact-id',
    email: 'contact@example.com',
  }),
  getAllContacts: jest.fn().mockResolvedValue([]),
};

// Reset all service mocks
export const resetServiceMocks = () => {
  const allMocks = [
    mockEmailChannelRegistry,
    mockEmailChannel,
    mockHealthService,
    mockUserAnalyticsService,
    mockUserEventsService,
    mockUserManagementService,
    mockUserAuthenticationService,
    mockChatService,
    mockChatbotConfigService,
    mockBillingService,
    mockWebSocketGateway,
    mockContactInfoService,
  ];

  allMocks.forEach((mockService) => {
    Object.values(mockService).forEach((mock) => {
      if (jest.isMockFunction(mock)) {
        mock.mockClear();
      }
    });
  });
};

// Export providers for easy testing module setup
export const SERVICE_MOCK_PROVIDERS = [
  {
    provide: 'EmailChannelRegistry',
    useValue: mockEmailChannelRegistry,
  },
  {
    provide: 'HealthService',
    useValue: mockHealthService,
  },
  {
    provide: 'UserAnalyticsService',
    useValue: mockUserAnalyticsService,
  },
  {
    provide: 'UserEventsService',
    useValue: mockUserEventsService,
  },
  {
    provide: 'UserManagementService',
    useValue: mockUserManagementService,
  },
  {
    provide: 'UserAuthenticationService',
    useValue: mockUserAuthenticationService,
  },
  {
    provide: 'ChatService',
    useValue: mockChatService,
  },
  {
    provide: 'ChatbotConfigService',
    useValue: mockChatbotConfigService,
  },
  {
    provide: 'BillingService',
    useValue: mockBillingService,
  },
  {
    provide: 'WebSocketGateway',
    useValue: mockWebSocketGateway,
  },
  {
    provide: 'ContactInfoService',
    useValue: mockContactInfoService,
  },
];