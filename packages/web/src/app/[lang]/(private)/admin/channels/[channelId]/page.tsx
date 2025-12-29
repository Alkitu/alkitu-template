'use client';

import { use } from 'react';
import { ChannelChatArea } from '@/components/features/channels/ChannelChatArea';
import { useSidebarCollapse } from '@/components/features/channels/ChannelSidebar';

interface PageProps {
  params: Promise<{
    channelId: string;
  }>;
}

export default function ChannelPage({ params }: PageProps) {
  const { channelId } = use(params);
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();
  
  return <ChannelChatArea channelId={channelId} onToggleSidebar={toggleCollapse} isSidebarCollapsed={isCollapsed} />;
}
