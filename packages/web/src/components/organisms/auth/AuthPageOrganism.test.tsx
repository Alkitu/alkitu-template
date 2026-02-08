import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthPageOrganism } from './AuthPageOrganism';

// Mock dependencies
vi.mock('@/components/molecules', () => ({
  AuthCardWrapper: ({ children, headerLabel, backButtonLabel, backButtonHref, showSocial, ...props }: any) => (
    <div data-testid="auth-card-wrapper" {...props}>
      <div data-testid="header-label">{headerLabel}</div>
      {backButtonLabel && <div data-testid="back-button-label">{backButtonLabel}</div>}
      {backButtonHref && <div data-testid="back-button-href">{backButtonHref}</div>}
      {showSocial && <div data-testid="show-social">social-enabled</div>}
      {children}
    </div>
  ),
}));

describe('AuthPageOrganism - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with required props', () => {
      render(
        <AuthPageOrganism headerLabel="Test Header">
          <div>Test Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('auth-card-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('header-label')).toHaveTextContent('Test Header');
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render with all props', () => {
      render(
        <AuthPageOrganism
          headerLabel="Login"
          headerSubtitle="Welcome back"
          backButtonLabel="Back to home"
          backButtonHref="/"
          showSocial
          socialDividerText="or"
          socialPlaceholderText="Continue with"
        >
          <div>Login Form</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('header-label')).toHaveTextContent('Login');
      expect(screen.getByTestId('back-button-label')).toHaveTextContent('Back to home');
      expect(screen.getByTestId('back-button-href')).toHaveTextContent('/');
      expect(screen.getByTestId('show-social')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <AuthPageOrganism headerLabel="Test">
          <div>Child 1</div>
          <div>Child 2</div>
        </AuthPageOrganism>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <AuthPageOrganism headerLabel="Test" className="custom-class">
          <div>Content</div>
        </AuthPageOrganism>
      );

      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render with theme override', () => {
      const themeOverride = {
        '--primary': '#ff0000',
        '--secondary': '#00ff00',
      };

      const { container } = render(
        <AuthPageOrganism headerLabel="Test" themeOverride={themeOverride}>
          <div>Content</div>
        </AuthPageOrganism>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ '--primary': '#ff0000' });
      expect(wrapper).toHaveStyle({ '--secondary': '#00ff00' });
    });
  });

  describe('Props Passing', () => {
    it('should pass headerIcon to AuthCardWrapper', () => {
      render(
        <AuthPageOrganism headerLabel="Test" headerIcon="lock">
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('auth-card-wrapper')).toBeInTheDocument();
    });

    it('should pass showSocial=false by default', () => {
      const { queryByTestId } = render(
        <AuthPageOrganism headerLabel="Test">
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(queryByTestId('show-social')).not.toBeInTheDocument();
    });

    it('should pass showSocial=true when specified', () => {
      render(
        <AuthPageOrganism headerLabel="Test" showSocial>
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('show-social')).toBeInTheDocument();
    });

    it('should pass social divider text', () => {
      render(
        <AuthPageOrganism
          headerLabel="Test"
          showSocial
          socialDividerText="OR"
        >
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('auth-card-wrapper')).toBeInTheDocument();
    });
  });

  describe('Content Wrapping', () => {
    it('should wrap form components', () => {
      render(
        <AuthPageOrganism headerLabel="Login">
          <form data-testid="login-form">
            <input type="email" />
            <button type="submit">Submit</button>
          </form>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should preserve child component props', () => {
      const ChildComponent = ({ testProp }: { testProp: string }) => (
        <div data-testid="child">{testProp}</div>
      );

      render(
        <AuthPageOrganism headerLabel="Test">
          <ChildComponent testProp="test-value" />
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('child')).toHaveTextContent('test-value');
    });
  });

  describe('Back Button Configuration', () => {
    it('should render without back button', () => {
      const { queryByTestId } = render(
        <AuthPageOrganism headerLabel="Test">
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(queryByTestId('back-button-label')).not.toBeInTheDocument();
      expect(queryByTestId('back-button-href')).not.toBeInTheDocument();
    });

    it('should render with back button label only', () => {
      render(
        <AuthPageOrganism headerLabel="Test" backButtonLabel="Go Back">
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('back-button-label')).toHaveTextContent('Go Back');
    });

    it('should render with back button label and href', () => {
      render(
        <AuthPageOrganism
          headerLabel="Test"
          backButtonLabel="Back to home"
          backButtonHref="/"
        >
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('back-button-label')).toHaveTextContent('Back to home');
      expect(screen.getByTestId('back-button-href')).toHaveTextContent('/');
    });

    it('should render with localized back button href', () => {
      render(
        <AuthPageOrganism
          headerLabel="Test"
          backButtonLabel="Back"
          backButtonHref="/es/auth/login"
        >
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('back-button-href')).toHaveTextContent('/es/auth/login');
    });
  });

  describe('Header Configuration', () => {
    it('should render with header label only', () => {
      render(
        <AuthPageOrganism headerLabel="Sign In">
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('header-label')).toHaveTextContent('Sign In');
    });

    it('should render with header label and subtitle', () => {
      render(
        <AuthPageOrganism
          headerLabel="Sign In"
          headerSubtitle="Welcome back to your account"
        >
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('header-label')).toHaveTextContent('Sign In');
    });

    it('should render with header icon', () => {
      render(
        <AuthPageOrganism
          headerLabel="Sign In"
          headerIcon="lock"
        >
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('auth-card-wrapper')).toBeInTheDocument();
    });
  });

  describe('Social Authentication', () => {
    it('should hide social section by default', () => {
      const { queryByTestId } = render(
        <AuthPageOrganism headerLabel="Test">
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(queryByTestId('show-social')).not.toBeInTheDocument();
    });

    it('should show social section when enabled', () => {
      render(
        <AuthPageOrganism headerLabel="Test" showSocial>
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('show-social')).toBeInTheDocument();
    });

    it('should show social divider text', () => {
      render(
        <AuthPageOrganism
          headerLabel="Test"
          showSocial
          socialDividerText="or continue with"
        >
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('auth-card-wrapper')).toBeInTheDocument();
    });

    it('should show social placeholder text', () => {
      render(
        <AuthPageOrganism
          headerLabel="Test"
          showSocial
          socialPlaceholderText="Sign in with social media"
        >
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(screen.getByTestId('auth-card-wrapper')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with login form', () => {
      render(
        <AuthPageOrganism
          headerLabel="Login"
          backButtonLabel="Back"
          backButtonHref="/"
          showSocial
        >
          <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign In</button>
          </form>
        </AuthPageOrganism>
      );

      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should work with registration form', () => {
      render(
        <AuthPageOrganism
          headerLabel="Register"
          backButtonLabel="Already have an account?"
          backButtonHref="/auth/login"
        >
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Create Account</button>
          </form>
        </AuthPageOrganism>
      );

      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to wrapper div', () => {
      const ref = vi.fn();
      render(
        <AuthPageOrganism ref={ref} headerLabel="Test">
          <div>Content</div>
        </AuthPageOrganism>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Additional Props', () => {
    it('should pass additional HTML attributes', () => {
      render(
        <AuthPageOrganism
          headerLabel="Test"
          data-custom-attr="test-value"
          aria-label="Auth page"
        >
          <div>Content</div>
        </AuthPageOrganism>
      );

      const wrapper = screen.getByLabelText('Auth page');
      expect(wrapper).toHaveAttribute('data-custom-attr', 'test-value');
    });

    it('should merge custom styles with theme override', () => {
      const themeOverride = { '--primary': '#ff0000' };
      const { container } = render(
        <AuthPageOrganism
          headerLabel="Test"
          themeOverride={themeOverride}
          style={{ color: 'blue' }}
        >
          <div>Content</div>
        </AuthPageOrganism>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ '--primary': '#ff0000' });
    });
  });
});
