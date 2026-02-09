import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Hero } from './Hero';
import type { HeroProps } from './Hero.types';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Hero', () => {
  const defaultProps: HeroProps = {
    title: 'Build Better Products',
    subtitle: 'The ultimate platform for modern software development',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with required props only', () => {
    render(<Hero {...defaultProps} />);

    expect(screen.getByText('Build Better Products')).toBeInTheDocument();
    expect(screen.getByText('The ultimate platform for modern software development')).toBeInTheDocument();
  });

  it('should render badge when provided', () => {
    render(<Hero {...defaultProps} badge="New Feature" />);

    expect(screen.getByText('New Feature')).toBeInTheDocument();
  });

  it('should render title with highlight', () => {
    render(<Hero {...defaultProps} title="Build Better" titleHighlight="Products" />);

    expect(screen.getByText('Build Better')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('should render primary CTA with href', () => {
    const props: HeroProps = {
      ...defaultProps,
      primaryCTA: {
        text: 'Get Started',
        href: '/signup',
      },
    };

    render(<Hero {...props} />);

    const ctaLink = screen.getByRole('link', { name: 'Get Started' });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/signup');
  });

  it('should render primary CTA with onClick handler', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const props: HeroProps = {
      ...defaultProps,
      primaryCTA: {
        text: 'Get Started',
        onClick,
      },
    };

    render(<Hero {...props} />);

    const cta = screen.getByText('Get Started');
    await user.click(cta.closest('div')!);

    expect(onClick).toHaveBeenCalled();
  });

  it('should render secondary CTA', () => {
    const props: HeroProps = {
      ...defaultProps,
      primaryCTA: {
        text: 'Get Started',
        href: '/signup',
      },
      secondaryCTA: {
        text: 'Learn More',
        href: '/docs',
      },
    };

    render(<Hero {...props} />);

    expect(screen.getByRole('link', { name: 'Get Started' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn More' })).toBeInTheDocument();
  });

  it('should render features list with icons', () => {
    const props: HeroProps = {
      ...defaultProps,
      features: [
        { text: 'Fast Setup', icon: 'checkCircle' },
        { text: 'Secure', icon: 'shield' },
        { text: '24/7 Support', icon: 'support' },
      ],
    };

    render(<Hero {...props} />);

    expect(screen.getByText('Fast Setup')).toBeInTheDocument();
    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByText('24/7 Support')).toBeInTheDocument();
  });

  it('should render features list without icons', () => {
    const props: HeroProps = {
      ...defaultProps,
      features: [
        { text: 'Easy to use' },
        { text: 'Reliable' },
      ],
    };

    render(<Hero {...props} />);

    expect(screen.getByText('Easy to use')).toBeInTheDocument();
    expect(screen.getByText('Reliable')).toBeInTheDocument();
  });

  it('should render image from URL', () => {
    const props: HeroProps = {
      ...defaultProps,
      image: 'https://example.com/hero.jpg',
      imageAlt: 'Hero Image',
    };

    render(<Hero {...props} />);

    const img = screen.getByAltText('Hero Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/hero.jpg');
  });

  it('should render custom image component', () => {
    const CustomImage = () => <div data-testid="custom-image">Custom Image Component</div>;
    const props: HeroProps = {
      ...defaultProps,
      image: <CustomImage />,
    };

    render(<Hero {...props} />);

    expect(screen.getByTestId('custom-image')).toBeInTheDocument();
  });

  it('should render custom placeholder when no image provided', () => {
    const CustomPlaceholder = () => <div data-testid="custom-placeholder">Placeholder</div>;
    const props: HeroProps = {
      ...defaultProps,
      imagePlaceholder: <CustomPlaceholder />,
    };

    render(<Hero {...props} />);

    expect(screen.getByTestId('custom-placeholder')).toBeInTheDocument();
  });

  it('should render default placeholder when no image or placeholder provided', () => {
    render(<Hero {...defaultProps} />);

    expect(screen.getByText('Product Screenshot')).toBeInTheDocument();
    expect(screen.getByText('Your amazing product here')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Hero {...defaultProps} className="custom-hero" />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-hero');
  });

  it('should apply theme override styles', () => {
    const themeOverride = {
      'primary-color': '#00ff00',
      'text-color': '#333333',
    };

    const { container } = render(<Hero {...defaultProps} themeOverride={themeOverride} />);

    const section = container.querySelector('section');
    expect(section).toHaveStyle({
      '--primary-color': '#00ff00',
      '--text-color': '#333333',
    });
  });

  it('should render both CTAs with different variants', () => {
    const props: HeroProps = {
      ...defaultProps,
      primaryCTA: {
        text: 'Primary',
        href: '/primary',
        variant: 'primary',
      },
      secondaryCTA: {
        text: 'Secondary',
        href: '/secondary',
        variant: 'outline',
      },
    };

    render(<Hero {...props} />);

    expect(screen.getByRole('link', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Secondary' })).toBeInTheDocument();
  });

  it('should handle empty features array', () => {
    const props: HeroProps = {
      ...defaultProps,
      features: [],
    };

    render(<Hero {...props} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
  });

  it('should render with all props combined', () => {
    const props: HeroProps = {
      badge: 'New Release',
      title: 'Enterprise Platform',
      titleHighlight: 'for Teams',
      subtitle: 'Scale your business with confidence',
      primaryCTA: {
        text: 'Get Started',
        href: '/signup',
      },
      secondaryCTA: {
        text: 'Watch Demo',
        href: '/demo',
      },
      features: [
        { text: 'Fast', icon: 'checkCircle' },
        { text: 'Secure', icon: 'shield' },
      ],
      image: 'https://example.com/hero.jpg',
      imageAlt: 'Platform Screenshot',
    };

    render(<Hero {...props} />);

    expect(screen.getByText('New Release')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Platform')).toBeInTheDocument();
    expect(screen.getByText('for Teams')).toBeInTheDocument();
    expect(screen.getByText('Scale your business with confidence')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get Started' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Watch Demo' })).toBeInTheDocument();
    expect(screen.getByText('Fast')).toBeInTheDocument();
    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByAltText('Platform Screenshot')).toBeInTheDocument();
  });

  it('should have proper semantic HTML structure', () => {
    const { container } = render(<Hero {...defaultProps} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Hero {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });
});
