import type * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Props for the Tabs root component
 */
export interface TabsRootProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  /**
   * Custom className for the tabs container
   */
  className?: string;
}

/**
 * Props for the TabsList component
 */
export interface TabsListProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /**
   * Custom className for the tabs list
   */
  className?: string;
}

/**
 * Props for the TabsTrigger component
 */
export interface TabsTriggerProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /**
   * Custom className for the trigger
   */
  className?: string;
}

/**
 * Props for the TabsContent component
 */
export interface TabsContentProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  /**
   * Custom className for the content
   */
  className?: string;
}
