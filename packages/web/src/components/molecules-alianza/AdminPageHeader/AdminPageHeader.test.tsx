import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdminPageHeader } from './AdminPageHeader';
import type { AdminPageHeaderProps } from './AdminPageHeader.types';
import { BreadcrumbNavigation } from '@/components/molecules-alianza/Breadcrumb';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Button } from '@/components/molecules-alianza/Button';
import { Home, Settings } from 'lucide-react';

describe('AdminPageHeader', () => {
  const defaultProps: AdminPageHeaderProps = {
    title: 'Test Page',
  };

  describe('Basic Rendering', () => {
    it('should render the title correctly', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

    it('should render title in h1 by default', () => {
      render(<AdminPageHeader {...defaultProps} />);
      const title = screen.getByTestId('admin-page-header-title');
      expect(title.tagName).toBe('H1');
    });

    it('should render with custom heading level', () => {
      render(<AdminPageHeader {...defaultProps} headingLevel={2} />);
      const title = screen.getByTestId('admin-page-header-title');
      expect(title.tagName).toBe('H2');
    });

    it('should render with h3 heading', () => {
      render(<AdminPageHeader {...defaultProps} headingLevel={3} />);
      const title = screen.getByTestId('admin-page-header-title');
      expect(title.tagName).toBe('H3');
    });

    it('should render with h4 heading', () => {
      render(<AdminPageHeader {...defaultProps} headingLevel={4} />);
      const title = screen.getByTestId('admin-page-header-title');
      expect(title.tagName).toBe('H4');
    });

    it('should render with h5 heading', () => {
      render(<AdminPageHeader {...defaultProps} headingLevel={5} />);
      const title = screen.getByTestId('admin-page-header-title');
      expect(title.tagName).toBe('H5');
    });

    it('should render with h6 heading', () => {
      render(<AdminPageHeader {...defaultProps} headingLevel={6} />);
      const title = screen.getByTestId('admin-page-header-title');
      expect(title.tagName).toBe('H6');
    });

    it('should render with data-testid', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(screen.getByTestId('admin-page-header')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = vi.fn();
      render(<AdminPageHeader {...defaultProps} ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Description', () => {
    it('should render string description when provided', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          description="This is a test description"
        />,
      );
      expect(screen.getByText('This is a test description')).toBeInTheDocument();
    });

    it('should render ReactNode description when provided', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          description={
            <span data-testid="custom-desc">Custom Description</span>
          }
        />,
      );
      expect(screen.getByTestId('custom-desc')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(
        screen.queryByTestId('admin-page-header-description'),
      ).not.toBeInTheDocument();
    });

    it('should render description with custom className', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          description="Test"
          descriptionClassName="custom-description"
        />,
      );
      const description = screen.getByTestId('admin-page-header-description');
      expect(description).toHaveClass('custom-description');
    });

    it('should render complex description content', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          description={
            <div>
              <strong>Important:</strong> This is a complex description
            </div>
          }
        />,
      );
      expect(screen.getByText('Important:')).toBeInTheDocument();
      expect(screen.getByText('This is a complex description')).toBeInTheDocument();
    });
  });

  describe('Back Navigation', () => {
    it('should render back link when backHref is provided', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          backHref="/dashboard"
          backLabel="Back to Dashboard"
        />,
      );
      const backLink = screen.getByRole('link', { name: /back to dashboard/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/dashboard');
    });

    it('should use default back label when not provided', () => {
      render(<AdminPageHeader {...defaultProps} backHref="/dashboard" />);
      expect(screen.getByRole('link', { name: /back/i })).toBeInTheDocument();
    });

    it('should not render back link when backHref is not provided', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(screen.queryByTestId('admin-page-header-back')).not.toBeInTheDocument();
    });

    it('should render ArrowLeft icon in back button', () => {
      const { container } = render(
        <AdminPageHeader {...defaultProps} backHref="/dashboard" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have hover styles on back button', () => {
      render(<AdminPageHeader {...defaultProps} backHref="/dashboard" />);
      const backLink = screen.getByTestId('admin-page-header-back');
      expect(backLink).toHaveClass('hover:text-foreground');
    });

    it('should have transition on back button', () => {
      render(<AdminPageHeader {...defaultProps} backHref="/dashboard" />);
      const backLink = screen.getByTestId('admin-page-header-back');
      expect(backLink).toHaveClass('transition-colors');
    });
  });

  describe('Actions', () => {
    it('should render actions when provided', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          actions={<button type="button">Action Button</button>}
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Action Button' }),
      ).toBeInTheDocument();
    });

    it('should render multiple actions', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          actions={
            <>
              <button type="button">Action 1</button>
              <button type="button">Action 2</button>
            </>
          }
        />,
      );
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
    });

    it('should not render actions when not provided', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(
        screen.queryByTestId('admin-page-header-actions'),
      ).not.toBeInTheDocument();
    });

    it('should render actions with custom className', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          actions={<button type="button">Action</button>}
          actionsClassName="custom-actions"
        />,
      );
      const actions = screen.getByTestId('admin-page-header-actions');
      expect(actions).toHaveClass('custom-actions');
    });

    it('should render Button component as action', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          actions={<Button>Create New</Button>}
        />,
      );
      expect(screen.getByRole('button', { name: 'Create New' })).toBeInTheDocument();
    });

    it('should render multiple Button components', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          actions={
            <>
              <Button>Primary</Button>
              <Button variant="outline">Secondary</Button>
            </>
          }
        />,
      );
      expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument();
    });
  });

  describe('Icon and Badge', () => {
    it('should render icon when provided', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          icon={<Home data-testid="home-icon" />}
        />,
      );
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('should render badge when provided', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          badge={<Badge>New</Badge>}
        />,
      );
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('should render both icon and badge', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          icon={<Home data-testid="home-icon" />}
          badge={<Badge>Beta</Badge>}
        />,
      );
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });

    it('should not render icon when not provided', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(
        screen.queryByTestId('admin-page-header-icon'),
      ).not.toBeInTheDocument();
    });

    it('should not render badge when not provided', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(
        screen.queryByTestId('admin-page-header-badge'),
      ).not.toBeInTheDocument();
    });

    it('should render custom icon component', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          icon={<Settings data-testid="settings-icon" />}
        />,
      );
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });
  });

  describe('Breadcrumbs', () => {
    it('should render breadcrumbs when provided', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          breadcrumbs={
            <BreadcrumbNavigation
              items={[
                { label: 'Home', href: '/' },
                { label: 'Users', href: '/users' },
                { label: 'Current', current: true },
              ]}
            />
          }
        />,
      );
      expect(screen.getByTestId('admin-page-header-breadcrumbs')).toBeInTheDocument();
    });

    it('should not render breadcrumbs when not provided', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(
        screen.queryByTestId('admin-page-header-breadcrumbs'),
      ).not.toBeInTheDocument();
    });

    it('should render custom breadcrumb content', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          breadcrumbs={<div data-testid="custom-breadcrumbs">Custom</div>}
        />,
      );
      expect(screen.getByTestId('custom-breadcrumbs')).toBeInTheDocument();
    });
  });

  describe('Children and Custom Content', () => {
    it('should render children when provided', () => {
      render(
        <AdminPageHeader {...defaultProps}>
          <div data-testid="child-content">Child Content</div>
        </AdminPageHeader>,
      );
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('should not render children when not provided', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(
        screen.queryByTestId('admin-page-header-children'),
      ).not.toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <AdminPageHeader {...defaultProps}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </AdminPageHeader>,
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <AdminPageHeader {...defaultProps}>
          <div className="tabs">
            <button type="button">Tab 1</button>
            <button type="button">Tab 2</button>
          </div>
        </AdminPageHeader>,
      );
      expect(screen.getByRole('button', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Tab 2' })).toBeInTheDocument();
    });
  });

  describe('Divider', () => {
    it('should render divider when showDivider is true', () => {
      render(<AdminPageHeader {...defaultProps} showDivider />);
      expect(screen.getByTestId('admin-page-header-divider')).toBeInTheDocument();
    });

    it('should not render divider by default', () => {
      render(<AdminPageHeader {...defaultProps} />);
      expect(
        screen.queryByTestId('admin-page-header-divider'),
      ).not.toBeInTheDocument();
    });

    it('should not render divider when showDivider is false', () => {
      render(<AdminPageHeader {...defaultProps} showDivider={false} />);
      expect(
        screen.queryByTestId('admin-page-header-divider'),
      ).not.toBeInTheDocument();
    });

    it('should have border styling on divider', () => {
      render(<AdminPageHeader {...defaultProps} showDivider />);
      const divider = screen.getByTestId('admin-page-header-divider');
      expect(divider).toHaveClass('border-t', 'border-border');
    });
  });

  describe('Loading State', () => {
    it('should render loading skeleton when loading is true', () => {
      const { container } = render(<AdminPageHeader {...defaultProps} loading />);
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should not render content when loading', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          loading
          description="Test description"
        />,
      );
      expect(screen.queryByText('Test Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    });

    it('should render skeleton for title', () => {
      const { container } = render(<AdminPageHeader {...defaultProps} loading />);
      const skeleton = container.querySelector('.h-8.w-64.bg-muted');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render skeleton for description when provided', () => {
      const { container } = render(
        <AdminPageHeader {...defaultProps} loading description="Test" />,
      );
      const skeleton = container.querySelector('.h-4.w-96.bg-muted');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render skeleton for back button when backHref provided', () => {
      const { container } = render(
        <AdminPageHeader {...defaultProps} loading backHref="/test" />,
      );
      const skeleton = container.querySelector('.h-4.w-16.bg-muted');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render skeleton for actions when provided', () => {
      const { container } = render(
        <AdminPageHeader
          {...defaultProps}
          loading
          actions={<button type="button">Action</button>}
        />,
      );
      const skeleton = container.querySelector('.h-10.w-32.bg-muted');
      expect(skeleton).toBeInTheDocument();
    });

    it('should not render loading state by default', () => {
      const { container } = render(<AdminPageHeader {...defaultProps} />);
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });

    it('should render divider skeleton when showDivider and loading', () => {
      const { container } = render(
        <AdminPageHeader {...defaultProps} loading showDivider />,
      );
      const divider = container.querySelector('.h-px.w-full.bg-border');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Styling and Classes', () => {
    it('should apply custom className to wrapper', () => {
      const { container } = render(
        <AdminPageHeader {...defaultProps} className="custom-wrapper" />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-wrapper');
    });

    it('should apply custom titleClassName', () => {
      render(
        <AdminPageHeader {...defaultProps} titleClassName="custom-title" />,
      );
      const title = screen.getByTestId('admin-page-header-title');
      expect(title).toHaveClass('custom-title');
    });

    it('should preserve default classes with custom className', () => {
      const { container } = render(
        <AdminPageHeader {...defaultProps} className="custom-class" />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('space-y-4', 'mb-8', 'custom-class');
    });

    it('should have responsive layout classes', () => {
      const { container } = render(<AdminPageHeader {...defaultProps} />);
      const layoutDiv = container.querySelector('.flex.flex-col.gap-4');
      expect(layoutDiv).toHaveClass('md:flex-row', 'md:items-start');
    });

    it('should have proper text sizing classes on title', () => {
      render(<AdminPageHeader {...defaultProps} />);
      const title = screen.getByTestId('admin-page-header-title');
      expect(title).toHaveClass('text-2xl', 'md:text-3xl');
    });

    it('should have proper text sizing classes on description', () => {
      render(<AdminPageHeader {...defaultProps} description="Test" />);
      const description = screen.getByTestId('admin-page-header-description');
      expect(description).toHaveClass('text-sm', 'md:text-base');
    });
  });

  describe('HTML Attributes', () => {
    it('should forward HTML attributes', () => {
      const { container } = render(
        <AdminPageHeader
          {...defaultProps}
          data-custom="custom-value"
          role="region"
        />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('data-custom', 'custom-value');
      expect(wrapper).toHaveAttribute('role', 'region');
    });

    it('should forward aria attributes', () => {
      const { container } = render(
        <AdminPageHeader
          {...defaultProps}
          aria-label="Page Header"
          aria-describedby="header-desc"
        />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('aria-label', 'Page Header');
      expect(wrapper).toHaveAttribute('aria-describedby', 'header-desc');
    });

    it('should forward id attribute', () => {
      const { container } = render(
        <AdminPageHeader {...defaultProps} id="custom-header" />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('id', 'custom-header');
    });

    it('should forward data-testid attribute', () => {
      render(<AdminPageHeader {...defaultProps} data-testid="custom-testid" />);
      expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title gracefully', () => {
      render(<AdminPageHeader title="" />);
      const title = screen.getByTestId('admin-page-header-title');
      expect(title).toBeInTheDocument();
      expect(title.textContent).toBe('');
    });

    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(200);
      render(<AdminPageHeader title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(500);
      render(<AdminPageHeader {...defaultProps} description={longDescription} />);
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      render(<AdminPageHeader title="Title with <special> & characters" />);
      expect(screen.getByText('Title with <special> & characters')).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      render(<AdminPageHeader {...defaultProps}>{null}</AdminPageHeader>);
      expect(
        screen.queryByTestId('admin-page-header-children'),
      ).not.toBeInTheDocument();
    });

    it('should handle undefined actions gracefully', () => {
      render(<AdminPageHeader {...defaultProps} actions={undefined} />);
      expect(
        screen.queryByTestId('admin-page-header-actions'),
      ).not.toBeInTheDocument();
    });

    it('should handle empty backLabel', () => {
      render(<AdminPageHeader {...defaultProps} backHref="/test" backLabel="" />);
      const backLink = screen.getByTestId('admin-page-header-back');
      expect(backLink).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should have mobile-first layout', () => {
      const { container } = render(<AdminPageHeader {...defaultProps} />);
      const layoutDiv = container.querySelector('.flex-col');
      expect(layoutDiv).toBeInTheDocument();
    });

    it('should apply desktop layout classes', () => {
      const { container } = render(<AdminPageHeader {...defaultProps} />);
      const layoutDiv = container.querySelector('.md\\:flex-row');
      expect(layoutDiv).toBeInTheDocument();
    });

    it('should have proper gap spacing', () => {
      const { container } = render(<AdminPageHeader {...defaultProps} />);
      const layoutDiv = container.querySelector('.gap-4');
      expect(layoutDiv).toBeInTheDocument();
    });

    it('should have flex-wrap on actions', () => {
      render(
        <AdminPageHeader
          {...defaultProps}
          actions={<button type="button">Action</button>}
        />,
      );
      const actions = screen.getByTestId('admin-page-header-actions');
      expect(actions).toHaveClass('flex-wrap');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<AdminPageHeader {...defaultProps} headingLevel={2} />);
      const title = screen.getByTestId('admin-page-header-title');
      expect(title.tagName).toBe('H2');
    });

    it('should have link with proper href', () => {
      render(<AdminPageHeader {...defaultProps} backHref="/dashboard" />);
      const link = screen.getByRole('link', { name: /back/i });
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('should support aria-label on wrapper', () => {
      render(<AdminPageHeader {...defaultProps} aria-label="Admin Header" />);
      const header = screen.getByLabelText('Admin Header');
      expect(header).toBeInTheDocument();
    });

    it('should maintain semantic HTML structure', () => {
      const { container } = render(
        <AdminPageHeader
          {...defaultProps}
          description="Test"
          backHref="/test"
        />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.tagName).toBe('DIV');
    });
  });
});
