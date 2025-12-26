'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/molecules/dropdown-menu';
import { Button } from '@/components/primitives/ui/button';
import { 
  Menu, 
  User, 
  Mail, 
  Volume2, 
  VolumeX,
  Maximize2,
  Code,
} from 'lucide-react';

interface ChatOptionsMenuProps {
  onChangeName?: () => void;
  onEmailTranscript?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPopOut?: () => void;
  onShowIntegration?: () => void;
  primaryColor?: string;
}

export function ChatOptionsMenu({
  onChangeName,
  onEmailTranscript,
  soundEnabled,
  onToggleSound,
  onPopOut,
  onShowIntegration,
  primaryColor = '#22c55e',
}: ChatOptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-white/20"
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {onChangeName && (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onChangeName}>
              <User className="mr-2 h-4 w-4" />
              Change Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}
        
        {onEmailTranscript && (
          <DropdownMenuItem onClick={onEmailTranscript}>
            <Mail className="mr-2 h-4 w-4" />
            Email transcript
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={onToggleSound}>
          {soundEnabled ? (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Sound On
            </>
          ) : (
            <>
              <VolumeX className="mr-2 h-4 w-4" />
              Sound Off
            </>
          )}
        </DropdownMenuItem>
        
        {onPopOut && (
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onPopOut}>
              <Maximize2 className="mr-2 h-4 w-4" />
              Pop out widget
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        
        {onShowIntegration && (
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onShowIntegration}>
              <Code className="mr-2 h-4 w-4" />
              Add Chat to your website
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
