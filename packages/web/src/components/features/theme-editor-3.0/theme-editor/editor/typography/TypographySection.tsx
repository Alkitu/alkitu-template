'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../../design-system/primitives/Button';
import { Card } from '../../../design-system/primitives/card';
import { TypographyElementEditor } from './TypographyElementEditor';
import { useTypographyState } from './useTypographyState';
import { TypographyElement, TypographyElements } from './types';

interface TypographySectionProps {
  className?: string;
}

// Re-export for backward compatibility
export type { TypographyElements, TypographyElement } from './types';
export { DEFAULT_TYPOGRAPHY } from './types';

// Typography element configurations
const TYPOGRAPHY_CONFIG = [
  {
    key: 'h1' as keyof TypographyElements,
    label: 'Heading 1 (H1)',
    previewText: 'Main Page Title'
  },
  {
    key: 'h2' as keyof TypographyElements,
    label: 'Heading 2 (H2)',
    previewText: 'Section Title'
  },
  {
    key: 'h3' as keyof TypographyElements,
    label: 'Heading 3 (H3)',
    previewText: 'Subsection Title'
  },
  {
    key: 'h4' as keyof TypographyElements,
    label: 'Heading 4 (H4)',
    previewText: 'Small Section Title'
  },
  {
    key: 'h5' as keyof TypographyElements,
    label: 'Heading 5 (H5)',
    previewText: 'Minor Title'
  },
  {
    key: 'paragraph' as keyof TypographyElements,
    label: 'Paragraph',
    previewText: 'This is a sample paragraph text that shows how regular content will appear with these typography settings.'
  },
  {
    key: 'quote' as keyof TypographyElements,
    label: 'Quote',
    previewText: '"This is an example quote that demonstrates the typography styling for quoted content."'
  },
  {
    key: 'emphasis' as keyof TypographyElements,
    label: 'Emphasis',
    previewText: 'Important highlighted text'
  }
];

export function TypographySection({
  className = ""
}: TypographySectionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['h1']));
  const { typography, updateElement } = useTypographyState();

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const handleElementChange = (elementKey: keyof TypographyElements, element: TypographyElement) => {
    updateElement(elementKey, element);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {TYPOGRAPHY_CONFIG.map((config) => {
        const element = typography[config.key];
        const isExpanded = expandedSections.has(config.key);

        return (
          <Card key={config.key} className="border border-border">
            {/* Section Header */}
            <Button
              variant="ghost"
              onClick={() => toggleSection(config.key)}
              className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
            >
              <div className="flex flex-col items-start gap-1">
                <h5 style={{
                  fontFamily: 'var(--typography-h5-font-family)',
                  fontSize: 'var(--typography-h5-font-size)',
                  fontWeight: 'var(--typography-h5-font-weight)',
                  lineHeight: 'var(--typography-h5-line-height)',
                  letterSpacing: 'var(--typography-h5-letter-spacing)'
                }} className="text-foreground">
                  {config.label}
                </h5>
                {/* Mini preview */}
                <div 
                  className="text-xs text-muted-foreground truncate max-w-[300px]"
                  style={{
                    fontFamily: element.fontFamily,
                    fontSize: '11px', // Fixed small size for preview
                    fontWeight: element.fontWeight,
                    textDecoration: element.textDecoration
                  }}
                >
                  {config.previewText}
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>

            {/* Section Content */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-3">
                <TypographyElementEditor
                  element={element}
                  onChange={(newElement) => handleElementChange(config.key, newElement)}
                  label={config.label}
                  previewText={config.previewText}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}