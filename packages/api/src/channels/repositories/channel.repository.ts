import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  Channel,
  ChannelMember,
  ChannelType,
  ChannelRole,
} from '@prisma/client';
import { CreateChannelDto } from '../dto/channels.dto';

@Injectable()
export class ChannelRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateChannelDto & { workspaceId?: string },
    ownerId: string,
  ): Promise<Channel> {
    return this.prisma.channel.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        allowedRoles: data.allowedRoles || [],
        workspaceId: data.workspaceId,
        members: {
          create: {
            userId: ownerId,
            role: ChannelRole.OWNER,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Channel | null> {
    return this.prisma.channel.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                image: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: Partial<CreateChannelDto>): Promise<Channel> {
    return this.prisma.channel.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        allowedRoles: data.allowedRoles,
      },
    });
  }

  async delete(id: string): Promise<Channel> {
    // Prisma cascade might handle messages if configured, otherwise we might need to delete messages first.
    // Assuming schema has appropriate onDelete: Cascade or we rely on Prisma to error if not.
    // Usually it's better to manually delete relations if strict.
    // Let's assume standard cascade delete for now or just delete channel.
    return this.prisma.channel.delete({
      where: { id },
    });
  }

  async findByUser(userId: string): Promise<Channel[]> {
    return this.prisma.channel.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                image: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          where: { parentId: null },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async addMember(
    channelId: string,
    userId: string,
    role: ChannelRole = ChannelRole.MEMBER,
  ): Promise<ChannelMember> {
    return this.prisma.channelMember.create({
      data: {
        channelId,
        userId,
        role,
      },
    });
  }

  async findOrCreateConversation(
    creatorId: string,
    targetUserIds: string[],
  ): Promise<Channel> {
    // Combine creator + targets to get unique set of participants
    const participantIds = Array.from(new Set([creatorId, ...targetUserIds]));

    // 1. Find existing DM/Conversation with EXACTLY these members
    // This is tricky in Prisma/Mongo efficiently without raw query or careful filtering.
    // Strategy: Find channels where ALL participants are members AND count matches.

    // Step A: Find channel IDs where creator is a member, restricted to DM type
    const candidateChannels = await this.prisma.channel.findMany({
      where: {
        type: ChannelType.DM,
        members: {
          some: { userId: creatorId },
        },
      },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    // Step B: Filter in memory for exact match (usually efficient enough if user doesn't have thousands of DMs)
    const existing = candidateChannels.find((c) => {
      const memberIds = c.members.map((m) => m.userId);
      return (
        memberIds.length === participantIds.length &&
        participantIds.every((id) => memberIds.includes(id))
      );
    });

    if (existing) {
      // Return full details including user info
      return this.findById(existing.id);
    }

    // 2. Create new DM
    return this.prisma.channel.create({
      data: {
        type: ChannelType.DM,
        members: {
          create: participantIds.map((userId) => ({
            userId,
            role: ChannelRole.MEMBER,
            isFavorite: false,
          })),
        },
      },
      include: {
        members: { include: { user: true } },
      },
    });
  }

  // Deprecated shim if needed, or just remove
  async findOrCreateDM(userA: string, userB: string): Promise<Channel> {
    return this.findOrCreateConversation(userA, [userB]);
  }

  async markMessagesAsRead(channelId: string, userId: string): Promise<void> {
    // Find unread messages for this user in this channel
    const unreadMessages = await this.prisma.channelMessage.findMany({
      where: {
        channelId,
        NOT: {
          readBy: { has: userId },
        },
      },
      select: { id: true },
      take: 50, // Limit batch size for performance
    });

    if (unreadMessages.length === 0) return;

    // Update each message to include userId in readBy
    // Note: In a high-throughput system, this should be optimized or moved to a background job
    // Prisma doesn't always support 'push' in updateMany for all providers nicely, so loop is safer here for now with Mongo.
    await Promise.all(
      unreadMessages.map((msg) =>
        this.prisma.channelMessage.update({
          where: { id: msg.id },
          data: {
            readBy: { push: userId },
          },
        }),
      ),
    );
  }
  async toggleFavorite(channelId: string, userId: string): Promise<void> {
    const member = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });

    if (member) {
      await this.prisma.channelMember.update({
        where: { id: member.id },
        data: { isFavorite: !member.isFavorite },
      });
    }
  }
}
