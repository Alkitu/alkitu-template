'use client';

import React from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '@/components/primitives/ui/navigation-menu';
import { Badge } from '@/components/atoms-alianza/Badge';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'error';
  };
  children?: NavigationItem[];
  description?: string;
  icon?: React.ReactNode;
  featured?: boolean;
}

export interface NavigationMenuMoleculeProps {
  items: NavigationItem[];
  variant?: 'default' | 'compact' | 'featured';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * NavigationMenuMolecule - Advanced navigation menu with theme integration
 * 
 * Combines: NavigationMenu (primitive) + Badge + Icons + Typography
 * Features: Multi-level navigation, featured items, external links, theme-responsive
 * Spacing: Small (item padding), Medium (content gaps), Large (section spacing)
 */
export function NavigationMenuMolecule({
  items,
  variant = 'default',
  orientation = 'horizontal',
  className = ''
}: NavigationMenuMoleculeProps) {
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

  // Styles
  const getContainerStyles = () => ({
    marginBottom: largeSpacing
  });

  const getTriggerStyles = () => ({
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: '14px',
    fontWeight: 500,
    color: colors?.foreground?.value || 'var(--color-foreground)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: `10px ${smallSpacing}`,
    borderRadius: 'var(--radius, 8px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    minHeight: '40px'
  });

  const getContentStyles = () => ({
    background: `${colors?.popover?.value || 'var(--color-popover)'}f8`,
    borderTop: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    borderRight: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    borderLeft: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    borderRadius: 'var(--radius-popover, 12px)',
    boxShadow: `${shadows?.shadowLg || 'var(--shadow-lg)'}, 0 0 0 1px ${colors?.border?.value || 'var(--color-border)'}20`,
    padding: `${mediumSpacing} ${smallSpacing}`,
    minWidth: variant === 'featured' ? 'min(640px, calc(100vw - 40px))' : 'min(420px, calc(100vw - 40px))',
    maxWidth: 'calc(100vw - 20px)',
    backdropFilter: 'blur(8px)',
    animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'var(--radix-navigation-menu-content-transform-origin)'
  });

  const getLinkStyles = (item: NavigationItem, isSubItem = false) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: isSubItem ? '8px 12px' : `12px ${smallSpacing}`,
    borderRadius: 'var(--radius, 8px)',
    textDecoration: 'none',
    color: colors?.foreground?.value || 'var(--color-foreground)',
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: isSubItem ? '13px' : '14px',
    fontWeight: item.featured ? 600 : 450,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    margin: '2px 0',
    minHeight: isSubItem ? '36px' : '44px',
    background: item.featured ? `${colors?.primary?.value || 'var(--color-primary)'}08` : 'transparent'
  });

  const getDescriptionStyles = () => ({
    fontSize: 'calc(var(--typography-paragraph-font-size) * 0.875)',
    color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
    marginTop: '4px',
    lineHeight: '1.4'
  });

  // Render navigation items
  const renderNavigationItem = (item: NavigationItem) => {
    const hasChildren = item.children && item.children.length > 0;

    if (!hasChildren) {
      return (
        <NavigationMenuItem key={item.id}>
          <NavigationMenuLink 
            className={`
              ${navigationMenuTriggerStyle()}
              group relative overflow-hidden
              hover:bg-accent/60 hover:scale-[0.98] hover:shadow-sm
              focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              transition-all duration-300 ease-out
            `}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            style={getTriggerStyles()}
          >
            {item.icon && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }} className="group-hover:bg-primary/20 group-focus:bg-primary/30">
                <div style={{
                  color: 'inherit',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
              </div>
            )}
            
            <span>{item.label}</span>
            
            {item.badge && (
              <Badge 
                variant={item.badge.variant || 'outline'} 
                size="sm"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  borderRadius: '6px',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
                className="group-hover:scale-105 group-hover:shadow-sm"
              >
                {item.badge.text}
              </Badge>
            )}
            
            {item.external && (
              <ExternalLink
                className="h-3 w-3 group-hover:opacity-80 group-hover:scale-110"
                style={{
                  opacity: 0.6,
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
              />
            )}
          </NavigationMenuLink>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem key={item.id}>
        <NavigationMenuTrigger 
          style={getTriggerStyles()}
          className={`
            group relative overflow-hidden
            hover:bg-accent/60 hover:scale-[0.98] hover:shadow-sm
            focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            data-[state=open]:bg-accent/30 data-[state=open]:shadow-md
            transition-all duration-300 ease-out
          `}
        >
          {item.icon && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }} className="group-hover:bg-primary/20 group-focus:bg-primary/30">
              <div style={{
                color: 'inherit',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.icon}
              </div>
            </div>
          )}
          
          <span>{item.label}</span>
          
          {item.badge && (
            <Badge 
              variant={item.badge.variant || 'outline'} 
              size="sm"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              className="group-hover:scale-105 group-hover:shadow-sm"
            >
              {item.badge.text}
            </Badge>
          )}
          
          <ChevronDown
            className="h-3 w-3 group-data-[state=open]:rotate-180 group-hover:opacity-90"
            style={{
              transition: 'transform 0.3s ease',
              flexShrink: 0,
              opacity: 0.7
            }}
          />
        </NavigationMenuTrigger>
        
        <NavigationMenuContent style={getContentStyles()}>
          {variant === 'featured' ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: mediumSpacing 
            }} className="max-sm:grid-cols-1 max-sm:gap-4">
              {/* Featured items */}
              <div>
                <h4 style={{
                  fontFamily: 'var(--typography-h4-font-family)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors?.foreground?.value || 'var(--color-foreground)',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: `2px solid ${colors?.primary?.value || 'var(--color-primary)'}`,
                  position: 'relative' as const
                }}>
                  <span style={{
                    background: `linear-gradient(90deg, ${colors?.primary?.value || 'var(--color-primary)'}, ${colors?.primary?.value || 'var(--color-primary)'}80)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}>Destacados</span>
                </h4>
                {item.children?.filter(child => child.featured).map(child => (
                  <a
                    key={child.id}
                    href={child.href}
                    target={child.external ? '_blank' : undefined}
                    rel={child.external ? 'noopener noreferrer' : undefined}
                    style={getLinkStyles(child)}
                    className={`
                      block mb-2 group
                      hover:bg-accent/60 hover:scale-[0.98] hover:shadow-sm
                      focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
                      transition-all duration-300 ease-out
                    `}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {child.icon && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            backgroundColor: child.featured ? `${colors?.primary?.value || 'var(--color-primary)'}20` : 'transparent',
                            transition: 'all 0.3s ease',
                            flexShrink: 0
                          }} className="group-hover:bg-primary/30">
                            <div style={{
                              color: child.featured ? (colors?.primary?.value || 'var(--color-primary)') : 'inherit',
                              width: '16px',
                              height: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {child.icon}
                            </div>
                          </div>
                        )}
                        <span style={{
                          fontWeight: child.featured ? 600 : 450,
                          color: child.featured ? (colors?.primary?.value || 'var(--color-primary)') : 'inherit',
                          transition: 'all 0.3s ease',
                          flex: 1
                        }} className="group-hover:font-medium">
                          {child.label}
                        </span>
                        {child.badge && (
                          <Badge 
                            variant={child.featured ? 'default' : (child.badge.variant || 'outline')} 
                            size="sm"
                            style={{
                              fontSize: '11px',
                              fontWeight: 500,
                              borderRadius: '6px',
                              flexShrink: 0,
                              transition: 'all 0.3s ease'
                            }}
                            className="group-hover:scale-105"
                          >
                            {child.badge.text}
                          </Badge>
                        )}
                        {child.external && (
                          <ExternalLink
                            className="h-3 w-3 group-hover:opacity-80 group-hover:scale-110"
                            style={{
                              opacity: 0.6,
                              transition: 'all 0.3s ease',
                              flexShrink: 0
                            }}
                          />
                        )}
                      </div>
                      {child.description && (
                        <p style={getDescriptionStyles()}>
                          {child.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
              
              {/* Regular items */}
              <div>
                <h4 style={{
                  fontFamily: 'var(--typography-h4-font-family)',
                  fontWeight: 600,
                  color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.5px',
                  fontSize: '12px'
                }}>
                  Más opciones
                </h4>
                {item.children?.filter(child => !child.featured).map(child => (
                  <a
                    key={child.id}
                    href={child.href}
                    target={child.external ? '_blank' : undefined}
                    rel={child.external ? 'noopener noreferrer' : undefined}
                    style={getLinkStyles(child, true)}
                    className={`
                      block mb-1 group
                      hover:bg-accent/60 hover:scale-[0.98] hover:shadow-sm
                      focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
                      transition-all duration-300 ease-out
                    `}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {child.icon && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          backgroundColor: 'transparent',
                          transition: 'all 0.3s ease',
                          flexShrink: 0
                        }} className="group-hover:bg-primary/20">
                          <div style={{
                            color: 'inherit',
                            width: '14px',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {child.icon}
                          </div>
                        </div>
                      )}
                      <span style={{
                        fontWeight: 450,
                        transition: 'font-weight 0.3s ease',
                        flex: 1
                      }} className="group-hover:font-medium">
                        {child.label}
                      </span>
                      {child.badge && (
                        <Badge 
                          variant={child.badge.variant || 'outline'} 
                          size="sm"
                          style={{
                            fontSize: '10px',
                            fontWeight: 500,
                            borderRadius: '4px',
                            flexShrink: 0,
                            transition: 'all 0.3s ease'
                          }}
                          className="group-hover:scale-105"
                        >
                          {child.badge.text}
                        </Badge>
                      )}
                      {child.external && (
                        <ExternalLink
                          className="h-3 w-3 group-hover:opacity-70 group-hover:scale-110"
                          style={{
                            opacity: 0.5,
                            transition: 'all 0.3s ease',
                            flexShrink: 0
                          }}
                        />
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            // Default and compact layouts
            <div style={{ 
              display: variant === 'compact' ? 'flex' : 'block',
              flexWrap: 'wrap' as const,
              gap: variant === 'compact' ? '8px' : '0'
            }}>
              {item.children?.map(child => (
                <a
                  key={child.id}
                  href={child.href}
                  target={child.external ? '_blank' : undefined}
                  rel={child.external ? 'noopener noreferrer' : undefined}
                  style={getLinkStyles(child)}
                  className={variant === 'compact' ? 'inline-block' : 'block mb-2'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {child.icon}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{child.label}</span>
                        {child.badge && (
                          <Badge variant={child.badge.variant || 'outline'} size="sm">
                            {child.badge.text}
                          </Badge>
                        )}
                        {child.external && <ExternalLink className="h-3 w-3" />}
                      </div>
                      {child.description && variant !== 'compact' && (
                        <p style={getDescriptionStyles()}>
                          {child.description}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  };

  return (
    <div className={className} style={getContainerStyles()}>
      <NavigationMenu orientation={orientation}>
        <NavigationMenuList 
          style={{
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            alignItems: orientation === 'vertical' ? 'flex-start' : 'center',
            gap: orientation === 'vertical' ? '8px' : '16px'
          }}
          className="max-sm:flex-wrap max-sm:justify-center max-sm:gap-2"
        >
          {items.map(renderNavigationItem)}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

// Export preset configurations
export const NavigationMenuPresets = {
  basic: {
    variant: 'default' as const,
    orientation: 'horizontal' as const
  },
  
  compact: {
    variant: 'compact' as const,
    orientation: 'horizontal' as const
  },
  
  featured: {
    variant: 'featured' as const,
    orientation: 'horizontal' as const
  },
  
  vertical: {
    variant: 'default' as const,
    orientation: 'vertical' as const
  }
};