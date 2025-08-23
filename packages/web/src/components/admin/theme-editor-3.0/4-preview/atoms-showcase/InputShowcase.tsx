'use client';

import React from 'react';
import { Input } from '../../atoms/Input';
import { Search, Mail, Lock, User, Phone, Calendar, AlertTriangle } from 'lucide-react';

// Componente para mostrar cada input con su información
interface InputContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function InputContainer({ name, tokenId, children }: InputContainerProps) {
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
      <div className="p-2">
        {children}
      </div>
    </div>
  );
}

export function InputShowcase() {

  return (
    <div className="space-y-6">
      {/* Título principal */}
      <div className="text-center">
        <h2 
          className="text-2xl font-bold mb-2 text-foreground"
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

      {/* Grid de inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Input Default */}
        <InputContainer name="Default Input" tokenId="input-default">
          <Input placeholder="Enter text..." />
        </InputContainer>

        {/* Input with Left Icon */}
        <InputContainer name="Input with Icon" tokenId="input-with-icon">
          <Input 
            placeholder="Search..." 
            leftIcon={<Search className="h-4 w-4" />}
          />
        </InputContainer>

        {/* Email Input */}
        <InputContainer name="Email Input" tokenId="input-email">
          <Input 
            type="email"
            placeholder="Enter email..." 
            leftIcon={<Mail className="h-4 w-4" />}
          />
        </InputContainer>

        {/* Password Input */}
        <InputContainer name="Password Input" tokenId="input-password">
          <Input 
            placeholder="Enter password..." 
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle={true}
          />
        </InputContainer>

        {/* Error State */}
        <InputContainer name="Error Input" tokenId="input-error">
          <Input 
            placeholder="Invalid input..."
            isInvalid={true}
            leftIcon={<User className="h-4 w-4" />}
          />
        </InputContainer>

        {/* Success State */}
        <InputContainer name="Success Input" tokenId="input-success">
          <Input 
            placeholder="Valid input..."
            isValid={true}
            leftIcon={<User className="h-4 w-4" />}
          />
        </InputContainer>

        {/* Warning State */}
        <InputContainer name="Warning Input" tokenId="input-warning">
          <Input 
            placeholder="Warning input..."
            isWarning={true}
            leftIcon={<AlertTriangle className="h-4 w-4" />}
          />
        </InputContainer>

        {/* Ghost Variant */}
        <InputContainer name="Ghost Input" tokenId="input-ghost">
          <Input 
            variant="ghost"
            placeholder="Ghost variant..."
          />
        </InputContainer>

        {/* Filled Variant */}
        <InputContainer name="Filled Input" tokenId="input-filled">
          <Input 
            variant="filled"
            placeholder="Filled variant..."
          />
        </InputContainer>

        {/* Small Size */}
        <InputContainer name="Small Input" tokenId="input-small">
          <Input 
            inputSize="sm"
            placeholder="Small size..."
            leftIcon={<Phone className="h-3 w-3" />}
          />
        </InputContainer>

        {/* Large Size */}
        <InputContainer name="Large Input" tokenId="input-large">
          <Input 
            inputSize="lg"
            placeholder="Large size..."
            leftIcon={<Calendar className="h-5 w-5" />}
          />
        </InputContainer>

        {/* Disabled State */}
        <InputContainer name="Disabled Input" tokenId="input-disabled">
          <Input 
            disabled
            placeholder="Disabled input..."
            leftIcon={<User className="h-4 w-4" />}
          />
        </InputContainer>

        {/* Number Input */}
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
  );
}