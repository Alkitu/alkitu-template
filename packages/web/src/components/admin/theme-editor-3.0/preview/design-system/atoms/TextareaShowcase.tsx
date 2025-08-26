'use client';

import React from 'react';
import { AutosizeTextarea } from '../../../design-system/atoms/Textarea';
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

export function TextareaShowcase() {

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
          Textarea
        </h2>
      </div>

      {/* Grid responsive de textareas con flexbox */}
      <div className="flex flex-wrap gap-4 justify-start">
        
        {/* Default Textarea */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <TextareaContainer name="Default Textarea" tokenId="textarea-default">
            <AutosizeTextarea 
              placeholder="Enter your message here..."
              minHeight={60}
              maxHeight={200}
            />
          </TextareaContainer>
        </div>

        {/* Message Textarea */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
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
        </div>

        {/* Long Content Textarea */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <TextareaContainer name="Long Content" tokenId="textarea-long">
            <AutosizeTextarea 
              placeholder="Enter a long description..."
              minHeight={80}
              maxHeight={300}
              defaultValue="This is a textarea with some initial content that demonstrates how the autosize feature works. As you type more content, the textarea will automatically expand to fit the content, up to the maximum height specified."
            />
          </TextareaContainer>
        </div>

        {/* Small Min Height */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <TextareaContainer name="Small Textarea" tokenId="textarea-small">
            <AutosizeTextarea 
              placeholder="Small textarea..."
              minHeight={40}
              maxHeight={120}
            />
          </TextareaContainer>
        </div>

        {/* Large Min Height */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <TextareaContainer name="Large Textarea" tokenId="textarea-large">
            <AutosizeTextarea 
              placeholder="Large textarea for extensive content..."
              minHeight={100}
              maxHeight={400}
            />
          </TextareaContainer>
        </div>

        {/* Disabled State */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <TextareaContainer name="Disabled Textarea" tokenId="textarea-disabled">
            <AutosizeTextarea 
              disabled
              placeholder="This textarea is disabled..."
              minHeight={60}
              maxHeight={200}
              defaultValue="This textarea is disabled and cannot be edited."
            />
          </TextareaContainer>
        </div>

        {/* Read-only State */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <TextareaContainer name="Read-only Textarea" tokenId="textarea-readonly">
            <AutosizeTextarea 
              readOnly
              placeholder="This textarea is read-only..."
              minHeight={60}
              maxHeight={200}
              defaultValue="This textarea is read-only. You can select and copy the text, but you cannot edit it."
            />
          </TextareaContainer>
        </div>

        {/* Fixed Height (No Autosize) */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <TextareaContainer name="Fixed Height" tokenId="textarea-fixed">
            <AutosizeTextarea 
              placeholder="Fixed height textarea..."
              minHeight={120}
              maxHeight={120}
            />
          </TextareaContainer>
        </div>

      </div>

    </div>
  );
}