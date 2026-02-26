import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelRepository } from './repositories/channel.repository';
import { ChannelMessageRepository } from './repositories/channel-message.repository';
import type { CreateChannelInput, SendChannelMessageInput } from '../trpc/schemas/channels.schemas';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly messageRepository: ChannelMessageRepository,
  ) {}

  async createChannel(data: CreateChannelInput, userId: string) {
    const channel = await this.channelRepository.create(data, userId);

    // Add other initial members if provided
    if (data.members && data.members.length > 0) {
      for (const memberId of data.members) {
        if (memberId !== userId) {
          await this.channelRepository.addMember(channel.id, memberId);
        }
      }
    }

    return channel;
  }

  async getUserChannels(userId: string) {
    return this.channelRepository.findByUser(userId);
  }

  async getChannelDetails(channelId: string) {
    return this.channelRepository.findById(channelId);
  }

  async getChannelMessages(channelId: string) {
    return this.messageRepository.findByChannel(channelId);
  }

  async sendMessage(userId: string, data: SendChannelMessageInput) {
    return this.messageRepository.create({
      channelId: data.channelId,
      content: data.content,
      senderId: userId,
      attachments: data.attachments,
      parentId: data.parentId,
    });
  }

  async getThreadMessages(parentId: string) {
    return this.messageRepository.findReplies(parentId);
  }

  async updateChannel(id: string, data: Partial<CreateChannelInput>) {
    return this.channelRepository.update(id, data);
  }

  async deleteChannel(id: string) {
    return this.channelRepository.delete(id);
  }

  async createDM(currentUser: string, targetUsers: string | string[]) {
    const targets = Array.isArray(targetUsers) ? targetUsers : [targetUsers];
    return this.channelRepository.findOrCreateConversation(
      currentUser,
      targets,
    );
  }

  async markMessagesAsRead(channelId: string, userId: string) {
    return this.channelRepository.markMessagesAsRead(channelId, userId);
  }

  async toggleFavorite(channelId: string, userId: string) {
    return this.channelRepository.toggleFavorite(channelId, userId);
  }

  async addMember(channelId: string, userId: string, role?: any) {
    return this.channelRepository.addMember(channelId, userId, role);
  }

  async archiveChannel(channelId: string, userId: string) {
    return this.channelRepository.archiveChannel(channelId, userId);
  }

  async hideChannel(channelId: string, userId: string) {
    return this.channelRepository.hideChannel(channelId, userId);
  }

  async leaveChannel(channelId: string, userId: string) {
    return this.channelRepository.leaveChannel(channelId, userId);
  }
}
