'use client';

import React from 'react';
import { Avatar } from '../../../design-system/atoms/Avatar';
import { ShowcaseContainer } from './ShowcaseContainer';

export function AvatarShowcase() {
  const sampleImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* With Image */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="With Image" tokenId="avatar-image">
          <Avatar src={sampleImage} alt="John Doe" />
        </ShowcaseContainer>
      </div>

      {/* With Initials */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="With Initials" tokenId="avatar-initials">
          <Avatar fallback="John Doe" />
        </ShowcaseContainer>
      </div>

      {/* With Status */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="With Status" tokenId="avatar-status">
          <Avatar 
            src={sampleImage} 
            alt="Online user"
            status="online"
          />
        </ShowcaseContainer>
      </div>
    </div>
  );
}