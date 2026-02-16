'use client';

import * as React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { IconSelector } from './icon-selector';
import { Ban } from 'lucide-react';
import { Icons } from '@/lib/icons';
import { isEmoji, findEmojiByChar } from '@/lib/emojis';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/primitives/ui/tooltip';

interface IconInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  defaultIcon?: string;
}

export function IconInput({
  value,
  onChange,
  label,
  defaultIcon,
}: IconInputProps) {
  const [showSelector, setShowSelector] = React.useState(false);

  // Determine if value is an emoji or a Lucide icon name
  const valueIsEmoji = value ? isEmoji(value) : false;
  const IconComponent = value && !valueIsEmoji ? Icons[value as keyof typeof Icons] : null;
  const emojiInfo = value && valueIsEmoji ? findEmojiByChar(value) : null;

  const renderSelectedValue = () => {
    if (valueIsEmoji) {
      return (
        <>
          <span className="text-lg leading-none">{value}</span>
          <span className="truncate">{emojiInfo?.name || 'Emoji'}</span>
        </>
      );
    }
    if (IconComponent) {
      return (
        <>
          <IconComponent className="h-4 w-4 shrink-0" />
          <span className="truncate">{value}</span>
        </>
      );
    }
    return <span className="text-muted-foreground">Seleccionar icono</span>;
  };

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium">{label}</div>}
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onChange('')}
              >
                <Ban className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quitar icono</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          type="button"
          variant="outline"
          className="flex-1 justify-start gap-2"
          onClick={() => setShowSelector(true)}
        >
          {renderSelectedValue()}
        </Button>
      </div>

      <IconSelector
        open={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={onChange}
      />
    </div>
  );
}
