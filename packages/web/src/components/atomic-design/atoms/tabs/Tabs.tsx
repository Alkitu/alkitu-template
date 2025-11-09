'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from './Tabs.types';

/**
 * Tabs - Atomic Design Atom (Primitive Wrapper)
 *
 * A lightweight wrapper around Radix UI Tabs that uses theme CSS variables.
 * This atom provides the basic tabs functionality without complex features.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */
export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsRootProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    data-slot="tabs"
    className={cn('flex flex-col gap-2', className)}
    {...props}
  />
));

Tabs.displayName = 'Tabs';

/**
 * TabsList - Container for tab triggers
 *
 * @example
 * ```tsx
 * <TabsList>
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 * </TabsList>
 * ```
 */
export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    className={cn(
      'inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px]',
      'bg-muted text-muted-foreground',
      className,
    )}
    {...props}
  />
));

TabsList.displayName = 'TabsList';

/**
 * TabsTrigger - Individual tab button
 *
 * @example
 * ```tsx
 * <TabsTrigger value="settings">Settings</TabsTrigger>
 * ```
 */
export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(
      'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5',
      'rounded-xl border border-transparent px-2 py-1',
      'text-sm font-medium whitespace-nowrap',
      'text-foreground dark:text-muted-foreground',
      'transition-[color,box-shadow]',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring',
      'focus-visible:ring-[3px] focus-visible:outline-1',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-card dark:data-[state=active]:text-foreground',
      'dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30',
      '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
      className,
    )}
    {...props}
  />
));

TabsTrigger.displayName = 'TabsTrigger';

/**
 * TabsContent - Tab panel content
 *
 * @example
 * ```tsx
 * <TabsContent value="settings">
 *   Settings panel content
 * </TabsContent>
 * ```
 */
export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn('flex-1 outline-none', className)}
    {...props}
  />
));

TabsContent.displayName = 'TabsContent';

export default Tabs;
