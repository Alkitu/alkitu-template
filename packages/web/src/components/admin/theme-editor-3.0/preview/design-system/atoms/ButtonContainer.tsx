'use client';

import React from 'react';

// Componente para mostrar cada botón con su información de token
interface ButtonContainerProps {
  name?: string;
  tokenId: string;
  children: React.ReactNode;
}

export function ButtonContainer({ name, tokenId, children }: ButtonContainerProps) {
  return (
    <div 
      className="border border-border p-3 bg-card/50 flex flex-col min-w-0"
      style={{ borderRadius: 'var(--radius)' }}
      data-token={tokenId}
    >
      {name && (
        <div className="flex flex-col gap-1 mb-3">
          <h4 className="text-sm font-medium text-foreground min-w-0 truncate">{name}</h4>
          <code 
            className="text-xs text-muted-foreground font-mono bg-muted px-1 py-0.5 self-start"
            style={{ borderRadius: 'calc(var(--radius) * 0.5)' }}
          >
            {tokenId}
          </code>
        </div>
      )}
      <div className="flex items-center justify-center p-2 flex-1">
        {children}
      </div>
    </div>
  );
}