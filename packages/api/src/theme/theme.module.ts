import { Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { PrismaService } from '@/prisma.service';

@Module({
  providers: [ThemeService, PrismaService],
  exports: [ThemeService],
})
export class ThemeModule {}
