import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Status from './Status';
import type { StatusVariant } from './Status.types';

expect.extend(toHaveNoViolations);

describe('Status - Molecule (Alianza)', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      render(<Status />);
      expect(screen.getByTestId('status')).toBeInTheDocument();
    });

    it('renders with custom label', () => {
      render(<Status label="Active" />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders default label when not provided', () => {
      render(<Status />);
      expect(screen.getByText('Input text...')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(Status.displayName).toBe('Status');
    });

    it('has default data-testid attribute', () => {
      render(<Status />);
      expect(screen.getByTestId('status')).toBeInTheDocument();
    });

    it('accepts custom data-testid', () => {
      render(<Status data-testid="custom-status" />);
      expect(screen.getByTestId('custom-status')).toBeInTheDocument();
    });

    it('renders label with correct testid', () => {
      render(<Status label="Test Label" />);
      expect(screen.getByTestId('status-label')).toBeInTheDocument();
      expect(screen.getByTestId('status-label')).toHaveTextContent('Test Label');
    });
  });

  describe('Variants - All 5 Status Variants', () => {
    const variants: StatusVariant[] = [
      'default',
      'highlighted',
      'radio',
      'checkbox',
      'toggle',
    ];

    it.each(variants)('renders %s variant correctly', (variant) => {
      render(<Status variant={variant} label={`${variant} status`} />);
      expect(screen.getByText(`${variant} status`)).toBeInTheDocument();
    });

    it('uses default variant by default', () => {
      const { container } = render(<Status />);
      expect(container.querySelector('[data-testid="status-icon-default"]')).toBeInTheDocument();
    });

    it('default variant does not have background color', () => {
      render(<Status variant="default" />);
      const status = screen.getByTestId('status');
      expect(status).not.toHaveClass('bg-warning-foreground');
    });

    it('highlighted variant has warning background', () => {
      render(<Status variant="highlighted" />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('bg-warning-foreground');
    });

    it('radio variant renders radio-style icon', () => {
      render(<Status variant="radio" />);
      expect(screen.getByTestId('status-icon-radio')).toBeInTheDocument();
    });

    it('checkbox variant renders checkbox-style icon', () => {
      render(<Status variant="checkbox" />);
      expect(screen.getByTestId('status-icon-checkbox')).toBeInTheDocument();
    });

    it('toggle variant renders toggle-style icon', () => {
      render(<Status variant="toggle" />);
      expect(screen.getByTestId('status-icon-toggle')).toBeInTheDocument();
    });
  });

  describe('Icon Rendering - Default Variant', () => {
    it('renders star icon for default variant', () => {
      render(<Status variant="default" />);
      expect(screen.getByTestId('status-icon-default')).toBeInTheDocument();
    });

    it('default icon has correct size classes', () => {
      render(<Status variant="default" />);
      const iconContainer = screen.getByTestId('status-icon-default');
      expect(iconContainer).toHaveClass('size-[var(--icon-size-md)]');
    });

    it('default icon has muted foreground color', () => {
      render(<Status variant="default" />);
      const iconContainer = screen.getByTestId('status-icon-default');
      const svg = iconContainer.querySelector('svg');
      expect(svg).toHaveClass('text-muted-foreground-m');
    });

    it('default icon container is centered', () => {
      render(<Status variant="default" />);
      const iconContainer = screen.getByTestId('status-icon-default');
      expect(iconContainer).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('default icon does not shrink', () => {
      render(<Status variant="default" />);
      const iconContainer = screen.getByTestId('status-icon-default');
      expect(iconContainer).toHaveClass('shrink-0');
    });
  });

  describe('Icon Rendering - Highlighted Variant', () => {
    it('renders star icon for highlighted variant', () => {
      render(<Status variant="highlighted" />);
      expect(screen.getByTestId('status-icon-highlighted')).toBeInTheDocument();
    });

    it('highlighted icon has warning color', () => {
      render(<Status variant="highlighted" />);
      const iconContainer = screen.getByTestId('status-icon-highlighted');
      const svg = iconContainer.querySelector('svg');
      expect(svg).toHaveClass('text-warning');
    });

    it('highlighted icon has correct size classes', () => {
      render(<Status variant="highlighted" />);
      const iconContainer = screen.getByTestId('status-icon-highlighted');
      expect(iconContainer).toHaveClass('size-[var(--icon-size-md)]');
    });

    it('highlighted icon container is centered', () => {
      render(<Status variant="highlighted" />);
      const iconContainer = screen.getByTestId('status-icon-highlighted');
      expect(iconContainer).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('Icon Rendering - Radio Variant', () => {
    it('renders radio-style icon', () => {
      render(<Status variant="radio" />);
      expect(screen.getByTestId('status-icon-radio')).toBeInTheDocument();
    });

    it('radio icon has circular shape', () => {
      render(<Status variant="radio" />);
      const iconContainer = screen.getByTestId('status-icon-radio');
      expect(iconContainer).toHaveClass('rounded-full');
    });

    it('radio icon has border', () => {
      render(<Status variant="radio" />);
      const iconContainer = screen.getByTestId('status-icon-radio');
      expect(iconContainer).toHaveClass('border', 'border-accent-a');
    });

    it('radio icon has white background', () => {
      render(<Status variant="radio" />);
      const iconContainer = screen.getByTestId('status-icon-radio');
      expect(iconContainer).toHaveClass('bg-white');
    });

    it('radio icon contains inner circle', () => {
      render(<Status variant="radio" />);
      const iconContainer = screen.getByTestId('status-icon-radio');
      const innerCircle = iconContainer.querySelector('div');
      expect(innerCircle).toHaveClass('rounded-full', 'bg-accent-a');
    });

    it('radio icon has padding', () => {
      render(<Status variant="radio" />);
      const iconContainer = screen.getByTestId('status-icon-radio');
      expect(iconContainer).toHaveClass('p-[var(--space-1)]');
    });
  });

  describe('Icon Rendering - Checkbox Variant', () => {
    it('renders checkbox-style icon', () => {
      render(<Status variant="checkbox" />);
      expect(screen.getByTestId('status-icon-checkbox')).toBeInTheDocument();
    });

    it('checkbox icon has rounded corners', () => {
      render(<Status variant="checkbox" />);
      const iconContainer = screen.getByTestId('status-icon-checkbox');
      expect(iconContainer).toHaveClass('rounded-[var(--radius-xs)]');
    });

    it('checkbox icon has accent background', () => {
      render(<Status variant="checkbox" />);
      const iconContainer = screen.getByTestId('status-icon-checkbox');
      expect(iconContainer).toHaveClass('bg-accent-a');
    });

    it('checkbox icon contains checkmark', () => {
      render(<Status variant="checkbox" />);
      const iconContainer = screen.getByTestId('status-icon-checkbox');
      const checkmark = iconContainer.querySelector('svg');
      expect(checkmark).toBeInTheDocument();
    });

    it('checkbox icon is centered', () => {
      render(<Status variant="checkbox" />);
      const iconContainer = screen.getByTestId('status-icon-checkbox');
      expect(iconContainer).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('Icon Rendering - Toggle Variant', () => {
    it('renders toggle-style icon', () => {
      render(<Status variant="toggle" />);
      expect(screen.getByTestId('status-icon-toggle')).toBeInTheDocument();
    });

    it('toggle icon has pill shape', () => {
      render(<Status variant="toggle" />);
      const iconContainer = screen.getByTestId('status-icon-toggle');
      expect(iconContainer).toHaveClass('rounded-[var(--radius-pill)]');
    });

    it('toggle icon has accent background', () => {
      render(<Status variant="toggle" />);
      const iconContainer = screen.getByTestId('status-icon-toggle');
      expect(iconContainer).toHaveClass('bg-accent-a');
    });

    it('toggle icon has custom width and height', () => {
      render(<Status variant="toggle" />);
      const iconContainer = screen.getByTestId('status-icon-toggle');
      expect(iconContainer).toHaveClass('w-[var(--size-toggle-width)]', 'h-[var(--size-toggle-height)]');
    });

    it('toggle icon contains thumb element', () => {
      render(<Status variant="toggle" />);
      const iconContainer = screen.getByTestId('status-icon-toggle');
      const thumb = iconContainer.querySelector('div');
      expect(thumb).toHaveClass('bg-white', 'rounded-full');
    });

    it('toggle icon aligns content to end', () => {
      render(<Status variant="toggle" />);
      const iconContainer = screen.getByTestId('status-icon-toggle');
      expect(iconContainer).toHaveClass('flex', 'justify-end');
    });
  });

  describe('Label Display', () => {
    it('renders label text correctly', () => {
      render(<Status label="Active Status" />);
      expect(screen.getByText('Active Status')).toBeInTheDocument();
    });

    it('label has correct font classes', () => {
      render(<Status label="Test" />);
      const label = screen.getByTestId('status-label');
      expect(label).toHaveClass('font-sans', 'font-light', 'body-sm');
    });

    it('label prevents wrapping', () => {
      render(<Status label="Test" />);
      const label = screen.getByTestId('status-label');
      expect(label).toHaveClass('whitespace-nowrap');
    });

    it('default variant label has muted foreground color', () => {
      render(<Status variant="default" label="Test" />);
      const label = screen.getByTestId('status-label');
      expect(label).toHaveClass('text-muted-foreground-m');
    });

    it('highlighted variant label has warning color', () => {
      render(<Status variant="highlighted" label="Test" />);
      const label = screen.getByTestId('status-label');
      expect(label).toHaveClass('text-warning');
    });

    it('radio variant label has muted foreground color', () => {
      render(<Status variant="radio" label="Test" />);
      const label = screen.getByTestId('status-label');
      expect(label).toHaveClass('text-muted-foreground-m');
    });

    it('checkbox variant label has muted foreground color', () => {
      render(<Status variant="checkbox" label="Test" />);
      const label = screen.getByTestId('status-label');
      expect(label).toHaveClass('text-muted-foreground-m');
    });

    it('toggle variant label has muted foreground color', () => {
      render(<Status variant="toggle" label="Test" />);
      const label = screen.getByTestId('status-label');
      expect(label).toHaveClass('text-muted-foreground-m');
    });

    it('renders empty label', () => {
      render(<Status label="" />);
      const label = screen.getByTestId('status-label');
      expect(label).toBeEmptyDOMElement();
    });

    it('renders long label without wrapping', () => {
      render(<Status label="This is a very long status label that should not wrap" />);
      const label = screen.getByTestId('status-label');
      expect(label).toHaveClass('whitespace-nowrap');
    });
  });

  describe('Container Styling', () => {
    it('has flex layout', () => {
      render(<Status />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('flex', 'items-center');
    });

    it('has correct gap between icon and label', () => {
      render(<Status />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('gap-[var(--space-3-5)]');
    });

    it('has correct padding', () => {
      render(<Status />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('px-[var(--space-4)]', 'py-[var(--space-3)]');
    });

    it('has rounded corners', () => {
      render(<Status />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('rounded-[var(--radius-xs)]');
    });

    it('has fit-content width', () => {
      render(<Status />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('w-fit');
    });

    it('default variant has no background', () => {
      render(<Status variant="default" />);
      const status = screen.getByTestId('status');
      expect(status).not.toHaveClass('bg-warning-foreground');
    });

    it('highlighted variant has warning background', () => {
      render(<Status variant="highlighted" />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('bg-warning-foreground');
    });
  });

  describe('Custom Styling', () => {
    it('accepts className prop', () => {
      render(<Status className="custom-class" />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      render(<Status className="custom-class" />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('custom-class', 'flex', 'items-center');
    });

    it('custom className can override default styles', () => {
      render(<Status className="p-8 bg-red-500" />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('p-8', 'bg-red-500');
    });
  });

  describe('Theme Integration', () => {
    it('applies themeOverride styles', () => {
      const themeOverride = {
        '--custom-color': '#ff0000',
        backgroundColor: 'blue',
      } as React.CSSProperties;
      render(<Status themeOverride={themeOverride} />);
      const status = screen.getByTestId('status');

      expect(status.style.getPropertyValue('--custom-color')).toBe('#ff0000');
      expect(status.style.backgroundColor).toBe('blue');
    });

    it('applies multiple theme variables', () => {
      const themeOverride = {
        '--icon-size-md': '32px',
        '--space-3': '12px',
        '--radius-xs': '4px',
      } as React.CSSProperties;
      render(<Status themeOverride={themeOverride} />);
      const status = screen.getByTestId('status');

      expect(status.style.getPropertyValue('--icon-size-md')).toBe('32px');
      expect(status.style.getPropertyValue('--space-3')).toBe('12px');
      expect(status.style.getPropertyValue('--radius-xs')).toBe('4px');
    });
  });

  describe('Accessibility', () => {
    it('has accessible label from label prop by default', () => {
      render(<Status label="Active Status" />);
      const status = screen.getByTestId('status');
      expect(status).toHaveAttribute('aria-label', 'Active Status');
    });

    it('accepts custom aria-label', () => {
      render(<Status label="Active" aria-label="Status is Active" />);
      const status = screen.getByTestId('status');
      expect(status).toHaveAttribute('aria-label', 'Status is Active');
    });

    it('aria-label overrides label prop', () => {
      render(<Status label="Active" aria-label="Custom Label" />);
      const status = screen.getByTestId('status');
      expect(status).toHaveAttribute('aria-label', 'Custom Label');
      expect(status).not.toHaveAttribute('aria-label', 'Active');
    });

    it('default variant has no accessibility violations', async () => {
      const { container } = render(<Status variant="default" label="Default Status" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('highlighted variant has no accessibility violations', async () => {
      const { container } = render(<Status variant="highlighted" label="Highlighted Status" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('radio variant has no accessibility violations', async () => {
      const { container } = render(<Status variant="radio" label="Radio Status" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('checkbox variant has no accessibility violations', async () => {
      const { container } = render(<Status variant="checkbox" label="Checkbox Status" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('toggle variant has no accessibility violations', async () => {
      const { container } = render(<Status variant="toggle" label="Toggle Status" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Status ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('ref points to div element', () => {
      const ref = { current: null };
      render(<Status ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref can be used to access DOM element', () => {
      const ref = { current: null } as unknown as React.RefObject<HTMLDivElement>;
      render(<Status ref={ref} label="Test" />);
      expect(ref.current?.textContent).toContain('Test');
    });
  });

  describe('Edge Cases', () => {
    it('renders with undefined label', () => {
      render(<Status label={undefined} />);
      expect(screen.getByText('Input text...')).toBeInTheDocument();
    });

    it('renders with null className', () => {
      render(<Status className={undefined} />);
      const status = screen.getByTestId('status');
      expect(status).toBeInTheDocument();
    });

    it('renders with all props undefined', () => {
      render(<Status label={undefined} variant={undefined} className={undefined} />);
      expect(screen.getByTestId('status')).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      render(<Status label="Status & <Special> Characters!" />);
      expect(screen.getByText('Status & <Special> Characters!')).toBeInTheDocument();
    });

    it('handles unicode characters in label', () => {
      render(<Status label="状態 🎉" />);
      expect(screen.getByText('状態 🎉')).toBeInTheDocument();
    });

    it('handles very long label', () => {
      const longLabel = 'A'.repeat(200);
      render(<Status label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('renders with numeric label converted to string', () => {
      render(<Status label={'123' as string} />);
      expect(screen.getByText('123')).toBeInTheDocument();
    });
  });

  describe('Variant Combinations with Labels', () => {
    it('default variant with custom label', () => {
      render(<Status variant="default" label="Pending" />);
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByTestId('status-icon-default')).toBeInTheDocument();
    });

    it('highlighted variant with custom label', () => {
      render(<Status variant="highlighted" label="Important" />);
      expect(screen.getByText('Important')).toBeInTheDocument();
      expect(screen.getByTestId('status-icon-highlighted')).toBeInTheDocument();
    });

    it('radio variant with custom label', () => {
      render(<Status variant="radio" label="Selected" />);
      expect(screen.getByText('Selected')).toBeInTheDocument();
      expect(screen.getByTestId('status-icon-radio')).toBeInTheDocument();
    });

    it('checkbox variant with custom label', () => {
      render(<Status variant="checkbox" label="Completed" />);
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByTestId('status-icon-checkbox')).toBeInTheDocument();
    });

    it('toggle variant with custom label', () => {
      render(<Status variant="toggle" label="Enabled" />);
      expect(screen.getByText('Enabled')).toBeInTheDocument();
      expect(screen.getByTestId('status-icon-toggle')).toBeInTheDocument();
    });
  });

  describe('Visual Regression Prevention', () => {
    it('maintains consistent gap between icon and label', () => {
      const { container } = render(<Status label="Test" />);
      const status = container.querySelector('[data-testid="status"]');
      expect(status).toHaveClass('gap-[var(--space-3-5)]');
    });

    it('maintains consistent padding across variants', () => {
      const variants: StatusVariant[] = ['default', 'highlighted', 'radio', 'checkbox', 'toggle'];

      variants.forEach((variant) => {
        const { container } = render(<Status variant={variant} />);
        const status = container.querySelector('[data-testid="status"]');
        expect(status).toHaveClass('px-[var(--space-4)]', 'py-[var(--space-3)]');
      });
    });

    it('maintains consistent border radius', () => {
      render(<Status />);
      const status = screen.getByTestId('status');
      expect(status).toHaveClass('rounded-[var(--radius-xs)]');
    });

    it('maintains consistent icon size for star variants', () => {
      const { container: container1 } = render(<Status variant="default" />);
      const { container: container2 } = render(<Status variant="highlighted" />);

      const icon1 = container1.querySelector('[data-testid="status-icon-default"]');
      const icon2 = container2.querySelector('[data-testid="status-icon-highlighted"]');

      expect(icon1).toHaveClass('size-[var(--icon-size-md)]');
      expect(icon2).toHaveClass('size-[var(--icon-size-md)]');
    });

    it('radio icon maintains circular shape', () => {
      render(<Status variant="radio" />);
      const icon = screen.getByTestId('status-icon-radio');
      expect(icon).toHaveClass('rounded-full');
    });

    it('toggle icon maintains pill shape', () => {
      render(<Status variant="toggle" />);
      const icon = screen.getByTestId('status-icon-toggle');
      expect(icon).toHaveClass('rounded-[var(--radius-pill)]');
    });
  });

  describe('Component Structure', () => {
    it('renders div as root element', () => {
      const { container } = render(<Status />);
      const status = screen.getByTestId('status');
      expect(status.tagName).toBe('DIV');
    });

    it('contains exactly one icon element', () => {
      render(<Status variant="default" />);
      const status = screen.getByTestId('status');
      const icons = status.querySelectorAll('[data-testid^="status-icon-"]');
      expect(icons).toHaveLength(1);
    });

    it('contains exactly one label element', () => {
      render(<Status />);
      const status = screen.getByTestId('status');
      const labels = status.querySelectorAll('[data-testid="status-label"]');
      expect(labels).toHaveLength(1);
    });

    it('icon comes before label in DOM order', () => {
      const { container } = render(<Status variant="default" label="Test" />);
      const status = container.querySelector('[data-testid="status"]');
      const children = Array.from(status?.children || []);

      expect(children[0]).toHaveAttribute('data-testid', 'status-icon-default');
      expect(children[1]).toHaveAttribute('data-testid', 'status-label');
    });
  });
});
