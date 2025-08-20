'use client';

import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Separator } from '../ui/separator';

interface ThemeNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onRandom: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  className?: string;
}

export function ThemeNavigation({
  onPrevious,
  onNext,
  onRandom,
  canGoPrevious = true,
  canGoNext = true,
  className = ""
}: ThemeNavigationProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Random button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
        onClick={onRandom}
        title="Random theme"
      >
        <Shuffle className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-4 bg-border" />
      
      {/* Previous button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted disabled:text-muted-foreground/50"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        title="Previous theme"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Next button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted disabled:text-muted-foreground/50"
        onClick={onNext}
        disabled={!canGoNext}
        title="Next theme"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}