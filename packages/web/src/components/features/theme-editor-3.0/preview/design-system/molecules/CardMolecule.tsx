'use client';

import React from 'react';
import { Card } from '@/components/primitives/ui/card';
import { Button } from '@/components/primitives/ui/button';
import { Badge } from '@/components/atoms-alianza/Badge';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';

/**
 * Card Molecule Component
 * Composed of atoms: Card (container), Typography (text), Button, Badge
 * Spacing System:
 * - Small Spacing: Card padding (internal spacing)
 * - Medium Spacing: Component spacing (gaps between elements inside card)
 * - Large Spacing: Organism spacing (space between cards)
 */
export function CardMolecule() {
  const { state } = useThemeEditor();
  const colors = state.themeMode === 'dark' ? state.currentTheme?.darkColors : state.currentTheme?.lightColors;
  const shadows = state.currentTheme?.shadows;
  const spacing = state.currentTheme?.spacing;

  // Get spacing values - assuming spacing has small, medium, large properties
  // If not, calculate based on base spacing value
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16; // Convert to px
  
  // Spacing hierarchy
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`; // Card padding
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`; // Component gaps  
  const largeSpacing = `var(--spacing-large, ${baseValue * 4}px)`; // Organism spacing

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: largeSpacing, // Space between cards (organism level)
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 1rem'
    }}>
      
      {/* Design 1: Basic Feature Card */}
      <Card 
        className="transition-all duration-300 hover:scale-[1.02]"
        style={{
          padding: smallSpacing, // Internal card padding
          boxShadow: shadows?.shadowMd || 'var(--shadow-md)', // Connected to theme shadow system
          borderRadius: 'var(--radius-card, 8px)',
          background: colors?.background?.value || 'var(--color-background)',
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`
        }}
      >
        <div className="flex justify-between items-start" style={{ marginBottom: mediumSpacing }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--typography-h4-font-family)',
              fontSize: 'var(--typography-h4-font-size)',
              fontWeight: 'var(--typography-h4-font-weight)',
              lineHeight: 'var(--typography-h3-line-height)',
              letterSpacing: 'var(--typography-h3-letter-spacing)',
              color: colors?.foreground?.value || 'var(--color-foreground)',
              margin: 0,
              marginBottom: mediumSpacing // Medium spacing entre título y párrafo
            }}>
              Feature Card
            </h3>
            <p style={{
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: 'var(--typography-paragraph-font-size)',
              fontWeight: 'var(--typography-paragraph-font-weight)',
              lineHeight: 'var(--typography-paragraph-line-height)',
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
              margin: 0
            }}>
              This card showcases proper atomic design with controlled spacing. The padding uses small spacing, gaps use medium spacing.
            </p>
          </div>
          <Badge variant="primary" size="sm" style={{ flexShrink: 0, marginLeft: smallSpacing }}>
            New
          </Badge>
        </div>
        
        <div style={{ marginTop: mediumSpacing }}> {/* Medium spacing entre párrafo y botón */}
          <Button variant="default" size="default" style={{ width: '100%' }}>
            Explore Feature
          </Button>
        </div>
      </Card>

      {/* Design 2: Action Card with Multiple Buttons */}
      <Card 
        className="transition-all duration-300 hover:scale-[1.02]"
        style={{
          padding: smallSpacing,
          boxShadow: shadows?.shadowMd || 'var(--shadow-md)', // Connected to theme shadow system
          borderRadius: 'var(--radius-card, 8px)',
          background: colors?.background?.value || 'var(--color-background)',
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`
        }}
      >
        <div style={{ marginBottom: mediumSpacing }}>
          <div className="flex justify-between items-start" style={{ marginBottom: mediumSpacing }}> {/* Medium spacing entre título y párrafo */}
            <h3 style={{
              fontFamily: 'var(--typography-h4-font-family)',
              fontSize: 'var(--typography-h4-font-size)',
              fontWeight: 'var(--typography-h4-font-weight)',
              color: colors?.foreground?.value || 'var(--color-foreground)',
              margin: 0
            }}>
              Premium Service
            </h3>
            <Badge variant="secondary" size="sm">Pro</Badge>
          </div>
          
          <p style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'var(--typography-paragraph-font-size)',
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
            margin: 0,
            marginBottom: mediumSpacing // Medium spacing entre párrafo y badges
          }}>
            Advanced features with professional support and enhanced capabilities for your business needs.
          </p>
          
          <div style={{ marginBottom: mediumSpacing, display: 'flex', flexWrap: 'wrap', gap: '4px' }}> {/* Medium spacing entre badges y botones */}
            <Badge variant="outline" size="sm">Analytics</Badge>
            <Badge variant="outline" size="sm">Priority</Badge>
            <Badge variant="outline" size="sm">24/7 Support</Badge>
          </div>
        </div>
        
        <div style={{ marginTop: mediumSpacing, display: 'flex', gap: '8px' }}>
          <Button variant="default" size="default" style={{ flex: 1 }}>
            Get Started
          </Button>
          <Button variant="outline" size="default" style={{ flex: 1 }}>
            Learn More
          </Button>
        </div>
      </Card>

      {/* Design 3: Compact Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="transition-all duration-300 hover:scale-[1.02]"
          style={{
            padding: smallSpacing,
            boxShadow: shadows?.shadowMd || 'var(--shadow-md)', // Connected to theme shadow system
            borderRadius: 'var(--radius-card, 8px)',
            background: colors?.background?.value || 'var(--color-background)',
            border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`
          }}
        >
          <div style={{ marginBottom: mediumSpacing }}>
            <h4 style={{
              fontFamily: 'var(--typography-h4-font-family)',
              fontSize: 'var(--typography-h4-font-size)',
              fontWeight: 'var(--typography-h4-font-weight)',
              color: colors?.foreground?.value || 'var(--color-foreground)',
              margin: 0,
              marginBottom: mediumSpacing // Medium spacing entre título y párrafo
            }}>
              Quick Action
            </h4>
            <p style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontSize: 'var(--typography-emphasis-font-size)',
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
              margin: 0
            }}>
              Compact design for secondary actions with minimal visual weight.
            </p>
          </div>
          <Button variant="ghost" size="sm" style={{ width: '100%' }}>
            Quick Action
          </Button>
        </Card>

        <Card 
          className="transition-all duration-300 hover:scale-[1.02]"
          style={{
            padding: smallSpacing,
            boxShadow: shadows?.shadowMd || 'var(--shadow-md)', // Connected to theme shadow system
            borderRadius: 'var(--radius-card, 8px)',
            background: colors?.background?.value || 'var(--color-background)',
            border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`
          }}
        >
          <div style={{ marginBottom: mediumSpacing }}>
            <h4 style={{
              fontFamily: 'var(--typography-h4-font-family)',
              fontSize: 'var(--typography-h4-font-size)',
              fontWeight: 'var(--typography-h4-font-weight)',
              color: colors?.foreground?.value || 'var(--color-foreground)',
              margin: 0,
              marginBottom: mediumSpacing // Medium spacing entre título y párrafo
            }}>
              Status Card
            </h4>
            <p style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontSize: 'var(--typography-emphasis-font-size)',
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
              margin: 0
            }}>
              Shows current status with appropriate visual feedback and actions.
            </p>
          </div>
          <Button variant="secondary" size="sm" style={{ width: '100%' }}>
            View Status
          </Button>
        </Card>
      </div>
    </div>
  );
}