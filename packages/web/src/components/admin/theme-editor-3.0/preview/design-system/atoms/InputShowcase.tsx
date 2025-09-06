'use client';

import React from 'react';
import { Input } from '../../../design-system/atoms/Input';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Search, Mail, Lock, User, Phone, Calendar } from 'lucide-react';

// Using universal ShowcaseContainer - no need for custom ShowcaseContainer

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
          <ShowcaseContainer name="Default Input" tokenId="input-default">
            <Input placeholder="Enter text..." />
          </ShowcaseContainer>
        </div>

        {/* Input with Left Icon */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Input with Icon" tokenId="input-with-icon">
            <Input 
              placeholder="Search..." 
              leftIcon={<Search className="h-4 w-4" />}
            />
          </ShowcaseContainer>
        </div>

        {/* Email Input */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Email Input" tokenId="input-email">
            <Input 
              type="email"
              placeholder="Enter email..." 
              leftIcon={<Mail className="h-4 w-4" />}
            />
          </ShowcaseContainer>
        </div>

        {/* Password Input */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Password Input" tokenId="input-password">
            <Input 
              placeholder="Enter password..." 
              leftIcon={<Lock className="h-4 w-4" />}
              showPasswordToggle={true}
            />
          </ShowcaseContainer>
        </div>

        {/* Error State */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Error Input" tokenId="input-error">
            <Input 
              placeholder="Invalid input..."
              isInvalid={true}
              leftIcon={<User className="h-4 w-4" />}
            />
          </ShowcaseContainer>
        </div>

        {/* Success State */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Success Input" tokenId="input-success">
            <Input 
              placeholder="Valid input..."
              isValid={true}
              leftIcon={<User className="h-4 w-4" />}
            />
          </ShowcaseContainer>
        </div>

        {/* Ghost Variant */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Ghost Input" tokenId="input-ghost">
            <Input 
              variant="ghost"
              placeholder="Ghost variant..."
            />
          </ShowcaseContainer>
        </div>

        {/* Filled Variant */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Filled Input" tokenId="input-filled">
            <Input 
              variant="filled"
              placeholder="Filled variant..."
            />
          </ShowcaseContainer>
        </div>

        {/* Small Size */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Small Input" tokenId="input-small">
            <Input 
              inputSize="sm"
              placeholder="Small size..."
              leftIcon={<Phone className="h-3 w-3" />}
            />
          </ShowcaseContainer>
        </div>

        {/* Large Size */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Large Input" tokenId="input-large">
            <Input 
              inputSize="lg"
              placeholder="Large size..."
              leftIcon={<Calendar className="h-5 w-5" />}
            />
          </ShowcaseContainer>
        </div>

        {/* Disabled State */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Disabled Input" tokenId="input-disabled">
            <Input 
              disabled
              placeholder="Disabled input..."
              leftIcon={<User className="h-4 w-4" />}
            />
          </ShowcaseContainer>
        </div>

        {/* Number Input */}
        <div className="flex-1 min-w-[280px] max-w-[350px]">
          <ShowcaseContainer name="Number Input" tokenId="input-number">
            <Input 
              type="number"
              placeholder="Enter number..."
              min="0"
              max="100"
            />
          </ShowcaseContainer>
        </div>

      </div>


    </div>
  );
}