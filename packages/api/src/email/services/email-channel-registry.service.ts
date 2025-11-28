import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  IEmailChannel,
  IEmailChannelRegistry,
} from '../channels/email-channel.interface';
import { EmailResult } from '../types/email.types';

/**
 * Email Channel Registry Service
 *
 * Manages email channel registration and discovery following OCP.
 * This service is OPEN for extension (new channels) but CLOSED for modification.
 */
@Injectable()
export class EmailChannelRegistryService
  implements IEmailChannelRegistry, OnModuleInit
{
  private readonly logger = new Logger(EmailChannelRegistryService.name);
  private readonly channels = new Map<string, IEmailChannel>();

  async onModuleInit(): Promise<void> {
    await Promise.resolve(); // ESLint requires await in async methods
    this.logger.log('Email Channel Registry initialized');
    this.logRegisteredChannels();
  }

  /**
   * Register a new email channel
   *
   * This method allows EXTENSION without MODIFICATION - core OCP principle
   */
  registerChannel(channel: IEmailChannel): void {
    if (this.channels.has(channel.type)) {
      this.logger.warn(
        `Email channel '${channel.type}' is already registered. Overriding existing channel.`,
      );
    }

    this.channels.set(channel.type, channel);
    this.logger.log(`Email channel '${channel.type}' registered successfully`);
  }

  /**
   * Get channel that supports a specific email type
   */
  getChannel(type: string): IEmailChannel | undefined {
    const channel = this.channels.get(type);

    if (!channel) {
      this.logger.warn(`No email channel found for type: ${type}`);
      return undefined;
    }

    if (!channel.supports(type)) {
      this.logger.error(
        `Channel '${channel.type}' is registered for '${type}' but doesn't support it`,
      );
      return undefined;
    }

    return channel;
  }

  /**
   * Get all registered channels
   */
  getAllChannels(): IEmailChannel[] {
    return Array.from(this.channels.values());
  }

  /**
   * Get all supported email types
   */
  getSupportedTypes(): string[] {
    return Array.from(this.channels.keys());
  }

  /**
   * Send email using the appropriate channel
   *
   * This method orchestrates email sending without needing modification
   * when new email types are added
   */
  async sendEmail(type: string, data: any): Promise<EmailResult> {
    const channel = this.getChannel(type);

    if (!channel) {
      const supportedTypes = this.getSupportedTypes().join(', ');
      const errorMessage = `Email type '${type}' is not supported. Supported types: ${supportedTypes}`;

      this.logger.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Validate data before sending
    const validation = channel.validateData(data);
    if (!validation.isValid) {
      const errorMessage = `Invalid data for email type '${type}': ${validation.errors.join(', ')}`;

      this.logger.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }

    try {
      this.logger.log(
        `Sending '${type}' email using ${channel.constructor.name}`,
      );
      const result = await channel.send(data);

      if (result.success) {
        this.logger.log(
          `Email '${type}' sent successfully with messageId: ${result.messageId}`,
        );
      } else {
        this.logger.error(`Failed to send '${type}' email: ${result.error}`);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Exception sending '${type}' email:`, error);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Unregister an email channel
   */
  unregisterChannel(type: string): boolean {
    const existed = this.channels.has(type);
    this.channels.delete(type);

    if (existed) {
      this.logger.log(`Email channel '${type}' unregistered successfully`);
    } else {
      this.logger.warn(
        `Attempted to unregister non-existent email channel: ${type}`,
      );
    }

    return existed;
  }

  /**
   * Check if a specific email type is supported
   */
  isTypeSupported(type: string): boolean {
    return this.channels.has(type);
  }

  /**
   * Get statistics about registered channels
   */
  getRegistryStats(): {
    totalChannels: number;
    supportedTypes: string[];
    channelDetails: Array<{
      type: string;
      className: string;
    }>;
  } {
    const channels = this.getAllChannels();

    return {
      totalChannels: channels.length,
      supportedTypes: this.getSupportedTypes(),
      channelDetails: channels.map((channel) => ({
        type: channel.type,
        className: channel.constructor.name,
      })),
    };
  }

  private logRegisteredChannels(): void {
    const stats = this.getRegistryStats();

    this.logger.log(`Email Channel Registry Status:`);
    this.logger.log(`- Total channels: ${stats.totalChannels}`);
    this.logger.log(`- Supported types: ${stats.supportedTypes.join(', ')}`);

    stats.channelDetails.forEach((detail) => {
      this.logger.log(`- ${detail.type}: ${detail.className}`);
    });
  }
}
