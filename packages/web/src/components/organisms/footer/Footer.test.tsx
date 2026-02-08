import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Footer } from './Footer';
import type { FooterProps } from './Footer.types';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Footer', () => {
  const defaultProps: FooterProps = {
    brand: {
      name: 'Alkitu',
      description: 'Enterprise SaaS platform for modern businesses',
    },
    sections: [
      {
        title: 'Product',
        links: [
          { text: 'Features', href: '/features' },
          { text: 'Pricing', href: '/pricing' },
          { text: 'Documentation', href: '/docs' },
        ],
      },
      {
        title: 'Company',
        links: [
          { text: 'About', href: '/about' },
          { text: 'Blog', href: '/blog' },
          { text: 'Careers', href: '/careers' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { text: 'Privacy', href: '/privacy' },
          { text: 'Terms', href: '/terms' },
        ],
      },
    ],
    copyright: '© 2024 Alkitu. All rights reserved.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with all required props', () => {
    render(<Footer {...defaultProps} />);

    expect(screen.getByText('Alkitu')).toBeInTheDocument();
    expect(screen.getByText('Enterprise SaaS platform for modern businesses')).toBeInTheDocument();
    expect(screen.getByText('© 2024 Alkitu. All rights reserved.')).toBeInTheDocument();
  });

  it('should render all section titles', () => {
    render(<Footer {...defaultProps} />);

    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });

  it('should render all footer links with correct href', () => {
    render(<Footer {...defaultProps} />);

    const featuresLink = screen.getByRole('link', { name: 'Features' });
    expect(featuresLink).toBeInTheDocument();
    expect(featuresLink).toHaveAttribute('href', '/features');

    const pricingLink = screen.getByRole('link', { name: 'Pricing' });
    expect(pricingLink).toHaveAttribute('href', '/pricing');

    const privacyLink = screen.getByRole('link', { name: 'Privacy' });
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });

  it('should render brand logo when provided', () => {
    const propsWithLogo: FooterProps = {
      ...defaultProps,
      brand: {
        ...defaultProps.brand,
        logo: <img src="/logo.svg" alt="Logo" />,
      },
    };

    render(<Footer {...propsWithLogo} />);

    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.svg');
  });

  it('should render default logo when no logo provided', () => {
    render(<Footer {...defaultProps} />);

    // Default logo shows first letter of brand name
    const defaultLogo = screen.getByText('A'); // First letter of "Alkitu"
    expect(defaultLogo).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Footer {...defaultProps} className="custom-footer" />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('custom-footer');
  });

  it('should apply theme override styles', () => {
    const themeOverride = {
      'primary-color': '#ff0000',
      'background-color': '#000000',
    };

    const { container } = render(<Footer {...defaultProps} themeOverride={themeOverride} />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveStyle({
      '--primary-color': '#ff0000',
      '--background-color': '#000000',
    });
  });

  it('should render multiple links in each section', () => {
    render(<Footer {...defaultProps} />);

    // Product section has 3 links
    expect(screen.getByRole('link', { name: 'Features' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Documentation' })).toBeInTheDocument();

    // Company section has 3 links
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Careers' })).toBeInTheDocument();

    // Legal section has 2 links
    expect(screen.getByRole('link', { name: 'Privacy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms' })).toBeInTheDocument();
  });

  it('should render with empty sections array', () => {
    const propsWithoutSections: FooterProps = {
      ...defaultProps,
      sections: [],
    };

    render(<Footer {...propsWithoutSections} />);

    expect(screen.getByText('Alkitu')).toBeInTheDocument();
    expect(screen.getByText('© 2024 Alkitu. All rights reserved.')).toBeInTheDocument();
  });

  it('should render with minimum required props', () => {
    const minimalProps: FooterProps = {
      brand: {
        name: 'TestBrand',
        description: 'Test description',
      },
      sections: [],
      copyright: '© 2024 Test',
    };

    render(<Footer {...minimalProps} />);

    expect(screen.getByText('TestBrand')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('© 2024 Test')).toBeInTheDocument();
  });

  it('should have proper semantic HTML structure', () => {
    const { container } = render(<Footer {...defaultProps} />);

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer?.tagName).toBe('FOOTER');
  });

  it('should render brand name as heading', () => {
    render(<Footer {...defaultProps} />);

    const brandName = screen.getByText('Alkitu');
    expect(brandName.closest('h3')).toBeInTheDocument();
  });

  it('should render section titles as headings', () => {
    render(<Footer {...defaultProps} />);

    const productTitle = screen.getByText('Product');
    expect(productTitle.closest('h4')).toBeInTheDocument();

    const companyTitle = screen.getByText('Company');
    expect(companyTitle.closest('h4')).toBeInTheDocument();
  });

  it('should display copyright in footer', () => {
    render(<Footer {...defaultProps} />);

    const copyright = screen.getByText('© 2024 Alkitu. All rights reserved.');
    expect(copyright).toBeInTheDocument();
  });

  it('should handle very long brand descriptions', () => {
    const propsWithLongDescription: FooterProps = {
      ...defaultProps,
      brand: {
        name: 'Alkitu',
        description: 'This is a very long description that should still render correctly and not break the layout or cause any display issues in the footer component. It should wrap properly and maintain good readability.',
      },
    };

    render(<Footer {...propsWithLongDescription} />);

    expect(screen.getByText(/This is a very long description/)).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Footer {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });
});
