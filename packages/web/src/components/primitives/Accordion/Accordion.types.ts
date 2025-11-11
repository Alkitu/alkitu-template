import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Props for Accordion root component
 */
export type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

/**
 * Props for AccordionItem component
 */
export type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

/**
 * Props for AccordionTrigger component
 */
export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

/**
 * Props for AccordionContent component
 */
export type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;
