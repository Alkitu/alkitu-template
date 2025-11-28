'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tabs as TabsAtom,
  TabsList as TabsListAtom,
  TabsTrigger as TabsTriggerAtom,
  TabsContent as TabsContentAtom,
} from '@/components/atoms/tabs';
import { Button } from '@/components/features/theme-editor-3.0/design-system/primitives/Button';
import { Badge } from '@/components/atoms/badges';
import type { TabsProps, TabItem } from './Tabs.types';

/**
 * Tabs - Atomic Design Molecule
 *
 * Advanced tabs component with rich features including closeable tabs,
 * scrollable tabs, badges, icons, and multiple visual variants.
 *
 * Composes: Tabs (atom) + Button + Badge + Icons
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     {
 *       id: 'tab1',
 *       label: 'Overview',
 *       content: <div>Overview content</div>,
 *       icon: <Home className="h-4 w-4" />,
 *     },
 *     {
 *       id: 'tab2',
 *       label: 'Settings',
 *       content: <div>Settings content</div>,
 *       badge: { text: '3' },
 *       closeable: true,
 *     },
 *   ]}
 *   variant="pills"
 *   onTabClose={(id) => console.log('Closed:', id)}
 * />
 * ```
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      defaultValue,
      value,
      onValueChange,
      variant = 'default',
      orientation = 'horizontal',
      activationMode = 'automatic',
      onTabClose,
      onTabAdd,
      addable = false,
      scrollable = false,
      className = '',
      maxTabs = 10,
      ...props
    },
    ref,
  ) => {
    // Early return if no tabs provided
    if (!tabs || tabs.length === 0) {
      return (
        <div ref={ref} className="text-muted-foreground">
          No tabs available
        </div>
      );
    }

    // Local state
    const [activeTab, setActiveTab] = useState(
      value || defaultValue || tabs[0].id,
    );
    const [scrollPosition, setScrollPosition] = useState(0);
    const tabsListRef = useRef<HTMLDivElement>(null);

    // Handle tab change
    const handleTabChange = (tabId: string) => {
      if (value === undefined) {
        setActiveTab(tabId);
      }
      onValueChange?.(tabId);
    };

    // Handle tab close
    const handleTabClose = (tabId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      onTabClose?.(tabId);
    };

    // Handle tab add
    const handleTabAdd = () => {
      if (tabs.length < maxTabs) {
        onTabAdd?.();
      }
    };

    // Scroll tabs
    const scrollTabs = (direction: 'left' | 'right') => {
      if (!tabsListRef.current) return;

      const scrollAmount = 200;
      const newPosition =
        direction === 'left'
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;

      setScrollPosition(newPosition);
      tabsListRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    };

    // Effect to update active tab when value changes
    useEffect(() => {
      if (value !== undefined) {
        setActiveTab(value);
      }
    }, [value]);

    const currentValue = value ?? activeTab;
    const canScrollLeft = scrollPosition > 0;
    const canScrollRight =
      scrollable && tabsListRef.current
        ? scrollPosition <
          tabsListRef.current.scrollWidth - tabsListRef.current.clientWidth
        : false;

    // Variant classes for tabs list
    const tabsListVariantClasses = {
      default: '',
      pills:
        'bg-gradient-to-br from-muted/50 to-accent/10 backdrop-blur-sm border border-border/40 p-1.5',
      underline: 'border-b border-border/60',
      vertical: 'flex-col',
      scrollable: '',
    }[variant];

    // Container classes
    const containerClasses = cn(
      'flex gap-4',
      orientation === 'vertical' ? 'flex-row' : 'flex-col',
      className,
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        <TabsAtom
          value={currentValue}
          onValueChange={handleTabChange}
          orientation={orientation}
          activationMode={activationMode}
        >
          <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-stretch max-sm:gap-1">
            {/* Scroll left button */}
            {scrollable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTabs('left')}
                disabled={!canScrollLeft}
                className={cn(
                  'flex-shrink-0 rounded-lg min-w-[36px] min-h-[36px]',
                  'transition-all duration-300 ease-out max-sm:hidden',
                  !canScrollLeft
                    ? 'opacity-50'
                    : 'hover:bg-accent/60 hover:scale-105 hover:shadow-md active:scale-95',
                )}
                data-testid="scroll-left-button"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            {/* Tabs list */}
            <TabsListAtom
              ref={tabsListRef}
              className={cn(
                'w-full',
                tabsListVariantClasses,
                scrollable && 'overflow-x-auto scrollbar-hide',
                'max-sm:flex-col max-sm:w-full',
              )}
            >
              {tabs.map((tab) => {
                const isActive = currentValue === tab.id;
                const isDisabled = tab.disabled;

                // Trigger variant classes
                const triggerVariantClasses = cn(
                  'group relative',
                  'transition-all duration-300 ease-out',
                  'max-sm:w-full max-sm:justify-center max-sm:text-sm max-sm:py-2 max-sm:px-3',
                  !isDisabled &&
                    'hover:bg-accent/60 hover:scale-[0.98] hover:shadow-md',
                  isActive && variant === 'pills' && 'bg-background shadow-sm',
                  isActive &&
                    variant === 'underline' &&
                    'border-b-2 border-primary',
                  isDisabled && 'opacity-50 cursor-not-allowed',
                );

                return (
                  <TabsTriggerAtom
                    key={tab.id}
                    value={tab.id}
                    disabled={isDisabled}
                    className={triggerVariantClasses}
                  >
                    {/* Tab icon */}
                    {tab.icon && (
                      <div
                        className={cn(
                          'flex items-center justify-center w-[18px] h-[18px]',
                          'rounded transition-all duration-300 flex-shrink-0',
                          isActive
                            ? 'bg-primary/20 group-hover:bg-primary/20'
                            : 'bg-transparent group-hover:bg-primary/20',
                        )}
                      >
                        <div
                          className={cn(
                            'w-4 h-4 flex items-center justify-center',
                            'transition-all duration-300',
                            isActive && 'text-primary',
                            'group-hover:scale-110',
                          )}
                        >
                          {tab.icon}
                        </div>
                      </div>
                    )}

                    {/* Tab label */}
                    <span
                      className={cn(
                        'flex-shrink-0 transition-all duration-300',
                        isActive && 'text-primary font-semibold',
                        'group-hover:font-medium group-hover:scale-105',
                      )}
                    >
                      {tab.label}
                    </span>

                    {/* Tab badge */}
                    {tab.badge && (
                      <Badge
                        variant={
                          isActive ? 'default' : tab.badge.variant || 'outline'
                        }
                        className={cn(
                          'ml-0.5 text-[11px] font-medium rounded-md',
                          'transition-all duration-300 flex-shrink-0',
                          'group-hover:scale-105 group-hover:shadow-sm',
                        )}
                      >
                        {tab.badge.text}
                      </Badge>
                    )}

                    {/* Close button */}
                    {tab.closeable && onTabClose && (
                      <div
                        onClick={(e) => handleTabClose(tab.id, e)}
                        className={cn(
                          'w-[18px] h-[18px] p-0 ml-1 flex-shrink-0',
                          'rounded-full transition-all duration-300',
                          'bg-transparent cursor-pointer',
                          'flex items-center justify-center',
                          isActive ? 'opacity-80' : 'opacity-0',
                          'group-hover:opacity-100',
                          'hover:bg-destructive/20 hover:scale-110 active:scale-90',
                        )}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:rotate-90 hover:text-destructive transition-transform duration-300" />
                      </div>
                    )}
                  </TabsTriggerAtom>
                );
              })}
            </TabsListAtom>

            {/* Scroll right button */}
            {scrollable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTabs('right')}
                disabled={!canScrollRight}
                className="flex-shrink-0 max-sm:hidden"
                data-testid="scroll-right-button"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            {/* Add tab button */}
            {addable && onTabAdd && tabs.length < maxTabs && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTabAdd}
                className="flex-shrink-0 max-sm:w-full max-sm:mt-2"
                aria-label="Add new tab"
              >
                <Plus className="h-4 w-4" />
                <span className="ml-2 max-sm:inline hidden">Add Tab</span>
              </Button>
            )}

            {/* More options button */}
            {tabs.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 max-sm:w-full max-sm:mt-2"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="ml-2 max-sm:inline hidden">More</span>
              </Button>
            )}
          </div>

          {/* Tab contents */}
          <div className="flex-1">
            {tabs.map((tab) => (
              <TabsContentAtom
                key={tab.id}
                value={tab.id}
                className={cn(
                  'p-4 bg-background rounded-lg border border-border',
                  'min-h-[200px]',
                  'focus-visible:outline-none focus-visible:ring-0',
                  'data-[state=inactive]:hidden',
                )}
              >
                {tab.content}
              </TabsContentAtom>
            ))}
          </div>
        </TabsAtom>
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';

export default Tabs;
