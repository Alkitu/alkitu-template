'use client';

import React from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Spinner } from '@/components/atoms-alianza/Spinner';

/**
 * Spinner Showcase Component
 * Demonstrates all Spinner atom variants with different types, sizes and colors
 */
export function SpinnerShowcase() {
  return (
    <div className="space-y-6">
      
      {/* Spinner Types */}
      <ShowcaseContainer name="Spinner Types" tokenId="spinner-types">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <Spinner type="circular" variant="primary" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">Circular</p>
          </div>
          <div className="text-center">
            <Spinner type="dots" variant="primary" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">Dots</p>
          </div>
          <div className="text-center">
            <Spinner type="pulse" variant="primary" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">Pulse</p>
          </div>
        </div>
      </ShowcaseContainer>

      {/* Color Variants */}
      <ShowcaseContainer name="Color Variants" tokenId="color-variants">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-center">
            <Spinner variant="default" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">default</p>
          </div>
          <div className="text-center">
            <Spinner variant="primary" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">primary</p>
          </div>
          <div className="text-center">
            <Spinner variant="secondary" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">secondary</p>
          </div>
          <div className="text-center">
            <Spinner variant="accent" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">accent</p>
          </div>
          <div className="text-center">
            <Spinner variant="muted" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">muted</p>
          </div>
          <div className="text-center">
            <Spinner variant="destructive" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">destructive</p>
          </div>
          <div className="text-center">
            <Spinner variant="warning" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">warning</p>
          </div>
          <div className="text-center">
            <Spinner variant="success" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">success</p>
          </div>
        </div>
      </ShowcaseContainer>

      {/* Animation Speeds */}
      <ShowcaseContainer name="Animation Speed" tokenId="animation-speed">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <Spinner speed="slow" variant="primary" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">slow (2s)</p>
          </div>
          <div className="text-center">
            <Spinner speed="normal" variant="primary" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">normal (1s)</p>
          </div>
          <div className="text-center">
            <Spinner speed="fast" variant="primary" size="lg" />
            <p className="text-xs mt-2 text-muted-foreground">fast (0.5s)</p>
          </div>
        </div>
      </ShowcaseContainer>

      {/* Different Types with Different Colors */}
      <ShowcaseContainer name="Type & Color Combinations" tokenId="type-color-combinations">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <Spinner type="circular" variant="primary" size="xl" />
            <p className="text-xs mt-2 text-muted-foreground">Circular Primary</p>
          </div>
          <div className="text-center">
            <Spinner type="dots" variant="success" size="xl" />
            <p className="text-xs mt-2 text-muted-foreground">Dots Success</p>
          </div>
          <div className="text-center">
            <Spinner type="pulse" variant="warning" size="xl" />
            <p className="text-xs mt-2 text-muted-foreground">Pulse Warning</p>
          </div>
        </div>
      </ShowcaseContainer>

    </div>
  );
}

export default SpinnerShowcase;