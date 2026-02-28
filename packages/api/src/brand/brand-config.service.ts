import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BrandConfigService {
  private readonly logger = new Logger(BrandConfigService.name);
  private cachedCompanyName: string | null = null;
  private cacheTimestamp = 0;
  private readonly cacheTtlMs = 5 * 60 * 1000; // 5 minutes

  constructor(
    @Optional() @Inject(PrismaService) private readonly prisma?: PrismaService,
  ) {}

  async getCompanyName(): Promise<string> {
    const now = Date.now();

    if (this.cachedCompanyName && now - this.cacheTimestamp < this.cacheTtlMs) {
      return this.cachedCompanyName;
    }

    try {
      if (this.prisma) {
        const activeTheme = await this.prisma.theme.findFirst({
          where: { isActive: true },
          select: { themeData: true },
        });

        if (activeTheme?.themeData) {
          const themeData = activeTheme.themeData as Record<string, unknown>;
          const brand = themeData.brand as Record<string, unknown> | undefined;
          const name = brand?.name as string | undefined;

          if (name) {
            this.cachedCompanyName = name;
            this.cacheTimestamp = now;
            return name;
          }
        }
      }
    } catch (error) {
      this.logger.warn(
        `Failed to fetch company name from DB: ${error instanceof Error ? error.message : 'unknown'}`,
      );
    }

    const fallback = process.env.APP_NAME || 'Alkitu';
    this.cachedCompanyName = fallback;
    this.cacheTimestamp = now;
    return fallback;
  }

  getLogoUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/logo-light.png`;
  }

  invalidateCache(): void {
    this.cachedCompanyName = null;
    this.cacheTimestamp = 0;
  }
}
