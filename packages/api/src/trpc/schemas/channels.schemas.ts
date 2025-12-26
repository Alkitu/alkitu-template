import { z } from 'zod';
import { ChannelType, ChannelRole, UserRole } from '@prisma/client';

export const channelsSchemas = {
  createChannel: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    type: z.nativeEnum(ChannelType),
    members: z.array(z.string()).optional(), // Initial members
    allowedRoles: z.array(z.nativeEnum(UserRole)).optional(),
  }),

  sendMessage: z.object({
    channelId: z.string(),
    content: z.string(),
    attachments: z.any().optional(),
    parentId: z.string().optional(),
  }),

  getMessages: z.object({
    channelId: z.string(),
    limit: z.number().optional().default(50),
    cursor: z.string().optional(), // For pagination if needed later
  }),

  getReplies: z.object({
    parentId: z.string(),
  }),

  // CRUD Operations
  updateChannel: z.object({
    channelId: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    type: z.nativeEnum(ChannelType).optional(),
    allowedRoles: z.array(z.nativeEnum(UserRole)).optional(),
  }),

  deleteChannel: z.object({
    channelId: z.string(),
  }),

  createDM: z.object({
    targetUserIds: z.union([z.string(), z.array(z.string())]), // Support both for backward compatibility initially
  }),

  toggleFavorite: z.object({
    channelId: z.string(),
  }),

  markAsRead: z.object({
    channelId: z.string(),
  }),

  addMember: z.object({
    channelId: z.string(),
    userId: z.string(),
    role: z.nativeEnum(ChannelRole).optional(),
  }),

  getChannel: z.object({
    channelId: z.string(),
  }),
};
