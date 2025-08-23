'use client';

import React from 'react';
import { AutosizeTextarea } from '../../atoms/Textarea';
import { MessageSquare, FileText, AlertTriangle } from 'lucide-react';

// Componente para mostrar cada textarea con su información
interface TextareaContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function TextareaContainer({ name, tokenId, children }: TextareaContainerProps) {
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

export function TextareaShowcase() {

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
          Textarea
        </h2>
      </div>

      {/* Grid de textareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Default Textarea */}
        <TextareaContainer name="Default Textarea" tokenId="textarea-default">
          <AutosizeTextarea 
            placeholder="Enter your message here..."
            minHeight={60}
            maxHeight={200}
          />
        </TextareaContainer>

        {/* Message Textarea */}
        <TextareaContainer name="Message Textarea" tokenId="textarea-message">
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <AutosizeTextarea 
              placeholder="Type your message..."
              minHeight={60}
              maxHeight={150}
              className="pl-10"
            />
          </div>
        </TextareaContainer>

        {/* Long Content Textarea */}
        <TextareaContainer name="Long Content" tokenId="textarea-long">
          <AutosizeTextarea 
            placeholder="Enter a long description..."
            minHeight={80}
            maxHeight={300}
            defaultValue="This is a textarea with some initial content that demonstrates how the autosize feature works. As you type more content, the textarea will automatically expand to fit the content, up to the maximum height specified."
          />
        </TextareaContainer>

        {/* Small Min Height */}
        <TextareaContainer name="Small Textarea" tokenId="textarea-small">
          <AutosizeTextarea 
            placeholder="Small textarea..."
            minHeight={40}
            maxHeight={120}
          />
        </TextareaContainer>

        {/* Large Min Height */}
        <TextareaContainer name="Large Textarea" tokenId="textarea-large">
          <AutosizeTextarea 
            placeholder="Large textarea for extensive content..."
            minHeight={100}
            maxHeight={400}
          />
        </TextareaContainer>

        {/* Disabled State */}
        <TextareaContainer name="Disabled Textarea" tokenId="textarea-disabled">
          <AutosizeTextarea 
            disabled
            placeholder="This textarea is disabled..."
            minHeight={60}
            maxHeight={200}
            defaultValue="This textarea is disabled and cannot be edited."
          />
        </TextareaContainer>

        {/* Read-only State */}
        <TextareaContainer name="Read-only Textarea" tokenId="textarea-readonly">
          <AutosizeTextarea 
            readOnly
            placeholder="This textarea is read-only..."
            minHeight={60}
            maxHeight={200}
            defaultValue="This textarea is read-only. You can select and copy the text, but you cannot edit it."
          />
        </TextareaContainer>

        {/* Fixed Height (No Autosize) */}
        <TextareaContainer name="Fixed Height" tokenId="textarea-fixed">
          <AutosizeTextarea 
            placeholder="Fixed height textarea..."
            minHeight={120}
            maxHeight={120}
          />
        </TextareaContainer>

      </div>

    </div>
  );
}