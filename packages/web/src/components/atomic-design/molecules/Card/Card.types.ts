import type { HTMLAttributes } from 'react';

/**
 * Variant options for Card
 */
export type CardVariant = 'default' | 'bordered' | 'elevated' | 'flat';

/**
 * Padding options for Card
 */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Props for Card component
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the card
   * @default 'default'
   */
  variant?: CardVariant;

  /**
   * Padding size for the card
   * @default 'md'
   */
  padding?: CardPadding;

  /**
   * Custom className for the card
   */
  className?: string;

  /**
   * Card content
   */
  children?: React.ReactNode;
}

/**
 * Props for CardHeader component
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Custom className for the header
   */
  className?: string;

  /**
   * Header content
   */
  children?: React.ReactNode;
}

/**
 * Props for CardTitle component
 */
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Custom className for the title
   */
  className?: string;

  /**
   * Title content
   */
  children?: React.ReactNode;
}

/**
 * Props for CardDescription component
 */
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * Custom className for the description
   */
  className?: string;

  /**
   * Description content
   */
  children?: React.ReactNode;
}

/**
 * Props for CardContent component
 */
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Custom className for the content
   */
  className?: string;

  /**
   * Content
   */
  children?: React.ReactNode;
}

/**
 * Props for CardFooter component
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Custom className for the footer
   */
  className?: string;

  /**
   * Footer content
   */
  children?: React.ReactNode;
}
