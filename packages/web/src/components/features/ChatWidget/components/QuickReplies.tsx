'use client';

import { Button } from '@/components/primitives/ui/button';

interface QuickReply {
  id: string;
  text: string;
  value?: string;
}

interface QuickRepliesProps {
  options: QuickReply[];
  onSelect: (reply: QuickReply) => void;
  primaryColor?: string;
}

export function QuickReplies({ options, onSelect, primaryColor = '#22c55e' }: QuickRepliesProps) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="outline"
          size="sm"
          className="justify-start text-left h-auto py-2 px-3 border-2 hover:shadow-sm transition-all"
          style={{
            borderColor: `${primaryColor}40`,
            color: primaryColor,
          }}
          onClick={() => onSelect(option)}
        >
          {option.text}
        </Button>
      ))}
    </div>
  );
}

// Predefined quick replies for common scenarios
export const defaultQuickReplies: QuickReply[] = [
  { id: '1', text: 'I have a question', value: 'I have a question' },
  { id: '2', text: 'I need help', value: 'I need help' },
  { id: '3', text: 'Tell me more', value: 'Tell me more' },
  { id: '4', text: 'I have a different question', value: 'I have a different question' },
];
