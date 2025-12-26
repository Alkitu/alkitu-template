import { MessageSquare } from 'lucide-react';

export default function ChannelsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <div className="bg-gray-50 p-6 rounded-full mb-4">
        <MessageSquare className="w-12 h-12 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-600">Select a channel</h3>
      <p className="text-sm">Choose a channel from the sidebar to start chatting.</p>
    </div>
  );
}
