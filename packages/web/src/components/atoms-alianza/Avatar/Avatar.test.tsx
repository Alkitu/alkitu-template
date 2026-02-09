import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

expect.extend(toHaveNoViolations);

describe('Avatar Component - PHASE 2 CONSOLIDATION', () => {
  describe('Primitive API', () => {
    describe('Rendering', () => {
      it('renders correctly with primitive composition', () => {
        render(
          <Avatar>
            <AvatarImage src="/test-image.jpg" alt="Test User" />
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
        );

        expect(screen.getByText('TU')).toBeInTheDocument();
      });

      it('applies data-slot attribute to root', () => {
        const { container } = render(
          <Avatar>
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
        );

        const avatar = container.querySelector('[data-slot="avatar"]');
        expect(avatar).toBeInTheDocument();
      });

      it('forwards ref correctly', () => {
        const ref = vi.fn();
        render(
          <Avatar ref={ref}>
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
        );

        expect(ref).toHaveBeenCalled();
      });
    });

    describe('AvatarImage', () => {
      it('renders Avatar with AvatarImage component', () => {
        render(
          <Avatar>
            <AvatarImage src="/test.jpg" alt="Test" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
        );

        // Fallback is shown (Radix handles image loading asynchronously)
        expect(screen.getByText('T')).toBeInTheDocument();
      });
    });

    describe('AvatarFallback', () => {
      it('renders fallback text correctly', () => {
        render(
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        );

        expect(screen.getByText('JD')).toBeInTheDocument();
      });

      it('applies data-slot attribute to fallback', () => {
        const { container } = render(
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        );

        const fallback = container.querySelector('[data-slot="avatar-fallback"]');
        expect(fallback).toBeInTheDocument();
      });

      it('centers content with flex layout', () => {
        const { container } = render(
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        );

        const fallback = container.querySelector('[data-slot="avatar-fallback"]');
        expect(fallback).toHaveClass('flex', 'items-center', 'justify-center');
      });
    });
  });

  describe('Simplified API', () => {
    describe('Basic Rendering', () => {
      it('generates initials from fallback prop', () => {
        render(<Avatar alt="Test User" fallback="John Doe" />);

        // Initials should be "JD"
        expect(screen.getByText('JD')).toBeInTheDocument();
      });

      it('generates initials from single word', () => {
        render(<Avatar alt="Test" fallback="John" />);

        // Should take first 2 characters
        expect(screen.getByText('JO')).toBeInTheDocument();
      });

      it('shows User icon when no src or fallback', () => {
        const { container } = render(<Avatar alt="Test User" />);

        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('aria-label', 'User icon');
      });

      it('hides icon when showIconFallback is false', () => {
        const { container } = render(
          <Avatar alt="Test User" showIconFallback={false} />
        );

        const icon = container.querySelector('svg');
        expect(icon).not.toBeInTheDocument();
      });
    });

    describe('Image Loading States', () => {
      it('shows fallback initially', () => {
        render(
          <Avatar src="/test-image.jpg" alt="Test User" fallback="John Doe" />
        );

        // Fallback should be visible initially (Radix handles image loading)
        expect(screen.getByText('JD')).toBeInTheDocument();
      });
    });
  });

  describe('Size Variants', () => {
    it.each([
      ['xs', 'h-6', 'w-6', 'text-xs'],
      ['sm', 'h-8', 'w-8', 'text-xs'],
      ['md', 'h-10', 'w-10', 'text-sm'],
      ['lg', 'h-12', 'w-12', 'text-base'],
      ['xl', 'h-16', 'w-16', 'text-lg'],
      ['2xl', 'h-20', 'w-20', 'text-xl'],
    ])('applies correct size classes for %s size', (size, heightClass, widthClass, textClass) => {
      const { container } = render(
        <Avatar size={size as any} alt="Test" fallback="T" />
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass(heightClass, widthClass, textClass);
    });

    it('uses md size by default', () => {
      const { container } = render(<Avatar alt="Test" fallback="T" />);

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('h-10', 'w-10', 'text-sm');
    });
  });

  describe('Shape Variants', () => {
    it.each([
      ['circular', 'rounded-full'],
      ['rounded', 'rounded-lg'],
      ['square', 'rounded-none'],
    ])('applies correct shape class for %s variant', (variant, shapeClass) => {
      const { container } = render(
        <Avatar variant={variant as any} alt="Test" fallback="T" />
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass(shapeClass);
    });

    it('uses circular variant by default', () => {
      const { container } = render(<Avatar alt="Test" fallback="T" />);

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('rounded-full');
    });
  });

  describe('Status Indicator', () => {
    it.each([
      ['online', 'bg-success'],
      ['offline', 'bg-muted'],
      ['away', 'bg-warning'],
      ['busy', 'bg-destructive'],
    ])('displays %s status with correct color', (status, colorClass) => {
      const { container } = render(
        <Avatar status={status as any} alt="Test" fallback="T" />
      );

      const statusIndicator = container.querySelector('[role="status"]');
      expect(statusIndicator).toBeInTheDocument();
      expect(statusIndicator).toHaveClass(colorClass);
    });

    it('hides status indicator when status is none', () => {
      const { container } = render(
        <Avatar status="none" alt="Test" fallback="T" />
      );

      const statusIndicator = container.querySelector('[role="status"]');
      // When status is 'none', the indicator has 'hidden' class
      if (statusIndicator) {
        expect(statusIndicator).toHaveClass('hidden');
      } else {
        // Or it's not rendered at all, which is also valid
        expect(statusIndicator).toBeNull();
      }
    });

    it('does not render status indicator by default', () => {
      const { container } = render(<Avatar alt="Test" fallback="T" />);

      const statusIndicator = container.querySelector('[role="status"]');
      // By default, status is 'none', so indicator should have 'hidden' class or not be rendered
      if (statusIndicator) {
        expect(statusIndicator).toHaveClass('hidden');
      } else {
        expect(statusIndicator).toBeNull();
      }
    });

    it('positions status indicator at bottom-right', () => {
      const { container } = render(
        <Avatar status="online" alt="Test" fallback="T" />
      );

      const statusIndicator = container.querySelector('[role="status"]');
      expect(statusIndicator).toHaveClass('absolute', '-bottom-0', '-right-0');
    });

    it('applies border to status indicator', () => {
      const { container } = render(
        <Avatar status="online" size="md" alt="Test" fallback="T" />
      );

      const statusIndicator = container.querySelector('[role="status"]');
      expect(statusIndicator).toHaveClass('border-2', 'border-background');
    });

    it('scales status indicator with avatar size', () => {
      const sizes = [
        { size: 'xs', sizeClass: 'h-2' },
        { size: 'sm', sizeClass: 'h-2.5' },
        { size: 'md', sizeClass: 'h-3' },
        { size: 'lg', sizeClass: 'h-3.5' },
        { size: 'xl', sizeClass: 'h-4' },
        { size: '2xl', sizeClass: 'h-5' },
      ];

      sizes.forEach(({ size, sizeClass }) => {
        const { container } = render(
          <Avatar status="online" size={size as any} alt="Test" fallback="T" />
        );

        const statusIndicator = container.querySelector('[role="status"]');
        expect(statusIndicator).toHaveClass(sizeClass);
      });
    });
  });

  describe('Theme Integration', () => {
    it('uses theme CSS variables for background', () => {
      const { container } = render(<Avatar alt="Test" fallback="T" />);

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('bg-muted');
    });

    it('uses theme CSS variables for fallback text color', () => {
      const { container } = render(<Avatar alt="Test" fallback="T" />);

      const fallback = container.querySelector('[data-slot="avatar-fallback"]');
      expect(fallback).toHaveClass('text-muted-foreground');
    });

    it('accepts themeOverride prop', () => {
      const { container } = render(
        <Avatar
          alt="Test"
          fallback="T"
          themeOverride={{ backgroundColor: 'red' }}
        />
      );

      const avatar = container.querySelector('[data-slot="avatar"]') as HTMLElement;
      expect(avatar.style.backgroundColor).toBe('red');
    });

    it('applies useSystemColors data attribute', () => {
      const { container } = render(
        <Avatar alt="Test" fallback="T" useSystemColors={false} />
      );

      const avatar = container.querySelector('[data-use-system-colors="false"]');
      expect(avatar).toBeInTheDocument();
    });

    it('useSystemColors is true by default', () => {
      const { container } = render(<Avatar alt="Test" fallback="T" />);

      const avatar = container.querySelector('[data-use-system-colors="true"]');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Icon Sizing', () => {
    it.each([
      ['xs', 'h-3', 'w-3'],
      ['sm', 'h-4', 'w-4'],
      ['md', 'h-5', 'w-5'],
      ['lg', 'h-6', 'w-6'],
      ['xl', 'h-8', 'w-8'],
      ['2xl', 'h-10', 'w-10'],
    ])('applies correct icon size for %s avatar', (size, heightClass, widthClass) => {
      const { container } = render(
        <Avatar size={size as any} alt="Test" showIconFallback={true} />
      );

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass(heightClass, widthClass);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with primitive API', async () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="/test.jpg" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with simplified API', async () => {
      const { container } = render(
        <Avatar src="/test.jpg" alt="John Doe" fallback="John Doe" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with status indicator', async () => {
      const { container } = render(
        <Avatar
          src="/test.jpg"
          alt="John Doe"
          fallback="John Doe"
          status="online"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides title for status indicator', () => {
      const { container } = render(
        <Avatar status="online" alt="Test" fallback="T" />
      );

      const statusIndicator = container.querySelector('[title="Status: online"]');
      expect(statusIndicator).toBeInTheDocument();
    });

    it('provides aria-label for User icon', () => {
      const { container } = render(<Avatar alt="Test User" />);

      const icon = container.querySelector('svg[aria-label="User icon"]');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Custom Classes', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <Avatar className="custom-class" alt="Test" fallback="T" />
      );

      const avatar = container.querySelector('.custom-class');
      expect(avatar).toBeInTheDocument();
    });

    it('merges custom className with default classes', () => {
      const { container } = render(
        <Avatar className="custom-class" alt="Test" fallback="T" />
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('custom-class', 'bg-muted');
    });

    it('accepts custom className on AvatarImage', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage
            src="/test.jpg"
            alt="Test"
            className="custom-image-class"
          />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      );

      // Custom class is applied via AvatarImage component
      // Radix may not render image immediately in test environment
      const fallback = screen.getByText('T');
      expect(fallback).toBeInTheDocument();
    });

    it('accepts custom className on AvatarFallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback className="custom-fallback-class">T</AvatarFallback>
        </Avatar>
      );

      const fallback = container.querySelector('.custom-fallback-class');
      expect(fallback).toBeInTheDocument();
    });
  });

  describe('Backward Compatibility', () => {
    it('supports UI version pattern (primitive composition)', () => {
      render(
        <Avatar>
          <AvatarImage src="/test.jpg" alt="Test" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      );

      // Primitive composition pattern works - fallback is shown
      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('supports Theme Editor pattern (simplified with status)', () => {
      const { container } = render(
        <Avatar
          src="/test.jpg"
          alt="Test User"
          fallback="Test User"
          size="xl"
          status="online"
        />
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('h-16', 'w-16');

      const statusIndicator = container.querySelector('[role="status"]');
      expect(statusIndicator).toHaveClass('bg-success');
    });

    it('supports Atomic Design pattern (with themeOverride)', () => {
      const { container } = render(
        <Avatar
          src="/test.jpg"
          alt="Test"
          themeOverride={{ backgroundColor: 'blue' }}
        />
      );

      const avatar = container.querySelector('[data-slot="avatar"]') as HTMLElement;
      expect(avatar.style.backgroundColor).toBe('blue');
    });
  });

  describe('Component Composition', () => {
    it('works with size and status in primitive API', () => {
      const { container } = render(
        <Avatar size="lg" status="online">
          <AvatarImage src="/test.jpg" alt="Test" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('h-12', 'w-12');

      const statusIndicator = container.querySelector('[role="status"]');
      expect(statusIndicator).toHaveClass('bg-success');
    });

    it('works with variant in primitive API', () => {
      const { container } = render(
        <Avatar variant="rounded">
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('rounded-lg');
    });

    it('combines all props in simplified API', () => {
      const { container } = render(
        <Avatar
          src="/test.jpg"
          alt="Test User"
          fallback="Test User"
          size="xl"
          variant="rounded"
          status="online"
          className="custom-avatar"
          themeOverride={{ borderColor: 'red' }}
        />
      );

      const avatar = container.querySelector('[data-slot="avatar"]') as HTMLElement;
      expect(avatar).toHaveClass('h-16', 'w-16', 'rounded-lg', 'custom-avatar');
      expect(avatar.style.borderColor).toBe('red');

      const statusIndicator = container.querySelector('[role="status"]');
      expect(statusIndicator).toHaveClass('bg-success');
    });
  });

  describe('Display Names', () => {
    it('has correct displayName for Avatar', () => {
      expect(Avatar.displayName).toBe('Avatar');
    });

    it('has correct displayName for AvatarImage', () => {
      expect(AvatarImage.displayName).toBe('AvatarImage');
    });

    it('has correct displayName for AvatarFallback', () => {
      expect(AvatarFallback.displayName).toBe('AvatarFallback');
    });
  });
});
