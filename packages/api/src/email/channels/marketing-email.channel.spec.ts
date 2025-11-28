import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { MarketingEmailChannel } from './marketing-email.channel';
import { EmailService } from '../email.service';
import { MarketingEmailData } from '../types/email.types';

describe('MarketingEmailChannel', () => {
  let channel: MarketingEmailChannel;
  let emailService: jest.Mocked<EmailService>;
  let loggerSpy: jest.SpyInstance;

  const mockEmailService = {
    sendNotification: jest.fn(),
    testConfiguration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketingEmailChannel,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    channel = module.get<MarketingEmailChannel>(MarketingEmailChannel);
    emailService = module.get<EmailService>(
      EmailService,
    ) as jest.Mocked<EmailService>;

    // Spy on logger
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    loggerSpy.mockRestore();
  });

  describe('Constructor and Properties', () => {
    it('should be defined', () => {
      expect(channel).toBeDefined();
    });

    it('should have correct type property', () => {
      expect(channel.type).toBe('marketing');
    });

    it('should have EmailService injected', () => {
      expect(emailService).toBeDefined();
    });
  });

  describe('supports method - Interface Segregation Principle', () => {
    it('should return true for "marketing" type', () => {
      expect(channel.supports('marketing')).toBe(true);
    });

    it('should return false for other types', () => {
      expect(channel.supports('welcome')).toBe(false);
      expect(channel.supports('reset')).toBe(false);
      expect(channel.supports('verification')).toBe(false);
      expect(channel.supports('notification')).toBe(false);
      expect(channel.supports('')).toBe(false);
    });
  });

  describe('validateData method - Single Responsibility Principle', () => {
    const validData: MarketingEmailData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      supportUrl: 'https://example.com/support',
      campaignName: 'Summer Sale 2024',
      contentHtml:
        '<h1>Welcome to our Summer Sale!</h1><p>Great deals await you.</p>',
      unsubscribeUrl: 'https://example.com/unsubscribe',
      trackingPixelUrl: 'https://example.com/tracking',
    };

    it('should validate correct data successfully', () => {
      const result = channel.validateData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate data without optional trackingPixelUrl', () => {
      const minimalData = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        supportUrl: 'https://example.com/support',
        campaignName: 'Summer Sale 2024',
        contentHtml:
          '<h1>Welcome to our Summer Sale!</h1><p>Great deals await you.</p>',
        unsubscribeUrl: 'https://example.com/unsubscribe',
      };
      const result = channel.validateData(minimalData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null/undefined data', () => {
      const result = channel.validateData(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email data is required');
    });

    it('should reject empty object', () => {
      const result = channel.validateData({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid marketing email data structure');
    });

    it('should validate userName field', () => {
      const invalidData = { ...validData, userName: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userName is required and must be a string',
      );
    });

    it('should validate userEmail field', () => {
      const invalidData = { ...validData, userEmail: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userEmail is required and must be a string',
      );
    });

    it('should validate email format', () => {
      const invalidData = { ...validData, userEmail: 'invalid-email' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userEmail must be a valid email address',
      );
    });

    it('should validate supportUrl field', () => {
      const invalidData = { ...validData, supportUrl: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'supportUrl is required and must be a string',
      );
    });

    it('should validate supportUrl format', () => {
      const invalidData = { ...validData, supportUrl: 'invalid-url' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('supportUrl must be a valid URL');
    });

    it('should validate campaignName field', () => {
      const invalidData = { ...validData, campaignName: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'campaignName is required and must be a string',
      );
    });

    it('should validate campaignName length', () => {
      const invalidData = { ...validData, campaignName: 'a'.repeat(101) };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'campaignName must be 100 characters or less',
      );
    });

    it('should validate contentHtml field', () => {
      const invalidData = { ...validData, contentHtml: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'contentHtml is required and must be a string',
      );
    });

    it('should validate contentHtml length', () => {
      const invalidData = { ...validData, contentHtml: 'a'.repeat(50001) };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'contentHtml must be 50000 characters or less',
      );
    });

    it('should validate contentHtml format', () => {
      const invalidData = {
        ...validData,
        contentHtml: '<div><p><span>Multiple unclosed tags',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('contentHtml must be valid HTML');
    });

    it('should validate unsubscribeUrl field', () => {
      const invalidData = { ...validData, unsubscribeUrl: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'unsubscribeUrl is required and must be a string',
      );
    });

    it('should validate unsubscribeUrl format', () => {
      const invalidData = { ...validData, unsubscribeUrl: 'invalid-url' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('unsubscribeUrl must be a valid URL');
    });

    it('should validate optional trackingPixelUrl field type', () => {
      const invalidData = { ...validData, trackingPixelUrl: 123 as any };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('trackingPixelUrl must be a valid URL');
    });

    it('should validate trackingPixelUrl format when provided', () => {
      const invalidData = { ...validData, trackingPixelUrl: 'invalid-url' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('trackingPixelUrl must be a valid URL');
    });

    it('should handle multiple validation errors', () => {
      const invalidData = {
        userName: null,
        userEmail: 'invalid-email',
        supportUrl: 'invalid-url',
        campaignName: 'a'.repeat(101),
        contentHtml: null,
        unsubscribeUrl: 'invalid-url',
        trackingPixelUrl: 'invalid-url',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(6);
    });

    it('should accept valid HTML content', () => {
      const validHtmlData = {
        ...validData,
        contentHtml: '<html><body><h1>Title</h1><p>Content</p></body></html>',
      };
      const result = channel.validateData(validHtmlData);
      expect(result.isValid).toBe(true);
    });

    it('should accept self-closing HTML tags', () => {
      const validHtmlData = {
        ...validData,
        contentHtml: '<div><img src="image.jpg" /><br /><hr /></div>',
      };
      const result = channel.validateData(validHtmlData);
      expect(result.isValid).toBe(true);
    });
  });

  describe('send method - Open/Closed Principle', () => {
    const validData: MarketingEmailData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      supportUrl: 'https://example.com/support',
      campaignName: 'Summer Sale 2024',
      contentHtml:
        '<h1>Welcome to our Summer Sale!</h1><p>Great deals await you.</p>',
      unsubscribeUrl: 'https://example.com/unsubscribe',
      trackingPixelUrl: 'https://example.com/tracking',
    };

    it('should send marketing email successfully', async () => {
      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      const result = await channel.send(validData);

      expect(result.success).toBe(true);
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        validData.userEmail,
        validData.userName,
        `Marketing: ${validData.campaignName}`,
        expect.any(String), // Converted HTML to text
        'View Campaign',
        expect.stringContaining('https://example.com/tracking'), // Enhanced tracking URL
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Sending marketing email to ${validData.userEmail} for campaign: ${validData.campaignName}`,
      );
    });

    it('should send marketing email without tracking pixel', async () => {
      const dataWithoutTracking = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        supportUrl: 'https://example.com/support',
        campaignName: 'Summer Sale 2024',
        contentHtml:
          '<h1>Welcome to our Summer Sale!</h1><p>Great deals await you.</p>',
        unsubscribeUrl: 'https://example.com/unsubscribe',
      };

      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      const result = await channel.send(dataWithoutTracking);

      expect(result.success).toBe(true);
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        dataWithoutTracking.userEmail,
        dataWithoutTracking.userName,
        `Marketing: ${dataWithoutTracking.campaignName}`,
        expect.any(String),
        'View Campaign',
        undefined, // No tracking URL
      );
    });

    it('should convert HTML to text correctly', async () => {
      const htmlData = {
        ...validData,
        contentHtml:
          '<h1>Title</h1><p>This is a <strong>test</strong> message with &amp; symbols.</p>',
      };

      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      await channel.send(htmlData);

      expect(emailService.sendNotification).toHaveBeenCalledWith(
        htmlData.userEmail,
        htmlData.userName,
        expect.any(String),
        'TitleThis is a test message with & symbols.',
        expect.any(String),
        expect.any(String),
      );
    });

    it('should handle email service failure', async () => {
      emailService.sendNotification.mockResolvedValue({
        success: false,
        error: 'Email service error',
      });

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(emailService.sendNotification).toHaveBeenCalled();
    });

    it('should handle email service exception', async () => {
      const error = new Error('Service unavailable');
      emailService.sendNotification.mockRejectedValue(error);

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Service unavailable');
    });

    it('should handle unknown error types', async () => {
      emailService.sendNotification.mockRejectedValue('String error');

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    it('should log success message', async () => {
      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      await channel.send(validData);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Marketing email for campaign '${validData.campaignName}' sent successfully to ${validData.userEmail}`,
      );
    });

    it('should log failure message', async () => {
      emailService.sendNotification.mockResolvedValue({
        success: false,
        error: 'Email service error',
      });

      await channel.send(validData);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Marketing email for campaign '${validData.campaignName}' failed to ${validData.userEmail}`,
      );
    });

    it('should enhance tracking URL with campaign data', async () => {
      const trackingData = {
        ...validData,
        trackingPixelUrl: 'https://analytics.example.com/pixel',
      };

      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      await channel.send(trackingData);

      const callArgs = emailService.sendNotification.mock.calls[0];
      const trackingUrl = callArgs[5]; // 6th parameter is the tracking URL

      expect(trackingUrl).toContain('https://analytics.example.com/pixel');
      expect(trackingUrl).toContain(
        `campaign=${encodeURIComponent(trackingData.campaignName)}`,
      );
      expect(trackingUrl).toContain(
        `email=${encodeURIComponent(trackingData.userEmail)}`,
      );
      expect(trackingUrl).toContain('timestamp=');
    });
  });

  describe('Dependency Inversion Principle', () => {
    it('should depend on EmailService abstraction', () => {
      expect(channel).toHaveProperty('emailService');
    });

    it('should not be tightly coupled to concrete implementations', () => {
      // The channel should work with any EmailService implementation
      expect(typeof channel['emailService'].sendNotification).toBe('function');
    });
  });

  describe('Liskov Substitution Principle', () => {
    it('should be substitutable for IEmailChannel', () => {
      // Should have all required interface methods
      expect(typeof channel.send).toBe('function');
      expect(typeof channel.supports).toBe('function');
      expect(typeof channel.validateData).toBe('function');
      expect(typeof channel.type).toBe('string');
    });

    it('should maintain interface contracts', async () => {
      const validData: MarketingEmailData = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        supportUrl: 'https://example.com/support',
        campaignName: 'Summer Sale 2024',
        contentHtml: '<h1>Welcome to our Summer Sale!</h1>',
        unsubscribeUrl: 'https://example.com/unsubscribe',
      };

      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      const result = await channel.send(validData);
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Error Handling and Resilience', () => {
    const validData: MarketingEmailData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      supportUrl: 'https://example.com/support',
      campaignName: 'Summer Sale 2024',
      contentHtml: '<h1>Welcome to our Summer Sale!</h1>',
      unsubscribeUrl: 'https://example.com/unsubscribe',
    };

    it('should handle network timeouts gracefully', async () => {
      emailService.sendNotification.mockRejectedValue(
        new Error('Network timeout'),
      );

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network timeout');
    });

    it('should handle malformed responses', async () => {
      emailService.sendNotification.mockResolvedValue(null as any);

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
    });

    it('should never throw unhandled exceptions', async () => {
      emailService.sendNotification.mockRejectedValue(
        new Error('Critical error'),
      );

      await expect(channel.send(validData)).resolves.not.toThrow();
    });
  });

  describe('Marketing-Specific Features', () => {
    const validData: MarketingEmailData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      supportUrl: 'https://example.com/support',
      campaignName: 'Summer Sale 2024',
      contentHtml:
        '<h1>Welcome to our Summer Sale!</h1><p>Great deals await you.</p>',
      unsubscribeUrl: 'https://example.com/unsubscribe',
      trackingPixelUrl: 'https://example.com/tracking',
    };

    it('should handle complex HTML content', async () => {
      const complexHtml = `
        <html>
          <body>
            <div class="header">
              <h1>Summer Sale 2024</h1>
              <img src="banner.jpg" alt="Sale Banner" />
            </div>
            <div class="content">
              <p>Don't miss out on our <strong>amazing deals</strong>!</p>
              <ul>
                <li>50% off electronics</li>
                <li>30% off clothing</li>
                <li>Free shipping on orders over $50</li>
              </ul>
              <a href="https://example.com/shop">Shop Now</a>
            </div>
          </body>
        </html>
      `;

      const complexData = { ...validData, contentHtml: complexHtml };

      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      const result = await channel.send(complexData);

      expect(result.success).toBe(true);

      // Verify HTML was converted to text
      const callArgs = emailService.sendNotification.mock.calls[0];
      const textContent = callArgs[3]; // 4th parameter is the text content

      expect(textContent).toContain('Summer Sale 2024');
      expect(textContent).toContain('amazing deals');
      expect(textContent).toContain('50% off electronics');
      expect(textContent).not.toContain('<html>');
      expect(textContent).not.toContain('<div>');
    });

    it('should handle HTML entities correctly', async () => {
      const htmlWithEntities =
        '<p>Price: $50 &amp; up | Quality &lt; Premium &gt;</p>';
      const dataWithEntities = { ...validData, contentHtml: htmlWithEntities };

      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      await channel.send(dataWithEntities);

      const callArgs = emailService.sendNotification.mock.calls[0];
      const textContent = callArgs[3];

      expect(textContent).toContain('Price: $50 & up | Quality < Premium >');
    });

    it('should validate campaign name length limits', () => {
      const maxLengthData = { ...validData, campaignName: 'a'.repeat(100) };
      const result = channel.validateData(maxLengthData);
      expect(result.isValid).toBe(true);
    });

    it('should validate content HTML length limits', () => {
      const maxLengthData = { ...validData, contentHtml: 'a'.repeat(50000) };
      const result = channel.validateData(maxLengthData);
      expect(result.isValid).toBe(true);
    });

    it('should handle null data in type guard', () => {
      const result = channel.validateData(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email data is required');
    });

    it('should handle non-object data in type guard', () => {
      const result = channel.validateData('string-data');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid marketing email data structure');
    });

    it('should hit intermediate validation for non-string trackingPixelUrl', () => {
      // Create data that fails isMarketingEmailData but has invalid trackingPixelUrl type
      const invalidData = {
        userName: 123, // This makes isMarketingEmailData return false
        userEmail: 'test@example.com',
        supportUrl: 'https://example.com/support', 
        campaignName: 'Test Campaign',
        contentHtml: 'a'.repeat(50001), // Exceeds length limit
        unsubscribeUrl: 'https://example.com/unsubscribe',
        trackingPixelUrl: 123, // Not a string
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid marketing email data structure');
      expect(result.errors).toContain('trackingPixelUrl must be a string if provided');
      expect(result.errors).toContain('contentHtml must be 50000 characters or less');
    });

    it('should hit intermediate validation for invalid HTML content', () => {
      // Create data that fails isMarketingEmailData but has invalid HTML
      const invalidData = {
        userName: 123, // This makes isMarketingEmailData return false
        userEmail: 'test@example.com',
        supportUrl: 'https://example.com/support',
        campaignName: 'Test Campaign',
        contentHtml: '<div><p><span>Multiple unclosed tags', // Invalid HTML
        unsubscribeUrl: 'https://example.com/unsubscribe',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid marketing email data structure');
      expect(result.errors).toContain('contentHtml must be valid HTML');
    });
  });
});
