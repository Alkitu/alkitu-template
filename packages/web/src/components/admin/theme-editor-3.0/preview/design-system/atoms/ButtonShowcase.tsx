'use client';

import React from 'react';
import { Button } from '../../../design-system/atoms/Button';
import { ButtonContainer } from './ButtonContainer';

export function ButtonShowcase() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Título principal */}
      <div className="flex justify-center">
        <h2 
          className="text-2xl font-bold mb-2 text-foreground text-center"
          style={{ 
            fontFamily: 'var(--typography-h2-font-family)',
            fontSize: 'var(--typography-h2-font-size)',
            fontWeight: 'var(--typography-h2-font-weight)',
            letterSpacing: 'var(--typography-h2-letter-spacing)'
          }}
        >
          Buttons
        </h2>
      </div>

      {/* Grid responsive de botones con flexbox */}
      <div className="flex flex-wrap gap-4 justify-start">
        
        {/* Button Primary */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ButtonContainer name="Primary Button" tokenId="btn-primary">
            <Button variant="default">Primary</Button>
          </ButtonContainer>
        </div>

        {/* Button Outline */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ButtonContainer name="Outline Button" tokenId="btn-outline">
            <Button variant="outline">Outline</Button>
          </ButtonContainer>
        </div>

        {/* Button Ghost */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ButtonContainer name="Ghost Button" tokenId="btn-ghost">
            <Button variant="ghost">Ghost</Button>
          </ButtonContainer>
        </div>

        {/* Button Secondary */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ButtonContainer name="Secondary Button" tokenId="btn-secondary">
            <Button variant="secondary">Secondary</Button>
          </ButtonContainer>
        </div>

        {/* Button Destructive */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ButtonContainer name="Destructive Button" tokenId="btn-destructive">
            <Button variant="destructive">Destructive</Button>
          </ButtonContainer>
        </div>

        {/* Button Icon */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ButtonContainer name="Icon Button" tokenId="btn-icon">
            <Button variant="icon" size="icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </Button>
          </ButtonContainer>
        </div>

        {/* Button Loading */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ButtonContainer name="Loading Button" tokenId="btn-loading">
            <Button loading={true}>Loading</Button>
          </ButtonContainer>
        </div>

        {/* Button Disabled */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ButtonContainer name="Disabled Button" tokenId="btn-disabled">
            <Button disabled>Disabled</Button>
          </ButtonContainer>
        </div>

      </div>

    </div>
  );
}