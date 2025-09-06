'use client';

import React from 'react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { Icon } from './Icon';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';

export interface BreadcrumbItem {
  /**
   * Label for the breadcrumb item
   */
  label: string;
  
  /**
   * Click handler for the breadcrumb item
   */
  onClick?: () => void;
  
  /**
   * Whether this item is the current page (not clickable)
   */
  current?: boolean;
  
  /**
   * Icon to display before the label
   */
  icon?: React.ComponentType<any>;
  
  /**
   * Custom href for links
   */
  href?: string;
}

export interface BreadcrumbProps {
  /**
   * Array of breadcrumb items
   */
  items: BreadcrumbItem[];
  
  /**
   * Separator between items
   */
  separator?: 'chevron' | 'slash' | 'arrow' | React.ReactNode;
  
  /**
   * Maximum items to show before collapsing
   */
  maxItems?: number;
  
  /**
   * Whether to show home icon for first item
   */
  showHome?: boolean;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

/**
 * Breadcrumb Atom Component
 * Navigation component that shows the current location within a hierarchy
 * Supports collapsing, custom separators, and icons
 */
export function Breadcrumb({
  items,
  separator = 'chevron',
  maxItems,
  showHome = false,
  size = 'md',
  className = '',
  style = {},
  ...props
}: BreadcrumbProps) {
  const { state } = useThemeEditor();
  const colors = state.themeMode === 'dark' ? state.currentTheme?.darkColors : state.currentTheme?.lightColors;

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          fontSize: '12px',
          gap: '4px',
          iconSize: 'xs' as const,
        };
      case 'lg':
        return {
          fontSize: '16px',
          gap: '8px',
          iconSize: 'sm' as const,
        };
      default: // md
        return {
          fontSize: '14px',
          gap: '6px',
          iconSize: 'xs' as const,
        };
    }
  };

  // Render separator
  const renderSeparator = () => {
    if (React.isValidElement(separator)) {
      return separator;
    }

    const { iconSize } = getSizeStyles();
    const separatorColor = colors?.mutedForeground?.hex || 'var(--color-muted-foreground)';

    switch (separator) {
      case 'slash':
        return (
          <span style={{ color: separatorColor, opacity: 0.6 }}>
            /
          </span>
        );
      case 'arrow':
        return (
          <span style={{ color: separatorColor, opacity: 0.6 }}>
            →
          </span>
        );
      case 'chevron':
      default:
        return (
          <Icon
            icon={ChevronRight}
            size={iconSize}
            style={{ color: separatorColor, opacity: 0.6 }}
          />
        );
    }
  };

  // Handle item collapsing
  const getDisplayItems = () => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    if (maxItems <= 2) {
      return [
        items[0],
        { label: '...', onClick: undefined, current: false },
        items[items.length - 1],
      ];
    }

    const keepFirst = Math.floor(maxItems / 2);
    const keepLast = maxItems - keepFirst - 1; // -1 for the ellipsis

    return [
      ...items.slice(0, keepFirst),
      { label: '...', onClick: undefined, current: false },
      ...items.slice(items.length - keepLast),
    ];
  };

  // Render breadcrumb item
  const renderItem = (item: BreadcrumbItem, index: number) => {
    const { iconSize } = getSizeStyles();
    const isEllipsis = item.label === '...';
    const isClickable = item.onClick || item.href;
    const isCurrent = item.current;

    const itemStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      color: isCurrent
        ? colors?.foreground?.hex || 'var(--color-foreground)'
        : isClickable
        ? colors?.primary?.hex || 'var(--color-primary)'
        : colors?.mutedForeground?.hex || 'var(--color-muted-foreground)',
      textDecoration: 'none',
      cursor: isClickable && !isCurrent ? 'pointer' : 'default',
      fontWeight: isCurrent ? '600' : '400',
      transition: 'color 0.15s ease-in-out',
      opacity: isEllipsis ? 0.7 : 1,
    };

    const hoverStyle = isClickable && !isCurrent ? {
      ':hover': {
        color: colors?.primaryForeground?.hex || 'var(--color-primary-foreground)',
        textDecoration: 'underline',
      }
    } : {};

    const handleClick = (e: React.MouseEvent) => {
      if (isCurrent || isEllipsis) {
        e.preventDefault();
        return;
      }
      item.onClick?.();
    };

    const content = (
      <>
        {/* Home icon for first item */}
        {index === 0 && showHome && (
          <Icon
            icon={Home}
            size={iconSize}
            style={{ color: 'currentColor' }}
          />
        )}
        
        {/* Item icon */}
        {item.icon && (
          <Icon
            icon={item.icon}
            size={iconSize}
            style={{ color: 'currentColor' }}
          />
        )}
        
        {/* Ellipsis icon or text */}
        {isEllipsis ? (
          <Icon
            icon={MoreHorizontal}
            size={iconSize}
            style={{ color: 'currentColor' }}
          />
        ) : (
          <span>{item.label}</span>
        )}
      </>
    );

    if (item.href && !isCurrent) {
      return (
        <a
          key={index}
          href={item.href}
          onClick={handleClick}
          style={itemStyle}
          className="hover:underline"
        >
          {content}
        </a>
      );
    }

    return (
      <span
        key={index}
        onClick={handleClick}
        style={itemStyle}
        className={isClickable && !isCurrent ? 'hover:underline' : ''}
        role={isClickable && !isCurrent ? 'button' : undefined}
        tabIndex={isClickable && !isCurrent ? 0 : undefined}
        onKeyDown={
          isClickable && !isCurrent
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  item.onClick?.();
                }
              }
            : undefined
        }
      >
        {content}
      </span>
    );
  };

  const sizeStyles = getSizeStyles();
  const displayItems = getDisplayItems();

  return (
    <nav
      className={`breadcrumb-atom ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        fontSize: sizeStyles.fontSize,
        lineHeight: '1.5',
        ...style,
      }}
      aria-label="Breadcrumb navigation"
      {...props}
    >
      {displayItems.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
          {index < displayItems.length - 1 && renderSeparator()}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumb;