/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { EmailChannelRegistryService } from './email-channel-registry.service';
import { IEmailChannel } from '../channels/email-channel.interface';
import { EmailResult } from '../types/email.types';

describe('EmailChannelRegistryService', () => {
  let service: EmailChannelRegistryService;
  let mockChannel1: jest.Mocked<IEmailChannel>;
  let mockChannel2: jest.Mocked<IEmailChannel>;
  let mockChannel3: jest.Mocked<IEmailChannel>;

  beforeEach(async () => {
    // Create mock channels
    mockChannel1 = {
      type: 'welcome',
      send: jest.fn(),
      supports: jest.fn(),
      validateData: jest.fn(),
    };

    mockChannel2 = {
      type: 'password-reset',
      send: jest.fn(),
      supports: jest.fn(),
      validateData: jest.fn(),
    };

    mockChannel3 = {
      type: 'notification',
      send: jest.fn(),
      supports: jest.fn(),
      validateData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailChannelRegistryService],
    }).compile();

    service = module.get<EmailChannelRegistryService>(
      EmailChannelRegistryService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with empty channels map', () => {
      expect(service.getSupportedTypes()).toEqual([]);
    });
  });

  describe('registerChannel', () => {
    it('should register a new channel successfully', () => {
      mockChannel1.supports.mockReturnValue(true);

      service.registerChannel(mockChannel1);

      expect(service.getSupportedTypes()).toContain('welcome');
      expect(service.getChannel('welcome')).toBe(mockChannel1);
    });

    it('should register multiple channels', () => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel2.supports.mockReturnValue(true);

      service.registerChannel(mockChannel1);
      service.registerChannel(mockChannel2);

      expect(service.getSupportedTypes()).toContain('welcome');
      expect(service.getSupportedTypes()).toContain('password-reset');
      expect(service.getSupportedTypes()).toHaveLength(2);
    });

    it('should overwrite existing channel with same type', () => {
      const mockChannel1Updated = {
        type: 'welcome',
        send: jest.fn(),
        supports: jest.fn().mockReturnValue(true),
        validateData: jest.fn(),
      };

      mockChannel1.supports.mockReturnValue(true);
      mockChannel1Updated.supports.mockReturnValue(true);

      service.registerChannel(mockChannel1);
      service.registerChannel(mockChannel1Updated);

      expect(service.getChannel('welcome')).toBe(mockChannel1Updated);
      expect(service.getSupportedTypes()).toHaveLength(1);
    });
  });

  describe('getChannel', () => {
    beforeEach(() => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel2.supports.mockReturnValue(true);
      service.registerChannel(mockChannel1);
      service.registerChannel(mockChannel2);
    });

    it('should return existing channel', () => {
      expect(service.getChannel('welcome')).toBe(mockChannel1);
      expect(service.getChannel('password-reset')).toBe(mockChannel2);
    });

    it('should return undefined for non-existent channel', () => {
      expect(service.getChannel('non-existent')).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(service.getChannel('')).toBeUndefined();
    });
  });

  describe('getSupportedTypes', () => {
    it('should return empty array when no channels registered', () => {
      expect(service.getSupportedTypes()).toEqual([]);
    });

    it('should return all registered channel types', () => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel2.supports.mockReturnValue(true);
      mockChannel3.supports.mockReturnValue(true);

      service.registerChannel(mockChannel1);
      service.registerChannel(mockChannel2);
      service.registerChannel(mockChannel3);

      const supportedTypes = service.getSupportedTypes();
      expect(supportedTypes).toContain('welcome');
      expect(supportedTypes).toContain('password-reset');
      expect(supportedTypes).toContain('notification');
      expect(supportedTypes).toHaveLength(3);
    });
  });

  describe('isTypeSupported', () => {
    beforeEach(() => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel2.supports.mockReturnValue(true);
      service.registerChannel(mockChannel1);
      service.registerChannel(mockChannel2);
    });

    it('should return true for supported type', () => {
      expect(service.isTypeSupported('welcome')).toBe(true);
      expect(service.isTypeSupported('password-reset')).toBe(true);
    });

    it('should return false for unsupported type', () => {
      expect(service.isTypeSupported('unsupported')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(service.isTypeSupported('')).toBe(false);
    });
  });

  describe('unregisterChannel', () => {
    beforeEach(() => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel2.supports.mockReturnValue(true);
      service.registerChannel(mockChannel1);
      service.registerChannel(mockChannel2);
    });

    it('should remove existing channel and return true', () => {
      const result = service.unregisterChannel('welcome');

      expect(result).toBe(true);
      expect(service.getChannel('welcome')).toBeUndefined();
      expect(service.getSupportedTypes()).not.toContain('welcome');
      expect(service.getSupportedTypes()).toContain('password-reset');
    });

    it('should return false for non-existent channel', () => {
      const result = service.unregisterChannel('non-existent');

      expect(result).toBe(false);
      expect(service.getSupportedTypes()).toHaveLength(2);
    });

    it('should be idempotent', () => {
      const result1 = service.unregisterChannel('welcome');
      const result2 = service.unregisterChannel('welcome');

      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });
  });

  describe('getAllChannels', () => {
    it('should return empty array when no channels registered', () => {
      expect(service.getAllChannels()).toEqual([]);
    });

    it('should return all registered channels', () => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel2.supports.mockReturnValue(true);

      service.registerChannel(mockChannel1);
      service.registerChannel(mockChannel2);

      const channels = service.getAllChannels();
      expect(channels).toHaveLength(2);
      expect(channels).toContain(mockChannel1);
      expect(channels).toContain(mockChannel2);
    });
  });

  describe('getRegistryStats', () => {
    it('should return stats for empty registry', () => {
      const stats = service.getRegistryStats();

      expect(stats).toEqual({
        totalChannels: 0,
        supportedTypes: [],
        channelDetails: [],
      });
    });

    it('should return stats for populated registry', () => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel2.supports.mockReturnValue(true);

      service.registerChannel(mockChannel1);
      service.registerChannel(mockChannel2);

      const stats = service.getRegistryStats();

      expect(stats.totalChannels).toBe(2);
      expect(stats.supportedTypes).toContain('welcome');
      expect(stats.supportedTypes).toContain('password-reset');
      expect(
        stats.channelDetails.find((c) => c.type === 'welcome'),
      ).toBeDefined();
      expect(
        stats.channelDetails.find((c) => c.type === 'password-reset'),
      ).toBeDefined();
    });
  });

  describe('sendEmail', () => {
    const mockEmailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      content: 'Test Content',
    };

    beforeEach(() => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel2.supports.mockReturnValue(true);
      service.registerChannel(mockChannel1);
      service.registerChannel(mockChannel2);
    });

    it('should send email successfully using appropriate channel', async () => {
      const expectedResult: EmailResult = {
        success: true,
        messageId: 'test-message-id',
      };

      mockChannel1.validateData.mockReturnValue({ isValid: true, errors: [] });
      mockChannel1.send.mockResolvedValue(expectedResult);

      const result = await service.sendEmail('welcome', mockEmailData);

      expect(mockChannel1.validateData).toHaveBeenCalledWith(mockEmailData);
      expect(mockChannel1.send).toHaveBeenCalledWith(mockEmailData);
      expect(result).toEqual(expectedResult);
    });

    it('should return error for unsupported email type', async () => {
      const result = await service.sendEmail('unsupported', mockEmailData);

      expect(result.success).toBe(false);
      expect(result.error).toContain(
        "Email type 'unsupported' is not supported",
      );
      expect(result.error).toContain(
        'Supported types: welcome, password-reset',
      );
    });

    it('should return error for invalid data', async () => {
      const validationErrors = ['Email is required', 'Subject is required'];
      mockChannel1.validateData.mockReturnValue({
        isValid: false,
        errors: validationErrors,
      });

      const result = await service.sendEmail('welcome', mockEmailData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid data for email type 'welcome'");
      expect(result.error).toContain('Email is required, Subject is required');
      expect(mockChannel1.send).not.toHaveBeenCalled();
    });

    it('should handle channel send failures', async () => {
      const failureResult: EmailResult = {
        success: false,
        error: 'SMTP server error',
      };

      mockChannel1.validateData.mockReturnValue({ isValid: true, errors: [] });
      mockChannel1.send.mockResolvedValue(failureResult);

      const result = await service.sendEmail('welcome', mockEmailData);

      expect(result).toEqual(failureResult);
    });

    it('should handle channel send exceptions', async () => {
      const error = new Error('Network timeout');

      mockChannel1.validateData.mockReturnValue({ isValid: true, errors: [] });
      mockChannel1.send.mockRejectedValue(error);

      const result = await service.sendEmail('welcome', mockEmailData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network timeout');
    });

    it('should handle unknown exceptions', async () => {
      mockChannel1.validateData.mockReturnValue({ isValid: true, errors: [] });
      mockChannel1.send.mockRejectedValue('Unknown error');

      const result = await service.sendEmail('welcome', mockEmailData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    it('should log successful email sending', async () => {
      const expectedResult: EmailResult = {
        success: true,
        messageId: 'test-message-id',
      };

      mockChannel1.validateData.mockReturnValue({ isValid: true, errors: [] });
      mockChannel1.send.mockResolvedValue(expectedResult);

      const logSpy = jest.spyOn(service['logger'], 'log');

      await service.sendEmail('welcome', mockEmailData);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Sending 'welcome' email using"),
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "Email 'welcome' sent successfully with messageId: test-message-id",
        ),
      );
    });

    it('should log failed email sending', async () => {
      const failureResult: EmailResult = {
        success: false,
        error: 'SMTP error',
      };

      mockChannel1.validateData.mockReturnValue({ isValid: true, errors: [] });
      mockChannel1.send.mockResolvedValue(failureResult);

      const logSpy = jest.spyOn(service['logger'], 'error');

      await service.sendEmail('welcome', mockEmailData);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to send 'welcome' email: SMTP error"),
      );
    });
  });

  describe('onModuleInit', () => {
    it('should complete initialization without error', async () => {
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });

    it('should not affect existing channels', async () => {
      mockChannel1.supports.mockReturnValue(true);
      service.registerChannel(mockChannel1);

      await service.onModuleInit();

      expect(service.getSupportedTypes()).toContain('welcome');
      expect(service.getChannel('welcome')).toBe(mockChannel1);
    });
  });

  describe('edge cases', () => {
    it('should handle null channel registration gracefully', () => {
      expect(() => service.registerChannel(null as any)).toThrow();
    });

    it('should handle undefined channel registration gracefully', () => {
      expect(() => service.registerChannel(undefined as any)).toThrow();
    });

    it('should handle channel with empty type', () => {
      const emptyTypeChannel = {
        type: '',
        send: jest.fn(),
        supports: jest.fn().mockReturnValue(true),
        validateData: jest.fn(),
      };

      service.registerChannel(emptyTypeChannel);
      expect(service.getSupportedTypes()).toContain('');
    });

    it('should handle sendEmail with null data', async () => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel1.validateData.mockReturnValue({
        isValid: false,
        errors: ['Data is null'],
      });
      service.registerChannel(mockChannel1);

      const result = await service.sendEmail('welcome', null);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid data for email type 'welcome'");
    });

    it('should handle sendEmail with undefined data', async () => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel1.validateData.mockReturnValue({
        isValid: false,
        errors: ['Data is undefined'],
      });
      service.registerChannel(mockChannel1);

      const result = await service.sendEmail('welcome', undefined);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid data for email type 'welcome'");
    });

    it('should handle channel that does not support the registered type', () => {
      // Create a channel that claims to be of type 'welcome' but doesn't actually support it
      const incorrectChannel = {
        type: 'welcome',
        send: jest.fn(),
        supports: jest.fn().mockReturnValue(false), // This channel doesn't support its own type
        validateData: jest.fn(),
      };

      service.registerChannel(incorrectChannel);

      const errorSpy = jest.spyOn(service['logger'], 'error');
      const result = service.getChannel('welcome');

      expect(result).toBeUndefined();
      expect(errorSpy).toHaveBeenCalledWith(
        "Channel 'welcome' is registered for 'welcome' but doesn't support it",
      );
    });
  });

  describe('concurrent operations', () => {
    it('should handle concurrent channel registrations', () => {
      const channels = Array.from({ length: 10 }, (_, i) => ({
        type: `channel-${i}`,
        send: jest.fn(),
        supports: jest.fn().mockReturnValue(true),
        validateData: jest.fn(),
      }));

      channels.forEach((channel) => service.registerChannel(channel));

      expect(service.getSupportedTypes()).toHaveLength(10);
      channels.forEach((channel) => {
        expect(service.getChannel(channel.type)).toBe(channel);
      });
    });

    it('should handle concurrent sendEmail operations', async () => {
      mockChannel1.supports.mockReturnValue(true);
      mockChannel1.validateData.mockReturnValue({ isValid: true, errors: [] });
      mockChannel1.send.mockResolvedValue({
        success: true,
        messageId: 'test-id',
      });

      service.registerChannel(mockChannel1);

      const emailData = {
        to: 'test@example.com',
        subject: 'Test',
        content: 'Test',
      };
      const promises = Array.from({ length: 5 }, () =>
        service.sendEmail('welcome', emailData),
      );

      const results = await Promise.all(promises);

      results.forEach((result) => {
        expect(result.success).toBe(true);
        expect(result.messageId).toBe('test-id');
      });
    });
  });
});
