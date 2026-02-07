import { z } from 'zod';

export const isEnabledSchema = z.object({
  key: z.string(),
});

export const getByKeySchema = z.object({
  key: z.string(),
});

export const toggleFeatureSchema = z.object({
  key: z.string(),
  enabled: z.boolean(),
});

export const updateConfigSchema = z.object({
  key: z.string(),
  config: z.record(z.any()),
});

export const getHistorySchema = z.object({
  key: z.string(),
});

export const featureFlagsSchemas = {
  isEnabled: isEnabledSchema,
  getByKey: getByKeySchema,
  toggleFeature: toggleFeatureSchema,
  updateConfig: updateConfigSchema,
  getHistory: getHistorySchema,
};
