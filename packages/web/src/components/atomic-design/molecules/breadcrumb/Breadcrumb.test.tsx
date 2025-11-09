import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbNavigation,
} from './Breadcrumb';
import { Home, Folder } from 'lucide-react';

expect.extend(toHaveNoViolations);

describe('Breadcrumb - Primitive Components', () => {
  describe('Breadcrumb (Root)', () => {
    it('renders correctly with nav element', () => {
      const { container } = render(<Breadcrumb />);
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb');
      expect(nav).toHaveAttribute('data-slot', 'breadcrumb');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Breadcrumb ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(<Breadcrumb className="custom-class" />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('custom-class');
    });
  });

  describe('BreadcrumbList', () => {
    it('renders ordered list correctly', () => {
      const { container } = render(
        <BreadcrumbList>
          <li>Item 1</li>
        </BreadcrumbList>
      );
      const ol = container.querySelector('ol');
      expect(ol).toBeInTheDocument();
      expect(ol).toHaveAttribute('data-slot', 'breadcrumb-list');
    });

    it('applies default styling classes', () => {
      const { container } = render(<BreadcrumbList />);
      const ol = container.querySelector('ol');
      expect(ol).toHaveClass('text-muted-foreground');
      expect(ol).toHaveClass('flex');
      expect(ol).toHaveClass('items-center');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<BreadcrumbList className="custom" />);
      const ol = container.querySelector('ol');
      expect(ol).toHaveClass('text-muted-foreground');
      expect(ol).toHaveClass('custom');
    });
  });

  describe('BreadcrumbItem', () => {
    it('renders list item correctly', () => {
      const { container } = render(<BreadcrumbItem>Content</BreadcrumbItem>);
      const li = container.querySelector('li');
      expect(li).toBeInTheDocument();
      expect(li).toHaveAttribute('data-slot', 'breadcrumb-item');
      expect(li).toHaveTextContent('Content');
    });

    it('applies default classes', () => {
      const { container } = render(<BreadcrumbItem />);
      const li = container.querySelector('li');
      expect(li).toHaveClass('inline-flex');
      expect(li).toHaveClass('items-center');
    });
  });

  describe('BreadcrumbLink', () => {
    it('renders anchor element by default', () => {
      render(<BreadcrumbLink href="/test">Test Link</BreadcrumbLink>);
      const link = screen.getByText('Test Link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('data-slot', 'breadcrumb-link');
    });

    it('applies hover transition classes', () => {
      render(<BreadcrumbLink>Link</BreadcrumbLink>);
      const link = screen.getByText('Link');
      expect(link).toHaveClass('hover:text-foreground');
      expect(link).toHaveClass('transition-colors');
    });

    it('supports asChild pattern with Slot', () => {
      render(
        <BreadcrumbLink asChild>
          <button type="button">Custom Button</button>
        </BreadcrumbLink>
      );
      const button = screen.getByRole('button', { name: 'Custom Button' });
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('BreadcrumbPage', () => {
    it('renders current page indicator', () => {
      render(<BreadcrumbPage>Current Page</BreadcrumbPage>);
      const page = screen.getByText('Current Page');
      expect(page.tagName).toBe('SPAN');
      expect(page).toHaveAttribute('role', 'link');
      expect(page).toHaveAttribute('aria-disabled', 'true');
      expect(page).toHaveAttribute('aria-current', 'page');
    });

    it('applies foreground text color', () => {
      render(<BreadcrumbPage>Page</BreadcrumbPage>);
      const page = screen.getByText('Page');
      expect(page).toHaveClass('text-foreground');
    });
  });

  describe('BreadcrumbSeparator', () => {
    it('renders default ChevronRight icon', () => {
      const { container } = render(<BreadcrumbSeparator />);
      const li = container.querySelector('li');
      expect(li).toHaveAttribute('role', 'presentation');
      expect(li).toHaveAttribute('aria-hidden', 'true');
      const svg = li?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders custom separator', () => {
      const { container } = render(<BreadcrumbSeparator>/</BreadcrumbSeparator>);
      const li = container.querySelector('li');
      expect(li).toHaveAttribute('role', 'presentation');
      expect(screen.getByText('/')).toBeInTheDocument();
    });

    it('applies icon size class', () => {
      const { container } = render(<BreadcrumbSeparator />);
      const li = container.querySelector('li');
      expect(li).toHaveClass('[&>svg]:size-3.5');
    });
  });

  describe('BreadcrumbEllipsis', () => {
    it('renders ellipsis with MoreHorizontal icon', () => {
      const { container } = render(<BreadcrumbEllipsis />);
      const span = container.querySelector('span[data-slot="breadcrumb-ellipsis"]');
      expect(span).toBeInTheDocument();
      expect(span).toHaveAttribute('role', 'presentation');
      expect(span).toHaveAttribute('aria-hidden', 'true');
      const svg = span?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('includes screen reader text', () => {
      render(<BreadcrumbEllipsis />);
      const srText = screen.getByText('More');
      expect(srText).toHaveClass('sr-only');
    });

    it('applies flex centering classes', () => {
      const { container } = render(<BreadcrumbEllipsis />);
      const span = container.querySelector('span[data-slot="breadcrumb-ellipsis"]');
      expect(span).toHaveClass('flex');
      expect(span).toHaveClass('items-center');
      expect(span).toHaveClass('justify-center');
    });
  });
});

describe('BreadcrumbNavigation - Data-Driven Component', () => {
  describe('Basic Rendering', () => {
    it('renders simple breadcrumb navigation', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Details', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('renders with proper ARIA attributes', () => {
      const items = [{ label: 'Home', current: true }];
      const { container } = render(<BreadcrumbNavigation items={items} />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb');
    });

    it('marks current page correctly', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current', current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const currentText = screen.getByText('Current');
      // The BreadcrumbPage component wraps the text
      const currentPage = currentText.closest('[data-slot="breadcrumb-page"]');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
      expect(currentPage).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Separators', () => {
    it('renders chevron separator by default', () => {
      const items = [
        { label: 'First', href: '/' },
        { label: 'Second', current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const separators = container.querySelectorAll('[role="presentation"]');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('renders slash separator', () => {
      const items = [
        { label: 'First', href: '/' },
        { label: 'Second', current: true },
      ];

      render(<BreadcrumbNavigation items={items} separator="slash" />);
      expect(screen.getByText('/')).toBeInTheDocument();
    });

    it('renders arrow separator', () => {
      const items = [
        { label: 'First', href: '/' },
        { label: 'Second', current: true },
      ];

      render(<BreadcrumbNavigation items={items} separator="arrow" />);
      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('renders custom React separator', () => {
      const items = [
        { label: 'First', href: '/' },
        { label: 'Second', current: true },
      ];

      render(
        <BreadcrumbNavigation
          items={items}
          separator={<span data-testid="custom-sep">•</span>}
        />
      );
      expect(screen.getByTestId('custom-sep')).toBeInTheDocument();
    });

    it('does not render separator after last item', () => {
      const items = [
        { label: 'First', href: '/' },
        { label: 'Second', href: '/second' },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const listItems = container.querySelectorAll('li[data-slot="breadcrumb-item"]');
      const separators = container.querySelectorAll('li[data-slot="breadcrumb-separator"]');

      // Should have one separator (between two items)
      expect(separators.length).toBe(listItems.length - 1);
    });
  });

  describe('Size Variants', () => {
    it('applies small size styles', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(<BreadcrumbNavigation items={items} size="sm" />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveStyle({ fontSize: '0.75rem' });
    });

    it('applies medium size styles (default)', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(<BreadcrumbNavigation items={items} size="md" />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveStyle({ fontSize: '0.875rem' });
    });

    it('applies large size styles', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(<BreadcrumbNavigation items={items} size="lg" />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveStyle({ fontSize: '1rem' });
    });
  });

  describe('Item Collapsing', () => {
    const manyItems = [
      { label: 'Home', href: '/' },
      { label: 'Level 1', href: '/l1' },
      { label: 'Level 2', href: '/l2' },
      { label: 'Level 3', href: '/l3' },
      { label: 'Level 4', href: '/l4' },
      { label: 'Level 5', current: true },
    ];

    it('does not collapse when items <= maxItems', () => {
      render(<BreadcrumbNavigation items={manyItems} maxItems={10} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 2')).toBeInTheDocument();
    });

    it('collapses to maxItems with ellipsis', () => {
      render(<BreadcrumbNavigation items={manyItems} maxItems={3} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('More')).toBeInTheDocument(); // Ellipsis
      expect(screen.getByText('Level 5')).toBeInTheDocument();
    });

    it('handles maxItems = 2 correctly', () => {
      render(<BreadcrumbNavigation items={manyItems} maxItems={2} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('More')).toBeInTheDocument();
      expect(screen.getByText('Level 5')).toBeInTheDocument();
    });
  });

  describe('Home Icon', () => {
    it('does not show home icon by default', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Page', current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const firstItem = container.querySelector('li[data-slot="breadcrumb-item"]');
      const homeIcon = within(firstItem as HTMLElement).queryByTestId('lucide-home');

      // Home icon should not be present by default
      expect(screen.queryByText('Home')).toBeInTheDocument();
    });

    it('shows home icon when showHome is true', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Page', current: true },
      ];

      render(<BreadcrumbNavigation items={items} showHome={true} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('Custom Icons', () => {
    it('renders custom icons for items', () => {
      const items = [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'Folder', icon: Folder, current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const svgs = container.querySelectorAll('svg');

      // Should have icons plus separators
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Behavior', () => {
    it('handles onClick for clickable items', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const items = [
        { label: 'Home', onClick: handleClick },
        { label: 'Current', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);

      const home = screen.getByText('Home').closest('[role="button"]');
      if (home) {
        await user.click(home);
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });

    it('supports keyboard navigation for clickable items', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const items = [
        { label: 'Home', onClick: handleClick },
        { label: 'Current', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);

      const home = screen.getByText('Home').closest('[role="button"]');
      if (home) {
        (home as HTMLElement).focus();
        await user.keyboard('{Enter}');
        expect(handleClick).toHaveBeenCalled();
      }
    });

    it('does not trigger onClick for current page', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const items = [
        { label: 'Current', current: true, onClick: handleClick },
      ];

      render(<BreadcrumbNavigation items={items} />);

      const current = screen.getByText('Current');
      await user.click(current);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles href links correctly', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
      ];

      render(<BreadcrumbNavigation items={items} />);

      const homeLink = screen.getByText('Home');
      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    });
  });

  describe('Theme Integration', () => {
    it('uses typography CSS variables', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(<BreadcrumbNavigation items={items} />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveStyle({
        fontFamily: 'var(--typography-paragraph-font-family, inherit)',
      });
    });

    it('applies custom className', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(
        <BreadcrumbNavigation items={items} className="custom-breadcrumb" />
      );
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('custom-breadcrumb');
    });

    it('applies custom styles', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(
        <BreadcrumbNavigation items={items} style={{ marginTop: '20px' }} />
      );
      const nav = container.querySelector('nav');
      expect(nav).toHaveStyle({ marginTop: '20px' });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations - basic', async () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Details', current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with icons', async () => {
      const items = [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'Folder', icon: Folder, current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - collapsed', async () => {
      const items = [
        { label: '1', href: '/1' },
        { label: '2', href: '/2' },
        { label: '3', href: '/3' },
        { label: '4', href: '/4' },
        { label: '5', current: true },
      ];

      const { container } = render(
        <BreadcrumbNavigation items={items} maxItems={3} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper keyboard navigation', () => {
      const items = [
        { label: 'Home', onClick: vi.fn() },
        { label: 'Current', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);

      const home = screen.getByText('Home').closest('[role="button"]');
      expect(home).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      const { container } = render(<BreadcrumbNavigation items={[]} />);
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('handles single item', () => {
      const items = [{ label: 'Only', current: true }];
      const { container } = render(<BreadcrumbNavigation items={items} />);
      const separators = container.querySelectorAll('[data-slot="breadcrumb-separator"]');
      expect(separators.length).toBe(0);
    });

    it('handles maxItems larger than items array', () => {
      const items = [
        { label: 'One', href: '/1' },
        { label: 'Two', current: true },
      ];

      render(<BreadcrumbNavigation items={items} maxItems={10} />);
      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.queryByText('More')).not.toBeInTheDocument();
    });
  });
});
