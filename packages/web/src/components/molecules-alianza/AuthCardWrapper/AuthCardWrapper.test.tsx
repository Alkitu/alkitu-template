import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AuthCardWrapper } from './AuthCardWrapper';
import type { AuthCardWrapperProps } from './AuthCardWrapper.types';

expect.extend(toHaveNoViolations);

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/en/auth/login'),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

// Mock getCurrentLocalizedRoute
vi.mock('@/lib/locale', () => ({
  getCurrentLocalizedRoute: vi.fn((route: string) => route),
}));

describe('AuthCardWrapper Molecule', () => {
  const defaultProps: AuthCardWrapperProps = {
    title: 'Welcome Back',
    children: <div data-testid="form-content">Login Form</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders with required props only', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByTestId('form-content')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          subtitle="Sign in to continue"
          icon="lock"
          showLogo
          backButtonLabel="Back to home"
          backButtonHref="/"
          showSocial
          footer={<div data-testid="footer-content">Footer</div>}
        />,
      );

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
      expect(screen.getByTestId('form-content')).toBeInTheDocument();
      expect(screen.getByTestId('footer-content')).toBeInTheDocument();
    });

    it('renders with data-testid', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          data-testid="custom-auth-wrapper"
        />,
      );

      expect(screen.getByTestId('custom-auth-wrapper')).toBeInTheDocument();
    });

    it('uses default data-testid when not provided', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.getByTestId('auth-card-wrapper')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <AuthCardWrapper {...defaultProps}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Submit</button>
        </AuthCardWrapper>,
      );

      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });

  // 2. TITLE AND SUBTITLE TESTS
  describe('Title and Subtitle', () => {
    it('renders title correctly', () => {
      render(<AuthCardWrapper {...defaultProps} title="Sign In" />);

      const title = screen.getByText('Sign In');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H1');
    });

    it('renders subtitle when provided', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          subtitle="Welcome back to Alianza"
        />,
      );

      expect(screen.getByText('Welcome back to Alianza')).toBeInTheDocument();
      expect(screen.getByTestId('auth-subtitle')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.queryByTestId('auth-subtitle')).not.toBeInTheDocument();
    });

    it('renders title with correct typography styling', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      const title = screen.getByText('Welcome Back');
      expect(title).toHaveClass('scroll-m-20', 'tracking-tight');
    });
  });

  // 3. LOGO TESTS
  describe('Logo', () => {
    it('renders logo when showLogo is true', () => {
      render(<AuthCardWrapper {...defaultProps} showLogo />);

      expect(screen.getByTestId('auth-logo')).toBeInTheDocument();
    });

    it('does not render logo when showLogo is false', () => {
      render(<AuthCardWrapper {...defaultProps} showLogo={false} />);

      expect(screen.queryByTestId('auth-logo')).not.toBeInTheDocument();
    });

    it('renders logo with default alt text', () => {
      render(<AuthCardWrapper {...defaultProps} showLogo />);

      const logos = screen.getAllByAltText('Alianza Logo');
      expect(logos.length).toBeGreaterThan(0);
      expect(logos[0]).toBeInTheDocument();
    });

    it('renders logo with custom alt text', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          showLogo
          logoAlt="Custom Logo Text"
        />,
      );

      const logos = screen.getAllByAltText('Custom Logo Text');
      expect(logos.length).toBeGreaterThan(0);
      expect(logos[0]).toBeInTheDocument();
    });

    it('logo is not rendered by default', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.queryByTestId('auth-logo')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Alianza Logo')).not.toBeInTheDocument();
    });
  });

  // 4. ICON TESTS
  describe('Icon', () => {
    it('renders icon when provided', () => {
      render(<AuthCardWrapper {...defaultProps} icon="lock" />);

      expect(screen.getByTestId('auth-icon-container')).toBeInTheDocument();
    });

    it('does not render icon when not provided', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.queryByTestId('auth-icon-container')).not.toBeInTheDocument();
    });

    it('renders icon with correct styling', () => {
      render(<AuthCardWrapper {...defaultProps} icon="lock" />);

      const iconContainer = screen.getByTestId('auth-icon-container');
      expect(iconContainer).toHaveClass(
        'w-16',
        'h-16',
        'rounded-full',
        'bg-primary/10',
      );
    });

    it('renders different icons correctly', () => {
      const { rerender } = render(
        <AuthCardWrapper {...defaultProps} icon="lock" />,
      );
      expect(screen.getByTestId('auth-icon-container')).toBeInTheDocument();

      rerender(<AuthCardWrapper {...defaultProps} icon="mail" />);
      expect(screen.getByTestId('auth-icon-container')).toBeInTheDocument();

      rerender(<AuthCardWrapper {...defaultProps} icon="key" />);
      expect(screen.getByTestId('auth-icon-container')).toBeInTheDocument();
    });
  });

  // 5. BACK BUTTON TESTS
  describe('Back Button', () => {
    it('renders desktop back button when label and href provided', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          backButtonLabel="Back to home"
          backButtonHref="/"
        />,
      );

      expect(screen.getByTestId('desktop-back-button')).toBeInTheDocument();
    });

    it('renders mobile back button when label and href provided', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          backButtonLabel="Back to home"
          backButtonHref="/"
        />,
      );

      expect(screen.getByTestId('mobile-back-button')).toBeInTheDocument();
    });

    it('does not render back button when only label provided', () => {
      render(
        <AuthCardWrapper {...defaultProps} backButtonLabel="Back to home" />,
      );

      expect(screen.queryByTestId('desktop-back-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mobile-back-button')).not.toBeInTheDocument();
    });

    it('does not render back button when only href provided', () => {
      render(<AuthCardWrapper {...defaultProps} backButtonHref="/" />);

      expect(screen.queryByTestId('desktop-back-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mobile-back-button')).not.toBeInTheDocument();
    });

    it('does not render back button when neither label nor href provided', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.queryByTestId('desktop-back-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mobile-back-button')).not.toBeInTheDocument();
    });

    it('back button links to correct href', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          backButtonLabel="Back to home"
          backButtonHref="/home"
        />,
      );

      const desktopButton = screen.getByTestId('desktop-back-button');
      const mobileButton = screen.getByTestId('mobile-back-button');

      expect(desktopButton).toHaveAttribute('href', '/home');
      expect(mobileButton).toHaveAttribute('href', '/home');
    });

    it('desktop back button has correct responsive classes', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          backButtonLabel="Back to home"
          backButtonHref="/"
        />,
      );

      const button = screen.getByTestId('desktop-back-button');
      expect(button.parentElement).toHaveClass('hidden', 'md:block');
    });

    it('mobile back button has correct responsive classes', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          backButtonLabel="Back to home"
          backButtonHref="/"
        />,
      );

      const button = screen.getByTestId('mobile-back-button');
      expect(button.parentElement).toHaveClass('md:hidden');
    });
  });

  // 6. SOCIAL SECTION TESTS
  describe('Social Section', () => {
    it('renders social section when showSocial is true', () => {
      render(<AuthCardWrapper {...defaultProps} showSocial />);

      expect(screen.getByTestId('social-divider')).toBeInTheDocument();
      expect(screen.getByTestId('social-placeholder')).toBeInTheDocument();
    });

    it('does not render social section when showSocial is false', () => {
      render(<AuthCardWrapper {...defaultProps} showSocial={false} />);

      expect(screen.queryByTestId('social-divider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-placeholder')).not.toBeInTheDocument();
    });

    it('does not render social section by default', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.queryByTestId('social-divider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-placeholder')).not.toBeInTheDocument();
    });

    it('renders social divider with default text', () => {
      render(<AuthCardWrapper {...defaultProps} showSocial />);

      expect(screen.getByText('Or continue with')).toBeInTheDocument();
    });

    it('renders social divider with custom text', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          showSocial
          socialDividerText="Or sign in with"
        />,
      );

      expect(screen.getByText('Or sign in with')).toBeInTheDocument();
    });

    it('renders social placeholder with default text', () => {
      render(<AuthCardWrapper {...defaultProps} showSocial />);

      expect(
        screen.getByText('OAuth providers will be configured with backend'),
      ).toBeInTheDocument();
    });

    it('renders social placeholder with custom text', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          showSocial
          socialPlaceholderText="Coming soon: Google, GitHub, etc."
        />,
      );

      expect(
        screen.getByText('Coming soon: Google, GitHub, etc.'),
      ).toBeInTheDocument();
    });
  });

  // 7. FOOTER TESTS
  describe('Footer', () => {
    it('renders footer when provided', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          footer={<div data-testid="footer">Footer content</div>}
        />,
      );

      expect(screen.getByTestId('auth-footer')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('does not render footer when not provided', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.queryByTestId('auth-footer')).not.toBeInTheDocument();
    });

    it('renders footer with link', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          footer={
            <span>
              Don't have an account? <a href="/register">Sign up</a>
            </span>
          }
        />,
      );

      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });

    it('renders footer with multiple elements', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          footer={
            <>
              <div>Line 1</div>
              <div>Line 2</div>
              <div>Line 3</div>
            </>
          }
        />,
      );

      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 2')).toBeInTheDocument();
      expect(screen.getByText('Line 3')).toBeInTheDocument();
    });
  });

  // 8. LOADING STATE TESTS
  describe('Loading State', () => {
    it('renders loading overlay when isLoading is true', () => {
      render(<AuthCardWrapper {...defaultProps} isLoading />);

      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
    });

    it('does not render loading overlay when isLoading is false', () => {
      render(<AuthCardWrapper {...defaultProps} isLoading={false} />);

      expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
    });

    it('does not render loading overlay by default', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
    });

    it('loading overlay has correct styling', () => {
      render(<AuthCardWrapper {...defaultProps} isLoading />);

      const overlay = screen.getByTestId('loading-overlay');
      expect(overlay).toHaveClass(
        'absolute',
        'inset-0',
        'bg-background/80',
        'z-10',
      );
    });

    it('content is still rendered when loading', () => {
      render(<AuthCardWrapper {...defaultProps} isLoading />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByTestId('form-content')).toBeInTheDocument();
    });
  });

  // 9. RESPONSIVE BEHAVIOR TESTS
  describe('Responsive Behavior', () => {
    it('applies responsive padding classes by default', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      const wrapper = screen.getByTestId('auth-card-wrapper');
      expect(wrapper).toHaveClass('p-0', 'md:p-8');
    });

    it('applies responsive card classes by default', () => {
      const { container } = render(<AuthCardWrapper {...defaultProps} />);

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass(
        'md:bg-card',
        'md:rounded-[20px]',
        'md:shadow-sm',
      );
    });

    it('disables responsive behavior when disableResponsive is true', () => {
      render(<AuthCardWrapper {...defaultProps} disableResponsive />);

      const wrapper = screen.getByTestId('auth-card-wrapper');
      expect(wrapper).toHaveClass('p-8');
      expect(wrapper).not.toHaveClass('p-0');
    });

    it('applies fixed padding when disableResponsive is true', () => {
      const { container } = render(
        <AuthCardWrapper {...defaultProps} disableResponsive />,
      );

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass('bg-card', 'rounded-[20px]', 'p-[42px]');
    });
  });

  // 10. CUSTOM STYLING TESTS
  describe('Custom Styling', () => {
    it('accepts custom className for wrapper', () => {
      render(<AuthCardWrapper {...defaultProps} className="custom-wrapper" />);

      const wrapper = screen.getByTestId('auth-card-wrapper');
      expect(wrapper).toHaveClass('custom-wrapper');
    });

    it('merges custom className with default classes', () => {
      render(<AuthCardWrapper {...defaultProps} className="custom-wrapper" />);

      const wrapper = screen.getByTestId('auth-card-wrapper');
      expect(wrapper).toHaveClass('custom-wrapper', 'w-full', 'bg-background');
    });

    it('accepts custom className for card', () => {
      const { container } = render(
        <AuthCardWrapper {...defaultProps} cardClassName="custom-card" />,
      );

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass('custom-card');
    });

    it('merges card className with default classes', () => {
      const { container } = render(
        <AuthCardWrapper {...defaultProps} cardClassName="custom-card" />,
      );

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass('custom-card', 'w-full', 'max-w-[520px]');
    });
  });

  // 11. COMPOSITION TESTS
  describe('Composition', () => {
    it('renders all sections together correctly', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          subtitle="Subtitle text"
          icon="lock"
          showLogo
          backButtonLabel="Back"
          backButtonHref="/"
          showSocial
          footer={<div>Footer</div>}
        />,
      );

      expect(screen.getByTestId('auth-logo')).toBeInTheDocument();
      expect(screen.getByTestId('auth-icon-container')).toBeInTheDocument();
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Subtitle text')).toBeInTheDocument();
      expect(screen.getByTestId('form-content')).toBeInTheDocument();
      expect(screen.getByTestId('social-divider')).toBeInTheDocument();
      expect(screen.getByTestId('auth-footer')).toBeInTheDocument();
      expect(screen.getByTestId('desktop-back-button')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-back-button')).toBeInTheDocument();
    });

    it('renders minimal composition (title and children only)', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByTestId('form-content')).toBeInTheDocument();

      // Ensure optional elements are not rendered
      expect(screen.queryByTestId('auth-logo')).not.toBeInTheDocument();
      expect(screen.queryByTestId('auth-icon-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('auth-subtitle')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-divider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('auth-footer')).not.toBeInTheDocument();
    });
  });

  // 12. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('uses theme CSS variables for background', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      const wrapper = screen.getByTestId('auth-card-wrapper');
      expect(wrapper).toHaveClass('bg-background');
    });

    it('card uses theme border variables', () => {
      const { container } = render(<AuthCardWrapper {...defaultProps} />);

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass('md:border', 'md:border-border');
    });

    it('social placeholder uses primary color', () => {
      render(<AuthCardWrapper {...defaultProps} showSocial />);

      const placeholder = screen.getByTestId('social-placeholder');
      expect(placeholder).toHaveClass('border-primary/30', 'bg-primary/5');
    });
  });

  // 13. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('title uses correct heading level (h1)', () => {
      render(<AuthCardWrapper {...defaultProps} />);

      const title = screen.getByText('Welcome Back');
      expect(title.tagName).toBe('H1');
    });

    it('has no accessibility violations - basic setup', async () => {
      const { container } = render(<AuthCardWrapper {...defaultProps} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with all features', async () => {
      const { container } = render(
        <AuthCardWrapper
          {...defaultProps}
          subtitle="Subtitle"
          icon="lock"
          showLogo
          showSocial
          footer={<div>Footer</div>}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with back button', async () => {
      const { container } = render(
        <AuthCardWrapper
          {...defaultProps}
          backButtonLabel="Back to home"
          backButtonHref="/"
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - loading state', async () => {
      const { container } = render(
        <AuthCardWrapper {...defaultProps} isLoading />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 14. EDGE CASES
  describe('Edge Cases', () => {
    it('handles very long title', () => {
      const longTitle = 'A'.repeat(100);
      render(<AuthCardWrapper {...defaultProps} title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles very long subtitle', () => {
      const longSubtitle = 'B'.repeat(200);
      render(<AuthCardWrapper {...defaultProps} subtitle={longSubtitle} />);

      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });

    it('handles empty children', () => {
      render(
        <AuthCardWrapper {...defaultProps}>
          <></>
        </AuthCardWrapper>,
      );

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('handles complex footer content', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          footer={
            <div>
              <p>Line 1</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
              <a href="/link">Link</a>
            </div>
          }
        />,
      );

      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Link')).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      render(
        <AuthCardWrapper
          {...defaultProps}
          title="Welcome! 🎉"
          subtitle="Let's get started → ✓"
        />,
      );

      expect(screen.getByText(/Welcome! 🎉/)).toBeInTheDocument();
      expect(screen.getByText(/Let's get started → ✓/)).toBeInTheDocument();
    });
  });

  // 15. REF FORWARDING TESTS
  describe('Ref Forwarding', () => {
    it('forwards ref to wrapper element', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<AuthCardWrapper {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('w-full', 'bg-background');
    });

    it('ref points to correct element', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<AuthCardWrapper {...defaultProps} ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId('auth-card-wrapper'));
    });
  });

  // 16. DISPLAY NAME TEST
  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(AuthCardWrapper.displayName).toBe('AuthCardWrapper');
    });
  });
});
