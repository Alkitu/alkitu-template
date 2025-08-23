'use client';

import React from 'react';
import { Button } from '../../atoms/Button';

// Componente para mostrar cada botón con su información
interface ButtonContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function ButtonContainer({ name, tokenId, children }: ButtonContainerProps) {
  return (
    <div 
      className="border border-border p-3 bg-card/50"
      style={{ borderRadius: 'var(--radius)' }}
    >
      <div className="mb-3">
        <h4 className="text-sm font-medium text-foreground">{name}</h4>
        <code 
          className="text-xs text-muted-foreground font-mono bg-muted px-1 py-0.5"
          style={{ borderRadius: 'calc(var(--radius) * 0.5)' }}
        >
          {tokenId}
        </code>
      </div>
      <div className="flex items-center justify-center p-2">
        {children}
      </div>
    </div>
  );
}

export function ButtonShowcase() {
  return (
    <div className="space-y-6">
      {/* Título principal */}
      <div className="text-center">
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ 
            color: 'oklch(var(--foreground))',
            fontFamily: 'var(--typography-h2-font-family)',
            fontSize: 'var(--typography-h2-font-size)',
            fontWeight: 'var(--typography-h2-font-weight)',
            letterSpacing: 'var(--typography-h2-letter-spacing)'
          }}
        >
          Buttons
        </h2>
        <p className="text-sm text-muted-foreground">
          Sistema de botones conectado al Theme Editor
        </p>
      </div>

      {/* Grid de botones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Button Primary */}
        <ButtonContainer name="Primary Button" tokenId="btn-primary">
          <Button variant="default">Primary</Button>
        </ButtonContainer>

        {/* Button Outline */}
        <ButtonContainer name="Outline Button" tokenId="btn-outline">
          <Button variant="outline">Outline</Button>
        </ButtonContainer>

        {/* Button Ghost */}
        <ButtonContainer name="Ghost Button" tokenId="btn-ghost">
          <Button variant="ghost">Ghost</Button>
        </ButtonContainer>

        {/* Button Secondary */}
        <ButtonContainer name="Secondary Button" tokenId="btn-secondary">
          <Button variant="secondary">Secondary</Button>
        </ButtonContainer>

        {/* Button Destructive */}
        <ButtonContainer name="Destructive Button" tokenId="btn-destructive">
          <Button variant="destructive">Destructive</Button>
        </ButtonContainer>

        {/* Button Icon */}
        <ButtonContainer name="Icon Button" tokenId="btn-icon">
          <Button variant="icon" size="icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </Button>
        </ButtonContainer>

        {/* Button Loading */}
        <ButtonContainer name="Loading Button" tokenId="btn-loading">
          <Button loading={true}>Loading</Button>
        </ButtonContainer>

        {/* Button Disabled */}
        <ButtonContainer name="Disabled Button" tokenId="btn-disabled">
          <Button disabled>Disabled</Button>
        </ButtonContainer>

      </div>

      {/* Separador para el siguiente átomo */}
      <div className="pt-8">
        <hr 
          className="border-t" 
          style={{ 
            borderColor: 'oklch(var(--border))',
            marginBottom: '2rem'
          }} 
        />
        <div className="text-center text-sm text-muted-foreground mb-4">
          Siguiente átomo
        </div>
      </div>
    </div>
  );
}