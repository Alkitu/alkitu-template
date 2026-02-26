'use client';

import React from 'react';
import { MoreHorizontal, X, ExternalLink, Share2, Heart } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '../primitives/card';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface CardAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

export interface CardMoleculeProps {
  title?: string;
  description?: string;
  content?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  actions?: CardAction[];
  variant?: 'default' | 'elevated' | 'interactive' | 'compact' | 'featured';
  closeable?: boolean;
  onClose?: () => void;
  footer?: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  target?: '_blank' | '_self';
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * CardMolecule - Advanced card component with theme integration
 * 
 * Combines: Card (primitive) + Button + Badge + Typography + Icons
 * Features: Multiple variants, actions, closeable, loading state, theme-responsive
 * Spacing: Small (content padding), Medium (section gaps), Large (card spacing)
 */
export function CardMolecule({
  title,
  description,
  content,
  image,
  imageAlt,
  badge,
  actions,
  variant = 'default',
  closeable = false,
  onClose,
  footer,
  className = '',
  loading = false,
  disabled = false,
  href,
  target = '_self',
  children,
  onClick
}: CardMoleculeProps) {
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

  // Variant styles
  const getVariantStyles = () => {
    const baseStyles = {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      marginBottom: largeSpacing,
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : href ? 'pointer' : 'default',
      position: 'relative' as const,
      overflow: 'hidden' as const
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow: shadows?.shadowLg || 'var(--shadow-lg)',
          transform: 'translateY(-2px)',
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`
        };
      
      case 'interactive':
        return {
          ...baseStyles,
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: shadows?.shadowXl || 'var(--shadow-xl)'
          }
        };
      
      case 'compact':
        return {
          ...baseStyles,
          padding: smallSpacing
        };
      
      case 'featured':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}10, ${colors?.accent?.value || 'var(--color-accent)'}10)`,
          border: `2px solid ${colors?.primary?.value || 'var(--color-primary)'}20`,
          boxShadow: `0 0 0 1px ${colors?.primary?.value || 'var(--color-primary)'}10, ${shadows?.shadowMd || 'var(--shadow-md)'}`
        };
      
      default:
        return baseStyles;
    }
  };

  const CardWrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href, target, rel: target === '_blank' ? 'noopener noreferrer' : undefined } : {};

  return (
    <CardWrapper {...wrapperProps} className={className} style={{ textDecoration: 'none' }} onClick={onClick}>
      <Card 
        className={`text-foreground max-sm:mx-2 max-sm:max-w-[calc(100vw-1rem)] ${variant === 'interactive' ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-300' : ''}`}
        style={getVariantStyles()}
      >
        {/* Loading Overlay */}
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `${colors?.background?.value || 'var(--color-background)'}ee`,
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {/* Image Section */}
        {image && (
          <div style={{
            width: '100%',
            height: variant === 'compact' ? '150px' : '200px',
            overflow: 'hidden',
            borderRadius: 'var(--radius-card, 12px) var(--radius-card, 12px) 0 0',
            position: 'relative'
          }}>
            <img 
              src={image} 
              alt={imageAlt || title || 'Card image'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              className={variant === 'interactive' ? 'hover:scale-110' : ''}
            />
            {/* Image overlay gradient */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
              pointerEvents: 'none'
            }} />
          </div>
        )}

        {/* Header Section */}
        {(title || description || badge || closeable) && (
          <CardHeader style={{ padding: smallSpacing }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                {/* Title with Badge */}
                {title && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <CardTitle className="text-foreground" style={{
                      fontSize: variant === 'compact' ? '16px' : '18px',
                      fontWeight: 600,
                      lineHeight: 1.4
                    }}>
                      {title}
                    </CardTitle>
                    {badge && (
                      <Badge 
                        variant={badge.variant || 'outline'} 
                        size="sm"
                        style={{ 
                          flexShrink: 0,
                          opacity: 0.9
                        }}
                      >
                        {badge.text}
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Description */}
                {description && (
                  <CardDescription className="text-muted-foreground" style={{
                    fontSize: '14px',
                    lineHeight: 1.5,
                    opacity: 0.8
                  }}>
                    {description}
                  </CardDescription>
                )}
              </div>

              {/* Close Button */}
              {closeable && onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    borderRadius: '50%',
                    flexShrink: 0
                  }}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              {/* More Options */}
              {!closeable && variant === 'featured' && (
                <Button
                  variant="ghost"
                  size="sm"
                  style={{
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    borderRadius: '50%',
                    flexShrink: 0
                  }}
                  className="hover:bg-accent"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
        )}

        {/* Content Section */}
        {(content || children) && (
          <CardContent className="text-foreground" style={{
            padding: smallSpacing,
            paddingTop: (title || description) ? 0 : smallSpacing
          }}>
            <div style={{
              fontSize: '14px',
              lineHeight: 1.6,
              color: colors?.foreground?.value || 'var(--color-foreground)'
            }}>
              {content}
              {children}
            </div>
          </CardContent>
        )}

        {/* Actions Section */}
        {actions && actions.length > 0 && (
          <CardFooter 
            style={{ 
              padding: smallSpacing,
              paddingTop: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}
            className="max-sm:flex-col max-sm:gap-2"
          >
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || (index === 0 ? 'default' : 'outline')}
                size={variant === 'compact' ? 'sm' : 'default'}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  action.onClick();
                }}
                disabled={disabled}
                style={{
                  flex: actions.length <= 2 ? 1 : 'none',
                  minWidth: actions.length > 2 ? '100px' : undefined
                }}
                className="max-sm:w-full max-sm:flex-1"
              >
                {action.icon && <span style={{ marginRight: '4px' }}>{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </CardFooter>
        )}

        {/* Custom Footer */}
        {footer && (
          <CardFooter className="text-muted-foreground" style={{
            padding: smallSpacing,
            paddingTop: 0,
            borderTop: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`,
            background: `${colors?.accent?.value || 'var(--color-accent)'}10`
          }}>
            <div style={{
              width: '100%',
              fontSize: '13px',
              opacity: 0.8
            }}>
              {footer}
            </div>
          </CardFooter>
        )}

        {/* Interactive Overlay for featured variant */}
        {variant === 'featured' && !disabled && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}00, ${colors?.primary?.value || 'var(--color-primary)'}10)`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
          }} className="hover:opacity-100" />
        )}
      </Card>
    </CardWrapper>
  );
}

// Export preset configurations
export const CardPresets = {
  basic: {
    variant: 'default' as const
  },
  
  elevated: {
    variant: 'elevated' as const
  },
  
  interactive: {
    variant: 'interactive' as const,
    href: '#'
  },
  
  compact: {
    variant: 'compact' as const
  },
  
  featured: {
    variant: 'featured' as const,
    badge: { text: 'Featured', variant: 'default' as const }
  },
  
  withImage: {
    variant: 'default' as const,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'
  },
  
  closeable: {
    variant: 'default' as const,
    closeable: true
  }
};