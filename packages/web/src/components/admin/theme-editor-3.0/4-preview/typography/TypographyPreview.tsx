'use client';

import React from 'react';
import { Card } from '../../ui/card';

export function TypographyPreview() {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Typography Preview</h2>
      
      {/* Typography Elements Showcase */}
      <div className="space-y-6">
        
        {/* Headings Section */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Headings</h3>
          
          <h1 style={{
            fontFamily: 'var(--typography-h1-font-family)',
            fontSize: 'var(--typography-h1-font-size)',
            fontWeight: 'var(--typography-h1-font-weight)',
            lineHeight: 'var(--typography-h1-line-height)',
            letterSpacing: 'var(--typography-h1-letter-spacing)',
            wordSpacing: 'var(--typography-h1-word-spacing)',
            textDecoration: 'var(--typography-h1-text-decoration)'
          }}>
            Heading 1 - Main Page Title
          </h1>
          
          <h2 style={{
            fontFamily: 'var(--typography-h2-font-family)',
            fontSize: 'var(--typography-h2-font-size)',
            fontWeight: 'var(--typography-h2-font-weight)',
            lineHeight: 'var(--typography-h2-line-height)',
            letterSpacing: 'var(--typography-h2-letter-spacing)',
            wordSpacing: 'var(--typography-h2-word-spacing)',
            textDecoration: 'var(--typography-h2-text-decoration)'
          }}>
            Heading 2 - Section Title
          </h2>
          
          <h3 style={{
            fontFamily: 'var(--typography-h3-font-family)',
            fontSize: 'var(--typography-h3-font-size)',
            fontWeight: 'var(--typography-h3-font-weight)',
            lineHeight: 'var(--typography-h3-line-height)',
            letterSpacing: 'var(--typography-h3-letter-spacing)',
            wordSpacing: 'var(--typography-h3-word-spacing)',
            textDecoration: 'var(--typography-h3-text-decoration)'
          }}>
            Heading 3 - Subsection Title
          </h3>
          
          <h4 style={{
            fontFamily: 'var(--typography-h4-font-family)',
            fontSize: 'var(--typography-h4-font-size)',
            fontWeight: 'var(--typography-h4-font-weight)',
            lineHeight: 'var(--typography-h4-line-height)',
            letterSpacing: 'var(--typography-h4-letter-spacing)',
            wordSpacing: 'var(--typography-h4-word-spacing)',
            textDecoration: 'var(--typography-h4-text-decoration)'
          }}>
            Heading 4 - Small Section Title
          </h4>
          
          <h5 style={{
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            fontWeight: 'var(--typography-h5-font-weight)',
            lineHeight: 'var(--typography-h5-line-height)',
            letterSpacing: 'var(--typography-h5-letter-spacing)',
            wordSpacing: 'var(--typography-h5-word-spacing)',
            textDecoration: 'var(--typography-h5-text-decoration)'
          }}>
            Heading 5 - Minor Title
          </h5>
        </Card>

        {/* Content Section */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Content</h3>
          
          <p style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'var(--typography-paragraph-font-size)',
            fontWeight: 'var(--typography-paragraph-font-weight)',
            lineHeight: 'var(--typography-paragraph-line-height)',
            letterSpacing: 'var(--typography-paragraph-letter-spacing)',
            wordSpacing: 'var(--typography-paragraph-word-spacing)',
            textDecoration: 'var(--typography-paragraph-text-decoration)'
          }}>
            This is a regular paragraph that demonstrates how body text appears with the current typography settings. 
            It shows the font family, size, weight, line height, and spacing properties that have been configured 
            for paragraph elements throughout the design system.
          </p>
          
          <blockquote 
            className="border-l-4 border-primary pl-4"
            style={{
              fontFamily: 'var(--typography-quote-font-family)',
              fontSize: 'var(--typography-quote-font-size)',
              fontWeight: 'var(--typography-quote-font-weight)',
              lineHeight: 'var(--typography-quote-line-height)',
              letterSpacing: 'var(--typography-quote-letter-spacing)',
              wordSpacing: 'var(--typography-quote-word-spacing)',
              textDecoration: 'var(--typography-quote-text-decoration)'
            }}
          >
            "This is an example quote that shows how quoted content is displayed with the configured typography styles. 
            It demonstrates the quote-specific font settings and spacing."
          </blockquote>
          
          <div style={{
            fontFamily: 'var(--typography-emphasis-font-family)',
            fontSize: 'var(--typography-emphasis-font-size)',
            fontWeight: 'var(--typography-emphasis-font-weight)',
            lineHeight: 'var(--typography-emphasis-line-height)',
            letterSpacing: 'var(--typography-emphasis-letter-spacing)',
            wordSpacing: 'var(--typography-emphasis-word-spacing)',
            textDecoration: 'var(--typography-emphasis-text-decoration)'
          }}>
            This is emphasized text that highlights important information with custom typography styling.
          </div>
        </Card>

        {/* Sample UI Components */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">UI Components</h3>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 style={{
                fontFamily: 'var(--typography-h4-font-family)',
                fontSize: 'var(--typography-h4-font-size)',
                fontWeight: 'var(--typography-h4-font-weight)',
                lineHeight: 'var(--typography-h4-line-height)',
                letterSpacing: 'var(--typography-h4-letter-spacing)',
                wordSpacing: 'var(--typography-h4-word-spacing)',
                textDecoration: 'var(--typography-h4-text-decoration)',
                marginBottom: '8px'
              }}>
                Card Title
              </h4>
              <p style={{
                fontFamily: 'var(--typography-paragraph-font-family)',
                fontSize: 'var(--typography-paragraph-font-size)',
                fontWeight: 'var(--typography-paragraph-font-weight)',
                lineHeight: 'var(--typography-paragraph-line-height)',
                letterSpacing: 'var(--typography-paragraph-letter-spacing)',
                wordSpacing: 'var(--typography-paragraph-word-spacing)',
                textDecoration: 'var(--typography-paragraph-text-decoration)'
              }}>
                This card demonstrates how typography looks in a typical UI component with title and description.
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h5 style={{
                  fontFamily: 'var(--typography-h5-font-family)',
                  fontSize: 'var(--typography-h5-font-size)',
                  fontWeight: 'var(--typography-h5-font-weight)',
                  lineHeight: 'var(--typography-h5-line-height)',
                  letterSpacing: 'var(--typography-h5-letter-spacing)',
                  wordSpacing: 'var(--typography-h5-word-spacing)',
                  textDecoration: 'var(--typography-h5-text-decoration)',
                  marginBottom: '4px'
                }}>
                  List Item Title
                </h5>
                <p style={{
                  fontFamily: 'var(--typography-paragraph-font-family)',
                  fontSize: 'var(--typography-paragraph-font-size)',
                  fontWeight: 'var(--typography-paragraph-font-weight)',
                  lineHeight: 'var(--typography-paragraph-line-height)',
                  letterSpacing: 'var(--typography-paragraph-letter-spacing)',
                  wordSpacing: 'var(--typography-paragraph-word-spacing)',
                  textDecoration: 'var(--typography-paragraph-text-decoration)',
                  fontSize: '14px'
                }}>
                  Subtitle or description text
                </p>
              </div>
              <span style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                lineHeight: 'var(--typography-emphasis-line-height)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)',
                wordSpacing: 'var(--typography-emphasis-word-spacing)',
                textDecoration: 'var(--typography-emphasis-text-decoration)'
              }}>
                Status
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}