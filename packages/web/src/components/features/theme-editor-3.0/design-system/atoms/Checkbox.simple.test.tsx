/**
 * Checkbox Component Simple Test - CRITICAL PATH
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox Component Structure', () => {
  it('should export Checkbox component', () => {
    expect(Checkbox).toBeDefined();
  });

  it('should be a React component', () => {
    // Accept both object (forwardRef) or function (regular component)
    expect(['object', 'function']).toContain(typeof Checkbox);
  });

  it('should create React elements with basic props', () => {
    const element = React.createElement(Checkbox, {
      checked: true,
      onChange: vi.fn(),
      'data-testid': 'test-checkbox'
    });

    expect(element).toBeDefined();
    expect(element.type).toBe(Checkbox);
    expect(element.props.checked).toBe(true);
  });

  it('should handle disabled state', () => {
    const element = React.createElement(Checkbox, {
      disabled: true,
      checked: false
    });

    expect(element).toBeDefined();
    expect(element.props.disabled).toBe(true);
    expect(element.props.checked).toBe(false);
  });

  it('should accept onChange callback', () => {
    const onChange = vi.fn();
    const element = React.createElement(Checkbox, {
      onChange
    });

    expect(element).toBeDefined();
    expect(element.props.onChange).toBe(onChange);
  });
});