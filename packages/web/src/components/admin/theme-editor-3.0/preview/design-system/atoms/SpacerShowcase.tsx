'use client';

import React from 'react';
import { Spacer } from '../../../design-system/atoms/Spacer';
import { ShowcaseContainer } from './ShowcaseContainer';

export function SpacerShowcase() {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* Vertical Spacers */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Vertical Spacers" tokenId="spacer-vertical">
          <div className="flex flex-col items-center w-full">
            <div className="text-xs text-muted-foreground">Start</div>
            <Spacer size="xs" />
            <div className="text-xs bg-primary/10 px-2 py-1 rounded">XS</div>
            <Spacer size="sm" />
            <div className="text-xs bg-secondary/10 px-2 py-1 rounded">SM</div>
            <Spacer size="md" />
            <div className="text-xs bg-accent/10 px-2 py-1 rounded">MD</div>
            <Spacer size="lg" />
            <div className="text-xs bg-primary/10 px-2 py-1 rounded">LG</div>
            <div className="text-xs text-muted-foreground">End</div>
          </div>
        </ShowcaseContainer>
      </div>

      {/* Horizontal Spacers */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Horizontal Spacers" tokenId="spacer-horizontal">
          <div className="flex items-center justify-center w-full">
            <div className="text-xs text-muted-foreground">Start</div>
            <Spacer size="xs" direction="horizontal" />
            <div className="text-xs bg-primary/10 px-1 py-1 rounded">XS</div>
            <Spacer size="sm" direction="horizontal" />
            <div className="text-xs bg-secondary/10 px-1 py-1 rounded">SM</div>
            <Spacer size="md" direction="horizontal" />
            <div className="text-xs bg-accent/10 px-1 py-1 rounded">MD</div>
            <div className="text-xs text-muted-foreground">End</div>
          </div>
        </ShowcaseContainer>
      </div>

      {/* Custom Spacing */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Custom Spacing" tokenId="spacer-custom">
          <div className="flex flex-col items-center w-full">
            <div className="text-xs text-muted-foreground">Component A</div>
            <Spacer spacing="32px" />
            <div className="text-xs bg-destructive/10 px-2 py-1 rounded">32px Custom</div>
            <Spacer spacing="1rem" />
            <div className="text-xs bg-muted px-2 py-1 rounded">1rem Custom</div>
            <div className="text-xs text-muted-foreground">Component B</div>
          </div>
        </ShowcaseContainer>
      </div>

      {/* Both Directions */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Both Directions" tokenId="spacer-both">
          <div className="flex flex-col items-center w-full">
            <div className="text-xs text-muted-foreground">Square spacers</div>
            <div className="flex items-center">
              <div className="text-xs bg-primary/10 px-1 py-1 rounded">A</div>
              <Spacer size="sm" direction="both" />
              <div className="text-xs bg-secondary/10 px-1 py-1 rounded">B</div>
              <Spacer size="md" direction="both" />
              <div className="text-xs bg-accent/10 px-1 py-1 rounded">C</div>
            </div>
          </div>
        </ShowcaseContainer>
      </div>

      {/* Size Comparison */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Size Scale" tokenId="spacer-scale">
          <div className="flex flex-col items-start w-full space-y-2">
            <div className="flex items-center w-full">
              <span className="text-xs w-8">XS:</span>
              <div className="bg-border h-px flex-1 relative">
                <Spacer size="xs" direction="horizontal" className="bg-primary h-px" />
              </div>
            </div>
            <div className="flex items-center w-full">
              <span className="text-xs w-8">SM:</span>
              <div className="bg-border h-px flex-1 relative">
                <Spacer size="sm" direction="horizontal" className="bg-secondary h-px" />
              </div>
            </div>
            <div className="flex items-center w-full">
              <span className="text-xs w-8">MD:</span>
              <div className="bg-border h-px flex-1 relative">
                <Spacer size="md" direction="horizontal" className="bg-accent h-px" />
              </div>
            </div>
            <div className="flex items-center w-full">
              <span className="text-xs w-8">LG:</span>
              <div className="bg-border h-px flex-1 relative">
                <Spacer size="lg" direction="horizontal" className="bg-primary h-px" />
              </div>
            </div>
          </div>
        </ShowcaseContainer>
      </div>

      {/* Responsive Usage */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Responsive Layout" tokenId="spacer-responsive">
          <div className="w-full">
            <div className="text-xs text-muted-foreground mb-2">Layout example:</div>
            <div className="border border-dashed border-border p-2 rounded">
              <div className="text-xs bg-card px-2 py-1 rounded border">Header</div>
              <Spacer size="md" />
              <div className="text-xs bg-card px-2 py-1 rounded border">Content</div>
              <Spacer size="sm" />
              <div className="text-xs bg-card px-2 py-1 rounded border">Footer</div>
            </div>
          </div>
        </ShowcaseContainer>
      </div>
    </div>
  );
}