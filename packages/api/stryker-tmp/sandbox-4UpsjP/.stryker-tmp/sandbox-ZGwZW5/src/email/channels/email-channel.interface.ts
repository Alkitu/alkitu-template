// @ts-nocheck
// 
import { EmailResult } from '../types/email.types';

/**
 * Email Channel Interface - OCP Compliant
 *
 * Defines the contract for all email channel implementations.
 * New email types can be added by implementing this interface
 * without modifying existing code.
 */
export interface IEmailChannel {
  /**
   * Unique identifier for this email channel
   */
  readonly type: string;

  /**
   * Send an email using this channel
   * @param data Email data specific to this channel type
   * @returns Promise with email result
   */
  send(data: any): Promise<EmailResult>;

  /**
   * Check if this channel supports a given email type
   * @param type Email type to check
   * @returns True if this channel supports the type
   */
  supports(type: string): boolean;

  /**
   * Validate email data for this specific channel
   * @param data Email data to validate
   * @returns Validation result
   */
  validateData(data: any): { isValid: boolean; errors: string[] };
}

/**
 * Email Channel Registry Interface
 *
 * Manages registration and discovery of email channels
 * following the Open/Closed Principle
 */
export interface IEmailChannelRegistry {
  /**
   * Register a new email channel
   * @param channel Email channel implementation
   */
  registerChannel(channel: IEmailChannel): void;

  /**
   * Get channel that supports a specific email type
   * @param type Email type
   * @returns Email channel or undefined if not found
   */
  getChannel(type: string): IEmailChannel | undefined;

  /**
   * Get all registered channels
   * @returns Array of registered channels
   */
  getAllChannels(): IEmailChannel[];

  /**
   * Get all supported email types
   * @returns Array of supported email types
   */
  getSupportedTypes(): string[];
}
