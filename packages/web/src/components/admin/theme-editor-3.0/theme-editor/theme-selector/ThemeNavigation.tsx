'use client';

import React from 'react';
import { Button } from '../../design-system/primitives/button';
import { Icon } from '../../design-system/atoms/Icon';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Separator } from '../../design-system/primitives/separator';

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
        className="group h-8 aspect-square flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
        onClick={onRandom}
        title="Random theme"
      >
        <Icon
          icon={Shuffle}
          size="sm"
          variant="muted"
          className="group-hover:text-foreground transition-colors"
        />
      </Button>
      
      <Separator orientation="vertical" className="h-4 bg-border" />
      
      {/* Previous button */}
      <Button
        variant="ghost"
        size="sm"
        className="group h-8 aspect-square flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:text-muted-foreground/50"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        title="Previous theme"
      >
        <Icon
          icon={ChevronLeft}
          size="sm"
          variant={!canGoPrevious ? 'muted' : 'default'}
          className={!canGoPrevious ? '' : 'group-hover:text-foreground transition-colors'}
        />
      </Button>

      {/* Next button */}
      <Button
        variant="ghost"
        size="sm"
        className="group h-8 aspect-square flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:text-muted-foreground/50"
        onClick={onNext}
        disabled={!canGoNext}
        title="Next theme"
      >
        <Icon
          icon={ChevronRight}
          size="sm"
          variant={!canGoNext ? 'muted' : 'default'}
          className={!canGoNext ? '' : 'group-hover:text-foreground transition-colors'}
        />
      </Button>
    </div>
  );
}