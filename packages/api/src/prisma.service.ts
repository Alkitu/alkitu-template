import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log all queries in development
    /*
    if (process.env.NODE_ENV !== 'production') {
      this.$on('query' as any, (e: any) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }
    */

    this.$on('error' as any, (e: any) => {
      this.logger.error('Prisma Error:', e);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Successfully connected to MongoDB Atlas (TEMPLATE)');
      this.logger.log(
        `📍 Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('?')[0]}`,
      );
    } catch (error) {
      this.logger.error('❌ Failed to connect to MongoDB', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from MongoDB');
  }
}
