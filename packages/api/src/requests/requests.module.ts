import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from '../prisma.service';

/**
 * Module for managing service requests lifecycle (ALI-119)
 * @module RequestsModule
 */
@Module({
  imports: [],
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService],
  exports: [RequestsService],
})
export class RequestsModule {}
