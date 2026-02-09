import { Controller, Get, Param } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';

/**
 * Feature Flags REST Controller
 *
 * Provides REST endpoints for feature flag verification.
 * Used by Next.js middleware to check feature flags server-side.
 *
 * NOTE: This endpoint is intentionally public (no auth guard) to allow
 * Next.js middleware to verify feature flags before authentication occurs.
 */
@Controller('api/feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  /**
   * Check if a specific feature flag is enabled
   *
   * GET /api/feature-flags/:key
   *
   * @param key - Feature flag key (e.g., 'support-chat', 'team-channels')
   * @returns { enabled: boolean, key: string }
   *
   * @example
   * GET /api/feature-flags/team-channels
   * Response: { "enabled": true, "key": "team-channels" }
   */
  @Get(':key')
  async checkFeatureFlag(@Param('key') key: string) {
    const enabled = await this.featureFlagsService.isFeatureEnabled(key);
    return {
      enabled,
      key,
    };
  }
}
