'use client';

import React from 'react';
import { ProgressBar } from '../../../design-system/atoms/ProgressBar';

interface ProgressContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function ProgressContainer({ name, tokenId, children }: ProgressContainerProps) {
  return (
    <div 
      className="flex flex-col gap-2 p-3 border border-border bg-background"
      style={{ borderRadius: 'var(--radius-card, 8px)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {name}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {tokenId}
        </span>
      </div>
      <div className="flex items-center justify-center min-h-[40px] w-full">
        {children}
      </div>
    </div>
  );
}

export function ProgressBarShowcase() {
  const [animatedProgress, setAnimatedProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* Basic Progress */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ProgressContainer name="Basic" tokenId="progress-basic">
          <div className="w-full">
            <ProgressBar value={65} />
          </div>
        </ProgressContainer>
      </div>

      {/* With Label */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ProgressContainer name="With Label" tokenId="progress-label">
          <div className="w-full">
            <ProgressBar 
              value={75} 
              label="Profile completion"
              showLabel
              showPercentage
            />
          </div>
        </ProgressContainer>
      </div>

      {/* Animated Loading */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ProgressContainer name="Animated Loading" tokenId="progress-animated">
          <div className="w-full">
            <ProgressBar 
              value={animatedProgress} 
              label="Loading..."
              showLabel
              showPercentage
              variant="default"
              animated
            />
          </div>
        </ProgressContainer>
      </div>
    </div>
  );
}