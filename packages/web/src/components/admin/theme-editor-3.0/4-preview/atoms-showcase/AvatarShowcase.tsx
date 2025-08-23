'use client';

import React from 'react';
import { Avatar } from '../../atoms/Avatar';

interface AvatarContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function AvatarContainer({ name, tokenId, children }: AvatarContainerProps) {
  return (
    <div className="flex flex-col gap-2 p-3 border border-border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {name}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {tokenId}
        </span>
      </div>
      <div className="flex items-center justify-center min-h-[60px]">
        {children}
      </div>
    </div>
  );
}

export function AvatarShowcase() {
  const sampleImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* With Image */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <AvatarContainer name="With Image" tokenId="avatar-image">
          <Avatar src={sampleImage} alt="John Doe" />
        </AvatarContainer>
      </div>

      {/* With Initials */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <AvatarContainer name="With Initials" tokenId="avatar-initials">
          <Avatar fallback="John Doe" />
        </AvatarContainer>
      </div>

      {/* With Status */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <AvatarContainer name="With Status" tokenId="avatar-status">
          <Avatar 
            src={sampleImage} 
            alt="Online user"
            status="online"
          />
        </AvatarContainer>
      </div>
    </div>
  );
}