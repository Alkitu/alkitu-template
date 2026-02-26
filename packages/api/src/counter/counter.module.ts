import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [CounterService, PrismaService],
  exports: [CounterService],
})
export class CounterModule {}
