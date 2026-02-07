import { Module } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import { PrismaModule } from '../prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [FeatureFlagsService],
  exports: [FeatureFlagsService],
})
export class FeatureFlagsModule {}
