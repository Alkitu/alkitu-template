import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma.service';
import { AccessControlModule } from '../access-control/access-control.module';

/**
 * Locations Module (ALI-117)
 * Provides work location management functionality
 */
@Module({
  imports: [AccessControlModule],
  controllers: [LocationsController],
  providers: [LocationsService, PrismaService],
  exports: [LocationsService],
})
export class LocationsModule {}
