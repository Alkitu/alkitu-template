'use client';

import React from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Tooltip } from '../../../design-system/atoms/Tooltip';
import { Button } from '../../../design-system/primitives/button';
import { Badge } from '../../../design-system/primitives/badge';

/**
 * Tooltip Showcase Component
 * Demonstrates all Tooltip atom variants with different placements and triggers
 */
export function TooltipShowcase() {
  return (
    <div className="space-y-6">
      
      {/* Placements */}
      <ShowcaseContainer name="Placement Options" tokenId="placement-options">
        <div className="flex items-center justify-center gap-8 py-4 px-2">
          <Tooltip content="Tooltip on top" placement="top">
            <Button variant="outline">Top</Button>
          </Tooltip>
          
          <Tooltip content="Tooltip on right" placement="right">
            <Button variant="outline">Right</Button>
          </Tooltip>
          
          <Tooltip content="Tooltip on bottom" placement="bottom">
            <Button variant="outline">Bottom</Button>
          </Tooltip>
          
          <Tooltip content="Tooltip on left" placement="left">
            <Button variant="outline">Left</Button>
          </Tooltip>
        </div>
      </ShowcaseContainer>

      {/* Trigger Types */}
      <ShowcaseContainer name="Trigger Types" tokenId="trigger-types">
        <div className="flex items-center gap-6">
          <Tooltip content="Shows on hover" trigger="hover">
            <Button variant="secondary">Hover</Button>
          </Tooltip>
          
          <Tooltip content="Shows on click" trigger="click">
            <Button variant="secondary">Click</Button>
          </Tooltip>
          
          <Tooltip content="Shows on focus" trigger="focus">
            <Button variant="secondary">Focus</Button>
          </Tooltip>
        </div>
      </ShowcaseContainer>

      {/* With Different Elements */}
      <ShowcaseContainer name="Different Elements" tokenId="different-elements">
        <div className="flex items-center gap-4 flex-wrap">
          <Tooltip content="This is a primary button">
            <Button variant="default">Button</Button>
          </Tooltip>
          
          <Tooltip content="This badge shows status">
            <Badge variant="secondary">Badge</Badge>
          </Tooltip>
          
          <Tooltip content="Clickable text element">
            <span className="cursor-pointer text-primary underline">Text Link</span>
          </Tooltip>
          
          <Tooltip content="Icon with tooltip">
            <div className="cursor-pointer p-2 rounded-md hover:bg-muted">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
          </Tooltip>
        </div>
      </ShowcaseContainer>

      {/* Rich Content */}
      <ShowcaseContainer name="Rich Content" tokenId="rich-content">
        <div className="flex items-center gap-6">
          <Tooltip 
            content={
              <div>
                <div className="font-semibold mb-1">Rich Tooltip</div>
                <div className="text-sm opacity-90">This tooltip contains multiple lines and formatted content.</div>
              </div>
            }
          >
            <Button variant="outline">Rich Content</Button>
          </Tooltip>
          
          <Tooltip 
            content={
              <div className="text-center">
                <div className="text-lg mb-1">⚠️</div>
                <div className="text-sm">Warning message with emoji</div>
              </div>
            }
          >
            <Button variant="destructive">Warning</Button>
          </Tooltip>
        </div>
      </ShowcaseContainer>

      {/* Arrow Options */}
      <ShowcaseContainer name="Arrow Options" tokenId="arrow-options">
        <div className="flex items-center gap-6">
          <Tooltip content="Tooltip with arrow" showArrow={true}>
            <Button variant="outline">With Arrow</Button>
          </Tooltip>
          
          <Tooltip content="Tooltip without arrow" showArrow={false}>
            <Button variant="outline">No Arrow</Button>
          </Tooltip>
        </div>
      </ShowcaseContainer>

      {/* Delay Options */}
      <ShowcaseContainer name="Delay Options" tokenId="delay-options">
        <div className="flex items-center gap-6">
          <Tooltip content="Instant tooltip" delay={0}>
            <Button variant="outline">No Delay</Button>
          </Tooltip>
          
          <Tooltip content="Short delay tooltip" delay={100}>
            <Button variant="outline">100ms</Button>
          </Tooltip>
          
          <Tooltip content="Long delay tooltip" delay={1000}>
            <Button variant="outline">1000ms</Button>
          </Tooltip>
        </div>
      </ShowcaseContainer>

    </div>
  );
}

export default TooltipShowcase;