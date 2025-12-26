import { Module, OnModuleInit } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [EmailTemplateService],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule implements OnModuleInit {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  /**
   * Initialize default email templates on module startup
   */
  async onModuleInit() {
    await this.emailTemplateService.initializeDefaultTemplates();
  }
}
