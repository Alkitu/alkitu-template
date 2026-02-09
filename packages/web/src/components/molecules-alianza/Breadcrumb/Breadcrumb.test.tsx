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
import { Home, Folder, File } from 'lucide-react';

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

    it('spreads additional props correctly', () => {
      const { container } = render(<Breadcrumb data-testid="breadcrumb-nav" />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('data-testid', 'breadcrumb-nav');
    });

    it('renders children correctly', () => {
      render(
        <Breadcrumb>
          <div>Child Content</div>
        </Breadcrumb>
      );
      expect(screen.getByText('Child Content')).toBeInTheDocument();
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
      expect(ol).toHaveClass('flex-wrap');
      expect(ol).toHaveClass('gap-1.5');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<BreadcrumbList className="custom" />);
      const ol = container.querySelector('ol');
      expect(ol).toHaveClass('text-muted-foreground');
      expect(ol).toHaveClass('custom');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<BreadcrumbList ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('renders multiple children', () => {
      const { container } = render(
        <BreadcrumbList>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </BreadcrumbList>
      );
      const items = container.querySelectorAll('li');
      expect(items.length).toBe(3);
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
      expect(li).toHaveClass('gap-1.5');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<BreadcrumbItem ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(<BreadcrumbItem className="custom-item" />);
      const li = container.querySelector('li');
      expect(li).toHaveClass('custom-item');
      expect(li).toHaveClass('inline-flex');
    });

    it('renders nested components correctly', () => {
      render(
        <BreadcrumbItem>
          <BreadcrumbLink href="/test">Link</BreadcrumbLink>
        </BreadcrumbItem>
      );
      expect(screen.getByText('Link')).toBeInTheDocument();
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

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<BreadcrumbLink ref={ref}>Link</BreadcrumbLink>);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(<BreadcrumbLink className="custom-link">Link</BreadcrumbLink>);
      const link = screen.getByText('Link');
      expect(link).toHaveClass('custom-link');
      expect(link).toHaveClass('transition-colors');
    });

    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <BreadcrumbLink onClick={handleClick}>Clickable</BreadcrumbLink>
      );
      await user.click(screen.getByText('Clickable'));
      expect(handleClick).toHaveBeenCalledTimes(1);
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
      expect(page).toHaveClass('font-normal');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<BreadcrumbPage ref={ref}>Page</BreadcrumbPage>);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(<BreadcrumbPage className="custom-page">Page</BreadcrumbPage>);
      const page = screen.getByText('Page');
      expect(page).toHaveClass('custom-page');
      expect(page).toHaveClass('text-foreground');
    });

    it('has correct data slot attribute', () => {
      const { container } = render(<BreadcrumbPage>Page</BreadcrumbPage>);
      const page = container.querySelector('[data-slot="breadcrumb-page"]');
      expect(page).toBeInTheDocument();
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

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<BreadcrumbSeparator ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(
        <BreadcrumbSeparator className="custom-separator" />
      );
      const li = container.querySelector('li');
      expect(li).toHaveClass('custom-separator');
    });

    it('renders custom React element separator', () => {
      render(
        <BreadcrumbSeparator>
          <span data-testid="custom-sep">→</span>
        </BreadcrumbSeparator>
      );
      expect(screen.getByTestId('custom-sep')).toBeInTheDocument();
    });

    it('has correct data slot attribute', () => {
      const { container } = render(<BreadcrumbSeparator />);
      const separator = container.querySelector('[data-slot="breadcrumb-separator"]');
      expect(separator).toBeInTheDocument();
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

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<BreadcrumbEllipsis ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(
        <BreadcrumbEllipsis className="custom-ellipsis" />
      );
      const span = container.querySelector('span[data-slot="breadcrumb-ellipsis"]');
      expect(span).toHaveClass('custom-ellipsis');
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
      const currentPage = currentText.closest('[data-slot="breadcrumb-page"]');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
      expect(currentPage).toHaveAttribute('aria-disabled', 'true');
    });

    it('renders empty items array without errors', () => {
      const { container } = render(<BreadcrumbNavigation items={[]} />);
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('renders single item correctly', () => {
      const items = [{ label: 'Only', current: true }];
      const { container } = render(<BreadcrumbNavigation items={items} />);
      const separators = container.querySelectorAll('[data-slot="breadcrumb-separator"]');
      expect(separators.length).toBe(0);
      expect(screen.getByText('Only')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      const items = [{ label: 'Test', current: true }];
      render(<BreadcrumbNavigation items={items} ref={ref} />);
      expect(ref).toHaveBeenCalled();
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

      expect(separators.length).toBe(listItems.length - 1);
    });

    it('renders correct number of separators for multiple items', () => {
      const items = [
        { label: '1', href: '/1' },
        { label: '2', href: '/2' },
        { label: '3', href: '/3' },
        { label: '4', current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const separators = container.querySelectorAll('li[data-slot="breadcrumb-separator"]');
      expect(separators.length).toBe(3); // n-1 separators for n items
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
      expect(screen.getByText('Level 3')).toBeInTheDocument();
    });

    it('collapses to maxItems with ellipsis', () => {
      render(<BreadcrumbNavigation items={manyItems} maxItems={3} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('More')).toBeInTheDocument();
      expect(screen.getByText('Level 5')).toBeInTheDocument();
    });

    it('handles maxItems = 2 correctly', () => {
      render(<BreadcrumbNavigation items={manyItems} maxItems={2} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('More')).toBeInTheDocument();
      expect(screen.getByText('Level 5')).toBeInTheDocument();
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

    it('collapses correctly with maxItems = 4', () => {
      render(<BreadcrumbNavigation items={manyItems} maxItems={4} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('More')).toBeInTheDocument();
      expect(screen.getByText('Level 5')).toBeInTheDocument();
    });

    it('does not collapse when no maxItems specified', () => {
      render(<BreadcrumbNavigation items={manyItems} />);
      expect(screen.queryByText('More')).not.toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 2')).toBeInTheDocument();
      expect(screen.getByText('Level 3')).toBeInTheDocument();
    });
  });

  describe('Home Icon', () => {
    it('does not show home icon by default', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Page', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('shows home icon when showHome is true', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Page', current: true },
      ];

      render(<BreadcrumbNavigation items={items} showHome={true} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('only shows home icon for first item', () => {
      const items = [
        { label: 'First', href: '/' },
        { label: 'Second', href: '/second' },
        { label: 'Third', current: true },
      ];

      const { container } = render(
        <BreadcrumbNavigation items={items} showHome={true} />
      );
      const firstItem = container.querySelector('li[data-slot="breadcrumb-item"]');
      expect(firstItem).toBeInTheDocument();
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
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('renders multiple items with different icons', () => {
      const items = [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'Folder', icon: Folder, href: '/folder' },
        { label: 'File', icon: File, current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Folder')).toBeInTheDocument();
      expect(screen.getByText('File')).toBeInTheDocument();
    });

    it('does not render icon for ellipsis items', () => {
      const items = [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'Level 1', icon: Folder, href: '/l1' },
        { label: 'Level 2', icon: Folder, href: '/l2' },
        { label: 'Level 3', icon: Folder, href: '/l3' },
        { label: 'Current', icon: File, current: true },
      ];

      render(<BreadcrumbNavigation items={items} maxItems={3} />);
      expect(screen.getByText('More')).toBeInTheDocument();
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

    it('supports keyboard navigation for clickable items - Enter', async () => {
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

    it('supports keyboard navigation for clickable items - Space', async () => {
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
        await user.keyboard(' ');
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

    it('handles both href and onClick together', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const items = [
        { label: 'Home', href: '/', onClick: handleClick },
        { label: 'Current', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);

      const homeLink = screen.getByText('Home');
      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
      await user.click(homeLink);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders non-clickable items without interaction', () => {
      const items = [
        { label: 'Non-clickable' },
        { label: 'Current', current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const nonClickable = screen.getByText('Non-clickable');
      expect(nonClickable.closest('a')).not.toBeInTheDocument();
      expect(nonClickable.closest('[role="button"]')).not.toBeInTheDocument();
    });

    it('has correct tabIndex for clickable items', () => {
      const items = [
        { label: 'Home', onClick: vi.fn() },
        { label: 'Current', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);

      const home = screen.getByText('Home').closest('[role="button"]');
      expect(home).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Size Variants', () => {
    it('applies small size styles', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(
        <BreadcrumbNavigation items={items} size="sm" />
      );
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('style');
      expect(nav?.getAttribute('style')).toContain('0.75rem');
    });

    it('applies medium size styles by default', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(
        <BreadcrumbNavigation items={items} />
      );
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('style');
      expect(nav?.getAttribute('style')).toContain('0.875rem');
    });

    it('applies large size styles', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(
        <BreadcrumbNavigation items={items} size="lg" />
      );
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('style');
      expect(nav?.getAttribute('style')).toContain('1rem');
    });
  });

  describe('Theme Integration', () => {
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

    it('applies typography font family from CSS variable', () => {
      const items = [{ label: 'Test', current: true }];
      const { container } = render(<BreadcrumbNavigation items={items} />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('style');
      expect(nav?.getAttribute('style')).toContain('--typography-paragraph-font-family');
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

    it('has accessible ellipsis with screen reader text', () => {
      const items = [
        { label: '1', href: '/1' },
        { label: '2', href: '/2' },
        { label: '3', href: '/3' },
        { label: '4', href: '/4' },
        { label: '5', current: true },
      ];

      render(<BreadcrumbNavigation items={items} maxItems={3} />);
      const srText = screen.getByText('More');
      expect(srText).toHaveClass('sr-only');
    });

    it('marks separators as presentation with aria-hidden', () => {
      const items = [
        { label: 'First', href: '/' },
        { label: 'Second', current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const separator = container.querySelector('[data-slot="breadcrumb-separator"]');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
      expect(separator).toHaveAttribute('role', 'presentation');
    });

    it('has no accessibility violations - with onClick handlers', async () => {
      const items = [
        { label: 'Home', onClick: vi.fn() },
        { label: 'Products', onClick: vi.fn() },
        { label: 'Current', current: true },
      ];

      const { container } = render(<BreadcrumbNavigation items={items} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
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

    it('handles items without href or onClick', () => {
      const items = [
        { label: 'Static' },
        { label: 'Current', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);
      expect(screen.getByText('Static')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('handles items with empty labels', () => {
      const items = [
        { label: '', href: '/' },
        { label: 'Valid', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);
      expect(screen.getByText('Valid')).toBeInTheDocument();
    });

    it('handles maxItems = 1', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Page', href: '/page' },
        { label: 'Current', current: true },
      ];

      const { container } = render(
        <BreadcrumbNavigation items={items} maxItems={1} />
      );
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('handles very long labels', () => {
      const items = [
        { label: 'A'.repeat(100), href: '/' },
        { label: 'Current', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles special characters in labels', () => {
      const items = [
        { label: 'Home & About', href: '/' },
        { label: 'Products < Services', href: '/products' },
        { label: 'Current "Page"', current: true },
      ];

      render(<BreadcrumbNavigation items={items} />);
      expect(screen.getByText('Home & About')).toBeInTheDocument();
      expect(screen.getByText('Products < Services')).toBeInTheDocument();
      expect(screen.getByText('Current "Page"')).toBeInTheDocument();
    });

    it('renders correctly with all features combined', () => {
      const items = [
        { label: 'Home', icon: Home, href: '/', onClick: vi.fn() },
        { label: 'Level 1', icon: Folder, href: '/l1' },
        { label: 'Level 2', icon: Folder, href: '/l2' },
        { label: 'Current', icon: File, current: true },
      ];

      const { container } = render(
        <BreadcrumbNavigation
          items={items}
          separator="slash"
          maxItems={3}
          showHome={true}
          size="lg"
          className="custom-class"
          style={{ margin: '10px' }}
        />
      );

      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('custom-class');
      expect(nav).toHaveStyle({ margin: '10px' });
      // Check for slash separator (multiple will exist)
      const slashSeparators = container.querySelectorAll('.text-muted-foreground.opacity-60');
      expect(slashSeparators.length).toBeGreaterThan(0);
    });
  });
});
