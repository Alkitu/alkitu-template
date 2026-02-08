import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeatureGrid } from './FeatureGrid';

// Mock dependencies
vi.mock('@/components/atoms', () => ({
  Icon: ({ name, size, variant, className }: any) => (
    <div data-testid={`icon-${name}`} data-size={size} data-variant={variant} className={className} />
  ),
  Typography: ({ children, variant, weight, color, className }: any) => (
    <div data-testid={`typography-${variant}`} data-weight={weight} data-color={color} className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/primitives/Card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
}));

const mockFeatures = [
  {
    icon: 'zap',
    title: 'Fast Performance',
    description: 'Lightning-fast load times',
  },
  {
    icon: 'shield',
    title: 'Secure',
    description: 'Bank-level security',
  },
  {
    icon: 'users',
    title: 'Collaborative',
    description: 'Team collaboration features',
  },
];

describe('FeatureGrid - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without title and subtitle', () => {
      render(<FeatureGrid features={mockFeatures} />);

      expect(screen.getAllByTestId('card')).toHaveLength(3);
    });

    it('should render with title', () => {
      render(<FeatureGrid title="Our Features" features={mockFeatures} />);

      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });

    it('should render with subtitle', () => {
      render(
        <FeatureGrid
          title="Features"
          subtitle="Why choose us"
          features={mockFeatures}
        />
      );

      expect(screen.getByText('Why choose us')).toBeInTheDocument();
    });

    it('should render all features', () => {
      render(<FeatureGrid features={mockFeatures} />);

      expect(screen.getByText('Fast Performance')).toBeInTheDocument();
      expect(screen.getByText('Secure')).toBeInTheDocument();
      expect(screen.getByText('Collaborative')).toBeInTheDocument();
    });

    it('should render feature icons', () => {
      render(<FeatureGrid features={mockFeatures} />);

      expect(screen.getByTestId('icon-zap')).toBeInTheDocument();
      expect(screen.getByTestId('icon-shield')).toBeInTheDocument();
      expect(screen.getByTestId('icon-users')).toBeInTheDocument();
    });

    it('should render feature descriptions', () => {
      render(<FeatureGrid features={mockFeatures} />);

      expect(screen.getByText('Lightning-fast load times')).toBeInTheDocument();
      expect(screen.getByText('Bank-level security')).toBeInTheDocument();
      expect(screen.getByText('Team collaboration features')).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('should apply default column configuration', () => {
      const { container } = render(<FeatureGrid features={mockFeatures} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });

    it('should apply custom column configuration', () => {
      const { container } = render(
        <FeatureGrid
          features={mockFeatures}
          columns={{ mobile: 2, tablet: 3, desktop: 4 }}
        />
      );

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2');
      expect(grid).toHaveClass('md:grid-cols-3');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });

    it('should apply default gap', () => {
      const { container } = render(<FeatureGrid features={mockFeatures} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-8');
    });

    it('should apply small gap', () => {
      const { container } = render(<FeatureGrid features={mockFeatures} gap="sm" />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-4');
    });

    it('should apply medium gap', () => {
      const { container } = render(<FeatureGrid features={mockFeatures} gap="md" />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-6');
    });

    it('should apply large gap', () => {
      const { container } = render(<FeatureGrid features={mockFeatures} gap="lg" />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-8');
    });
  });

  describe('Links', () => {
    it('should render features without links', () => {
      render(<FeatureGrid features={mockFeatures} />);

      const links = screen.queryAllByRole('link');
      expect(links).toHaveLength(0);
    });

    it('should render features with links', () => {
      const featuresWithLinks = [
        { ...mockFeatures[0], href: '/features/performance' },
        { ...mockFeatures[1], href: '/features/security' },
        mockFeatures[2],
      ];

      render(<FeatureGrid features={featuresWithLinks} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/features/performance');
      expect(links[1]).toHaveAttribute('href', '/features/security');
    });

    it('should render clickable feature cards', () => {
      const featuresWithLinks = [
        { ...mockFeatures[0], href: '/feature1' },
      ];

      render(<FeatureGrid features={featuresWithLinks} />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('block', 'h-full');
    });
  });

  describe('Styling', () => {
    it('should render with default className', () => {
      const { container } = render(<FeatureGrid features={mockFeatures} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('py-16', 'sm:py-24', 'bg-secondary/10');
    });

    it('should render with custom className', () => {
      const { container } = render(
        <FeatureGrid features={mockFeatures} className="custom-class" />
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-class');
    });

    it('should apply theme override styles', () => {
      const themeOverride = {
        'primary': '#ff0000',
        'secondary': '#00ff00',
      };

      const { container } = render(
        <FeatureGrid features={mockFeatures} themeOverride={themeOverride} />
      );

      const section = container.querySelector('section') as HTMLElement;
      expect(section).toHaveStyle({ '--primary': '#ff0000' });
      expect(section).toHaveStyle({ '--secondary': '#00ff00' });
    });

    it('should render cards with hover effects', () => {
      render(<FeatureGrid features={mockFeatures} />);

      const cards = screen.getAllByTestId('card');
      cards.forEach(card => {
        expect(card).toHaveClass('border-2', 'hover:border-primary/50', 'transition-all', 'duration-300', 'hover:shadow-lg');
      });
    });
  });

  describe('Empty States', () => {
    it('should render with empty features array', () => {
      const { container } = render(<FeatureGrid features={[]} />);

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid?.children).toHaveLength(0);
    });

    it('should render title without features', () => {
      render(<FeatureGrid title="Features" features={[]} />);

      expect(screen.getByText('Features')).toBeInTheDocument();
    });
  });

  describe('Section Header', () => {
    it('should not render header when title and subtitle are missing', () => {
      const { container } = render(<FeatureGrid features={mockFeatures} />);

      const header = container.querySelector('.text-center.mb-12');
      expect(header).not.toBeInTheDocument();
    });

    it('should render header with title only', () => {
      const { container } = render(<FeatureGrid title="Features" features={mockFeatures} />);

      const header = container.querySelector('.text-center.mb-12');
      expect(header).toBeInTheDocument();
    });

    it('should render header with subtitle only', () => {
      const { container } = render(<FeatureGrid subtitle="Why choose us" features={mockFeatures} />);

      const header = container.querySelector('.text-center.mb-12');
      expect(header).toBeInTheDocument();
    });

    it('should render header with both title and subtitle', () => {
      render(
        <FeatureGrid
          title="Our Features"
          subtitle="Why we're the best"
          features={mockFeatures}
        />
      );

      expect(screen.getByText('Our Features')).toBeInTheDocument();
      expect(screen.getByText("Why we're the best")).toBeInTheDocument();
    });
  });

  describe('Container', () => {
    it('should render with container wrapper', () => {
      const { container } = render(<FeatureGrid features={mockFeatures} />);

      const containerDiv = container.querySelector('.container');
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to section element', () => {
      const ref = vi.fn();
      render(<FeatureGrid ref={ref} features={mockFeatures} />);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic section element', () => {
      const { container } = render(<FeatureGrid features={mockFeatures} />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should render icons with primary variant', () => {
      render(<FeatureGrid features={mockFeatures} />);

      const icons = screen.getAllByTestId(/icon-/);
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('data-variant', 'primary');
        expect(icon).toHaveAttribute('data-size', 'lg');
      });
    });
  });

  describe('Multiple Features', () => {
    it('should render many features', () => {
      const manyFeatures = Array.from({ length: 10 }, (_, i) => ({
        icon: 'star',
        title: `Feature ${i + 1}`,
        description: `Description ${i + 1}`,
      }));

      render(<FeatureGrid features={manyFeatures} />);

      expect(screen.getAllByTestId('card')).toHaveLength(10);
    });

    it('should render single feature', () => {
      render(<FeatureGrid features={[mockFeatures[0]]} />);

      expect(screen.getAllByTestId('card')).toHaveLength(1);
    });
  });
});
