'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

import type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from './Tabs.types';

/**
 * Tabs - Design System Primitive
 *
 * A set of layered sections of content (tab panels) that display one panel at a time.
 * Built on Radix UI primitives for accessibility and customization.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="account">
 *   <TabsList>
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="password">Password</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">Account settings content</TabsContent>
 *   <TabsContent value="password">Password settings content</TabsContent>
 * </Tabs>
 * ```
 */
export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
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
