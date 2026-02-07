import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
