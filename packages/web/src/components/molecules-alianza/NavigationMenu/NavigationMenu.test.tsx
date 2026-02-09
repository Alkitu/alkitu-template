import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NavigationMenu, NavigationMenuPresets } from './NavigationMenu';
import type { NavigationItem } from './NavigationMenu.types';

expect.extend(toHaveNoViolations);

describe('NavigationMenu Molecule', () => {
  // ========================================================================
  // Test Data
  // ========================================================================
  const simpleItems: NavigationItem[] = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'About', href: '/about' },
    { id: '3', label: 'Contact', href: '/contact' },
  ];

  const itemsWithChildren: NavigationItem[] = [
    { id: '1', label: 'Home', href: '/' },
    {
      id: '2',
      label: 'Products',
      children: [
        { id: '2-1', label: 'All Products', href: '/products' },
        { id: '2-2', label: 'New Arrivals', href: '/products/new' },
        { id: '2-3', label: 'Sale', href: '/products/sale' },
      ],
    },
    {
      id: '3',
      label: 'Services',
      children: [
        { id: '3-1', label: 'Consulting', href: '/services/consulting' },
        { id: '3-2', label: 'Development', href: '/services/development' },
      ],
    },
  ];

  const itemsWithBadges: NavigationItem[] = [
    {
      id: '1',
      label: 'Home',
      href: '/',
      badge: { text: 'New' },
    },
    {
      id: '2',
      label: 'Products',
      badge: { text: '5', variant: 'secondary' },
      children: [
        {
          id: '2-1',
          label: 'All Products',
          href: '/products',
          badge: { text: 'Hot', variant: 'destructive' },
        },
      ],
    },
  ];

  const itemsWithIcons: NavigationItem[] = [
    {
      id: '1',
      label: 'Home',
      href: '/',
      icon: <span data-testid="home-icon">🏠</span>,
    },
    {
      id: '2',
      label: 'Products',
      icon: <span data-testid="products-icon">📦</span>,
      children: [
        {
          id: '2-1',
          label: 'All Products',
          href: '/products',
          icon: <span data-testid="all-products-icon">📋</span>,
        },
      ],
    },
  ];

  const itemsWithExternalLinks: NavigationItem[] = [
    { id: '1', label: 'Home', href: '/' },
    {
      id: '2',
      label: 'External Link',
      href: 'https://example.com',
      external: true,
    },
    {
      id: '3',
      label: 'Resources',
      children: [
        {
          id: '3-1',
          label: 'Documentation',
          href: 'https://docs.example.com',
          external: true,
        },
      ],
    },
  ];

  const itemsWithFeatured: NavigationItem[] = [
    { id: '1', label: 'Home', href: '/' },
    {
      id: '2',
      label: 'Products',
      children: [
        {
          id: '2-1',
          label: 'New Arrivals',
          href: '/products/new',
          featured: true,
          description: 'Check out our latest products',
        },
        {
          id: '2-2',
          label: 'Best Sellers',
          href: '/products/best',
          featured: true,
          description: 'Most popular items',
        },
        {
          id: '2-3',
          label: 'All Products',
          href: '/products',
          featured: false,
        },
        { id: '2-4', label: 'Sale', href: '/products/sale', featured: false },
      ],
    },
  ];

  // ========================================================================
  // Basic Rendering Tests
  // ========================================================================
  describe('Rendering', () => {
    it('renders correctly with simple items', () => {
      render(<NavigationMenu items={simpleItems} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders with correct navigation structure', () => {
      render(<NavigationMenu items={simpleItems} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('renders navigation items as links', () => {
      render(<NavigationMenu items={simpleItems} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders with custom className', () => {
      const { container } = render(
        <NavigationMenu items={simpleItems} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders all simple items correctly', () => {
      render(<NavigationMenu items={simpleItems} />);

      simpleItems.forEach((item) => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });

    it('renders correct number of navigation items', () => {
      const { container } = render(<NavigationMenu items={simpleItems} />);

      const items = container.querySelectorAll('[data-slot="navigation-menu-item"]');
      expect(items).toHaveLength(simpleItems.length);
    });

    it('applies correct structure with navigation roles', () => {
      const { container } = render(<NavigationMenu items={simpleItems} />);

      expect(container.querySelector('[data-slot="navigation-menu"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="navigation-menu-list"]')).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Variants Tests
  // ========================================================================
  describe('Variants', () => {
    it('renders with default variant', () => {
      render(<NavigationMenu items={simpleItems} variant="default" />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders with compact variant', () => {
      render(<NavigationMenu items={simpleItems} variant="compact" />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders with featured variant', () => {
      render(<NavigationMenu items={simpleItems} variant="featured" />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('applies correct layout for default variant', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} variant="default" />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      const content = screen.getByText('All Products').closest('a');
      expect(content?.parentElement).toHaveClass('flex-col');
    });

    it('applies correct layout for compact variant', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} variant="compact" />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      const content = screen.getByText('All Products').closest('a');
      expect(content?.parentElement).toHaveClass('flex');
      expect(content?.parentElement).toHaveClass('flex-wrap');
    });

    it('featured variant shows featured section', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithFeatured} variant="featured" />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Orientation Tests
  // ========================================================================
  describe('Orientation', () => {
    it('renders with horizontal orientation by default', () => {
      const { container } = render(<NavigationMenu items={simpleItems} />);

      const nav = container.querySelector('[data-orientation]');
      expect(nav).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('renders with vertical orientation', () => {
      const { container } = render(
        <NavigationMenu items={simpleItems} orientation="vertical" />
      );

      const nav = container.querySelector('[data-orientation]');
      expect(nav).toHaveAttribute('data-orientation', 'vertical');
    });

    it('applies vertical layout classes with vertical orientation', () => {
      const { container } = render(
        <NavigationMenu items={simpleItems} orientation="vertical" />
      );

      const list = container.querySelector('[data-slot="navigation-menu-list"]');
      expect(list).toHaveClass('flex-col');
    });

    it('does not apply vertical classes with horizontal orientation', () => {
      const { container } = render(
        <NavigationMenu items={simpleItems} orientation="horizontal" />
      );

      const list = container.querySelector('[data-slot="navigation-menu-list"]');
      expect(list).not.toHaveClass('flex-col');
    });
  });

  // ========================================================================
  // Nested Navigation Tests
  // ========================================================================
  describe('Nested Navigation', () => {
    it('renders items with children as dropdowns', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      // Trigger should be present
      const productsTrigger = screen.getByRole('button', { name: /products/i });
      expect(productsTrigger).toBeInTheDocument();

      // Click to open dropdown
      await user.click(productsTrigger);

      // Child items should be visible
      expect(screen.getByText('All Products')).toBeInTheDocument();
      expect(screen.getByText('New Arrivals')).toBeInTheDocument();
      expect(screen.getByText('Sale')).toBeInTheDocument();
    });

    it('renders chevron icon for items with children', () => {
      const { container } = render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      const chevron = productsTrigger.querySelector('svg.lucide-chevron-down');
      expect(chevron).toBeInTheDocument();
      expect(chevron).toHaveAttribute('aria-hidden', 'true');
    });

    it('toggles dropdown on trigger click', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });

      // Initially closed
      expect(productsTrigger).toHaveAttribute('data-state', 'closed');

      // Click to open
      await user.click(productsTrigger);
      expect(productsTrigger).toHaveAttribute('data-state', 'open');
    });

    it('renders multiple dropdown menus', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);
      expect(screen.getByText('All Products')).toBeInTheDocument();

      const servicesTrigger = screen.getByRole('button', { name: /services/i });
      await user.click(servicesTrigger);

      // Both triggers should be present
      expect(productsTrigger).toBeInTheDocument();
      expect(servicesTrigger).toBeInTheDocument();
    });

    it('renders correct number of child items', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      expect(screen.getByText('All Products')).toBeInTheDocument();
      expect(screen.getByText('New Arrivals')).toBeInTheDocument();
      expect(screen.getByText('Sale')).toBeInTheDocument();
    });

    it('does not render chevron for items without children', () => {
      const { container } = render(<NavigationMenu items={simpleItems} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      const chevron = homeLink.querySelector('svg.lucide-chevron-down');
      expect(chevron).not.toBeInTheDocument();
    });
  });

  // ========================================================================
  // Badge Tests
  // ========================================================================
  describe('Badges', () => {
    it('renders badges on navigation items', () => {
      render(<NavigationMenu items={itemsWithBadges} />);

      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders badges with correct variants', () => {
      render(<NavigationMenu items={itemsWithBadges} />);

      const newBadge = screen.getByText('New');
      // Badge with no variant uses 'outline' as default in NavigationMenu
      expect(newBadge.className).toContain('border-input');

      const countBadge = screen.getByText('5');
      expect(countBadge.className).toContain('bg-secondary');
    });

    it('renders badges on child items', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithBadges} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      expect(screen.getByText('Hot')).toBeInTheDocument();
    });

    it('renders badge with destructive variant', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithBadges} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      const hotBadge = screen.getByText('Hot');
      expect(hotBadge.className).toContain('bg-destructive');
    });

    it('renders badge on parent item correctly', () => {
      render(<NavigationMenu items={itemsWithBadges} />);

      const trigger = screen.getByRole('button', { name: /products/i });
      const badge = within(trigger).getByText('5');
      expect(badge).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Icon Tests
  // ========================================================================
  describe('Icons', () => {
    it('renders icons on navigation items', () => {
      render(<NavigationMenu items={itemsWithIcons} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('products-icon')).toBeInTheDocument();
    });

    it('renders icons on child items', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithIcons} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      expect(screen.getByTestId('all-products-icon')).toBeInTheDocument();
    });

    it('renders icon in correct position (before label)', () => {
      const { container } = render(<NavigationMenu items={itemsWithIcons} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      const icon = within(homeLink).getByTestId('home-icon');
      const iconSpan = icon.parentElement;

      expect(iconSpan?.className).toContain('flex');
    });

    it('handles navigation items without icons', () => {
      render(<NavigationMenu items={simpleItems} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink.querySelector('[data-testid*="icon"]')).not.toBeInTheDocument();
    });
  });

  // ========================================================================
  // External Links Tests
  // ========================================================================
  describe('External Links', () => {
    it('renders external links with target="_blank"', () => {
      render(<NavigationMenu items={itemsWithExternalLinks} />);

      const externalLink = screen.getByRole('link', { name: /external link/i });
      expect(externalLink).toHaveAttribute('target', '_blank');
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders external link icon', () => {
      const { container } = render(
        <NavigationMenu items={itemsWithExternalLinks} />
      );

      const externalLinkIcon = container.querySelector(
        'svg.lucide-external-link'
      );
      expect(externalLinkIcon).toBeInTheDocument();
    });

    it('renders external links in child items', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithExternalLinks} />);

      const resourcesTrigger = screen.getByRole('button', {
        name: /resources/i,
      });
      await user.click(resourcesTrigger);

      const docLink = screen.getByRole('link', { name: /documentation/i });
      expect(docLink).toHaveAttribute('target', '_blank');
    });

    it('does not add target="_blank" for internal links', () => {
      render(<NavigationMenu items={simpleItems} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).not.toHaveAttribute('target');
    });

    it('renders external link icon in child items', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithExternalLinks} />);

      const resourcesTrigger = screen.getByRole('button', {
        name: /resources/i,
      });
      await user.click(resourcesTrigger);

      const docLink = screen.getByText('Documentation').closest('a');
      const externalIcon = docLink?.querySelector('svg.lucide-external-link');
      expect(externalIcon).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Featured Items Tests (Featured Variant)
  // ========================================================================
  describe('Featured Items', () => {
    it('separates featured and non-featured items in featured variant', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithFeatured} variant="featured" />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      // Should show "Featured" heading
      expect(screen.getByText('Featured')).toBeInTheDocument();

      // Should show "More Options" heading
      expect(screen.getByText('More Options')).toBeInTheDocument();
    });

    it('renders featured items with descriptions', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithFeatured} variant="featured" />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      expect(
        screen.getByText('Check out our latest products')
      ).toBeInTheDocument();
      expect(screen.getByText('Most popular items')).toBeInTheDocument();
    });

    it('displays featured items in first column', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithFeatured} variant="featured" />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      const featuredSection = screen
        .getByText('Featured')
        .closest('div') as HTMLElement;
      expect(within(featuredSection).getByText('New Arrivals')).toBeInTheDocument();
      expect(within(featuredSection).getByText('Best Sellers')).toBeInTheDocument();
    });

    it('displays non-featured items in second column', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithFeatured} variant="featured" />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      const moreOptionsSection = screen
        .getByText('More Options')
        .closest('div') as HTMLElement;
      expect(within(moreOptionsSection).getByText('All Products')).toBeInTheDocument();
      expect(within(moreOptionsSection).getByText('Sale')).toBeInTheDocument();
    });

    it('applies grid layout for featured variant', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithFeatured} variant="featured" />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      const gridContainer = screen.getByText('Featured').closest('.grid');
      expect(gridContainer).toHaveClass('grid-cols-2');
    });

    it('renders featured item with icon and description', async () => {
      const itemsWithFeaturedIcon: NavigationItem[] = [
        {
          id: '1',
          label: 'Products',
          children: [
            {
              id: '1-1',
              label: 'Featured Item',
              href: '/featured',
              featured: true,
              description: 'This is featured',
              icon: <span data-testid="featured-icon">⭐</span>,
            },
          ],
        },
      ];

      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithFeaturedIcon} variant="featured" />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      expect(screen.getByTestId('featured-icon')).toBeInTheDocument();
      expect(screen.getByText('This is featured')).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Viewport Tests
  // ========================================================================
  describe('Viewport', () => {
    it('renders viewport by default', () => {
      const { container } = render(<NavigationMenu items={simpleItems} />);

      const nav = container.querySelector('[data-viewport="true"]');
      expect(nav).toBeInTheDocument();
    });

    it('does not render viewport when viewport=false', () => {
      const { container } = render(
        <NavigationMenu items={simpleItems} viewport={false} />
      );

      const viewport = container.querySelector('[data-slot="navigation-menu-viewport"]');
      expect(viewport).not.toBeInTheDocument();
    });

    it('renders viewport element with correct attributes', async () => {
      const user = userEvent.setup();
      const { container } = render(<NavigationMenu items={itemsWithChildren} />);

      // Open a dropdown to ensure viewport is mounted
      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      // Wait for viewport to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const viewport = container.querySelector('[data-slot="navigation-menu-viewport"]');
      expect(viewport).toBeInTheDocument();
      expect(viewport).toHaveClass('bg-popover');
    });

    it('viewport has correct animation classes', async () => {
      const user = userEvent.setup();
      const { container } = render(<NavigationMenu items={itemsWithChildren} />);

      // Open a dropdown to ensure viewport is mounted
      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      // Wait for viewport to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const viewport = container.querySelector('[data-slot="navigation-menu-viewport"]');
      expect(viewport).toHaveClass('data-[state=open]:animate-in');
      expect(viewport).toHaveClass('data-[state=closed]:animate-out');
    });
  });

  // ========================================================================
  // Presets Tests
  // ========================================================================
  describe('Presets', () => {
    it('provides basic preset configuration', () => {
      expect(NavigationMenuPresets.basic).toEqual({
        variant: 'default',
        orientation: 'horizontal',
      });
    });

    it('provides compact preset configuration', () => {
      expect(NavigationMenuPresets.compact).toEqual({
        variant: 'compact',
        orientation: 'horizontal',
      });
    });

    it('provides featured preset configuration', () => {
      expect(NavigationMenuPresets.featured).toEqual({
        variant: 'featured',
        orientation: 'horizontal',
      });
    });

    it('provides vertical preset configuration', () => {
      expect(NavigationMenuPresets.vertical).toEqual({
        variant: 'default',
        orientation: 'vertical',
      });
    });

    it('applies preset configurations correctly', () => {
      const { container } = render(
        <NavigationMenu items={simpleItems} {...NavigationMenuPresets.vertical} />
      );

      const nav = container.querySelector('[data-orientation]');
      expect(nav).toHaveAttribute('data-orientation', 'vertical');
    });

    it('applies all preset properties', () => {
      const { container } = render(
        <NavigationMenu items={itemsWithChildren} {...NavigationMenuPresets.compact} />
      );

      const nav = container.querySelector('[data-orientation]');
      expect(nav).toHaveAttribute('data-orientation', 'horizontal');
    });
  });

  // ========================================================================
  // Theme Integration Tests
  // ========================================================================
  describe('Theme Integration', () => {
    it('uses theme CSS variables for colors', () => {
      const { container } = render(<NavigationMenu items={simpleItems} />);

      // Check that component uses CSS variables
      const link = screen.getByRole('link', { name: /home/i });
      const computedStyle = window.getComputedStyle(link);

      // Should not have hardcoded colors
      expect(link.className).not.toContain('bg-blue-500');
      expect(link.className).not.toContain('text-white');
    });

    it('applies hover styles using theme variables', () => {
      render(<NavigationMenu items={simpleItems} />);

      const link = screen.getByRole('link', { name: /home/i });
      expect(link).toHaveClass('hover:bg-accent');
      expect(link).toHaveClass('hover:text-accent-foreground');
    });

    it('applies focus styles using theme variables', () => {
      render(<NavigationMenu items={simpleItems} />);

      const link = screen.getByRole('link', { name: /home/i });
      expect(link).toHaveClass('focus:bg-accent');
      expect(link).toHaveClass('focus:text-accent-foreground');
    });

    it('uses theme variables in dropdown content', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      const childLink = screen.getByText('All Products').closest('a');
      expect(childLink).toHaveClass('hover:bg-accent/60');
    });

    it('applies theme-based background to viewport', async () => {
      const user = userEvent.setup();
      const { container } = render(<NavigationMenu items={itemsWithChildren} />);

      // Open a dropdown to ensure viewport is mounted
      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      // Wait for viewport to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const viewport = container.querySelector('[data-slot="navigation-menu-viewport"]');
      expect(viewport).toHaveClass('bg-popover');
      expect(viewport).toHaveClass('text-popover-foreground');
    });
  });

  // ========================================================================
  // Keyboard Navigation Tests
  // ========================================================================
  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation with Tab', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={simpleItems} />);

      // Tab through items
      await user.tab();
      expect(screen.getByRole('link', { name: /home/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('link', { name: /about/i })).toHaveFocus();
    });

    it('supports Enter key to activate links', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={simpleItems} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      homeLink.focus();

      await user.keyboard('{Enter}');
      // Link activation would normally navigate, but in test it just ensures it's triggerable
    });

    it('supports Space key to open dropdown menus', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      productsTrigger.focus();

      await user.keyboard(' ');
      expect(productsTrigger).toHaveAttribute('data-state', 'open');
    });

    it('can tab through dropdown items', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      // Tab to first child item
      await user.tab();
      const allProductsLink = screen.getByText('All Products').closest('a');
      expect(allProductsLink).toHaveFocus();
    });

    it('maintains focus state visually', () => {
      render(<NavigationMenu items={simpleItems} />);

      const link = screen.getByRole('link', { name: /home/i });
      expect(link).toHaveClass('focus-visible:ring-ring/50');
    });
  });

  // ========================================================================
  // Accessibility Tests
  // ========================================================================
  describe('Accessibility', () => {
    it('has no accessibility violations with simple items', async () => {
      const { container } = render(<NavigationMenu items={simpleItems} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with nested items', async () => {
      const { container } = render(<NavigationMenu items={itemsWithChildren} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with featured variant', async () => {
      const { container } = render(
        <NavigationMenu items={itemsWithFeatured} variant="featured" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA attributes on navigation', () => {
      render(<NavigationMenu items={simpleItems} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('marks chevron icons as aria-hidden', () => {
      const { container } = render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      const chevron = productsTrigger.querySelector('svg.lucide-chevron-down');
      expect(chevron).toBeInTheDocument();
      expect(chevron).toHaveAttribute('aria-hidden', 'true');
    });

    it('has proper focus visible styles', () => {
      render(<NavigationMenu items={simpleItems} />);

      const link = screen.getByRole('link', { name: /home/i });
      expect(link).toHaveClass('focus-visible:ring-ring/50');
      expect(link).toHaveClass('focus-visible:ring-[3px]');
    });

    it('provides keyboard accessible dropdowns', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      expect(productsTrigger).toHaveAttribute('data-state', 'closed');

      // Keyboard activation
      productsTrigger.focus();
      await user.keyboard(' ');
      expect(productsTrigger).toHaveAttribute('data-state', 'open');
    });

    it('has proper button roles for triggers', () => {
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      expect(productsTrigger.tagName).toBe('BUTTON');
    });
  });

  // ========================================================================
  // Edge Cases Tests
  // ========================================================================
  describe('Edge Cases', () => {
    it('renders with empty items array', () => {
      const { container } = render(<NavigationMenu items={[]} />);
      expect(container.querySelector('[data-slot="navigation-menu"]')).toBeInTheDocument();
    });

    it('handles items with missing href gracefully', () => {
      const itemsWithoutHref: NavigationItem[] = [
        { id: '1', label: 'No Link' },
      ];

      render(<NavigationMenu items={itemsWithoutHref} />);
      expect(screen.getByText('No Link')).toBeInTheDocument();
    });

    it('handles items with empty children array', () => {
      const itemsWithEmptyChildren: NavigationItem[] = [
        { id: '1', label: 'Empty Parent', children: [] },
      ];

      render(<NavigationMenu items={itemsWithEmptyChildren} />);
      expect(screen.getByText('Empty Parent')).toBeInTheDocument();
    });

    it('handles very long item labels', () => {
      const itemsWithLongLabels: NavigationItem[] = [
        {
          id: '1',
          label: 'This is a very long navigation item label that should be handled gracefully',
          href: '/',
        },
      ];

      render(<NavigationMenu items={itemsWithLongLabels} />);
      expect(
        screen.getByText(
          'This is a very long navigation item label that should be handled gracefully'
        )
      ).toBeInTheDocument();
    });

    it('handles deeply nested navigation items', async () => {
      const deeplyNestedItems: NavigationItem[] = [
        {
          id: '1',
          label: 'Level 1',
          children: [
            {
              id: '1-1',
              label: 'Level 2',
              href: '/level-2',
              children: [
                { id: '1-1-1', label: 'Level 3', href: '/level-3' },
              ],
            },
          ],
        },
      ];

      const user = userEvent.setup();
      render(<NavigationMenu items={deeplyNestedItems} />);

      const level1Trigger = screen.getByRole('button', { name: /level 1/i });
      await user.click(level1Trigger);

      expect(screen.getByText('Level 2')).toBeInTheDocument();
    });

    it('handles items with only badge, no href or children', () => {
      const itemsWithOnlyBadge: NavigationItem[] = [
        { id: '1', label: 'Badge Only', badge: { text: 'New' } },
      ];

      render(<NavigationMenu items={itemsWithOnlyBadge} />);
      expect(screen.getByText('Badge Only')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('handles items with all optional properties', () => {
      const complexItem: NavigationItem[] = [
        {
          id: '1',
          label: 'Complex',
          href: '/complex',
          external: true,
          badge: { text: 'All Props', variant: 'destructive' },
          description: 'Has everything',
          icon: <span data-testid="complex-icon">🔥</span>,
          featured: true,
        },
      ];

      render(<NavigationMenu items={complexItem} />);
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('All Props')).toBeInTheDocument();
      expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
    });

    it('handles empty featured items list', async () => {
      const itemsWithNoFeatured: NavigationItem[] = [
        {
          id: '1',
          label: 'Products',
          children: [
            { id: '1-1', label: 'Item 1', href: '/1', featured: false },
            { id: '1-2', label: 'Item 2', href: '/2', featured: false },
          ],
        },
      ];

      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithNoFeatured} variant="featured" />);

      const trigger = screen.getByRole('button', { name: /products/i });
      await user.click(trigger);

      expect(screen.getByText('More Options')).toBeInTheDocument();
    });

    it('renders correctly with single item', () => {
      const singleItem: NavigationItem[] = [
        { id: '1', label: 'Only One', href: '/' },
      ];

      render(<NavigationMenu items={singleItem} />);
      expect(screen.getByText('Only One')).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Interaction Tests
  // ========================================================================
  describe('Interactions', () => {
    it('opens dropdown on click', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });
      await user.click(productsTrigger);

      expect(screen.getByText('All Products')).toBeInTheDocument();
    });

    it('closes dropdown on second click', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });

      // Open
      await user.click(productsTrigger);
      expect(productsTrigger).toHaveAttribute('data-state', 'open');

      // Close
      await user.click(productsTrigger);
      expect(productsTrigger).toHaveAttribute('data-state', 'closed');
    });

    it('applies hover styles on mouse enter', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={simpleItems} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      await user.hover(homeLink);

      expect(homeLink).toHaveClass('hover:bg-accent');
    });

    it('handles rapid clicks gracefully', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithChildren} />);

      const productsTrigger = screen.getByRole('button', { name: /products/i });

      // Rapid clicks
      await user.click(productsTrigger);
      await user.click(productsTrigger);
      await user.click(productsTrigger);

      // Should still be functional
      expect(productsTrigger).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Content Layout Tests
  // ========================================================================
  describe('Content Layout', () => {
    it('renders descriptions in default variant', async () => {
      const itemsWithDesc: NavigationItem[] = [
        {
          id: '1',
          label: 'Products',
          children: [
            {
              id: '1-1',
              label: 'Item',
              href: '/item',
              description: 'Item description',
            },
          ],
        },
      ];

      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithDesc} variant="default" />);

      const trigger = screen.getByRole('button', { name: /products/i });
      await user.click(trigger);

      expect(screen.getByText('Item description')).toBeInTheDocument();
    });

    it('hides descriptions in compact variant', async () => {
      const itemsWithDesc: NavigationItem[] = [
        {
          id: '1',
          label: 'Products',
          children: [
            {
              id: '1-1',
              label: 'Item',
              href: '/item',
              description: 'Should not show',
            },
          ],
        },
      ];

      const user = userEvent.setup();
      render(<NavigationMenu items={itemsWithDesc} variant="compact" />);

      const trigger = screen.getByRole('button', { name: /products/i });
      await user.click(trigger);

      expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
    });

    it('applies responsive classes', () => {
      const { container } = render(<NavigationMenu items={simpleItems} />);

      const list = container.querySelector('[data-slot="navigation-menu-list"]');
      expect(list).toHaveClass('max-sm:flex-wrap');
      expect(list).toHaveClass('max-sm:justify-center');
    });
  });
});
