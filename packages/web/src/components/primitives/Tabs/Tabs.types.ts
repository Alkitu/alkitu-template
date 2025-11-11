import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Props for Tabs root component
 */
export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

/**
 * Props for TabsList component
 */
export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

/**
 * Props for TabsTrigger component
 */
export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

/**
 * Props for TabsContent component
 */
export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;
