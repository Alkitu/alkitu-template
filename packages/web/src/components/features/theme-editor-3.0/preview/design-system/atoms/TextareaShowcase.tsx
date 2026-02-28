'use client';

import React from 'react';
import { Textarea } from '@/components/atoms-alianza/Textarea';
import { ShowcaseContainer } from './ShowcaseContainer';
import { MessageSquare, FileText, AlertTriangle } from 'lucide-react';

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
          <ShowcaseContainer name="Default Textarea" tokenId="textarea-default">
            <Textarea autosize 
              placeholder="Enter your message here..."
              minHeight={60}
              maxHeight={200}
            />
          </ShowcaseContainer>
        </div>

        {/* Message Textarea */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <ShowcaseContainer name="Message Textarea" tokenId="textarea-message">
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Textarea autosize 
                placeholder="Type your message..."
                minHeight={60}
                maxHeight={150}
                className="pl-10"
              />
            </div>
          </ShowcaseContainer>
        </div>

        {/* Long Content Textarea */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <ShowcaseContainer name="Long Content" tokenId="textarea-long">
            <Textarea autosize 
              placeholder="Enter a long description..."
              minHeight={80}
              maxHeight={300}
              defaultValue="This is a textarea with some initial content that demonstrates how the autosize feature works. As you type more content, the textarea will automatically expand to fit the content, up to the maximum height specified."
            />
          </ShowcaseContainer>
        </div>

        {/* Small Min Height */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <ShowcaseContainer name="Small Textarea" tokenId="textarea-small">
            <Textarea autosize 
              placeholder="Small textarea..."
              minHeight={40}
              maxHeight={120}
            />
          </ShowcaseContainer>
        </div>

        {/* Large Min Height */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <ShowcaseContainer name="Large Textarea" tokenId="textarea-large">
            <Textarea autosize 
              placeholder="Large textarea for extensive content..."
              minHeight={100}
              maxHeight={400}
            />
          </ShowcaseContainer>
        </div>

        {/* Disabled State */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <ShowcaseContainer name="Disabled Textarea" tokenId="textarea-disabled">
            <Textarea autosize 
              disabled
              placeholder="This textarea is disabled..."
              minHeight={60}
              maxHeight={200}
              defaultValue="This textarea is disabled and cannot be edited."
            />
          </ShowcaseContainer>
        </div>

        {/* Read-only State */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <ShowcaseContainer name="Read-only Textarea" tokenId="textarea-readonly">
            <Textarea autosize 
              readOnly
              placeholder="This textarea is read-only..."
              minHeight={60}
              maxHeight={200}
              defaultValue="This textarea is read-only. You can select and copy the text, but you cannot edit it."
            />
          </ShowcaseContainer>
        </div>

        {/* Fixed Height (No Autosize) */}
        <div className="flex-1 min-w-[320px] max-w-[450px]">
          <ShowcaseContainer name="Fixed Height" tokenId="textarea-fixed">
            <Textarea autosize 
              placeholder="Fixed height textarea..."
              minHeight={120}
              maxHeight={120}
            />
          </ShowcaseContainer>
        </div>

      </div>

    </div>
  );
}