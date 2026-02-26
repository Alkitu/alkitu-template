import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { featureFlagsSchemas } from '../schemas/feature-flags.schemas';
import { FeatureFlagsService } from '../../feature-flags/feature-flags.service';
import { requireRoles } from '../middlewares/roles.middleware';
import { UserRole } from '@prisma/client';

export function createFeatureFlagsRouter(
  featureFlagsService: FeatureFlagsService,
) {
  return createTRPCRouter({
    /**
     * Check if a feature is enabled (public - used for client-side checks)
     */
    isEnabled: publicProcedure
      .input(featureFlagsSchemas.isEnabled)
      .query(async ({ input }) => {
        return await featureFlagsService.isFeatureEnabled(input.key);
      }),

    /**
     * Get all feature flags (public - for displaying available features)
     */
    getAll: publicProcedure.query(async () => {
      return await featureFlagsService.getAllFeatures();
    }),

    /**
     * Get a single feature flag by key (public)
     */
    getByKey: publicProcedure
      .input(featureFlagsSchemas.getByKey)
      .query(async ({ input }) => {
        return await featureFlagsService.getFeatureByKey(input.key);
      }),

    /**
     * Toggle a feature on/off (ADMIN ONLY)
     * CRITICAL: Only admins can enable/disable features
     */
    toggle: protectedProcedure
      .use(requireRoles(UserRole.ADMIN))
      .input(featureFlagsSchemas.toggleFeature)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
        }

        return await featureFlagsService.toggleFeature(
          input.key,
          input.enabled,
          ctx.user.id,
        );
      }),

    /**
     * Update feature configuration (ADMIN ONLY)
     * CRITICAL: Only admins can modify feature configs
     */
    updateConfig: protectedProcedure
      .use(requireRoles(UserRole.ADMIN))
      .input(featureFlagsSchemas.updateConfig)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
        }

        return await featureFlagsService.updateFeatureConfig(
          input.key,
          input.config,
          ctx.user.id,
        );
      }),

    /**
     * Get feature flag history (ADMIN ONLY)
     */
    getHistory: protectedProcedure
      .use(requireRoles(UserRole.ADMIN))
      .input(featureFlagsSchemas.getHistory)
      .query(async ({ input }) => {
        return (await featureFlagsService.getFeatureHistory(
          input.key,
        )) as Record<string, unknown>[];
      }),
  });
}
