// @ts-nocheck
// 
import { Module, OnModuleInit } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailChannelRegistryService } from './services/email-channel-registry.service';
import {
  WelcomeEmailChannel,
  PasswordResetEmailChannel,
  EmailVerificationChannel,
  NotificationEmailChannel,
  MarketingEmailChannel,
} from './channels';

/**
 * Email Module - OCP Compliant
 *
 * This module demonstrates the Open/Closed Principle by registering
 * email channels dynamically. New email channels can be added by:
 * 1. Creating a new channel class implementing IEmailChannel
 * 2. Adding it to the providers array
 * 3. Registering it in the onModuleInit method
 *
 * No existing code needs to be modified for extensions.
 */
@Module({
  controllers: [EmailController],
  providers: [
    EmailService,
    EmailChannelRegistryService,

    // Email Channel Implementations
    // ✅ OCP: New channels can be added here without modifying existing ones
    WelcomeEmailChannel,
    PasswordResetEmailChannel,
    EmailVerificationChannel,
    NotificationEmailChannel,

    // Extended Channels (OCP Extensions)
    MarketingEmailChannel,
  ],
  exports: [EmailService, EmailChannelRegistryService],
})
export class EmailModule implements OnModuleInit {
  constructor(
    private readonly emailChannelRegistry: EmailChannelRegistryService,
    private readonly welcomeChannel: WelcomeEmailChannel,
    private readonly passwordResetChannel: PasswordResetEmailChannel,
    private readonly verificationChannel: EmailVerificationChannel,
    private readonly notificationChannel: NotificationEmailChannel,
    private readonly marketingChannel: MarketingEmailChannel,
  ) {}

  /**
   * Register all email channels on module initialization
   *
   * ✅ OCP: New channels can be registered here without modifying existing registrations
   */
  async onModuleInit() {
    // Register core email channels
    this.emailChannelRegistry.registerChannel(this.welcomeChannel);
    this.emailChannelRegistry.registerChannel(this.passwordResetChannel);
    this.emailChannelRegistry.registerChannel(this.verificationChannel);
    this.emailChannelRegistry.registerChannel(this.notificationChannel);

    // Register extended channels (OCP extensions)
    this.emailChannelRegistry.registerChannel(this.marketingChannel);

    // Future channels can be registered here without modifying above code
    // Example: this.emailChannelRegistry.registerChannel(this.billingChannel);
    // Example: this.emailChannelRegistry.registerChannel(this.securityChannel);
  }
}
