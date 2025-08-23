'use client';

import React from 'react';
import { Input } from '../../atoms/Input';
import { Search, Mail, Lock, User, Phone, Calendar } from 'lucide-react';

// Componente para mostrar cada input con su información
interface InputContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function InputContainer({ name, tokenId, children }: InputContainerProps) {
  return (
    <div 
      className="border border-border p-3 bg-card/50 flex flex-col min-w-0"
      style={{ borderRadius: 'var(--radius)' }}
    >
      <div className="flex flex-col gap-1 mb-3">
        <h4 className="text-sm font-medium text-foreground min-w-0 truncate">{name}</h4>
        <code 
          className="text-xs text-muted-foreground font-mono bg-muted px-1 py-0.5 self-start"
          style={{ borderRadius: 'calc(var(--radius) * 0.5)' }}
        >
          {tokenId}
        </code>
      </div>
      <div className="p-2 flex-1">
        {children}
      </div>
    </div>
  );
}

export function InputShowcase() {

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
          Inputs
        </h2>
      </div>

      {/* Grid responsive de inputs con flexbox */}
      <div className="flex flex-wrap gap-4 justify-start">
        
        {/* Input Default */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Default Input" tokenId="input-default">
            <Input placeholder="Enter text..." />
          </InputContainer>
        </div>

        {/* Input with Left Icon */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Input with Icon" tokenId="input-with-icon">
            <Input 
              placeholder="Search..." 
              leftIcon={<Search className="h-4 w-4" />}
            />
          </InputContainer>
        </div>

        {/* Email Input */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Email Input" tokenId="input-email">
            <Input 
              type="email"
              placeholder="Enter email..." 
              leftIcon={<Mail className="h-4 w-4" />}
            />
          </InputContainer>
        </div>

        {/* Password Input */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Password Input" tokenId="input-password">
            <Input 
              placeholder="Enter password..." 
              leftIcon={<Lock className="h-4 w-4" />}
              showPasswordToggle={true}
            />
          </InputContainer>
        </div>

        {/* Error State */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Error Input" tokenId="input-error">
            <Input 
              placeholder="Invalid input..."
              isInvalid={true}
              leftIcon={<User className="h-4 w-4" />}
            />
          </InputContainer>
        </div>

        {/* Success State */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Success Input" tokenId="input-success">
            <Input 
              placeholder="Valid input..."
              isValid={true}
              leftIcon={<User className="h-4 w-4" />}
            />
          </InputContainer>
        </div>

        {/* Ghost Variant */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Ghost Input" tokenId="input-ghost">
            <Input 
              variant="ghost"
              placeholder="Ghost variant..."
            />
          </InputContainer>
        </div>

        {/* Filled Variant */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Filled Input" tokenId="input-filled">
            <Input 
              variant="filled"
              placeholder="Filled variant..."
            />
          </InputContainer>
        </div>

        {/* Small Size */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Small Input" tokenId="input-small">
            <Input 
              inputSize="sm"
              placeholder="Small size..."
              leftIcon={<Phone className="h-3 w-3" />}
            />
          </InputContainer>
        </div>

        {/* Large Size */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Large Input" tokenId="input-large">
            <Input 
              inputSize="lg"
              placeholder="Large size..."
              leftIcon={<Calendar className="h-5 w-5" />}
            />
          </InputContainer>
        </div>

        {/* Disabled State */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Disabled Input" tokenId="input-disabled">
            <Input 
              disabled
              placeholder="Disabled input..."
              leftIcon={<User className="h-4 w-4" />}
            />
          </InputContainer>
        </div>

        {/* Number Input */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <InputContainer name="Number Input" tokenId="input-number">
            <Input 
              type="number"
              placeholder="Enter number..."
              min="0"
              max="100"
            />
          </InputContainer>
        </div>

      </div>


    </div>
  );
}