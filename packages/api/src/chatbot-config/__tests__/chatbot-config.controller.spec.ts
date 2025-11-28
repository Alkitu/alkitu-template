import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotConfigController } from '../chatbot-config.controller';
import { ChatbotConfigService } from '../chatbot-config.service';
import { UpdateChatbotConfigDto } from '../dto/update-chatbot-config.dto';

describe('ChatbotConfigController', () => {
  let controller: ChatbotConfigController;
  let chatbotConfigService: ChatbotConfigService;

  const mockChatbotConfigService = {
    getChatbotConfig: jest.fn(),
    updateChatbotConfig: jest.fn(),
  };

  const mockConfig = {
    id: '60d5ecb74f3b2c001c8b4567',
    primaryColor: '#007ee6',
    textColor: '#FFFFFF',
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
    welcomeMessage: 'Hi there! How can we help you today?',
    offlineMessage: "We are currently offline. Please leave a message and we'll get back to you.",
    thankYouMessage: "Thank you for your message! We'll get back to you shortly.",
    businessHoursEnabled: false,
    timezone: 'UTC',
    schedule: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: null,
      sunday: null,
    },
    rateLimitMessages: 5,
    rateLimitWindow: 60,
    blockSpamKeywords: [],
    createdAt: new Date('2024-06-29T12:00:00.000Z'),
    updatedAt: new Date('2024-06-29T12:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotConfigController],
      providers: [
        {
          provide: ChatbotConfigService,
          useValue: mockChatbotConfigService,
        },
      ],
    }).compile();

    controller = module.get<ChatbotConfigController>(ChatbotConfigController);
    chatbotConfigService = module.get<ChatbotConfigService>(ChatbotConfigService);

    jest.clearAllMocks();
  });

  describe('getChatbotConfig', () => {
    it('should return chatbot configuration', async () => {
      mockChatbotConfigService.getChatbotConfig.mockResolvedValue(mockConfig);

      const result = await controller.getChatbotConfig();

      expect(mockChatbotConfigService.getChatbotConfig).toHaveBeenCalled();
      expect(result).toEqual(mockConfig);
    });

    it('should handle when configuration is not found', async () => {
      mockChatbotConfigService.getChatbotConfig.mockResolvedValue(null);

      const result = await controller.getChatbotConfig();

      expect(mockChatbotConfigService.getChatbotConfig).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('createChatbotConfig', () => {
    it('should create initial chatbot configuration', async () => {
      const configDto: UpdateChatbotConfigDto = {
        primaryColor: '#1976d2',
        welcomeMessage: 'Welcome to our chat!',
        autoOpen: true,
      };

      const createdConfig = {
        ...mockConfig,
        ...configDto,
      };

      mockChatbotConfigService.updateChatbotConfig.mockResolvedValue(createdConfig);

      const result = await controller.createChatbotConfig(configDto);

      expect(mockChatbotConfigService.updateChatbotConfig).toHaveBeenCalledWith(configDto);
      expect(result).toEqual(createdConfig);
    });
  });

  describe('updateChatbotConfig', () => {
    it('should update existing chatbot configuration', async () => {
      const configDto: UpdateChatbotConfigDto = {
        primaryColor: '#2196f3',
        welcomeMessage: 'Updated welcome message',
        borderRadius: 12,
      };

      const updatedConfig = {
        ...mockConfig,
        ...configDto,
        updatedAt: new Date('2024-06-29T12:30:00.000Z'),
      };

      mockChatbotConfigService.updateChatbotConfig.mockResolvedValue(updatedConfig);

      const result = await controller.updateChatbotConfig(configDto);

      expect(mockChatbotConfigService.updateChatbotConfig).toHaveBeenCalledWith(configDto);
      expect(result).toEqual(updatedConfig);
    });

    it('should handle partial updates', async () => {
      const configDto: UpdateChatbotConfigDto = {
        autoOpen: true,
      };

      const updatedConfig = {
        ...mockConfig,
        autoOpen: true,
      };

      mockChatbotConfigService.updateChatbotConfig.mockResolvedValue(updatedConfig);

      const result = await controller.updateChatbotConfig(configDto);

      expect(mockChatbotConfigService.updateChatbotConfig).toHaveBeenCalledWith(configDto);
      expect(result).toEqual(updatedConfig);
    });
  });

  describe('resetChatbotConfig', () => {
    it('should reset chatbot configuration to defaults', async () => {
      const defaultConfig = {
        primaryColor: '#007ee6',
        textColor: '#FFFFFF',
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
        welcomeMessage: 'Hi there! How can we help you today?',
        offlineMessage: "We are currently offline. Please leave a message and we'll get back to you.",
        thankYouMessage: "Thank you for your message! We'll get back to you shortly.",
        businessHoursEnabled: false,
        timezone: 'UTC',
        schedule: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' },
          saturday: null,
          sunday: null,
        },
        rateLimitMessages: 5,
        rateLimitWindow: 60,
        blockSpamKeywords: [],
      };

      const resetConfig = {
        ...mockConfig,
        ...defaultConfig,
        updatedAt: new Date('2024-06-29T12:45:00.000Z'),
      };

      mockChatbotConfigService.updateChatbotConfig.mockResolvedValue(resetConfig);

      const result = await controller.resetChatbotConfig();

      expect(mockChatbotConfigService.updateChatbotConfig).toHaveBeenCalledWith(defaultConfig);
      expect(result).toEqual(resetConfig);
    });
  });

  describe('getPreviewConfig', () => {
    it('should return preview configuration with only public-safe data', async () => {
      mockChatbotConfigService.getChatbotConfig.mockResolvedValue(mockConfig);

      const result = await controller.getPreviewConfig();

      expect(mockChatbotConfigService.getChatbotConfig).toHaveBeenCalled();
      expect(result).toEqual({
        welcomeMessage: mockConfig.welcomeMessage,
        primaryColor: mockConfig.primaryColor,
        textColor: mockConfig.textColor,
        backgroundColor: mockConfig.backgroundColor,
        borderRadius: mockConfig.borderRadius,
        position: mockConfig.position,
        autoOpen: mockConfig.autoOpen,
        autoOpenDelay: mockConfig.autoOpenDelay,
        offlineMode: mockConfig.offlineMode,
        offlineMessage: mockConfig.offlineMessage,
        thankYouMessage: mockConfig.thankYouMessage,
        requireEmail: mockConfig.requireEmail,
        requirePhone: mockConfig.requirePhone,
        requireName: mockConfig.requireName,
        requireCompany: mockConfig.requireCompany,
        allowAnonymous: mockConfig.allowAnonymous,
      });
    });

    it('should return null when configuration is not found', async () => {
      mockChatbotConfigService.getChatbotConfig.mockResolvedValue(null);

      const result = await controller.getPreviewConfig();

      expect(mockChatbotConfigService.getChatbotConfig).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should exclude sensitive configuration data from preview', async () => {
      const configWithSensitiveData = {
        ...mockConfig,
        apiKey: 'sensitive-api-key',
        secretToken: 'secret-token',
      };

      mockChatbotConfigService.getChatbotConfig.mockResolvedValue(configWithSensitiveData);

      const result = await controller.getPreviewConfig();

      expect(result).not.toHaveProperty('apiKey');
      expect(result).not.toHaveProperty('secretToken');
      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('updatedAt');
    });
  });
});