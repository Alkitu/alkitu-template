import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserAvatar } from './UserAvatar';
import type { UserAvatarSize } from './UserAvatar.types';

expect.extend(toHaveNoViolations);

describe('UserAvatar - Molecule (Alianza)', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with name', () => {
      const { container } = render(<UserAvatar name="Ana" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('displays initials from name', () => {
      const { container } = render(<UserAvatar name="Ana" />);
      expect(container.textContent).toBe('A');
    });

    it('has displayName set', () => {
      expect(UserAvatar.displayName).toBe('UserAvatar');
    });

    it('applies default classes', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('flex', 'items-center', 'justify-center', 'rounded-full');
    });

    it('applies background and text color classes', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('bg-primary', 'text-primary-foreground', 'font-semibold');
    });

    it('has shrink-0 class for flex layouts', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('shrink-0');
    });
  });

  describe('Initials Generation - Single Name', () => {
    it('generates single initial for one word name', () => {
      const { container } = render(<UserAvatar name="Ana" />);
      expect(container.textContent).toBe('A');
    });

    it('generates two initials from first and second word', () => {
      const { container } = render(<UserAvatar name="Ana María" />);
      expect(container.textContent).toBe('AM');
    });

    it('uses only first two words for multi-word names', () => {
      const { container } = render(<UserAvatar name="Ana María José" />);
      expect(container.textContent).toBe('AM');
    });

    it('handles single letter name', () => {
      const { container } = render(<UserAvatar name="A" />);
      expect(container.textContent).toBe('A');
    });

    it('capitalizes lowercase names', () => {
      const { container } = render(<UserAvatar name="ana" />);
      expect(container.textContent).toBe('A');
    });

    it('capitalizes two-word lowercase names', () => {
      const { container } = render(<UserAvatar name="ana maría" />);
      expect(container.textContent).toBe('AM');
    });

    it('handles names with extra spaces', () => {
      const { container } = render(<UserAvatar name="  Ana   María  " />);
      expect(container.textContent).toBe('AM');
    });

    it('handles names with leading spaces', () => {
      const { container } = render(<UserAvatar name="   Ana" />);
      expect(container.textContent).toBe('A');
    });

    it('handles names with trailing spaces', () => {
      const { container } = render(<UserAvatar name="Ana   " />);
      expect(container.textContent).toBe('A');
    });
  });

  describe('Initials Generation - Name with LastName', () => {
    it('generates initials from name and lastName', () => {
      const { container } = render(<UserAvatar name="Ana" lastName="Martínez" />);
      expect(container.textContent).toBe('AM');
    });

    it('uses first letter of each parameter', () => {
      const { container } = render(<UserAvatar name="Luis" lastName="Gómez" />);
      expect(container.textContent).toBe('LG');
    });

    it('ignores additional words in name when lastName is provided', () => {
      const { container } = render(<UserAvatar name="Ana María" lastName="Martínez" />);
      expect(container.textContent).toBe('AM');
    });

    it('handles lastName with spaces', () => {
      const { container } = render(<UserAvatar name="Ana" lastName="Martínez López" />);
      expect(container.textContent).toBe('AM');
    });

    it('handles empty lastName', () => {
      const { container } = render(<UserAvatar name="Ana María" lastName="" />);
      expect(container.textContent).toBe('AM');
    });

    it('handles lastName with only spaces', () => {
      const { container } = render(<UserAvatar name="Ana María" lastName="   " />);
      expect(container.textContent).toBe('AM');
    });

    it('capitalizes lastName', () => {
      const { container } = render(<UserAvatar name="Ana" lastName="martínez" />);
      expect(container.textContent).toBe('AM');
    });

    it('trims lastName spaces', () => {
      const { container } = render(<UserAvatar name="Ana" lastName="  Martínez  " />);
      expect(container.textContent).toBe('AM');
    });
  });

  describe('Size Variants', () => {
    const sizes: UserAvatarSize[] = ['sm', 'md', 'lg'];

    it.each(sizes)('renders %s size with correct classes', (size) => {
      const { container } = render(<UserAvatar name="Test" size={size} />);
      const avatar = container.firstChild as HTMLElement;

      if (size === 'sm') {
        expect(avatar).toHaveClass('h-8', 'w-8', 'text-xs');
      } else if (size === 'md') {
        expect(avatar).toHaveClass('h-10', 'w-10', 'text-sm');
      } else if (size === 'lg') {
        expect(avatar).toHaveClass('h-12', 'w-12', 'text-base');
      }
    });

    it('uses md size by default', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('h-10', 'w-10', 'text-sm');
    });

    it('renders sm size correctly', () => {
      const { container } = render(<UserAvatar name="Test" size="sm" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('h-8', 'w-8', 'text-xs');
    });

    it('renders lg size correctly', () => {
      const { container } = render(<UserAvatar name="Test" size="lg" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('h-12', 'w-12', 'text-base');
    });

    it('maintains aspect ratio (square) for all sizes', () => {
      sizes.forEach((size) => {
        const { container } = render(<UserAvatar name="Test" size={size} />);
        const avatar = container.firstChild as HTMLElement;
        const widthClass = avatar.className.match(/w-\d+/)?.[0];
        const heightClass = avatar.className.match(/h-\d+/)?.[0];
        expect(widthClass).toBeDefined();
        expect(heightClass).toBeDefined();
        // Extract numbers and compare
        const width = widthClass?.match(/\d+/)?.[0];
        const height = heightClass?.match(/\d+/)?.[0];
        expect(width).toBe(height);
      });
    });
  });

  describe('Custom Styling', () => {
    it('accepts className prop', () => {
      const { container } = render(<UserAvatar name="Test" className="custom-class" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<UserAvatar name="Test" className="custom-class" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('custom-class', 'bg-primary', 'rounded-full');
    });

    it('allows className to override default classes', () => {
      const { container } = render(
        <UserAvatar name="Test" className="bg-blue-500 text-white" />
      );
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('bg-blue-500', 'text-white');
    });

    it('applies themeOverride CSS properties', () => {
      const themeOverride = {
        '--primary': '#ff0000',
        backgroundColor: 'blue',
      } as React.CSSProperties;
      const { container } = render(
        <UserAvatar name="Test" themeOverride={themeOverride} />
      );
      const avatar = container.firstChild as HTMLElement;
      expect(avatar.style.getPropertyValue('--primary')).toBe('#ff0000');
      expect(avatar.style.backgroundColor).toBe('blue');
    });

    it('combines className and themeOverride', () => {
      const themeOverride = { '--custom': 'value' } as React.CSSProperties;
      const { container } = render(
        <UserAvatar name="Test" className="custom" themeOverride={themeOverride} />
      );
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('custom');
      expect(avatar.style.getPropertyValue('--custom')).toBe('value');
    });
  });

  describe('Special Characters and Unicode', () => {
    it('handles names with accents', () => {
      const { container } = render(<UserAvatar name="José" />);
      expect(container.textContent).toBe('J');
    });

    it('handles names with ñ character', () => {
      const { container } = render(<UserAvatar name="Peña" />);
      expect(container.textContent).toBe('P');
    });

    it('handles names with umlauts', () => {
      const { container } = render(<UserAvatar name="Müller" />);
      expect(container.textContent).toBe('M');
    });

    it('handles names with Chinese characters', () => {
      const { container } = render(<UserAvatar name="李明" />);
      expect(container.textContent).toBe('李');
    });

    it('handles names with Arabic characters', () => {
      const { container } = render(<UserAvatar name="محمد" />);
      expect(container.textContent).toBe('م');
    });

    it('handles names with Cyrillic characters', () => {
      const { container } = render(<UserAvatar name="Иван" />);
      expect(container.textContent).toBe('И');
    });

    it('handles emoji in names (edge case)', () => {
      const { container } = render(<UserAvatar name="Ana 😊" />);
      // Should still extract first character
      expect(container.textContent).toMatch(/A/);
    });
  });

  describe('Edge Cases', () => {
    it('handles very long single name', () => {
      const longName = 'Constantinopolitan';
      const { container } = render(<UserAvatar name={longName} />);
      expect(container.textContent).toBe('C');
    });

    it('handles very long multi-word name', () => {
      const longName = 'Constantinopolitan Wilhelmina';
      const { container } = render(<UserAvatar name={longName} />);
      expect(container.textContent).toBe('CW');
    });

    it('handles name with numbers', () => {
      const { container } = render(<UserAvatar name="User123" />);
      expect(container.textContent).toBe('U');
    });

    it('handles name starting with number', () => {
      const { container } = render(<UserAvatar name="123User" />);
      expect(container.textContent).toBe('1');
    });

    it('handles hyphenated names', () => {
      const { container } = render(<UserAvatar name="Anne-Marie" />);
      expect(container.textContent).toBe('A');
    });

    it('handles apostrophes in names', () => {
      const { container } = render(<UserAvatar name="O'Brien" />);
      expect(container.textContent).toBe('O');
    });

    it('limits initials to 2 characters', () => {
      const { container } = render(<UserAvatar name="Ana María José" lastName="Pérez" />);
      const initials = container.textContent || '';
      expect(initials.length).toBeLessThanOrEqual(2);
    });

    it('handles name with multiple consecutive spaces', () => {
      const { container } = render(<UserAvatar name="Ana    María" />);
      expect(container.textContent).toBe('AM');
    });

    it('handles mixed case names', () => {
      const { container } = render(<UserAvatar name="aNa MaRíA" />);
      expect(container.textContent).toBe('AM');
    });
  });

  describe('Visual Consistency', () => {
    it('maintains rounded-full shape', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('rounded-full');
    });

    it('has flex layout for centering', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('has font-semibold for initials', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('font-semibold');
    });

    it('uses primary color scheme', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('prevents shrinking in flex containers', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('shrink-0');
    });
  });

  describe('Size-Specific Text Sizing', () => {
    it('sm size has text-xs', () => {
      const { container } = render(<UserAvatar name="Test" size="sm" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('text-xs');
    });

    it('md size has text-sm', () => {
      const { container } = render(<UserAvatar name="Test" size="md" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('text-sm');
    });

    it('lg size has text-base', () => {
      const { container } = render(<UserAvatar name="Test" size="lg" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('text-base');
    });
  });

  describe('Accessibility', () => {
    it('renders as div element', () => {
      const { container } = render(<UserAvatar name="Test" />);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<UserAvatar name="Ana Martínez" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with lastName', async () => {
      const { container } = render(<UserAvatar name="Ana" lastName="Martínez" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with all sizes', async () => {
      const sizes: UserAvatarSize[] = ['sm', 'md', 'lg'];
      for (const size of sizes) {
        const { container } = render(<UserAvatar name="Test" size={size} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('has no violations with custom className', async () => {
      const { container } = render(<UserAvatar name="Test" className="custom" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('displays text content that can be read by screen readers', () => {
      const { container } = render(<UserAvatar name="Ana" lastName="Martínez" />);
      expect(container.textContent).toBe('AM');
    });
  });

  describe('Integration with Alianza Design System', () => {
    it('uses Alianza primary color variables', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('follows Alianza size scale (8, 10, 12)', () => {
      const sizes: Record<UserAvatarSize, string> = {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
      };

      Object.entries(sizes).forEach(([size, expectedClass]) => {
        const { container } = render(
          <UserAvatar name="Test" size={size as UserAvatarSize} />
        );
        const avatar = container.firstChild as HTMLElement;
        expect(avatar).toHaveClass(expectedClass);
      });
    });

    it('uses rounded-full for circular shape (Alianza style)', () => {
      const { container } = render(<UserAvatar name="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('rounded-full');
    });

    it('supports theme customization via CSS variables', () => {
      const { container } = render(
        <UserAvatar
          name="Test"
          themeOverride={{
            '--primary': 'oklch(0.5 0.2 200)',
          } as React.CSSProperties}
        />
      );
      const avatar = container.firstChild as HTMLElement;
      expect(avatar.style.getPropertyValue('--primary')).toBe('oklch(0.5 0.2 200)');
    });
  });

  describe('Regression Tests', () => {
    it('does not break with undefined lastName', () => {
      const { container } = render(<UserAvatar name="Ana" lastName={undefined} />);
      expect(container.textContent).toBe('A');
    });

    it('handles null-like values gracefully', () => {
      const { container } = render(<UserAvatar name="Ana" lastName={'' as any} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('re-renders correctly when props change', () => {
      const { container, rerender } = render(<UserAvatar name="Ana" />);
      expect(container.textContent).toBe('A');

      rerender(<UserAvatar name="Luis" />);
      expect(container.textContent).toBe('L');
    });

    it('re-renders correctly when lastName changes', () => {
      const { container, rerender } = render(<UserAvatar name="Ana" />);
      expect(container.textContent).toBe('A');

      rerender(<UserAvatar name="Ana" lastName="Martínez" />);
      expect(container.textContent).toBe('AM');
    });

    it('re-renders correctly when size changes', () => {
      const { container, rerender } = render(<UserAvatar name="Ana" size="sm" />);
      let avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('h-8');

      rerender(<UserAvatar name="Ana" size="lg" />);
      avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('h-12');
    });
  });

  describe('Component Composition', () => {
    it('can be rendered in a flex container', () => {
      const { container } = render(
        <div className="flex">
          <UserAvatar name="Ana" />
        </div>
      );
      const avatar = container.querySelector('.rounded-full');
      expect(avatar).toBeInTheDocument();
    });

    it('can be rendered in a grid', () => {
      const { container } = render(
        <div className="grid">
          <UserAvatar name="Ana" />
        </div>
      );
      const avatar = container.querySelector('.rounded-full');
      expect(avatar).toBeInTheDocument();
    });

    it('can be rendered multiple times with different props', () => {
      const { container } = render(
        <div>
          <UserAvatar name="Ana" size="sm" />
          <UserAvatar name="Luis" size="md" />
          <UserAvatar name="María" size="lg" />
        </div>
      );
      const avatars = container.querySelectorAll('.rounded-full');
      expect(avatars).toHaveLength(3);
    });
  });
});
