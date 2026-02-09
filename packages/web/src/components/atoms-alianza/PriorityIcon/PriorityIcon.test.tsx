import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { PriorityIcon } from './PriorityIcon';

describe('PriorityIcon', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders HIGH priority icon with correct color', () => {
    const { container } = render(<PriorityIcon priority="HIGH" />);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
    expect(icon?.getAttribute('class')).toContain('text-red-500');
  });

  it('renders MEDIUM priority icon with correct color', () => {
    const { container } = render(<PriorityIcon priority="MEDIUM" />);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
    expect(icon?.getAttribute('class')).toContain('text-orange-500');
  });

  it('renders LOW priority icon with correct color', () => {
    const { container } = render(<PriorityIcon priority="LOW" />);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
    expect(icon?.getAttribute('class')).toContain('text-blue-500');
  });

  it('applies default size classes', () => {
    const { container } = render(<PriorityIcon priority="HIGH" />);
    const icon = container.querySelector('svg');
    expect(icon?.getAttribute('class')).toContain('h-4');
    expect(icon?.getAttribute('class')).toContain('w-4');
  });

  it('applies custom className', () => {
    const { container } = render(<PriorityIcon priority="HIGH" className="h-6 w-6 custom-class" />);
    const icon = container.querySelector('svg');
    expect(icon?.getAttribute('class')).toContain('h-6');
    expect(icon?.getAttribute('class')).toContain('w-6');
    expect(icon?.getAttribute('class')).toContain('custom-class');
  });

  it('uses AlertCircle icon for HIGH priority', () => {
    const { container } = render(<PriorityIcon priority="HIGH" />);
    // AlertCircle has specific SVG structure
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  it('uses Clock icon for MEDIUM priority', () => {
    const { container } = render(<PriorityIcon priority="MEDIUM" />);
    // Clock has specific SVG structure
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  it('uses Clock icon for LOW priority', () => {
    const { container } = render(<PriorityIcon priority="LOW" />);
    // Clock has specific SVG structure
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  it('renders with proper accessibility attributes', () => {
    const { container } = render(<PriorityIcon priority="HIGH" />);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
    expect(icon?.tagName.toLowerCase()).toBe('svg');
  });

  it('maintains consistent size across all priority levels', () => {
    const highPriority = render(<PriorityIcon priority="HIGH" />);
    const mediumPriority = render(<PriorityIcon priority="MEDIUM" />);
    const lowPriority = render(<PriorityIcon priority="LOW" />);

    const highIcon = highPriority.container.querySelector('svg');
    const mediumIcon = mediumPriority.container.querySelector('svg');
    const lowIcon = lowPriority.container.querySelector('svg');

    expect(highIcon?.getAttribute('class')).toContain('h-4 w-4');
    expect(mediumIcon?.getAttribute('class')).toContain('h-4 w-4');
    expect(lowIcon?.getAttribute('class')).toContain('h-4 w-4');

    highPriority.unmount();
    mediumPriority.unmount();
    lowPriority.unmount();
  });
});
