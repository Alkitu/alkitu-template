import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/primitives/Tabs';
import { Badge } from '@/components/atoms-alianza/Badge';
import type { TabsAlianzaProps } from './TabsAlianza.types';

/**
 * TabsAlianza - Molecule component for tab navigation
 *
 * Provides tab navigation UI for switching between views/panels.
 * Built on Radix UI Tabs primitive with enhanced styling and features.
 *
 * @example
 * ```tsx
 * <TabsAlianza
 *   tabs={[
 *     { value: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
 *     { value: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
 *   ]}
 *   defaultValue="tab1"
 * />
 * ```
 */
export function TabsAlianza({
  defaultValue,
  value,
  onValueChange,
  tabs,
  className,
  orientation = 'horizontal',
}: TabsAlianzaProps) {
  return (
    <Tabs
      data-testid="tabs-alianza"
      defaultValue={defaultValue || tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cn('w-full space-y-6', className)}
    >
      <TabsList
        data-testid="tabs-list"
        className={cn(
          'w-full justify-start bg-transparent p-0 border-b border-border h-auto rounded-none',
          orientation === 'horizontal' ? 'gap-6 flex-row' : 'gap-2 flex-col border-r border-b-0',
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            data-testid={`tab-trigger-${tab.value}`}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              'data-[state=active]:bg-transparent data-[state=active]:shadow-none',
              'rounded-none px-0 py-3 font-medium text-muted-foreground',
              'data-[state=active]:text-foreground bg-transparent transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-2',
              orientation === 'horizontal'
                ? 'data-[state=active]:border-b-2 data-[state=active]:border-primary border-b-2 border-transparent'
                : 'data-[state=active]:border-r-2 data-[state=active]:border-primary border-r-2 border-transparent w-full justify-start',
            )}
          >
            {tab.icon && (
              <span data-testid={`tab-icon-${tab.value}`} className="shrink-0">
                {tab.icon}
              </span>
            )}
            <span data-testid={`tab-label-${tab.value}`}>{tab.label}</span>
            {tab.badge && (
              <Badge
                data-testid={`tab-badge-${tab.value}`}
                variant={tab.badge.variant || 'default'}
                className="ml-1"
              >
                {tab.badge.text}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          data-testid={`tab-content-${tab.value}`}
          value={tab.value}
          className="mt-6"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

TabsAlianza.displayName = 'TabsAlianza';
