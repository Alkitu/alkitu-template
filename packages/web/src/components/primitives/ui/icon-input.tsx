'use client';

import * as React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { IconSelector } from './icon-selector';
import { Ban } from 'lucide-react';
import { Icons } from '@/lib/icons';
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

  // Get icon component if it exists
  const IconComponent = value ? Icons[value as keyof typeof Icons] : null;

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium">{label}</div>}
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
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
          variant="outline"
          className="flex-1 justify-start gap-2"
          onClick={() => setShowSelector(true)}
        >
          {IconComponent ? (
            <>
              <IconComponent className="h-4 w-4" />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Seleccionar icono</span>
          )}
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
