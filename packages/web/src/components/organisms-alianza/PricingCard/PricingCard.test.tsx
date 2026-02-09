import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PricingCard } from './PricingCard';
import type { PricingCardProps } from './PricingCard.types';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('PricingCard', () => {
  const defaultProps: PricingCardProps = {
    title: 'Professional',
    price: '$99/mo',
    description: 'Perfect for growing teams',
    features: [
      'Up to 10 users',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
    ],
    ctaText: 'Get Started',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with required props', () => {
    render(<PricingCard {...defaultProps} />);

    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('$99/mo')).toBeInTheDocument();
    expect(screen.getByText('Perfect for growing teams')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('should render all features with checkmark icons', () => {
    render(<PricingCard {...defaultProps} />);

    expect(screen.getByText('Up to 10 users')).toBeInTheDocument();
    expect(screen.getByText('Advanced analytics')).toBeInTheDocument();
    expect(screen.getByText('Priority support')).toBeInTheDocument();
    expect(screen.getByText('Custom integrations')).toBeInTheDocument();
  });

  it('should render badge when provided', () => {
    render(<PricingCard {...defaultProps} badge="Most Popular" />);

    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('should render original price and discount', () => {
    render(
      <PricingCard
        {...defaultProps}
        originalPrice="$149/mo"
        discount="Save 34%"
      />
    );

    expect(screen.getByText('$149/mo')).toBeInTheDocument();
    expect(screen.getByText('Save 34%')).toBeInTheDocument();
  });

  it('should render only original price without discount', () => {
    render(<PricingCard {...defaultProps} originalPrice="$149/mo" />);

    expect(screen.getByText('$149/mo')).toBeInTheDocument();
    expect(screen.queryByText(/Save/)).not.toBeInTheDocument();
  });

  it('should render only discount without original price', () => {
    render(<PricingCard {...defaultProps} discount="Limited Time Offer" />);

    expect(screen.getByText('Limited Time Offer')).toBeInTheDocument();
  });

  it('should render CTA button with href as link', () => {
    render(<PricingCard {...defaultProps} ctaHref="/checkout" />);

    const cta = screen.getByRole('button', { name: 'Get Started' });
    const link = cta.closest('a');
    expect(link).toHaveAttribute('href', '/checkout');
  });

  it('should render CTA button with onClick handler', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<PricingCard {...defaultProps} ctaOnClick={onClick} />);

    const cta = screen.getByRole('button', { name: 'Get Started' });
    await user.click(cta);

    expect(onClick).toHaveBeenCalled();
  });

  it('should render guarantee text when provided', () => {
    render(
      <PricingCard {...defaultProps} guarantee="30-day money-back guarantee" />
    );

    expect(screen.getByText('30-day money-back guarantee')).toBeInTheDocument();
  });

  it('should render features in 2 columns by default', () => {
    const { container } = render(<PricingCard {...defaultProps} />);

    const featuresGrid = container.querySelector('.grid');
    expect(featuresGrid).toHaveClass('md:grid-cols-2');
  });

  it('should render features in 1 column when specified', () => {
    const { container } = render(
      <PricingCard {...defaultProps} featuresColumns={1} />
    );

    const featuresGrid = container.querySelector('.grid');
    expect(featuresGrid).not.toHaveClass('md:grid-cols-2');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <PricingCard {...defaultProps} className="custom-pricing" />
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-pricing');
  });

  it('should apply theme override styles', () => {
    const themeOverride = {
      'primary-color': '#ff6b00',
      'card-background': '#ffffff',
    };

    const { container } = render(
      <PricingCard {...defaultProps} themeOverride={themeOverride} />
    );

    const section = container.querySelector('section');
    expect(section).toHaveStyle({
      '--primary-color': '#ff6b00',
      '--card-background': '#ffffff',
    });
  });

  it('should render with single feature', () => {
    render(<PricingCard {...defaultProps} features={['Unlimited access']} />);

    expect(screen.getByText('Unlimited access')).toBeInTheDocument();
  });

  it('should render with many features', () => {
    const manyFeatures = [
      'Feature 1',
      'Feature 2',
      'Feature 3',
      'Feature 4',
      'Feature 5',
      'Feature 6',
      'Feature 7',
      'Feature 8',
    ];

    render(<PricingCard {...defaultProps} features={manyFeatures} />);

    manyFeatures.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('should render complete pricing card with all options', () => {
    const completeProps: PricingCardProps = {
      badge: 'Best Value',
      title: 'Enterprise',
      price: '$299/mo',
      originalPrice: '$399/mo',
      discount: 'Save 25%',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Advanced security',
        'Dedicated support',
        'Custom SLA',
        'White-label option',
        'API access',
      ],
      ctaText: 'Contact Sales',
      ctaHref: '/contact',
      guarantee: '30-day money-back guarantee',
      featuresColumns: 2,
    };

    render(<PricingCard {...completeProps} />);

    expect(screen.getByText('Best Value')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText('$299/mo')).toBeInTheDocument();
    expect(screen.getByText('$399/mo')).toBeInTheDocument();
    expect(screen.getByText('Save 25%')).toBeInTheDocument();
    expect(screen.getByText('For large organizations')).toBeInTheDocument();
    expect(screen.getByText('Unlimited users')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contact Sales' })).toBeInTheDocument();
    expect(screen.getByText('30-day money-back guarantee')).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    const { container } = render(<PricingCard {...defaultProps} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('should render price prominently', () => {
    render(<PricingCard {...defaultProps} />);

    const price = screen.getByText('$99/mo');
    expect(price).toBeInTheDocument();
    expect(price).toHaveClass('text-4xl', 'font-bold');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<PricingCard {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('should handle empty features array gracefully', () => {
    render(<PricingCard {...defaultProps} features={[]} />);

    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('$99/mo')).toBeInTheDocument();
  });

  it('should render with very long feature text', () => {
    const longFeature = 'This is a very long feature description that should still render correctly without breaking the card layout or causing any visual issues';

    render(<PricingCard {...defaultProps} features={[longFeature]} />);

    expect(screen.getByText(longFeature)).toBeInTheDocument();
  });
});
