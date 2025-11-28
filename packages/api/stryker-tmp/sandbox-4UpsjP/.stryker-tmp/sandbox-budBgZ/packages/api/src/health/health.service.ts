// @ts-nocheck
// 
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async check() {
    try {
      // Check database connection with MongoDB-compatible query
      await this.prisma.user.findFirst({ take: 1 });

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks: {
          database: 'healthy',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks: {
          database: 'unhealthy',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
