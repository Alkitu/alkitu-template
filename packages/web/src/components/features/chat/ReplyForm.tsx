import { useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Textarea } from '@/components/atoms-alianza/Textarea';
import { Send } from 'lucide-react';

interface ReplyFormProps {
  onSend: (content: string) => void;
  isLoading: boolean;
}

export function ReplyForm({ onSend, isLoading }: ReplyFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply..."
          rows={3}
          disabled={isLoading}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isLoading ? 'Sending...' : 'Send Reply'}
          </Button>
        </div>
      </form>
    </div>
  );
}
