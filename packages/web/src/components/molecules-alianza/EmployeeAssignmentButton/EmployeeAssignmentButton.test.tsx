import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EmployeeAssignmentButton } from './EmployeeAssignmentButton';
import type { Employee } from './EmployeeAssignmentButton.types';

expect.extend(toHaveNoViolations);

describe('EmployeeAssignmentButton - Molecule', () => {
  describe('Basic Rendering', () => {
    it('renders correctly', () => {
      render(<EmployeeAssignmentButton />);
      expect(screen.getByTestId('employee-assignment-button')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(EmployeeAssignmentButton.displayName).toBe('EmployeeAssignmentButton');
    });

    it('renders with default options', () => {
      render(<EmployeeAssignmentButton />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toBeInTheDocument();
    });

    it('renders as button element', () => {
      render(<EmployeeAssignmentButton />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('has correct data-testid', () => {
      render(<EmployeeAssignmentButton data-testid="custom-test-id" />);
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });
  });

  describe('Unassigned State', () => {
    it('shows unassigned text when no employee assigned', () => {
      render(<EmployeeAssignmentButton />);
      expect(screen.getByText('Asignar Employee')).toBeInTheDocument();
    });

    it('shows custom placeholder when provided', () => {
      render(<EmployeeAssignmentButton placeholder="Seleccionar empleado" />);
      expect(screen.getByText('Seleccionar empleado')).toBeInTheDocument();
    });

    it('shows user icon in unassigned state', () => {
      const { container } = render(<EmployeeAssignmentButton />);
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
      // User icon has viewBox "0 0 10 12"
      const userIcon = Array.from(svgs).find(svg => svg.getAttribute('viewBox') === '0 0 10 12');
      expect(userIcon).toBeInTheDocument();
    });

    it('shows chevron icon in unassigned state', () => {
      const { container } = render(<EmployeeAssignmentButton />);
      const svgs = container.querySelectorAll('svg');
      // Chevron icon has viewBox "0 0 14 8"
      const chevronIcon = Array.from(svgs).find(svg => svg.getAttribute('viewBox') === '0 0 14 8');
      expect(chevronIcon).toBeInTheDocument();
    });

    it('has primary background in unassigned state', () => {
      render(<EmployeeAssignmentButton />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveClass('bg-primary-1');
    });

    it('has correct aria-label in unassigned state', () => {
      render(<EmployeeAssignmentButton />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveAttribute('aria-label', 'Asignar Employee');
    });
  });

  describe('Assigned State', () => {
    it('shows assigned employee name', () => {
      render(<EmployeeAssignmentButton defaultAssigned="John Doe" />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('shows "Asignado a" prefix when assigned', () => {
      render(<EmployeeAssignmentButton defaultAssigned="Jane Smith" />);
      expect(screen.getByText(/Asignado a/)).toBeInTheDocument();
    });

    it('does not show user icon when assigned', () => {
      const { container } = render(<EmployeeAssignmentButton defaultAssigned="John Doe" />);
      const svgs = container.querySelectorAll('svg');
      // User icon has viewBox "0 0 10 12" - should not be present
      const userIcon = Array.from(svgs).find(svg => svg.getAttribute('viewBox') === '0 0 10 12');
      expect(userIcon).toBeUndefined();
    });

    it('still shows chevron icon when assigned', () => {
      const { container } = render(<EmployeeAssignmentButton defaultAssigned="John Doe" />);
      const svgs = container.querySelectorAll('svg');
      // Chevron icon has viewBox "0 0 14 8"
      const chevronIcon = Array.from(svgs).find(svg => svg.getAttribute('viewBox') === '0 0 14 8');
      expect(chevronIcon).toBeInTheDocument();
    });

    it('has transparent background when assigned', () => {
      render(<EmployeeAssignmentButton defaultAssigned="John Doe" />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveClass('bg-transparent');
    });

    it('has correct aria-label when assigned', () => {
      render(<EmployeeAssignmentButton defaultAssigned="John Doe" />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveAttribute('aria-label', 'Asignado a John Doe');
    });
  });

  describe('Button Click and Dropdown', () => {
    it('opens dropdown when button clicked', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('employee-dropdown')).toBeInTheDocument();
      });
    });

    it('closes dropdown when button clicked again', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton />);

      const button = screen.getByTestId('employee-assignment-button');

      await user.click(button);
      await waitFor(() => {
        expect(screen.getByTestId('employee-dropdown')).toBeInTheDocument();
      });

      // Use keyboard to close (Escape key) as Radix blocks pointer events on body when open
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByTestId('employee-dropdown')).not.toBeInTheDocument();
      });
    });

    it('rotates chevron icon when dropdown opens', async () => {
      const user = userEvent.setup();
      const { container } = render(<EmployeeAssignmentButton />);

      const button = screen.getByTestId('employee-assignment-button');

      // Before opening, chevron should not be rotated
      let chevronContainer = button.querySelector('[class*="transition-transform"]');
      expect(chevronContainer?.className.includes('rotate-180')).toBe(false);

      await user.click(button);

      await waitFor(() => {
        chevronContainer = button.querySelector('[class*="transition-transform"]');
        expect(chevronContainer?.className.includes('rotate-180')).toBe(true);
      });
    });
  });

  describe('Employee List Display', () => {
    it('displays default employee options', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('employee-option-Alejandro G.')).toBeInTheDocument();
        expect(screen.getByTestId('employee-option-Maria P.')).toBeInTheDocument();
        expect(screen.getByTestId('employee-option-Juan R.')).toBeInTheDocument();
        expect(screen.getByTestId('employee-option-Sofia L.')).toBeInTheDocument();
      });
    });

    it('displays custom employee options', async () => {
      const user = userEvent.setup();
      const options = ['Alice', 'Bob', 'Charlie'];
      render(<EmployeeAssignmentButton options={options} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('employee-option-Alice')).toBeInTheDocument();
        expect(screen.getByTestId('employee-option-Bob')).toBeInTheDocument();
        expect(screen.getByTestId('employee-option-Charlie')).toBeInTheDocument();
      });
    });

    it('displays all employee options in dropdown', async () => {
      const user = userEvent.setup();
      const options = ['Employee 1', 'Employee 2'];
      render(<EmployeeAssignmentButton options={options} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        options.forEach(option => {
          expect(screen.getByText(option)).toBeInTheDocument();
        });
      });
    });

    it('highlights currently assigned employee in dropdown', async () => {
      const user = userEvent.setup();
      const options = ['Alice', 'Bob', 'Charlie'];
      render(<EmployeeAssignmentButton options={options} defaultAssigned="Bob" />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        const bobOption = screen.getByTestId('employee-option-Bob');
        expect(bobOption).toHaveClass('bg-accent-a');
      });
    });
  });

  describe('Employee Selection', () => {
    it('selects employee when clicked', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton options={['Alice', 'Bob']} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('employee-option-Alice')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('employee-option-Alice'));

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });
    });

    it('closes dropdown after selection', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton options={['Alice', 'Bob']} />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.click(screen.getByTestId('employee-option-Alice'));

      await waitFor(() => {
        expect(screen.queryByTestId('employee-dropdown')).not.toBeInTheDocument();
      });
    });

    it('updates button text after selection', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton options={['Alice', 'Bob']} />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.click(screen.getByTestId('employee-option-Alice'));

      await waitFor(() => {
        expect(screen.getByText(/Asignado a/)).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });
    });
  });

  describe('Assignment Callback (onAssign)', () => {
    it('calls onAssign when employee selected', async () => {
      const user = userEvent.setup();
      const onAssign = vi.fn();
      render(<EmployeeAssignmentButton options={['Alice']} onAssign={onAssign} />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.click(screen.getByTestId('employee-option-Alice'));

      await waitFor(() => {
        expect(onAssign).toHaveBeenCalledWith('Alice');
      });
    });

    it('calls onAssign with correct employee name', async () => {
      const user = userEvent.setup();
      const onAssign = vi.fn();
      render(<EmployeeAssignmentButton options={['Bob', 'Charlie']} onAssign={onAssign} />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.click(screen.getByTestId('employee-option-Charlie'));

      await waitFor(() => {
        expect(onAssign).toHaveBeenCalledWith('Charlie');
        expect(onAssign).toHaveBeenCalledTimes(1);
      });
    });

    it('does not call onAssign when no callback provided', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton options={['Alice']} />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.click(screen.getByTestId('employee-option-Alice'));

      // Should not throw error
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });
    });
  });

  describe('Unassign Functionality', () => {
    it('shows unassign button when employee assigned', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton defaultAssigned="Alice" />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('unassign-button')).toBeInTheDocument();
      });
    });

    it('does not show unassign button when no employee assigned', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.queryByTestId('unassign-button')).not.toBeInTheDocument();
      });
    });

    it('unassigns employee when unassign button clicked', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton defaultAssigned="Alice" />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.click(screen.getByTestId('unassign-button'));

      await waitFor(() => {
        expect(screen.getByText('Asignar Employee')).toBeInTheDocument();
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
      });
    });

    it('calls onAssign with null when unassigned', async () => {
      const user = userEvent.setup();
      const onAssign = vi.fn();
      render(<EmployeeAssignmentButton defaultAssigned="Alice" onAssign={onAssign} />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.click(screen.getByTestId('unassign-button'));

      await waitFor(() => {
        expect(onAssign).toHaveBeenCalledWith(null);
      });
    });

    it('shows user icon after unassignment', async () => {
      const user = userEvent.setup();
      const { container } = render(<EmployeeAssignmentButton defaultAssigned="Alice" />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.click(screen.getByTestId('unassign-button'));

      await waitFor(() => {
        const svgs = container.querySelectorAll('svg');
        const userIcon = Array.from(svgs).find(svg => svg.getAttribute('viewBox') === '0 0 10 12');
        expect(userIcon).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('shows loading text when isLoading=true', () => {
      render(<EmployeeAssignmentButton isLoading />);
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('has loading opacity when isLoading=true', () => {
      render(<EmployeeAssignmentButton isLoading />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveClass('opacity-70');
    });

    it('has cursor-wait when isLoading=true', () => {
      render(<EmployeeAssignmentButton isLoading />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveClass('cursor-wait');
    });

    it('does not show icons when loading', () => {
      const { container } = render(<EmployeeAssignmentButton isLoading />);
      // No SVG icons should be present when loading
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBe(0);
    });

    it('can still be clicked when loading (for cancel)', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton isLoading />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      // Should not crash
    });
  });

  describe('Error State', () => {
    it('shows error message in dropdown', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton error="No se pudieron cargar los empleados" />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByText('No se pudieron cargar los empleados')).toBeInTheDocument();
      });
    });

    it('does not show employee options when error present', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton error="Error" options={['Alice', 'Bob']} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.queryByTestId('employee-option-Alice')).not.toBeInTheDocument();
        expect(screen.queryByTestId('employee-option-Bob')).not.toBeInTheDocument();
      });
    });

    it('error message has destructive styling', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton error="Error occurred" />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        const errorMsg = screen.getByTestId('error-message');
        expect(errorMsg).toHaveClass('text-destructive');
      });
    });
  });

  describe('Disabled State', () => {
    it('is disabled when disabled=true', () => {
      render(<EmployeeAssignmentButton disabled />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toBeDisabled();
    });

    it('has disabled opacity when disabled=true', () => {
      render(<EmployeeAssignmentButton disabled />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveClass('opacity-50');
    });

    it('has cursor-not-allowed when disabled', () => {
      render(<EmployeeAssignmentButton disabled />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveClass('cursor-not-allowed');
    });

    it('does not open dropdown when disabled', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton disabled />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      expect(screen.queryByTestId('employee-dropdown')).not.toBeInTheDocument();
    });

    it('does not call onAssign when disabled', async () => {
      const user = userEvent.setup();
      const onAssign = vi.fn();
      render(<EmployeeAssignmentButton disabled onAssign={onAssign} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      expect(onAssign).not.toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no options provided', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton options={[]} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        expect(screen.getByText('No hay empleados disponibles')).toBeInTheDocument();
      });
    });

    it('empty state has muted styling', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton options={[]} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        const emptyState = screen.getByTestId('empty-state');
        expect(emptyState).toHaveClass('text-muted-foreground');
      });
    });
  });

  describe('Search Functionality', () => {
    it('shows search input when searchable=true', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton searchable />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });
    });

    it('does not show search input when searchable=false', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton searchable={false} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
      });
    });

    it('filters employees based on search term', async () => {
      const user = userEvent.setup();
      const options = ['Alice Anderson', 'Bob Brown', 'Charlie Chaplin'];
      render(<EmployeeAssignmentButton options={options} searchable />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });

      await user.type(screen.getByTestId('search-input'), 'Bob');

      await waitFor(() => {
        expect(screen.getByTestId('employee-option-Bob Brown')).toBeInTheDocument();
        expect(screen.queryByTestId('employee-option-Alice Anderson')).not.toBeInTheDocument();
        expect(screen.queryByTestId('employee-option-Charlie Chaplin')).not.toBeInTheDocument();
      });
    });

    it('search is case insensitive', async () => {
      const user = userEvent.setup();
      const options = ['Alice Anderson'];
      render(<EmployeeAssignmentButton options={options} searchable />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.type(screen.getByTestId('search-input'), 'alice');

      await waitFor(() => {
        expect(screen.getByTestId('employee-option-Alice Anderson')).toBeInTheDocument();
      });
    });

    it('shows no results message when search yields no matches', async () => {
      const user = userEvent.setup();
      const options = ['Alice', 'Bob'];
      render(<EmployeeAssignmentButton options={options} searchable />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.type(screen.getByTestId('search-input'), 'xyz');

      await waitFor(() => {
        expect(screen.getByTestId('no-results')).toBeInTheDocument();
        expect(screen.getByText('No se encontraron empleados')).toBeInTheDocument();
      });
    });

    it('clears search term after selection', async () => {
      const user = userEvent.setup();
      const options = ['Alice', 'Bob'];
      render(<EmployeeAssignmentButton options={options} searchable />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
      await user.type(searchInput, 'Alice');

      await user.click(screen.getByTestId('employee-option-Alice'));

      // Reopen dropdown
      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        const newSearchInput = screen.getByTestId('search-input') as HTMLInputElement;
        expect(newSearchInput.value).toBe('');
      });
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<EmployeeAssignmentButton className="custom-class" />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      render(<EmployeeAssignmentButton className="custom-class" />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('rounded-[var(--radius-md)]');
    });
  });

  describe('Edge Cases', () => {
    it('handles very long employee names', async () => {
      const user = userEvent.setup();
      const longName = 'Very Long Employee Name That Should Not Break Layout';
      render(<EmployeeAssignmentButton options={[longName]} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId(`employee-option-${longName}`)).toBeInTheDocument();
      });
    });

    it('handles special characters in names', async () => {
      const user = userEvent.setup();
      const specialName = "O'Brien-Smith";
      render(<EmployeeAssignmentButton options={[specialName]} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByText(specialName)).toBeInTheDocument();
      });
    });

    it('handles empty string employee name', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton options={['', 'Bob']} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('employee-option-')).toBeInTheDocument();
      });
    });

    it('handles single employee option', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton options={['Only One']} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('employee-option-Only One')).toBeInTheDocument();
      });
    });

    it('handles changing defaultAssigned prop', () => {
      const { rerender } = render(<EmployeeAssignmentButton defaultAssigned="Alice" />);
      expect(screen.getByText('Alice')).toBeInTheDocument();

      rerender(<EmployeeAssignmentButton defaultAssigned="Bob" />);
      // Component uses internal state, so defaultAssigned change won't update
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations in unassigned state', async () => {
      const { container } = render(<EmployeeAssignmentButton />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in assigned state', async () => {
      const { container } = render(<EmployeeAssignmentButton defaultAssigned="Alice" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with dropdown open', async () => {
      const user = userEvent.setup();
      const { container } = render(<EmployeeAssignmentButton />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(async () => {
        expect(screen.getByTestId('employee-dropdown')).toBeInTheDocument();
        // Exclude Radix focus guards which trigger false positives in axe
        const results = await axe(container, {
          rules: {
            'aria-hidden-focus': { enabled: false },
          },
        });
        expect(results).toHaveNoViolations();
      });
    });

    it('button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton />);

      const button = screen.getByTestId('employee-assignment-button');
      button.focus();

      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTestId('employee-dropdown')).toBeInTheDocument();
      });
    });

    it('has proper aria-label', () => {
      render(<EmployeeAssignmentButton />);
      const button = screen.getByTestId('employee-assignment-button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('unassign button is accessible', async () => {
      const user = userEvent.setup();
      render(<EmployeeAssignmentButton defaultAssigned="Alice" />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        const unassignButton = screen.getByTestId('unassign-button');
        expect(unassignButton).toBeInTheDocument();
        expect(unassignButton.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Employee Object Support', () => {
    it('handles Employee objects with name property', async () => {
      const user = userEvent.setup();
      const employees: Employee[] = [
        { id: '1', name: 'Alice Johnson' },
        { id: '2', name: 'Bob Smith' },
      ];
      render(<EmployeeAssignmentButton options={employees} />);

      await user.click(screen.getByTestId('employee-assignment-button'));

      await waitFor(() => {
        expect(screen.getByTestId('employee-option-Alice Johnson')).toBeInTheDocument();
        expect(screen.getByTestId('employee-option-Bob Smith')).toBeInTheDocument();
      });
    });

    it('selects employee by name from Employee object', async () => {
      const user = userEvent.setup();
      const onAssign = vi.fn();
      const employees: Employee[] = [
        { id: '1', name: 'Alice Johnson' },
      ];
      render(<EmployeeAssignmentButton options={employees} onAssign={onAssign} />);

      await user.click(screen.getByTestId('employee-assignment-button'));
      await user.click(screen.getByTestId('employee-option-Alice Johnson'));

      await waitFor(() => {
        expect(onAssign).toHaveBeenCalledWith('Alice Johnson');
      });
    });
  });
});
