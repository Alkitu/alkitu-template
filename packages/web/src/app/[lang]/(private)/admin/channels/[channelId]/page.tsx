'use client';

import { use } from 'react';
import { ChannelChatArea } from '@/components/features/channels/ChannelChatArea';

interface PageProps {
  params: Promise<{
    channelId: string;
  }>;
}

export default function ChannelPage({ params }: PageProps) {
  const { channelId } = use(params);
  return <ChannelChatArea channelId={channelId} />;
}
