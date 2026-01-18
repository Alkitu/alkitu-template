import React from 'react';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from '../primitives/figma/ImageWithFallback';

interface ImageUploadProps {
  src?: string;
  alt?: string;
  onUpload?: () => void;
  className?: string;
}

export function ImageUpload({ src, alt, onUpload, className }: ImageUploadProps) {
  if (src) {
    return (
      <div className={cn("relative rounded-[var(--radius-lg)] overflow-hidden w-[var(--size-image-upload-width)] h-[var(--size-image-upload-height)] shrink-0", className)}>
        <ImageWithFallback 
          src={src} 
          alt={alt || "Uploaded image"} 
          className="w-full h-full object-cover" 
        />
        {/* Border overlay to match design spec if needed, usually overflow-hidden handles radius */}
        <div className="absolute inset-0 rounded-[var(--radius-lg)] pointer-events-none border border-transparent" />
      </div>
    );
  }

  return (
    <button
      onClick={onUpload}
      className={cn(
        "flex flex-col items-center justify-center w-[var(--size-image-upload-width)] h-[var(--size-image-upload-height)] rounded-[var(--radius-lg)] border border-border bg-card-background-c hover:bg-accent-a/10 transition-colors shrink-0 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
        "px-[var(--space-4-5)] py-[var(--space-7)] gap-[var(--space-2)]", // Adjusted gap to bring text closer, spacing handled by margins
        className
      )}
    >
      {/* Icon */}
      <div className="mb-[var(--space-3-25)] shrink-0"> 
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.165 1.165V14.5" stroke="hsl(var(--primary-1))" strokeWidth="2.33" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.7208 6.72123L11.1646 1.165L5.60836 6.72123" stroke="hsl(var(--primary-1))" strokeWidth="2.33" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21.1674 14.5V18.9449C21.1674 19.5344 20.9333 20.0997 20.5165 20.5165C20.0997 20.9333 19.5344 21.1674 18.9449 21.1674H3.38749C2.79805 21.1674 2.23275 20.9333 1.81595 20.5165C1.39915 20.0997 1.165 19.5344 1.165 18.9449V14.5" stroke="hsl(var(--primary-1))" strokeWidth="2.33" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      
      {/* Text Group */}
      <div className="flex flex-col items-center gap-[var(--space-2)] w-full">
         <p className="body-sm text-base-foreground-b whitespace-nowrap">Subir fotos</p>
         <p className="body-xs text-muted-foreground-m">Antes y después</p>
      </div>
    </button>
  );
}
