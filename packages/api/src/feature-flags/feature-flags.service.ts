import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FeatureStatus, FeatureFlag } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class FeatureFlagsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(key: string): Promise<boolean> {
    const feature = await this.prisma.featureFlag.findUnique({
      where: { key },
    });
    return feature?.status === FeatureStatus.ENABLED;
  }

  /**
   * Get all feature flags
   */
  async getAllFeatures(): Promise<FeatureFlag[]> {
    return this.prisma.featureFlag.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  /**
   * Get a single feature flag by key
   */
  async getFeatureByKey(key: string): Promise<FeatureFlag | null> {
    return this.prisma.featureFlag.findUnique({
      where: { key },
    });
  }

  /**
   * Toggle a feature on/off
   */
  async toggleFeature(
    key: string,
    enabled: boolean,
    userId: string,
  ): Promise<FeatureFlag> {
    const status = enabled ? FeatureStatus.ENABLED : FeatureStatus.DISABLED;

    // Get current feature state for audit
    const currentFeature = await this.prisma.featureFlag.findUnique({
      where: { key },
    });

    if (!currentFeature) {
      throw new Error(`Feature flag with key "${key}" not found`);
    }

    // Update feature
    const updated = await this.prisma.featureFlag.update({
      where: { key },
      data: {
        status,
        enabledAt: enabled ? new Date() : currentFeature.enabledAt,
        disabledAt: !enabled ? new Date() : currentFeature.disabledAt,
      },
    });

    // Create feature-specific audit log (FeatureFlagHistory)
    await this.prisma.featureFlagHistory.create({
      data: {
        featureKey: key,
        action: enabled ? 'ENABLED' : 'DISABLED',
        previousValue: { status: currentFeature.status },
        newValue: { status },
        userId,
      },
    });

    // Also log to central audit trail for security monitoring
    await this.auditService.log({
      action: 'TOGGLE_FEATURE',
      resourceType: 'FEATURE_FLAG',
      resourceId: currentFeature.id,
      userId,
      metadata: {
        featureKey: key,
        featureName: currentFeature.name,
        oldStatus: currentFeature.status,
        newStatus: status,
        action: enabled ? 'ENABLED' : 'DISABLED',
      },
    });

    return updated;
  }

  /**
   * Update feature configuration
   */
  async updateFeatureConfig(
    key: string,
    config: any,
    userId: string,
  ): Promise<FeatureFlag> {
    // Get current feature for audit
    const currentFeature = await this.prisma.featureFlag.findUnique({
      where: { key },
    });

    if (!currentFeature) {
      throw new Error(`Feature flag with key "${key}" not found`);
    }

    // Update config
    const updated = await this.prisma.featureFlag.update({
      where: { key },
      data: { config },
    });

    // Create feature-specific audit log (FeatureFlagHistory)
    await this.prisma.featureFlagHistory.create({
      data: {
        featureKey: key,
        action: 'UPDATED',
        previousValue: { config: currentFeature.config },
        newValue: { config },
        userId,
      },
    });

    // Also log to central audit trail for security monitoring
    await this.auditService.log({
      action: 'UPDATE_FEATURE_CONFIG',
      resourceType: 'FEATURE_FLAG',
      resourceId: currentFeature.id,
      userId,
      metadata: {
        featureKey: key,
        featureName: currentFeature.name,
        oldConfig: currentFeature.config,
        newConfig: config,
      },
    });

    return updated;
  }

  /**
   * Get feature flag history
   */
  async getFeatureHistory(key: string): Promise<any[]> {
    return this.prisma.featureFlagHistory.findMany({
      where: { featureKey: key },
      orderBy: { createdAt: 'desc' },
      take: 50, // Last 50 changes
    });
  }
}
