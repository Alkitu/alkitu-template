'use client';

import React from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { PreviewImage } from '../../../design-system/atoms/PreviewImage';

/**
 * Preview Image Showcase Component
 * Demonstrates all Preview Image atom variants with different aspect ratios and states
 */
export function PreviewImageShowcase() {
  // Sample image URL - using the same landscape image for all examples
  const landscapeImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
  const sampleImage = landscapeImage; // Use the same image for all samples

  return (
    <div className="space-y-6">
      
      {/* Aspect Ratios */}
      <ShowcaseContainer name="Aspect Ratios" tokenId="aspect-ratios">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="text-center">
            <PreviewImage
              src={sampleImage}
              alt="Square aspect ratio"
              aspectRatio="square"
              size="md"
            />
            <p className="text-xs mt-2 text-muted-foreground">Square (1:1)</p>
          </div>
          <div className="text-center">
            <PreviewImage
              src={landscapeImage}
              alt="4:3 aspect ratio"
              aspectRatio="4:3"
              size="md"
            />
            <p className="text-xs mt-2 text-muted-foreground">4:3</p>
          </div>
          <div className="text-center">
            <PreviewImage
              src={landscapeImage}
              alt="16:9 aspect ratio"
              aspectRatio="16:9"
              size="md"
            />
            <p className="text-xs mt-2 text-muted-foreground">16:9</p>
          </div>
          <div className="text-center">
            <PreviewImage
              src={landscapeImage}
              alt="3:2 aspect ratio"
              aspectRatio="3:2"
              size="md"
            />
            <p className="text-xs mt-2 text-muted-foreground">3:2</p>
          </div>
        </div>
      </ShowcaseContainer>


      {/* Object Fit */}
      <ShowcaseContainer name="Object Fit" tokenId="object-fit">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
          <div className="text-center">
            <PreviewImage
              src={sampleImage}
              alt="Cover fit"
              aspectRatio="16:9"
              size="md"
              objectFit="cover"
            />
            <p className="text-xs mt-2 text-muted-foreground">cover</p>
          </div>
          <div className="text-center">
            <PreviewImage
              src={sampleImage}
              alt="Contain fit"
              aspectRatio="16:9"
              size="md"
              objectFit="contain"
            />
            <p className="text-xs mt-2 text-muted-foreground">contain</p>
          </div>
          <div className="text-center">
            <PreviewImage
              src={sampleImage}
              alt="Fill fit"
              aspectRatio="16:9"
              size="md"
              objectFit="fill"
            />
            <p className="text-xs mt-2 text-muted-foreground">fill</p>
          </div>
        </div>
      </ShowcaseContainer>

      {/* States */}
      <ShowcaseContainer name="States" tokenId="states">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-center" style={{ width: '128px' }}>
            <PreviewImage
              aspectRatio="square"
              size="md"
              alt="No image"
            />
            <p className="text-xs mt-1 text-muted-foreground">No image</p>
          </div>
          <div className="text-center" style={{ width: '128px' }}>
            <PreviewImage
              aspectRatio="square"
              size="md"
              loading={true}
              alt="Loading"
            />
            <p className="text-xs mt-1 text-muted-foreground">Loading</p>
          </div>
          <div className="text-center" style={{ width: '128px' }}>
            <PreviewImage
              src="https://invalid-url.jpg"
              aspectRatio="square"
              size="md"
              alt="Error state"
            />
            <p className="text-xs mt-1 text-muted-foreground">Error</p>
          </div>
          <div className="text-center" style={{ width: '128px' }}>
            <PreviewImage
              src={sampleImage}
              aspectRatio="square"
              size="md"
              alt="Success state"
            />
            <p className="text-xs mt-1 text-muted-foreground">Success</p>
          </div>
        </div>
      </ShowcaseContainer>


    </div>
  );
}

export default PreviewImageShowcase;