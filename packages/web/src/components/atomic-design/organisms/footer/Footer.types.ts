import { CSSProperties, ReactNode } from 'react';

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterBrand {
  /**
   * Brand logo element (icon or image)
   */
  logo?: ReactNode;

  /**
   * Brand name
   */
  name: string;

  /**
   * Brand description
   */
  description: string;
}

export interface FooterProps {
  /**
   * Brand information displayed in the first column
   */
  brand: FooterBrand;

  /**
   * Array of footer sections (Product, Support, Legal, etc.)
   */
  sections: FooterSection[];

  /**
   * Copyright text
   */
  copyright: string;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   */
  themeOverride?: CSSProperties;

  /**
   * Use system color variables (default: true)
   */
  useSystemColors?: boolean;
}
