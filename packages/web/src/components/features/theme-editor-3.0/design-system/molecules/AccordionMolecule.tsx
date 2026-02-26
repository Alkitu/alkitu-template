'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';
import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent 
} from '../primitives/accordion';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface AccordionMoleculeProps {
  items: AccordionItem[];
  variant?: 'default' | 'card' | 'bordered' | 'minimal';
  multiple?: boolean;
  animated?: boolean;
  collapsible?: boolean;
  className?: string;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  icon?: React.ReactNode;
  disabled?: boolean;
  defaultOpen?: boolean;
}

/**
 * AccordionMolecule - Enhanced accordion component with premium UX
 * 
 * Combines: Accordion (primitive) + Typography + Badge + Icons + Animations
 * Features: Multiple selection, smooth animations, hover states, focus management, variants, theme-responsive
 * Spacing: Small (item padding), Medium (content gaps), Large (section spacing)
 * 
 * UX Improvements:
 * - Smooth cubic-bezier animations (0.3s)
 * - Enhanced hover and focus states
 * - Better touch targets (44px min height)
 * - Icon background highlighting when active
 * - Consistent visual hierarchy
 * - Proper content alignment and spacing
 */
export function AccordionMolecule({
  items,
  variant = 'default',
  multiple = false,
  animated = true,
  collapsible = true,
  className = ''
}: AccordionMoleculeProps) {
  const { state } = useThemeEditor();
  
  // Theme integration
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const shadows = state.currentTheme?.shadows;
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;
  const largeSpacing = `var(--spacing-large, ${baseValue * 4}px)`;

  // State for controlled accordion
  const [openItems, setOpenItems] = useState<string[]>(
    items.filter(item => item.defaultOpen).map(item => item.id)
  );

  const handleValueChange = (value: string | string[]) => {
    if (multiple) {
      setOpenItems(Array.isArray(value) ? value : [value]);
    } else {
      setOpenItems(Array.isArray(value) ? value : [value]);
    }
  };

  // Enhanced variant styles
  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: 'var(--radius-card, 12px)',
      transition: animated ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      overflow: 'hidden' as const
    };

    switch (variant) {
      case 'card':
        return {
          ...baseStyles,
          background: colors?.card?.value || 'var(--color-card)',
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
          boxShadow: shadows?.shadowMd || 'var(--shadow-md)',
          padding: '4px' // Inner padding for items
        };
      
      case 'bordered':
        return {
          ...baseStyles,
          border: `2px solid ${colors?.border?.value || 'var(--color-border)'}`,
          background: colors?.background?.value || 'var(--color-background)',
          padding: '2px'
        };
        
      case 'minimal':
        return {
          ...baseStyles,
          background: 'transparent',
          border: 'none',
          borderRadius: '8px'
        };
        
      default:
        return {
          ...baseStyles,
          background: colors?.background?.value || 'var(--color-background)',
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
          padding: '2px'
        };
    }
  };

  const getTriggerStyles = (isOpen: boolean, disabled: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: variant === 'minimal' ? '12px 0' : `${smallSpacing} ${smallSpacing}`,
    background: 'transparent',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 'var(--radius, 8px)',
    transition: animated ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'var(--typography-h4-font-family)',
    fontSize: 'var(--typography-h4-font-size)',
    fontWeight: isOpen ? 'var(--typography-h3-font-weight)' : 'var(--typography-h4-font-weight)',
    color: isOpen 
      ? (colors?.primary?.value || 'var(--color-primary)')
      : (colors?.foreground?.value || 'var(--color-foreground)'),
    position: 'relative' as const
  });

  const getContentStyles = () => ({
    padding: variant === 'minimal' ? `${mediumSpacing} 0` : `0 ${smallSpacing} ${mediumSpacing} ${smallSpacing}`,
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: 'var(--typography-paragraph-font-size)',
    fontWeight: 'var(--typography-paragraph-font-weight)',
    lineHeight: 'var(--typography-paragraph-line-height)',
    color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
    borderTop: variant === 'bordered' ? `1px solid ${colors?.border?.value || 'var(--color-border)'}` : 'none',
    marginTop: variant === 'minimal' ? '8px' : '0',
    position: 'relative' as const,
    // Smooth content animation
    transition: animated ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
  });

  // New function for icon container styles
  const getIconStyles = (isOpen: boolean, isCustomIcon: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    backgroundColor: isOpen 
      ? (colors?.primary?.value || 'var(--color-primary)') + '20'
      : 'transparent',
    transition: animated ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    transform: animated 
      ? (isCustomIcon 
          ? (isOpen ? 'rotate(90deg) scale(1.1)' : 'rotate(0deg) scale(1)')
          : (isOpen ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1)'))
      : 'none'
  });

  const accordionType = multiple ? 'multiple' : 'single';
  const accordionValue = multiple ? openItems : openItems[0] || '';

  return (
    <div 
      className={className}
      style={{
        ...getVariantStyles(),
        marginBottom: largeSpacing // Large spacing between accordion sections
      }}
    >
      <Accordion
        type={accordionType as any}
        value={accordionValue as any}
        onValueChange={handleValueChange as any}
        collapsible={collapsible}
      >
        {items.map((item, index) => {
          const isOpen = openItems.includes(item.id);
          const isLast = index === items.length - 1;
          
          return (
            <AccordionItem
              key={item.id}
              value={item.id}
              style={{
                borderBottom: !isLast && variant !== 'minimal' 
                  ? `1px solid ${colors?.border?.value || 'var(--color-border)'}` 
                  : 'none',
                marginBottom: variant === 'minimal' ? mediumSpacing : '0'
              }}
            >
              <AccordionTrigger
                disabled={item.disabled}
                style={getTriggerStyles(isOpen, item.disabled || false)}
                className={`
                  group hover:no-underline focus:no-underline
                  ${!item.disabled ? 'hover:bg-accent/50 focus:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2' : ''}
                  ${isOpen ? 'bg-accent/30' : ''}
                  rounded-lg transition-all duration-300 ease-out
                `}
              >
                <div className="flex items-center" style={{ 
                  flex: 1, 
                  gap: '12px',
                  minHeight: '44px' // Better touch target
                }}>
                  {/* Improved Icon Container */}
                  <div style={getIconStyles(isOpen, !!item.icon)}>
                    {item.icon ? (
                      <div style={{
                        color: isOpen 
                          ? (colors?.primary?.value || 'var(--color-primary)')
                          : (colors?.mutedForeground?.value || 'var(--color-muted-foreground)'),
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.icon}
                      </div>
                    ) : (
                      <ChevronDown 
                        className="h-4 w-4 shrink-0"
                        style={{
                          color: isOpen 
                            ? (colors?.primary?.value || 'var(--color-primary)')
                            : (colors?.mutedForeground?.value || 'var(--color-muted-foreground)')
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Improved Title */}
                  <div style={{ 
                    flex: 1, 
                    textAlign: 'left' as const,
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: '2px'
                  }}>
                    <span style={{
                      fontWeight: isOpen ? 600 : 500,
                      transition: animated ? 'font-weight 0.3s ease' : 'none'
                    }}>
                      {item.title}
                    </span>
                    {/* Optional subtitle could go here */}
                  </div>
                  
                  {/* Enhanced Badge */}
                  {item.badge && (
                    <Badge 
                      variant={item.badge.variant || 'outline'} 
                      size="sm"
                      style={{ 
                        flexShrink: 0,
                        opacity: animated ? (isOpen ? 0.9 : 1) : 1,
                        transform: animated ? (isOpen ? 'scale(0.95)' : 'scale(1)') : 'none',
                        transition: animated ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                      }}
                    >
                      {item.badge.text}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              
              <AccordionContent style={getContentStyles()}>
                <div style={{
                  position: 'relative' as const,
                  paddingLeft: '32px', // Align with title
                  animation: animated && isOpen ? 'fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                }}>
                  {typeof item.content === 'string' ? (
                    <p style={{ 
                      margin: 0,
                      lineHeight: 1.6,
                      fontSize: '14px',
                      color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
                    }}>
                      {item.content}
                    </p>
                  ) : (
                    <div style={{
                      marginTop: 0,
                      marginBottom: 0
                    } as React.CSSProperties}>
                      {item.content}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

// Export default configurations
export const AccordionPresets = {
  basic: {
    variant: 'default' as const,
    multiple: false,
    animated: true,
    collapsible: true
  },
  
  card: {
    variant: 'card' as const,
    multiple: false,
    animated: true,
    collapsible: true
  },
  
  multiSelect: {
    variant: 'bordered' as const,
    multiple: true,
    animated: true,
    collapsible: true
  },
  
  minimal: {
    variant: 'minimal' as const,
    multiple: false,
    animated: false,
    collapsible: true
  }
};