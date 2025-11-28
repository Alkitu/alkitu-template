/**
 * Email Channels - Index File
 * 
 * Centralized exports for all email channel interfaces and implementations.
 * Following OCP: New channels can be added here without modifying existing exports.
 */
// @ts-nocheck

// 


// Interfaces
export * from './email-channel.interface';

// Core Channel Implementations (from original system)
export * from './welcome-email.channel';
export * from './password-reset-email.channel';
export * from './verification-email.channel';
export * from './notification-email.channel';

// Extended Channel Implementations (OCP extensions)
export * from './marketing-email.channel';

// Registry Service
export * from '../services/email-channel-registry.service';

// Types
export * from '../types/email.types';