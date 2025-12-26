import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ChannelMessage } from '@prisma/client';

@Injectable()
export class ChannelMessageRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: { channelId: string; content: string; senderId: string; attachments?: any; parentId?: string }): Promise<ChannelMessage> {
    if (data.parentId) {
      // Transaction to create reply and increment parent replyCount
      const [message] = await this.prisma.$transaction([
        this.prisma.channelMessage.create({
          data: {
            channelId: data.channelId,
            content: data.content,
            senderId: data.senderId,
            attachments: data.attachments,
            parentId: data.parentId,
          },
          include: {
            sender: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                image: true,
              }
            }
          }
        }),
        this.prisma.channelMessage.update({
          where: { id: data.parentId },
          data: { replyCount: { increment: 1 } },
        }),
      ]);
      return message;
    }

    return this.prisma.channelMessage.create({
      data: {
        channelId: data.channelId,
        content: data.content,
        senderId: data.senderId,
        attachments: data.attachments,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            image: true,
          }
        }
      }
    });
  }

  async findByChannel(channelId: string, limit: number = 50): Promise<ChannelMessage[]> {
    return this.prisma.channelMessage.findMany({
      where: { 
        channelId,
        parentId: null, // Only top-level messages
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            image: true,
          }
        }
      }
    });
  }

  async findReplies(parentId: string): Promise<ChannelMessage[]> {
    return this.prisma.channelMessage.findMany({
      where: { parentId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            image: true,
          }
        }
      }
    });
  }
}
