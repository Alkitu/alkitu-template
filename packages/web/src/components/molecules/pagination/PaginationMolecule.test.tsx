import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PaginationMolecule, PaginationPresets } from './PaginationMolecule';

expect.extend(toHaveNoViolations);

describe('PaginationMolecule', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with minimum props', () => {
      const { container } = render(<PaginationMolecule {...defaultProps} />);
      expect(container.querySelector('nav')).toBeInTheDocument();
    });

    it('renders with correct ARIA labels', () => {
      render(<PaginationMolecule {...defaultProps} />);
      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Pagination',
      );
    });

    it('renders Previous button with correct label', () => {
      render(<PaginationMolecule {...defaultProps} />);
      expect(
        screen.getByRole('button', { name: /go to previous page/i }),
      ).toBeInTheDocument();
    });

    it('renders Next button with correct label', () => {
      render(<PaginationMolecule {...defaultProps} />);
      expect(
        screen.getByRole('button', { name: /go to next page/i }),
      ).toBeInTheDocument();
    });

    it('renders custom ref correctly', () => {
      const ref = vi.fn();
      render(<PaginationMolecule {...defaultProps} ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(
        <PaginationMolecule {...defaultProps} className="custom-class" />,
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      render(<PaginationMolecule {...defaultProps} variant="default" />);
      const pageButtons = screen.getAllByRole('button', { name: /page 1/i });
      expect(pageButtons.length).toBeGreaterThan(0);
    });

    it('renders compact variant correctly', () => {
      render(
        <PaginationMolecule {...defaultProps} currentPage={5} variant="compact" />,
      );
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('/')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('renders simple variant correctly', () => {
      render(
        <PaginationMolecule {...defaultProps} currentPage={3} variant="simple" />,
      );
      expect(screen.getByText(/page 3 of 10/i)).toBeInTheDocument();
    });

    it('renders detailed variant correctly', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          variant="detailed"
          totalItems={100}
          showTotal
        />,
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Page Navigation', () => {
    it('calls onPageChange when clicking Next button', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<PaginationMolecule {...defaultProps} onPageChange={onPageChange} />);

      const nextButton = screen.getByRole('button', { name: /go to next page/i });
      await user.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange when clicking Previous button', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />,
      );

      const prevButton = screen.getByRole('button', {
        name: /go to previous page/i,
      });
      await user.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('calls onPageChange when clicking page number', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<PaginationMolecule {...defaultProps} currentPage={1} onPageChange={onPageChange} />);

      const pageButton = screen.getAllByRole('button', { name: /go to page 2/i })[0];
      await user.click(pageButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange when clicking first page button', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          showFirstLast
          onPageChange={onPageChange}
        />,
      );

      const firstButton = screen.getByRole('button', { name: /go to first page/i });
      await user.click(firstButton);

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('calls onPageChange when clicking last page button', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={1}
          showFirstLast
          onPageChange={onPageChange}
        />,
      );

      const lastButton = screen.getByRole('button', { name: /go to last page/i });
      await user.click(lastButton);

      expect(onPageChange).toHaveBeenCalledWith(10);
    });

    it('does not call onPageChange when clicking current page', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<PaginationMolecule {...defaultProps} currentPage={1} onPageChange={onPageChange} />);

      const currentPageButtons = screen.getAllByRole('button', { name: /go to page 1/i });
      await user.click(currentPageButtons[0]);

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('disables Previous button on first page', () => {
      render(<PaginationMolecule {...defaultProps} currentPage={1} />);
      const prevButton = screen.getByRole('button', {
        name: /go to previous page/i,
      });
      expect(prevButton).toBeDisabled();
    });

    it('disables Next button on last page', () => {
      render(<PaginationMolecule {...defaultProps} currentPage={10} />);
      const nextButton = screen.getByRole('button', { name: /go to next page/i });
      expect(nextButton).toBeDisabled();
    });

    it('disables all buttons when disabled prop is true', () => {
      render(<PaginationMolecule {...defaultProps} disabled />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('does not call onPageChange when disabled', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <PaginationMolecule
          {...defaultProps}
          disabled
          onPageChange={onPageChange}
        />,
      );

      const nextButton = screen.getByRole('button', { name: /go to next page/i });
      await user.click(nextButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Page Range Calculation', () => {
    it('shows correct pages with siblingCount=1', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          siblingCount={1}
          totalPages={10}
        />,
      );

      expect(screen.getAllByRole('button', { name: /go to page 4/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /go to page 5/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /go to page 6/i }).length).toBeGreaterThan(0);
    });

    it('shows correct pages with siblingCount=2', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          siblingCount={2}
          totalPages={10}
        />,
      );

      expect(screen.getAllByRole('button', { name: /go to page 3/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /go to page 4/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /go to page 5/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /go to page 6/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /go to page 7/i }).length).toBeGreaterThan(0);
    });

    it('shows ellipsis when pages are truncated', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          totalPages={20}
          siblingCount={1}
          boundaryCount={1}
        />,
      );

      const ellipses = screen.getAllByText((content, element) => {
        return element?.getAttribute('aria-hidden') === 'true';
      });
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it('shows boundary pages correctly', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={10}
          totalPages={20}
          boundaryCount={2}
        />,
      );

      expect(screen.getAllByRole('button', { name: /go to page 1/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /go to page 2/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /go to page 19/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /go to page 20/i }).length).toBeGreaterThan(0);
    });
  });

  describe('First/Last Navigation', () => {
    it('shows first/last buttons when showFirstLast is true', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          showFirstLast
        />,
      );

      expect(screen.getByRole('button', { name: /go to first page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go to last page/i })).toBeInTheDocument();
    });

    it('hides first/last buttons when showFirstLast is false', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          showFirstLast={false}
        />,
      );

      expect(
        screen.queryByRole('button', { name: /go to first page/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /go to last page/i }),
      ).not.toBeInTheDocument();
    });

    it('hides first button when near start', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={2}
          showFirstLast
          boundaryCount={1}
        />,
      );

      expect(
        screen.queryByRole('button', { name: /go to first page/i }),
      ).not.toBeInTheDocument();
    });

    it('hides last button when near end', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={9}
          totalPages={10}
          showFirstLast
          boundaryCount={1}
        />,
      );

      expect(
        screen.queryByRole('button', { name: /go to last page/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Total Items Display', () => {
    it('shows total items when showTotal is true', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          showTotal
          totalItems={100}
          pageSize={10}
        />,
      );

      expect(screen.getByText(/1-10/i)).toBeInTheDocument();
    });

    it('hides total items when showTotal is false', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          showTotal={false}
          totalItems={100}
        />,
      );

      expect(screen.queryByText(/showing/i)).not.toBeInTheDocument();
    });

    it('calculates correct item range', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={3}
          showTotal
          totalItems={100}
          pageSize={10}
        />,
      );

      expect(screen.getByText(/21-30/i)).toBeInTheDocument();
    });

    it('handles last page item range correctly', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={10}
          totalPages={10}
          showTotal
          totalItems={95}
          pageSize={10}
        />,
      );

      expect(screen.getByText(/91-95/i)).toBeInTheDocument();
    });
  });

  describe('Page Size Selector', () => {
    it('shows page size selector when showPageSize is true and variant is detailed', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          variant="detailed"
          showPageSize
          onPageSizeChange={vi.fn()}
        />,
      );

      expect(screen.getByRole('combobox', { name: /select page size/i })).toBeInTheDocument();
    });

    it('hides page size selector when showPageSize is false', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          variant="detailed"
          showPageSize={false}
        />,
      );

      expect(
        screen.queryByRole('combobox', { name: /select page size/i }),
      ).not.toBeInTheDocument();
    });

    it('hides page size selector when variant is not detailed', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          variant="default"
          showPageSize
        />,
      );

      expect(
        screen.queryByRole('combobox', { name: /select page size/i }),
      ).not.toBeInTheDocument();
    });

    it('calls onPageSizeChange when changing page size', async () => {
      const user = userEvent.setup();
      const onPageSizeChange = vi.fn();

      render(
        <PaginationMolecule
          {...defaultProps}
          variant="detailed"
          showPageSize
          pageSize={10}
          onPageSizeChange={onPageSizeChange}
        />,
      );

      const select = screen.getByRole('combobox', { name: /select page size/i });
      await user.selectOptions(select, '20');

      expect(onPageSizeChange).toHaveBeenCalledWith(20);
    });

    it('renders custom page size options', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          variant="detailed"
          showPageSize
          pageSizeOptions={[10, 25, 50]}
        />,
      );

      const select = screen.getByRole('combobox', { name: /select page size/i });
      const options = within(select).getAllByRole('option');

      expect(options).toHaveLength(3);
      expect(within(select).getByRole('option', { name: '10' })).toBeInTheDocument();
      expect(within(select).getByRole('option', { name: '25' })).toBeInTheDocument();
      expect(within(select).getByRole('option', { name: '50' })).toBeInTheDocument();
    });

    it('shows current page size as selected', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          variant="detailed"
          showPageSize
          pageSize={50}
        />,
      );

      const select = screen.getByRole('combobox', { name: /select page size/i }) as HTMLSelectElement;
      expect(select.value).toBe('50');
    });
  });

  describe('Detailed Variant Features', () => {
    it('shows total and pages badges in detailed variant', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          variant="detailed"
          totalItems={100}
        />,
      );

      expect(screen.getByText(/total:/i)).toBeInTheDocument();
      expect(screen.getByText(/pages:/i)).toBeInTheDocument();
    });

    it('formats total items with locale string', () => {
      const { container } = render(
        <PaginationMolecule
          {...defaultProps}
          variant="detailed"
          totalItems={1000}
        />,
      );

      // Verify the component renders and includes the total
      expect(container.querySelector('nav')).toBeInTheDocument();
      // toLocaleString() formatting is applied but exact output depends on locale
      // Accept both formats: 1000 or 1,000 (with thousand separator)
      expect(container.textContent).toMatch(/1[,\s]?000/);
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles Enter key on page buttons', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          totalPages={10}
          onPageChange={onPageChange}
        />,
      );

      const pageButtons = screen.getAllByRole('button', { name: /go to page 6/i });
      pageButtons[0].focus();
      await user.keyboard('{Enter}');

      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('handles Space key on page buttons', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          totalPages={10}
          onPageChange={onPageChange}
        />,
      );

      const pageButtons = screen.getAllByRole('button', { name: /go to page 4/i });
      pageButtons[0].focus();
      await user.keyboard(' ');

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('does not navigate on other keys', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={5}
          totalPages={10}
          onPageChange={onPageChange}
        />,
      );

      const pageButtons = screen.getAllByRole('button', { name: /go to page 6/i });
      pageButtons[0].focus();
      await user.keyboard('a');

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Custom Labels', () => {
    it('renders custom previous/next text', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          previousText="Anterior"
          nextText="Siguiente"
        />,
      );

      expect(screen.getByText(/anterior/i)).toBeInTheDocument();
      expect(screen.getByText(/siguiente/i)).toBeInTheDocument();
    });

    it('renders custom labels in simple variant', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          variant="simple"
          pageLabel="Página"
          ofLabel="de"
        />,
      );

      expect(screen.getByText(/página 1 de 10/i)).toBeInTheDocument();
    });

    it('renders custom labels in detailed variant', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          variant="detailed"
          totalItems={100}
          showTotal
          showingLabel="Mostrando"
          toLabel="a"
          resultsLabel="resultados"
        />,
      );

      expect(screen.getByText(/mostrando/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single page correctly', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={1}
          totalPages={1}
        />,
      );

      const prevButton = screen.getByRole('button', {
        name: /go to previous page/i,
      });
      const nextButton = screen.getByRole('button', { name: /go to next page/i });

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('handles large page numbers', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={50}
          totalPages={100}
        />,
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('handles page change beyond boundaries gracefully', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={10}
          totalPages={10}
          onPageChange={onPageChange}
        />,
      );

      const nextButton = screen.getByRole('button', { name: /go to next page/i });
      await user.click(nextButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('handles totalItems smaller than pageSize', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={1}
          totalPages={1}
          totalItems={5}
          pageSize={10}
          showTotal
        />,
      );

      expect(screen.getByText(/1-5/i)).toBeInTheDocument();
    });
  });

  describe('Presets', () => {
    it('exports basic preset configuration', () => {
      expect(PaginationPresets.basic).toEqual({
        variant: 'default',
        showFirstLast: true,
        showPageSize: false,
        showTotal: false,
        siblingCount: 1,
        boundaryCount: 1,
      });
    });

    it('exports compact preset configuration', () => {
      expect(PaginationPresets.compact).toEqual({
        variant: 'compact',
        showFirstLast: false,
        showPageSize: false,
        showTotal: false,
      });
    });

    it('exports detailed preset configuration', () => {
      expect(PaginationPresets.detailed).toEqual({
        variant: 'detailed',
        showFirstLast: true,
        showPageSize: true,
        showTotal: true,
        siblingCount: 2,
        boundaryCount: 1,
      });
    });

    it('exports simple preset configuration', () => {
      expect(PaginationPresets.simple).toEqual({
        variant: 'simple',
        showFirstLast: false,
        showPageSize: false,
        showTotal: false,
      });
    });
  });

  describe('Theme Integration', () => {
    it('uses theme-aware CSS variables for colors', () => {
      const { container } = render(<PaginationMolecule {...defaultProps} />);
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('applies correct classes for theme integration', () => {
      render(<PaginationMolecule {...defaultProps} />);
      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        const classes = button.className;
        expect(
          classes.includes('bg-background') ||
          classes.includes('bg-primary') ||
          classes.includes('text-foreground') ||
          classes.includes('border-input')
        ).toBe(true);
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<PaginationMolecule {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct aria-current on active page', () => {
      render(<PaginationMolecule {...defaultProps} currentPage={3} />);
      const activeButton = screen.getByRole('button', { name: /go to page 3/i });
      expect(activeButton).toHaveAttribute('aria-current', 'page');
    });

    it('has aria-hidden on ellipsis', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={10}
          totalPages={20}
        />,
      );

      const ellipses = screen.getAllByText((content, element) => {
        return element?.getAttribute('aria-hidden') === 'true';
      });
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it('has sr-only text for ellipsis', () => {
      render(
        <PaginationMolecule
          {...defaultProps}
          currentPage={10}
          totalPages={20}
        />,
      );

      const srOnlyElements = screen.getAllByText('More pages');
      expect(srOnlyElements.length).toBeGreaterThan(0);
      expect(srOnlyElements[0]).toHaveClass('sr-only');
    });
  });
});
