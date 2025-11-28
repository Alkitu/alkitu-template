import {
  IEmailChannel,
  IEmailChannelRegistry,
} from './email-channel.interface';
import { EmailResult } from '../types/email.types';

// Mock implementation for testing interface compliance
class MockEmailChannel implements IEmailChannel {
  readonly type = 'mock';

  async send(data: any): Promise<EmailResult> {
    return {
      success: true,
      messageId: 'mock-id',
    };
  }

  supports(type: string): boolean {
    return type === 'mock';
  }

  validateData(data: any): { isValid: boolean; errors: string[] } {
    return {
      isValid: true,
      errors: [],
    };
  }
}

class MockEmailChannelRegistry implements IEmailChannelRegistry {
  private channels: Map<string, IEmailChannel> = new Map();

  registerChannel(channel: IEmailChannel): void {
    this.channels.set(channel.type, channel);
  }

  getChannel(type: string): IEmailChannel | undefined {
    return this.channels.get(type);
  }

  getAllChannels(): IEmailChannel[] {
    return Array.from(this.channels.values());
  }

  getSupportedTypes(): string[] {
    return Array.from(this.channels.keys());
  }
}

describe('IEmailChannel Interface', () => {
  let mockChannel: MockEmailChannel;

  beforeEach(() => {
    mockChannel = new MockEmailChannel();
  });

  describe('Interface Contract Compliance', () => {
    it('should have readonly type property', () => {
      expect(mockChannel.type).toBe('mock');
      expect(typeof mockChannel.type).toBe('string');
    });

    it('should have send method with correct signature', () => {
      expect(typeof mockChannel.send).toBe('function');
      expect(mockChannel.send.length).toBe(1); // Should accept one parameter
    });

    it('should have supports method with correct signature', () => {
      expect(typeof mockChannel.supports).toBe('function');
      expect(mockChannel.supports.length).toBe(1); // Should accept one parameter
    });

    it('should have validateData method with correct signature', () => {
      expect(typeof mockChannel.validateData).toBe('function');
      expect(mockChannel.validateData.length).toBe(1); // Should accept one parameter
    });
  });

  describe('send method contract', () => {
    it('should return Promise<EmailResult>', async () => {
      const result = await mockChannel.send({});

      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');

      if (result.success) {
        expect(result).toHaveProperty('messageId');
        expect(typeof result.messageId).toBe('string');
      } else {
        expect(result).toHaveProperty('error');
        expect(typeof result.error).toBe('string');
      }
    });

    it('should handle various data types', async () => {
      const testCases = [{}, { test: 'data' }, null, undefined, 'string', 123];

      for (const testCase of testCases) {
        const result = await mockChannel.send(testCase);
        expect(result).toHaveProperty('success');
        expect(typeof result.success).toBe('boolean');
      }
    });

    it('should be async and return Promise', () => {
      const result = mockChannel.send({});
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('supports method contract', () => {
    it('should return boolean for string input', () => {
      const result = mockChannel.supports('mock');
      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });

    it('should return false for unsupported types', () => {
      const unsupportedTypes = [
        'welcome',
        'reset',
        'verification',
        'notification',
      ];

      unsupportedTypes.forEach((type) => {
        const result = mockChannel.supports(type);
        expect(typeof result).toBe('boolean');
        expect(result).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      const edgeCases = ['', ' ', 'MOCK', 'Mock'];

      edgeCases.forEach((type) => {
        const result = mockChannel.supports(type);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('validateData method contract', () => {
    it('should return validation result object', () => {
      const result = mockChannel.validateData({});

      expect(result).toHaveProperty('isValid');
      expect(typeof result.isValid).toBe('boolean');

      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should return string array for errors', () => {
      const result = mockChannel.validateData({});

      result.errors.forEach((error) => {
        expect(typeof error).toBe('string');
      });
    });

    it('should handle various data types', () => {
      const testCases = [
        {},
        { test: 'data' },
        null,
        undefined,
        'string',
        123,
        [],
      ];

      testCases.forEach((testCase) => {
        const result = mockChannel.validateData(testCase);
        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('errors');
        expect(typeof result.isValid).toBe('boolean');
        expect(Array.isArray(result.errors)).toBe(true);
      });
    });

    it('should maintain consistent validation logic', () => {
      const testData = { test: 'data' };

      const result1 = mockChannel.validateData(testData);
      const result2 = mockChannel.validateData(testData);

      expect(result1.isValid).toBe(result2.isValid);
      expect(result1.errors).toEqual(result2.errors);
    });
  });

  describe('Open/Closed Principle Compliance', () => {
    it('should allow extension without modification', () => {
      // Create extended channel
      class ExtendedMockChannel implements IEmailChannel {
        readonly type = 'extended-mock';

        async send(data: any): Promise<EmailResult> {
          return { success: true, messageId: 'extended-mock-id' };
        }

        supports(type: string): boolean {
          return type === 'extended-mock';
        }

        validateData(data: any): { isValid: boolean; errors: string[] } {
          return { isValid: true, errors: [] };
        }
      }

      const extendedChannel = new ExtendedMockChannel();

      // Should maintain interface compliance
      expect(typeof extendedChannel.send).toBe('function');
      expect(typeof extendedChannel.supports).toBe('function');
      expect(typeof extendedChannel.validateData).toBe('function');
      expect(extendedChannel.type).toBe('extended-mock');
    });

    it('should support new channel types without breaking existing ones', () => {
      class NewChannelType implements IEmailChannel {
        readonly type = 'new-type';

        async send(data: any): Promise<EmailResult> {
          return { success: true, messageId: 'new-id' };
        }

        supports(type: string): boolean {
          return type === 'new-type';
        }

        validateData(data: any): { isValid: boolean; errors: string[] } {
          return { isValid: true, errors: [] };
        }
      }

      const newChannel = new NewChannelType();

      // Should be fully compatible with interface
      expect(newChannel).toBeInstanceOf(NewChannelType);
      expect(newChannel.type).toBe('new-type');
      expect(newChannel.supports('new-type')).toBe(true);
      expect(newChannel.supports('mock')).toBe(false);
    });
  });
});

describe('IEmailChannelRegistry Interface', () => {
  let registry: MockEmailChannelRegistry;
  let mockChannel: MockEmailChannel;

  beforeEach(() => {
    registry = new MockEmailChannelRegistry();
    mockChannel = new MockEmailChannel();
  });

  describe('Interface Contract Compliance', () => {
    it('should have registerChannel method', () => {
      expect(typeof registry.registerChannel).toBe('function');
      expect(registry.registerChannel.length).toBe(1);
    });

    it('should have getChannel method', () => {
      expect(typeof registry.getChannel).toBe('function');
      expect(registry.getChannel.length).toBe(1);
    });

    it('should have getAllChannels method', () => {
      expect(typeof registry.getAllChannels).toBe('function');
      expect(registry.getAllChannels.length).toBe(0);
    });

    it('should have getSupportedTypes method', () => {
      expect(typeof registry.getSupportedTypes).toBe('function');
      expect(registry.getSupportedTypes.length).toBe(0);
    });
  });

  describe('registerChannel method contract', () => {
    it('should accept IEmailChannel implementations', () => {
      expect(() => registry.registerChannel(mockChannel)).not.toThrow();
    });

    it('should store channels for retrieval', () => {
      registry.registerChannel(mockChannel);
      const retrieved = registry.getChannel('mock');
      expect(retrieved).toBe(mockChannel);
    });

    it('should handle multiple channel registrations', () => {
      const channel1 = new MockEmailChannel();
      const channel2 = new MockEmailChannel();
      Object.defineProperty(channel2, 'type', {
        value: 'test',
        writable: false,
      });

      registry.registerChannel(channel1);
      registry.registerChannel(channel2);

      expect(registry.getAllChannels()).toHaveLength(2);
    });
  });

  describe('getChannel method contract', () => {
    it('should return IEmailChannel or undefined', () => {
      const result = registry.getChannel('nonexistent');
      expect(result).toBeUndefined();
    });

    it('should return registered channel', () => {
      registry.registerChannel(mockChannel);
      const result = registry.getChannel('mock');
      expect(result).toBe(mockChannel);
    });

    it('should return undefined for unregistered types', () => {
      registry.registerChannel(mockChannel);
      const result = registry.getChannel('unknown');
      expect(result).toBeUndefined();
    });

    it('should handle case sensitivity', () => {
      registry.registerChannel(mockChannel);
      const result = registry.getChannel('MOCK');
      expect(result).toBeUndefined(); // Should be case sensitive
    });
  });

  describe('getAllChannels method contract', () => {
    it('should return array of IEmailChannel', () => {
      const result = registry.getAllChannels();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when no channels registered', () => {
      const result = registry.getAllChannels();
      expect(result).toHaveLength(0);
    });

    it('should return all registered channels', () => {
      const channel1 = mockChannel;
      const channel2 = { ...mockChannel, type: 'test' } as IEmailChannel;

      registry.registerChannel(channel1);
      registry.registerChannel(channel2);

      const result = registry.getAllChannels();
      expect(result).toHaveLength(2);
      expect(result).toContain(channel1);
      expect(result).toContain(channel2);
    });
  });

  describe('getSupportedTypes method contract', () => {
    it('should return array of strings', () => {
      const result = registry.getSupportedTypes();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when no channels registered', () => {
      const result = registry.getSupportedTypes();
      expect(result).toHaveLength(0);
    });

    it('should return all supported types', () => {
      const channel1 = mockChannel;
      const channel2 = { ...mockChannel, type: 'test' } as IEmailChannel;

      registry.registerChannel(channel1);
      registry.registerChannel(channel2);

      const result = registry.getSupportedTypes();
      expect(result).toHaveLength(2);
      expect(result).toContain('mock');
      expect(result).toContain('test');
    });

    it('should return unique types only', () => {
      const channel1 = mockChannel;
      const channel2 = new MockEmailChannel();
      Object.defineProperty(channel2, 'type', {
        value: 'mock',
        writable: false,
      });

      registry.registerChannel(channel1);
      registry.registerChannel(channel2);

      const result = registry.getSupportedTypes();
      expect(result).toHaveLength(1);
      expect(result).toContain('mock');
    });
  });

  describe('Registry Behavior and Consistency', () => {
    it('should maintain consistency between methods', () => {
      registry.registerChannel(mockChannel);

      const allChannels = registry.getAllChannels();
      const supportedTypes = registry.getSupportedTypes();

      expect(allChannels).toHaveLength(1);
      expect(supportedTypes).toHaveLength(1);
      expect(supportedTypes[0]).toBe(allChannels[0].type);
    });

    it('should handle channel replacement', () => {
      const originalChannel = mockChannel;
      const replacementChannel = {
        ...mockChannel,
        type: 'mock',
      } as IEmailChannel;

      registry.registerChannel(originalChannel);
      registry.registerChannel(replacementChannel);

      const retrieved = registry.getChannel('mock');
      expect(retrieved).toBe(replacementChannel);
      expect(registry.getAllChannels()).toHaveLength(1);
    });

    it('should maintain registry state integrity', () => {
      const channels = [
        mockChannel,
        { ...mockChannel, type: 'test1' } as IEmailChannel,
        { ...mockChannel, type: 'test2' } as IEmailChannel,
      ];

      channels.forEach((channel) => registry.registerChannel(channel));

      // Verify all operations are consistent
      expect(registry.getAllChannels()).toHaveLength(3);
      expect(registry.getSupportedTypes()).toHaveLength(3);

      channels.forEach((channel) => {
        expect(registry.getChannel(channel.type)).toBe(channel);
      });
    });
  });

  describe('Open/Closed Principle in Registry', () => {
    it('should allow new channel types without modifying registry', () => {
      class SpecialChannel implements IEmailChannel {
        readonly type = 'special';

        async send(data: any): Promise<EmailResult> {
          return { success: true, messageId: 'special-id' };
        }

        supports(type: string): boolean {
          return type === 'special';
        }

        validateData(data: any): { isValid: boolean; errors: string[] } {
          return { isValid: true, errors: [] };
        }
      }

      const specialChannel = new SpecialChannel();

      // Should work without any registry modifications
      registry.registerChannel(specialChannel);

      expect(registry.getChannel('special')).toBe(specialChannel);
      expect(registry.getSupportedTypes()).toContain('special');
    });

    it('should support dynamic channel registration', () => {
      const initialCount = registry.getAllChannels().length;

      // Register channels dynamically
      const dynamicChannels = Array.from(
        { length: 5 },
        (_, i) =>
          ({
            ...mockChannel,
            type: `dynamic-${i}`,
          }) as IEmailChannel,
      );

      dynamicChannels.forEach((channel) => registry.registerChannel(channel));

      expect(registry.getAllChannels()).toHaveLength(initialCount + 5);
      expect(registry.getSupportedTypes()).toHaveLength(initialCount + 5);
    });
  });
});
