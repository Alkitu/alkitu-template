import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelRepository } from './repositories/channel.repository';
import { ChannelMessageRepository } from './repositories/channel-message.repository';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    ChannelsService,
    ChannelRepository,
    ChannelMessageRepository,
  ],
  exports: [ChannelsService],
})
export class ChannelsModule {}
