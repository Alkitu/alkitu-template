import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotConfigService } from './chatbot-config.service';
import { PrismaService } from '@/prisma.service';
import { ChatbotConfig } from '@prisma/client';

describe('ChatbotConfigService - Comprehensive Business Logic Tests', () => {
  let service: ChatbotConfigService;
  let prismaService: jest.Mocked<PrismaService>;

  // Mock data based on actual Prisma schema
  const mockChatbotConfig: ChatbotConfig = {
    id: 'config-1',
    // Appearance
    primaryColor: '#007ee6',
    textColor: '#FFFFFF',
    backgroundColor: '#222222',
    borderRadius: 8,
    position: 'bottom-right',
    // Behavior
    autoOpen: false,
    autoOpenDelay: 5000,
    offlineMode: false,
    // Contact Form Fields
    requireEmail: true,
    requirePhone: false,
    requireName: true,
    requireCompany: false,
    allowAnonymous: false,
    // Messages
    welcomeMessage: 'Hi there! How can we help you today?',
    offlineMessage:
      "We are currently offline. Please leave a message and we'll get back to you.",
    thankYouMessage:
      "Thank you for your message! We'll get back to you shortly.",
    // Business Hours
    businessHoursEnabled: false,
    timezone: null,
    schedule: null,
    // Anti-spam
    rateLimitMessages: 5,
    rateLimitWindow: 60,
    blockSpamKeywords: [],
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const mockPrismaService = {
    chatbotConfig: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotConfigService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChatbotConfigService>(ChatbotConfigService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getChatbotConfig', () => {
    it('should return chatbot configuration when it exists', async () => {
      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );

      const result = await service.getChatbotConfig();

      expect(mockPrismaService.chatbotConfig.findFirst).toHaveBeenCalledWith();
      expect(result).toEqual(mockChatbotConfig);
    });

    it('should return null when no configuration exists', async () => {
      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(null);

      const result = await service.getChatbotConfig();

      expect(mockPrismaService.chatbotConfig.findFirst).toHaveBeenCalledWith();
      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      const databaseError = new Error('Database connection failed');
      mockPrismaService.chatbotConfig.findFirst.mockRejectedValue(
        databaseError,
      );

      await expect(service.getChatbotConfig()).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockPrismaService.chatbotConfig.findFirst).toHaveBeenCalledWith();
    });
  });

  describe('updateChatbotConfig', () => {
    describe('when configuration exists (update scenario)', () => {
      it('should update existing configuration with appearance changes', async () => {
        const updateData: Partial<ChatbotConfig> = {
          primaryColor: '#ff0000',
          textColor: '#000000',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          position: 'bottom-left',
        };

        const updatedConfig = { ...mockChatbotConfig, ...updateData };

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
          mockChatbotConfig,
        );
        mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

        const result = await service.updateChatbotConfig(updateData);

        expect(
          mockPrismaService.chatbotConfig.findFirst,
        ).toHaveBeenCalledWith();
        expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledWith({
          where: { id: mockChatbotConfig.id },
          data: updateData,
        });
        expect(result).toEqual(updatedConfig);
      });

      it('should update behavior settings', async () => {
        const updateData: Partial<ChatbotConfig> = {
          autoOpen: true,
          autoOpenDelay: 3000,
          offlineMode: true,
        };

        const updatedConfig = { ...mockChatbotConfig, ...updateData };

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
          mockChatbotConfig,
        );
        mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

        const result = await service.updateChatbotConfig(updateData);

        expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledWith({
          where: { id: mockChatbotConfig.id },
          data: updateData,
        });
        expect(result).toEqual(updatedConfig);
      });

      it('should update contact form requirements', async () => {
        const updateData: Partial<ChatbotConfig> = {
          requireEmail: false,
          requirePhone: true,
          requireName: false,
          requireCompany: true,
          allowAnonymous: true,
        };

        const updatedConfig = { ...mockChatbotConfig, ...updateData };

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
          mockChatbotConfig,
        );
        mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

        const result = await service.updateChatbotConfig(updateData);

        expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledWith({
          where: { id: mockChatbotConfig.id },
          data: updateData,
        });
        expect(result).toEqual(updatedConfig);
      });

      it('should update messages', async () => {
        const updateData: Partial<ChatbotConfig> = {
          welcomeMessage: 'Welcome to our new chatbot!',
          offlineMessage: 'We are currently away. Please leave a message.',
          thankYouMessage: 'Thanks for reaching out! We will respond soon.',
        };

        const updatedConfig = { ...mockChatbotConfig, ...updateData };

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
          mockChatbotConfig,
        );
        mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

        const result = await service.updateChatbotConfig(updateData);

        expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledWith({
          where: { id: mockChatbotConfig.id },
          data: updateData,
        });
        expect(result).toEqual(updatedConfig);
      });

      it('should update business hours settings', async () => {
        const updateData: Partial<ChatbotConfig> = {
          businessHoursEnabled: true,
          timezone: 'America/New_York',
          schedule: {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '17:00' },
            saturday: null,
            sunday: null,
          },
        };

        const updatedConfig = { ...mockChatbotConfig, ...updateData };

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
          mockChatbotConfig,
        );
        mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

        const result = await service.updateChatbotConfig(updateData);

        expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledWith({
          where: { id: mockChatbotConfig.id },
          data: updateData,
        });
        expect(result).toEqual(updatedConfig);
      });

      it('should update anti-spam settings', async () => {
        const updateData: Partial<ChatbotConfig> = {
          rateLimitMessages: 10,
          rateLimitWindow: 120,
          blockSpamKeywords: ['spam', 'promotion', 'buy now'],
        };

        const updatedConfig = { ...mockChatbotConfig, ...updateData };

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
          mockChatbotConfig,
        );
        mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

        const result = await service.updateChatbotConfig(updateData);

        expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledWith({
          where: { id: mockChatbotConfig.id },
          data: updateData,
        });
        expect(result).toEqual(updatedConfig);
      });

      it('should handle single field updates', async () => {
        const updateData: Partial<ChatbotConfig> = {
          primaryColor: '#00ff00',
        };

        const updatedConfig = { ...mockChatbotConfig, primaryColor: '#00ff00' };

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
          mockChatbotConfig,
        );
        mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

        const result = await service.updateChatbotConfig(updateData);

        expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledWith({
          where: { id: mockChatbotConfig.id },
          data: updateData,
        });
        expect(result).toEqual(updatedConfig);
      });
    });

    describe('when configuration does not exist (create scenario)', () => {
      it('should create new configuration with all settings', async () => {
        const createData: Partial<ChatbotConfig> = {
          primaryColor: '#0066cc',
          textColor: '#ffffff',
          backgroundColor: '#333333',
          borderRadius: 10,
          position: 'bottom-left',
          autoOpen: true,
          autoOpenDelay: 2000,
          offlineMode: false,
          requireEmail: true,
          requirePhone: false,
          requireName: true,
          requireCompany: false,
          allowAnonymous: false,
          welcomeMessage: 'Hello! Welcome to our support chat.',
          offlineMessage: 'We are offline. Please leave a message.',
          thankYouMessage: 'Thank you! We will respond shortly.',
          businessHoursEnabled: true,
          timezone: 'UTC',
          schedule: { enabled: true },
          rateLimitMessages: 3,
          rateLimitWindow: 30,
          blockSpamKeywords: ['spam'],
        };

        const createdConfig = { ...mockChatbotConfig, ...createData };

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(null);
        mockPrismaService.chatbotConfig.create.mockResolvedValue(createdConfig);

        const result = await service.updateChatbotConfig(createData);

        expect(
          mockPrismaService.chatbotConfig.findFirst,
        ).toHaveBeenCalledWith();
        expect(mockPrismaService.chatbotConfig.create).toHaveBeenCalledWith({
          data: createData,
        });
        expect(result).toEqual(createdConfig);
      });

      it('should create configuration with minimal data', async () => {
        const createData: Partial<ChatbotConfig> = {
          primaryColor: '#ff0000',
          welcomeMessage: 'Welcome!',
        };

        const createdConfig = { ...mockChatbotConfig, ...createData };

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(null);
        mockPrismaService.chatbotConfig.create.mockResolvedValue(createdConfig);

        const result = await service.updateChatbotConfig(createData);

        expect(mockPrismaService.chatbotConfig.create).toHaveBeenCalledWith({
          data: createData,
        });
        expect(result).toEqual(createdConfig);
      });

      it('should create configuration with empty data object', async () => {
        const createData: Partial<ChatbotConfig> = {};

        const createdConfig = mockChatbotConfig;

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(null);
        mockPrismaService.chatbotConfig.create.mockResolvedValue(createdConfig);

        const result = await service.updateChatbotConfig(createData);

        expect(mockPrismaService.chatbotConfig.create).toHaveBeenCalledWith({
          data: {},
        });
        expect(result).toEqual(createdConfig);
      });
    });

    describe('error handling', () => {
      it('should handle database errors during findFirst', async () => {
        const updateData: Partial<ChatbotConfig> = { primaryColor: '#ff0000' };
        const databaseError = new Error('Database connection failed');

        mockPrismaService.chatbotConfig.findFirst.mockRejectedValue(
          databaseError,
        );

        await expect(service.updateChatbotConfig(updateData)).rejects.toThrow(
          'Database connection failed',
        );
        expect(
          mockPrismaService.chatbotConfig.findFirst,
        ).toHaveBeenCalledWith();
        expect(mockPrismaService.chatbotConfig.update).not.toHaveBeenCalled();
        expect(mockPrismaService.chatbotConfig.create).not.toHaveBeenCalled();
      });

      it('should handle database errors during update', async () => {
        const updateData: Partial<ChatbotConfig> = { primaryColor: '#ff0000' };
        const databaseError = new Error('Update failed');

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
          mockChatbotConfig,
        );
        mockPrismaService.chatbotConfig.update.mockRejectedValue(databaseError);

        await expect(service.updateChatbotConfig(updateData)).rejects.toThrow(
          'Update failed',
        );
        expect(
          mockPrismaService.chatbotConfig.findFirst,
        ).toHaveBeenCalledWith();
        expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledWith({
          where: { id: mockChatbotConfig.id },
          data: updateData,
        });
      });

      it('should handle database errors during create', async () => {
        const createData: Partial<ChatbotConfig> = { primaryColor: '#ff0000' };
        const databaseError = new Error('Create failed');

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(null);
        mockPrismaService.chatbotConfig.create.mockRejectedValue(databaseError);

        await expect(service.updateChatbotConfig(createData)).rejects.toThrow(
          'Create failed',
        );
        expect(
          mockPrismaService.chatbotConfig.findFirst,
        ).toHaveBeenCalledWith();
        expect(mockPrismaService.chatbotConfig.create).toHaveBeenCalledWith({
          data: createData,
        });
      });

      it('should handle constraint violations', async () => {
        const updateData: Partial<ChatbotConfig> = { primaryColor: '#ff0000' };
        const constraintError = new Error('Unique constraint failed');

        mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
          mockChatbotConfig,
        );
        mockPrismaService.chatbotConfig.update.mockRejectedValue(
          constraintError,
        );

        await expect(service.updateChatbotConfig(updateData)).rejects.toThrow(
          'Unique constraint failed',
        );
      });
    });
  });

  describe('Business Logic Edge Cases', () => {
    it('should handle very large configuration objects', async () => {
      const largeUpdateData: Partial<ChatbotConfig> = {
        welcomeMessage: 'A'.repeat(1000),
        offlineMessage: 'B'.repeat(1000),
        thankYouMessage: 'C'.repeat(1000),
        schedule: {
          monday: {
            start: '09:00',
            end: '17:00',
            breaks: new Array(10).fill({ start: '12:00', end: '13:00' }),
          },
          tuesday: {
            start: '09:00',
            end: '17:00',
            breaks: new Array(10).fill({ start: '12:00', end: '13:00' }),
          },
          // ... more complex schedule
        },
        blockSpamKeywords: new Array(100).fill('spam'),
      };

      const updatedConfig = { ...mockChatbotConfig, ...largeUpdateData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

      const result = await service.updateChatbotConfig(largeUpdateData);

      expect(result).toEqual(updatedConfig);
    });

    it('should handle null and undefined values correctly', async () => {
      const updateData: Partial<ChatbotConfig> = {
        timezone: null,
        schedule: null,
        blockSpamKeywords: [],
      };

      const updatedConfig = { ...mockChatbotConfig, ...updateData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

      const result = await service.updateChatbotConfig(updateData);

      expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledWith({
        where: { id: mockChatbotConfig.id },
        data: updateData,
      });
      expect(result).toEqual(updatedConfig);
    });

    it('should handle special characters in configuration values', async () => {
      const updateData: Partial<ChatbotConfig> = {
        welcomeMessage: 'Hello! 👋 How can I help you today? 🚀',
        offlineMessage: 'We are offline 😴. Please leave a message 📝',
        thankYouMessage: 'Thank you! ✨ We will respond soon 🔜',
        blockSpamKeywords: ['🚫spam', 'émojis', 'spëcial-chars'],
      };

      const updatedConfig = { ...mockChatbotConfig, ...updateData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

      const result = await service.updateChatbotConfig(updateData);

      expect(result).toEqual(updatedConfig);
    });

    it('should handle concurrent updates correctly', async () => {
      const updateData1: Partial<ChatbotConfig> = { primaryColor: '#ff0000' };
      const updateData2: Partial<ChatbotConfig> = { primaryColor: '#00ff00' };

      const updatedConfig1 = { ...mockChatbotConfig, primaryColor: '#ff0000' };
      const updatedConfig2 = { ...mockChatbotConfig, primaryColor: '#00ff00' };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update
        .mockResolvedValueOnce(updatedConfig1)
        .mockResolvedValueOnce(updatedConfig2);

      const [result1, result2] = await Promise.all([
        service.updateChatbotConfig(updateData1),
        service.updateChatbotConfig(updateData2),
      ]);

      expect(result1).toEqual(updatedConfig1);
      expect(result2).toEqual(updatedConfig2);
      expect(mockPrismaService.chatbotConfig.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('Configuration Validation Edge Cases', () => {
    it('should handle extreme numeric values', async () => {
      const updateData: Partial<ChatbotConfig> = {
        borderRadius: 0,
        autoOpenDelay: 0,
        rateLimitMessages: 0,
        rateLimitWindow: 0,
      };

      const updatedConfig = { ...mockChatbotConfig, ...updateData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

      const result = await service.updateChatbotConfig(updateData);

      expect(result).toEqual(updatedConfig);
    });

    it('should handle maximum numeric values', async () => {
      const updateData: Partial<ChatbotConfig> = {
        borderRadius: 999,
        autoOpenDelay: 999999,
        rateLimitMessages: 999,
        rateLimitWindow: 999999,
      };

      const updatedConfig = { ...mockChatbotConfig, ...updateData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

      const result = await service.updateChatbotConfig(updateData);

      expect(result).toEqual(updatedConfig);
    });

    it('should handle empty strings and arrays', async () => {
      const updateData: Partial<ChatbotConfig> = {
        primaryColor: '',
        textColor: '',
        backgroundColor: '',
        position: '',
        welcomeMessage: '',
        offlineMessage: '',
        thankYouMessage: '',
        timezone: '',
        blockSpamKeywords: [],
      };

      const updatedConfig = { ...mockChatbotConfig, ...updateData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

      const result = await service.updateChatbotConfig(updateData);

      expect(result).toEqual(updatedConfig);
    });
  });

  describe('Real-World Use Cases', () => {
    it('should handle chatbot activation scenario', async () => {
      const activationData: Partial<ChatbotConfig> = {
        autoOpen: true,
        autoOpenDelay: 3000,
        welcomeMessage: 'Welcome! Our chatbot is now active and ready to help.',
        offlineMode: false,
      };

      const activatedConfig = { ...mockChatbotConfig, ...activationData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue({
        ...mockChatbotConfig,
        autoOpen: false,
        offlineMode: true,
      });
      mockPrismaService.chatbotConfig.update.mockResolvedValue(activatedConfig);

      const result = await service.updateChatbotConfig(activationData);

      expect(result.autoOpen).toBe(true);
      expect(result.offlineMode).toBe(false);
      expect(result.welcomeMessage).toBe(
        'Welcome! Our chatbot is now active and ready to help.',
      );
    });

    it('should handle chatbot deactivation scenario', async () => {
      const deactivationData: Partial<ChatbotConfig> = {
        autoOpen: false,
        offlineMode: true,
        offlineMessage:
          'Sorry, our chatbot is currently offline for maintenance.',
      };

      const deactivatedConfig = { ...mockChatbotConfig, ...deactivationData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(
        deactivatedConfig,
      );

      const result = await service.updateChatbotConfig(deactivationData);

      expect(result.autoOpen).toBe(false);
      expect(result.offlineMode).toBe(true);
      expect(result.offlineMessage).toBe(
        'Sorry, our chatbot is currently offline for maintenance.',
      );
    });

    it('should handle theme customization scenario', async () => {
      const themeData: Partial<ChatbotConfig> = {
        primaryColor: '#6c5ce7',
        textColor: '#ffffff',
        backgroundColor: '#2d3436',
        borderRadius: 15,
        position: 'bottom-left',
      };

      const themedConfig = { ...mockChatbotConfig, ...themeData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(themedConfig);

      const result = await service.updateChatbotConfig(themeData);

      expect(result.primaryColor).toBe('#6c5ce7');
      expect(result.textColor).toBe('#ffffff');
      expect(result.backgroundColor).toBe('#2d3436');
      expect(result.borderRadius).toBe(15);
      expect(result.position).toBe('bottom-left');
    });

    it('should handle business hours setup scenario', async () => {
      const businessHoursData: Partial<ChatbotConfig> = {
        businessHoursEnabled: true,
        timezone: 'America/New_York',
        schedule: {
          monday: { start: '09:00', end: '17:00', enabled: true },
          tuesday: { start: '09:00', end: '17:00', enabled: true },
          wednesday: { start: '09:00', end: '17:00', enabled: true },
          thursday: { start: '09:00', end: '17:00', enabled: true },
          friday: { start: '09:00', end: '17:00', enabled: true },
          saturday: { enabled: false },
          sunday: { enabled: false },
        },
      };

      const updatedConfig = { ...mockChatbotConfig, ...businessHoursData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

      const result = await service.updateChatbotConfig(businessHoursData);

      expect(result.businessHoursEnabled).toBe(true);
      expect(result.timezone).toBe('America/New_York');
      expect(result.schedule).toBeDefined();
    });

    it('should handle anti-spam configuration scenario', async () => {
      const antiSpamData: Partial<ChatbotConfig> = {
        rateLimitMessages: 3,
        rateLimitWindow: 60,
        blockSpamKeywords: [
          'spam',
          'promotion',
          'buy now',
          'click here',
          'free money',
        ],
      };

      const updatedConfig = { ...mockChatbotConfig, ...antiSpamData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(
        mockChatbotConfig,
      );
      mockPrismaService.chatbotConfig.update.mockResolvedValue(updatedConfig);

      const result = await service.updateChatbotConfig(antiSpamData);

      expect(result.rateLimitMessages).toBe(3);
      expect(result.rateLimitWindow).toBe(60);
      expect(result.blockSpamKeywords).toEqual([
        'spam',
        'promotion',
        'buy now',
        'click here',
        'free money',
      ]);
    });

    it('should handle first-time setup scenario', async () => {
      const setupData: Partial<ChatbotConfig> = {
        primaryColor: '#007ee6',
        textColor: '#ffffff',
        backgroundColor: '#222222',
        borderRadius: 8,
        position: 'bottom-right',
        autoOpen: false,
        autoOpenDelay: 5000,
        offlineMode: false,
        requireEmail: true,
        requirePhone: false,
        requireName: true,
        requireCompany: false,
        allowAnonymous: false,
        welcomeMessage:
          'Welcome to our support chat! How can we help you today?',
        offlineMessage:
          'We are currently offline. Please leave a message and we will get back to you.',
        thankYouMessage:
          'Thank you for your message! We will respond as soon as possible.',
        businessHoursEnabled: false,
        rateLimitMessages: 5,
        rateLimitWindow: 60,
        blockSpamKeywords: [],
      };

      const createdConfig = { ...mockChatbotConfig, ...setupData };

      mockPrismaService.chatbotConfig.findFirst.mockResolvedValue(null);
      mockPrismaService.chatbotConfig.create.mockResolvedValue(createdConfig);

      const result = await service.updateChatbotConfig(setupData);

      expect(mockPrismaService.chatbotConfig.create).toHaveBeenCalledWith({
        data: setupData,
      });
      expect(result.primaryColor).toBe('#007ee6');
      expect(result.welcomeMessage).toBe(
        'Welcome to our support chat! How can we help you today?',
      );
      expect(result.autoOpen).toBe(false);
    });
  });
});
