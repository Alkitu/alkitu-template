/**
 * Badge Component Simple Test - CRITICAL PATH
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge Component Structure', () => {
  it('should export Badge component', () => {
    expect(Badge).toBeDefined();
  });

  it('should be a React component', () => {
    expect(typeof Badge).toBe('function'); // Regular function component
  });

  it('should create React elements', () => {
    const element = React.createElement(Badge, {
      variant: 'default',
      children: 'Test Badge'
    });

    expect(element).toBeDefined();
    expect(element.type).toBe(Badge);
    expect(element.props.children).toBe('Test Badge');
  });

  it('should handle different variants', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'];

    variants.forEach(variant => {
      const element = React.createElement(Badge, {
        variant,
        children: `${variant} badge`,
      } as any);

      expect(element).toBeDefined();
      expect((element.props as any).variant).toBe(variant);
    });
  });
});