import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaService } from '../prisma.service';

/**
 * Module for managing services with dynamic templates (ALI-118)
 * @module ServicesModule
 */
@Module({
  imports: [],
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService],
  exports: [ServicesService],
})
export class ServicesModule {}
