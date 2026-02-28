'use client';

import React from 'react';
import { ProgressBar } from '@/components/atoms-alianza/ProgressBar';
import { ShowcaseContainer } from './ShowcaseContainer';

export function ProgressBarShowcase() {
  const [animatedProgress, setAnimatedProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* Basic Progress */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Basic" tokenId="progress-basic">
          <div className="w-full">
            <ProgressBar value={65} />
          </div>
        </ShowcaseContainer>
      </div>

      {/* With Label */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="With Label" tokenId="progress-label">
          <div className="w-full">
            <ProgressBar 
              value={75} 
              label="Profile completion"
              showLabel
              showPercentage
            />
          </div>
        </ShowcaseContainer>
      </div>

      {/* Animated Loading */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Animated Loading" tokenId="progress-animated">
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
        </ShowcaseContainer>
      </div>
    </div>
  );
}