'use client';

import React, { useState } from 'react';
import { 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Circle, 
  Dot,
  MoreHorizontal,
  Plus,
  Settings,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut
} from '../primitives/dropdown-menu';
import { Badge } from '../atoms/Badge';
import { Avatar } from '../atoms/Avatar';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface DropdownMenuItem {
  id: string;
  type?: 'item' | 'checkbox' | 'radio' | 'separator' | 'label' | 'sub';
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  checked?: boolean;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  onClick?: () => void;
  children?: DropdownMenuItem[];
}

export interface DropdownMenuMoleculeProps {
  items: DropdownMenuItem[];
  trigger?: React.ReactNode;
  variant?: 'default' | 'user' | 'actions' | 'context' | 'command';
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  disabled?: boolean;
  className?: string;
  triggerAsChild?: boolean;
  modal?: boolean;
}

/**
 * DropdownMenuMolecule - Advanced dropdown menu with theme integration
 * 
 * Combines: DropdownMenu (primitive) + Button + Badge + Avatar + Icons + Typography
 * Features: Sub-menus, checkboxes, radio groups, shortcuts, variants, theme-responsive
 * Spacing: Small (item padding), Medium (section gaps), Large (menu spacing)
 */
export function DropdownMenuMolecule({
  items,
  trigger,
  variant = 'default',
  placement = 'bottom-start',
  disabled = false,
  className = '',
  triggerAsChild = false,
  modal = true
}: DropdownMenuMoleculeProps) {
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

  // State for controlled items
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [radioValue, setRadioValue] = useState<string>('');

  // Handle checkbox changes
  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    const newCheckedItems = new Set(checkedItems);
    if (checked) {
      newCheckedItems.add(itemId);
    } else {
      newCheckedItems.delete(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  // Handle radio changes
  const handleRadioChange = (value: string) => {
    setRadioValue(value);
  };

  // Enhanced default trigger with better visual feedback - returns plain elements for asChild
  const getDefaultTrigger = () => {
    const baseButtonStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      fontWeight: 500,
      textDecoration: 'none'
    };

    const getVariantStyles = (variantType: string) => {
      switch (variantType) {
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: colors?.foreground?.value || 'var(--color-foreground)',
            border: 'none'
          };
        case 'outline':
          return {
            backgroundColor: colors?.background?.value || 'var(--color-background)',
            color: colors?.foreground?.value || 'var(--color-foreground)',
            border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`
          };
        case 'default':
          return {
            backgroundColor: colors?.primary?.value || 'var(--color-primary)',
            color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)',
            border: 'none'
          };
        default:
          return {
            backgroundColor: colors?.background?.value || 'var(--color-background)',
            color: colors?.foreground?.value || 'var(--color-foreground)',
            border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`
          };
      }
    };

    switch (variant) {
      case 'user':
        return (
          <div
            style={{
              ...baseButtonStyle,
              ...getVariantStyles('ghost'),
              borderRadius: 'var(--radius, 8px)',
              minHeight: '36px',
              padding: '8px 12px'
            }}
            className="hover:bg-accent/80 hover:scale-[0.98] active:scale-[0.96]"
          >
            <User className="h-4 w-4" style={{ flexShrink: 0 }} />
            <span style={{ 
              fontWeight: 500,
              fontSize: '14px'
            }}>Usuario</span>
            <ChevronDown className="h-3 w-3" style={{ 
              flexShrink: 0,
              opacity: 0.7,
              transition: 'transform 0.3s ease'
            }} />
          </div>
        );
      
      case 'actions':
        return (
          <div
            style={{
              ...baseButtonStyle,
              ...getVariantStyles('outline'),
              minHeight: '36px',
              minWidth: '36px',
              borderRadius: 'var(--radius, 8px)',
              padding: '8px'
            }}
            className="hover:bg-accent/80 hover:scale-[0.98] active:scale-[0.96] hover:shadow-md"
          >
            <MoreHorizontal className="h-4 w-4" style={{ flexShrink: 0 }} />
          </div>
        );
        
      case 'context':
        return (
          <div
            style={{
              ...baseButtonStyle,
              ...getVariantStyles('ghost'),
              minHeight: '36px',
              minWidth: '36px',
              borderRadius: 'var(--radius, 8px)',
              padding: '8px'
            }}
            className="hover:bg-accent/80 hover:scale-[0.98] active:scale-[0.96] hover:rotate-45 transition-transform"
          >
            <Settings className="h-4 w-4" style={{ flexShrink: 0 }} />
          </div>
        );
        
      case 'command':
        return (
          <div
            style={{
              ...baseButtonStyle,
              ...getVariantStyles('default'),
              borderRadius: 'var(--radius, 8px)',
              minHeight: '36px',
              padding: '8px 12px'
            }}
            className="hover:shadow-lg hover:scale-[0.98] active:scale-[0.96]"
          >
            <Plus className="h-4 w-4" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '14px' }}>Nuevo</span>
            <ChevronDown className="h-3 w-3" style={{ 
              flexShrink: 0,
              opacity: 0.8,
              transition: 'transform 0.3s ease'
            }} />
          </div>
        );
        
      default:
        return (
          <div
            style={{
              ...baseButtonStyle,
              ...getVariantStyles('outline'),
              borderRadius: 'var(--radius, 8px)',
              minHeight: '40px',
              padding: '8px 12px'
            }}
            className="hover:bg-accent/80 hover:scale-[0.98] active:scale-[0.96] hover:shadow-md"
          >
            <span style={{ fontSize: '14px' }}>Opciones</span>
            <ChevronDown className="h-4 w-4" style={{ 
              flexShrink: 0,
              opacity: 0.7,
              transition: 'transform 0.3s ease'
            }} />
          </div>
        );
    }
  };

  // Render menu items recursively
  const renderMenuItems = (menuItems: DropdownMenuItem[], isSubMenu = false) => {
    return menuItems.map((item, index) => {
      if (item.type === 'separator') {
        return <DropdownMenuSeparator key={`separator-${index}`} />;
      }

      if (item.type === 'label') {
        return (
          <DropdownMenuLabel 
            key={item.id} 
            style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontSize: '12px',
              fontWeight: 600,
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
              padding: `8px ${smallSpacing}`,
              marginBottom: '4px',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px',
              background: `linear-gradient(90deg, ${colors?.accent?.value || 'var(--color-accent)'}20, transparent)`,
              borderRadius: '4px'
            }}
          >
            {item.label}
          </DropdownMenuLabel>
        );
      }

      if (item.type === 'sub' && item.children) {
        return (
          <DropdownMenuSub key={item.id}>
            <DropdownMenuSubTrigger disabled={item.disabled} style={{
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: 'var(--typography-paragraph-font-size)',
              color: colors?.foreground?.value || 'var(--color-foreground)',
              padding: smallSpacing,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <Badge variant={item.badge.variant || 'outline'} size="sm">
                  {item.badge.text}
                </Badge>
              )}
              <ChevronRight className="h-3 w-3" />
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent style={{
                background: colors?.popover?.value || 'var(--color-popover)',
                border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
                borderRadius: 'var(--radius-popover, var(--radius))',
                boxShadow: shadows?.shadowLg || 'var(--shadow-lg)',
                padding: smallSpacing
              }}>
                {renderMenuItems(item.children, true)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
      }

      if (item.type === 'checkbox') {
        const isChecked = checkedItems.has(item.id);
        return (
          <DropdownMenuCheckboxItem
            key={item.id}
            checked={isChecked}
            onCheckedChange={(checked) => handleCheckboxChange(item.id, checked)}
            disabled={item.disabled}
            onSelect={item.onClick}
            style={{
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px',
              fontWeight: 450,
              color: item.disabled 
                ? (colors?.mutedForeground?.value || 'var(--color-muted-foreground)') 
                : (colors?.foreground?.value || 'var(--color-foreground)'),
              padding: `10px ${smallSpacing}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: '6px',
              margin: '2px 4px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative' as const,
              minHeight: '36px',
              background: isChecked ? `${colors?.primary?.value || 'var(--color-primary)'}10` : 'transparent'
            }}
            className={`
              ${!item.disabled ? 'hover:bg-accent/60 hover:scale-[0.98] hover:shadow-sm focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1' : ''}
              ${item.disabled ? 'opacity-50' : ''}
              ${isChecked ? 'bg-primary/5' : ''}
              group transition-all duration-300 ease-out
            `}
          >
            {/* Enhanced icon container */}
            {item.icon && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: isChecked ? `${colors?.primary?.value || 'var(--color-primary)'}20` : 'transparent',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }} className="group-hover:bg-primary/20 group-focus:bg-primary/30">
                <div style={{
                  color: isChecked ? (colors?.primary?.value || 'var(--color-primary)') : 'inherit',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.3s ease'
                }}>
                  {item.icon}
                </div>
              </div>
            )}
            
            <span style={{ 
              flex: 1, 
              lineHeight: 1.4,
              fontWeight: isChecked ? 500 : 450,
              color: isChecked ? (colors?.primary?.value || 'var(--color-primary)') : 'inherit',
              transition: 'all 0.3s ease'
            }}>
              {item.label}
            </span>
            
            {item.badge && (
              <Badge 
                variant={isChecked ? 'default' : (item.badge.variant || 'outline')} 
                size="sm"
                style={{
                  flexShrink: 0,
                  fontSize: '11px',
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                {item.badge.text}
              </Badge>
            )}
            
            {item.shortcut && (
              <DropdownMenuShortcut style={{
                fontSize: '11px',
                opacity: 0.6,
                fontWeight: 500,
                transition: 'opacity 0.3s ease'
              }} className="group-hover:opacity-80">
                {item.shortcut}
              </DropdownMenuShortcut>
            )}
          </DropdownMenuCheckboxItem>
        );
      }

      if (item.type === 'radio') {
        const isSelected = radioValue === item.id;
        return (
          <DropdownMenuRadioItem
            key={item.id}
            value={item.id}
            disabled={item.disabled}
            onSelect={item.onClick}
            style={{
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px',
              fontWeight: 450,
              color: item.disabled 
                ? (colors?.mutedForeground?.value || 'var(--color-muted-foreground)') 
                : (colors?.foreground?.value || 'var(--color-foreground)'),
              padding: `10px ${smallSpacing}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: '6px',
              margin: '2px 4px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative' as const,
              minHeight: '36px',
              background: isSelected ? `${colors?.primary?.value || 'var(--color-primary)'}10` : 'transparent'
            }}
            className={`
              ${!item.disabled ? 'hover:bg-accent/60 hover:scale-[0.98] hover:shadow-sm focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1' : ''}
              ${item.disabled ? 'opacity-50' : ''}
              ${isSelected ? 'bg-primary/5' : ''}
              group transition-all duration-300 ease-out
            `}
          >
            {/* Enhanced icon container */}
            {item.icon && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: isSelected ? `${colors?.primary?.value || 'var(--color-primary)'}20` : 'transparent',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }} className="group-hover:bg-primary/20 group-focus:bg-primary/30">
                <div style={{
                  color: isSelected ? (colors?.primary?.value || 'var(--color-primary)') : 'inherit',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.3s ease'
                }}>
                  {item.icon}
                </div>
              </div>
            )}
            
            <span style={{ 
              flex: 1, 
              lineHeight: 1.4,
              fontWeight: isSelected ? 500 : 450,
              color: isSelected ? (colors?.primary?.value || 'var(--color-primary)') : 'inherit',
              transition: 'all 0.3s ease'
            }}>
              {item.label}
            </span>
            
            {item.badge && (
              <Badge 
                variant={isSelected ? 'default' : (item.badge.variant || 'outline')} 
                size="sm"
                style={{
                  flexShrink: 0,
                  fontSize: '11px',
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                {item.badge.text}
              </Badge>
            )}
            
            {item.shortcut && (
              <DropdownMenuShortcut style={{
                fontSize: '11px',
                opacity: 0.6,
                fontWeight: 500,
                transition: 'opacity 0.3s ease'
              }} className="group-hover:opacity-80">
                {item.shortcut}
              </DropdownMenuShortcut>
            )}
          </DropdownMenuRadioItem>
        );
      }

      // Enhanced default item with better visual feedback
      return (
        <DropdownMenuItem
          key={item.id}
          disabled={item.disabled}
          onSelect={item.onClick}
          style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: '14px',
            fontWeight: 450,
            color: item.disabled 
              ? (colors?.mutedForeground?.value || 'var(--color-muted-foreground)') 
              : (colors?.foreground?.value || 'var(--color-foreground)'),
            padding: `10px ${smallSpacing}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            borderRadius: '6px',
            margin: '2px 4px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative' as const,
            overflow: 'hidden' as const,
            minHeight: '36px'
          }}
          className={`
            ${!item.disabled ? 'hover:bg-accent/60 hover:scale-[0.98] hover:shadow-sm focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1' : ''}
            ${item.disabled ? 'opacity-50' : ''}
            group transition-all duration-300 ease-out
          `}
        >
          {/* Enhanced icon container */}
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
          
          {/* Enhanced label */}
          <span style={{ 
            flex: 1, 
            lineHeight: 1.4,
            transition: 'color 0.3s ease'
          }} className="group-hover:font-medium">
            {item.label}
          </span>
          
          {/* Enhanced badge */}
          {item.badge && (
            <Badge 
              variant={item.badge.variant || 'outline'} 
              size="sm"
              style={{
                flexShrink: 0,
                fontSize: '11px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                transform: 'scale(0.95)'
              }}
              className="group-hover:scale-100 group-hover:shadow-sm"
            >
              {item.badge.text}
            </Badge>
          )}
          
          {/* Enhanced shortcut */}
          {item.shortcut && (
            <DropdownMenuShortcut style={{
              fontSize: '11px',
              opacity: 0.6,
              fontWeight: 500,
              transition: 'opacity 0.3s ease'
            }} className="group-hover:opacity-80">
              {item.shortcut}
            </DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      );
    });
  };

  // Group radio items
  const hasRadioItems = items.some(item => item.type === 'radio');
  
  return (
    <div className={className}>
      <DropdownMenu modal={modal}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          {trigger || getDefaultTrigger()}
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align={placement.includes('end') ? 'end' : 'start'}
          side={placement.includes('top') ? 'top' : 'bottom'}
          style={{
            background: colors?.popover?.value || 'var(--color-popover)',
            border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
            borderRadius: 'var(--radius-popover, 12px)',
            boxShadow: `${shadows?.shadowLg || 'var(--shadow-lg)'}, 0 0 0 1px ${colors?.border?.value || 'var(--color-border)'}20`,
            padding: '6px',
            minWidth: 'min(220px, calc(100vw - 40px))',
            maxWidth: 'min(320px, calc(100vw - 20px))',
            backdropFilter: 'blur(8px)',
            background: `${colors?.popover?.value || 'var(--color-popover)'}f8`,
            animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)'
          }}
          className="animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          {hasRadioItems ? (
            <DropdownMenuRadioGroup value={radioValue} onValueChange={handleRadioChange}>
              {renderMenuItems(items)}
            </DropdownMenuRadioGroup>
          ) : (
            renderMenuItems(items)
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Export preset configurations and example items
export const DropdownMenuPresets = {
  basic: {
    variant: 'default' as const,
    placement: 'bottom-start' as const,
    modal: true
  },
  
  user: {
    variant: 'user' as const,
    placement: 'bottom-end' as const,
    modal: true
  },
  
  actions: {
    variant: 'actions' as const,
    placement: 'bottom-end' as const,
    modal: false
  },
  
  context: {
    variant: 'context' as const,
    placement: 'bottom-start' as const,
    modal: false
  }
};

export const ExampleMenuItems = {
  userMenu: [
    { id: 'profile', label: 'Perfil', icon: <User className="h-4 w-4" />, type: 'item' as const },
    { id: 'settings', label: 'Configuración', icon: <Settings className="h-4 w-4" />, type: 'item' as const },
    { id: 'separator1', label: '', type: 'separator' as const },
    { id: 'logout', label: 'Cerrar sesión', type: 'item' as const }
  ],
  
  actionsMenu: [
    { id: 'edit', label: 'Editar', shortcut: '⌘E', type: 'item' as const },
    { id: 'duplicate', label: 'Duplicar', shortcut: '⌘D', type: 'item' as const },
    { id: 'separator1', label: '', type: 'separator' as const },
    { id: 'delete', label: 'Eliminar', shortcut: '⌘⌫', type: 'item' as const, badge: { text: 'Cuidado', variant: 'destructive' as const } }
  ]
};