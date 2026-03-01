import { z } from 'zod';

/**
 * Schema for unlinking an OAuth account
 */
export const unlinkAccountSchema = z.object({
  accountId: z.string(),
});

/**
 * Schema for checking if a provider can be linked
 */
export const canLinkProviderSchema = z.object({
  provider: z.string(),
});
