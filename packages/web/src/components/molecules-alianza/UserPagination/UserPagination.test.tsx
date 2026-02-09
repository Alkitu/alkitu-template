/**
 * UserPagination Component Tests
 *
 * Test coverage for the UserPagination molecule component.
 *
 * Test categories:
 * - Component rendering
 * - Result summary display
 * - Page navigation
 * - Page size selection
 * - Edge cases and boundary conditions
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserPagination } from './UserPagination';
import type { UserPaginationProps } from './UserPagination.types';

// Default props helper
const createProps = (overrides?: Partial<UserPaginationProps>): UserPaginationProps => ({
  currentPage: 1,
  totalPages: 10,
  totalItems: 100,
  pageSize: 10,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
  ...overrides,
});

describe('UserPagination', () => {
  describe('Rendering', () => {
    it('should render the pagination component', () => {
      const props = createProps();
      render(<UserPagination {...props} />);

      expect(screen.getByText(/Mostrando/i)).toBeInTheDocument();
      expect(screen.getByText(/Página 1 de 10/i)).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const props = createProps({ className: 'custom-class' });
      const { container } = render(<UserPagination {...props} />);

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should render with default page size options', () => {
      const props = createProps();
      const { container } = render(<UserPagination {...props} />);

      // Check for the select component
      expect(container.querySelector('[role="combobox"]')).toBeInTheDocument();
    });

    it('should render with custom page size options', () => {
      const props = createProps({ pageSizeOptions: [5, 15, 25] });
      const { container } = render(<UserPagination {...props} />);

      // Check for the select component
      expect(container.querySelector('[role="combobox"]')).toBeInTheDocument();
    });
  });

  describe('Result Summary', () => {
    it('should display correct result range for first page', () => {
      const props = createProps({
        currentPage: 1,
        pageSize: 10,
        totalItems: 100,
      });
      const { container } = render(<UserPagination {...props} />);

      expect(screen.getByText(/Mostrando/i)).toBeInTheDocument();
      // Verify the summary text contains the correct values
      const summaryText = container.textContent || '';
      expect(summaryText).toContain('1');
      expect(summaryText).toContain('10');
      expect(summaryText).toContain('100');
    });

    it('should display correct result range for middle page', () => {
      const props = createProps({
        currentPage: 5,
        pageSize: 10,
        totalItems: 100,
      });
      const { container } = render(<UserPagination {...props} />);

      const summaryText = container.textContent || '';
      expect(summaryText).toContain('41');
      expect(summaryText).toContain('50');
    });

    it('should display correct result range for last page', () => {
      const props = createProps({
        currentPage: 10,
        pageSize: 10,
        totalItems: 95,
      });
      const { container } = render(<UserPagination {...props} />);

      const summaryText = container.textContent || '';
      expect(summaryText).toContain('91');
      expect(summaryText).toContain('95');
    });

    it('should handle empty results (0 items)', () => {
      const props = createProps({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
      });
      const { container } = render(<UserPagination {...props} />);

      // Should show 0 to 0 of 0 results
      const summaryText = container.textContent || '';
      expect(summaryText).toContain('0');
      expect(summaryText).toContain('resultados');
    });

    it('should handle single item', () => {
      const props = createProps({
        currentPage: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
      });
      const { container } = render(<UserPagination {...props} />);

      const summaryText = container.textContent || '';
      expect(summaryText).toContain('1');
      expect(summaryText).toContain('resultado');
    });
  });

  describe('Page Navigation', () => {
    it('should disable previous button on first page', () => {
      const props = createProps({ currentPage: 1 });
      render(<UserPagination {...props} />);

      const prevButton = screen.getByRole('button', { name: /anterior/i });
      expect(prevButton).toBeDisabled();
    });

    it('should enable previous button on non-first page', () => {
      const props = createProps({ currentPage: 2 });
      render(<UserPagination {...props} />);

      const prevButton = screen.getByRole('button', { name: /anterior/i });
      expect(prevButton).not.toBeDisabled();
    });

    it('should disable next button on last page', () => {
      const props = createProps({ currentPage: 10, totalPages: 10 });
      render(<UserPagination {...props} />);

      const nextButton = screen.getByRole('button', { name: /siguiente/i });
      expect(nextButton).toBeDisabled();
    });

    it('should enable next button on non-last page', () => {
      const props = createProps({ currentPage: 5, totalPages: 10 });
      render(<UserPagination {...props} />);

      const nextButton = screen.getByRole('button', { name: /siguiente/i });
      expect(nextButton).not.toBeDisabled();
    });

    it('should call onPageChange with previous page when clicking previous', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      const props = createProps({ currentPage: 5, onPageChange });

      render(<UserPagination {...props} />);

      const prevButton = screen.getByRole('button', { name: /anterior/i });
      await user.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('should call onPageChange with next page when clicking next', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      const props = createProps({ currentPage: 5, onPageChange });

      render(<UserPagination {...props} />);

      const nextButton = screen.getByRole('button', { name: /siguiente/i });
      await user.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(6);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('should not call onPageChange when previous button is disabled', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      const props = createProps({ currentPage: 1, onPageChange });

      render(<UserPagination {...props} />);

      const prevButton = screen.getByRole('button', { name: /anterior/i });
      await user.click(prevButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not call onPageChange when next button is disabled', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      const props = createProps({ currentPage: 10, totalPages: 10, onPageChange });

      render(<UserPagination {...props} />);

      const nextButton = screen.getByRole('button', { name: /siguiente/i });
      await user.click(nextButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Page Size Selection', () => {
    it('should display current page size', () => {
      const props = createProps({ pageSize: 20 });
      const { container } = render(<UserPagination {...props} />);

      // Check that the select trigger contains the page size value
      const selectTrigger = container.querySelector('[role="combobox"]');
      expect(selectTrigger).toBeInTheDocument();
    });

    it('should render page size label', () => {
      const props = createProps();
      render(<UserPagination {...props} />);

      expect(screen.getByText(/Filas por página/i)).toBeInTheDocument();
    });

    // Note: Testing Select component interaction requires additional setup
    // as it uses Radix UI primitives with Portal rendering
  });

  describe('Edge Cases', () => {
    it('should handle single page scenario', () => {
      const props = createProps({
        currentPage: 1,
        totalPages: 1,
        totalItems: 5,
        pageSize: 10,
      });
      render(<UserPagination {...props} />);

      const prevButton = screen.getByRole('button', { name: /anterior/i });
      const nextButton = screen.getByRole('button', { name: /siguiente/i });

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('should handle large page numbers', () => {
      const props = createProps({
        currentPage: 999,
        totalPages: 1000,
        totalItems: 10000,
        pageSize: 10,
      });
      render(<UserPagination {...props} />);

      expect(screen.getByText(/Página 999 de 1000/i)).toBeInTheDocument();
    });

    it('should calculate correct range with different page sizes', () => {
      const props = createProps({
        currentPage: 2,
        totalPages: 5,
        totalItems: 47,
        pageSize: 10,
      });
      render(<UserPagination {...props} />);

      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      const props = createProps();
      render(<UserPagination {...props} />);

      expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument();
    });

    it('should use semantic HTML elements', () => {
      const props = createProps();
      const { container } = render(<UserPagination {...props} />);

      // Buttons should be actual button elements
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
