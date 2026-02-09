import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedOrganism } from './UnauthorizedOrganism';

// Mock dependencies
vi.mock('@/components/molecules-alianza/Button', () => ({
  Button: ({ children, variant, asChild }: any) => (
    <button data-variant={variant}>
      {asChild ? children : <span>{children}</span>}
    </button>
  ),
}));

vi.mock('@/components/atoms-alianza/Typography', () => ({
  Typography: ({ children, variant, className }: any) => (
    <div data-testid="typography" className={className}>
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
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className }: any) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
  CardDescription: ({ children, className }: any) => (
    <div data-testid="card-description" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('lucide-react', () => ({
  AlertTriangle: ({ className }: any) => (
    <div data-testid="alert-triangle-icon" className={className} />
  ),
}));

describe('UnauthorizedOrganism - Organism', () => {
  const defaultProps = {
    title: 'Access Denied',
    description: 'You do not have permission to access this page',
    message: 'Please contact your administrator if you believe this is an error',
    dashboardButtonText: 'Go to Dashboard',
    loginButtonText: 'Go to Login',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all required elements', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText('You do not have permission to access this page')).toBeInTheDocument();
      expect(screen.getByText('Please contact your administrator if you believe this is an error')).toBeInTheDocument();
    });

    it('should render dashboard button with default href', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const link = screen.getByRole('link', { name: 'Go to Dashboard' });
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('should render login button with default href', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const link = screen.getByRole('link', { name: 'Go to Login' });
      expect(link).toHaveAttribute('href', '/auth/login');
    });

    it('should render with custom dashboard href', () => {
      render(
        <UnauthorizedOrganism
          {...defaultProps}
          dashboardButtonHref="/admin/dashboard"
        />
      );

      const link = screen.getByRole('link', { name: 'Go to Dashboard' });
      expect(link).toHaveAttribute('href', '/admin/dashboard');
    });

    it('should render with custom login href', () => {
      render(
        <UnauthorizedOrganism
          {...defaultProps}
          loginButtonHref="/signin"
        />
      );

      const link = screen.getByRole('link', { name: 'Go to Login' });
      expect(link).toHaveAttribute('href', '/signin');
    });
  });

  describe('Icon', () => {
    it('should render alert triangle icon', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const icon = screen.getByTestId('alert-triangle-icon');
      expect(icon).toHaveClass('h-16', 'w-16', 'text-red-500');
    });

    it('should center the icon', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const iconContainer = container.querySelector('.flex.justify-center');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Card Structure', () => {
    it('should render within a card', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render card header', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      expect(screen.getByTestId('card-header')).toBeInTheDocument();
    });

    it('should render card content', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      expect(screen.getByTestId('card-content')).toBeInTheDocument();
    });

    it('should apply correct card width', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('w-full', 'max-w-md');
    });
  });

  describe('Layout', () => {
    it('should center content on screen', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass(
        'min-h-screen',
        'flex',
        'items-center',
        'justify-center'
      );
    });

    it('should apply background color', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-gray-50', 'dark:bg-gray-900');
    });

    it('should apply padding', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('px-4');
    });
  });

  describe('Typography', () => {
    it('should render title with correct styling', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass(
        'text-2xl',
        'font-bold',
        'text-gray-900',
        'dark:text-gray-100'
      );
    });

    it('should render description with correct styling', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const description = screen.getByTestId('card-description');
      expect(description).toHaveClass('text-gray-600', 'dark:text-gray-400');
    });

    it('should render message in typography component', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      expect(screen.getByTestId('typography')).toBeInTheDocument();
    });
  });

  describe('Buttons', () => {
    it('should render both action buttons', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      expect(screen.getByRole('link', { name: 'Go to Dashboard' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go to Login' })).toBeInTheDocument();
    });

    it('should render dashboard button as primary', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      expect(buttons[0]).not.toHaveAttribute('data-variant', 'outline');
    });

    it('should render login button as outline variant', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      expect(buttons[1]).toHaveAttribute('data-variant', 'outline');
    });

    it('should stack buttons in flex column', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const buttonContainer = container.querySelector('.flex.flex-col');
      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass('gap-2');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <UnauthorizedOrganism {...defaultProps} className="custom-class" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should merge className with default classes', () => {
      const { container } = render(
        <UnauthorizedOrganism {...defaultProps} className="custom-class" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class', 'min-h-screen');
    });

    it('should apply theme override styles', () => {
      const themeOverride = {
        '--primary': '#ff0000',
        '--secondary': '#00ff00',
      };

      const { container } = render(
        <UnauthorizedOrganism {...defaultProps} themeOverride={themeOverride} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ '--primary': '#ff0000' });
      expect(wrapper).toHaveStyle({ '--secondary': '#00ff00' });
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to wrapper div', () => {
      const ref = vi.fn();
      render(<UnauthorizedOrganism ref={ref} {...defaultProps} />);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Content Centering', () => {
    it('should center card header content', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('text-center');
    });

    it('should center card content', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const contentCenter = container.querySelector('.text-center');
      expect(contentCenter).toBeInTheDocument();
    });
  });

  describe('Spacing', () => {
    it('should apply spacing to card content', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('space-y-4');
    });

    it('should apply margin to icon container', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const iconContainer = container.querySelector('.mb-4');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply margin to message', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const message = container.querySelector('.mb-4');
      expect(message).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render semantic structure', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('card-header')).toBeInTheDocument();
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
    });

    it('should render accessible links', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const dashboardLink = screen.getByRole('link', { name: 'Go to Dashboard' });
      const loginLink = screen.getByRole('link', { name: 'Go to Login' });

      expect(dashboardLink).toBeInTheDocument();
      expect(loginLink).toBeInTheDocument();
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes for title', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('dark:text-gray-100');
    });

    it('should have dark mode classes for description', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const description = screen.getByTestId('card-description');
      expect(description).toHaveClass('dark:text-gray-400');
    });

    it('should have dark mode classes for background', () => {
      const { container } = render(<UnauthorizedOrganism {...defaultProps} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('dark:bg-gray-900');
    });

    it('should have dark mode classes for message', () => {
      render(<UnauthorizedOrganism {...defaultProps} />);

      const message = screen.getByTestId('typography');
      expect(message).toHaveClass('dark:text-gray-400');
    });
  });

  describe('Additional Props', () => {
    it('should pass additional HTML attributes', () => {
      const { container } = render(
        <UnauthorizedOrganism
          {...defaultProps}
          data-custom-attr="test-value"
          aria-label="Unauthorized page"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('data-custom-attr', 'test-value');
      expect(wrapper).toHaveAttribute('aria-label', 'Unauthorized page');
    });
  });
});
