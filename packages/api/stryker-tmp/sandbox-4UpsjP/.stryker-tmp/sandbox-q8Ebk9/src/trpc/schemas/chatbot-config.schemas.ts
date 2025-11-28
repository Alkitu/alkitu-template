// @ts-nocheck
// 
import { z } from 'zod';

export const chatbotConfigSchemas = {
  getChatbotConfig: z.void(),
  updateChatbotConfig: z.object({
    primaryColor: z.string().optional(),
    textColor: z.string().optional(),
    backgroundColor: z.string().optional(),
    borderRadius: z.number().int().min(0).max(20).optional(),
    position: z.enum(['bottom-right', 'bottom-left']).optional(),
    autoOpen: z.boolean().optional(),
    autoOpenDelay: z.number().int().min(0).optional(),
    offlineMode: z.boolean().optional(),
    requireEmail: z.boolean().optional(),
    requirePhone: z.boolean().optional(),
    requireName: z.boolean().optional(),
    requireCompany: z.boolean().optional(),
    allowAnonymous: z.boolean().optional(),
    welcomeMessage: z.string().optional(),
    offlineMessage: z.string().optional(),
    thankYouMessage: z.string().optional(),
    businessHoursEnabled: z.boolean().optional(),
    timezone: z.string().optional(),
    schedule: z.any().optional(), // TODO: Define a more specific schema for schedule
    rateLimitMessages: z.number().int().min(1).optional(),
    rateLimitWindow: z.number().int().min(1).optional(),
    blockSpamKeywords: z.array(z.string()).optional(),
  }),
};
