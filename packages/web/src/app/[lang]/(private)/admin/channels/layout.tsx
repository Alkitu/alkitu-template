'use client';

import { ChannelSidebar } from '@/components/features/channels/ChannelSidebar';

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Force height calculation to account for dashboard header and padding
    // Header (64px) + Padding (48px) approx + spacing
    <div className="flex w-full bg-white overflow-hidden h-[calc(100vh-64px)] border rounded-md shadow-sm">
      <ChannelSidebar />
      <main className="flex-1 min-w-0 flex flex-col bg-white">
        {children}
      </main>
    </div>
  );
}
