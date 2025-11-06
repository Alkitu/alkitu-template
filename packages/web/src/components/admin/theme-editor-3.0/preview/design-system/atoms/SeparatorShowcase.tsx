'use client';

import React from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Separator } from '../../../design-system/atoms/Separator';

/**
 * Separator Showcase Component
 * Demonstrates all Separator atom variants and orientations
 */
export function SeparatorShowcase() {
  return (
    <div className="space-y-6">
      
      {/* Basic Separators */}
      <ShowcaseContainer name="Basic Separators" tokenId="basic-separators">
        <div className="w-full space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Horizontal (default)</p>
            <div className="space-y-2">
              <p className="text-sm">Content above separator</p>
              <Separator />
              <p className="text-sm">Content below separator</p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-2">Vertical</p>
            <div className="flex items-center gap-4 h-16">
              <span className="text-sm">Left content</span>
              <Separator orientation="vertical" length="40px" />
              <span className="text-sm">Right content</span>
            </div>
          </div>
        </div>
      </ShowcaseContainer>

      {/* Sizes */}
      <ShowcaseContainer name="Sizes" tokenId="separator-sizes">
        <div className="w-full space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Thin (default)</p>
            <Separator size="thin" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Medium</p>
            <Separator size="medium" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Thick</p>
            <Separator size="thick" />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Color Variants */}
      <ShowcaseContainer name="Color Variants" tokenId="color-variants">
        <div className="w-full space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Default</p>
            <Separator variant="default" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Muted</p>
            <Separator variant="muted" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Primary</p>
            <Separator variant="primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Secondary</p>
            <Separator variant="secondary" />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Styles */}
      <ShowcaseContainer name="Styles" tokenId="separator-styles">
        <div className="w-full space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Solid (default)</p>
            <Separator style="solid" size="medium" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Dashed</p>
            <Separator style="dashed" size="medium" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Dotted</p>
            <Separator style="dotted" size="thick" />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Decorative Separators */}
      <ShowcaseContainer name="Decorative Separators" tokenId="decorative-separators">
        <div className="w-full space-y-6">
          <div>
            <p className="text-xs text-muted-foreground mb-3">With Label</p>
            <Separator decorative label="Section Break" />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">With Custom Label</p>
            <Separator decorative label="OR" variant="primary" />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Dots Only</p>
            <Separator decorative />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Vertical Separators */}
      <ShowcaseContainer name="Vertical Separators" tokenId="vertical-separators">
        <div className="flex items-center justify-center gap-6 h-24">
          <div className="text-center">
            <span className="text-sm">Thin</span>
            <Separator orientation="vertical" size="thin" length="60px" />
          </div>
          
          <div className="text-center">
            <span className="text-sm">Medium</span>
            <Separator orientation="vertical" size="medium" length="60px" />
          </div>
          
          <div className="text-center">
            <span className="text-sm">Thick</span>
            <Separator orientation="vertical" size="thick" length="60px" />
          </div>
          
          <div className="text-center">
            <span className="text-sm">Primary</span>
            <Separator orientation="vertical" variant="primary" length="60px" />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Real World Usage */}
      <ShowcaseContainer name="Real World Usage" tokenId="real-world-usage">
        <div className="w-full space-y-6">
          {/* Navigation Menu */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Navigation Menu</p>
            <div className="flex items-center gap-4">
              <button className="text-sm hover:text-primary">Home</button>
              <Separator orientation="vertical" length="16px" variant="muted" />
              <button className="text-sm hover:text-primary">Products</button>
              <Separator orientation="vertical" length="16px" variant="muted" />
              <button className="text-sm hover:text-primary">About</button>
              <Separator orientation="vertical" length="16px" variant="muted" />
              <button className="text-sm hover:text-primary">Contact</button>
            </div>
          </div>

          {/* Article Sections */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Article Sections</p>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Introduction</h4>
                <p className="text-muted-foreground">This is the introduction section with some sample content.</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Main Content</h4>
                <p className="text-muted-foreground">This is the main content section with detailed information.</p>
              </div>
              <Separator decorative label="Related Articles" />
              <div>
                <h4 className="font-semibold mb-2">Conclusion</h4>
                <p className="text-muted-foreground">This is the conclusion section wrapping up the content.</p>
              </div>
            </div>
          </div>
        </div>
      </ShowcaseContainer>

    </div>
  );
}

export default SeparatorShowcase;