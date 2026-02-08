import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdminPageHeader } from './AdminPageHeader';
import type { AdminPageHeaderProps } from './AdminPageHeader.types';

describe('AdminPageHeader', () => {
  const defaultProps: AdminPageHeaderProps = {
    title: 'Test Page',
  };

  it('should render the title correctly', () => {
    render(<AdminPageHeader {...defaultProps} />);
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(
      <AdminPageHeader
        {...defaultProps}
        description="This is a test description"
      />
    );
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('should render ReactNode description when provided', () => {
    render(
      <AdminPageHeader
        {...defaultProps}
        description={<span data-testid="custom-desc">Custom Description</span>}
      />
    );
    expect(screen.getByTestId('custom-desc')).toBeInTheDocument();
  });

  it('should render back link when backHref is provided', () => {
    render(
      <AdminPageHeader
        {...defaultProps}
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />
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
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render actions when provided', () => {
    render(
      <AdminPageHeader
        {...defaultProps}
        actions={<button type="button">Action Button</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(
      <AdminPageHeader {...defaultProps}>
        <div data-testid="child-content">Child Content</div>
      </AdminPageHeader>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <AdminPageHeader {...defaultProps} className="custom-class" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should forward HTML attributes', () => {
    const { container } = render(
      <AdminPageHeader
        {...defaultProps}
        data-testid="header-wrapper"
        role="banner"
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-testid', 'header-wrapper');
    expect(wrapper).toHaveAttribute('role', 'banner');
  });
});
